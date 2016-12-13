'use strict';
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
            link: function (scope, element, attr) {
                scope.textSize = scope.value;
                scope.$watch('textSize', function (size) {
                    $document.root.style.fontSize = size + scope.unit;
                    $('html').css({ 'font-size': size + scope.unit });
                });
            }
        };
    }]);

// <text-size-slider min="8" max="38" unit="vw" value="10" step="2"></text-size-slider>
