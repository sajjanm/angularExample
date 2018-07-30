angular.module('adminApp.commissionSetup')
.service('CommissionPartnerService', CommissionPartnerService);

CommissionPartnerService.$inject=['Restangular'];

function CommissionPartnerService(Restangular){

	var service = {
		createPartner : createPartner,
		getAllPartner : getAllPartner,
		getPartnerById : getPartnerById,
		updatePartner: updatePartner,
		deletePartner: deletePartner,
		getAllPartnerByPagination : getAllPartnerByPagination
	};

	return service;

	function createPartner(partner) {
		return Restangular.all('commissionPartner').post(partner);
	}

	function getAllPartner() {
		return Restangular.all('commissionPartner').getList();
	}

	function getPartnerById(id) {
		return Restangular.one('commissionPartner', id).customGET();
	}

	function updatePartner(partner, id) {
		return Restangular.one('commissionPartner').customPUT(partner, id);
	}

	function deletePartner(partner, id) {
		return Restangular.one('commissionPartner', id).one('Delete').customPUT(partner);
	}

	function getAllPartnerByPagination(params) {
		return Restangular.one('commissionPartner', "filterParam").customPOST(params, null);
	}	

}
