angular.module('adminApp.memberBankProfile')
.service('MemberBankProfileService', MemberBankProfileService);

MemberBankProfileService.$inject=['Restangular'];

function MemberBankProfileService(Restangular){

	var service = {
		createProfile : createProfile,
		getAllProfiles : getAllProfiles,
		updateProfile: updateProfile,
		deleteProfile: deleteProfile,
		getMemberBankRoles: getMemberBankRoles,
		editProfile: editProfile,
                getAllProfileByPagination : getAllProfileByPagination
	};

	return service;

	function createProfile(profile) {
		return Restangular.all('MemberBankProfile').post(profile);
	}

	function getAllProfiles() {
		return Restangular.all('MemberBankProfile').getList();
	}

	function updateProfile(profile, id) {
		return Restangular.one('MemberBankProfile').customPUT(profile, id);
	}

	function deleteProfile(profile, id) {
		return Restangular.one('MemberBankProfile', id).one('Delete').customPUT(profile);
	}

	function getMemberBankRoles() {
		return Restangular.all('MemberBankProfile').one('Roles').getList();
	}

	function editProfile(id) {
		return Restangular.one('MemberBankProfile', id).customGET("");
	}	
        
    function getAllProfileByPagination(params) {
		return Restangular.one('MemberBankProfile', "filterParam").customPOST(params,null);
	}

}
