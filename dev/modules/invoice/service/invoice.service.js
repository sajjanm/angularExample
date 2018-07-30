angular.module('adminApp.invoice')
.service('InvoiceService', InvoiceService);

InvoiceService.$inject=['Restangular'];

function InvoiceService(Restangular){

	var service = {
		createInvoice : createInvoice,
		getAllSavedInvoicesByPagination : getAllSavedInvoicesByPagination,
		getAllSentInvoicesByPagination : getAllSentInvoicesByPagination,
		sendEmail : sendEmail,
		createInvoiceCustomer : createInvoiceCustomer,
		fetchInvoiceCustomerByname : fetchInvoiceCustomerByname
	};

	return service;

	function createInvoice(invoice) {
		console.log(invoice);
		return Restangular.all('invoice').post(invoice);
	}

	function createInvoiceCustomer(invoiceCustomer) {
		return Restangular.all('invoice/customer').post(invoiceCustomer);
	}

	function getAllSavedInvoicesByPagination(params) {
		return Restangular.one('invoice', "filterParam").customPOST(params, null);
	}

	function getAllSentInvoicesByPagination(params) {
		return Restangular.one('invoice', "sent").customPOST(params, null);
	}

	function sendEmail(invoiceId){
		return Restangular.one('invoice/sendEmail', invoiceId).customGET("");
	}

	function fetchInvoiceCustomerByname(name){
		return Restangular.one('invoice').getList("check", {name:name})
	}

}
