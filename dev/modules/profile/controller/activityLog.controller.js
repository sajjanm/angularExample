(function() {
'use strict';

    angular.module('adminApp.profile')
    .controller('ActivityLogController', ActivityLogController);

    ActivityLogController.$inject =['ActivityLogService',  'NgTableParams', 'PaginationService'];

    function ActivityLogController(ActivityLogService, NgTableParams, PaginationService) {
        var vm = this;

        // properties
        vm.allActivityLogsPagination = [];
        vm.tableParams = {};
        vm.sno = {};
        vm.paginationLoaded = false;

        // one month previous date
        vm.preMonth = new Date();
        vm.preMonth.setMonth(vm.preMonth.getMonth()-1);

        // from date properties
        vm.fromDateOptions = {
            formatYear: 'yy',
            maxDate: new Date(),
            minDate: new Date(2010, 1, 1),
            showWeeks: false
          };

        // initial value for from date popUp
        vm.fromDatePopup = {
            opened: false
          };

        // flag for from date popUp
        vm.fromDateOpen = function() {
            vm.fromDatePopup.opened = true;
          };

        // to date properties
        vm.toDateOptions = {
            formatYear: 'yy',
            maxDate: new Date(),
            minDate: new Date(2010, 1, 1),
            showWeeks: false
          };

        // initial value for to date popUp
        vm.toDatePopup = {
            opened: false
          };

        // flag for to date popUp
        vm.toDateOpen = function() {
            vm.toDatePopup.opened = true;
          };

        // methods
        vm.getAllActivityLogTable = getAllActivityLogTable;

        // initilaize methods
        activate();
        function activate(){
            
            getAllActivityLogTable();

        } // end of activate function


        // fetch all getAllActivityLogTable table
        function getAllActivityLogTable() {

            vm.allActivityLogsPagination.length = 0;

            vm.tableParams = new NgTableParams({
                // initial value for page
                
                page: 1, // initial page
                count: 10, // number of records in page,
                filter: {
                    "description": '',
                    "fromDate": new Date(vm.preMonth.setHours(0,0,0,0)), 
                    "toDate": new Date(new Date().setHours(23,59,59,59))
                } 
            },
            {
                counts: [],
                total: vm.allActivityLogsPagination.length,
                getData : function( $defer, params){

                    vm.paginationLoaded = false;

                    var tableParams = {
                        pageNumber: params.page(),
                        pageSize: params.count(),
                        filterFieldParams: [
                            {
                                "fieldKey":"description",
                                "fieldValue": params.filter().description
                            }
                        ],
                        filterDateParams: [
                            {
                                "fieldKey":"fromDate",
                                "fieldValue": new Date(params.filter().fromDate.setHours(0,0,0,0))
                            },
                            {
                                "fieldKey":"toDate",
                                "fieldValue": new Date(params.filter().toDate.setHours(23,59,59,59))
                            }
                        ]
                    };

                    ActivityLogService.getAllActivityLogByPagination(tableParams).then(
                        function(successResponse){

                            vm.paginationLoaded = true;

                            vm.sno = PaginationService.getSno(tableParams);
                            vm.allActivityLogsPagination = successResponse.data.activityLogDtos;

                            params.total(successResponse.data.totalNumberOfRecords);

                            $defer.resolve(vm.allActivityLogsPagination);
                        },
                        function(errorResponse){

                            vm.paginationLoaded = true;
                            vm.allActivityLogsPagination.length = 0;
                            $defer.resolve(vm.allActivityLogsPagination);

                        });
                    }
            });

        } // end of getAllActivityLogTable function

    } // end of ActivityLogController controller

})();

