(function() {
'use strict';

angular.module('adminApp.login',[])
.config(['$stateProvider',function($stateProvider) {
        // Now set up the states
        
        $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'modules/login/views/login.view.html',
            controller: 'LoginController',
            controllerAs: 'loginCtrl'
        });

    }]);

})();

