(function(window, undefined) {'use strict';


angular.module('adf.widget.getphd', ['adf.provider', 'llp.extract',
    'fa.droppable', 'llp.parsetsv', 'roar', 'textSizeSlider', 'llp.pdf', 'LocalStorageModule', 'llp.extractpdf', 'firebase', 'xeditable', 'ui.tree', 'ngAnimate', 'ngAnnotateText', 'ngDialog', 'ngSanitize', 'pdf', 'toastr', 'mentio', 'diff', 'door3.css', 'checklist-model', 'angular-md5', 'angular.filter', 'ngFileUpload'
]).config(["dashboardProvider", "localStorageServiceProvider", function (dashboardProvider, localStorageServiceProvider) {

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

}])

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


    .controller('MetadataController', ["Collection", "config", "$scope", "$stateParams", function(Collection, config, $scope, $stateParams){
      var config = $scope.$parent.config || $scope.$parent.$parent.config;
      $scope.config = config;
      var pId = $stateParams.pId;
      var tree = Collection(pId);
      $scope.tree = tree;
      $scope.onSubmit = function(model){
        Collection(config.id).$save(model);
      };
    }]);

angular.module("adf.widget.getphd").run(["$templateCache", function($templateCache) {$templateCache.put("{widgetsPath}/getphd/src/edit.html","<form role=form ng-submit=collection.$save()><fieldset class=\"material Applicant\"><input type=text placeholder=1234567 ng-model=config.PNUM><hr><label>Enter a Patent Number</label></fieldset><br><fieldset class=\"material Petition\"><input type=text placeholder=YYYY ng-model=config.IPAYEAR><hr><label>Enter a Published Patent Application YEAR</label></fieldset><fieldset class=\"material Petition\"><input type=text placeholder=1234567 ng-model=config.IPANUM><hr><label>Enter a Published Patent Application Number</label></fieldset></form>");
$templateCache.put("{widgetsPath}/getphd/src/editfulltext.html","<form role=form><div class=form-group ui-tree><label for=draftid>Select Document</label><ol ui-tree-nodes ng-model=tree.roarlist><li ui-tree-node ng-repeat=\"node in tree.roarlist\" ng-include=\"\'quicklinkid\'\" node={{node}} data-collapsed=true></li></ol><script type=text/ng-template id=quicklinkid><div class=\"card card-rounded\" ng-class=\"{\'text-success\': (config.id === node.id)}\"> <a class=\"btn btn-xs\" ng-click=\"toggle(this)\" ng-if=\"node.roarlist\" style=\"\"><span class=\"fa \" ng-class=\"{\'fa-chevron-right\': collapsed, \'fa-chevron-down\': !collapsed}\" style=\"color:steelblue;transition:all 0.25s ease;\"></span></a> <a ng-click=\"config.id = node.id;$close();\" ng-class=\"{\'text-success\': (config.id === node.id)}\" class=\"\"><span class=\"fa fa-stack fa-pull-left fa-border\"><span class=\"fa fa-stack-2x fa-file-o\"><span class=\"fa fa-stack-1x\" style=\"font-size: 10px;vertical-align:bottom;\">{{node.rid}}</span></span></span>&nbsp;&nbsp;{{node.title}}<br><small class=\"text-muted\">{{node.date | date}}</small></a> </div> <ol ui-tree-nodes=\"\" ng-model=\"node.roarlist\" ng-class=\"{hidden: collapsed}\" style=\"\"> <li class=\"\" ng-repeat=\"(key, node) in node.roarlist\" ui-tree-node ng-include=\"\'quicklinkid\'\" style=\"padding-right:0rem;padding-bottom:0.1rem;\" node=\"{{node.id || node.$id || node.$value || node}}\" data-collapsed=\"true\"> </li> </ol></script></div></form>");
$templateCache.put("{widgetsPath}/getphd/src/editgallery.html","<form role=form><div class=form-group><label for=sample>Interval, in milliseconds:</label> <input type=number class=form-control ng-model=config.interval><br>Enter a negative number or 0 to stop the interval.</div><div class=form-group><label>Disable Slide Looping</label> <input type=checkbox ng-model=config.nowrap></div><div class=form-group><label>Pause on Hover?</label> <input type=checkbox ng-model=config.pauseonhover></div><div class=form-group><label>Disable Transition</label> <input type=checkbox ng-model=config.transition></div></form>");
$templateCache.put("{widgetsPath}/getphd/src/fulltext.html","<doc-header class=\"container-fluid card two-col-right\" roarid={{roarevent.id}}><div getpdftext={{roarevent.id}} pdf-data={{roarevent.ocrlink}}>&nbsp;</div></doc-header>");
$templateCache.put("{widgetsPath}/getphd/src/gallery.html","<div style=\"min-height: 305px\"><uib-carousel interval=config.interval no-pause={{config.pauseonhover}} no-transition={{config.transition}} no-wrap={{config.nowrap}}><uib-slide ng-repeat=\"slide in gallery.slides\" active={slide.active} index=slide.index><img ng-src={{slide.media}} style=margin:auto;><div class=carousel-caption><h4>Slide {{slide.$index}}</h4><p>{{slide.title}}</p></div></uib-slide></uib-carousel></div>");
$templateCache.put("{widgetsPath}/getphd/src/metadata.html","<div class=\"card-block clearfix\" collection={{config.id}}><form role=form name=form ng-submit=collection.$save()><div class=row><div class=col-sm-8><div class=form-group><label for=dashboardTitle style=\"color: #006699\">Title</label><input type=text class=form-control id=dashboardTitle ng-model=collection.title required></div><div class=row><div class=\"form-group col-sm-6\"><label style=\"color: #006699\">Style</label><br><select ng-model=collection.styleClass ng-options=\"class.value as class.label for class in $root.ROARCLASSES\"></select></div><div class=\"form-group col-sm-6\"><label style=\"color: #006699\">Icon</label><br><select name=icon ng-model=collection.icon ng-options=\"icon.value as icon.label for icon in $root.ICONS\"></select></div></div><div class=row><div class=\"form-group col-sm-6\"><label style=\"color: #006699\">ID#</label><br><input type=text ng-model=collection.rid placeholder=# ng-model-options=\"{updateOn: \'blur\'}\"></div><div class=\"form-group col-sm-6\"><label style=\"color: #006699\">Date</label><br><input type=text ng-model=collection.date placeholder=YYYY-MM-DD ng-pattern=dddd-dd-dd ng-model-options=\"{updateOn: \'blur\'}\"></div></div><div class=form-group><label for=description style=\"color: #006699\">Description</label><br><input type=text class=form-control id=description ng-model=collection.description ng-model-options=\"{updateOn: \'blur\'}\"></div><div class=form-group><label for=url style=\"color: #006699\">URI</label><br><input type=url style=\"width: 100%\" ng-model=collection.media placeholder=\"Path to URL\" ng-model-options=\"{updateOn: \'blur\'}\"></div></div><div class=col-sm-4><roar-event id={{config.id}}></roar-event><input type=submit class=\"btn btn-primary\"></div></div></form></div>");
$templateCache.put("{widgetsPath}/getphd/src/rejection.html","<div colorkey=\"{{rejection.type | trim}}\" class=img-avatar style=display:flex;align-items:center;align-content:center;>{{rejection.type}}</div><div style=min-width:100px;height:100px;><small>over <strong>{{rejection.primary_reference.name}}</strong><br><span ng-if=rejection.secondary_references><em>in view of</em><span ng-repeat=\"ref in rejection.secondary_references\">{{ref.name}}&nbsp;</span></span></small></div><div style=\"min-width: 150px;height:100px;\"><span ng-repeat=\"c in rejection.claims_affected\" style=width:25%;float:left;>{{c}}</span></div><div style=overflow:scroll;text-overflow:ellipsis;><ng-annotate-text text=\"rejection.fulltext | highlight: query\" annotations=rejection.annotations readonly=false popup-controller=\"\'AnnotationController\'\" popup-template-url=\"\'/llp_core/modules/roarmap/partial/roarmap.detail.tpl/roarmap.annotation.tpl.html\'\" tooltip-controller=\"\'AnnotationController\'\" tooltip-template-url=\"\'/llp_core/modules/roarmap/partial/roarmap.detail.tpl/roarmap.annotation-tooltip.tpl.html\'\" on-annotate=onAnnotate on-annotate-delete=onAnnotateDelete on-annotate-error=onAnnotateError on-popup-show=onPopupShow on-popup-hide=onPopupHide popup-offset=50></ng-annotate-text></div>");
$templateCache.put("{widgetsPath}/getphd/src/rejectionset.html","<div ng-repeat=\"rejection in set | orderBy: [\'id\',\'type\'] : maybe\"><div rejection=rejection style=display:flex;flex-direction:row;max-height:100px; class=\"card img-shadow\" data-badger={{rejection.type}}></div></div>");
$templateCache.put("{widgetsPath}/getphd/src/titleTemplate.html","<div class=\"bs-callout bs-callout-{{roarevent.styleClass || \'primary\'}}\" style=z-index:1;padding:0px;><h4><span style=margin-left:25px; ng-bind=roarevent.title></span><br><div class=row style=width:100%;><small style=margin-left:50px; ng-bind=\"roarevent.date | date\"></small> <span class=pull-right style=position:absolute;right:5px;font-size:12px;><a clipboard text=roarevent.media on-copied=\"alertify.success(\'copied!\');\" on-error=\"alertify.error(err,\'uh oh!\')\" onclick=\"alertify.success(\'copied!\')\"><i class=\"fa fa-link\" style=margin:5px;></i></a> <a title=\"collapse widget\" ng-show=\"options.collapsible && !widgetState.isCollapsed\" ng-click=\"widgetState.isCollapsed = !widgetState.isCollapsed\"><i class=\"fa fa-minus\" style=margin:5px;></i></a> <a title=\"expand widget\" ng-show=\"options.collapsible && widgetState.isCollapsed\" ng-click=\"widgetState.isCollapsed = !widgetState.isCollapsed\"><i class=\"fa fa-plus\" style=margin:5px;></i></a> <a title=\"copy to clipboard\" ng-click=edit(roarevent.id)><i class=\"fa fa-copy\" style=margin:5px;></i></a> <a title=\"fullscreen widget\" ng-click=openFullScreen(roarevent.id) ng-show=\"options.maximizable || true\"><i class=\"fa fa-expand\" style=margin:5px;></i></a> <a title=\"pop out\" ng-click=openpreview(roarevent)><i class=\"fa fa-external-link\" style=margin:5px;></i></a> <a title=\"remove widget\" ng-click=remove() onclick=$(this).parent().parent().parent().parent().parent().remove()><i class=\"fa fa-close\" style=margin:5px;></i></a></span></div></h4></div>");
$templateCache.put("{widgetsPath}/getphd/src/view.html","<div ng-controller=\"MainCtrl as main\"><div class=\"card card-primary card-block btn-glass drop-target\" nv-file-drop uploader=uploader drop-files=handleFiles(files) style=\"border: 2px dashed blue;margin: 5px;\" ng-if=main.showupload><div ng-controller=pageslideCtrl><button class=\"row btn btn-glass btn-primary img img-rounded\" style=width:100%;position:relative;display:flex;display:-webkit-flex;align-items:center;align-content:stetch;justify-content:center;flex-direction:row; ng-click=main.toggle() ng-class=\"{\'btn-success\': (main.progress == 100),\'btn-danger\':(main.progress === \'failed\')}\"><uib-progressbar class=\"btn-glass fa fa-3x active stripped\" ng-class=\"{\'active\':(main.progress < 100)}\" ng-if=main.progress value=main.progress style=height:40px;margin:auto;position:relative;display:flex;display:-webkit-flex;align-items:center;align-content:stetch;justify-content:stretch;flex-direction:row;align-self:stretch; type={{main.progresstype}}></uib-progressbar><i class=\"fa fa-upload fa-3x\">{{main.progress}}<span ng-show=main.progress>%</span></i> <img src=https://lexlab.firebaseapp.com/img/GoldLogoLong.svg class=\"img img-rounded pull-right\" style=max-height:100px; ng-if=!main.progress></button><div class=\"row btn btn-glass btn-info\" style=position:relative;display:flex;display:-webkit-flex;align-items:center;align-content:stetch;justify-content:center;flex-direction:row; ng-if=main.progresstwo><uib-progressbar class=\"btn-glass fa fa-3x active striped\" ng-class=\"{\'active\':(main.progresstwo < 100)}\" value=main.progresstwo max=main.extractedfiles style=height:40px;margin:auto;position:relative;display:flex;display:-webkit-flex;align-items:center;align-content:stetch;justify-content:stretch;flex-direction:row;align-self:stretch; type={{main.progresstype}}></uib-progressbar><i class=\"fa fa-fw fa-3x fa-spinner fa-spin\"></i><i class=\"fa fa-3x\">{{main.progresstwo}}/{{main.extractedfiles}}</i></div><div pageslide ps-open=main.checked ps-key-listener=true ps-side=\"{{main.side || \'left\'}}\" ps-class=\"{{main.styleClass || \'card-dark btn-glass\'}}\" ps-size=\"{{main.size || \'400\'}}\" style=overflow-x:visible;overflow-y:scroll;><div ng-include=\"\'/getphdwidget/src/phd/step-1.html\'\"></div><hr></div></div></div><div class=\"card card-fancy card-rounded card-block card-thick\" style=\"text-align: left;color: #444;\" ng-if=phd.file><button class=\"alert btn-glass btn-primary img card-rounded row\" style=\"position:relative;display:flex;display:-webkit-flex;align-items:center;align-content:center;justify-content:space-between;flex-direction:row;background-color:#35688F;padding:2px;box-shadow:inset 10px 2px 50px rgba(0,0,0,0.5);\" ng-click=main.collapse()><div style=display:flex;justify-content:flex-end;flex-direction:column;align-content:flex-end;vertical-align:middle;align-items:flex-end;><h4 class=\"card-title ng-binding display-4\" style=\"margin-bottom:0;color: #fff;\">US {{phd.patent.number | number:0 }}</h4><h5 class=\"card-subtitle ng-binding\" style=color:#ddd;><span class=lead>USSN {{phd.application[\'Application Number\']}}</span></h5></div><img src=/llp_core/img/GoldLion.svg class=\"img lionlogofilter\" style=\"width:75px;height: auto;\"><div style=display:flex;flex-direction:column;align-items:flex-start;justify-content:space-around;><img src=/llp_core/img/GoldLogoLong.svg class=img style=height:45px;> <img src=/llp_core/img/GoldPhdLogoLong.svg class=img style=height:25px;padding-left:2px;></div></button><div uib-collapse=collapsereport class=\"card clearfix\" style=padding:0;margin:0;><blockquote class=\"bs-callout bs-callout-NOA\" style=\"margin: 0;\"><h4>{{phd.application[\'Title of Invention\']}}</h4><p style=font-size:10px;><cite>{{phd.application[\'First Named Inventor\']}} <small><emphasis>Issued {{phd.patent.issued | date}}</emphasis></small></cite></p></blockquote><uib-tabset active=1 class=tabbable justified=true type=pills><uib-tab active=main.tabs[0].isActive disabled=main.tabs[0].disabled select=\"main.tabs[0].isActive = true\" deselect=\"main.tabs[0].isActive = false\" style=\"margin: 0 5px;\"><uib-tab-heading class=text-Petition>PTO Metadata</uib-tab-heading><uib-tab-content ng-if=main.tabs[0].isActive><uib-tabset class=\"tabbable tabs-left\"><uib-tab><uib-tab-heading>USSN {{phd.application[\'Application Number\']}}</uib-tab-heading><uib-tabset class=tabbable><uib-tab ng-repeat=\"file in phd.file\" heading=\"{{file.label | uppercase}}\"><uib-tab-content><pre class=\"card card-block card-fancy\" ng-bind=file.file></pre></uib-tab-content></uib-tab></uib-tabset></uib-tab><uib-tab ng-if=phd.application><uib-tab-heading>APPLICATION</uib-tab-heading><uib-tab-content><table class=\"card card-block table table-striped table-hover table-condensed table-responsive\"><tbody><tr ng-repeat=\"(key, value) in phd.application\"><td><strong>{{::key}}</strong></td><td>{{::value}}</td></tr></tbody></table></uib-tab-content></uib-tab><uib-tab ng-if=phd.attorney><uib-tab-heading ng-style>ATTORNEY</uib-tab-heading><uib-tab-content><table class=\"card card-block table table-striped table-hover table-condensed table-responsive\"><tbody><tr ng-repeat=\"(key, line) in phd.attorney track by $index\"><td ng-repeat=\"(key, value) in line track by $index\">{{::value}}</td></tr></tbody></table></uib-tab-content></uib-tab><uib-tab ng-if=phd.continuity><uib-tab-heading ng-style>CONTINUITY</uib-tab-heading><uib-tab-content><table class=\"card card-block table table-striped table-condensed table-hover table-responsive\"><tbody><tr ng-repeat=\"(key,line) in phd.continuity track by $index\"><td ng-repeat=\"(key, value) in line track by $index\">{{::value}}</td></tr></tbody></table></uib-tab-content></uib-tab><uib-tab ng-if=phd.foreign><uib-tab-heading ng-style>FOREIGN PRIORITY</uib-tab-heading><uib-tab-content><table class=\"table table-stripped table-condensed table-hover table-responsive\"><thead><tr><th><strong>Country</strong></th><th><strong>Priority</strong></th><th><strong>Priority Date</strong></th></tr></thead><tbody><tr ng-repeat=\"p in phd.foreign\"><td ng-bind=\"::p[\'Country\']\"></td><td ng-bind=\"::p[\'Priority\']\"></td><td ng-bind=\"::p[\'Priority Date\'] | date\"></td></tr></tbody></table></uib-tab-content></uib-tab><uib-tab ng-if=phd.term><uib-tab-heading>PATENT TERM ADJUSTMENTS</uib-tab-heading><uib-tab-content><table class=\"card card-block table table-striped table-hover table-condensed table-responsive\"><tbody><tr ng-repeat=\"(key, line) in phd.term track by $index\"><td ng-repeat=\"(key,value) in line track by $index\">{{::value}}</td></tr></tbody></table></uib-tab-content></uib-tab><uib-tab ng-if=phd.transaction><uib-tab-heading>TRANSACTION</uib-tab-heading><uib-tab-content><table class=\"table table-striped table-hover table-condensed table-responsive\"><thead><tr><th><strong>Date</strong></th><th><strong>Transaction Description</strong></th></tr></thead><tbody><tr ng-repeat=\"trans in phd.transaction\"><td>{{::trans[\'Date\']}}</td><td>{{::trans[\'Transaction Description\']}}</td></tr></tbody></table></uib-tab-content></uib-tab><uib-tab ng-if=phd.imagefile select=\"tab.isActive = true\" deslect=\"tab.isActive = false;\"><uib-tab-heading ng-style>IMAGE FILE WRAPPER</uib-tab-heading><uib-tab-content ng-if=tab.isActive><table class=\"table table-hover table-condensed table-responsive\"><thead><tr><th ng-click=\"reverse = !reverse\" class=fa ng-class=\"{\'fa-chevron-up\': reverse,\'fa-chevron-down\': !reverse}\">#</th><th ng-click=\"main.dog = \'Mail\\ Room\\ Date\'; maybe = !maybe\"><strong>Mail Room Date<i class=fa ng-if=\"main.dog == \'Mail Room Date\'\" ng-class=\"{\'fa-chevron-up\':maybe,\'fa-chevron-down\': !maybe}\"></i></strong></th><th ng-click=\"main.dog = \'Document\\ Code\'; maybe = !maybe\"><strong>Document Code<i class=fa ng-if=\"main.dog == \'Document Code\'\" ng-class=\"{\'fa-chevron-up\':maybe,\'fa-chevron-down\': !maybe}\"></i></strong></th><th ng-click=\"main.dog = \'Document\\ Description\'; maybe = !maybe\"><strong>Document Description<i class=fa ng-if=\"main.dog == \'Document Description\'\" ng-class=\"{\'fa-chevron-up\':maybe,\'fa-chevron-down\': !maybe}\"></i></strong></th><th ng-click=\"main.dog = \'Document\\ Category\'; maybe = !maybe\"><strong>Document Category<i class=fa ng-if=\"main.dog == \'Document Category\'\" ng-class=\"{\'fa-chevron-up\':maybe,\'fa-chevron-down\': !maybe}\"></i></strong></th><th ng-click=\"main.dog = \'Page\\ Count\'; maybe = !maybe\"><strong>Page Count<i class=fa ng-if=\"main.dog == \'Page Count\'\" ng-class=\"{\'fa-chevron-up\':maybe,\'fa-chevron-down\': !maybe}\"></i></strong></th><th ng-click=\"main.dog = \'Filename\'; maybe = !maybe\"><strong>Filename<i class=fa ng-if=\"main.dog == \'Filename\'\" ng-class=\"{\'fa-chevron-up\':maybe,\'fa-chevron-down\': !maybe}\"></i></strong></th></tr></thead><tbody><tr ng-repeat=\"roarevent in phd.imagefile | filter: main.query | orderBy: main.dog : maybe\"><th><a ng-click=main.pushtoqueue(roarevent)><i class=\"fa fa-file-pdf\">{{$index}}</i></a></th><td ng-bind=\"roarevent[\'Mail Room Date\']\"></td><td ng-bind=\"roarevent[\'Document Code\']\"></td><td ng-bind=\"roarevent[\'Document Description\']\"></td><td ng-bind=\"roarevent[\'Document Category\']\"></td><td ng-bind=\"roarevent[\'Page Count\']\"></td><td><a ng-click=main.popdoc(roarevent)>{{roarevent[\'Filename\']}}</a></td></tr></tbody></table></uib-tab-content></uib-tab></uib-tabset></uib-tab-content></uib-tab><uib-tab active=main.tabs[1].isActive disable=main.tabs[1].disabled select=\"main.tabs[2].isActive = true\" deselect=\"main.tabs[1].isActive = false\" style=\"margin: 0 5px;\"><uib-tab-heading ng-style>Patent Digest for US {{(phd.patent.number | number:0) || (config.IPAYEAR + \"&nbsp;/&nbsp;\" + config.IPANUM) }}</uib-tab-heading><uib-tab-content ng-if=main.tabs[2].isActive ng-controller=\"MainCtrl as main\"><patentreport patent={{phd.patent.id}} pnum={{phd.patent.id}}></patentreport></uib-tab-content></uib-tab><uib-tab heading=\"Claim/Rejection History\"><uib-tabset justified=true><uib-tab heading=\"Issued Claims\"><blockquote cite={{phd.patent.media}} style=\"margin: 25px;margin-top:35px;\"><h4><strong ng-bind=tree.title></strong> - <small>{{tree.claim_total}} Claims</small></h4><p ng-bind-html=\"tree.abstract | highlight: query | trustAsHTML\"></p><cite>{{phd.patent.filename}}<a class=\"fa fa-external-link fa-border\" ng-click=main.poppatent(phd.patent)></a></cite></blockquote><div class=\"row showscroll\" style=\"margin: 5px 5px;overflow-x:scroll;\"><a ng-repeat=\"link in tree.drawings\" ng-click=main.pop(link) class=btn style=margin:2px;><img ng-src={{tree.thumbnails[$index]}} class=\"img img-shadow\"></a></div><div class=row><div class=col-sm-6><fieldset class=material><input id=patterninput ng-model=query type=search style=margin:10px; ng-model-options=\"{updateOn: \'default blur\',debounce: {\'default\':250,\'blur\':0}}\"><hr><label>Search</label></fieldset><a style=position:absolute;right:0;top:4; class=\"btn fa fa-close\" ng-click=\"query = null\"></a><div class=col-sm-3><ul class=list-unstyled><li><input type=checkbox ng-model=dim> <small>Hide non-matches</small></li></ul></div><div class=col-sm-3></div><d3pendingtree id=\"a{{phd.patent.number || config.IPAYEAR + config.IPANUM}}\" class={{query}} tree=tree pattern={{query}} patent=\"{{phd.patent.number || config.IPAYEAR + config.IPANUM}}\" style=transform:scale3d(0.9,0.9,0.9)translateX(-40px);></d3pendingtree></div><div class=col-sm-6><div id=info></div><div ui-tree=treeOptions><ol ui-tree-nodes max-depth=6 ng-model=tree.claims><li ui-tree-node class=\"card card-block\" ng-repeat=\"node in tree.claims\" ng-include=\"\'claim_renderer.html\'\" style=padding-right:0rem;padding-bottom:0.1rem; ng-hide=\"!treeFilter(node, query, supportedFields) && dim\"></li></ol></div><script type=text/ng-template id=claim_renderer.html><div ui-tree-handle class=\"tree-node tree-node-content\"> <div class=\"tree-node-content flextoprow \" style=\"position:relative;\"> <a class=\"btn btn-xs pull-left\" data-nodrag ng-click=\"toggle(this)\" ng-if=\"node.children && (node.children.length > 0)\"><span class=\"fa \" ng-class=\"{\'fa-chevron-right\': collapsed, \'fa-chevron-down\': !collapsed}\" style=\"color:steelblue;transition:all 0.25s ease;\"></span></a> <!--<input type=\"text\" ng-model=\"node.text\" ng-change=\"node.$save();\" ng-model-options=\"{ updateOn: \'default blur\', debounce: {\'default\': 1000, \'blur\': 0} }\" style=\"padding: 0.5rem;color:#444;\" ng-if=\"config.editable\">--> <!--<a class=\"btn showonhover\" data-nodrag ng-if=\"config.editable\" ng-click=\"remove(this);\"><span class=\"fa fa-close text-danger \"></span></a>--> <!--<a class=\"btn \" data-nodrag ng-if=\"config.editable\" ng-click=\"toc.newsubsection(this)\" style=\"\"><span class=\"fa fa-plus text-success\"></span></a>--> <div ng-bind-html=\"node.text | highlight: query \" ng-class=\"{\'filtered-out\':(!treeFilter(node, query, supportedFields) && dim)}\"></div> <!--<a class=\"gototarget btn\" data-nodrag ui-sref=\"{{parentstate}}.righttab({tabid: node.id})\" style=\"\"> <span ng-if=\"!config.editable\" class=\"pull-left\">{{node.text}}</span><i style=\"position:absolute;right:0;\">&nbsp;</i></a>--> </div> </div> <ol ui-tree-nodes=\"\" ng-model=\"node.children\" ng-class=\"{\'hidden\': collapsed}\" style=\"\"> <li class=\"card card-block img-shadow\" ng-repeat=\"node in node.children\" ui-tree-node ng-include=\"\'claim_renderer.html\'\" style=\"padding-right:0rem;padding-bottom:0.1rem;padding-left:5px;\" ng-hide=\"!treeFilter(node, query, supportedFields) && dim\" > </li> </ol></script></div></div></uib-tab><uib-tab heading=\"Claim History-at-a-Glance\"><d3historytree patent={{phd.patent.id}}></d3historytree></uib-tab><uib-tab ffbase={{phd.patent.id}}><uib-tab-heading>Rejections <label class=\"label label-pill label-danger\">{{item.rejectionhistory.length}}</label></uib-tab-heading><div ng-repeat=\"(key, date) in item.rejectionhistory\" class=\"card card-PTO\"><div class=card-header><h4 class=card-title>{{key | date:long}} <a class=\"fa fa-ellipsis-v fa-pull-right\" ng-click=\"this.isCollapsed = !this.isCollapsed\"></a></h4></div><div class=card-block uib-collapse=isCollapsed rejectionset set=date></div></div></uib-tab></uib-tabset></uib-tab></uib-tabset></div></div></div>");
$templateCache.put("{widgetsPath}/getphd/src/phd/Pages.html","<div ng-repeat=\"(key, page) in roarevent.pages | orderBy: key\" class=\"card card-block\" style=line-height:1.5;font-size:14px;><hr class=bg-{{roarevent.styleClass}} style=display:inline-block;width:100%;><span style=\"display:flex;flex-flow:row wrap;align-content:center;justify-content:space-between;\">{{page.header}}</span><hr class=text-{{roarevent.styleClass}} style=display:inline-block;width:50%;margin-left:25%;margin-right:25%:><br><ng-annotate-text text=\"page.text | highlight: $parent.query\" style=\"background-color: #fff;padding: 1rem;border-radius: 0.2rem;\" annotations=page.annotations readonly=false popup-controller=\"\'AnnotationController\'\" popup-template-url=\"\'/llp_core/modules/roarmap/partial/roarmap.detail.tpl/roarmap.annotation.tpl.html\'\" tooltip-controller=\"\'AnnotationController\'\" tooltip-template-url=\"\'/llp_core/modules/roarmap/partial/roarmap.detail.tpl/roarmap.annotation-tooltip.tpl.html\'\" on-annotate=onAnnotate on-annotate-delete=onAnnotateDelete on-annotate-error=onAnnotateError on-popup-show=onPopupShow on-popup-hide=onPopupHide popup-offset=50></ng-annotate-text><hr class=text-{{roarevent.styleClass}} style=display:inline-block;width:50%;margin-left:25%;margin-right:25%:><small style=text-align:center;>{{key}}</small></div>");
$templateCache.put("{widgetsPath}/getphd/src/phd/citation.html","<div class=\"bs-callout bs-callout-NOA\"><h4 class=card-title>{{(p.id | number:0)||(p.id | published_application)}} - {{p.title}}<a class=\"pop text-NOA showonhover fa fa-external-link\" ng-href=https://patentimages.storage.googleapis.com/pdfs/{{$parent.ref}}.pdf></a></h4><h6 class=card-subtitle>{{p.issued |date}}&nbsp;&nbsp;&nbsp;&nbsp;<strong>{{p.inventor}}</strong>&nbsp;&nbsp;&nbsp;&nbsp;<small class=\"text-muted>\">{{p.application_number || \'Application Number\'}}</small><p>{{p.description || \'Description\'}}</p></h6></div>");
$templateCache.put("{widgetsPath}/getphd/src/phd/claimtree.html","<div ui-tree=treeOptions><ol ui-tree-nodes max-depth=6 ng-model=tree><li ui-tree-node class=\"card card-block\" ng-repeat=\"node in tree | orderBy: [\'id\',\'name\',\'text\'] : reverse\" ng-include=\"\'claim_renderer.html\'\" style=padding-right:0rem;padding-bottom:0.1rem; ng-hide=\"!treeFilter(node, query, supportedFields) && dim\"></li></ol></div><script type=text/ng-template id=claim_renderer.html><div ui-tree-handle class=\"tree-node tree-node-content\"> <div class=\"tree-node-content flextoprow \" style=\"position:relative;\"> <a class=\"btn btn-xs pull-left\" ng-click=\"toggle(this)\" ><span class=\"fa \" ng-class=\"{\'fa-chevron-right\': collapsed, \'fa-chevron-down\': !collapsed}\" style=\"color:steelblue;transition:all 0.25s ease;\" ng-if=\"node.children && (node.children.length > 0)\"></span><span ng-if=\"node.children.length == 0 \" class=\"fa fa-hashtag\"></span></a> <!--<input type=\"text\" ng-model=\"node.text\" ng-change=\"node.$save();\" ng-model-options=\"{ updateOn: \'default blur\', debounce: {\'default\': 1000, \'blur\': 0} }\" style=\"padding: 0.5rem;color:#444;\" ng-if=\"config.editable\">--> <!--<a class=\"btn showonhover\" data-nodrag ng-if=\"config.editable\" ng-click=\"remove(this);\"><span class=\"fa fa-close text-danger \"></span></a>--> <!--<a class=\"btn \" data-nodrag ng-if=\"config.editable\" ng-click=\"toc.newsubsection(this)\" style=\"\"><span class=\"fa fa-plus text-success\"></span></a>--> <label class=\"pull-right label badge \" ng-bind=\"node.status\" ng-class=\"{\'bg-NOA\': (node.status.indexOf(\'rently\') > -1),\'bg-Applicant\': (node.status.indexOf(\'viously\') > -1)}\" style=\"position:absolute;right:5px;bottom:5px;\"></label> <div ng-bind-html=\"node.text | highlight: query \" data-nodrag ng-class=\"{\'filtered-out\':(!treeFilter(node, query, supportedFields) && dim)}\" style=\"color:#444 !important;\"></div> <!--<a class=\"gototarget btn\" data-nodrag ui-sref=\"{{parentstate}}.righttab({tabid: node.id})\" style=\"\"> <span ng-if=\"!config.editable\" class=\"pull-left\">{{node.text}}</span><i style=\"position:absolute;right:0;\">&nbsp;</i></a>--> </div> </div> <ol ui-tree-nodes=\"\" ng-model=\"node.children\" ng-class=\"{\'hidden\': collapsed}\" style=\"\"> <li class=\"card card-block img-shadow\" ng-repeat=\"node in node.children | orderBy: [\'id\',\'name\',\'text\'] : reverse\" ui-tree-node ng-include=\"\'claim_renderer.html\'\" style=\"padding-right:0rem;padding-bottom:0.1rem;padding-left:5px;\" ng-hide=\"!treeFilter(node, query, supportedFields) && dim\" > </li> </ol></script>");
$templateCache.put("{widgetsPath}/getphd/src/phd/docheader.html","<div class=\"container-fluid two-col-right\"><div class=\"col-xs-4 card card-{{roarevent.styleClass}}\"><img ng-src={{background(roarevent.styleClass)}} class=\"img img-responsive img-shadow\"><h4>{{roarevent.title}}</h4><p class=card-text><fieldset class=material><input type=text placeholder=Search... ng-model=$parent.$$childHead.$$childHead.$$childTail.query><hr><label>Search this document</label></fieldset><label ng-repeat=\"match in roarevent.matches track by $index | groupBy: match\" class=\"fa fa-tag\"><a ng-href=#{{$index}}>{{match}}</a></label></p><ul><li class=\"card img-shadow\" ng-repeat=\"a in annotationsAsFlatList($parent.$$childHead.$$childHead.$$childTail.annotations) track by $index\" style=\"border: 2.5px solid {{a.type}};\">{{a.data.comment}} <span ng-if=a.data.points>({{a.data.points}}<ng-pluralize count=a.data.points when=\"{\'-1\': \'point\', \'1\': \'point\', \'other\': \'points\'}\"></ng-pluralize>)</span></li></ul></div><div class=col-xs-8><div class=\"bs-callout bs-callout-{{roarevent.styleClass}}\"><h4>{{roarevent.title}}</h4><p ng-if=roardate>Dated {{roardate}}</p><cite>{{roarevent.filename}}&nbsp;&nbsp;<a pop href={{roarevent.media}} target=fframe><i class=\"fa fa-external-link\"></i></a></cite></div><div data-ng-transclude></div></div>[</div>");
$templateCache.put("{widgetsPath}/getphd/src/phd/epubform.html","");
$templateCache.put("{widgetsPath}/getphd/src/phd/patentReport.html","<div class=\"card card-primary card-block btn-glass drop-target\" style=\"border: 2px dashed blue;margin: 5px;\" ng-show=p.showconfig><button class=\"row btn btn-glass btn-primary img img-rounded\" style=width:100%;position:relative;display:flex;display:-webkit-flex;align-items:center;align-content:stetch;justify-content:center;flex-direction:row; ng-click=\"p.showform = !p.showform\" ng-class=\"{\'btn-success\': (main.progress == 100),\'btn-danger\':(main.progress === \'failed\')}\"><img src=https://lexlab.firebaseapp.com/img/GoldLion.svg class=\"img img-rounded pull-right\" style=max-height:100px; ng-if=!main.progress></button><div pageslide ps-open=p.showform ps-key-listener=true ps-side=left ps-class=\"card-dark btn-glass\" ps-size=400px style=overflow-x:visible;overflow-y:scroll;><div ng-include=\"\'/getphdwidget/src/phd/step-3.html\'\"></div><hr></div></div><div class=\"container-fluid card-fancy\" style=width:98%;margin:1%;height:98%;overflow:scroll; ng-if=!p.showconfig><div class=\"col-xs-4 col-sm-3 col-1\"><div class=card><img ng-src=\"/patents/US{{config.PNUM || \'7777777\'}}/preview\" class=\"img img-responsive img-shadow\" style=height:200px;width:200px;z-index:1000; ng-dblclick=\"p.showform = !p.showform\"><div class=card-block><h2 class=\"card-title text-NOA\">US <strong ng-bind=\"patent.id | number:0\"></strong><a class=\"pop text-NOA showonhover fa fa-external-link\" ng-href={{patent.media}}></a></h2><table><tbody><tr><td><label>Issued:</label></td><td>{{patent.issued|date}}</td></tr><tr><td><label>USSN</label></td><td>{{patent.application_number | application}}</td></tr><tr><td><label>Filed:</label></td><td>{{patent.dateSubmitted|date}}</td></tr><tr><td><label>Title:</label></td><td>{{patent.title}}</td></tr><tr><td><label>Inventor(s):</label></td><td>{{patent.inventor}}</td></tr><tr><td><label>Original Assignee:</label></td><td>{{patent.assignee}}</td></tr><tr><td><label>Published</label></td><td>{{patent.pub | published_application}}</td></tr></tbody></table><table ng-bind-html=patent.classifications></table></div></div></div><div class=\"card col-xs-8 col-sm-9\"><div><uib-tabset class=\"panel panel-default panel-heading\"><uib-tab heading=Abstract><div class=\"bs-callout bs-callout-reverse bs-callout-NOA\"><h4 ng-bind=patent.title>Reprehenderit aute proident cupidatat exercitation officia incididunt culpa ullamco.</h4><p ng-bind=patent.abstract>Culpa enim minim amet proident sunt aliqua ex irure ex sunt eiusmod ut consectetur. Minim esse in tempor reprehenderit esse cupidatat adipisicing ipsum eiusmod. Ea commodo nisi enim esse et ut. Minim laborum irure eiusmod Lorem consequat duis labore deserunt ullamco velit enim ut. Aliquip tempor non amet aliqua cillum sit amet commodo aliqua sint nisi. Fugiat ex irure qui et in qui velit commodo ipsum. Non cupidatat laboris culpa ipsum culpa velit.</p></div></uib-tab><uib-tab><uib-tab-heading>Drawings <label class=\"label label-pill label-success\">{{patent.drawings.length}}</label></uib-tab-heading><div class=showscroll style=\"margin: 5px 5px;display:flex;flex-wrap:wrap;flex-direction:row;\"><a ng-repeat=\"link in patent.drawings\" pop=true ng-click=main.pop(link) class=btn style=margin:2px;><img ng-src={{patent.thumbnails[$index]}} class=\"img img-shadow\"></a></div></uib-tab><uib-tab heading=Description><uib-tab-content style=width:98%;margin:1%;height:98%;overflow:scroll;><p class=\"card card-block\" ng-bind-html=\"patent.text | trustAsHTML\"></p></uib-tab-content></uib-tab><uib-tab><uib-tab-heading>{{patent.claim_total}}&nbsp;&nbsp;Claims</uib-tab-heading><uib-tab-content class=container-fluid><uib-tabset><uib-tab heading=Issued><div class=col-sm-6 style=transform:scale3d(0.9,0.9,0.9)translateX(-40px);><d3pendingtree patent={{config.PNUM}} pattern={{query}} tree=tree style=width:400px;></d3pendingtree></div><div class=col-sm-6><claimtree tree=tree.claims query=query style=position:absolute;></claimtree></div></uib-tab><uib-tab heading=\"{{patent.pub | published_application}}\" ng-if=patent.application_data><uib-tab-heading>{{patent.pub | published_application}}<label class=\"label label-pill label-info\">{{patent.application_data.claim_total}}</label></uib-tab-heading><div class=row><div class=col-sm-6><h6>{{patent.pub | published_application}}</h6><fieldset class=\"material PTO\"><input ng-model=query id=patterninput><hr><label>{{patent.pub | published_application}}</label></fieldset></div><div class=col-sm-6><h6>{{patent.id | number:0}}</h6><fieldset class=\"material PTO\"><input ng-model=query id=patterninput><hr><label>{{patent.id | number:0}}</label></fieldset></div></div><div class=row style=perspective:1000px;perspective-origin:50%50%;transformation-style:preserve-3d;><div class=col-sm-6 style=transform:scale3d(0.9,0.9,0.9)translateX(-40px);><d3pendingtree patent={{config.IPAYEAR+config.IPANUM}} pattern={{query}} tree=leaf style=width:400px;></d3pendingtree><claimtree tree=leaf.claims query=query style=position:absolute;></claimtree></div><div class=col-sm-6 style=transform:scale3d(0.9,0.9,0.9)translateX(-40px);><d3pendingtree patent={{config.PNUM}} pattern={{query}} tree=tree style=width:400px;></d3pendingtree><claimtree tree=tree.claims query=query style=position:absolute;></claimtree></div></div></uib-tab></uib-tabset></uib-tab-content></uib-tab><uib-tab heading=Citations><uib-tab-heading>Citations <label class=\"label label-pill label-warning\">{{patent.references.length}}</label></uib-tab-heading><uib-tab-content style=width:98%;margin:1%;height:98%;overflow:scroll;><div patent-citation ref=ref ng-repeat=\"ref in patent.references\"></div></uib-tab-content></uib-tab><uib-tab heading=Corrections/Fees/Assignments><table ng-bind-html=\"patent.legal | highlight: query | trustAsHTML\" class=\"card img-shadow card-block table table-condensed table-stripped table-hover table-responsive\" style=\"color:#444 !important;\"></table></uib-tab></uib-tabset></div></div></div>");
$templateCache.put("{widgetsPath}/getphd/src/phd/step-1.html","<div class=\"panel panel-primary\" style=margin:0rem;margin-left:-0.75rem;overflow:visible;><div class=\"panelhead2 panel-heading btn-primary btn-glass clearfix\" style=margin-right:-1rem;border-top-left-radius:0rem;border-bottom-left-radius:0rem;border-top-right-radius:2rem;border-bottom-right-radius:2rem;display:flex;justify-content:flex-start;align-items:center;align-content:center;><div class=pull-right style=display:flex;flex-direction:column;align-items:flex-start;justify-content:space-around;align-self:flex-end;><img src=/llp_core/img/GoldLogoLong.svg class=img style=height:25px;> <img src=/llp_core/img/GoldPhdLogoLong.svg class=img style=height:10px;padding-left:2px;></div><img src=/llp_core/img/GoldLion.svg class=\"img lionlogofilter pull-left\" style=\"width:auto;height: 50px;align-self:flex-start;margin-left:75px;;margin-top:-10px;\"></div><div class=panel-body style=height:90vh;overflow:scroll;><blockquote class=\"bs-callout bs-callout-primary card-header\" style=margin:0; ng-hide=response><p class=\"text-muted text-left\" style=text-align:left;font-size:10px;>Use the following fields to automatically download U.S. utility patents and published patent applications from Google Patents, and to automatically download prosecution histories from the <a href=\"https://www.uspto.gov/\" uib-tooltip=\"United States Patent & Trademark Office official site\" tooltip-trigger=mouseenter>USPTO</a> public data-proxy-repositors, <a href=\"https://www.google.com/patents/\" uib-tooltip=\"Google Patents\" tooltip-trigger=mouseenter>Google</a> & <a href=\"http://www.reedtech.com/\" uib-tooltip=ReedTech tooltip-trigger=mouseenter>ReedTech</a>. To automatically download and parse a prosecution history, simply click on the LEO (lion) icon at the far-bottom, far-right of this Panel. Alternatively, you can click either of the buttons labelled \"ReedTech\" or \"Google\" to automatically download a .zip file from the respective sources to your Downloads folder. To parse the prosecution history, you can then drag over the Patent PhD Panel to the right of this Panel on the main screen, and drop the file within the dropzone once it has become marked by a dotted border. The .zip file will then automatically upload to our servers. LEO will generate a Patent PhD Report (directly upon selecting the LEO icon, or upon placing a .zip file in the Patent PhD Panel) and return it to the main display screen for your review.</p></blockquote><blockquote class=\"bs-callout bs-callout-Applicant card-header\" style=margin:0; ng-show=response><h4>{{response.title}} <small class=text-muted>{{response.claim_total}} Claims</small></h4><p class=\"text-muted text-left\" style=text-align:left;font-size:10px;>{{response.abstract}}</p></blockquote><blockquote class=\"bs-callout bs-callout-NOA card-header\" style=text-align:left;margin:0;><h4 class=card-title style=text-align:left;font-size:12px;><label for=patentnumber class=\"card-text text-muted\"><strong>Enter US Patent Number</strong></label></h4><fieldset class=\"material Applicant\"><input type=number placeholder=\"Patent #\" ng-model=config.PNUM ng-blur=main.remoteconfig(config.PNUM)><hr><label>Enter a Patent Number</label></fieldset><a class=pull-right tooltip-trigger=mouseenter uib-tooltip=\"Download Patent\" ng-click=main.getpatentdownload(config.PNUM);><span class=\"text-success fa fa-2x fa-download\"></span></a></blockquote><blockquote class=\"bs-callout bs-callout-Petition card-header\" style=text-align:left;margin:0;><h4 class=card-title style=text-align:left;font-size:12px;><label for=publishedapplication class=\"card-text text-muted\"><strong>Enter Year of Publication and Published Application Number</strong></label></h4><div class=input-group><fieldset class=\"material Petition\"><input type=number placeholder=YYYY ng-model=config.IPAYEAR maxlength=4><hr><label>Enter YYYY</label></fieldset><fieldset class=\"material Petition\"><input type=text placeholder=# ng-model=config.IPANUM><hr><label>Enter Published Application Number</label></fieldset><a class=pull-right ng-click=\"main.getpublishedapplication(config.IPAYEAR, config.IPANUM)\"><span class=\"text-warning fa fa-download fa-2x\"></span></a></div></blockquote><blockquote class=\"bs-callout bs-callout-PTO card-header\" style=text-align:left;margin:0;><h4 class=card-title style=text-align:left;font-size:12px;><label class=\"card-text text-muted\">Enter US Application Serial Number</label></h4><div class=input-group><form name=application><fieldset class=\"material PTO\"><input type=text placeholder=\"Application #\" ng-model=config.appnum><hr><label>Enter Application Number</label></fieldset><button class=\"btn btn-default right text-PTO\" ng-click=\"main.getfilehistory(config.appnum,\'reedtech\')\" uib-tooltip=\"DOWNLOAD FROM REEDTECH\" tooltip-placement=right title=\"DOWNLOAD FILE HISTORY FROM REEDTECH\" tooltip-animation=true><span id=reedtechbutton class=\"fa fa-2x text-PTO\"></span> ReedTech</button> <button class=\"btn btn-default right text-PTO\" ng-click=\"main.getfilehistory(config.appnum,\'google\')\" uib-tooltip=\"DOWNLOAD FROM GOOGLE\" tooltip-placement=right title=\"DOWNLOAD FILE HISTORY FROM GOOGLE\" tooltip-animation=true><span id=googlebutton class=\"text-PTO fa fa-2x\"></span> Google</button> <button class=\"btn btn-default\" ng-click=main.remotezip(config.appnum) uib-tooltip=\"TRY AUTO DOWNLOAD **experimental\" tooltip-placement=right title=\"TRY AUTO DOWNLOAD* (**experimental**)\" tooltip-animation=true style=width:35px;height:35px;padding:0;><img src=/llp_core/img/GoldLion.svg style=width:35px;height:35px;></button></form></div></blockquote></div></div>");
$templateCache.put("{widgetsPath}/getphd/src/phd/step-2.html","<div class=\"card card-warning\" style=margin:0.5rem;><div class=card-header><h6 class=card-title>+PhD Step 2 - Download Image File Wrapper</h6></div><div class=card-text><input type=text placeholder=\"Application #\" ng-model=config.appnum><div class=row><a class=\"btn btn-warning fa fa-download\" href=https://storage.googleapis.com/uspto-pair/applications/{{config.appnum}}.zip target=_blank data-toggle=popover data-placement=bottom title=\"DOWNLOAD FROM GOOGLE\" data-content data-animation=true data-trigger=hover style=color:white; onclick=\"window.open(this.href, \'\', \'resizable=no,status=no,location=no,toolbar=no,menubar=no,fullscreen=no,scrollbars=no,dependent=yes,width=400,left=150,height=300,top=150\'); return false;\" ng-click=\"main.remotezip(config.appnum, this.href)\">from Google</a> <a class=\"btn btn-warning fa fa-download\" href=https://patents.reedtech.com/downloads/pair/{{config.appnum}}.zip target=_blank data-toggle=popover data-placement=bottom title=\"DOWNLOAD FROM REEDTECH\" data-content data-animation=true data-trigger=hover style=color:white; onclick=\"window.open(this.href, \'\', \'resizable=no,status=no,location=no,toolbar=no,menubar=no,fullscreen=no,scrollbars=no,dependent=yes,width=400,left=150,height=300,top=150\'); return false;\" ng-click=\"main.remotezip(config.appnum, this.href)\">from ReedTech</a></div></div></div>");
$templateCache.put("{widgetsPath}/getphd/src/phd/step-3.html","<div class=card-block style=\"display:flex;flex-flow:column nowrap;justify-content:space-around;align-items:center;align-content:center;\"><blockquote class=\"card-header bs-callout bs-callout-NOA img-shadow\" style=text-align:left;margin:1.5vmin;><h4 class=card-title style=text-align:left;font-size:12px;><label for=patentnumber class=\"card-text text-muted\"><strong>Enter US Patent Number</strong></label></h4><fieldset class=\"material Applicant\" style=max-width:80%;><input type=text placeholder=\"Patent #\" ng-model-options=\"{updateOn:\'default blur\',debounce:{\'default\':1000,\'blur\':0}}\" ng-blur=collection.$save() ng-model=config.PNUM><hr><label>Enter a Patent Number</label></fieldset><button class=\"input-group-addon btn btn-default right\" tooltip-trigger=mouseenter uib-tooltip=\"Download Patent\" ng-click=p.getnew(config.PNUM); ng-dblclick=p.getload(config.PNUM)><span class=\"text-success fa fa-5x fa-download\"></span></button></blockquote><blockquote class=\"card-header bs-callout bs-callout-Petition img-shadow\" style=text-align:left;margin:1.5vmin;><h4 class=card-title style=text-align:left;font-size:12px;><label for=publishedapplication class=\"card-text text-muted\"><strong>Enter Year of Publication and Published Application Number</strong></label></h4><div class=input-group><fieldset class=\"material Petition\" style=max-width:33%;><input type=text placeholder=YYYY ng-model=config.IPAYEAR maxlength=4><hr><label>YEAR</label></fieldset><fieldset class=\"material Petition\" style=max-width:50%;><input type=text placeholder=\"# PA\" ng-model=config.IPANUM><hr><label>NUMBER</label></fieldset><button class=\"input-group-addon btn btn-default\" ng-click=p.getdata(config.IPAYEAR+config.IPANUM)><span class=\"text-warning fa fa-download fa-5x\"></span></button></div></blockquote></div>");}]);

angular.module('textSizeSlider', [])
    .directive('textSizeSlider', ['$document', function($document) {
        return {
            restrict: 'E',
            template: '<div class="text-size-slider"><span class="small-letter" ng-style="{ fontSize: min + unit }">A</span> <input type="range" min="{{ min }}" max="{{ max }}" step="{{ step || 0 }}" ng-model="textSize" class="slider" value="{{ value }}" /> <span class="big-letter" ng-style="{ fontSize: max + unit }">A</span></div>',
            scope: {
                min: '@',
                max: '@',
                unit: '@',
                value: '@',
                step: '@'
            },
            link: function (scope, element, attr) {
                scope.textSize = scope.value;
                scope.$watch('textSize', function (size) {
                    $document.root.style.fontSize = size + scope.unit;
                    $('html').css({ 'font-size': size + scope.unit });
                });
            }
        };
    }]);


 angular.module('roar', ['angularFileUpload','pageslide-directive'])

 .factory('$mocks', [function() {
         var stateParams = {
             groupId: '0000x0000',
             matterId: '0000x0000',
             pId: '0000x0000',
             roarId: '0000x0000'

         };


         return stateParams;
     }])

     .factory('$roarevent', ['OWNERSHIPDOCS', 'ARTDOCS', 'MERITSDOCS', 'DOCNAMES', 'PETDOCCODES', 'NOADOCCODES', 'INTVDOCCODES', 'PTODOCCODES', 'APPDOCCODES', '$q','$filter','ckstarter','ckender', function(OWNERSHIPDOCS, ARTDOCS, MERITSDOCS, DOCNAMES, PETDOCCODES, NOADOCCODES, INTVDOCCODES, PTODOCCODES, APPDOCCODES, $q, $filter, ckstarter,ckender){
         return function(file){
             var deferred = $q.defer();
             parse(file);
             return deferred.promise;
             function parse(file){
                 var roarevent = angular.copy(file);
                 //debugger;
                //  var tese = [];
                //  tese.push(roarevent);
                //          var test = new RegExp('^[0-9]{8}-[0-9]{4}-[0-9]{2}-[0-9]{2}-[0-9]{5}-');

                //         var array = $filter('filter')(tese, test);
                        if (roarevent.filename.indexOf('.pdf') > -1) {
                          var filename = file.Filename || file.name || file.filename;
                          //debugger;
                          var appnumsubstring = filename.slice(0, filename.indexOf("-"));
                          var appdatesubstring = filename.slice((filename.indexOf("-") + 1), (filename.indexOf("-") + 11));
                          var doccode = filename.slice((filename.lastIndexOf("-") + 1), (filename.indexOf(".pdf")));
                          roarevent.content_type = 'document';

                          if (file.url) {
                            roarevent.media = file.url;
                            //  var partA = file.url.replace('/view?usp', '/preview');
                            //   roarevent.media = partA.slice(0, partA.indexOf('='));
                            //     roarevent.iconUrl = file.iconUrl || null;
                            roarevent.uuid = file.id;

                            roarevent.mimeType = file.mimeType || null;
                          }

                         //
                         //roarevent.description = file.DocumentDescription;
                         roarevent.description = file['Document Description'] || null;
                         roarevent.filename = file['Filename'] || file.name || file.filename;
                         roarevent.collections = [];
                         roarevent.application = appnumsubstring || null;
                         roarevent.date = appdatesubstring || null;
                         //roarevent.rid = imagefile.indexOf(file);
                         //roarevent.file = file;
                         //roarevent.collections.push(roarmap.collections[0]);
                         roarevent.doccode = file['Document Code'] || doccode;
                         //roarevent.collections.push(phd.roarmap.collections[0].id);
                         angular.forEach(APPDOCCODES, function(code, key) {
                             if (doccode === code) {
                                 roarevent.styleClass = 'Applicant';
                             }
                         });
                         angular.forEach(PTODOCCODES, function(code, key) {
                             if (doccode === code) {
                                 roarevent.styleClass = 'PTO';
                             }
                         });
                         angular.forEach(INTVDOCCODES, function(code, key) {
                             if (doccode === code) {
                                 roarevent.styleClass = 'Interview';
                             }
                         });
                         angular.forEach(NOADOCCODES, function(code, key) {
                             if (doccode === code) {
                                 roarevent.styleClass = 'NOA';
                             }
                         });
                         angular.forEach(PETDOCCODES, function(code, key) {
                             if (doccode === code) {
                                 roarevent.styleClass = 'Petition';
                             }
                         });
                         angular.forEach(DOCNAMES, function(code, key) {
                             angular.forEach(code, function(value, key) {

                                 if (doccode === key) {
                                     roarevent.name = value;
                                     roarevent.title = value;
                               }
                                 else{roarevent.name = filename}
                             });
                         });
                         var date = new Date();
                         var d = new Date();
                        var n = d.getTime();
                         roarevent.rows = [
                              {columns:[
                                  {cid:n+10,styleClass:'col-sm-12',widgets:[{config:{id:'PROMISE',height:'90vh'},styleClass:roarevent.styleClass||'btn-dark',title:'Metadata',type:'metadata', wid:n+101},{config:{id:'PROMISE',height:'90vh'},styleClass:roarevent.styleClass||'btn-dark',title:'Text',type:'text', wid:n+105},{config:{id:'PROMISE',height:'90vh'},styleClass:roarevent.styleClass||'btn-dark',title:'LexPad',type:'ckwidget', wid:n+1010},{config:{height: "90vh",url: roarevent.media || 'http://www.google.com'},styleClass:roarevent.styleClass || 'btn-dark',title:'LexFrame',type:'iframe',wid:n+100}]} ]}
                          ];
                         roarevent.structure = "1";
                         return deferred.resolve(roarevent);
                        } else {
                          var filename = file.Filename || file.name || file.filename;
                          roarevent.name = filename;
                          roarevent.title = filename;
                          if (file.url) {
                            roarevent.media = file.url;
                            //  var partA = file.url.replace('/view?usp', '/preview');
                            //   roarevent.media = partA.slice(0, partA.indexOf('='));
                            //     roarevent.iconUrl = file.iconUrl || null;
                            roarevent.uuid = file.id;

                            roarevent.mimeType = file.mimeType || null;
                          }
                          var date = new Date();
                          var d = new Date();
                          var n = d.getTime();
                          roarevent.content = "<!DOCTYPE html><html><head><title></title><link href=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.2/css/bootstrap.min.css\" rel= \"stylesheet\" /><link href=\"https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css\" rel=\"stylesheet\"/><link href=\"//lexlab.io/llp_core/dist/app.full.min.css\" rel= \"stylesheet \" /><link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/tether-select/1.1.1/css/select-theme-default.css\"/><script src= \"https://code.jquery.com/jquery-2.2.0.min.js \"></script><script src= \"https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.16/d3.min.js \"></script><script src=\"https://cdnjs.cloudflare.com/ajax/libs/Chart.js/1.0.2/Chart.min.js\"></script><script src=\"https://cdnjs.cloudflare.com/ajax/libs/tether/1.2.0/js/tether.min.js\"></script><script src=\"https://cdnjs.cloudflare.com/ajax/libs/tether-select/1.1.1/js/select.min.js\"></script><script src= \"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.2/js/bootstrap.min.js \"></script><base href= \"/ \" target= \"fframe \" /></head><body class= \"dark-bg \"><div class= \"container-fluid \"><div class= \"row \"><div class= \"col-xs-12 \"><div class= \"card card-block \" style= \"padding:10px 20px; \"><p style= \"text-align:center \"><img alt= \" \" class= \" img-shadow img-responsive \" src= \""+ file.url + "\" style= \"width: 100%; height: auto; \" /></p><p>&nbsp;</p></div></div></div></div><footer class= \"navbar-fixed-bottom \"><p style= \"padding-left:30px;margin-left:30px;text-indent:20px; \">&nbsp;&nbsp;&nbsp;&nbsp;CONTAINS MATERIAL SUBJECT TO PROTECTIVE ORDER</p></footer></body></html>";
                          roarevent.rows = [
                              {columns:[
                                  {cid:n+10,styleClass:'col-sm-3',widgets:[{config:{id:'PROMISE'},title:roarevent.title || 'title',titleTemplateUrl:'{widgetsPath}/testwidget/src/title.html',type:'ckwidget', wid:n+15,styleClass:roarevent.styleClass || 'btn-dark'},{config:{id:'PROMISE'},title:roarevent.title || 'title',titleTemplateUrl:'{widgetsPath}/testwidget/src/title.html',type:'ckwidget', wid:n+15,styleClass:roarevent.styleClass || 'btn-dark'},{config:{id:'PROMISE'},title:roarevent.title || 'title',titleTemplateUrl:'{widgetsPath}/testwidget/src/title.html',type:'ckwidget', wid:n+15,styleClass:roarevent.styleClass || 'btn-dark'},{config:{height: "30em",url: roarevent.media || 'http://www.google.com'},title:roarevent.title || 'title',titleTemplateUrl:'{widgetsPath}/testwidget/src/title.html',type:'iframe',wid:n+100,styleClass:roarevent.styleClass || 'btn-dark'}]},
                                  {cid:n+1000,styleClass:'col-sm-9',widgets:[]}
                              ]}
                          ];
                         roarevent.structure = "3-9";
                         return deferred.resolve(roarevent);
                        }


                         };
             };

     }])
     .factory('$roarmap', ['$stateParams', 'Matter', 'Collection', 'ROARevent', 'ROARevents', 'Collections', '$mocks', '$timeout', 'OWNERSHIPDOCS', 'ARTDOCS', 'MERITSDOCS', 'DOCNAMES', 'PETDOCCODES', 'NOADOCCODES', 'INTVDOCCODES', 'PTODOCCODES', 'APPDOCCODES', '$q', 'PHD', '$log', 'FIREBASE_URL','filepickerService','$location','$ACTIVEROAR','$dashboards','CLAIMDOCS','ckstarter','ckender','ckheader','$http','$filter',
         function($stateParams, Matter, Collection, ROARevent, ROARevents, Collections, $mocks, $timeout, OWNERSHIPDOCS, ARTDOCS, MERITSDOCS, DOCNAMES, PETDOCCODES, NOADOCCODES, INTVDOCCODES, PTODOCCODES, APPDOCCODES, $q, PHD, $log, FIREBASE_URL, filepickerService, $location,$ACTIVEROAR,$dashboards, CLAIMDOCS, ckstarter,ckender,ckheader, $http,$filter) {
             return function(files, phd, main) {








                 phd.roarmap = {
                     collections: [],
                     roarlist: []
               };
                 phd.roarlist = {};
                 var deferred = $q.defer();



                 var matter = Matter($stateParams.matterId, $stateParams.groupId);
                 //var collections = Collections();
                 var dashboards = Collection($stateParams.pageid);
                 var dashboardsref = dashboards.$ref();
                //  var phdref = Collection(phd.id).$ref();
                 var projref = Collection($stateParams.pId).$ref();



                 function hello(phd) {
                    //  var check = checkforexistingphd();
                    //  if (check) {
                    //      alertify.alert('already exists');
                    //  } else {
                    //      buildroar();
                    //  }

                   buildcollections(phd);


                 };
                 hello(phd);
                 return deferred.promise;

                 function buildroar(groupids, phd) {
                   var claimref = Collection(groupids[3]).$ref();
                    var artref = Collection(groupids[2]).$ref();
                    var meritsref = Collection(groupids[1]).$ref();
                    var allref = Collection(groupids[0]).$ref();

                    angular.forEach(phd.imagefile, function (file, key) {
                       //$timeout(function () {
                         if ((file['Mail Room Date'] === '')||(file['Filename'] === '')) {
                             return ;
                         }else{
                         var appnumber = angular.copy(phd.application['Application Number']).replace('/', '').replace(',', '').replace(',', '');
                         var date = new Date();
                         var roarevent = angular.copy(file);
                         var maildate = new Date(file['Mail Room Date']);
                         var mailyear = maildate.getFullYear();
                         var mailmonth = maildate.getMonth();
                         var mailday = maildate.getDate();
                         var roardate = maildate.toDateString();

                         var filename = file.Filename || null;
                         var appnumsubstring = filename.slice(0, filename.indexOf("-"));
                         var appdatesubstring = filename.slice((filename.indexOf("-") + 1), (filename.indexOf("-") + 11));
                         var doccode = filename.slice((filename.lastIndexOf("-") + 1), (filename.indexOf(".pdf")));
                         roarevent.content_type = 'document';
                        var de = filename.slice(0,filename.lastIndexOf('-'));
                        roarevent.id = de;
                         if ($location.host() === 'localhost') {

                            roarevent.ocrlink = 'https://lexlab.io/files/public/uspto/' + appnumsubstring + '/' + appnumsubstring + '-image_file_wrapper/' + filename.replace('.pdf','_ocr.pdf');

                           roarevent.selflink = '/files/public/uspto/' + appnumsubstring + '/' + appnumsubstring + '-image_file_wrapper/' + filename;
                           roarevent.media = roarevent.ocrlink;
                          //  roarevent.media = '/files/viewer/web/viewer.html?file=%2Ffiles/public/uspto/' + appnumsubstring + '/' + appnumsubstring + '-image_file_wrapper/' + filename;
                         } else {
                            roarevent.ocrlink = 'https://lexlab.io/files/public/uspto/' + appnumsubstring + '/' + appnumsubstring + '-image_file_wrapper/' + filename.replace('.pdf','_ocr.pdf');

                           roarevent.selflink = 'https://lexlab.io/files/public/uspto/' + appnumsubstring + '/' + appnumsubstring + '-image_file_wrapper/' + filename;
                           roarevent.media = roarevent.ocrlink;
                          //  roarevent.media = 'https://lexlab.io/files/public/viewer/web/viewer.html?file=%2Ffiles/public/uspto/' + appnumsubstring + '/' + appnumsubstring + '-image_file_wrapper/' + filename;
                         }
                         roarevent.description = file['Document Description'] || null;
                         roarevent.filename = file['Filename'] || null;
                         roarevent.collections = [];
                         roarevent.Application = appnumsubstring || null;
                         roarevent.date = appdatesubstring || null;
                         roarevent.rid = phd.imagefile.length - phd.imagefile.indexOf(file);
                         //roarevent.file = file;
                         //roarevent.collections.push(roarmap.collections[0]);
                         roarevent.patentid = phd.patent.id;
                         roarevent.doccode = file['Document Code'] || null;
                         //roarevent.collections.push(phd.roarmap.collections[0].id);
                         angular.forEach(DOCNAMES, function(code, key) {
                             angular.forEach(code, function(value, key) {

                                 if (doccode === key) {
                                     roarevent.name = value;
                                     roarevent.title = value;
                                 }
                             });
                         });


                       var appfunction = function(roarevent, roarevents, controller, phd){


                           var template = '<script>var app = angular.module("ckapp").controller("AppCtrl", ["$scope", "$compile","$templateCache", "$http", "Collection","$window","$document","$location",function($scope, $compile,$templateCache, $http, Collection,$window,$document,$location){var app = this;'+
                                    'app = ' + controller + ';' +
                                    'app.patent = ' + phd.patent + ';' +
                                    'app.roarevent = ' + roarevent +  ';' +
                                    'app.phd = ' + phd + ';' +
                                    'console.log(' + controller + ');' +
                                    'console.log(' + phd.patent + ');' +
                                    'console.log(' + roarevent +  ');' +
                                    'console.log(' + phd + ');' +
                                    '});</script>';
                                return template;
                            };

                        var wraphead = ckstarter;
var wraptail = ckender;
                    var apptemplate =  '<div id="docheader" class="container-fluid two-col-right" doc-header roarid="'+roarevent.id+'">' +
            // '<div class="row">' +
            // '<div class="col-xs-8"><div class="bs-callout bs-callout-Applicant"><h4>'+ roarevent.title+'</h4><p>Dated '+roardate+'</p><cite>'+roarevent.filename+'&nbsp;&nbsp;<a href="'+roarevent.media+'" pop="true" target="fframe"><i class="fa fa-external-link"></i></a></cite></div><input type="text" ng-model="query" placeholder="Search" class="fa fa-search fa-pull-left" /></div>
            '<div getpdftext="'+roarevent.id+'" pdf-data="'+roarevent.ocrlink+'">&nbsp;</div>' +
                        // '<div class="col-xs-4 col-sm-3 card card-'+roarevent.styleClass+'"><img src="https://placehold.it/250x150/4682b4/fff/&text='+roarevent.rid+'" class="img img-hover img-responsive img-shadow"/> <p class="card-text"><label ng-repeat="match in matches track by $index | unique" class="fa fa-tag">{{match}}</label></p></div>' +
// '<div class="col-xs-4"><img src="https://placehold.it/250x150/4682b4/fff/&text='+roarevent.rid+'" class="img img-hover img-responsive img-shadow"/></div>' +
            // '</div>' +
            '</div>';
                     var ptotemplate = '<div id="docheader" class="container-fluid two-col-left" doc-header roarid="'+roarevent.id+'">' +
            '<div class="row">' +
                        '<div class="col-xs-4 col-sm-3 card card-'+roarevent.styleClass+'"><img src="https://placehold.it/250x150/640002/fff/&text='+roarevent.rid+'" class="img img-hover img-responsive img-shadow"/> <p class="card-text"><label ng-repeat="match in matches track by $index | unique" class="fa fa-tag">{{match}}</label></p></div>' +
// '<div class="col-xs-4"><img src="https://placehold.it/250x150/640002/fff/&text='+roarevent.rid+'" class="img img-hover img-responsive img-shadow"/></div>' +
            '<div class="col-xs-8"><div class="bs-callout bs-callout-PTO bs-callout-reverse"><h4>'+ roarevent.title + '</h4><p>Dated '+roardate+'</p><cite>'+roarevent.filename+'&nbsp;&nbsp;<a href="'+roarevent.media+'" pop="true" target="fframe"><i class="fa fa-external-link"></i></a></cite></div><input type="text" ng-model="query" placeholder="Search" class="fa fa-search fa-pull-right" /></div><div getpdftext="'+roarevent.id+'" pdf-data="'+roarevent.ocrlink+'">&nbsp;</div>' +
            '</div>' +
            '</div>';
                    var noatemplate = '<div id="docheader" class="container-fluid two-col-left" doc-header roarid="'+roarevent.id+'">' +
            '<div class="row">' +
                       '<div class="col-xs-4 col-sm-3 card card-'+roarevent.styleClass+'"><img src="https://placehold.it/250x150/7c994f/fff/&text='+roarevent.rid+'" class="img img-hover img-responsive img-shadow"/> <p class="card-text"><label ng-repeat="match in matches track by $index | unique" class="fa fa-tag">{{match}}</label></p></div>' +
//  '<div class="col-xs-4"><img src="https://placehold.it/250x150/7c994f/fff/&text='+roarevent.rid+'" class="img img-hover img-responsive img-shadow"/></div>' +
            '<div class="col-xs-8"><div class="bs-callout bs-callout-NOA bs-callout-reverse"><h4>' + roarevent.title + '</h4><p>Dated '+roardate+'</p><cite>'+roarevent.filename+'&nbsp;&nbsp;<a href="'+roarevent.media+'" pop="true" target="fframe"><i class="fa fa-external-link"></i></a></cite></div><input type="text" ng-model="query" placeholder="Search" class="fa fa-search fa-pull-right" /></div><div getpdftext="'+roarevent.id+'" pdf-data="'+roarevent.ocrlink+'">&nbsp;</div>' +
            '</div>' +
            '</div>';
                    var petitiontemplate = '<div id="docheader" class="container-fluid two-col-right" doc-header roarid="'+roarevent.id+'">' +
            '<div class="row">' +
            '<div class="col-xs-8 col-sm-9"><div class="bs-callout bs-callout-Petition"><h4>'+ roarevent.title + '</h4><p>Dated '+roardate+'</p><cite>'+roarevent.filename+'&nbsp;&nbsp;<a href="'+roarevent.media+'" pop="true" target="fframe"><i class="fa fa-external-link"></i></a></cite></div><input type="text" ng-model="query" placeholder="Search" class="fa fa-search fa-pull-left" /></div><div getpdftext="'+roarevent.id+'" pdf-data="'+roarevent.ocrlink+'">&nbsp;</div>' +
            '<div class="col-xs-4 col-sm-3 card card-'+roarevent.styleClass+'"><img src="https://placehold.it/250x150/b48200/fff/&text='+roarevent.rid+'" class="img img-hover img-responsive img-shadow"/> <p class="card-text"><label ng-repeat="match in matches track by $index | unique" class="fa fa-tag">{{match}}</label></p></div>' +
            '</div>' +
            '</div>';
             var interviewtemplate = '<div id="docheader" class="container-fluid two-col-right" doc-header roarid="'+roarevent.id+'">' +
            '<div class="row">' +
            '<div class="col-xs-8"><div class="bs-callout bs-callout-Interview"><h4>'+ roarevent.title + '</h4><p>Dated '+roardate+'</p><cite>'+roarevent.filename+'&nbsp;&nbsp;<a href="'+roarevent.media+'" pop="true" target="fframe"><i class="fa fa-external-link"></i></a></cite></div><input type="text" ng-model="query" placeholder="Search" class="fa fa-search fa-pull-left" /></div><div getpdftext="'+roarevent.id+'" pdf-data="'+roarevent.ocrlink+'">&nbsp;</div>' +
                       '<div class="col-xs-4 col-sm-3 card card-'+roarevent.styleClass+'"><img src="https://placehold.it/250x150/&text='+roarevent.rid+'" class="img img-hover img-responsive img-shadow"/> <p class="card-text"><label ng-repeat="match in matches track by $index | unique" class="fa fa-tag">{{match}}</label></p></div>' +
//  '<div class="col-xs-4"<img src="https://placehold.it/250x150/&text='+roarevent.rid+'" class="img img-responsive img-hover img-shadow"/></div>' +
            '</div>' +
            '</div>';


                         angular.forEach(APPDOCCODES, function(code, key) {
                             if (doccode === code) {
                                 roarevent.styleClass = 'Applicant';
                                roarevent.content = wraphead + apptemplate + wraptail;
                                //+ appfunction(roarevent, phd.imagefile, main, phd);
                                  roarevent.data = wraphead + apptemplate + wraptail;
                                  //+ appfunction(roarevent, phd.imagefile, main, phd);
                                     phd.content += apptemplate;

                             }
                         });
                         angular.forEach(PTODOCCODES, function(code, key) {
                             if (doccode === code) {
                                 roarevent.styleClass = 'PTO';
                                  roarevent.content = wraphead + apptemplate + wraptail;
                                  //+ appfunction(roarevent, phd.imagefile, main, phd);
                                  roarevent.data = wraphead + apptemplate + wraptail;
                                  //+ appfunction(roarevent, phd.imagefile, main, phd);
                                     phd.content += apptemplate;
                             }
                         });
                         angular.forEach(INTVDOCCODES, function(code, key) {
                             if (doccode === code) {
                                 roarevent.styleClass = 'Interview';
                                 roarevent.content = wraphead + apptemplate + wraptail;
                                 //+ appfunction(roarevent, phd.imagefile, main, phd);
                                 roarevent.data = wraphead + apptemplate + wraptail;
                                 //+ appfunction(roarevent, phd.imagefile, main, phd);
                                    phd.content += apptemplate;
                            }
                         });
                         angular.forEach(NOADOCCODES, function(code, key) {
                             if (doccode === code) {
                                 roarevent.styleClass = 'NOA';
                                 roarevent.content = wraphead + apptemplate + wraptail;
                                 //+ appfunction(roarevent, phd.imagefile, main, phd);
                                 roarevent.data = wraphead + apptemplate + wraptail;
                                 //+ appfunction(roarevent, phd.imagefile, main, phd);
                                    phd.content += apptemplate;
                             }
                         });
                         angular.forEach(PETDOCCODES, function(code, key) {
                             if (doccode === code) {
                                 roarevent.styleClass = 'Petition';
                                 roarevent.content = wraphead + apptemplate + wraptail;
                                 //+ appfunction(roarevent, phd.imagefile, main, phd);
                                 roarevent.data = wraphead + apptemplate + wraptail;
                                 //+ appfunction(roarevent, phd.imagefile, main, phd);
                                    phd.content += apptemplate;
                             }
                         });
                        //  roarevent.content = wraphead + '<doc-header roarid="' + de + '" roarevent="roarevent"></doc-header>' + wraptail + appfunction(roarevent, phd.imagefile,main,phd);
                        //  roarevent.data = wraphead + '<doc-header roarid="' + de + '" roarevent="roarevent"></doc-header>' + wraptail + appfunction(roarevent, phd.imagefile,main,phd);
                        //  phd.content += '<doc-header roarid="' + de + '" roarevent="roarevent"></doc-header>';
                         var d = new Date();
                        var n = d.getTime();
                          roarevent.rows= [
                              {columns:[
                                  {cid:n+10,styleClass:'col-sm-12',widgets:[{config:{id:'PROMISE',height:'90vh'},styleClass:roarevent.styleClass||'btn-dark',title:'Metadata',type:'metadata', wid:n+101},{config:{id:'PROMISE',height:'90vh'},styleClass:roarevent.styleClass||'btn-dark',title:'Text',type:'text', wid:n+105},{config:{id:'PROMISE',height:'90vh'},styleClass:roarevent.styleClass||'btn-dark',title:'LexPad',type:'ckwidget', wid:n+1010},{config:{height: "90vh",url: roarevent.ocrlink || 'http://www.google.com'},styleClass:roarevent.styleClass || 'btn-dark',title:'LexFrame',type:'iframe',wid:n+100}]}

                              ]}
                          ];
                          //roarevent.content = ckstarter + ckheader + ckender;
                          roarevent.structure = "1";
                          roarevent.isActive = false;


                          // filepicker.storeUrl(roarevent.selflink,
                          //   { filename: roarevent.filename },
                          //   function (Blob) {
                          //     filepicker.convert(
                          //       Blob,
                          //       { format: 'txt' },
                          //       function (new_Blob) {
                          //         roarevent.txt = new_Blob.url;

                                  //alertify.success('text file added for' + roarevent.title);
                                 var refr = Collection(de).$ref();

                                  refr.set(roarevent, function(err) {
                                        var id = de;

                                        refr.update({
                                            id: id,

                                            timestamp: Firebase.ServerValue.TIMESTAMP
                                        });
                                          refr.child('rows').child('0').child('columns').child('0').child('widgets').child('0').child('config').child('id').set(id);
                                          refr.child('rows').child('0').child('columns').child('0').child('widgets').child('1').child('config').child('id').set(id);
                                          refr.child('rows').child('0').child('columns').child('0').child('widgets').child('2').child('config').child('id').set(id);
                                          refr.child('rows').child('0').child('columns').child('0').child('widgets').child('3').child('config').child('id').set(id);
                                          //p.filelist.push(id);
                                          //phdref.child('roarmap').child('roarlist').push(id);
                                          //roarmap.roarevents.push(id);
                                          phd.roarmap.roarlist[id] = id;
                                          main.progresstwo++;
                                          allref.child('roarlist').child(id).set(id);


                                        angular.forEach(MERITSDOCS, function(code, key) {
                                            if (roarevent.doccode === code) {

                                                //p.meritslist.push(id);
                                               // dashboardsref.child('roarlist').push(id);

                                                meritsref.child('roarlist').child(id).set(id);

                                                main.pushtoqueue(file);
                                                $log.info('merits', id);
                                            }
                                        });

                                        angular.forEach(ARTDOCS, function(code, key) {
                                            if (roarevent.doccode === code) {

                                              //p.artlist.push(id);

                                              artref.child('roarlist').child(id).set(id);
                                                $log.info('art', id);
                                            }
                                        });
                                        angular.forEach(CLAIMDOCS, function (code, key) {
                                          if (roarevent.doccode === code) {
                                            claimref.child('roarlist').child(id).set(id);
                                            $log.info('claims', id);
                                          }
                                        });

                                    });

                         }


                         });
                     return deferred.resolve(groupids);
                    //  $timeout(function() {
                    //      buildcollections(p);
                    //  }, 30000);
                 };

                 function buildcollections(phd) {
                    var d = new Date();
                        var n = d.getTime();

                   var Binder = function (options) {
                       var binder = this;
                            binder = {
                              name: 'USSN ' + phd.application['Application Number'],

                              rid: options.rid,
                               title: options.title + ' - ' + 'USSN ' + phd.application['Application Number'],
                              collection_type: 'source',
                              description: 'for US ' + phd.patent.id,
                              styleClass: options.styleClass,
                              sortOrder: options.sortOrder,
                              icon: options.icon,
                              app: phd.application['Application Number'],
                              content_type: 'collection',
                              /*titleTemplateUrl: '/llp_core/modules/roarmap/directive/roargrid/roargrid-title.html',*/
                              rows:[{styleClass:'row leather',columns:[{cid:n+10,styleClass:'col-sm-12',widgets:[{type:'pagebuilder',title: options.rid + ' - ' + 'USSN ' + phd.application['Application Number'],styleClass: options.styleClass || 'btn-dark',config:{id:'PROMISE',url:'/llp_core/modules/roarmap/directive/roargrid/roargrid.html'}}]}]}]

                          };
                        return binder;
                     };
                   var phdall = { rid: 'PHD1', title: 'ALL', styleClass: 'NOA', icon: 'fa-legal', sortOrder: 1 },
                     phdmerits = { rid: 'PHD4', title: 'MERITS', styleClass: 'PTO', icon: 'fa-balance-scale', sortOrder: 4 },
                     phdart = { rid: 'PHD2', title: 'ART', styleClass: 'Petition', icon: 'fa-leaf', sortOrder: 2 },
                     phdclaims = { rid: 'PHD3', title: 'CLAIMS', styleClass: 'Applicant', icon: 'fa-sitemap', sortOrder: 3};
                     var groupids = [];
                     var groups = { all: phdall, merits: phdmerits, art: phdart, claims: phdclaims };
                     angular.forEach(groups, function (group, key) {
                       var refr = Collection(phd.patent.id+group.title).$ref();
                       refr.set(new Binder(group), function (err) {
                         var id = phd.patent.id+group.title;
                         refr.update({
                           id: id,
                           timestamp: Firebase.ServerValue.TIMESTAMP
                         });
                         refr.child('rows').child('0').child('columns').child('0').child('widgets').child('0').child('config').child('id').set(id);
                         //ref.child('roarlist').push(id);
                        // phd.roarmap.collections[id] = id;
                        // phd.roarlist[id] = id;
                        //  phdref.child('roarmap').child('collections').push(id);
                        //  phdref.child('roarlist').push(id);
                        // dashboardsref.child('roarlist').push(id);
                        //  projref.child('roarlist').push(id);


                         return groupids.push(id);
                       });
                     });
                    //  buildroar(groupids);
                      $timeout(function () {
                        addpatent(groupids, phd);
                      }, 500);
                 };

function addpatent (groupids, phd){
       var date = new Date();
            var d = new Date();
            var n = d.getTime();
            var patent = angular.copy(phd.patent);
            patent.rows = [
                              {columns:[
                                  {cid:n+10,styleClass:'col-sm-6',widgets:[{config:{height: "30em",url: patent.media || 'http://www.google.com'},title:patent.title || 'title',titleTemplateUrl:'{widgetsPath}/testwidget/src/title.html',type:'iframe',wid:n+100,styleClass:patent.styleClass || 'btn-dark'}]},
                                  {cid:n+1000,styleClass:'col-sm-6',widgets:[{config:{id:'PROMISE'},title:patent.title || 'title',titleTemplateUrl:'{widgetsPath}/testwidget/src/title.html',type:'ckwidget', wid:n+15,styleClass:patent.styleClass || 'btn-dark'}]}
                              ]}
                          ];
            patent.structure = "6-6";
            var refr = Collection(phd.patent.id).$ref();
            refr.set(patent, function (err) {
              var id = phd.patent.id;
              refr.update({
                id: id,
                timestamp: Firebase.ServerValue.TIMESTAMP
              });
              refr.child('rows').child('0').child('columns').child('1').child('widgets').child('0').child('config').child('id').set(id);
              var allref = Collection(groupids[0]).$ref();
              var meritsref = Collection(groupids[1]).$ref();
              allref.child('roarlist').child(id).set(id);
              meritsref.child('roarlist').child(id).set(id);
              buildroar(groupids, phd);
            });
}




                //  function buildcollections(p) {
                //    var d = new Date();
                //         var n = d.getTime();

                //    var newcollection = {
                //          name: 'USSN ' + phd.application['Application Number'],
                //          title: 'USSN ' + phd.application['Application Number'],
                //          rid: 'PHD1 - ALL',
                //          collectiontype: 'source',
                //          description: 'PhD for USSN ' + phd.application['Application Number'],
                //          styleClass: 'success',
                //          icon: 'fa-file-pdf-o',
                //          app: phd.application['Application Number'],
                //          content_type: 'collection',
                //          titleTemplateUrl: '/llp_core/modules/roarmap/directive/roargrid/roargrid-title.html',
                //          rows:[{styleClass:'row slate',columns:[{cid:n+10,styleClass:'col-sm-12',widgets:[{type:'pagebuilder',config:{id:'PROMISE',url:'/llp_core/modules/roarmap/directive/roargrid/roargrid.html'}}]}]}]}],
                //          roarlist: p.filelist
                //      };
                //      var newmerits = {
                //          name: 'USSN ' + phd.application['Application Number'],
                //          title: 'USSN ' + phd.application['Application Number'],
                //          rid: 'PHD2 - MERITS',
                //          collectiontype: 'source',
                //          description: 'PhD for USSN ' + phd.application['Application Number'],
                //          styleClass: 'danger',
                //          icon: 'fa-balance',
                //          app: phd.application['Application Number'],
                //          content_type: 'collection',
                //          titleTemplateUrl: '/llp_core/modules/roarmap/directive/roargrid/roargrid-title.html',
                //          rows:[{styleClass:'row slate',columns:[{cid:n+10,styleClass:'col-sm-12',widgets:[{type:'pagebuilder',config:{id:'PROMISE',url:'/llp_core/modules/roarmap/directive/roargrid/roargrid.html'}}]}]}]}],
                //          roarlist: p.meritslist
                //      };

                //      var newart = {
                //          name: 'USSN ' + phd.application['Application Number'],
                //          title: 'USSN ' + phd.application['Application Number'],
                //          rid: 'PHD3 - ART',
                //          collectiontype: 'source',
                //          description: 'PhD for USSN ' + phd.application['Application Number'],
                //          styleClass: 'warning',
                //          icon: 'fa-paintbrush',
                //          app: phd.application['Application Number'],
                //          content_type: 'collection',
                //          titleTemplateUrl: '/llp_core/modules/roarmap/directive/roargrid/roargrid-title.html',
                //          rows:[{styleClass:'row slate',columns:[{cid:n+10,styleClass:'col-sm-12',widgets:[{type:'pagebuilder',config:{id:'PROMISE',url:'/llp_core/modules/roarmap/directive/roargrid/roargrid.html'}}]}]}]}],
                //          roarlist: p.artlist
                //      };




                //     var cray = [newcollection, newmerits, newart];




                //      angular.forEach(cray, function(col, key) {
                //          collections.$add(col)
                //              .then(function(ref) {

                //                  var cId = ref.key();


                //                  ref.update({
                //                    id: cId,

                //                      timestamp: Firebase.ServerValue.TIMESTAMP


                //                  });
                //                  ref.child('rows').child('0').child('columns').child('0').child('widgets').child('0').child('config').child('id').set(cId);
                //                  phdref.child('roarmap').child('collections').push(cId);
                //                  phdref.child('roarlist').push(cId);

                //                  dashboardsref.child('roarlist').push(cId);

                //              });


                //      });


                //      return deferred.resolve(roarmap);
                //  };




             };
         }
     ]).controller('PageslideCtrl',['$scope',function($scope){

                $scope.checked = false; // This will be binded using the ps-open attribute

                $scope.toggle = function () {
                    $scope.checked = !$scope.checked;
                };
                $scope.checked1 = false; // This will be binded using the ps-open attribute

                $scope.toggle1 = function () {
                    $scope.checked1 = !$scope.checked1;
                };
                $scope.checked2 = false; // This will be binded using the ps-open attribute

                $scope.toggle2 = function () {
                    $scope.checked2 = !$scope.checked2;
                };

     }]).factory('$$roarmap', ["APPDOCCODES", "PTODOCCODES", "INTVDOCCODES", "PETDOCCODES", "NOADOCCODES", "DOCNAMES", "ckstarter", "ckender", "$location", "pdfToPlainText", "$http", function(APPDOCCODES,PTODOCCODES,INTVDOCCODES,PETDOCCODES,NOADOCCODES,DOCNAMES,ckstarter,ckender,$location,pdfToPlainText,$http){
         return function(inputarray, patent){
             var output = [];
            //  return output;

                           angular.forEach(inputarray, function (file, key) {
                       //$timeout(function () {
                         if (angular.isUndefined(file.Filename)||(file['Mail Room Date'] === '')||(file['Filename'] === '')) {
                             return ;
                         }else{
                         //var appnumber = angular.copy(phd.application['Application Number']).replace('/', '').replace(',', '').replace(',', '');
                         var date = new Date();
                         var roarevent = angular.copy(file);
                         var maildate = new Date(file['Mail Room Date']);
                         var mailyear = maildate.getFullYear();
                         var mailmonth = maildate.getMonth();
                         var mailday = maildate.getDate();
                         var roardate = maildate.toDateString();

                         var filename = file.Filename || null;
                         var appnumsubstring = filename.slice(0, filename.indexOf("-"));
                         var appdatesubstring = filename.slice((filename.indexOf("-") + 1), (filename.indexOf("-") + 11));
                         var doccode = filename.slice((filename.lastIndexOf("-") + 1), (filename.indexOf(".pdf")));
                         roarevent.content_type = 'document';

                        //  if ($location.host() === 'localhost') {
                        //    roarevent.selflink = '/files/public/uspto/' + appnumsubstring + '/' + appnumsubstring + '-image_file_wrapper/' + filename;
                        //    roarevent.media = roarevent.selflink;
                        //   //  roarevent.media = '/files/viewer/web/viewer.html?file=%2Ffiles/public/uspto/' + appnumsubstring + '/' + appnumsubstring + '-image_file_wrapper/' + filename;
                        //  } else {
                           roarevent.selflink = 'https://lexlab.io/files/public/uspto/' + appnumsubstring + '/' + appnumsubstring + '-image_file_wrapper/' + filename;
                           roarevent.media = roarevent.selflink;
                            roarevent.ocrmedia = 'https://lexlab.io/ocr/public/uspto/'+ appnumsubstring + '/' + appnumsubstring + '-image_file_wrapper/' + filename;
                          //  roarevent.media = 'https://lexlab.io/files/public/viewer/web/viewer.html?file=%2Ffiles/public/uspto/' + appnumsubstring + '/' + appnumsubstring + '-image_file_wrapper/' + filename;
                         //}
                         roarevent.description = file['Document Description'] || null;
                         roarevent.filename = file['Filename'] || null;
                         roarevent.collections = [];
                         roarevent.Application = appnumsubstring || null;
                         roarevent.date = appdatesubstring || null;
                         roarevent.rid = inputarray.indexOf(file);
                         //roarevent.file = file;
                         //roarevent.collections.push(roarmap.collections[0]);
                         roarevent.doccode = file['Document Code'] || null;
                         //roarevent.collections.push(phd.roarmap.collections[0].id);
                         angular.forEach(DOCNAMES, function(code, key) {
                             angular.forEach(code, function(value, key) {

                                 if (doccode === key) {
                                     roarevent.name = value;
                                     roarevent.title = value;
                                 }
                             });
                         });


                       var card =             '<div class="col-xs-4 col-1"><div class="card"><img src="https://placehold.it/300x225/640002/fff/&text=R" class="img img-responsive img-shadow"/><div class="card-block"><h4 class="card-title">Title</h4><p class="card-text">Do nulla id sint reprehenderit esse. Quis sunt duis consequat sit sint duis officia veniam qui. Occaecat ipsum esse officia qui et reprehenderit tempor. Aliqua officia qui occaecat veniam commodo esse magna fugiat reprehenderit duis. Adipisicing laborum ex commodo velit.</p></div></div></div>';

                        var wraphead = ckstarter;
                        var old = 'https://placehold.it/250x208/4682b4/fff/&text='+ roarevent.rid;
var wraptail = ckender;
var frametemplate = 'http://localhost:3000/patents/US' + patent;
                        var apptemplate =  '<div class="container-fluid two-col-right" doc-header roarid="'+roarevent.id+'">' +
            '<div class="row">' +
            '<div id="col-xs-4" class="col-xs-9" ><div class="bs-callout bs-callout-Applicant"><h4>'+ roarevent.title+'</h4><p>Filed '+roardate+'</p><cite>'+roarevent.filename+'&nbsp;&nbsp;<a href="'+roarevent.media+'" target="fframe"><i class="fa fa-external-link"></i></a></cite>'+  '</div></div>' +
            '<div id="col-xs-4" class="col-xs-3"  onmouseenter="$(\'#col-xs-9\').toggleClass(\'col-xs-9 col-xs-3\');$(\'#col-xs-3\').toggleClass(\'col-xs-9 col-xs-3\')"><p><iframe name="fframe" src="' + frametemplate +  '" class="img img-responsive img-shadow" style="background-image:url('+old+');"></iframe></p></div>' +
            '</div>' +
            '</div><p>&nbsp;</p>';
                     var ptotemplate = '<div class="container-fluid two-col-left" doc-header roarid="'+roarevent.id+'">' +
            '<div class="row">' +
            '<div class="col-xs-4"><p><img src="https://placehold.it/250x208/640002/fff/&text='+ roarevent.rid + '" class="img img-responsive img-shadow"/></p></div>' +
            '<div class="col-xs-8"><div class="bs-callout bs-callout-PTO bs-callout-reverse"><h4>'+ roarevent.title + '</h4><p>Filed '+roardate+'</p><cite>'+roarevent.filename+'&nbsp;&nbsp;<a href="'+roarevent.media+'" target="fframe"><i class="fa fa-external-link"></i></a></cite></div></div>' +
            '</div>' +
            '</div><p>&nbsp;</p>';
                    var noatemplate = '<div class="container-fluid two-col-left" doc-header roarid="'+roarevent.id+'">' +
            '<div class="row">' +
            '<div class="col-xs-4"><p><img src="https://placehold.it/250x208/7c994f/fff/&text='+roarevent.rid+'" class="img img-responsive img-shadow"/></p></div>' +
            '<div class="col-xs-8"><div class="bs-callout bs-callout-NOA bs-callout-reverse"><h4>' + roarevent.title + '</h4><p>Filed '+roardate+'</p><cite>'+roarevent.filename+'&nbsp;&nbsp;<a href="'+roarevent.media+'" target="fframe"><i class="fa fa-external-link"></i></a></cite></div></div>' +
            '</div>' +
            '</div><p>&nbsp;</p>';
                    var petitiontemplate = '<div class="container-fluid two-col-right" doc-header roarid="'+roarevent.id+'">' +
            '<div class="row">' +
            '<div class="col-xs-8"><div class="bs-callout bs-callout-Petition"><h4>'+ roarevent.title + '</h4><p>Filed '+roardate+'</p><cite>'+roarevent.filename+'&nbsp;&nbsp;<a href="'+roarevent.media+'" target="fframe"><i class="fa fa-external-link"></i></a></cite></div></div>' +
            '<div class="col-xs-4"><p><img src="https://placehold.it/250x208/b48200/fff/&text='+roarevent.rid+'" class="img img-responsive img-shadow"/></p></div>' +
            '</div>' +
            '</div><p>&nbsp;</p>';
             var interviewtemplate = '<div class="container-fluid two-col-right" doc-header roarid="'+roarevent.id+'">' +
            '<div class="row">' +
            '<div class="col-xs-8"><div class="bs-callout bs-callout-Interview"><h4>'+ roarevent.title + '</h4><p>Filed '+roardate+'</p><cite>'+roarevent.filename+'&nbsp;&nbsp;<a href="'+roarevent.media+'" target="fframe"><i class="fa fa-external-link"></i></a></cite></div></div>' +
            '<div class="col-xs-4"><p><img src="https://placehold.it/250x208/&text='+roarevent.rid+'" class="img img-responsive img-shadow"/></p></div>' +
            '</div>' +
            '</div><p>&nbsp;</p>';



                         angular.forEach(APPDOCCODES, function(code, key) {
                             if (doccode === code) {
                                 roarevent.styleClass = 'Applicant';
                                 roarevent.content = wraphead + apptemplate + wraptail;


                             }


                         });
                         angular.forEach(PTODOCCODES, function(code, key) {
                             if (doccode === code) {
                                 roarevent.styleClass = 'PTO';
                                 roarevent.content = wraphead + ptotemplate + wraptail;
                             }
                         });
                         angular.forEach(INTVDOCCODES, function(code, key) {
                             if (doccode === code) {
                                 roarevent.styleClass = 'Interview';
                                 roarevent.content = wraphead + interviewtemplate + wraptail;
                             }
                         });
                         angular.forEach(NOADOCCODES, function(code, key) {
                             if (doccode === code) {
                                 roarevent.styleClass = 'NOA';
                                 roarevent.content = wraphead + noatemplate + wraptail;
                             }
                         });
                         angular.forEach(PETDOCCODES, function(code, key) {
                             if (doccode === code) {
                                 roarevent.styleClass = 'Petition';
                                 roarevent.content = wraphead + petitiontemplate + wraptail;
                             }
                         });

                         var d = new Date();
                        var n = d.getTime();
                          roarevent.rows= [
                              {columns:[
                                  {cid:n+10,styleClass:'col-sm-6',widgets:[{config:{height: "30em",url: roarevent.media || 'http://www.google.com'},styleClass:roarevent.styleClass || 'btn-dark',title:roarevent.title || 'title',type:'iframe',wid:n+100}]},
                                  {cid:n+1000,styleClass:'col-sm-6',widgets:[{config:{id:'PROMISE'},styleClass:roarevent.styleClass||'btn-dark',title:roarevent.title || 'title',type:'ckwidget', wid:n+1010}]}
                              ]}
                          ];
                          //roarevent.content = ckstarter + ckheader + ckender;
                          roarevent.structure = "6-6";
                          roarevent.isActive = false;

                         output.push(roarevent);
                         }  });

             return output;
         }
     }]).filter('strip', function(){
         return function(input){
             if (input !== (null || undefined)){
            var regex = new RegExp(/\D/ig);
            var output = input.replace(regex, '');
            return output;
             }
             else{
                 return input;
             }
         };
     }).directive('docHeader',['$window','$document','$compile','$templateCache','Collection', function($window,$document,$compile,$templateCache,Collection){
         return {
           restrict:'EA',
           scope:{
                roarevent:'=?'
           },
           transclude: true,
           templateUrl: '{widgetsPath}/getphd/src/phd/docheader.html',
           //controller:'ROARCtrl',
           //controllerAs:'roarevent',
           //bindToController: true,
           link: function($scope,$element,$attrs,$ctrl){
                var roarid = $attrs.roarid;
                $scope.roarid = roarid;
                Collection(roarid).$loaded().then(function(roarevent){
                    $scope.roarevent=roarevent;


var maildate = new Date(roarevent['Mail Room Date']);

                $scope.roardate = maildate.toDateString();
                  var background = function(styleClass){

                    var template;
                    // var styleClass = roarevent.styleClass;
                    switch (styleClass){
                        case 'Applicant':
                        template = '4682b4';
                        break;
                    case 'PTO':
                        template = '640002';
                        break;
                    case 'Petition':
                        template = 'b48200';
                        break;
                    case 'Interview':
                        template = null;
                        break;
                    case 'NOA':
                        template = '7c994f';
                        break;
                    }

                    return 'https://placehold.it/250x150/'+template+'/fff/&text='+$scope.roarevent.rid;
                };
                $scope.background = background;


           });
         }
         };
     }]).directive('patentreport', ['$http', 'ckstarter', 'ckender', function ($http, ckstarter, ckender) {
        return {
            restrict: 'EA',
            templateUrl: '{widgetsPath}/getphd/src/phd/patentReport.html',
            scope: {
            },
            link: function ($scope, $element, $attr, $ctrl) {
                var numbr = $attr.patent;
                if ($attr.pnum){
                  $scope.config = {
                    PNUM: $attr.pnum
                  }
                }
                try{ Collection(numbr).$loaded().then(function(data){
                    $scope.patent = data;
                });
                }catch(ex){
                    $http.get('https://lexlab.io/proxy/lexlab.io/getphd/patents/' + numbr).then(function (resp) {
                        $scope.patent = resp.data;
                    });
                }
                finally{
                    alertify.success('loaded!');
                }

            }
        };
    }])
    .directive('patentCitation', ['$http','Collection',function($http, Collection){
        return {
            restrict: 'EA',
            templateUrl: '{widgetsPath}/getphd/src/phd/citation.html',
            scope:{
              ref: '='
            },

            link: function($scope,$element,$attrs,$ctrl){
                //var p = this;
                // var id = $attrs.patent;
                var ref = $scope.ref;
                try{ Collection(ref).$loaded().then(function(data){
                    $scope.p = data;
                });
                }catch(ex){
                    $http.get('https://lexlab.io/proxy/lexlab.io/getphd/patents/' + ref).then(function (resp) {
                        $scope.p = resp.data;
                    });
                }
                finally{
                    // alertify.success('loaded!');
                }

            }
        };
    }]);

                /*var apptemplate =  '<div class="container-fluid two-col-right">' +
            '<div class="row">' +
            '<div class="col-xs-8"><div class="bs-callout bs-callout-Applicant"><h4>'+ roarevent.title+'</h4><p>Filed '+roardate+'</p><cite>'+roarevent.filename+'&nbsp;&nbsp;<a href="'+roarevent.media+'" target="fframe"><i class="fa fa-external-link"></i></a></cite></div></div>' +
            '<div class="col-xs-4"><iframe name="fframe" id="fframe" style="width:350px;height:480px;" src="https://placehold.it/350x480/4682b4/fff/&text='+roarevent.rid+'" class="img img-responsive img-shadow"><img src="https://placehold.it/350x480/4682b4/fff/&text='+roarevent.rid+'" class="img img-responsive img-shadow"/></iframe></div>' +
            '</div>' +
            '</div><p>&nbsp;</p>';
                     var ptotemplate = '<div class="container-fluid two-col-left">' +
            '<div class="row">' +
            '<div class="col-xs-4"><iframe name="fframe" id="fframe" style="width:350px;height:480px;" src="https://placehold.it/350x480/b48200/fff/&text='+roarevent.rid+'" class="img img-responsive img-shadow"><img src="https://placehold.it/350x480/b48200/fff/&text='+roarevent.rid+'" class="img img-responsive img-shadow"/></iframe><p><img src="https://placehold.it/250x208/640002/fff/&text='+ roarevent.rid + '" class="img img-responsive img-shadow"/></p></div>' +
            '<div class="col-xs-8"><div class="bs-callout bs-callout-PTO bs-callout-reverse"><h4>'+ roarevent.title + '</h4><p>Filed '+roardate+'</p><cite>'+roarevent.filename+'&nbsp;&nbsp;<a href="'+roarevent.media+'" target="fframe"><i class="fa fa-external-link"></i></a></cite></div></div>' +
            '</div>' +
            '</div><p>&nbsp;</p>';
                    var noatemplate = '<div class="container-fluid two-col-left">' +
            '<div class="row">' +
            '<div class="col-xs-4"><iframe name="fframe" id="fframe" style="width:350px;height:480px;" src="https://placehold.it/350x480/b48200/fff/&text='+roarevent.rid+'" class="img img-responsive img-shadow"><img src="https://placehold.it/350x480/b48200/fff/&text='+roarevent.rid+'" class="img img-responsive img-shadow"/></iframe><p><img src="https://placehold.it/250x208/7c994f/fff/&text='+roarevent.rid+'" class="img img-responsive img-shadow"/></p></div>' +
            '<div class="col-xs-8"><div class="bs-callout bs-callout-NOA bs-callout-reverse"><h4>' + roarevent.title + '</h4><p>Filed '+roardate+'</p><cite>'+roarevent.filename+'&nbsp;&nbsp;<a href="'+roarevent.media+'" target="fframe"><i class="fa fa-external-link"></i></a></cite></div></div>' +
            '</div>' +
            '</div><p>&nbsp;</p>';
                    var petitiontemplate = '<div class="container-fluid two-col-right">' +
            '<div class="row">' +
            '<div class="col-xs-8"><div class="bs-callout bs-callout-Petition"><h4>'+ roarevent.title + '</h4><p>Filed '+roardate+'</p><cite>'+roarevent.filename+'&nbsp;&nbsp;<a href="'+roarevent.media+'" target="fframe"><i class="fa fa-external-link"></i></a></cite></div></div>' +
            '<div class="col-xs-4"><iframe name="fframe" id="fframe" style="width:350px;height:480px;" src="https://placehold.it/350x480/b48200/fff/&text='+roarevent.rid+'" class="img img-responsive img-shadow"><img src="https://placehold.it/350x480/b48200/fff/&text='+roarevent.rid+'" class="img img-responsive img-shadow"/></iframe></div>' +
            '</div>' +
            '</div><p>&nbsp;</p>';
             var interviewtemplate = '<div class="container-fluid two-col-right">' +
            '<div class="row">' +
            '<div class="col-xs-8"><div class="bs-callout bs-callout-Interview"><h4>'+ roarevent.title + '</h4><p>Filed '+roardate+'</p><cite>'+roarevent.filename+'&nbsp;&nbsp;<a href="'+roarevent.media+'" target="fframe"><i class="fa fa-external-link"></i></a></cite></div></div>' +
            '<div class="col-xs-4"><iframe name="fframe" id="fframe" style="width:350px;height:480px;" src="https://placehold.it/350x480/b48200/fff/&text='+roarevent.rid+'" class="img img-responsive img-shadow"><img src="https://placehold.it/350x480/b48200/fff/&text='+roarevent.rid+'" class="img img-responsive img-shadow"/></iframe><p><img src="https://placehold.it/250x208/&text='+roarevent.rid+'" class="img img-responsive img-shadow"/></p></div>' +
            '</div>' +
            '</div><p>&nbsp;</p>';
            */


angular.module('roar').controller('TextController', ['$scope','Collection','config','$stateParams',
  function($scope, Collection, config, $stateParams){
    var config = $scope.$parent.config || $scope.$parent.$parent.config;
    var pId = $stateParams.pId;
    var tree = Collection(pId);
    $scope.tree = tree;
    var roarevent = Collection(config.id);
    roarevent.$bindTo($scope, 'roarevent');
$scope.config = config;


}]);

angular.module('llp.pdf', ['LocalStorageModule'])
    .config(["localStorageServiceProvider", function (localStorageServiceProvider) {
        localStorageServiceProvider.setPrefix('adf.getphd');
    }])
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

                        if (angular.isUndefined($scope.roarevent.pages)) {
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
                                        if ($scope.roarevent.doccode == 'CTNF'){
var header = section.match(/Application\/Control.*?Art\sUnit:.?\d+\s/i);
var num = section.match(/Page\s\d+/i);
   if (num == !null){
                              var numb = num.split(' ');

                            var numm = parseInt(numb[1]);
                            }
                            var text =  section.replace(/Application\/Control.*?Art\sUnit:.?\d+\s/ig, '');

                            var pag = {
                                            annotations: [{id:0,startIndex:0,endIndex:0,type:'aqua'}],
                                            id: $scope.roarevent.pages.length,
                                            text: text,
                                            header: header[0],
                                            number: numm
                                        };
                                        }
                                        else{
                                          var pag = {
                                            annotations: [{id:0,startIndex:0,endIndex:0,type:'aqua'}],
                                            id: $scope.roarevent.pages.length,
                                            text: section,
                                            header: null,
                                            number: numm
                                        };
                                        }
                                        $scope.roarevent.pages.push(pag);
                                         $scope.roarevent.$save();
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

angular.module('llp.parsetsv', [])
    .factory('parseTSV', [function () {
        return function (file, options, verbose) {
            var _file = file;
            var options = options;

            var json = Papa.parse(_file, options);


            return verbose ? json : json.data;
        };
    }]);

/*!
 * jQuery twitter bootstrap wizard plugin
 * Examples and documentation at: http://github.com/VinceG/twitter-bootstrap-wizard
 * version 1.0
 * Requires jQuery v1.3.2 or later
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * Authors: Vadim Vincent Gabriel (http://vadimg.com), Jason Gill (www.gilluminate.com)
 */
;(function($) {
var bootstrapWizardCreate = function(element, options) {
	var element = $(element);
	var obj = this;

	// Merge options with defaults
	var $settings = $.extend({}, $.fn.bootstrapWizard.defaults, options);
	var $activeTab = null;
	var $navigation = null;
	
	this.rebindClick = function(selector, fn)
	{
		selector.unbind('click', fn).bind('click', fn);
	}

	this.fixNavigationButtons = function() {
		// Get the current active tab
		if(!$activeTab.length) {
			// Select first one
			$navigation.find('a:first').tab('show');
			$activeTab = $navigation.find('li:first');
		}

		// See if we're currently in the first/last then disable the previous and last buttons
		$($settings.previousSelector, element).toggleClass('disabled', (obj.firstIndex() >= obj.currentIndex()));
		$($settings.nextSelector, element).toggleClass('disabled', (obj.currentIndex() >= obj.navigationLength()));

		// We are unbinding and rebinding to ensure single firing and no double-click errors
		obj.rebindClick($($settings.nextSelector, element), obj.next);
		obj.rebindClick($($settings.previousSelector, element), obj.previous);
		obj.rebindClick($($settings.lastSelector, element), obj.last);
		obj.rebindClick($($settings.firstSelector, element), obj.first);

		if($settings.onTabShow && typeof $settings.onTabShow === 'function' && $settings.onTabShow($activeTab, $navigation, obj.currentIndex())===false){
			return false;
		}
	};

	this.next = function(e) {

		// If we clicked the last then dont activate this
		if(element.hasClass('last')) {
			return false;
		}

		if($settings.onNext && typeof $settings.onNext === 'function' && $settings.onNext($activeTab, $navigation, obj.nextIndex())===false){
			return false;
		}

		// Did we click the last button
		$index = obj.nextIndex();
		if($index > obj.navigationLength()) {
		} else {
			$navigation.find('li:eq('+$index+') a').tab('show');
		}
	};

	this.previous = function(e) {

		// If we clicked the first then dont activate this
		if(element.hasClass('first')) {
			return false;
		}

		if($settings.onPrevious && typeof $settings.onPrevious === 'function' && $settings.onPrevious($activeTab, $navigation, obj.previousIndex())===false){
			return false;
		}

		$index = obj.previousIndex();
		if($index < 0) {
		} else {
			$navigation.find('li:eq('+$index+') a').tab('show');
		}
	};

	this.first = function(e) {
		if($settings.onFirst && typeof $settings.onFirst === 'function' && $settings.onFirst($activeTab, $navigation, obj.firstIndex())===false){
			return false;
		}

		// If the element is disabled then we won't do anything
		if(element.hasClass('disabled')) {
			return false;
		}
		$navigation.find('li:eq(0) a').tab('show');

	};
	this.last = function(e) {
		if($settings.onLast && typeof $settings.onLast === 'function' && $settings.onLast($activeTab, $navigation, obj.lastIndex())===false){
			return false;
		}

		// If the element is disabled then we won't do anything
		if(element.hasClass('disabled')) {
			return false;
		}
		$navigation.find('li:eq('+obj.navigationLength()+') a').tab('show');
	};
	this.currentIndex = function() {
		return $navigation.find('li').index($activeTab);
	};
	this.firstIndex = function() {
		return 0;
	};
	this.lastIndex = function() {
		return obj.navigationLength();
	};
	this.getIndex = function(e) {
		return $navigation.find('li').index(e);
	};
	this.nextIndex = function() {
		return $navigation.find('li').index($activeTab) + 1;
	};
	this.previousIndex = function() {
		return $navigation.find('li').index($activeTab) - 1;
	};
	this.navigationLength = function() {
		return $navigation.find('li').length - 1;
	};
	this.activeTab = function() {
		return $activeTab;
	};
	this.nextTab = function() {
		return $navigation.find('li:eq('+(obj.currentIndex()+1)+')').length ? $navigation.find('li:eq('+(obj.currentIndex()+1)+')') : null;
	};
	this.previousTab = function() {
		if(obj.currentIndex() <= 0) {
			return null;
		}
		return $navigation.find('li:eq('+parseInt(obj.currentIndex()-1)+')');
	};
	this.show = function(index) {
		return element.find('li:eq(' + index + ') a').tab('show');
	};
	this.disable = function(index) {
		$navigation.find('li:eq('+index+')').addClass('disabled');
	};
	this.enable = function(index) {
		$navigation.find('li:eq('+index+')').removeClass('disabled');
	};
	this.hide = function(index) {
		$navigation.find('li:eq('+index+')').hide();
	};
	this.display = function(index) {
		$navigation.find('li:eq('+index+')').show();
	};
	this.remove = function(args) {
		var $index = args[0];
		var $removeTabPane = typeof args[1] != 'undefined' ? args[1] : false;
		var $item = $navigation.find('li:eq('+$index+')');

		// Remove the tab pane first if needed
		if($removeTabPane) {
			var $href = $item.find('a').attr('href');
			$($href).remove();
		}

		// Remove menu item
		$item.remove();
	};

	$navigation = element.find('ul:first', element);
	$activeTab = $navigation.find('li.active', element);

	if(!$navigation.hasClass($settings.tabClass)) {
		$navigation.addClass($settings.tabClass);
	}

	// Load onInit
	if($settings.onInit && typeof $settings.onInit === 'function'){
		$settings.onInit($activeTab, $navigation, 0);
	}

	// Load onShow
	if($settings.onShow && typeof $settings.onShow === 'function'){
		$settings.onShow($activeTab, $navigation, obj.nextIndex());
	}

	// Work the next/previous buttons
	obj.fixNavigationButtons();

	$('a[data-toggle="tab"]', $navigation).on('click', function (e) {
		// Get the index of the clicked tab
		var clickedIndex = $navigation.find('li').index($(e.currentTarget).parent('li'));
		if($settings.onTabClick && typeof $settings.onTabClick === 'function' && $settings.onTabClick($activeTab, $navigation, obj.currentIndex(), clickedIndex)===false){
			return false;
		}
	});

	$('a[data-toggle="tab"]', $navigation).on('shown', function (e) {  // use shown instead of show to help prevent double firing
		$element = $(e.target).parent();
		var nextTab = $navigation.find('li').index($element);

		// If it's disabled then do not change
		if($element.hasClass('disabled')) {
			return false;
		}

		if($settings.onTabChange && typeof $settings.onTabChange === 'function' && $settings.onTabChange($activeTab, $navigation, obj.currentIndex(), nextTab)===false){
				return false;
		}

		$activeTab = $element; // activated tab
		obj.fixNavigationButtons();
	});
};
$.fn.bootstrapWizard = function(options) {
	//expose methods
	if (typeof options == 'string') {
		var args = Array.prototype.slice.call(arguments, 1)
		if(args.length === 1) {
			args.toString();
		}
		return this.data('bootstrapWizard')[options](args);
	}
	return this.each(function(index){
		var element = $(this);
		// Return early if this element already has a plugin instance
		if (element.data('bootstrapWizard')) return;
		// pass options to plugin constructor
		var wizard = new bootstrapWizardCreate(element, options);
		// Store plugin object in this element's data
		element.data('bootstrapWizard', wizard);
	});
};

// expose options
$.fn.bootstrapWizard.defaults = {
	tabClass:         'nav nav-pills',
	nextSelector:     '.wizard li.next',
	previousSelector: '.wizard li.previous',
	firstSelector:    '.wizard li.first',
	lastSelector:     '.wizard li.last',
	onShow:           null,
	onInit:           null,
	onNext:           null,
	onPrevious:       null,
	onLast:           null,
	onFirst:          null,
	onTabChange:      null, 
	onTabClick:       null,
	onTabShow:        null
};

})(jQuery);

angular.module("adf.widget.getphd").factory("fileReader", ["$q", "$log", function($q, $log) {

    var onLoad = function(reader, deferred, scope) {
        return function() {
            // scope.$apply(function() {
            deferred.resolve(reader.result);
            // });
        };
    };

    var onError = function(reader, deferred, scope) {
        return function() {
            // scope.$apply(function() {
            deferred.reject(reader.result);
            // });
        };
    };

    var onProgress = function(reader, scope) {
        return function(event) {
            // scope.$broadcast("fileProgress", {
            //     total: event.total,
            //     loaded: event.loaded
            // });
        };
    };

    var getReader = function(deferred, scope) {
        var reader = new FileReader();
        reader.onload = onLoad(reader, deferred, scope);
        reader.onerror = onError(reader, deferred, scope);
        reader.onprogress = onProgress(reader, scope);
        return reader;
    };

    var readAsDataURL = function(file, scope) {
        var deferred = $q.defer();

        var reader = getReader(deferred, scope);
        reader.readAsDataURL(file);

        return deferred.promise;
    };

    return {
        readAsDataUrl: readAsDataURL
    };
}]);

angular.module("llp.extractpdf", [])

.factory("extractpdf", ["$q", function($q) {
    function unzip(zipfile, apnum, main) {
        //var rootstring = zipfile.name.slice(0, zipfile.name.indexOf('.'));

        var rootstring = apnum || zipfile.name.slice(0, zipfile.name.indexOf('.'));
        var deferred = $q.defer();
        var reader = new FileReader();

        var appnum = rootstring;

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
        },{
            label: 'transaction',
            value: transaction
        }, {
            label: 'imagefile',
            value: imagefile
        }];


        reader.onerror = deferred.reject.bind(deferred);
        reader.onload = function(e) {
            if (!reader.result) {

                deferred.reject(new Error("Unknown error"));

            }

            var zip = new JSZip(reader.result, {
                binary: true
            });

            var files = {
                tsvfiles: [],
                pdffiles: []
            };

            angular.forEach(targets, function(target, key) {


                var file = zip.files[target.value];

                if (typeof file === 'undefined') {
                    // deferred.reject(new Error(target.label + ' does not exist'));
                    return;

                }
                files.tsvfiles.push({
                    label: target.label,
                    file: file.asText()
                });
            });
            angular.forEach(zip.files, function (file, key) {
              files.pdffiles.push({ label: file.name, file: file });
              main.extractedfiles++;
            });


            return deferred.resolve(files);

        };

        reader.readAsArrayBuffer(zipfile);

        return deferred.promise;
    }

    function extractpdf(zipfile, appnum, main) {
        return unzip(zipfile, appnum, main);

    }

    return extractpdf;
}]).factory("extractzip", ["$q","Upload","$http","$location","toastr", function($q,Upload,$http, $location,toastr) {
    function unzip(apnum, main, uploader) {

        var deferred = $q.defer();

        var porter = function(){
            return $location.host() === 'localhost' ? ':8080' : '/proxy/'
        };
        var prefix = function(){
            return 'https://lexlab.io/proxy/'
            //return $location.protocol() + '://' + $location.host() + porter();
        };
        var googleurl = 'storage.googleapis.com/uspto-pair/applications/'+apnum+'.zip';
                    var reedtechurl = 'patents.reedtech.com/downloads/pair/'+apnum+'.zip';

                    JSZipUtils.getBinaryContent((prefix() + googleurl), function(err, data) {
                        if(err) {
                            alertify.error('Attempt to download from Google has failed! Attempting ReedTech...');
                        alertify.log('attempting ReedTech...');
                        JSZipUtils.getBinaryContent((prefix() + reedtechurl), function(err, data){
                            if(err){
                                alertify.alert('attempt to download from Google & ReedTech has failed! Please wait a few minutes and try again, or download the bulk zip file directly');
                            }
                            // $('#reedtechbutton').setClass('fa-check text-success').removeClass('text-danger fa-file-zip-o');
                            else{
                                callback(data);
                            }
                        });
                      }

                        else{
                            // $('#googlebutton').addClass('fa-check text-success').removeClass('text-danger fa-file-zip-o');
                                                       callback(data);


                        }});

var callback = function(data){
        var appnum = apnum;

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
        },{
            label: 'transaction',
            value: transaction
        }, {
            label: 'imagefile',
            value: imagefile
        }];




var zip = new JSZip(data);
    var blob = zip.generate({type: 'blob'});

    var files = {
                tsvfiles: [],
                pdffiles: []
            };

            angular.forEach(targets, function(target, key) {


                var file = zip.files[target.value];

                if (typeof file === 'undefined') {
                    // deferred.reject(new Error(target.label + ' does not exist'));
                    return;

                }
                files.tsvfiles.push({
                    label: target.label,
                    file: file.asText()
                });
            });
            angular.forEach(zip.files, function (file, key) {
              files.pdffiles.push({ label: file.name, file: file });
              main.extractedfiles++;
            });




    Upload.upload({url: '/upload/', data: {file: Upload.rename(blob, appnum + '.zip')}})
    .then(function (resp) {
            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);



        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progress = parseInt(100.0 * evt.loaded / evt.total);
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

            console.log('progress: ' + progress + '% ' + evt.config.data.file.name);
        });

return deferred.resolve(files);
};


        return deferred.promise;
    }

    function extractzip( appnum, main, uploader) {
        return unzip( appnum, main, uploader);

    }

    return extractzip;
}]);

