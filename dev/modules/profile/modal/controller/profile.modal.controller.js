(function() {
'use strict';

	angular.module('adminApp.profile')
	.controller('ProfileModalController', ProfileModalController);

	ProfileModalController.$inject = ['$uibModalInstance', 'profileDetailsCopy'];

	function ProfileModalController($uibModalInstance, profileDetailsCopy) {
	    var vm = this;

	    // properties
		vm.profileDetails = profileDetailsCopy;

		// methods

		// modal methods
		vm.ok = ok;
		vm.cancel = cancel;

		function ok() {
			vm.profileDetails.adminProfileId = vm.profileDetails.adminProfile.id;
			$uibModalInstance.close(vm.profileDetails);
		}

		function cancel() {
			$uibModalInstance.dismiss('cancel');
		}

		

	} // end of admin modal controller

})();
