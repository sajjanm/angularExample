(function() {
'use strict';

	angular.module('adminApp.memberBank')
	.controller('MemberBankModalController', MemberBankModalController);

	MemberBankModalController.$inject = ['$uibModalInstance', 'MemberBankProfileService', 'memberBank', 'profile'];

	function MemberBankModalController($uibModalInstance, MemberBankProfileService, memberBank, profile) {
	    var vm = this;

	    // properties
		vm.memberBank = memberBank;
		vm.profile = profile;

		// modal methods
		vm.ok = ok;
		vm.cancel = cancel;

		function ok() {
			$uibModalInstance.close(vm.memberBank);
		}

		function cancel() {
			$uibModalInstance.dismiss('cancel');
		}

	} // end of Member Bank Modal Controller

})();

