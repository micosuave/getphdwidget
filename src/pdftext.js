angular.module('llp.pdf', ['LocalStorageModule'])
    .config(function(localStorageServiceProvider) {
        localStorageServiceProvider.setPrefix('adf.getphd');
    })
    .factory('pdfToPlainText', ['$q', function($q) {
        return function(pdfData) {
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

        var getPages = function(pdf) {
            for (var i = 0; i < pdf.numPages; i++) {
                pdf.getPage(i + 1).then(getPageText);
            }
            return deffered.resolve(pdFF);
        };
        var pdFF = [];
        var getPageText = function(page) {

            page.getTextContent().then(function(textContent) {
                console.log(textContent);
                angular.forEach(textContent, function(o, key) {

                    var section = '';
                    angular.forEach(o, function(i, key) {
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
    .directive('getpdftext', ['extract', '$document', '$window', '$rootScope',
        function(extract, $document, $window, $rootScope) {
            var linkfunction = function($scope, $element, $attr, $ctrl) {




                $scope.pdfToPlainText = function(pdfData) {
                    var newtab = {
                        title: 'pdfData',
                        content: '<div id="pdf"></div>'
                    };
                    $scope.phd.documents.push(newtab);

                    PDFJS.disableWorker = false;
                    $('#pdf').children().remove();
                    var pdf = PDFJS.getDocument(pdfData);
                    pdf.then(getPages);
                };

                var getPages = function(pdf) {
                    for (var i = 0; i < pdf.numPages; i++) {
                        pdf.getPage(i + 1).then(getPageText);
                    }
                };
                var template = "</section><section class='page card card-fancy'>";
                var getPageText = function(page) {
                    var sectionwrap = angular.element(template).appendTo('#pdf');
                    page.getTextContent().then(function(textContent) {
                        console.log(textContent);
                        angular.forEach(textContent, function(o, key) {

                            var section = '';
                            angular.forEach(o, function(i, key) {
                                // $(sectionwrap).append(i.str + ' ');
                                section = section + i.str;
                                return section;
                            });
                            $(sectionwrap).append(section);
                            $scope.pages.push(section);

                        });

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

            };

            return {

                restrict: "A",
                controller: "PDFFilesController",
                controllerAs: "pdff",
                bindToController: true,
                link: linkfunction
            };
        }
    ])
    .controller('PDFFilesController', ['$scope', 'extract', '$document', '$window', '$http', 'localStorageService', function($scope, extract, $document, $window, $http, localStorageService) {

        var pdff = this;
        pdff.name = 'PDFFilesController';

    }]);