angular.module("llp.extract", [])

.factory("extract", ["$q", function($q) {
    function unzip(zipfile, apnum) {
        //var rootstring = zipfile.name.slice(0, zipfile.name.indexOf('.'));

        var rootstring = apnum || zipfile.name.slice(0, zipfile.name.indexOf('.'));
        var deferred = $q.defer();
        var reader = new FileReader();

        var appnum = rootstring;

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


        reader.onerror = deferred.reject.bind(deferred);
        reader.onload = function(e) {
            if (!reader.result) {

                deferred.reject(new Error("Unknown error"));

            }

            var zip = new JSZip(reader.result, {
                binary: true
            });

            var files = [];

            angular.forEach(targets, function(target, key) {


                var file = zip.files[target.value];

                if (typeof file === 'undefined') {
                    // deferred.reject(new Error(target.label + ' does not exist'));
                    return;

                }
                files.push({
                    label: target.label,
                    file: file.asText()
                });
            });
            return deferred.resolve(files);

        };
        // try {
        //     reader.readAsArrayBuffer(zipfile);
        // } catch (ex) {
        //     alertify.alert(ex);
        // } finally {
        //     var file = new Blob(['HelloWorld', 'NiceToMeetYou', 'Greetings', 'Salutations']);
        //     reader.readAsArrayBuffer(file);
        // }
        //var a = zipfile.type = "Blob";
        //debugger
        //fileReader.readAsDataUrl(zipfile);
        reader.readAsArrayBuffer(zipfile);
        //debugger
        return deferred.promise;
    }

    function extract(zipfile, appnum) {
        return unzip(zipfile, appnum);
        //            .then(JSON.parse);
    }

    return extract;
}]);

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

    .controller("DropFilesController", ['$controller', 'extract', '$scope',  '$timeout', '$rootScope','FileUploader','toastr',
        function ($controller, extract, $scope, $timeout, $rootScope, FileUploader, toastr) {
            var drop = this;
          
       

            drop.file = {};
            drop.dropFiles = function (files) {
              console.log('files.files[0]', files.files[0]);
              $scope.$parent.main.handleFiles(files.files[0]);
              // $timeout(function () {
              //   toastr.info('fetching remote resources...');
              // }, 5000);
              // $timeout(function () {
              //   toastr.info('loading relevant data schemas...');
              // }, 10000);
              // $timeout(function () {
              //   toastr.warning('compiling templates...');
              // }, 15000);
              // $timeout(function () {
              //   toastr.warning('starting the AI engine...')
              // }, 20000);
            //   $scope.$on('UPLOADCOMPLETE', function (event) {
            //     $scope.$parent.main.handleFiles(files.files[0]);
            //   });


             
            };
        }
    ])
})(window);