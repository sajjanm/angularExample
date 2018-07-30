(function() {
'use strict';

angular.module('adminApp.adminProfile',[])
.config(['$stateProvider',function($stateProvider) {
        // Now set up the states
        
        $stateProvider
        .state('main_layout.createAdminProfile', {
			url: 'adminProfile/createAdminProfile',
			templateUrl: 'modules/adminProfile/views/adminProfile.create.html',
			controller: 'AdminProfileController',
			controllerAs: 'adminProfileCtrl',
			data: {
				breadcrumb : ["Admin Profile", "Create Admin Profile"]
			}
		})
		.state('main_layout.editAdminProfile', {
			url: 'adminProfile/editAdminProfile',
			templateUrl: 'modules/adminProfile/views/adminProfile.view.html',
			controller: 'AdminProfileController',
			controllerAs: 'adminProfileCtrl',
			data: {
				breadcrumb : ["Admin Profile", "Edit Admin Profile"]
			}
		});

    }]);

})();

