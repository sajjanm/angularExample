(function() {
	'use strict';

	angular.module('adminApp.applicationSetup')
	.controller('MetaTableController', MetaTableController);

	MetaTableController.$inject = ['MetaTableService', 'NgTableParams', 'PaginationService'];

	function MetaTableController(MetaTableService, NgTableParams, PaginationService){

		var vm = this;

        vm.loaded = false;
        vm.error = false;
        vm.success = false;
        vm.error_message = '';
        vm.success_message = '';
		vm.validationError = {};

        vm.pencilViewForedit = true;

        vm.allMetaDataPagination = [];
        vm.tableParams = {};
        vm.sno = {};
        vm.paginationLoaded = false;

        vm.user = {
		    name: 'awesome user'
		  };

        // methods
        vm.resetError = resetError;
        vm.editFieldValue = editFieldValue;
        vm.editFieldValueToggle = editFieldValueToggle;
        vm.getAllMetaDataByFilter = getAllMetaDataByFilter;

        
        // initilaize methods
        activate();
        function activate(){
            getAllMetaDataByFilter();

        } // end of activate function


        // fetch all meta table datas
        function getAllMetaDataByFilter() {

            vm.allMetaDataPagination.length = 0;

            vm.tableParams = new NgTableParams({
                // initial value for page
                
                page: 1, // initial page
                count: 15, // number of records in page,
                filter: {
                    "lableName": ''
                } 
            },
            {
                counts: [],
                total: vm.allMetaDataPagination.length,
                getData : function( $defer, params){

                    vm.paginationLoaded = false;

                    var tableParams = {
                        pageNumber: params.page(),
                        pageSize: params.count(),
                        filterFieldParams: [
                            {
                                "fieldKey":"lableName",
                                "fieldValue": params.filter().lableName,
                            }
                        ]
                    };

                    MetaTableService.getAllMetaDataByFilter(tableParams).then(
                        function(successResponse){

                            vm.paginationLoaded = true;

                            vm.sno = PaginationService.getSno(tableParams);
                            vm.allMetaDataPagination = successResponse.data.metaTableDtos;

                            params.total(successResponse.data.totalNumberOfRecords);

                            $defer.resolve(vm.allMetaDataPagination);
                        },
                        function(errorResponse){

                            vm.paginationLoaded = true;
                            vm.allMetaDataPagination.length = 0;
                            $defer.resolve(vm.allMetaDataPagination);

                        });
                    }
            });
        } // end of getAllMetaDataByFilter function

        // it will only change the pencil icon to tick icon on view
        function editFieldValueToggle(id){
        	if(vm.pencilViewForedit){
        		vm.pencilViewForedit = false;
        	}else {
        		vm.pencilViewForedit = true;
        	}
        } // end of editFieldValue function

        // it change the value of particular field
        function editFieldValue(metaData, mainValue){

            resetError();

        	var datas = {
        		labelName : metaData.lableName,
        		fieldValue : mainValue
        	}

        	MetaTableService.updateMetaDataValue(datas)
        	.then(function(successResponse){
				vm.success = true;
				vm.success_message = successResponse.data.message;
				// editFieldValueToggle(metaData.id);
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

        } // end of editFieldValue function 


		// reset the error message
		function resetError() {
		    vm.error = false;
		    vm.success = false;
		}// end of resetError function

	} // end of MetaTable Controller function

})();