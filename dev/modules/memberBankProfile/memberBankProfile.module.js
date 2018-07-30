(function() {
'use strict';

angular.module('adminApp.memberBankProfile',[])
.config(['$stateProvider',function($stateProvider) {
        // Now set up the states
        
        $stateProvider
        .state('main_layout.createMemberBankProfile', {
			url: 'memberBankProfile/createMemberBankProfile',
			templateUrl: 'modules/memberBankProfile/views/memberBankProfile.create.html',
			controller: 'MemberBankProfileController',
			controllerAs: 'memberBankProfileCtrl',
			data: {
				breadcrumb : ["Member Bank Profile Setup", "Create Member Bank Profile"]
			}
		})
		.state('main_layout.editMemberBankProfile', {
			url: 'memberBankProfile/editMemberBankProfile',
			templateUrl: 'modules/memberBankProfile/views/memberBankProfile.view.html',
			controller: 'MemberBankProfileController',
			controllerAs: 'memberBankProfileCtrl',
			data: {
				breadcrumb : ["Member Bank Profile Setup", "Edit Member Bank Profile"]
			}
		});

    }]);

})();

