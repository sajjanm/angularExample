(function() {
'use strict';

	angular.module('adminApp')
	.controller('DashboardController', DashboardController);

	DashboardController.$inject = ['$rootScope','$scope', '$state', '$localStorage', 'NavigationService', 'ProfileService', 'ListenerService', 'MessageService', '$interval'];

	function DashboardController($rootScope,$scope, $state, $localStorage, NavigationService, ProfileService, ListenerService, MessageService, $interval) {
		var vm = this;

		// properties
		vm.fetched_nav = [];		
		vm.userProfileNav = [];
		vm.error = '';
		vm.loaded = false;
		vm.search = ''; // navigation search string
		vm.enableSearchNavigation = false;
		vm.searchedNavigation = []; // holds filter navigation object
		vm.logout_string = 'Logout';
		vm.userInfo = {};
		vm.userPhoto = {};

		// methods
		vm.navigation = navigation;
		vm.searchNavigation = searchNavigation;
		vm.userDetails = userDetails;
		vm.userProfilePhoto = userProfilePhoto;
        vm.logout = logout;
        vm.userProfileNavi = userProfileNavi;

		// initialize methods
		activate();
		function activate(){
			// $.AdminLTE.layout.activate.fix();
			// $.AdminLTE.layout.activate.fixSidebar();
			navigation();
			userDetails();
			userProfilePhoto();
			// inboxMessageCount();
		} // end of activate function

		// catch emit message when profile image is uploaded
		$scope.$on('uploadedPhoto', function (event, args) {
			userProfilePhoto();
		});

		// catch emit message when username is updated
		$scope.$on('updateProfile', function (event, args) {
			userDetails();
		});

		// Gets the unread Message Count
		function inboxMessageCount (){
				
			$interval(function() {
				if (!angular.isUndefined($localStorage.admin.token)) {
					MessageService.getUnreadMessageCount()
					.then(function (successResponse){
						if(!angular.isUndefined(successResponse.data)){
						 	$rootScope.inboxMessageCount = successResponse.data;
						}
						else{
							$rootScope.inboxMessageCount = 0;
						}
					}, function(errorResponse){
					// To - DOs
					});
				}
			}, 50000 );

		}// end of inboxMessageCount function

		// fetch all navigation menu
		function navigation() {

			NavigationService.navigation()
			.then(function(successResponse) {

				var navs = successResponse.data.navigationRoleResponses;

				var userProfileNavs = successResponse.data.userProfileResponses;
				
				angular.forEach(navs, function(nav){
					vm.fetched_nav.push(nav);
				});

				angular.forEach(userProfileNavs, function(nav){
					vm.userProfileNav.push(nav);
				});

				ListenerService.userNavigations.push({task: vm.userProfileNav[0].roles});
				while(ListenerService.userNavigations.length >0){
					vm.loaded = true;

					resizeWindowFxn();
					resizeSideBar();	

					break;
				}
			}, function(errorResponse) {
				// for error
			});		

		} // end of navigation function

		// Trigered by onClick on User Image
        function userProfileNavi(){
            
	 	    // $state.go('main_layout.profile');

	 	    $state.go('main_layout.profile.'+vm.userProfileNav[0].roles[0].navigation);
        } // end of header Click function

		// function search navigation
		function searchNavigation() {
			vm.searchedNavigation = [];

			if(vm.search.length > 0) {
				
				// render search navigation
				vm.enableSearchNavigation = true;

				angular.forEach(vm.fetched_nav, function(navs) {          
			       angular.forEach(navs.roles, function(role){
			       		
			       		var roleName = role.name;
			       		roleName = angular.lowercase(roleName);

			       		var find = new RegExp(vm.search);
			       		find =  angular.lowercase(find);

  						var matched = find.exec(roleName);

			       		if(matched != null) {
			       			vm.searchedNavigation.push(role);
			       		}

			       });
			    });
			} else if(vm.search == '' || vm.search == null) {
				// render main navigation
				vm.enableSearchNavigation = false;
			}

		} // end of searchNavigation function

		// function fetching user name
		function userDetails() {
			ProfileService.getProfileDetail()
            .then(function (successResponse) {
                vm.userInfo = successResponse.data;

            }, function (errorResponse) {
                // nothing to do
            });
		} // end of userDetails function

		// function fetching user photo
		function userProfilePhoto() {
			ProfileService.getProfilePhoto()
            .then(function (successResponse) {
                vm.userPhoto = successResponse.data;

            }, function (errorResponse) {
                // nothing to do
            });
		} // end of userProfilePhoto function

		// flush the localstorage data
        function logout() {
            $localStorage.admin = {};
            $state.go('login');
        } // end of logout function

        // resize the window
        function resizeWindowFxn() {
	    	//Get window height and the wrapper height
			var neg = $('.main-header').outerHeight() + $('.main-footer').outerHeight();
			var window_height = $(window).height();
			var sidebar_height = $(".sidebar").height();
			//Set the min-height of the content and sidebar based on the
			//the height of the document.
			if ($("body").hasClass("fixed")) {
				$(".content-wrapper, .right-side").css('min-height', window_height - $('.main-footer').outerHeight());
			} else {
				var postSetWidth;
				if (window_height >= sidebar_height) {
				  $(".content-wrapper, .right-side").css('min-height', window_height - neg);
				  postSetWidth = window_height - neg;
				} else {
				  $(".content-wrapper, .right-side").css('min-height', sidebar_height);
				  postSetWidth = sidebar_height;
				}

				//Fix for the control sidebar height
				var controlSidebar = $($.AdminLTE.options.controlSidebarOptions.selector);
				if (typeof controlSidebar !== "undefined") {
				  if (controlSidebar.height() > postSetWidth)
				    $(".content-wrapper, .right-side").css('min-height', controlSidebar.height());
				}
			}
	  	} // end of resizeWindowFxn

	  	// resize the side bar
	  	function resizeSideBar() {
	  		//Make sure the body tag has the .fixed class
	  		if (!$("body").hasClass("fixed")) {
	  			if (typeof $.fn.slimScroll != 'undefined') {
	  				$(".sidebar").slimScroll({destroy: true}).height("auto");
	  			}
	  			return;
	  		} else if (typeof $.fn.slimScroll == 'undefined' && window.console) {
	  			window.console.error("Error: the fixed layout requires the slimscroll plugin!");
	  		}
		      //Enable slimscroll for fixed layout
		      if ($.AdminLTE.options.sidebarSlimScroll) {
		      	if (typeof $.fn.slimScroll != 'undefined') {
		          //Destroy if it exists
		          $(".sidebar").slimScroll({destroy: true}).height("auto");
		          //Add slimscroll
		          $(".sidebar").slimscroll({
		          	height: ($(window).height() - $(".main-header").height()) + "px",
		          	color: "rgba(0,0,0,0.2)",
		          	size: "3px"
		          });
		      }
		  }

	  	}// end of resizeSideBar

	} // end of dashboard controller

})();
