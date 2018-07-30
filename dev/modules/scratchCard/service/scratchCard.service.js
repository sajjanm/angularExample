angular.module('adminApp.scratchCard')
.service('ScratchCardService', ScratchCardService);

ScratchCardService.$inject=['Restangular']

function ScratchCardService(Restangular){ 

	var service = {
		uploadFile : uploadFile,
		excelFileDetails : excelFileDetails,
		approveScratchCardPins : approveScratchCardPins,
		previewScratchCardPins : previewScratchCardPins,
		getApprovedRechargeCardListPagination : getApprovedRechargeCardListPagination
	};

	return service;

	// Fetch the contents inside the Recharge Card Excel File
	function excelFileDetails(form) {        
        return Restangular.all('SmartCardAdmin/scratchCard/scratchCardUploadList')
        .withHttpConfig({transformRequest: angular.identity})
          .customPOST(form,'',undefined,{'Content-Type': undefined});
	}

	// confirm the scratch card uploading
	function uploadFile(confirmRechargeObject){
		return Restangular.all('SmartCardAdmin/scratchCard/confirmScratchCardUpload').post(confirmRechargeObject);
	}

	//fetching card info list pagination
	function getApprovedRechargeCardListPagination(params) {
		return Restangular.one('SmartCardAdmin/scratchCard/', 'filterParam').customPOST(params, null);	
	}

	// fetch the details of selected pin numbers
	function previewScratchCardPins(details){
		return Restangular.one('SmartCardAdmin/scratchCard/', 'preview').customPOST(details, null);
	}

	// activates the selected pin numbers
	function approveScratchCardPins(details){
		return Restangular.one('SmartCardAdmin/scratchCard/', 'accept').customPOST(details, null);
	} 

}