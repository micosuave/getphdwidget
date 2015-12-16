'use strict';

angular.module('adf.widget.getphd', ['adf.provider', 'llp.extract',
    'fa.droppable', 'llp.parsetsv', 'roar', 'textSizeSlider', 'llp.pdf', 'LocalStorageModule', 'llp.extractpdf', 'firebase', 'ui.router', 'commonServices', 'xeditable', 'ui.utils', 'ui.tree', 'ngAnimate', 'ngAnnotateText', 'ngDialog', 'ngSanitize', 'pdf', 'phd', 'toastr', 'mentio', 'lionlawlabs', 'ui', 'diff', 'door3.css', 'checklist-model', 'authentication', 'angular-md5', 'angular.filter', 'admin', 'roarmap', 'ngFileUpload'
]).config(function (dashboardProvider, localStorageServiceProvider) {

    localStorageServiceProvider.setPrefix('adf.getphd');

    dashboardProvider
        .widget('column', {
            title: 'ColumnHeader',
            description: 'Define groupings of widgets',
            templateUrl: '{widgetsPath}/getphd/src/titleTemplate.html',
            icon: 'fa-ge',
            iconurl: 'img/lexlab.svg',
            styleClass: 'warning panel panel-warning',
            frameless: true
        })
        .widget('getphd', {
            title: '+PhD',
            description: 'import a patent prosecution history',
            templateUrl: '{widgetsPath}/getphd/src/view.html',
            controller: 'MainCtrl',
            controllerAs: 'main',
            frameless: true,
            reload: true,
            collapsed: true,
            icon: 'fa-ge',
            iconurl: 'img/logolong.png',
            styleClass: 'primary panel panel-primary',
            //titleTemplateUrl: '{widgetsPath}/getphd/src/titleTemplate.html',
            edit: {
                templateUrl: '{widgetsPath}/getphd/src/edit.html',
                controller: 'MainCtrl',
                controllerAs: 'main',
                modalSize: 'lg',
                reload: true,
                immediate: true
            },
            resolve: {
                config: ["config", "$firebaseArray", "$rootScope", "FIREBASE_URL",
                    function (config, $firebaseArray, $rootScope, FIREBASE_URL) {
                        if (config.id) {
                            return config;
                        } else {
                            var a = $firebaseArray(new Firebase(FIREBASE_URL + 'content/'));
                            var b = {};
                            a.$add({
                                'name': 'curation'
                            }).then(function (ref) {
                                var id = ref.key();
                                ref.update({
                                    id: id,
                                    //projectid: $rootScope.$stateParams.pId || 'projectid',
                                    //matterId: $rootScope.$stateParams.matterId || 'matterId',
                                    //groupId: $rootScope.$stateParams.groupId || 'groupId',
                                    //author: $rootScope.authData.uid || 'userid',
                                    ispublished: false,
                                    content_type: 'curation',
                                    timestamp: Firebase.ServerValue.TIMESTAMP
                                });

                                config.id = id;
                                return config;
                            });
                            return config;


                        }
                    }
                ]
            }

        });

})
    .constant('FIREBASE_URL', 'https://lexlab.firebaseio.com/')
    .controller('MainCtrl', ['Collection', 'extract', 'fileReader', '$http', 'parseTSV', '$roarmap', '$q', '$scope', 'config', 'PHD', 'localStorageService', 'extractpdf', 'pdfToPlainText', '$patentsearch', '$log',
        function (Collection, extract, fileReader, $http, parseTSV, $roarmap, $q, $scope, config, PHD, localStorageService, extractpdf, pdfToPlainText, $patentsearch, $log) {
            var main = this;
            main.size = 'lg';

            if (!config.id) {
                config.id = '';
            }
            main.config = config;
            $scope.definition = $scope.$parent.definition;

            var configid = config.id;
            var phd = Collection(configid);
            phd.$bindTo($scope, 'phd');



            $scope.configured = function () {
                return $scope.config.appnum !== '';
            };

            $scope.notConfigured = function () {
                return $scope.config.appnum === '';
            };
            var opts = {
                header: true
            };
            main.phd = {};
            var appnum = config.appnum;
            var attorney = appnum + '/' + appnum + '-address_and_attorney_agent.tsv';
            var application = appnum + '/' + appnum + '-application_data.tsv';
            var continuity = appnum + '/' + appnum + '-continuity_data.tsv';
            var foreign = appnum + '/' + appnum + '-foreign_priority.tsv';
            var transaction = appnum + '/' + appnum + '-transaction_history.tsv';
            var imagefile = appnum + '/' + appnum + '-image_file_wrapper/' + appnum + '-image_file_wrapper.tsv';
            var readme = appnum + '/README.txt';
            var targets = [{
                label: 'README',
                value: readme
            }, {
                    label: 'attorney',
                    value: attorney
                }, {
                    label: 'application',
                    value: application
                }, {
                    label: 'continuity',
                    value: continuity
                }, {
                    label: 'foreign',
                    value: foreign
                }, {
                    label: 'transaction',
                    value: transaction
                }, {
                    label: 'imagefile',
                    value: imagefile
                }];
            // var phd = $scope.phd;

            main.parse = function (files) {

                var deffered = $q.defer();
                angular.forEach(files, function (file, key) {
                    try {
                        //main.post(file);
                    } catch (ex) {
                        $log.error(ex)
                    } finally {
                        if (file.label === 'imagefile') {
                            $scope.phd.imagefile = parseTSV(file.file, opts);
                        } else if (file.label === 'application') {
                            $scope.phd.application = parseTSV(file.file);
                        } else if (file.label === 'attorney') {
                            $scope.phd.attorney = parseTSV(file.file);
                        } else if (file.label === 'foreign') {
                            $scope.phd.foreign = parseTSV(file.file, opts, false);
                        } else if (file.label === 'continuity') {
                            $scope.phd.continuity = parseTSV(file.file, opts, false);
                        } else if (file.label === 'transaction') {
                            $scope.phd.transaction = parseTSV(file.file, opts, false);
                        } else if (file.label === 'README') {
                            main.info = file.file;
                        } else {
                            main.error = 'Unhandled case!';
                        }
                        return deffered.resolve($scope.phd);
                    }
                });
                return deffered.promise;

            };

            main.getfilehistory = function (appnum) {
                main.spinner = true;
                main.progress = 0;
                var appnum = appnum;
                var proxy_url = 'http://127.0.0.1:8080/';
                var target_url = 'http://storage.googleapis.com/uspto-pair/applications/' + appnum + '.zip';
                var request = {
                    method: 'GET',
                    url: proxy_url + target_url,
                    headers: {
                        'Target-Endpoint': target_url
                    }
                };

                $http(request).then(function (resp) {
                    main.file = resp.data;
                    console.log(resp.data);
                    extract(resp.data, appnum)
                        .then(function (files) {
                            console.log(files);
                            main.file = files;
                            main.parse(files).then(function () {
                                main.spinner = false;
                            });
                        }, function (reason) {
                            main.error = reason.message;
                        });
                });
            };

            main.remotezip = function (appnum) {
                $http.get('http://storage.googleapis.com/uspto-pair/applications/' + appnum + '.zip', function (err, data) {
                    if (err) {
                        main.error = err; // or handle err
                    }

                    var zip = new JSZip(data);

                    main.handleFiles(zip);
                });

            };




            // main.file = {};
            main.success = null;

            main.info = null;

            main.handleFiles = function (file) {
                main.error = null;
                main.success = null;

                extractpdf(file.files[0])
                    .then(function (files) {
                        $log.info('Files extracted', files);
                        $scope.phd.file = files.tsvfiles;

                        main.parse(files.tsvfiles)

                            .then(function (parsedfiles) {
                                $log.info('TSV Parsed', parsedfiles);


                                $patentsearch($scope.phd.application)
                                    .then(function (patentobj) {
                                        $scope.phd.patent = patentobj;
                                        $roarmap(parsedfiles, $scope.phd)
                                            .then(function (roarmap) {
                                                $scope.phd.roarmap = roarmap;

                                                localStorageService.set(config.appnum, $scope.phd);

                                                alertify.alert('Done!');
                                            });
                                        // try {
                                        //     //main.pdFF(files.pdffiles);
                                        // } catch (ex) {
                                        //     $log.error('pdf extraction failed', ex);
                                        // } finally {
                                        //     $log.info('Complete!');
                                        // }




                                    }, function (reason) {

                                        main.error = reason.message;

                                    });

                            }, function (reason) {

                                main.error = reason.messsage;

                            });


                    },
                        function (reason) {

                            main.error = reason.message;

                        });

            };

            //console.log(fileReader);

            main.getFile = function () {
                main.progress = 0;
                fileReader.readAsDataUrl(main.file, main)
                    .then(function (result) {
                        main.handleFiles(result);
                        main.imageSrc = result;
                    });
            };

            $scope.$on("fileProgress", function (e, progress) {
                main.progress = progress.loaded / progress.total;
            });
            main.pdFF = function (filesobj) {
                var deferred = $q.defer();
                angular.forEach(filesobj, function (file, key) {
                    if (file && (file.name.indexOf('.pdf') > -1)) {

                        pdfToPlainText(file).then(function (pdf) {
                            $scope.phd.file.push(pdf);
                        });
                        // pdfToPlainText(file.asArrayBuffer()).then(function(file) {
                        //     $scope.phd.file.push(file);
                        // });
                        return deferred.resolve(pdf);
                    } else {
                        return deferred.reject('not a pdf');
                    }
                });
                return deferred.promise;
            };

        }
    ]).directive("ffFileSelect", [function () {

        return {
            restrict: 'A',
            controller: 'MainCtrl',
            controllerAs: 'main',
            bindToController: true,
            scope: false,
            link: function ($scope, el, attr, ctrl) {
                var main = ctrl;
                el.on("change", function (e) {

                    main.file = (e.srcElement || e.target).files[0];
                    main.getFile();
                });

            }

        };
    }])
    .factory('$patentsearch', ['$q', 'filepickerService', function ($q, filepickerService) {

        return function (phdobj) {
            var deferred = $q.defer();
            searchforpatent(phdobj);
            return deferred.promise;

            function searchforpatent(phdobj) {

                var applicationnumber = phdobj[0][1];
                debugger;
                var patentnumber = phdobj[16][1].replace(',', '').replace(',', '') || searchnumberresult || null;
                debugger;
                var searchnumberresult = '' || null; //Some function returning number;
                
                var googlepage = function (patentnumber) { filepicker.storeUrl('https://www.google.com/patents/US' + patentnumber, {}, function (Blob) {  googlepagetext(Blob); return Blob.url;}); });
                var googlepagetext = function (Blob) { filepicker.convert(Blob, { format: 'txt' }, function (new_Blob) { patentobj.googletext = new_Blob.url; }); });

                var pdfstorageuri = 'https://patentimages.storage.googleapis.com/pdfs/US' + patentnumber + '.pdf';

                var imageurlroot = 'https://patentimages.storage.googleapis.com/US' + patentnumber;
                var thumbnailurlroot = 'https://patentimages.storage.googleapis.com/thumbnails/US' + patentnumber;
                filepicker.storeUrl(pdfstorageuri.toString(),
                    { filename: 'US'+patentnumber+'.pdf' },
                    function (Blob) {
                        var patentobj = angular.copy(Blob);
                        patentobj.title = phdobj[19][1];
                        patentobj.patentnumber = patentnumber;
                        patentobj.media = Blob.url;
                        patentobj.srcdoc = googlepage(patentnumber) || null;
                        filepicker.convert(
                            Blob,
                            {format: 'txt'},
                            function (new_Blob) {
                                
                                patentobj.txt = new_Blob.url;
                                return deferred.resolve(patentobj);
                            }
                            );
                        
                    }
                    );





            }
        }
    }]);
