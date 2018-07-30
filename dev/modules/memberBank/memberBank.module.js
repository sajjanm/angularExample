(function() {
'use strict';

angular.module('adminApp.memberBank',[])
.config(['$stateProvider',function($stateProvider) {
        // Now set up the states
        
        $stateProvider
        .state('main_layout.createMemberBank', {
			url: 'memberBank/createMemberBank',
			templateUrl: 'modules/memberBank/views/memberBank.create.html',
			controller: 'MemberBankController',
			controllerAs: 'memberBankCtrl',
			data: {
				breadcrumb : ["Member Bank Setup", "Create Member Bank"]
			}
		})
		.state('main_layout.editMemberBank', {
			url: 'memberBank/editMemberBank',
			templateUrl: 'modules/memberBank/views/memberBank.view.html',
			controller: 'MemberBankController',
			controllerAs: 'memberBankCtrl',
			data: {
				breadcrumb : ["Member Bank Setup", "Edit Member Bank"]
			}
		})
		.state('main_layout.viewMemberBankDetails', {
			url: 'memberBank/viewMemberBankDetails',
			templateUrl: 'modules/memberBank/views/memberBank.noEditView.html',
			controller: 'MemberBankController',
			controllerAs: 'memberBankCtrl',
			data: {
				breadcrumb : ["Member Bank Setup", "View Member Bank Details"]
			}
		});

    }]);

})();

