(function() {
'use strict';

angular.module('adminApp.admin',[])
.config(['$stateProvider',function($stateProvider) {
        // Now set up the states
        
        $stateProvider
        .state('main_layout.createAdmin', {
			url: 'admin/createAdmin',
			templateUrl: 'modules/admin/views/admin.create.html',
			controller: 'AdminController',
			controllerAs: 'adminCtrl',
			data: {
				breadcrumb : ["Admin", "Create Admin"]
			}
		})
		.state('main_layout.editAdmin', {
			url: 'admin/editAdmin',
			templateUrl: 'modules/admin/views/admin.view.html',
			controller: 'AdminController',
			controllerAs: 'adminCtrl',
			data: {
				breadcrumb : ["Admin", "Edit Admin"]
			}
		})
		.state('main_layout.viewAdminDetails', {
			url: 'admin/viewAdminDetails',
			templateUrl: 'modules/admin/views/admin.noEditView.html',
			controller: 'AdminController',
			controllerAs: 'adminCtrl',
			data: {
				breadcrumb : ["Admin", "View Admin Details"]
			}
		});

    }]);

})();

