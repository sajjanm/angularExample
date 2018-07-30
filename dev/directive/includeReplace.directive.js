angular.module('adminApp')
.directive('includeReplace',includeReplace); // defining include Directive

// directive function
function includeReplace() {
	return {
        require: 'ngInclude',
        restrict: 'A', /* optional */
        link: function (scope, el, attrs) {
            el.replaceWith(el.children());
        }
    };
}; //end of includeReplace() function