'use strict';
angular.module('roar', ['angularFileUpload', 'pageslide-directive'])
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
                  columns: [{cid:n+9,styleClass:'col-sm-6',widgets:[{ config: { height: "90vh", url: roarevent.ocrlink || 'http://www.google.com' }, styleClass: roarevent.styleClass || 'btn-dark', title: 'LexFrame', type: 'iframe', wid: n + 100 }]},
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
  .factory('$roarmap', ['$stateParams', 'Matter', 'Collection', 'ROARevent', 'ROARevents', 'Collections',  '$timeout', 'OWNERSHIPDOCS', 'ARTDOCS', 'MERITSDOCS', 'DOCNAMES', 'PETDOCCODES', 'NOADOCCODES', 'INTVDOCCODES', 'PTODOCCODES', 'APPDOCCODES', '$q', 'PHD', '$log', 'FIREBASE_URL', 'filepickerService', '$location', '$ACTIVEROAR', '$dashboards', 'CLAIMDOCS', 'ckstarter', 'ckender', 'ckheader', '$http', '$filter',
    function ($stateParams, Matter, Collection, ROARevent, ROARevents, Collections, $timeout, OWNERSHIPDOCS, ARTDOCS, MERITSDOCS, DOCNAMES, PETDOCCODES, NOADOCCODES, INTVDOCCODES, PTODOCCODES, APPDOCCODES, $q, PHD, $log, FIREBASE_URL, filepickerService, $location, $ACTIVEROAR, $dashboards, CLAIMDOCS, ckstarter, ckender, ckheader, $http, $filter) {
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

                roarevent.ocrlink = 'https://lexlab.io/files/public/uspto/' + appnumsubstring + '/' + appnumsubstring + '-image_file_wrapper/' + filename.replace('.pdf', '_ocr.pdf');

                roarevent.selflink = '/files/public/uspto/' + appnumsubstring + '/' + appnumsubstring + '-image_file_wrapper/' + filename;
                roarevent.media = roarevent.ocrlink;
                //  roarevent.media = '/files/viewer/web/viewer.html?file=%2Ffiles/public/uspto/' + appnumsubstring + '/' + appnumsubstring + '-image_file_wrapper/' + filename;
              } else {
                roarevent.ocrlink = 'https://lexlab.io/files/public/uspto/' + appnumsubstring + '/' + appnumsubstring + '-image_file_wrapper/' + filename.replace('.pdf', '_ocr.pdf');

                roarevent.selflink = 'https://lexlab.io/files/public/uspto/' + appnumsubstring + '/' + appnumsubstring + '-image_file_wrapper/' + filename;
                roarevent.media = roarevent.ocrlink;
                //  roarevent.media = 'https://lexlab.io/files/public/viewer/web/viewer.html?file=%2Ffiles/public/uspto/' + appnumsubstring + '/' + appnumsubstring + '-image_file_wrapper/' + filename;
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
                main.progresstwo++;
                var appref = Collection(roarevent.Application).$ref();
                appref.child('history').child(roarevent.date).child(id).set(id);
                allref.child('roarlist').child(id).set(id);

                var oc = new RegExp(/(^CLM$)|(NOA)|(CTRF)|(CTFR)|(REM)|(^\bA\..)|(CTRS)|(CTNS)/);
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
  }).directive('docHeader', ['$window', '$document', '$compile', '$templateCache', 'Collection', function ($window, $document, $compile, $templateCache, Collection) {
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
                template = null;
                break;
              case 'NOA':
                template = '7c994f';
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
      },
      link: function ($scope, $element, $attr, $ctrl) {
        var numbr = $attr.patent;
        if ($attr.pnum) {
          $scope.config = {
            PNUM: $attr.pnum
          }
        }
        try {
          Collection(numbr).$loaded().then(function (data) {
            $scope.patent = data;
          });
        } catch (ex) {
          $http.get('https://lexlab.io/proxy/lexlab.io/getphd/patents/' + numbr).then(function (resp) {
            $scope.patent = resp.data;
          });
        }
        finally {
          alertify.success('loaded!');
        }

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
          // $http.get('https://lexlab.io/proxy/lexlab.io/getphd/patents/' + ref).then(function (resp) {
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
