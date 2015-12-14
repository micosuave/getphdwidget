jQuery.event.props.push("dataTransfer");
angular.module("fa.droppable", [])

    .directive("dropFiles", [function () {
        var linkFn = function ($scope, $element, $attrs, ctrl) {
            var extractFiles = function (e) {
                debugger;
                var files = e.originalEvent.dataTransfer.files;
                debugger;
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

    .controller("DropFilesController", ['$controller', 'extract', '$scope',  '$timeout', '$rootScope',
        function ($controller, extract, $scope, $timeout, $rootScope) {
            var drop = this;
            //var main = $controller('MainCtrl');
            //var main = $scope.main;
            // $scope.log = '';

            // drop.upload = function (files) {
            //     if (files && files.length) {
            //         for (var i = 0; i < files.length; i++) {
            //             var file = files[i];
            //             if (!file.$error) {
            //                 Upload.upload({
            //                     url: 'https://lexlab.io/upload',
            //                     data: {
            //                         username: $rootScope.authData.uid,
            //                         file: file
            //                     }
            //                 }).progress(function (evt) {
            //                     var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            //                     console.log = 'progress: ' + progressPercentage + '% ' +
            //                     evt.config.data.file.name + '\n' + console.log;
            //                 }).success(function (data, status, headers, config) {
            //                     $timeout(function () {
            //                         console.log = 'file: ' + config.data.file.name + ', Response: ' + JSON.stringify(data) + '\n' + console.log;
            //                     });
            //                 });
            //             }
            //         }
            //     }
            // };

            drop.file = {};
            drop.dropFiles = function (files) {
                console.log('files.files[0]', files.files[0]);
                // alertify.log('files.files[0]', files.files[0])
                $scope.$parent.main.handleFiles(files);
                //drop.upload(files);
                // var a = extractAndParse(files.files[0]);
                // console.log('a', a);
                // //alertify.log('a', a);

                // drop.file = a;
                // console.log('drop', drop);
                // //alertify.log('a', a);
                // main.handleFiles(a);
            };
        }
    ])
