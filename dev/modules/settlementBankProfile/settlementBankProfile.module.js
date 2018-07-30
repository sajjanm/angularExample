(function() {
'use strict';

angular.module('adminApp.settlementBankProfile',[])
.config(['$stateProvider',function($stateProvider) {
        // Now set up the states
        
        $stateProvider
        .state('main_layout.createSettlementBankProfile', {
			url: 'settlementBankProfile/createSettlementBankProfile',
			templateUrl: 'modules/settlementBankProfile/views/settlementBankProfile.create.html',
			controller: 'SettlementBankProfileController',
			controllerAs: 'settlementBankProfileCtrl',
			data: {
				breadcrumb : ["Settlement Bank Profile Setup", "Create Settlement Bank Profile"]
			}
		})
		.state('main_layout.editSettlementBankProfile', {
			url: 'settlementBankProfile/editSettlementBankProfile',
			templateUrl: 'modules/settlementBankProfile/views/settlementBankProfile.view.html',
			controller: 'SettlementBankProfileController',
			controllerAs: 'settlementBankProfileCtrl',
			data: {
				breadcrumb : ["Settlement Bank Profile Setup", "Edit Settlement Bank Profile"]
			}
		});

    }]);

})();

