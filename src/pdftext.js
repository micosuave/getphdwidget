angular.module('llp.pdf', ['LocalStorageModule'])
    .config(function (localStorageServiceProvider) {
        localStorageServiceProvider.setPrefix('adf.getphd');
    })
    .factory('pdfToPlainText', ['$q', function ($q) {
        return function (pdfData) {
            pdfToPlainText(pdfData);
        };




        function pdfToPlainText(pdfData) {
            var deferred = $q.defer();
            PDFJS.disableWorker = false;
            console.log(pdfData);
            debugger;
            var pdf = PDFJS.getDocument(pdfData.data);
            pdf.then(getPages);
            return deferred.promise;
        };

        var getPages = function (pdf) {
            for (var i = 0; i < pdf.numPages; i++) {
                pdf.getPage(i + 1).then(getPageText);
            }
            return deffered.resolve(pdFF);
        };
        var pdFF = [];
        var getPageText = function (page) {

            page.getTextContent().then(function (textContent) {
                console.log(textContent);
                angular.forEach(textContent, function (o, key) {

                    var section = '';
                    angular.forEach(o, function (i, key) {
                        // $(sectionwrap).append(i.str + ' ');
                        section = section + i.str;
                        return section;
                    });
                    pdFF.push(section);

                });
                return page;

            });
            return pdFF;
        };


    }])
    /*.directive('getpdftext', ['extract', '$document', '$window', '$rootScope','$http','Collection',
        function(extract, $document, $window, $rootScope, $http, Collection) {
            var linkfunction = function($scope, $element, $attr, $ctrl) {
                $scope.pages = [];
                var id = $attr.pdfData.slice($attr.pdfData.lastIndexOf('/')+1,$attr.pdfData.lastIndexOf('-'));
                var roarref = Collection(id).$ref();
                // $scope.keywords = '/(claim(s)?\s+\d+(\W(\s)?\d+)+)?(reject(ed)?(ion)?)?(10\d\(\D\))?/gi';
                // $scope.matches = [];
$http.get($attr.pdfData).then(function(resp){

PDFJS.workerSrc = '/llp_core/bower_components/pdfjs-dist/build/pdf.worker.js';
var PDF_PATH = $attr.pdfData;
var PAGE_NUMBER = 2;
var PAGE_SCALE = 0.3;
var SVG_NS = 'http://www.w3.org/2000/svg';

function buildSVG(viewport, textContent) {
  // Building SVG with size of the viewport (for simplicity)
  var svg = document.createElementNS(SVG_NS, 'svg:svg');
  svg.setAttribute('width', 94 + 'vw');
  svg.setAttribute('height', 90 + 'vh');
  svg.setAttribute('class','card card-block img-shadow');
  //svg.setAttribute('width', '50vw');
  //svg.setAttribute('height', '75vh');
  // items are transformed to have 1px font size
  svg.setAttribute('font-size', 1);

  // processing all items
  textContent.items.forEach(function (textItem) {
    // we have to take in account viewport transform, which incudes scale,
    // rotation and Y-axis flip, and not forgetting to flip text.
    var tx = PDFJS.Util.transform(
      PDFJS.Util.transform(viewport.transform, textItem.transform),
      [1, 0, 0, -1, 0, 0]);
    var style = textContent.styles[textItem.fontName];
    // adding text element
    var text = document.createElementNS(SVG_NS, 'svg:text');
    tx[1]= 0;
    tx[2]= 0;
    text.setAttribute('transform', 'matrix(' + tx.join(' ') + ')');
    //text.setAttribute('font-family', style.fontFamily);
    text.setAttribute('font-family', 'Helvetica');
    text.textContent = textItem.str;
    svg.appendChild(text);
  });
  return svg;
}

function pageLoaded() {
  // Loading document and page text content
  PDFJS.getDocument(PDF_PATH).then(function (pdfDocument) {
    for (var i = 0; i < pdfDocument.numPages; i++) {

    pdfDocument.getPage(i + 1).then(function(page){

    //pdfDocument.getPage(PAGE_NUMBER).then(function (page) {
      var viewport = page.getViewport(PAGE_SCALE);
      page.getTextContent().then(function (textContent) {
        // building SVG and adding that to the DOM
        var svg = buildSVG(viewport, textContent);
        $element.append(svg);
      });
    });
  }
    });
}

// document.addEventListener('DOMContentLoaded', function () {
//   if (typeof PDFJS === 'undefined') {
//     alert('Built version of PDF.js was not found.\n' +
//           'Please run `node make generic`.');
//     return;
//   }
//   pageLoaded();
// });
 pageLoaded();

                //$scope.pdfToPlainText = function(pdfData) {
                    var newtab = {
                        title: 'pdfData',
                        content: '<div id="pdf"></div>'
                    };
                    //$scope.phd.documents.push(newtab);
                    PDFJS.workerSrc = '/llp_core/bower_components/pdfjs-dist/build/pdf.worker.js';
                    //PDFJS.disableWorker = false;
                   // $('#pdf').children().remove();
                    var pdf = PDFJS.getDocument(PDF_PATH);
                    pdf.then(function(pdfDocument){getPages(pdfDocument);});
                //};

                var getPages = function(pdf) {
                    for (var i = 0; i < pdf.numPages; i++) {
                        pdf.getPage(i + 1).then(function(page){getPageText(page)});
                    }
                };
                var template = "</p><p class='card card-fancy draft-fancy'>";
                var getPageText = function(page) {
                    //var sectionwrap = angular.element(template).appendTo($element);
                    page.getTextContent().then(function(textContent) {
                        console.log(textContent);
                        var section = '';
                        angular.forEach(textContent.items, function(o, key) {

                            // var section = '';


                            // angular.forEach(o, function(i, key) {
                            //     // $(sectionwrap).append(i.str + ' ');
                            //     section = section + ' ' + i.str;
                            //     return section;
                            // });
                            section = section + ' ' + o.str;


                        });
                        var reg = new RegExp(/(?!\d+)\.\s/,'gi');
                        var pss = section.split(reg);

                        pss.forEach(function(str){
                            var reg = new RegExp(/(?:claim)?(?:reject)?(?:amend)?(?:cancel)/,'gi');
                            str.replace(reg, '<mark class="highlight">'+reg+'</mark>');
                        });
                        var string = section;
    // var regEx = $scope.keywords;
    // var re = new RegExp(regEx, "gi");
    // // for (var i=0; i<string.match(re).length; i++)
    // // {
    //     string = string.replace(re, function(x){
    //         return "<span class='highlight'><strong><em><u>" + string.match(re)[i] + "</u></em></strong></span>";
    //     });
        //string.match(re)[i], "<span class='highlight'><strong><em><u>" + string.match(re)[i] + "</u></em></strong></span>");
    //$(sectionwrap).append(string);
    $scope.pages.push(pss.join('</p><p>'));
    roarref.child('pages').push(pss.join('</p><p>'));
    //}



                            //var sentences = string.split('. ');
                            //section.match($scope.keywords)
                        //section.replace(section.match($scope.keywords), '<span class="highlight"><strong><em><u>' + $[1] + '</u></em></strong></span>');


                            // for (var key in sentences){
                            //     if (sentences.hasOwnProperty[key]){
                            //         var sentence = sentences[key];
                            //         if (sentence.match($scope.keywords)){
                            //             $scope.matches.push(sentence);
                            //         }
                            //     }
                            // }
                            // angular.forEach(sentences, function(sentence, key){
                            //     $scope.matches.push(sentence.match(re));
                            // });


                        // textContent.forEach(function(o) {

                        // });
                    });
                };
                // $document.on('mouseup', function(event) {
                //     var a = $window.getSelection() || $document.getSelection();
                //     if (a !== null && (a.extentOffset - a.anchorOffset > 0)) {
                //         console.log(a);
                //         var b = $('aside').append(template);
                //         var text = a.anchorNode.data.slice(a.anchorOffset, a.extentOffset);
                //         b.append(text);
                //         var excerpt = {
                //             source: $scope.url,
                //             data: text,
                //             owner: $rootScope.authData.uid,
                //             matter: $rootScope.$stateParams.matterId,
                //             project: $rootScope.$stateParams.pId,
                //             content_type: 'annotation'

                //         };
                //         ROARsnippets().$add(excerpt).then(function(ref) {
                //             var id = ref.key();
                //             ref.update({
                //                 id: id,
                //                 timestamp: Firebase.ServerValue.TIMESTAMP
                //             });
                //         });
                //     angular.forEach(a, function(o, key) {
                //     angular.forEach(o, function(i, key) {
                //         $(b).append(i.str + ' ');
                //         // var section = ''; // section.concat(i.str); // b.append(section);

                //     });


                // }

                //   });

});
            };*/

    .directive('getpdftext', ['extract', '$document', '$window', '$rootScope', '$http', 'Collection', '$txt2html', '$sce', '$compile', 'toastr',
        function (extract, $document, $window, $rootScope, $http, Collection, $txt2html, $sce, $compile, toastr) {
            return {

                restrict: "A",
                templateUrl: '{widgetsPath}/getphd/src/phd/Pages.html',
                //template: '<label class="fa fa-tags text-info±"></label><label ng-repeat="tag in matches | unique">| {{tag.str}} |</label><div ng-repeat="page in pages" class="card card-block" style="line-height:1.5;font-size:14px;"><input type="text" ng-model="query" placeholder="search" class="" /><p ng-bind-html="page | highlight: query | trustAsHTML"></p><footer style="display:flex;justify-content:center;"><p style="align-self:center;color:#444;" >{{$index}}</p></footer></div>',
                //controller: "PDFFilesController",
                //controllerAs: "pdff",
                //bindToController: true,

                scope: {
                    matches: '=?',
                    roarevent: '=?',
                    // getpdftext:'@',
                    pdfData: '@'

                },
                controller: ['$scope', 'ROARAnnotations', function ($scope, ROARAnnotations) {

                    $scope.onAnnotate = function ($annotation) {
                        $scope.roarevent.$save();
                        toastr.success($annotation.data.comment);
                        $scope.annotations.push($annotation);
                        angular.forEach($scope.roarevent.pages, function (page, key) {
                            if (angular.isUndefined(page.annotations)) {
                                var annotations = [];
                                page.annotations = annotations;
                                $scope.roarevent.$save();
                            } else {
                                $scope.annotations.push(page.annotations);
                            }
                        });
                    };
                    $scope.onAnnotateDelete = function ($annotation) {
                        $scope.roarevent.$save();
                        // angular.forEach($scope.roarevent.pages, function (page, key) {
                        //     if (angular.isUndefined(page.annotations)) {
                        //         var annotations = [];
                        //         page.annotations = annotations;
                        //         $scope.roarevent.$save();
                        //     } else {
                        //         $scope.annotations.push(page.annotations);
                        //     }
                        // });

                    };

                    $scope.onAnnotateError = function ($ex) {
                        if ($ex.message === "NG_ANNOTATE_TEXT_PARTIAL_NODE_SELECTED") {
                            return toastr.error("Invalid selection.");
                        } else {
                            return toastr.error($ex);
                        }
                    };

                    $scope.onPopupShow = function ($el) {
                        var firstInput;
                        firstInput = $el.find("input, textarea").eq(0).focus();
                        var a = window.getSelection();
                        if (a !== null && (a.extentOffset - a.anchorOffset > 0)) {
                            var text = a.anchorNode.data.slice(a.anchorOffset, a.extentOffset);
                            $scope.data.selection = text;
                        }
                        // if (selection) {
                        //     $scope.data.selection = selection;
                        // }

                        $('.ng-annotate-text-popup').draggable({
                            scroll: true,
                            cursor: 'move',
                            handle: '.roareventcardtab',
                            stack: '.ng-annotate-text-popup',
                            constrain: 'scroll'
                        }).resizable();
                        return firstInput && firstInput[0].select();
                    };

                    $scope.hasPoints = function (points) {
                        var _isNaN;
                        _isNaN = Number.isNaN || isNaN;
                        return typeof points === "number" && points !== 0 && !_isNaN(points);
                    };

                    $scope.hasComment = function (comment) {
                        return typeof comment === "string" && comment.length > 0;
                    };

                    $scope.annotationsAsFlatList = function (annotations) {

                        if (annotations == null) {
                            annotations = $scope.annotations;
                        }
                        if (!annotations.length) {
                            return [];
                        } else {
                            return annotations.map(function (annotation) {
                                var arr;
                                arr = [];
                                if ($scope.hasPoints(annotation.data.points) && $scope.hasComment(annotation.data.comment)) {
                                    arr.push(annotation);
                                }
                                if (annotation.children && annotation.children.length) {
                                    arr = arr.concat($scope.annotationsAsFlatList(annotation.children));
                                }
                                // arr.push(annotation);
                                return arr;
                            }).reduce(function (prev, current) {
                                return prev.concat(current);
                            });
                        }
                    };
                    $scope.clearPopups = function () {
                        return $scope.$broadcast("ngAnnotateText.clearPopups");
                    };
                    $scope.$on('$destroy', function(){
                        $scope.roarevent.$save();
                    });

                }],
                link: function ($scope, $el, $attr, $ctrl) {
                    var id = $attr.getpdftext;
                    Collection(id).$loaded().then(function (roarevent) {
                        //    roarevent.$bindTo($scope, 'roarevent');
                        $scope.roarevent = roarevent;
                        $scope.pages = roarevent.pages;
                        $scope.annotations = [];
                        angular.forEach($scope.roarevent.pages, function (page, key) {
                            if (angular.isUndefined(page.annotations)) {
                                var annotations = [];
                                page.annotations = annotations;
                                $scope.roarevent.$save();
                            } else {
                                $scope.annotations.push(page.annotations);
                            }

                      });

                        // if (angular.isUndefined($scope.roarevent.annotations)){
                        //     $scope.roarevent.annotations = [];
                        //     angular.forEach($scope.roarevent.pages, function(page, key){
                        //         var pageannotations = [];
                        //         $scope.roarevent.annotations.push(pageannotations);
                        //     })
                        // }
                        // $document.on('mouseup', function(event) {
                        // var a = $window.getSelection() || $document.getSelection();
                        // if (a !== null && (a.extentOffset - a.anchorOffset > 0)) {
                        //     var text = a.anchorNode.data.slice(a.anchorOffset, a.extentOffset);
                        //     alertify.prompt(text).set('type','color').set('onok', function(evt,value){$(text).wrap('<span style="background-color:'+value+'"'); alertify.success(text);}).show();
                        // }
                        // });

                        if (angular.isUndefined($scope.roarevent.pages)||($scope.roarevent.pages.length !== $scope.roarevent['Page Count'])) {
                            $scope.roarevent.pages = [];
                            // $scope.roarevent.matches = [];
                            $http.get($attr.pdfData).then(function (resp) {

                                PDFJS.workerSrc = '/llp_core/bower_components/pdfjs-dist/build/pdf.worker.js';


                                var pdf = PDFJS.getDocument($attr.pdfData);
                                pdf.then(function (pdfDocument) { getPages(pdfDocument); });


                                var getPages = function (pdf) {
                                    for (var i = 0; i < pdf.numPages; i++) {
                                        pdf.getPage(i + 1).then(function (page) { getPageText(page, i) });
                                    }
                                };
                                var getPageText = function (page, i) {
                                    //console.log(page);
                                    page.getTextContent().then(function (textContent) {
                                        //console.log(textContent);
                                        // var rawdata = [];
                                        var section = '';
                                        angular.forEach(textContent.items, function (o, key) {

                                            /* if(o.str.contains('112')||o.str.contains('103')||o.str.contains('102')||o.str.contains('claim')||o.str.contains('reject')||o.str.contains('amend')||o.str.contains('cancel')){
                                                 section = section + ' ' +'<a id="'+$scope.roarevent.matches.length+'"><mark class="highlight" tooltip-trigger="mouseenter" uib-tooltip="'+o.str+'  [@'+key+']">' + o.str + '</mark></a>';
                                                 $scope.roarevent.matches.push(o.str);
                                             }else{*/
                                            //rawdata.push(o);
                                            section = section + ' ' + o.str;
                                            //}
                                        });

                                          var pag = {
                                            annotations: [{id:0,startIndex:0,endIndex:0,type:'aqua'}],
                                            id: i,
                                            text: section

                                        };

                                        $scope.roarevent.pages.push(pag);
                                        if ($scope.roarevent.pages.length == $scope.roarevent['Page Count']){
                                          $scope.roarevent.$save();
                                        }
                                    });

                                };


                            });


                        }
                    });
                }
            };
        }]).factory('$txt2html', [function () {
            return function (text, enterMode) {
                var isEnterBrMode = enterMode == CKEDITOR.ENTER_BR,
                    // CRLF -> LF
                    html = this.htmlEncode(text.replace(/\r\n/g, '\n'));

                // Tab -> &nbsp x 4;
                html = html.replace(/\t/g, '&nbsp;&nbsp; &nbsp;');

                var paragraphTag = enterMode == CKEDITOR.ENTER_P ? 'p' : 'div';

                // Two line-breaks create one paragraphing block.
                if (!isEnterBrMode) {
                    var duoLF = /\n{2}/g;
                    if (duoLF.test(html)) {
                        var openTag = '<' + paragraphTag + '>', endTag = '</' + paragraphTag + '>';
                        html = openTag + html.replace(duoLF, function () {
                            return endTag + openTag;
                        }) + endTag;
                    }
                }

                // One <br> per line-break.
                html = html.replace(/\n/g, '<br>');

                // Compensate padding <br> at the end of block, avoid loosing them during insertion.
                if (!isEnterBrMode) {
                    html = html.replace(new RegExp('<br>(?=</' + paragraphTag + '>)'), function (match) {
                        return CKEDITOR.tools.repeat(match, 2);
                    });
                }

                // Preserve spaces at the ends, so they won't be lost after insertion (merged with adjacent ones).
                html = html.replace(/^ | $/g, '&nbsp;');

                // Finally, preserve whitespaces that are to be lost.
                html = html.replace(/(>|\s) /g, function (match, before) {
                    return before + '&nbsp;';
                }).replace(/ (?=<)/g, '&nbsp;');

                return html;

            };
        }])
    .controller('PDFFilesController', ['$scope', 'extract', '$document', '$window', '$http', 'localStorageService', function ($scope, extract, $document, $window, $http, localStorageService) {

        var pdff = this;
        pdff.name = 'PDFFilesController';

    }]).controller("AnnotationController", ['$scope', '$timeout', 'Profile',function ($scope, $timeout, Profile) {
        // $scope.roarevents = ROARevents($stateParams.matterId);
        var profile = Profile();
        $scope.annotationColours = [{
            name: "Red",
            value: "red"
        }, {
                name: "Green",
                value: "green"
            }, {
                name: "Blue",
                value: "blue"
            }, {
                name: "Yellow",
                value: "yellow"
            }, {
                name: "Pink",
                value: "pink"
            }, {
                name: "Aqua",
                value: "aqua"
            }];
            $scope.templates = profile.annotationtemplates;
        /*$scope.templates = [{
            type: "red",
            comment: "@username",
            points: -1
        }, {
                type: "aqua",
                comment: "#tag",
                points: +1
            }, {
                type: "green",
                comment: "+1",
                points: +2
            }];*/

        $scope.selection = window.getSelection();

        $scope.useTemplate = function (template) {
            if (template.type !== null) {
                $scope.$annotation.type = template.type;
            }
            if (template.comment !== null) {
                $scope.$annotation.data.comment = template.comment;
            }
            if (template.points !== null) {
                $scope.$annotation.data.points = template.points;
            }
            $scope.$close();
        };

        $scope.useColor = function (color) {
            if (color.value !== null) {
                $scope.$annotation.type = color.value;
            }
        };

        $scope.isActiveColor = function (color) {
            return color && color.value === $scope.$annotation.type;
        };

        $scope.close = function () {
            return $scope.$close();
        };

        $scope.reject = function () {
            return $scope.$reject();
        };
    }]);
