// (function() {
//     'use strict';

//     angular.module('adminApp.invoice')
//     .controller('InvoiceController', InvoiceController);

//     InvoiceController.$inject = ['InvoiceService', 'AdminProfileService', '$uibModal', 'NgTableParams', 'PaginationService', 'ValidationService'];

//     function InvoiceController(InvoiceService, AdminProfileService, $uibModal, NgTableParams, PaginationService, ValidationService) {
//         var vm = this;

//         // properties
//         vm.admin = {};
//         vm.originalAdmin = {};
//         vm.allAdmins = [];
//         vm.allProfiles = [];
//         vm.confirm_password = ''; // for validating password
//         vm.pwdValidation = {
//             boolean : false,
//             message : ''
//         };

//         vm.loaded = false;
//         vm.error = false;
//         vm.success = false;
//         vm.error_message = '';
//         vm.success_message = '';
//         vm.formData = false; // to render admin form, formData must be true

//         vm.validationError = {};

//         vm.allAdminsPagination = [];
//         vm.tableParams = {};
//         vm.sno = {};
//         vm.paginationLoaded = false;

//         vm.editView = false;

//         // methods
//         vm.resetForm = resetForm;
//         vm.resetError = resetError;
//         vm.getAllAdmins = getAllAdmins;
//         vm.getAllProfiles = getAllProfiles;
//         vm.getAllAdminsTable = getAllAdminsTable;
//         vm.cancelUpdate = cancelUpdate;
//         vm.loadPasswordPolicy = loadPasswordPolicy;
//         vm.validatePasswordPolicy = validatePasswordPolicy;

//         vm.clearValidationError = clearValidationError;
//         vm.formValidation = formValidation;

//         // CRUD methods
//         vm.createAdmin = createAdmin;
//         vm.updateAdmin = updateAdmin;
//         vm.deleteAdmin = deleteAdmin;
//         vm.editAdmin = editAdmin;

//         // modal methods
//         vm.detailModal = detailModal;
//         vm.deleteModal = deleteModal;
//         vm.profileDetailModal = profileDetailModal;

//         // initilaize methods
//         activate();
//         function activate(){

//             getAllProfiles();
//             getAllAdminsTable();
//             loadPasswordPolicy();

//         } // end of activate function

//         // fetch all admins
//         function getAllAdmins() {
//             vm.allAdmins = [];

//             InvoiceService.getAllAdmins()
//             .then(function(successResponse) {
//                 var admins = successResponse.data;

//                 angular.forEach(admins, function(admin){
//                     vm.allAdmins.push(admin);
//                 });

//             }, function(errorResponse) {
//                 // for error
//             });

//         } // end of getAllAdmins function

//         // fetch all admins table
//         function getAllAdminsTable() {

//             vm.allAdminsPagination.length = 0;

//             vm.tableParams = new NgTableParams({
//                 // initial value for page
                
//                 page: 1, // initial page
//                 count: 10, // number of records in page,
//                 filter: {
//                     "name": '',
//                     "username": '',
//                     "profile": ''
//                 } 
//             },
//             {
//                 counts: [],
//                 total: vm.allAdminsPagination.length,
//                 getData : function( $defer, params){

//                     vm.paginationLoaded = false;

//                     var tableParams = {
//                         pageNumber: params.page(),
//                         pageSize: params.count(),
//                         filterFieldParams: [
//                         {
//                             "fieldKey":"name",
//                             "fieldValue": params.filter().name,
//                         },
//                         {
//                             "fieldKey":"username",
//                             "fieldValue": params.filter().username,
//                         },
//                         {
//                             "fieldKey":"adminProfile.name",
//                             "fieldValue": angular.isUndefined(params.filter().profile) ? '' : params.filter().profile,
//                         }
//                         ]
//                     };

//                     InvoiceService.getAllAdminsByPagination(tableParams).then(
//                         function(successResponse){

//                             vm.paginationLoaded = true;

//                             vm.sno = PaginationService.getSno(tableParams);
//                             vm.allAdminsPagination = successResponse.data.smartCardAdminDto;

//                             params.total(successResponse.data.totalNumberOfRecords);

//                             $defer.resolve(vm.allAdminsPagination);
//                         },
//                         function(errorResponse){

//                             vm.paginationLoaded = true;
//                             vm.allAdminsPagination.length = 0;
//                             $defer.resolve(vm.allAdminsPagination);

//                         });
//                 }
//             });

//         } // end of getAllAdmins function

//         // fetch all profiles 
//         function getAllProfiles() {
//             vm.formData = false;
//             vm.allProfiles = [];

