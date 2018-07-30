(function() {
'use strict';

	angular.module('adminApp.settlementBankProfile')
	.controller('SettlementBankProfileController', SettlementBankProfileController);

	SettlementBankProfileController.$inject = ['SettlementBankProfileService', '$uibModal', 'NgTableParams', 'PaginationService'];

	function SettlementBankProfileController(SettlementBankProfileService, $uibModal, NgTableParams, PaginationService) {

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
		vm.allSettlementBankRoles = [];
		vm.originalAllSettlementBankRoles = [];
		vm.roleChecked = {};
		vm.rolesArray = [];
		vm.formData = false; // to render settlement form, formData must be true

		vm.allSettlementBankProfilesPagination = [];
		vm.tableParams = {};
		vm.sno = {};
		vm.paginationLoaded = false;

		vm.validationError = {};

		vm.editView = false;

		// methods
		vm.getAllProfiles = getAllProfiles;
		vm.resetForm = resetForm;
		vm.parentRole = parentRole;
		vm.childRole = childRole;
		vm.isAnyRoleChecked = isAnyRoleChecked;
		vm.createRolesArray = createRolesArray;
		vm.getAllProfileTable = getAllProfileTable;
		vm.cancelUpdate = cancelUpdate;

		vm.resetError = resetError;
		vm.clearValidationError = clearValidationError;

		// CRUD methods
		vm.createProfile = createProfile;
		vm.updateProfile = updateProfile;
		vm.deleteProfile = deleteProfile;

		// modal methods
		vm.detailModal = detailModal;
		vm.deleteModal = deleteModal;
		vm.getSettlementBankRoles = getSettlementBankRoles;
		vm.editProfile = editProfile;

		// initilaize methods
		activate();
		function activate(){
			
			getSettlementBankRoles();
			getAllProfileTable();

		} // end of activate function

		// fetch all profiles
		function getAllProfiles() {
			vm.allProfiles = [];

			SettlementBankProfileService.getAllProfiles()
			.then(function(successResponse) {
				var profiles = successResponse.data;

				angular.forEach(profiles, function(profile){
					vm.allProfiles.push(profile);
				});

			}, function(errorResponse) {
				// for error
			});

		} // end of getAllProfiles function

		// fetch all settlement bank profile table
		function getAllProfileTable() {

			vm.allSettlementBankProfilesPagination.length = 0;

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
                total: vm.allSettlementBankProfilesPagination.length,
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

                    SettlementBankProfileService.getAllProfileByPagination(tableParams).then(
                        function(successResponse){

                            vm.paginationLoaded = true;
                            
                       		vm.sno = PaginationService.getSno(tableParams);
                            vm.allSettlementBankProfilesPagination = successResponse.data.settlementBankProfileDto;

                            params.total(successResponse.data.totalNumberOfRecords);

                            $defer.resolve(vm.allSettlementBankProfilesPagination);
                        },
                        function(errorResponse){

                            vm.paginationLoaded = true;
                            vm.allSettlementBankProfilesPagination.length = 0;
                            $defer.resolve(vm.allSettlementBankProfilesPagination);

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

			vm.allSettlementBankRoles = vm.originalAllSettlementBankRoles;

		} // end  of reset function

		// cancel the edit profile
        function cancelUpdate() {
            vm.editView = false;
            vm.tableParams.reload();
        } // end of cancelUpdate function

        // create array of parent and child roles
		function createRolesArray() {

			//fetch all id and isActive, from parent and child roles
			var adminRoles = angular.copy(vm.allSettlementBankRoles);

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

			vm.loaded = false;
			createRolesArray();

			vm.profile["smartCardRoleRequests"] = vm.rolesArray;

			SettlementBankProfileService.createProfile(vm.profile)
			.then(function(successResponse){
				vm.formData = true;

				vm.success = true;
				vm.success_message = successResponse.data.message;
				vm.loaded = true;
				vm.resetForm(form);

			}, function(errorResponse){
				vm.formData = true;

				if(angular.isDefined(errorResponse.data.message)) {
				    vm.error = true;
				    vm.error_message = errorResponse.data.message;

				    vm.tableParams.reload(); // add this code inside edit function only
				}else{
				    angular.forEach(errorResponse.data, function(value, key){
				        vm.validationError[value.fieldType] = value.message;
				    });
				}
			});
			
		} // end of createProfile function

		// fetch the profile object of editing profile
		function editProfile(profileToUpdate) {
            resetError();

			vm.paginationLoaded = false;
            
            vm.error = false;
            vm.success = false;

            vm.roleChecked = true; // set any role is checked initially

			SettlementBankProfileService.editProfile(profileToUpdate.id)
			.then(function(successResponse) {
				var profile = successResponse.data;

                vm.profile = angular.copy(profile); // set the response profile object to global profile, we will work in this object
                vm.originalProfile = angular.copy(profile);

                vm.allSettlementBankRoles = angular.copy(vm.profile.smartCardParentRoleResponses);

                vm.formData = true;
                vm.paginationLoaded = true;
                vm.editView = true; // render the edit view layout

                // further processing will be done by updateProfile() function

			}, function(errorResponse) {
				if(angular.isDefined(errorResponse.data.message)) {
				    vm.error = true;
				    vm.error_message = errorResponse.data.message;

				    vm.tableParams.reload(); // add this code inside edit function only
				}else{
				    angular.forEach(errorResponse.data, function(value, key){
				        vm.validationError[value.fieldType] = value.message;
				    });
				}
			});

		} // end of editProfile

		// update profile
		function updateProfile(form_object) {
            resetError();
			vm.formData = false;

            vm.paginationLoaded = false;

            vm.createRolesArray();

			var profile = {
				id: vm.profile.id,
                name: vm.profile.name,
                description: vm.profile.description,
                smartCardRoleRequests: vm.rolesArray
            };

			SettlementBankProfileService.updateProfile(profile, profile.id)
			.then(function(successResponse){
				vm.editView = false;
				
				vm.formData = false;

				vm.success = true;
				vm.success_message = successResponse.data.message;
				vm.tableParams.reload();
			}, function(errorResponse){
				
				if(angular.isDefined(errorResponse.data.message)) {
					vm.editView = false;
					vm.error = true;
				    vm.error_message = errorResponse.data.message;

				    vm.tableParams.reload(); // add this code inside edit function only
				}else{
					vm.formData = true;
				    angular.forEach(errorResponse.data, function(value, key){
				        vm.validationError[value.fieldType] = value.message;
				    });
				}
				vm.tableParams.reload();
			});

		} // end of updateProfile function

		// delete profile
		function deleteProfile(profile, profile_id) {

			SettlementBankProfileService.deleteProfile(profile, profile_id)
			.then(function(successResponse){
				vm.success = true;
				vm.success_message = successResponse.data.message;
				vm.tableParams.reload();
			}, function(errorResponse){
				vm.error = true;
				vm.error_message = errorResponse.data.message;
				vm.tableParams.reload();
			});

		} // end of deleteProfile function

		// fetch all admin roles
		function getSettlementBankRoles() {

			vm.formData = false;
			vm.allSettlementBankRoles = [];

			SettlementBankProfileService.getSettlementBankRoles()
			.then(function(successResponse) {
				var roles = successResponse.data;

				angular.forEach(roles, function(role){
					vm.allSettlementBankRoles.push(role);
				});

				vm.originalAllSettlementBankRoles = angular.copy(vm.allSettlementBankRoles);

				vm.formData = true;

			}, function(errorResponse) {
				// for error
			});

		} // end of getSettlementBankRoles function

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
                vm.allSettlementBankRoles = angular.copy(vm.profile.smartCardParentRoleResponses);
                var roles = angular.copy(vm.allSettlementBankRoles);

            }else {
                // when create view is rendering
                var roles = angular.copy(vm.allSettlementBankRoles);

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

            var showBasicDetails = true; // boolean value to control the name and other basic values of views //used by settlement bank navs as well so

			SettlementBankProfileService.editProfile(profile.id)
			.then(function(successResponse) {
				var profile = successResponse.data;

				var modalInstance = $uibModal.open({
			      animation: true,
			      ariaLabelledBy: 'modal-title',
			      ariaDescribedBy: 'modal-body',
			      templateUrl: 'modules/settlementBankProfile/modal/settlementBankProfile.modal.detailView.html',
			      controller: 'SettlementBankProfileModalController',
			      controllerAs: 'spmCtrl',
			      size: 'lg',
			      backdrop: false,
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

			});

		} // end of detailModal function 

		// render the delete modal box of deleting profile
		function deleteModal(profileToDelete) {

			var modalInstance = $uibModal.open({
		      animation: true,
		      ariaLabelledBy: 'modal-title',
		      ariaDescribedBy: 'modal-body',
		      templateUrl: 'modules/settlementBankProfile/modal/settlementBankProfile.modal.delete.html',
		      controller: 'SettlementBankProfileModalController',
		      controllerAs: 'spmCtrl',
		      size: 'lg',
		      backdrop: false,
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
	    
    } // end of Settlement Bank Controller

})();

