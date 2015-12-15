(function(window, undefined) {'use strict';


angular.module('adf.widget.getphd', ['adf.provider', 'llp.extract',
        'fa.droppable', 'llp.parsetsv', 'roar', 'textSizeSlider', 'llp.pdf', 'LocalStorageModule', 'llp.extractpdf', 'firebase', 'ui.router', 'commonServices', 'xeditable', 'ui.utils', 'ui.tree', 'ngAnimate', 'ngAnnotateText', 'ngDialog', 'ngSanitize', 'pdf', 'phd', 'toastr', 'mentio', 'lionlawlabs', 'ui', 'diff', 'door3.css', 'checklist-model', 'authentication', 'angular-md5', 'angular.filter', 'admin', 'roarmap','ngFileUpload'
    ]).config(["dashboardProvider", "localStorageServiceProvider", function(dashboardProvider, localStorageServiceProvider) {

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
                        function(config, $firebaseArray, $rootScope, FIREBASE_URL) {
                            if (config.id) {
                                return config;
                            } else {
                                var a = $firebaseArray(new Firebase(FIREBASE_URL + 'content/'));
                                var b = {};
                                a.$add({
                                    'name': 'curation'
                                }).then(function(ref) {
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

    }])
    .constant('FIREBASE_URL', 'https://lexlab.firebaseio.com/')
    .controller('MainCtrl', ['Collection', 'extract', 'fileReader', '$http', 'parseTSV', '$roarmap', '$q', '$scope', 'config', 'PHD', 'localStorageService', 'extractpdf', 'pdfToPlainText', '$log',
        function(Collection, extract, fileReader, $http, parseTSV, $roarmap, $q, $scope, config, PHD, localStorageService, extractpdf, pdfToPlainText, $log) {
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

           

            $scope.configured = function() {
                return $scope.config.appnum !== '';
            };

            $scope.notConfigured = function() {
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

            main.parse = function(files) {

                var deffered = $q.defer();
                angular.forEach(files, function(file, key) {
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

            main.getfilehistory = function(appnum) {
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

                $http(request).then(function(resp) {
                    main.file = resp.data;
                    console.log(resp.data);
                    extract(resp.data, appnum)
                        .then(function(files) {
                            console.log(files);
                            main.file = files;
                            main.parse(files).then(function() {
                                main.spinner = false;
                            });
                        }, function(reason) {
                            main.error = reason.message;
                        });
                });
            };

            main.remotezip = function(appnum) {
                $http.get('http://storage.googleapis.com/uspto-pair/applications/' + appnum + '.zip', function(err, data) {
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

            main.handleFiles = function(file) {
                main.error = null;
                main.success = null;

                extractpdf(file.files[0])
                    .then(function(files) {
                            $log.info('Files extracted', files);
                            $scope.phd.file = files.tsvfiles;

                            main.parse(files.tsvfiles)

                            .then(function(parsedfiles) {
                                $log.info('TSV Parsed', parsedfiles);
                                $roarmap(parsedfiles, $scope.phd)

                                .then(function(roarmap) {
                                    $scope.phd.roarmap = roarmap;

                                    localStorageService.set(config.appnum, $scope.phd);
                                    // try {
                                    //     //main.pdFF(files.pdffiles);
                                    // } catch (ex) {
                                    //     $log.error('pdf extraction failed', ex);
                                    // } finally {
                                    //     $log.info('Complete!');
                                    // }




                                }, function(reason) {

                                    main.error = reason.message;

                                });

                            }, function(reason) {

                                main.error = reason.messsage;

                            });


                        },
                        function(reason) {

                            main.error = reason.message;

                        });

            };

            //console.log(fileReader);

            main.getFile = function() {
                main.progress = 0;
                fileReader.readAsDataUrl(main.file, main)
                    .then(function(result) {
                        main.handleFiles(result);
                        main.imageSrc = result;
                    });
            };

            $scope.$on("fileProgress", function(e, progress) {
                main.progress = progress.loaded / progress.total;
            });
            main.pdFF = function(filesobj) {
                var deferred = $q.defer();
                angular.forEach(filesobj, function(file, key) {
                    if (file && (file.name.indexOf('.pdf') > -1)) {

                        pdfToPlainText(file).then(function(pdf) {
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
    ]).directive("ffFileSelect", [function() {

        return {
            restrict: 'A',
            controller: 'MainCtrl',
            controllerAs: 'main',
            bindToController: true,
            scope: false,
            link: function($scope, el, attr, ctrl) {
                var main = ctrl;
                el.on("change", function(e) {

                    main.file = (e.srcElement || e.target).files[0];
                    main.getFile();
                });

            }

        };
    }]);

angular.module("adf.widget.getphd").run(["$templateCache", function($templateCache) {$templateCache.put("{widgetsPath}/getphd/src/edit.html","<form role=form><div class=form-group><label for=sample>Application #</label> <input type=text class=form-control id=sample ng-model=config.appnum placeholder=\"Enter Application #\"></div></form>");
$templateCache.put("{widgetsPath}/getphd/src/titleTemplate.html","<div class=panel-heading><button class=\"fa fa-close fa-2x btn-danger button-outline pull-right floatingclosebutton round\" onclick=$(this).parent().parent().remove();></button><h4 class=bs-callout style=color:white;>{{config.title || $parent.config.title}} <span class=pull-right><a title=notes ng-click=\"console.log(\'note\')\"><i class=\"fa fa-pencil\" style=color:white;></i></a> <a title=mail ng-click=$publish(this)><i class=\"fa fa-send\" style=color:white;></i></a> <a title=comment ng-click=\"console.log(\'note\')\"><i class=\"fa fa-comments-o\" style=color:white;></i></a> <a title=\"reload widget content\" ng-click=reload()><i class=\"fa fa-refresh\" style=color:white;></i></a> <a title=\"change widget location\" class=adf-move><i class=\"glyphicon glyphicon-move\" style=color:white;></i></a> <a title=\"collapse widget\" ng-show=\"options.collapsible && !widgetState.isCollapsed\" ng-click=\"widgetState.isCollapsed = !widgetState.isCollapsed\"><i class=\"glyphicon glyphicon-minus\" style=color:white;></i></a> <a title=\"expand widget\" ng-show=\"options.collapsible && widgetState.isCollapsed\" ng-click=\"widgetState.isCollapsed = !widgetState.isCollapsed\"><i class=\"glyphicon glyphicon-plus\" style=color:white;></i></a> <a title=\"edit widget configuration\" ng-click=edit()><i class=\"glyphicon glyphicon-cog\" style=color:white;></i></a> <a title=\"fullscreen widget\" ng-click=openFullScreen() ng-show=\"options.maximizable || true\"><i class=\"glyphicon glyphicon-fullscreen\" style=color:white;></i></a> <a title=\"remove widget\" ng-click=remove() ng-if=editMode><i class=\"glyphicon glyphicon-remove\" style=color:white;></i></a></span></h4></div>");
$templateCache.put("{widgetsPath}/getphd/src/view.html","<div class=\"card card-primary card-block btn-glass drop-target\" drop-files=handleFiles(files) style=\"border: 2px dashed blue;margin: 5px;\"><button class=\"row btn btn-glass btn-primary img img-rounded\" ng-hide=phd.file style=position:relative;display:flex;display:-webkit-flex;align-items:center;align-content:center;justify-content:space-around;flex-direction:row; ng-click=main.remotezip(config.appnum)><i class=\"fa fa-download fa-3x\">{{config.appnum}}</i> <img src=https://lexlab.firebaseapp.com/img/GoldLogoLong.svg class=\"pop img img-rounded pull-right\" ng-if=!config.appnum></button><div class=row ng-hide=phd.file><div class=\"alert alert-danger\" role=alert ng-if=main.error><strong>Uh oh!</strong> {{main.error}}</div><pre class=\"alert alert-info\" role=alert ng-if=main.info style=\"color:white !important;\">{{main.info}}</pre></div></div><div class=card style=\"text-align: left;color: #444;\" ng-if=phd.file><tabset><tab class=ngDialogTab><tab-heading>{{phd.application[0][1]}}</tab-heading><tabset><tab ng-repeat=\"file in phd.file\" heading=\"{{file.label | uppercase}}\"><pre class=\"card card-block card-fancy\" ng-bind=file.file></pre></tab></tabset></tab><tab class=\"ngDialogTab primary\" ng-if=phd.application><tab-heading style=color:white>APPLICATION</tab-heading><hr><table class=\"card card-default card-block table table-striped table-hover table-condensed table-responsive\"><tbody><tr ng-repeat=\"line in phd.application\"><td ng-repeat=\"value in line\">{{value}}</td></tr></tbody></table></tab><tab class=\"ngDialogTab info\" ng-if=phd.attorney><tab-heading>ATTORNEY</tab-heading><table class=\"card card-default card-block table table-striped table-hover table-condensed table-responsive\"><tbody><tr ng-repeat=\"line in phd.attorney\"><td ng-repeat=\"value in line\">{{value}}</td></tr></tbody></table></tab><tab class=\"ngDialogTab success\" ng-if=phd.continuity><tab-heading style=color:white;>CONTINUITY</tab-heading><table class=\"card card-default card-block table table-striped table-condensed table-hover table-responsive\"><thead><tr><th ng-repeat=\"field in phd.continuity.meta.fields\">{{field}}</th></tr></thead><tbody><tr ng-repeat=\"line in phd.continuity.data\"><td ng-repeat=\"value in line\">{{value}}</td></tr></tbody></table></tab><tab class=\"ngDialogTab warning\" ng-if=phd.foreign><tab-heading style=color:white>FOREIGN PRIORITY</tab-heading><table class=\"card card-default card-block table table-striped table-condensed table-hover table-responsive\"><thead><tr><th>Country</th><th>Priority</th><th>Priority Date</th></tr></thead><tbody><tr ng-repeat=\"p in phd.foreign\"><td ng-bind=\"p[\'Country\']\"></td><td ng-bind=\"p[\'Priority\']\"></td><td ng-bind=\"p[\'Priority Date\'] | date\"></td></tr></tbody></table></tab><tab class=\"ngDialogTab danger\" ng-if=phd.transaction><tab-heading style=color:white;>TRANSACTION</tab-heading><table class=\"card card-default card-block table table-striped table-hover table-condensed table-responsive\"><thead><tr><th>Date</th><th>Transaction Description</th></tr></thead><tbody><tr ng-repeat=\"trans in phd.transaction\"><td>{{trans[\'Date\']}}</td><td>{{trans[\'Transaction Description\']}}</td></tr></tbody></table></tab><tab class=ngDialogTab ng-if=phd.imagefile><tab-heading>IMAGE FILE WRAPPER</tab-heading><input type=text ng-model=main.query placeholder=search... class=pull-right><table class=\"card card-default card-block table table-hover table-condensed table-responsive\"><thead><tr><th ng-click=\"reverse = !reverse\" class=fa ng-class=\"{\'fa-chevron-up\': reverse,\'fa-chevron-down\': !reverse}\">#</th><th>Mail Room Date</th><th>Document Code</th><th>Document Description</th><th>Document Category</th><th>Page Count</th><th>Filename</th></tr></thead><tbody><tr ng-repeat=\"roarevent in phd.imagefile |filter: main.query\" class=\"card card-{{roarevent.styleClass}}\"><th><a ng-click=\"pdfToPlainText(roarevent[\'Filename\'])\" getpdftext><i class=\"fa fa-link\">{{$index}}</i></a></th><td ng-bind=\"roarevent[\'Mail Room Date\']\"></td><td ng-bind=\"roarevent[\'Document Code\']\"></td><td ng-bind=\"roarevent[\'Document Description\']\"></td><td ng-bind=\"roarevent[\'Document Category\']\"></td><td ng-bind=\"roarevent[\'Page Count\']\"></td><td ng-bind=\"roarevent[\'Filename\']\"></td></tr></tbody></table></tab><tab class=\"ngDialogTab {{collection.styleClass}}\" ng-repeat=\"collection in phd.roarmap.collections\" collection={{collection}}><tab-heading style=color:white;>{{collection.rid}}</tab-heading><div style=\"width: 100%;\" class=reventlist><roar-event ng-repeat=\"event in collection.roarlist\" id={{event}} style=width:19.5%;></roar-event></div></tab><tab class=ngDialogTab><tab-heading>ROAR <label class=\"label label-info label-pill\">{{phd.imagefile.length}}</label></tab-heading><div style=\"width: 100%;min-height: 500px;\" class=reventlist><roar-event roarevent=roarevent class=info editable=true dir-paginate=\"roarevent in phd.roarmap.roarevents | filter: roarId | filter: query |filter: issueId | orderBy: [(sortorder || \'date\'),\'sortIndex\',\'rid\',\'name\'] : dctn | itemsPerPage: 20\" pagination-id=roarmappagination ng-animate-ref=\"{{ roarevent.$id }}\" id={{roarevent}}></roar-event></div></tab><tab class=ngDialogTab ng-if=phd.pdffiles><tab-heading>PDFs <label class=\"label label-pill label-info\">{{phd.pdffiles.length}}</label></tab-heading><tabset><tab ng-repeat=\"pdf in phd.pdffiles\"><tab-heading>{{pdf.name}}</tab-heading><section class=card id=pdf ng-controller=PDFfilecontroller></section></tab></tabset></tab></tabset></div>");}]);
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
            link: function(scope, element, attr) {
                scope.textSize = scope.value;
                scope.$watch('textSize', function(size) {
                    $document[0].style.fontSize = size + scope.unit;
                    $('html').style('font-size', size+scope.unit);
                });
            }
        }
    }]);

 angular.module('roar', [])

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
         }
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
                     artlist: new Array(),
                     ownlist: new Array()
                 };


                 function hello() {
                     var check = checkforexistingphd();
                     if (check === true) {
                         getroar();
                     } else {
                         buildroar();
                     }



                     return deferred.resolve(roarmap);
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


                         var date = new Date();
                         var roarevent = angular.copy(file);

                         var filename = file.Filename || '00000000-0000-00-00000-NPL.pdf';
                         var appnumsubstring = filename.slice(0, filename.indexOf("-"));
                         var appdatesubstring = filename.slice((filename.indexOf("-") + 1), (filename.indexOf("-") + 11));
                         var doccode = filename.slice((filename.lastIndexOf("-") + 1), (filename.indexOf(".pdf")));
                         roarevent.content_type = 'document';
                         //roarevent.media = file.url.replace('/view?usp=drive_web', '/preview');
                         // roarevent.iconUrl = file.iconUrl;
                         //roarevent.uuid = file.id;

                         //roarevent.mimeType = file.mimeType;
                         //roarevent.description = file.DocumentDescription;
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
                             angular.forEach(OWNERSHIPDOCS, function(code, key) {
                                 if (roarevent.doccode === code) {
                                     p.ownlist.push(id);
                                     $log.info('merits', id);
                                 }
                             });
                             angular.forEach(ARTDOCS, function(code, key) {
                                 if (roarevent.doccode === code) {
                                     p.artlist.push(id);
                                     $log.info('merits', id);
                                 }
                             });
                             alertify.log("added record with id " + id);
                         });



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
                     var newown = {
                         name: 'USSN ' + phd.application[0][1],
                         title: 'USSN ' + phd.application[0][1],
                         rid: 'PHD4 - OWNERSHIP',
                         collectiontype: 'source',
                         box: 'PhD for USSN ' + phd.application[0][1],
                         styleClass: 'primary',
                         app: phd.application[0][1],
                         content_type: 'collection',
                         roarlist: p.ownlist

                     };


                     var cray = [newcollection, newmerits, newart, newown];






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

                                 if (angular.isUndefined(matter.collectionlist)) {
                                     matter.collectionlist = new Array();

                                     matter.collectionlist.push(cId);
                                     matter.$save();
                                 } else {
                                     matter.collectionlist.push(cId);
                                     matter.$save();
                                 }

                                 // var owns = angular.copy(Collection(cId));
                                 roarmap.collections.push(cId);
                                 // return roarmap;

                             });


                     });



                 };




             };
         }
     ]);

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
    .factory('parseTSV', [function() {
        return function(file, options, verbose) {
            var _file = file;
            var options = options;

            var json = Papa.parse(_file, options);


            return verbose ? json : json.data;
        };
    }])

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
                debugger;
                var files = e.originalEvent.dataTransfer.files;
                debugger;
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

    .controller("DropFilesController", ['$controller', 'extract', '$scope',  '$timeout', '$rootScope',
        function ($controller, extract, $scope, $timeout, $rootScope) {
            var drop = this;
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