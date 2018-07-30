(function() {
'use strict';

	angular.module('adminApp.commissionSetup')
	.controller('CommissionSlabModalController', CommissionSlabModalController);

	CommissionSlabModalController.$inject = ['$uibModalInstance', 'slab'];

	function CommissionSlabModalController($uibModalInstance, slab) {
	    var vm = this;

	    // properties
		vm.slab = slab;
		vm.slabData={};

		vm.slabData= angular.copy(vm.slab);

        if(vm.slabData.modifiedBy == undefined ){
            vm.slabData.modifiedBy = {};
            vm.slabData.modifiedBy.name = "N/A";
        }

        if(vm.slabData.createdBy == undefined){
            vm.slabData.createdBy = {};
            vm.slabData.createdBy.name = 'N/A';
        }
        if(vm.slabData.deletedRemarks == undefined || vm.slabData.deletedRemarks == null){
        	vm.slabData.deletedRemarks = 'N/A';
        }
        if(vm.slabData.createdDate == undefined || vm.slabData.createdDate == null){
        	vm.slabData.createdDate ='N/A';
        }
        if(vm.slabData.modifiedDate == undefined || vm.slabData.modifiedDate == null){
        	vm.slabData.modifiedDate = 'N/A';
        }

		// modal methods
		vm.ok = ok;
		vm.cancel = cancel;

		function ok() {
			$uibModalInstance.close(vm.slab);
		}

		function cancel() {
			$uibModalInstance.dismiss('cancel');
		};

	} // end of Settlement Bank Profile Modal

})();

