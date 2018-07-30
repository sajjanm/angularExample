angular.module('adminApp.commissionSetup')
.service('CommissionSlabService', CommissionSlabService);

CommissionSlabService.$inject=['Restangular'];

function CommissionSlabService(Restangular){

	var service = {
		createSlab : createSlab,
		getAllSlab : getAllSlab,
		updateSlab: updateSlab,
		deleteSlab: deleteSlab,
		getSlabById: getSlabById,
		getAllSlabByPagination : getAllSlabByPagination
	};

	return service;

	function createSlab(slab) {
		return Restangular.all('commissionSlab').post(slab);
	}

	function getAllSlab() {
		return Restangular.all('commissionSlab').getList();
	}

	function getSlabById(id) {
		return Restangular.one('commissionSlab', id).customGET();
	}

	function updateSlab(slab, id) {
		return Restangular.one('commissionSlab').customPUT(slab, id);
	}

	function deleteSlab(slab, id) {
		return Restangular.one('commissionSlab', id).one('Delete').customPUT(slab);
	}

	function getAllSlabByPagination(params) {
		return Restangular.one('commissionSlab', "filterParam").customPOST(params, null);
	}	

}
