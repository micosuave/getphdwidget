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

})
  
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
              main.phd.continuity = parseTSV(file.file, { skipEmptyLines: true });
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
      main.pop = function(link){
          var divpanel = angular.element('<div/>').attr('class', 'issuedocpanel stacker');
        //var header = angular.element('<h4 class="splash">' + event.rid + ' - ' + event.name + '<span class="fa fa-close btn btn-xs btn-danger" style="float: right;" onclick="$(this).parent().parent().remove()"></span></h4><h6>' + event.media + '</h6>');
        var roarevent = {title: link.slice(link.lastIndexOf('/')+1, link.length)};
        $scope.roarevent = roarevent;
        var header = $templateCache.get("{widgetsPath}/getphd/src/titleTemplate.html");

        var skope = angular.element('<img/>').attr('class','img img-responsive img-shadow').attr('src', link);

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
      main.poppatent = function(patent){
          var divpanel = angular.element('<div/>').attr('class', 'issuedocpanel stacker');
        //var header = angular.element('<h4 class="splash">' + event.rid + ' - ' + event.name + '<span class="fa fa-close btn btn-xs btn-danger" style="float: right;" onclick="$(this).parent().parent().remove()"></span></h4><h6>' + event.media + '</h6>');
        var roarevent = patent;
        $scope.roarevent = roarevent;
        var header = $templateCache.get("{widgetsPath}/getphd/src/titleTemplate.html");

        var skope = angular.element('<embed/>').attr('class','img img-responsive img-shadow').attr('src', patent.media);

        angular.element('body').append($compile(divpanel.append(header).append(skope))($scope));
        $('.issuedocpanel').draggable({
          stack: '.stacker',
          handle: 'h4'
        }).resizable();

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


        filepicker.storeUrl(
          pdfstorageuri.toString(),
          { filename: 'US' + patentnumber + '.pdf' },
          function (Blob) {
            
           $http.get('/getphd/patents/'+patentnumber).then(function(resp){
            var patent = resp.data;
            patent.number = patentnumber;
            patent.media = Blob.url;
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
