'use strict'

app
  .factory('parseTSV', [function () {
    return function (file, options, verbose) {
      var _file = file
      var options = options

      var json = Papa.parse(_file, options)

      return verbose ? json : json.data
    }
  }])

app.directive('thumbnail', [function () {
  return {
    restrict: 'E',
    scope: {document: '@'},
    template: '<img class="img img-thumbnail img-shadow img-hover"/>',
    link: function ($scope, $element, $attr, $ctrl) {
      PDFJS.workerSrc = '/llp_core/bower_components/pdfjs-dist/build/pdf.worker.js';
      var pdf_file = $scope.document
      PDFJS.getDocument('/thumbs' + pdf_file).then(function (pdf) {
        pdf.getPage(1).then(function (page) {
          var viewport = page.getViewport(0.5)
          // PDF.js returns a promise when it gets a particular page from the pdf object
          // A canvas element is used to render the page and convert into an image thumbnail
          // if single canvas is used, the content gets overridden when PDF.js promises resolve for subsequent files
          // so a dedicated canvas element is created for rendering a thumbnail for each pdf
          // the canvas element is discarded once the thumbnail is created.
          var canvas = document.createElement('canvas')
          var ctx = canvas.getContext('2d')
          canvas.height = viewport.height
          canvas.width = viewport.width

          var renderContext = {
            canvasContext: ctx,
            viewport: viewport
          }

          page.render(renderContext).then(function () {

            // set to draw behind current content
            ctx.globalCompositeOperation = 'destination-over'
            // set background color
            ctx.fillStyle = '#fff'
            // draw on entire canvas
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            // create an img from the canvas which contains the page contents
            var img_src = canvas.toDataURL()
            var $img = $element
              .attr('src', img_src)

            var file_details = {
              'name': pdf_file,
              'pages': pdf.pdfInfo.numPages
            }

            var $thumb = $('<div>')
              .attr('class', 'thumb')
              .attr('data-pdf-details', JSON.stringify(file_details))
              .append(
                $('<span>')
                  .attr('class', 'close')
                  .html('&times;')
                  .click(function () {
                    var details = $(this).parent().data('pdf-details')
                    alert('Remove ' + details.name + ' !? ')
                  })
            )
              .append($('<div>').attr('class', 'info').text(pdf_file))
              .append($img)
              .click(function () {
                CURRENT_FILE = $(this).data('pdf-details')
                $info_name.text(CURRENT_FILE.name)
                $info_pages.text(CURRENT_FILE.pages)
                $('.thumb').removeClass('current')
                $(this).addClass('current')
              })

            $thumb.appendTo($element).click()
            // we have created a thumbnail and rendered the img from the canvas
            // discard the temporary canvas created for rendering this thumbnail
            canvas.remove()
            // $(canvas).remove()

          })
        }) // end of getPage

      }) // end of getDocument

    }
  }
}])
