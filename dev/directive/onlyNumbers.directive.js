angular.module('adminApp')
.directive('onlyNumbers',onlyNumbers); // defining onlyNumbers Directive

// directive function
function onlyNumbers(){
 	return {
      require: 'ngModel',
      restrict: 'A',
      link: function (scope, element, attr, ctrl) {
        function inputValue(val) {
          if (val) {
            var digits = val.replace(/[^0-9]/g, '');

            if (digits !== val) {
              ctrl.$setViewValue(digits);
              ctrl.$render();
            }
            return parseInt(digits);
          }
          return undefined;
        }            
        ctrl.$parsers.push(inputValue);
      }
    };
}; // end of onlyNumbers function 