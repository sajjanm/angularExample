angular.module('adminApp.applicationSetup')
.service('PasswordPolicyService', PasswordPolicyService);

PasswordPolicyService.$inject=['Restangular'];

function PasswordPolicyService(Restangular){

	var service = {
		getPasswordPolicys : getPasswordPolicys,
		updatePasswordPolicys : updatePasswordPolicys
	};

	return service;

	function getPasswordPolicys() {
		return Restangular.all('passwordPolicy').getList();
	}

	function updatePasswordPolicys(passwordPolicy) {
		return Restangular.all('passwordPolicy').post(passwordPolicy);
	}

}