//             AdminProfileService.getAllProfiles()
//             .then(function(successResponse) {
//                 var profiles = successResponse.data;

//                 angular.forEach(profiles, function(profile){
//                     vm.allProfiles.push(profile);
//                 });
//                 vm.formData = true;

//             }, function(errorResponse) {
//                 // for error
//             });

//         } // end of getAllProfiles

//         // ACTIVATES THE VALIDATION SERVICE AND IT FETCH THE PASSWORD POLICY FOR ONCE
//         function loadPasswordPolicy(){
//             vm.formData = ValidationService.getPasswordPolicy();
//         }   // END OF LOAD PASSWORD POLICY FUNCTION

//         // FRONT END USE THIS FUNCTION FOR PASSWORD VALIDATION:: IT GOES INSIDE VALIDATION SERVICE
//         function validatePasswordPolicy(passs){
//             vm.pwdValidation = {
//                 boolean : false,
//                 message : ''
//             };
//             if(passs ==undefined){
//                 vm.pwdValidation = {
//                     boolean : true,
//                     message : 'length is 0'
//                 };
//             }else{
//                 vm.pwdValidation = ValidationService.validatePassword(passs);
//             }
//         }   // END OF VALIDATE PASSWORD POLICY

//         // reset the admin object
//         function resetForm(form) {
//             form.$setPristine();
//             form.$setUntouched();

//             vm.admin = {
//                 id: null,
//                 name: '',
//                 email: '',
//                 contact: '',
//                 address: '',
//                 gender: '',
//                 username: '',
//                 password: '',
//                 adminProfileId: ''
//             };

//             vm.confirm_password = '';

//         } // end of resetForm function

//         // reset the error message
//         function resetError() {
//             vm.error = false;
//             vm.success = false;
//             vm.validationError = {};
//         }// end of resetError function

//         // cancel the edit profile
//         function cancelUpdate() {

//             vm.editView = false;
//             vm.tableParams.reload();

//         } // end of cancelUpdate function

//         // create admin
//         function createAdmin(form) {
//             vm.formData = false;
//             resetError();

//             InvoiceService.createAdmin(vm.admin)
//             .then(function(successResponse){
//                 vm.formData = true;
//                 vm.success = true;
//                 vm.success_message = successResponse.data.message;
//                 vm.resetForm(form);

//             }, function(errorResponse){
//                 vm.formData = true;
//                 if(angular.isDefined(errorResponse.data.message)) {
//                     vm.error = true;
//                     vm.error_message = errorResponse.data.message;
//                 }else{
//                     angular.forEach(errorResponse.data, function(value, key){
//                         vm.validationError[value.fieldType] = value.message;
//                     });
//                 }

//             });

//         } // end of createAdmin function

//         // clear the validation message from backend if exist
//         function clearValidationError(field) {
//             if(angular.isDefined(vm.validationError[field])){
//                 delete vm.validationError[field];
//             }
//         } // end of clearValidationError function

//         // render edit admin
//         function editAdmin(adminToUpdate) {
//             vm.paginationLoaded = false;
//             resetError();

//             // This is get by id function
//             InvoiceService.editAdmin(adminToUpdate.id)
//             .then(function(successResponse) {
//                 var admin = successResponse.data;

//                 vm.admin = angular.copy(admin); // set the response admin object to global admin, we will work in this object
//                 vm.originalAdmin = angular.copy(admin);

//                 vm.paginationLoaded = true;
//                 vm.editView = true; // render the edit view layout
//                 vm.formData = true;

//                 // further processing will be done by updateAdmin() function

//             }, function(errorResponse) {
//                 // for error
//             });
//         } // end of editAdmin function

//         // update admin
//         function updateAdmin(form_object) {
//             resetError();
            
//             vm.paginationLoaded = false;
//             vm.formData = false;

//             var admin = {
//                 id: vm.admin.id,
//                 name: vm.admin.name,
//                 email: vm.admin.email,
//                 contact: vm.admin.contact,
//                 address: vm.admin.address,
//                 gender: vm.admin.gender,
//                 adminProfileId: vm.admin.adminProfile.id
//             };

//             InvoiceService.updateAdmin(admin, admin.id)
//             .then(function(successResponse){
//                 vm.editView = false;
//                 vm.success = true;
//                 vm.success_message = successResponse.data.message;

//                 vm.tableParams.reload();
//             }, function(errorResponse){

//                 if(angular.isDefined(errorResponse.data.message)) {
//                     vm.editView = false;
//                     vm.error = true;
//                     vm.error_message = errorResponse.data.message;

