jQuery.event.props.push("dataTransfer");
angular.module("fa.droppable", [])

    .directive("dropFiles", [function () {
        var linkFn = function ($scope, $element, $attrs, ctrl) {
            var extractFiles = function (e) {
                //debugger;
                var files = e.originalEvent.dataTransfer.files;
                //debugger;
                var filesArray = [];

                for (var i = 0, len = files.length; i < len; i++) {
                    filesArray.push(files[i]);
                }

                return filesArray;
            };

            var handleDragOver = function (e) {
                e.preventDefault();
                $element.css({
                    'border-style': 'dotted'
                });
            };

            var handleDrop = function (e) {
                e.preventDefault();
                $element.css({
                    'border-style': 'dashed'
                });
                var files = extractFiles(e);

                ctrl.dropFiles({
                    files: files
                });
            };

            $element.on("dragover", handleDragOver);
            $element.on("drop", handleDrop);

            $scope.$on("$destroy", function () {
                $element.off("dragover", handleDragOver);
                $element.off("drop", handleDrop);
            });
        };

        return {
            restrict: "A",
            controller: "DropFilesController",
            controllerAs: "drop",
            bindToController: true,
            require: "dropFiles",
            scope: {
                accepts: "&",
                dropFiles: "&",
                main: "&"
            },
            link: linkFn
        };
    }])

    .controller("DropFilesController", ['$controller', 'extract', '$scope',  '$timeout', '$rootScope','FileUploader',
        function ($controller, extract, $scope, $timeout, $rootScope, FileUploader) {
            var drop = this;
          
       

            drop.file = {};
            drop.dropFiles = function (files) {
              console.log('files.files[0]', files.files[0]);


              var uploader = $scope.uploader = new FileUploader({
                url: $scope.url || 'https://lexlab.io/upload',
                autoUpload: true
              });

              // FILTERS

              uploader.filters.push({
                name: 'customFilter',
                fn: function (item /*{File|FileLikeObject}*/, options) {
                  return this.queue.length < 10;
                }
              });

              // CALLBACKS

              uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
                console.info('onWhenAddingFileFailed', item, filter, options);
              };
              uploader.onAfterAddingFile = function (fileItem) {
                console.info('onAfterAddingFile', fileItem);
              };
              uploader.onAfterAddingAll = function (addedFileItems) {
                console.info('onAfterAddingAll', addedFileItems);
              };
              uploader.onBeforeUploadItem = function (item) {
                console.info('onBeforeUploadItem', item);
              };
              uploader.onProgressItem = function (fileItem, progress) {
                console.info('onProgressItem', fileItem, progress);
              };
              uploader.onProgressAll = function (progress) {
                console.info('onProgressAll', progress);
              };
              uploader.onSuccessItem = function (fileItem, response, status, headers) {
                console.info('onSuccessItem', fileItem, response, status, headers);
              };
              uploader.onErrorItem = function (fileItem, response, status, headers) {
                console.info('onErrorItem', fileItem, response, status, headers);
              };
              uploader.onCancelItem = function (fileItem, response, status, headers) {
                console.info('onCancelItem', fileItem, response, status, headers);
              };
              uploader.onCompleteItem = function (fileItem, response, status, headers) {
                console.info('onCompleteItem', fileItem, response, status, headers);
                $scope.$parent.main.handleFiles(files);
              };
              uploader.onCompleteAll = function () {
                console.info('onCompleteAll');
              };

            };
        }
    ])
