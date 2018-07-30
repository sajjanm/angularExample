angular.module('adminApp.settlementBankProfile')
.service('SettlementBankProfileService', SettlementBankProfileService);

SettlementBankProfileService.$inject=['Restangular'];

function SettlementBankProfileService(Restangular){

	var service = {
		createProfile : createProfile,
		getAllProfiles : getAllProfiles,
		updateProfile: updateProfile,
		deleteProfile: deleteProfile,
		getSettlementBankRoles: getSettlementBankRoles,
		editProfile: editProfile,
		getAllProfileByPagination : getAllProfileByPagination
	};

	return service;

	function createProfile(profile) {
		return Restangular.all('SettlementBankProfile').post(profile);
	}

	function getAllProfiles() {
		return Restangular.all('SettlementBankProfile').getList();
	}

	function updateProfile(profile, id) {
		return Restangular.one('SettlementBankProfile').customPUT(profile, id);
	}

	function deleteProfile(profile, id) {
		return Restangular.one('SettlementBankProfile', id).one('Delete').customPUT(profile);
	}

	function getSettlementBankRoles() {
		return Restangular.all('SettlementBankProfile').one('Roles').getList();
	}

	function editProfile(id) {
		return Restangular.one('SettlementBankProfile', id).customGET("");
	}

	function getAllProfileByPagination(params) {
		return Restangular.one('SettlementBankProfile', "filterParam").customPOST(params, null);
	}	

}
