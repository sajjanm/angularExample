(function () {
    'use strict';
    angular.module('adminApp.memberBank')
    .controller('MemberBankController', MemberBankController);
    MemberBankController.$inject = ['MemberBankService', 'MemberBankProfileService', '$uibModal', 'NgTableParams', 'PaginationService', 'ValidationService'];
    function MemberBankController(MemberBankService, MemberBankProfileService, $uibModal, NgTableParams, PaginationService, ValidationService) {

        var vm = this;

        // properties
        vm.memberBank = {};
        vm.originalMemberBank = {};
        vm.allMemberBanks = [];
        vm.allMemberBankProfiles = [];
        vm.confirm_password = ''; // for validating password
        vm.pwdValidation = {
            boolean : false,
            message : ''
        };
        vm.pwdAPIValidation = {
            boolean : false,
            message : ''
        };

        vm.loaded = false;
        vm.error = false;
        vm.success = false;
        vm.error_message = '';
        vm.success_message = '';
        vm.formData = false; // to render memberBank form, formData must be true

        vm.allMemberBanksPagination = [];
        vm.tableParams = {};
        vm.sno = {};
        vm.paginationLoaded = false;

        vm.editView = false;
        vm.validationError = {};

        // methods
        vm.resetForm = resetForm;
        vm.getAllMemberBanks = getAllMemberBanks;
        vm.getAllMemberBanksTable = getAllMemberBanksTable;
        vm.getAllMemberBankProfiles = getAllMemberBankProfiles;
        vm.cancelUpdate = cancelUpdate;
        vm.loadPasswordPolicy = loadPasswordPolicy;
        vm.validatePasswordPolicy = validatePasswordPolicy;
        vm.validateAPIPasswordPolicy = validateAPIPasswordPolicy;
        vm.resetError = resetError;
        vm.clearValidationError = clearValidationError;
        vm.formValidation = formValidation;

        // CRUD methods
        vm.createMemberBank = createMemberBank;
        vm.updateMemberBank = updateMemberBank;
        vm.deleteMemberBank = deleteMemberBank;
        vm.editMemberBank = editMemberBank;

        // modal methods
        vm.detailModal = detailModal;
        vm.deleteModal = deleteModal;
        vm.profileDetailModal = profileDetailModal;

        // initilaize methods
        activate();
        function activate() {

            getAllMemberBankProfiles();
            getAllMemberBanksTable();
            loadPasswordPolicy();
        } // end of activate function

        // fetch all settlement banks
        function getAllMemberBanks() {
            vm.allMemberBanks = [];

            MemberBankService.getAllMemberBanks()
            .then(function (successResponse) {
                var banks = successResponse.data;
                angular.forEach(banks, function (bank) {
                    vm.allMemberBanks.push(bank);
                });
            }, function (errorResponse) {
                        // for error
                    });
        } // end of getAllMemberBanks function

        // fetch all getAllMemberBanksTable function
        function getAllMemberBanksTable() {

            vm.allMemberBanksPagination.length = 0;
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
                total: vm.allMemberBanksPagination.length,
                getData: function ($defer, params) {

                    vm.paginationLoaded = false;
                    var tableParams = {
                        pageNumber: params.page(),
                        pageSize: params.count(),
                        filterFieldParams: [
                        {
                            "fieldKey": "name",
                            "fieldValue": params.filter().name,
                        },
                        {
                            "fieldKey": "username",
                            "fieldValue": params.filter().username,
                        },
                        {
                            "fieldKey": "memberBankProfile.name",
                            "fieldValue": angular.isUndefined(params.filter().profile) ? '' : params.filter().profile,
                        }

                        ]
                    };

                    MemberBankService.getAllMemberBanksByPagination(tableParams).then(
                        function (successResponse) {
                            vm.paginationLoaded = true;

                            var memberdata = successResponse.data;

                            vm.sno = PaginationService.getSno(tableParams);

                            vm.allMemberBanksPagination = memberdata.memberBankDtos;

                            params.total(memberdata.totalNumberOfRecords);

                            $defer.resolve(vm.allMemberBanksPagination);
                        },
                        function (errorResponse) {

                            vm.paginationLoaded = true;
                            vm.allMemberBanksPagination.length = 0;
                            $defer.resolve(vm.allMemberBanksPagination);

                        });
                }
            });
        }// end of getAllMemberBanksTable function

        // fetch all profiles
        function getAllMemberBankProfiles() {
            vm.formData = false;
            vm.allMemberBankProfiles = [];
            MemberBankProfileService.getAllProfiles()
            .then(function (successResponse) {
                var profiles = successResponse.data;
                angular.forEach(profiles, function (profile) {
                    vm.allMemberBankProfiles.push(profile);
                });
                vm.formData = true;
            }, function (errorResponse) {
                        // for error
                    });
        } // end of getAllMemberBankProfiles

        // ACTIVATES THE VALIDATION SERVICE AND IT FETCH THE PASSWORD POLICY FOR ONCE
        function loadPasswordPolicy(){
            vm.formData = ValidationService.getPasswordPolicy();
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

            vm.memberBank = {
                name: '',
                description: '',
                email: '',
                swiftCode: '',
                accountNo: '',
                mirrorAccountNumber: '',
                username: '',
                password: '',
                isActive: true,
                deletedReason: '',
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

        // create settlement bank
        function createMemberBank(form) {
            vm.formData = false;
            resetError();

            MemberBankService.createMemberBank(vm.memberBank)
            .then(function (successResponse) {

                vm.formData = true;
                vm.success = true;
                vm.success_message = successResponse.data.message;
                vm.resetForm(form);

            }, function (errorResponse) {
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
        } // end of createMemberBank function

        // render edit member bank view layout
        function editMemberBank(bank) {
            vm.paginationLoaded = false;
            resetError();
            
            MemberBankService.editMemberBank(bank.id)
            .then(function(successResponse) {
                var bank = successResponse.data;

                vm.memberBank = angular.copy(bank); // set the response bank object to global bank, we will work in this object
                vm.originalMemberBank = angular.copy(bank);

                vm.paginationLoaded = true;
                vm.editView = true; // render the edit view layout

                // further processing will be done by updateAdmin() function

            }, function(errorResponse) {
                // for error
            });

        } // end of editMemberBank function

        // update settlement bank
        function updateMemberBank(form_object) {
            resetError();
            vm.paginationLoaded = false;
            vm.formData = false;

            var bank = {
                id: vm.memberBank.id,
                name: vm.memberBank.name,
                description: vm.memberBank.description,
                email: vm.memberBank.email,
                swiftCode: vm.memberBank.swiftCode,
                accountNo: vm.memberBank.accountNo,
                mirrorAccountNumber: vm.memberBank.mirrorAccountNumber,
                username: vm.memberBank.username,
                profileId: vm.memberBank.memberBankProfileDto.id,
                apiUserName: vm.memberBank.apiUserName,
                apiPassword: vm.memberBank.apiPassword,
                apiUrl: vm.memberBank.apiUrl,
                isActive: true
            };

            MemberBankService.updateMemberBank(bank, bank.id)
            .then(function (successResponse) {
                vm.formData = true;

                vm.editView = false;
                vm.success = true;
                vm.success_message = successResponse.data.message;

                vm.tableParams.reload();
            }, function (errorResponse) {
                vm.formData = true;

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
                    });
        } // end of updateMemberBank function

        // delete bank
        function deleteMemberBank(bank, bank_id) {

            MemberBankService.deleteMemberBank(bank, bank_id)
            .then(function (successResponse) {
                vm.success = true;
                vm.success_message = successResponse.data.message;
                        vm.tableParams.$params.page = 1; // set table to initial page
                        vm.tableParams.reload();
                    }, function (errorResponse) {
                        vm.error = true;
                        vm.error_message = errorResponse.data.message;
                        vm.tableParams.reload();
                    });
        } // end of deleteMemberBank function

        // render detail modal box of memberBank
        function detailModal(bank) {

            MemberBankProfileService.editProfile(bank.memberBankProfileDto.id)
            .then(function(successResponse) {
                var profile = successResponse.data;

                var modalInstance = $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'modules/memberBank/modal/memberBank.modal.detailView.html',
                    controller: 'MemberBankModalController',
                    controllerAs: 'mbCtrl',
                    backdrop: false,
                    size: 'lg',
                    resolve: {
                        profile: function () {
                            return profile;
                        },
                        memberBank: function () {
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
                templateUrl: 'modules/memberBank/modal/memberBank.modal.delete.html',
                controller: 'MemberBankModalController',
                controllerAs: 'mbCtrl',
                size: 'lg',
                backdrop: false,
                resolve: {
                    memberBank: function () {
                        return bank;
                    },
                    profile: function() {
                        return null;
                    }
                }
            });
            modalInstance.result
            .then(function (deleted_bank) {

                var bank = {
                    id: deleted_bank.id,
                    name: deleted_bank.name,
                    description: deleted_bank.description,
                    deletedReason: deleted_bank.deletedRemarks,
                    swiftCode: deleted_bank.swiftCode,
                    accountNo: deleted_bank.accountNo,
                    mirrorAccountNumber : deleted_bank.mirrorAccountNumber,
                    username: deleted_bank.username,
                    profileId: deleted_bank.memberBankProfileDto.id,
                    apiUserName: deleted_bank.apiUserName,
                    apiPassword: deleted_bank.apiPassword,
                    apiUrl: deleted_bank.apiUrl
                };
                vm.paginationLoaded = false;
                        // delete bank
                        vm.deleteMemberBank(bank, deleted_bank.id);
                    }, function (dismissResponse) {
                        // nothing to do
                    });
        } // end of deleteModal function 

        // render delail modal box of profile
        function profileDetailModal(profileId) {

            MemberBankProfileService.editProfile(profileId)
            .then(function(successResponse) {
                var profile = successResponse.data;
                var showBasicDetails = false; // boolean value to control the name and other basic values of views //used by settlement bank profile navs as well so

                var modalInstance = $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'modules/memberBankProfile/modal/memberBankProfile.modal.detailView.html',
                    controller: 'MemberBankProfileModalController',
                    controllerAs: 'mbpCtrl',
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
        function formValidation(memberBank_form) {
            if(memberBank_form.$invalid) {
                return true;
            }else {
                if(!vm.pwdValidation.boolean && vm.confirm_password.length > 0 && vm.confirm_password === vm.memberBank.password ) {
                    return false;
                }else {
                    return true;
                }
            }

        } // end of formValidation function

    } // end of Settlement Bank controller

})();

