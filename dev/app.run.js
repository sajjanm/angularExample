(function() {
	'use strict';

	var apiConfig = {
		"api":{
			"url": 'http://localhost:8080/smartCard-admin-web/api/' // localhost server
			// "url": 'https://sc-adm.f1soft.com.np/api/' // test server
		// "url": 'https://adm.smartcardnepal.com/api/' // live server
	}
};

angular.module('adminApp')
.config(['RestangularProvider', function(RestangularProvider) {
	RestangularProvider.setBaseUrl(apiConfig.api.url);
	RestangularProvider.setFullResponse(true);
}])
.config(['$uibTooltipProvider', function($uibTooltipProvider) {
	$uibTooltipProvider.options({ 'appendToBody': true });
}])
.config(['$provide', function($provide) {
		// this demonstrates how to register a new tool and add it to the default toolbar
		$provide.decorator('taOptions', ['$delegate', function(taOptions){
            // $delegate is the taOptions we are decorating
            // here we override the default toolbars and classes specified in taOptions.
            taOptions.forceTextAngularSanitize = true; // set false to allow the textAngular-sanitize provider to be replaced
            taOptions.keyMappings = []; // allow customizable keyMappings for specialized key boards or languages
            taOptions.toolbar = [
            ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
            // ['bold', 'italics', 'underline', 'ul', 'ol', 'redo', 'undo', 'clear'],
            ['bold', 'italics', 'underline', 'ul', 'ol', 'clear'],
            ['justifyLeft','justifyCenter','justifyRight', 'justifyFull'],
            // ['html', 'insertImage', 'insertLink', 'wordcount', 'charcount']
            ];
            taOptions.classes = {
            	focussed: 'focussed',
            	toolbar: 'btn-toolbar',
            	toolbarGroup: 'btn-group',
            	toolbarButton: 'btn btn-default',
            	toolbarButtonActive: 'active',
            	disabled: 'disabled',
            	textEditor: 'form-control',
            	htmlEditor: 'form-control'
            };
            return taOptions; // whatever you return will be the taOptions
        }])
}])
.run(['$rootScope','$state', '$localStorage', 'Restangular', '$uibModalStack',
	function ($rootScope, $state, $localStorage, Restangular, $uibModalStack) {

		$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){

			//close all the opened ui modal if opened
			$uibModalStack.dismissAll();

			var token = null;
			if(!angular.isUndefined($localStorage.admin)) {
				if (!angular.isUndefined($localStorage.admin.token)) {
					token = $localStorage.admin.token;
				}
			}

			Restangular.setDefaultHeaders({'Authorization': token});

			Restangular.setErrorInterceptor(function(response, deferred, responseHandler) {
				var status = response.status;

				if(status == '401' || status == '403') {
					$rootScope.logout_error = response.data.message;

					$localStorage.admin = {}; // reset admin attributes in localStorage object
					$state.transitionTo('login');
					event.preventDefault();

					// if current state is login
					// then return the error data to the state
					if($state.current.name === 'login') {
						return true;
					}
					return false;
				}

				// return status to the service i.e status handled by the service
				return true;
			});

			// add a response interceptor
			Restangular.addResponseInterceptor(function(data, operation, what, url, response, deferred) {

				if(angular.isDefined(response.headers('Authorization')) && response.headers('Authorization') != null) {

		    		// if token is available then store it in localStorage;
		    		$localStorage.admin = {};
		    		$localStorage.admin.token = response.headers('Authorization');
		    	}
		    	return data;
		    });
			
			//checking if the admin is logged in or not.
			if (angular.isUndefined($localStorage.admin)) {
				$rootScope.isLoggedIn = false;
			} else if (angular.isUndefined($localStorage.admin.token) && $localStorage.admin.token == null) {
				$rootScope.isLoggedIn = false;
			} else {
				$rootScope.isLoggedIn = true;
			}

			if(angular.isUndefined($localStorage.admin)) {
				$localStorage.admin = {};
				$state.transitionTo('login');
				event.preventDefault();
				return;
			}
			
			if((toState.name != 'change_password') && $rootScope.changePassword == true) { 
				$state.transitionTo('change_password');
				event.preventDefault();
				return;
			}

			if( toState.name == 'login' && $rootScope.isLoggedIn) {
				$state.go('main_layout.dashboard');
				event.preventDefault();
				return;
			}

			if( toState.name != 'login' && !$rootScope.isLoggedIn) {
				$state.go('login');
				event.preventDefault();
				return;
			}

		}); // end of rootScope onChange service
	}]); // end of run service

})();
