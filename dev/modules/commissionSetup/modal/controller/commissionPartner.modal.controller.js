(function() {
'use strict';

	angular.module('adminApp.commissionSetup')
	.controller('CommissionPartnerModalController', CommissionPartnerModalController);

	CommissionPartnerModalController.$inject = ['$uibModalInstance', 'partner'];

	function CommissionPartnerModalController($uibModalInstance, partner) {
	    var vm = this;

	    // properties
		vm.partner = partner;
		vm.partnerData={};

		vm.partnerData= angular.copy(vm.partner);

        if(vm.partnerData.modifiedBy == undefined ){
            vm.partnerData.modifiedBy = {};
            vm.partnerData.modifiedBy.name = "N/A";
        }

        if(vm.partnerData.createdBy == undefined){
            vm.partnerData.createdBy = {};
            vm.partnerData.createdBy.name = 'N/A';
        }
        if(vm.partnerData.deletedRemarks == undefined || vm.partnerData.deletedRemarks == null){
        	vm.partnerData.deletedRemarks = 'N/A';
        }
        if(vm.partnerData.createdDate == undefined || vm.partnerData.createdDate == null){
        	vm.partnerData.createdDate ='N/A';
        }
        if(vm.partnerData.modifiedDate == undefined || vm.partnerData.modifiedDate == null){
        	vm.partnerData.modifiedDate = 'N/A';
        }

		// modal methods
		vm.ok = ok;
		vm.cancel = cancel;

		function ok() {
			$uibModalInstance.close(vm.partner);
		}

		function cancel() {
			$uibModalInstance.dismiss('cancel');
		};

	} // end of Settlement Bank Profile Modal

})();

