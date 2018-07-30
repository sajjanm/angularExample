(function() {
'use strict';

angular.module('adminApp',
	[
	'ui.router',
	'ngStorage',
	'ngSanitize',
	'restangular',
	'ui.bootstrap',
	'ui.select',
	'ngFileUpload',
	'ngImgCrop',
	'ngTable',
	'ngFileSaver',
	'textAngular',
	'ngTagsInput',
	'xeditable',

	// sub modules
	'adminApp.admin',
	'adminApp.adminProfile',
	'adminApp.applicationSetup',
	'adminApp.changePassword',
	'adminApp.commissionSetup',
	'adminApp.customer',
	'adminApp.customerProfile',
	'adminApp.invoice',
	'adminApp.login',
	'adminApp.memberBank',
	'adminApp.memberBankProfile',
	'adminApp.message',
	'adminApp.profile',
	'adminApp.scratchCard',
	'adminApp.settlementBank',
	'adminApp.settlementBankProfile'
	
	])
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){

			// For any unmatched url, send to /dashboard
			$urlRouterProvider.otherwise("/dashboard");
			
			$stateProvider
			.state('main_layout', {
				url: '/',
				abstract: true,
				controller: 'DashboardController',
				controllerAs: 'dashboardCtrl',
				templateUrl: 'includes/main.html'
			})
			.state('main_layout.dashboard', {
				url: 'dashboard',
				templateUrl: 'modules/dashboard/views/dashboard.view.html'
			});
		}]);

})();