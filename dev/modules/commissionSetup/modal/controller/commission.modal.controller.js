(function() {
'use strict';

	angular.module('adminApp.commissionSetup')
	.controller('CommissionModalController', CommissionModalController);

	CommissionModalController.$inject = ['$uibModalInstance', 'commission'];

	function CommissionModalController($uibModalInstance, commission) {
	    var vm = this;

	    // properties
		vm.commission = commission;
		vm.commissionData={};

		vm.commissionData= angular.copy(vm.commission);

        if(vm.commissionData.modifiedBy == undefined ){
            vm.commissionData.modifiedBy = {};
            vm.commissionData.modifiedBy.name = "N/A";
        }

        if(vm.commissionData.createdBy == undefined){
            vm.commissionData.createdBy = {};
            vm.commissionData.createdBy.name = 'N/A';
        }
        if(vm.commissionData.deletedRemarks == undefined || vm.commissionData.deletedRemarks == null){
        	vm.commissionData.deletedRemarks = 'N/A';
        }
        if(vm.commissionData.createdDate == undefined || vm.commissionData.createdDate == null){
        	vm.commissionData.createdDate ='N/A';
        }
        if(vm.commissionData.modifiedDate == undefined || vm.commissionData.modifiedDate == null){
        	vm.commissionData.modifiedDate = 'N/A';
        }

		// modal methods
		vm.ok = ok;
		vm.cancel = cancel;

		function ok() {
			$uibModalInstance.close(vm.commission);
		}

		function cancel() {
			$uibModalInstance.dismiss('cancel');
		};

	} // end of Settlement Bank Profile Modal

})();

