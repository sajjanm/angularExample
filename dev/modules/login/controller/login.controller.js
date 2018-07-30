(function () {
    'use strict';

    angular
    .module('adminApp.login')
    .controller('LoginController', LoginController);

    LoginController.$inject = ['$rootScope', '$state', '$localStorage', 'LoginService', '$uibModal'];    

    function LoginController($rootScope, $state, $localStorage, LoginService, $uibModal) {

        var vm = this;

        // properties
        vm.user = {};
        vm.error = false;
        vm.error_message = '';
        vm.loaded = {};

        // methods
        vm.login = login;
        vm.isErrorMessage = isErrorMessage;

        // modal methods
        vm.forgotYourPassword = forgotYourPassword;

        // initilaize methods
        activate();
        function activate(){

            isErrorMessage();

        } // end of activate function

        // is rootScope logout error message is set
        function isErrorMessage() {
            if(!angular.isUndefined($rootScope.logout_error)) {

                vm.error_message = $rootScope.logout_error;
                vm.error = true;

                // reset the rootScope logout error message
                delete $rootScope.logout_error;
            }    

        } // end of isErrorMessage function

        // authenticate login user
        function login(form) {
            isErrorMessage();
            vm.error_message = '';
            vm.error = false;
            if(vm.user.username === '' && vm.user.password === '') {

            }else {
                vm.loaded = false;

                LoginService.login(vm.user)
                .then(function(successResponse){

                    // if changePassword is set, then render changePassword view
                    if(successResponse.data.changePassword==true){
                        $localStorage.admin.changePassword =true;
                        $rootScope.changePassword = true;
                        $state.go('change_password');
                        $localStorage.admin = {};
                        return;
                    }

                    vm.loaded = true;
                    $state.go('main_layout.dashboard');


                }, function(errorResponse){
                    vm.error = true;
                    if(errorResponse.data === null) {
                        vm.error_message = 'Connection failed, please try again later';
                    }else {
                        vm.error_message = errorResponse.data.message;
                    }
                    vm.loaded = true;
                });
            }      

        } // end of loign function

        // modal for forgotYourPassword
        function forgotYourPassword() {

            var modalInstance = $uibModal.open({
              animation: true,
              ariaLabelledBy: 'modal-title',
              ariaDescribedBy: 'modal-body',
              templateUrl: 'modules/login/modal/forgotYourPassword.modal.html',
              controller: 'ForgotYourPasswordModalController',
              controllerAs: 'fypCtrl',
              windowClass: 'app-modal-window-custom',
              // size: 'lg',
              backdrop: false,
          });

            modalInstance.result
            .then(function (delete_admin) {
                // nothing to do
                
            }, function (dismissResponse) {
                // nothing to do
            });

        } // end of forgotYourPassword function

    } // end of login controller

})();
