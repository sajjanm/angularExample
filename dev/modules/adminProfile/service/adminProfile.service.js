angular.module('adminApp.adminProfile')
.service('AdminProfileService', AdminProfileService);

AdminProfileService.$inject=['Restangular'];

function AdminProfileService(Restangular){

	var service = {
		createProfile : createProfile,
		getAllProfiles : getAllProfiles,
		updateProfile: updateProfile,
		deleteProfile: deleteProfile,
		getAdminRoles: getAdminRoles,
		editProfile: editProfile,
		getAllProfileByPagination : getAllProfileByPagination
	};

	return service;

	function createProfile(profile) {
		return Restangular.all('AdminProfile').post(profile);
	}

	function getAllProfiles() {
		return Restangular.all('AdminProfile').getList();
	}

	function updateProfile(profile, id) {
		return Restangular.one('AdminProfile').customPUT(profile, id);
	}

	function deleteProfile(profile, id) {
		return Restangular.one('AdminProfile', id).one('Delete').customPUT(profile);
	}

	function getAdminRoles() {
		return Restangular.all('AdminProfile').one('Roles').getList();
	}

	function editProfile(id) {
		return Restangular.one('AdminProfile', id).customGET("");
	}

	function getAllProfileByPagination(params) {
		return Restangular.one('AdminProfile', "filterParam").customPOST(params, null);
	}	

}
