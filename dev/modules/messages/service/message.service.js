angular.module('adminApp.message')
.service('MessageService', MessageService);

MessageService.$inject = ['Restangular'];

function MessageService(Restangular){
	
	var service = {
		postMessage : postMessage,
		getAllMessages : getAllMessages,
		getAllMessagesByPagination : getAllMessagesByPagination,
		getMessageById : getMessageById,
		getSentMessages : getSentMessages,
		getAllSentMessagesByFilter : getAllSentMessagesByFilter,
		getUnreadMessageCount : getUnreadMessageCount
	};

	return service;

	// it post the message to the backend
	function postMessage(messageData) {
		return Restangular.all('message').post(messageData);
	} // end of post message function

	// gets all the message 
	function getAllMessages(){
		return Restangular.all('message').getList();
	}// end of get all messages function

	// gets all the message by pagination and using filter as well
	function getAllMessagesByPagination(params) {
		return Restangular.one('message', "filterParam").customPOST(params, null);
	} // end of get all message by pagination function

	// fetch the message by id
	function getMessageById(messageId){
		return Restangular.all('message').get(messageId);
	}// end of get message by id function

	// gets all the message 
	function getSentMessages(){
		return Restangular.all('message/sent').getList();
	}// end of get all messages function

	// gets all the sent message by pagination and using filter as well
	function getAllSentMessagesByFilter(params) {
		return Restangular.all('message').one("sent", "filterParam").customPOST(params, null);
	} // end of get all sent message by filter function

	// counts the unread message 
	function getUnreadMessageCount(){
		return Restangular.all('message/count').customGET();
	} // end of getUnreadMessageCount function

}