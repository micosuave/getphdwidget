'use strict';

angular.module('adf.widget.getphd', ['adf.provider', 'llp.extract',
    'fa.droppable', 'llp.parsetsv', 'roar', 'textSizeSlider', 'llp.pdf', 'LocalStorageModule', 'llp.extractpdf', 'firebase', 'ui.router', 'commonServices', 'xeditable', 'ui.tree', 'ngAnimate', 'ngAnnotateText', 'ngDialog', 'ngSanitize', 'pdf', 'phd', 'toastr', 'mentio', 'lionlawlabs', 'diff', 'door3.css', 'checklist-model', 'authentication', 'angular-md5', 'angular.filter',  'roarmap', 'ngFileUpload'
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
                                config.id = id;
                                alertify.prompt('enter app number', function (resp, text) {
                                  if (resp) {
                                    config.appnum = text;

                                  }
                                });
                                
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
    .controller('MainCtrl', ['Collection', 'extract', 'fileReader', '$http', 'parseTSV', '$roarmap', '$q', '$scope', 'config', 'PHD', 'localStorageService', 'extractpdf', 'pdfToPlainText', '$patentsearch', '$log','FileUploader','$publish','$pdftotxt','$timeout','toastr','$rootScope',
        function (Collection, extract, fileReader, $http, parseTSV, $roarmap, $q, $scope, config, PHD, localStorageService, extractpdf, pdfToPlainText, $patentsearch, $log, FileUploader, $publish, $pdftotxt, $timeout, toastr, $rootScope) {
            var main = this;
            main.size = 'lg';
            $scope.collapsereport = false;
            main.collapse = function () {
              $scope.collapsereport = !$scope.collapsereport;
            };
            
            if (angular.isUndefined($scope.phd)) {
               main.showupload = true;
              if (!config.id) {
                
                config.id = config.appnum || $scope.$parent.config.id;
              }
              main.config = config || $scope.$parent.$parent.config;
              $scope.definition = $scope.$parent.definition || null;

              var configid = config.id || config.appnum || main.config.id;
              var phd = Collection(configid);
              phd.$bindTo($scope, 'phd');
            }
             $scope.export2collection = function(eventID){
                          var projectId = $stateParams.pId;
                          var out = Collection(projectId);
                              out.$loaded().then(function(output){
                                  if(angular.isUndefined(output.roarlist)){
                                      output.roarlist = new Array();
                                      output.roarlist.push(eventID);
                                      output.$save();
                                  }else{
                                      output.roarlist.push(eventID);
                                      output.$save();
                                  }
                              });
                      };
             $scope.publish = function (phd) {
               angular.forEach(phd.roarmap.collections, function (id, key) {
                 $scope.export2collection(id);
               });
               $scope.export2collection(phd.id);
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
          main.progress = 0;
          main.bufferedfile = item;
          console.log(item);
          alertify.log('starting upload...');
          
        };
        uploader.onProgressItem = function(fileItem, progress) {
          main.progress = progress;
          if (progress < 40) { main.progresstype = 'danger' }
          else if (progress > 40 && progress < 66) { main.progresstype = 'warning' }
          else if (progress > 97) { main.progresstype = 'success' }
          else{ main.progresstype = 'primary'}
          console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function(progress) {
            console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
          console.info('onSuccessItem', fileItem, response, status, headers);
          alertify.success(response);
        };
        uploader.onErrorItem = function(fileItem, response, status, headers) {
          console.info('onErrorItem', fileItem, response, status, headers);
          main.progress = 'failed';
          main.progresstype = 'danger';
        };
        uploader.onCancelItem = function(fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
            alertify.success('File uploaded!');
            alertify.success(response);
            $rootScope.$broadcast('UPLOADCOMPLETE', response);
            // main.handleFiles(main.bufferedfile);
            // $timeout(function () {
            //   try { alertify.log('extracting text'); $pdftotxt($scope.phd).then(function (phd) { $scope.phd = phd; alertify.alert('history for US' + $scope.phd.patent.number + 'has been processed and delivered to your account'); }); }
            //   catch (ex) { console.log(ex); alertify.error('Im sorry... something went wrong with the extraction... please try again...');}
            //   finally { return; }

            //         }, 5000);
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
                          main.progresstwo++;
                        } else if (file.label === 'application') {
                          var outerarray = parseTSV(file.file,{skipEmptyLines:true});
                          
                          var newobj = {};
                          angular.forEach(outerarray, function (innerarray, key) {
                            
                            newobj[innerarray[0]] = innerarray[1];
                            newobj['Application Number'].replace('/', '');
                            $scope.phd.application = newobj;
                            
                          });
                          main.progresstwo++;


                            
                        } else if (file.label === 'attorney') {
                            $scope.phd.attorney = parseTSV(file.file, {skipEmptyLines: true});
                            main.progresstwo++;
                        } else if (file.label === 'foreign') {
                            $scope.phd.foreign = parseTSV(file.file, opts, false);
                            main.progresstwo++;
                        } else if (file.label === 'continuity') {
                            $scope.phd.continuity = parseTSV(file.file, opts, false);
                             main.progresstwo++;
                        } else if (file.label === 'transaction') {
                            $scope.phd.transaction = parseTSV(file.file, opts, false);
                             main.progresstwo++;
                        } else if (file.label === 'README') {
                            main.info = file.file;
                             main.progresstwo++;
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

           
           
            main.buffer = function (file) {
              main.bufferedfile = file;
            };
            // main.file = {};
            main.success = null;

            main.info = null;

            main.handleFiles = function (file) {
                main.error = null;
                main.success = null;
               //toastr.success('starting extraction...');
                extractpdf(file)
                  .then(function (files) {
                    main.progresstwo = 0;
                      main.extractedfiles = files.pdffiles.length - 3;
                      $log.info('Files extracted', files);
                      alertify.log('Files extracted');
                      //toastr.success('Files extracted');
                        $scope.phd.file = files.tsvfiles;

                        main.parse(files.tsvfiles)

                            .then(function (parsedfiles) {
                             
                                $log.info('TSV Parsed', parsedfiles);
                                alertify.log('TSV Parsed');

                                
                                        $roarmap(parsedfiles, $scope.phd, main)
                                            .then(function (roarmap) {
                                              $scope.phd.roarmap = roarmap;
                                              alertify.success('ROARmap built!');
                                              $patentsearch($scope.phd.application, config.PNUM || 8000000)
                                                  .then(function (patentobj) {
                                                    $scope.phd.patent = patentobj;
                                                    localStorageService.set($scope.phd.application['Application Number'], $scope.phd);
                                                    main.showupload = false;
                                                    alertify.alert('<h1>Success!</h1>','<p class="lead">All files have been successfully processed and the Prosecution History Digest for US' + $scope.phd.application['Patent Number'] + ' has been generated by LEO and delivered to your account for your review.');
                                                        
                                                    
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
                var patentnumber = phdobj['Patent Number'].replace(',','').replace(',','') || pnum;
                var applicationnumber = phdobj['Appliction Number'];
                var pdfstorageuri = 'https://patentimages.storage.googleapis.com/pdfs/US' + patentnumber + '.pdf';

                var patent = {
                    number: patentnumber,
                    media: pdfstorageuri
                };
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
                            var patent = {}
                            patent.title = phdobj['Title  of Invention'] || null;
                            patent.number = patentnumber;
                            patent.media = Blob.url;
                            patent.google = 'https://www.google.com/patents/US' + patentnumber
                            //patentobj.srcdoc = googlepage(patentnumber) || null;
                            googlepage(patent.number);
                            filepicker.convert(
                                Blob,
                                { format: 'txt' },
                                function (new_Blob) {

                                    patent.txt = new_Blob.url;
                                    return deferred.resolve(patent);
                                });

                        });
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
