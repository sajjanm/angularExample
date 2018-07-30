(function () {
    'use strict';

    angular.module('adminApp.changePassword')
        .controller('ChangePasswordController', ChangePasswordController);

    ChangePasswordController.$inject = ['$rootScope', '$localStorage', 'ChangePasswordService', '$uibModal', '$state', 'ValidationService'];

    function ChangePasswordController($rootScope, $localStorage, ChangePasswordService, $uibModal, $state, ValidationService) {

        /* 
        ** THIS FUCNTION IS LOADED WHEN THE PASSWORD_POLICY CHANGED DATE IS NOT SAME AS IT IS IN 
        ** CUSTOMER'S ENTITY. IT COMES WITH A TEMPORARY TOKEN !!!            
        */

        var vm = this;

        // properties
        vm.error = false;
        vm.success = false;
        vm.error_message = '';
        vm.success_message = '';
        vm.loaded = false;

        vm.changePasswordValues = {};  // the value of changePassword shall be sent with the click action
        vm.confirmPassword = '';    // used to compare with new password

        vm.pwdValidation = {
            boolean : false,
            message : ''
        };

        // methods
        vm.changePassword = changePassword;

        // it fetches the password policies. 
        vm.loadPasswordPolicy = loadPasswordPolicy;
        vm.validatePasswordPolicy = validatePasswordPolicy;       
        

        // initilaize methods
        activate();
        function activate() {
            loadPasswordPolicy();
        }

        // ACTIVATES THE VALIDATION SERVICE AND IT FETCH THE PASSWORD POLICY FOR ONCE
        function loadPasswordPolicy(){

            ValidationService.getPasswordPolicy()
            .then(function (response) {
                vm.passwordPoliciesTexts = response;
                vm.loaded = true;
            });

        }   // END OF LOAD PASSWORD POLICY FUNCTION

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
        
        } // END OF VALIDATE PASSWORD FUNCTION

        // sending the changePassword request
        function changePassword() {

            ChangePasswordService.updatePassword(vm.changePasswordValues)
                    .then(function (successResponse) {
                        vm.success = true;
                        vm.error = false;
                        vm.success_message = successResponse.data.message;
                        vm.changePasswordValues = {
                            oldPassword: "",
                            newPassword: ""
                        };
                        vm.confirmPassword = '';
                        $rootScope.changePassword = false;
                        $state.go('main_layout.dashboard');
                        return;
                    }, function (errorResponse) {
                        vm.error = true;
                        vm.success = false;
                        vm.error_message = errorResponse.data.message;
                    });

        } // end of changePassword function

        // flag for error and success
        function loadDefault(){
            vm.error = false;
            vm.success = false;
        } // end of loadDefault function


    } // end of controller

})();
