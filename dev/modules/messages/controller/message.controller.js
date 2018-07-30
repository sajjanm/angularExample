(function(){
	'use strict';

	angular.module('adminApp.message')
	.controller('MessageController', MessageController);

	MessageController.$inject= ['AdminProfileService', 'CustomerProfileService', 'SettlementBankProfileService', 'MemberBankProfileService', 'MessageService', 'NgTableParams', 'PaginationService', 'MemberBankService', 'SettlementBankService', 'AdminService', 'CustomerService'];

	function MessageController(AdminProfileService, CustomerProfileService, SettlementBankProfileService, MemberBankProfileService, MessageService, NgTableParams, PaginationService, MemberBankService, SettlementBankService, AdminService, CustomerService){
		var vm = this;

		// flags
		vm.loaded = true;
		vm.success = false;
		vm.error = false;
		vm.success_message = '';
		vm.error_message = '';
		vm.editView = false;
        vm.receiverNotSettlement = true;

        vm.sentTableView = false;
        vm.sendMessagesLoaded = false; // toggles when sent message api is successfull hit

        vm.messageMapId = '';
        vm.replyFlag = false;

		vm.profileLoaded = false;
		vm.toProfile = false;
		vm.toSpecificPerson = false;

		// attributes
		vm.message = {}; // stores the values when creating new message
		vm.allMessages = []; // it stores all the messages
        vm.sentMessageDetail = [];
		vm.allProfiles = []; // it stores the profile value that is used while sending the message
		vm.messageDetail = []; // used to store particular message
        vm.parentMessages = []; // stores the parent's message; only valid when the case is of reply
        vm.allSentMessages = []; // stores all the sent messages

        vm.senderTypeArray = [''];

        vm.usernameLists = []; //stores the username for auto complete

		// shall be used when pagination and filters will be implemented
			vm.tableParams = {};
			vm.sno = {}; // s.no in table
			vm.paginationLoaded = false;

            vm.sentTableParams = {};
            vm.sentSno = {}; // s.no in table
            vm.sentPaginationLoaded = false;

		// pagination
		vm.totalItems = {};
		vm.currentPage = 1;
		vm.itemsPerPage = 5;
		vm.maxSize = 5; //number of pager buttons to show

		// methods
		vm.fetchProfile = fetchProfile;
		vm.getAdminProfiles = getAdminProfiles;
		vm.getCustomerProfiles = getCustomerProfiles;
		vm.getMemberBankProfiles = getMemberBankProfiles;
        vm.getSettlementBankProfiles = getSettlementBankProfiles;

        vm.fetchUsername = fetchUsername;
        vm.fetchAdminByUsername = fetchAdminByUsername;
        vm.fetchCustomerByUsername = fetchCustomerByUsername;
        vm.fetchMemberBankUsername  =  fetchMemberBankUsername;
        vm.fetchSettlementBankUsername = fetchSettlementBankUsername;

        vm.messageDetailView = messageDetailView;
        vm.cancel = cancel;

        vm.sentDetailView = sentDetailView;
        vm.getSentMessages = getSentMessages;

        vm.recipient = recipient;
        vm.reset = reset;
        vm.reply = reply;
        vm.sendReply = sendReply;
        vm.subMessageStack = subMessageStack;

		vm.getAllMessages = getAllMessages;
        vm.getAllMessagesByPagination = getAllMessagesByPagination;
        vm.getAllSentMessagesByFilter = getAllSentMessagesByFilter;
		vm.sendMessage = sendMessage;

		// initilaize methods
        activate();
        function activate(){
            getAllMessagesByPagination();
            getAllSentMessagesByFilter();
        } // end of activate function

        // get all messages
        function getAllMessages(){
        	vm.paginationLoaded = false;
            vm.allMessages = [];

        	MessageService.getAllMessages()
        	.then(function(successResponse) {
                var messages = successResponse.data;

                angular.forEach(messages, function(message){
                    vm.allMessages.push(message);
                });
                vm.paginationLoaded = true;
            }, function(errorResponse) {
                vm.error = true;
                vm.error_message = errorResponse.data.message;
            });
        }// end of get all message function

        // fetchs the message using filter
		function getAllMessagesByPagination() {
            vm.allMessages = [];

			vm.allMessages.length = 0;

            vm.tableParams = new NgTableParams({
            	// initial value for page
            	
                page: 1, // initial page
                count: 10, // number of records in page,
                filter: {
                    "subject": '',
                    "sentBy": ''
                } 
            },
            {
                counts: [],
                total: vm.allMessages.length,
                getData : function( $defer, params){

                    vm.paginationLoaded = false;

                    var tableParams = {
                        pageNumber: params.page(),
                        pageSize: params.count(),
                        filterFieldParams: [
                     		{
								"fieldKey":"messageId.subject",
								"fieldValue": params.filter().subject,
							},
                            {
                                "fieldKey":"messageId.senderType",
                                "fieldValue": angular.isUndefined(params.filter().sentBy) ? '' : params.filter().sentBy,
                            }
                        ]
                    };

                    MessageService.getAllMessagesByPagination(tableParams)
                    .then(function(successResponse){
                            vm.paginationLoaded = true;

                       		vm.sno = PaginationService.getSno(tableParams);
                            vm.allMessages = successResponse.data.messageMapDtos;

                            params.total(successResponse.data.totalNumberOfRecords);

                            $defer.resolve(vm.allMessages);
                        },function(errorResponse){
                            vm.paginationLoaded = true;
                            vm.allMessages.length = 0;
                            $defer.resolve(vm.allMessages);

                        });
                	}
            });
		} // end of getAllProfileTable function

        // fetchs the message using filter
        function getAllSentMessagesByFilter() {
            vm.allSentMessages = [];

            vm.allSentMessages.length = 0;

            vm.sentTableParams = new NgTableParams({
                // initial value for page
                
                page: 1, // initial page
                count: 10, // number of records in page,
                filter: {
                    "subject": ''
                } 
            },
            {
                counts: [],
                total: vm.allSentMessages.length,
                getData : function( $defer, params){

                    vm.sentPaginationLoaded = false;

                    var sentTableParams = {
                        pageNumber: params.page(),
                        pageSize: params.count(),
                        filterFieldParams: [
                            {
                                "fieldKey":"subject",
                                "fieldValue": params.filter().subject,
                            }
                        ]
                    };

                    MessageService.getAllSentMessagesByFilter(sentTableParams)
                    .then(function(successResponse){
                            vm.sentPaginationLoaded = true;

                            vm.sentSno = PaginationService.getSno(sentTableParams);
                            vm.allSentMessages = successResponse.data.messageDtos;

                            params.total(successResponse.data.totalNumberOfRecords);

                            $defer.resolve(vm.allSentMessages);
                        },function(errorResponse){
                            vm.sentPaginationLoaded = true;
                            vm.allSentMessages.length = 0;
                            $defer.resolve(vm.allSentMessages);

                        });
                    }
            });
        } // end of getAllProfileTable function

        // listen the radio change event
        function recipient(){
            if(vm.message.messageType == 'ToAll'){
                vm.toProfile = false;
                vm.toSpecificPerson = false;
            } else if(vm.message.messageType == 'To'){
                vm.toProfile = false;
                vm.toSpecificPerson = true;
            } else if(vm.message.messageType == 'Profile'){
                vm.toProfile = true;
                vm.toSpecificPerson = false;}
        } // end of recipient function

		// ON change listener to fetch the respective profile
		function fetchProfile(){
			vm.message.belongId='';
            vm.message.messageType = '';
			if(vm.message.to == 'Admin'){
                vm.receiverNotSettlement = true;
				getAdminProfiles();
			} else if(vm.message.to == 'Customer'){
                vm.receiverNotSettlement = true;
				getCustomerProfiles();
			} else if(vm.message.to == 'SettlementBank'){
                vm.message.messageType = 'ToAll';  
                vm.toProfile = false;
                vm.toSpecificPerson = false;
                vm.receiverNotSettlement = false;
				getSettlementBankProfiles();
			} else if(vm.message.to == 'MemberBank'){
                vm.receiverNotSettlement = true;
				getMemberBankProfiles();
			}
		}// end of Fetch Profile function

		// fetching Admin profiles
		function getAdminProfiles(){
			vm.profileLoaded = false;
            vm.allProfiles = [];

            AdminProfileService.getAllProfiles()
            .then(function(successResponse) {
                var profiles = successResponse.data;

                angular.forEach(profiles, function(profile){
                    vm.allProfiles.push(profile);
                });
                vm.profileLoaded = true;
            }, function(errorResponse) {
                vm.error = true;
                vm.error_message = errorResponse.data.message;
            });
		} // end of get Admin Profiles function

		// fetching Customer profiles
		function getCustomerProfiles() {
			vm.profileLoaded = false;
			vm.allProfiles = [];
			CustomerProfileService.getAllProfiles()
			.then(function(successResponse) {
				var profiles = successResponse.data;
				angular.forEach(profiles, function(profile){
					vm.allProfiles.push(profile);
				});
                vm.profileLoaded = true;
			}, function(errorResponse) {
				vm.error = true;
				vm.error_message = errorResponse.data.message;
			});
		} // end of get Customer Profiles function

		// fetching Settlement Bank profiles
		function getSettlementBankProfiles() {
			vm.profileLoaded = false;
			vm.allProfiles = [];
			SettlementBankProfileService.getAllProfiles()
			.then(function(successResponse) {
				var profiles = successResponse.data;

				angular.forEach(profiles, function(profile){
					vm.allProfiles.push(profile);
				});
                vm.profileLoaded = true;
			}, function(errorResponse) {
				vm.error = true;
				vm.error_message = errorResponse.data.message;
			});
		} // end of get Settlement Bank Profiles function

        // fetching Member Bank profiles
        function getMemberBankProfiles() {
			vm.profileLoaded = false;
            vm.allProfiles = [];
            MemberBankProfileService.getAllProfiles()
            .then(function (successResponse) {
                var profiles = successResponse.data;
                angular.forEach(profiles, function (profile) {
                    vm.allProfiles.push(profile);
                });
                vm.profileLoaded = true;
            }, function (errorResponse) {
                vm.error = true;
				vm.error_message = errorResponse.data.message;
            });
        } // end of get Member Bank Profiles function

        // it chooses which function to call to render the username options
        function fetchUsername(query, recipientType){
            if(vm.message.to == 'Admin'){
                return fetchAdminByUsername(query);
            } else if(vm.message.to == 'Customer'){
               return fetchCustomerByUsername(query);
            } else if(vm.message.to == 'SettlementBank'){
                return fetchSettlementBankUsername(query);
            } else if(vm.message.to == 'MemberBank'){
                return fetchMemberBankUsername(query);
            }
        } // end of fetchUsername

        // fetch the usernames of admins
        function fetchAdminByUsername (query){
            return AdminService.fetchAdminByUsername(query)
            .then(function(successResponse){
                vm.usernameLists = [];
                angular.forEach(successResponse.data, function(username){
                    vm.usernameLists.push({username: username.username});
                });

                return vm.usernameLists;
            }, function(errorResponse){
                // To Do's
            });
        } // end of fetchAdminByUsername function

        // fetch the usernames of admins
        function fetchCustomerByUsername (query){
            return CustomerService.fetchCustomerByUsername(query)
            .then(function(successResponse){
                vm.usernameLists = [];
                angular.forEach(successResponse.data, function(username){
                    vm.usernameLists.push({username: username.username});
                });

                return vm.usernameLists;
            }, function(errorResponse){
                // To Do's
            });
        } // end of fetchCustomerByUsername function

        // fetch the usernames of member banks
        function fetchMemberBankUsername (query){
            return MemberBankService.fetchMemberBankByUsername(query)
            .then(function(successResponse){
                vm.usernameLists = [];
                angular.forEach(successResponse.data, function(username){

                    vm.usernameLists.push({username: username.username});
                });

                return vm.usernameLists;
            }, function(errorResponse){
                // To Do's
            });
        } // end of fetchMemberBankUsername function

        // fetch the usernames of settlement banks
        function fetchSettlementBankUsername (query){

            return SettlementBankService.fetchSettlementBankByUsername(query)
            .then(function(successResponse){
                vm.usernameLists = [];
                angular.forEach(successResponse.data, function(username){

                    vm.usernameLists.push({username: username.username});
                });

                return vm.usernameLists;
            }, function(errorResponse){
                // To Do's
            });
        } // end of fetchSettlementBankUsername function

        // Sends the messages to the back end
        function sendMessage(){
            
            if(vm.message.messageType == 'Profile'){
                vm.message.messageType = "To"+vm.message.to+vm.message.messageType;
            } else{
                vm.message.messageType += vm.message.to;
            }
            
            MessageService.postMessage(vm.message)
    		.then(function(successResponse){
    			vm.error = false;
    			vm.success = true;
    			vm.success_message = successResponse.data.message;
                reset();
    		}, function(errorResponse){
    			vm.success = false;
    			vm.error = true;
    			vm.error_message = errorResponse.data.message;
    		});
        } // end of send message function

        // reseting the page
        function reset(){
            vm.message = {
                to : '',
                messageType : '',
                belongId : '',
                subject : '',
                message : '',
                parentId : null,
                messageMapId : ''
            };
            vm.allProfiles = [];
            vm.profileLoaded = false;
            vm.toProfile = false;
            vm.toSpecificPerson = false;
            vm.messageMapId = '';
            vm.replyFlag = false;
            vm.usernameLists = [];

        }// end of reset function

	    // fetch the particular message
        function messageDetailView(messageId, messageMapId) {
            vm.messageMapId = messageMapId;
            vm.replyTo = '';

            MessageService.getMessageById(messageId)
            .then(function (successResponse) {
                vm.messageDetail = successResponse.data;
                subMessageStack(vm.messageDetail);

            }, function (errorResponse) {
            	// TO - DOs
            });
        } // end of messageDetailView function

        // it stores the parent message 
        function subMessageStack(individusalMessage){
            if (individusalMessage.parentDto!=null || individusalMessage.parentDto !=undefined) {
                vm.parentMessages.push(individusalMessage.parentDto.message);
                var temp = individusalMessage;
                subMessageStack(temp.parentDto);
            }
            vm.editView = true;            
        } // end of subMessageStack function

        // used as a back button
        function cancel(){
            vm.sentTableView = false;
            vm.editView = false;
            vm.success=false;
            vm.error=false;
            vm.messageMapId = '';
            vm.messageDetail = {};
            vm.parentMessages = [];
            vm.tableParams.reload();
        } // end of cancel function

        // set reply flag to true
        function reply(){

            vm.replyFlag = true;
            vm.error = false;
            vm.success = false;
        }// end of reply function

        // used while sending reply
        function sendReply(){
            vm.message.subject = 'Re:'+vm.messageDetail.subject;
            vm.message.parentId = vm.messageDetail.id;
            vm.message.messageMapId = vm.messageMapId;
            vm.message.to = vm.messageDetail.senderType;
            vm.message.belongId = vm.messageDetail.senderId;
            vm.message.messageType = 'To';

            sendMessage();
        }// end of send reply function

        // fetch the sent messages
        function getSentMessages(){
            vm.sendMessagesLoaded = false;
            vm.allSentMessages = [];

            MessageService.getSentMessages()
            .then(function(successResponse) {
                var sentMessages = successResponse.data;

                angular.forEach(sentMessages, function(sentMessage){
                    vm.allSentMessages.push(sentMessage);
                });
                vm.sendMessagesLoaded = true;
            }, function(errorResponse) {
                vm.error = true;
                vm.error_message = errorResponse.data.message;
            });
        }// end of get Sent Message function

        // boolean flags that should be set true to see the detail of sent message
        function sentDetailView(message){
            vm.sentMessageDetail = message;
            vm.sentTableView = true;
        } // end of sentDetailView function

	} // End of Message Controller

})();