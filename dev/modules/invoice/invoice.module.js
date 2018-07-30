(function() {
'use strict';

angular.module('adminApp.invoice',[])
.config(['$stateProvider',function($stateProvider) {

		$stateProvider
        .state('main_layout.createInvoice', {
			url: 'invoice/createInvoice',
			templateUrl: 'modules/invoice/views/invoice.create.html',
			controller: 'InvoiceController',
			controllerAs: 'invoiceCtrl',
			data: {
				breadcrumb : ["Invoice", "Create Invoice"]
			}
		})
		.state('main_layout.savedInvoice', {
			url: 'invoice/savedInvoice',
			templateUrl: 'modules/invoice/views/invoice.saved.html',
			controller: 'InvoiceController',
			controllerAs: 'invoiceCtrl',
			data: {
				breadcrumb : ["Invoice", "Saved Invoice"]
			}
		})
		.state('main_layout.sentInvoice', {
			url: 'invoice/sentInvoice',
			templateUrl: 'modules/invoice/views/invoice.sent.html',
			controller: 'InvoiceController',
			controllerAs: 'invoiceCtrl',
			data: {
				breadcrumb : ["Invoice", "Sent Invoice"]
			}
		})
		.state('main_layout.invoiceCustomer', {
			url: 'invoice/createInvoiceCustomer',
			templateUrl: 'modules/invoice/views/invoiceCustomer.create.html',
			controller: 'InvoiceCustomerController',
			controllerAs: 'invoiceCustCtrl',
			data: {
				breadcrumb : ["Invoice Customer", "Create Invoice Customer"]
			}
		});

	}]);


})();