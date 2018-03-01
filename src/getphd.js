'use strict';

var app = angular.module('adf.widget.getphd', ['adf.provider',
    'LocalStorageModule', 'firebase', 'xeditable', 'ui.tree', 'ngAnimate', 'ngAnnotateText', 'ngDialog', 'ngSanitize', 'toastr', 'mentio', 'diff', 'angularCSS', 'checklist-model', 'angular-md5', 'angular.filter', 'ngFileUpload', 'angularFileUpload', 'pageslide-directive'
  ]).config(function(dashboardProvider, localStorageServiceProvider) {

    localStorageServiceProvider.setPrefix('adf.getphd');

    dashboardProvider
      .widget('website', {
        title: 'Web Report',
        description: 'configure the collection shell',
        templateUrl: '{widgetsPath}/getphd/src/webdata.html',
        icon: 'fa-globe',
        iconurl: '/llp_core/img/lexlab.svg',
        styleClass: 'NOA',
        frameless: false,
        reload: true,
        controller: 'MetadataController',
        controllerAs: 'meta',
        edit: {
          templateUrl: '{widgetsPath}/getphd/src/webdataedit.html',
          controller: 'MetadataController',
          controllerAs: 'web',
          modalSize: 'lg',
          reload: true
        }
      })
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
      .widget('report', {
        title: 'Report',
        description: 'filehistory report ',
        templateUrl: '{widgetsPath}/getphd/src/report.html',
        icon: 'fa-code',
        iconurl: '/llp_core/img/lexlab.svg',
        styleClass: 'info',
        frameless: false,
        reload: true,
        controller: 'RepoController',
        controllerAs: 'report'

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


      })
      .widget('roartable', {
        title: 'ROARtable',
        description: 'ROARMAP in tabular form',
        templateUrl: '{widgetsPath}/getphd/src/roartable.html',
        controller: 'RoartableCtrl',
        controllerAs: 'roartable',
        frameless: false,
        reload: false,
        icon: 'fa-ge',
        iconurl: 'img/logolong',
        styleClass: 'primary panel panet-primary',
        edit: {
          templateUrl: '{widgetsPath}/getphd/src/roartableedit.html',
          controller: 'RoartableCtrl',
          controllerAs: 'roartable',
          modalsize: 'lg',
          reload: true
        }
      });

  })
  .controller('RoartableCtrl', [function() {}])
  .directive('fileUploadDirective', [function() {
    return {
      restrict: 'EA',
      templateUrl: '{widgetsPath}/getphd/src/fileuploaddirective.html',
      controller: 'FileUploadDirectiveCtrl',
      link: function($scope, $elem, $attr, $ctrl) {

      }
    }
  }])
  .controller('FileUploadDirectiveCtrl', ['FileUploader', '$scope', function(FileUploader, $scope) {
    var main = this;
    var uploader = $scope.uploader = new FileUploader({
      url: '/upload' || './upload',
      autoUpload: true,
      removeAfterUpload: true
    });

    // FILTERS
    /*
                uploader.filters.push({
                    name: 'customFilter',
                    fn: function(item /*{File|FileLikeObject}*, options) {
                        var filename = item.filename || item.name;

                        return (filename.indexOf('.zip') > -1 && filename.indexOf('(') == -1 && filename.indexOf(' ') == -1);
                    }
                });
    */
    // CALLBACKS

    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
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

      if (progress <= 40) {
        main.progresstype = 'danger';
      } else if (progress > 40 && progress < 66) {
        main.progresstype = 'warning';
      } else if (progress > 97) {
        main.progresstype = 'success';
      } else {
        main.progresstype = 'info';
      }
      console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function(progress) {
      console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
      console.info('onSuccessItem', fileItem, response, status, headers);
      alertify.success(response);
      alertify.success('File uploaded!');

      $rootScope.$broadcast('UPLOADCOMPLETE', response);
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
      alertify.success(response);
      $rootScope.$broadcast('UPLOADCOMPLETE');

    };
    uploader.onCompleteAll = function() {
      console.info('onCompleteAll');
      $rootScope.$broadcast('UPLOADCOMPLETE');
    };

    console.info('uploader', uploader);
    //main.progressbarfn = progressfunction(length);

    function progressfunction(length) {
      main.n = 0;
      main.progresstwo = 0;
      main.progressdisplay = 1;
      main.extractedfiles = length;
      $interval(function() {
        main.progressdisplay++;
      }, 200, length);


    };
  }])
  .controller('MainCtrl', ['Collection', 'extract', 'extractzip', 'fileReader', '$http', 'parseTSV', '$roarmap', '$q', '$scope', 'PHD', 'localStorageService', 'extractpdf', '$patentsearch', '$log', 'FileUploader', '$publish', '$pdftotxt', '$timeout', 'toastr', '$rootScope', '$stateParams', '$location', '$ACTIVEROAR', '$dashboards', '$interval', '$compile', '$templateCache', '$window', '$document', '$filter', 'ckstarter', 'ckender', '$firequeue', '$state',
    function(Collection, extract, extractzip, fileReader, $http, parseTSV, $roarmap, $q, $scope, PHD, localStorageService, extractpdf, $patentsearch, $log, FileUploader, $publish, $pdftotxt, $timeout, toastr, $rootScope, $stateParams, $location, $ACTIVEROAR, $dashboards, $interval, $compile, $templateCache, $window, $document, $filter, ckstarter, ckender, $firequeue, $state) {
      var main = this;
      //main.size = 'lg';
      $scope.treeFilter = $filter('uiTreeFilter');

      $scope.availableFields = ['title', 'text'];
      $scope.supportedFields = ['title', 'text'];
      $scope.toggleSupport = function(propertyName) {
        return $scope.supportedFields.indexOf(propertyName) > -1 ?
          $scope.supportedFields.splice($scope.supportedFields.indexOf(propertyName), 1) :
          $scope.supportedFields.push(propertyName);
      };
      $scope.collapsereport = false;
      main.collapse = function() {
        $scope.collapsereport = !$scope.collapsereport;
      };
      var config = $scope.$parent.config || $scope.$parent.$parent.config;
      $scope.config = config;
      var PHD = Collection(config.id) || Collection(config.appnum);
      PHD.$loaded().then(function(phd) {
        phd.$bindTo($scope, 'phd');
        if (angular.isUndefined(phd.file)) {
          main.showupload = true;
        } else {
          main.showupload = false;

        }

      });

      var col = Collection(config.appnum || config.id);
      $scope.application = col;
      main.$ACTIVEROAR = $ACTIVEROAR;
      main.tabs = [{
        isActive: true,
        disabled: false
      }, {
        isActive: false,
        disabled: false
      }, {
        isActive: false,
        disabled: false
      }];

      $scope.export2collection = function(eventID) {
        var projectId = $stateParams.pId;
        var out = Collection(projectId);
        out.$loaded().then(function(output) {
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
      $scope.publish = function(phd) {
        angular.forEach(phd.roarmap.collections, function(col, key) {
          $scope.export2collection(col);
          $scope.export2collection(key);
        });
        $scope.export2collection(config.id);
        $publish(config.id, $scope.phd).then(function(url) {
          alertify.success('link to post:' + url);
        });
      };

      var opts = {
        header: true,
        skipEmptyLines: true
      };
      var uploader = $scope.uploader = new FileUploader({
        url: '/upload' || './upload',
        autoUpload: true,
        removeAfterUpload: true
      });

      // FILTERS

      uploader.filters.push({
        name: 'customFilter',
        fn: function(item /*{File|FileLikeObject}*/ , options) {
          var filename = item.filename || item.name;

          return (filename.indexOf('.zip') > -1 && filename.indexOf('(') == -1 && filename.indexOf(' ') == -1);
        }
      });

      // CALLBACKS

      uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
        alertify.alert('The file\'s name must end with ".zip" and consist only of numbers');
        this.queue = null;
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

        if (progress <= 40) {
          main.progresstype = 'danger';
        } else if (progress > 40 && progress < 66) {
          main.progresstype = 'warning';
        } else if (progress > 97) {
          main.progresstype = 'success';
        } else {
          main.progresstype = 'info';
        }
        console.info('onProgressItem', fileItem, progress);
      };
      uploader.onProgressAll = function(progress) {
        console.info('onProgressAll', progress);
      };
      uploader.onSuccessItem = function(fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
        alertify.success(response);
        alertify.success('File uploaded!');

        $rootScope.$broadcast('UPLOADCOMPLETE', response);
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
        alertify.success(response);
        $rootScope.$broadcast('UPLOADCOMPLETE');

      };
      uploader.onCompleteAll = function() {
        console.info('onCompleteAll');
        $rootScope.$broadcast('UPLOADCOMPLETE');
      };

      console.info('uploader', uploader);
      //main.progressbarfn = progressfunction(length);

      function progressfunction(length) {
        main.n = 0;
        main.progresstwo = 0;
        main.progressdisplay = 1;
        main.extractedfiles = length;
        $interval(function() {
          main.progressdisplay++;
        }, 200, length);


      };
      main.treeFilter = $filter('uiTreeFilter');
      main.toggle = function() {
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

      main.parse = function(files) {

        var deffered = $q.defer();
        angular.forEach(files, function(file, key) {
          try {
            //main.post(file);
          } catch (ex) {
            $log.error(ex);
          } finally {
            if (file.label === 'imagefile') {
              main.phd.imagefile = parseTSV(file.file, opts);
              main.progresstwo++;
            } else if (file.label === 'application') {
              var outerarray = parseTSV(file.file, {
                skipEmptyLines: true
              });

              var newobj = {};
              angular.forEach(outerarray, function(innerarray, key) {
                if (innerarray[0] == 'Class / Subclass') {
                  newobj['Class Subclass'] = innerarray[1];
                } else {
                  newobj[innerarray[0]] = innerarray[1];
                }



                main.phd.application = newobj;

              });
              main.progresstwo++;



            } else if (file.label === 'attorney') {
              main.phd.attorney = parseTSV(file.file, {
                skipEmptyLines: true
              });
              main.progresstwo++;
            } else if (file.label === 'foreign') {
              main.phd.foreign = parseTSV(file.file, opts, false);
              main.progresstwo++;
            } else if (file.label === 'continuity') {
              main.phd.continuity = parseTSV(file.file, {
                skipEmptyLines: true
              });
              main.progresstwo++;
            } else if (file.label === 'transaction') {
              main.phd.transaction = parseTSV(file.file, opts, false);
              main.progresstwo++;
            } else if (file.label === 'README') {
              main.info = file.file;
              main.progresstwo++;
            } else if (file.label === 'term') {
              main.phd.term = parseTSV(file.file, {
                skipEmptyLines: true
              });
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


      main.getpatentdownload = function(pnum) {
        $(document.createElement('iframe')).attr('name', 'fframe').appendTo('body');
        var patgoog = function(pnum) {
          return $window.open('https://patentimages.storage.googleapis.com/pdfs/US' + pnum + '.pdf', 'fframe', 'resizable=no,status=no,location=no,toolbar=no,menubar=no,fullscreen=no,scrollbars=no,dependent=yes,width=400,left=150,height=30,top=150');
        }
        patgoog(pnum);
      };
      main.getpublishedapplication = function(y, num) {
        $(document.createElement('iframe')).attr('name', 'fframe').appendTo('body');
        $window.open('https://patentimages.storage.googleapis.com/pdfs/US' + y + num + '.pdf', 'fframe', 'resizable=no,status=no,location=no,toolbar=no,menubar=no,fullscreen=no,scrollbars=no,dependent=yes,width=400,left=150,height=30,top=150');
      };
      var wingoog, winreed;
      main.getfilehistory = function(appnum, provider) {

        if (provider === 'reedtech') {
          winreed();
        } else {
          wingoog();
        }

      };
      winreed = function() {
        $window.open('https://patents.reedtech.com/downloads/pairdownload/' + config.appnum + '.zip', '_blank', 'resizable=no,status=no,location=no,toolbar=no,menubar=no,fullscreen=no,scrollbars=no,dependent=yes,width=400,left=150,height=30,top=150');
      };
      wingoog = function() {
        $window.open('https://storage.googleapis.com/uspto-pair/applications/' + config.appnum + '.zip', '_blank', 'resizable=no,status=no,location=no,toolbar=no,menubar=no,fullscreen=no,scrollbars=no,dependent=yes,width=400,left=550,height=30,top=150');
      };
      $scope.winreed = winreed;
      $scope.wingoog = wingoog;
      main.remoteconfig = function(pnum) {
        $('.googlebutton').addClass('fa-spin fa-spinner').removeClass('fa-file-zip-o text-danger');
        $('.reedtechbutton').addClass('fa-spin fa-spinner').removeClass('fa-file-zip-o text-danger');
        $http.get('/getphd/patents/' + pnum).then(function(resp) {
          var data = resp.data;
          //                    config.appnum = resp.data.application_number.slice(3,resp.data.application_number.length).replace('/','').replace(',','');
          if (angular.isUndefined(resp.data.pub)) {
            config.IPANUM = null;
            config.IPAYEAR = null;
          } else {
            config.IPAYEAR = resp.data.pub.slice(2, 6);
            config.IPANUM = resp.data.pub.slice(6, resp.data.pub.length);
          }
          config.appnum = resp.data.application_number.replace(/\D/ig, '');
          $scope.response = resp.data;
          var col = Collection(config.appnum);
          $scope.application = col;
          var googleurl = $location.protocol() + '://' + location.host + '/proxy/storage.googleapis.com/uspto-pair/applications/' + config.appnum + '.zip';
          var reedtechurl = $location.protocol() + '://' + location.host + '/proxy/patents.reedtech.com/downloads/pair/' + config.appnum + '.zip';
          var optionsr = {
            method: 'HEAD',
            url: reedtechurl
          };
          var optionsg = {
            method: 'HEAD',
            url: googleurl
          };
          $scope.info = {
            video: {
              url: './files/public/charm.webm',
              title: 'PhD Tutorial',
              tooltip: 'Click to view tutorial'
            }
          };
          var g = {},
            r = {}
          $http(optionsg).then(function(resp) {
            g.size = resp.headers()['Content-Length'];
            $scope.g = g;
            if (resp.status !== 200) {
              $('.googlebutton').addClass('fa-close text-danger').removeClass('fa-spin fa-spinner fa-file-zip-o');
            } else if (resp.status == 200) {
              $('.googlebutton').addClass('fa-check text-success').removeClass('fa-spin fa-spinner text-danger fa-file-zip-o fa-close');

            }
          });
          $http(optionsr).then(function(resp) {
            r.size = resp.headers()['Content-Length'];
            $scope.r = r;
            if (resp.status !== 200) {
              $('.reedtechbutton').addClass('fa-close text-danger').removeClass('fa-spin fa-spinner fa-file-zip-o');
            } else if (resp.status == 200) {
              $('.reedtechbutton').addClass('fa-check text-success').removeClass('fa-spin fa-spinner text-danger fa-file-zip-o fa-close');

            }
          });

        });

      };
      $scope.showmetadata = $rootScope.showmetadata;

      main.remotezip = function(appnum, sour) {
        main.error = null;
        main.success = null;
        main.showprog = true;
        // main.progress = 0;
        // main.progresstwo = 0;
        // main.extractedfiles = 0;
        $interval(function() {
          $rootScope.$broadcast('BUILDTABS');
        }, 5000);
        config.appnum = appnum;

        $http.get('/getphd/' + appnum + '/' + config.PNUM + '/' + config.IPAYEAR + '/' + config.IPANUM + '/' + config.id + '/' + sour).then(function(resp) {
          $scope.phd = resp.data;
        });
        var fref = Collection(config.id).$ref();
        fref.child('rows').child('0').child('columns').child('0').child('widgets').child('0').child('config').set(config);

      };

      main.format = function(ref) {
        return ref.slice(0, ref.lastIndexOf('-'));
      };

      main.buffer = function(file) {
        main.bufferedfile = file;
      };
      // main.file = {};
      main.success = null;

      main.info = null;
      main.phd = {};
      main.handleFiles = function(file) {
        main.error = null;
        main.success = null;
        main.progresstwo = 0;
        main.extractedfiles = 0;
        //toastr.success('starting extraction...');
        extractpdf(file, config.APPNUM, main)
          .then(function(files) {


            $log.info('Files extracted', files);
            alertify.log('Files extracted');
            //toastr.success('Files extracted');
            main.phd.file = files.tsvfiles;

            main.parse(files.tsvfiles)

              .then(function(parsedfiles) {

                //$log.info('TSV Parsed', parsedfiles);
                alertify.log('TSV Parsed');
                //alertify.log('Building ROARmap...');
                $patentsearch(main.phd.application, config)
                  .then(function(patentobj) {
                    main.phd.patent = patentobj;
                    $roarmap(parsedfiles, main.phd, main)
                      .then(function(groupids) {
                        // $scope.phd.roarmap = roarmap;
                        //$scope.phd.roarlist = roarmap.collections;
                        alertify.success('ROARmap built!');

                        main.finalize(main.phd, groupids);


                      }, function(reason) {
                        console.log(reason.message);
                      });

                  }, function(reason) {
                    console.log(reason.message);
                  });




              }, function(reason) {

                console.log(reason.message);

              });

          }, function(reason) {

            console.log(reason.messsage);
          });


      };
      main.pop = function(link) {
        var divpanel = angular.element('<div/>').attr('class', 'issuedocpanel stacker');
        //var header = angular.element('<h4 class='splash'>' + event.rid + ' - ' + event.name + '<span class='fa fa-close btn btn-xs btn-danger' style='float: right;' onclick='$(this).parent().parent().remove()'></span></h4><h6>' + event.media + '</h6>');
        var roarevent = {
          title: link.slice(link.lastIndexOf('/') + 1, link.length)
        };
        $scope.roarevent = roarevent;
        var header = $templateCache.get('{widgetsPath}/getphd/src/titleTemplate.html');

        var skope = angular.element('<img/>').attr('class', 'img img-responsive img-shadow').attr('src', link);

        angular.element('body').append($compile(divpanel.append(header).append(skope))($scope));
        $('.issuedocpanel').draggable({
          stack: '.stacker',
          handle: 'h4'
        }).resizable();

      };
      $scope.openFullScreen = function(roareventid) {
        // alertify.log(roareventid);
        // Fullscreen.toggleAll();
        if ($scope.fullscreen !== true) {
          $('.issuedocpanel').css({
            'position': 'absolute',
            'top': '0px',
            'left': '0px',
            'bottom': '0px',
            'right': '0px',
            'width': '100%',
            'z-index': '100000'
          });
          $('.fa-expand').addClass('fa-compress').removeClass('fa-expand');
          $scope.fullscreen = true;
        } else {
          $('.issuedocpanel').css({
            'position': 'absolute',
            'top': '6rem',
            'left': '10rem',
            'bottom': '0rem',
            'right': '75rem',
            'width': 'initial',
            'z-index': '9999'
          });

          $('.fa-compress').addClass('fa-expand').removeClass('fa-compress');
          $scope.fullscreen = false;
        }
        //                roar.openmodal(this);
      };
      main.pushtoqueue = function(record) {
        var queue = $firequeue();
        var application = record['Filename'].slice(0, record['Filename'].indexOf('-'));
        var id = record['Filename'].slice(0, record['Filename'].lastIndexOf('-'));
        queue.$add({
          'id': id,
          'name': id,
          'file': '/opt/files/public/uspto/' + application + '/' + application + '-image_file_wrapper/' + record['Filename']
        });

      };
      main.poppatent = function(patent) {
        var divpanel = angular.element('<div/>').attr('class', 'issuedocpanel stacker');
        //var header = angular.element('<h4 class='splash'>' + event.rid + ' - ' + event.name + '<span class='fa fa-close btn btn-xs btn-danger' style='float: right;' onclick='$(this).parent().parent().remove()'></span></h4><h6>' + event.media + '</h6>');
        var roarevent = patent;
        $scope.roarevent = roarevent;
        var header = $templateCache.get('{widgetsPath}/getphd/src/titleTemplate.html');

        var skope = angular.element('<embed/>').attr('class', 'img img-responsive img-shadow').attr('src', patent.media);

        angular.element('body').append($compile(divpanel.append(header).append(skope))($scope));
        $('.issuedocpanel').draggable({
          stack: '.stacker',
          handle: 'h4',
          contain: '#maincontent'
        }).resizable();

      };
      main.popdoc = function(imgrecord) {

        var divpanel = angular.element('<div/>').attr('class', 'issuedocpanel stacker');
        //var header = angular.element('<h4 class="splash">' + event.rid + ' - ' + event.name + '<span class="fa fa-close btn btn-xs btn-danger" style="float: right;" onclick="$(this).parent().parent().remove()"></span></h4><h6>' + event.media + '</h6>');
        var header = $templateCache.get('{widgetsPath}/getphd/src/titleTemplate.html');

        var skope = angular.element('<iframe/>').attr('height', '680px').attr('src', './files/public/uspto/' + $scope.phd.appnum + '/' + $scope.phd.appnum + '-image_file_wrapper/' + imgrecord['Filename']);

        angular.element('body').append($compile(divpanel.append(header).append(skope))($scope));
        $('.issuedocpanel').draggable({
          stack: '.stacker',
          handle: 'h4'
        }).resizable();

      };
      main.finalize = function(phd, groupids) {

        var appnum = angular.copy(phd.application['Application Number']).replace('/', '').replace(',', '').replace(',', '');
        var phdref = Collection($scope.config.id).$ref();
        var dashboards = Collection($stateParams.pageid);
        var dashboardsref = dashboards.$ref();
        var projref = Collection($stateParams.pId).$ref();

        var d = new Date();
        var dd = d.getTime();
        var patentdigest = {
          id: dd,
          title: 'US ' + $filter('number')(phd.patent.id, 0),
          rid: 'PHD5',
          styleClass: 'NOA',
          media: phd.patent.media,
          sortOrder: 5,
          rows: [{
            styleClass: 'leather',
            columns: [{
              cid: dd + 5,
              style: 'col-sm-12',
              widgets: [{
                config: {
                  id: dd,
                  PNUM: phd.patent.id
                },
                type: 'patent',
                styleClass: 'NOA',
                wid: dd + 10
              }]
            }]
          }]
        }
        Collection(dd).$ref().set(patentdigest);

        phd.appnum = appnum;
        phd.media = './patents/US' + phd.patent.id + '/preview';
        phd.title = 'PhD for ' + $filter('number')(phd.patent.id);
        phd.description = 'USSN ' + phd.application['Application Number'];
        phd.styleClass = 'Applicant';
        phd.rid = 'PHD';
        phd.icon = 'fa-balance-scale';

        angular.forEach(groupids, function(id, key) {
          /*-- create internal report pages --*/ // phdref.child('roarlist').child(id).set(id);
          phd.roarlist[id] = id;

        });

        phd.roarlist[dd] = dd;
        phd.content = phd.content + ckender;
        localStorageService.set(phd.application['Application Number'], phd);
        $http.post('/getphd/store/' + appnum, phd);
        phdref.update(phd);

        $rootScope.$broadcast('BUILDTABS');
        alertify.alert('<div class="card-header"><h1 class="card-title">Prosecution History Digest for US ' + phd.patent.number + '</h1></div><div class="card-block"><h6 class="card-text lead"> The file has been parsed by LEO and delivered to you here for review.</h6></div>');
        main.showupload = false;
      };



    }
  ]).directive('ffFileSelect', [function() {

    return {
      restrict: 'A',
      controller: 'MainCtrl',
      controllerAs: 'main',
      bindToController: true,
      scope: false,
      link: function($scope, el, attr, ctrl) {
        var main = ctrl;
        el.on('change', function(e) {

          main.file = (e.srcElement || e.target).files[0];
          main.getFile();
        });

      }

    };
  }])
  .factory('$patentsearch', ['$q', 'filepickerService', '$http', '$document', 'ckstarter', 'ckender', '$compile', '$templateCache', '$rootScope', function($q, filepickerService, $http, $document, ckstarter, ckender, $compile, $templateCache, $rootScope) {

    return function(phdobj, config) {
      var deferred = $q.defer();
      if (config.PNUM && config.PNUM > 0) {
        searchforpatent(phdobj, config.PNUM);
      } else if (config.IPANUM) {
        searchforpatent(phdobj, config.IPAYEAR + config.IPANUM);
      }
      return deferred.promise;

      function searchforpatent(phdobj, pnum) {
        var patentnumber = pnum || angular.copy(phdobj.application['Patent Number']).replace(',', '').replace(',', '');
        //var applicationnumber = phdobj['Appliction Number'];
        var pdfstorageuri = 'https://patentimages.storage.googleapis.com/pdfs/US' + patentnumber + '.pdf';
        // var patent = {
        //           number: patentnumber,
        //           media: pdfstorageuri,
        //           id: pnum,
        //           pub:config.IPAYEAR + config.IPANUM,
        //           rid:'P1',
        //           styleClass: 'NOA'
        //         };
        //         return deferred.resolve(patent);
        // var patent = {
        //   number: patentnumber,
        //   media: pdfstorageuri
        // };

        var googlepage = function(patentnumber) {
          filepicker.storeUrl(
            'https://www.google.com/patents/US' + patentnumber, {},
            function(Blob) {
              return googlepagetext(Blob);

            });
        };
        var googlepagetext = function(Blob) {
          filepicker.convert(
            Blob, {
              format: 'txt'
            },
            function(new_Blob) {
              return patent.googletext = new_Blob.url;
            });
        };


        // filepicker.storeUrl(
        //   pdfstorageuri.toString(),
        //   { filename: 'US' + patentnumber + '.pdf' },
        //   function (Blob) {

        $http.get('/getphd/patents/' + patentnumber).then(function(resp) {
          var patent = resp.data;
          patent.number = patentnumber;
          patent.media = './files/public/uspto/patents/' + patentnumber + '/' + patentnumber + '.pdf';
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
            '<div class="col-xs-4 col-sidebar"><a pop="true" src="./patents/US' + patent.number + '/preview"><img src="./patents/US' + patent.number + '/preview" class="img img-responsive img-shadow"/></a></div>' +
            '<div class="col-xs-8 col-main"><div class="bs-callout bs-callout-NOA bs-callout-reverse"><h4>' + patent.title + '</h4><p>Filed ' + roardate + '</p><p>' + patent.abstract + '</p><cite>' + patent.filename + '&nbsp;&nbsp;<a pop="true" href="' + patent.media + '" target="fframe"><i class="fa fa-external-link"></i></a></cite></div></div>' +
            '</div>' +
            '</div>';
          var wraphead = ckstarter;

          var wraptail = ckender;
          var contenttemplate = '<p class="card-text">' + patent.text + '</p>';
          var poodle = angular.element(noatemplate);
          angular.forEach(patent.drawings, function(drawingurl, key) {
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
        //});
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
  .factory('$pdftotxt', ['$q', 'filepickerService', 'Collection', function($q, filepickerService, Collection) {
    return function(phd) {
      var deferred = $q.defer();
      getxt(phd);
      return deferred.promise;

      function getxt(phd) {
        var meritscollectionid = phd.roarmap.collections[1].id || phd.roarmap.collections[1];
        Collection(meritscollectionid).$loaded().then(function(collection) {
          var mlist = collection.roarlist;
          angular.forEach(mlist, function(roarevent, key) {
            Collection(key).$loaded().then(function(roarevent) {
              filepicker.storeUrl(roarevent.selflink, {
                  filename: roarevent.filename
                },
                function(Blob) {
                  filepicker.convert(
                    Blob, {
                      format: 'txt'
                    },
                    function(new_Blob) {
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
  .directive('pop', ['$compile', '$templateCache','Fullscreen','$window','$rootScope', function($compile, $templateCache, Fullscreen, $window, $rootScope) {
    return {
      restrict: 'AC',
      scope: false,
      link: function($scope, $el, $attr, $ctrl) {
        var popdoc = function(e) {
          var classList = 'issuedocpanel panel panel-{{roarevent.styleClass || \'default\'}} stacker';
          var divpanel = angular.element('<div/>').attr('class', classList).css({'position':'absolute', 'top': window.pageYOffset + 50});
          //var header = angular.element('<h4 class="splash">' + event.rid + ' - ' + event.name + '<span class="fa fa-close btn btn-xs btn-danger" style="float: right;" onclick="$(this).parent().parent().remove()"></span></h4><h6>' + event.media + '</h6>');
          var header = $templateCache.get('{widgetsPath}/getphd/src/titleTemplate.html');
          //var header = $('#docheader').html();
          var skope = angular.element('<iframe allowfullscreen uib-collapse="isCollapsed" fullscreen="full" class="panel-body" style="width:100%;height:80vh;z-index:0;" />').attr('height', '80vh').attr('src', $attr.href);
          var scope = $rootScope.$new();
          scope.roarevent = angular.copy($scope.$parent ? ($scope.$parent.roarevent||$scope.$parent.collection) : {});
          
          scope.roarevent ? scope.roarevent.title = $attr.title || $attr.href : scope.roarevent = {'title': $attr.title || $attr.href}

          scope.roarevent.date = $attr.date || null;
          scope.remove = function(){
            return angular.element(divpanel).remove();
          };
          scope.openFullscreen = function(el){
            if (Fullscreen.isEnabled()){
                return scope.full = false;
            }else{
            return scope.full = true;
            }
          };
          scope.openpreview = function(roarevent){
            $window.open(skope.attr('src'))
          };

          angular.element('body').append($compile(divpanel.append(header).append(skope))(scope));
          $(divpanel).draggable({
            stack: '.stacker',
            handle: 'h4'
          }).resizable();
           interact(divpanel).draggable();
            interact('.issuedocpanel').draggable();
          //.on('doubletap', function(event) {
          //   event.preventDefault();
          //   //window.open(event.currentTarget,'_blank');
          //   //event.currentTarget.remove();
          //   //event.currentTarget.classList.remove('rotate');
          //   var a = event.currentTarget.getAttribute('fullscreen');

          //   if (a !== true) { event.currentTarget.setAttribute('fullscreen', true); } else { event.currentTarget.setAttribute('fullscreen', false); }


          // });
          // interact('.issuedocpanel',{ ignoreFrom: '.card'})
          //   .draggable({
          //     onmove: window.dragMoveListener
          // })
          //   .resizable({
          //     preserveAspectRatio: false,
          //     edges: { left: true, right: true, bottom: true, top: false }
          // })
          //   .on('resizemove', function (event) {
          //     var target = event.target,
          //         x = (parseFloat(target.getAttribute('data-x')) || 0),
          //         y = (parseFloat(target.getAttribute('data-y')) || 0);

          // // update the element's style
          //     target.style.width  = event.rect.width + 'px';
          //     target.style.height = event.rect.height + 'px';

          //     // translate when resizing from top or left edges
          //     x += event.deltaRect.left;
          //     y += event.deltaRect.top;

          //     target.style.webkitTransform = target.style.transform =
          //         'translate(' + x + 'px,' + y + 'px)';

          //     target.setAttribute('data-x', x);
          //     target.setAttribute('data-y', y);
          //     //target.textContent = Math.round(event.rect.width) + '×' + Math.round(event.rect.height);
          // }).on('doubletap', function (event) {
          //     event.currentTarget.remove();
          //     //event.currentTarget.classList.remove('rotate');
          //     event.preventDefault();
          // });
          // $('img').on('dblclick', function(e) {
          //     $('.issuedocpanel').remove();
          //     $scope.$destroy();
          // });

        };
        $el.on('click', function(e) {
          
          e.preventDefault();
          popdoc(e);
        });
      }
    };
  }])
.directive('target', ['$compile', '$templateCache','Fullscreen','$window','$rootScope', function($compile, $templateCache, Fullscreen, $window, $rootScope) {
    return {
      restrict: 'A',
      scope: false,
      link: function($scope, $el, $attr, $ctrl) {
        



        var popdoc = function(e) {
          var classList = 'issuedocpanel panel panel-{{roarevent.styleClass || \'default\'}} stacker';
          var divpanel = angular.element('<div/>').attr('class', classList).css({'position':'absolute', 'top': window.pageYOffset + 50});
          //var header = angular.element('<h4 class="splash">' + event.rid + ' - ' + event.name + '<span class="fa fa-close btn btn-xs btn-danger" style="float: right;" onclick="$(this).parent().parent().remove()"></span></h4><h6>' + event.media + '</h6>');
          var header = $templateCache.get('{widgetsPath}/getphd/src/titleTemplate.html');
          //var header = $('#docheader').html();
          var skope = angular.element('<iframe allowfullscreen uib-collapse="isCollapsed" fullscreen="full" class="panel-body" style="width:100%;height:80vh;z-index:0;" />').attr('height', '80vh').attr('src', $attr.href);
          var scope = $rootScope.$new();
          scope.roarevent = angular.copy($scope.$parent.roarevent||$scope.$parent.collection)|| {};
          scope.roarevent.title = $attr.title || $attr.href;

          scope.roarevent.date = $attr.date || null;
          scope.remove = function(){
            return angular.element(divpanel).remove();
          };
          scope.openFullscreen = function(el){
            if (Fullscreen.isEnabled()){
                return scope.full = false;
            }else{
            return scope.full = true;
            }
          };
          scope.openpreview = function(roarevent){
            $window.open(skope.attr('src'))
          };

          angular.element('body').append($compile(divpanel.append(header).append(skope))(scope));
          $(divpanel).draggable({
            stack: '.stacker',
            handle: 'h4'
          }).resizable();
           interact(divpanel).draggable();
            interact('.issuedocpanel').draggable();
          //.on('doubletap', function(event) {
          //   event.preventDefault();
          //   //window.open(event.currentTarget,'_blank');
          //   //event.currentTarget.remove();
          //   //event.currentTarget.classList.remove('rotate');
          //   var a = event.currentTarget.getAttribute('fullscreen');

          //   if (a !== true) { event.currentTarget.setAttribute('fullscreen', true); } else { event.currentTarget.setAttribute('fullscreen', false); }


          // });
          // interact('.issuedocpanel',{ ignoreFrom: '.card'})
          //   .draggable({
          //     onmove: window.dragMoveListener
          // })
          //   .resizable({
          //     preserveAspectRatio: false,
          //     edges: { left: true, right: true, bottom: true, top: false }
          // })
          //   .on('resizemove', function (event) {
          //     var target = event.target,
          //         x = (parseFloat(target.getAttribute('data-x')) || 0),
          //         y = (parseFloat(target.getAttribute('data-y')) || 0);

          // // update the element's style
          //     target.style.width  = event.rect.width + 'px';
          //     target.style.height = event.rect.height + 'px';

          //     // translate when resizing from top or left edges
          //     x += event.deltaRect.left;
          //     y += event.deltaRect.top;

          //     target.style.webkitTransform = target.style.transform =
          //         'translate(' + x + 'px,' + y + 'px)';

          //     target.setAttribute('data-x', x);
          //     target.setAttribute('data-y', y);
          //     //target.textContent = Math.round(event.rect.width) + '×' + Math.round(event.rect.height);
          // }).on('doubletap', function (event) {
          //     event.currentTarget.remove();
          //     //event.currentTarget.classList.remove('rotate');
          //     event.preventDefault();
          // });
          // $('img').on('dblclick', function(e) {
          //     $('.issuedocpanel').remove();
          //     $scope.$destroy();
          // });

        };
        
        $el.on('click', function(e) {
          e.preventDefault();
          switch ($attr.target) {
          case 'pop':
            
            popdoc(e)
            break;
          case '_blank':
            window.open($attr.href, '_blank', false)
          case '_parent':
          case '_top':
          case '_self':
            $window.iFrameElement.setAttribute('src', $attr.href);
            break;
          case 'fframe':
            $('#fframe').attr('src',$attr.href);
          default:
            $('#'+$attr.target).attr('src', $attr.href);
        }
       
        });
      }
    };
  }])
  .directive('uploadQ', ['FileUploader', function(FileUploader) {
    return {
      restrict: 'EA',
      templateUrl: '{widgetsPath}/getphd/src/uploader.html',
      controller: 'AppController',
      controllerAs: 'uploader',
      bindToController: true,
      scope: {
        url: '@'
      },
      link: function($scope, $elem, $attr, $ctrl) {

      }

    };
  }]).controller('AppController', ['$scope', 'FileUploader', '$stateParams', '$roarevent', function($scope, FileUploader, $stateParams, $roarevent) {
    var uploader = $scope.uploader = new FileUploader({
      url: $scope.url || './upload',
      autoUpload: false
    });

    // FILTERS

    uploader.filters.push({
      name: 'customFilter',
      fn: function(item /*{File|FileLikeObject}*/ , options) {
        return this.queue.length < 100;
      }
    });

    // CALLBACKS

    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
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
      alertify.log(response);
      var file = fileItem._file;
      file.url = '/files/uploads/'+file.name;
      file.mimetype = file.type;
      file.styleClass = fileItem.styleClass;
      $roarevent(file, $stateParams.tabid || $stateParams.pageid || $stateParams.pId || $stateParams.matterId);

    };
    uploader.onErrorItem = function(fileItem, response, status, headers) {
      console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function(fileItem, response, status, headers) {
      console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function(fileItem, response, status, headers) {
      console.info('onCompleteItem', fileItem)
      console.info('response', response)
      console.info('status', status)
      console.info('headers', headers);
      
    };
    uploader.onCompleteAll = function() {
      console.info('onCompleteAll');
    };

    console.info('uploader', uploader);
  }])
  .controller('GalleryCarouselController', ['$scope', 'config', 'Collection', '$rootScope', '$ACTIVEROAR', function($scope, config, Collection, $rootScope, $ACTIVEROAR) {
    var gallery = this;
    var config = config;
    $scope.config = config;
    gallery.slides = [];
    if (config.id) {
      Collection(config.id).$loaded().then(function(collection) {
        angular.forEach(collection.roarlist, function(item, key) {
          Collection(item).$loaded().then(function(slide) {
            gallery.slides.push(angular.copy(slide));
          });
        });
      });
    } else {
      Collection($ACTIVEROAR.page).$loaded().then(function(collection) {
        angular.forEach(collection.roarlist, function(item, key) {
          Collection(item).$loaded().then(function(slide) {
            gallery.slides.push(angular.copy(slide));
          });
        });
      });
      gallery.slides.push({
        title: 'DemoSlide',
        media: '/llp_core/img/lexlab.svg'
      })
      gallery.slides.push({
        title: 'PatentPhD',
        media: '/llp_core/img/logolong.png'
      });
    }
  }])
  .controller('GalleryCarousel', ['', function() {}])
  .directive('ngThumb', ['$window', function($window) {
    var helper = {
      support: !!($window.FileReader && $window.CanvasRenderingContext2D),
      isFile: function(item) {
        return angular.isObject(item) && item instanceof $window.File;
      },
      isImage: function(file) {
        var type = '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    };

    return {
      restrict: 'A',
      template: '<canvas/>',
      link: function(scope, element, attributes) {
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
          canvas.attr({
            width: width,
            height: height
          });
          canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
        }
      }
    };
  }])
  .controller('PatentWidgetCtrl', ['$scope', 'config', '$sce', '$http', 'Collection', '$q', '$filter', '$sanitize', '$patentsearch', '$compile', 'PageManager', '$rootScope', '$templateCache',
    function($scope, config, $sce, $http, Collection, $q, $filter, $sanitize, $patentsearch, $compile, PageManager, $rootScope, $templateCache) {
      var p = this;
      p.remoteconfig = function(pnum) {
        $http.get('/getphd/patents/' + pnum).then(function(resp) {
          var data = resp.data;
          //                    config.appnum = resp.data.application_number.slice(3,resp.data.application_number.length).replace('/','').replace(',','');
          if (angular.isUndefined(resp.data.pub)) {
            config.IPANUM = null;
            config.IPAYEAR = null;
          } else {
            config.IPAYEAR = resp.data.pub.slice(2, 6);
            config.IPANUM = resp.data.pub.slice(6, resp.data.pub.length);
          }
          //config.appnum = resp.data.application_number.replace(/\D/ig, '');
          //$scope.patent = resp.data;
        })
      };

      p.getdata = function(input) {
        var deferred = $q.defer();
        $patentsearch(input, config).then(function(patent) {


          return deferred.resolve(patent);
        });
        // $http.get('/getphd/patents/' + input).then(function (resp) {
        //     return deferred.resolve(resp.data);
        // });
        return deferred.promise;
      };
      p.sanitize = $sanitize;

      p.getdigest = function(ref) {
        PageManager.insert(config.id, 'Patent').then(function(someid) {
          var refr = Collection(someid).$ref();
          var po = ref.replace(/[\:us]/ig, '');
          refr.child('rows').child('0').child('columns').child('0').child('widgets').child('0').child('config').child('PNUM').set(po);
          refr.update({
            title: ref
          });
          $rootScope.$broadcast('BUILDTABS');
        });
      };
      var config = $scope.$parent.config || $scope.$parent.$parent.config;
      var collection = Collection(config.id);
      collection.$bindTo($scope, 'collection');
      //$scope.collection = collection;
      $scope.config = config;
      $scope.cupdate = function(c) {
        var ref = collection.$ref();
        ref.child('rows').child('0').child('columns').child('0').child('widgets').child('0').child('config').update(c);
        ref.child('rows').child('0').child('columns').child('0').child('widgets').child('1').update({ type: 'iframe', config: { url: $scope.patent.media } });
        ref.child('rows').child('0').child('columns').child('0').child('widgets').child('2').update({ type: 'ckwidget', config: { id: collection.$id } });

        //if(collection.rid === '-'){
        ref.child('rid').set('π');
        ref.child('media').set($scope.patent.media);
        ref.child('date').set($scope.patent.date);
        //}
      };

      p.configure = function(input) {
        var trop = $filter('strip')(input);
        // config.IPAYEAR = trop.slice(0, 4);
        // config.IPANUM = trop.slice(4, trop.length);


        return trop;
      };
      p.preparescope = function(apdata, pdata) {
        pdata.application_data = apdata;
        $scope.patent = pdata;
        try {
          var back = angular.isDefined(pdata) ? pdata.backward_citations : apdata.backward_citations;
          $templateCache.put('{' + (angular.isDefined(pdata) ? pdata.id : apdata.id) + '}/backtable.html', back.replace(/<a\s(?!pop)/g, '<a pop '));
          p.linker = '{' + (angular.isDefined(pdata) ? pdata.id : apdata.id) + '}/backtable.html';
          var forw = angular.isDefined(pdata) ? pdata.forward_citations || '<h4>Forward Citations</h4>' : apdata.forward_citations || '<h4>Forward Citations</h4>';
          $templateCache.put('{' + (angular.isDefined(pdata) ? pdata.id : apdata.id) + '}/forwtable.html', forw.replace(/<a\s(?!pop)/g, '<a pop '));
          p.linker1 = '{' + (angular.isDefined(pdata) ? pdata.id : apdata.id) + '}/backtable.html';
        } catch (ex) {
          console.log(ex);
        } finally {
          // var desc = pdata.description;




          //   var backs= $compile($sce.trustAsHtml(back.replace(/<a\s(?!pop)/g,'<a pop ')))($scope),
          //   forws= $compile($sce.trustAsHtml(forw.replace(/<a\s(?!pop)/g,'<a pop ')))($scope);
          // angular.element('#comp.backward_citations').append(backs);
          //            angular.element('#comp.forward_citations').append(forws);

          // p.claims = { class: 'super-independent', id: 'claims', text: 'claims', name: 'claims', children: pdata.claims };
          p.showform = false;
          p.showconfig = false;
          //var bc = pdata.backward_citations;

          // $('#backwards').append($compile($sce.trustAsHtml(bc.replace(/href/ig, 'pop href')))($scope));
          //               var fc = pdata.forward_citations;
          //               $('#forwards').append($compile($sce.trustAsHtml(fc.replace(/href/ig, 'pop href')))($scope));
        }

      };
      p.getnew = function(input) {
        try {
          var a = Collection(input).$loaded();
          //            if (a.claims == null)
          //              {throw('error') }
        } catch (ex) {} finally {
          var a = p.getdata(input);

          a.then(function(pdata) {
            if (pdata.pub !== undefined) {
              var trop = p.configure(pdata.pub);
              p.getdata(trop).then(function(apdata) {
                p.preparescope(apdata, pdata);
              });
            } else {
              p.preparescope(null, pdata);
            }
          });
        }
      };

      p.getload = function(input) {
        Collection(input).$loaded().then(function(pdata) {
          if (pdata.pub !== undefined) {


            var trop = p.configure(pdata.pub);
            Collection(trop).$loaded().then(function(apdata) {
              p.preparescope(apdata, pdata);
            });
          } else {
            p.preparescope(null, pdata);
          }
        });
      };
      if (angular.isUndefined(config.PNUM)) {
        p.showconfig = true;
        p.showform = false;
      } else {
        p.getnew(config.PNUM);
      }
      if (config.PNUM) {

        try {
          p.getnew(config.PNUM);
        } catch (ex) {
          var combo = config.IPAYEAR + config.IPANUM;
          // p.getdata(combo);
        } finally {
          alertify.success('loaded');
        }
      } else {
        try {
          var combo = config.IPAYEAR + config.IPANUM;
          p.getnew(combo);
        } catch (ex) {
          var combo = config.IPAYEAR + config.IPANUM;
          p.getdata(combo);
        } finally {
          alertify.success('loaded');
        }
      }

    }
  ])
  .directive('claimtree', function() {
    return {
      restrict: 'E',
      templateUrl: '/getphdwidget/src/phd/claimtree.html',
      scope: {
        tree: '=',
        query: '='
      },
      link: function($scope, $element, $attr) {

      }
    };
  })
  .filter('citationcheck', function() {
    return function(input) {
      var check = function(input) {
        var regex = new RegExp(/\<a\s/ig);
        //var matches = input.match(regex);
        // matches.forEach(function(value, index, arra){
        //     input.replace(regex, '<a pop ');
        // })
        return input.replace(regex, '<a pop ');
      };
      return check(input);
    };
  }).filter('capturelinks', ['$timeout', '$compile', '$sce', '$rootScope', function($timeout, $compile, $sce, $rootScope) {
    return function(input) {
      if (!angular.isUndefined(input) && input !== null) {
        var output = input;
        var replacer = function() {
          return $sce.trustAsHtml($compile(output.replace(/href/mig, 'pop href'))($rootScope.$new()));
        };
        return replacer();
      }
    };
  }]).directive('rejectionset', function() {
    return {
      restrict: 'EA',
      templateUrl: '{widgetsPath}/getphd/src/rejectionset.html',
      scope: {
        set: '='
      },
      link: function($scope, $element, $attr, $ctrl) {

      }
    };
  }).directive('rejection', function() {
    return {
      restrict: 'EA',
      templateUrl: '{widgetsPath}/getphd/src/rejection.html',
      scope: {
        rejection: '='
      },
      link: function($scope, $element, $attr, $ctrl) {

      }
    };
  })


  .controller('MetadataController', function(filepickerService, $firequeue, $rootScope, Collection, config, $scope, $stateParams, Upload, $http, toastr, DOCNAMES) {
    var config = $scope.$parent.config || $scope.$parent.$parent.config;
    $scope.config = config;
    $scope.save = function(config) {
      $scope.config = config;
    };
    var pId = $stateParams.pId;
    var tree = Collection(pId);
    $scope.tree = tree;
    $scope.onSubmit = function(model) {
      Collection(config.id).$save(model);
    };
    var uop = [];
    angular.forEach(DOCNAMES, function(value, key) {
      angular.forEach(value, function(pood, key) {
        var lop = {
          code: key,
          label: key + ' - ' + pood
        };
        uop.push(lop);
      });
    });

    $scope.DOCNAMES = uop;
    $scope.pushtoqueue = function(record) {
      var queue = $firequeue();
      var id = record.id;
      var name = record.filename || record.title;
      var userid = $rootScope.authData.uid;
      queue.$add({
        'id': id,
        'name': name,
        'file': '/opt/files/' + userid + '/' + name
      });

    };
    $scope.importFile = function(roarevent) {

      var bblob = new Blob([roarevent.media, roarevent.content], blob);
      var options = {
        method: 'POST',
        url: '/import',
        data: { url: roarevent.media, name: roarevent.filename || roarevent.title, file: bblob }
      };

      $http(options).then(function(resp) {
        if (angular.isString(resp.data.newurl)) {
          roarevent.media = resp.data.newurl;
          roarevent.$save();
        }
      });

      var blob = {
        url: roarevent.media,
        filename: roarevent.filename,
        mimetype: roarevent.mimetype,
        isWriteable: true,
        size: 100
      };

      Upload.upload({
          url: '/upload/',
          data: {
            file: Blob
          }
        })
        .then(function(resp) {
          dialog.close();
          console.log(resp);
          $scope.pushtoqueue(roarevent);
          console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);



        }, function(resp) {
          console.log('Error status: ' + resp.status);
        }, function(evt) {
          var progress = parseInt(100.0 * evt.loaded / evt.total);
          $scope.progress = progress;
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

          if (progress <= 40) {
            $scope.progresstype = 'danger';
          } else if (progress > 40 && progress < 66) {
            $scope.progresstype = 'warning';
          } else if (progress > 97) {
            $scope.progresstype = 'success';
          } else {
            $scope.progresstype = 'info';
          }

          console.log('progress: ' + progress + '% ' + evt.config.data.file.name);
        });



    };

  }).controller('RepoController', function($scope, $http, $location, Collection) {
    var app = this;
    var arra = [];
    var summaryref = Collection('REPORT');
    $scope.reporter = summaryref;
    var request = { method: 'GET', url: '/report/all' }
    summaryref.$loaded().then(function(rep) {


      angular.forEach($scope.reporter.meta, function(paper, key) {

        paper.id = key;
        arra.push(paper);
      });
      $scope.arra = arra;
    });
    var props = ['total',
      'allowed',
      'new',
      'original',
      'withdrawn',
      'currently',
      'previous',
      'v101',
      'v102',
      'v103',
      'v112'
    ];
    var sum = function(collection, prop) {
      collection.roarlist.forEach(function(v, i, a) {
        Collection(v).$loaded().then(function(roardata) {

        });
      });
    };
    $http(request).then(function(resp) { app.filehistories = resp.data })
    app.dofunction = function(history) {
      var a = history.funconfig;
      var options = {
        method: 'GET',
        url: '/getphd/' + a.APPNUM + '/' + a.PNUM + '/' + a.IPAYEAR + '/' + a.IPANUM + '/' + a.id
      }
      $http(options).then(function(resp) {
        $scope.report = resp.data
      });
    }
  }).directive('claimtreetabhtml', function() {
    return {
      restrict: 'EA',
      templateUrl: '{widgetsPath}/getphd/src/claimtreetab.html',
      scope: {
        config: '='
      },
      link: function($scope, $element, $attr, $ctrl) {}
    }
  }).filter('slide', function() {
    return function(input_html) {
      var input = input_html || '';
      var start = input.slice(input.indexOf('<!--CUTSLIDEHEAD-->') , input.lastIndexOf('<!--CUTSLIDETAIL-->') + 19);
      return start
    }
  }).factory("extract", ["$q", function($q) {
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
  }]).factory("extractpdf", ["$q", function($q) {
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
            return './proxy/'
            //return $location.protocol() + '://' + $location.host() + porter();
        };

        var googleurl = 'storage.googleapis.com/uspto-pair/applications/'+apnum+'.zip';
                    var reedtechurl = 'patents.reedtech.com/downloads/pairdownload/'+apnum+'.zip';
// var down = function(url, callback, encoding){
//         console.log('down');
//         var request = window.open(url, '',function(err,response) {
//             if (encoding){
//                 response.setEncoding(encoding);
//             }
//             console.log(response);
//             var len = parseInt(response.headers['content-length'], 10);
//             var body = "";
//             var cur = 0;
//             var obj = $('.progress');
//             var total = len / 1048576; //1048576 - bytes in  1Megabyte

//             response.on("data", function(chunk) {
//                 body += chunk;
//                 cur += chunk.length;
//                 obj.html( "Downloading " + (100.0 * cur / len).toFixed(2) + "% " + (cur / 1048576).toFixed(2) + " mb\r" + ".<br/> Total size: " + total.toFixed(2) + " mb");
//             });

//             response.on("end", function() {
//                 callback(body);
//                 obj.html("Downloading complete");
//             });

//             request.on("error", function(e){
//                 console.log("Error: " + e.message);
//             });

//         });
//     };
// down(prefix() + googleurl, callback);

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
                                console.log('download', data);
                                callback(data);
                            }
                        });
                      }

                        else{
                            // $('#googlebutton').addClass('fa-check text-success').removeClass('text-danger fa-file-zip-o');
                                                   console.log('download', data.length);

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

var splitzip = function(){
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




    Upload.upload({url: '/upload/', data: {file: Upload.rename(blob, appnum + '.zip')}})
    .then(function (resp) {
            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
            splitzip();


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

};
//callback(data);
        return deferred.promise;
    }

    function extractzip( appnum, main, uploader) {
        return unzip( appnum, main, uploader);

    }

    return extractzip;
}]).directive('metadataViewer', function(Collection){
    return {
        restrict: 'E',
        templateUrl: '{widgetsPath}/getphd/src/metadata.html',
        scope:{},
        link: function($scope,$element,$attr,$ctrl){
            $scope.config = {};
            $scope.config.id = $attr.id;
            var coll = Collection($attr.id).$loaded().then(function(collection){
                $scope.collection = collection;
            })
        }
    }
}).controller('TextController', ['$scope','Collection','config','$stateParams',
  function($scope, Collection, config, $stateParams){
    var config = $scope.$parent.config || $scope.$parent.$parent.config;
    var pId = $stateParams.pId;
    var tree = Collection(pId);
    $scope.tree = tree;
    var roarevent = Collection(config.id);
    roarevent.$bindTo($scope, 'roarevent');
$scope.config = config;


}])
