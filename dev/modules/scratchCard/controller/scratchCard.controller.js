(function() {
	'use strict';

	angular.module('adminApp.scratchCard')
	.controller('ScratchCardController', ScratchCardController);

	ScratchCardController.$inject = ['$uibModal', 'ScratchCardService', 'NgTableParams', 'PaginationService'];

	function ScratchCardController($uibModal, ScratchCardService, NgTableParams, PaginationService) {

		var vm = this;

		// properties
		vm.error = false;
		vm.success = false;
		vm.error_message='';
		vm.success_message='';
		vm.loaded = false;
		vm.detailView = false; // Boolean value to trigger page change

		// values related to upload excel file
		vm.excelFile={};		// Stores the main file uploaded from the view
		vm.scratchCardDetails = []; // Stores the Parsed Values of the Excel file
		vm.scratchCardAmount = ''; // Stores the amount for each recharge card from the UI
		vm.expiryDate = ''; // expiry date for each scratch card
		vm.batchName = ''; // batch name for each scratch card
		vm.confirmScratchObject = {};	// used to send the rechargecard details and the amount to back end
		vm.approveButton = false;
		vm.previewMode = false; // 

		vm.validationError = {};

		// pagination
		vm.totalItems = {};
		vm.currentPage = 1;
		vm.itemsPerPage = 10;
		vm.maxSize = 5; //number of pager buttons to show

		// values related to approved RechargeCard file
		vm.approvedScratchCards = []; // stores the value of approved scratch cards list
		vm.tableParams = {};
		vm.sno = {};
		vm.paginationLoaded = false;
        vm.approvedScratchCardDetail = []; // contains the scratch card details
        vm.confirmedScratchCardDetail = [];

        vm.approve = {};
        vm.approve.range = {id: 0, from: '', to: ''};
        vm.approve.specific = [];
        vm.approve.selectAll = false;
        // expiry date properties
        vm.expiryDateOptions = {
        	formatYear: 'yy',
        	showWeeks: false,
        	minDate: new Date()
        };

        vm.serialNumberList = [];

        // initial value for expiry date popUp
        vm.expiryDatePopup = {
        	opened: false
        };

        // flag for expiry date popUp
        vm.expiryDateOpen = function() {
        	vm.expiryDatePopup.opened = true;
        };


		// methods
		vm.resetError = resetError;
		vm.cancelActivate = cancelActivate;

		vm.uploadFile = uploadFile;
		vm.fetchExcelDetails = fetchExcelDetails;
		vm.resetUploadPageDatas = resetUploadPageDatas;

		vm.approveScratch = approveScratch;
		vm.approveScratchCardPins = approveScratchCardPins;
		vm.getApprovedRechargeCard = getApprovedRechargeCard;
		vm.previewScratchCardDetails = previewScratchCardDetails;

		vm.viewUploadExcelSheet = viewUploadExcelSheet;

		vm.isValid = isValid;

		// pagination method
		vm.setPage = setPage;

		function setPage(pageNo) {
			vm.currentPage = pageNo;
		}

		// initilaize methods
		activate();
		function activate(){
			getApprovedRechargeCard();

		} // end of activate function

		// fetch all recharge card information table
		function getApprovedRechargeCard() {
			resetError();

			vm.approvedScratchCards.length = 0;

			vm.tableParams = new NgTableParams({
                // initial value for page
                
                page: 1, // initial page
                count: 10, // number of records in page,
                filter: {
                	"uploadedBy": ''
                } 
            },
            {
            	counts: [],
            	total: vm.approvedScratchCards.length,
            	getData : function( $defer, params){

            		vm.paginationLoaded = false;

            		var tableParams = {
            			pageNumber: params.page(),
            			pageSize: params.count(),
            			filterFieldParams: [
            			{
            				"fieldKey":"uploadedBy",
            				"fieldValue": params.filter().uploadedBy,
            			}
            			]
            		};

            		ScratchCardService.getApprovedRechargeCardListPagination(tableParams)
            		.then(function(successResponse){

            			vm.paginationLoaded = true;

            			vm.sno = PaginationService.getSno(tableParams);
            			vm.approvedScratchCards = successResponse.data.scratchCardDto;

            			params.total(successResponse.data.totalNumberOfRecords);

            			$defer.resolve(vm.approvedScratchCards);
            		},
            		function(errorResponse){

            			vm.paginationLoaded = true;
            			vm.approvedScratchCards.length = 0;
            			$defer.resolve(vm.approvedScratchCards);

            		});
            	}
            });
        } // end of getApprovedRechargeCard() function

		// calls the service function to send file to Backend as to Fetch the Details
		function fetchExcelDetails(form){
			resetError();
			vm.scratchCardDetails = [];
			vm.totalItems = {};

			var fileData = new FormData();
			fileData.append("file", vm.excelFile.file);
			
			ScratchCardService.excelFileDetails(fileData)
			.then(function(successResponse){
				var cardDetails = successResponse.data.scratchCardExcelDetails;

				angular.forEach(cardDetails, function(cardDetail){
					vm.scratchCardDetails.push(cardDetail);
				});

				vm.totalItems = vm.scratchCardDetails.length;
				vm.loaded = true;

			}, function(errorResponse){
				vm.error = true;
				vm.error_message = errorResponse.data.message;
				
			});
		} // end of fetchExcelDetails function

		// render the upload excel sheet view
		function viewUploadExcelSheet(form) {
			resetError();

			// reset the uploaded file and values
			vm.resetUploadPageDatas();

			form.$setPristine();
			form.$setUntouched();
			
			vm.loaded = false;
		}// end of viewUploadExcelSheet() function

		// calls the service function to upload file to Backend
		function uploadFile(formData){		
			resetError();
			resetForm(formData);

			vm.confirmScratchObject = {
				scratchCardExcelDetails : vm.scratchCardDetails,
				amount : vm.scratchCardAmount,
				expiryDate: vm.expiryDate,
				batchName: vm.batchName
			}

			ScratchCardService.uploadFile(vm.confirmScratchObject)
			.then(function(successResponse){
				vm.success = true;
				vm.success_message = 'Upload Successfully! ';
				vm.resetUploadPageDatas();
				vm.loaded= false;

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
		} // end of upload File function

		function resetUploadPageDatas(){
			
			vm.excelFile={}; 
			vm.excelFile.file='';
			vm.scratchCardDetails = [];
			vm.batchName = ''; 
			vm.expiryDate = '';
			vm.scratchCardAmount = '';
			vm.confirmScratchObject = {};
		} // end of resetUploadPageDatas function

		// reset the error message
		function resetError() {
			vm.error = false;
			vm.success = false;
		}// end of resetError function
		
		// function to reset form 
		function resetForm(formData) {
			formData.$setPristine();
			formData.$setUntouched();

		}// end of resetForm function

		// displays the list of recarge cards to activate :: It acts as a toggle for list view to detail view while activation
		function approveScratch(scratchCardDetail){
			vm.detailView = true; 
			vm.approvedScratchCardDetail = scratchCardDetail; 
			vm.totalItems = vm.approvedScratchCardDetail.scratchCardDetailDtos.length;

			vm.approve.batchName = vm.approvedScratchCardDetail.batchName;

			vm.serialNumberList = [];

			angular.forEach(vm.approvedScratchCardDetail.scratchCardDetailDtos  , function(serialNumber){
				vm.serialNumberList.push(serialNumber.serialNumber);
			});
		}// end of approveScratch function

        // cancel the activate scratch card pins and also change the values to their default state
        function cancelActivate() {
        	vm.detailView = false;
        	vm.totalItems = {};
        	vm.confirmedScratchCardDetail = [];
        	vm.approvedScratchCardDetail = []; 
        	vm.serialNumberList = [];
        	vm.tableParams.reload();
        	vm.previewMode = false;

        	vm.approve = {};
        	vm.approve.range = {id: 0, from: '', to: ''};
        	vm.approve.specific = [];
        	vm.approve.selectAll = false;
        	vm.approve.batchName = '';
        } // end of cancelActivate function

        // fetch the pin details from back end
        function previewScratchCardDetails(){
        	resetError();
        	vm.paginationLoaded = false;

        	ScratchCardService.previewScratchCardPins(vm.approve)
        	.then(function(successResponse){

        		vm.previewMode = true;
        		vm.paginationLoaded = true;

        		vm.totalItems = successResponse.data.length;

        		angular.forEach(successResponse.data , function(details){
        			vm.confirmedScratchCardDetail.push(details);
        		});

        	}, function(errorResponse){

        	});
        } // end of previewScratchCardDetails function

        // sends the request to back end for pin activation :: used by pin activation page
        function approveScratchCardPins(){
        	resetError();

        	ScratchCardService.approveScratchCardPins(vm.approve)
        	.then(function(successResponse){
        		vm.success = true;
        		vm.success_message = successResponse.data.message;
        		cancelActivate();
        		vm.tableParams.reload();
        	}, function(errorResponse){
        		vm.error = false;
        		vm.error_message = errorResponse.data.message;
        	});
        }// end of approveScratchCardPins function

        // validate disable functionality for confirm button in activating pin number page
        function isValid() {

        	if(specificValue() || range()){
        		return true;
        	}else{
        		return false;
        	}

        	function range(){
        		if(angular.isDefined(vm.approve.range.from) && angular.isDefined(vm.approve.range.to)) {
        			if(vm.approve.range.from != '' && vm.approve.range.to != '') {
        				return true;
        			}else{
        				return false;
        			}
        		}else{
        			return false;
        		}	
        	}
        	
        	function specificValue() {
        		if(angular.isDefined(vm.approve.specific)) {
        			if(vm.approve.specific.length > 0) {
        				return true;
        			}else{
        				return false;
        			}
        		}else{
        			return false;
        		}
        	}        	
        } // end pf isValid function

	} // end of recharge card controller
})();

