'use strict';
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
  // roarevent.$loaded().then(function(data){
  //   cwc.claimset = data.claims;
  // });
  roarevent.$bindTo($scope, 'roarevent');
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
        newarray[num] = claim;
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
                var p = input.slice(0, input.indexOf('.'));

                return p || input;
            };

          $scope.prent =  function(input) {
                var dependencytest = new RegExp(/\sof\sc[li]aim\s\d+,?\s/ig);
                var idref = input.match(dependencytest);
                var id;
                if (idref !== null) {
                    var id = idref[0].replace(/\D/ig, '');
                }

                return id;
            };
          $scope.addClaim = function(index, node){
              var newtext = '' + (index + 1) + '. The claim of claim ' + index + ', wherein the text is self-referential.';
              node.claims.unshift(newtext);
              $scope.sortSet(node);
          };
}]);
