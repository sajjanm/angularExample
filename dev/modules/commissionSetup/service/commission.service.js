angular.module('adminApp.commissionSetup')
.service('CommissionService', CommissionService);

CommissionService.$inject=['Restangular'];

function CommissionService(Restangular){

	var service = {
		fetchNotAssignedPayeeEvent : fetchNotAssignedPayeeEvent,
		createCommission : createCommission,
		getAllCommission : getAllCommission,
		getCommissionById : getCommissionById,
		updateCommission: updateCommission,
		getAllCommissionByPagination : getAllCommissionByPagination,
		getAllCommissionPartner : getAllCommissionPartner,
		getAllCommissionSlab : getAllCommissionSlab,
		blockUnblockCommission: blockUnblockCommission
	};

	return service;

	function fetchNotAssignedPayeeEvent() {
		return Restangular.all('commission/notAssignedPayeeEvent').customGET();
	}

	function createCommission(commission) {
		return Restangular.all('commission').post(commission);
	}

	function getAllCommission() {
		return Restangular.all('commission').getList();
	}

	function getCommissionById(id) {
		return Restangular.all('commission').customGET(id);
	}

	function updateCommission(commission, id) {
		return Restangular.one('commission').customPUT(commission, id);
	}

	function getAllCommissionByPagination(params) {
		return Restangular.one('commission', "filterParam").customPOST(params, null);
	}

	function getAllCommissionPartner() {
		return Restangular.all('commissionPartner').customGET();
	}

	function getAllCommissionSlab() {
		return Restangular.all('commissionSlab').customGET();
	}

	function blockUnblockCommission(id) {
		return Restangular.all('commission').customGET(id + '/blockUnblockCommission');
	}	

}
