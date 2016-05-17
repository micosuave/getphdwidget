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

}]);
