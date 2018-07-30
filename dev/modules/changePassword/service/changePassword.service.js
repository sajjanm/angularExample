angular
.module('adminApp.changePassword')
.service('ChangePasswordService',ChangePasswordService);

ChangePasswordService.$inject=['Restangular']

function ChangePasswordService(Restangular){

	var service = {
		updatePassword : updatePassword
	};

	return service;

	// updating the password
	function updatePassword(changePasswordValues){
		// simple post request with service/changePassword/1 and then post past
		return Restangular.all('adminChangePasswordResource').customPUT(changePasswordValues);
		// return Restangular.all('customer').customPOST(changePasswordValues, 'service/changePassword/'+userId);
	}// END OF UPDATE PASSWORD FUNCTION

}
