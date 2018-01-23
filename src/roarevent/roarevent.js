app
  .directive('roarevents', function (ROARevents, ROARevent, Collection, filepickerService, $roarevent, $filter, Collections, toastr, bytesFilter, ckstarter, ckender,$http, $stateParams, $rootScope) {
    return {
      restrict: 'A',

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
  })
.factory('$roar', function($http,$stateParams,$rootScope, ckstarter,ckender,Collection,bytesFilter){
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
})
  .directive('roarevt', function ($http, $rootScope, $compile, $controller, $document, $animate) {
    return {
      restrict: 'E',
      transclude: true,

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
  })
  .directive('roarEvent', function ($http, Popup, $rootScope, $compile, $controller, $document, $animate, ROARevent, Collection) {
    return {
      restrict: 'EA',
      transclude: true,

      templateUrl: '/llp_core/modules/roarmap/directive/roarevent/roarevent.html',
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
  })
  .directive('roarChipA', function ($http, Popup, $rootScope, $compile, $controller, $document, $animate, ROARevent, ngDialog, Collection) {
    return {
      restrict: 'EA',
      templateUrl: '{widgetsPath}/getphd/src/roarevent/roarchip.html',
      transclude: true,
      controller: 'ROARChipCtrl',
      controllerAs: 'roar',
      bindToController: true,
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
  })
  .controller('ROARevtCtrl', function ($compile, $templateCache, $scope, pdfToPlainText, $http, ckstarter, ckender, Popup) {
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
        // var skope = angular.element('<iframe/>').attr('srcdoc', ('<!DOCTYPE html><html><head></head><body><div class="card card-default">' + angular.fromJson(event.content) + '</div></body></html>'))
        // var skope = $sce.trustAsHtml(roarevent.content)

        // angular.element(roarevent.content).append(resp.data)

        angular.element('body').append($compile(divpanel.append(header).append(skope))($scope))
        $('.issuedocpanel').draggable({
          stack: '.stacker',
          handle: 'h4'
        }).resizable()
      })
    }
  })
  /*.directive('pop', ['$compile', '$templateCache', 'ROARevent', function ($compile, $templateCache, ROARevent) {
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
  }])*/
  .controller('ROARChipCtrl', function ($aside, toastr, $uibModal, $compile, Collection, $scope, $templateCache, ngDialog, $ACTIVEROAR, $window, $rootScope, PROJECT, $stateParams, $sce, Fullscreen, $clipboard, ROARevents, $http) {
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
  })
  .directive('roarBadge', function (Collection, $animate) {
    return {
      restrict: 'EA',
      templateUrl: '/llp_core/modules/roarmap/directive/roarevent/roarbadge.html',
      transclude: true,
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
  })
  .directive('roarToggles', function () {
    return {
      restrict: 'E',
      templateUrl: '/llp_core/modules/roarmap/directive/roarevent/roartoggles.html',
      scope: {
        roarevent: '=',
        animation: '=',
        editable: '='

      },
      link: function (scope, element, $attr, fn) {}
    }
  })
  .directive('rpop', function ($http, Popup, $rootScope, $compile, $controller, $document, $animate, ROARevent, $templateCache) {
    return {
      restrict: 'AC',
      // templateUrl: 'modules/roarmap/directive/roarevent/roarpopover.html',
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
    };})
  .directive('roarPopover', function ($http, Popup, $rootScope, $compile, $controller, $document, $animate) {
    return {
      restrict: 'A',
      // templateUrl: 'modules/roarmap/directive/roarevent/roarpopover.html',
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
  })
  .directive('toolbar', function () {
    return {
      restrict: 'E',
      templateUrl: '/llp_core/modules/roarmap/directive/toolbars/toolbarbasic.html',
      scope: false,
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
}).directive('docHead', ['$window', '$document', '$compile', '$templateCache', 'Collection', function ($window, $document, $compile, $templateCache, Collection) {
  return {
    restrict: 'EA',
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
.controller('DocHeaderController', function ($aside, toastr, $uibModal, $compile, Collection, $scope, $templateCache, ngDialog, $ACTIVEROAR, $window, $rootScope, PROJECT, $stateParams, $sce, Fullscreen, $clipboard, ROARevents, $http) {
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

})
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
