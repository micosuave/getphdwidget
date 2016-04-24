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
                           roarevent.media = roarevent.selflink;
                          //  roarevent.media = '/files/viewer/web/viewer.html?file=%2Ffiles/public/uspto/' + appnumsubstring + '/' + appnumsubstring + '-image_file_wrapper/' + filename;
                         } else {
                            roarevent.ocrlink = 'https://lexlab.io/files/public/uspto/' + appnumsubstring + '/' + appnumsubstring + '-image_file_wrapper/' + filename.replace('.pdf','_ocr.pdf');

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
                    var apptemplate =  '<div id="docheader" class="container-fluid two-col-right">' +
            '<div class="row">' +
            '<div class="col-xs-8"><div class="bs-callout bs-callout-Applicant"><h4>'+ roarevent.title+'</h4><p>Filed '+roardate+'</p><cite>'+roarevent.filename+'&nbsp;&nbsp;<a href="'+roarevent.media+'" pop="true" target="fframe"><i class="fa fa-external-link"></i></a></cite></div><input type="text" ng-model="query" placeholder="Search" class="fa fa-search fa-pull-left" /></div>' +
            '<div class="col-xs-4"><img src="https://placehold.it/250x150/4682b4/fff/&text='+roarevent.rid+'" class="img img-hover img-responsive img-shadow"/></div>' +
            '</div>' +
            '</div><div getpdftext="'+roarevent.id+'" pdf-data="'+roarevent.ocrlink+'">&nbsp;</div>';
                     var ptotemplate = '<div id="docheader" class="container-fluid two-col-left">' +
            '<div class="row">' +
            '<div class="col-xs-4"><img src="https://placehold.it/250x150/640002/fff/&text='+roarevent.rid+'" class="img img-hover img-responsive img-shadow"/></div>' +
            '<div class="col-xs-8"><div class="bs-callout bs-callout-PTO bs-callout-reverse"><h4>'+ roarevent.title + '</h4><p>Filed '+roardate+'</p><cite>'+roarevent.filename+'&nbsp;&nbsp;<a href="'+roarevent.media+'" pop="true" target="fframe"><i class="fa fa-external-link"></i></a></cite></div><input type="text" ng-model="query" placeholder="Search" class="fa fa-search fa-pull-right" /></div>' +
            '</div>' +
            '</div><div getpdftext="'+roarevent.id+'" pdf-data="'+roarevent.ocrlink+'">&nbsp;</div>';
                    var noatemplate = '<div id="docheader" class="container-fluid two-col-left">' +
            '<div class="row">' +
            '<div class="col-xs-4"><img src="https://placehold.it/250x150/7c994f/fff/&text='+roarevent.rid+'" class="img img-hover img-responsive img-shadow"/></div>' +
            '<div class="col-xs-8"><div class="bs-callout bs-callout-NOA bs-callout-reverse"><h4>' + roarevent.title + '</h4><p>Filed '+roardate+'</p><cite>'+roarevent.filename+'&nbsp;&nbsp;<a href="'+roarevent.media+'" pop="true" target="fframe"><i class="fa fa-external-link"></i></a></cite></div><input type="text" ng-model="query" placeholder="Search" class="fa fa-search fa-pull-right" /></div>' +
            '</div>' +
            '</div><div getpdftext="'+roarevent.id+'" pdf-data="'+roarevent.ocrlink+'">&nbsp;</div>';
                    var petitiontemplate = '<div id="docheader" class="container-fluid two-col-right">' +
            '<div class="row">' +
            '<div class="col-xs-8"><div class="bs-callout bs-callout-Petition"><h4>'+ roarevent.title + '</h4><p>Filed '+roardate+'</p><cite>'+roarevent.filename+'&nbsp;&nbsp;<a href="'+roarevent.media+'" pop="true" target="fframe"><i class="fa fa-external-link"></i></a></cite></div><input type="text" ng-model="query" placeholder="Search" class="fa fa-search fa-pull-left" /></div>' +
            '<div class="col-xs-4"><img src="https://placehold.it/250x150/b48200/fff/&text='+roarevent.rid+'" class="img img-hover img-responsive img-shadow"/></div>' +
            '</div>' +
            '</div><div getpdftext="'+roarevent.id+'" pdf-data="'+roarevent.ocrlink+'">&nbsp;</div>';
             var interviewtemplate = '<div id="docheader" class="container-fluid two-col-right">' +
            '<div class="row">' +
            '<div class="col-xs-8"><div class="bs-callout bs-callout-Interview"><h4>'+ roarevent.title + '</h4><p>Filed '+roardate+'</p><cite>'+roarevent.filename+'&nbsp;&nbsp;<a href="'+roarevent.media+'" pop="true" target="fframe"><i class="fa fa-external-link"></i></a></cite></div><input type="text" ng-model="query" placeholder="Search" class="fa fa-search fa-pull-left" /></div>' +
            '<div class="col-xs-4"<img src="https://placehold.it/250x150/&text='+roarevent.rid+'" class="img img-responsive img-hover img-shadow"/></div>' +
            '</div>' +
            '</div><div getpdftext="'+roarevent.id+'" pdf-data="'+roarevent.ocrlink+'">&nbsp;</div>';


                         angular.forEach(APPDOCCODES, function(code, key) {
                             if (doccode === code) {
                                 roarevent.styleClass = 'Applicant';
                                roarevent.content = wraphead + apptemplate + wraptail;
                                //+ appfunction(roarevent, phd.imagefile, main, phd);
                                  roarevent.data = wraphead + apptemplate + wraptail;
                                  //+ appfunction(roarevent, phd.imagefile, main, phd);
                                     phd.content += ptotemplate;

                             }
                         });
                         angular.forEach(PTODOCCODES, function(code, key) {
                             if (doccode === code) {
                                 roarevent.styleClass = 'PTO';
                                  roarevent.content = wraphead + ptotemplate + wraptail;
                                  //+ appfunction(roarevent, phd.imagefile, main, phd);
                                  roarevent.data = wraphead + ptotemplate + wraptail;
                                  //+ appfunction(roarevent, phd.imagefile, main, phd);
                                     phd.content += ptotemplate;
                             }
                         });
                         angular.forEach(INTVDOCCODES, function(code, key) {
                             if (doccode === code) {
                                 roarevent.styleClass = 'Interview';
                                 roarevent.content = wraphead + interviewtemplate + wraptail;
                                 //+ appfunction(roarevent, phd.imagefile, main, phd);
                                 roarevent.data = wraphead + interviewtemplate + wraptail;
                                 //+ appfunction(roarevent, phd.imagefile, main, phd);
                                    phd.content += interviewtemplate;
                            }
                         });
                         angular.forEach(NOADOCCODES, function(code, key) {
                             if (doccode === code) {
                                 roarevent.styleClass = 'NOA';
                                 roarevent.content = wraphead + noatemplate + wraptail;
                                 //+ appfunction(roarevent, phd.imagefile, main, phd);
                                 roarevent.data = wraphead + noatemplate + wraptail;
                                 //+ appfunction(roarevent, phd.imagefile, main, phd);
                                    phd.content += noatemplate;
                             }
                         });
                         angular.forEach(PETDOCCODES, function(code, key) {
                             if (doccode === code) {
                                 roarevent.styleClass = 'Petition';
                                 roarevent.content = wraphead + petitiontemplate + wraptail;
                                 //+ appfunction(roarevent, phd.imagefile, main, phd);
                                 roarevent.data = wraphead + petitiontemplate + wraptail;
                                 //+ appfunction(roarevent, phd.imagefile, main, phd);
                                    phd.content += petitiontemplate;
                             }
                         });
                        //  roarevent.content = wraphead + '<doc-header roarid="' + de + '" roarevent="roarevent"></doc-header>' + wraptail + appfunction(roarevent, phd.imagefile,main,phd);
                        //  roarevent.data = wraphead + '<doc-header roarid="' + de + '" roarevent="roarevent"></doc-header>' + wraptail + appfunction(roarevent, phd.imagefile,main,phd);
                        //  phd.content += '<doc-header roarid="' + de + '" roarevent="roarevent"></doc-header>';
                         var d = new Date();
                        var n = d.getTime();
                          roarevent.rows= [
                              {columns:[
                                  {cid:n+10,styleClass:'col-sm-4',widgets:[{config:{height: "90vh",url: roarevent.ocrlink || 'http://www.google.com'},styleClass:roarevent.styleClass || 'btn-dark',title:roarevent.title || 'title',type:'iframe',wid:n+100}]},
                                  {cid:n+1000,styleClass:'col-sm-8',widgets:[{config:{id:'PROMISE',height:'90vh'},styleClass:roarevent.styleClass||'btn-dark',title:roarevent.title || 'title',type:'ckwidget', wid:n+1010}]}
                              ]}
                          ];
                          //roarevent.content = ckstarter + ckheader + ckender;
                          roarevent.structure = "4-8";
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
                                          refr.child('rows').child('0').child('columns').child('1').child('widgets').child('0').child('config').child('id').set(id);
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
                     phdmerits = { rid: 'PHD4', title: 'MERITS', styleClass: 'PTO', icon: 'fa-balance-scale' },
                     phdart = { rid: 'PHD2', title: 'ART', styleClass: 'Petition', icon: 'fa-leaf' },
                     phdclaims = { rid: 'PHD3', title: 'CLAIMS', styleClass: 'Applicant', icon: 'fa-sitemap'};
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

     }]).factory('$$roarmap', function(APPDOCCODES,PTODOCCODES,INTVDOCCODES,PETDOCCODES,NOADOCCODES,DOCNAMES,ckstarter,ckender,$location,pdfToPlainText,$http){
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
                        var apptemplate =  '<div class="container-fluid two-col-right">' +
            '<div class="row">' +
            '<div id="col-xs-4" class="col-xs-9" ><div class="bs-callout bs-callout-Applicant"><h4>'+ roarevent.title+'</h4><p>Filed '+roardate+'</p><cite>'+roarevent.filename+'&nbsp;&nbsp;<a href="'+roarevent.media+'" target="fframe"><i class="fa fa-external-link"></i></a></cite>'+  '</div></div>' +
            '<div id="col-xs-4" class="col-xs-3"  onmouseenter="$(\'#col-xs-9\').toggleClass(\'col-xs-9 col-xs-3\');$(\'#col-xs-3\').toggleClass(\'col-xs-9 col-xs-3\')"><p><iframe name="fframe" src="' + frametemplate +  '" class="img img-responsive img-shadow" style="background-image:url('+old+');"></iframe></p></div>' +
            '</div>' +
            '</div><p>&nbsp;</p>';
                     var ptotemplate = '<div class="container-fluid two-col-left">' +
            '<div class="row">' +
            '<div class="col-xs-4"><p><img src="https://placehold.it/250x208/640002/fff/&text='+ roarevent.rid + '" class="img img-responsive img-shadow"/></p></div>' +
            '<div class="col-xs-8"><div class="bs-callout bs-callout-PTO bs-callout-reverse"><h4>'+ roarevent.title + '</h4><p>Filed '+roardate+'</p><cite>'+roarevent.filename+'&nbsp;&nbsp;<a href="'+roarevent.media+'" target="fframe"><i class="fa fa-external-link"></i></a></cite></div></div>' +
            '</div>' +
            '</div><p>&nbsp;</p>';
                    var noatemplate = '<div class="container-fluid two-col-left">' +
            '<div class="row">' +
            '<div class="col-xs-4"><p><img src="https://placehold.it/250x208/7c994f/fff/&text='+roarevent.rid+'" class="img img-responsive img-shadow"/></p></div>' +
            '<div class="col-xs-8"><div class="bs-callout bs-callout-NOA bs-callout-reverse"><h4>' + roarevent.title + '</h4><p>Filed '+roardate+'</p><cite>'+roarevent.filename+'&nbsp;&nbsp;<a href="'+roarevent.media+'" target="fframe"><i class="fa fa-external-link"></i></a></cite></div></div>' +
            '</div>' +
            '</div><p>&nbsp;</p>';
                    var petitiontemplate = '<div class="container-fluid two-col-right">' +
            '<div class="row">' +
            '<div class="col-xs-8"><div class="bs-callout bs-callout-Petition"><h4>'+ roarevent.title + '</h4><p>Filed '+roardate+'</p><cite>'+roarevent.filename+'&nbsp;&nbsp;<a href="'+roarevent.media+'" target="fframe"><i class="fa fa-external-link"></i></a></cite></div></div>' +
            '<div class="col-xs-4"><p><img src="https://placehold.it/250x208/b48200/fff/&text='+roarevent.rid+'" class="img img-responsive img-shadow"/></p></div>' +
            '</div>' +
            '</div><p>&nbsp;</p>';
             var interviewtemplate = '<div class="container-fluid two-col-right">' +
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
     }).filter('strip', function(){
         return function(input){
            var regex = new RegExp(/\D/);
            if (input && angular.isString(input)){var output = input.replace(regex, '');}
            return output;
         };
     }).directive('docHeader',['$window','$document','$compile','$templateCache','Collection', function($window,$document,$compile,$templateCache,Collection){
         return {
           restrict:'EA',
           scope:{
                roarevent:'=?'
           },
           templateUrl: '{widgetsPath}/getphd/src/phd/docheader.html',
           //controller:'ROARCtrl',
           //controllerAs:'roarevent',
           //bindToController: true,
           link: function($scope,$element,$attrs,$ctrl){
                var roarid = $attrs.roarid;

                Collection(roarid).$loaded().then(function(roarevent){
                    $scope.roarevent=roarevent;


var maildate = new Date(roarevent['Mail Room Date']);

                $scope.roardate = maildate.toDateString();
                  var background = function(){

                    var template;
                    var styleClass = roarevent.styleClass;
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

                    return template;
                };
                $scope.background = 'https://placehold.it/250x150/'+background()+'/fff/&text='+$scope.roarevent.rid;


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
                $http.get('https://lexlab.io/proxy/lexlab.io/getphd/patents/' + numbr).then(function (resp) {
                    $scope.patent = resp.data;
                });
            }
        };
    }])
    .directive('patentCitation', ['$http','Collection',function($http, Collection){
        return {
            restrict: 'EA',
            templateUrl: '{widgetsPath}/getphd/src/phd/citation.html',
            scope:{

            },

            link: function($scope,$element,$attrs,$ctrl){
                var p = this;
                var id = $attrs.patent;
                $http.get('/getphd/patents/'+id).then(function(resp){
                    $scope.p = resp.data;
                });
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
