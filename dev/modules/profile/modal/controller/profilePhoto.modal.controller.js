(function() {
'use strict';

	angular.module('adminApp.profile')
	.controller('ProfilePhotoModalController', ProfilePhotoModalController);

	ProfilePhotoModalController.$inject = ['$uibModalInstance', 'Upload', 'ProfileService'];

	function ProfilePhotoModalController($uibModalInstance, Upload, ProfileService) {

	    var vm = this;

	    // properties
	    vm.photo = {};
	    vm.close = false;
	    vm.error = false;
        vm.success = false;
        vm.error_message = '';
        vm.success_message = '';
        vm.spin = false;
        vm.profilePhotoLocation = '';

		// methods
		vm.uploadPhoto = uploadPhoto;
		vm.getProfilePhoto = getProfilePhoto;

		// modal methods
		vm.ok = ok;
		vm.cancel = cancel;
		
		// initilaize methods
        activate();
        function activate() {
            getProfilePhoto();
        }

		getProfilePhoto();

		function ok() {
			$uibModalInstance.close();
		}

		function cancel() {
			$uibModalInstance.dismiss('cancel');
		}

		function uploadPhoto(){
			vm.spin = true;

			var file= Upload.dataUrltoBlob(vm.photo.croppedDataUrl, vm.photo.picFile.name);

			var fileData = new FormData();
                fileData.append('photo', file);

            ProfileService.uploadProfilePhoto(fileData)
            .then(function(successResponse){
                vm.success_message = successResponse.data;
                vm.success = true;
                $uibModalInstance.close("true");
            }, function(errorResponse){
            	vm.spin = true;
                vm.error_message = errorResponse.data;
                vm.error = true;
            });

		}

		// It fetch the profile photo of the current user. this same function is also used by the header.html page
        function getProfilePhoto() {

            ProfileService.getProfilePhoto()
                    .then(function (successResponse) {
                        vm.profilePhotoLocation = successResponse.data.message;
                    }, function (errorResponse) {

                    });
        }// END OF FET PROFILE PHOTO FUNCTION
		

	} // end of admin modal controller

})();
