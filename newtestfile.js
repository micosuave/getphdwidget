app.directive('docHeader', function(){
  return {
     restrict: 'EA',
     templateUrl: '{widgetsPath}/getphd/src/phd/docheader.html',
     replace:false,
     priority: 0,
     scope: {},
     link: function($scope,$element,$attr,$ctrl){
          alert('help me!');
     }
  }
});
