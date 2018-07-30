(function() {
	'use strict';

	angular.module('adminApp.adminProfile')
	.controller('AdminProfileController', AdminProfileController);

	AdminProfileController.$inject = ['AdminProfileService', '$uibModal', 'NgTableParams', 'PaginationService', '$state'];

	function AdminProfileController(AdminProfileService, $uibModal, NgTableParams, PaginationService, $state) {

		var vm = this;

		// properties
		vm.profile = {};
		vm.originalProfile = {};
		vm.allProfiles = [];
		vm.loaded = false;

		vm.error = false;
		vm.success = false;
		vm.error_message = '';
		vm.success_message = '';

		vm.allAdminRoles = [];
		vm.originalAllAdminRoles = [];
		vm.roleChecked = false; // flag to check form data and roles changed or not 
		vm.rolesArray = [];
		vm.formData = false; // to render admin form, formData must be true

		vm.validationError = {};
		
		vm.allAdminProfilesPagination = [];
		vm.tableParams = {};
		vm.sno = {}; // s.no in table
		vm.paginationLoaded = false;

		vm.editView = false // flag for rendering edit view

		// methods
		vm.getAllProfiles = getAllProfiles;
		vm.resetForm = resetForm;
		vm.resetError = resetError;
		vm.parentRole = parentRole;
		vm.childRole = childRole;
		vm.isAnyRoleChecked = isAnyRoleChecked;
		vm.createRolesArray = createRolesArray;
		vm.getAllProfileTable = getAllProfileTable;
		vm.cancelUpdate = cancelUpdate;

		vm.clearValidationError = clearValidationError;

		// CRUD methods
		vm.createProfile = createProfile;
		vm.updateProfile = updateProfile;
		vm.deleteProfile = deleteProfile;
		vm.editProfile = editProfile;
		vm.getAllAdminRoles = getAllAdminRoles;

		// modal methods
		vm.detailModal = detailModal;
		vm.deleteModal = deleteModal;

		// initilaize methods
		activate();
		function activate(){
			
			getAllAdminRoles();
			getAllProfileTable();

		} // end of activate function

		// fetch all profiles
		function getAllProfiles() {
			vm.allProfiles = [];

			AdminProfileService.getAllProfiles()
			.then(function(successResponse) {
				var profiles = successResponse.data;

				angular.forEach(profiles, function(profile){
					vm.allProfiles.push(profile);
				});

			}, function(errorResponse) {
				// for error
			});

		} // end of getAllProfiles function

		// fetch all admin profile table
		function getAllProfileTable() {

			vm.allAdminProfilesPagination.length = 0;

			vm.tableParams = new NgTableParams({
            	// initial value for page
            	
                page: 1, // initial page
                count: 10, // number of records in page,
                filter: {
                	"name": ''
                } 
            },
            {
            	counts: [],
            	total: vm.allAdminProfilesPagination.length,
            	getData : function( $defer, params){

            		vm.paginationLoaded = false;

            		var tableParams = {
            			pageNumber: params.page(),
            			pageSize: params.count(),
            			filterFieldParams: [
            			{
            				"fieldKey":"name",
            				"fieldValue": params.filter().name,
            			}
            			]
            		};

            		AdminProfileService.getAllProfileByPagination(tableParams).then(
            			function(successResponse){

            				vm.paginationLoaded = true;

            				vm.sno = PaginationService.getSno(tableParams);
            				vm.allAdminProfilesPagination = successResponse.data.adminProfileDto;

            				params.total(successResponse.data.totalNumberOfRecords);

            				$defer.resolve(vm.allAdminProfilesPagination);
            			},
            			function(errorResponse){

            				vm.paginationLoaded = true;
            				vm.allAdminProfilesPagination.length = 0;
            				$defer.resolve(vm.allAdminProfilesPagination);

            			});
            	}
            });

		} // end of getAllProfileTable function
		
		// reset the profile object
		function resetForm(form) {
			form.$setPristine();
			form.$setUntouched();

			vm.profile = {
				name: "",
				description: ""
			};

			vm.allAdminRoles = vm.originalAllAdminRoles;

		} // end  of reset function

		// reset the error message
		function resetError() {
			vm.error = false;
			vm.success = false;
			vm.validationError = {};
        }// end of resetError function

		// clear the validation message from backend if exist
		function clearValidationError(field) {
			if(angular.isDefined(vm.validationError[field])){
				delete vm.validationError[field];
			}
        } // end of clearValidationError function

		// cancel the edit profile
		function cancelUpdate() {
			vm.editView = false;
			vm.tableParams.reload();

		} // end of cancelUpdate function

		// create array of parent and child roles
		function createRolesArray() {

			//fetch all id and isActive, from parent and child roles
			var adminRoles = angular.copy(vm.allAdminRoles);

			angular.forEach(adminRoles, function(parentRole){

				var parent = {id: parentRole.serviceGroupRoleMapId, isActive: parentRole.isActive};
				vm.rolesArray.push(parent);

				angular.forEach(parentRole.childRoles, function(childRole){

					var child = {id: childRole.serviceGroupRoleMapId, isActive: childRole.isActive};
					vm.rolesArray.push(child);
				});

			});

		} // end of createRolesArray

		// create profile 
		function createProfile(form) {
			resetError();

			vm.formData = false;
			vm.createRolesArray();

			vm.profile["smartCardRoleRequests"] = vm.rolesArray;

			AdminProfileService.createProfile(vm.profile)
			.then(function(successResponse){
				vm.formData = true;
				vm.success = true;
				vm.success_message = successResponse.data.message;
				
				vm.resetForm(form);

			}, function(errorResponse){
				vm.formData = true;
				if(angular.isDefined(errorResponse.data.message)) {
					vm.error = true;
					vm.error_message = errorResponse.data.message;
				}else{
					angular.forEach(errorResponse.data, function(value, key){
						vm.validationError[value.fieldType] = value.message;
					});
				}

			});
			
		} // end of createProfile function

		// fetch the profile object of editing profile
		// render the edit profile view layout
		function editProfile(profileToUpdate) {
			vm.paginationLoaded = false;
			resetError();

			vm.roleChecked = true; // set any role is checked initially

			AdminProfileService.editProfile(profileToUpdate.id)
			.then(function(successResponse) {
				var profile = successResponse.data;

				vm.profile = angular.copy(profile); // set the response profile object to global profile, we will work in this object
				vm.originalProfile = angular.copy(profile);

				vm.allAdminRoles = angular.copy(vm.profile.smartCardParentRoleResponses);

				vm.paginationLoaded = true;
				vm.editView = true; // render the edit view layout
				vm.formData = true;

				// further processing will be done by updateProfile() function

			}, function(errorResponse) {
				// for error
			});

		} // end of editProfile

		// update profile
		function updateProfile(form_object) {
			resetError();
			
			vm.paginationLoaded = false;
			vm.formData = false;
			vm.createRolesArray();

			var profile = {
				id: vm.profile.id,
				name: vm.profile.name,
				description: vm.profile.description,
				smartCardRoleRequests: vm.rolesArray
			};

			AdminProfileService.updateProfile(profile, profile.id)
			.then(function(successResponse){
				vm.editView = false;
				vm.success = true;
				vm.success_message = successResponse.data.message;

				vm.tableParams.reload();
			}, function(errorResponse){

				if(angular.isDefined(errorResponse.data.message)) {
					vm.editView = false;
					vm.error = true;
					vm.error_message = errorResponse.data.message;

					vm.tableParams.reload();
				}else{
					vm.formData = true;
					angular.forEach(errorResponse.data, function(value, key){
						vm.validationError[value.fieldType] = value.message;
					});
				}

			});

		} // end of updateProfile function

		// delete profile
		function deleteProfile(profile, profile_id) {

			AdminProfileService.deleteProfile(profile, profile_id)
			.then(function(successResponse){
				vm.success = true;
				vm.success_message = successResponse.data.message;

				vm.tableParams.$params.page = 1; // set table to initial page
				vm.tableParams.reload();
			}, function(errorResponse){
				vm.error = true;
				vm.error_message = errorResponse.data.message;

				vm.tableParams.reload();
			});

		} // end of deleteProfile function

		// fetch all admin roles
		function getAllAdminRoles() {

			vm.formData = false;
			vm.allAdminRoles = [];

			AdminProfileService.getAdminRoles()
			.then(function(successResponse) {
				var roles = successResponse.data;

				angular.forEach(roles, function(role){
					vm.allAdminRoles.push(role);
				});

				vm.originalAllAdminRoles = angular.copy(vm.allAdminRoles);

				vm.formData = true;

			}, function(errorResponse) {
				// for error
			});

		} // end of getAllAdminRoles function

		// check all child role when parent role is checked and vice-versa
		function parentRole(parentRole) {

			if(parentRole.isActive === true) {
				angular.forEach(parentRole.childRoles, function(role){
					role.isActive = true;
					vm.roleChecked = vm.isAnyRoleChecked();
				});

			} else {
				angular.forEach(parentRole.childRoles, function(role){
					role.isActive = false;
					vm.roleChecked = vm.isAnyRoleChecked();
				});
			}

		} // end of parentRole function

		// uncheck parent role if all child roles are not checked and vice-versa
		function childRole(childRole, parentRole) {

			vm.checkParent = {};
			var child_roles = angular.copy(parentRole.childRoles);

			for(var i = 0; i < child_roles.length; i++) {

				if(child_roles[i].isActive === true) {
					vm.checkParent = true;
					break;
				}
				vm.checkParent = false;
			};

			if(vm.checkParent) {
				parentRole.isActive = true;
				vm.roleChecked = vm.isAnyRoleChecked();
			} else {
				parentRole.isActive = false;
				vm.roleChecked = vm.isAnyRoleChecked();
			}

		}// end of childRole function

		// check if any role is checked
		function isAnyRoleChecked() {

			// if parent is checked then at least one child is checked
			// so, any role is also checked

			if(vm.editView) {
				// when edit view is rendering
				vm.allAdminRoles = angular.copy(vm.profile.smartCardParentRoleResponses);
				var roles = angular.copy(vm.allAdminRoles);

			}else {
				// when create view is rendering
				var roles = angular.copy(vm.allAdminRoles);

			}

			for(var i = 0; i < roles.length; i++) {
				if(roles[i].isActive === true) {
					return true;
				}
			}
			return null;

		} // end of isAnyRoleChecked function

		// render delail modal box of profile
		function detailModal(profile) {

            var showBasicDetails = true; // boolean value to control the name and other basic values of views //used by admin navs as well so

			AdminProfileService.editProfile(profile.id)
			.then(function(successResponse) {
				var profile = successResponse.data;

				var modalInstance = $uibModal.open({
					animation: true,
					ariaLabelledBy: 'modal-title',
					ariaDescribedBy: 'modal-body',
					templateUrl: 'modules/adminProfile/modal/adminProfile.modal.detailView.html',
					controller: 'AdminProfileModalController',
					controllerAs: 'apmCtrl',
					backdrop: false,
					size: 'lg',
					resolve: {
						profile: function () {
							return profile;
						},
                        showBasicDetails: function () {
                            return showBasicDetails;
                        }
					}
				});

				modalInstance.result
				.then(function (updated_profile) {
			  		// nothing to do
			  	}, function (dismissResponse) {
			    	// nothing to do
			    });

			}, function(errorResponse) {
				// for error
			});

		} // end of detailModal function 

		// render the delete modal box of deleting profile
		function deleteModal(profileToDelete) {

			vm.error = false;
			vm.success = false;

			var modalInstance = $uibModal.open({
				animation: true,
				ariaLabelledBy: 'modal-title',
				ariaDescribedBy: 'modal-body',
				templateUrl: 'modules/adminProfile/modal/adminProfile.modal.delete.html',
				controller: 'AdminProfileModalController',
				controllerAs: 'apmCtrl',
				backdrop: false,
				size: 'lg',
				resolve: {
					profile: function () {
						return profileToDelete;
					},
					showBasicDetails: function () {
						return null;
					}
				}
			});

			modalInstance.result
			.then(function (deleted_profile) {
				var profile = {
					name: deleted_profile.name,
					description: deleted_profile.description,
					deletedReason: deleted_profile.deletedRemarks
				};

				vm.paginationLoaded = false;
		    	// delete profile
		    	vm.deleteProfile(profile, deleted_profile.id);

		    }, function (dismissResponse) {
		    	// nothing to do
		    });

		} // end of deleteModal function    

    } // end of admin profile controller

})();

