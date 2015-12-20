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
                     artlist: new Array(),
                     ownlist: new Array()
                 };


                 function hello() {
                     var check = checkforexistingphd();
                     if (check) {
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
                                     $log.info('ownership', id);
                                 }
                             });
                             angular.forEach(ARTDOCS, function(code, key) {
                                 if (roarevent.doccode === code) {
                                     p.artlist.push(id);
                                     $log.info('art', id);
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
