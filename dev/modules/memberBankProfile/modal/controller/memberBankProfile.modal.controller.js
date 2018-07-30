(function() {
'use strict';

	angular.module('adminApp.memberBankProfile')
	.controller('MemberBankProfileModalController', MemberBankProfileModalController);

	MemberBankProfileModalController.$inject = ['$uibModalInstance', 'profile', 'showBasicDetails'];

	function MemberBankProfileModalController($uibModalInstance, profile, showBasicDetails) {
	    var vm = this;

	    // properties
		vm.profile = profile;
		vm.profileData= angular.copy(vm.profile);
		vm.showBasicDetails = showBasicDetails;

		if(vm.profileData.modifiedBy == undefined ){
			vm.profileData.modifiedBy = {};
			vm.profileData.modifiedBy.name = "N/A";
		}

		if(vm.profileData.modifiedDate == undefined || vm.profileData.modifiedDate == null){
			vm.profileData.modifiedDate = "N/A";
		}

		// modal methods
		vm.ok = ok;
		vm.cancel = cancel;

		function ok() {
			$uibModalInstance.close(vm.profile);
		}

		function cancel() {
			$uibModalInstance.dismiss('cancel');
		};

	} // end of member bank profile modal controller

})();

