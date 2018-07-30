angular.module('adminApp.customerProfile')
.service('CustomerProfileService', CustomerProfileService);

CustomerProfileService.$inject=['Restangular']

function CustomerProfileService(Restangular){

	var service = {
		createProfile : createProfile,
		getAllProfiles : getAllProfiles,
		updateProfile: updateProfile,
		deleteProfile: deleteProfile,
		fetchProfileAttributes: fetchProfileAttributes,
		getCustomerRoles: getCustomerRoles,
		editProfile: editProfile,
		getAllProfileByPagination: getAllProfileByPagination
	};

	return service;

	function createProfile(profile) {
		return Restangular.all('CustomerProfile').post(profile);
	}

	function getAllProfiles() {
		return Restangular.all('CustomerProfile').getList();
	}

	function updateProfile(profile, id) {
		return Restangular.one('CustomerProfile').customPUT(profile, id);
	}

	function fetchProfileAttributes() {
		return Restangular.all('CustomerProfile').one('CustomerProfileAttribute').getList();
	}

	function deleteProfile(profile, id) {
		return Restangular.one('CustomerProfile', id).one('Delete').customPUT(profile);
	}

	function getCustomerRoles() {
		return Restangular.all('CustomerProfile').one('Roles').getList();
	}

	function editProfile(id) {
		return Restangular.one('CustomerProfile', id).customGET("");
	}	

	function getAllProfileByPagination(params) {
		return Restangular.one('CustomerProfile', "filterParam").customPOST(params, null);
	}	

}
