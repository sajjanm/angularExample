(function() {
'use strict';

angular.module('adminApp.customerProfile',[])
.config(['$stateProvider',function($stateProvider) {
        // Now set up the states
        
        $stateProvider
        .state('main_layout.createCustomerProfile', {
			url: 'customerProfile/createCustomerProfile',
			templateUrl: 'modules/customerProfile/views/customerProfile.create.html',
			controller: 'CustomerProfileController',
			controllerAs: 'customerProfileCtrl',
			data: {
				breadcrumb : ["Customer Profile Setup", "Create Customer Profile"]
			}
		})
		.state('main_layout.editCustomerProfile', {
			url: 'customerProfile/editCustomerProfile',
			templateUrl: 'modules/customerProfile/views/customerProfile.view.html',
			controller: 'CustomerProfileController',
			controllerAs: 'customerProfileCtrl',
			data: {
				breadcrumb : ["Customer Profile Setup", "Edit Customer Profile"]
			}
		});

    }]);

})();

