(function() {
'use strict';

angular.module('adminApp.changePassword',[])
.config(['$stateProvider',function($stateProvider) {
        // Now set up the states
        
        $stateProvider
        .state('change_password', {
            url: '/changePassword',
            templateUrl: 'modules/changePassword/views/changePassword.main.view.html',
            controller: 'ChangePasswordController',
            controllerAs: 'cpcCtrl'
         });    

    }]);

})();