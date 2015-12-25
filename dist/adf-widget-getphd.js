(function(window, undefined) {'use strict';


angular.module('adf.widget.getphd', ['adf.provider', 'llp.extract',
    'fa.droppable', 'llp.parsetsv', 'roar', 'textSizeSlider', 'llp.pdf', 'LocalStorageModule', 'llp.extractpdf', 'firebase', 'ui.router', 'commonServices', 'xeditable', 'ui.tree', 'ngAnimate', 'ngAnnotateText', 'ngDialog', 'ngSanitize', 'pdf', 'phd', 'toastr', 'mentio', 'lionlawlabs', 'diff', 'door3.css', 'checklist-model', 'authentication', 'angular-md5', 'angular.filter',  'roarmap', 'ngFileUpload'
]).config(["dashboardProvider", "localStorageServiceProvider", function (dashboardProvider, localStorageServiceProvider) {

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
            immediate: true,
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
                                config.appnum = '10000001';
                                config.id = id;
                                return config;
                            });
                            return config;


                        }
                    }
                ]
            }

        });

}])
    .constant('FIREBASE_URL', 'https://lexlab.firebaseio.com/')
    .controller('MainCtrl', ['Collection', 'extract', 'fileReader', '$http', 'parseTSV', '$roarmap', '$q', '$scope', 'config', 'PHD', 'localStorageService', 'extractpdf', 'pdfToPlainText', '$patentsearch', '$log','FileUploader','$publish','$pdftotxt','$timeout',
        function (Collection, extract, fileReader, $http, parseTSV, $roarmap, $q, $scope, config, PHD, localStorageService, extractpdf, pdfToPlainText, $patentsearch, $log, FileUploader, $publish, $pdftotxt, $timeout) {
            var main = this;
            main.size = 'lg';
            $scope.collapsereport = false;
            main.collapse = function () {
              $scope.collapsereport = !$scope.collapsereport;
            };
            if (angular.isUndefined($scope.phd)) {
              if (!config.id) {
                config = $scope.$parent.config;
              }
              main.config = config || $scope.$parent.$parent.config;
              $scope.definition = $scope.$parent.definition || null;

              var configid = config.id || main.config.id;
              var phd = Collection(configid);
              phd.$bindTo($scope, 'phd');
            }
            $scope.publish = function (phd) {
              $publish(config.id, $scope.phd).then(function (url) { alertify.success('link to post:' + url); });
            };

            $scope.configured = function () {
                return $scope.config.appnum !== '';
            };

            $scope.notConfigured = function () {
                return $scope.config.appnum === '';
            };
            var opts = {
                header: true
            };
             var uploader = $scope.uploader = new FileUploader({
            url: $scope.url || 'https://lexlab.io/upload',
            autoUpload: true
        });

        // FILTERS

        uploader.filters.push({
            name: 'customFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                return this.queue.length < 10;
            }
        });

        // CALLBACKS

        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function(fileItem) {
            console.info('onAfterAddingFile', fileItem);
        };
        uploader.onAfterAddingAll = function(addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function(item) {
          console.info('onBeforeUploadItem', item);
            alertify.log('starting upload...')
        };
        uploader.onProgressItem = function(fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function(progress) {
            console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
        };
        uploader.onErrorItem = function(fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function(fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
            alertify.success('File uploaded!')
            $timeout(function () {
              try { alertify.log('extracting text'); $pdftotxt($scope.phd).then(function (phd) { $scope.phd = phd; alertify.alert('history for US' + $scope.phd.patent.number + 'has been processed and delivered to your account'); }); }
              catch (ex) { console.log(ex); alertify.error('Im sorry... something went wrong with the extraction... please try again...');}
              finally { return; }

                    }, 5000);
        };
        uploader.onCompleteAll = function() {
          console.info('onCompleteAll');                                       
        };

        console.info('uploader', uploader);
           
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
                        $log.error(ex);
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
                $http.get('https://storage.googleapis.com/uspto-pair/applications/' + appnum + '.zip', function (err, data) {
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
                      alertify.log('Files extracted');
                        $scope.phd.file = files.tsvfiles;

                        main.parse(files.tsvfiles)

                            .then(function (parsedfiles) {
                                $log.info('TSV Parsed', parsedfiles);
                                alertify.log('TSV Parsed');

                                
                                        $roarmap(parsedfiles, $scope.phd)
                                            .then(function (roarmap) {
                                              $scope.phd.roarmap = roarmap;
                                              alertify.success('ROARmap built!');
                                              $patentsearch($scope.phd.application, config.PNUM)
                                                  .then(function (patentobj) {
                                                    $scope.phd.patent = patentobj;
                                                    localStorageService.set(config.appnum, $scope.phd);
                                                    alertify.log('Almost done... waiting for upload for finish ');
                                                });
                                                
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

        return function (phdobj, pnum) {
            var deferred = $q.defer();
            searchforpatent(phdobj, pnum);
            return deferred.promise;

            function searchforpatent(phdobj, pnum) {
                var patentnumber = pnum;
                var applicationnumber = phdobj[0][1];
                var pdfstorageuri = 'https://patentimages.storage.googleapis.com/pdfs/US' + patentnumber + '.pdf';

                var patent = {
                    number: pnum,
                    media: pdfstorageuri
                };
                filepicker.storeUrl(pdfstorageuri.toString(),
                        { filename: 'US' + patentnumber + '.pdf' },
                        function (Blob) {
                            var patent = angular.copy(Blob);
                            patent.title = phdobj[19][1];
                            patent.number = patentnumber;
                            patent.media = Blob.url;
                            //patentobj.srcdoc = googlepage(patentnumber) || null;
                            filepicker.convert(
                                Blob,
                                { format: 'txt' },
                                function (new_Blob) {

                                    patent.txt = new_Blob.url;
                                    return deferred.resolve(patent);
                                }
                                );

                        }
                     );
                //return deferred.resolve(patent);
                // if (pnum == !'-') {
                    

                //     var searchnumberresult = '' || null; //Some function returning number;
                
                //     var googlepage = function (patentnumber) { filepicker.storeUrl('https://www.google.com/patents/US' + patentnumber, {}, function (Blob) { googlepagetext(Blob); return Blob.url; }); };
                //     var googlepagetext = function (Blob) { filepicker.convert(Blob, { format: 'txt' }, function (new_Blob) { patentobj.googletext = new_Blob.url; }); };

                    
                //     var imageurlroot = 'https://patentimages.storage.googleapis.com/US' + patentnumber;
                //     var thumbnailurlroot = 'https://patentimages.storage.googleapis.com/thumbnails/US' + patentnumber;
                //     filepicker.storeUrl(pdfstorageuri.toString(),
                //         { filename: 'US' + patentnumber + '.pdf' },
                //         function (Blob) {
                //             var patentobj = angular.copy(Blob);
                //             patentobj.title = phdobj[19][1];
                //             patentobj.patentnumber = patentnumber;
                //             patentobj.media = Blob.url;
                //             patentobj.srcdoc = googlepage(patentnumber) || null;
                //             filepicker.convert(
                //                 Blob,
                //                 { format: 'txt' },
                //                 function (new_Blob) {

                //                     patentobj.txt = new_Blob.url;
                //                     return deferred.resolve(patentobj);
                //                 }
                //                 );

                //         }
                //         );
                // } else {
                //     return;
                // }




            }
        };
    }])
  .factory('$pdftotxt', ['$q', 'filepickerService', 'Collection', function ($q, filepickerService, Collection) {
    return function (phd) {
      var deferred = $q.defer();
      getxt(phd);
      return deferred.promise;

      function getxt(phd) {
        var meritscollectionid = phd.roarmap.collections[1];
        Collection(meritscollectionid).$loaded().then(function (collection) {
          var mlist = collection.roarlist;
          angular.forEach(mlist, function (key, roarevent) {
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
  }]).controller('AppController', ['$scope', 'FileUploader', function($scope, FileUploader) {
        var uploader = $scope.uploader = new FileUploader({
            url: $scope.url || 'https://lexlab.io/upload',
            autoUpload: true
        });

        // FILTERS

        uploader.filters.push({
            name: 'customFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                return this.queue.length < 10;
            }
        });

        // CALLBACKS

        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function(fileItem) {
            console.info('onAfterAddingFile', fileItem);
        };
        uploader.onAfterAddingAll = function(addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function(item) {
            console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function(fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function(progress) {
            console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
        };
        uploader.onErrorItem = function(fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function(fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader.onCompleteAll = function() {
            console.info('onCompleteAll');
        };

        console.info('uploader', uploader);
    }]);

angular.module("adf.widget.getphd").run(["$templateCache", function($templateCache) {$templateCache.put("{widgetsPath}/getphd/src/edit.html","<form role=form><div class=form-group><label for=sample>Application #</label> <input type=text class=form-control id=sample ng-model=config.appnum placeholder=\"Enter Application #\"></div></form>");
$templateCache.put("{widgetsPath}/getphd/src/titleTemplate.html","<button class=\"fa fa-close fa-2x btn-danger pull-right floatingclosebutton\" onclick=$(this).parent().remove(); style=position:absolute;top:0;right:0;z-index:1;></button><div class=card-header style=z-index:0;><h4 class=\"bs-callout bs-callout-primary\" style=color:steelblue;>{{config.title || roarevent.title}} <span class=pull-right><a title=notes ng-click=\"alert(\'note\')\"><i class=\"fa fa-pencil\" style=color:steelblue;></i></a> <a title=mail ng-click=$publish(this)><i class=\"fa fa-send\" style=color:steelblue;></i></a> <a title=comment ng-click=\"alert(\'note\')\"><i class=\"fa fa-comments-o\" style=color:steelblue;></i></a> <a title=\"reload widget content\" ng-click=reload()><i class=\"fa fa-refresh\" style=color:steelblue;></i></a> <a title=\"change widget location\" class=adf-move><i class=\"fa fa-arrows\" style=color:steelblue;></i></a> <a title=\"collapse widget\" ng-show=\"options.collapsible && !widgetState.isCollapsed\" ng-click=\"widgetState.isCollapsed = !widgetState.isCollapsed\"><i class=\"fa fa-minus\" style=color:steelblue;></i></a> <a title=\"expand widget\" ng-show=\"options.collapsible && widgetState.isCollapsed\" ng-click=\"widgetState.isCollapsed = !widgetState.isCollapsed\"><i class=\"fa fa-plus\" style=color:steelblue;></i></a> <a title=\"edit widget configuration\" ng-click=edit()><i class=\"fa fa-cog\" style=color:steelblue;></i></a> <a title=\"fullscreen widget\" ng-click=openFullScreen() ng-show=\"options.maximizable || true\"><i class=\"fa fa-expand\" style=color:steelblue;></i></a> <a title=\"remove widget\" ng-click=remove() ng-if=editMode><i class=\"fa fa-close\" style=color:steelblue;></i></a></span></h4></div>");
$templateCache.put("{widgetsPath}/getphd/src/view.html","<div ng-controller=\"MainCtrl as main\"><div class=\"alert alert-info\" ng-if=notconfigured()>Please configure the +getphd widget</div><div ng-if=configured() ng-bind-html=main.content></div><button class=\"button button-icon fa fa-print\" ng-click=publish(phd) style=position:absolute;top:-1rem;right:1rem;z-index:1000;></button><div class=\"card card-primary card-block btn-glass drop-target\" nv-file-drop uploader=uploader drop-files=handleFiles(files) style=\"border: 2px dashed blue;margin: 5px;\" ng-hide=phd.file><div ng-controller=pageslideCtrl><button class=\"row btn btn-glass btn-primary img img-rounded\" ng-hide=phd.file style=position:relative;display:flex;display:-webkit-flex;align-items:center;align-content:center;justify-content:space-around;flex-direction:row; ng-click=toggle()><i class=\"fa fa-download fa-3x\">{{config.appnum}}</i> <img src=https://lexlab.firebaseapp.com/img/GoldLogoLong.svg class=\"pop img img-rounded pull-right\" ng-if=!config.appnum></button><div pageslide ps-open=checked ps-key-listener=true ps-side=left ps-class=card-dark><div ng-include=\"\'/getphdwidget/src/phd/step-1.html\'\"></div><div ng-include=\"\'/getphdwidget/src/phd/step-2.html\'\"></div><upload-q></upload-q></div><div class=row ng-hide=phd.file><div class=\"alert alert-danger\" role=alert ng-if=main.error><strong>Uh oh!</strong> {{main.error}}</div><pre class=\"alert alert-info\" role=alert ng-if=main.info style=\"color:white !important;\">{{main.info}}</pre></div></div></div><div class=\"card card-fancy card-rounded card-block card-thick\" style=\"text-align: left;color: #444;\" ng-if=phd.file><button class=\"alert btn-glass btn-primary img card-rounded row\" style=\"position:relative;display:flex;display:-webkit-flex;align-items:center;align-content:center;justify-content:space-between;flex-direction:row;background-color:#35688F;padding:2px;box-shadow:inset 10px 2px 50px rgba(0,0,0,0.5);border-top-right-radius:6rem;border-bottom-right-radius:6rem;border-left:5px ridge black;\" ng-click=main.collapse()><div style=display:flex;justify-content:flex-end;flex-direction:column;align-content:flex-end;vertical-align:middle;align-items:flex-end;><h4 class=\"card-title ng-binding display-4\" style=\"margin-bottom:0;color: #fff;\">US {{phd.patent.number | number:0}}</h4><h5 class=\"card-subtitle lead ng-binding\" style=color:#ddd;>USSN {{phd.application[0][1] || config.appnum}}</h5></div><img src=/llp_core/img/GoldLion.svg class=\"img lionlogofilter\" style=\"width:75px;height: auto;\"><div style=display:flex;flex-direction:column;align-items:flex-start;justify-content:space-around;><img src=/llp_core/img/GoldLogoLong.svg class=img style=height:45px;> <img src=/llp_core/img/GoldPhdLogoLong.svg class=img style=height:25px;padding-left:2px;></div></button><div collapse=collapsereport class=\"card clearfix\" style=padding:0;margin:0;><uib-tabset class=tabbable justified=true><uib-tab heading=\"PTO Meta-Data\"><uib-tabset class=\"tabbable tabs-left\"><uib-tab class=ngDialogTab><uib-tab-heading>USSN {{phd.application[0][1]}}</uib-tab-heading><h4 class=\"card-title pull-right\">PTO Meta-Data TSVFiles</h4><uib-tabset class=tabbable><uib-tab ng-repeat=\"file in phd.file\" heading=\"{{file.label | uppercase}}\"><pre class=\"card card-block card-fancy\" ng-bind=file.file></pre></uib-tab></uib-tabset></uib-tab><uib-tab class=\"ngDialogTab primary\" ng-if=phd.application><uib-tab-heading ng-style>APPLICATION</uib-tab-heading><h4 class=\"card-title pull-right\">Application Data</h4><table class=\"card card-default card-block table table-striped table-hover table-condensed table-responsive\"><tbody><tr ng-repeat=\"line in phd.application\"><td ng-repeat=\"value in line\">{{value}}</td></tr></tbody></table></uib-tab><uib-tab class=\"ngDialogTab info\" ng-if=phd.attorney><uib-tab-heading ng-style>ATTORNEY</uib-tab-heading><h4 class=\"card-title pull-right\">Attorney Data</h4><table class=\"card card-default card-block table table-striped table-hover table-condensed table-responsive\"><tbody><tr ng-repeat=\"line in phd.attorney\"><td ng-repeat=\"value in line\">{{value}}</td></tr></tbody></table></uib-tab><uib-tab class=\"ngDialogTab success\" ng-if=phd.continuity><uib-tab-heading ng-style>CONTINUITY</uib-tab-heading><h4 class=\"card-title pull-right\">Continuity Data</h4><table class=\"card card-default card-block table table-striped table-condensed table-hover table-responsive\"><thead><tr><th><strong>Description</strong></th><th><strong>Parent Filing or 371(c) Date</strong></th><th><strong>Parent Number</strong></th><th><strong>Parent Status</strong></th><th><strong>Patent Number</strong></th></tr></thead><tbody><tr ng-repeat=\"line in phd.continuity\"><td>{{::line[\'Description\']}}</td><td>{{::line[\'Parent Filing or 371(c) Date\']}}</td><td>{{::line[\'Parent Number\']}}</td><td>{{::line[\'Parent Status\']}}</td><td><a ng-href=\"https://patentimages.storage.googleapis.com/pdfs/US{{::line[\'Patent Number\'].replace(\',\',\'\').replace(\',\',\'\')}}.pdf\" target=_blank>{{::line[\'Patent Number\']}}</a></td></tr></tbody></table></uib-tab><uib-tab class=\"ngDialogTab warning\" ng-if=phd.foreign><uib-tab-heading ng-style>FOREIGN PRIORITY</uib-tab-heading><h4 class=\"card-title pull-right\">Foreign Priority</h4><table class=\"card card-default card-block table table-striped table-condensed table-hover table-responsive\"><thead><tr><th><strong>Country</strong></th><th><strong>Priority</strong></th><th><strong>Priority Date</strong></th></tr></thead><tbody><tr ng-repeat=\"p in phd.foreign\"><td ng-bind=\"p[\'Country\']\"></td><td ng-bind=\"p[\'Priority\']\"></td><td ng-bind=\"p[\'Priority Date\'] | date\"></td></tr></tbody></table></uib-tab><uib-tab class=\"ngDialogTab danger\" ng-if=phd.transaction><uib-tab-heading ng-style>TRANSACTION</uib-tab-heading><h4 class=\"card-title pull-right\">Transaction Data</h4><table class=\"card card-default card-block table table-striped table-hover table-condensed table-responsive\"><thead><tr><th><strong>Date</strong></th><th><strong>Transaction Description</strong></th></tr></thead><tbody><tr ng-repeat=\"trans in phd.transaction\"><td>{{::trans[\'Date\']}}</td><td>{{::trans[\'Transaction Description\']}}</td></tr></tbody></table></uib-tab><uib-tab class=ngDialogTab ng-if=phd.imagefile><uib-tab-heading ng-style>I F W</uib-tab-heading><h4 class=\"card-title pull-right\">Image File Wrapper</h4><input type=text ng-model=main.query placeholder=search... class=pull-right><table class=\"card card-default card-block table table-hover table-condensed table-responsive\"><thead><tr><th><strong>Mail Room Date</strong></th><th><strong>Document Code</strong></th><th><strong>Document Description</strong></th><th><strong>Document Category</strong></th><th><strong>Page Count</strong></th><th><strong>Filename</strong></th></tr></thead><tbody><tr ng-repeat=\"roarevent in phd.imagefile |filter: main.query\"><td ng-bind=\"roarevent[\'Mail Room Date\']\"></td><td ng-bind=\"roarevent[\'Document Code\']\"></td><td ng-bind=\"roarevent[\'Document Description\']\"></td><td ng-bind=\"roarevent[\'Document Category\']\"></td><td ng-bind=\"roarevent[\'Page Count\']\"></td><td ng-bind=\"roarevent[\'Filename\']\"></td></tr></tbody></table></uib-tab></uib-tabset></uib-tab><uib-tab heading=\"PhD Digest\"><uib-tabset><uib-tab class=\"ngDialogTab {{collection.styleClass}}\" ng-repeat=\"collection in phd.roarmap.collections\" collection={{collection}}><uib-tab-heading ng-style>{{collection.rid}}&nbsp&nbsp<i class=\"pull-right fa {{collection.icon}} label label-{{collection.styleClass}} label-pill\">{{collection.roarlist.length}}</i></uib-tab-heading><h4 class=\"card-title pull-right fa {{collection.icon}}\">{{collection.rid}}</h4><div style=\"width: 100%;\" class=reventlist><roar-event ng-repeat=\"event in collection.roarlist\" id=\"{{event.id || event}}\" style=width:19.5%;></roar-event></div></uib-tab><uib-tab class=ngDialogTab><uib-tab-heading>ROAR <label class=\"label label-info label-pill pull-right\">{{phd.imagefile.length}}</label></uib-tab-heading><uib-tabset class=\"tabbable tabs-left\"><uib-tab ng-repeat=\"roarevent in phd.roarmap.roarevents\" select=\"event = roarevent\"><uib-tab-heading><roar-chip id=\"{{roarevent.id || roarevent}}\"></roar-chip></uib-tab-heading><iframe src={{event.media}} class=\"card card-block card-fancy pull-left\" style=width:48%;></iframe><iframe src={{event.txt}} class=\"card card-block card-fancy pull-right\" style=\"width: 48%\"></iframe></uib-tab></uib-tabset></uib-tab></uib-tabset></uib-tab><uib-tab class=ngDialogTab><uib-tab-heading ng-style>US {{phd.patent.number | number:0}}</uib-tab-heading><iframe src={{phd.patent.media}} class=\"card card-fancy col-sm-5\" style=min-height:500px;></iframe><iframe src={{phd.patent.txt}} class=\"card card-fancy col-sm-5\" style=min-height:500px;></iframe></uib-tab></uib-tabset></div></div></div>");
$templateCache.put("{widgetsPath}/getphd/src/phd/step-1.html","<div class=\"card card-success\"><div class=card-header><h6 class=card-title>+PhD Step 1 - Download Patent</h6></div><div class=card-text><input type=text placeholder=\"Patent #\" ng-model=config.PNUM> <a class=\"btn btn-success fa fa-download\" href=http://patentimages.storage.googleapis.com/pdfs/US{{config.PNUM}}.pdf target=_blank data-toggle=popover data-placement=bottom data-content=DOWNLOAD data-animation=true data-trigger=hover onclick=\"window.open(this.href, \'\', \'resizable=no,status=no,location=no,toolbar=no,menubar=no,fullscreen=no,scrollbars=no,dependent=yes,width=400,left=150,height=30,top=150\'); return false;\" style=color:white;></a></div></div>");
$templateCache.put("{widgetsPath}/getphd/src/phd/step-2.html","<div class=\"card card-warning\"><div class=card-header><h6 class=card-title>+PhD Step 2 - Download Image File Wrapper</h6></div><div class=card-text><input type=text placeholder=\"Application #\" ng-model=config.appnum> <a class=\"btn btn-warning fa fa-download\" href=https://storage.googleapis.com/uspto-pair/applications/{{config.appnum}}.zip target=_blank data-toggle=popover data-placement=bottom title=\"DOWNLOAD FROM GOOGLE\" data-content data-animation=true data-trigger=hover style=\"width: 17.5rem;color:white;\" onclick=\"window.open(this.href, \'\', \'resizable=no,status=no,location=no,toolbar=no,menubar=no,fullscreen=no,scrollbars=no,dependent=yes,width=400,left=150,height=300,top=150\'); return false;\">from Google</a> <a class=\"btn btn-warning fa fa-download\" href=https://patents.reedtech.com/downloads/pair/{{config.appnum}}.zip target=_blank data-toggle=popover data-placement=bottom title=\"DOWNLOAD FROM REEDTECH\" data-content data-animation=true data-trigger=hover style=\"width: 17.5rem;color:white;\" onclick=\"window.open(this.href, \'\', \'resizable=no,status=no,location=no,toolbar=no,menubar=no,fullscreen=no,scrollbars=no,dependent=yes,width=400,left=150,height=300,top=150\'); return false;\">from ReedTech</a></div></div>");
$templateCache.put("{widgetsPath}/getphd/src/phd/step-3.html","<div class=\"panel panel-danger\"><div class=panel-heading><h4 class=splash>+PhD Step 3 - Unzip & Upload the Files</h4></div><div class=panel-body><h6 class=splash>{{ngDialogData[0].PNUM}} - {{ngDialogData[1].APPNUM}}</h6><span us-spinner ng-show=spinme></span><br><button class=\"btn btn-info fa fa-arrow-up pull-right\" lk-google-picker on-picked=addfilehistory>upload</button><div ng-hide=\"files.length == 0\"><div class=\"col-sm-28 col-sm-offset-1 panel sub-independent\" style=\"padding: 1rem;\"><h4>Add File History</h4><label>ID#: <input type=text ng-model=collection.rid placeholder=\"collection id\"></label> <label class=pull-right>Box: <input type=text ng-model=collection.box placeholder=\"collection box\"></label><br><small style=\"color: red;\">*All Fields Required</small> <button class=\"btn-default pull-right\" ng-click=\"files=[]\">cancel</button> <button class=\"btn-info pull-right\" ng-click=\"addfilehistory(files);spinme = true\">confirm</button><br><small><strong>Note:</strong> This process may take several minutes to complete. Please wait until the process is complete. When completed, you will be brought to the results automatically.</small></div></div></div></div>");}]);

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
                    $document[0].style.fontSize = size + scope.unit;
                    $('html').style('font-size', size + scope.unit);
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
     .factory('$roarevent', ['OWNERSHIPDOCS', 'ARTDOCS', 'MERITSDOCS', 'DOCNAMES', 'PETDOCCODES', 'NOADOCCODES', 'INTVDOCCODES', 'PTODOCCODES', 'APPDOCCODES', '$q', function(OWNERSHIPDOCS, ARTDOCS, MERITSDOCS, DOCNAMES, PETDOCCODES, NOADOCCODES, INTVDOCCODES, PTODOCCODES, APPDOCCODES, $q){
         return function(file){
             var deferred = $q.defer();
             parse(file);
             return deferred.promise;
             function parse(file){
                 var roarevent = angular.copy(file);
                 //debugger;
                         var filename = file.Filename || file.name || file.filename;
                         //debugger;
                         var appnumsubstring = filename.slice(0, filename.indexOf("-"));
                         var appdatesubstring = filename.slice((filename.indexOf("-") + 1), (filename.indexOf("-") + 11));
                         var doccode = filename.slice((filename.lastIndexOf("-") + 1), (filename.indexOf(".pdf")));
                         roarevent.content_type = 'document';
                         
                         if(file.url){
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
                             });
                         });
                         var date = new Date();
                         var d = new Date();
                        var n = d.getTime();
                         roarevent.dashboard = {
                             model:{
                          rows:[
                              {columns:[
                                  {cid:n+10,styleClass:'col-sm-6',widgets:[{config:{height: "30em",url: roarevent.media || 'http://www.google.com'},title:roarevent.title || 'title',titleTemplateUrl:'{widgetsPath}/testwidget/src/title.html',type:'iframe',wid:n+100,styleClass:roarevent.styleClass || 'btn-dark'}]},
                                  {cid:n+1000,styleClass:'col-sm-6',widgets:[{config:{draftid:'PROMISE'},title:roarevent.title || 'title',titleTemplateUrl:'{widgetsPath}/testwidget/src/title.html',type:'testwidget', wid:n+15,styleClass:roarevent.styleClass || 'btn-dark'}]}
                              ]}
                          ],
                          structure: "ROAR-DEFAULT",
                          title: roarevent.title || "PROMISE",
                          titleTemplateUrl: "../src/templates/dashboard-title.html"
                      } 
                         };
               return deferred.resolve(roarevent);  
             };
         };
     }])
     .factory('$roarmap', ['$stateParams', 'Matter', 'Collection', 'ROARevent', 'ROARevents', 'Collections', '$mocks', '$timeout', 'OWNERSHIPDOCS', 'ARTDOCS', 'MERITSDOCS', 'DOCNAMES', 'PETDOCCODES', 'NOADOCCODES', 'INTVDOCCODES', 'PTODOCCODES', 'APPDOCCODES', '$q', 'PHD', '$log', 'FIREBASE_URL',
         function($stateParams, Matter, Collection, ROARevent, ROARevents, Collections, $mocks, $timeout, OWNERSHIPDOCS, ARTDOCS, MERITSDOCS, DOCNAMES, PETDOCCODES, NOADOCCODES, INTVDOCCODES, PTODOCCODES, APPDOCCODES, $q, PHD, $log, FIREBASE_URL) {
             return function(files, phd) {








                 var roarmap = {
                     collections: new Array(),
                     roarevents: new Array()
                 };
                 var deferred = $q.defer();


                 var matterId = '0000x0000';
                 var matter = Matter($stateParams.matterId, $stateParams.groupId);
                 var collections = Collections();

                 var imagefile = phd.imagefile;
                 var p = {
                     filelist: new Array(),
                     meritslist: new Array(),
                     artlist: new Array()
                     //ownlist: new Array()
                 };


                 function hello() {
                     var check = checkforexistingphd();
                     if (check) {
                         getroar();
                     } else {
                         buildroar();
                     }



                     
                 };
                 hello();
                 return deferred.promise;






                 function checkforexistingphd() {
                     var application = phd.application[0][1];
                     var ref = new Firebase(FIREBASE_URL + 'content/' + application);
                     ref.once('value', function(snapshot) {
                         return snapshot.exists();
                     });
                 };
                 
                 function buildroar() {

                     angular.forEach(imagefile, function(file, key) {
                         if (file['Mail Room Date'] === ''){
                             return ;
                         }else{
                         var appnumber = phd.application[0][1].replace('/', '').replace(',', '').replace(',', '');
                         var date = new Date();
                         var roarevent = angular.copy(file);
                         var maildate = new Date(file['Mail Room Date']);
                         var mailyear = maildate.getFullYear();
                         var mailmonth = maildate.getMonth();
                         var mailday = maildate.getDate();
                         
                         var filename = file.Filename || appnumber + '-' + mailyear + '-' + mailmonth + '-' + mailday + '-00001-NPL.pdf';
                         var appnumsubstring = filename.slice(0, filename.indexOf("-"));
                         var appdatesubstring = filename.slice((filename.indexOf("-") + 1), (filename.indexOf("-") + 11));
                         var doccode = filename.slice((filename.lastIndexOf("-") + 1), (filename.indexOf(".pdf")));
                         roarevent.content_type = 'document';
                         //roarevent.media = file.url.replace('/view?usp=drive_web', '/preview');
                         // roarevent.iconUrl = file.iconUrl;
                         //roarevent.uuid = file.id;

                         //roarevent.mimeType = file.mimeType;
                         //roarevent.description = file.DocumentDescription;
                         roarevent.selflink = 'https://lexlab.io/files/public/documents/uspto/' + appnumsubstring + '/' + appnumsubstring + '-image_file_wrapper/' + filename;
                         roarevent.media = 'https://lexlab.io/files/viewer/web/viewer.html?file=%2Ffiles/public/documents/uspto/' + appnumsubstring + '/' + appnumsubstring + '-image_file_wrapper/' + filename;
                         roarevent.description = file['Document Description'] || null;
                         roarevent.filename = file['Filename'] || null;
                         roarevent.collections = [];
                         roarevent.Application = appnumsubstring || null;
                         roarevent.date = appdatesubstring || null;
                         roarevent.rid = imagefile.indexOf(file);
                         //roarevent.file = file;
                         //roarevent.collections.push(roarmap.collections[0]);
                         roarevent.doccode = file['Document Code'] || null;
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
                             });
                         });
                         var d = new Date();
                        var n = d.getTime();
                          roarevent.dashboard = {
                             model:{
                          rows:[
                              {columns:[
                                  {cid:n+10,styleClass:'col-sm-6',widgets:[{config:{height: "30em",url: roarevent.media || 'http://www.google.com'},title:roarevent.title || 'title',titleTemplateUrl:'{widgetsPath}/testwidget/src/title.html',type:'iframe',wid:n+100,styleClass:roarevent.styleClass || 'btn-dark'}]},
                                  {cid:n+1000,styleClass:'col-sm-6',widgets:[{config:{draftid:'PROMISE'},title:roarevent.title || 'title',titleTemplateUrl:'{widgetsPath}/testwidget/src/title.html',type:'testwidget', wid:n+1010,styleClass:roarevent.styleClass || 'btn-dark'}]}
                              ]}
                          ],
                          structure: "ROAR-DEFAULT",
                          title: roarevent.title || "PROMISE",
                          titleTemplateUrl: "../src/templates/dashboard-title.html"
                      } 
                         };




                         collections.$add(roarevent).then(function(ref) {
                             var id = ref.key();
                             console.log("added record with id " + id);

                             ref.update({
                                 id: id,

                                 timestamp: Firebase.ServerValue.TIMESTAMP
                             });
                              ref.child('dashboard').child('model').child('rows').child('0').child('columns').child('1').child('widgets').child('0').child('config').child('draftid').set(id);

                             p.filelist.push(id);
                             roarmap.roarevents.push(id);
                             // angular.forEach(roarevent.collections, function(cid, key) {
                             //     var list = CuratedList(cid, 'roarlist');
                             //     list.$add(id);
                             // });

                             // angular.forEach(roarmap.collections, function(colId, key) {
                             //     Collection(colId).$loaded().then(function(collection) {
                             //         collection.roarlist[id] = id;
                             //         collection.$save();


                             //     });
                             // });

                             angular.forEach(MERITSDOCS, function(code, key) {
                                 if (roarevent.doccode === code) {
                                     p.meritslist.push(id);
                                     $log.info('merits', id);
                                 }
                             });
                            //  angular.forEach(OWNERSHIPDOCS, function(code, key) {
                            //      if (roarevent.doccode === code) {
                            //          p.ownlist.push(id);
                            //          $log.info('ownership', id);
                            //      }
                            //  });
                             angular.forEach(ARTDOCS, function(code, key) {
                                 if (roarevent.doccode === code) {
                                     p.artlist.push(id);
                                     $log.info('art', id);
                                 }
                             });
                             alertify.log("added record with id " + id);
                         });

                         }

                     });
                     $timeout(function() {
                         buildcollections(p);
                     }, 5000);
                 };



                 function buildcollections(p) {
                     var newcollection = {
                         name: 'USSN ' + phd.application[0][1],
                         title: 'USSN ' + phd.application[0][1],
                         rid: 'PHD1 - ALL',
                         collectiontype: 'source',
                         box: 'PhD for USSN ' + phd.application[0][1],
                         styleClass: 'success',
                         app: phd.application[0][1],
                         content_type: 'collection',
                         roarlist: p.filelist
                     };
                     var newmerits = {
                         name: 'USSN ' + phd.application[0][1],
                         title: 'USSN ' + phd.application[0][1],
                         rid: 'PHD2 - MERITS',
                         collectiontype: 'source',
                         box: 'PhD for USSN ' + phd.application[0][1],
                         styleClass: 'danger',
                         app: phd.application[0][1],
                         content_type: 'collection',
                         roarlist: p.meritslist
                     };

                     var newart = {
                         name: 'USSN ' + phd.application[0][1],
                         title: 'USSN ' + phd.application[0][1],
                         rid: 'PHD3 - ART',
                         collectiontype: 'source',
                         box: 'PhD for USSN ' + phd.application[0][1],
                         styleClass: 'warning',
                         app: phd.application[0][1],
                         content_type: 'collection',
                         roarlist: p.artlist
                     };
                    //  var newown = {
                    //      name: 'USSN ' + phd.application[0][1],
                    //      title: 'USSN ' + phd.application[0][1],
                    //      rid: 'PHD4 - OWNERSHIP',
                    //      collectiontype: 'source',
                    //      box: 'PhD for USSN ' + phd.application[0][1],
                    //      styleClass: 'primary',
                    //      app: phd.application[0][1],
                    //      content_type: 'collection',
                    //      roarlist: p.ownlist

                    //  };


                   //  var cray = [newcollection, newmerits, newart, newown];

                    var cray = [newcollection, newmerits, newart];




                     angular.forEach(cray, function(col, key) {
                         collections.$add(col)
                             .then(function(ref) {

                                 var cId = ref.key();


                                 ref.update({
                                     id: cId,
                                     timestamp: Firebase.ServerValue.TIMESTAMP,
                                     matter: $stateParams.matterId || $mocks.stateParams.matterId,
                                     project: $stateParams.pId || $mocks.stateParams.pId


                                 });

                                //  if (angular.isUndefined(matter.collectionlist)) {
                                //      matter.collectionlist = new Array();

                                //      matter.collectionlist.push(cId);
                                //      matter.$save();
                                //  } else {
                                //      matter.collectionlist.push(cId);
                                //      matter.$save();
                                //  }

                                 // var owns = angular.copy(Collection(cId));
                                 roarmap.collections.push(cId);
                                 // return roarmap;

                             });


                     });


                     return deferred.resolve(roarmap);
                 };




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

     }]);

angular.module('llp.pdf', ['LocalStorageModule'])
    .config(["localStorageServiceProvider", function(localStorageServiceProvider) {
        localStorageServiceProvider.setPrefix('adf.getphd');
    }])
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

            var files = {
                tsvfiles: new Array(),
                pdffiles: zip.files
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

            // for (var i = zip.files.length - 1; i >= 0; i--) {
            //     files.pdffiles.push({
            //         label: zip.files[i].name,
            //         file: zip.files[i].asArrayBuffer()

            //     });
            //     debugger
            // };

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

    function extractpdf(zipfile, appnum) {
        return unzip(zipfile, appnum);
        //            .then(JSON.parse);
    }

    return extractpdf;
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

    .controller("DropFilesController", ['$controller', 'extract', '$scope',  '$timeout', '$rootScope','FileUploader',
        function ($controller, extract, $scope, $timeout, $rootScope, FileUploader) {
            var drop = this;
           var uploader = $scope.uploader = new FileUploader({
            url: $scope.url || 'https://lexlab.io/upload',
            autoUpload: true
        });

        // FILTERS

        uploader.filters.push({
            name: 'customFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                return this.queue.length < 10;
            }
        });

        // CALLBACKS

        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function(fileItem) {
            console.info('onAfterAddingFile', fileItem);
        };
        uploader.onAfterAddingAll = function(addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function(item) {
            console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function(fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function(progress) {
            console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
        };
        uploader.onErrorItem = function(fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function(fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader.onCompleteAll = function() {
            console.info('onCompleteAll');
        };

        console.info('uploader', uploader);
           
           
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
})(window);