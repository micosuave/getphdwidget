'use strict';
angular.module('roar').controller('TextController', ['$scope','Collection','config',
  function($scope, Collection, config){
    var config = $scope.$parent.config || $scope.$parent.$parent.config;

    var roarevent = Collection(config.id);
    roarevent.$bindTo($scope, 'roarevent');



}]);
