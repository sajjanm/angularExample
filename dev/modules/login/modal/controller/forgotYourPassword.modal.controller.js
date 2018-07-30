(function() {
	'use strict';

	angular.module('adminApp.login')
	.controller('ForgotYourPasswordModalController', ForgotYourPasswordModalController);

	ForgotYourPasswordModalController.$inject = ['$uibModalInstance', '$filter', 'LoginService'];

	function ForgotYourPasswordModalController($uibModalInstance, $filter, LoginService) {

		var vm = this;
		vm.loaded = true;

		vm.error = false;
		vm.error_message = '';
		vm.success = false;
		vm.success_message = '';

	    // properties
	    vm.username = '';

		// methods
		vm.resetMessage = resetMessage;

		// modal methods
		vm.ok = ok;
		vm.cancel = cancel;

		function ok() {
			resetMessage();

			vm.loaded = false;
			LoginService.verifyUsername(vm.username)
			.then(function(successResponse){
                // success response
                vm.loaded = true;
                vm.success = true;
                vm.success_message = successResponse.data.message;
                vm.username = '';

            }, function(errorResponse){
                // errorResponse
                vm.loaded = true;
                vm.error = true;
                vm.error_message = errorResponse.data.message;
            
            });

			// $uibModalInstance.close(vm.username);
		}

		function cancel() {
			$uibModalInstance.dismiss('cancel');
		}

		function resetMessage() {
			vm.error = false;
			vm.success = false;
		}
		

	} // end of admin modal controller

})();
