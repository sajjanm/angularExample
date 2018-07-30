(function () {
    'use strict';

    angular.module('adminApp.customer')
    .controller('CustomerController', CustomerController);

    CustomerController.$inject = ['CustomerService', '$uibModal', 'NgTableParams', 'PaginationService', '$state', 'FileSaver', 'Blob'];

    function CustomerController(CustomerService, $uibModal, NgTableParams, PaginationService, $state, FileSaver, Blob) {

        var vm = this;

        // properties
        vm.profile = {};
        vm.allProfiles = [];

        vm.loaded = false;
        vm.error = false;
        vm.success = false;
        vm.error_message = '';
        vm.success_message = '';
        vm.editView = false;  

        vm.allAdminRoles = [];
        vm.originalAllAdminRoles = [];
        vm.roleChecked = {};
        vm.rolesArray = [];
        vm.formData = false; // to render admin form, formData must be true
        vm.kycDto = {};

        vm.allCustomerPagination = [];
        vm.allBlockedCustomerPagination = [];
        vm.tableParams = {};
        vm.sno = {};
        vm.paginationLoaded = false;

        // values of Next conformation page 
        vm.showCustomerProfile = false;
        vm.customerProfileList = [];
        vm.approveKYC = {};
        vm.buttons = true;
        vm.confirmButton = false;
        vm.disapproveDiv = false;
        vm.disapproveReason = {};
        vm.downloadFileId = {};

        // methods
        vm.approve = approve;
        vm.cancel = cancel;
        vm.confirmApprove = confirmApprove;
        vm.disapprove = disapprove;
        vm.confirmDisapprove = confirmDisapprove;
        vm.download = download;
        vm.resetError = resetError;

        vm.editCustomer = editCustomer;
        vm.getAllBlockedCustomer = getAllBlockedCustomer;
        vm.unblockCustomer = unblockCustomer;

        // modal methods
        vm.confirmApprove = confirmApprove;
        vm.confirmDisapprove = confirmDisapprove;
        vm.unblockCustomerDetailView = unblockCustomerDetailView;
        

        // initilaize methods
        activate();
        function activate() {

            getAllCustomer();
            getAllBlockedCustomer();

        } // end of activate function


        // fetch all customer to verify KYC
        function getAllCustomer() {
            console.log('inside get all customer function');
            vm.allCustomerPagination.length = 0;

            vm.tableParams = new NgTableParams({
                // initial value for page

                page: 1, // initial page
                count: 10, // number of records in page,
                filter: {
                    "contact": ''
                }
            },
            {
                counts: [],
                total: vm.allCustomerPagination.length,
                getData: function ($defer, params) {

                    vm.paginationLoaded = false;

                    var tableParams = {
                        pageNumber: params.page(),
                        pageSize: params.count(),
                        filterFieldParams: [
                        {
                            "fieldKey": "contact",
                            "fieldValue": params.filter().contact,
                        }
                        ]
                    };
                    console.log('inside the getDate function');
                    CustomerService.getAllCustomerByPagination(tableParams).then(
                        function (successResponse) {

                            vm.paginationLoaded = true;

                            vm.sno = PaginationService.getSno(tableParams);

                            vm.allCustomerPagination = successResponse.data.customerDto;

                            params.total(successResponse.data.totalNumberOfRecords);

                            $defer.resolve(vm.allCustomerPagination);
                        },
                        function (errorResponse) {

                            vm.paginationLoaded = true;
                            vm.allCustomerPagination.length = 0;
                            $defer.resolve(vm.allCustomerPagination);

                        });
                }
            });
        }// end of getAllCustomer function

        // fetch all blocked customer
        function getAllBlockedCustomer() {

            vm.allBlockedCustomerPagination.length = 0;

            vm.tableParams = new NgTableParams({
                // initial value for page

                page: 1, // initial page
                count: 10, // number of records in page,
                filter: {
                    "contact": ''
                }
            },
            {
                counts: [],
                total: vm.allBlockedCustomerPagination.length,
                getData: function ($defer, params) {

                    vm.paginationLoaded = false;

                    var tableParams = {
                        pageNumber: params.page(),
                        pageSize: params.count(),
                        filterFieldParams: [
                        {
                            "fieldKey": "customer.contact",
                            "fieldValue": params.filter().contact,
                        }
                        ]
                    };

                    CustomerService.getAllBlockedCustomerByPagination(tableParams).then(
                        function (successResponse) {

                            vm.paginationLoaded = true;

                            vm.sno = PaginationService.getSno(tableParams);

                            vm.allBlockedCustomerPagination = successResponse.data.customerLoginDto;

                            params.total(successResponse.data.totalNumberOfRecords);

                            $defer.resolve(vm.allBlockedCustomerPagination);
                        },
                        function (errorResponse) {

                            vm.paginationLoaded = true;
                            vm.allBlockedCustomerPagination.length = 0;
                            $defer.resolve(vm.allBlockedCustomerPagination);

                        });
                }
            });
        }// end of getAllBlockedCustomer() function

        // function to unblock the customer
        function unblockCustomer(customerLoginDto) {
            console.log(customerLoginDto);

            resetError();
            vm.paginationLoaded = false;

            customerLoginDto.is_blocked = ! customerLoginDto.is_blocked;

            CustomerService.unblockCustomer(customerLoginDto, customerLoginDto.customerDto.id)
            .then(function(successResponse){
                vm.success = true;
                vm.success_message = successResponse.data.message;
                vm.tableParams.reload();
            }, function(errorResponse){
                vm.error = true;
                vm.error_message = errorResponse.data.message;
                vm.tableParams.reload();
            });

        }// end of unblockCustomer() function

        // unblock customer detail view
        function unblockCustomerDetailView(customerLoginDto) {

            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'modules/customer/modal/customer.unblock.detailView.html',
                controller: 'UnblockCustomerModalController',
                controllerAs: 'ucmCtrl',
                backdrop: false,
                size: 'lg',
                resolve: {
                    customerLogin: function () {
                        return customerLoginDto;
                    }
                }
            });


            modalInstance.result
            .then(function (updated_profile) {
                // nothing to do

            }, function (dismissResponse) {
                // nothing to do

            });
        } // end of confirmApprove function

        // reset the error and success messages
        function resetError(){

            vm.error = false;
            vm.error_message = '';
            vm.success = false;
            vm.success_message = '';

        } // end of resetError() function

        // reset the form
        function resetForm() {
            vm.profile = {
                name: "",
                description: ""
            };

            vm.allAdminRoles = vm.originalAllAdminRoles;
        }// end of reset function

        // edit the customer
        function editCustomer(customerDto) {

            CustomerService.getCustomerKycDetail(customerDto.id).then(
                function (successResponse) {
                    vm.kycDto = successResponse.data;
                    vm.editView = true;
                },
                function (errorResponse) {
                });
        } // end of editCustomer function

        // cancel the KYC Form
        function cancel() {
            vm.editView = false;
            vm.tableParams.reload();
            vm.showCustomerProfile = false;
            vm.customerProfileList = [];
            vm.buttons = true;
            vm.confirmButton = false;
            vm.disapproveDiv = false;
            vm.disapproveReason = {};
            vm.downloadFileId = {};
            vm.approveKYC = {};
        } // end of cancel function

        // downloading the KYC detail documents
        function download(){

            CustomerService.downloadDocument(parseInt(vm.downloadFileId)).then(
                function (successResponse) {
                    var myBlob = new Blob([successResponse.data],{type:'text/html'})
                    var blobURL = (window.URL || window.webkitURL).createObjectURL(myBlob);
                    var anchor = document.createElement("a");
                    anchor.download = vm.kycDto.firstName +"_"+ vm.kycDto.customerDto.id+"_"+ "customer.jpeg";
                    anchor.href = blobURL;
                    anchor.click();
                },
                function (errorResponse) {
                });
        }// end of download function  

        // approving the KYC detail
        function approve() {
            vm.showCustomerProfile = true;
            vm.buttons = false;
            vm.confirmButton = true;
            CustomerService.getAllCustomerProfile().then(
                function (successResponse) {
                    vm.customerProfileList = successResponse.data;

                    confirmApprove(vm.customerProfileList);
                },
                function (errorResponse) {
                });
        } // end of of approve function

        // final approving the KYC detail
        function confirmApprove(customerProfileList) {

            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'modules/customer/modal/kycConfirm.modal.html',
                controller: 'CustomerModalController',
                controllerAs: 'cmCtrl',
                windowClass: 'app-modal-window-custom',
                backdrop: false,
                // size: 'lg',
                resolve: {
                    customerProfileList: function () {
                        return customerProfileList;
                    },
                    customerProfile: function() {
                        return vm.kycDto.customerDto.customerProfileDto;
                    }
                }
            });


            modalInstance.result
            .then(function (updated_profile) {
                vm.approveKYC.custProfileId = updated_profile.custProfileId;
                CustomerService.confirm(vm.kycDto.customerDto.id, vm.approveKYC).then(
                    function (successResponse) {
                        vm.success = true;
                        vm.success_message =' KYC Approved';
                        cancel();
                    },
                    function (errorResponse) {
                        vm.error = true;
                        vm.error_message = errorResponse.data.message;
                    });
            }, function (dismissResponse) {
                vm.buttons = true;
            });
        } // end of confirmApprove function

        // disapproving the KYC detail
        function disapprove() {
            vm.showCustomerProfile = false;
            vm.buttons = false;
            vm.disapproveDiv = true;
            confirmDisapprove();            
        } // end of disapprove function

        // final disapprove the KYC detail
        function confirmDisapprove() {
            var customerProfileList='';
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'modules/customer/modal/kycDisapprove.modal.html',
                controller: 'CustomerModalController',
                controllerAs: 'cmCtrl',
                windowClass: 'app-modal-window-custom',
                backdrop: false,
                // size: 'lg',
                resolve: {
                    customerProfileList: function () {
                        return customerProfileList;
                    },
                    customerProfile: function() {
                        return vm.kycDto.customerDto.customerProfileDto;
                    }
                }
            });


            modalInstance.result
            .then(function (updated_profile) {
                vm.disapproveReason.disapproveReason = updated_profile.disapproveReason;
                CustomerService.disapproveCustomer(vm.kycDto.customerDto.id, vm.disapproveReason).then(
                    function (successResponse) {
                        vm.success = true;
                        vm.success_message =' KYC Disapproved';
                        cancel();
                    },
                    function (errorResponse) {
                        vm.error = true;
                        vm.error_message = errorResponse.data.message;
                    });
            }, function (dismissResponse) {
                vm.buttons = true;
            });
        } // ebd of confirmDisapprove function

    }// end of Customer Controller function

})();

