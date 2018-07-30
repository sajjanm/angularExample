(function () {
    'use strict';

    angular
    .module('adminApp.profile')
    .controller('ProfileDetailController', ProfileDetailController);

    ProfileDetailController.$inject = ['$rootScope', '$scope', '$uibModal', 'ProfileService', '$state', 'ValidationService', 'ListenerService', '$timeout'];    

    function ProfileDetailController($rootScope, $scope, $uibModal, ProfileService, $state, ValidationService, ListenerService, $timeout) {

        var vm = this;
        
        // properties
        vm.error = false;
        vm.success = false;
        vm.error_message = '';
        vm.success_message = '';
        vm.loaded = false;
        vm.profileDetails = {};  // used to store the value related to profile
        vm.profileDetailsCopy = {};
        vm.profilePhotoLocation= '';
        
        vm.changePasswordValues = {};  // the value of changePassword shall be sent with the click action
        vm.confirmPassword = '';    // used to compare with new password

        vm.subNavs = [];
        vm.tempsubNavs = [];
        vm.subNavsLoaded = false;
        
        // methods
        vm.getProfile = getProfile;
        vm.getProfilePhoto = getProfilePhoto;
        vm.getProfileDetail = getProfileDetail;
        vm.uploadPhoto = uploadPhoto;

        vm.loadPasswordPolicy = loadPasswordPolicy;
        vm.validatePasswordPolicy = validatePasswordPolicy;        
        vm.changePassword = changePassword;
        vm.getSubNavs = getSubNavs;
        vm.headerClick = headerClick;

        vm.resetMessages = resetMessages;

        vm.resetForm = resetForm;
        vm.formValidation = formValidation;

        // modal method
        vm.editProfile = editProfile;

        // initilaize methods
        activate();
        function activate(){
            getProfile()
            loadPasswordPolicy();
            getSubNavs();
        }

        // initialize method for profile
        function getProfile(){
            getProfilePhoto();
            getProfileDetail();
        } // end of getProfile function

        // It fetch the profile photo of the current user. this same function is also used by the header.html page
        function getProfilePhoto(){
            ProfileService.getProfilePhoto()
            .then(function(successResponse){
                vm.profilePhotoLocation=successResponse.data.message;
            }, function(errorResponse){

            });
        }

        // fetching the profile details as the page loads 
        function getProfileDetail() {
            ProfileService.getProfileDetail()
            .then(function(successResponse) {
                vm.profileDetails = successResponse.data;
                vm.profileDetailsCopy = angular.copy(vm.profileDetails);
                vm.loaded = true;
            }, function (errorResponse){
                vm.error_message = errorResponse.data.message;
            });
        } // end of get Profile Detail

        // It stores the sub navs while the controller loads it self
        function getSubNavs(){
            var val = ListenerService.userNavigations[0];
            angular.forEach(val, function(todo) {
                vm.subNavs = [];
                angular.forEach(val[0], function(rolesnav){
                    vm.tempsubNavs.push(rolesnav);
                });
                angular.forEach(vm.tempsubNavs[0], function(rolesnav){
                    vm.subNavs.push(rolesnav);
                    vm.flag = true;
                });
                if(vm.flag){
                    $state.go('main_layout.profile.'+vm.subNavs[0].navigation);
                }
                vm.subNavsLoaded = true;
                // $state.go('main_layout.'+vm.subNavs[0].navigation);
            });
        } // end of GetSubNavs function


        $scope.$watch(function(){ return ListenerService.userNavigations }, function(val){
            vm.subNavsLoaded = false;
            vm.subNavs = [];
            vm.flag = false;

            angular.forEach(val[0], function(rolesnav){
                vm.tempsubNavs.push(rolesnav);
            });
            angular.forEach(vm.tempsubNavs[0], function(rolesnav){
                vm.subNavs.push(rolesnav);
                vm.flag = true;
            });
            if(vm.flag){
                $state.go('main_layout.profile.'+vm.subNavs[0].navigation);
            }
            vm.subNavsLoaded = true;

              // Need to clear in $timeout to avoid infinite digest error
            // $timeout(function(){ListenerService.userNavigations = []});
        }, true);

        // function to change the view
        function headerClick(navigation){
            //reset error message
            resetMessages();

            $state.go('main_layout.profile.'+navigation);
        }// end of headerClick() function

        // function to remove all the messages
        function resetMessages() {
            vm.error = false;
            vm.success = false;
            vm.error_message = '';
            vm.success_message = '';
        } // end of resetMessages() function

        // open up the edit profile modal
        function editProfile(){
            var modalInstance = $uibModal.open({
              animation: true,
              ariaLabelledBy: 'modal-title',
              ariaDescribedBy: 'modal-body',
              templateUrl: 'modules/profile/modal/profile.modal.edit.html',
              controller: 'ProfileModalController',
              controllerAs: 'pmCtrl',
              backdrop: false,
              size: 'lg',
              resolve: {
                profileDetailsCopy: function () {
                    return vm.profileDetailsCopy;
                }
            }
            });

            modalInstance.result
            .then(function (updatedProfileData) {

                ProfileService.updateProfile(updatedProfileData, updatedProfileData.id)
                .then(function(successResponse){
                    vm.success_message = successResponse.data.message;
                    vm.success = true;
                    vm.error = false;

                    getProfileDetail();
                    $scope.$emit('updateProfile', { message: 'profile has been updated' });

                }, function(errorResponse){
                    vm.success = false;
                    vm.error = true;
                    if(errorResponse.data.message == null){
                        vm.error_message = "Couldnot update. Sorry something went wrong."
                    }else{
                        vm.error_message = errorResponse.data.message;
                    }
                });
            }, function (dismissResponse) {
            });
        } // end of editProfile function 

        // upload the photos
        function uploadPhoto(){
            var modalInstance = $uibModal.open({
              animation: true,
              ariaLabelledBy: 'modal-title',
              ariaDescribedBy: 'modal-body',
              templateUrl: 'modules/profile/modal/profilePhotoUpload.modal.html',
              controller: 'ProfilePhotoModalController',
              controllerAs: 'ppCtrl',
              size: 'lg',
              backdrop: false
          }
          );

            modalInstance.result
            .then(function (updated_profile) {
                vm.loaded = false;  
                getProfile();

                vm.success = true;
                vm.success_message = 'Upload Successful';
                
                $scope.$emit('uploadedPhoto', { message: 'profile picture had been uploaded' });
            }, function (dismissResponse) {
                // TO DOs
            });
        } // end of uploadPhoto function

        // activates the validation service and it fetch the password policy for once
        function loadPasswordPolicy(){
            ValidationService.getPasswordPolicy()
            .then(function (response) {
                vm.passwordPoliciesTexts = response;
                vm.loaded = true;
            });
        } // end of loadPasswordPolicy function

        // this function is used for password validation
        // it goes inside validation service
        function validatePasswordPolicy(passs){

            ValidationService.getPasswordPolicy()
            .then(function (response) {
                vm.passwordPoliciesTexts = response;
                vm.loaded = true;
            });

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
        } //end of validatePasswordPolicy function

        // sending the changePassword request
        function changePassword(changePasswordForm) {
            resetMessages();

            ProfileService.updatePassword(vm.changePasswordValues)
            .then(function (successResponse) {
                resetForm(changePasswordForm);

                vm.success = true;
                vm.success_message = successResponse.data.message;

            }, function (errorResponse) {
                vm.error = true;
                vm.error_message = errorResponse.data.message;
            });
        } // end of changePassword function

        // reset the form object
        function resetForm(form) {
            form.$setPristine();
            form.$setUntouched();

            vm.changePasswordValues = {
                oldPassword: '',
                newPassword: ''
            };

            vm.confirmPassword = '';

        } // end of resetForm function

        // function to validate the password, confirm password, and password policy
        // return true if need to disable the button
        // return false if no need to disable the button
        function formValidation(form) {
            if(form.$invalid) {
                return true;
            }else {
                if(!vm.pwdValidation.boolean && vm.confirmPassword.length > 0 && vm.confirmPassword === vm.changePasswordValues.newPassword ) {
                    return false;
                }else {
                    return true;
                }
            }

        } // end of formValidation function

    } // end of controller


})();
