(function() {
	'use strict';

angular.module('adminApp.invoice')
    .controller('InvoiceCustomerController', InvoiceCustomerController);

    InvoiceCustomerController.$inject = ['InvoiceService'];

    function InvoiceCustomerController(InvoiceService){
    	var vm = this;

    	// properties
    	vm.invoiceCustomer = {};
    	vm.error = false;
        vm.success = false;
        vm.error_message = '';
        vm.success_message = '';

        vm.formData = true; // to render invoice form, formData must be true

 
        // methods
        vm.resetForm = resetForm;
        vm.resetError = resetError;


        // CRUD methods
        vm.createInvoiceCustomer = createInvoiceCustomer;



        // initilaize methods
        activate();
        function activate(){
            

        } // end of activate function



        // create invoiceCustomer
        function createInvoiceCustomer(form) {
            vm.formData = false;
            resetError();
            InvoiceService.createInvoiceCustomer(vm.invoiceCustomer)
            .then(function(successResponse){
                vm.formData = true;
                vm.success = true;
                vm.success_message = successResponse.data.message;
                vm.resetForm(form);

            }, function(errorResponse){
                vm.formData = true;
                if(angular.isDefined(errorResponse.data.message)) {
                    vm.error = true;
                    vm.error_message = errorResponse.data.message;
                }else{
                    angular.forEach(errorResponse.data, function(value, key){
                        vm.validationError[value.fieldType] = value.message;
                    });
                }

            });

        } // end of createInvoiceCustomer function
        
        // reset the invoiceCustomer object
        function resetForm(form) {
            form.$setPristine();
            form.$setUntouched();

            vm.invoiceCustomer = {
                id: null,
                name: '',
                email: '',
                contact: '',
                address: '',
                accountNumber: ''
            };

        } // end of resetForm function

        // reset the error message
        function resetError() {
            vm.error = false;
            vm.success = false;
            vm.validationError = {};
        }// end of resetError function

    

    }

})();