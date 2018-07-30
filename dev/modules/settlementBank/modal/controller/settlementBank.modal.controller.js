(function() {
'use strict';

	angular.module('adminApp.settlementBank')
	.controller('SettlementBankModalController', SettlementBankModalController);

	SettlementBankModalController.$inject = ['$uibModalInstance', 'SettlementBankProfileService', 'settlementBank', 'ValidationService', 'profile'];

	function SettlementBankModalController($uibModalInstance, SettlementBankProfileService, settlementBank, ValidationService, profile) {
	    var vm = this;
	    vm.pwdValidation = {
            boolean : false,
            message : ''
        };

	    // properties
		vm.settlementBank = settlementBank;
		vm.profile = profile;

		// methods
		vm.getAllSettlementBankProfiles = getAllSettlementBankProfiles;
		vm.validatePasswordPolicy = validatePasswordPolicy;

		// modal methods
		vm.ok = ok;
		vm.cancel = cancel;

		function ok() {
			$uibModalInstance.close(vm.settlementBank);
		}

		function cancel() {
			$uibModalInstance.dismiss('cancel');
		}

		// fetch all profiles
		function getAllSettlementBankProfiles() {
			vm.formData = false;
			vm.allSettlementBankProfiles = [];

			SettlementBankProfileService.getAllProfiles()
			.then(function(successResponse) {
				var profiles = successResponse.data;

				angular.forEach(profiles, function(profile){
					vm.allSettlementBankProfiles.push(profile);
				});
				vm.formData = true;

			}, function(errorResponse) {
				// for error
			});

		} // end of getAllSettlementBankProfiles function
		
        // FRONT END USE THIS FUNCTION FOR PASSWORD VALIDATION:: IT GOES INSIDE VALIDATION SERVICE
        function validatePasswordPolicy(passs){
        	vm.pwdValidation = {
		        boolean : false,
		        message : ''
		    };
		    if(passs ==undefined){
		        vm.pwdValidation = {
		            boolean : true,
		            message : 'length is 0'
		        };
		    }else{
		        vm.pwdValidation = ValidationService.validatePassword(passs);
		    }
        }   // END OF VALIDATE PASSWORD POLICY

	} // end of Settlement Bank Modal Controller

})();

