(function() {
'use strict';

	angular.module('adminApp.commissionSetup')
	.controller('CommissionSlabController', CommissionSlabController);

	CommissionSlabController.$inject = ['CommissionSlabService', '$uibModal', 'NgTableParams', 'PaginationService'];

	function CommissionSlabController(CommissionSlabService, $uibModal, NgTableParams, PaginationService) {

		var vm = this;

		// properties
		vm.slab = {};
		vm.originalSlab = {};
		vm.allSlab = [];

		vm.loaded = false;
		vm.error = false;
		vm.success = false;
		vm.error_message = '';
		vm.success_message = '';

		vm.allSlabByPagination = [];
		vm.tableParams = {};
		vm.sno = {};
		vm.paginationLoaded = false;

		vm.validationError = {};

		vm.editView = false;

		// initial value of chargeType
		vm.chargeType = [
					// {name: "In Percentage", value: "PERCENTAGE"}, 
					{name: "In Flat", value: "FLAT"}
				];

		// initial value for commissionSlabValueRequests
		vm.slab.commissionSlabValueRequests = [{id: 0, rangeFrom: 0, rangeTo: null, charge: null, chargeType: null, andAboveRange: false}];

		vm.rangeError = false;
		vm.showAboveRange = false;
		vm.rangeErrorMessage = '';

		// methods
		vm.getAllSlab = getAllSlab;
		vm.resetForm = resetForm;
		vm.getAllSlabTable = getAllSlabTable;
		vm.cancelUpdate = cancelUpdate;

		vm.resetError = resetError;
		vm.clearValidationError = clearValidationError;

		// methods for commissionSlabValues 
		vm.addNewRange = addNewRange;
		vm.removeRange = removeRange;
		vm.checkRangeFrom = checkRangeFrom;
		vm.checkRangeTo = checkRangeTo;
		vm.disableAddNewRange = disableAddNewRange;

		// CRUD methods
		vm.createSlab = createSlab;
		vm.updateSlab = updateSlab;
		vm.deleteSlab = deleteSlab;

		// modal methods
		vm.detailModal = detailModal;
		vm.deleteModal = deleteModal;
		vm.editSlab = editSlab;

		// initilaize methods
		activate();
		function activate(){
			// getAllSlab();
			getAllSlabTable();

		} // end of activate function

		// function to add new range
		function addNewRange() {
			var len = vm.slab.commissionSlabValueRequests.length;
			var prevRangeTo = vm.slab.commissionSlabValueRequests[len-1].rangeTo;

			vm.slab.commissionSlabValueRequests.push({id: length, rangeFrom: prevRangeTo, rangeTo: null, charge: null, chargeType: null, andAboveRange: false});
		}// end of addNewRange function

		// function to remove the range row
		function removeRange(index) {

			vm.slab.commissionSlabValueRequests.splice(index, 1);

		}// end of removeRange function

		// function for validation of RangeFrom value
		function checkRangeFrom(index) {
			// range from must be greater than previous range to
			var len = vm.slab.commissionSlabValueRequests.length;

			// need to check only if new row is added
			if(len > 1) {
				var prevRangeTo = vm.slab.commissionSlabValueRequests[index-1].rangeTo;
				var currentRangeFrom = vm.slab.commissionSlabValueRequests[index].rangeFrom;

				if(currentRangeFrom < prevRangeTo) {
					vm.rangeError = true;
					vm.rangeErrorMessage = "Current Range From value " + currentRangeFrom + " must be greater than Previous Range To value " + prevRangeTo;

					// set the current rangeFrom value to null
					vm.slab.commissionSlabValueRequests[index].rangeFrom = null;
				} else {
					vm.rangeError = false;
				}
			}

		}// end of checkRangeFrom function

		// function for validation of RangeTo value
		function checkRangeTo(index) {
			// range to must be greater than current range from
			var len = vm.slab.commissionSlabValueRequests.length;

			var currentRangeTo = vm.slab.commissionSlabValueRequests[index].rangeTo;
			var currentRangeFrom = vm.slab.commissionSlabValueRequests[index].rangeFrom;

			if(currentRangeFrom >= currentRangeTo) {
				vm.rangeError = true;
				// vm.rangeErrorMessage = "Current Range To value " + currentRangeTo + " must be greater than Current Range From value " + currentRangeFrom;
				vm.rangeErrorMessage = "Must be greater than " + currentRangeFrom;

				// set the current rangeFrom value to null
				vm.slab.commissionSlabValueRequests[index].rangeTo = null;
			} else {
				vm.rangeError = false;
			}
		} // end of function checkRangeTo

		// function to render addNewRange button
		function disableAddNewRange(val, index) {
			if(val === true) {
				vm.showAboveRange = true;
				vm.slab.commissionSlabValueRequests[index].rangeTo = vm.slab.commissionSlabValueRequests[index].rangeFrom;

			}else{
				vm.slab.commissionSlabValueRequests[index].rangeTo = null;
				vm.showAboveRange = false;
			}
		}// end of function disableAddNewRange

		// fetch all slabs
		function getAllSlab() {
			vm.allSlab = [];

			CommissionSlabService.getAllSlab()
			.then(function(successResponse) {
				var slabs = successResponse.data;

				angular.forEach(slabs, function(slab){
					vm.allSlab.push(slab);
				});

			}, function(errorResponse) {
				// for error
			});

		} // end of getAllSlab function

		// fetch all slabs table
		function getAllSlabTable() {

			vm.allSlabByPagination.length = 0;

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
                total: vm.allSlabByPagination.length,
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

                    CommissionSlabService.getAllSlabByPagination(tableParams).then(
                        function(successResponse){

                            vm.paginationLoaded = true;
                            
                       		vm.sno = PaginationService.getSno(tableParams);
                            vm.allSlabByPagination = successResponse.data.commissionSlabDtos;

                            params.total(successResponse.data.totalNumberOfRecords);

                            $defer.resolve(vm.allSlabByPagination);
                        },
                        function(errorResponse){

                            vm.paginationLoaded = true;
                            vm.allSlabByPagination.length = 0;
                            $defer.resolve(vm.allSlabByPagination);

                        });
                	}
            });

		} // end of getAllSlabTable function
		
		// reset the slab object
		function resetForm(form) {
			form.$setPristine();
    		form.$setUntouched();

			vm.slab = {};
			vm.slab.commissionSlabValueRequests = [{id: 0, rangeFrom: null, rangeTo: null, charge: null, chargeType: null, andAboveRange: false}];
		} // end  of reset function

		function resetError() {
		    vm.error = false;
		    vm.success = false;
		    vm.validationError = {};
		}// end of resetError function

		// cancel the edit slab
        function cancelUpdate() {
            vm.editView = false;
            vm.tableParams.reload();

        } // end of cancelUpdate function

        // clear the validation message from backend if exist
		function clearValidationError(field) {
		    if(angular.isDefined(vm.validationError[field])){
		        delete vm.validationError[field];
		    }
		} // end of clearValidationError function

		// create slab 
		function createSlab(form) {
			resetError();
			vm.loaded = false;

			CommissionSlabService.createSlab(vm.slab)
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
			
		} // end of createSlab function

		// fetch the slab object of editing slab
		function editSlab(slabToUpdate) {
			resetError();

			CommissionSlabService.getSlabById(slabToUpdate.id)
			.then(function(successResponse){
	            vm.success = false;

	            vm.slab = angular.copy(slabToUpdate); // set the response slab object to global slab, we will work in this object
	            vm.slab.commissionSlabValueRequests = angular.copy(slabToUpdate.commissionSlabValueDtos);

	            angular.forEach(vm.slab.commissionSlabValueDtos, function(value, key){
	            	if(value.andAboveRange == true) {
	            		vm.showAboveRange = true;
	            	}
	            });

	            delete vm.slab.commissionSlabValueDtos;

	            vm.originalSlab = angular.copy(slabToUpdate);

	            vm.editView = true; // render the edit view layout

			}, function(errorResponse){
				vm.error = true;
				vm.error_message = errorResponse.data.message;
			});

		} // end of editSlab

		// update slab
		function updateSlab(form_object) {
			resetError();

            vm.paginationLoaded = false;
			var slab = {
				id: vm.slab.id,
                name: vm.slab.name,
                description: vm.slab.description
            };

			CommissionSlabService.updateSlab(slab, slab.id)
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

		} // end of updateSlab function

		// delete slab
		function deleteSlab(slab, slab_id) {
			resetError();

			CommissionSlabService.deleteSlab(slab, slab_id)
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

		} // end of deleteSlab function

		// render delail modal box of slab
		function detailModal(slab) {

			var modalInstance = $uibModal.open({
		      animation: true,
		      ariaLabelledBy: 'modal-title',
		      ariaDescribedBy: 'modal-body',
		      templateUrl: 'modules/commissionSetup/modal/commissionSlab.modal.detailView.html',
		      controller: 'CommissionSlabModalController',
		      controllerAs: 'csmCtrl',
		      size: 'lg',
		      backdrop: false,
		      resolve: {
		        slab: function () {
		          return slab;
		        }
		      }
		    });

		    modalInstance.result
		    .then(function (updated_slab) {
		  		// nothing to do
		    }, function (dismissResponse) {
		    	// nothing to do
		    });

		} // end of detailModal function 

		// render the delete modal box of deleting slab
		function deleteModal(slabToDelete) {

			var modalInstance = $uibModal.open({
		      animation: true,
		      ariaLabelledBy: 'modal-title',
		      ariaDescribedBy: 'modal-body',
		      templateUrl: 'modules/commissionSetup/modal/commissionSlab.modal.delete.html',
		      controller: 'CommissionSlabModalController',
		      controllerAs: 'csmCtrl',
		      size: 'lg',
		      backdrop: false,
		      resolve: {
		        slab: function () {
		          return slabToDelete;
		        }
		      }
		    });

		    modalInstance.result
		    .then(function (deleted_slab) {
		    	var slab = {
		    		name: deleted_slab.name,
                	description: deleted_slab.description,
                    deletedReason: deleted_slab.deletedReason
		    	};

		    	vm.paginationLoaded = false;
		    	// delete slab
		     	vm.deleteSlab(slab, deleted_slab.id);
		     	
		    }, function (dismissResponse) {
		    	// nothing to do
		    });

		} // end of deleteModal function     
	    
    } // end of Commission Partner Controller

})();

