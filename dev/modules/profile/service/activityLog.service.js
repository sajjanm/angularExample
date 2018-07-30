angular.module('adminApp.profile')
.service('ActivityLogService', ActivityLogService);

ActivityLogService.$inject=['Restangular'];

function ActivityLogService(Restangular){

	var service = {
		getAllActivityLogByPagination: getAllActivityLogByPagination
	};

	return service;

	function getAllActivityLogByPagination(params) {
		return Restangular.one('smartCardAdminActivityLogResource', "filterParam").customPOST(params, null);
	}
	
}
