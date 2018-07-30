angular.module('adminApp.login')
.service('LoginService',LoginService);

LoginService.$inject=['Restangular', '$http']

function LoginService(Restangular, $http){

	var service = {
		login : login,
		verifyUsername: verifyUsername
	};

	return service;

	function login(user){
		return Restangular.all('SmartCardAdmin/auth').post(user);
	}

	function logout() {
		// TODO
		// logout api invocation
	}

	function verifyUsername(username) {
		return Restangular.all('SmartCardAdmin/forgotYourPassword').customPUT(username, null);
	}

}
