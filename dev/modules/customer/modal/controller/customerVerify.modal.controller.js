(function() {
'use strict';

    angular.module('adminApp.customer')
    .controller('CustomerModalController', CustomerModalController);

    CustomerModalController.$inject = ['$uibModalInstance','customerProfileList', 'customerProfile'];

    function CustomerModalController($uibModalInstance, customerProfileList, customerProfile) {

        var vm = this;

        // properties
        vm.customerProfileList = customerProfileList; 
        vm.kycData = '';
        vm.customerProfile = customerProfile;

        // removing customer assigned profile from customer profile list
        angular.forEach(vm.customerProfileList, function(value, key){
            if(value.name == vm.customerProfile.name) {
                vm.customerProfileList.splice(key, 1);
                return;
            }
        });

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
