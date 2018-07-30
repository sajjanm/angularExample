(function() {
	'use strict';

	angular.module('adminApp.settlementBank')
	.controller('SettlementBankController', SettlementBankController);

	SettlementBankController.$inject = ['SettlementBankService', 'SettlementBankProfileService', '$uibModal', 'NgTableParams', 'PaginationService', 'ValidationService'];

	function SettlementBankController(SettlementBankService, SettlementBankProfileService, $uibModal, NgTableParams, PaginationService, ValidationService) {

		var vm = this;

		// properties
		vm.settlementBank = {};
		vm.originalSettlementBank = {};
		vm.allSettlementBanks = [];
		vm.allSettlementBankProfiles = [];
		vm.confirm_password = ''; // for validating password
		vm.loaded = false;
		vm.error = false;
		vm.success = false;
		vm.error_message = '';
		vm.success_message = '';
		vm.formData = false; // to render settlementBank form, formData must be true
		vm.pwdValidation = {
			boolean : false,
			message : ''
		};
		vm.pwdAPIValidation = {
			boolean : false,
			message : ''
		};

		vm.allSettlementBankPagination = [];
		vm.tableParams = {};
		vm.sno = {};
		vm.paginationLoaded = false;
		
		vm.validationError = {};

		vm.editView = false;

		// methods
		vm.resetForm = resetForm;
		vm.getAllSettlementBanks = getAllSettlementBanks;
		vm.getAllSettlementBankProfiles = getAllSettlementBankProfiles;
		vm.getAllSettlementBankTable = getAllSettlementBankTable;
		vm.cancelUpdate = cancelUpdate;
		vm.loadPasswordPolicy = loadPasswordPolicy;
		vm.validatePasswordPolicy = validatePasswordPolicy;
		vm.validateAPIPasswordPolicy = validateAPIPasswordPolicy;
		vm.blockUnblockBank = blockUnblockBank;

		vm.resetError = resetError;
		vm.clearValidationError = clearValidationError;
		vm.formValidation = formValidation;

		// CRUD methods
		vm.createSettlementBank = createSettlementBank;
		vm.updateSettlementBank = updateSettlementBank;
		vm.deleteSettlementBank = deleteSettlementBank;
		vm.editSettlementBank = editSettlementBank;

		// modal methods
		vm.detailModal = detailModal;
		vm.deleteModal = deleteModal;
		vm.profileDetailModal = profileDetailModal;

		// initilaize methods
		activate();
		function activate(){
			
			getAllSettlementBankTable();
			getAllSettlementBankProfiles();
			loadPasswordPolicy();

		} // end of activate function
		
		// fetch all settlement banks
		function getAllSettlementBanks() {
			vm.allSettlementBanks = [];

			SettlementBankService.getAllSettlementBanks()
			.then(function(successResponse) {
				var banks = successResponse.data;

				angular.forEach(banks, function(bank){
					vm.allSettlementBanks.push(bank);
				});

			}, function(errorResponse) {
				// for error
			});

		} // end of getAllSettlementBanks function

		// fetch all settlement bank table
		function getAllSettlementBankTable() {

			vm.allSettlementBankPagination.length = 0;

			vm.tableParams = new NgTableParams({
            	// initial value for page
            	
                page: 1, // initial page
                count: 10, // number of records in page,
                filter: {
                	"name": '',
                	"username": '',
                	"profile": ''
                } 
            },
            {
            	counts: [],
            	total: vm.allSettlementBankPagination.length,
            	getData : function( $defer, params){

            		vm.paginationLoaded = false;

            		var tableParams = {
            			pageNumber: params.page(),
            			pageSize: params.count(),
            			filterFieldParams: [
            			{
            				"fieldKey":"name",
            				"fieldValue": params.filter().name,
            			},
            			{
            				"fieldKey":"username",
            				"fieldValue": params.filter().username,
            			},
            			{
            				"fieldKey":"settlementBankProfile.name",
            				"fieldValue": angular.isUndefined(params.filter().profile) ? '' : params.filter().profile,
            			}
            			]
            		};

            		SettlementBankService.getAllSettlementBanksByPagination(tableParams).then(
            			function(successResponse){

            				vm.paginationLoaded = true;

            				vm.sno = PaginationService.getSno(tableParams);
            				vm.allSettlementBankPagination = successResponse.data.settlementBankDto;

            				params.total(successResponse.data.totalNumberOfRecords);

            				$defer.resolve(vm.allSettlementBankPagination);
            			},
            			function(errorResponse){

            				vm.paginationLoaded = true;
            				vm.allSettlementBankPagination.length = 0;
            				$defer.resolve(vm.allSettlementBankPagination);

            			});
            	}
            });

		} // end of getAllAdmins function

		// fetch all profiles
		function getAllSettlementBankProfiles() {
			vm.formData = false;
			vm.allSettlementBankProfiles = [];

			SettlementBankProfileService.getAllProfiles()
			.then(function(successResponse) {
				var profiles = successResponse.data;

				angular.forEach(profiles, function(profile){
					vm.allSettlementBankProfiles.push(profile);
				});
				vm.formData = true;

			}, function(errorResponse) {
				// for error
			});

		} // end of getAllSettlementBankProfiles

		// ACTIVATES THE VALIDATION SERVICE AND IT FETCH THE PASSWORD POLICY FOR ONCE
		function loadPasswordPolicy(){
			vm.formData = ValidationService.getPasswordPolicy();
        } // END OF load Password Policy function

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
        }   // END OF VALIDATE PASSWORD POLICY

        // FRONT END USE THIS FUNCTION FOR PASSWORD VALIDATION:: IT GOES INSIDE VALIDATION SERVICE
        function validateAPIPasswordPolicy(passs){
        	vm.pwdAPIValidation = {
        		boolean : false,
        		message : ''
        	};
        	vm.pwdAPIValidation = ValidationService.validatePassword(passs);
        }   // END OF VALIDATE PASSWORD POLICY

		// reset the admin object
		function resetForm(form) {
			form.$setPristine();
			form.$setUntouched();

			vm.settlementBank = {
				name: '',
				description: '',
				email: '',
				swiftCode: '',
				accountNo: '',
				username: '',
				password: '',
				isActive: '',
				deletedReason: '',
				serviceProviderAccount: '',
				profileId: ''
			};

			vm.confirm_password = '';

		} // end of resetForm function

		// reset the error message
		function resetError() {
			vm.error = false;
			vm.success = false;
			vm.validationError = {};
		}// end of resetError function

		// cancel the edit profile
		function cancelUpdate() {

			vm.editView = false;
			vm.tableParams.reload();

        } // end of cancelUpdate function

		// create settlement bank
		function createSettlementBank(form) {
			resetError();
			vm.formData = false;
			SettlementBankService.createSettlementBank(vm.settlementBank)
			.then(function(successResponse){
				vm.success = true;
				vm.success_message = successResponse.data.message;
				vm.resetForm(form);
				vm.formData = true;
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

		} // end of createSettlementBank function

		// render edit settlement bank view layout
		function editSettlementBank(bank) {
			resetError();
			vm.paginationLoaded = false;
			vm.formData = false;

			SettlementBankService.editSettlementBank(bank.id)
			.then(function(successResponse) {
				var bank = successResponse.data;

                vm.settlementBank = angular.copy(bank); // set the response bank object to global bank, we will work in this object
                vm.originalSettlementBank = angular.copy(bank);
                vm.formData = true;

                vm.paginationLoaded = true;
                vm.editView = true; // render the edit view layout

                // further processing will be done by updateSettlementBank() function

            }, function(errorResponse) {
            	
            	if(angular.isDefined(errorResponse.data.message)) {
            		vm.error = true;
            		vm.error_message = errorResponse.data.message;

				    vm.tableParams.reload(); // add this code inside edit function only
				}else{
					vm.formData = true;
					angular.forEach(errorResponse.data, function(value, key){
						vm.validationError[value.fieldType] = value.message;
					});
				} 
			});

        } // end of editSettlementBank function

		// update settlement bank
		function updateSettlementBank(form_object) {
			resetError();
			vm.formData = false;


			// vm.editView = false;
			vm.paginationLoaded = false;

			var bank = {
				id: vm.settlementBank.id,
				name: vm.settlementBank.name,
				description: vm.settlementBank.description,
				email: vm.settlementBank.email,
				swiftCode: vm.settlementBank.swiftCode,
				accountNo: vm.settlementBank.accountNo,
				username: vm.settlementBank.username,
				serviceProviderAccount: vm.settlementBank.serviceProviderAccount,
				profileId: vm.settlementBank.settlementBankProfileDto.id,
				apiUserName: vm.settlementBank.apiUserName,
				apiPassword: vm.settlementBank.apiPassword,
				apiUrl: vm.settlementBank.apiUrl,
				isActive: vm.settlementBank.isActive
			};

			SettlementBankService.updateSettlementBank(bank, bank.id)
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

				    vm.tableParams.reload(); // add this code inside edit function only
				}else{
					vm.formData = true;
					angular.forEach(errorResponse.data, function(value, key){
						vm.validationError[value.fieldType] = value.message;
					});
				}

				vm.tableParams.reload();
			});

		} // end of updateSettlementBank function

		// delete bank
		function deleteSettlementBank(bank, bank_id) {
			resetError();

			SettlementBankService.deleteSettlementBank(bank, bank_id)
			.then(function(successResponse){
				vm.success = true;
				vm.success_message = successResponse.data.message;
				vm.tableParams.reload();
			}, function(errorResponse){
				vm.error = true;
				vm.error_message = errorResponse.data.message;
				vm.tableParams.reload();
			});

		} // end of deleteSettlementBank function

		// render detail modal box of settlementBank
		function detailModal(bank) {

			SettlementBankProfileService.editProfile(bank.settlementBankProfileDto.id)
			.then(function(successResponse) {
				var profile = successResponse.data;
				var showBasicDetails = false;

				var modalInstance = $uibModal.open({
					animation: true,
					ariaLabelledBy: 'modal-title',
					ariaDescribedBy: 'modal-body',
					templateUrl: 'modules/settlementBank/modal/settlementBank.modal.detailView.html',
					controller: 'SettlementBankModalController',
					controllerAs: 'sbCtrl',
					backdrop: false,
					size: 'lg',
					resolve: {
						profile: function () {
							return profile;
						},
						settlementBank: function () {
							return bank;
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

		// render the delete modal box of deleting settlement bank
		function deleteModal(bank) {

			var modalInstance = $uibModal.open({
		      animation: true,
		      ariaLabelledBy: 'modal-title',
		      ariaDescribedBy: 'modal-body',
		      templateUrl: 'modules/settlementBank/modal/settlementBank.modal.delete.html',
		      controller: 'SettlementBankModalController',
		      controllerAs: 'spmCtrl',
		      size: 'lg',
		      backdrop: false,
		      resolve: {
		        settlementBank: function () {
		          return bank;
		        },
		        profile: function () {
		        	return null;
		        }
		      }
		    });
			modalInstance.result
			.then(function (deleted_bank) {
				vm.bank = {
					deletedReason: deleted_bank.deletedRemarks
				};

				vm.paginationLoaded = false;
		    	// delete bank
		    	vm.deleteSettlementBank(vm.bank, deleted_bank.id);

		    }, function (dismissResponse) {
		    	// nothing to do
		    });

		} // end of deleteModal function 

		// clear the validation message from backend if exist
		function clearValidationError(field) {
			if(angular.isDefined(vm.validationError[field])){
				delete vm.validationError[field];
			}
		} // end of clearValidationError function


		// Blocks and unblock the settlementBank
		function blockUnblockBank(bank){
			resetError();
			vm.paginationLoaded = false;

			bank.isActive = !bank.isActive;

			SettlementBankService.blockUnblockBank(bank, bank.id)
			.then(function(successResponse){
				vm.success = true;
				vm.success_message = successResponse.data.message;
				vm.tableParams.reload();
			}, function(errorResponse){
				vm.error = true;
				vm.error_message = errorResponse.data.message;
				vm.tableParams.reload();
			});
		} // end of blockUnblockBank function

	    // render delail modal box of profile
	    function profileDetailModal(profileId) {

	    	SettlementBankProfileService.editProfile(profileId)
	    	.then(function(successResponse) {
	    		var profile = successResponse.data;
                var showBasicDetails = false; // boolean value to control the name and other basic values of views //used by settlement bank profile navs as well so

                var modalInstance = $uibModal.open({
                	animation: true,
                	ariaLabelledBy: 'modal-title',
                	ariaDescribedBy: 'modal-body',
                	templateUrl: 'modules/settlementBankProfile/modal/settlementBankProfile.modal.detailView.html',
                	controller: 'SettlementBankProfileModalController',
                	controllerAs: 'spmCtrl',
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

        // function to validate the password, confirm password, and password policy
        // return true if need to disable the button
        // return false if no need to disable the button
        function formValidation(settlementBank_form) {
        	if(settlementBank_form.$invalid) {
        		return true;
        	}else {
        		if(!vm.pwdValidation.boolean && vm.confirm_password.length > 0 && vm.confirm_password === vm.settlementBank.password ) {
        			return false;
        		}else {
        			return true;
        		}
        	}

        } // end of formValidation function

	} // end of Settlement Bank controller

})();

