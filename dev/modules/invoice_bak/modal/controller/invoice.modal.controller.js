(function() {
'use strict';

	angular.module('adminApp.invoice')
	.controller('AdminModalController', AdminModalController);

	AdminModalController.$inject = ['$uibModalInstance', 'admin', 'profile'];

	function AdminModalController($uibModalInstance, admin, profile) {
	    var vm = this;

	    // properties
		vm.admin = admin;
		vm.deleteModalLoadingScreen = true;
		vm.profile = profile;

		// modal methods
		vm.ok = ok;
		vm.cancel = cancel;

		function ok() {
			vm.deleteModalLoadingScreen = false;
			$uibModalInstance.close(vm.admin);
		}

		function cancel() {
			vm.deleteModalLoadingScreen = false;
			$uibModalInstance.dismiss('cancel');
		}

	} // end of admin modal controller

})();

