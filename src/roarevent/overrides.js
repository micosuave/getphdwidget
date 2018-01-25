app
      .directive('collectionA', ['Collection','ROARevents','ROARevent', function(Collection, ROARevents, ROARevent) {
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