//                     vm.tableParams.reload();
//                 }else{
//                     vm.formData = true;
//                     angular.forEach(errorResponse.data, function(value, key){
//                         vm.validationError[value.fieldType] = value.message;
//                     });
//                 }
                
//             });

//         } // end of updateAdmin function

//         // render detail modal box of admin
//         function detailModal(admin) {

//             AdminProfileService.editProfile(admin.adminProfile.id)
//             .then(function(successResponse) {
//                 var profile = successResponse.data;
//                 var showBasicDetails = false;

//                 var modalInstance = $uibModal.open({
//                   animation: true,
//                   ariaLabelledBy: 'modal-title',
//                   ariaDescribedBy: 'modal-body',
//                   templateUrl: 'modules/admin/modal/admin.modal.detailView.html',
//                   controller: 'AdminModalController',
//                   controllerAs: 'admCtrl',
//                   backdrop: false,
//                   size: 'lg',
//                   resolve: {
//                     admin: function () {
//                             return admin;
//                         },
//                     profile: function () {
//                             return profile;
//                         }
//                     }
//                 });

//                 modalInstance.result
//                 .then(function (updated_profile) {
//                     // nothing to do
//                 }, function (dismissResponse) {
//                     // nothing to do
//                 });

//             }, function(errorResponse) {
//                 // for error
//             });
//         } // end of detailModal function

//         // render the delete modal box of deleting admin
//         function deleteModal(admin) {
//             vm.paginationLoaded = false;

//             var modalInstance = $uibModal.open({
//               animation: true,
//               ariaLabelledBy: 'modal-title',
//               ariaDescribedBy: 'modal-body',
//               templateUrl: 'modules/admin/modal/admin.modal.delete.html',
//               controller: 'AdminModalController',
//               controllerAs: 'admCtrl',
//               size: 'lg',
//               backdrop: false,
//               resolve: {
//                 admin: function () {
//                         return admin;
//                     },
//                 profile: function () {
//                         return null;
//                     }
//                 }
//             });

//             modalInstance.result
//             .then(function (delete_admin) {
//                 vm.paginationLoaded = true;

//                 var adminToDelete = {
//                     deletedReason: delete_admin.deletedRemarks
//                 };

//                 vm.paginationLoaded = false;
//                 // delete admin
                
//                 deleteAdmin(adminToDelete, delete_admin.id);
                
//             }, function (dismissResponse) {
//                 vm.paginationLoaded = true;

//                 // nothing to do
//             });
//         } // end of deleteModal function 

//         // delete admin
//         function deleteAdmin(admin, admin_id) {
//             resetError();
//             InvoiceService.deleteAdmin(admin, admin_id)
//             .then(function(successResponse){
//                 vm.success = true;
//                 vm.success_message = successResponse.data.message;

//                 vm.tableParams.$params.page = 1; // set table to initial page
//                 vm.tableParams.reload();
//             }, function(errorResponse){
//                 vm.error = true;
//                 vm.error_message = errorResponse.data.message;

//                 vm.tableParams.reload();
//             });
//         } // end of deleteAdmin function


//         // render delail modal box of profile
//         function profileDetailModal(profileId) {

//             AdminProfileService.editProfile(profileId)
//             .then(function(successResponse) {
//                 var profile = successResponse.data;

//                 var showBasicDetails = false;

//                 var modalInstance = $uibModal.open({
//                     animation: true,
//                     ariaLabelledBy: 'modal-title',
//                     ariaDescribedBy: 'modal-body',
//                     templateUrl: 'modules/adminProfile/modal/adminProfile.modal.detailView.html',
//                     controller: 'AdminProfileModalController',
//                     controllerAs: 'apmCtrl',
//                     backdrop: false,
//                     size: 'lg',
//                     resolve: {
//                         profile: function () {
//                             return profile;
//                         },
//                         showBasicDetails: function () {
//                             return showBasicDetails;
//                         }

//                     }
//                 });

//                 modalInstance.result
//                 .then(function (updated_profile) {
//                     // nothing to do
//                 }, function (dismissResponse) {
//                     // nothing to do
//                 });

//             }, function(errorResponse) {
//                 // for error
//             });

//         } // end of detailModal function

//         // function to validate the password, confirm password, and password policy
//         // return true if need to disable the button
//         // return false if no need to disable the button
//         function formValidation(admin_form) {
//             if(admin_form.$invalid) {
//                 return true;
//             }else {
//                 if(!vm.pwdValidation.boolean && vm.confirm_password.length > 0 && vm.confirm_password === vm.admin.password ) {
//                     return false;
//                 }else {
//                     return true;
//                 }
//             }

//         } // end of formValidation function

//     } // end of admin controller

// })();

