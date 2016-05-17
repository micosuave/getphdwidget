'use strict';

angular.module('adf.widget.getphd', ['adf.provider', 'llp.extract',
    'fa.droppable', 'llp.parsetsv', 'roar', 'textSizeSlider', 'llp.pdf', 'LocalStorageModule', 'llp.extractpdf', 'firebase', 'xeditable', 'ui.tree', 'ngAnimate', 'ngAnnotateText', 'ngDialog', 'ngSanitize', 'pdf', 'toastr', 'mentio', 'diff', 'door3.css', 'checklist-model', 'angular-md5', 'angular.filter', 'ngFileUpload'
]).config(function (dashboardProvider, localStorageServiceProvider) {

    localStorageServiceProvider.setPrefix('adf.getphd');

    dashboardProvider
        .widget('metadata', {
            title: 'Metadata',
            description: 'metadata for this document/collection',
            templateUrl: '{widgetsPath}/getphd/src/metadata.html',
            icon: 'fa-code',
            iconurl: '/llp_core/img/lexlab.svg',
            styleClass: 'info',
            frameless: false,
            reload: true,
            controller: 'MetadataController',
            controllerAs: 'meta',
            edit: {
                templateUrl: '{widgetsPath}/getphd/src/metadata.html',
                controller: 'MetadataController',
                controllerAs: 'meta',
                modalSize: 'lg',
                reload: true
            }
        })
        .widget('claims', {
          title: 'Claims',
            description: 'view or edit a set of claims',
            templateUrl: '{widgetsPath}/getphd/src/claims.html',
            icon: 'fa-code',
            iconurl: '/llp_core/img/lexlab.svg',
            styleClass: 'info',
            frameless: false,
            reload: true,
            controller: 'ClaimWidgetController',
            controllerAs: 'cwc',
            edit: {
                templateUrl: '{widgetsPath}/getphd/src/editfulltext.html',
                controller: 'TextController',
                controllerAs: 'text',
                modalSize: 'lg',
                reload: true
            }
        })
        .widget('text', {
            title: 'TextAnnotator',
            description: 'full search and annotate a document',
            templateUrl: '{widgetsPath}/getphd/src/fulltext.html',
            icon: 'fa-file-o',
            iconurl: '/llp_core/img/lexlab.svg',
            styleClass: 'info ',
            frameless: false,
            reload: true,
            controller: 'TextController',
            controllerAs: 'text',
            edit: {
                templateUrl: '{widgetsPath}/getphd/src/editfulltext.html',
                controller: 'TextController',
                controllerAs: 'text',
                modalSize: 'lg',
                reload: true
                //immediate: true
            }
        })
        .widget('patent', {
            title: 'PatentDigest',
            description: 'analysis of patent or published application',
            templateUrl: '{widgetsPath}/getphd/src/phd/patentReport.html',
            controller: 'PatentWidgetCtrl',
            controllerAs: 'p',
            frameless: false,
            reload: false,
            //collapsed: true,
            //immediate: true,
            icon: 'fa-ge',
            iconurl: 'img/logolong.png',
            styleClass: 'NOA panel panel-NOA',
            //titleTemplateUrl: '{widgetsPath}/getphd/src/titleTemplate.html',
            edit: {
                templateUrl: '{widgetsPath}/getphd/src/edit.html',
                controller: 'PatentWidgetCtrl',
                controllerAs: 'p',
                modalSize: 'lg',
                reload: true,
                immediate: true
            }
        })
        .widget('getphd', {
            title: '+PhD',
            description: 'import a patent prosecution history',
            templateUrl: '{widgetsPath}/getphd/src/view.html',
            controller: 'MainCtrl',
            controllerAs: 'main',
            frameless: false,
            reload: false,
            //collapsed: true,
            //immediate: true,
            icon: 'fa-ge',
            iconurl: 'img/logolong.png',
            styleClass: 'primary panel panel-primary',
            //titleTemplateUrl: '{widgetsPath}/getphd/src/titleTemplate.html',
            edit: {
                templateUrl: '{widgetsPath}/getphd/src/edit.html',
                controller: 'MainCtrl',
                controllerAs: 'main',
                modalSize: 'lg',
                reload: true
                //immediate: true
            }
            /*,
            resolve: {
                config: ['config', '$firebaseArray', '$rootScope', 'FIREBASE_URL',
                    function(config, $firebaseArray, $rootScope, FIREBASE_URL) {
                        if (config.id) {
                            return config;
                        } else {
                            var a = new Firebase(FIREBASE_URL + 'content/');
                            var b = new Date();
                            var c = b.getTime();
                            a.child(c).set({
                                    id: c,
                                    content_type: 'getphd',
                                    templateUrl: '{widgetsPath}/getphd/src/view.html',
                                    timestamp: Firebase.ServerValue.TIMESTAMP
                                });
                                config.id = c;


                                return config;
                        }

                    }
                ]
            }*/

        });

})

    .controller('MainCtrl', ['Collection', 'extract', 'extractzip', 'fileReader', '$http', 'parseTSV', '$roarmap', '$q', '$scope', 'PHD', 'localStorageService', 'extractpdf', 'pdfToPlainText', '$patentsearch', '$log', 'FileUploader', '$publish', '$pdftotxt', '$timeout', 'toastr', '$rootScope', '$stateParams', '$location', '$ACTIVEROAR', '$dashboards', '$interval', '$compile', '$templateCache', '$window', '$document', '$filter', 'ckstarter', 'ckender', '$firequeue',
        function (Collection, extract, extractzip, fileReader, $http, parseTSV, $roarmap, $q, $scope, PHD, localStorageService, extractpdf, pdfToPlainText, $patentsearch, $log, FileUploader, $publish, $pdftotxt, $timeout, toastr, $rootScope, $stateParams, $location, $ACTIVEROAR, $dashboards, $interval, $compile, $templateCache, $window, $document, $filter, ckstarter, ckender, $firequeue) {
            var main = this;
            //main.size = 'lg';
            $scope.treeFilter = $filter('uiTreeFilter');

            $scope.availableFields = ['title', 'text'];
            $scope.supportedFields = ['title', 'text'];
            $scope.toggleSupport = function (propertyName) {
                return $scope.supportedFields.indexOf(propertyName) > -1 ?
                    $scope.supportedFields.splice($scope.supportedFields.indexOf(propertyName), 1) :
                    $scope.supportedFields.push(propertyName);
            };
            $scope.collapsereport = false;
            main.collapse = function () {
                $scope.collapsereport = !$scope.collapsereport;
            };
            //main.showupload = true;
            var config = $scope.$parent.config || $scope.$parent.$parent.config;

            var PHD = Collection(config.id) || Collection(config.appnum);
            PHD.$loaded().then(function (phd) {
                phd.$bindTo($scope, 'phd');
                if (angular.isUndefined(phd.file)) {
                    main.showupload = true;
                } else {
                    main.showupload = false;
                    /* $http.get(phd.patent.text).then(function (resp) {
                         return main.text = resp.data;
                     });*/

                }

            });
            main.$ACTIVEROAR = $ACTIVEROAR;
            main.tabs = [{ isActive: true, disabled: false }, { isActive: false, disabled: false }, { isActive: false, disabled: false }];

            $scope.export2collection = function (eventID) {
                var projectId = $stateParams.pId;
                var out = Collection(projectId);
                out.$loaded().then(function (output) {
                    if (angular.isUndefined(output.roarlist)) {
                        output.roarlist = new Array();
                        output.roarlist.push(eventID);
                        output.$save();
                    } else {
                        output.roarlist.push(eventID);
                        output.$save();
                    }
                });
            };
            $scope.publish = function (phd) {
                angular.forEach(phd.roarmap.collections, function (col, key) {
                    $scope.export2collection(col);
                    $scope.export2collection(key);
                });
                $scope.export2collection(config.id);
                $publish(config.id, $scope.phd).then(function (url) { alertify.success('link to post:' + url); });
            };

            // $scope.configured = function () {
            //     return $scope.config.appnum !== '';
            // };

            // $scope.notConfigured = function () {
            //     return $scope.config.appnum === '';
            // };
            var opts = {
                header: true,
                skipEmptyLines: true
            };
            var uploader = $scope.uploader = new FileUploader({
                url: '/upload' || 'https://lexlab.io/upload',
                autoUpload: true,
                removeAfterUpload: true
            });

            // FILTERS

            uploader.filters.push({
                name: 'customFilter',
                fn: function (item /*{File|FileLikeObject}*/, options) {
                    var filename = item.filename || item.name;

                    return (filename.indexOf('.zip') > -1 && filename.indexOf('(') == -1 && filename.indexOf(' ') == -1);
                }
            });

            // CALLBACKS

            uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
                console.info('onWhenAddingFileFailed', item, filter, options);
                alertify.alert('The file\'s name must end with ".zip" and consist only of numbers');
                this.queue = null;
            };
            uploader.onAfterAddingFile = function (fileItem) {
                console.info('onAfterAddingFile', fileItem);
            };
            uploader.onAfterAddingAll = function (addedFileItems) {
                console.info('onAfterAddingAll', addedFileItems);
            };
            uploader.onBeforeUploadItem = function (item) {

                console.info('onBeforeUploadItem', item);
                main.progress = 0;
                main.bufferedfile = item;
                console.log(item);
                alertify.log('starting upload...');

            };
            uploader.onProgressItem = function (fileItem, progress) {
                main.progress = progress;
                if (progress === 10) {
                    toastr.info('fetching remote resources...');
                }
                if (progress === 30) {
                    toastr.info('loading relevant data schemas...');
                }
                if (progress === 55) {
                    toastr.warning('compiling templates...');
                }
                if (progress === 75) {
                    toastr.warning('starting the AI engine...')
                }

                if (progress <= 40) { main.progresstype = 'danger'; }
                else if (progress > 40 && progress < 66) { main.progresstype = 'warning'; }
                else if (progress > 97) { main.progresstype = 'success'; }
                else { main.progresstype = 'info'; }
                console.info('onProgressItem', fileItem, progress);
            };
            uploader.onProgressAll = function (progress) {
                console.info('onProgressAll', progress);
            };
            uploader.onSuccessItem = function (fileItem, response, status, headers) {
                console.info('onSuccessItem', fileItem, response, status, headers);
                alertify.success(response);
                alertify.success('File uploaded!');

                $rootScope.$broadcast('UPLOADCOMPLETE', response);
            };
            uploader.onErrorItem = function (fileItem, response, status, headers) {
                console.info('onErrorItem', fileItem, response, status, headers);
                main.progress = 'failed';
                main.progresstype = 'danger';
            };
            uploader.onCancelItem = function (fileItem, response, status, headers) {
                console.info('onCancelItem', fileItem, response, status, headers);
            };
            uploader.onCompleteItem = function (fileItem, response, status, headers) {
                console.info('onCompleteItem', fileItem, response, status, headers);
                alertify.success(response);
                // main.handleFiles(main.bufferedfile);
                // $timeout(function () {
                //   try { alertify.log('extracting text'); $pdftotxt($scope.phd).then(function (phd) { $scope.phd = phd; alertify.alert('history for US' + $scope.phd.patent.number + 'has been processed and delivered to your account'); }); }
                //   catch (ex) { console.log(ex); alertify.error('Im sorry... something went wrong with the extraction... please try again...');}
                //   finally { return; }

                //         }, 5000);
            };
            uploader.onCompleteAll = function () {
                console.info('onCompleteAll');
            };

            console.info('uploader', uploader);
            //main.progressbarfn = progressfunction(length);

            function progressfunction(length) {
                main.n = 0;
                main.progresstwo = 0;
                main.progressdisplay = 1;
                main.extractedfiles = length;
                $interval(function () {
                    main.progressdisplay++;
                }, 200, length);


            };
            main.treeFilter = $filter('uiTreeFilter');
            main.toggle = function () {
                main.checked = !main.checked;
            };
            main.phd = {};
            var appnum = config.appnum;
            var attorney = appnum + '/' + appnum + '-address_and_attorney_agent.tsv';
            var application = appnum + '/' + appnum + '-application_data.tsv';
            var continuity = appnum + '/' + appnum + '-continuity_data.tsv';
            var foreign = appnum + '/' + appnum + '-foreign_priority.tsv';
            var transaction = appnum + '/' + appnum + '-transaction_history.tsv';
            var term = appnum + '/' + appnum + '-patent_term_adjustments.tsv';
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
                    label: 'term',
                    value: term
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
                        $log.error(ex);
                    } finally {
                        if (file.label === 'imagefile') {
                            main.phd.imagefile = parseTSV(file.file, opts);
                            main.progresstwo++;
                        } else if (file.label === 'application') {
                            var outerarray = parseTSV(file.file, { skipEmptyLines: true });

                            var newobj = {};
                            angular.forEach(outerarray, function (innerarray, key) {
                                if (innerarray[0] == 'Class / Subclass') {
                                    newobj['Class Subclass'] = innerarray[1];
                                } else {
                                    newobj[innerarray[0]] = innerarray[1];
                                }



                                main.phd.application = newobj;

                            });
                            main.progresstwo++;



                        } else if (file.label === 'attorney') {
                            main.phd.attorney = parseTSV(file.file, { skipEmptyLines: true });
                            main.progresstwo++;
                        } else if (file.label === 'foreign') {
                            main.phd.foreign = parseTSV(file.file, opts, false);
                            main.progresstwo++;
                        } else if (file.label === 'continuity') {
                            main.phd.continuity = parseTSV(file.file, { skipEmptyLines: true });
                            main.progresstwo++;
                        } else if (file.label === 'transaction') {
                            main.phd.transaction = parseTSV(file.file, opts, false);
                            main.progresstwo++;
                        } else if (file.label === 'README') {
                            main.info = file.file;
                            main.progresstwo++;
                        } else if (file.label === 'term') {
                            main.phd.term = parseTSV(file.file, { skipEmptyLines: true });
                            main.progresstwo++;
                        } else {
                            main.error = 'Unhandled case!';
                            alertify.error('unhandled case!');
                            deffered.reject('unhandled case!');
                        }
                        return deffered.resolve(main.phd);
                    }
                });
                return deffered.promise;

            };
            main.styleClass = 'panel-primary';
            main.size = '450px';
            main.checked = false;


            main.getpatentdownload = function (pnum) {
                $(document.createElement('iframe')).attr('name', 'fframe').appendTo('body');
                var patgoog = function (pnum) {
                    return $window.open('https://patentimages.storage.googleapis.com/pdfs/US' + pnum + '.pdf', 'fframe', 'resizable=no,status=no,location=no,toolbar=no,menubar=no,fullscreen=no,scrollbars=no,dependent=yes,width=400,left=150,height=30,top=150');
                }
                patgoog(pnum);
            };
            main.getpublishedapplication = function (y, num) {
                $(document.createElement('iframe')).attr('name', 'fframe').appendTo('body');
                $window.open('https://patentimages.storage.googleapis.com/pdfs/US' + y + num + '.pdf', 'fframe', 'resizable=no,status=no,location=no,toolbar=no,menubar=no,fullscreen=no,scrollbars=no,dependent=yes,width=400,left=150,height=30,top=150');
            };
            var wingoog, winreed;
            main.getfilehistory = function (appnum, provider) {

                // var winreed = function(appnum) {
                //     return $window.open('https://patents.reedtech.com/downloads/pair/' + appnum + '.zip', '_blank', 'resizable=no,status=no,location=no,toolbar=no,menubar=no,fullscreen=no,scrollbars=no,dependent=yes,width=400,left=150,height=30,top=150');
                // };
                // var wingoog = function(appnum) {
                //     return $window.open('https://storage.googleapis.com/uspto-pair/applications/' + appnum + '.zip', '_blank', 'resizable=no,status=no,location=no,toolbar=no,menubar=no,fullscreen=no,scrollbars=no,dependent=yes,width=400,left=550,height=30,top=150');
                // };
                if (provider === 'reedtech') { winreed(); }
                else { wingoog(); }

            };

            main.remoteconfig = function (pnum) {
                $('#googlebutton').addClass('fa-spin fa-spinner').removeClass('fa-file-zip-o text-danger');
                $('#reedtechbutton').addClass('fa-spin fa-spinner').removeClass('fa-file-zip-o text-danger');
                $http.get('/getphd/patents/' + pnum).then(function (resp) {
                    var data = resp.data;
                    //                    config.appnum = resp.data.application_number.slice(3,resp.data.application_number.length).replace('/','').replace(',','');
                    config.appnum = resp.data.application_number.replace(/\D/ig, '');
                    $scope.response = resp.data;
                    var googleurl = 'https' + '://' + 'lexlab.io' + '/proxy/storage.googleapis.com/uspto-pair/applications/' + config.appnum + '.zip';
                    var reedtechurl = 'https' + '://' + 'lexlab.io' + '/proxy/patents.reedtech.com/downloads/pair/' + config.appnum + '.zip';
                    var optionsr = {
                        method: 'HEAD',
                        url: reedtechurl
                    };
                    // JSZipUtils.getBinaryContent(googleurl, function(err, data) {
                    //     if(err) {
                    //         $('#googlebutton').addClass('fa-close text-danger').removeClass('fa-spin fa-spinner fa-file-zip-o');
                    //     }else{
                    //         $('#googlebutton').addClass('fa-check text-success').removeClass('fa-spin fa-spinner text-danger fa-file-zip-o fa-close');
                    //         wingoog = function(){
                    //           $window.open('https://storage.googleapis.com/uspto-pair/applications/' + appnum + '.zip', '_blank', 'resizable=no,status=no,location=no,toolbar=no,menubar=no,fullscreen=no,scrollbars=no,dependent=yes,width=400,left=550,height=30,top=150');
                    //         var zip = new JSZip(data);
                    //         var blob = zip.generate({type: 'blob'});
                    //         saveAs(blob, config.appnum + '.zip');
                    //         };
                    //     }
                    // });
                    var optionsg = {
                        method: 'HEAD',
                        url: googleurl
                    };
                    $http(optionsg).then(function (resp) {
                        if (resp.status !== 200) {
                            $('#googlebutton').addClass('fa-close text-danger').removeClass('fa-spin fa-spinner fa-file-zip-o');
                        } else if (resp.status == 200) {
                            $('#googlebutton').addClass('fa-check text-success').removeClass('fa-spin fa-spinner text-danger fa-file-zip-o fa-close');
                            wingoog = function () {
                                $window.open('https://storage.googleapis.com/uspto-pair/applications/' + appnum + '.zip', '_blank', 'resizable=no,status=no,location=no,toolbar=no,menubar=no,fullscreen=no,scrollbars=no,dependent=yes,width=400,left=550,height=30,top=150');
                            };
                        }
                    });
                    $http(optionsr).then(function (resp) {
                        if (resp.status !== 200) {
                            $('#reedtechbutton').addClass('fa-close text-danger').removeClass('fa-spin fa-spinner fa-file-zip-o');
                        } else if (resp.status == 200) {
                            $('#reedtechbutton').addClass('fa-check text-success').removeClass('fa-spin fa-spinner text-danger fa-file-zip-o fa-close');
                            winreed = function () {
                                $window.open('https://patents.reedtech.com/downloads/pair/' + appnum + '.zip', '_blank', 'resizable=no,status=no,location=no,toolbar=no,menubar=no,fullscreen=no,scrollbars=no,dependent=yes,width=400,left=150,height=30,top=150');
                            };
                        }
                    });
                    // JSZipUtils.getBinaryContent(reedtechurl, function(err, data){
                    //     if(err) {
                    //         $('#reedtechbutton').addClass('fa-close text-danger').removeClass('fa-spin fa-spinner fa-file-zip-o');
                    //     }else{
                    //         $('#reedtechbutton').addClass('fa-check text-success').removeClass('fa-spin fa-spinner text-danger fa-file-zip-o fa-close');
                    //         winreed = function(){
                    //             $window.open('https://patents.reedtech.com/downloads/pair/' + appnum + '.zip', '_blank', 'resizable=no,status=no,location=no,toolbar=no,menubar=no,fullscreen=no,scrollbars=no,dependent=yes,width=400,left=150,height=30,top=150');
                    //         var zip = new JSZip(data);
                    //         var blob = zip.generate({type: 'blob'});
                    //         saveAs(blob, config.appnum + '.zip');
                    //         };
                    //     }
                    // });

                });

            };
            main.remotezip = function (appnum) {
                main.error = null;
                main.success = null;
                main.progress = 0;
                main.progresstwo = 0;
                main.extractedfiles = 0;

                config.appnum = appnum;
                extractzip(appnum, main, uploader)
                    .then(function (files) {
                        //    angular.forEach(files.pdffiles, function(file, key){
                        //    uploader.queue.push(file);
                        //    });
                        //$http.get('/getphd/' + appnum);
                        $log.info('Files extracted', files);
                        alertify.log('Files extracted');
                        //toastr.success('Files extracted');
                        main.phd.file = files.tsvfiles;

                        main.parse(files.tsvfiles)

                            .then(function (parsedfiles) {

                                //$log.info('TSV Parsed', parsedfiles);
                                alertify.log('TSV Parsed');
                                //alertify.log('Building ROARmap...');
                                $patentsearch(main.phd, config)
                                    .then(function (patentobj) {
                                        main.phd.patent = patentobj;
                                        $roarmap(parsedfiles, main.phd, main)
                                            .then(function (groupids) {
                                                // $scope.phd.roarmap = roarmap;
                                                //$scope.phd.roarlist = roarmap.collections;
                                                alertify.success('ROARmap built!');

                                                main.finalize(main.phd, groupids);


                                            }, function (reason) {
                                                console.log(reason.message);
                                            });

                                    }, function (reason) {
                                        console.log(reason.message);
                                    });




                            }, function (reason) {

                                console.log(reason.message);

                            });

                    }, function (reason) {

                        console.log(reason.messsage);
                    });
                // $http.get('https://storage.googleapis.com/uspto-pair/applications/' + appnum + '.zip').then(function(resp) {
                //   console.log(resp);
                //   alertify.log(resp.headers);

                //   var zip = new JSZip(resp.data);
                //   main.remoteresp = zip;
                //   main.handleFiles(zip);
                // });

            };

            main.format = function (ref) {
                return ref.slice(0, ref.lastIndexOf('-'));
            };

            main.buffer = function (file) {
                main.bufferedfile = file;
            };
            // main.file = {};
            main.success = null;

            main.info = null;
            main.phd = {};
            main.handleFiles = function (file) {
                main.error = null;
                main.success = null;
                main.progresstwo = 0;
                main.extractedfiles = 0;
                //toastr.success('starting extraction...');
                extractpdf(file, config.APPNUM, main)
                    .then(function (files) {


                        $log.info('Files extracted', files);
                        alertify.log('Files extracted');
                        //toastr.success('Files extracted');
                        main.phd.file = files.tsvfiles;

                        main.parse(files.tsvfiles)

                            .then(function (parsedfiles) {

                                //$log.info('TSV Parsed', parsedfiles);
                                alertify.log('TSV Parsed');
                                //alertify.log('Building ROARmap...');
                                $patentsearch(main.phd.application, config)
                                    .then(function (patentobj) {
                                        main.phd.patent = patentobj;
                                        $roarmap(parsedfiles, main.phd, main)
                                            .then(function (groupids) {
                                                // $scope.phd.roarmap = roarmap;
                                                //$scope.phd.roarlist = roarmap.collections;
                                                alertify.success('ROARmap built!');

                                                main.finalize(main.phd, groupids);


                                            }, function (reason) {
                                                console.log(reason.message);
                                            });

                                    }, function (reason) {
                                        console.log(reason.message);
                                    });




                            }, function (reason) {

                                console.log(reason.message);

                            });

                    }, function (reason) {

                        console.log(reason.messsage);
                    });


            };
            main.pop = function (link) {
                var divpanel = angular.element('<div/>').attr('class', 'issuedocpanel stacker');
                //var header = angular.element('<h4 class='splash'>' + event.rid + ' - ' + event.name + '<span class='fa fa-close btn btn-xs btn-danger' style='float: right;' onclick='$(this).parent().parent().remove()'></span></h4><h6>' + event.media + '</h6>');
                var roarevent = { title: link.slice(link.lastIndexOf('/') + 1, link.length) };
                $scope.roarevent = roarevent;
                var header = $templateCache.get('{widgetsPath}/getphd/src/titleTemplate.html');

                var skope = angular.element('<img/>').attr('class', 'img img-responsive img-shadow').attr('src', link);

                angular.element('body').append($compile(divpanel.append(header).append(skope))($scope));
                $('.issuedocpanel').draggable({
                    stack: '.stacker',
                    handle: 'h4'
                }).resizable();

            };
            $scope.openFullScreen = function (roareventid) {
                // alertify.log(roareventid);
                // Fullscreen.toggleAll();
                if ($scope.fullscreen !== true) {
                    $('.issuedocpanel').css({ 'position': 'absolute', 'top': '0px', 'left': '0px', 'bottom': '0px', 'right': '0px', 'width': '100%', 'z-index': '100000' });
                    $('.fa-expand').addClass('fa-compress').removeClass('fa-expand');
                    $scope.fullscreen = true;
                }
                else {
                    $('.issuedocpanel').css({ 'position': 'absolute', 'top': '6rem', 'left': '10rem', 'bottom': '0rem', 'right': '75rem', 'width': 'initial', 'z-index': '9999' });

                    $('.fa-compress').addClass('fa-expand').removeClass('fa-compress');
                    $scope.fullscreen = false;
                }
                //                roar.openmodal(this);
            };
            main.pushtoqueue = function (record) {
                var queue = $firequeue();
                var application = record['Filename'].slice(0, record['Filename'].indexOf('-'));
                var id = record['Filename'].slice(0, record['Filename'].lastIndexOf('-'));
                queue.$add({ 'id': id, 'name': id, 'file': '/opt/files/public/uspto/' + application + '/' + application + '-image_file_wrapper/' + record['Filename'] });

            };
            main.poppatent = function (patent) {
                var divpanel = angular.element('<div/>').attr('class', 'issuedocpanel stacker');
                //var header = angular.element('<h4 class='splash'>' + event.rid + ' - ' + event.name + '<span class='fa fa-close btn btn-xs btn-danger' style='float: right;' onclick='$(this).parent().parent().remove()'></span></h4><h6>' + event.media + '</h6>');
                var roarevent = patent;
                $scope.roarevent = roarevent;
                var header = $templateCache.get('{widgetsPath}/getphd/src/titleTemplate.html');

                var skope = angular.element('<embed/>').attr('class', 'img img-responsive img-shadow').attr('src', patent.media);

                angular.element('body').append($compile(divpanel.append(header).append(skope))($scope));
                $('.issuedocpanel').draggable({
                    stack: '.stacker',
                    handle: 'h4'
                }).resizable();

            };
            main.popdoc = function (imgrecord) {

                var divpanel = angular.element('<div/>').attr('class', 'issuedocpanel stacker');
                //var header = angular.element('<h4 class="splash">' + event.rid + ' - ' + event.name + '<span class="fa fa-close btn btn-xs btn-danger" style="float: right;" onclick="$(this).parent().parent().remove()"></span></h4><h6>' + event.media + '</h6>');
                var header = $templateCache.get('{widgetsPath}/getphd/src/titleTemplate.html');

                var skope = angular.element('<iframe/>').attr('height', '680px').attr('src', 'https://lexlab.io/files/public/uspto/' + $scope.phd.appnum + '/' + $scope.phd.appnum + '-image_file_wrapper/' + imgrecord['Filename']);

                angular.element('body').append($compile(divpanel.append(header).append(skope))($scope));
                $('.issuedocpanel').draggable({
                    stack: '.stacker',
                    handle: 'h4'
                }).resizable();

            };
            main.finalize = function (phd, groupids) {
                //$scope.phd.title = $scope.phd.application['Title of Invention'];

                var appnum = angular.copy(phd.application['Application Number']).replace('/', '').replace(',', '').replace(',', '');
                var phdref = Collection($scope.phd.id).$ref();
                var dashboards = Collection($stateParams.pageid);
                var dashboardsref = dashboards.$ref();
                //  var phdref = Collection(phd.id).$ref();
                var projref = Collection($stateParams.pId).$ref();

                var d = new Date();
                var dd = d.getTime();
                var patentdigest = {
                    id: dd,
                    title: 'US ' + $filter('number')(phd.patent.id, 0),
                    rid: 'PHD5',
                    styleClass: 'NOA',
                    sortOrder: 5,
                    rows: [{ styleClass: 'leather', columns: [{ cid: dd + 5, style: 'col-sm-12', widgets: [{ config: { id: dd, PNUM: phd.patent.id }, type: 'patent', styleClass: 'NOA', wid: dd + 10 }] }] }]
                }
                Collection(dd).$ref().set(patentdigest);




                // phdref.update({
                //   appnum: appnum,
                //   media: 'https://lexlab.io/files/public/uspto/index#?app=' + appnum,
                //   title: 'PhD for ' + (phd.application['Patent Number'] || phd.patent.number),
                //   styleClass: 'NOA',
                //   rid: 'PHD'
                // });
                phd.appnum = appnum;
                phd.media = 'https://lexlab.io/patents/US' + phd.patent.id + '/preview';
                phd.title = 'PhD for ' + $filter('number')(phd.patent.id);
                phd.description = 'USSN ' + phd.application['Application Number'];
                phd.styleClass = 'Applicant';
                phd.rid = 'PHD';
                phd.icon = 'fa-balance-scale';

                //dashboardsref.update({ styleClass: 'Applicant', title: 'PhD Report for US '+ (phd.patent.number || phd.application['Patent Number'])});
                // dashboardsref.update(phd);
                //dashboardsref.child('roarlist').child($stateParams.pageid).set($stateParams.pageid);

                angular.forEach(groupids, function (id, key) {
                    /*-- create internal report pages --*/// phdref.child('roarlist').child(id).set(id);
                    phd.roarlist[id] = id;
                    /*-- create pages in tab/binder--*/
                    //dashboardsref.child('roarlist').child(id).set(id);
                    /*-- create tabs/binders in project --*/  //projref.child('roarlist').child(id).set(id);
                    //var selfref = Collection(id).$ref();
                    ///selfref.update({ media: phd.patent.media });
                });
                //  dashboardsref.child('roarlist').child(groupids[0]).set(groupids[0]);
                //  projref.child('roarlist').child(groupids[1]).set(groupids[1]);
                //  projref.child('roarlist').child(groupids[2]).set(groupids[2]);
                //  projref.child('roarlist').child(groupids[3]).set(groupids[3]);
                //   Collection($scope.phd.id).$loaded().then(function (report) {
                //     var rows = angular.copy(report.rows);
                //     dashboardsref.child('rows').set(rows);

                //   });
                phd.roarlist[dd] = dd;
                phd.content = phd.content + ckender;
                localStorageService.set(phd.application['Application Number'], phd);
                // $http.post('/getphd/store/' + appnum, phd);
                phdref.update(phd);
                // $http.get('https://lexlab.io/proxy/lexlab.io/publisher/download/'+phdref.key()).then(function(resp){
                // var blob = new Blob([resp.data],{type: 'blob'});
                //             saveAs(blob, config.APPNUM + '.epub');

                // });
                $rootScope.$broadcast('BUILDTABS');
                alertify.alert('<div class="card-header"><h1 class="card-title">Prosecution History Digest for US ' + phd.patent.number + '</h1></div><div class="card-block"><h6 class="card-text lead">All files have been successfully processed by LEO and delivered to your account for review.</h6></div>');
                main.showupload = false;

            };

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
    ]).directive('ffFileSelect', [function () {

        return {
            restrict: 'A',
            controller: 'MainCtrl',
            controllerAs: 'main',
            bindToController: true,
            scope: false,
            link: function ($scope, el, attr, ctrl) {
                var main = ctrl;
                el.on('change', function (e) {

                    main.file = (e.srcElement || e.target).files[0];
                    main.getFile();
                });

            }

        };
    }])
    .factory('$patentsearch', ['$q', 'filepickerService', '$http', '$document', 'ckstarter', 'ckender', '$compile', '$templateCache', '$rootScope', function ($q, filepickerService, $http, $document, ckstarter, ckender, $compile, $templateCache, $rootScope) {

        return function (phdobj, config) {
            var deferred = $q.defer();
            if (config.PNUM && config.PNUM > 0) {
                searchforpatent(phdobj, config.PNUM);
            }
            else if (config.IPANUM) {
                searchforpatent(phdobj, config.IPAYEAR + config.IPANUM);
            }
            return deferred.promise;

            function searchforpatent(phdobj, pnum) {
                var patentnumber = pnum || angular.copy(phdobj.application['Patent Number']).replace(',', '').replace(',', '');
                //var applicationnumber = phdobj['Appliction Number'];
                var pdfstorageuri = 'https://patentimages.storage.googleapis.com/pdfs/US' + patentnumber + '.pdf';

                // var patent = {
                //   number: patentnumber,
                //   media: pdfstorageuri
                // };

                var googlepage = function (patentnumber) {
                    filepicker.storeUrl(
                        'https://www.google.com/patents/US' + patentnumber,
                        {},
                        function (Blob) {
                            return googlepagetext(Blob);

                        });
                };
                var googlepagetext = function (Blob) {
                    filepicker.convert(
                        Blob,
                        { format: 'txt' },
                        function (new_Blob) {
                            return patent.googletext = new_Blob.url;
                        });
                };


                filepicker.storeUrl(
                    pdfstorageuri.toString(),
                    { filename: 'US' + patentnumber + '.pdf' },
                    function (Blob) {

                        $http.get('/getphd/patents/' + patentnumber).then(function (resp) {
                            var patent = resp.data;
                            patent.number = patentnumber;
                            patent.media = Blob.url;
                            patent.filename = 'US' + patentnumber + '.pdf';
                            //patent.title = phdobj['Title of Invention'] || null;

                            patent.google = 'https://www.google.com/patents/US' + patentnumber;
                            patent.rid = 'P1';
                            //if (phdobj['Issue Date of Patent'] !== '-') { patent.date = phdobj['Issue Date of Patent']; } else { patent.date = '1899-12-31'; }
                            patent.styleClass = 'NOA';
                            patent.name = 'US' + patentnumber;
                            //patent.description = phdobj['Title of Invention'];
                            var maildate = new Date(patent.issued);
                            var roardate = maildate.toDateString();
                            var noatemplate = '<div class="container-fluid two-col-left">' +
                                '<div class="row two-col-left">' +
                                '<div class="col-xs-4 col-sidebar"><a pop="true" src="https://lexlab.io/patents/US' + patent.number + '/preview"><img src="https://lexlab.io/patents/US' + patent.number + '/preview" class="img img-responsive img-shadow"/></a></div>' +
                                '<div class="col-xs-8 col-main"><div class="bs-callout bs-callout-NOA bs-callout-reverse"><h4>' + patent.title + '</h4><p>Filed ' + roardate + '</p><p>' + patent.abstract + '</p><cite>' + patent.filename + '&nbsp;&nbsp;<a pop="true" href="' + patent.media + '" target="fframe"><i class="fa fa-external-link"></i></a></cite></div></div>' +
                                '</div>' +
                                '</div>';
                            var wraphead = ckstarter;

                            var wraptail = ckender;
                            var contenttemplate = '<p class="card-text">' + patent.text + '</p>';
                            var poodle = angular.element(noatemplate);
                            angular.forEach(patent.drawings, function (drawingurl, key) {
                                var image = document.createElement('img');
                                var a = document.createElement('a');
                                var wrap = $(image).attr('src', patent.thumbnails[key]).wrap($(a).attr('href', drawingurl).attr('target', 'fframe'));
                                poodle.append(wrap);


                            });
                            patent.content = wraphead + $(poodle).html() + contenttemplate + wraptail + '<patentreport patent="' + patent.number + '"></patentreport></body></html>';
                            //var a = $rootScope.$new();
                            //a.patent = patent;
                            //phdobj.content = wraphead + $(angular.element($compile($templateCache.get('{widgetsPath}/getphd/src/phd/patentReport.html'))(a))).html();
                            deferred.resolve(patent);
                        });
                    });
                //patentobj.srcdoc = googlepage(patentnumber) || null;
                // googlepage(patent.number);
                // filepicker.convert(
                //   Blob,
                //   { format: 'txt' },
                //   function (new_Blob) {

                //     patent.txt = new_Blob.url;
                //     return deferred.resolve(patent);
                //   });

                // });
            }
        };
    }])
    .factory('$pdftotxt', ['$q', 'filepickerService', 'Collection', function ($q, filepickerService, Collection) {
        return function (phd) {
            var deferred = $q.defer();
            getxt(phd);
            return deferred.promise;

            function getxt(phd) {
                var meritscollectionid = phd.roarmap.collections[1].id || phd.roarmap.collections[1];
                Collection(meritscollectionid).$loaded().then(function (collection) {
                    var mlist = collection.roarlist;
                    angular.forEach(mlist, function (roarevent, key) {
                        Collection(key).$loaded().then(function (roarevent) {
                            filepicker.storeUrl(roarevent.selflink,
                                { filename: roarevent.filename },
                                function (Blob) {
                                    filepicker.convert(
                                        Blob,
                                        { format: 'txt' },
                                        function (new_Blob) {
                                            roarevent.txt = new_Blob.url;
                                            roarevent.$save();
                                            alertify.success('text file added for' + roarevent.title);

                                        }
                                    );

                                }
                            );
                        });
                    });
                });
                return deferred.resolve(phd);
            }
        };
    }])
    .directive('pop', ['$compile', '$templateCache', function ($compile, $templateCache) {
        return {
            restrict: 'AC',
            link: function ($scope, $el, $attr, $ctrl) {
                var popdoc = function () {

                    var divpanel = angular.element('<div/>').attr('class', 'issuedocpanel stacker');
                    //var header = angular.element('<h4 class="splash">' + event.rid + ' - ' + event.name + '<span class="fa fa-close btn btn-xs btn-danger" style="float: right;" onclick="$(this).parent().parent().remove()"></span></h4><h6>' + event.media + '</h6>');
                    var header = $templateCache.get('{widgetsPath}/getphd/src/titleTemplate.html');
                    //var header = $('#docheader').html();
                    var skope = angular.element('<iframe/>').attr('height', '60vh').attr('src', $attr.href);

                    angular.element('body').append($compile(divpanel.append(header).append(skope))($scope));
                    $('.issuedocpanel').draggable({
                        stack: '.stacker',
                        handle: 'h4'
                    }).resizable();
                    $('img').on('dblclick', function (e) {
                        $('.issuedocpanel').remove();
                        $scope.$destroy();
                    });

                };
                $el.on('click', function (e) {
                    e.preventDefault();
                    popdoc();
                });
            }
        };
    }])
    .directive('uploadQ', ['FileUploader', function (FileUploader) {
        return {
            restrict: 'EA',
            template: '<div class="card"><input type="file" nv-file-select="" uploader="uploader" multiple /> <h3>Upload queue</h3> <p>Queue length: {{ uploader.queue.length }}</p> <table class="table"> <thead> <tr> <th width="50%">Name</th> <th ng-show="uploader.isHTML5">Size</th> <th ng-show="uploader.isHTML5">Progress</th> <th>Status</th> <th>Actions</th> </tr> </thead> <tbody> <tr ng-repeat="item in uploader.queue"> <td><strong>{{ item.file.name }}</strong></td> <td ng-show="uploader.isHTML5" nowrap>{{ item.file.size/1024/1024|number:2 }} MB</td> <td ng-show="uploader.isHTML5"> <div class="progress" style="margin-bottom: 0;"> <div class="progress-bar" role="progressbar" ng-style="{ \'width\': item.progress + \'%\' }"></div> </div> </td> <td class="text-center"> <span ng-show="item.isSuccess"><i class="glyphicon glyphicon-ok"></i></span> <span ng-show="item.isCancel"><i class="glyphicon glyphicon-ban-circle"></i></span> <span ng-show="item.isError"><i class="glyphicon glyphicon-remove"></i></span> </td> <td nowrap> <button type="button" class="btn btn-success btn-xs" ng-click="item.upload()" ng-disabled="item.isReady || item.isUploading || item.isSuccess"> <span class="glyphicon glyphicon-upload"></span> Upload </button> <button type="button" class="btn btn-warning btn-xs" ng-click="item.cancel()" ng-disabled="!item.isUploading"> <span class="glyphicon glyphicon-ban-circle"></span> Cancel </button> <button type="button" class="btn btn-danger btn-xs" ng-click="item.remove()"> <span class="glyphicon glyphicon-trash"></span> Remove </button> </td> </tr> </tbody> </table> <div> <div> Queue progress: <div class="progress" style=""> <div class="progress-bar" role="progressbar" ng-style="{ \'width\': uploader.progress + \'%\' }"></div> </div> </div> <button type="button" class="btn btn-success btn-s" ng-click="uploader.uploadAll()" ng-disabled="!uploader.getNotUploadedItems().length"> <span class="glyphicon glyphicon-upload"></span> Upload all </button> <button type="button" class="btn btn-warning btn-s" ng-click="uploader.cancelAll()" ng-disabled="!uploader.isUploading"> <span class="glyphicon glyphicon-ban-circle"></span> Cancel all </button> <button type="button" class="btn btn-danger btn-s" ng-click="uploader.clearQueue()" ng-disabled="!uploader.queue.length"> <span class="glyphicon glyphicon-trash"></span> Remove all </button> </div> </div>',
            controller: 'AppController',
            controllerAs: 'uploader',
            bindToController: true,
            scope: { url: '@' },
            link: function ($scope, $elem, $attr, $ctrl) {

            }

        };
    }]).controller('AppController', ['$scope', 'FileUploader', function ($scope, FileUploader) {
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
        };
        uploader.onCompleteAll = function () {
            console.info('onCompleteAll');
        };

        console.info('uploader', uploader);
    }])
    .controller('GalleryCarouselController', ['$scope', 'config', 'Collection', '$rootScope', '$ACTIVEROAR', function ($scope, config, Collection, $rootScope, $ACTIVEROAR) {
        var gallery = this;
        var config = config;
        $scope.config = config;
        gallery.slides = [];
        if (config.id) {
            Collection(config.id).$loaded().then(function (collection) {
                angular.forEach(collection.roarlist, function (item, key) {
                    Collection(item).$loaded().then(function (slide) {
                        gallery.slides.push(angular.copy(slide));
                    });
                });
            });
        }
        else {
            Collection($ACTIVEROAR.page).$loaded().then(function (collection) {
                angular.forEach(collection.roarlist, function (item, key) {
                    Collection(item).$loaded().then(function (slide) {
                        gallery.slides.push(angular.copy(slide));
                    });
                });
            });
            gallery.slides.push({ title: 'DemoSlide', media: '/llp_core/img/lexlab.svg' })
            gallery.slides.push({ title: 'PatentPhD', media: '/llp_core/img/logolong.png' });
        }
    }])
    .controller('GalleryCarousel', ['', function () { }]).directive('ngThumb', ['$window', function ($window) {
        var helper = {
            support: !!($window.FileReader && $window.CanvasRenderingContext2D),
            isFile: function (item) {
                return angular.isObject(item) && item instanceof $window.File;
            },
            isImage: function (file) {
                var type = '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        };

        return {
            restrict: 'A',
            template: '<canvas/>',
            link: function (scope, element, attributes) {
                if (!helper.support) return;

                var params = scope.$eval(attributes.ngThumb);

                if (!helper.isFile(params.file)) return;
                if (!helper.isImage(params.file)) return;

                var canvas = element.find('canvas');
                var reader = new FileReader();

                reader.onload = onLoadFile;
                reader.readAsDataURL(params.file);

                function onLoadFile(event) {
                    var img = new Image();
                    img.onload = onLoadImage;
                    img.src = event.target.result;
                }

                function onLoadImage() {
                    var width = params.width || this.width / this.height * params.height;
                    var height = params.height || this.height / this.width * params.width;
                    canvas.attr({ width: width, height: height });
                    canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
                }
            }
        };
    }])
    .controller('PatentWidgetCtrl', ['$scope', 'config', '$http', 'Collection', '$q', '$filter','$sanitize',
    function ($scope, config, $http, Collection, $q, $filter,$sanitize) {
        var p = this;
        p.getdata = function (input) {
            var deferred = $q.defer();
            $http.get('/getphd/patents/' + input).then(function (resp) {
                return deferred.resolve(resp.data);
            });
            return deferred.promise;
        };
        p.sanitize = $sanitize;
        p.showconfig = false;
        p.showform = false;
        var config = $scope.$parent.config || $scope.$parent.$parent.config;
        var collection = Collection(config.id);
        collection.$bindTo($scope, 'collection');
        //$scope.collection = collection;
        $scope.config = config;
        p.configure = function (input) {
            var trop = $filter('strip')(input);
            config.IPAYEAR = trop.slice(0, 4);
            config.IPANUM = trop.slice(4, trop.length);
            return trop;
        };
        p.preparescope = function (apdata, pdata) {
            pdata.application_data = apdata;
            $scope.patent = pdata;
            // p.claims = { class: 'super-independent', id: 'claims', text: 'claims', name: 'claims', children: pdata.claims };
            p.showform = false;
            p.showconfig = false;
        };
        p.getnew = function (input) {
            p.getdata(input).then(function (pdata) {
                if (pdata.pub !== undefined) {
                    var trop = p.configure(pdata.pub);
                    p.getdata(trop).then(function (apdata) {
                        p.preparescope(apdata, pdata);
                    });
                }
                else {
                    p.preparescope(null, pdata);
                }
            });
        };
        p.getload = function (input) {
            Collection(input).$loaded().then(function (pdata) {
                if (pdata.pub !== undefined) {


                    var trop = p.configure(pdata.pub);
                    Collection(trop).$loaded().then(function (apdata) {
                        p.preparescope(apdata, pdata);
                    });
                } else {
                    p.preparescope(null, pdata);
                }
            });
        };

        if (config.PNUM > 1000000) {
             try {
                 p.getnew(config.PNUM);
             }
             catch (ex) {
                 var combo = config.IPAYEAR + config.IPANUM;
                // p.getdata(combo);
             }
             finally {
                 alertify.success('loaded');
             }
         }

    }])
    .directive('claimtree', function () {
        return {
            restrict: 'E',
            templateUrl: '/getphdwidget/src/phd/claimtree.html',
            scope: {
                tree: '=',
                query: '='
            },
            link: function ($scope, $element, $attr) {

            }
        };
    })
    .filter('citationcheck', function () {
        return function (input) {
            var check = function (input) {
                var regex = new RegExp(/\<a\s/ig);
                //var matches = input.match(regex);
                // matches.forEach(function(value, index, arra){
                //     input.replace(regex, '<a pop ');
                // })
                return input.replace(regex, '<a pop ');
            };
            return check(input);
        };
    }).directive('capturelinks',function(){
        return {
            restrict:'A',
            link: function($scope, $element, $attr){
                var links = $('a');
                links.on('click', function(event){
                    event.preventDefault();
                });
            }
        };
    }).directive('rejectionset', function(){
      return {
        restrict: 'EA',
        templateUrl: '{widgetsPath}/getphd/src/rejectionset.html',
        scope: {
          set: '='
        },
        link: function($scope, $element, $attr, $ctrl){

        }
      };
    }).directive('rejection', function(){
      return {
        restrict: 'EA',
        templateUrl: '{widgetsPath}/getphd/src/rejection.html',
        scope: {
          rejection: '='
        },
        link: function($scope, $element, $attr, $ctrl){

        }
      };
    })


    .controller('MetadataController', function(Collection, config, $scope, $stateParams){
      var config = $scope.$parent.config || $scope.$parent.$parent.config;
      $scope.config = config;
      var pId = $stateParams.pId;
      var tree = Collection(pId);
      $scope.tree = tree;
      $scope.onSubmit = function(model){
        Collection(config.id).$save(model);
      };
    });
