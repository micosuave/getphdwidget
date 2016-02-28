(function(window, undefined) {'use strict';


angular.module('adf.widget.getphd', ['adf.provider', 'llp.extract',
  'fa.droppable', 'llp.parsetsv', 'roar', 'textSizeSlider', 'llp.pdf', 'LocalStorageModule', 'llp.extractpdf', 'firebase', 'ui.router', 'commonServices', 'xeditable', 'ui.tree', 'ngAnimate', 'ngAnnotateText', 'ngDialog', 'ngSanitize', 'pdf', 'phd', 'toastr', 'mentio', 'lionlawlabs', 'diff', 'door3.css', 'checklist-model', 'authentication', 'angular-md5', 'angular.filter', 'roarmap', 'ngFileUpload'
]).config(["dashboardProvider", "localStorageServiceProvider", function (dashboardProvider, localStorageServiceProvider) {

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
      },
      resolve: {
        config: ["config", "$firebaseArray", "$rootScope", "FIREBASE_URL",
          function (config, $firebaseArray, $rootScope, FIREBASE_URL) {
            if (config.id) {
              return config;
            } else {
              var a = $firebaseArray(new Firebase(FIREBASE_URL + 'matters/' + $rootScope.$stateParams.groupId + '/' + $rootScope.$stateParams.matterId + '/content/'));
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

}])
  
  .controller('MainCtrl', ['Collection', 'extract', 'fileReader', '$http', 'parseTSV', '$roarmap', '$q', '$scope', 'config', 'PHD', 'localStorageService', 'extractpdf', 'pdfToPlainText', '$patentsearch', '$log', 'FileUploader', '$publish', '$pdftotxt', '$timeout', 'toastr', '$rootScope', '$stateParams','$location','$ACTIVEROAR','$dashboards','$interval','Collections','$compile','$templateCache','$window','$document',
    function (Collection, extract, fileReader, $http, parseTSV, $roarmap, $q, $scope, config, PHD, localStorageService, extractpdf, pdfToPlainText, $patentsearch, $log, FileUploader, $publish, $pdftotxt, $timeout, toastr, $rootScope, $stateParams, $location, $ACTIVEROAR, $dashboards, $interval, Collections,$compile,$templateCache, $window, $document) {
      var main = this;
      //main.size = 'lg';
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
        
        console.info('onBeforeUploadItem', item);
        main.progress = 0;
        main.bufferedfile = item;
        console.log(item);
        alertify.log('starting upload...');

      };
      uploader.onProgressItem = function (fileItem, progress) {
        main.progress = progress;
         if (progress === 10){
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
      main.toggle = function(){
          main.checked = !main.checked;
      };
      main.phd = {};
      var appnum = config.appnum;
      var attorney = appnum + '/' + appnum + '-address_and_attorney_agent.tsv';
      var application = appnum + '/' + appnum + '-application_data.tsv';
      var continuity = appnum + '/' + appnum + '-continuity_data.tsv';
      var foreign = appnum + '/' + appnum + '-foreign_priority.tsv';
      var transaction = appnum + '/' + appnum + '-transaction_history.tsv';
      var termadjust = appnum + '/' + appnum + '-patent_term_adjustments.tsv';
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
        },{
            label: 'term',
            value: termadjust
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
            } else if(file.label === 'term'){
                main.phd.termadjustments === parseTSV(file.file, {skipEmptyLines: true});
                main.progresstwo++;
            }else {
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
      main.size="450px";
      main.checked = false;
      
//       var cors_api_url = 'https://lexlab.io/proxy/';
//   function doCORSRequest(options, printResult) {
//     var x = new XMLHttpRequest();
//     x.open(options.method, cors_api_url + options.url);
//     x.onload = x.onerror = function() {
//       printResult(
//         options.method + ' ' + options.url + '\n' +
//         x.status + ' ' + x.statusText + '\n\n' +
//         (x.responseText || '')
//       );
//     };
//     if (/^POST/i.test(options.method)) {
//       x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
//     }
//     x.send(options.data);
//   }
//   // Bind event
//   (function() {
//     var urlField = document.getElementById('url');
//     var dataField = document.getElementById('data');
//     var outputField = document.getElementById('output');
//     document.getElementById('get').onclick =
//     document.getElementById('post').onclick = function(e) {
//       e.preventDefault();
//       doCORSRequest({
//         method: this.id === 'post' ? 'POST' : 'GET',
//         url: urlField.value,
//         data: dataField.value
//       }, function printResult(result) {
//         outputField.value = result;
//       });
//     };
//   })();
      
      main.getpatentdownload = function(pnum){
      $(document.createElement("iframe")).attr('name','fframe').appendTo('body');
          var patgoog = function(pnum){
              return $window.open('https://patentimages.storage.googleapis.com/pdfs/US' + pnum + '.pdf', 'fframe', 'resizable=no,status=no,location=no,toolbar=no,menubar=no,fullscreen=no,scrollbars=no,dependent=yes,width=400,left=150,height=30,top=150');
          }
          patgoog(pnum);
      };
      main.getpublishedapplication = function(y,num){
                $(document.createElement("iframe")).attr('name','fframe').appendTo('body');
            $window.open('https://patentimages.storage.googleapis.com/pdfs/US'+y+num+'.pdf', 'fframe', 'resizable=no,status=no,location=no,toolbar=no,menubar=no,fullscreen=no,scrollbars=no,dependent=yes,width=400,left=150,height=30,top=150');  
      };
      main.getfilehistory = function (appnum, provider) {

        var winreed = function(appnum){
            return $window.open('https://patents.reedtech.com/downloads/pair/'+appnum+'.zip', '_blank', 'resizable=no,status=no,location=no,toolbar=no,menubar=no,fullscreen=no,scrollbars=no,dependent=yes,width=400,left=150,height=30,top=150');
        };     
        var wingoog = function(appnum){
            return $window.open('https://storage.googleapis.com/uspto-pair/applications/'+appnum+'.zip', '_blank', 'resizable=no,status=no,location=no,toolbar=no,menubar=no,fullscreen=no,scrollbars=no,dependent=yes,width=400,left=550,height=30,top=150');
        };
        if (provider === 'reedtech'){ winreed(appnum);}
        else{ wingoog(appnum);}
       // main.spinner = true;
       // main.progress = 0;
       // var appnum = appnum;
       // if ($location.host() == 'localhost'){
       // var proxy_url = 'https://localhost:8080/';
       // }else{
       //     var proxy_url = $location.protocol() +'://'+$location.host()+':8080/';
       // }
       // var target_url = 'https://patents.reedtech.com/downloads/pair/' + appnum + '.zip';
        //var target_url = 'http://storage.googleapis.com/uspto-pair/applications/' + appnum + '.zip';
       // var request = {
       //   method: 'GET',
       //   url: proxy_url + target_url,
          //url: target_url,
       //  headers: {
       //     "Target-Endpoint": target_url,
        //     "Access-Control-Allow-Origin": "/",
         //       "Access-Control-Allow-Headers": "Content-Type,X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,    Date, X-Api-Version, X-File-Name",
          //      "Access-Control-Allow-Methods": "POST, GET, PUT, DELETE, OPTIONS",
           //     "Access-Control-Allow-Credentials": true
          //}
        };
    //     console.log(request);
    //     $http(request).then(function (resp) {
    //       console.log(resp);
    //       main.file = resp.data;
    //       console.log(resp.data);
    //       extract(resp.data, appnum)
    //         .then(function (files) {
    //           console.log(files);
    //           main.file = files;
    //           main.parse(files).then(function () {
    //             main.spinner = false;
    //           });
    //         }, function (reason) {
    //           main.error = reason.message;
    //         });
    //     });
    //   };

      main.remotezip = function (appnum) {
      
        appnum.slice(appnum.indexOf('/'),1);
        appnum.slice(appnum.indexOf(','),1);
        config.appnum = appnum;
        // $http.get('https://storage.googleapis.com/uspto-pair/applications/' + appnum + '.zip').then(function(resp) {
        //   console.log(resp);
        //   alertify.log(resp.headers);
          
        //   var zip = new JSZip(resp.data);
        //   main.remoteresp = zip;
        //   main.handleFiles(zip);
        // });

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
      

      },
      function (reason) {

        console.log(reason.message);

      };
      main.popdoc = function (imgrecord) {

        var divpanel = angular.element('<div/>').attr('class', 'issuedocpanel stacker');
        //var header = angular.element('<h4 class="splash">' + event.rid + ' - ' + event.name + '<span class="fa fa-close btn btn-xs btn-danger" style="float: right;" onclick="$(this).parent().parent().remove()"></span></h4><h6>' + event.media + '</h6>');
        var header = $templateCache.get("{widgetsPath}/getphd/src/titleTemplate.html");

        var skope = angular.element('<iframe/>').attr('height', '680px').attr('src', 'https://lexlab.io/files/public/uspto/' + $scope.phd.appnum + '/' + $scope.phd.appnum + '-image_file_wrapper/' + imgrecord['Filename']);

        angular.element('body').append($compile(divpanel.append(header).append(skope))($scope));
        $('.issuedocpanel').draggable({
          stack: '.stacker',
          handle: 'h4'
        }).resizable();

      };
      main.finalize = function(phd, groupids){
        //$scope.phd.title = $scope.phd.application['Title of Invention'];
        var collections = Collections();
        var appnum = angular.copy(phd.application['Application Number']).replace('/', '').replace(',', '').replace(',', '');
              var phdref = Collection($scope.phd.id).$ref();
              var dashboards = Collection($stateParams.pageid);
              var dashboardsref = dashboards.$ref();
                //  var phdref = Collection(phd.id).$ref();
              var projref = Collection($stateParams.pId).$ref();


       

              
                        
                        
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
                        phd.description = 'USSN ' + phd.application['Application Number'];
			phd.styleClass = 'Applicant';
                          phd.rid= 'PHD';
			phd.icon = 'fa-balance-scale';
                          localStorageService.set(phd.application['Application Number'], phd);
                          $http.post('/getphd/store/' + appnum, phd);
                          phdref.update(phd);
                          dashboardsref.update({ styleClass: 'Applicant', title: 'PhD Report for US '+ (phd.patent.number || phd.application['Patent Number'])});
                          // dashboardsref.update(phd);
                        //dashboardsref.child('roarlist').child($stateParams.pageid).set($stateParams.pageid);
 
			 angular.forEach(groupids, function (id, key) {
                            /*-- create internal report pages --*/// phdref.child('roarlist').child(id).set(id);
                            
                           /*-- create pages in tab/binder--*/ 
				dashboardsref.child('roarlist').child(id).set(id);
                            /*-- create tabs/binders in project --*/  //projref.child('roarlist').child(id).set(id);
                              var selfref = Collection(id).$ref();
                              selfref.update({ media: phd.patent.media });
                          });
                        //  dashboardsref.child('roarlist').child(groupids[0]).set(groupids[0]);
                        //  projref.child('roarlist').child(groupids[1]).set(groupids[1]);
                        //  projref.child('roarlist').child(groupids[2]).set(groupids[2]);
                        //  projref.child('roarlist').child(groupids[3]).set(groupids[3]);
                          Collection($scope.phd.id).$loaded().then(function (report) {
                            var rows = angular.copy(report.rows);
                            dashboardsref.child('rows').set(rows);
                            main.showupload = false;
                          
                          alertify.alert('<div class="card-header"><h1 class="card-title">Prosecution History Digest for US ' + phd.patent.number + '</h1></div><div class="card-block"><h6 class="card-text lead">All files have been successfully processed by LEO and delivered to your account for review.</h6></div>');

                          });
                          
                        
                                                
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
  .factory('$patentsearch', ['$q', 'filepickerService','$http', function ($q, filepickerService, $http) {

    return function (phdobj, config) {
      var deferred = $q.defer();
      if(config.PNUM && config.PNUM > 0){
            searchforpatent(phdobj, config.PNUM);
      }
      else if (config.IPANUM){
          searchforpatent(phdobj, config.IPAYEAR + config.IPANUM);
      }
      return deferred.promise;

      function searchforpatent(phdobj, pnum) {
        var patentnumber = pnum || angular.copy(phdobj['Patent Number']).replace(',', '').replace(',', '');
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


        // filepicker.storeUrl(
        //   pdfstorageuri.toString(),
        //   { filename: 'US' + patentnumber + '.pdf' },
        //   function (Blob) {
        //     var patent = {};
           $http.get('/getphd/patents/'+patentnumber).then(function(resp){
            var patent = resp.data;
            patent.number = patentnumber;
            patent.media = pdfstorageuri;
            patent.filename = 'US'+patentnumber + '.pdf';
            patent.title = phdobj['Title of Invention'] || null;
            
            patent.google = 'https://www.google.com/patents/US' + patentnumber;
            patent.rid = 'P1';
            if (phdobj['Issue Date of Patent'] !== '-') { patent.date = phdobj['Issue Date of Patent']; } else { patent.date =  '1899-12-31'; }
            patent.styleClass = 'NOA';
            patent.name = 'US' + patentnumber;
            patent.description = phdobj['Title of Invention'];
           var maildate = new Date(patent.date);
            var roardate = maildate.toDateString();
           var noatemplate = '<div class="container-fluid two-col-left">' +
            '<div class="row two-col-left">' +
            '<div class="col-md-3 col-sidebar"><p><img src="https://placehold.it/250x208/7c994f/fff/&text='+patent.rid+'" class="img img-responsive img-shadow"/></p></div>' +
            '<div class="col-md-9 col-main"><div class="bs-callout bs-callout-NOA bs-callout-reverse"><h4>' + patent.title + '</h4><p>Filed '+roardate+'</p><cite>'+patent.filename+'&nbsp;&nbsp;<a href="'+patent.media+'" target="fframe"><i class="fa fa-external-link"></i></a></cite></div></div>' +
            '</div>' +
            '</div>';
           var wraphead = "<!DOCTYPE html><html><head><title></title><link href=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.2/css/bootstrap.min.css\" rel= \"stylesheet\" /><link href=\"https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css\" rel=\"stylesheet\"/><link href=\"//lexlab.io/llp_core/dist/app.full.min.css\" rel= \"stylesheet \" /><link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/tether-select/1.1.1/css/select-theme-default.css\"/><script src= \"https://code.jquery.com/jquery-2.2.0.min.js \"></script><script src=\"https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.16/d3.min.js \"></script><script src=\"https://cdnjs.cloudflare.com/ajax/libs/Chart.js/1.0.2/Chart.min.js\"></script><script src=\"https://cdnjs.cloudflare.com/ajax/libs/tether/1.2.0/js/tether.min.js\"></script><script src=\"https://cdnjs.cloudflare.com/ajax/libs/tether-select/1.1.1/js/select.min.js\"></script><script src= \"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.2/js/bootstrap.min.js \"></script><base href= \"/ \" target= \"fframe \" /></head><body class= \"dark-bg \"><div class= \"container-fluid \"><div class= \"row \"><div class= \"col-xs-12 \"><div class= \"card card-block \">";
                        
                        var wraptail ="</div></div></div></div><footer class= \"navbar-fixed-bottom \"><p style= \"padding-left:30px;margin-left:30px;text-indent:20px; \">&nbsp;&nbsp;&nbsp;&nbsp;CONTAINS MATERIAL SUBJECT TO PROTECTIVE ORDER</p></footer></body></html>";
          var contenttemplate = '<p class="card-text">' + patent.abstract + '</p>';
          var poodle;
          angular.forEach(patent.drawings, function(drawingurl, key){
             poodle =  angular.element(contenttemplate).append($('img').attr('src',patent.thumbnails[key]).wrap($('a').attr('href', drawingurl).attr('target','fframe')));
          patent.content = wraphead + noatemplate + $(poodle).html() + wraptail;
         
          });
           deferred.resolve(patent);
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

angular.module("adf.widget.getphd").run(["$templateCache", function($templateCache) {$templateCache.put("{widgetsPath}/getphd/src/edit.html","<form role=form><div class=form-group><label for=sample>Application #</label> <input type=text class=form-control id=sample ng-model=config.appnum placeholder=\"Enter Application #\"></div></form>");
$templateCache.put("{widgetsPath}/getphd/src/editgallery.html","<form role=form><div class=form-group><label for=sample>Interval, in milliseconds:</label> <input type=number class=form-control ng-model=config.interval><br>Enter a negative number or 0 to stop the interval.</div><div class=form-group><label>Disable Slide Looping</label> <input type=checkbox ng-model=config.nowrap></div><div class=form-group><label>Pause on Hover?</label> <input type=checkbox ng-model=config.pauseonhover></div><div class=form-group><label>Disable Transition</label> <input type=checkbox ng-model=config.transition></div></form>");
$templateCache.put("{widgetsPath}/getphd/src/gallery.html","<div style=\"min-height: 305px\"><uib-carousel interval=config.interval no-pause={{config.pauseonhover}} no-transition={{config.transition}} no-wrap={{config.nowrap}}><uib-slide ng-repeat=\"slide in gallery.slides\" active={slide.active} index=slide.index><img ng-src={{slide.media}} style=margin:auto;><div class=carousel-caption><h4>Slide {{slide.$index}}</h4><p>{{slide.title}}</p></div></uib-slide></uib-carousel></div>");
$templateCache.put("{widgetsPath}/getphd/src/titleTemplate.html","<div class=card-header style=z-index:1;padding:0px;><h4 class=\"bs-callout bs-callout-primary\"><span style=color:steelblue;>{{config.title || roarevent.title}}</span><br><div class=row style=width:100%;><small>{{roarevent.date | date}}</small> <span class=pull-right style=position:absolute;right:5px;font-size:12px;><a title=notes ng-click=note(roarevent)><i class=\"fa fa-pencil\" style=color:steelblue;></i></a><a title=\"reload widget content\" ng-click=reload()><i class=\"fa fa-refresh\" style=color:steelblue;></i></a> <a title=\"change widget location\" class=adf-move><i class=\"fa fa-arrows\" style=color:steelblue;></i></a> <a title=\"collapse widget\" ng-show=\"options.collapsible && !widgetState.isCollapsed\" ng-click=\"widgetState.isCollapsed = !widgetState.isCollapsed\"><i class=\"fa fa-minus\" style=color:steelblue;></i></a> <a title=\"expand widget\" ng-show=\"options.collapsible && widgetState.isCollapsed\" ng-click=\"widgetState.isCollapsed = !widgetState.isCollapsed\"><i class=\"fa fa-plus\" style=color:steelblue;></i></a> <a title=\"copy to clipboard\" ng-click=edit(roarevent.id)><i class=\"fa fa-copy\" style=color:steelblue;></i></a> <a title=\"fullscreen widget\" ng-click=openFullScreen(roarevent.id) ng-show=\"options.maximizable || true\"><i class=\"fa fa-expand\" style=color:steelblue;></i></a> <a title=\"remove widget\" ng-click=remove() onclick=$(this).parent().parent().parent().parent().parent().remove()><i class=\"fa fa-close\" style=color:steelblue;></i></a></span></div></h4></div>");
$templateCache.put("{widgetsPath}/getphd/src/view.html","<div ng-controller=\"MainCtrl as main\"><div class=\"card card-primary card-block btn-glass drop-target\" nv-file-drop uploader=uploader drop-files=handleFiles(files) style=\"border: 2px dashed blue;margin: 5px;\" ng-if=main.showupload><div ng-controller=pageslideCtrl><button class=\"row btn btn-glass btn-primary img img-rounded\" style=width:100%;position:relative;display:flex;display:-webkit-flex;align-items:center;align-content:stetch;justify-content:center;flex-direction:row; ng-click=main.toggle() ng-class=\"{\'btn-success\': (main.progress == 100),\'btn-danger\':(main.progress === \'failed\')}\"><uib-progressbar class=\"btn-glass fa fa-3x active stripped\" ng-class=\"{\'active\':(main.progress < 100)}\" ng-if=main.progress value=main.progress style=height:40px;margin:auto;position:relative;display:flex;display:-webkit-flex;align-items:center;align-content:stetch;justify-content:stretch;flex-direction:row;align-self:stretch; type={{main.progresstype}}></uib-progressbar><i class=\"fa fa-upload fa-3x\">{{main.progress}}<span ng-show=main.progress>%</span></i> <img src=https://lexlab.firebaseapp.com/img/GoldLogoLong.svg class=\"pop img img-rounded pull-right\" style=max-height:100px; ng-if=!main.progress></button><div class=\"row btn btn-glass btn-info\" style=position:relative;display:flex;display:-webkit-flex;align-items:center;align-content:stetch;justify-content:center;flex-direction:row; ng-if=main.progresstwo><uib-progressbar class=\"btn-glass fa fa-3x active striped\" ng-class=\"{\'active\':(main.progresstwo < 100)}\" value=main.progresstwo max=main.extractedfiles style=height:40px;margin:auto;position:relative;display:flex;display:-webkit-flex;align-items:center;align-content:stetch;justify-content:stretch;flex-direction:row;align-self:stretch; type={{main.progresstype}}></uib-progressbar><i class=\"fa fa-fw fa-3x fa-spinner fa-spin\"></i><i class=\"fa fa-3x\">{{main.progresstwo}}/{{main.extractedfiles}}</i></div><div pageslide ps-open=main.checked ps-key-listener=true ps-side=\"{{main.side || \'left\'}}\" ps-class=\"{{main.styleClass || \'card-dark btn-glass\'}}\" ps-size=\"{{main.size || \'400\'}}\" style=overflow-x:visible;overflow-y:scroll;><hr><div ng-include=\"\'/getphdwidget/src/phd/step-1.html\'\"></div><hr></div></div></div><div class=\"card card-fancy card-rounded card-block card-thick\" style=\"text-align: left;color: #444;\" ng-if=phd.file><button class=\"alert btn-glass btn-primary img card-rounded row\" style=\"position:relative;display:flex;display:-webkit-flex;align-items:center;align-content:center;justify-content:space-between;flex-direction:row;background-color:#35688F;padding:2px;box-shadow:inset 10px 2px 50px rgba(0,0,0,0.5);\" ng-click=main.collapse()><div style=display:flex;justify-content:flex-end;flex-direction:column;align-content:flex-end;vertical-align:middle;align-items:flex-end;><h4 class=\"card-title ng-binding display-4\" style=\"margin-bottom:0;color: #fff;\">US {{(config.PNUM | number:0) || (config.IPAYEAR + \"&nbsp;/&nbsp;\" + config.IPANUM) }}</h4><h5 class=\"card-subtitle ng-binding\" style=color:#ddd;><span class=lead>USSN {{phd.application[\'Application Number\']}}</span></h5></div><img src=/llp_core/img/GoldLion.svg class=\"img lionlogofilter\" style=\"width:75px;height: auto;\"><div style=display:flex;flex-direction:column;align-items:flex-start;justify-content:space-around;><img src=/llp_core/img/GoldLogoLong.svg class=img style=height:45px;> <img src=/llp_core/img/GoldPhdLogoLong.svg class=img style=height:25px;padding-left:2px;></div></button><div uib-collapse=collapsereport class=\"card clearfix\" style=padding:0;margin:0;><blockquote><h4>{{phd.application[\'Title of Invention\']}}</h4><p style=font-size:10px;><cite>{{phd.application[\'First Named Inventor\']}} <small><emphasis>Issued&nbsp&nbsp&nbsp&nbsp<span editable-text=\"phd.application[\'Issue Date of Patent\']\">{{phd.application[\'Issue Date of Patent\']}}</span></emphasis></small></cite></p></blockquote><uib-tabset class=tabbable justified=true type=pills><uib-tab heading=\"PTO Metadata\" class=btn-glass active=main.tabs[0].isActive disabled=main.tabs[0].disabled select=\"main.tabs[0].isActive = true\" deselect=\"main.tabs[0].isActive = false\"><uib-tab-content ng-if=main.tabs[0].isActive><uib-tabset class=\"tabbable tabs-left\"><uib-tab><uib-tab-heading>USSN {{phd.application[\'Application Number\']}}</uib-tab-heading><uib-tabset class=tabbable><uib-tab ng-repeat=\"file in phd.file\" heading=\"{{file.label | uppercase}}\"><uib-tab-content><pre class=\"card card-block card-fancy\" ng-bind=file.file></pre></uib-tab-content></uib-tab></uib-tabset></uib-tab><uib-tab ng-if=phd.application><uib-tab-heading ng-style>APPLICATION</uib-tab-heading><uib-tab-content><table class=\"card card-block table table-striped table-hover table-condensed table-responsive\"><tbody><tr ng-repeat=\"(key, value) in phd.application\"><td><strong>{{::key}}</strong></td><td>{{::value}}</td></tr></tbody></table></uib-tab-content></uib-tab><uib-tab class=text-info ng-if=phd.attorney><uib-tab-heading ng-style>ATTORNEY</uib-tab-heading><uib-tab-content><table class=\"card card-block table table-striped table-hover table-condensed table-responsive\"><tbody><tr ng-repeat=\"line in phd.attorney\"><td ng-repeat=\"value in line\">{{::value}}</td></tr></tbody></table></uib-tab-content></uib-tab><uib-tab class=text-success ng-if=phd.continuity><uib-tab-heading ng-style>CONTINUITY</uib-tab-heading><uib-tab-content><table class=\"card card-block table table-striped table-condensed table-hover table-responsive\"><thead><tr><th><strong>Description</strong></th><th><strong>Parent Filing or 371(c) Date</strong></th><th><strong>Parent Number</strong></th><th><strong>Parent Status</strong></th><th><strong>Patent Number</strong></th></tr></thead><tbody><tr ng-repeat=\"line in phd.continuity\"><td>{{::line[\'Description\']}}</td><td>{{::line[\'Parent Filing or 371(c) Date\']}}</td><td>{{::line[\'Parent Number\']}}</td><td>{{::line[\'Parent Status\']}}</td><td><a ng-href=\"https://patentimages.storage.googleapis.com/pdfs/US{{::line[\'Patent Number\'].replace(\',\',\'\').replace(\',\',\'\')+\'.pdf\'}}\" target=_blank ng-if=\"line[\'Patent Number\'] !== \'\'\">{{::line[\'Patent Number\']}}</a></td></tr></tbody></table></uib-tab-content></uib-tab><uib-tab ng-if=phd.foreign><uib-tab-heading class=text-warning ng-style>FOREIGN PRIORITY</uib-tab-heading><uib-tab-content><table class=\"table table-striped table-condensed table-hover table-responsive\"><thead><tr><th><strong>Country</strong></th><th><strong>Priority</strong></th><th><strong>Priority Date</strong></th></tr></thead><tbody><tr ng-repeat=\"p in phd.foreign\"><td ng-bind=\"::p[\'Country\']\"></td><td ng-bind=\"::p[\'Priority\']\"></td><td ng-bind=\"::p[\'Priority Date\'] | date\"></td></tr></tbody></table></uib-tab-content></uib-tab><uib-tab ng-if=phd.termadjustments><uib-tab-heading>PATENT TERM ADJUSTMENTS</uib-tab-heading><uib-tab-content><table class=\"card card-block table table-striped table-hover table-condensed table-responsive\"><tbody><tr ng-repeat=\"line in phd.termadjustments\"><td ng-repeat=\"value in line\">{{::value}}</td></tr></tbody></table></uib-tab-content></uib-tab><uib-tab ng-if=phd.transaction><uib-tab-heading ng-style>TRANSACTION</uib-tab-heading><uib-tab-content><table class=\"table table-striped table-hover table-condensed table-responsive\"><thead><tr><th><strong>Date</strong></th><th><strong>Transaction Description</strong></th></tr></thead><tbody><tr ng-repeat=\"trans in phd.transaction\"><td>{{::trans[\'Date\']}}</td><td>{{::trans[\'Transaction Description\']}}</td></tr></tbody></table></uib-tab-content></uib-tab><uib-tab ng-if=phd.imagefile><uib-tab-heading ng-style>IMAGE FILE WRAPPER</uib-tab-heading><uib-tab-content><input type=text ng-model=main.query placeholder=search... class=pull-right><table class=\"table table-hover table-condensed table-responsive\"><thead><tr><th ng-click=\"main.dog = \'Mail\\ Room\\ Date\'; maybe = !maybe\"><strong>Mail Room Date<i class=fa ng-if=\"main.dog == \'Mail Room Date\'\" ng-class=\"{\'fa-chevron-up\':maybe,\'fa-chevron-down\': !maybe}\"></i></strong></th><th ng-click=\"main.dog = \'Document\\ Code\'; maybe = !maybe\"><strong>Document Code<i class=fa ng-if=\"main.dog == \'Document Code\'\" ng-class=\"{\'fa-chevron-up\':maybe,\'fa-chevron-down\': !maybe}\"></i></strong></th><th ng-click=\"main.dog = \'Document\\ Description\'; maybe = !maybe\"><strong>Document Description<i class=fa ng-if=\"main.dog == \'Document Description\'\" ng-class=\"{\'fa-chevron-up\':maybe,\'fa-chevron-down\': !maybe}\"></i></strong></th><th ng-click=\"main.dog = \'Document\\ Category\'; maybe = !maybe\"><strong>Document Category<i class=fa ng-if=\"main.dog == \'Document Category\'\" ng-class=\"{\'fa-chevron-up\':maybe,\'fa-chevron-down\': !maybe}\"></i></strong></th><th ng-click=\"main.dog = \'Page\\ Count\'; maybe = !maybe\"><strong>Page Count<i class=fa ng-if=\"main.dog == \'Page Count\'\" ng-class=\"{\'fa-chevron-up\':maybe,\'fa-chevron-down\': !maybe}\"></i></strong></th><th ng-click=\"main.dog = \'Filename\'; maybe = !maybe\"><strong>Filename<i class=fa ng-if=\"main.dog == \'Filename\'\" ng-class=\"{\'fa-chevron-up\':maybe,\'fa-chevron-down\': !maybe}\"></i></strong></th></tr></thead><tbody><tr ng-repeat=\"roarevent in phd.imagefile | filter: main.query | orderBy: main.dog : maybe\"><td ng-bind=\"roarevent[\'Mail Room Date\']\"></td><td ng-bind=\"roarevent[\'Document Code\']\"></td><td ng-bind=\"roarevent[\'Document Description\']\"></td><td ng-bind=\"roarevent[\'Document Category\']\"></td><td ng-bind=\"roarevent[\'Page Count\']\"></td><td><a ng-click=main.popdoc(roarevent)>{{roarevent[\'Filename\']}}</a></td></tr></tbody></table></uib-tab-content></uib-tab></uib-tabset></uib-tab-content></uib-tab><uib-tab active=main.tabs[1].isActive disable=main.tabs[1].disabled select=\"main.tabs[2].isActive = true\" deselect=\"main.tabs[1].isActive = false\"><uib-tab-heading ng-style>US {{(config.PNUM | number:0) || (config.IPAYEAR + \"&nbsp;/&nbsp;\" + config.IPANUM) }}</uib-tab-heading><uib-tab-content ng-if=main.tabs[2].isActive><d3pendingtree patent=\"{{config.PNUM || config.IPAYEAR + config.IPANUM}}\"></d3pendingtree><div id=info></div></uib-tab-content></uib-tab></uib-tabset></div></div></div>");
$templateCache.put("{widgetsPath}/getphd/src/phd/step-1.html","<div class=\"panel panel-primary\" style=margin:0rem;margin-left:-0.75rem;overflow:visible;><div class=\"panelhead2 panel-heading btn-primary btn-glass clearfix\" style=margin-right:-1rem;border-top-left-radius:0rem;border-bottom-left-radius:0rem;border-top-right-radius:2rem;border-bottom-right-radius:2rem;><img src=/llp_core/img/GoldLion.svg class=\"img lionlogofilter pull-left\" style=\"width:auto;height: 50px;align-self:flex-start;position:absolute;margin-top:-10px;\"><div class=pull-right style=display:flex;flex-direction:column;align-items:flex-start;justify-content:space-around;align-self:flex-end;><img src=/llp_core/img/GoldLogoLong.svg class=img style=height:25px;> <img src=/llp_core/img/GoldPhdLogoLong.svg class=img style=height:10px;padding-left:2px;></div></div><div class=panel-body style=overflow:scroll;><blockquote class=\"bs-callout bs-callout-primary card-header\" style=margin:0;><p class=\"text-muted text-left\" style=text-align:left;font-size:11px;>Use the following fields to directly download U.S. utility patents and published patent applications from Google Patents, and to directly download .zip files of their prosecution histories from the <a href=\"https://www.uspto.gov/\" uib-tooltip=\"United States Patent & Trademark Office official site\" tooltip-trigger=mouseenter>USPTO</a> public data-proxy-repositors, <a href=\"https://www.google.com/patents/\" uib-tooltip=\"Google Patents\" tooltip-trigger=mouseenter>Google</a> & <a href=\"http://www.reedtech.com/\" uib-tooltip=ReedTech tooltip-trigger=mouseenter>ReedTech</a>. To automatically parse a prosecution history, drag the downloaded .zip file over the Patent PhD panel to the right on the main screen, and drop the file within the dropzone once it has become marked by a dotted border. The .zip file will then automatically upload to our servers, where LEO will generate a Patent PhD Report and return it to the main display screen for your review.</p></blockquote><blockquote class=\"bs-callout bs-callout-success card-header\" style=text-align:left;margin:0;><h6 class=card-title style=text-align:left;font-size:12px;><label for=patentnumber class=\"card-text text-muted\"><strong>Enter US Patent Number</strong></label></h6><div class=input-group><input type=number placeholder=\"Patent #\" style=\"padding:0.75rem;font-size:14px;font-family:\'Helvetica\',sans-serif;text-shadow:0.1rem 0.1rem 0.1rem rgba(50,50,50,0.5);\" ng-model=config.PNUM> <button class=\"btn btn-default right text-success fa fa-2x fa-download\" href=https://patentimages.storage.googleapis.com/pdfs/US{{config.PNUM}}.pdf target=_blank tooltip-trigger=mouseenter uib-tooltip=\"Download Patent\" ng-click=main.getpatentdownload(config.PNUM);></button></div></blockquote><blockquote class=\"bs-callout bs-callout-warning card-header\" style=text-align:left;margin:0;><h6 class=card-title style=text-align:left;font-size:12px;><label for=publishedapplication class=\"card-text text-muted\"><strong>Enter Year of Publication and Published Application Number</strong></label></h6><div class=input-group><input type=number placeholder=YYYY style=\"max-width:10rem;padding:0.75rem;font-size:14px;font-family:\'Helvetica\',sans-serif;text-shadow:0.1rem 0.1rem 0.1rem rgba(50,50,50,0.5);\" ng-model=config.IPAYEAR maxlength=4> <input type=text placeholder=\"# PA\" style=\"padding:0.75rem;font-size:14px;font-family:\'Helvetica\',sans-serif;text-shadow:0.1rem 0.1rem 0.1rem rgba(50,50,50,0.5);\" ng-model=config.IPANUM> <button class=\"btn btn-default text-warning fa fa-download fa-2x\" ng-click=\"main.getpublishedapplication(config.IPAYEAR, config.IPANUM)\"></button></div></blockquote><blockquote class=\"bs-callout bs-callout-danger card-header\" style=text-align:left;margin:0;><h6 class=card-title style=text-align:left;font-size:12px;><label class=\"card-text text-muted\">Enter US Application Serial Number</label></h6><div class=input-group><form name=application><input type=text placeholder=\"Application #\" ng-model=config.appnum style=\"padding:0.75rem;font-size:14px;font-family:\'Helvetica\',sans-serif;text-shadow:0.1rem 0.1rem 0.1rem rgba(50,50,50,0.5);\" ng-pattern=\\d+||\\d\\d\\/\\d\\d\\d\\,\\d\\d\\d ng-blur=main.remotezip(config.appnum)> <button class=\"btn btn-default text-danger fa fa-2x fa-file-zip-o right\" ng-click=\"main.getfilehistory(config.appnum,\'reedtech\')\" uib-tooltip=\"DOWNLOAD FROM REEDTECH\" tooltip-placement=top title=\"DOWNLOAD FILE HISTORY FROM REEDTECH\" tooltip-animation=true></button> <button class=\"btn btn-default text-danger fa fa-2x fa-file-zip-o right\" ng-click=\"main.getfilehistory(config.appnum,\'google\')\" uib-tooltip=\"DOWNLOAD FROM GOOGLE\" tooltip-placement=top title=\"DOWNLOAD FILE HISTORY FROM GOOGLE\" tooltip-animation=true></button></form></div></blockquote><pre ng-if=main.remoteresp ng-bind=main.remoteresp class=\"card card-fancy card-block\"></pre></div><div class=panel-footer></div></div>");
$templateCache.put("{widgetsPath}/getphd/src/phd/step-2.html","<div class=\"card card-warning\" style=margin:0.5rem;><div class=card-header><h6 class=card-title>+PhD Step 2 - Download Image File Wrapper</h6></div><div class=card-text><input type=text placeholder=\"Application #\" ng-model=config.appnum><div class=row><a class=\"btn btn-warning fa fa-download\" href=https://storage.googleapis.com/uspto-pair/applications/{{config.appnum}}.zip target=_blank data-toggle=popover data-placement=bottom title=\"DOWNLOAD FROM GOOGLE\" data-content data-animation=true data-trigger=hover style=color:white; onclick=\"window.open(this.href, \'\', \'resizable=no,status=no,location=no,toolbar=no,menubar=no,fullscreen=no,scrollbars=no,dependent=yes,width=400,left=150,height=300,top=150\'); return false;\" ng-click=\"main.remotezip(config.appnum, this.href)\">from Google</a> <a class=\"btn btn-warning fa fa-download\" href=https://patents.reedtech.com/downloads/pair/{{config.appnum}}.zip target=_blank data-toggle=popover data-placement=bottom title=\"DOWNLOAD FROM REEDTECH\" data-content data-animation=true data-trigger=hover style=color:white; onclick=\"window.open(this.href, \'\', \'resizable=no,status=no,location=no,toolbar=no,menubar=no,fullscreen=no,scrollbars=no,dependent=yes,width=400,left=150,height=300,top=150\'); return false;\" ng-click=\"main.remotezip(config.appnum, this.href)\">from ReedTech</a></div></div></div>");
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
                                  {cid:n+10,styleClass:'col-sm-6',widgets:[{config:{height: "30em",url: roarevent.media || 'http://www.google.com'},title:roarevent.title || 'title',titleTemplateUrl:'{widgetsPath}/testwidget/src/title.html',type:'iframe',wid:n+100,styleClass:roarevent.styleClass || 'btn-dark'}]},
                                  {cid:n+1000,styleClass:'col-sm-6',widgets:[{config:{id:'PROMISE'},title:roarevent.title || 'title',titleTemplateUrl:'{widgetsPath}/testwidget/src/title.html',type:'ckwidget', wid:n+15,styleClass:roarevent.styleClass || 'btn-dark'}]}
                              ]}
                          ];
                         roarevent.structure = "6-6";
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
                                  {cid:n+10,styleClass:'col-sm-3',widgets:[{config:{height: "30em",url: roarevent.media || 'http://www.google.com'},title:roarevent.title || 'title',titleTemplateUrl:'{widgetsPath}/testwidget/src/title.html',type:'iframe',wid:n+100,styleClass:roarevent.styleClass || 'btn-dark'}]},
                                  {cid:n+1000,styleClass:'col-sm-9',widgets:[{config:{id:'PROMISE'},title:roarevent.title || 'title',titleTemplateUrl:'{widgetsPath}/testwidget/src/title.html',type:'ckwidget', wid:n+15,styleClass:roarevent.styleClass || 'btn-dark'}]}
                              ]}
                          ];
                         roarevent.structure = "3-9";
                         return deferred.resolve(roarevent);
                        }
               
                          
                         };
             };
         
     }])
     .factory('$roarmap', ['$stateParams', 'Matter', 'Collection', 'ROARevent', 'ROARevents', 'Collections', '$mocks', '$timeout', 'OWNERSHIPDOCS', 'ARTDOCS', 'MERITSDOCS', 'DOCNAMES', 'PETDOCCODES', 'NOADOCCODES', 'INTVDOCCODES', 'PTODOCCODES', 'APPDOCCODES', '$q', 'PHD', '$log', 'FIREBASE_URL','filepickerService','$location','$ACTIVEROAR','$dashboards','CLAIMDOCS','ckstarter','ckender','ckheader',
         function($stateParams, Matter, Collection, ROARevent, ROARevents, Collections, $mocks, $timeout, OWNERSHIPDOCS, ARTDOCS, MERITSDOCS, DOCNAMES, PETDOCCODES, NOADOCCODES, INTVDOCCODES, PTODOCCODES, APPDOCCODES, $q, PHD, $log, FIREBASE_URL, filepickerService, $location,$ACTIVEROAR,$dashboards, CLAIMDOCS, ckstarter,ckender,ckheader) {
             return function(files, phd, main) {








                 phd.roarmap = {
                     collections: [],
                     roarlist: []
               };
                 phd.roarlist = {};
                 var deferred = $q.defer();


               
                 var matter = Matter($stateParams.matterId, $stateParams.groupId);
                 var collections = Collections();
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
                         
                         if ($location.host() === 'localhost') {
                           roarevent.selflink = '/files/public/uspto/' + appnumsubstring + '/' + appnumsubstring + '-image_file_wrapper/' + filename;
                           roarevent.media = roarevent.selflink;
                          //  roarevent.media = '/files/viewer/web/viewer.html?file=%2Ffiles/public/uspto/' + appnumsubstring + '/' + appnumsubstring + '-image_file_wrapper/' + filename;
                         } else {
                           roarevent.selflink = 'https://lexlab.io/files/public/uspto/' + appnumsubstring + '/' + appnumsubstring + '-image_file_wrapper/' + filename;
                           roarevent.media = roarevent.selflink;
                          //  roarevent.media = 'https://lexlab.io/files/public/viewer/web/viewer.html?file=%2Ffiles/public/uspto/' + appnumsubstring + '/' + appnumsubstring + '-image_file_wrapper/' + filename;
                         }
                         roarevent.description = file['Document Description'] || null;
                         roarevent.filename = file['Filename'] || null;
                         roarevent.collections = [];
                         roarevent.Application = appnumsubstring || null;
                         roarevent.date = appdatesubstring || null;
                         roarevent.rid = phd.imagefile.indexOf(file);
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
                     
                       
                       
                       
                        var wraphead = "<!DOCTYPE html><html><head><title></title><link href=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.2/css/bootstrap.min.css\" rel= \"stylesheet\" /><link href=\"https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css\" rel=\"stylesheet\"/><link href=\"//lexlab.io/llp_core/dist/app.full.min.css\" rel= \"stylesheet \" /><link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/tether-select/1.1.1/css/select-theme-default.css\"/><script src= \"https://code.jquery.com/jquery-2.2.0.min.js \"></script><script src= \"https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.16/d3.min.js \"></script><script src=\"https://cdnjs.cloudflare.com/ajax/libs/Chart.js/1.0.2/Chart.min.js\"></script><script src=\"https://cdnjs.cloudflare.com/ajax/libs/tether/1.2.0/js/tether.min.js\"></script><script src=\"https://cdnjs.cloudflare.com/ajax/libs/tether-select/1.1.1/js/select.min.js\"></script><script src= \"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.2/js/bootstrap.min.js \"></script><base href= \"/ \" target= \"fframe \" /></head><body class= \"dark-bg \"><div class= \"container-fluid \"><div class= \"row \"><div class= \"col-xs-12 \"><div class= \"card card-block \">";
                        var wraptail ="</div></div></div></div><footer class= \"navbar-fixed-bottom \"><p style= \"padding-left:30px;margin-left:30px;text-indent:20px; \">&nbsp;&nbsp;&nbsp;&nbsp;CONTAINS MATERIAL SUBJECT TO PROTECTIVE ORDER</p></footer></body></html>";
                        var apptemplate =  '<div class="container-fluid two-col-right">' +
            '<div class="row two-col-right">' +
            '<div class="col-sm-9 col-main"><div class="bs-callout bs-callout-Applicant"><h4>'+ roarevent.title+'</h4><p>Filed '+roardate+'</p><cite>'+roarevent.filename+'&nbsp;&nbsp;<a href="'+roarevent.media+'" target="fframe"><i class="fa fa-external-link"></i></a></cite></div></div>' +
            '<div class="col-sm-3 col-sidebar"><p><img src="https://placehold.it/250x208/4682b4/fff/&text='+ roarevent.rid + '" class="img img-responsive img-shadow"/></p></div>' +
            '</div>' +
            '</div>';
                     var ptotemplate = '<div class="container-fluid two-col-left">' +
            '<div class="row two-col-left">' +
            '<div class="col-md-3 col-sidebar"><p><img src="https://placehold.it/250x208/640002/fff/&text='+ roarevent.rid + '" class="img img-responsive img-shadow"/></p></div>' +
            '<div class="col-md-9 col-main"><div class="bs-callout bs-callout-PTO bs-callout-reverse"><h4>'+ roarevent.title + '</h4><p>Filed '+roardate+'</p><cite>'+roarevent.filename+'&nbsp;&nbsp;<a href="'+roarevent.media+'" target="fframe"><i class="fa fa-external-link"></i></a></cite></div></div>' +
            '</div>' +
            '</div>';
                    var noatemplate = '<div class="container-fluid two-col-left">' +
            '<div class="row two-col-left">' +
            '<div class="col-md-3 col-sidebar"><p><img src="https://placehold.it/250x208/7c994f/fff/&text='+roarevent.rid+'" class="img img-responsive img-shadow"/></p></div>' +
            '<div class="col-md-9 col-main"><div class="bs-callout bs-callout-NOA bs-callout-reverse"><h4>' + roarevent.title + '</h4><p>Filed '+roardate+'</p><cite>'+roarevent.filename+'&nbsp;&nbsp;<a href="'+roarevent.media+'" target="fframe"><i class="fa fa-external-link"></i></a></cite></div></div>' +
            '</div>' +
            '</div>';
                    var petitiontemplate = '<div class="container-fluid two-col-right">' +
            '<div class="row two-col-right">' +
            '<div class="col-sm-9 col-main"><div class="bs-callout bs-callout-Petition"><h4>'+ roarevent.title + '</h4><p>Filed '+roardate+'</p><cite>'+roarevent.filename+'&nbsp;&nbsp;<a href="'+roarevent.media+'" target="fframe"><i class="fa fa-external-link"></i></a></cite></div></div>' +
            '<div class="col-sm-3 col-sidebar"><p><img src="https://placehold.it/250x208/b48200/fff/&text='+roarevent.rid+'" class="img img-responsive img-shadow"/></p></div>' +
            '</div>' +
            '</div>';
             var interviewtemplate = '<div class="container-fluid two-col-right">' +
            '<div class="row two-col-right">' +
            '<div class="col-sm-9 col-main"><div class="bs-callout bs-callout-Interview"><h4>'+ roarevent.title + '</h4><p>Filed '+roardate+'</p><cite>'+roarevent.filename+'&nbsp;&nbsp;<a href="'+roarevent.media+'" target="fframe"><i class="fa fa-external-link"></i></a></cite></div></div>' +
            '<div class="col-sm-3 col-sidebar"><p><img src="https://placehold.it/250x208/&text='+roarevent.rid+'" class="img img-responsive img-shadow"/></p></div>' +
            '</div>' +
            '</div>';
            
                   
                     
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
                         

                          // filepicker.storeUrl(roarevent.selflink,
                          //   { filename: roarevent.filename },
                          //   function (Blob) {
                          //     filepicker.convert(
                          //       Blob,
                          //       { format: 'txt' },
                          //       function (new_Blob) {
                          //         roarevent.txt = new_Blob.url;
                                  
                                  //alertify.success('text file added for' + roarevent.title);
                                  collections.$add(roarevent).then(function(ref) {
                                        var id = ref.key();

                                        ref.update({
                                            id: id,

                                            timestamp: Firebase.ServerValue.TIMESTAMP
                                        });
                                          ref.child('rows').child('0').child('columns').child('1').child('widgets').child('0').child('config').child('id').set(id);
                                          //p.filelist.push(id);
                                          //phdref.child('roarmap').child('roarlist').push(id);
                                          //roarmap.roarevents.push(id);  
                                          phd.roarmap.roarlist[id] = id;
                                          allref.child('roarlist').child(id).set(id);
                                              
                                          
                                        angular.forEach(MERITSDOCS, function(code, key) {
                                            if (roarevent.doccode === code) {
                                              
                                                //p.meritslist.push(id);
                                               // dashboardsref.child('roarlist').push(id);
                                                
                                                meritsref.child('roarlist').child(id).set(id);
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
                          main.progresstwo++;  
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
                              description: 'for US ' + phd.application['Patent Number'],
                              styleClass: options.styleClass,
                              icon: options.icon,
                              app: phd.application['Application Number'],
                              content_type: 'collection',
                              /*titleTemplateUrl: '/llp_core/modules/roarmap/directive/roargrid/roargrid-title.html',*/
                              rows:[{styleClass:'row slate',columns:[{cid:n+10,styleClass:'col-sm-12',widgets:[{type:'pagebuilder',title: options.rid + ' - ' + 'USSN ' + phd.application['Application Number'],styleClass: options.styleClass || 'btn-dark',config:{id:'PROMISE',url:'/llp_core/modules/roarmap/directive/roargrid/roargrid.html'}}]}]}]
                              
                          };
                        return binder;
                     };
                   var phdall = { rid: 'PHD1', title: 'ALL', styleClass: 'NOA', icon: 'fa-legal' },
                     phdmerits = { rid: 'PHD2', title: 'MERITS', styleClass: 'PTO', icon: 'fa-balance-scale' },
                     phdart = { rid: 'PHD3', title: 'ART', styleClass: 'Petition', icon: 'fa-leaf' },
                     phdclaims = { rid: 'PHD4', title: 'CLAIMS', styleClass: 'Applicant', icon: 'fa-sitemap'};
                     var groupids = [];  
                     var groups = { all: phdall, merits: phdmerits, art: phdart, claims: phdclaims };
                     angular.forEach(groups, function (group, key) {
                       collections.$add(new Binder(group)).then(function (ref) {
                         var id = ref.key();
                         ref.update({
                           id: id,
                           timestamp: Firebase.ServerValue.TIMESTAMP
                         });
                         ref.child('rows').child('0').child('columns').child('0').child('widgets').child('0').child('config').child('id').set(id);
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
                      }, 1000);
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
            collections.$add(patent).then(function (ref) {
              var id = ref.key();
              ref.update({
                id: id,
                timestamp: Firebase.ServerValue.TIMESTAMP
              });
              ref.child('rows').child('0').child('columns').child('1').child('widgets').child('0').child('config').child('id').set(id);
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
            // for (var i = zip.files.length - 1; i >= 0; i--) {
            //     files.pdffiles.push({
            //         label: zip.files[i].name,
            //         file: zip.files[i]

            //     });
               
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

    function extractpdf(zipfile, appnum, main) {
        return unzip(zipfile, appnum, main);
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

    .controller("DropFilesController", ['$controller', 'extract', '$scope',  '$timeout', '$rootScope','FileUploader','toastr',
        function ($controller, extract, $scope, $timeout, $rootScope, FileUploader, toastr) {
            var drop = this;
          
       

            drop.file = {};
            drop.dropFiles = function (files) {
              console.log('files.files[0]', files.files[0]);
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
              $scope.$on('UPLOADCOMPLETE', function (event) {
                $scope.$parent.main.handleFiles(files.files[0]);
              });


             
            };
        }
    ])
})(window);