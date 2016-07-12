(function () {  

    'user strict';

    angular
    .module('unsavedChanges', [])
    .directive('leavingPage', LeavingPage);

    LeavingPage.$inject = ['$rootScope', '$location'];

    function LeavingPage($rootScope, $location) {

        var directive = {
            restrict: 'A',
            scope: {
                leavingPageMessage: '@leavingPageMessage'
            },
            link: link
        };

        return directive;

        function link (scope, element, attrs, controller) {
           
            $rootScope.$on("$locationChangeStart", function (event, next, current) {
               
                var formInputs = $(element).find("[unsaved-element]");

                $(formInputs).each(function (i, obj) {

                    var model = angular.element($(obj)).controller('ngModel');
                    
                    if(model.$isChanged && model.$dirty) {
                    
                       var r = confirm(scope.leavingPageMessage);
                    
                        if (!r) {
                            event.preventDefault();
                        }

                        return false;
                    }
                });
            });

            scope.destroyUnsavedChanges = function () {
                scope.$destroy();
            }
        }
    }
})();


(function () {
    
    'use strict';
   
    angular
    .module('unsavedChanges')
    .directive('unsavedElement', UnsavedElement);

    UnsavedElement.$inject = ['$rootScope'];

    function UnsavedElement ($rootScope) {

        var directive = {
            restrict: 'A',
            link:     link,
            require:  'ngModel'
        }

        return directive;

        function link (scope, elemet, attrs, ngModel) {
            
            function isEmpty (val) {
                return ( val === undefined || val == null || val.length <= 0 ) ? null : val;
            }

            scope.$watch(attrs.ngModel, function (value) {
                
                value = isEmpty(value);

                //If the ngModel is touched or not
                if ( ngModel.$pristine ) {
                    ngModel.$initialValue = value;
                }

                //value change?
                ngModel.$isChanged = value == ngModel.$initialValue;

            });
        }
    }
})();