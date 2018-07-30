angular.module('adminApp')
.factory('NavigationService',NavigationService);

NavigationService.$inject=['Restangular'];

function NavigationService(Restangular){

	var service = {
		navigation : navigation
	};

	return service;

	function navigation(){
		return Restangular.one('SmartCardAdmin').one('navigation').customGET();
	}

}
