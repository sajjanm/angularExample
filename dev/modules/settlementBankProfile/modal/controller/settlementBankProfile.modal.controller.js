(function() {
'use strict';

	angular.module('adminApp.settlementBankProfile')
	.controller('SettlementBankProfileModalController', SettlementBankProfileModalController);

	SettlementBankProfileModalController.$inject = ['$uibModalInstance', 'profile', 'showBasicDetails'];

	function SettlementBankProfileModalController($uibModalInstance, profile, showBasicDetails) {
	    var vm = this;

	    // properties
		vm.profile = profile;
		vm.showBasicDetails = showBasicDetails;
		vm.profileData={};

		vm.profileData= angular.copy(vm.profile);

        if(vm.profileData.modifiedBy == undefined ){
            vm.profileData.modifiedBy = {};
            vm.profileData.modifiedBy.name = "N/A";
        }

        if(vm.profileData.createdBy == undefined){
            vm.profileData.createdBy = {};
            vm.profileData.createdBy.name = 'N/A';
        }
        if(vm.profileData.deletedRemarks == undefined || vm.profileData.deletedRemarks == null){
        	vm.profileData.deletedRemarks = 'N/A';
        }
        if(vm.profileData.createdDate == undefined || vm.profileData.createdDate == null){
        	vm.profileData.createdDate ='N/A';
        }
        if(vm.profileData.modifiedDate == undefined || vm.profileData.modifiedDate == null){
        	vm.profileData.modifiedDate = 'N/A';
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

	} // end of Settlement Bank Profile Modal

})();

