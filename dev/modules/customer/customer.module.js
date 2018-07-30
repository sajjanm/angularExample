(function() {
'use strict';

angular.module('adminApp.customer',[])
.config(['$stateProvider',function($stateProvider) {
        // Now set up the states
        
        $stateProvider
        .state('main_layout.verifyCustomer', {
            url: 'customer/verifyCustomer',
            templateUrl: 'modules/customer/views/customer.verify.html',
            controller: 'CustomerController',
            controllerAs: 'customerCtrl',
			data: {
				breadcrumb : ["Customer Setup", "Verify Customer"]
			}
        })
        .state('main_layout.unblockCustomer', {
            url: 'customer/unblockCustomer',
            templateUrl: 'modules/customer/views/customer.unblock.tableView.html',
            controller: 'CustomerController',
            controllerAs: 'customerCtrl',
            data: {
                breadcrumb : ["Customer Setup", "Unblock Customer"]
            }
        });

    }]);

})();

