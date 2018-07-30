(function() {
'use strict';

    angular.module('adminApp.customer')
    .controller('UnblockCustomerModalController', UnblockCustomerModalController);

    UnblockCustomerModalController.$inject = ['$uibModalInstance','customerLogin'];

    function UnblockCustomerModalController($uibModalInstance, customerLogin) {

        var vm = this;

        // properties
        vm.customerLogin = customerLogin;

        // modal methods
        vm.cancel = cancel;
        vm.ok = ok;
        
        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        function ok(){
            $uibModalInstance.close(vm.kycData);
        }

} // end of cutomer verifiy controller function 

})();
