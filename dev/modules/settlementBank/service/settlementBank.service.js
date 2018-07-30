angular.module('adminApp.settlementBank')
.service('SettlementBankService', SettlementBankService);

SettlementBankService.$inject=['Restangular'];

function SettlementBankService(Restangular){

	var service = {
		getAllSettlementBanks : getAllSettlementBanks,
		createSettlementBank : createSettlementBank,
		updateSettlementBank: updateSettlementBank,
		deleteSettlementBank: deleteSettlementBank,
		getAllSettlementBanksByPagination : getAllSettlementBanksByPagination,
		editSettlementBank: editSettlementBank,
		blockUnblockBank : blockUnblockBank,
		fetchSettlementBankByUsername : fetchSettlementBankByUsername
	};

	return service;

	function getAllSettlementBanks() {
		return Restangular.all('SettlementBank').getList();
	}

	function getAllSettlementBanksByPagination(params) {
		return Restangular.one('SettlementBank', "filterParam").customPOST(params, null);
	}

	function createSettlementBank(bank) {
		return Restangular.all('SettlementBank').post(bank);
	}

	function updateSettlementBank(bank, id) {
		return Restangular.one('SettlementBank').customPUT(bank, id);
	}

	function deleteSettlementBank(bank, id) {
		return Restangular.one('SettlementBank', id).one('Delete').customPUT(bank);
	}

	function editSettlementBank(id) {
		return Restangular.one('SettlementBank', id).customGET("");
	}

	function blockUnblockBank(bank, id){
		return Restangular.one('SettlementBank', id).one('toggleActive').customPUT(bank);
	}

	function fetchSettlementBankByUsername(name){
		return Restangular.one('SettlementBank').getList("check", {username:name})
	}

}
