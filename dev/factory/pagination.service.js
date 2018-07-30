angular.module('adminApp')
.factory('PaginationService',PaginationService);
 
PaginationService.$inject=['Restangular'];

function PaginationService(Restangular){

	var service = {
		getSno : getSno
	};

	return service;

	function getSno(tableParams) {

		var page = parseInt(tableParams.pageNumber);
		if(page == 1) {
			return 1;
		}else {
			return parseInt(page - 1) * parseInt(tableParams.pageSize) + 1;
		}

	}

}