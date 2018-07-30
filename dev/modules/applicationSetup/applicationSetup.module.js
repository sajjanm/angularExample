(function(){
'use strict';

	angular.module('adminApp.applicationSetup',[])
	.config(['$stateProvider',function($stateProvider){

		$stateProvider
		.state('main_layout.passwordPolicy',{
			url:'passwordPolicy',
			templateUrl: 'modules/applicationSetup/views/passwordPolicy.view.html',
			controller: 'PasswordController',
			controllerAs: 'pwdCtrl',
			data: {
				breadcrumb : ["Application Setup", "Password Policy"]
			}
		})

		.state('main_layout.smartCardConfig',{
			url:'metaData',
			templateUrl: 'modules/applicationSetup/views/metaTable.tableView.html',
			controller: 'MetaTableController',
			controllerAs: 'metaCtrl',
			data: {
				breadcrumb : ["Application Setup", "Meta Data"]
			}
		});

	}]);

})();