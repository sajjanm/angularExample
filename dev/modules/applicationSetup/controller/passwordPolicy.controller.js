(function () {
    'use strict';

    angular
        .module('adminApp.applicationSetup')
        .controller('PasswordController', PasswordController);

    PasswordController.$inject = ['PasswordPolicyService'];    

    function PasswordController(PasswordPolicyService) {
        
        var vm = this;

        // properties
        vm.success = false;
        vm.success_message = '';
        vm.error = false;
        vm.error_message = '';
        vm.loaded = false;
        vm.passwordPolicies = []; // stores the copy of password policies
        vm.copyOfPolicies = []; // used for comparing the values with the old one

        // methods
        vm.getPasswordPolicys = getPasswordPolicys;
        vm.updatePasswordPolicys = updatePasswordPolicys;

        // initilaize methods
        activate();
        function activate(){
            
            getPasswordPolicys();

        } // end of activate function

        // is rootScope logout error message is set
        function getPasswordPolicys() {
            PasswordPolicyService.getPasswordPolicys()
            .then(function(successResponse){
                vm.passwordPolicies = [];
                vm.copyOfPolicies = [];
                var pwdPolicies = successResponse.data;
                angular.forEach(pwdPolicies, function(pwdPolicy){
                    vm.passwordPolicies.push({
                        id : pwdPolicy.id,
                        label : pwdPolicy.label,
                        passwordPolicyValue : pwdPolicy.passwordPolicyValue,
                        passwordRegularExpressionLengthType : pwdPolicy.passwordRegularExpressionLengthType
                    });
                });
                angular.copy(vm.passwordPolicies, vm.copyOfPolicies);
                vm.loaded = true;
            },function(errorResponse){
                // TO DO
            }); 

        } // end of isErrorMessage function

        // SENDS ONLY THE CHANGED VALUES TO THE BACK-END
        function updatePasswordPolicys(){
            if(angular.equals(vm.passwordPolicies, vm.copyOfPolicies)){
                // NO CHANGE
            } else{
                // changed
                PasswordPolicyService.updatePasswordPolicys(vm.passwordPolicies)
                .then(function(successResponse){
                    vm.success = true;
                    vm.success_message = successResponse.data.message;
                    getPasswordPolicys();
                }, function(errorResponse){
                    vm.error = true;
                    vm.error_message = errorResponse.data.message;
                    getPasswordPolicys();
                });
            }

        } // END OF UPDATE PASSWORD POLICYS

        

    } // end of PasswordPolicy controller

})();
