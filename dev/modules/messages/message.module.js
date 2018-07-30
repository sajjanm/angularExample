(function() {
'use strict';

angular.module('adminApp.message',[])
.config(['$stateProvider',function($stateProvider) {
        // Now set up the states
        
        $stateProvider
        .state('main_layout.composeMessage', {
			url: 'message/composeMessage',
			templateUrl: 'modules/messages/views/message.create.html',
			controller: 'MessageController',
			controllerAs: 'msgCtrl'
		})
		.state('main_layout.inbox', {
			url: 'message/inbox',
			templateUrl: 'modules/messages/views/message.inbox.html',
			controller: 'MessageController',
			controllerAs: 'msgCtrl'
		})
		.state('main_layout.sentMessage', {
			url: 'message/sentMessage',
			templateUrl: 'modules/messages/views/message.sent.html',
			controller: 'MessageController',
			controllerAs: 'msgCtrl'
		});

    }]);

})();

