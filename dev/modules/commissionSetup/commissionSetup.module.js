(function() {
'use strict';

angular.module('adminApp.commissionSetup',[])
.config(['$stateProvider',function($stateProvider) {
        // Now set up the states
        
        $stateProvider
        .state('main_layout.createCommission', {
			url: 'commissionSetup/createCommission',
			templateUrl: 'modules/commissionSetup/views/commission/commission.create.html',
			controller: 'CommissionController',
			controllerAs: 'commissionCtrl',
			data: {
				breadcrumb : ["Commission Setup", "Create Commission"]
			}
		})
		.state('main_layout.editCommission', {
			url: 'commissionSetup/editCommission',
			templateUrl: 'modules/commissionSetup/views/commission/commission.view.html',
			controller: 'CommissionController',
			controllerAs: 'commissionCtrl',
			data: {
				breadcrumb : ["Commission Setup", "Edit Commission"]
			}
		})
        .state('main_layout.createCommissionPartner', {
			url: 'commissionSetup/createCommissionPartner',
			templateUrl: 'modules/commissionSetup/views/commissionPartner/commissionPartner.create.html',
			controller: 'CommissionPartnerController',
			controllerAs: 'commissionPartnerCtrl',
			data: {
				breadcrumb : ["Commission Setup", "Create Commission Partner"]
			}
		})
		.state('main_layout.editCommissionPartner', {
			url: 'commissionSetup/editCommissionPartner',
			templateUrl: 'modules/commissionSetup/views/commissionPartner/commissionPartner.view.html',
			controller: 'CommissionPartnerController',
			controllerAs: 'commissionPartnerCtrl',
			data: {
				breadcrumb : ["Commission Setup", "Edit Commission Partner"]
			}
		})
		.state('main_layout.createCommissionSlab', {
			url: 'commissionSetup/createCommissionSlab',
			templateUrl: 'modules/commissionSetup/views/commissionSlab/commissionSlab.create.html',
			controller: 'CommissionSlabController',
			controllerAs: 'commissionSlabCtrl',
			data: {
				breadcrumb : ["Commission Setup", "Create Commission Slab"]
			}
		})
		.state('main_layout.editCommissionSlab', {
			url: 'commissionSetup/editCommissionSlab',
			templateUrl: 'modules/commissionSetup/views/commissionSlab/commissionSlab.view.html',
			controller: 'CommissionSlabController',
			controllerAs: 'commissionSlabCtrl',
			data: {
				breadcrumb : ["Commission Setup", "Edit Commission Slab"]
			}
		});

    }]);

})();

