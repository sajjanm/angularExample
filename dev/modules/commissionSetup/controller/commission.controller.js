(function() {
'use strict';

	angular.module('adminApp.commissionSetup')
	.controller('CommissionController', CommissionController);

	CommissionController.$inject = ['CommissionService', '$uibModal', 'NgTableParams', 'PaginationService'];

	function CommissionController(CommissionService, $uibModal, NgTableParams, PaginationService) {

		var vm = this;

		// properties
		vm.commission = {};
		vm.originalCommission = {};
		vm.allCommission = [];
		vm.allPayeeEvent = [];
		vm.allCommissionPartner = [];
		vm.allCommissionSlab = [];
		vm.commissionSlabDetailView = {};

		vm.loaded = false;
		vm.error = false;
		vm.success = false;
		vm.error_message = '';
		vm.success_message = '';

		vm.commissionShareError = false;
		vm.commissionShareErrorMessage = '';

		vm.payeeEventData = false;
		vm.commissionPartnerData = false;
		vm.commissionSlabData = false;

		vm.allCommissionByPagination = [];
		vm.tableParams = {};
		vm.sno = {};
		vm.paginationLoaded = false;
		vm.removedPartner = [];

		vm.editView = false;

		// initial value of commissionPayee
		vm.commissionPayee = [
						{name: "Commission", value: "COMMISSION"}, 
						// {name: "Charge", value: "CHARGE"}, 
						// {name: "Discount", value: "DISCOUNT"}
					];

		// initial value of commissionType
		vm.commissionType = [
						// {name: "Flat", value: "FLAT"}, 
						// {name: "Percentage", value: "PERCENTAGE"}, 
						{name: "Slab", value: "SLAB"}
					];

		// initial value for commissionShare
		vm.commission.commissionShareRequest = [{sn: 0, id: null, commissionPartnerId: null, commissionValue: null, isDeleted: false}];
								
		// methods
		vm.fetchedRequiredData = fetchedRequiredData;
		vm.getAllCommission = getAllCommission;
		vm.getAllNotAssignedPayeeEvent = getAllNotAssignedPayeeEvent;
		vm.getAllCommissionPartner = getAllCommissionPartner;
		vm.getAllCommissionSlab = getAllCommissionSlab;
		vm.resetForm = resetForm;
		vm.getAllCommissionTable = getAllCommissionTable;
		vm.commissionSlabDetail = commissionSlabDetail;
		vm.resetTotalCommissionValue = resetTotalCommissionValue;
		vm.cancelUpdate = cancelUpdate;

		vm.resetError = resetError;

		// methods for commissionShare 
		vm.addNewPartner = addNewPartner;
		vm.removePartner = removePartner;
		vm.isPartnerAlreadyAdded = isPartnerAlreadyAdded;
		vm.sumOfCommissionValue = sumOfCommissionValue;
		vm.clearCommissionShareErrorMessage = clearCommissionShareErrorMessage;

		// CRUD methods
		vm.createCommission = createCommission;
		vm.updateCommission = updateCommission;
		vm.blockUnblockCommission = blockUnblockCommission;

		// modal methods
		vm.detailModal = detailModal;
		vm.editCommission = editCommission;

		// initilaize methods
		activate();
		function activate(){
			// getAllCommission();
			fetchedRequiredData();
			getAllCommissionSlab();
			getAllCommissionTable();

		} // end of activate function

		// required data for commission
		function fetchedRequiredData() {
			getAllCommissionPartner();
			getAllNotAssignedPayeeEvent();
		} // end of fetchedRequiredData function

		// function to add new partner
		function addNewPartner() {
			var len = vm.commission.commissionShareRequest.length;

			vm.commission.commissionShareRequest.push({sn: length, id: null, commissionPartnerId: null, commissionValue: null, isDeleted: false});
		}// end of addNewPartner function

		// function to remove the partner row
		function removePartner(index) {

			var commissionShare = vm.commission.commissionShareRequest[index];

			if(commissionShare.id != null) {
				commissionShare.isDeleted = true;
				vm.removedPartner.push(commissionShare);
			}

			vm.commission.commissionShareRequest.splice(index, 1);

		}// end of removePartner function

		// function to check if partner already added to share
		function isPartnerAlreadyAdded(index) {

			var partner = [];

			angular.forEach(vm.commission.commissionShareRequest, function(commPartner){
				partner.push(commPartner.commissionPartnerId);
			});

			var len = vm.commission.commissionShareRequest.length;

			var duplicate = (new Set(partner)).size !== len;

			// if duplicate then remove the changed partner

			if(duplicate) {
				// set recently added partner to null
				// slice the recently added new row
				vm.commission.commissionShareRequest.splice(index, 1);

				vm.commissionShareError = true;
				vm.commissionShareErrorMessage = 'Commission Partner already Added';
			}else{
				vm.commissionShareError = false;
			}

		}// end of isPartnerAlreadyAdded function

		// reset the total commission value
		function resetTotalCommissionValue() {
			if(vm.commission.commissionType == "SLAB") {
				// for commissionType as Slab
				// total commission will be 100 %
				vm.commission.totalCommission = 100;	
			}else {
				vm.commission.totalCommission = null;	
			}
			
		}// end of resetTotalCommissionValue

		// render the detail of selected commission slab
		function commissionSlabDetail() {
			angular.forEach(vm.allCommissionSlab, function(commSlab){
				if(commSlab.id == vm.commission.commissionSlabId) {
					vm.commissionSlabDetailView = angular.copy(commSlab);
				}
			});

		}// end of commissionSlabDetail function

		// fetch all commissions
		function getAllCommission() {
			vm.allCommission = [];

			CommissionService.getAllCommission()
			.then(function(successResponse) {
				var commissions = successResponse.data;

				angular.forEach(commissions, function(commission){
					vm.allCommission.push(commission);
				});

			}, function(errorResponse) {
				// for error
			});

		} // end of getAllCommission function

		// fetch all Commission Partner
		function getAllCommissionPartner() {
			vm.allCommissionPartner = [];

			CommissionService.getAllCommissionPartner()
			.then(function(successResponse){
				var commissionPartners = successResponse.data;

				angular.forEach(commissionPartners, function(commissionPartner){
					vm.allCommissionPartner.push(commissionPartner);
				});

				vm.commissionPartnerData = true;

			},function(errorResponse){
				// for error
			});

		} // end of getAllCommissionPartner function

		// fetch all Commission Slab
		function getAllCommissionSlab() {
			vm.allCommissionSlab = [];

			CommissionService.getAllCommissionSlab()
			.then(function(successResponse){
				var commissionSlabs = successResponse.data;

				angular.forEach(commissionSlabs, function(commissionSlab){
					vm.allCommissionSlab.push(commissionSlab);
				});

				vm.commissionSlabData = true;

			},function(errorResponse){
				// for error
			});

		} // end of getAllCommissionSlab function

		// fetch all Commission not assigned Payee Event
		function getAllNotAssignedPayeeEvent() {
			vm.allPayeeEvent = [];

			CommissionService.fetchNotAssignedPayeeEvent()
			.then(function(successResponse) {

				var payeeEvents = successResponse.data;

				angular.forEach(payeeEvents, function(payeeEvent){
					vm.allPayeeEvent.push(payeeEvent);
				});

				vm.payeeEventData = true;
				vm.loaded = true;

			},function(errorResponse) {
					// for error
			});

		}// end of getAllNotAssignedPayeeEvent function

		// fetch all settlement bank commission table
		function getAllCommissionTable() {

			vm.allCommissionByPagination.length = 0;

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
                total: vm.allCommissionByPagination.length,
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

                    CommissionService.getAllCommissionByPagination(tableParams).then(
                        function(successResponse){

                            vm.paginationLoaded = true;
                            
                       		vm.sno = PaginationService.getSno(tableParams);
                            vm.allCommissionByPagination = successResponse.data.commissionDtos;

                            params.total(successResponse.data.totalNumberOfRecords);

                            $defer.resolve(vm.allCommissionByPagination);
                        },
                        function(errorResponse){

                            vm.paginationLoaded = true;
                            vm.allCommissionByPagination.length = 0;
                            $defer.resolve(vm.allCommissionByPagination);

                        });
                	}
            });

		} // end of getAllCommissionTable function
		
		// reset the commission object
		function resetForm() {
			vm.commission = {};
			vm.commission.commissionShareRequest = [{sn: 0, commissionPartnerId: null, commissionValue: null, isDeleted: false}];
			vm.commissionShareError = false;

		} // end  of reset function

		// reset the error message
        function resetError() {
            vm.error = false;
            vm.success = false;
        }// end of resetError function

		function clearCommissionShareErrorMessage() {
			vm.commissionShareError = false;
			vm.commissionShareErrorMessage = '';
		}

		// cancel the edit commission
        function cancelUpdate() {
            vm.editView = false;
            vm.tableParams.reload();

        } // end of cancelUpdate function

        // check the sum of commission value
        function sumOfCommissionValue() {

        	var sumOfCommissionShare = 0;

        	angular.forEach(vm.commission.commissionShareRequest, function(commPartner){
        		sumOfCommissionShare = sumOfCommissionShare + commPartner.commissionValue;
			});

			if(sumOfCommissionShare === vm.commission.totalCommission) {
				return true;
			}else{
				return false;
			}

        }// end of sumOfCommissionValue

		// create commission 
		function createCommission(form) {
			resetError();

			if(sumOfCommissionValue()){
				vm.loaded = false;

				// statically added 
				vm.commission.isBlocked = false;

				CommissionService.createCommission(vm.commission)
				.then(function(successResponse){
					vm.success = true;
					vm.success_message = successResponse.data.message;
					vm.loaded = true;

					vm.fetchedRequiredData();
					vm.resetForm();
					vm.clearCommissionShareErrorMessage();

				}, function(errorResponse){
					vm.loaded = true;
					vm.error = true;
					vm.error_message = errorResponse.data.message;
				});
			}else {
				vm.commissionShareError = true;
				vm.commissionShareErrorMessage = "Sum of Commission Share value is not equal to Total Commission value."
			}

		} // end of createCommission function

		// fetch the commission object of editing commission
		function editCommission(commissionToUpdate) {
			resetError();

			CommissionService.getCommissionById(commissionToUpdate.id)
			.then(function(successResponse){
	            var commission = successResponse.data;

	            vm.commission = angular.copy(commission); // set the response commission object to global commission, we will work in this object

	            // check commissionSlab is defined in commissionSlabDto
	            if(angular.isDefined(vm.commission.commissionSlabDto)) {
	            	vm.commission.commissionSlabId = vm.commission.commissionSlabDto.id;
	            }

	            // set the commissionShare from commissionShareDtos
	            vm.commission.commissionShareRequest = [];
	            angular.forEach(vm.commission.commissionShareDtos, function(commissionShare, key){
	            	if(!commissionShare.isDeleted) {
	            		// push only not deleted commissionShare in commissionShareRequest
	            		vm.commission.commissionShareRequest.push({id: commissionShare.id, commissionPartnerId: commissionShare.commissionPartnerDto.id, commissionValue: commissionShare.commissionValue, isDeleted:false});
	            	}
	            });

	            vm.originalCommission = angular.copy(vm.commission);
	            // render commission slab detail
	            if(vm.commission.commissionType == 'SLAB') {
		            commissionSlabDetail();
	            }
	            vm.editView = true; // render the edit view layout

			}, function(errorResponse){
				vm.error = true;
				vm.error_message = errorResponse.data.message;
			});

		} // end of editCommission

		// update commission
		function updateCommission(form_object) {
			resetError();

			if(sumOfCommissionValue()){

				vm.editView = false;
	            vm.paginationLoaded = false;

	            var slabId = null;

	            if(vm.commission.commissionType == 'SLAB') {
	            	slabId = vm.commission.commissionSlabId;
	            }

	            if(vm.removedPartner) {
	            	// insert removed partner in commissionShareRequest
	            	angular.forEach(vm.removedPartner, function(value, key){
	            		vm.commission.commissionShareRequest.push(value);
	            	});
	            }

	            // set all the commissionShare in commissionShareRequest
	            var commissionShareRequest = [];
	            angular.forEach(vm.commission.commissionShareRequest, function(value, key){
	            	commissionShareRequest.push(value);
	            });

				var commission = {
					id: vm.commission.id,
	                commissionType: vm.commission.commissionType,
	                totalCommission: vm.commission.totalCommission,
	                commissionSlabId: slabId,
	                commissionShareRequest: commissionShareRequest
	            };

				CommissionService.updateCommission(commission, commission.id)
				.then(function(successResponse){
					vm.success = true;
					vm.success_message = successResponse.data.message;
					vm.tableParams.reload();
				}, function(errorResponse){
					vm.error = true;
					vm.error_message = errorResponse.data.message;
					vm.tableParams.reload();
				});

			}else {
				vm.commissionShareError = true;
				vm.commissionShareErrorMessage = "Sum of Commission Share value is not equal to Total Commission value."
			}

		} // end of updateCommission function

		// block/unblock commission
		function blockUnblockCommission(commission) {

			CommissionService.blockUnblockCommission(commission.id)
			.then(function(successResponse){
				vm.success = true;
				vm.success_message = successResponse.data.message;
				
				vm.tableParams.reload();
			}, function(errorResponse){
				vm.error = true;
				vm.error_message = errorResponse.data.message;
				
				vm.tableParams.reload();
			});

		} // end of blockUnblockCommission function

		// render delail modal box of commission
		function detailModal(commission) {

			var modalInstance = $uibModal.open({
		      animation: true,
		      ariaLabelledBy: 'modal-title',
		      ariaDescribedBy: 'modal-body',
		      templateUrl: 'modules/commissionSetup/modal/commission.modal.detailView.html',
		      controller: 'CommissionModalController',
		      controllerAs: 'cmCtrl',
		      size: 'lg',
		      backdrop: false,
		      resolve: {
		        commission: function () {
		          return commission;
		        }
		      }
		    });

		    modalInstance.result
		    .then(function (updated_commission) {
		  		// nothing to do
		    }, function (dismissResponse) {
		    	// nothing to do
		    });

		} // end of detailModal function   
	    
    } // end of Commission Partner Controller

})();

