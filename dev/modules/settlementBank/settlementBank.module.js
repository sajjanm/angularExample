(function() {
'use strict';

angular.module('adminApp.settlementBank',[])
.config(['$stateProvider',function($stateProvider) {
        // Now set up the states
        
        $stateProvider
        .state('main_layout.createSettlementBank', {
			url: 'settlementBank/createSettlementBank',
			templateUrl: 'modules/settlementBank/views/settlementBank.create.html',
			controller: 'SettlementBankController',
			controllerAs: 'settlementBankCtrl',
			data: {
				breadcrumb : ["Settlement Bank Setup", "Create Settlement Bank"]
			}
		})
		.state('main_layout.editSettlementBank', {
			url: 'settlementBank/editSettlementBank',
			templateUrl: 'modules/settlementBank/views/settlementBank.view.html',
			controller: 'SettlementBankController',
			controllerAs: 'settlementBankCtrl',
			data: {
				breadcrumb : ["Settlement Bank Setup", "Edit Settlement Bank"]
			}
		})
		.state('main_layout.viewSettlementBankDetails', {
			url: 'settlementBank/viewSettlementBankDetails',
			templateUrl: 'modules/settlementBank/views/settlementBank.noEditView.html',
			controller: 'SettlementBankController',
			controllerAs: 'settlementBankCtrl',
			data: {
				breadcrumb : ["Settlement Bank Setup", "View Settlement Bank Details"]
			}
		});

    }]);

})();

