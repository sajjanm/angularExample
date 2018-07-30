angular.module('adminApp.applicationSetup')
.service('MetaTableService', MetaTableService);

MetaTableService.$inject = ['Restangular'];

function MetaTableService (Restangular){

	var service = {
		getAllMetaDataByFilter : getAllMetaDataByFilter,
		updateMetaDataValue : updateMetaDataValue
	};

	return service;

	// fetch all the records
	function getAllMetaDataByFilter(params) {
		return Restangular.one('metaData', "filterParam").customPOST(params, null);
	} // end of getAllMetaDataByFilter function
	
	// updates meta table value 
	function updateMetaDataValue(metaDataValue){
		return Restangular.one('metaData').customPUT(metaDataValue, null);
	} // end of updateMetaDataValue function

}// end of MetaTable Service function