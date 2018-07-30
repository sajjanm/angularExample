(function() {
'use strict';

angular.module('adminApp.scratchCard',[])
.config(['$stateProvider',function($stateProvider) {
        // Now set up the states
        
        $stateProvider
        .state('main_layout.uploadScratchCard', {
			url: 'scratchCard/uploadScratchCard',
			templateUrl: 'modules/scratchCard/views/scratchCard.upload.html',
			controller: 'ScratchCardController',
			controllerAs: 'scratchCardCtrl',
			data: {
				breadcrumb : ["Manage Scratch Card", "Upload Scratch Card"]
			}
		})
		.state('main_layout.activateScratchCard', {
			url: 'scratchCard/activateScratchCard',
			templateUrl: 'modules/scratchCard/views/activate.scratchCard.html',
			controller: 'ScratchCardController',
			controllerAs: 'scratchCardCtrl',
			data: {
				breadcrumb : ["Manage Scratch Card", "Activate Scratch Card"]
			}
		});

    }]);

})();
