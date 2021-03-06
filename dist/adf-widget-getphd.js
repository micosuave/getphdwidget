(function(window, undefined) {'use strict';


var app = angular.module('adf.widget.getphd', ['adf.provider','llp.extract','llp.parsetsv','roar',
      'LocalStorageModule', 'firebase', 'xeditable', 'ui.tree', 'ngAnimate', 'ngAnnotateText', 'ngDialog', 'ngSanitize', 'pdf', 'toastr', 'mentio', 'diff', 'angularCSS', 'checklist-model', 'angular-md5', 'angular.filter', 'ngFileUpload','angularFileUpload','pageslide-directive'
]).config(["dashboardProvider", "localStorageServiceProvider", function(dashboardProvider, localStorageServiceProvider) {

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

}])
.controller('RoartableCtrl',[function(){}])
.directive('fileUploadDirective',[ function(){
  return {
    restrict: 'EA',
    templateUrl: '{widgetsPath}/getphd/src/fileuploaddirective.html',
    controller: 'FileUploadDirectiveCtrl',
    link: function($scope, $elem, $attr, $ctrl){
      
    }
  }
}])
.controller('FileUploadDirectiveCtrl', ['FileUploader','$scope', function(FileUploader, $scope){
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
.controller('MainCtrl', ['Collection', 'extract', 'extractzip', 'fileReader', '$http', 'parseTSV', '$roarmap', '$q', '$scope', 'PHD', 'localStorageService', 'extractpdf',  '$patentsearch', '$log', 'FileUploader', '$publish', '$pdftotxt', '$timeout', 'toastr', '$rootScope', '$stateParams', '$location', '$ACTIVEROAR', '$dashboards', '$interval', '$compile', '$templateCache', '$window', '$document', '$filter', 'ckstarter', 'ckender', '$firequeue', '$state',
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
                    var reedtechurl = $location.protocol()+ '://' + location.host + '/proxy/patents.reedtech.com/downloads/pair/' + config.appnum + '.zip';
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
                    var g = {}, r = {}
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
                    patent.media = './files/public/uspto/patents/'+patentnumber+'/' +patentnumber+'.pdf';
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
    .directive('pop', ['$compile', '$templateCache', function($compile, $templateCache) {
        return {
            restrict: 'AC',
            scope: true,
            link: function($scope, $el, $attr, $ctrl) {
                var popdoc = function() {

                    var divpanel = angular.element('<div/>').attr('class', 'issuedocpanel stacker panel-'+($attr.styleClass||'panelheadblue'));
                    //var header = angular.element('<h4 class="splash">' + event.rid + ' - ' + event.name + '<span class="fa fa-close btn btn-xs btn-danger" style="float: right;" onclick="$(this).parent().parent().remove()"></span></h4><h6>' + event.media + '</h6>');
                    var header = $templateCache.get('{widgetsPath}/getphd/src/titleTemplate.html');
                    //var header = $('#docheader').html();
                    var skope = angular.element('<iframe allowfullscreen fullscreen="{{full}}" ng-dblclick="full = !full" name="fframe" />').attr('height', '80vh').attr('src', $attr.href);
                    $scope.roarevent = $scope.roarevent || {};
                    $scope.roarevent.title = $attr.title || $attr.href;
                    
                    $scope.roarevent.date = $attr.date || null;
                    

                    angular.element('body').append($compile(divpanel.append(header).append(skope))($scope));
                    $(divpanel).draggable({
                        stack: '.stacker',
                        handle: 'h4'
                    }).resizable();
                    interact(divpanel, {ignoreFrom: '.card',allowFrom:'h4'}).draggable().on('doubletap', function (event) {
                        window.open(event.currentTarget,'_blank');
                        event.currentTarget.remove();
                        //event.currentTarget.classList.remove('rotate');
                        event.preventDefault();
                    });
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
                    popdoc();
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
    }]).controller('AppController', ['$scope', 'FileUploader','$stateParams','$roar', function($scope, FileUploader, $stateParams, $roar) {
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
            console.info('status',status)
            console.info('headers', headers);
        var file = fileItem._file;
            file.url = response[0] || response;
            $roar(file);
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
    .controller('GalleryCarousel', ['', function() {}]).directive('ngThumb', ['$window', function($window) {
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
            p.remoteconfig = function (pnum) {
                $http.get('/getphd/patents/' + pnum).then(function (resp) {
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
            })};

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
                ref.child('rows').child('0').child('columns').child('0').child('widgets').child('1').update({type:'iframe',config:{url: $scope.patent.media}});
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
                try{
                var back = angular.isDefined(pdata) ? pdata.backward_citations : apdata.backward_citations;
                $templateCache.put('{' + (angular.isDefined(pdata) ? pdata.id : apdata.id) + '}/backtable.html', back.replace(/<a\s(?!pop)/g, '<a pop '));
                p.linker = '{' + (angular.isDefined(pdata) ? pdata.id : apdata.id) + '}/backtable.html';
                var forw = angular.isDefined(pdata) ? pdata.forward_citations || '<h4>Forward Citations</h4>' : apdata.forward_citations || '<h4>Forward Citations</h4>';
                $templateCache.put('{' + (angular.isDefined(pdata) ? pdata.id : apdata.id) + '}/forwtable.html', forw.replace(/<a\s(?!pop)/g, '<a pop '));
                p.linker1 = '{' + (angular.isDefined(pdata) ? pdata.id : apdata.id) + '}/backtable.html';
                }catch(ex){
                  console.log(ex);
                }finally{
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
            }else{
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


.controller('MetadataController', ["filepickerService", "$firequeue", "$rootScope", "Collection", "config", "$scope", "$stateParams", "Upload", "$http", "toastr", "DOCNAMES", function(filepickerService, $firequeue, $rootScope, Collection, config, $scope, $stateParams, Upload, $http, toastr, DOCNAMES) {
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

       var bblob = new Blob([roarevent.media, roarevent.content],blob);
       var options = {
         method: 'POST',
         url: '/import',
         data: {url: roarevent.media, name: roarevent.filename ||roarevent.title, file: bblob}
       };

       $http(options).then(function(resp){
              if(angular.isString(resp.data.newurl)){
                roarevent.media = resp.data.newurl;
                roarevent.$save();
              }
       }) ;

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

}]).controller('RepoController', ["$scope", "$http", "$location", "Collection", function ($scope, $http, $location, Collection) {
  var app = this;
var arra = [];
var summaryref = Collection('REPORT');
$scope.reporter = summaryref;
  var request = {method: 'GET',url: '/report/all'}
  summaryref.$loaded().then(function(rep){


angular.forEach($scope.reporter.meta, function(paper, key){

  paper.id = key;
  arra.push(paper);
});
$scope.arra = arra;
});
var  props =['total',
  'allowed',
  'new',
  'original' ,
  'withdrawn',
  'currently',
  'previous',
  'v101',
  'v102',
  'v103',
  'v112'];
var sum = function(collection, prop){
collection.roarlist.forEach(function(v, i , a){
  Collection(v).$loaded().then(function(roardata){

  });
});
};
  $http(request).then(function (resp) { app.filehistories = resp.data })
  app.dofunction = function (history) {
    var a = history.funconfig;
    var options = {
      method: 'GET',
      url: '/getphd/' + a.APPNUM + '/' + a.PNUM + '/' + a.IPAYEAR + '/' + a.IPANUM + '/' + a.id
    }
    $http(options).then(function (resp) {
      $scope.report = resp.data
    });
  }
}]).directive('claimtreetabhtml', function(){
  return {
    restrict: 'EA',
    templateUrl: '{widgetsPath}/getphd/src/claimtreetab.html',
    scope: {
      config: '='
    },
    link: function($scope, $element, $attr, $ctrl) {}
  }
});

angular.module("adf.widget.getphd").run(["$templateCache", function($templateCache) {$templateCache.put("{widgetsPath}/getphd/src/claims.html","<input ng-model=config.PNUM type=number placeholder=\"patent number\" ng-model-options=\"{updateOn: \'blur\'}\"> <button clipboard text={{claims}}>CLAIMS</button> <button clipboard text={{remarks}}>REMARKS</button> <button clipboard text={{rejections}}>REJECTIONS</button><d3historytree patent={{config.PNUM}}></d3historytree><uib-tabset justified=true><uib-tab ng-repeat=\"(key, set) in roarevent.roarlist\" node={{key}} deselect=sortSet(node)><uib-tab-heading><h6 class=card-title>{{::node.title}} {{$index}}</h6><strong class=card-subtitle>{{node.date | date}}</strong><a pop ng-href={{node.media}} class=\"fa fa-external-link showonhover\">{{node.claims.length}}</a></uib-tab-heading><uib-tab-content class=\"card-block card-columns\"><div class=\"col-sm-8 card card-Applicant\" ng-repeat=\"claim in node.claims track by $index\"><label ng-class=\"{\'dependent\':(prent(node.claims[$index]) > -1), \'independent\':(!prent(node.claims[$index]))}\" class=\"display-1 label label-pill node pull-right\" style=padding:10px;position:absolute;right:5px;top:5px;font-size:18px;font-weight:600; colorkey={{statustest(node.claims[$index])}} uib-tooltip={{statustest(node.claims[$index])}} tooltip-triggers=\"mouseenter click\" tooltip-animation=true tooltip-offset=50px tooltip-placement=top>{{num(node.claims[$index])||\'-\'}}</label><textarea class=card-block style=font-size:16px;color:#444; ng-model=node.claims[$index] ng-model-options=\"{updateOn:\'blur\',debounce:{\'blur\':0}}\" cols=100 rows=4 ng-blur=\"checkValid($index, node)\" placeholder=\"XX. Lorem non irure sunt enim consequat.\"></textarea><br><a class=\"fa fa-close text-danger\" ng-click=\"node.claims[$index]=null\" style=align-self:flex-end;></a> <a ng-click=\"addClaim($index, node)\" class=\"text-success fa fa-plus\" style=align-self:center;></a></div></uib-tab-content></uib-tab></uib-tabset>");
$templateCache.put("{widgetsPath}/getphd/src/claimtreetab.html","<blockquote cite=\"{{phd.patent.media || patent.media}}\" style=\"margin: 25px;margin-top:35px;\"><h4><strong ng-bind=tree.title></strong> - <small>{{tree.claim_total}} Claims</small></h4><p ng-bind-html=\"tree.abstract | highlight: query | trustAsHTML\"></p><cite>{{phd.patent.filename || patent.filename}}<a class=\"fa fa-external-link fa-border\" ng-click=\"main.poppatent(phd.patent || patent)\"></a></cite></blockquote><div class=\"row showscroll\" style=\"margin: 5px 5px;overflow-x:scroll;\"><a ng-repeat=\"link in tree.drawings\" ng-href={{link}} pop ng-click=main.pop(link) class=btn style=margin:2px;><img ng-src={{tree.thumbnails[$index]}} class=\"img img-shadow\"></a></div><div class=row><div class=col-sm-6><fieldset class=material><label>Search</label> <input id=patterninput ng-model=query type=search style=margin:10px; ng-model-options=\"{updateOn: \'default blur\',debounce: {\'default\':250,\'blur\':0}}\"><hr></fieldset><a style=position:absolute;right:0;top:4; class=\"btn fa fa-close\" ng-click=\"query = null\"></a><d3pendingtree id=\"a{{ config.PNUM || config.IPAYEAR + config.IPANUM}}\" class={{query}} tree=tree pattern={{query}} patent=\"{{config.PNUM || config.IPAYEAR + config.IPANUM}}\" style=width:500px;height:500px;></d3pendingtree></div><div class=col-sm-6><div id=info></div><div ui-tree=treeOptions><ol ui-tree-nodes max-depth=6 ng-model=tree.claims><li ui-tree-node class=\"card card-block\" ng-repeat=\"node in tree.claims\" ng-include=\"\'claim_renderer.html\'\" style=padding-right:0rem;padding-bottom:0.1rem; ng-hide=\"!treeFilter(node, query, supportedFields) && dim\"></li></ol></div><script type=text/ng-template id=claim_renderer.html><div ui-tree-handle class=\"tree-node tree-node-content\"> <div class=\"tree-node-content flextoprow \" style=\"position:relative;\"> <a class=\"btn btn-xs pull-left\" data-nodrag ng-click=\"toggle(this)\" ng-if=\"node.children && (node.children.length > 0)\"><span class=\"fa \" ng-class=\"{\'fa-chevron-right\': collapsed, \'fa-chevron-down\': !collapsed}\" style=\"color:steelblue;transition:all 0.25s ease;\"></span></a> <!--<input type=\"text\" ng-model=\"node.text\" ng-change=\"node.$save();\" ng-model-options=\"{ updateOn: \'default blur\', debounce: {\'default\': 1000, \'blur\': 0} }\" style=\"padding: 0.5rem;color:#444;\" ng-if=\"config.editable\">--> <!--<a class=\"btn showonhover\" data-nodrag ng-if=\"config.editable\" ng-click=\"remove(this);\"><span class=\"fa fa-close text-danger \"></span></a>--> <!--<a class=\"btn \" data-nodrag ng-if=\"config.editable\" ng-click=\"toc.newsubsection(this)\" style=\"\"><span class=\"fa fa-plus text-success\"></span></a>--> <div ng-bind-html=\"node.text | highlight: query \" ng-class=\"{\'filtered-out\':(!treeFilter(node, query, supportedFields) && dim)}\"></div> <!--<a class=\"gototarget btn\" data-nodrag ui-sref=\"{{parentstate}}.righttab({tabid: node.id})\" style=\"\"> <span ng-if=\"!config.editable\" class=\"pull-left\">{{node.text}}</span><i style=\"position:absolute;right:0;\">&nbsp;</i></a>--> </div> </div> <ol ui-tree-nodes=\"\" ng-model=\"node.children\" ng-class=\"{\'hidden\': collapsed}\" style=\"\"> <li class=\"card card-block img-shadow\" ng-repeat=\"node in node.children\" ui-tree-node ng-include=\"\'claim_renderer.html\'\" style=\"padding-right:0rem;padding-bottom:0.1rem;padding-left:5px;\" ng-hide=\"!treeFilter(node, query, supportedFields) && dim\" > </li> </ol></script></div></div>");
$templateCache.put("{widgetsPath}/getphd/src/edit.html","<form role=form ng-submit=collection.$save()><fieldset class=\"material Applicant\"><input type=text placeholder=1234567 ng-model=config.PNUM ng-blur=p.remoteconfig(config.PNUM);cupdate(config);><hr><label>Enter a Patent Number</label></fieldset><br><fieldset class=\"material Petition\"><input type=text placeholder=YYYY ng-model=config.IPAYEAR><hr><label>Enter a Published Patent Application YEAR</label></fieldset><fieldset class=\"material Petition\"><input type=text placeholder=1234567 ng-model=config.IPANUM ng-blur=cupdate(config);><hr><label>Enter a Published Patent Application Number</label></fieldset></form>");
$templateCache.put("{widgetsPath}/getphd/src/editfulltext.html","<form role=form><div class=form-group ui-tree><label for=draftid>Select Document</label><ol ui-tree-nodes ng-model=tree.roarlist><li ui-tree-node ng-repeat=\"node in tree.roarlist\" ng-include=\"\'quicklinkid\'\" node={{node}} data-collapsed=true></li></ol><script type=text/ng-template id=quicklinkid><div class=\"card card-rounded\" ng-class=\"{\'text-success\': (config.id === node.id)}\"> <a class=\"btn btn-xs\" ng-click=\"toggle(this)\" ng-if=\"node.roarlist\" style=\"\"><span class=\"fa \" ng-class=\"{\'fa-chevron-right\': collapsed, \'fa-chevron-down\': !collapsed}\" style=\"color:steelblue;transition:all 0.25s ease;\"></span></a> <a ng-click=\"config.id = node.id;$close();\" ng-class=\"{\'text-success\': (config.id === node.id)}\" class=\"\"><span class=\"fa fa-stack fa-pull-left fa-border\"><span class=\"fa fa-stack-2x fa-file-o\"><span class=\"fa fa-stack-1x\" style=\"font-size: 10px;vertical-align:bottom;\">{{node.rid}}</span></span></span>&nbsp;&nbsp;{{node.title}}<br><small class=\"text-muted\">{{node.date | date}}</small></a> </div> <ol ui-tree-nodes=\"\" ng-model=\"node.roarlist\" ng-class=\"{hidden: collapsed}\" style=\"\"> <li class=\"\" ng-repeat=\"(key, node) in node.roarlist\" ui-tree-node ng-include=\"\'quicklinkid\'\" style=\"padding-right:0rem;padding-bottom:0.1rem;\" node=\"{{node.id || node.$id || node.$value || node}}\" data-collapsed=\"true\"> </li> </ol></script></div></form>");
$templateCache.put("{widgetsPath}/getphd/src/editgallery.html","<form role=form><div class=form-group><label for=sample>Interval, in milliseconds:</label> <input type=number class=form-control ng-model=config.interval><br>Enter a negative number or 0 to stop the interval.</div><div class=form-group><label>Disable Slide Looping</label> <input type=checkbox ng-model=config.nowrap></div><div class=form-group><label>Pause on Hover?</label> <input type=checkbox ng-model=config.pauseonhover></div><div class=form-group><label>Disable Transition</label> <input type=checkbox ng-model=config.transition></div></form>");
$templateCache.put("{widgetsPath}/getphd/src/fileuploaddirective.html","<div ng-controller=\"FileUploadDirectiveCtrl as main\"><div class=\"card card-primary card-block btn-glass drop-target\" drop-files=handleFiles(files) nv-file-drop style=\"border: 2px dashed blue;margin: 5px;\" uploader=uploader></div></div>");
$templateCache.put("{widgetsPath}/getphd/src/fulltext.html","<doc-header class=\"container-fluid card two-col-right\" roarid={{roarevent.id}}><a href=# editable-textarea=roarevent.notes e-rows=15 e-cols=80><p>{{ roarevent.notes || roarevent.plaintext || roarevent.text || roarevent.description || roarevent.content || \'no notes or text\' }}</p></a></doc-header><div matches=matches getpdftext={{roarevent.$id}} pdf-data={{roarevent.$id}} roarevent=roarevent class=\"card card-block\"></div>");
$templateCache.put("{widgetsPath}/getphd/src/gallery.html","<div style=\"min-height: 305px\"><uib-carousel interval=config.interval no-pause={{config.pauseonhover}} no-transition={{config.transition}} no-wrap={{config.nowrap}}><uib-slide ng-repeat=\"slide in gallery.slides\" active={slide.active} index=slide.index><img ng-src={{slide.media}} style=margin:auto;><div class=carousel-caption><h4>Slide {{slide.$index}}</h4><p>{{slide.title}}</p></div></uib-slide></uib-carousel></div>");
$templateCache.put("{widgetsPath}/getphd/src/metadata.html","<div class=\"card clearfix\" collection={{config.id}}><h6>ID: {{collection.$id}}</h6><p clipboad text=collection.$id onsuccess=\"alertify.success(\'copied ID\')\">{{\'/files/uploads/\'+collection.$id+\'.html\'}}</p><form role=form name=form ng-submit=collection.$save()><div class=col-sm-7><div class=\"form-group col-sm-6\"><label for=sortOrder style=color:#006699>Sort Order</label> <input type=number placeholder=# id=sortOrder ng-model=collection.sortOrder></div><div class=\"form-group col-sm-6\"><label style=\"color: #006699\">ID#</label><br><input type=text ng-model=collection.rid placeholder=# ng-model-options=\"{updateOn: \'blur\'}\"></div><div class=form-group><label for=dashboardTitle style=\"color: #006699\">Title</label> <input type=text style=\"width: 100%\" id=dashboardTitle ng-model=collection.title required></div><div class=form-group><label for=description style=\"color: #006699\">Description</label><br><textarea type=text class=form-control id=description ng-model=collection.description ng-model-options=\"{updateOn: \'blur\'}\"></textarea></div><div class=form-group><label for=long_cite style=\"color: #006699\">Long Citation</label><br><input type=text style=\"width: 100%\" ng-model=collection.citation placeholder=\"Long Citation\" ng-model-options=\"{updateOn: \'blur\'}\"></div><div class=form-group><label for=short_cite style=\"color: #006699\">Short Citation</label><br><input type=text style=\"width: 100%\" ng-model=collection.short_cite placeholder=\"Short Citation\" ng-model-options=\"{updateOn: \'blur\'}\"></div><div class=form-group><label for=thumbnail style=\"color: #006699\">Notes</label><br><textarea rows=15 type=text style=\"width: 100%\" ng-model=collection.notes placeholder=\"Enter plaintext notes\" ng-model-options=\"{updateOn: \'default blur\'}\" class=form-control></textarea></div><div class=form-group><label for=url style=\"color: #006699\">URL</label><br><input type=text style=\"width: 100%\" ng-model=collection.mediaUrl placeholder=\"Path to URL\" ng-model-options=\"{updateOn: \'blur\'}\"></div><div class=form-group><label for=thumbnail style=\"color: #006699\">Thumbnail</label><br><input type=text style=\"width: 100%\" ng-model=collection.thumbnail placeholder=\"Path to URL\" ng-model-options=\"{updateOn: \'blur\'}\"></div><div class=form-group><label for=roarlist style=\"color: #006699\">Linked Docs</label><br><div smartpanel={{collection.$id}}></div></div></div><div class=col-sm-5 style=max-height:175px;><roar-event id={{collection.$id}} style=max-height:175px;><uib-rating ng-model=roarevent.rate max=5></uib-rating></roar-event><input type=submit class=\"btn btn-glass btn-primary btn-md pull-right\" value=SAVE><div class=\"form-group col-sm-6\"><label style=\"color: #006699\">Icon</label><br><select name=icon ng-model=collection.icon ng-options=\"icon.value as icon.label for icon in $root.ICONS\"></select></div><div class=\"form-group col-sm-12\"><label style=\"color: #006699\">Style</label><br><select ng-model=collection.styleClass ng-options=\"class.value as class.label for class in $root.ROARCLASSES\"></select></div><div class=\"form-group col-sm-12\"><label style=\"color: #006699\">Document Code</label><br><input ng-model=collection.doccode uib-typeahead=\"code.code as code.label for code in DOCNAMES | filter:$viewValue | limitTo:8\" typeahead-wait-ms=100></div><div class=\"form-group col-sm-12\"><label style=\"color: #006699\">Tags</label><br><input ng-model=collection.matches ng-list=,></div><div class=\"form-group col-sm-12\"><label style=\"color: #006699\">Date</label><br><input type=text ng-model=collection.date placeholder=YYYY-MM-DD ng-pattern=dddd-dd-dd ng-model-options=\"{updateOn: \'blur\'}\"></div><div class=\"form-group col-sm-12\"><label style=\"color: #006699\">Name</label><br><input type=text ng-model=collection.name placeholder=name ng-model-options=\"{updateOn: \'blur\'}\"></div><div class=\"form-group col-sm-12\"><label style=\"color: #006699\">File</label><br><input type=text ng-model=collection.filename placeholder=filename ng-model-options=\"{updateOn: \'blur\'}\"></div><div class=\"form-group col-sm-12\"><label for=roarlist style=\"color: #006699\">Linked Docs</label><ol ng-scrollbar style=height:300px;overflow-y:scroll;><li ng-repeat=\"roareventid in collection.roarlist\" style=float:left;><roar-chip id={{roareventid}}></roar-chip></li></ol></div></div></form></div>");
$templateCache.put("{widgetsPath}/getphd/src/phdfrontpage.html","<div class=\"card card-fancy card-rounded card-block card-thick slideDown\" ng-class=\"{\'ground\':($rootScope.ground)}\" style=\"text-align: left;color: #444;overflow:visible;transform-style: preserve-3d;perspective:800px;perspective-origin:50% 50%;\" collection={{$parent.collection.$id}}><div id=innerviewport ng-class=\"{\'viewport\':($rootScope.viewport==true)}\"><button class=\"alert btn-glass btn-primary img card-rounded row\" style=\"position:relative;display:flex;display:-webkit-flex;align-items:center;align-content:center;justify-content:space-between;flex-direction:row;background-color:#35688F;padding:2px;box-shadow:inset 10px 2px 50px rgba(0,0,0,0.5);\" ng-click=\"collapsereport = !collapsereport\"><div style=display:flex;justify-content:flex-end;flex-direction:column;align-content:flex-end;vertical-align:middle;align-items:flex-end;><h4 class=\"card-title ng-binding display-4\" style=\"margin-bottom:0;color: #fff;\">US {{config.PNUM | number:0 }}</h4><h5 class=\"card-subtitle ng-binding\" style=color:#ddd;><span class=lead>USSN {{collection.application[\'Application Number\']}}</span></h5></div><img src=/llp_core/img/GoldLion.svg class=\"img lionlogofilter\" style=\"width:75px;height: auto;\"><div style=display:flex;flex-direction:column;align-items:flex-start;justify-content:space-around;><img src=/llp_core/img/GoldLogoLong.svg class=img style=height:45px;> <img src=/llp_core/img/GoldPhdLogoLong.svg class=img style=height:25px;padding-left:2px;></div></button><div uib-collapse=collapsereport class=\"card clearfix\" style=padding:0;margin:0;><blockquote class=\"bs-callout bs-callout-NOA\" style=\"margin: 0;\"><h4>{{collection.application[\'Title of Invention\']}}</h4><p style=font-size:10px;><cite>{{collection.application[\'First Named Inventor\']}} <small><emphasis>Issued {{collection.patent.issued | date}}</emphasis></small></cite></p></blockquote><uib-tabset class=\"tabbable tabs-below\" justified=true type=tabs><uib-tab class=\"btn btn-default btn-xs badger badger-{{collection.styleClass}} badger-left btn-{{collection.styleClass}}\" data-badger={{collection.title}}><uib-tab-heading class=text-{{collection.styleClass}} style=display:flex;><small style=align-self:bottom;>{{collection.rid}}</small></uib-tab-heading><uib-tabset active=1 class=tabbable justified=true type=pills><uib-tab active=main.tabs[0].isActive disabled=main.tabs[0].disabled select=\"main.tabs[0].isActive = true\" deselect=\"main.tabs[0].isActive = false\" style=\"margin: 0 5px;\"><uib-tab-heading class=text-Petition>PTO Metadata</uib-tab-heading><uib-tab-content ng-if=main.tabs[0].isActive><uib-tabset class=\"tabbable tabs-left\"><uib-tab><uib-tab-heading>USSN {{collection.application[\'Application Number\']}}</uib-tab-heading><uib-tabset class=tabbable><uib-tab ng-repeat=\"file in collection.file\" heading=\"{{file.label | uppercase}}\"><uib-tab-content><pre class=\"card card-block card-fancy\" ng-bind=file.file></pre></uib-tab-content></uib-tab></uib-tabset></uib-tab><uib-tab ng-if=collection.application><uib-tab-heading>APPLICATION</uib-tab-heading><uib-tab-content><table class=\"card card-block table table-striped table-hover table-condensed table-responsive\"><tbody><tr ng-repeat=\"(key, value) in collection.application\"><td><strong>{{::key}}</strong></td><td>{{::value}}</td></tr></tbody></table></uib-tab-content></uib-tab><uib-tab ng-if=collection.attorney><uib-tab-heading ng-style>ATTORNEY</uib-tab-heading><uib-tab-content><table class=\"card card-block table table-striped table-hover table-condensed table-responsive\"><tbody><tr ng-repeat=\"(key, line) in collection.attorney track by $index\"><td ng-repeat=\"(key, value) in line track by $index\">{{::value}}</td></tr></tbody></table></uib-tab-content></uib-tab><uib-tab ng-if=collection.continuity><uib-tab-heading ng-style>CONTINUITY</uib-tab-heading><uib-tab-content><table class=\"card card-block table table-striped table-condensed table-hover table-responsive\"><tbody><tr ng-repeat=\"(key,line) in collection.continuity track by $index\"><td ng-repeat=\"(key, value) in line track by $index\">{{::value}}</td></tr></tbody></table></uib-tab-content></uib-tab><uib-tab ng-if=collection.foreign><uib-tab-heading ng-style>FOREIGN PRIORITY</uib-tab-heading><uib-tab-content><table class=\"table table-stripped table-condensed table-hover table-responsive\"><thead><tr><th><strong>Country</strong></th><th><strong>Priority</strong></th><th><strong>Priority Date</strong></th></tr></thead><tbody><tr ng-repeat=\"p in collection.foreign\"><td ng-bind=\"::p[\'Country\']\"></td><td ng-bind=\"::p[\'Priority\']\"></td><td ng-bind=\"::p[\'Priority Date\'] | date\"></td></tr></tbody></table></uib-tab-content></uib-tab><uib-tab ng-if=collection.term><uib-tab-heading>PATENT TERM ADJUSTMENTS</uib-tab-heading><uib-tab-content><table class=\"card card-block table table-striped table-hover table-condensed table-responsive\"><tbody><tr ng-repeat=\"(key, line) in collection.term track by $index\"><td ng-repeat=\"(key,value) in line track by $index\">{{::value}}</td></tr></tbody></table></uib-tab-content></uib-tab><uib-tab ng-if=collection.transaction><uib-tab-heading>TRANSACTION</uib-tab-heading><uib-tab-content><table class=\"table table-striped table-hover table-condensed table-responsive\"><thead><tr><th><strong>Date</strong></th><th><strong>Transaction Description</strong></th></tr></thead><tbody><tr ng-repeat=\"trans in collection.transaction\"><td>{{::trans[\'Date\']}}</td><td>{{::trans[\'Transaction Description\']}}</td></tr></tbody></table></uib-tab-content></uib-tab><uib-tab ng-if=collection.imagefile select=\"tab.isActive = true\" deslect=\"tab.isActive = false;\"><uib-tab-heading ng-style>IMAGE FILE WRAPPER</uib-tab-heading><uib-tab-content ng-if=tab.isActive><table class=\"table table-hover table-condensed table-responsive\"><thead><tr><th ng-click=\"reverse = !reverse\" class=fa ng-class=\"{\'fa-chevron-up\': reverse,\'fa-chevron-down\': !reverse}\">#</th><th ng-click=\"main.dog = \'Mail\\ Room\\ Date\'; maybe = !maybe\"><strong>Mail Room Date<i class=fa ng-if=\"main.dog == \'Mail Room Date\'\" ng-class=\"{\'fa-chevron-up\':maybe,\'fa-chevron-down\': !maybe}\"></i></strong></th><th ng-click=\"main.dog = \'Document\\ Code\'; maybe = !maybe\"><strong>Document Code<i class=fa ng-if=\"main.dog == \'Document Code\'\" ng-class=\"{\'fa-chevron-up\':maybe,\'fa-chevron-down\': !maybe}\"></i></strong></th><th ng-click=\"main.dog = \'Document\\ Description\'; maybe = !maybe\"><strong>Document Description<i class=fa ng-if=\"main.dog == \'Document Description\'\" ng-class=\"{\'fa-chevron-up\':maybe,\'fa-chevron-down\': !maybe}\"></i></strong></th><th ng-click=\"main.dog = \'Document\\ Category\'; maybe = !maybe\"><strong>Document Category<i class=fa ng-if=\"main.dog == \'Document Category\'\" ng-class=\"{\'fa-chevron-up\':maybe,\'fa-chevron-down\': !maybe}\"></i></strong></th><th ng-click=\"main.dog = \'Page\\ Count\'; maybe = !maybe\"><strong>Page Count<i class=fa ng-if=\"main.dog == \'Page Count\'\" ng-class=\"{\'fa-chevron-up\':maybe,\'fa-chevron-down\': !maybe}\"></i></strong></th><th ng-click=\"main.dog = \'Filename\'; maybe = !maybe\"><strong>Filename<i class=fa ng-if=\"main.dog == \'Filename\'\" ng-class=\"{\'fa-chevron-up\':maybe,\'fa-chevron-down\': !maybe}\"></i></strong></th></tr></thead><tbody><tr ng-repeat=\"roarevent in collection.imagefile | filter: main.query | orderBy: main.dog : !maybe\" colorkey=\"{{roarevent[\'Document Code\']}}\"><th><a ng-click=main.pushtoqueue(roarevent)><i class=\"fa fa-file-pdf\" ng-class=\"{\'fa-check\':(roarevents[roarevent.$index].media.indexOf(\'_ocr\')>-1)}\">{{$index+1}}</i></a></th><td ng-bind=\"roarevent[\'Mail Room Date\']\"></td><td ng-bind=\"roarevent[\'Document Code\']\"></td><td ng-bind=\"roarevent[\'Document Description\']\"></td><td ng-bind=\"roarevent[\'Document Category\']\"></td><td ng-bind=\"roarevent[\'Page Count\']\"></td><td><a ng-href=\"{{\'./files/public/uspto/\'+ collection.appnum + \'/\' + collection.appnum + \'-image_file_wrapper/\' + roarevent[\'Filename\']}}\">{{roarevent[\'Filename\']}}</a></td></tr></tbody></table></uib-tab-content></uib-tab></uib-tabset></uib-tab-content></uib-tab><uib-tab active=main.tabs[1].isActive disable=main.tabs[1].disabled select=\"main.tabs[1].isActive = true\" deselect=\"main.tabs[1].isActive = false\" style=\"margin: 0 5px;\"><uib-tab-heading ng-style>Patent Digest</uib-tab-heading><uib-tab-content ng-if=main.tabs[1].isActive ng-controller=\"MainCtrl as main\"><patentreport patent={{collection.patent.id}} pnum={{collection.patent.id}} config=\"{PNUM:collection.patent.id, IPAYEAR: collection.patent.pub.slice(0,4),IPAYEAR: collection.patent.pub.slice(4,collection.patent.pub.length) }\"></patentreport></uib-tab-content></uib-tab><uib-tab heading=\"Claim/Rejection History\" active=main.tabs[2].isActive select=\"main.tabs[2].isActive = true\" deselect=\"main.tabs[2].isActive = false\"><uib-tab-content><uib-tabset justified=true><uib-tab heading=\"Claim History-at-a-Glance\"><d3historytree patent={{config.PNUM}}></d3historytree></uib-tab><uib-tab heading=\"Issued Claims\"><div ng-include=\"\'{widgetsPath}/getphd/src/claimtreetab.html\'\"></div></uib-tab><uib-tab ffbase={{config.PNUM}}><uib-tab-heading>Rejections <label class=\"label label-pill label-danger\">{{item.rejectionhistory.length}}</label></uib-tab-heading><div ng-repeat=\"(key, date) in item.rejectionhistory\" class=\"card card-PTO\"><div class=card-header><h4 class=card-title>{{key | date:long}} <a class=\"fa fa-ellipsis-v fa-pull-right\" ng-click=\"this.isCollapsed = !this.isCollapsed\"></a></h4></div><div class=card-block uib-collapse=isCollapsed rejectionset set=date></div></div></uib-tab></uib-tabset></uib-tab-content></uib-tab></uib-tabset></uib-tab><uib-tab ng-repeat=\"col in collection.roarlist\" ffbase={{col}} class=\"btn btn-default btn-xs badger badger-left tabs-right badger-{{item.styleClass}}\" style=border-top-width:4px;border-color:inherit; data-badger={{item.title}}><uib-tab-heading class=text-{{item.styleClass}}><small>{{item.rid}}</small></uib-tab-heading><roargrid config=\"{id: col}\"></roargrid></uib-tab></uib-tabset></div></div></div>");
$templateCache.put("{widgetsPath}/getphd/src/popupMetadata.html","<div class=\"panel panel-{{collecton.styleClass}}\"></div>");
$templateCache.put("{widgetsPath}/getphd/src/rejection.html","<div colorkey=\"{{rejection.status | trim}}\" class=img-avatar style=display:flex;align-items:center;align-content:center;><label>{{rejection.status}}</label></div><div style=\"min-width: 150px;height:100px;\"><span ng-repeat=\"c in rejection.claims_affected\" style=width:25%;float:left;>{{c}}</span></div><div style=overflow:scroll;text-overflow:ellipsis;><ng-annotate-text text=\"rejection.text | highlight: query\" annotations=rejection.annotations readonly=false popup-controller=\"\'AnnotationController\'\" popup-template-url=\"\'/llp_core/modules/roarmap/partial/roarmap.detail.tpl/roarmap.annotation.tpl.html\'\" tooltip-controller=\"\'AnnotationController\'\" tooltip-template-url=\"\'/llp_core/modules/roarmap/partial/roarmap.detail.tpl/roarmap.annotation-tooltip.tpl.html\'\" on-annotate=onAnnotate on-annotate-delete=onAnnotateDelete on-annotate-error=onAnnotateError on-popup-show=onPopupShow on-popup-hide=onPopupHide popup-offset=50></ng-annotate-text></div>");
$templateCache.put("{widgetsPath}/getphd/src/rejectionset.html","<div ng-repeat=\"rejection in set | orderBy: [\'id\',\'type\'] : maybe\"><div rejection=rejection style=display:flex;flex-direction:row;max-height:100px; class=\"card img-shadow\" data-badger={{rejection.type}}></div></div>");
$templateCache.put("{widgetsPath}/getphd/src/report.html","<table class=\"table table-stripped table-hover table-condensed table-responsive\"><thead><tr class=td-petition><th ng-click=\"maybe = !maybe;prop = \'id\'\">#</th><th ng-click=\"maybe = !maybe;prop = \'doccode\'\">#</th><th class=td-petition ng-click=\"maybe = !maybe;prop = \'total\'\">Total</th><th colorkey=allowed ng-click=\"maybe = !maybe;prop = \'allowed\'\">Allowed</th><th colorkey=new ng-click=\"maybe = !maybe;prop = \'allowed\'\">New</th><th colorkey=original ng-click=\"maybe = !maybe;prop = \'original\'\">O</th><th colorkey=canceled ng-click=\"maybe = !maybe;prop = \'canceled\'\">C</th><th colorkey=withdrawn ng-click=\"maybe = !maybe;prop = \'withdrawn\'\">W</th><th colorkey=\"currently amended\" ng-click=\"maybe = !maybe;prop = \'currently\'\">C.A.</th><th colorkey=\"previously presented\" ng-click=\"maybe = !maybe;prop = \'previously\'\">P.P.</th><th colorkey=allowable ng-click=\"maybe = !maybe;prop = \'allowable\'\">Allowable</th><th colorkey=101 ng-click=\"maybe = !maybe;prop = \'v101\'\">101</th><th colorkey=102 ng-click=\"maybe = !maybe;prop = \'v102\'\">102</th><th colorkey=103 ng-click=\"maybe = !maybe;prop = \'v103\'\">103</th><th colorkey=112 ng-click=\"maybe = !maybe;prop = \'v112\'\">112</th></tr></thead><tbody><tr ng-repeat=\"(key, paper) in arra | orderBy: prop :maybe\" ffbase={{paper.id}} class={{item.styleClass}} collection=\"{{paper.id.slice(0,paper.id.indexOf(\'-\'))}}\"><td ng-click=runhistory(collection)>{{collection.patent.id|number:0}}</td><td class=\"well {{item.styleClass}}\" ng-click=pushtoqueue(item)>{{item.rid}} - {{item.doccode}}</td><td ng-bind=paper.total||paper.pending></td><td ng-bind=paper.allowed></td><td ng-bind=paper.new></td><td ng-bind=paper.original></td><td ng-bind=paper.canceled></td><td ng-bind=paper.withdrawn></td><td ng-bind=paper.amended.currently></td><td ng-bind=paper.amended.previously></td><td ng-bind=paper.v101></td><td ng-bind=paper.v102></td><td ng-bind=paper.v103></td><td ng-bind=paper.v112></td><td ng-bind=paper.allowable></td></tr><tr><td ng-bind=\"sum(collection, \'total\')\"></td><td ng-bind=\"sum(collection, \'allowed\')\"></td><td ng-bind=\"sum(collection, \'new\')\"></td><td ng-bind=\"sum(collection, \'original\')\"></td><td ng-bind=\"sum(collection, \'canceled\')\"></td><td ng-bind=\"sum(collection, \'withdrawn\')\"></td><td ng-bind=\"sum(collection, \'currently\')\"></td><td ng-bind=\"sum(collection, \'previously\')\"></td><td ng-bind=\"sum(collection, \'v101\')\"></td><td ng-bind=\"sum(collection, \'v102\')\"></td><td ng-bind=\"sum(collection, \'v103\')\"></td><td ng-bind=\"sum(collection, \'v112\')\"></td></tr></tbody></table><div class=\"animated row card-deck clear-fix\"><div class=\"toast toast-info btn-glass\"><h6 class=\"fa fa-3x fa-ge\">{{report.filehistories.total}} <label>&nbsp;&nbsp;TOTAL</label></h6></div></div><div class=\"toast toast-success btn-glass\"><h6 class=\"fa fa-3x fa-check\">{{report.filehistories.complete}} <label>&nbsp;&nbsp;COMPLETE</label></h6></div><div class=\"toast toast-warning btn-glass\"><h6 class=\"fa fa-3x fa-alert\">{{report.filehistories.incomplete}} <label>&nbsp;&nbsp;INCOMPLETE</label></h6></div><div class=\"animated row\"><div class=col-md-6 style=height:600px;overflow:scroll;><div style=\"margin:2.5%;padding:2.5%;display:flex;flex-flow:row wrap;justify-content:space-between;perspective:1200px;transform-style:preserve-3d;\" class=\"card card-block img-shadow\"><figure draggable style=\"width:100px;height:100px;border:0px groove #ddd;float:left;margin:2.5px;perspective:500px;transform-style:preserve-3d;transition:all 0.2s ease;position:relative;background-color:transparent;\" ng-repeat=\"history in report.filehistories.data | filter: report.query | orderBy: [prop,\'id\'] :maybe\"><img src=\"{{history.media || history.altimgurl}}\" style=\"width:100%;height:100%;transition:all 0.2s ease;\" ng-class=\"{\'img-thumbnail highlight\':(history.mouseover == true) }\" ng-mouseenter=\"history.mouseover = true\" ng-mouseleave=\"history.mouseover = false\" class=\"img img-shadow\"><a ng-click=app.dofunction(history) style=\"position:absolute;left:0;top:100%;right:0;text-align:center;border-radius:20px;box-shadow:inset 0 0 30px rgba(250,250,250,0.75),-1px 1px 5px rgba(0,0,0,0.5),inset -1px 1px 5px rgba(0,0,0,0.5);background-color:rgba(0,0,0,0.25);border:2.5px ridge black;transform-origin:50% 50%;transform:translateZ(5px)translateY(-25px);transition:all 0.2s ease;color:black;\" class=\"label btn\">{{(history.id | number:0) || history.application.utility}}</a></figure></div></div><div class=col-md-6 style=height:600px;overflow:scroll;><div style=margin:2.4%;padding:2.5%; class=\"card card-block img-shadow\"><a style=position:absolute;z-index:2;right:5px; ng-click=\"report.query = \'\'\" class=badge><i class=\"fa fa-close\"></i></a> <input style=position:absolute;z-index:1;right:5px; placeholder=Search... ng-model=report.query class=pull-right><table style=z-index:0; class=\"table table-stripped table-condensed table-hover table-resonsive\"><thead><th ng-click=\"maybe = !maybe;prop = \'isReedTech\'\"><i class=\"fa fa-check\"></i></th><th ng-click=\"maybe = !maybe;prop = \'appnum\'\">#</th><th ng-click=\"maybe = !maybe;prop = \'id\'\">ID</th><th ng-click=\"maybe = !maybe;prop = \'claims_issued_total\'\">Issued / Pending</th><th ng-click=\"maybe = !maybe;prop = \'art_unit\'\">Art Unit</th><th ng-click=\"maybe = !maybe;prop = \'file.fstat.size\'\">FileSize</th><th ng-click=\"maybe = !maybe;prop = \'title\'\">Title</th><th ng-click=\"maybe = !maybe;prop = \'file.added\">Added</th></thead><tbody><tr ng-repeat=\"history in report.filehistories.data | filter: report.query | orderBy: [prop,\'id\'] :maybe\" ng-mouseenter=\"history.mouseover = true\" ng-mouseleave=\"history.mouseover = false\" ng-class=\"{\'primary tr-primary\':(history.mouseover == true) }\" class=\"animated staggered\"><td><span ng-class=\"{\'fa-check text-success\':(history.isReedTech === true),\'fa-minus text-danger\':(history.isReedTech !== true)}\" class=fa></span></td><td>{{$index}}</td><td><strong>{{history.patent}}</strong><br>({{history.application.utility}})</td><td>{{history.claims_issued_total}} / {{history.claims_pending_total}}<br>({{history.claims_issued_total / history.claims_pending_total * 100 }}%)</td><td ng-bind-html=\"history.art_unit | highlight: report.query | trustAsHTML\">{{history.art_unit}}</td><td ng-bind-html=history.file.size></td><td ng-bind-html=\"history.title | highlight: report.query | trustAsHTML\">{{history.title}}</td><td ng-bind-html=\"history.file.added | date\"></td></tr></tbody></table></div></div></div>");
$templateCache.put("{widgetsPath}/getphd/src/roartable.html","<table class=\"table table-hover table-condensed table-responsive\" collection={{config.IDNUM}} roarevents={{config.IDNUM}}><thead><th ng-click=\"main.dog = \'\';maybe = !maybe\"><strong># <i class=fa ng-class=\"{\'fa-chevron-up\':maybe,\'fa-chevron-down\': !maybe}\" ng-if=\"main.dog == \'\'\"></i></strong></th><th ng-click=\"main.dog = \'title\';maybe = !maybe\"><strong>Title <i class=fa ng-class=\"{\'fa-chevron-up\':maybe,\'fa-chevron-down\': !maybe}\" ng-if=\"main.dog == \'title\'\"></i></strong></th><th ng-click=\"main.dog = \'date\';maybe = !maybe\"><strong>Date <i class=fa ng-class=\"{\'fa-chevron-up\':maybe,\'fa-chevron-down\': !maybe}\" ng-if=\"main.dog == \'date\'\"></i></strong></th><th ng-click=\"main.dog = \'description\';maybe = !maybe\"><strong>Description <i class=fa ng-class=\"{\'fa-chevron-up\':maybe,\'fa-chevron-down\': !maybe}\" ng-if=\"main.dog == \'description\'\"></i></strong></th></thead><tbody><tr ng-repeat=\"roarevent in roarevents | filter: main.query | orderBy: main.dog : maybe\"><td ng-bind=\"$index + 1\"></td><td ng-bind=roarevent.title></td><td ng-bind=\"roarevent.date | date\"></td><td ng-bind=roarevent.description></td></tr></tbody></table>");
$templateCache.put("{widgetsPath}/getphd/src/roartableedit.html","<form role=form ng-submit=collection.$save()><fieldset class=\"material Applicant\"><input type=text placeholder=1234567 ng-model=config.IDNUM><hr><label>Enter a ROARmap ID</label></fieldset><br></form>");
$templateCache.put("{widgetsPath}/getphd/src/titleTemplate.html","<div class=panel-heading style=z-index:1;margin:0px; ng-init=\"coplapse = false\"><h4 class=panel-title><div uib-dropdown uib-keyboard-nav style=z-index:1000000;><a uib-dropdown-toggle class=\"btn btn-xs vcenter pull-left no-arrow\"><label class=\"fa fa-bars hovergold\" style=\"cursor:pointer;filter:drop-shadow(0 0 2.5px rgba(0,0,0,0.5));color: #fff;\"></label></a><ul class=\"uib-dropdown-menu panel r-action\" style=\"position:absolute;width:280px;box-shadow: 5px 5px 10px rgba(0,0,0,0.5);\"><li uib-tooltip=\"COPY LINK\" tooltip-trigger=mouseenter tooltip-append-to-body=false tooltip-placement=right><a class=hovergold style=\"text-shadow:inset 0 0 1px rgba(0,0,0,0.5);\" clipboard text=roarevent.media on-copied=\"alertify.success(\'copied!\');\" on-error=\"alertify.error(err,\'uh oh!\')\" onclick=\"alertify.success(\'copied!\')\"><i class=\"fa fa-link\" style=margin:5px;></i> COPY LINK</a></li><li uib-tooltip=\"COPY LEXPAD ID\" tooltip-trigger=mouseenter tooltip-append-to-body=false tooltip-placement=right><a class=hovergold style=\"text-shadow:inset 0 0 1px rgba(0,0,0,0.5);\" clipboard text=roarevent.$id on-copied=\"alertify.success(\'copied!\');\" on-error=\"alertify.error(err,\'uh oh!\')\" onclick=\"alertify.success(\'copied!\')\"><i class=\"fa fa-info\" style=margin:5px;></i> COPY LEXPAD ID</a></li><li uib-tooltip=COLLAPSE tooltip-trigger=mouseenter tooltip-append-to-body=false tooltip-placement=right><a class=hovergold style=\"text-shadow:inset 0 0 1px rgba(0,0,0,0.5);\" title=\"collapse widget\" ng-show=!isCollapsed ng-click=\"isCollapsed = true\" onclick=\"$(\'.issuedocpanel\').addClass(\'closed\')\"><i class=\"fa fa-minus\" style=margin:5px;></i> COLLAPSE</a></li><li uib-tooltip=EXPAND tooltip-trigger=mouseenter tooltip-append-to-body=false tooltip-placement=right><a class=hovergold style=\"text-shadow:inset 0 0 1px rgba(0,0,0,0.5);\" title=\"expand widget\" ng-show=isCollapsed ng-click=\"isCollapsed = false\" onclick=\"$(\'.issuedocpanel\').removeClass(\'closed\')\"><i class=\"fa fa-plus\" style=margin:5px;></i> EXPAND</a></li><li uib-tooltip=\"COPY TO CLIPBOARD\" tooltip-trigger=mouseenter tooltip-append-to-body=false tooltip-placement=right><a class=hovergold style=\"text-shadow:inset 0 0 1px rgba(0,0,0,0.5);\" title=\"copy to clipboard\" ng-click=edit(roarevent.id)><i class=\"fa fa-copy\" style=margin:5px;></i> COPY TO CLIPBOARD</a></li><li uib-tooltip=FULLSCREEN tooltip-trigger=mouseenter tooltip-append-to-body=false tooltip-placement=right><a class=hovergold style=\"text-shadow:inset 0 0 1px rgba(0,0,0,0.5);\" title=\"fullscreen widget\" ng-click=openFullScreen(roarevent.$id) ng-show=\"options.maximizable || true\"><i class=\"fa fa-expand\" style=margin:5px;></i> FULLSCREEN</a></li><li uib-tooltip=\"POP OUT\" tooltip-trigger=mouseenter tooltip-append-to-body=false tooltip-placement=right><a class=hovergold style=\"text-shadow:inset 0 0 1px rgba(0,0,0,0.5);\" title=\"pop out\" ng-click=openprev()><i class=\"fa fa-external-link\" style=margin:5px;></i> POPOUT</a></li><li class=divider></li><li uib-tooltip=CLOSE tooltip-trigger=mouseenter tooltip-append-to-body=false tooltip-placement=right><a class=\"hovergold text-danger\" style=\"text-shadow:inset 0 0 1px rgba(0,0,0,0.5);\" title=\"remove widget\" ng-click=remove() onclick=\"$(this).closest(\'.issuedocpanel\').remove()\"><i class=\"fa fa-close\" style=margin:5px;></i> CLOSE</a></li></ul></div><div class=\"row vcenter\"><small>&nbsp;&nbsp;|&nbsp;&nbsp;</small> <small ng-bind=roarevent.rid ng-click=\"drag = !drag\" ng-class=\"{\':active\':drag}\"></small> <small>&nbsp;&nbsp;|&nbsp;&nbsp;</small> <small ng-bind=\"roarevent.title || roarevent.date\"></small> <small><em style=margin-left:50px; ng-bind=\"roarevent.date | date\"></em><span class=\"fa {{roarevent.icon || \'fa-info\'}}\" ng-click=\"roarevent.coplapse = !roarevent.coplapse\" style=\"margin: 5px;\"></span> <span class=\"fa fa-close\" ng-click=remove() onclick=\"$(this).closest(\'.issuedocpanel\').remove()\" style=margin:10px;></span></small></div></h4><div class=\"card clearfix img img-hover img-shadow\" collection={{roarevent.$id}} style=z-index:1;position:absolute;left:99.5%;top:0;min-width:550px ng-class=\"{\'collapse\':!roarevent.coplapse, \'collapse in\':roarevent.coplapse}\"><h6>ID: {{collection.$id}}</h6><p clipboard text=collection.$id onsuccess=\"alertify.success(\'copied ID\')\">{{\'/files/uploads/\'+collection.$id+\'.html\'}}</p><form role=form name=form ng-submit=collection.$save()><div class=col-sm-7><div class=\"form-group col-sm-6\"><label for=sortOrder style=color:#006699>Sort Order</label> <input type=number placeholder=# id=sortOrder ng-model=collection.sortOrder></div><div class=\"form-group col-sm-6\"><label style=\"color: #006699\">ID#</label><br><input type=text ng-model=collection.rid placeholder=# ng-model-options=\"{updateOn: \'blur\'}\"></div><div class=form-group><label for=dashboardTitle style=\"color: #006699\">Title</label> <input type=text style=\"width: 100%\" id=dashboardTitle ng-model=collection.title required></div><div class=form-group><label for=description style=\"color: #006699\">Description</label><br><textarea type=text class=form-control id=description ng-model=collection.description ng-model-options=\"{updateOn: \'blur\'}\"></textarea></div><div class=form-group><label for=long_cite style=\"color: #006699\">Long Citation</label><br><input type=text style=\"width: 100%\" ng-model=collection.citation placeholder=\"Long Citation\" ng-model-options=\"{updateOn: \'blur\'}\"></div><div class=form-group><label for=short_cite style=\"color: #006699\">Short Citation</label><br><input type=text style=\"width: 100%\" ng-model=collection.short_cite placeholder=\"Short Citation\" ng-model-options=\"{updateOn: \'blur\'}\"></div><div class=form-group><label for=thumbnail style=\"color: #006699\">Notes</label><br><textarea rows=15 type=text style=\"width: 100%\" ng-model=collection.notes placeholder=\"Enter plaintext notes\" ng-model-options=\"{updateOn: \'default blur\'}\" class=form-control></textarea></div><div class=form-group><label for=url style=\"color: #006699\">URL</label><br><input type=text style=\"width: 100%\" ng-model=collection.mediaUrl placeholder=\"Path to URL\" ng-model-options=\"{updateOn: \'blur\'}\"></div><div class=form-group><label for=thumbnail style=\"color: #006699\">Thumbnail</label><br><input type=text style=\"width: 100%\" ng-model=collection.thumbnail placeholder=\"Path to URL\" ng-model-options=\"{updateOn: \'blur\'}\"></div><div class=form-group><label for=roarlist style=\"color: #006699\">Linked Docs</label><br><div smartpanel={{collection.$id}}></div></div></div><div class=col-sm-5 style=max-height:175px;><roar-event id={{roarevent.$id}} style=max-height:175px;><uib-rating ng-model=roarevent.rate max=5></uib-rating></roar-event><input type=submit class=\"btn btn-glass btn-primary btn-md pull-right\" value=SAVE><div class=\"form-group col-sm-6\"><label style=\"color: #006699\">Icon</label><br><select name=icon ng-model=collection.icon ng-options=\"icon.value as icon.label for icon in $root.ICONS\"></select></div><div class=\"form-group col-sm-12\"><label style=\"color: #006699\">Style</label><br><select ng-model=collection.styleClass ng-options=\"class.value as class.label for class in $root.ROARCLASSES\"></select></div><div class=\"form-group col-sm-12\"><label style=\"color: #006699\">Document Code</label><br><input ng-model=collection.doccode uib-typeahead=\"code.code as code.label for code in DOCNAMES | filter:$viewValue | limitTo:8\" typeahead-wait-ms=100></div><div class=\"form-group col-sm-12\"><label style=\"color: #006699\">Tags</label><br><input ng-model=collection.matches ng-list=,></div><div class=\"form-group col-sm-12\"><label style=\"color: #006699\">Date</label><br><input type=text ng-model=collection.date placeholder=YYYY-MM-DD ng-pattern=dddd-dd-dd ng-model-options=\"{updateOn: \'blur\'}\"></div><div class=\"form-group col-sm-12\"><label style=\"color: #006699\">Name</label><br><input type=text ng-model=collection.name placeholder=name ng-model-options=\"{updateOn: \'blur\'}\"></div><div class=\"form-group col-sm-12\"><label style=\"color: #006699\">FileName</label><br><input type=text ng-model=collection.file.name placeholder=\"file name\" ng-model-options=\"{updateOn: \'blur\'}\"></div><div class=\"form-group col-sm-12\"><label for=roarlist style=\"color: #006699\">Linked Docs <i class=badge ng-bind=roareventsarray.length>{{roareventsarray.length}}</i></label><ol ng-scrollbar style=height:300px;overflow-y:scroll;><li ng-repeat=\"roareventid in collection.roarlist as roareventsarray\" style=float:left;><roar-chip id={{roareventid}}></roar-chip></li></ol></div></div></form></div></div>");
$templateCache.put("{widgetsPath}/getphd/src/uploader.html","<div class=\"card card-fancy card-rounded card-thick\"><h3 class=pull-right>Upload queue</h3><input type=file nv-file-select uploader=uploader multiple><p>Queue length: {{ uploader.queue.length }}</p><table class=table><thead><tr><th width=50%>Name</th><th ng-show=uploader.isHTML5>Size</th><th ng-show=uploader.isHTML5>Progress</th><th>Status</th><th>Actions</th></tr></thead><tbody><tr ng-repeat=\"item in uploader.queue\"><td uib-popover=\"{{item.file | json:4}}\" popover-trigger=mouseenter popover-placement=right><strong>{{ item.file.name }}&nbsp;|&nbsp;{{item.file.mimetype}}</strong></td><td ng-show=uploader.isHTML5 nowrap>{{ item.file.size/1024/1024|number:3 }} MB</td><td ng-show=uploader.isHTML5><div class=progress style=\"margin-bottom: 0;\"><div class=progress-bar role=progressbar ng-style=\"{\'width\': item.progress + \'%\' }\"></div></div></td><td class=text-center><span ng-show=item.isSuccess><i class=\"glyphicon glyphicon-ok\"></i></span> <span ng-show=item.isCancel><i class=\"glyphicon glyphicon-ban-circle\"></i></span> <span ng-show=item.isError><i class=\"glyphicon glyphicon-remove\"></i></span></td><td nowrap><button type=button class=\"btn btn-success btn-xs\" ng-click=item.upload() ng-disabled=\"item.isReady || item.isUploading || item.isSuccess\"><span class=\"glyphicon glyphicon-upload\"></span> Upload</button> <button type=button class=\"btn btn-warning btn-xs\" ng-click=item.cancel() ng-disabled=!item.isUploading><span class=\"glyphicon glyphicon-ban-circle\"></span> Cancel</button> <button type=button class=\"btn btn-danger btn-xs\" ng-click=item.remove()><span class=\"glyphicon glyphicon-trash\"></span> Remove</button></td></tr></tbody></table><div><div>Queue progress:<div class=progress><div class=progress-bar role=progressbar ng-style=\"{ \'width\': uploader.progress + \'%\' }\"></div></div></div><button type=button class=\"btn btn-success btn-s\" ng-click=uploader.uploadAll() ng-disabled=!uploader.getNotUploadedItems().length><span class=\"glyphicon glyphicon-upload\"></span> Upload all</button> <button type=button class=\"btn btn-warning btn-s\" ng-click=uploader.cancelAll() ng-disabled=!uploader.isUploading><span class=\"glyphicon glyphicon-ban-circle\"></span> Cancel all</button> <button type=button class=\"btn btn-danger btn-s\" ng-click=uploader.clearQueue() ng-disabled=!uploader.queue.length><span class=\"glyphicon glyphicon-trash\"></span> Remove all</button></div></div>");
$templateCache.put("{widgetsPath}/getphd/src/view.html","<div ng-controller=\"MainCtrl as main\"><div class=\"card card-primary card-block btn-glass drop-target\" nv-file-drop uploader=uploader drop-files=handleFiles(files) style=\"border: 2px dashed blue;margin: 5px;\" ng-if=main.showupload><div ng-controller=pageslideCtrl><button class=\"row btn btn-glass btn-primary img img-rounded\" style=width:100%;position:relative;display:flex;display:-webkit-flex;align-items:center;align-content:stetch;justify-content:center;flex-direction:row; ng-click=main.toggle() ng-class=\"{\'btn-success\': (main.progress == 100),\'btn-danger\':(main.progress === \'failed\')}\" angular-ripple><uib-progressbar class=\"btn-glass fa fa-3x active stripped\" ng-class=\"{\'active\':(main.progress < 100)}\" ng-if=main.progress value=main.progress style=height:40px;margin:auto;position:relative;display:flex;display:-webkit-flex;align-items:center;align-content:stetch;justify-content:stretch;flex-direction:row;align-self:stretch; type={{main.progresstype}}></uib-progressbar><i class=\"fa fa-upload fa-3x\" style=\"color:white;text-shadow:0 0 1px rgba(0,0,0,0.5);\">{{main.progress}}<span ng-show=main.progress>%</span></i> <img src=https://lexlab.firebaseapp.com/img/GoldLogoLong.svg class=\"img img-rounded pull-right\" style=max-height:100px; ng-if=!main.progress><uib-progressbar class=\"btn-glass fa fa-3x active striped\" ng-class=\"{\'active\':(application.complete < 100)}\" ng-if=main.showprog value=application.complete style=\"height:40px;margin:auto;position:relative;display:flex;display:-webkit-flex;align-items:center;align-content:center;justify-content:space-between;flex-flow:row nowrap;align-self:stretch;\" type={{application.status}}><h4><label class=\"label label-{{application.status}}\" style=\"color:white;text-shadow:0 0 1px rgba(0,0,0,0.5);\">{{application.complete}}%</label><label class=\"label label-{{application.status}}\" style=\"color:white;text-shadow:0 0 1px rgba(0,0,0,0.5);\">{{application.downloaded | bytes}} / {{application.total | bytes}}</label><label class=\"label label-{{application.status}}\" style=\"color:white;text-shadow:0 0 1px rgba(0,0,0,0.5);\">{{application.eta}}</label></h4></uib-progressbar></button><div class=\"row btn btn-glass btn-info\" style=position:relative;display:flex;display:-webkit-flex;align-items:center;align-content:stetch;justify-content:center;flex-direction:row; ng-if=main.progresstwo><uib-progressbar class=\"btn-glass fa fa-3x active striped\" ng-class=\"{\'active\':(main.progresstwo < 100)}\" value=main.progresstwo max=main.extractedfiles style=height:40px;margin:auto;position:relative;display:flex;display:-webkit-flex;align-items:center;align-content:stetch;justify-content:stretch;flex-direction:row;align-self:stretch; type={{main.progresstype}}></uib-progressbar><i class=\"fa fa-fw fa-3x fa-spinner fa-spin\"></i><i class=\"fa fa-3x\">{{main.progresstwo}}/{{main.extractedfiles}}</i></div><div pageslide ps-open=main.checked ps-key-listener=true ps-side=\"{{main.side || \'left\'}}\" ps-class=\"{{main.styleClass || \'card-dark btn-glass\'}}\" ps-size=\"{{main.size || \'400\'}}\" style=overflow-x:visible;overflow-y:scroll;><div ng-include=\"\'/getphdwidget/src/phd/step-1.html\'\"></div><hr></div></div></div><div class=\"card card-fancy card-rounded card-block card-thick\" style=\"text-align: left;color: #444;\" ng-if=showmetadata><patentreport config=$parent.config></patentreport></div><div class=\"card card-fancy card-rounded card-block card-thick\" style=\"text-align: left;color: #444;\" ng-if=phd.file><button class=\"alert btn-glass btn-primary img card-rounded row\" style=\"position:relative;display:flex;display:-webkit-flex;align-items:center;align-content:center;justify-content:space-between;flex-direction:row;background-color:#35688F;padding:2px;box-shadow:inset 10px 2px 50px rgba(0,0,0,0.5);\" ng-click=main.collapse()><div style=display:flex;justify-content:flex-end;flex-direction:column;align-content:flex-end;vertical-align:middle;align-items:flex-end;><h4 class=\"card-title ng-binding display-4\" style=\"margin-bottom:0;color: #fff;\">US {{config.PNUM | number:0 }}</h4><h5 class=\"card-subtitle ng-binding\" style=color:#ddd;><span class=lead>USSN {{phd.application[\'Application Number\']}}</span></h5></div><img src=/llp_core/img/GoldLion.svg class=\"img lionlogofilter\" style=\"width:75px;height: auto;\"><div style=display:flex;flex-direction:column;align-items:flex-start;justify-content:space-around;><img src=/llp_core/img/GoldLogoLong.svg class=img style=height:45px;> <img src=/llp_core/img/GoldPhdLogoLong.svg class=img style=height:25px;padding-left:2px;></div></button><div uib-collapse=collapsereport class=\"card clearfix\" style=padding:0;margin:0;><blockquote class=\"bs-callout bs-callout-NOA\" style=\"margin: 0;\"><h4>{{phd.application[\'Title of Invention\']}}</h4><p style=font-size:10px;><cite>{{phd.application[\'First Named Inventor\']}} <small><emphasis>Issued {{phd.patent.issued | date}}</emphasis></small></cite></p></blockquote><uib-tabset active=1 class=tabbable justified=true type=pills><uib-tab active=main.tabs[0].isActive disabled=main.tabs[0].disabled select=\"main.tabs[0].isActive = true\" deselect=\"main.tabs[0].isActive = false\" style=\"margin: 0 5px;\"><uib-tab-heading class=text-Petition>PTO Metadata</uib-tab-heading><uib-tab-content ng-if=main.tabs[0].isActive><uib-tabset class=\"tabbable tabs-left\"><uib-tab><uib-tab-heading>USSN {{phd.application[\'Application Number\']}}</uib-tab-heading><uib-tabset class=tabbable><uib-tab ng-repeat=\"file in phd.file\" heading=\"{{file.label | uppercase}}\"><uib-tab-content><pre class=\"card card-block card-fancy\" ng-bind=file.file></pre></uib-tab-content></uib-tab></uib-tabset></uib-tab><uib-tab ng-if=phd.application><uib-tab-heading>APPLICATION</uib-tab-heading><uib-tab-content><table class=\"card card-block table table-striped table-hover table-condensed table-responsive\"><tbody><tr ng-repeat=\"(key, value) in phd.application\"><td><strong>{{::key}}</strong></td><td>{{::value}}</td></tr></tbody></table></uib-tab-content></uib-tab><uib-tab ng-if=phd.attorney><uib-tab-heading ng-style>ATTORNEY</uib-tab-heading><uib-tab-content><table class=\"card card-block table table-striped table-hover table-condensed table-responsive\"><tbody><tr ng-repeat=\"(key, line) in phd.attorney track by $index\"><td ng-repeat=\"(key, value) in line track by $index\">{{::value}}</td></tr></tbody></table></uib-tab-content></uib-tab><uib-tab ng-if=phd.continuity><uib-tab-heading ng-style>CONTINUITY</uib-tab-heading><uib-tab-content><table class=\"card card-block table table-striped table-condensed table-hover table-responsive\"><tbody><tr ng-repeat=\"(key,line) in phd.continuity track by $index\"><td ng-repeat=\"(key, value) in line track by $index\">{{::value}}</td></tr></tbody></table></uib-tab-content></uib-tab><uib-tab ng-if=phd.foreign><uib-tab-heading ng-style>FOREIGN PRIORITY</uib-tab-heading><uib-tab-content><table class=\"table table-stripped table-condensed table-hover table-responsive\"><thead><tr><th><strong>Country</strong></th><th><strong>Priority</strong></th><th><strong>Priority Date</strong></th></tr></thead><tbody><tr ng-repeat=\"p in phd.foreign\"><td ng-bind=\"::p[\'Country\']\"></td><td ng-bind=\"::p[\'Priority\']\"></td><td ng-bind=\"::p[\'Priority Date\'] | date\"></td></tr></tbody></table></uib-tab-content></uib-tab><uib-tab ng-if=phd.term><uib-tab-heading>PATENT TERM ADJUSTMENTS</uib-tab-heading><uib-tab-content><table class=\"card card-block table table-striped table-hover table-condensed table-responsive\"><tbody><tr ng-repeat=\"(key, line) in phd.term track by $index\"><td ng-repeat=\"(key,value) in line track by $index\">{{::value}}</td></tr></tbody></table></uib-tab-content></uib-tab><uib-tab ng-if=phd.transaction><uib-tab-heading>TRANSACTION</uib-tab-heading><uib-tab-content><table class=\"table table-striped table-hover table-condensed table-responsive\"><thead><tr><th><strong>Date</strong></th><th><strong>Transaction Description</strong></th></tr></thead><tbody><tr ng-repeat=\"trans in phd.transaction\"><td>{{::trans[\'Date\']}}</td><td>{{::trans[\'Transaction Description\']}}</td></tr></tbody></table></uib-tab-content></uib-tab><uib-tab ng-if=phd.imagefile select=\"tab.isActive = true\" deslect=\"tab.isActive = false;\"><uib-tab-heading ng-style>IMAGE FILE WRAPPER</uib-tab-heading><uib-tab-content ng-if=tab.isActive><table class=\"table table-hover table-condensed table-responsive\"><thead><tr><th ng-click=\"reverse = !reverse\" class=fa ng-class=\"{\'fa-chevron-up\': reverse,\'fa-chevron-down\': !reverse}\">#</th><th ng-click=\"main.dog = \'Mail\\ Room\\ Date\'; maybe = !maybe\"><strong>Mail Room Date<i class=fa ng-if=\"main.dog == \'Mail Room Date\'\" ng-class=\"{\'fa-chevron-up\':maybe,\'fa-chevron-down\': !maybe}\"></i></strong></th><th ng-click=\"main.dog = \'Document\\ Code\'; maybe = !maybe\"><strong>Document Code<i class=fa ng-if=\"main.dog == \'Document Code\'\" ng-class=\"{\'fa-chevron-up\':maybe,\'fa-chevron-down\': !maybe}\"></i></strong></th><th ng-click=\"main.dog = \'Document\\ Description\'; maybe = !maybe\"><strong>Document Description<i class=fa ng-if=\"main.dog == \'Document Description\'\" ng-class=\"{\'fa-chevron-up\':maybe,\'fa-chevron-down\': !maybe}\"></i></strong></th><th ng-click=\"main.dog = \'Document\\ Category\'; maybe = !maybe\"><strong>Document Category<i class=fa ng-if=\"main.dog == \'Document Category\'\" ng-class=\"{\'fa-chevron-up\':maybe,\'fa-chevron-down\': !maybe}\"></i></strong></th><th ng-click=\"main.dog = \'Page\\ Count\'; maybe = !maybe\"><strong>Page Count<i class=fa ng-if=\"main.dog == \'Page Count\'\" ng-class=\"{\'fa-chevron-up\':maybe,\'fa-chevron-down\': !maybe}\"></i></strong></th><th ng-click=\"main.dog = \'Filename\'; maybe = !maybe\"><strong>Filename<i class=fa ng-if=\"main.dog == \'Filename\'\" ng-class=\"{\'fa-chevron-up\':maybe,\'fa-chevron-down\': !maybe}\"></i></strong></th></tr></thead><tbody><tr ng-repeat=\"roarevent in phd.imagefile | filter: main.query | orderBy: main.dog : !maybe\" colorkey=\"{{roarevent[\'Document Code\']}}\"><th><a ng-click=main.pushtoqueue(roarevent)><i class=\"fa fa-file-pdf\" ng-class=\"{\'fa-check\':(roarevents[roarevent.$index].media.indexOf(\'_ocr\')>-1)}\">{{$index+1}}</i></a></th><td ng-bind=\"roarevent[\'Mail Room Date\']\"></td><td ng-bind=\"roarevent[\'Document Code\']\"></td><td ng-bind=\"roarevent[\'Document Description\']\"></td><td ng-bind=\"roarevent[\'Document Category\']\"></td><td ng-bind=\"roarevent[\'Page Count\']\"></td><td><a ng-click=main.popdoc(roarevent)>{{roarevent[\'Filename\']}}</a></td></tr></tbody></table></uib-tab-content></uib-tab></uib-tabset></uib-tab-content></uib-tab><uib-tab heading=\"Claim/Rejection History\" active=main.tabs[2].isActive select=\"main.tabs[2].isActive = true\" deselect=\"main.tabs[2].isActive = false\"><uib-tab-content><uib-tabset justified=true><uib-tab heading=\"Claim History-at-a-Glance\"><d3historytree patent={{config.PNUM}}></d3historytree></uib-tab><uib-tab heading=\"Issued Claims\"><div ng-include=\"\'{widgetsPath}/getphd/src/claimtreetab.html\'\"></div></uib-tab><uib-tab ffbase={{config.PNUM}}><uib-tab-heading>Rejections <label class=\"label label-pill label-danger\">{{item.rejectionhistory.length}}</label></uib-tab-heading><div ng-repeat=\"(key, date) in item.rejectionhistory\" class=\"card card-PTO\"><div class=card-header><h4 class=card-title>{{key | date:long}} <a class=\"fa fa-ellipsis-v fa-pull-right\" ng-click=\"this.isCollapsed = !this.isCollapsed\"></a></h4></div><div class=card-block uib-collapse=isCollapsed rejectionset set=date></div></div></uib-tab></uib-tabset></uib-tab-content></uib-tab></uib-tabset></div></div></div>");
$templateCache.put("{widgetsPath}/getphd/src/webdata.html","<form ng-submit=updateConfig()><menuconfig></menuconfig><small editable-text=config.id ng-bind=config.id onaftersave=save(config)>{{config.id}}</small><div class=\"card card-block clearfix\" collection={{config.id}}><h6>ID: {{collection.$id}}</h6><p clipboad text=\"{{\'./files/uploads/\'+collection.$id+\'.html\'}}\" onsuccess=\"alertify.success(\'copied\')\">{{\'./files/uploads/\'+collection.$id+\'.html\'}}</p><form role=form name=form ng-submit=collection.$save()><div class=row><div class=col-sm-8><div class=form-group><label for=dashboardTitle style=\"color: #006699\">Title</label><input type=text class=form-control id=dashboardTitle ng-model=collection.title required></div><div class=row><div class=\"form-group col-sm-6\"><label style=\"color: #006699\">Style</label><br><select ng-model=collection.styleClass ng-options=\"class.value as class.label for class in $root.ROARCLASSES\"></select></div><div class=\"form-group col-sm-6\"><label style=\"color: #006699\">Document Code</label><br><input ng-model=collection.doccode uib-typeahead=\"code.code as code.label for code in DOCNAMES | filter:$viewValue | limitTo:8\" typeahead-wait-ms=100></div></div><div class=row><div class=\"form-group col-sm-6\"><label style=\"color: #006699\">Tags</label><br><input ng-model=collection.matches ng-list=,></div><div class=\"form-group col-sm-6\"><label style=\"color: #006699\">Icon</label><br><select name=icon ng-model=collection.icon ng-options=\"icon.value as icon.label for icon in $root.ICONS\"></select></div></div><div class=row><div class=\"form-group col-sm-6\"><label style=\"color: #006699\">ID#</label><br><input type=text ng-model=collection.rid placeholder=# ng-model-options=\"{updateOn: \'blur\'}\"></div><div class=\"form-group col-sm-6\"><label style=\"color: #006699\">Date</label><br><input type=text ng-model=collection.date placeholder=YYYY-MM-DD ng-pattern=dddd-dd-dd ng-model-options=\"{updateOn: \'blur\'}\"></div></div><div class=form-group><label for=description style=\"color: #006699\">Description</label><br><textarea type=text class=form-control id=description ng-model=collection.description ng-model-options=\"{updateOn: \'blur\'}\"></textarea></div><div class=form-group><label for=url style=\"color: #006699\">URL</label><br><input type=text style=\"width: 100%\" ng-model=collection.media placeholder=\"Path to URL\" ng-model-options=\"{updateOn: \'blur\'}\"></div><div class=form-group><label for=thumbnail style=\"color: #006699\">Thumbnail</label><br><input type=text style=\"width: 100%\" ng-model=collection.thumbnail placeholder=\"Path to URL\" ng-model-options=\"{updateOn: \'blur\'}\"></div></div><div class=col-sm-4><roar-event id={{config.id}}></roar-event><br><input type=submit class=\"btn btn-primary\"> <button class=\"btn btn-success\" ng-click=importFile(collection) ng-if=!collection.ocrlink>OCR</button><uib-progressbar class=\"active stripped\" ng-class=\"{\'active\':(main.progress < 100)}\" ng-if=progress value=progress style=height:20px;margin:auto;position:relative;display:flex;display:-webkit-flex;align-items:center;align-content:stetch;justify-content:stretch;flex-direction:row;align-self:stretch; type={{progresstype}}></uib-progressbar></div></div><div class=row><button editable-checklist=collection.menus e-form=checklist ng-click=checklist.$show() e-ng-options=\"item as item.title for item in collection.roarlist\" e-cols=6><span class=\"fa fa-list-alt\">{{collection.roarlist}}</span></button> <i class=\"fa {{collection.icon || \'fa-file-pdf-o\'}}\" editable-text=collection.icon e-uib-typeahead=\"icon.value as icon.label for icon in $root.ICONS | filter:$viewValue | limitTo:8\" e-uib-typeahead-wait-ms=100></i><text-size-slider min=8 max=38 units=px step=2 value=8></text-size-slider></div></form></div></form>");
$templateCache.put("{widgetsPath}/getphd/src/webdataedit.html","WebdataController, webdata.html, webdataedit.html");
$templateCache.put("{widgetsPath}/getphd/src/phd/Pages.html","<hr class=\"bg-{{roarevent.styleClass}} btn hovergold img img-hover\" uib-tooltip=\"doubleclick to rebuild text\" tooltip-animation=true tooltip-placement=top style=display:inline-block;width:100%; ng-dblclick=rebuild(roarevent)><div ng-repeat=\"page in roarevent.pages\" class=\"card card-block\" style=line-height:1.5;font-size:14px;><hr class=bg-{{roarevent.styleClass}} style=display:inline-block;width:100%;><span style=\"display:flex;flex-flow:row wrap;align-content:center;justify-content:space-between;\">{{page.header}}</span><hr class=text-{{roarevent.styleClass}} style=display:inline-block;width:50%;margin-left:25%;margin-right:25%:><br><div ng-bind-html=\"page.text | matches: $parent.roarevent.matches | highlight: $parent.query | trustAsHTML\" style=\"background-color: #fff;padding: 1rem;border-radius: 0.2rem;color: #444;\"></div><hr class=text-{{roarevent.styleClass}} style=display:inline-block;width:50%;margin-left:25%;margin-right:25%:><small style=text-align:center;>{{$index}}</small></div>");
$templateCache.put("{widgetsPath}/getphd/src/phd/citation.html","<div class=\"bs-callout bs-callout-NOA\" ng-show=poodle><h4 class=card-title>{{poodle}} - {{p.title}}<a class=\"pop text-NOA showonhover fa fa-external-link\" ng-href={{p.media}}></a><a class=\"fa fa-sign-in showonhover\" ng-click=$parent.p.getdigest(poo)></a></h4><h6 class=card-subtitle>{{p.issued |date}}&nbsp;&nbsp;&nbsp;&nbsp;<strong>{{p.inventor}}</strong>&nbsp;&nbsp;&nbsp;&nbsp;<small class=\"text-muted>\">{{p.application_number || \'Application Number\'}}</small></h6></div><a ng-show=poodle ng-click=$parent.p.getdigest(poo)><img ng-src=\"{{\'/patents/US\'+poo+\'/preview\'}}\" class=\"img img-responsive img-shadow\" style=width:50px;height:50px;margin:5px;position:absolute;right:0px;></a>");
$templateCache.put("{widgetsPath}/getphd/src/phd/claimtree.html","<div ui-tree=treeOptions><ol ui-tree-nodes max-depth=6 ng-model=tree><li ui-tree-node class=\"card card-block\" ng-repeat=\"node in tree | orderBy: [\'id\',\'name\',\'text\'] : reverse\" ng-include=\"\'claim_renderer.html\'\" style=padding-right:0rem;padding-bottom:0.1rem; ng-hide=\"!treeFilter(node, query, supportedFields) && dim\"></li></ol></div><script type=text/ng-template id=claim_renderer.html><div ui-tree-handle class=\"tree-node tree-node-content\"> <div class=\"tree-node-content flextoprow \" style=\"position:relative;\"> <a class=\"btn btn-xs pull-left\" data-nodrag ng-click=\"toggle(this)\" ><span class=\"fa \" ng-class=\"{\'fa-chevron-right\': collapsed, \'fa-chevron-down\': !collapsed}\" style=\"color:steelblue;transition:all 0.25s ease;\" ng-if=\"node.children && (node.children.length > 0)\"></span></a> <!--<input type=\"text\" ng-model=\"node.text\" ng-change=\"node.$save();\" ng-model-options=\"{ updateOn: \'default blur\', debounce: {\'default\': 1000, \'blur\': 0} }\" style=\"padding: 0.5rem;color:#444;\" ng-if=\"config.editable\">--> <!--<a class=\"btn showonhover\" data-nodrag ng-if=\"config.editable\" ng-click=\"remove(this);\"><span class=\"fa fa-close text-danger \"></span></a>--> <!--<a class=\"btn \" data-nodrag ng-if=\"config.editable\" ng-click=\"toc.newsubsection(this)\" style=\"\"><span class=\"fa fa-plus text-success\"></span></a>--> <label class=\"pull-right label badge \" ng-bind=\"node.status\" ng-class=\"{\'bg-NOA\': (node.status.indexOf(\'rently\') > -1),\'bg-Applicant\': (node.status.indexOf(\'viously\') > -1)}\" style=\"position:absolute;right:5px;bottom:5px;\"></label> <div ng-bind-html=\"node.text | highlight: query \" data-nodrag ng-class=\"{\'filtered-out\':(!treeFilter(node, query, supportedFields) && dim)}\" style=\"color:#444 !important;\"></div> <!--<a class=\"gototarget btn\" data-nodrag ui-sref=\"{{parentstate}}.righttab({tabid: node.id})\" style=\"\"> <span ng-if=\"!config.editable\" class=\"pull-left\">{{node.text}}</span><i style=\"position:absolute;right:0;\">&nbsp;</i></a>--> </div> </div> <ol ui-tree-nodes=\"\" ng-model=\"node.children\" ng-class=\"{\'hidden\': collapsed}\" style=\"\"> <li class=\"card card-block img-shadow\" ng-repeat=\"node in node.children | orderBy: [\'id\',\'name\',\'text\'] : reverse\" ui-tree-node ng-include=\"\'claim_renderer.html\'\" style=\"padding-right:0rem;padding-bottom:0.1rem;padding-left:5px;\" ng-hide=\"!treeFilter(node, query, supportedFields) && dim\" > </li> </ol></script>");
$templateCache.put("{widgetsPath}/getphd/src/phd/docheader.html","<div class=\"container-fluid card bs two-col-right\"><div class=\"col-xs-4 card card-{{roarevent.styleClass}} col-1\" style=\"max-width:33%;max-height: 95vh;overflow: scroll;\"><img dynamic-background background=url({{background(roarevent.styleClass)}}) background-position=\"0 0;\" background-repeat=no-repeat ng-src=\"{{roarevent.thumbnail || background(roarevent.styleClass)}}\" class=\"img img-responsive img-shadow img-thumbnail\" ng-click=\"poodle = !poodle\"><h4>{{roarevent.title}}</h4><p class=card-text><label ng-repeat=\"match in roarevent.matches track by $index | groupBy: match\" class=\"fa fa-tag\">&nbsp;<a ng-click=getRelated(match)>{{match}}</a>&nbsp;</label></p><div uib-collapse=!poodle><div class=card-header><h4 class=\"card-title fa fa-2x fa-copy\" ng-click=\"swap = !swap\"><strong style=\"font-family: \'Helvetica\',sans-serif;\">Related Documents</strong><label class=badge>{{vents.length||ventss.length}}</label></h4></div><div uib-collapse=swap><p ng-repeat=\"vent in roarevent.roarlist as ventss\" ffbase=\"{{vent.$id || vent.$value || vent}}\" style=max-width:100%;width:100%;overflow-x:hidden;max-height:60px; class=\"bs-callout bs-callout-style bs-callout-reverse flex-row\" ng-click=getRelatedPage(vent)><a ng-href=\"{{item.mediaUrl || item.media || \'/files/uploads/\'+item.$id+\'.html\'}}\" target=fframe title=\"{{item.filename || item.file.name || item.name || item.$id}}\" date={{item.date}} class=\"fa fa-3x fa-chevron-right fa-pull-right\" style=\"opacity: 0.05;\" uib-tooltip=\"view in fframe\" ng-click=\"roarevent.showframe = !roarevent.showframe\"></a><roar-chip-a style=min-width:300px id=\"{{vent.$id || vent.$value || vent}}\"></roar-chip-a></p></div><div uib-collapse=!swap><div ng-repeat=\"vent in roarevent.roarlist as vents\" smartpanel=\"{{vent.$id || vent.$value || vent}}\"></div></div></div></div><div class=\"col-xs-8 col-2\"><div class=\"bs-callout bs-callout-reverse bs-callout-{{roarevent.styleClass}}\"><h4 ng-dblclick=\"full = !full\" ng-click=\"roarevent.showframe = !roarevent.showframe\">{{roarevent.title}}</h4><p ng-bind=roarevent.description></p><p ng-if=roardate>Dated {{roarevent.date | date }}</p><cite class=\"pull-right clearfix\">{{roarevent.filename || roarevent.file.name || roarevent.name || roarevent.$id}} &nbsp;&nbsp; <a pop target=fframe ng-href=\"{{roarevent.mediaUrl || roarevent.media || item.mediaUrl || item.media || collection.mediaUrl || collection.media}}\" title=\"{{roarevent.filename || roarevent.file.name || roarevent.name || roarevent.$id}}\" date=\"{{roarevent.date || item.date || collection.date}}\"><i class=\"fa fa-external-link\"></i></a></cite></div><iframe uib-collapse=!roarevent.showframe allowfullscreen name=fframe fullscreen={{full}} style=width:100%;height:600px;overflow:scroll;padding:5px; ng-src=\"{{roarevent.mediaUrl || roarevent.media || \'/llp_core/img/lll3.svg\'}}\"></iframe><div data-ng-transclude uib-collapse=roarevent.showframe allowfullscreen style=width:100%;height:600px;overflow:scroll;></div></div></div>");
$templateCache.put("{widgetsPath}/getphd/src/phd/epubform.html","");
$templateCache.put("{widgetsPath}/getphd/src/phd/patentReport.html","<div class=\"card card-primary card-block btn-glass drop-target\" style=\"border: 2px dashed blue;margin: 5px;\" ng-show=p.showconfig><button class=\"row btn btn-glass btn-primary img img-rounded\" style=width:100%;position:relative;display:flex;display:-webkit-flex;align-items:center;align-content:stetch;justify-content:center;flex-direction:row; ng-click=\"p.showform = !p.showform\" ng-class=\"{\'btn-success\': (main.progress == 100),\'btn-danger\':(main.progress === \'failed\')}\"><img src=https://lexlab.firebaseapp.com/img/GoldLion.svg class=\"img img-rounded pull-right\" style=max-height:100px; ng-if=!main.progress></button><div pageslide ps-open=p.showform ps-key-listener=true ps-side=left ps-class=\"card-dark btn-glass\" ps-size=400px style=overflow-x:visible;overflow-y:scroll;><div ng-include=\"\'/getphdwidget/src/phd/step-3.html\'\"></div><hr></div></div><div class=\"container-fluid card-fancy\" style=width:98%;margin:1%;height:98%;overflow:scroll; ng-hide=p.showconfig><div class=\"col-xs-4 col-sm-3 col-1\"><div class=card><img ng-src=\"{{\'/patents/\'+ (config.PNUM || (config.IPAYEAR + config.IPANUM))+\'/preview\'}}\" class=\"img img-responsive img-shadow\" style=height:auto;width:200px;z-index:1000; ng-dblclick=\"p.showform = !p.showform\"><div class=card-block><h2 class=\"card-title text-NOA\">US <strong ng-bind=\"(patent.id | number:0)||(pubapp.id | published_application)\"></strong> <a id={{patent.id}} class=\"pop text-NOA showonhover fa fa-external-link\" ng-href=\"{{patent.media || pubapp.media}}\"></a></h2><table><tbody><tr><td><label>Issued:</label></td><td>{{patent.issued|date}}</td></tr><tr><td><label>USSN</label></td><td>{{patent.application_number | application}}</td></tr><tr><td><label>Filed:</label></td><td>{{patent.dateSubmitted|date}}</td></tr><tr><td><label>Title:</label></td><td>{{patent.title}}</td></tr><tr><td><label>Inventor(s):</label></td><td>{{patent.inventor}}</td></tr><tr><td><label>Original Assignee:</label></td><td>{{patent.assignee}}</td></tr><tr><td><label>Published</label></td><td>{{patent.pub | published_application}} <a class=\"pop text-NOA showonhover fa fa-external-link\" ng-href={{pubapp.media}}></a></td></tr></tbody></table><table ng-bind-html=\"patent.classifications | trustAsHTML\"></table></div></div></div><div class=\"card col-xs-8 col-sm-9\"><div><uib-tabset class=\"panel panel-default panel-heading\" active=p.tabs[0].isActive><uib-tab heading=Abstract><div class=\"bs-callout bs-callout-reverse bs-callout-NOA\"><h4 ng-bind=patent.title>Reprehenderit aute proident cupidatat exercitation officia incididunt culpa ullamco.</h4><p ng-bind=patent.abstract>Culpa enim minim amet proident sunt aliqua ex irure ex sunt eiusmod ut consectetur. Minim esse in tempor reprehenderit esse cupidatat adipisicing ipsum eiusmod. Ea commodo nisi enim esse et ut. Minim laborum irure eiusmod Lorem consequat duis labore deserunt ullamco velit enim ut. Aliquip tempor non amet aliqua cillum sit amet commodo aliqua sint nisi. Fugiat ex irure qui et in qui velit commodo ipsum. Non cupidatat laboris culpa ipsum culpa velit.</p></div></uib-tab><uib-tab><uib-tab-heading>Drawings <label class=\"label label-pill label-success\">{{patent.drawings.length}}</label></uib-tab-heading><div class=showscroll style=\"margin: 5px 5px;display:flex;flex-wrap:wrap;flex-direction:row;\"><a ng-repeat=\"link in patent.drawings\" pop=true ng-href={{link}} class=btn style=margin:2px;><img ng-src={{patent.thumbnails[$index]}} class=\"img img-shadow\"></a></div></uib-tab><uib-tab heading=Description><uib-tab-content style=width:98%;margin:1%;height:98%;overflow:scroll;><p class=\"card card-block\" ng-bind-html=\"patent.text | trustAsHTML\"></p></uib-tab-content></uib-tab><uib-tab select=\"p.tabs[3].isActive = true\" deselect=\"p.tabs[3].isActive = false\"><uib-tab-heading>{{patent.claim_total}}&nbsp;&nbsp;Claims</uib-tab-heading><uib-tab-content class=container-fluid><header>{{patent.pub | published_application}}<label class=\"label label-pill label-info\">{{patent.application_data.claim_total}}</label></header><div class=row><div class=col-md-6><h6>{{patent.id | number:0}}</h6><fieldset class=\"material PTO\"><input ng-model=patent.query id=patterninput><hr><label>{{patent.id | number:0}}</label></fieldset></div></div><div class=row style=perspective:1000px;perspective-origin:50%50%;transformation-style:preserve-3d;><div class=col-sm-6 ng-if=config.IPAYEAR style=transform:scale3d(0.9,0.9,0.9)translateX(-40px);><d3pendingtree patent=\"{{config.IPAYEAR + config.IPANUM}}\" pattern={{patent.query}} tree=leaf style=width:350px;></d3pendingtree><claimtree tree=leaf.claims query=patent.query style=position:absolute;></claimtree></div><div class=col-sm-6 style=transform:scale3d(0.9,0.9,0.9)translateX(-40px);><d3pendingtree patent={{config.PNUM}} pattern={{patent.query}} tree=tree style=width:350px;></d3pendingtree><claimtree tree=tree.claims query=patent.query style=position:absolute;></claimtree></div></div></uib-tab-content></uib-tab><uib-tab heading=Citations><uib-tab-heading>Citations <label class=\"label label-pill label-warning\">{{patent.references.length}}</label></uib-tab-heading><uib-tab-content style=width:98%;margin:1%;height:98%;overflow:scroll;><table id=comp.backward_citations class=\"card img-shadow card-block table table-condensed table-stripped table-hover table-responsive\" style=\"color:#444 !important;\" ng-include=p.linker></table><table id=comp.forward_citations class=\"card img-shadow card-block table table-condensed table-stripped table-hover table-responsive\" style=\"color:#444 !important;\" ng-include=p.linker1></table></uib-tab-content></uib-tab><uib-tab heading=Corrections/Fees/Assignments><table ng-bind-html=\"patent.legal | highlight: query | trustAsHTML\" class=\"card img-shadow card-block table table-condensed table-stripped table-hover table-responsive\" style=\"color:#444 !important;\"></table></uib-tab></uib-tabset></div></div></div>");
$templateCache.put("{widgetsPath}/getphd/src/phd/step-1.html","<div class=\"panel panel-primary\" style=margin:0rem;margin-left:-0.75rem;overflow:visible;><div class=\"panelhead2 panel-heading btn-primary btn-glass clearfix\" style=margin-right:-1rem;border-top-left-radius:0rem;border-bottom-left-radius:0rem;border-top-right-radius:2rem;border-bottom-right-radius:2rem;display:flex;justify-content:flex-start;align-items:center;align-content:center;><div class=pull-right style=display:flex;flex-direction:column;align-items:flex-start;justify-content:space-around;align-self:flex-end;><img src=/llp_core/img/GoldLogoLong.svg class=img style=height:25px;> <img src=/llp_core/img/GoldPhdLogoLong.svg class=img style=height:10px;padding-left:2px;></div><img src=/llp_core/img/GoldLion.svg class=\"img lionlogofilter pull-left\" style=\"width:auto;height: 50px;align-self:flex-start;margin-left:75px;;margin-top:-10px;\"></div><div class=panel-body style=height:90vh;overflow:scroll;background-color:rgba(0,0,0,0.75)><blockquote class=\"bs-callout bs-callout-primary card-header\" style=margin:0; ng-hide=response><h6 class=card-title>To get a PatentPhD Report:</h6><p class=\"text-muted text-left\" style=text-align:left;font-size:10px;><ol class=\"card card-block\"><li><label>[FOR US PATENTS]</label> - enter the patent number in the space provided.<br><label>[FOR PUBLISHED US APPLICATIONS]</label> - enter the publication year and application number in the spaces provided.</li><li>Press the <code>LION</code> button.</li></ol>Patents and published applications are provided from <a pop href=\"https://www.google.com/patents/\" uib-tooltip=\"Google Patents\" tooltip-trigger=mouseenter>Google Patents</a>. Prosecution Histories are provided by the <a pop href=http://portal.uspto.gov/pair/PublicPair uib-tooltip=\"United States Patent & Trademark Office official site\" tooltip-trigger=mouseenter>USPTO</a>\'s public data-proxy repositor, <a pop href=\"http://www.reedtech.com/\" uib-tooltip=ReedTech tooltip-trigger=mouseenter>ReedTech</a>.<br>Alternatively, you may download <code>.zip</code> files of prosecution histories directly from <a pop href=\"http://www.reedtech.com/\" uib-tooltip=ReedTech tooltip-trigger=mouseenter>ReedTech</a> or <a pop href=\"https://www.google.com/patents/\" uib-tooltip=\"Google Patents\" tooltip-trigger=mouseenter>Google Patents</a> by pressing the respective buttons below. Downloaded <code>.zip</code> files can then be dropped within the dropzone (marked by the dotted border). <a pop ng-href={{info.video.url}} title={{info.video.title}} uib-tooltip={{info.video.tooltip}} class=\"fa fa-video\">Watch the tutorial</a>.</p></blockquote><blockquote class=\"bs-callout bs-callout-Applicant card-header\" style=margin:0; ng-show=response><h4>{{response.title}} <small class=text-muted>{{response.claim_total}} Claims</small></h4><p class=\"text-muted text-left\" style=text-align:left;font-size:10px;>{{response.abstract}}</p></blockquote><blockquote class=\"bs-callout bs-callout-NOA card-header\" style=text-align:left;margin:0;><h4 class=card-title style=text-align:left;font-size:12px;><label for=patentnumber class=\"card-text text-muted\"><strong>Enter US Patent Number</strong></label></h4><div class=row style=align-content:center;><fieldset class=\"material Applicant\" style=\"box-shadow:inset 0 0 10px rgba(0,0,0,0.5)\"><input type=number placeholder=\"Patent #\" ng-model=config.PNUM ng-blur=main.remoteconfig(config.PNUM)><hr><label>Enter a Patent Number</label></fieldset><a class=pull-right tooltip-trigger=mouseenter uib-tooltip=\"Download Patent\" ng-click=main.getpatentdownload(config.PNUM);><span class=\"text-NOA fa fa-2x fa-download\"></span></a></div></blockquote><blockquote class=\"bs-callout bs-callout-Petition card-header\" style=text-align:left;margin:0;><h4 class=card-title style=text-align:left;font-size:12px;><label for=publishedapplication class=\"card-text text-muted\"><strong>Enter Year of Publication and Published Application Number</strong></label></h4><div class=row style=\"align-content:center;box-shadow:inset 0 0 10px rgba(0,0,0,0.5)\"><fieldset class=\"material Petition\"><input type=text placeholder=YYYY ng-model=config.IPAYEAR maxlength=4><hr><label>Enter YYYY</label></fieldset><fieldset class=\"material Petition\"><input type=text placeholder=# ng-model=config.IPANUM ng-blur=main.remoteconfig(config.IPAYEAR+config.IPANUM)><hr><label>Enter Published Application Number</label></fieldset><a class=pull-right ng-click=\"main.getpublishedapplication(config.IPAYEAR, config.IPANUM)\"><span class=\"text-warning fa fa-download fa-2x\"></span></a></div></blockquote><blockquote class=\"bs-callout bs-callout-PTO card-header\" style=text-align:left;margin:0;><h4 class=card-title style=text-align:left;font-size:12px;><label class=\"card-text text-muted\">Enter US Application Serial Number</label></h4><div class=row style=align-content:center;><fieldset class=\"material PTO\" style=\"box-shadow:inset 0 0 10px rgba(0,0,0,0.5)\"><input type=text placeholder=\"Application #\" ng-model=config.appnum><hr><label>Enter Application Number</label></fieldset><button class=\"btn btn-default\" ng-click=\"main.toggle();main.remotezip(config.appnum, \'reedtech\');\" uib-tooltip=\"TRY AUTO DOWNLOAD **experimental\" tooltip-placement=right title=\"TRY REEDTECH AUTO DOWNLOAD* (**experimental**)\" tooltip-animation=true style=width:35px;height:35px;padding:0;><img src=/llp_core/img/GoldLion.svg style=width:35px;height:35px;filter:sepia(0.5); ng-hide=hider><span id=reedtechbutton class=\"reedtechbutton fa fa-2x text-PTO\"></span></button> <button class=\"btn btn-default fa fa-google\" ng-click=\"main.toggle();main.remotezip(config.appnum, \'google\');\" uib-tooltip=\"TRY GOOGLE AUTO DOWNLOAD **experimental\" tooltip-placement=right title=\"TRY AUTO DOWNLOAD* (**experimental**)\" tooltip-animation=true style=width:35px;height:35px;padding:0;><span id=googlebutton class=\"text-PTO fa fa-2x fa-google googlebutton\"></span></button></div><div class=row style=align-content:center;><button class=\"btn btn-default right text-PTO\" ng-click=winreed() uib-tooltip=\"DOWNLOAD FROM REEDTECH\" tooltip-placement=right title=\"DOWNLOAD FILE HISTORY FROM REEDTECH\" tooltip-animation=true><span id=reedtechbutton class=\"fa fa-2x text-PTO reedtechbutton\"></span> ReedTech</button> <button class=\"btn btn-default right text-PTO\" ng-click=wingoog() uib-tooltip=\"DOWNLOAD FROM GOOGLE\" tooltip-placement=right title=\"DOWNLOAD FILE HISTORY FROM GOOGLE\" tooltip-animation=true><span id=googlebutton class=\"googlebutton text-PTO fa fa-2x\"></span> Google</button></div></blockquote></div></div>");
$templateCache.put("{widgetsPath}/getphd/src/phd/step-2.html","<div class=\"card card-warning\" style=margin:0.5rem;><div class=card-header><h6 class=card-title>+PhD Step 2 - Download Image File Wrapper</h6></div><div class=card-text><input type=text placeholder=\"Application #\" ng-model=config.appnum><div class=row><a class=\"btn btn-warning fa fa-download\" href=https://storage.googleapis.com/uspto-pair/applications/{{config.appnum}}.zip target=_blank data-toggle=popover data-placement=bottom title=\"DOWNLOAD FROM GOOGLE\" data-content data-animation=true data-trigger=hover style=color:white; onclick=\"window.open(this.href, \'\', \'resizable=no,status=no,location=no,toolbar=no,menubar=no,fullscreen=no,scrollbars=no,dependent=yes,width=400,left=150,height=300,top=150\'); return false;\" ng-click=\"main.remotezip(config.appnum, this.href)\">from Google</a> <a class=\"btn btn-warning fa fa-download\" href=https://patents.reedtech.com/downloads/pairdownload/{{config.appnum}}.zip target=_blank data-toggle=popover data-placement=bottom title=\"DOWNLOAD FROM REEDTECH\" data-content data-animation=true data-trigger=hover style=color:white; onclick=\"window.open(this.href, \'\', \'resizable=no,status=no,location=no,toolbar=no,menubar=no,fullscreen=no,scrollbars=no,dependent=yes,width=400,left=150,height=300,top=150\'); return false;\" ng-click=\"main.remotezip(config.appnum, this.href)\">from ReedTech</a></div></div></div>");
$templateCache.put("{widgetsPath}/getphd/src/phd/step-3.html","<div class=card-block style=\"display:flex;flex-flow:column nowrap;justify-content:space-around;align-items:center;align-content:center;\"><blockquote class=\"card-header bs-callout bs-callout-NOA img-shadow\" style=text-align:left;margin:1.5vmin;><h4 class=card-title style=text-align:left;font-size:12px;><label for=patentnumber class=\"card-text text-muted\"><strong>Enter US Patent Number</strong></label></h4><fieldset class=\"material Applicant\" style=max-width:80%;><input type=text placeholder=\"Patent #\" ng-model-options=\"{updateOn:\'default blur\',debounce:{\'default\':1000,\'blur\':0}}\" ng-blur=p.remoteconfig(config.PNUM);cupdate(config); ng-model=config.PNUM><hr><label>Enter a Patent Number</label></fieldset><button class=\"input-group-addon btn btn-default right\" tooltip-trigger=mouseenter uib-tooltip=\"Download Patent\" ng-click=p.getnew(config.PNUM); ng-dblclick=p.getload(config.PNUM)><span class=\"text-success fa fa-5x fa-download\"></span></button></blockquote><blockquote class=\"card-header bs-callout bs-callout-Petition img-shadow\" style=text-align:left;margin:1.5vmin;><h4 class=card-title style=text-align:left;font-size:12px;><label for=publishedapplication class=\"card-text text-muted\"><strong>Enter Year of Publication and Published Application Number</strong></label></h4><div class=input-group><fieldset class=\"material Petition\" style=max-width:33%;><input type=text placeholder=YYYY ng-model=config.IPAYEAR maxlength=4><hr><label>YEAR</label></fieldset><fieldset class=\"material Petition\" style=max-width:50%;><input type=text placeholder=\"# PA\" ng-model=config.IPANUM ng-blur=cupdate(config)><hr><label>NUMBER</label></fieldset><button class=\"input-group-addon btn btn-default\" ng-click=cupdate(config);p.getdata(config.IPAYEAR+config.IPANUM)><span class=\"text-warning fa fa-download fa-5x\"></span></button></div></blockquote></div>");
$templateCache.put("{widgetsPath}/getphd/src/roarevent/roarchip-popover.html","<div class=\"row flex-row card\"><img class=\"img img-thumbnail img-shadow img-responsive\" ng-src=\"{{roarevent.thumbnail || item.thumbnail || collection.thumbnail || \'https://placehold.it/150x150/000/ffa&text=\' + roarevent.rid}}\" width=150px height=150px><div class=\"bs-callout bs-callout-reverse bs-callout-{{roarevent.styleClass||item.styleClass}}\"><h4>{{roarevent.title||item.title}}</h4><p ng-bind=roarevent.description||item.description></p><p ng-if=roardate>Dated {{roarevent.date||item.date | date }}</p><cite class=\"pull-right clearfix\">{{roarevent.filename || item.filename || roarevent.file.name || item.file.name || roarevent.name || item.name }}&nbsp;&nbsp;<a pop ng-href=\"{{roarevent.mediaUrl || roarevent.media || item.mediaUrl || item.media || collection.mediaUrl || collection.media}}\" target=fframe title=\"{{roarevent.filename || roarevent.file.name || roarevent.name || roarevent.$id}}\" date=\"{{roarevent.date || item.date || collection.date}}\"><i class=\"fa fa-external-link\"></i></a></cite></div></div>");
$templateCache.put("{widgetsPath}/getphd/src/roarevent/roarchip.html","<div ng-class=\"{\'active\': roarevent.isSelected || item.isSelected}\" class=\"animated roarchip\" data-context-menu=/llp_core/partials/contextmenus/roarcontextmenu.html data-toggle=popover uib-popover-template=\"\'{widgetsPath}/getphd/src/roarevent/roarchip-popover.html\'\" popover-placement=right popover-animation=true popover-trigger=mouseenter><button class=\"rlabel btn-{{roarevent.styleClass || item.styleClass || \'btn-glass btn-dark\'}} fa {{roarevent.icon || item.icon}} pull-left\" ng-href=\"{roarevent.mediaUrl || item.mediaUrl || roarevent.media || item.media || \'/files/uploads/\' + roarevent.$id + \'.html\'}\" ng-click=roar.show(roarevent.$id||item.$id) ng-dblclick=roar.openFullscreen(roarevent||item) style=\"max-width:50px;width:50px;height:50px;max-height:50px;margin: 1.5px;\" uib-tooltip=\"open media\" tooltip-animation=true tooltip-position=right>{{roarevent.rid || item.rid}}</button><h6 class=rflag ng-href=/files/uploads/{{roarevent.$id||item.$id}}.html ng-click=roar.present(roarevent||item) ng-dblclick=roar.openFullscreen(roarevent||item) uib-tooltip=\"open LEXPAD\" tooltip-animation=true tooltip-position=bottom><strong>{{roarevent.title || item.title || roarevent.name || item.name}}</strong></h6><cite class=pull-right style=position:absolute;right:0.3rem;bottom:0.1rem;font-size:12px;>{{roarevent.date||item.date | date}}</cite><ng-transclude style=position:absolute;right:0.3rem;></ng-transclude></div>");
$templateCache.put("{widgetsPath}/getphd/src/roarevent/roarevent.html","<div id={{roarevent.$id}} ng-class=\"{\'active\': roarevent.isSelected}\" class=\"_info animated staggered slideLeft\" style=margin:2.5px;><div class=flex-top-row><button ng-href={{roarevent.mediaUrl}} ng-click=roar.show(roarevent) class=rbutton ng-class=\"{\'active\': roarevent.isSelected}\">{{roarevent.rid}}</button><h6 class=rflag data-context-menu=/llp_core/partials/contextmenus/roarcontextmenu.html><strong>{{roarevent.title}}</strong><br></h6><div class=\"panel r-action\" layout=column layout-align=\"space-between center\" style=border-radius:5px;><button clipboard text=roarevent.media on-copied=\"toastr.success(\'copied!\');\" on-error=\"toastr.error(err,\'uh oh!\')\" class=\"rmodal fa {{roarevent.statusIcon || roarevent.icon || \'fa-bars\'}} {{roarevent.statusIconStyle}}\" uib-tooltip=\"copy media url\" tooltip-trigger=mouseenter tooltip-placement=right style=background-color:transparent;border-width:0px;></button> <button id=empiretogglebutton ng-class=\"{\'btn-warning fa-futbol-o\': roarevent.isSelected == false,\'btn-flat fa-minus\': roarevent.isSelected == null, \'btn-success fa-ge\': roarevent.isSelected == true}\" class=\"fade btn btn-default btn-xs fa r-doc\" ng-click=roar.toggleSelection(roarevent,$scope.$parent.$parent.collection)></button> <button class=\"fade btn btn-default btn-xs fa fa-copy r-doc\" ng-click=roar.copytoclipboard(roarevent) uib-tooltip=\"copy to clipboard\" tooltip-trigger=mouseenter tooltip-placement=left></button> <button class=\"fade btn btn-default btn-xs fa fa-chevron-left text-primary\" ng-click=roar.moveLeft(roarevent) uib-tooltip=\"move left\" tooltip-trigger=mouseenter tooltip-placement=left></button> <button class=\"fade btn btn-default btn-xs fa fa-chevron-right text-primary\" ng-click=roar.moveRight(roarevent) uib-tooltip=\"move right\" tooltip-trigger=mouseenter tooltip-placement=left></button> <button class=\"fade btn btn-default btn-xs fa fa-remove r-delete\" ng-click=roar.movetorecyclebin(roarevent) uib-tooltip=remove tooltip-trigger=mouseenter tooltip-placement=left></button></div></div><button class=\"rlabel btn-{{roarevent.styleClass || \'dark btn-glass\'}}\" ng-href=/files/uploads/{{roarevent.$id}}.html ng-click=roar.present(roarevent) ng-dblclick=\"roarevent.thumbnail = roarevent.mediaUrl\" style=border-width:3px; dynamic-background background-image={{roarevent.thumbnail}} background-size=contain><p class=cut-with-dots style=max-height:10vh>{{roarevent.description}}</p></button><ng-transclude style=z-index:100><uib-rating ng-model=roarevent.rate max=max rating-states=ratingStates read-only=true on-hover=hoveringOver(value) on-leave=\"overStar = null\" titles=\"[\'added\',\'ocred\',\'parsed\',\'tagged\',\'done\']\" aria-labelledby=default-rating class=showonhover ng-class=\"{\'text-danger\': (roarevent.rate == 1),\'text-warning\':(roarevent.rate == 2),\'text-info\':(roarevent.rate == 3),\'text-primary\':(roarevent.rate == 4),\'text-success\':(roarevent.rate == 5)}\"><span class=label ng-class=\"{\'label-warning\': percent<30, \'label-info\': percent>=30 && percent<70, \'label-success\': percent>=70}\" ng-show=\"overStar && !isReadonly\">{{percent}}%</span></uib-rating></ng-transclude></div>");}]);
app
  .directive('roarevents', ["ROARevents", "ROARevent", "Collection", "filepickerService", "$roarevent", "$filter", "Collections", "toastr", "bytesFilter", "ckstarter", "ckender", "$http", "$stateParams", "$rootScope", function (ROARevents, ROARevent, Collection, filepickerService, $roarevent, $filter, Collections, toastr, bytesFilter, ckstarter, ckender,$http, $stateParams, $rootScope) {
    return {
      restrict: 'A',
      priority: 1,
      terminal:true,
      scope: false,
      link: function ($scope, $el, $attr, fn) {
        var id = $attr.roarevents
        var newarray = []
        Collection(id).$loaded().then(function (collection) {
          angular.forEach(collection.roarlist, function (rid, key) {
            var revent = ROARevent(rid)
            newarray.push(revent)
          })
          $scope.roarevents = newarray
        })

        $scope.sortList = {
          accept: function (sourceItemHandleScope, destSortableScope) {
            return true
          }, // override to determine drag is allowed or not. default is true.
          itemMoved: function (eventObj) {
            var moveSuccess, moveFailure
            /**
             * Action to perform after move success.
             */
            moveSuccess = function () {}

            /**
             * Action to perform on move failure.
             * remove the item from destination Column.
             * insert the item again in original Column.
             */
            moveFailure = function () {
              eventObj.dest.sortableScope.removeItem(eventObj.dest.index)
              eventObj.source.itemScope.sortableScope.insertItem(eventObj.source.index, eventObj.source.itemScope.task)
            }
          },
          orderChanged: function (eventObj) { /*Do what you want*/
            angular.forEach(eventObj.dest.sortableScope.modelValue, function (value, key) {
              value.sortOrder = key
              value.$save()
            })
            $scope.roarevents = eventObj.dest.sortableScope.modelValue
          //  alertify.log('Order changed to '+ eventObj.dest.index)
          // $scope.tabs[eventObj.source.index].sortOrder = eventObj.dest.index
          // $scope.tabs[eventObj.source.index].$save()
          // buildtabs($scope.page)
          // alertify.success('save called!')
          // // eventObj.dest.sortableScope[eventObj.dest.index].$save()
          /*
          source:
                         index: original index before move.
                         itemScope: original item scope before move.
                         sortableScope: original sortable list scope.
                    dest: index
                         index: index after move.
                         sortableScope: destination sortable scope.
           */
          }
        /*containment: '#board'//optional param.
        clone: true //optional param for clone feature.
        allowDuplicates: false //optional param allows duplicates to be dropped.*/
        }
        $scope.clearAll = function(roarevents){
          angular.forEach(roarevents, function(key, roarevent){

            key.$ref().child('isSelected').set(false);
          })
        };
        $scope.selectAll = function(roarevents){
          angular.forEach(roarevents, function(key, roarevent){
            key.$ref().child('isSelected').set(true);
          })
        };
        $scope.addToCollection = function(roarevents, collection){
              angular.forEach(roarevents, function (key, roarevent) {
                if (key.isSelected == true) {
                  //newcollection.$ref().child('roarlist').child(key.$id).set(key.$id);
                  angular.forEach(key.roarlist, function($value, $key){
                    collection.$ref().child('roarlist').child($key).set($key);
                    firebase.database().ref().child('matters').child($stateParams.matterId).child('roarlist').child($key).set($key);
                    firebase.database().ref().child('matters').child($stateParams.matterId).child('projects').child($stateParams.pId).child('roarlist').child($key).set($key);
                    // Project($stateParams.pId).$loaded().then(function(project){
                    //   project.$ref().child('roarlist').child($key).set($key);
                    // })
                    // Matter($stateParams.matterId).$loaded().then(function(matter){
                    //   matter.$ref().child('roarlist').child($key).set($key);
                    // })
                  });
                  console.log(key.$id)
                  toastr.info(key.$id);
                }else {}
              });
        };
        $scope.createSubcollection = function (roarevents, collection) {
          var arra = []
          var date = new Date()

          var newid = date.getTime()
          // Matter($stateParams.matterId).$loaded().then(function(matter){
          //       matter.$ref().child('roarlist').child(newid).set(newid);
          //     });
          //     Project($stateParams.pId).$loaded().then(function(project){
          //       project.$ref().child('roarlist').child(newid).set(newid);
          //     })
          firebase.database().ref().child('matters').child($stateParams.matterId).child('roarlist').child(newid).set(newid);
          firebase.database().ref().child('matters').child($stateParams.matterId).child('projects').child($stateParams.pId).child('roarlist').child(newid).set(newid);
                    
          var newEvent = Collection(newid).$loaded()
            .then(function (newcollection) {
              
              newcollection.title = 'new collection';
              newcollection.styleClass="PTO";
              newcollection.id = newid;
              newcollection.ownerid = $rootScope.authData.uid;
              newcollection.matterid ={};
              newcollection.matterid[$stateParams.matterId]= $stateParams.matterId; 
              newcollection.rows = [{
                columns: [{
                styleClass: 'col-sm-12',
                widgets: [{
                  styleClass: 'card',
                  type: 'pagebuilder',
                  config: {
                    id: newid,
                    url: '/llp_core/modules/roarmap/directive/roargrid/roargrid.html'
                    }
                  }]
                }]
              }];
              newcollection.thumbnail = '/llp_core/img/GoldLion.svg';
              newcollection.mediaUrl = '/llp_core/img/GoldLion.svg';
              newcollection.$save()

              collection.roarlist[newid] = newid
              collection.$save()
              angular.forEach(roarevents, function (key, roarevent) {
                if (key.isSelected == true) {
                  newcollection.$ref().child('roarlist').child(key.$id).set(key.$id);

                  console.log(key.$id)
                  toastr.info(key.$id);
                }else {}
              })
           })
          }
        $scope.pickMulti = function () {
          filepickerService.pickMultiple(
            {storeTo: {
    location: 's3'
  },
              services: ['BOX', 'COMPUTER', 'DROPBOX', 'EVERNOTE', 'FACEBOOK', 'GMAIL', 'IMAGE_SEARCH', 'FLICKR', 'FTP', 'GITHUB', 'GOOGLE_DRIVE', 'SKYDRIVE', 'PICASA', 'URL', 'WEBCAM', 'INSTAGRAM', 'VIDEO', 'ALFRESCO', 'CUSTOMSOURCE', 'CLOUDDRIVE', 'IMGUR', 'CLOUDAPP', 'CONVERT', 'AUDIO']
            },
            // {
            //  services: ['BOX', 'COMPUTER', 'DROPBOX', 'EVERNOTE', 'INSTAGRAM', 'IMAGE_SEARCH', 'FTP', 'GITHUB', 'GOOGLE_DRIVE', 'URL', 'VIDEO', 'CUSTOMSOURCE', 'CONVERT']
            // },
            function (Blobs) {
              angular.forEach(Blobs, function (blob, key) {
                console.log(key, JSON.stringify(blob))
              })
              console.log(JSON.stringify(Blobs))
              var files1 = Blobs
              $scope.uploadtocollection(files1, $scope.collection)
            },
            function (error) {
              console.log(JSON.stringify(error))
            }

          )
        }
        $scope.uploadtocollection = function (files1, collection) {
          if (angular.isArray(files1)) {
            // debugger
            var test = new RegExp('^[0-9]{8}-[0-9]{4}-[0-9]{2}-[0-9]{2}-[0-9]{5}-')
            // var files2 = $filter('filter')(files1, test)
            // debugger
            var files2 = []
            // var files3 = $filter('filter')(files1, !test)
            var files3 = files1
            // debugger
            var arr = []
            angular.forEach(collection.roarlist, function (key, value) {
              arr.push(value)
            })

            /*  angular.forEach(files2, function (file, key) {
                $roarevent(file).then(function (roarevent) {
                  var d = new Date()
                  var dd = d.getTime()
                  // var cards = Collections()
                  var ref = Collection(dd).$ref()
                  ref.set(roarevent, function (err) {
                    var id = dd
                    console.log('added record with id ' + id)
                    //                  toastr.success("added record with id " + id)
                    alertify.success('added record with id' + id)

                    arr.push(id)
                    var colref = Collection($scope.collection.id).$ref()
                    colref.child('roarlist').child(id).set(id)
                    ref.child('rows').child('0').child('columns').child('1').child('widgets').child('0').child('config').child('id').set(id)
                    ref.child('rows').child('0').child('columns').child('1').child('widgets').child('1').child('config').child('id').set(id)
                    ref.child('rows').child('0').child('columns').child('1').child('widgets').child('2').child('config').child('id').set(id)

                    ref.update({
                      id: id,
                      parentId: $scope.collection.$id,
                      time: firebase.database.ServerValue.TIMESTAMP,
                      rid: arr.length

                    })

                    alertify.log('id: ' + id + ' collectionId: ' + $scope.collection.$id)
                  })
                })
              })*/
            angular.forEach(files3, function (file, key) {

              // var reg = new RegExp('([0-9]{4}-[0-9]{2}-[0-9]{2})\s?-?\sD[I]?\s[0-9]{3}-?[0-9]{0,2}\s-?\s?|([0-9]{4}-[0-9]{2}-[0-9]{2})\s?-\s')
              // var reg1 = new RegExp('/([0-9]{4}-[0-9]{2}-[0-9]{2})\s?-?\sD[I]?\s[0-9]{3}-?[0-9]{0,2}\s-?\s?|([0-9]{4}-[0-9]{2}-[0-9]{2})\s?-\s/')
              // var reg2 = new RegExp('DI?\s[0-9]{1,3}-?[0-9]{1,3}')
              var filename = file.name || file.filename
              // var filedate = filename.slice(0, filename.indexOf(" "))
              // var docname = filename.slice(filename.indexOf("D ") ? filename.indexOf("D ") + 5 : filename.indexOf(" "), filename.indexOf(".pdf"))
              // var docnum = filename.slice(filename.indexOf("D ") ? filename.indexOf("D ") + 1 : filename.indexOf(" "), filename.indexOf("D ") ? filename.indexOf("D ") + 5 : filename.indexOf(" "))
              var roarevent = file
              // roarevent.media = file.url.replace('/view', '/preview').slice(0, file.url.indexOf('='))
              var newurl = $http({
                method: 'POST',
                url: '/roar/api/shorten',
                data: { url: file.url}
              }).then(function successCallback(response) {
                  // this callback will be called asynchronously
                  // when the response is available
                  var d = new Date()
                  var dd = d.getTime() + arr.length

                  console.log(response);
                  roarevent.mediaUrl = response.data.shortUrl;
                  roarevent.thumbnail = response.data.shortUrl;
                  roarevent.content = ckstarter +'<doc-header class="card img-shadow" roarid="' + dd + '" collection="' + dd + '"><img class="img img-responsive img-shadow" ng-src="{{collection.mediaUrl}}"/><div ng-bind-html="collection.notes"></div><p>Insert Text Here</p></doc-header>' + ckender
                  // roarevent.iconUrl = file.iconUrl
                  // roarevent.uuid = file.id
                  
                  roarevent.title = filename
                  roarevent.name = filename
                  roarevent.key = file.key || filename
                  // roarevent.mimeType = file.mimeType
                  roarevent.description = file.id + ' of ' + files3.length + ' (' + bytesFilter(file.size) + ')'
                  roarevent.collectionId = $scope.collection.$id
                  roarevent.parentId = $scope.collection.$id
                  roarevent.ownerid = $rootScope.authData.uid;
                  roarevent.matterid ={};
                  roarevent.matterid[$stateParams.matterId] = $stateParams.matterId ; 
                  // $scope.roarevent.date = filedate
                  roarevent.rid = '-'
                  roarevent.file = file
                  var m = new Date()
                  var n = m.getTime()
                  roarevent.date = n
                  roarevent.rows = [
                    {
                      columns: [{cid: n + 9,styleClass: 'col-sm-6',widgets: [{ config: { height: '90vh', url: roarevent.media || '' }, styleClass: roarevent.styleClass || 'btn-dark', title: 'LexFrame', type: 'iframe', wid: n + 100 }]},
                        { cid: n + 10, styleClass: 'col-sm-6', widgets: [{ config: { id: 'PROMISE', height: '90vh' }, styleClass: roarevent.styleClass || 'btn-dark', title: 'LexPad', type: 'ckwidget', wid: n + 1010 }, { config: { id: 'PROMISE', height: '90vh' }, styleClass: roarevent.styleClass || 'btn-dark', title: 'Metadata', type: 'metadata', wid: n + 101 }, { config: { id: 'PROMISE', height: '90vh' }, styleClass: roarevent.styleClass || 'btn-dark', title: 'Text', type: 'text', wid: n + 105 }] }
    
                      ]
                    }
                  ]
                  roarevent.structure = '6-6'
                  
                  // var cards = Collections()
                  var ref = Collection(dd).$ref()
                  ref.set(roarevent, function (err) {
                    var id = dd
                    console.log(arr.length + ' added record with id ' + id, key)
                    //                  toastr.success("added record with id " + id)
                    alertify.success(arr.length + ' added record with id' + id, key)
    
                    arr.push(id)
                    var colref = Collection($scope.collection.id).$ref()
                    colref.child('roarlist').child(id).set(id);
                    firebase.database().ref().child('matters').child($stateParams.matterId).child('roarlist').child(id).set(id);
                    firebase.database().ref().child('matters').child($stateParams.matterId).child('projects').child($stateParams.pId).child('roarlist').child(id).set(id);
                    
                    // Matter($stateParams.matterId).$loaded().then(function(matter){
                    //   matter.$ref().child('roarlist').child(id).set(id);
                    // });
                    // Project($stateParams.pId).$loaded().then(function(project){
                    //   project.$ref().child('roarlist').child(id).set(id);
                    // })
                    ref.child('rows').child('0').child('columns').child('1').child('widgets').child('0').child('config').child('id').set(id)
                    ref.child('rows').child('0').child('columns').child('1').child('widgets').child('1').child('config').child('id').set(id)
                    ref.child('rows').child('0').child('columns').child('1').child('widgets').child('2').child('config').child('id').set(id)
    
                    ref.update({
                      id: id,
                      parentId: $scope.collection.$id,
                      time: firebase.database.ServerValue.TIMESTAMP,
                      rid: arr.length
    
                    })
                    console.log(arr.length + ' added record with id ' + id, key)
                    toastr.success(arr.length + ' added record with id ' + id, key)
                    
                    if (angular.isUndefined($scope.collection.roarlist)) {
                      var roarlist = []
                      angular.extend($scope.collection, {
                        roarlist: roarlist
                      })
                      $scope.collection.roarlist.push(id)
                      ref.update({
                        id: id,
                        parentId: $scope.collection.$id,
                        time: firebase.database.ServerValue.TIMESTAMP,
                        rid: $scope.collection.roarlist.length
                      })
                    } else {
                      $scope.collection.roarlist.push(id)
                      ref.update({
                        id: id,
                        parentId: $scope.collection.$id,
                        time: firebase.database.ServerValue.TIMESTAMP,
                        rid: $scope.collection.roarlist.length
                      })
                    }
                    alertify.log('id: ' + id + ' collectionId: ' + $scope.collection.$id)
                  })
                }, function errorCallback(response) {
                  // called asynchronously if an error occurs
                  // or server returns response with an error status.
                  console.log(response);
                  roarevent.mediaUrl = file.url;
                  roarevent.media = response.data.shortUrl;
                  roarevent.thumbnail = response.data.shortUrl;
                  roarevent.content = ckstarter +'<doc-header class="card img-shadow" roarid="' + dd + '" collection="' + dd + '"><img class="img img-responsive img-shadow" ng-src="{{collection.mediaUrl}}"/><div ng-bind-html="collection.notes"></div><p>Insert Text Here</p></doc-header>' + ckender
                  // roarevent.iconUrl = file.iconUrl
                  // roarevent.uuid = file.id
                  roarevent.title = filename
                  roarevent.name = filename
                  roarevent.key = file.key || filename
                  // roarevent.mimeType = file.mimeType
                  roarevent.description = file.id + ' of ' + files3.length + ' (' + bytesFilter(file.size) + ')'
                  roarevent.collectionId = $scope.collection.$id
                  roarevent.parentId = $scope.collection.$id
                  roarevent.ownerid = $rootScope.authData.uid;
                  roarevent.matterid ={};
                  roarevent.matterid[$stateParams.matterId]= $stateParams.matterId;
                  // $scope.roarevent.date = filedate
                  roarevent.rid = '-'
                  roarevent.file = file
                  var m = new Date()
                  var n = m.getTime()
                  roarevent.date = n
                  roarevent.rows = [
                    {
                      columns: [{cid: n + 9,styleClass: 'col-sm-6',widgets: [{ config: { height: '90vh', url: roarevent.media || '' }, styleClass: roarevent.styleClass || 'btn-dark', title: 'LexFrame', type: 'iframe', wid: n + 100 }]},
                        { cid: n + 10, styleClass: 'col-sm-6', widgets: [{ config: { id: 'PROMISE', height: '90vh' }, styleClass: roarevent.styleClass || 'btn-dark', title: 'LexPad', type: 'ckwidget', wid: n + 1010 }, { config: { id: 'PROMISE', height: '90vh' }, styleClass: roarevent.styleClass || 'btn-dark', title: 'Metadata', type: 'metadata', wid: n + 101 }, { config: { id: 'PROMISE', height: '90vh' }, styleClass: roarevent.styleClass || 'btn-dark', title: 'Text', type: 'text', wid: n + 105 }] }
    
                      ]
                    }
                  ]
                  roarevent.structure = '6-6'
                  var d = new Date()
                  var dd = d.getTime() + arr.length
                  // var cards = Collections()
                  var ref = Collection(dd).$ref()
                  ref.set(roarevent, function (err) {
                    var id = dd
                    console.log(arr.length + ' added record with id ' + id, key)
                    //                  toastr.success("added record with id " + id)
                    alertify.success(arr.length + ' added record with id' + id, key)
    
                    arr.push(id)
                    var colref = Collection($scope.collection.id).$ref()
                    colref.child('roarlist').child(id).set(id)
                    firebase.database().ref().child('matters').child($stateParams.matterId).child('roarlist').child(id).set(id);
                    firebase.database().ref().child('matters').child($stateParams.matterId).child('projects').child($stateParams.pId).child('roarlist').child(id).set(id);
                    
                    // Matter($stateParams.matterId).$loaded().then(function(matter){
                    //   matter.$ref().child('roarlist').child(id).set(id);
                    // });
                    // Project($stateParams.pId).$loaded().then(function(project){
                    //   project.$ref().child('roarlist').child(id).set(id);
                    // });
                    ref.child('rows').child('0').child('columns').child('1').child('widgets').child('0').child('config').child('id').set(id)
                    ref.child('rows').child('0').child('columns').child('1').child('widgets').child('1').child('config').child('id').set(id)
                    ref.child('rows').child('0').child('columns').child('1').child('widgets').child('2').child('config').child('id').set(id)
    
                    ref.update({
                      id: id,
                      parentId: $scope.collection.$id,
                      time: firebase.database.ServerValue.TIMESTAMP,
                      rid: arr.length
    
                    })
                    console.log(arr.length + ' added record with id ' + id, key)
                    toastr.success(arr.length + ' added record with id ' + id, key)
                    
                    if (angular.isUndefined($scope.collection.roarlist)) {
                      var roarlist = []
                      angular.extend($scope.collection, {
                        roarlist: roarlist
                      })
                      $scope.collection.roarlist.push(id)
                      ref.update({
                        id: id,
                        parentId: $scope.collection.$id,
                        time: firebase.database.ServerValue.TIMESTAMP,
                        rid: $scope.collection.roarlist.length
                      })
                    } else {
                      $scope.collection.roarlist.push(id)
                      ref.update({
                        id: id,
                        parentId: $scope.collection.$id,
                        time: firebase.database.ServerValue.TIMESTAMP,
                        rid: $scope.collection.roarlist.length
                      })
                    }
                    alertify.log('id: ' + id + ' collectionId: ' + $scope.collection.$id)
                  })
                });
              // roarevent.media = 'https://wileyrein.lexlab.io/files/InequitableConduct/'+file.filename||file.name
              
                // alertify.success('added record with id' + id)
                //   ref.update({
                //       id: id,
                //       parentId: $scope.collection.$id,
                //       time: firebase.database.ServerValue.TIMESTAMP
                //   })
                
            })
          } else {
            var array = []
            // debugger
            array.push(files1)
            // debugger
            $scope.uploadtocollection(array, $scope.collection)
          }
        }
      }
    }
  }])
.factory('$roar', ["$http", "$stateParams", "$rootScope", "ckstarter", "ckender", "Collection", "bytesFilter", function($http,$stateParams,$rootScope, ckstarter,ckender,Collection,bytesFilter){
  return function(file){
    
     var filename = file.name || file.filename
              var arr = [];
              // var filedate = filename.slice(0, filename.indexOf(" "))
              // var docname = filename.slice(filename.indexOf("D ") ? filename.indexOf("D ") + 5 : filename.indexOf(" "), filename.indexOf(".pdf"))
              // var docnum = filename.slice(filename.indexOf("D ") ? filename.indexOf("D ") + 1 : filename.indexOf(" "), filename.indexOf("D ") ? filename.indexOf("D ") + 5 : filename.indexOf(" "))
              var roarevent = {
                url: '/files/uploads/'+ file.name
              }
             
              // roarevent.media = file.url.replace('/view', '/preview').slice(0, file.url.indexOf('='))
              var newurl = $http({
                method: 'POST',
                url: '/roar/api/shorten',
                data: { url: roarevent.url}
              }).then(function successCallback(response) {
                  // this callback will be called asynchronously
                  // when the response is available
                  var d = new Date()
                  var dd = d.getTime() + arr.length

                  console.log(response);
                  
                  roarevent.mediaUrl = response.data.shortUrl;
                  roarevent.thumbnail = response.data.shortUrl;
                  roarevent.content = ckstarter +'<doc-header class="card img-shadow" roarid="' + dd + '" collection="' + dd + '"><img class="img img-responsive img-shadow" ng-src="{{collection.mediaUrl}}"/><div ng-bind-html="collection.notes"></div><p>Insert Text Here</p></doc-header>' + ckender
                  // roarevent.iconUrl = file.iconUrl
                  // roarevent.uuid = file.id
                  
                  roarevent.title = filename
                  roarevent.name = filename
                  roarevent.key = file.key || file.name || ''
                  // roarevent.mimeType = file.mimeType
                  roarevent.description = file.id + ' of ' + arr.length + ' (' + bytesFilter(file.size) + ')'
                  //roarevent.collectionId = $scope.collection.$id
                  //roarevent.parentId = $scope.collection.$id
                  roarevent.ownerid = $rootScope.authData.uid;
                  roarevent.matterid ={};
                  roarevent.matterid[$stateParams.matterId] = $stateParams.matterId ; 
                  // $scope.roarevent.date = filedate
                  roarevent.rid = '-'
                  roarevent.file = file
                  var m = new Date()
                  var n = m.getTime()
                  roarevent.date = n
                  roarevent.rows = [
                    {
                      columns: [{cid: n + 9,styleClass: 'col-sm-6',widgets: [{ config: { height: '90vh', url: roarevent.media || '' }, styleClass: roarevent.styleClass || 'btn-dark', title: 'LexFrame', type: 'iframe', wid: n + 100 }]},
                        { cid: n + 10, styleClass: 'col-sm-6', widgets: [{ config: { id: 'PROMISE', height: '90vh' }, styleClass: roarevent.styleClass || 'btn-dark', title: 'LexPad', type: 'ckwidget', wid: n + 1010 }, { config: { id: 'PROMISE', height: '90vh' }, styleClass: roarevent.styleClass || 'btn-dark', title: 'Metadata', type: 'metadata', wid: n + 101 }, { config: { id: 'PROMISE', height: '90vh' }, styleClass: roarevent.styleClass || 'btn-dark', title: 'Text', type: 'text', wid: n + 105 }] }
    
                      ]
                    }
                  ]
                  roarevent.structure = '6-6'
                  
                  // var cards = Collections()
                  var ref = Collection(dd).$ref()
                  ref.set(roarevent, function (err) {
                    var id = dd
                    console.log(arr.length + ' added record with id ' + id)
                    //                  toastr.success("added record with id " + id)
                    alertify.success(arr.length + ' added record with id' + id)
    
                    arr.push(id)
                    //var colref = Collection($scope.collection.id).$ref()
                    //colref.child('roarlist').child(id).set(id);
                    firebase.database().ref().child('matters').child($stateParams.matterId).child('roarlist').child(id).set(id);
                    firebase.database().ref().child('matters').child($stateParams.matterId).child('projects').child($stateParams.pId).child('roarlist').child(id).set(id);
                    
                    // Matter($stateParams.matterId).$loaded().then(function(matter){
                    //   matter.$ref().child('roarlist').child(id).set(id);
                    // });
                    // Project($stateParams.pId).$loaded().then(function(project){
                    //   project.$ref().child('roarlist').child(id).set(id);
                    // })
                    ref.child('rows').child('0').child('columns').child('1').child('widgets').child('0').child('config').child('id').set(id)
                    ref.child('rows').child('0').child('columns').child('1').child('widgets').child('1').child('config').child('id').set(id)
                    ref.child('rows').child('0').child('columns').child('1').child('widgets').child('2').child('config').child('id').set(id)
    
                    ref.update({
                      id: id,
                      //parentId: $scope.collection.$id,
                      time: firebase.database.ServerValue.TIMESTAMP,
                      rid: arr.length
    
                    })
                    console.log(arr.length + ' added record with id ' + id)
                    toastr.success(arr.length + ' added record with id ' + id)
                    
                    if (angular.isUndefined($scope.collection.roarlist)) {
                      var roarlist = []
                      angular.extend($scope.collection, {
                        roarlist: roarlist
                      })
                      //$scope.collection.roarlist.push(id)
                      ref.update({
                        id: id,
                        //parentId: $scope.collection.$id,
                        time: firebase.database.ServerValue.TIMESTAMP,
                        //rid: $scope.collection.roarlist.length
                      })
                    } else {
                      //$scope.collection.roarlist.push(id)
                      ref.update({
                        id: id,
                        //parentId: $scope.collection.$id,
                        time: firebase.database.ServerValue.TIMESTAMP,
                        //rid: $scope.collection.roarlist.length
                      })
                    }
                    alertify.log('id: ' + id + ' collectionId: ' + $scope.collection.$id)
                  })
                }, function errorCallback(response) {
                  // called asynchronously if an error occurs
                  // or server returns response with an error status.
                  console.log(response);
                  roarevent.media = file.url;
                  roarevent.mediaUrl = response.data.shortUrl;
                  roarevent.thumbnail = response.data.shortUrl;
                  roarevent.content = ckstarter +'<doc-header class="card img-shadow" roarid="' + dd + '" collection="' + dd + '"><img class="img img-responsive img-shadow" ng-src="{{collection.mediaUrl}}"/><div ng-bind-html="collection.notes"></div><p>Insert Text Here</p></doc-header>' + ckender
                  // roarevent.iconUrl = file.iconUrl
                  // roarevent.uuid = file.id
                  roarevent.title = filename
                  roarevent.name = filename
                  roarevent.key = file.key || filename
                  // roarevent.mimeType = file.mimeType
                  roarevent.description = file.id + ' of ' + files3.length + ' (' + bytesFilter(file.size) + ')'
                  //roarevent.collectionId = $scope.collection.$id
                  //roarevent.parentId = $scope.collection.$id
                  roarevent.ownerid = $rootScope.authData.uid;
                  roarevent.matterid ={};
                  roarevent.matterid[$stateParams.matterId]= $stateParams.matterId;
                  // $scope.roarevent.date = filedate
                  roarevent.rid = '-'
                  roarevent.file = file
                  var m = new Date()
                  var n = m.getTime()
                  roarevent.date = n
                  roarevent.rows = [
                    {
                      columns: [{cid: n + 9,styleClass: 'col-sm-6',widgets: [{ config: { height: '90vh', url: roarevent.media || '' }, styleClass: roarevent.styleClass || 'btn-dark', title: 'LexFrame', type: 'iframe', wid: n + 100 }]},
                        { cid: n + 10, styleClass: 'col-sm-6', widgets: [{ config: { id: 'PROMISE', height: '90vh' }, styleClass: roarevent.styleClass || 'btn-dark', title: 'LexPad', type: 'ckwidget', wid: n + 1010 }, { config: { id: 'PROMISE', height: '90vh' }, styleClass: roarevent.styleClass || 'btn-dark', title: 'Metadata', type: 'metadata', wid: n + 101 }, { config: { id: 'PROMISE', height: '90vh' }, styleClass: roarevent.styleClass || 'btn-dark', title: 'Text', type: 'text', wid: n + 105 }] }
    
                      ]
                    }
                  ]
                  roarevent.structure = '6-6'
                  var d = new Date()
                  var dd = d.getTime() + arr.length
                  // var cards = Collections()
                  var ref = Collection(dd).$ref()
                  ref.set(roarevent, function (err) {
                    var id = dd
                    console.log(arr.length + ' added record with id ' + id, key)
                    //                  toastr.success("added record with id " + id)
                    alertify.success(arr.length + ' added record with id' + id, key)
    
                    arr.push(id)
                    //var colref = Collection($scope.collection.id).$ref()
                    //colref.child('roarlist').child(id).set(id)
                    firebase.database().ref().child('matters').child($stateParams.matterId).child('roarlist').child(id).set(id);
                    firebase.database().ref().child('matters').child($stateParams.matterId).child('projects').child($stateParams.pId).child('roarlist').child(id).set(id);
                    
                    // Matter($stateParams.matterId).$loaded().then(function(matter){
                    //   matter.$ref().child('roarlist').child(id).set(id);
                    // });
                    // Project($stateParams.pId).$loaded().then(function(project){
                    //   project.$ref().child('roarlist').child(id).set(id);
                    // });
                    ref.child('rows').child('0').child('columns').child('1').child('widgets').child('0').child('config').child('id').set(id)
                    ref.child('rows').child('0').child('columns').child('1').child('widgets').child('1').child('config').child('id').set(id)
                    ref.child('rows').child('0').child('columns').child('1').child('widgets').child('2').child('config').child('id').set(id)
    
                    ref.update({
                      id: id,
                      //parentId: $scope.collection.$id,
                      time: firebase.database.ServerValue.TIMESTAMP,
                      rid: arr.length
    
                    })
                    console.log(arr.length + ' added record with id ' + id, key)
                    toastr.success(arr.length + ' added record with id ' + id, key)
                    
                    if (angular.isUndefined($scope.collection.roarlist)) {
                      var roarlist = []
                      angular.extend($scope.collection, {
                        roarlist: roarlist
                      })
                      //$scope.collection.roarlist.push(id)
                      ref.update({
                        id: id,
                        //parentId: $scope.collection.$id,
                        time: firebase.database.ServerValue.TIMESTAMP,
                        //rid: $scope.collection.roarlist.length
                      })
                    } else {
                      //$scope.collection.roarlist.push(id)
                      ref.update({
                        id: id,
                        //parentId: $scope.collection.$id,
                        time: firebase.database.ServerValue.TIMESTAMP,
                        //rid: $scope.collection.roarlist.length
                      })
                    }
                    alertify.log('id: ' + id + ' collectionId: ' + $scope.collection.$id)
                  })
                });
  }
}])
  .directive('roarevt', ["$http", "$rootScope", "$compile", "$controller", "$document", "$animate", function ($http, $rootScope, $compile, $controller, $document, $animate) {
    return {
      restrict: 'E',
      transclude: true,
            priority: 1,
      terminal:true,
      templateUrl: '/llp_core/modules/roarmap/directive/roarevent/roarevent.html',
      scope: {
        roarevent: '='
      },
      controller: 'ROARevtCtrl',
      bindToController: true,
      controllerAs: 'roar',
      link: function ($scope, $el, $attr, fn) {
        // var POPUP_OFFSET, activePopup, activeTooltip, clearPopup, clearPopups, clearSelection, clearTooltip, createAnnotation, loadAnnotationPopup, onAnnotationsChange, onClick, onMouseEnter, onMouseLeave, onSelect, popupTemplateData, removeAnnotation, removeChildren, tooltipTemplateData, _ref
        //       POPUP_OFFSET = (_ref = $scope.popupOffset) != null ? _ref : 10
        //       activePopup = null
        //       activeTooltip = null
        //       popupTemplateData = ""
        //       tooltipTemplateData = ""
        // ROARevent($scope.roarevent.$id).$bindTo($scope, 'roarevent')

        $el.on('mouseenter', function () {
          $animate.addClass($el, 'active')
        })
        $el.on('mouseleave', function () {
          $animate.removeClass($el, 'active')
        })
        // if (roarevent.name.indexOf('.svg') > -1) {
        //     $el.child('.rlabel').css({ 'background': 'url(' + roarevent.media + ');', 'background-size': 'contain' })
        // }
        //      $el.on('click', function(event) {
        //          $target = angular.element(event.target)

        //          // targetId = (attrId = $target.attr("id")) != null ? parseInt(attrId, 10) : void 0
        //          // if ((activePopup != null) && activePopup.scope.roarevent.$id === targetId) {
        //       //        clearPopup()
        //       //        return
        //       //      }
        //            clearPopups()

        //          loadAnnotationPopup($scope.roarevent, $target, false)
        //      })
        //     var  clearPopup = function() {
        //            var tId
        //            if (activePopup == null) {
        //              return
        //            }
        //            tId = activePopup.scope.roarevent.$id
        //            return activePopup.destroy(function() {
        //              if (activePopup.scope.roarevent.$id === tId) {
        //                return activePopup = null
        //              }
        //            })
        //          }
        //     var   clearTooltip = function() {
        //            var tooltip
        //            tooltip = activeTooltip
        //            if (tooltip == null) {
        //              return
        //            }
        //            return tooltip.destroy(function() {
        //              if (activeTooltip === tooltip) {
        //                return activeTooltip = null
        //              }
        //            })
        //          }

        //     var  clearPopups = function() {
        //            clearPopup()
        //            return clearTooltip()
        //          }
        //         $scope.$on("$destroy", clearPopups)
        //         $scope.$on("roarevent.clearPopups", clearPopups)
        //         if ($scope.popupTemplateUrl) {
        //           $http.get($scope.popupTemplateUrl).then(function(response) {
        //             return popupTemplateData = response.data
        //           })
        //         }
        //         if ($scope.tooltipTemplateUrl) {
        //           $http.get($scope.tooltipTemplateUrl).then(function(response) {
        //             return tooltipTemplateData = response.data
        //           })
        //         }
        //    var clearSelection = function() {
        //          if (document.selection) {
        //            return document.selection.empty()
        //          } else if (window.getSelection && window.getSelection().empty) {
        //            return window.getSelection().empty()
        //          } else if (window.getSelection && window.getSelection().removeAllRanges) {
        //            return window.getSelection().removeAllRanges()
        //          }
        //        }
        //    var  onClick = function(event) {
        //          var $target, roarevent, attrId, targetId
        //          if (popupTemplateData.length === 0) {
        //            return
        //          }
        //          $target = angular.element(event.target)
        //          targetId = (attrId = $target.attr("data-annotation-id")) != null ? parseInt(attrId, 10) : void 0
        //          if (targetId == null) {
        //            return
        //          }
        //          if ((activePopup != null) && activePopup.scope.roarevent.$id === targetId) {
        //            clearPopup()
        //            return
        //          }
        //          // roarevent = getAnnotationById($scope.annotations, targetId)
        //          roarevent = $scope.roarevent
        //          clearPopups()
        //          return loadAnnotationPopup(roarevent, $target, false)
        //        }
        // var loadAnnotationPopup = function(roarevent, anchor, isNew) {
        //          var controller, locals, popup
        //          popup = new ROAReventPopup({
        //            scope: $rootScope.$new(),
        //            callbacks: {
        //              show: $scope.onPopupShow,
        //              hide: $scope.onPopupHide
        //            },
        //            template: "<div id='" + $scope.roarevent.$id + "' class=' ng-annotate-text-popup' />",
        //            positionClass: "ng-annotate-text-popup-docked ng-annotate-text-popup-docked-{{position}}",
        //            $anchor: anchor,
        //            offset: POPUP_OFFSET
        //          })
        //          popup.scope.$isNew = isNew
        //          popup.scope.roarevent = roarevent
        //          popup.scope.$readonly = $scope.readonly
        //          popup.scope.$reject = function() {
        //            // removeAnnotation(annotation.id, $scope.annotations)
        //            // if ($scope.onAnnotateDelete != null) {
        //            //   $scope.onAnnotateDelete(annotation)
        //            // }

        //            $document.remove(popup)
        //            clearPopup()
        //          }
        //          popup.scope.$close = function() {
        //            // if ($scope.onAnnotate != null) {
        //            //   $scope.onAnnotate(popup.scope.$annotation)
        //            // }

        //            $document.remove(popup)
        //            clearPopup()
        //          }
        //          activePopup = popup
        //          locals = {
        //            $scope: popup.scope,
        //            $template: popupTemplateData
        //          }
        //          popup.$el.html(locals.$template)
        //          popup.$el.appendTo("body")
        //          if ($scope.popupController) {
        //            controller = $controller($scope.popupController, locals)
        //            popup.$el.data("$ngControllerController", controller)
        //            popup.$el.children().data("$ngControllerController", controller)
        //          }
        //          $compile(popup.$el)(popup.scope)
        //          popup.scope.$apply()
        //          return popup.show()
        //        }

      }
    }
  }])
  .directive('roarEvent', ["$http", "Popup", "$rootScope", "$compile", "$controller", "$document", "$animate", "ROARevent", "Collection", function ($http, Popup, $rootScope, $compile, $controller, $document, $animate, ROARevent, Collection) {
    return {
      restrict: 'EA',
      transclude: true,
      priority: 1,
      terminal:true,
      templateUrl: '{widgetsPath}/getphd/src/roarevent/roarevent.html',
      scope: {
        animation: '=?',
        editable: '=?',
        hovered: '=?'

      },
      controller: 'ROARChipCtrl',
      bindToController: true,
      controllerAs: 'roar',
      link: function ($scope, $el, $attr, fn) {
        // if (!angular.isUndefined($attr.local)) {
        //   $scope.roarevent = $attr.local
        // } else if (!angular.isUndefined($attr.id)) {
        //   var id = $attr.id
        //   var roarevent = Collection(id)
        //   roarevent.$bindTo($scope, 'roarevent')
        // } else {
        //   $scope.roarevent = $scope.$parent.collection
        // }
        var id = $attr.id;
        var roare = ROARevent(id);
        roare.$bindTo($scope,'roarevent');
        $el.on('mouseenter', function () {
          $animate.addClass($el, 'active')
          angular.element($el).addClass('active')
        })
        $el.on('mouseleave', function () {
          $animate.removeClass($el, 'active')
          angular.element($el).removeClass('active')
        })
      }
    }
  }])
  .directive('roarChipA', ["$http", "Popup", "$rootScope", "$compile", "$controller", "$document", "$animate", "ROARevent", "ngDialog", "Collection", function ($http, Popup, $rootScope, $compile, $controller, $document, $animate, ROARevent, ngDialog, Collection) {
    return {
      restrict: 'EA',
      templateUrl: '{widgetsPath}/getphd/src/roarevent/roarchip.html',
      transclude: true,
      controller: 'ROARChipCtrl',
      controllerAs: 'roar',
      bindToController: true,
      priority: 1,
      terminal:true,
      scope: {
        //roarevent: '=?'
      },
      link: function ($scope, $el, $attr, fn) {
        var id = $attr.id
        Collection(id).$loaded().then(function(col){
          $scope.roarevent = col;
          $scope.item = col;
        });
        var id = $attr.id;
        var roare = ROARevent(id);
        roare.$bindTo($scope,'roarevent');
//        roarevent.$bindTo($scope, 'roarevent')
        //$scope.roarevent = roarevent;
        $el.on('mouseenter', function () {
          $animate.addClass($el, 'active')
        })
        $el.on('mouseleave', function () {
          $animate.removeClass($el, 'active')
        })
      }
    }
  }])
  .controller('ROARevtCtrl', ["$compile", "$templateCache", "$scope", "pdfToPlainText", "$http", "ckstarter", "ckender", "Popup", function ($compile, $templateCache, $scope, pdfToPlainText, $http, ckstarter, ckender, Popup) {
    var roar = this
    // roar.show = function(eventId) {
    //   //  Collection(eventId).$loaded().then(function(event) {
    //         if (event.document_type !== 'html') {
    //             var divpanel = angular.element('<div/>').attr('id', event.id || event.$id).attr('class', 'issuedocpanel  stacker').css({'z-index':'10000'})
    //             //var header = angular.element('<h4 class="splash">' + event.rid + ' - ' + event.name + '<span class="fa fa-close btn btn-xs btn-danger" style="float: right;" onclick="$(this).parent().parent().remove()"></span></h4><h6>' + event.media + '</h6>')
    //             var header = $templateCache.get("{widgetsPath}/getphd/src/titleTemplate.html")

    //             var skope = angular.element('<iframe/>').attr('id',event.id || event.$id).attr('height','680px').attr('src', event.media)

    //             angular.element('body').append($compile(divpanel.append(header).append(skope))($scope))
    //             $('.issuedocpanel').draggable({
    //                 stack: '.stacker',
    //                 handle: 'h4'
    //             }).resizable()
    //         }

    //     })
    $scope.roarevent = $scope.$parent.roarevent

    roar.present = function (roarevent) {
      //   var po = new Popup()

      $http.get(roarevent.ocrmedia).then(function (resp) {
        console.log(resp.data)
        roarevent.plaintext = resp.data
        var card = '<div class="col-xs-4 col-1"><div class="card"><img src="https://placehold.it/300x225/640002/fff/&text=R" class="img img-responsive img-shadow"/><div class="card-block"><h4 class="card-title">Title</h4><p class="card-text">Do nulla id sint reprehenderit esse. Quis sunt duis consequat sit sint duis officia veniam qui. Occaecat ipsum esse officia qui et reprehenderit tempor. Aliqua officia qui occaecat veniam commodo esse magna fugiat reprehenderit duis. Adipisicing laborum ex commodo velit.</p></div></div></div>'

        var wraphead = ckstarter
        var old = 'https://placehold.it/250x208/4682b4/fff/&text=' + roarevent.rid
        var wraptail = ckender
        var frametemplate = 'http://localhost:3000/patents/US' + $('roargrid').attr('patent')
        var apptemplate = '<div class="container-fluid two-col-right">' +
          '<div class="row">' +
          '<div id="col-xs-9" class="col-xs-9" ><div class="bs-callout bs-callout-Applicant"><h4>' + roarevent.title + '</h4><p>Filed</p><cite>' + roarevent.filename + '&nbsp;&nbsp;<a href="' + roarevent.media + '" target="fframe"><i class="fa fa-external-link"></i></a></cite>' + roarevent.plaintext + '</div></div>' +
          '<div id="col-xs-3" class="col-xs-3"  onmouseenter="$(\'#col-xs-9\').toggleClass(\'col-xs-9 col-xs-3\');$(\'#col-xs-3\').toggleClass(\'col-xs-9 col-xs-3\')"><p><iframe name="fframe" src="/patents/8382456" class="img img-responsive img-shadow" style="background-image:url(' + old + ');"></iframe></p></div>' + '<script src="/lexlab-starter/public/jQuery-Plugin-For-Auto-Resizing-iFrame-iFrame-Resizer/js/iframeResizer.min.js"></script>' +
          '</div>' +
          '</div><p>&nbsp;</p>'

        roarevent.content = wraphead + apptemplate + wraptail
        var divpanel = angular.element('<div/>').attr('class', 'issuedocpanel  stacker').css({
          'z-index': '10000'
        })
        // var header = angular.element('<h4 class="splash">' + event.rid + ' - ' + event.name + '<span class="fa fa-close btn btn-xs btn-danger" style="float: right;" onclick="$(this).parent().parent().remove()"></span></h4><h6>' + event.media + '</h6>')
        var header = $templateCache.get('{widgetsPath}/getphd/src/titleTemplate.html')
        var skope = angular.element('<iframe class="" style="width:100%;height:100%;z-index:0;"/>').attr('src', window.URL.createObjectURL(new Blob([roarevent.content], {
          name: 'roarevent.html',
          type: 'text/html'
        })))
           var skope = angular.element('<iframe/>').attr('srcdoc', ('<!DOCTYPE html><html><head></head><body><div class="card card-default">' + angular.fromJson(event.content) + '</div></body></html>'))
           var skope = $sce.trustAsHtml(roarevent.content)

         angular.element(roarevent.content).append(resp.data)

        angular.element('body').append($compile(divpanel.append(header).append(skope))($scope))
        $('.issuedocpanel').draggable({
          stack: '.stacker',
          handle: 'h4'
        }).resizable()
      })
    }
  }])
  .directive('pop', ['$compile', '$templateCache', 'ROARevent', function ($compile, $templateCache, ROARevent) {
    return {
      restrict: 'AC',
      link: function ($scope, $el, $attr, $ctrl) {
        var popdoc = function () {
          var uurl = $attr.href
          var newid = uurl.slice(uurl.lastIndexOf('/') + 1, uurl.lastIndexOf('.'))
          var roar = ROARevent(newid)
          $scope.roarevent = roar
          var divpanel = angular.element('<div/>').attr('class', 'issuedocpanel stacker panel panel-{{roarevent.styleClass}}').css({'margin': '10px'})
          // var header = angular.element('<h4 class="splash">' + event.rid + ' - ' + event.name + '<span class="fa fa-close btn btn-xs btn-danger" style="float: right;" onclick="$(this).parent().parent().remove()"></span></h4><h6>' + event.media + '</h6>')
          var header = $templateCache.get('{widgetsPath}/getphd/src/titleTemplate.html')
          // var header = $('#docheader').html()
          var skope = angular.element('<iframe/>').attr('height', '60vh').attr('src', $attr.href)

          angular.element('body').append($compile(divpanel.append(header).append(skope))($scope))
          $('.issuedocpanel').draggable({
            // scroll: true,
            // scrollSpeed: 250,
            // scrollSensitivity: 200,
            // snap: 'body',
            cursor: 'move',
            //containment: 'parent',
            stack: '.stacker',
            handle: '.panel-heading'

          }).resizable()
          window.postMessage($attr.href, '_top')
          $('img').on('dblclick', function (e) {
            $('.issuedocpanel').remove()
            $scope.$destroy()
          })
        }
        $el.on('click', function (e) {
          e.preventDefault()
          popdoc()
        })
      }
    }
  }])
  .controller('ROARChipCtrl', ["$aside", "toastr", "$uibModal", "$compile", "Collection", "$scope", "$templateCache", "ngDialog", "$ACTIVEROAR", "$window", "$rootScope", "PROJECT", "$stateParams", "$sce", "Fullscreen", "$clipboard", "ROARevents", "$http", function ($aside, toastr, $uibModal, $compile, Collection, $scope, $templateCache, ngDialog, $ACTIVEROAR, $window, $rootScope, PROJECT, $stateParams, $sce, Fullscreen, $clipboard, ROARevents, $http) {
    var roar = this
    $scope.max = 5
    $scope.hoveringOver = function (value) {
      $scope.overStar = value
      $scope.percent = 100 * (value / $scope.max)
    }
    $scope.ratingStates = [{
      stateOn: 'glyphicon-ok',
      stateOff: 'glyphicon-unchecked'
    }, {
      stateOn: 'glyphicon-font',
      stateOff: 'glyphicon-unchecked'
    }, {
      stateOn: 'glyphicon-duplicate',
      stateOff: 'glyphicon-unchecked'
    }, {
      stateOn: 'glyphicon-tags',
      stateOff: 'glyphicon-unchecked'
    }, {
      stateOn: 'glyphicon-ok',
      stateOff: 'glyphicon-unchecked'
    }]
    $scope.openpreview = function (draft) {
      $window.htmltoload = draft.content
      $window.open('javascript:void( (function(){' +
        'document.open();' +
        'document.write(window.opener.htmltoload);' +
        'document.close();' +
        'window.opener.htmltoload = null;' +
        '})() )', null, 'toolbar=yes,location=no,status=yes,menubar=yes,scrollbars=yes,resizable=yes,width=700,height=700')
    }

    $scope.remove = function () {
      $(this).parent().parent().remove()
    }
    $scope.alert = function (msg) {
      alertify.alert(msg)
      roar.newnoteonroar($scope.roarevent)
    }
    $scope.openFullScreen = function (roareventid) {
      // alertify.log(roareventid)
       //Fullscreen.toggleAll()
      if ($scope.full !== true) {
        $('.issuedocpanel').css({
          'position': 'absolute',
          'top': '0px',
          'left': '0px',
          'bottom': '0px',
          'right': '0px',
          'width': '100%',
          'z-index': '100000',
          'transition': 'all 0.5s ease-out'
        })
        $('.fa-expand').addClass('fa-compress').removeClass('fa-expand')
        $scope.full = true
      } else {
        $('.issuedocpanel').css({
          'position': 'absolute',
          'top': '6rem',
          'left': '10rem',
          'bottom': null,
          'right': null,
          'width': 'initial',
          'z-index': '9999',
          'transition': 'all 0.5s ease-out'
        })

        $('.fa-compress').addClass('fa-expand').removeClass('fa-compress')
        $scope.fullscreen = false
      }
    //                roar.openmodal(this)
    }
    $scope.edit = function () {
      roar.copytoclipboard($scope.roarevent)
    }
    $scope.$window = $window
    $scope.close = function () {
      ngDialog.closeThisDialog()
    }
    $scope.saveDraft = function (note) {
      if (angular.isUndefined($scope.roarevent.notes)) {
        $scope.roarevent.notes = []
        $scope.roarevent.notes.push(note)
      } else {
        $scope.roarevent.notes.push(note)
      }
      $scope.closeThisDialog()
    }
    roar.newnoteonroar = function (roarevent) {
      $aside.open({
        templateUrl: '/llp_core/partials/statusboard/partials/newCard.html',
        controller: 'ROARChipCtrl',
        placement: 'top',
        size: 'lg'
      })

    // ngDialog.open({
    //     data: roarevent,
    //     scope: $scope,
    //     template: '/llp_core/partials/statusboard/partials/newCard.html',
    //     controller: 'ROARChipCtrl',
    //     className: 'ngdialog-theme-inline',
    //     plain: false,
    //     closeByEscape: true,
    //     closeByDocument: true,
    //     showClose: true,
    //     appendTo: false
    // })
    }
    roar.show = function (roarevent) {
      var ref = Collection(roarevent.$id || roarevent).$ref()
      //             if(angular.isUndefined(window) ){

      //                 var BrowserWindow = require('electron').remote

      // var win = new BrowserWindow({width: 800, height: 600})
      // win.loadURL(event.media)
      //             }else{
      Collection(roarevent.$id || roarevent).$loaded().then(function (event) {
        if (event.document_type !== 'html') {
          var divpanel = angular.element('<div/>').attr('id', event.id || event.$id).attr('class', "issuedocpanel panel panel-{{roarevent.styleClass || 'default'}} stacker ").css({
            'z-index': '10000','width': '45vw','margin': '10px','height': '90vh'
          })
          // var header = angular.element('<h4 class="splash">' + event.rid + ' - ' + event.name + '<span class="fa fa-close btn btn-xs btn-danger" style="float: right;" onclick="$(this).parent().parent().remove()"></span></h4><h6>' + event.media + '</h6>')

          var header = $templateCache.get('{widgetsPath}/getphd/src/titleTemplate.html')

          var skope = angular.element('<iframe allowfullscreen  fullscreen="{{full}}" uib-collapse="isCollapsed" name="fframe"/>').attr('id', event.id || event.$id).attr('height', '90vh').attr('width', '100%').attr('src', event.mediaUrl || event.media || event.thumbnail || 'https://placehold.it/500x500/000/ffa&text=X').attr('class', 'panel-body')

          angular.element('body').append($compile(divpanel.append(header).append(skope))($scope))
          $(divpanel).draggable({
            stack: '.stacker',
            handle: 'h4'
          }).resizable()
          interact(divpanel,{ignoreFrom:'.card'}).draggable().on('doubletap', function (event) {
            event.currentTarget.remove();
            //event.currentTarget.classList.remove('rotate');
            event.preventDefault();
          });
           interact('.issuedocpanel', {    ignoreFrom: '.card'})
              .draggable({
                onmove: window.dragMoveListener
              })
              .resizable({
                preserveAspectRatio: false,
                edges: { left: true, right: true, bottom: true, top: false }
              })
              .on('doubletap', function (event) {
                event.currentTarget.remove();
                //event.currentTarget.classList.remove('rotate');
                event.preventDefault();
              });
        }
      })
      // }

    }
    roar.present = function (roarevent) {
      var ref = Collection(roarevent.$id).$ref()

      var divpanel = angular.element('<div/>').attr('id', roarevent.id || roarevent.$id).attr('class', "issuedocpanel panel panel-{{roarevent.styleClass || 'default'}} stacker").css({
        'z-index': '100000','width': '45vw','margin': '10px','height': '90vh'
      })
      // var header = angular.element('<h4 class="splash">' + event.rid + ' - ' + event.name + '<span class="fa fa-close btn btn-xs btn-danger" style="float: right;" onclick="$(this).parent().parent().remove()"></span></h4><h6>' + event.media + '</h6>')
      var header = $templateCache.get('{widgetsPath}/getphd/src/titleTemplate.html')
      var skope = angular.element('<iframe allowfullscreen fullscreen="{{full}}" uib-collapse="isCollapsed" class="panel-body" style="width:100%;height:600px;z-index:0;" ng-attr-srcdoc="{{roarevent.content || collection.content || \'<p>Nothing to see here</p>\' | trustAsHTML}}"  name="fframe"/>').attr('id', roarevent.id || roarevent.$id)
      // var skope = angular.element('<iframe/>').attr('srcdoc', ('<!DOCTYPE html><html><head></head><body><div class="card card-default">' + angular.fromJson(event.content) + '</div></body></html>'))
      // var skope = $sce.trustAsHtml(roarevent.content)
      angular.element('body').append($compile(divpanel.append(header).append(skope))($scope))
      $(divpanel).draggable({
        scroll: true,
        // scrollSpeed: 250,
        // scrollSensitivity: 200,
        // snap: 'body',
        cursor: 'move',
        // containment: 'body',
        stack: '.stacker',
        handle: 'h4'

      }).resizable()
      interact(divpanel,{ignoreFrom:'.card'}).draggable().on('doubletap', function (event) {
            event.currentTarget.remove();
            //event.currentTarget.classList.remove('rotate');
            event.preventDefault();
          });
      /*interact('.issuedocpanel',{    ignoreFrom: '.card'
})
  .draggable({
    // inertia: true,
    // autoScroll: true,

    onmove: window.dragMoveListener
  })
  .resizable({
    preserveAspectRatio: true,
    edges: { left: true, right: true, bottom: true, top: true }
  })
  .on('doubletap', function (event) {
    event.currentTarget.remove();
    //event.currentTarget.classList.remove('rotate');
    event.preventDefault();
  });*/

      //     var divpanel = angular.element('<div/>').attr('id',roarevent.id || roarevent.$id).attr('class', 'issuedocpanel  stacker').css({'z-index':'10000'})
      //     //var header = angular.element('<h4 class="splash">' + event.rid + ' - ' + event.name + '<span class="fa fa-close btn btn-xs btn-danger" style="float: right;" onclick="$(this).parent().parent().remove()"></span></h4><h6>' + event.media + '</h6>')
      //     var header = $templateCache.get("{widgetsPath}/getphd/src/titleTemplate.html")
      //    var skope = angular.element('<iframe class="" style="width:100%;height:100%;z-index:0;"/>').attr('id',roarevent.id || roarevent.$id).attr('src', window.URL.createObjectURL(new Blob([roarevent.newtext],{name:roarevent.Filename+'.html',type:'text/html'})))
      //     //var skope = angular.element('<iframe/>').attr('srcdoc', ('<!DOCTYPE html><html><head></head><body><div class="card card-default">' + angular.fromJson(event.content) + '</div></body></html>'))
      //    // var skope = $sce.trustAsHtml(roarevent.content)
      //     angular.element('body').append($compile(divpanel.append(header).append(skope))($scope))
      //     $('.issuedocpanel').draggable({
      //         stack: '.stacker',
      //         handle: 'h4'
      //     }).resizable()

    }
    //     }
    // }
    roar.copytoclipboard = function (item) {
      $clipboard().$add(item.id || item).then(function (ref) {
        toastr.info('COPY TO CLIPBOARD')
      })
      // $rootScope.$broadcast('COPYTOCLIPBOARD', item.id || item)
      //   alertify.log('COPY to CLIPBOARD', item.id || item)

      //   Collection(thing.id || thing).$loaded().then(function (item) {
      //       $rootScope.$broadcast('COPYTOCLIPBOARD', item)
      //       alertify.log('COPY to CLIPBOARD', item)

      //   })

    }
    $scope.$on('adfWidgetAdded', function (event, name, model, widget) {
      widget.titleTemplateUrl = '{widgetsPath}/testwidget/src/title.html'
      widget.styleClass = model.styleClass || 'panel-dark'
      widget.frameless = false
      widget.reload = true

      model.config.id = model.$id
      console.log(model)
      Collection(model.$id).$loaded().then(function (collection) {
        collection.$save(model)
      })
      alertify.success('widget added! model saved!')
    })

    $scope.$on('adfDashboardChanged', function (event, name, model) {
      console.log('event', event)
      console.log('name', name)
      console.log('model', model)

      Collection(model.$id).$loaded().then(function (collection) {
        collection.$save(model)
      })
    })

    roar.openmodal = function (roarevent) {
      $ACTIVEROAR.roarevent = roarevent
      console.log('opening', roarevent)
      var editScope = $scope.$new()
      var opts = {
        scope: editScope,
        template: '<div class=modal-header>  <h4 class=modal-title>{{definition.title}}</h4> <div class="pull-right widget-icons"> <a href title="Reload Widget Content" ng-if=widget.reload ng-click=reload()> <i class="glyphicon glyphicon-refresh"></i> </a> <a href title=close ng-click=closeDialog()> <i class="glyphicon glyphicon-remove"></i> </a> </div></div> <div class=modal-body><adf-dashboard id="{{roarevent.id}}" name="{{roarevent.id}}"  title-template-url="\'/llp_core/modules/lionlawlabs/partial/projectdashboard/tabs/memo/title.html\'" enable-confirm-delete="true" structure="{{roarevent.structure}}" adf-model="roarevent" class="" editable="true" style="overflow:scroll;" /></adf-dashboard></div><div class="modal-footer"><button type="button" class="btn btn-primary" ng-click="closeDialog()">Close</button></div>',
        backdrop: 'static',
        size: 'lg'
      }

      var instance = $uibModal.open(opts)

      editScope.closeDialog = function () {
        instance.close()
        editScope.$destroy()
      }

      // ngDialog.open({
      //     template: '<adf-dashboard id="{{roarevent.id}}" name="{{roarevent.id}}"  title-template-url="\'/llp_core/modules/lionlawlabs/partial/projectdashboard/tabs/memo/title.html\'" enable-confirm-delete="true" structure="{{roarevent.structure}}" adf-model="roarevent" class="" editable="true" style="overflow:scroll;" /></adf-dashboard>',
      //     controller: 'xlDialogIdCtrl',
      //     data: roarevent,
      //     scope: $scope,
      //     className: 'ngdialog-theme-xl',
      //     closeByDocument: true,
      //     closeByEscape: true,
      //     plain: true,
      //     showClose: false,
      //     closeByEscape: true,
      //     closeByNavigation: false,

      //     preCloseCallback: false

    // })
    }
    roar.moveLeft = function (roarevent) {
      var b = roarevent.sortOrder || 0
      $scope.roarevent.sortOrder = b - 1
      $scope.roarevent.$save()
    }
    roar.moveRight = function (roarevent) {
      var a = roarevent.sortOrder || 0
      $scope.roarevent.sortOrder = a + 1
      $scope.roarevent.$save()
    }
    roar.toggleSelection = function (roarevent, col) {
      /*
      if(col.selected[roarevent.$id] == roarevent.$id){
        roarevent.isSelected = false
        col.selected[roarevent.$id] = null
        roarevent.$save()
        col.$save()
      }
      else{
        roarevent.isSelected = true
        col.selected[roarevent.$id] = roarevent.$id
        roarevent.$save()
        col.$save()
      }*/
      roarevent.isSelected = !roarevent.isSelected
      roarevent.$save()
    }
    roar.movetorecyclebin = function (tab) {
      //  $scope.roarevents.$remove(tab)
      // var roarevents = ROARevents($scope.collection.$id)
      // roarevents.$remove(tab)
      var pageid = $stateParams.tabid || $stateParams.pageid || $stateParams.pId
      var id = tab.id || tab
      Collection(pageid).$ref().child('roarlist').child(id).set(null)
      PROJECT($stateParams.pId).$ref().child('log').push({
        message: ' removed ',
        recordid: tab.id || tab,
        contextid: $stateParams.pageid,
        messagetwo: ' from ',
        user: $rootScope.authData.uid,
        styleClass: 'danger',
        timestamp: firebase.database.ServerValue.TIMESTAMP
      })
    }
    $scope.note = function (roarevent) {
      return roar.newnoteonroar(roarevent)
    }
    roar.collapse = function () {
      $scope.isCollapsed = !$scope.isCollapsed
      $('#' + roarevent.$id).css({'height': '75px'})
    }
    roar.rightmenu = {
      icon: 'fa-chevron-down',
      items: [{
        icon: 'fa-external-link',
        label: 'Pop out',
        styleClass: '',
        onClick: function (roarevent) {
          return roar.show(roarevent.id)
        }
      }, {
        icon: 'fa-copy',
        label: 'Copy to Clipboard',
        styleClass: '',
        onClick: function (roarevent) {
          return roar.copytoclipboard(roarevent)
        }
      }, {
        icon: 'fa-edit',
        label: 'Details',
        styleClass: '',
        onClick: function (roarevent) {
          return roar.openmodal(roarevent)
        }
      }, {
        icon: 'fa-pencil',
        label: 'Quick Note',
        styleClass: '',
        onClick: function (roarevent) {
          return roar.newnoteonroar(roarevent)
        }
      }, {
        styleClass: 'divider'
      }, {
        icon: 'fa-close',
        label: 'Remove',
        styleClass: ' text-danger',
        onClick: function (roarevent) {
          return roar.movetorecyclebin(roarevent)
        }
      }

      // ,
      //  {   icon: 'fa-close',
      //     label: 'Remove',
      //     styleClass: 'text-danger',
      //     onClick: function (revent) { return re.movetorecyclebin(revent); }
      // }
      ]
    }
  }])
  .directive('roarBadge', ["Collection", "$animate", function (Collection, $animate) {
    return {
      restrict: 'EA',
      templateUrl: '/llp_core/modules/roarmap/directive/roarevent/roarbadge.html',
      transclude: true,
            priority: 1,
      terminal:true,
      scope: {
        roarevent: '=?',
        id: '@',
        animation: '=?',
        editable: '=?',
        hovered: '=?',
        success: '&?'

      },
      controller: 'ROARbadgeCtrl',
      link: function ($scope, $element, $attr, fn) {
        var id = $attr.id
        var roarevent = Collection(id)
        roarevent.$bindTo($scope, 'roarevent')
        $scope.link = roarevent.mediaUrl
        $element.on('mouseenter', function () {
          $animate.addClass($element, 'active')
        })
        $element.on('mouseleave', function () {
          $animate.removeClass($element, 'active')
        })
      }
    }
  }])
  .directive('roarToggles', function () {
    return {
      restrict: 'E',
      templateUrl: '/llp_core/modules/roarmap/directive/roarevent/roartoggles.html',
            priority: 1,
      terminal:true,
      scope: {
        roarevent: '=',
        animation: '=',
        editable: '='

      },
      link: function (scope, element, $attr, fn) {}
    }
  })
  .directive('rpop', ["$http", "Popup", "$rootScope", "$compile", "$controller", "$document", "$animate", "ROARevent", "$templateCache", function ($http, Popup, $rootScope, $compile, $controller, $document, $animate, ROARevent, $templateCache) {
    return {
      restrict: 'AC',
      // templateUrl: 'modules/roarmap/directive/roarevent/roarpopover.html',
            priority: 1,
      terminal:true,
      scope: {
        roarevent: '=?',
        popupController: '=?',
        popupTemplateUrl: '=?',
        tooltipController: '=?',
        tooltipTemplateUrl: '=?',
        onPopupShow: '=?',
        onPopupHide: '=?',
        popupOffset: '=?'
      },
      controller: 'ROAReventController',
      link: function ($scope, $el, $attr, fn) {
        var POPUP_OFFSET, activePopup, activeTooltip, clearPopup, clearPopups, clearSelection, clearTooltip, createAnnotation, loadAnnotationPopup, onAnnotationsChange, onClick, onMouseEnter, onMouseLeave, onSelect, popupTemplateData, removeAnnotation, removeChildren, tooltipTemplateData, _ref
        POPUP_OFFSET = (_ref = $scope.popupOffset) != null ? _ref : 10
        activePopup = null
        activeTooltip = null
        popupTemplateData = ''
        tooltipTemplateData = ''

        $el.on('mouseenter', function () {
          $animate.addClass($el, 'active')
        })
        $el.on('mouseleave', function () {
          $animate.removeClass($el, 'active')
        })

        $el.on('click', function (event) {
          var $target = angular.element(event.target)

          targetId = (attrId = $target.attr('id')) != null ? parseInt(attrId, 10) : void 0
          if ((activePopup != null) && activePopup.scope.id === targetId) {
            clearPopup()
            return
          }
          clearPopups()

          loadAnnotationPopup($attr.href, $target, false)
          var divpanel = angular.element('<div/>').attr('id', roarevent.id || roarevent.$id).attr('class', "issuedocpanel panel panel-{{roarevent.styleClass || 'default'}} stacker").css({
            'z-index': '100000','width': '450px','margin': '10px'
          })
          // var header = angular.element('<h4 class="splash">' + event.rid + ' - ' + event.name + '<span class="fa fa-close btn btn-xs btn-danger" style="float: right;" onclick="$(this).parent().parent().remove()"></span></h4><h6>' + event.media + '</h6>')
          var header = $templateCache.get('{widgetsPath}/getphd/src/titleTemplate.html')
          var skope = angular.element('<iframe uib-collapse="widgetState.isCollapsed" class="panel-body" style="width:100%;height:600px;z-index:0;" ng-src="{{\'/files/uploads/\'+ roarevent.$id + \'.html\'}}"  />').attr('id', roarevent.id || roarevent.$id)
          // var skope = angular.element('<iframe/>').attr('srcdoc', ('<!DOCTYPE html><html><head></head><body><div class="card card-default">' + angular.fromJson(event.content) + '</div></body></html>'))
          // var skope = $sce.trustAsHtml(roarevent.content)
          angular.element('body').append($compile(divpanel.append(header).append(skope))($scope))
          $(divpanel).draggable({
            scroll: true,
            // scrollSpeed: 250,
            // scrollSensitivity: 200,
            // snap: 'body',
            cursor: 'move',
            // containment: 'body',
            stack: '.stacker',
            handle: '.panel-heading'

          }).resizable()
        })
        var clearPopup = function () {
          var tId
          if (activePopup == null) {
            return
          }
          tId = activePopup.scope.id
          return activePopup.destroy(function () {
            if (activePopup.scope.id === tId) {
              return activePopup = null
            }
          })
        }
        var clearTooltip = function () {
          var tooltip
          tooltip = activeTooltip
          if (tooltip == null) {
            return
          }
          return tooltip.destroy(function () {
            if (activeTooltip === tooltip) {
              return activeTooltip = null
            }
          })
        }

        var clearPopups = function () {
          clearPopup()
          return clearTooltip()
        }
        $scope.$on('$destroy', clearPopups)
        $scope.$on('clearPopups', clearPopups)
        if ($scope.popupTemplateUrl) {
          $http.get($scope.popupTemplateUrl).then(function (response) {
            return popupTemplateData = response.data
          })
        }else {
          $http.get('/getphdwidget/src/titleTemplate.html').then(function (response) {
            return popupTemplateData = response.data
          })
        }
        if ($scope.tooltipTemplateUrl) {
          $http.get($scope.tooltipTemplateUrl).then(function (response) {
            return tooltipTemplateData = response.data
          })
        }else {
          $http.get('/llp_core/modules/roarmap/partial/roarmap.detail.tpl/roarmap.annotation-tooltip.tpl.html').then(function (response) {
            return tooltipTemplateData = response.data
          })
        }

        var clearSelection = function () {
          if (document.selection) {
            return document.selection.empty()
          } else if (window.getSelection && window.getSelection().empty) {
            return window.getSelection().empty()
          } else if (window.getSelection && window.getSelection().removeAllRanges) {
            return window.getSelection().removeAllRanges()
          }
        }
        var onClick = function (event) {
          var $target, roarevent, attrId, targetId
          if (popupTemplateData.length === 0) {
            return
          }
          $target = angular.element(event.target)
          targetId = (attrId = $target.attr('data-annotation-id')) != null ? parseInt(attrId, 10) : parseInt($attr.href)
          if (targetId == null) {
            return
          }
          if ((activePopup != null) && activePopup.scope.id === targetId) {
            clearPopup()
            return
          }
          //   // roarevent = getAnnotationById($scope.annotations, targetId)
          roarevent = $scope.roarevent || $scope.item || $scope.collection || $attr.href
          clearPopups()
          return loadAnnotationPopup(roarevent, $target, $attr.href, false)
        }
        var loadAnnotationPopup = function (roarevent, anchor, href, isNew) {
          var controller, locals, popup
          popup = new Popup({
            scope: $rootScope.$new(),
            callbacks: {
              show: $scope.onPopupShow,
              hide: $scope.onPopupHide
            },
            template: '<div class="roarpopover issuedocpanel panel-{{roarevent.styleClass || \'default\'}}" >' + popupTemplateData + '<iframe src="' + $attr.href + '"></iframe></div>',

            positionClass: 'roarevent-popup-docked roarevent-popup-docked-{{position}}',
            $anchor: anchor,
            offset: POPUP_OFFSET
          })
          popup.scope.$isNew = isNew
          popup.scope.roarevent = roarevent
          popup.scope.$readonly = $scope.readonly
          popup.scope.$reject = function () {
            // removeAnnotation(annotation.id, $scope.annotations)
            // if ($scope.onAnnotateDelete != null) {
            //   $scope.onAnnotateDelete(annotation)
            // }
            $animate.addClass(popup.$el, 'close')
            $document.remove(popup)
            clearPopup()
          }
          popup.scope.$close = function () {
            // if ($scope.onAnnotate != null) {
            //   $scope.onAnnotate(popup.scope.$annotation)
            // }
            $animate.addClass(popup.$el, 'close')

            $document.remove(popup)
            clearPopup()
          }
          activePopup = popup
          locals = {
            $scope: popup.scope,
            $template: popupTemplateData
          }
          popup.$el.html(locals.$template)
          popup.$el.appendTo('body')

          if ($scope.popupController) {
            controller = $controller($scope.popupController, locals)
            popup.$el.data('$ngControllerController', controller)
            popup.$el.children().data('$ngControllerController', controller)
          }
          $compile(popup.$el)(popup.scope)
          popup.scope.$apply()
          // $('.roarevent-popup').draggable({handle: 'roar-chip'})
          return popup.show()
          var popdoc = function () {
            var uurl = $attr.href || $scope.$parent.roarevent.media
            var newid = uurl.slice(uurl.lastIndexOf('/') + 1, uurl.lastIndexOf('.'))
            var roar = ROARevent(newid)
            $scope.roarevent = roar

            $('.issuedocpanel').draggable({
              scroll: true,
              // scrollSpeed: 250,
              // scrollSensitivity: 200,
              // snap: 'body',
              cursor: 'move',
              // containment: 'parent',
              stack: '.stacker',
              handle: 'h4'

            }).resizable()
            window.postMessage($attr.href, 'lexspace.net')
          }
          $el.on('click', function (e) {
            e.preventDefault()
            popdoc()
          })
        }
      }
    };}])
  .directive('roarPopover', ["$http", "Popup", "$rootScope", "$compile", "$controller", "$document", "$animate", function ($http, Popup, $rootScope, $compile, $controller, $document, $animate) {
    return {
      restrict: 'A',
      // templateUrl: 'modules/roarmap/directive/roarevent/roarpopover.html',
            priority: 1,
      terminal:true,
      scope: {
        roarevent: '=',
        popupController: '=',
        popupTemplateUrl: '=',
        tooltipController: '=',
        tooltipTemplateUrl: '=',
        onPopupShow: '=',
        onPopupHide: '=',
        popupOffset: '='
      },
      // controller: 'ROAReventController',
      link: function ($scope, $el, $attr, fn) {
        var POPUP_OFFSET, activePopup, activeTooltip, clearPopup, clearPopups, clearSelection, clearTooltip, createAnnotation, loadAnnotationPopup, onAnnotationsChange, onClick, onMouseEnter, onMouseLeave, onSelect, popupTemplateData, removeAnnotation, removeChildren, tooltipTemplateData, _ref
        POPUP_OFFSET = (_ref = $scope.popupOffset) != null ? _ref : 10
        activePopup = null
        activeTooltip = null
        popupTemplateData = ''
        tooltipTemplateData = ''

        $el.on('mouseenter', function () {
          $animate.addClass($el, 'active')
        })
        $el.on('mouseleave', function () {
          $animate.removeClass($el, 'active')
        })

        $el.on('click', function (event) {
          var $target = angular.element(event.target)

          targetId = (attrId = $target.attr('id')) != null ? parseInt(attrId, 10) : void 0
          if ((activePopup != null) && activePopup.scope.roarevent.$id === targetId) {
            clearPopup()
            return
          }
          clearPopups()

          loadAnnotationPopup($scope.roarevent, $target, false)
        })
        var clearPopup = function () {
          var tId
          if (activePopup == null) {
            return
          }
          tId = activePopup.scope.roarevent.$id
          return activePopup.destroy(function () {
            if (activePopup.scope.roarevent.$id === tId) {
              return activePopup = null
            }
          })
        }
        var clearTooltip = function () {
          var tooltip
          tooltip = activeTooltip
          if (tooltip == null) {
            return
          }
          return tooltip.destroy(function () {
            if (activeTooltip === tooltip) {
              return activeTooltip = null
            }
          })
        }

        var clearPopups = function () {
          clearPopup()
          return clearTooltip()
        }
        $scope.$on('$destroy', clearPopups)
        $scope.$on('roarevent.clearPopups', clearPopups)
        if ($scope.popupTemplateUrl) {
          $http.get($scope.popupTemplateUrl).then(function (response) {
            return popupTemplateData = response.data
          })
        }
        if ($scope.tooltipTemplateUrl) {
          $http.get($scope.tooltipTemplateUrl).then(function (response) {
            return tooltipTemplateData = response.data
          })
        }
        var clearSelection = function () {
          if (document.selection) {
            return document.selection.empty()
          } else if (window.getSelection && window.getSelection().empty) {
            return window.getSelection().empty()
          } else if (window.getSelection && window.getSelection().removeAllRanges) {
            return window.getSelection().removeAllRanges()
          }
        }
        var onClick = function (event) {
          var $target, roarevent, attrId, targetId
          if (popupTemplateData.length === 0) {
            return
          }
          $target = angular.element(event.target)
          targetId = (attrId = $target.attr('data-annotation-id')) != null ? parseInt(attrId, 10) : void 0
          if (targetId == null) {
            return
          }
          if ((activePopup != null) && activePopup.scope.roarevent.$id === targetId) {
            clearPopup()
            return
          }
          // roarevent = getAnnotationById($scope.annotations, targetId)
          roarevent = $scope.roarevent
          clearPopups()
          return loadAnnotationPopup(roarevent, $target, false)
        }
        var loadAnnotationPopup = function (roarevent, anchor, isNew) {
          var controller, locals, popup
          popup = new Popup({
            scope: $rootScope.$new(),
            callbacks: {
              show: $scope.onPopupShow,
              hide: $scope.onPopupHide
            },
            template: "<div id='" + $scope.roarevent.$id + "' class='roarpopover' />",
            positionClass: 'roarevent-popup-docked roarevent-popup-docked-{{position}}',
            $anchor: anchor,
            offset: POPUP_OFFSET
          })
          popup.scope.$isNew = isNew
          popup.scope.roarevent = roarevent
          popup.scope.$readonly = $scope.readonly
          popup.scope.$reject = function () {
            // removeAnnotation(annotation.id, $scope.annotations)
            // if ($scope.onAnnotateDelete != null) {
            //   $scope.onAnnotateDelete(annotation)
            // }
            $animate.addClass(popup.$el, 'close')
            $document.remove(popup)
            clearPopup()
          }
          popup.scope.$close = function () {
            // if ($scope.onAnnotate != null) {
            //   $scope.onAnnotate(popup.scope.$annotation)
            // }
            $animate.addClass(popup.$el, 'close')

            $document.remove(popup)
            clearPopup()
          }
          activePopup = popup
          locals = {
            $scope: popup.scope,
            $template: popupTemplateData
          }
          popup.$el.html(locals.$template)
          popup.$el.appendTo('body')

          if ($scope.popupController) {
            controller = $controller($scope.popupController, locals)
            popup.$el.data('$ngControllerController', controller)
            popup.$el.children().data('$ngControllerController', controller)
          }
          $compile(popup.$el)(popup.scope)
          popup.scope.$apply()
          // $('.roarevent-popup').draggable({handle: 'roar-chip'})
          return popup.show()
        }
      }
    }
  }])
  .directive('toolbar', function () {
    return {
      restrict: 'E',
      templateUrl: '/llp_core/modules/roarmap/directive/toolbars/toolbarbasic.html',
      scope: false,
            priority: 1,
      terminal:true,
      link: function (scope, element, $attr, fn) {}
    }
  })
  .controller('ROAReventController', ['$scope', 'ROARevent', 'ROARevents', '$state', '$stateParams', '$timeout', 'ngDialog', '$ACTIVEROAR', 'Collection', '$templateCache', '$compile', '$rootScope', '$window', '$clipboard',
    function ($scope, ROARevent, ROARevents, $state, $stateParams, $timeout, ngDialog, $ACTIVEROAR, Collection, $templateCache, $compile, $rootScope, $window, $clipboard) {
      var matterId = $stateParams.matterId

      var re = this

      // var roar = ROARevent($scope.roarevent.$id)
      // roar.$bindTo($scope, 'roarevent')
      re.show = function (eventId) {
        Collection(eventId).$loaded().then(function (event) {
          if (event.document_type !== 'html') {
            var divpanel = angular.element('<div/>').attr('class', 'issuedocpanel stacker')
            // var header = angular.element('<h4 class="splash">' + event.rid + ' - ' + event.name + '<span class="fa fa-close btn btn-xs btn-danger" style="float: right;" onclick="$(this).parent().parent().remove()"></span></h4><h6>' + event.media + '</h6>')
            var header = $templateCache.get('{widgetsPath}/getphd/src/titleTemplate.html')

            var skope = angular.element('<embed/>').attr('src', event.media)

            angular.element('body').append($compile(divpanel.append(header).append(skope))($scope))
            $('.issuedocpanel').draggable({
              stack: '.stacker',
              handle: 'h4'
            }).resizable()
          } else {
            var divpanel = angular.element('<div/>').attr('class', 'issuedocpanel stacker')
            // var header = angular.element('<h4 class="splash">' + event.rid + ' - ' + event.name + '<span class="fa fa-close btn btn-xs btn-danger" style="float: right;" onclick="$(this).parent().parent().remove()"></span></h4><h6>' + event.media + '</h6>')
            var header = $templateCache.get('{widgetsPath}/getphd/src/titleTemplate.html')
            var skope = angular.element('<embed/>').attr('srcdoc', ('<!DOCTYPE html><html><head><link rel="stylesheet" href="//lexspace.net/app.full.min.css"></head><body><div class="card card-default">' + angular.fromJson(event.content)))
            // var skope = angular.element('<iframe/>').attr('srcdoc', ('<!DOCTYPE html><html><head></head><body><div class="card card-default">' + angular.fromJson(event.content) + '</div></body></html>'))

            angular.element('body').append($compile(divpanel.append(header).append(skope))($scope))
            $('.issuedocpanel').draggable({
              stack: '.stacker',
              handle: 'h4'
            }).resizable()
          }
        })
      }
      $scope.remove = function () {
        $(this).parent().parent().remove()
      }
      $scope.alert = function (msg) {
        alertify.alert(msg)
        re.newnoteonroar($scope.roarevent)
      }
      $scope.openFullScreen = function () {
        // alertify.log(roareventid)
        // Fullscreen.toggleAll()
        if ($scope.fullscreen !== true) {
          $('.issuedocpanel').css({
            'position': 'absolute',
            'top': '0px',
            'left': '0px',
            'bottom': '0px',
            'right': '0px',
            'width': '100%',
            'z-index': '100000',
            'transition': 'all 0.5s ease-out'
          })
          $('.fa-expand').addClass('fa-compress').removeClass('fa-expand')
          $scope.fullscreen = true
        } else {
          $('.issuedocpanel').css({
            'position': 'absolute',
            'top': '6rem',
            'left': '10rem',
            'bottom': null,
            'right': null,
            'width': 'initial',
            'z-index': '9999',
            'transition': 'all 0.5s ease-out'
          }).draggable().resizable()

          $('.fa-compress').addClass('fa-expand').removeClass('fa-compress')
          $scope.fullscreen = false
        }
      //                roar.openmodal(this)
      }
      $scope.edit = function () {
        re.copytoclipboard($scope.roarevent)
      }
      $scope.$window = $window
      re.newnoteonroar = function (roarevent) {
        ngDialog.open({
          data: roarevent,
          template: '/llp_core/partials/statusboard/partials/newCard.html',
          controller: 'ROARChipCtrl',
          className: 'ngdialog-theme-inline',
          plain: false,
          closeByEscape: true,
          closeByDocument: true,
          appendTo: false
        })
      }

      re.openmodal = function (roarevent) {
        $ACTIVEROAR.roarevent = roarevent
        console.log('opening', roarevent)
        ngDialog.open({
          template: '/llp_core/modules/roarmap/partial/xlDialogId/xlDialogId.html',
          controller: 'xlDialogIdCtrl',
          data: roarevent,
          scope: $scope.$new(),
          className: 'ngdialog-theme-xl',
          closeByDocument: true,
          closeByEscape: true,
          plain: false,
          showClose: true,
          closeByNavigation: false,

          preCloseCallback: false

        })
      }
      $scope.togglelionpad = function (roarevent) {
        if (roarevent.lionpad !== true) {
          roarevent.lionpad = true
          roarevents.$save(roarevent)
        } else if (roarevent.lionpad === true) {
          roarevent.lionpad = false
          roarevents.$save(roarevent)
        }
      }

      $scope.rightmenu = {
        icon: 'fa-chevron-down',
        items: [{
          icon: 'fa-edit',
          label: 'Open/Edit',
          styleClass: '',
          onClick: function (revent) {
            return re.openmodal(revent)
          }
        }, {
          icon: 'fa-copy',
          label: 'Copy to Cliplboard',
          styleClass: '',
          onClick: function (revent) {
            return re.copytoclipboard(revent)
          }
        }
        // ,
        //  {   icon: 'fa-close',
        //     label: 'Remove',
        //     styleClass: 'text-danger',
        //     onClick: function (revent) { return re.movetorecyclebin(revent); }
        // }
        ]
      }
      re.copytoclipboard = function (item) {
        $clipboard().$add(item.id || item).then(function (ref) {
          alertify.log('COPY to CLIPBOARD')
        })
        // $rootScope.$broadcast('COPYTOCLIPBOARD', item.id || item)
        // alertify.log('COPY to CLIPBOARD', item.id || item )
        //   Collection(thing.id || thing).$loaded().then(function (item) {
        //       $rootScope.$broadcast('COPYTOCLIPBOARD', item)
        //       alertify.log('COPY to CLIPBOARD', item)

        //   })

      }

      // re.movetotrashbin = function (pageid) {
      //     var proj = project.id
      //     var projref = project.$ref()
      //     var outref = Collection(proj).$ref()
      //     var pageid = pageid.id || pageid
      //     outref.child('roarlist').child(pageid).set(null)
      //     projref.child('log').push({
      //                 message: 'removed ' + pageid,
      //                 user: $rootScope.authData.uid,
      //                 styleClass: 'danger',
      //                 timestamp: firebase.database.ServerValue.TIMESTAMP
      //     })
      //     pj.loadtabs()
      // }
      // re.movetorecyclebin = function (tab) {
      //     var pageid = pj.$ACTIVEROAR.page
      //     var id = tab.id || tab
      //     Collection(pageid).$ref().child('roarlist').child(id).set(null)
      //     project.$ref().child('log').push({
      //                 message: 'removed ' + tab,
      //                 user: $rootScope.authData.uid,
      //                 styleClass: 'danger',
      //                 timestamp: firebase.database.ServerValue.TIMESTAMP
      //     })
      //     pj.loadtabs()
      // }

      // $scope.open = function(roarevent){
      //                   angular.forEach(roarevents, function(roar, key){
      //                     roar.open = false
      //                     roarevents.$save(roar)
      //                   })

      //                   $timeout(function(){
      //                      $scope.roarevent.open = true
      //                      //roarevents.$save(roarevent)
      //                      $state.go('digest',{eventId: roarevent.$id})
      //                   },1500)
      //              }
      //   $scope.close = function(roarevent){
      //      roarevent.open = false
      //      roarevents.$save(roarevent)

    //   }
    }
  ])
  .factory('Popup', function () {
    return function (args) {
      args = angular.extend({
        scope: null,
        callbacks: {},
        template: '<div/>',
        $anchor: null,
        preferredAxis: 'x',
        offset: 0,
        positionClass: '{{position}}'
      }, args)
      return angular.extend(this, args, {
        $el: angular.element(args.template),
        show: function (speed) {
          if (speed == null) {
            speed = 'fast'
          }
          this.$el.slideDown(speed)
          this.reposition()
          if (angular.isFunction(this.callbacks.show)) {
            return this.callbacks.show(this.$el)
          }
        },
        hide: function (speed) {
          if (speed == null) {
            speed = 'fast'
          }
          this.$el.slideUp(speed)
          if (angular.isFunction(this.callbacks.hide)) {
            return this.callbacks.hide(this.$el)
          }
        },
        isVisible: function () {
          return this.$el.is(':visible')
        },
        destroy: function (cb) {
          var $el, scope
          if (cb == null) {
            cb = angular.noop
          }
          scope = this.scope
          $el = this.$el
          return this.hide(function () {
            if (angular.isFunction(cb)) {
              cb()
            }
            scope.$destroy()
            return $el.remove()
          })
        },
        stopDestroy: function () {
          return this.$el.stop(true).show('fast')
        },
        reposition: function () {
          var anchorEl, pos, posX, posY, targetEl
          targetEl = this.$el[0]
          anchorEl = this.$anchor[0]
          if (!(targetEl || anchorEl)) {
            return
          }
          pos = {
            left: null,
            top: null,
            target: targetEl.getBoundingClientRect(),
            anchor: anchorEl.getBoundingClientRect(),
            viewport: {
              width: window.innerWidth,
              height: window.innerHeight
            },
            scroll: {
              top: document.body.scrollTop,
              left: document.body.scrollLeft
            }
          }
          if (!(pos.target.width > 0 && pos.target.height > 0)) {
            return
          }
          posX = this.getNewPositionOnAxis(pos, 'x')
          posY = this.getNewPositionOnAxis(pos, 'y')
          if (this.preferredAxis === 'x') {
            if (posX && angular.isNumber(posX.pos)) {
              pos.left = posX.pos
              pos.edge = posX.edge
            } else if (posY) {
              pos.top = posY.pos
              pos.edge = posY.edge
            }
          } else {
            if (posY && angular.isNumber(posY.pos)) {
              pos.top = posY.pos
              pos.edge = posY.edge
            } else if (posX) {
              pos.left = posX.pos
              pos.edge = posX.edge
            }
          }
          if (pos.left === null && pos.top === null) {
            pos.left = pos.scroll.left + (pos.viewport.width / 2) - (pos.target.width / 2)
            pos.top = pos.scroll.top + (pos.viewport.height / 2) - (pos.target.height / 2)
          } else if (pos.left === null) {
            pos.left = this.getNewCenterPositionOnAxis(pos, 'x')
          } else if (pos.top === null) {
            pos.top = this.getNewCenterPositionOnAxis(pos, 'y')
          }
          this.$el.addClass(pos.edge && this.positionClass.replace('{{position}}', pos.edge)).css({
            top: Math.round(pos.top) || 0,
            left: Math.round(pos.left) || 0
          })
        },
        getNewPositionOnAxis: function (pos, axis) {
          var axisPos, end, size, start
          start = {
            x: 'left',
            y: 'top'
          }[axis]
          end = {
            x: 'right',
            y: 'bottom'
          }[axis]
          size = {
            x: 'width',
            y: 'height'
          }[axis]
          if (pos.anchor[start] - this.offset >= pos.target[size]) {
            axisPos = {
              pos: pos.scroll[start] + pos.anchor[start] - this.offset - pos.target[size],
              edge: start
            }
          } else if (pos.viewport[size] - pos.anchor[end] - this.offset >= pos.target[size]) {
            axisPos = {
              pos: pos.scroll[start] + pos.anchor[end] + this.offset,
              edge: end
            }
          }
          return axisPos
        },
        getNewCenterPositionOnAxis: function (pos, axis) {
          var centerPos, size, start
          start = {
            x: 'left',
            y: 'top'
          }[axis]
          size = {
            x: 'width',
            y: 'height'
          }[axis]
          centerPos = pos.scroll[start] + pos.anchor[start] + (pos.anchor[size] / 2) - (pos.target[size] / 2)
          return Math.max(pos.scroll[start] + this.offset, Math.min(centerPos, pos.scroll[start] + pos.viewport[size] - pos.target[size] - this.offset))
        }
      })
    }
  })

  .controller('ROARbadgeCtrl', ['$scope', '$stateParams', 'ROARevent', 'ROARevents',
    function ($scope, $stateParams, ROARevent, ROARevents) {
      var matterId = $stateParams.matterId
      var roarevents = ROARevents(matterId)

      // var id = $attr.id
      // var roarevent = ROARevent(id)
      // var roarevent = $scope.roarevent

      $scope.roarevents = roarevents
      // $scope.link = roarevent.mediaUrl
      // $scope.addIssue = function(issueId){
      //      var issue = iSsue(issueId)
      //      var roarId = $scope.roarevent.$id
      //      if (angular.isUndefined(roarevent.issuelist)){
      //          var issuelist = []
      //          angular.extend(roarevent, {
      //              issuelist: issuelist
      //          })
      //          roarevent.issuelist.push(issueId)
      //      }
      //      else{
      //          roarevent.issuelist.push(issueId)
      //      }
      //      if (angular.isUndefined(issue.roarlist)){
      //          var roarlist = []

      //          angular.extend(issue, {
      //              roarlist: roarlist
      //          })
      //          issue.roarlist.push(roarId)
      //          issues.$save(issue)

      //      }

      //      else {
      //          issue.roarlist.push(roarId)
      //          issues.$save(issue)
      //      }
      // }

    }
  ])
  .factory('$roarevent', ['OWNERSHIPDOCS', 'ARTDOCS', 'MERITSDOCS', 'DOCNAMES', 'PETDOCCODES', 'NOADOCCODES', 'INTVDOCCODES', 'PTODOCCODES', 'APPDOCCODES', '$q', '$filter', 'ckstarter', 'ckender','$stateParams','$rootScope',
    function (OWNERSHIPDOCS, ARTDOCS, MERITSDOCS, DOCNAMES, PETDOCCODES, NOADOCCODES, INTVDOCCODES, PTODOCCODES, APPDOCCODES, $q, $filter, ckstarter, ckender, $stateParams, $rootScope) {
      return function (file) {
        var deferred = $q.defer()
        parse(file)
        return deferred.promise
        function parse (file) {
          var roarevent = file
          // debugger
          //  var tese = []
          //  tese.push(roarevent)
          //          var test = new RegExp('^[0-9]{8}-[0-9]{4}-[0-9]{2}-[0-9]{2}-[0-9]{5}-')

          //         var array = $filter('filter')(tese, test)
          if (roarevent.filename.indexOf('.pdf') > -1) {
            var filename = file.Filename || file.name || file.filename
            // debugger
            var appnumsubstring = filename.slice(0, filename.indexOf('-'))
            var appdatesubstring = filename.slice((filename.indexOf('-') + 1), (filename.indexOf('-') + 11))
            var doccode = filename.slice((filename.lastIndexOf('-') + 1), (filename.indexOf('.pdf')))
            roarevent.content_type = 'document'

            if (file.url) {
              roarevent.media = file.url
              //  var partA = file.url.replace('/view?usp', '/preview')
              //   roarevent.media = partA.slice(0, partA.indexOf('='))
              //     roarevent.iconUrl = file.iconUrl || null
              roarevent.uuid = file.id

              roarevent.mimeType = file.mimeType || null
            }

            //
            // roarevent.description = file.DocumentDescription
            roarevent.description = file['Document Description'] || null
            roarevent.filename = file['Filename'] || file.name || file.filename
            roarevent.collections = []
            roarevent.application = appnumsubstring || null
            roarevent.date = appdatesubstring || null
            // roarevent.rid = imagefile.indexOf(file)
            // roarevent.file = file
            // roarevent.collections.push(roarmap.collections[0])
            roarevent.doccode = file['Document Code'] || doccode
            // roarevent.collections.push(phd.roarmap.collections[0].id)
            angular.forEach(APPDOCCODES, function (code, key) {
              if (doccode === code) {
                roarevent.styleClass = 'Applicant'
              }
            })
            angular.forEach(PTODOCCODES, function (code, key) {
              if (doccode === code) {
                roarevent.styleClass = 'PTO'
              }
            })
            angular.forEach(INTVDOCCODES, function (code, key) {
              if (doccode === code) {
                roarevent.styleClass = 'Interview'
              }
            })
            angular.forEach(NOADOCCODES, function (code, key) {
              if (doccode === code) {
                roarevent.styleClass = 'NOA'
              }
            })
            angular.forEach(PETDOCCODES, function (code, key) {
              if (doccode === code) {
                roarevent.styleClass = 'Petition'
              }
            })
            angular.forEach(DOCNAMES, function (code, key) {
              angular.forEach(code, function (value, key) {
                if (doccode === key) {
                  roarevent.name = value
                  roarevent.title = value
                }else { roarevent.name = filename }
              })
            })
            var date = new Date()
            var d = new Date()
            var n = d.getTime()
            roarevent.rows = [
              {
                columns: [{cid: n + 9,styleClass: 'col-sm-6',widgets: [{ config: { height: '90vh', url: roarevent.media || '' }, styleClass: roarevent.styleClass || 'btn-dark', title: 'LexFrame', type: 'iframe', wid: n + 100 }]},
                  { cid: n + 10, styleClass: 'col-sm-6', widgets: [{ config: { id: 'PROMISE', height: '90vh' }, styleClass: roarevent.styleClass || 'btn-dark', title: 'LexPad', type: 'ckwidget', wid: n + 1010 }, { config: { id: 'PROMISE', height: '90vh' }, styleClass: roarevent.styleClass || 'btn-dark', title: 'Metadata', type: 'metadata', wid: n + 101 }, { config: { id: 'PROMISE', height: '90vh' }, styleClass: roarevent.styleClass || 'btn-dark', title: 'Text', type: 'text', wid: n + 105 }] }

                ]
              }
            ]
            roarevent.structure = '6-6'
            return deferred.resolve(roarevent)
          } else {
            var filename = file.Filename || file.name || file.filename
            roarevent.name = filename
            roarevent.title = filename
            if (file.url) {
              roarevent.media = file.url
              //  var partA = file.url.replace('/view?usp', '/preview')
              //   roarevent.media = partA.slice(0, partA.indexOf('='))
              //     roarevent.iconUrl = file.iconUrl || null
              roarevent.uuid = file.id

              roarevent.mimeType = file.mimeType || null
            }
            var date = new Date()
            var d = new Date()
            var n = d.getTime()

            roarevent.rows = [
              {
                columns: [{cid: n + 9,styleClass: 'col-sm-6',widgets: [{ config: { height: '90vh', url: roarevent.media || 'http://www.google.com' }, styleClass: roarevent.styleClass || 'btn-dark', title: 'LexFrame', type: 'iframe', wid: n + 100 }]},
                  { cid: n + 10, styleClass: 'col-sm-6', widgets: [{ config: { id: 'PROMISE', height: '90vh' }, styleClass: roarevent.styleClass || 'btn-dark', title: 'LexPad', type: 'ckwidget', wid: n + 1010 }, { config: { id: 'PROMISE', height: '90vh' }, styleClass: roarevent.styleClass || 'btn-dark', title: 'Metadata', type: 'metadata', wid: n + 101 }, { config: { id: 'PROMISE', height: '90vh' }, styleClass: roarevent.styleClass || 'btn-dark', title: 'Text', type: 'text', wid: n + 105 }] }

                ]
              }
            ]
            roarevent.structure = '6-6'
            return deferred.resolve(roarevent)
          }
        }
      }
    }])
  .factory('$roarmap', ['$stateParams', 'Matter', 'Collection', 'ROARevent', 'ROARevents', 'Collections', '$timeout', 'OWNERSHIPDOCS', 'ARTDOCS', 'MERITSDOCS', 'DOCNAMES', 'PETDOCCODES', 'NOADOCCODES', 'INTVDOCCODES', 'PTODOCCODES', 'APPDOCCODES', '$q', 'PHD', '$log', 'filepickerService', '$location', '$ACTIVEROAR', '$dashboards', 'CLAIMDOCS', 'ckstarter', 'ckender', 'ckheader', '$http', '$filter',
    function ($stateParams, Matter, Collection, ROARevent, ROARevents, Collections, $timeout, OWNERSHIPDOCS, ARTDOCS, MERITSDOCS, DOCNAMES, PETDOCCODES, NOADOCCODES, INTVDOCCODES, PTODOCCODES, APPDOCCODES, $q, PHD, $log, filepickerService, $location, $ACTIVEROAR, $dashboards, CLAIMDOCS, ckstarter, ckender, ckheader, $http, $filter) {
      return function (files, phd, main) {
        phd.roarmap = {
          collections: [],
          roarlist: []
        }
        phd.roarlist = {}
        var buffe = []
        var deferred = $q.defer()

        var matter = Matter($stateParams.matterId, $stateParams.groupId)
        // var collections = Collections()
        var dashboards = Collection($stateParams.pageid)
        var dashboardsref = dashboards.$ref()
        //  var phdref = Collection(phd.id).$ref()
        var projref = Collection($stateParams.pId).$ref()

        function hello (phd) {
          //  var check = checkforexistingphd()
          //  if (check) {
          //      alertify.alert('already exists')
          //  } else {
          //      buildroar()
          //  }

          buildcollections(phd)
        }
        hello(phd)
        return deferred.promise

        function buildroar (groupids, phd) {
          var claimref = Collection(groupids[3]).$ref()
          var artref = Collection(groupids[2]).$ref()
          var meritsref = Collection(groupids[1]).$ref()
          var allref = Collection(groupids[0]).$ref()

          angular.forEach(phd.imagefile, function (file, key) {
            // $timeout(function () {
            if ((file['Mail Room Date'] === '') || (file['Filename'] === '')) {
              return
            } else {
              var appnumber = angular.copy(phd.application['Application Number']).replace('/', '').replace(',', '').replace(',', '')
              var appref = Collection(appnumber).$ref()
              var date = new Date()
              var roarevent = file
              var maildate = new Date(file['Mail Room Date'])
              var mailyear = maildate.getFullYear()
              var mailmonth = maildate.getMonth()
              var mailday = maildate.getDate()
              var roardate = maildate.toDateString()

              var filename = file.Filename || null
              var appnumsubstring = filename.slice(0, filename.indexOf('-'))
              var appdatesubstring = filename.slice((filename.indexOf('-') + 1), (filename.indexOf('-') + 11))
              var subsectionid = filename.slice(filename.indexOf('-') + 11, filename.lastIndexOf('-'))
              var doccode = filename.slice((filename.lastIndexOf('-') + 1), (filename.indexOf('.pdf')))
              roarevent.content_type = 'document'
              var de = filename.slice(0, filename.lastIndexOf('-'))
              roarevent.id = de
              if ($location.host() === 'localhost') {
                roarevent.ocrlink = '/files/public/uspto/' + appnumsubstring + '/' + appnumsubstring + '-image_file_wrapper/' + filename

                roarevent.selflink = '/files/public/uspto/' + appnumsubstring + '/' + appnumsubstring + '-image_file_wrapper/' + filename
                roarevent.media = roarevent.ocrlink
              //  roarevent.media = '/files/viewer/web/viewer.html?file=%2Ffiles/public/uspto/' + appnumsubstring + '/' + appnumsubstring + '-image_file_wrapper/' + filename
              } else {
                roarevent.ocrlink = '/files/public/uspto/' + appnumsubstring + '/' + appnumsubstring + '-image_file_wrapper/' + filename

                roarevent.selflink = '/files/public/uspto/' + appnumsubstring + '/' + appnumsubstring + '-image_file_wrapper/' + filename
                roarevent.media = roarevent.ocrlink
              //  roarevent.media = '/files/public/viewer/web/viewer.html?file=%2Ffiles/public/uspto/' + appnumsubstring + '/' + appnumsubstring + '-image_file_wrapper/' + filename
              }
              roarevent.description = file['Document Description'] || null
              roarevent.filename = file['Filename'] || null
              roarevent.collections = []
              roarevent.Application = appnumsubstring || null
              roarevent.date = appdatesubstring || null
              roarevent.rid = phd.imagefile.length - phd.imagefile.indexOf(file)
              // roarevent.file = file
              // roarevent.collections.push(roarmap.collections[0])
              roarevent.patentid = phd.patent.id
              roarevent.doccode = file['Document Code'] || null
              // roarevent.collections.push(phd.roarmap.collections[0].id)
              angular.forEach(DOCNAMES, function (code, key) {
                angular.forEach(code, function (value, key) {
                  if (doccode === key) {
                    roarevent.name = value
                    roarevent.title = value
                  }
                })
              })

              var appfunction = function (roarevent, roarevents, controller, phd) {
                var template = '<script>var app = angular.module("ckapp").controller("AppCtrl", ["$scope", "$compile","$templateCache", "$http", "Collection","$window","$document","$location",function($scope, $compile,$templateCache, $http, Collection,$window,$document,$location){var app = this;' +
                  'app = ' + controller + ';' +
                  'app.patent = ' + phd.patent + ';' +
                  'app.roarevent = ' + roarevent + ';' +
                  'app.phd = ' + phd + ';' +
                  'console.log(' + controller + ');' +
                  'console.log(' + phd.patent + ');' +
                  'console.log(' + roarevent + ');' +
                  'console.log(' + phd + ');' +
                  '});</script>'
                return template
              }

              var wraphead = ckstarter
              var wraptail = ckender
              var apptemplate = '<div id="docheader" class="container-fluid two-col-right" doc-header roarid="' + roarevent.id + '">' +
                // '<div class="row">' +
                // '<div class="col-xs-8"><div class="bs-callout bs-callout-Applicant"><h4>'+ roarevent.title+'</h4><p>Dated '+roardate+'</p><cite>'+roarevent.filename+'&nbsp;&nbsp;<a href="'+roarevent.media+'" pop="true" target="fframe"><i class="fa fa-external-link"></i></a></cite></div><input type="text" ng-model="query" placeholder="Search" class="fa fa-search fa-pull-left" /></div>
                '<div getpdftext="' + roarevent.id + '" pdf-data="' + roarevent.ocrlink + '">&nbsp;</div>' +
                // '<div class="col-xs-4 col-sm-3 card card-'+roarevent.styleClass+'"><img src="https://placehold.it/250x150/4682b4/fff/&text='+roarevent.rid+'" class="img img-hover img-responsive img-shadow"/> <p class="card-text"><label ng-repeat="match in matches track by $index | unique" class="fa fa-tag">{{match}}</label></p></div>' +
                // '<div class="col-xs-4"><img src="https://placehold.it/250x150/4682b4/fff/&text='+roarevent.rid+'" class="img img-hover img-responsive img-shadow"/></div>' +
                // '</div>' +
                '</div>'
              var ptotemplate = '<div id="docheader" class="container-fluid two-col-left" doc-header roarid="' + roarevent.id + '">' +
                '<div class="row">' +
                '<div class="col-xs-4 col-sm-3 card card-' + roarevent.styleClass + '"><img src="https://placehold.it/250x150/640002/fff/&text=' + roarevent.rid + '" class="img img-hover img-responsive img-shadow"/> <p class="card-text"><label ng-repeat="match in matches track by $index | unique" class="fa fa-tag">{{match}}</label></p></div>' +
                // '<div class="col-xs-4"><img src="https://placehold.it/250x150/640002/fff/&text='+roarevent.rid+'" class="img img-hover img-responsive img-shadow"/></div>' +
                '<div class="col-xs-8"><div class="bs-callout bs-callout-PTO bs-callout-reverse"><h4>' + roarevent.title + '</h4><p>Dated ' + roardate + '</p><cite>' + roarevent.filename + '&nbsp;&nbsp;<a href="' + roarevent.media + '" pop="true" target="fframe"><i class="fa fa-external-link"></i></a></cite></div><input type="text" ng-model="query" placeholder="Search" class="fa fa-search fa-pull-right" /></div><div getpdftext="' + roarevent.id + '" pdf-data="' + roarevent.ocrlink + '">&nbsp;</div>' +
                '</div>' +
                '</div>'
              var noatemplate = '<div id="docheader" class="container-fluid two-col-left" doc-header roarid="' + roarevent.id + '">' +
                '<div class="row">' +
                '<div class="col-xs-4 col-sm-3 card card-' + roarevent.styleClass + '"><img src="https://placehold.it/250x150/7c994f/fff/&text=' + roarevent.rid + '" class="img img-hover img-responsive img-shadow"/> <p class="card-text"><label ng-repeat="match in matches track by $index | unique" class="fa fa-tag">{{match}}</label></p></div>' +
                //  '<div class="col-xs-4"><img src="https://placehold.it/250x150/7c994f/fff/&text='+roarevent.rid+'" class="img img-hover img-responsive img-shadow"/></div>' +
                '<div class="col-xs-8"><div class="bs-callout bs-callout-NOA bs-callout-reverse"><h4>' + roarevent.title + '</h4><p>Dated ' + roardate + '</p><cite>' + roarevent.filename + '&nbsp;&nbsp;<a href="' + roarevent.media + '" pop="true" target="fframe"><i class="fa fa-external-link"></i></a></cite></div><input type="text" ng-model="query" placeholder="Search" class="fa fa-search fa-pull-right" /></div><div getpdftext="' + roarevent.id + '" pdf-data="' + roarevent.ocrlink + '">&nbsp;</div>' +
                '</div>' +
                '</div>'
              var petitiontemplate = '<div id="docheader" class="container-fluid two-col-right" doc-header roarid="' + roarevent.id + '">' +
                '<div class="row">' +
                '<div class="col-xs-8 col-sm-9"><div class="bs-callout bs-callout-Petition"><h4>' + roarevent.title + '</h4><p>Dated ' + roardate + '</p><cite>' + roarevent.filename + '&nbsp;&nbsp;<a href="' + roarevent.media + '" pop="true" target="fframe"><i class="fa fa-external-link"></i></a></cite></div><input type="text" ng-model="query" placeholder="Search" class="fa fa-search fa-pull-left" /></div><div getpdftext="' + roarevent.id + '" pdf-data="' + roarevent.ocrlink + '">&nbsp;</div>' +
                '<div class="col-xs-4 col-sm-3 card card-' + roarevent.styleClass + '"><img src="https://placehold.it/250x150/b48200/fff/&text=' + roarevent.rid + '" class="img img-hover img-responsive img-shadow"/> <p class="card-text"><label ng-repeat="match in matches track by $index | unique" class="fa fa-tag">{{match}}</label></p></div>' +
                '</div>' +
                '</div>'
              var interviewtemplate = '<div id="docheader" class="container-fluid two-col-right" doc-header roarid="' + roarevent.id + '">' +
                '<div class="row">' +
                '<div class="col-xs-8"><div class="bs-callout bs-callout-Interview"><h4>' + roarevent.title + '</h4><p>Dated ' + roardate + '</p><cite>' + roarevent.filename + '&nbsp;&nbsp;<a href="' + roarevent.media + '" pop="true" target="fframe"><i class="fa fa-external-link"></i></a></cite></div><input type="text" ng-model="query" placeholder="Search" class="fa fa-search fa-pull-left" /></div><div getpdftext="' + roarevent.id + '" pdf-data="' + roarevent.ocrlink + '">&nbsp;</div>' +
                '<div class="col-xs-4 col-sm-3 card card-' + roarevent.styleClass + '"><img src="https://placehold.it/250x150/&text=' + roarevent.rid + '" class="img img-hover img-responsive img-shadow"/> <p class="card-text"><label ng-repeat="match in matches track by $index | unique" class="fa fa-tag">{{match}}</label></p></div>' +
                //  '<div class="col-xs-4"<img src="https://placehold.it/250x150/&text='+roarevent.rid+'" class="img img-responsive img-hover img-shadow"/></div>' +
                '</div>' +
                '</div>'

              angular.forEach(APPDOCCODES, function (code, key) {
                if (doccode === code) {
                  roarevent.styleClass = 'Applicant'
                  roarevent.content = wraphead + apptemplate + wraptail
                  // + appfunction(roarevent, phd.imagefile, main, phd)
                  roarevent.data = wraphead + apptemplate + wraptail
                  // + appfunction(roarevent, phd.imagefile, main, phd)
                  phd.content += apptemplate
                }
              })
              angular.forEach(PTODOCCODES, function (code, key) {
                if (doccode === code) {
                  roarevent.styleClass = 'PTO'
                  roarevent.content = wraphead + apptemplate + wraptail
                  // + appfunction(roarevent, phd.imagefile, main, phd)
                  roarevent.data = wraphead + apptemplate + wraptail
                  // + appfunction(roarevent, phd.imagefile, main, phd)
                  phd.content += apptemplate
                }
              })
              angular.forEach(INTVDOCCODES, function (code, key) {
                if (doccode === code) {
                  roarevent.styleClass = 'Interview'
                  roarevent.content = wraphead + apptemplate + wraptail
                  // + appfunction(roarevent, phd.imagefile, main, phd)
                  roarevent.data = wraphead + apptemplate + wraptail
                  // + appfunction(roarevent, phd.imagefile, main, phd)
                  phd.content += apptemplate
                }
              })
              angular.forEach(NOADOCCODES, function (code, key) {
                if (doccode === code) {
                  roarevent.styleClass = 'NOA'
                  roarevent.content = wraphead + apptemplate + wraptail
                  // + appfunction(roarevent, phd.imagefile, main, phd)
                  roarevent.data = wraphead + apptemplate + wraptail
                  // + appfunction(roarevent, phd.imagefile, main, phd)
                  phd.content += apptemplate
                }
              })
              angular.forEach(PETDOCCODES, function (code, key) {
                if (doccode === code) {
                  roarevent.styleClass = 'Petition'
                  roarevent.content = wraphead + apptemplate + wraptail
                  // + appfunction(roarevent, phd.imagefile, main, phd)
                  roarevent.data = wraphead + apptemplate + wraptail
                  // + appfunction(roarevent, phd.imagefile, main, phd)
                  phd.content += apptemplate
                }
              })
              //  roarevent.content = wraphead + '<doc-header roarid="' + de + '" roarevent="roarevent"></doc-header>' + wraptail + appfunction(roarevent, phd.imagefile,main,phd)
              //  roarevent.data = wraphead + '<doc-header roarid="' + de + '" roarevent="roarevent"></doc-header>' + wraptail + appfunction(roarevent, phd.imagefile,main,phd)
              //  phd.content += '<doc-header roarid="' + de + '" roarevent="roarevent"></doc-header>'
              var d = new Date()
              var n = d.getTime()
              roarevent.rows = [
                {
                  columns: [{cid: n + 9,styleClass: 'col-sm-6',widgets: [{ config: { height: '90vh', url: roarevent.media || 'http://www.google.com' }, styleClass: roarevent.styleClass || 'btn-dark', title: 'LexFrame', type: 'iframe', wid: n + 100 }]},
                    { cid: n + 10, styleClass: 'col-sm-6', widgets: [{ config: { id: 'PROMISE', height: '90vh' }, styleClass: roarevent.styleClass || 'btn-dark', title: 'LexPad', type: 'ckwidget', wid: n + 1010 }, { config: { id: 'PROMISE', height: '90vh' }, styleClass: roarevent.styleClass || 'btn-dark', title: 'Metadata', type: 'metadata', wid: n + 101 }, { config: { id: 'PROMISE', height: '90vh' }, styleClass: roarevent.styleClass || 'btn-dark', title: 'Text', type: 'text', wid: n + 105 }] }

                  ]
                }
              ]
              // roarevent.content = ckstarter + ckheader + ckender
              roarevent.structure = '6-6'
              roarevent.isActive = false

              // filepicker.storeUrl(roarevent.selflink,
              //   { filename: roarevent.filename },
              //   function (Blob) {
              //     filepicker.convert(
              //       Blob,
              //       { format: 'txt' },
              //       function (new_Blob) {
              //         roarevent.txt = new_Blob.url

              // alertify.success('text file added for' + roarevent.title)
              var refr = Collection(de).$ref()
              main.progresstwo++
              refr.set(roarevent, function (err) {
                var id = de

                refr.update({
                  id: id,

                  timestamp: Firebase.ServerValue.TIMESTAMP
                })
                refr.child('rows').child('0').child('columns').child('1').child('widgets').child('0').child('config').child('id').set(id)
                refr.child('rows').child('0').child('columns').child('1').child('widgets').child('1').child('config').child('id').set(id)
                refr.child('rows').child('0').child('columns').child('1').child('widgets').child('2').child('config').child('id').set(id)
                // p.filelist.push(id)
                // phdref.child('roarmap').child('roarlist').push(id)
                // roarmap.roarevents.push(id)
                phd.roarmap.roarlist[id] = id

                var appref = Collection(roarevent.Application).$ref()
                appref.child('history').child(roarevent.date).child(id).set(id)
                allref.child('roarlist').child(id).set(id)

                var oc = new RegExp(/(^CLM)|(NOA)|(CTNF)|(CTFR)|(REM)|(^\bA\..)|(CTRS)|(CTNS)|(^\bSA\..)/)
                if (oc.test(roarevent.doccode) !== false) {
                  main.pushtoqueue(file)
                }
                angular.forEach(MERITSDOCS, function (code, key) {
                  if (roarevent.doccode === code) {

                    // p.meritslist.push(id)
                    // dashboardsref.child('roarlist').push(id)

                    meritsref.child('roarlist').child(id).set(id)

                    buffe.push(file)
                    $log.info('merits', id)
                  }
                })

                angular.forEach(ARTDOCS, function (code, key) {
                  if (roarevent.doccode === code) {

                    // p.artlist.push(id)

                    artref.child('roarlist').child(id).set(id)
                    $log.info('art', id)
                  }
                })
                angular.forEach(CLAIMDOCS, function (code, key) {
                  if (roarevent.doccode === code) {
                    claimref.child('roarlist').child(id).set(id)
                    $log.info('claims', id)
                  }
                })
              })
            }
          })
          angular.forEach(buffe, function (file, key) {
            main.pushtoqueue(file)
          })
          return deferred.resolve(groupids)
        //  $timeout(function() {
        //      buildcollections(p)
        //  }, 30000)
        }

        function buildcollections (phd) {
          var d = new Date()
          var n = d.getTime()

          var Binder = function (options) {
            var binder = this
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
              rows: [{ styleClass: 'row leather', columns: [{ cid: n + 10, styleClass: 'col-sm-12', widgets: [{ type: 'pagebuilder', title: options.rid + ' - ' + 'USSN ' + phd.application['Application Number'], styleClass: options.styleClass || 'btn-dark', config: { id: 'PROMISE', url: '/llp_core/modules/roarmap/directive/roargrid/roargrid.html' } }] }] }]

            }
            return binder
          }
          var phdall = { rid: 'PHD1', title: 'ALL', styleClass: 'NOA', icon: 'fa-legal', sortOrder: 1 },
            phdmerits = { rid: 'PHD4', title: 'MERITS', styleClass: 'PTO', icon: 'fa-balance-scale', sortOrder: 4 },
            phdart = { rid: 'PHD2', title: 'ART', styleClass: 'Petition', icon: 'fa-leaf', sortOrder: 2 },
            phdclaims = { rid: 'PHD3', title: 'CLAIMS', styleClass: 'Applicant', icon: 'fa-sitemap', sortOrder: 3 }
          var groupids = []
          var groups = { all: phdall, merits: phdmerits, art: phdart, claims: phdclaims }
          angular.forEach(groups, function (group, key) {
            var refr = Collection(phd.patent.id + group.title).$ref()
            refr.set(new Binder(group), function (err) {
              var id = phd.patent.id + group.title
              refr.update({
                id: id,
                timestamp: Firebase.ServerValue.TIMESTAMP
              })
              refr.child('rows').child('0').child('columns').child('0').child('widgets').child('0').child('config').child('id').set(id)
              // ref.child('roarlist').push(id)
              // phd.roarmap.collections[id] = id
              // phd.roarlist[id] = id
              //  phdref.child('roarmap').child('collections').push(id)
              //  phdref.child('roarlist').push(id)
              // dashboardsref.child('roarlist').push(id)
              //  projref.child('roarlist').push(id)

              return groupids.push(id)
            })
          })
          //  buildroar(groupids)
          $timeout(function () {
            addpatent(groupids, phd)
          }, 500)
        }

        function addpatent (groupids, phd) {
          var date = new Date()
          var d = new Date()
          var n = d.getTime()
          var patent =phd.patent
          patent.rows = [
            {
              columns: [
                { cid: n + 10, styleClass: 'col-sm-6', widgets: [{ config: { height: '30em', url: patent.media || 'http://www.google.com' }, title: patent.title || 'title', titleTemplateUrl: '{widgetsPath}/testwidget/src/title.html', type: 'iframe', wid: n + 100, styleClass: patent.styleClass || 'btn-dark' }] },
                { cid: n + 1000, styleClass: 'col-sm-6', widgets: [{ config: { id: 'PROMISE' }, title: patent.title || 'title', titleTemplateUrl: '{widgetsPath}/testwidget/src/title.html', type: 'ckwidget', wid: n + 15, styleClass: patent.styleClass || 'btn-dark' }] }
              ]
            }
          ]
          patent.structure = '6-6'
          var refr = Collection(phd.patent.id).$ref()
          refr.set(patent, function (err) {
            var id = phd.patent.id
            refr.update({
              id: id,
              timestamp: Firebase.ServerValue.TIMESTAMP
            })
            refr.child('rows').child('0').child('columns').child('1').child('widgets').child('0').child('config').child('id').set(id)
            var allref = Collection(groupids[0]).$ref()
            var meritsref = Collection(groupids[1]).$ref()
            allref.child('roarlist').child(id).set(id)
            meritsref.child('roarlist').child(id).set(id)
            buildroar(groupids, phd)
          })
        }
      }
    }
  ]).controller('PageslideCtrl', ['$scope', function ($scope) {
  $scope.checked = false; // This will be binded using the ps-open attribute

  $scope.toggle = function () {
    $scope.checked = !$scope.checked
  }
  $scope.checked1 = false; // This will be binded using the ps-open attribute

  $scope.toggle1 = function () {
    $scope.checked1 = !$scope.checked1
  }
  $scope.checked2 = false; // This will be binded using the ps-open attribute

  $scope.toggle2 = function () {
    $scope.checked2 = !$scope.checked2
  }
}]).filter('strip', function () {
  return function (input) {
    if (input !== (null || undefined)) {
      var regex = new RegExp(/\D/ig)
      var output = input.replace(regex, '')
      return output
    }else {
      return input
    }
  }
}).directive('docHeader', ['$window', '$document', '$compile', '$templateCache', 'Collection', function ($window, $document, $compile, $templateCache, Collection) {
  return {
    restrict: 'EA',
          priority: 1,
      terminal:true,
      scope: {
      //roarevent: '=?'
    },
    transclude: true,
    templateUrl: '{widgetsPath}/getphd/src/phd/docheader.html',
    controller:'DocHeaderController',
    controllerAs: 'roar',
    bindToController: true,
    // controllerAs:'roarevent',
    // bindToController: true,
    link: function ($scope, $element, $attrs, $ctrl) {
      var roarid = $attrs.roarid || $attrs.id
      $scope.roarid = roarid
      Collection(roarid).$loaded().then(function (roarevent) {
        $scope.roarevent = roarevent

        var maildate = new Date(roarevent['Mail Room Date'])

        $scope.roardate = maildate.toDateString()
        var background = function (styleClass) {
          var template
          // var styleClass = roarevent.styleClass
          switch (styleClass) {
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
                template = '999999';
                break;
              case 'NOA':
                template = '7c994f';
                break;
              case 'primary':
                template = '025aa5';
                break;
              case 'info':
                template = '5bc0de';
                break;
              case 'success':
                template = '449d44';
                break;
              case 'warning':
                template = 'f0ad4e';
                break;
              case 'danger':
                template = 'c9302c';
                break;
              case 'dark':
                template = '000000';
                break;
              case 'fancy':
                template = 'dddddd';
                break;
              case 'royal':
                template = 'aa00ff';
                break;
              case 'undefined':
                template = '111111';
                break;
              case 'default':
                template = 'ffffff';
                break;
              case 'flat':
                template = 'aaaaaa';
                break;
              case 'glass':
                template = 'f0f0f0';
                break;
                
          }

          return 'https://placehold.it/450x350/' + template + '/ffa&text=' + $scope.roarevent.rid
        }
        $scope.background = background
      })
    }
  }
}]).directive('patentreport', ['$http', 'ckstarter', 'ckender', function ($http, ckstarter, ckender) {
  return {
    restrict: 'EA',
          priority: 1,
      terminal:true,
    templateUrl: '{widgetsPath}/getphd/src/phd/patentReport.html',
    scope: {
      config: '='
    },
    controller: 'PatentWidgetCtrl',
    link: function ($scope, $element, $attr, $ctrl) {
      // $scope.config = {PNUM: $attr.patent}

    }
  }
}])
  .directive('patentCitation', ['$http', 'Collection', '$patentsearch', '$filter', function ($http, Collection, $patentsearch, $filter) {
    return {
      restrict: 'EA',
            priority: 1,
      terminal:true,
      templateUrl: '{widgetsPath}/getphd/src/phd/citation.html',
      scope: {
        ref: '='
      },

      link: function ($scope, $element, $attrs, $ctrl) {
        // var p = this
        // var id = $attrs.patent
        var ref = $scope.ref.match(/\d+/ig)
        var refa = $scope.ref.replace(/\:/ig, '')
        console.log(ref[0])
        try {
          $patentsearch(null, {PNUM: ref[0]}).then(function (patent) {
            $scope.poo = ref[0]
            $scope.p = patent
            var int = parseInt(ref[0])
            if (int > 2000000000) {
              $scope.poodle = $filter('published_application')(int)
            }else {
              $scope.poodle = $filter('number')(int, 0)
            }
          })
        } catch (ex) {
          $patentsearch(null, {PNUM: refa}).then(function (patent) {
            $scope.p = patent
          })
        // $http.get('/proxy/lexspace.net/getphd/patents/' + ref).then(function (resp) {
        //   $scope.p = resp.data
        // })
        }
        finally {
          // alertify.success('loaded!')
        }
      }
    }
  }])
.directive('noteswidget', ['$rootScope','Users','Notes','Note',function($rootScope, Users, Notes, Note){
  return {
    restrict: 'A',
          priority: 1,
      terminal:true,
    replace: true,
    templateUrl: '/llp_core/modules/roarmap/directive/roarevent/notes.tpl.html',
    controller: 'NotesController',
    controllerAs: 'notesCtrl',
    scope: false,
    link: function($scope, $element, $attr, $ctrl){
       var id = $attr.noteswidget;
       var notes = Notes(id).$loaded().then(function(notes){
        $scope.notes = notes; 
       })
       var mynotes = Note(id).$loaded().then(function(note){
        $scope.note = note;
       })
       $scope.Users = Users();
       $scope.addNote = notes.$add('MyNote');

    }
  }
}])
.controller('NotesController',[])
.controller('DocHeaderController', ["$aside", "toastr", "$uibModal", "$compile", "Collection", "$scope", "$templateCache", "ngDialog", "$ACTIVEROAR", "$window", "$rootScope", "PROJECT", "$stateParams", "$sce", "Fullscreen", "$clipboard", "ROARevents", "$http", function ($aside, toastr, $uibModal, $compile, Collection, $scope, $templateCache, ngDialog, $ACTIVEROAR, $window, $rootScope, PROJECT, $stateParams, $sce, Fullscreen, $clipboard, ROARevents, $http) {
    var roar = this;

$scope.openpreview = function (draft) {
      $window.htmltoload = draft.content
      $window.open('javascript:void( (function(){' +
        'document.open();' +
        'document.write(window.opener.htmltoload);' +
        'document.close();' +
        'window.opener.htmltoload = null;' +
        '})() )', null, 'toolbar=yes,location=no,status=yes,menubar=yes,scrollbars=yes,resizable=yes,width=700,height=700')
    }

    $scope.remove = function () {
      $(this).parent().parent().remove()
    }
    $scope.alert = function (msg) {
      alertify.alert(msg)
      roar.newnoteonroar($scope.roarevent)
    }
    $scope.openFullScreen = function (roareventid) {
      // alertify.log(roareventid)
       //Fullscreen.toggleAll()
      if ($scope.full !== true) {
        $('.issuedocpanel').css({
          'position': 'absolute',
          'top': '0px',
          'left': '0px',
          'bottom': '0px',
          'right': '0px',
          'width': '100%',
          'z-index': '100000',
          'transition': 'all 0.5s ease-out'
        })
        $('.fa-expand').addClass('fa-compress').removeClass('fa-expand')
        $scope.full = true
      } else {
        $('.issuedocpanel').css({
          'position': 'absolute',
          'top': '6rem',
          'left': '10rem',
          'bottom': null,
          'right': null,
          'width': 'initial',
          'z-index': '9999',
          'transition': 'all 0.5s ease-out'
        })

        $('.fa-compress').addClass('fa-expand').removeClass('fa-compress')
        $scope.full = false
      }
    //                roar.openmodal(this)
    }
    $scope.edit = function () {
      roar.copytoclipboard($scope.roarevent)
    }
    $scope.$window = $window
    $scope.close = function () {
      ngDialog.closeThisDialog()
    }
    $scope.saveDraft = function (note) {
      if (angular.isUndefined($scope.roarevent.notes)) {
        $scope.roarevent.notes = []
        $scope.roarevent.notes.push(note)
      } else {
        $scope.roarevent.notes.push(note)
      }
      $scope.closeThisDialog()
    }
    roar.newnoteonroar = function (roarevent) {
      $aside.open({
        templateUrl: '/llp_core/partials/statusboard/partials/newCard.html',
        controller: 'ROARChipCtrl',
        placement: 'top',
        size: 'lg'
      })

    // ngDialog.open({
    //     data: roarevent,
    //     scope: $scope,
    //     template: '/llp_core/partials/statusboard/partials/newCard.html',
    //     controller: 'ROARChipCtrl',
    //     className: 'ngdialog-theme-inline',
    //     plain: false,
    //     closeByEscape: true,
    //     closeByDocument: true,
    //     showClose: true,
    //     appendTo: false
    // })
    }
    roar.show = function (roarevent) {
      var ref = Collection(roarevent.$id || roarevent).$ref()
      //             if(angular.isUndefined(window) ){

      //                 var BrowserWindow = require('electron').remote

      // var win = new BrowserWindow({width: 800, height: 600})
      // win.loadURL(event.media)
      //             }else{
      Collection(roarevent.$id || roarevent).$loaded().then(function (event) {
        if (event.document_type !== 'html') {
          var divpanel = angular.element('<div/>').attr('id', event.id || event.$id).attr('class', "issuedocpanel panel panel-{{roarevent.styleClass || 'default'}} stacker ").css({
            'z-index': '10000','width': '45vw','margin': '10px','height': '90vh'
          })
          // var header = angular.element('<h4 class="splash">' + event.rid + ' - ' + event.name + '<span class="fa fa-close btn btn-xs btn-danger" style="float: right;" onclick="$(this).parent().parent().remove()"></span></h4><h6>' + event.media + '</h6>')

          var header = $templateCache.get('{widgetsPath}/getphd/src/titleTemplate.html')

          var skope = angular.element('<iframe allowfullscreen  fullscreen="{{full}}" uib-collapse="isCollapsed" name="fframe"/>').attr('id', event.id || event.$id).attr('height', '90vh').attr('width', '100%').attr('src', event.mediaUrl || event.media || event.thumbnail || 'https://placehold.it/500x500/000/ffa&text=X').attr('class', 'panel-body')

          angular.element('body').append($compile(divpanel.append(header).append(skope))($scope))
          $(divpanel).draggable({
            stack: '.stacker',
            handle: 'h4'
          }).resizable()
          interact(divpanel).draggable();
          /*interact('.issuedocpanel', {    ignoreFrom: '.card'})
  .draggable({
    onmove: window.dragMoveListener
  })
  .resizable({
    preserveAspectRatio: false,
    edges: { left: true, right: true, bottom: true, top: false }
  })
  .on('doubletap', function (event) {
    event.currentTarget.remove();
    //event.currentTarget.classList.remove('rotate');
    event.preventDefault();
  });*/
        }
      })
      // }

    }
    roar.present = function (roarevent) {
      var ref = Collection(roarevent.$id).$ref()

      var divpanel = angular.element('<div/>').attr('id', roarevent.id || roarevent.$id).attr('class', "issuedocpanel panel panel-{{roarevent.styleClass || 'default'}} stacker").css({
        'z-index': '100000','width': '45vw','margin': '10px','height': '90vh'
      })
      // var header = angular.element('<h4 class="splash">' + event.rid + ' - ' + event.name + '<span class="fa fa-close btn btn-xs btn-danger" style="float: right;" onclick="$(this).parent().parent().remove()"></span></h4><h6>' + event.media + '</h6>')
      var header = $templateCache.get('{widgetsPath}/getphd/src/titleTemplate.html')
      var skope = angular.element('<iframe allowfullscreen fullscreen="{{full}}" uib-collapse="isCollapsed" class="panel-body" style="width:100%;height:600px;z-index:0;" ng-attr-srcdoc="{{roarevent.content || collection.content || \'<p>Nothing to see here</p>\' | trustAsHTML}}"  name="fframe"/>').attr('id', roarevent.id || roarevent.$id)
      // var skope = angular.element('<iframe/>').attr('srcdoc', ('<!DOCTYPE html><html><head></head><body><div class="card card-default">' + angular.fromJson(event.content) + '</div></body></html>'))
      // var skope = $sce.trustAsHtml(roarevent.content)
      angular.element('body').append($compile(divpanel.append(header).append(skope))($scope))
      $(divpanel).draggable({
        scroll: true,
        // scrollSpeed: 250,
        // scrollSensitivity: 200,
        // snap: 'body',
        cursor: 'move',
        // containment: 'body',
        stack: '.stacker',
        handle: 'h4'

      }).resizable()
      interact(divpanel).draggable();
      /*interact('.issuedocpanel',{    ignoreFrom: '.card'
})
  .draggable({
    // inertia: true,
    // autoScroll: true,

    onmove: window.dragMoveListener
  })
  .resizable({
    preserveAspectRatio: true,
    edges: { left: true, right: true, bottom: true, top: true }
  })
  .on('doubletap', function (event) {
    event.currentTarget.remove();
    //event.currentTarget.classList.remove('rotate');
    event.preventDefault();
  });*/

      //     var divpanel = angular.element('<div/>').attr('id',roarevent.id || roarevent.$id).attr('class', 'issuedocpanel  stacker').css({'z-index':'10000'})
      //     //var header = angular.element('<h4 class="splash">' + event.rid + ' - ' + event.name + '<span class="fa fa-close btn btn-xs btn-danger" style="float: right;" onclick="$(this).parent().parent().remove()"></span></h4><h6>' + event.media + '</h6>')
      //     var header = $templateCache.get("{widgetsPath}/getphd/src/titleTemplate.html")
      //    var skope = angular.element('<iframe class="" style="width:100%;height:100%;z-index:0;"/>').attr('id',roarevent.id || roarevent.$id).attr('src', window.URL.createObjectURL(new Blob([roarevent.newtext],{name:roarevent.Filename+'.html',type:'text/html'})))
      //     //var skope = angular.element('<iframe/>').attr('srcdoc', ('<!DOCTYPE html><html><head></head><body><div class="card card-default">' + angular.fromJson(event.content) + '</div></body></html>'))
      //    // var skope = $sce.trustAsHtml(roarevent.content)
      //     angular.element('body').append($compile(divpanel.append(header).append(skope))($scope))
      //     $('.issuedocpanel').draggable({
      //         stack: '.stacker',
      //         handle: 'h4'
      //     }).resizable()

    }
    //     }
    // }
    roar.copytoclipboard = function (item) {
      $clipboard().$add(item.id || item).then(function (ref) {
        toastr.info('COPY TO CLIPBOARD')
      })
      // $rootScope.$broadcast('COPYTOCLIPBOARD', item.id || item)
      //   alertify.log('COPY to CLIPBOARD', item.id || item)

      //   Collection(thing.id || thing).$loaded().then(function (item) {
      //       $rootScope.$broadcast('COPYTOCLIPBOARD', item)
      //       alertify.log('COPY to CLIPBOARD', item)

      //   })

    }
    $scope.$on('adfWidgetAdded', function (event, name, model, widget) {
      widget.titleTemplateUrl = '{widgetsPath}/testwidget/src/title.html'
      widget.styleClass = model.styleClass || 'panel-dark'
      widget.frameless = false
      widget.reload = true

      model.config.id = model.$id
      console.log(model)
      Collection(model.$id).$loaded().then(function (collection) {
        collection.$save(model)
      })
      alertify.success('widget added! model saved!')
    })

    $scope.$on('adfDashboardChanged', function (event, name, model) {
      console.log('event', event)
      console.log('name', name)
      console.log('model', model)

      Collection(model.$id).$loaded().then(function (collection) {
        collection.$save(model)
      })
    })

    roar.openmodal = function (roarevent) {
      $ACTIVEROAR.roarevent = roarevent
      console.log('opening', roarevent)
      var editScope = $scope.$new()
      var opts = {
        scope: editScope,
        template: '<div class=modal-header>  <h4 class=modal-title>{{definition.title}}</h4> <div class="pull-right widget-icons"> <a href title="Reload Widget Content" ng-if=widget.reload ng-click=reload()> <i class="glyphicon glyphicon-refresh"></i> </a> <a href title=close ng-click=closeDialog()> <i class="glyphicon glyphicon-remove"></i> </a> </div></div> <div class=modal-body><adf-dashboard id="{{roarevent.id}}" name="{{roarevent.id}}"  title-template-url="\'/llp_core/modules/lionlawlabs/partial/projectdashboard/tabs/memo/title.html\'" enable-confirm-delete="true" structure="{{roarevent.structure}}" adf-model="roarevent" class="" editable="true" style="overflow:scroll;" /></adf-dashboard></div><div class="modal-footer"><button type="button" class="btn btn-primary" ng-click="closeDialog()">Close</button></div>',
        backdrop: 'static',
        size: 'lg'
      }

      var instance = $uibModal.open(opts)

      editScope.closeDialog = function () {
        instance.close()
        editScope.$destroy()
      }

      // ngDialog.open({
      //     template: '<adf-dashboard id="{{roarevent.id}}" name="{{roarevent.id}}"  title-template-url="\'/llp_core/modules/lionlawlabs/partial/projectdashboard/tabs/memo/title.html\'" enable-confirm-delete="true" structure="{{roarevent.structure}}" adf-model="roarevent" class="" editable="true" style="overflow:scroll;" /></adf-dashboard>',
      //     controller: 'xlDialogIdCtrl',
      //     data: roarevent,
      //     scope: $scope,
      //     className: 'ngdialog-theme-xl',
      //     closeByDocument: true,
      //     closeByEscape: true,
      //     plain: true,
      //     showClose: false,
      //     closeByEscape: true,
      //     closeByNavigation: false,

      //     preCloseCallback: false

    // })
    }
    roar.moveLeft = function (roarevent) {
      var b = roarevent.sortOrder || 0
      $scope.roarevent.sortOrder = b - 1
      $scope.roarevent.$save()
    }
    roar.moveRight = function (roarevent) {
      var a = roarevent.sortOrder || 0
      $scope.roarevent.sortOrder = a + 1
      $scope.roarevent.$save()
    }
    roar.toggleSelection = function (roarevent, col) {
      /*
      if(col.selected[roarevent.$id] == roarevent.$id){
        roarevent.isSelected = false
        col.selected[roarevent.$id] = null
        roarevent.$save()
        col.$save()
      }
      else{
        roarevent.isSelected = true
        col.selected[roarevent.$id] = roarevent.$id
        roarevent.$save()
        col.$save()
      }*/
      roarevent.isSelected = !roarevent.isSelected
      roarevent.$save()
    }
    roar.movetorecyclebin = function (tab) {
      //  $scope.roarevents.$remove(tab)
      // var roarevents = ROARevents($scope.collection.$id)
      // roarevents.$remove(tab)
      var pageid = $stateParams.tabid || $stateParams.pageid || $stateParams.pId
      var id = tab.id || tab
      Collection(pageid).$ref().child('roarlist').child(id).set(null)
      PROJECT($stateParams.pId).$ref().child('log').push({
        message: ' removed ',
        recordid: tab.id || tab,
        contextid: $stateParams.pageid,
        messagetwo: ' from ',
        user: $rootScope.authData.uid,
        styleClass: 'danger',
        timestamp: firebase.database.ServerValue.TIMESTAMP
      })
    }
    $scope.note = function (roarevent) {
      return roar.newnoteonroar(roarevent)
    }
    roar.collapse = function () {
      $scope.isCollapsed = !$scope.isCollapsed
      $('#' + roarevent.$id).css({'height': '75px'})
    }
    roar.rightmenu = {
      icon: 'fa-chevron-down',
      items: [{
        icon: 'fa-external-link',
        label: 'Pop out',
        styleClass: '',
        onClick: function (roarevent) {
          return roar.show(roarevent.id)
        }
      }, {
        icon: 'fa-copy',
        label: 'Copy to Clipboard',
        styleClass: '',
        onClick: function (roarevent) {
          return roar.copytoclipboard(roarevent)
        }
      }, {
        icon: 'fa-edit',
        label: 'Details',
        styleClass: '',
        onClick: function (roarevent) {
          return roar.openmodal(roarevent)
        }
      }, {
        icon: 'fa-pencil',
        label: 'Quick Note',
        styleClass: '',
        onClick: function (roarevent) {
          return roar.newnoteonroar(roarevent)
        }
      }, {
        styleClass: 'divider'
      }, {
        icon: 'fa-close',
        label: 'Remove',
        styleClass: ' text-danger',
        onClick: function (roarevent) {
          return roar.movetorecyclebin(roarevent)
        }
      }

      // ,
      //  {   icon: 'fa-close',
      //     label: 'Remove',
      //     styleClass: 'text-danger',
      //     onClick: function (revent) { return re.movetorecyclebin(revent); }
      // }
      ]
    }

}])
/*.directive('target', [function(){
  return {
    restrict: 'A',
    scope: false,
    link: function($scope,$el,$attr,$ctrl){
       var popdoc = function(event){

         var ellist = document.getElementsByName($attr.target || 'fframe');
         angular.forEach(ellist,function(value,key){
            $(value).attr('src',$attr.href);
         });
         console.log(ellist);
       }
       $el.on('click', function(e) {
                    console.log('event', e)
                    //e.preventDefault();
                    popdoc(e);
                });
      
    }
  }
}])
.directive('fframe', [function(){
  return {
    restrict: 'AC',
    scope: false,
    link: function($scope,$el,$attr,$ctrl){
       var popdoc = function(event){
         var ellist = document.getElementsByName('fframe');
         angular.forEach(ellist,function(value,key){
            $(value).attr('src',$attr.href);
         });
         console.log(ellist);
       }
       $el.on('click', function(e) {
                    console.log('event', e)
                    //e.preventDefault();
                    popdoc(e);
                });
      
    }
  }
}])*/
  /*var apptemplate =  '<div class="container-fluid two-col-right">' +
            '<div class="row">' +
            '<div class="col-xs-8"><div class="bs-callout bs-callout-Applicant"><h4>'+ roarevent.title+'</h4><p>Filed '+roardate+'</p><cite>'+roarevent.filename+'&nbsp;&nbsp;<a href="'+roarevent.media+'" target="fframe"><i class="fa fa-external-link"></i></a></cite></div></div>' +
            '<div class="col-xs-4"><iframe name="fframe" id="fframe" style="width:350px;height:480px;" src="https://placehold.it/350x480/4682b4/fff/&text='+roarevent.rid+'" class="img img-responsive img-shadow"><img src="https://placehold.it/350x480/4682b4/fff/&text='+roarevent.rid+'" class="img img-responsive img-shadow"/></iframe></div>' +
            '</div>' +
            '</div><p>&nbsp;</p>'
       var ptotemplate = '<div class="container-fluid two-col-left">' +
            '<div class="row">' +
            '<div class="col-xs-4"><iframe name="fframe" id="fframe" style="width:350px;height:480px;" src="https://placehold.it/350x480/b48200/fff/&text='+roarevent.rid+'" class="img img-responsive img-shadow"><img src="https://placehold.it/350x480/b48200/fff/&text='+roarevent.rid+'" class="img img-responsive img-shadow"/></iframe><p><img src="https://placehold.it/250x208/640002/fff/&text='+ roarevent.rid + '" class="img img-responsive img-shadow"/></p></div>' +
            '<div class="col-xs-8"><div class="bs-callout bs-callout-PTO bs-callout-reverse"><h4>'+ roarevent.title + '</h4><p>Filed '+roardate+'</p><cite>'+roarevent.filename+'&nbsp;&nbsp;<a href="'+roarevent.media+'" target="fframe"><i class="fa fa-external-link"></i></a></cite></div></div>' +
            '</div>' +
            '</div><p>&nbsp;</p>'
      var noatemplate = '<div class="container-fluid two-col-left">' +
            '<div class="row">' +
            '<div class="col-xs-4"><iframe name="fframe" id="fframe" style="width:350px;height:480px;" src="https://placehold.it/350x480/b48200/fff/&text='+roarevent.rid+'" class="img img-responsive img-shadow"><img src="https://placehold.it/350x480/b48200/fff/&text='+roarevent.rid+'" class="img img-responsive img-shadow"/></iframe><p><img src="https://placehold.it/250x208/7c994f/fff/&text='+roarevent.rid+'" class="img img-responsive img-shadow"/></p></div>' +
            '<div class="col-xs-8"><div class="bs-callout bs-callout-NOA bs-callout-reverse"><h4>' + roarevent.title + '</h4><p>Filed '+roardate+'</p><cite>'+roarevent.filename+'&nbsp;&nbsp;<a href="'+roarevent.media+'" target="fframe"><i class="fa fa-external-link"></i></a></cite></div></div>' +
            '</div>' +
            '</div><p>&nbsp;</p>'
      var petitiontemplate = '<div class="container-fluid two-col-right">' +
            '<div class="row">' +
            '<div class="col-xs-8"><div class="bs-callout bs-callout-Petition"><h4>'+ roarevent.title + '</h4><p>Filed '+roardate+'</p><cite>'+roarevent.filename+'&nbsp;&nbsp;<a href="'+roarevent.media+'" target="fframe"><i class="fa fa-external-link"></i></a></cite></div></div>' +
            '<div class="col-xs-4"><iframe name="fframe" id="fframe" style="width:350px;height:480px;" src="https://placehold.it/350x480/b48200/fff/&text='+roarevent.rid+'" class="img img-responsive img-shadow"><img src="https://placehold.it/350x480/b48200/fff/&text='+roarevent.rid+'" class="img img-responsive img-shadow"/></iframe></div>' +
            '</div>' +
            '</div><p>&nbsp;</p>'
             var interviewtemplate = '<div class="container-fluid two-col-right">' +
            '<div class="row">' +
            '<div class="col-xs-8"><div class="bs-callout bs-callout-Interview"><h4>'+ roarevent.title + '</h4><p>Filed '+roardate+'</p><cite>'+roarevent.filename+'&nbsp;&nbsp;<a href="'+roarevent.media+'" target="fframe"><i class="fa fa-external-link"></i></a></cite></div></div>' +
            '<div class="col-xs-4"><iframe name="fframe" id="fframe" style="width:350px;height:480px;" src="https://placehold.it/350x480/b48200/fff/&text='+roarevent.rid+'" class="img img-responsive img-shadow"><img src="https://placehold.it/350x480/b48200/fff/&text='+roarevent.rid+'" class="img img-responsive img-shadow"/></iframe><p><img src="https://placehold.it/250x208/&text='+roarevent.rid+'" class="img img-responsive img-shadow"/></p></div>' +
            '</div>' +
            '</div><p>&nbsp;</p>'
            */

app
      .directive('collection', ['Collection','ROARevents','ROARevent', function(Collection, ROARevents, ROARevent) {
          return {
              restrict: 'EA',
              replace: false,
              priority: 1,
              terminal: true,
              scope: true,
              // transclude: true,
              //template: '<ng-transclude></ng-transclude>',
              link: function($scope, $element, $attrs, fn) {
                  var roarId = $attrs.collection;
                  var collection = Collection(roarId.id || roarId.$id || roarId.$value || roarId);
                  collection.$loaded().then(function(collection){
                  $scope.collection = collection;
                      
                  });
                //   collection.$bindTo($scope, 'collection');
                // collection.$loaded().then(function(collection){
                // $scope.rows = angular.copy(collection.rows);
                    
                // })
                //   var roararray = ROARevents(roarId.id || roarId.$id || roarId.$value || roarId);
                //   var newarray = [];
                //   angular.forEach($scope.collection.roarlist, function(value, key){
                //       var roarevent = ROARevent(key);
                //       newarray.push(roarevent);
                //   });
                 // $scope.roarevents = ROARevents(roarId.id || roarId.$id || roarId.$value || roarId);
              }
          };
      }])
      .filter('slide', function(){
        return function(input_html){
          var start = input_html.slice(input_html.indexOf('<!--CUTSLIDEHEAD-->')-1,input_html.lastIndexOf('<!--CUTSLIDETAIL-->')+19);
          return start
        }
      })

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

// <text-size-slider min="8" max="38" unit="vw" value="10" step="2"></text-size-slider>


angular.module('roar',[])
  .factory('$roarevent', ['OWNERSHIPDOCS', 'ARTDOCS', 'MERITSDOCS', 'DOCNAMES', 'PETDOCCODES', 'NOADOCCODES', 'INTVDOCCODES', 'PTODOCCODES', 'APPDOCCODES', '$q', '$filter', 'ckstarter', 'ckender',
  function (OWNERSHIPDOCS, ARTDOCS, MERITSDOCS, DOCNAMES, PETDOCCODES, NOADOCCODES, INTVDOCCODES, PTODOCCODES, APPDOCCODES, $q, $filter, ckstarter, ckender) {
    return function (file) {
      var deferred = $q.defer();
      parse(file);
      return deferred.promise;
      function parse(file) {
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
          angular.forEach(APPDOCCODES, function (code, key) {
            if (doccode === code) {
              roarevent.styleClass = 'Applicant';
            }
          });
          angular.forEach(PTODOCCODES, function (code, key) {
            if (doccode === code) {
              roarevent.styleClass = 'PTO';
            }
          });
          angular.forEach(INTVDOCCODES, function (code, key) {
            if (doccode === code) {
              roarevent.styleClass = 'Interview';
            }
          });
          angular.forEach(NOADOCCODES, function (code, key) {
            if (doccode === code) {
              roarevent.styleClass = 'NOA';
            }
          });
          angular.forEach(PETDOCCODES, function (code, key) {
            if (doccode === code) {
              roarevent.styleClass = 'Petition';
            }
          });
          angular.forEach(DOCNAMES, function (code, key) {
            angular.forEach(code, function (value, key) {

              if (doccode === key) {
                roarevent.name = value;
                roarevent.title = value;
              }
              else { roarevent.name = filename }
            });
          });
          var date = new Date();
          var d = new Date();
          var n = d.getTime();
          roarevent.rows = [
                {
                  columns: [{cid:n+9,styleClass:'col-sm-6',widgets:[{ config: { height: "90vh", url: roarevent.media || '.' }, styleClass: roarevent.styleClass || 'btn-dark', title: 'LexFrame', type: 'iframe', wid: n + 100 }]},
                    { cid: n + 10, styleClass: 'col-sm-6', widgets: [{ config: { id: 'PROMISE', height: '90vh' }, styleClass: roarevent.styleClass || 'btn-dark', title: 'LexPad', type: 'ckwidget', wid: n + 1010 },{ config: { id: 'PROMISE', height: '90vh' }, styleClass: roarevent.styleClass || 'btn-dark', title: 'Metadata', type: 'metadata', wid: n + 101 }, { config: { id: 'PROMISE', height: '90vh' }, styleClass: roarevent.styleClass || 'btn-dark', title: 'Text', type: 'text', wid: n + 105 }] }

                  ]
                }
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

          roarevent.rows = [
                {
                  columns: [{cid:n+9,styleClass:'col-sm-6',widgets:[{ config: { height: "90vh", url: roarevent.media || 'http://www.google.com' }, styleClass: roarevent.styleClass || 'btn-dark', title: 'LexFrame', type: 'iframe', wid: n + 100 }]},
                    { cid: n + 10, styleClass: 'col-sm-6', widgets: [{ config: { id: 'PROMISE', height: '90vh' }, styleClass: roarevent.styleClass || 'btn-dark', title: 'LexPad', type: 'ckwidget', wid: n + 1010 },{ config: { id: 'PROMISE', height: '90vh' }, styleClass: roarevent.styleClass || 'btn-dark', title: 'Metadata', type: 'metadata', wid: n + 101 }, { config: { id: 'PROMISE', height: '90vh' }, styleClass: roarevent.styleClass || 'btn-dark', title: 'Text', type: 'text', wid: n + 105 }] }

                  ]
                }
              ];
          roarevent.structure = "6-6";
          return deferred.resolve(roarevent);
        }


      };
    };

  }])
  .factory('$roarmap', ['$stateParams', 'Matter', 'Collection', 'ROARevent', 'ROARevents', 'Collections',  '$timeout', 'OWNERSHIPDOCS', 'ARTDOCS', 'MERITSDOCS', 'DOCNAMES', 'PETDOCCODES', 'NOADOCCODES', 'INTVDOCCODES', 'PTODOCCODES', 'APPDOCCODES', '$q', 'PHD', '$log',  'filepickerService', '$location', '$ACTIVEROAR', '$dashboards', 'CLAIMDOCS', 'ckstarter', 'ckender', 'ckheader', '$http', '$filter',
    function ($stateParams, Matter, Collection, ROARevent, ROARevents, Collections, $timeout, OWNERSHIPDOCS, ARTDOCS, MERITSDOCS, DOCNAMES, PETDOCCODES, NOADOCCODES, INTVDOCCODES, PTODOCCODES, APPDOCCODES, $q, PHD, $log,  filepickerService, $location, $ACTIVEROAR, $dashboards, CLAIMDOCS, ckstarter, ckender, ckheader, $http, $filter) {
      return function (files, phd, main) {








        phd.roarmap = {
          collections: [],
          roarlist: []
        };
        phd.roarlist = {};
        var buffe = [];
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
            if ((file['Mail Room Date'] === '') || (file['Filename'] === '')) {
              return;
            } else {
              var appnumber = angular.copy(phd.application['Application Number']).replace('/', '').replace(',', '').replace(',', '');
              var appref = Collection(appnumber).$ref();
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
              var subsectionid = filename.slice(filename.indexOf("-") + 11, filename.lastIndexOf("-"));
              var doccode = filename.slice((filename.lastIndexOf("-") + 1), (filename.indexOf(".pdf")));
              roarevent.content_type = 'document';
              var de = filename.slice(0, filename.lastIndexOf('-'));
              roarevent.id = de;
              if ($location.host() === 'localhost') {

                roarevent.ocrlink = './files/public/uspto/' + appnumsubstring + '/' + appnumsubstring + '-image_file_wrapper/' + filename;

                roarevent.selflink = '/files/public/uspto/' + appnumsubstring + '/' + appnumsubstring + '-image_file_wrapper/' + filename;
                roarevent.media = roarevent.ocrlink;
                //  roarevent.media = '/files/viewer/web/viewer.html?file=%2Ffiles/public/uspto/' + appnumsubstring + '/' + appnumsubstring + '-image_file_wrapper/' + filename;
              } else {
                roarevent.ocrlink = './files/public/uspto/' + appnumsubstring + '/' + appnumsubstring + '-image_file_wrapper/' + filename;

                roarevent.selflink = './files/public/uspto/' + appnumsubstring + '/' + appnumsubstring + '-image_file_wrapper/' + filename;
                roarevent.media = roarevent.ocrlink;
                //  roarevent.media = './files/public/viewer/web/viewer.html?file=%2Ffiles/public/uspto/' + appnumsubstring + '/' + appnumsubstring + '-image_file_wrapper/' + filename;
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
              angular.forEach(DOCNAMES, function (code, key) {
                angular.forEach(code, function (value, key) {

                  if (doccode === key) {
                    roarevent.name = value;
                    roarevent.title = value;
                  }
                });
              });


              var appfunction = function (roarevent, roarevents, controller, phd) {


                var template = '<script>var app = angular.module("ckapp").controller("AppCtrl", ["$scope", "$compile","$templateCache", "$http", "Collection","$window","$document","$location",function($scope, $compile,$templateCache, $http, Collection,$window,$document,$location){var app = this;' +
                  'app = ' + controller + ';' +
                  'app.patent = ' + phd.patent + ';' +
                  'app.roarevent = ' + roarevent + ';' +
                  'app.phd = ' + phd + ';' +
                  'console.log(' + controller + ');' +
                  'console.log(' + phd.patent + ');' +
                  'console.log(' + roarevent + ');' +
                  'console.log(' + phd + ');' +
                  '});</script>';
                return template;
              };

              var wraphead = ckstarter;
              var wraptail = ckender;
              var apptemplate = '<div id="docheader" class="container-fluid two-col-right" doc-header roarid="' + roarevent.id + '">' +
                // '<div class="row">' +
                // '<div class="col-xs-8"><div class="bs-callout bs-callout-Applicant"><h4>'+ roarevent.title+'</h4><p>Dated '+roardate+'</p><cite>'+roarevent.filename+'&nbsp;&nbsp;<a href="'+roarevent.media+'" pop="true" target="fframe"><i class="fa fa-external-link"></i></a></cite></div><input type="text" ng-model="query" placeholder="Search" class="fa fa-search fa-pull-left" /></div>
                '<div getpdftext="' + roarevent.id + '" pdf-data="' + roarevent.ocrlink + '">&nbsp;</div>' +
                // '<div class="col-xs-4 col-sm-3 card card-'+roarevent.styleClass+'"><img src="https://placehold.it/250x150/4682b4/fff/&text='+roarevent.rid+'" class="img img-hover img-responsive img-shadow"/> <p class="card-text"><label ng-repeat="match in matches track by $index | unique" class="fa fa-tag">{{match}}</label></p></div>' +
                // '<div class="col-xs-4"><img src="https://placehold.it/250x150/4682b4/fff/&text='+roarevent.rid+'" class="img img-hover img-responsive img-shadow"/></div>' +
                // '</div>' +
                '</div>';
              var ptotemplate = '<div id="docheader" class="container-fluid two-col-left" doc-header roarid="' + roarevent.id + '">' +
                '<div class="row">' +
                '<div class="col-xs-4 col-sm-3 card card-' + roarevent.styleClass + '"><img src="https://placehold.it/250x150/640002/fff/&text=' + roarevent.rid + '" class="img img-hover img-responsive img-shadow"/> <p class="card-text"><label ng-repeat="match in matches track by $index | unique" class="fa fa-tag">{{match}}</label></p></div>' +
                // '<div class="col-xs-4"><img src="https://placehold.it/250x150/640002/fff/&text='+roarevent.rid+'" class="img img-hover img-responsive img-shadow"/></div>' +
                '<div class="col-xs-8"><div class="bs-callout bs-callout-PTO bs-callout-reverse"><h4>' + roarevent.title + '</h4><p>Dated ' + roardate + '</p><cite>' + roarevent.filename + '&nbsp;&nbsp;<a href="' + roarevent.media + '" pop="true" target="fframe"><i class="fa fa-external-link"></i></a></cite></div><input type="text" ng-model="query" placeholder="Search" class="fa fa-search fa-pull-right" /></div><div getpdftext="' + roarevent.id + '" pdf-data="' + roarevent.ocrlink + '">&nbsp;</div>' +
                '</div>' +
                '</div>';
              var noatemplate = '<div id="docheader" class="container-fluid two-col-left" doc-header roarid="' + roarevent.id + '">' +
                '<div class="row">' +
                '<div class="col-xs-4 col-sm-3 card card-' + roarevent.styleClass + '"><img src="https://placehold.it/250x150/7c994f/fff/&text=' + roarevent.rid + '" class="img img-hover img-responsive img-shadow"/> <p class="card-text"><label ng-repeat="match in matches track by $index | unique" class="fa fa-tag">{{match}}</label></p></div>' +
                //  '<div class="col-xs-4"><img src="https://placehold.it/250x150/7c994f/fff/&text='+roarevent.rid+'" class="img img-hover img-responsive img-shadow"/></div>' +
                '<div class="col-xs-8"><div class="bs-callout bs-callout-NOA bs-callout-reverse"><h4>' + roarevent.title + '</h4><p>Dated ' + roardate + '</p><cite>' + roarevent.filename + '&nbsp;&nbsp;<a href="' + roarevent.media + '" pop="true" target="fframe"><i class="fa fa-external-link"></i></a></cite></div><input type="text" ng-model="query" placeholder="Search" class="fa fa-search fa-pull-right" /></div><div getpdftext="' + roarevent.id + '" pdf-data="' + roarevent.ocrlink + '">&nbsp;</div>' +
                '</div>' +
                '</div>';
              var petitiontemplate = '<div id="docheader" class="container-fluid two-col-right" doc-header roarid="' + roarevent.id + '">' +
                '<div class="row">' +
                '<div class="col-xs-8 col-sm-9"><div class="bs-callout bs-callout-Petition"><h4>' + roarevent.title + '</h4><p>Dated ' + roardate + '</p><cite>' + roarevent.filename + '&nbsp;&nbsp;<a href="' + roarevent.media + '" pop="true" target="fframe"><i class="fa fa-external-link"></i></a></cite></div><input type="text" ng-model="query" placeholder="Search" class="fa fa-search fa-pull-left" /></div><div getpdftext="' + roarevent.id + '" pdf-data="' + roarevent.ocrlink + '">&nbsp;</div>' +
                '<div class="col-xs-4 col-sm-3 card card-' + roarevent.styleClass + '"><img src="https://placehold.it/250x150/b48200/fff/&text=' + roarevent.rid + '" class="img img-hover img-responsive img-shadow"/> <p class="card-text"><label ng-repeat="match in matches track by $index | unique" class="fa fa-tag">{{match}}</label></p></div>' +
                '</div>' +
                '</div>';
              var interviewtemplate = '<div id="docheader" class="container-fluid two-col-right" doc-header roarid="' + roarevent.id + '">' +
                '<div class="row">' +
                '<div class="col-xs-8"><div class="bs-callout bs-callout-Interview"><h4>' + roarevent.title + '</h4><p>Dated ' + roardate + '</p><cite>' + roarevent.filename + '&nbsp;&nbsp;<a href="' + roarevent.media + '" pop="true" target="fframe"><i class="fa fa-external-link"></i></a></cite></div><input type="text" ng-model="query" placeholder="Search" class="fa fa-search fa-pull-left" /></div><div getpdftext="' + roarevent.id + '" pdf-data="' + roarevent.ocrlink + '">&nbsp;</div>' +
                '<div class="col-xs-4 col-sm-3 card card-' + roarevent.styleClass + '"><img src="https://placehold.it/250x150/&text=' + roarevent.rid + '" class="img img-hover img-responsive img-shadow"/> <p class="card-text"><label ng-repeat="match in matches track by $index | unique" class="fa fa-tag">{{match}}</label></p></div>' +
                //  '<div class="col-xs-4"<img src="https://placehold.it/250x150/&text='+roarevent.rid+'" class="img img-responsive img-hover img-shadow"/></div>' +
                '</div>' +
                '</div>';


              angular.forEach(APPDOCCODES, function (code, key) {
                if (doccode === code) {
                  roarevent.styleClass = 'Applicant';
                  roarevent.content = wraphead + apptemplate + wraptail;
                  //+ appfunction(roarevent, phd.imagefile, main, phd);
                  roarevent.data = wraphead + apptemplate + wraptail;
                  //+ appfunction(roarevent, phd.imagefile, main, phd);
                  phd.content += apptemplate;

                }
              });
              angular.forEach(PTODOCCODES, function (code, key) {
                if (doccode === code) {
                  roarevent.styleClass = 'PTO';
                  roarevent.content = wraphead + apptemplate + wraptail;
                  //+ appfunction(roarevent, phd.imagefile, main, phd);
                  roarevent.data = wraphead + apptemplate + wraptail;
                  //+ appfunction(roarevent, phd.imagefile, main, phd);
                  phd.content += apptemplate;
                }
              });
              angular.forEach(INTVDOCCODES, function (code, key) {
                if (doccode === code) {
                  roarevent.styleClass = 'Interview';
                  roarevent.content = wraphead + apptemplate + wraptail;
                  //+ appfunction(roarevent, phd.imagefile, main, phd);
                  roarevent.data = wraphead + apptemplate + wraptail;
                  //+ appfunction(roarevent, phd.imagefile, main, phd);
                  phd.content += apptemplate;
                }
              });
              angular.forEach(NOADOCCODES, function (code, key) {
                if (doccode === code) {
                  roarevent.styleClass = 'NOA';
                  roarevent.content = wraphead + apptemplate + wraptail;
                  //+ appfunction(roarevent, phd.imagefile, main, phd);
                  roarevent.data = wraphead + apptemplate + wraptail;
                  //+ appfunction(roarevent, phd.imagefile, main, phd);
                  phd.content += apptemplate;
                }
              });
              angular.forEach(PETDOCCODES, function (code, key) {
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
              roarevent.rows = [
                {
                  columns: [{cid:n+9,styleClass:'col-sm-6',widgets:[{ config: { height: "90vh", url: roarevent.media || 'http://www.google.com' }, styleClass: roarevent.styleClass || 'btn-dark', title: 'LexFrame', type: 'iframe', wid: n + 100 }]},
                    { cid: n + 10, styleClass: 'col-sm-6', widgets: [{ config: { id: 'PROMISE', height: '90vh' }, styleClass: roarevent.styleClass || 'btn-dark', title: 'LexPad', type: 'ckwidget', wid: n + 1010 },{ config: { id: 'PROMISE', height: '90vh' }, styleClass: roarevent.styleClass || 'btn-dark', title: 'Metadata', type: 'metadata', wid: n + 101 }, { config: { id: 'PROMISE', height: '90vh' }, styleClass: roarevent.styleClass || 'btn-dark', title: 'Text', type: 'text', wid: n + 105 }] }

                  ]
                }
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
              var refr = Collection(de).$ref();
               main.progresstwo++;
              refr.set(roarevent, function (err) {
                var id = de;

                refr.update({
                  id: id,

                  timestamp: Firebase.ServerValue.TIMESTAMP
                });
                refr.child('rows').child('0').child('columns').child('1').child('widgets').child('0').child('config').child('id').set(id);
                refr.child('rows').child('0').child('columns').child('1').child('widgets').child('1').child('config').child('id').set(id);
                refr.child('rows').child('0').child('columns').child('1').child('widgets').child('2').child('config').child('id').set(id);
                //p.filelist.push(id);
                //phdref.child('roarmap').child('roarlist').push(id);
                //roarmap.roarevents.push(id);
                phd.roarmap.roarlist[id] = id;

                var appref = Collection(roarevent.Application).$ref();
                appref.child('history').child(roarevent.date).child(id).set(id);
                allref.child('roarlist').child(id).set(id);

                var oc = new RegExp(/(^CLM)|(NOA)|(CTNF)|(CTFR)|(REM)|(^\bA\..)|(CTRS)|(CTNS)|(^\bSA\..)/);
                 if(oc.test(roarevent.doccode)!==false){
                    main.pushtoqueue(file);
                 }
                angular.forEach(MERITSDOCS, function (code, key) {
                  if (roarevent.doccode === code) {

                    //p.meritslist.push(id);
                    // dashboardsref.child('roarlist').push(id);

                    meritsref.child('roarlist').child(id).set(id);


                    buffe.push(file);
                    $log.info('merits', id);
                  }
                });

                angular.forEach(ARTDOCS, function (code, key) {
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
          angular.forEach(buffe, function(file, key){
            main.pushtoqueue(file);
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
              rows: [{ styleClass: 'row leather', columns: [{ cid: n + 10, styleClass: 'col-sm-12', widgets: [{ type: 'pagebuilder', title: options.rid + ' - ' + 'USSN ' + phd.application['Application Number'], styleClass: options.styleClass || 'btn-dark', config: { id: 'PROMISE', url: '/llp_core/modules/roarmap/directive/roargrid/roargrid.html' } }] }] }]

            };
            return binder;
          };
          var phdall = { rid: 'PHD1', title: 'ALL', styleClass: 'NOA', icon: 'fa-legal', sortOrder: 1 },
            phdmerits = { rid: 'PHD4', title: 'MERITS', styleClass: 'PTO', icon: 'fa-balance-scale', sortOrder: 4 },
            phdart = { rid: 'PHD2', title: 'ART', styleClass: 'Petition', icon: 'fa-leaf', sortOrder: 2 },
            phdclaims = { rid: 'PHD3', title: 'CLAIMS', styleClass: 'Applicant', icon: 'fa-sitemap', sortOrder: 3 };
          var groupids = [];
          var groups = { all: phdall, merits: phdmerits, art: phdart, claims: phdclaims };
          angular.forEach(groups, function (group, key) {
            var refr = Collection(phd.patent.id + group.title).$ref();
            refr.set(new Binder(group), function (err) {
              var id = phd.patent.id + group.title;
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

        function addpatent(groupids, phd) {
          var date = new Date();
          var d = new Date();
          var n = d.getTime();
          var patent = angular.copy(phd.patent);
          patent.rows = [
            {
              columns: [
                { cid: n + 10, styleClass: 'col-sm-6', widgets: [{ config: { height: "30em", url: patent.media || 'http://www.google.com' }, title: patent.title || 'title', titleTemplateUrl: '{widgetsPath}/testwidget/src/title.html', type: 'iframe', wid: n + 100, styleClass: patent.styleClass || 'btn-dark' }] },
                { cid: n + 1000, styleClass: 'col-sm-6', widgets: [{ config: { id: 'PROMISE' }, title: patent.title || 'title', titleTemplateUrl: '{widgetsPath}/testwidget/src/title.html', type: 'ckwidget', wid: n + 15, styleClass: patent.styleClass || 'btn-dark' }] }
              ]
            }
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

      };
    }
  ]).controller('PageslideCtrl', ['$scope', function ($scope) {

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

  }]).filter('strip', function () {
    return function (input) {
      if (input !== (null || undefined)) {
        var regex = new RegExp(/\D/ig);
        var output = input.replace(regex, '');
        return output;
      }
      else {
        return input;
      }
    };
  }).directive('docheader', ['$window', '$document', '$compile', '$templateCache', 'Collection', function ($window, $document, $compile, $templateCache, Collection) {
    return {
      restrict: 'EA',
      scope: {
        roarevent: '=?'
      },
      transclude: true,
      templateUrl: '{widgetsPath}/getphd/src/phd/docheader.html',
      //controller:'ROARCtrl',
      //controllerAs:'roarevent',
      //bindToController: true,
      link: function ($scope, $element, $attrs, $ctrl) {
        var roarid = $attrs.roarid;
        $scope.roarid = roarid;
        Collection(roarid).$loaded().then(function (roarevent) {
          $scope.roarevent = roarevent;


          var maildate = new Date(roarevent['Mail Room Date']);

          $scope.roardate = maildate.toDateString();
          var background = function (styleClass) {

            var template;
            // var styleClass = roarevent.styleClass;
            switch (styleClass) {
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
                template = '999999';
                break;
              case 'NOA':
                template = '7c994f';
                break;
              case 'primary':
                template = '025aa5';
                break;
              case 'info':
                template = '5bc0de';
                break;
              case 'success':
                template = '449d44';
                break;
              case 'warning':
                template = 'f0ad4e';
                break;
              case 'danger':
                template = 'c9302c';
                break;
              case 'dark':
                template = '000000';
                break;
              case 'fancy':
                template = 'dddddd';
                break;
              case 'royal':
                template = 'aa00ff';
                break;
            }

            return 'https://placehold.it/250x150/' + template + '/fff/&text=' + $scope.roarevent.rid;
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
        config: '='
      },
      controller:'PatentWidgetCtrl',
      link: function ($scope, $element, $attr, $ctrl) {
          // $scope.config = {PNUM: $attr.patent};


      }
    };
  }])
  .directive('patentCitation', ['$http', 'Collection','$patentsearch','$filter', function ($http, Collection, $patentsearch,$filter) {
    return {
      restrict: 'EA',
      templateUrl: '{widgetsPath}/getphd/src/phd/citation.html',
      scope: {
        ref: '='
      },

      link: function ($scope, $element, $attrs, $ctrl) {
        //var p = this;
        // var id = $attrs.patent;
        var ref = $scope.ref.match(/\d+/ig);
         var refa = $scope.ref.replace(/\:/ig,'')
        console.log(ref[0]);
        try {
         $patentsearch(null, {PNUM: ref[0]}).then(function (patent) {
            $scope.poo = ref[0];
            $scope.p = patent;
            var int = parseInt(ref[0]);
            if (int > 2000000000){
              $scope.poodle = $filter('published_application')(int);
            }else{
              $scope.poodle =   $filter('number')(int, 0);
            }
        });
        } catch (ex) {
         $patentsearch(null, {PNUM: refa}).then(function (patent) {
            $scope.p = patent;
          });
          // $http.get('./proxy/lexspace.net/getphd/patents/' + ref).then(function (resp) {
          //   $scope.p = resp.data;
          // });
        }
        finally {
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


}])
.controller('ClaimWidgetController', ['$scope', 'Collection', 'config',
function($scope, Collection, config){
  var cwc = this;

  var config = $scope.$parent.config || $scope.$parent.$parent.config;
  var roarevent = Collection(config.id);
  roarevent.$loaded().then(function(data){
    $scope.roarevent = data;
    $scope.sets = [];
    angular.forEach(data.roarlist, function(id, key){
      Collection(id).$loaded().then(function(claimpaper){
        $scope.sets.push(claimpaper.claims);
      });
    });
    // cwc.claimset = data.claims;
  });
  //roarevent.$bindTo($scope, 'roarevent');
  $scope.onSubmit = function(){
    //something
  };
  $scope.setwatcher = function(inputvalue, index){
      var innumber = parseInt(inputvalue.slice(0,inputvalue.indexOf('\.')));
      if(index + 1 === innumber){
        cwc.claimsets[index].$valid = true;
      }
      else{
        cwc.claimsets[index].$error();
      }
  };
  $scope.sortSet = function(node){
    var claimset = node.claims;
    var newarray = [];
    angular.forEach(claimset, function(claim, key){
       var num = parseInt(claim.match(/\d+(?=\.)/)[0]);
        newarray[num - 1] = claim;
    });
    node.claims = newarray;
  };
  $scope.statustest = function (input) {
        var status = new RegExp(/\((\w+(\s\w+)*)\)/);
            if (status.test(input) !== false) {
                var match = input.match(status);
                return match[1];
            } else {
                return null;
            }
        };
$scope.num = function(input) {
          if(angular.isString(input)){
            var p = input.slice(0, input.indexOf('.'));

                return p || input;
          }else{
            return '-';
          }

            };

          $scope.prent =  function(input) {
                if(angular.isString(input)){
                  var dependencytest = new RegExp(/\sof\sc[li]aim\s\d+,?\s/ig);
                var idref = input.match(dependencytest);
                var id;
                if (idref !== null) {
                    var id = idref[0].replace(/\D/ig, '');
                }

                return id;
                }else{
                  return -1;
                }
            };
          $scope.addClaim = function(index, node){
              var newtext = '' + (parseInt(index) + 1) + '. The claim of claim ' + index + ', wherein the text is self-referential.';
              node.claims.unshift(newtext);
              $scope.sortSet(node);
          };
          $scope.checkValid = function(index, node){
              return alertify.error('invalid!');
          };
}]);


/**
 * we copied most of the 'element' scenario dsl so we can keep the old actions
 * and also add the 'enter' and modified 'html' actions.
 * @see https://github.com/angular/angular.js/blob/master/src/ngScenario/dsl.js
 * @see http://stackoverflow.com/questions/12575199/how-to-test-a-contenteditable-field-based-on-a-td-using-angularjs-e2e-testing
 *
 * Usage:
 *    element(selector, label).count() get the number of elements that match selector
 *    element(selector, label).click() clicks an element
 *    element(selector, label).mouseover() mouseover an element
 *    element(selector, label).mousedown() mousedown an element
 *    element(selector, label).mouseup() mouseup an element
 *    element(selector, label).query(fn) executes fn(selectedElements, done)
 *    element(selector, label).{method}() gets the value (as defined by jQuery, ex. val)
 *    element(selector, label).{method}(value) sets the value (as defined by jQuery, ex. val)
 *    element(selector, label).{method}(key) gets the value (as defined by jQuery, ex. attr)
 *    element(selector, label).{method}(key, value) sets the value (as defined by jQuery, ex. attr)
 *    element(selector, label).enter(value) sets the text if the element is contenteditable
 */
/*angular.scenario.dsl('element', function() {
  var KEY_VALUE_METHODS = ['attr', 'css', 'prop'];
  var VALUE_METHODS = [
    'val', 'text', 'html', 'height', 'innerHeight', 'outerHeight', 'width',
    'innerWidth', 'outerWidth', 'position', 'scrollLeft', 'scrollTop', 'offset'
  ];
  var chain = {};

  chain.count = function() {
    return this.addFutureAction("element '" + this.label + "' count", function($window, $document, done) {
      try {
        done(null, $document.elements().length);
      } catch (e) {
        done(null, 0);
      }
    });
  };

  chain.click = function() {
    return this.addFutureAction("element '" + this.label + "' click", function($window, $document, done) {
      var elements = $document.elements();
      var href = elements.attr('href');
      var eventProcessDefault = elements.trigger('click')[0];

      if (href && elements[0].nodeName.toUpperCase() === 'A' && eventProcessDefault) {
        this.application.navigateTo(href, function() {
          done();
        }, done);
      } else {
        done();
      }
    });
  };

  chain.dblclick = function() {
    return this.addFutureAction("element '" + this.label + "' dblclick", function($window, $document, done) {
      var elements = $document.elements();
      var href = elements.attr('href');
      var eventProcessDefault = elements.trigger('dblclick')[0];

      if (href && elements[0].nodeName.toUpperCase() === 'A' && eventProcessDefault) {
        this.application.navigateTo(href, function() {
          done();
        }, done);
      } else {
        done();
      }
    });
  };

  chain.mouseover = function() {
    return this.addFutureAction("element '" + this.label + "' mouseover", function($window, $document, done) {
      var elements = $document.elements();
      elements.trigger('mouseover');
      done();
    });
  };

  chain.mousedown = function() {
      return this.addFutureAction("element '" + this.label + "' mousedown", function($window, $document, done) {
        var elements = $document.elements();
        elements.trigger('mousedown');
        done();
      });
    };

  chain.mouseup = function() {
      return this.addFutureAction("element '" + this.label + "' mouseup", function($window, $document, done) {
        var elements = $document.elements();
        elements.trigger('mouseup');
        done();
      });
    };

  chain.query = function(fn) {
    return this.addFutureAction('element ' + this.label + ' custom query', function($window, $document, done) {
      fn.call(this, $document.elements(), done);
    });
  };

  angular.forEach(KEY_VALUE_METHODS, function(methodName) {
    chain[methodName] = function(name, value) {
      var args = arguments,
          futureName = (args.length == 1)
              ? "element '" + this.label + "' get " + methodName + " '" + name + "'"
              : "element '" + this.label + "' set " + methodName + " '" + name + "' to " + "'" + value + "'";

      return this.addFutureAction(futureName, function($window, $document, done) {
        var element = $document.elements();
        done(null, element[methodName].apply(element, args));
      });
    };
  });

  angular.forEach(VALUE_METHODS, function(methodName) {
    chain[methodName] = function(value) {
      var args = arguments,
          futureName = (args.length == 0)
              ? "element '" + this.label + "' " + methodName
              : futureName = "element '" + this.label + "' set " + methodName + " to '" + value + "'";

      return this.addFutureAction(futureName, function($window, $document, done) {
        var element = $document.elements();
        done(null, element[methodName].apply(element, args));
      });
    };
  });

  // =============== These are the methods ================ \\
  chain.enter = function(value) {
    return this.addFutureAction("element '" + this.label + "' enter '" + value + "'", function($window, $document, done) {
      var element = $document.elements()
      if (element.is('[contenteditable=""]')
          || (element.attr('contenteditable')
              && element.attr('contenteditable').match(/true/i))) {
        element.text(value)
        element.trigger('input')
      }
      done()
    })
  }

  chain.html = function(value) {
    var args = arguments,
        futureName = (args.length == 0)
          ? "element '" + this.label + "' html"
          : futureName = "element '" + this.label + "' set html to '" + value + "'";
    return this.addFutureAction(futureName, function($window, $document, done) {
      var element = $document.elements();
      element.html.apply(element, args)
      if (args.length > 0
          && (element.is('[contenteditable=""]')
              || (element.attr('contenteditable')
                  && element.attr('contenteditable').match(/true/i)))) {
        element.trigger('input')
      }
      done(null, element.html.apply(element, args));
    });
  };

  return function(selector, label) {
    this.dsl.using(selector, label);
    return chain;
  };
});
*/

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
               //     });
               // };
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


               //  }

               //    );

/*
.factory('$txt2html', [function() {
        return function(text, enterMode) {
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
                    var openTag = '<' + paragraphTag + '>',
                        endTag = '</' + paragraphTag + '>';
                    html = openTag + html.replace(duoLF, function() {
                        return endTag + openTag;
                    }) + endTag;
                }
            }

            // One <br> per line-break.
            html = html.replace(/\n/g, '<br>');

            // Compensate padding <br> at the end of block, avoid loosing them during insertion.
            if (!isEnterBrMode) {
                html = html.replace(new RegExp('<br>(?=</' + paragraphTag + '>)'), function(match) {
                    return CKEDITOR.tools.repeat(match, 2);
                });
            }

            // Preserve spaces at the ends, so they won't be lost after insertion (merged with adjacent ones).
            html = html.replace(/^ | $/g, '&nbsp;');

            // Finally, preserve whitespaces that are to be lost.
            html = html.replace(/(>|\s) /g, function(match, before) {
                return before + '&nbsp;';
            }).replace(/ (?=<)/g, '&nbsp;');

            return html;

        };
    }])
    .controller('PDFFilesController', ['$scope', 'extract', '$document', '$window', '$http', 'localStorageService', function($scope, extract, $document, $window, $http, localStorageService) {

        var pdff = this;
        pdff.name = 'PDFFilesController';

    }]).controller("AnnotationController", ['$scope', '$timeout', 'Profile', function($scope, $timeout, Profile) {
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
        $scope.templates = profile.annotationtemplates || [{
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
        }];
        var a = window.getSelection();
        if (a !== null && (a.extentOffset - a.anchorOffset > 0)) {
            var text = a.anchorNode.data.slice(a.anchorOffset, a.extentOffset);
            $scope.data.selection = text;
        }
        $scope.selection = window.getSelection();

        $scope.useTemplate = function(template) {
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

        $scope.useColor = function(color) {
            if (color.value !== null) {
                $scope.$annotation.type = color.value;
            }
        };

        $scope.isActiveColor = function(color) {
            return color && color.value === $scope.$annotation.type;
        };

        $scope.close = function() {
            return $scope.$close();
        };

        $scope.reject = function() {
            return $scope.$reject();
        };
    }])/*.filter('bytes', function() {
        return function(bytes) {
            var bytes = parseInt(bytes);
            if (bytes >= 1000000000) { bytes = (bytes / 1000000000).toFixed(2) + ' GB'; } 
            else if (bytes >= 1000000) { bytes = (bytes / 1000000).toFixed(2) + ' MB'; } 
            else if (bytes >= 1000) { bytes = (bytes / 1000).toFixed(2) + ' KB'; } 
            else if (bytes > 1) { bytes = bytes + ' bytes'; } 
            else if (bytes == 1) { bytes = bytes + ' byte'; } 
            else { bytes = '0 byte'; }
            return bytes;
        }
    });
*/
'use strict'

angular.module('llp.parsetsv', [])
  .factory('parseTSV', [function () {
    return function (file, options, verbose) {
      var _file = file
      var options = options

      var json = Papa.parse(_file, options)

      return verbose ? json : json.data
    }
  }])

angular.module('llp.parsetsv').directive('thumbnail', [function () {
  return {
    restrict: 'E',
    scope: {document: '@'},
    template: '<img class="img img-thumbnail img-shadow img-hover"/>',
    link: function ($scope, $element, $attr, $ctrl) {
      PDFJS.workerSrc = '/llp_core/bower_components/pdfjs-dist/build/pdf.worker.js';
      var pdf_file = $scope.document
      PDFJS.getDocument('/thumbs' + pdf_file).then(function (pdf) {
        pdf.getPage(1).then(function (page) {
          var viewport = page.getViewport(0.5)
          // PDF.js returns a promise when it gets a particular page from the pdf object
          // A canvas element is used to render the page and convert into an image thumbnail
          // if single canvas is used, the content gets overridden when PDF.js promises resolve for subsequent files
          // so a dedicated canvas element is created for rendering a thumbnail for each pdf
          // the canvas element is discarded once the thumbnail is created.
          var canvas = document.createElement('canvas')
          var ctx = canvas.getContext('2d')
          canvas.height = viewport.height
          canvas.width = viewport.width

          var renderContext = {
            canvasContext: ctx,
            viewport: viewport
          }

          page.render(renderContext).then(function () {

            // set to draw behind current content
            ctx.globalCompositeOperation = 'destination-over'
            // set background color
            ctx.fillStyle = '#fff'
            // draw on entire canvas
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            // create an img from the canvas which contains the page contents
            var img_src = canvas.toDataURL()
            var $img = $element
              .attr('src', img_src)

            var file_details = {
              'name': pdf_file,
              'pages': pdf.pdfInfo.numPages
            }

            var $thumb = $('<div>')
              .attr('class', 'thumb')
              .attr('data-pdf-details', JSON.stringify(file_details))
              .append(
                $('<span>')
                  .attr('class', 'close')
                  .html('&times;')
                  .click(function () {
                    var details = $(this).parent().data('pdf-details')
                    alert('Remove ' + details.name + ' !? ')
                  })
            )
              .append($('<div>').attr('class', 'info').text(pdf_file))
              .append($img)
              .click(function () {
                CURRENT_FILE = $(this).data('pdf-details')
                $info_name.text(CURRENT_FILE.name)
                $info_pages.text(CURRENT_FILE.pages)
                $('.thumb').removeClass('current')
                $(this).addClass('current')
              })

            $thumb.appendTo($element).click()
            // we have created a thumbnail and rendered the img from the canvas
            // discard the temporary canvas created for rendering this thumbnail
            canvas.remove()
            // $(canvas).remove()

          })
        }) // end of getPage

      }) // end of getDocument

    }
  }
}])


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

app.factory("fileReader", ["$q", "$log", function($q, $log) {

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

app.factory("extractpdf", ["$q", function($q) {
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
}]);


  angular.module("llp.extract",[]).factory("extract", ["$q", function($q) {
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
angular.module("llp.extract").directive("dropFiles", [function () {
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
              //$scope.$parent.main.handleFiles(files.files[0]);
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