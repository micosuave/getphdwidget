'use strict';

angular.module('adf.widget.getphd', ['adf.provider', 'llp.extract',
  'fa.droppable', 'llp.parsetsv', 'roar', 'textSizeSlider', 'llp.pdf', 'LocalStorageModule', 'llp.extractpdf', 'firebase', 'ui.router', 'commonServices', 'xeditable', 'ui.tree', 'ngAnimate', 'ngAnnotateText', 'ngDialog', 'ngSanitize', 'pdf', 'phd', 'toastr', 'mentio', 'lionlawlabs', 'diff', 'door3.css', 'checklist-model', 'authentication', 'angular-md5', 'angular.filter', 'roarmap', 'ngFileUpload'
]).config(function (dashboardProvider, localStorageServiceProvider) {

  localStorageServiceProvider.setPrefix('adf.getphd');

  dashboardProvider
    .widget('carousel', {
      title: 'Carousel',
      description: 'Display items in a carousel',
      templateUrl: '{widgetsPath}/getphd/src/gallery.html',
      icon: 'fa-picture',
      iconurl: 'img/lexlab.svg',
      styleClass: 'info ',
      frameless: false,
      reload: true,
      controller: 'GalleryCarouselController',
      controllerAs: 'gallery',
      edit: {
        templateUrl: '{widgetsPath}/getphd/src/editgallery.html',
        controller: 'GalleryCarouselController',
        controllerAs: 'gallery',
        modalSize: 'lg',
        reload: true
        //immediate: true
      }
    })
    .widget('gallery', {
      title: 'Gallery',
      description: 'Plain Image with thumnnails & caption',
      templateUrl: '{widgetsPath}/getphd/src/galleryplain.html',
      icon: 'fa-picture',
      iconurl: 'img/lexlab.svg',
      styleClass: 'info ',
      frameless: false,
      reload: true,
      controller: 'GalleryController',
      controllerAs: 'gallery',
      edit: {
        templateUrl: '{widgetsPath}/getphd/src/editgalleryplain.html',
        controller: 'GalleryController',
        controllerAs: 'gallery',
        modalSize: 'lg',
        reload: true
        //immediate: true
      }
    })
    .widget('getphd', {
      title: '+PhD',
      description: 'import a patent prosecution history',
      templateUrl: '{widgetsPath}/getphd/src/view.html',
      controller: 'MainCtrl',
      controllerAs: 'main',
      frameless: true,
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
                  content_type: 'getphd',
                  templateUrl: '{widgetsPath}/getphd/src/view.html',
                  timestamp: Firebase.ServerValue.TIMESTAMP
                });
                config.id = id;
                // alertify.prompt('enter app number', function (resp, text) {
                //   if (resp) {
                //     config.appnum = text;

                //   }
                // });

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
  .controller('MainCtrl', ['Collection', 'extract', 'fileReader', '$http', 'parseTSV', '$roarmap', '$q', '$scope', 'config', 'PHD', 'localStorageService', 'extractpdf', 'pdfToPlainText', '$patentsearch', '$log', 'FileUploader', '$publish', '$pdftotxt', '$timeout', 'toastr', '$rootScope', '$stateParams','$location','$ACTIVEROAR','$dashboards',"$interval","Collections",
    function (Collection, extract, fileReader, $http, parseTSV, $roarmap, $q, $scope, config, PHD, localStorageService, extractpdf, pdfToPlainText, $patentsearch, $log, FileUploader, $publish, $pdftotxt, $timeout, toastr, $rootScope, $stateParams, $location, $ACTIVEROAR, $dashboards, $interval, Collections) {
      var main = this;
      main.size = 'lg';
      $scope.collapsereport = false;
      main.collapse = function () {
        $scope.collapsereport = !$scope.collapsereport;
      };
      //main.showupload = true;
      var config = $scope.$parent.config || $scope.$parent.$parent.config;
      
      var PHD =  Collection(config.id) || Collection(config.appnum);
      PHD.$loaded().then(function (phd) {
        phd.$bindTo($scope, 'phd');
        if (angular.isUndefined(phd.file)) {
          main.showupload = true;
        } else {
          main.showupload = false;
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
        url:  '/upload' || 'https://lexlab.io/upload',
        autoUpload: true, 
        removeAfterUpload: true
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
        if (!config.PNUM || config.PNUM < 8000000){
          alertify.prompt("Please enter the Patent Number!");
        }
        console.info('onBeforeUploadItem', item);
        main.progress = 0;
        main.bufferedfile = item;
        console.log(item);
        alertify.log('starting upload...');

      };
      uploader.onProgressItem = function (fileItem, progress) {
        main.progress = progress;
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
        }, 250, length);
     

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
              main.phd.continuity = parseTSV(file.file, opts, false);
              main.progresstwo++;
            } else if (file.label === 'transaction') {
              main.phd.transaction = parseTSV(file.file, opts, false);
              main.progresstwo++;
            } else if (file.label === 'README') {
              main.info = file.file;
              main.progresstwo++;
            } else {
              main.error = 'Unhandled case!';
            }
            return deffered.resolve(main.phd);
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

      main.remotezip = function (appnum, href) {
        $http.get('https://storage.googleapis.com/uspto-pair/applications/' + appnum + '.zip').then(function(resp) {
          

          var zip = new JSZip(resp.data);

          main.handleFiles(zip);
        });

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
        
        //toastr.success('starting extraction...');
        extractpdf(file)
          .then(function (files) {
            try {
              progressfunction(files.pdffiles.length);
            }
            catch (ex) { console.log(ex); }
            finally {
              $log.info('Files extracted', files);
              alertify.log('Files extracted');
              //toastr.success('Files extracted');
              main.phd.file = files.tsvfiles;

              main.parse(files.tsvfiles)

                .then(function (parsedfiles) {

                  //$log.info('TSV Parsed', parsedfiles);
                  alertify.log('TSV Parsed');
                  //alertify.log('Building ROARmap...');

                  $roarmap(parsedfiles, main.phd, main)
                    .then(function (groupids) {
                      // $scope.phd.roarmap = roarmap;
                      //$scope.phd.roarlist = roarmap.collections;
                      alertify.success('ROARmap built!');
                      $patentsearch(main.phd.application, config.PNUM)
                        .then(function (patentobj) {
                          main.phd.patent = patentobj;
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

            }}, function (reason) {

              console.log(reason.messsage);
            });
      

      },
      function (reason) {

        console.log(reason.message);

      };
      main.finalize = function(phd, groupids){
        //$scope.phd.title = $scope.phd.application['Title of Invention'];
        var collections = Collections();
        var appnum = angular.copy(phd.application['Application Number']).replace('/', '').replace(',', '').replace(',', '');
              var phdref = Collection($scope.phd.id).$ref();
              var dashboards = Collection($ACTIVEROAR.page);
              var dashboardsref = dashboards.$ref();
                //  var phdref = Collection(phd.id).$ref();
              var projref = Collection($stateParams.pId).$ref();


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
            collections.$add(patent).then(function (ref) {
              var id = ref.key();
              ref.update({
                id: id,
                timestamp: Firebase.ServerValue.TIMESTAMP
              });
              ref.child('rows').child('0').child('columns').child('1').child('widgets').child('0').child('config').child('id').set(id);
              var allref = Collection(groupids[0]).$ref();
              var meritsref = Collection(groupids[1]).$ref();
              allref.child('roarlist').push(id);
              meritsref.child('roarlist').push(id);

            });

              
                        
                        
                        // phdref.update({
                        //   appnum: appnum,
                        //   media: 'https://lexlab.io/files/public/uspto/index#?app=' + appnum,
                        //   title: 'PhD for ' + (phd.application['Patent Number'] || phd.patent.number),
                        //   styleClass: 'NOA',
                        //   rid: 'PHD'
                        // });
                        phd.appnum = appnum;
                        phd.media= 'https://lexlab.io/files/public/uspto/index#?app=' + appnum;
                        phd.title = 'PhD for ' + (phd.patent.number || phd.application['Patent Number']);
                        phd.styleClass = 'Applicant';
                          phd.rid= 'PHD';
                          localStorageService.set(phd.application['Application Number'], phd);
                          $http.post('/getphd/store/' + appnum, phd);
                          phdref.update(phd);
                          // dashboardsref.update({ styleClass: 'primary', title: 'PhD Report for US '+ (phd.patent.number || phd.application['Patent Number'])});
                          dashboardsref.update(phd);
                          angular.forEach(groupids, function (id, key) {
                            phdref.child('roarlist').push(id);
                            
                            dashboardsref.child('roarlist').push(id);
                              projref.child('roarlist').push(id);
                              var selfref = Collection(id).$ref();
                              selfref.update({ media: phd.patent.media });
                          });
                          
                          main.showupload = false;
                          
                          alertify.alert('<div class="card card-block card-fancy"><div class="card-header"><h1 class="card-title">Prosecution History Digest for US ' + phd.patent.number + '</h1></div><div class="card-block"><h6 class="card-text lead">All files have been successfully processed by LEO and delivered to your account for review.</h6></div></div>');

                        
                                                
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
        var patentnumber = pnum || angular.copy(phdobj['Patent Number']).replace(',', '').replace(',', '');
        //var applicationnumber = phdobj['Appliction Number'];
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
            var patent = {};
            patent.title = phdobj['Title of Invention'] || null;
            patent.number = patentnumber;
            patent.media = Blob.url;
            patent.google = 'https://www.google.com/patents/US' + patentnumber;
            patent.rid = 'P1';
            if (phdobj['Issue Date of Patent'] !== '-') { patent.date = phdobj['Issue Date of Patent']; } else { patent.date =  '1899-12-31'; }
            patent.styleClass = 'NOA';
            patent.name = 'US' + patentnumber;
            patent.description = phdobj['Title of Invention'];
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
  .controller('GalleryCarouselController', ['$scope', 'config', 'Collection', '$rootScope','$ACTIVEROAR', function ($scope, config, Collection, $rootScope, $ACTIVEROAR) {
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
      gallery.slides.push({ title: 'PatentPhD', media:'/llp_core/img/logolong.png' });
    }
  }])
  .controller('GalleryCarousel',['',function(){}]);
