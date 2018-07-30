(function() {
'use strict';

angular.module('adminApp.profile',[])
.config(['$stateProvider',function($stateProvider) {
        // Now set up the states
        
        $stateProvider
        .state('main_layout.profile', {
			url: 'profile',
			templateUrl: 'modules/profile/views/profile.view.html',
			controller: 'ProfileDetailController',
			controllerAs: 'profileCtrl'
		})
		.state('main_layout.profile.accountInformation', {
			url: '/accountInformation',
			templateUrl: 'modules/profile/views/tabs/profile.view.tab.html',
			data: {
				breadcrumb : ["Profile", "Account Information"]
			}
		})
		.state('main_layout.profile.changePassword', {
			url: '/changePassword',
			templateUrl: 'modules/profile/views/tabs/changePassword.view.html',
			data: {
				breadcrumb : ["Profile", "Change Password"]
			}
		})
		.state('main_layout.profile.activityLog', {
			url: '/activityLog',
			templateUrl: 'modules/profile/views/tabs/activityLog.view.html',
			controller: 'ActivityLogController',
			controllerAs: 'activityLogCtrl',
			data: {
				breadcrumb : ["Profile", "Activity Log"]
			}
		});

    }]);

})();
  