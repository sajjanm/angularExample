(function() {
'use strict';

	angular.module('adminApp.customerProfile')
	.controller('CustomerProfileModalController', CustomerProfileModalController);

	CustomerProfileModalController.$inject = ['$uibModalInstance', 'profile'];

	function CustomerProfileModalController($uibModalInstance, profile) {
	    var vm = this;

	    // properties
		vm.profile = profile;

		// modal methods
		vm.ok = ok;
		vm.cancel = cancel;

		function ok() {
			$uibModalInstance.close(vm.profile);
		}

		function cancel() {
			$uibModalInstance.dismiss('cancel');
		};

	} // end of customer profile modal controller

})();

