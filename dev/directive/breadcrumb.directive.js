angular.module('adminApp')
.controller('BreadcrumbController',BreadcrumbController) // defining Directive Controller
.directive('myBreadcrumb',myBreadcrumb); // defining my-breadcrumb Directive

BreadcrumbController.$inject=['$state']; // injecting Cobntroller dependencies

// controller function for directve
function BreadcrumbController($state){
	var vm = this;

	vm.breadcrumbObj = [];

	//initialize function
	createBreadcrumb();

	function createBreadcrumb() {
		var data = $state.current.data.breadcrumb;
		angular.forEach(data, function(value, key){
			vm.breadcrumbObj.push(value);
		});
	}

};// end of BreadcrumbController function

// directive function
function myBreadcrumb(){
 	return {
 		restrict: 'E',
 		replace:true,
 		controller: 'BreadcrumbController',
    	controllerAs: 'ctrl',
 		template: [
 		'<ol class="breadcrumb">',
	    	'<li><a href="#"><i class="fa fa-dashboard"></i> Dashboard</a></li>',
	    	'<li ng-repeat="obj in ctrl.breadcrumbObj" class="active">{{obj}}</li>',
	  	'</ol>'
 		].join('')
 	};
}; // end of myBreadcrumb function 