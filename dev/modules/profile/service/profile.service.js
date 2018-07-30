angular
.module('adminApp.profile')
.service('ProfileService',ProfileService);

ProfileService.$inject=['Restangular']

function ProfileService(Restangular){

	var service = {
		getProfileDetail : getProfileDetail,
		uploadProfilePhoto : uploadProfilePhoto,
		getProfilePhoto : getProfilePhoto,
		updatePassword : updatePassword,
		updateProfile : updateProfile
	};

	return service;

	// fetching the profile details
	function getProfileDetail() {
		return Restangular.all('smartCardAdminAccountProfile').customGET(null);
	}

	// UPLOAD THE PROFILE PRICTURE
	function uploadProfilePhoto(form){
		return Restangular.all('smartCardAdminAccountProfile/uploadPhoto').withHttpConfig({transformRequest: angular.identity})
          .customPOST(form,'',undefined,{'Content-Type': undefined});
	}// END OF UPLOAD PROFILE PHOTO FUNCTION

	// fetching Profile photo
	function getProfilePhoto(){
		return Restangular.all('smartCardAdminAccountProfile').one('photo').get();
	} // end of get profile photo function

	// updating the password
	function updatePassword(changePasswordValues){
		return Restangular.all('adminChangePasswordResource').customPUT(changePasswordValues);
	}// END OF UPDATE PASSWORD FUNCTION

	// updates the profile
	function updateProfile(adminData, profileId){
		return Restangular.one('SmartCardAdmin').customPUT(adminData, profileId);
	}// end of update profile

}