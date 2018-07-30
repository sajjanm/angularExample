(function() {
	'use strict';

	angular.module('adminApp.commissionSetup')
	.controller('CommissionPartnerController', CommissionPartnerController);

	CommissionPartnerController.$inject = ['CommissionPartnerService', '$uibModal', 'NgTableParams', 'PaginationService'];

	function CommissionPartnerController(CommissionPartnerService, $uibModal, NgTableParams, PaginationService) {

		var vm = this;

		// properties
		vm.partner = {};
		vm.originalPartner = {};
		vm.allPartner = [];

		vm.loaded = true;
		vm.error = false;
		vm.success = false;
		vm.error_message = '';
		vm.success_message = '';

		vm.allPartnerByPagination = [];
		vm.tableParams = {};
		vm.sno = {};
		vm.paginationLoaded = false;

		vm.editView = false;

		vm.validationError = {};

		// methods
		vm.getAllPartner = getAllPartner;
		vm.resetForm = resetForm;
		vm.getAllPartnerTable = getAllPartnerTable;
		vm.cancelUpdate = cancelUpdate;

		vm.resetError = resetError;
		vm.clearValidationError = clearValidationError;

		// CRUD methods
		vm.createPartner = createPartner;
		vm.updatePartner = updatePartner;
		vm.deletePartner = deletePartner;

		// modal methods
		vm.detailModal = detailModal;
		vm.deleteModal = deleteModal;
		vm.editPartner = editPartner;

		// initilaize methods
		activate();
		function activate(){
			// getAllPartner();
			getAllPartnerTable();

		} // end of activate function

		// fetch all partners
		function getAllPartner() {
			vm.allPartner = [];

			CommissionPartnerService.getAllPartner()
			.then(function(successResponse) {
				var partners = successResponse.data;

				angular.forEach(partners, function(partner){
					vm.allPartner.push(partner);
				});

			}, function(errorResponse) {
				// for error
			});

		} // end of getAllPartner function

		// fetch all settlement bank partner table
		function getAllPartnerTable() {

			vm.allPartnerByPagination.length = 0;

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
            	total: vm.allPartnerByPagination.length,
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

            		CommissionPartnerService.getAllPartnerByPagination(tableParams).then(
            			function(successResponse){

            				vm.paginationLoaded = true;

            				vm.sno = PaginationService.getSno(tableParams);
            				vm.allPartnerByPagination = successResponse.data.commissionPartnerDtos;

            				params.total(successResponse.data.totalNumberOfRecords);

            				$defer.resolve(vm.allPartnerByPagination);
            			},
            			function(errorResponse){

            				vm.paginationLoaded = true;
            				vm.allPartnerByPagination.length = 0;
            				$defer.resolve(vm.allPartnerByPagination);

            			});
            	}
            });

		} // end of getAllPartnerTable function
		
		// reset the partner object
		function resetForm(form) {
			form.$setPristine();
			form.$setUntouched();
			
			vm.partner = {};
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

		// cancel the edit partner
		function cancelUpdate() {
			vm.editView = false;
			vm.tableParams.reload();

        } // end of cancelUpdate function

		// create partner 
		function createPartner(form) {
			resetError();
			vm.loaded = false;

			CommissionPartnerService.createPartner(vm.partner)
			.then(function(successResponse){
				vm.loaded = true;
				
				vm.success = true;
				vm.success_message = successResponse.data.message;
				
				vm.resetForm(form);

			}, function(errorResponse){
				vm.loaded = true;

				if(angular.isDefined(errorResponse.data.message)) {
					vm.error = true;
					vm.error_message = errorResponse.data.message;
				}else{
					angular.forEach(errorResponse.data, function(value, key){
						vm.validationError[value.fieldType] = value.message;
					});
				}
			});
			
		} // end of createPartner function

		// fetch the partner object of editing partner
		function editPartner(partnerToUpdate) {
			resetError();

			CommissionPartnerService.getPartnerById(partnerToUpdate.id)
			.then(function(successResponse){

				vm.error = false;
				vm.success = false;

				var partner = successResponse.data;

	            vm.partner = angular.copy(partner); // set the response partner object to global partner, we will work in this object
	            vm.originalPartner = angular.copy(partner);

	            vm.editView = true; // render the edit view layout

	        }, function(errorResponse){
	        	vm.error = true;
	        	vm.error_message = errorResponse.data.message;
	        });

		} // end of editPartner

		// update partner
		function updatePartner(form_object) {
			resetError();
			
			vm.paginationLoaded = false;

			var partner = {
				id: vm.partner.id,
				name: vm.partner.name,
				companyName: vm.partner.companyName,
				accountNo: vm.partner.accountNo,
				email: vm.partner.email,
				contact: vm.partner.contact
			};

			CommissionPartnerService.updatePartner(partner, partner.id)
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
					angular.forEach(errorResponse.data, function(value, key){
						vm.validationError[value.fieldType] = value.message;
					});
				}
			});

		} // end of updatePartner function

		// delete partner
		function deletePartner(partner, partner_id) {
			resetError();

			CommissionPartnerService.deletePartner(partner, partner_id)
			.then(function(successResponse){
				vm.success = true;
				vm.success_message = successResponse.data.message;
				
				vm.tableParams.$params.page = 1; // set table to initial page
				vm.tableParams.reload();
			}, function(errorResponse){
				if(angular.isDefined(errorResponse.data.message)) {
					vm.error = true;
					vm.error_message = errorResponse.data.message;
				}else{
					angular.forEach(errorResponse.data, function(value, key){
						vm.validationError[value.fieldType] = value.message;
					});
				}
			});

		} // end of deletePartner function

		// render delail modal box of partner
		function detailModal(partner) {

			var modalInstance = $uibModal.open({
				animation: true,
				ariaLabelledBy: 'modal-title',
				ariaDescribedBy: 'modal-body',
				templateUrl: 'modules/commissionSetup/modal/commissionPartner.modal.detailView.html',
				controller: 'CommissionPartnerModalController',
				controllerAs: 'cpmCtrl',
				size: 'lg',
				backdrop: false,
				resolve: {
					partner: function () {
						return partner;
					}
				}
			});

			modalInstance.result
			.then(function (updated_partner) {
		  		// nothing to do
		  	}, function (dismissResponse) {
		    	// nothing to do
		    });

		} // end of detailModal function 

		// render the delete modal box of deleting partner
		function deleteModal(partnerToDelete) {

			var modalInstance = $uibModal.open({
				animation: true,
				ariaLabelledBy: 'modal-title',
				ariaDescribedBy: 'modal-body',
				templateUrl: 'modules/commissionSetup/modal/commissionPartner.modal.delete.html',
				controller: 'CommissionPartnerModalController',
				controllerAs: 'cpmCtrl',
				size: 'lg',
				backdrop: false,
				resolve: {
					partner: function () {
						return partnerToDelete;
					}
				}
			});

			modalInstance.result
			.then(function (deleted_partner) {

				var partner = {
					name: deleted_partner.name,
					companyName: deleted_partner.companyName,
					accountNo: deleted_partner.accountNo,
					email: deleted_partner.email,
					contact: deleted_partner.contact
				};

				vm.paginationLoaded = false;
		    	// delete partner
		    	vm.deletePartner(partner, deleted_partner.id);

		    }, function (dismissResponse) {
		    	// nothing to do
		    });

		} // end of deleteModal function     

    } // end of Commission Partner Controller

})();

