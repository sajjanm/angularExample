(function() {
	'use strict';

angular.module('adminApp.invoice')
    .controller('InvoiceController', InvoiceController);

    InvoiceController.$inject = ['InvoiceService', 'NgTableParams', 'PaginationService'];

    function InvoiceController(InvoiceService, NgTableParams, PaginationService){
    	var vm = this;

    	// properties
    	vm.invoice = {};
    	vm.error = false;
        vm.success = false;
        vm.error_message = '';
        vm.success_message = '';
        vm.invoice.grandTotal = 0;
        vm.usernameLists = [];

        vm.allSavedInvoicesPagination = [];
        vm.tableParams = {};
        vm.sno = {};
        vm.paginationLoaded = false;

        vm.formData = true; // to render invoice form, formData must be true

        // initial value for invoce detail array
        vm.invoice.invoiceDetailArray = [{sn: 0, id: null, itemName: null, quantity: null, price: null, total: null, active: false}];
        vm.invoice.gst = 0;

        // methods
        vm.resetForm = resetForm;
        vm.resetError = resetError;
        vm.addNewPartner = addNewPartner;
        vm.removePartner = removePartner;
        vm.getTotal = getTotal;
        vm.gettingTotal = gettingTotal;


        // CRUD methods
        vm.createInvoice = createInvoice;


        vm.sendEmail = sendEmail;
        vm.fetchInvoiceCustomerByUsername = fetchInvoiceCustomerByUsername;

        // initilaize methods
        activate();
        function activate(){
            getAllSavedInvoiceTable();

        } // end of activate function

        // create invoice
        function createInvoice(form) {
            vm.formData = false;
            resetError();
            // vm.invoice.invoiceCustomer = 1;
            vm.invoice.invoiceCustomer = vm.invoice.username[0].userId;
            InvoiceService.createInvoice(vm.invoice)
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

        } // end of createInvoice function
        
        // SERIOUSLY CHANGE THIS OBJECT
        // reset the invoice object
        function resetForm(form) {
            form.$setPristine();
            form.$setUntouched();

            vm.invoice = {
                id: null,
                name: '',
                email: '',
                contact: '',
                address: '',
                gender: '',
                username: '',
                password: '',
                adminProfileId: ''
            };

            vm.confirm_password = '';

        } // end of resetForm function

        // reset the error message
        function resetError() {
            vm.error = false;
            vm.success = false;
            vm.validationError = {};
        }// end of resetError function

        function gettingTotal(){
            var total = 0;
            angular.forEach(vm.invoice.invoiceDetailArray, function(item){
              total += item.quantity * item.price;
            });
            if(vm.invoice.gst == undefined){

            }else{
                total = total + ( (vm.invoice.gst / 100) * total);
            }
            vm.invoice.grandTotal = total;
            return total;
        }

        // It is triggred on change in quantity and price of each item
        function getTotal(index){

            var invoiceDetailArrayTemp = vm.invoice.invoiceDetailArray[index];
            
            invoiceDetailArrayTemp.total = invoiceDetailArrayTemp.quantity * invoiceDetailArrayTemp.price;
            
            vm.invoice.invoiceDetailArray[index].total = invoiceDetailArrayTemp.total;
        } // end of getTotal function

        // function to add new partner
        function addNewPartner() {
            var len = vm.invoice.invoiceDetailArray.length;

            vm.invoice.invoiceDetailArray

            vm.invoice.invoiceDetailArray.push({sn: length, id: null, itemName: null, quantity: null, price: null, total: null, active: false});
        }// end of addNewPartner function

        // NEED TO DEFINE AND HAVE A LOOK AT THAT REMOVED PARTNET ARRAY THING!!!!!!
        // function to remove the partner row
        function removePartner(index) {

            var commissionShare = vm.invoice.invoiceDetailArray[index];

            if(commissionShare.id != null) {
                commissionShare.active = true;
                vm.removedPartner.push(commissionShare);
            }

            vm.invoice.invoiceDetailArray.splice(index, 1);
        }// end of removePartner function

        // fetch the names of invoice customer
        function fetchInvoiceCustomerByUsername (query){
            return InvoiceService.fetchInvoiceCustomerByname(query)
            .then(function(successResponse){
                vm.usernameLists = [];
                angular.forEach(successResponse.data, function(username){
                    vm.usernameLists.push({username: username.name, userId: username.id});
                });

                return vm.usernameLists;
            }, function(errorResponse){
                // To Do's
            });
        } // end of fetchInvoiceCustomerByUsername function

        // fetch all Saved invoices
        function getAllSavedInvoiceTable() {

            vm.allSavedInvoicesPagination.length = 0;

            vm.tableParams = new NgTableParams({
                // initial value for page
                
                page: 1, // initial page
                count: 10, // number of records in page,
                filter: {
                    "name": ''
                } 
            },
            {
                counts: [],
                total: vm.allSavedInvoicesPagination.length,
                getData : function( $defer, params){

                    vm.paginationLoaded = false;

                    var tableParams = {
                        pageNumber: params.page(),
                        pageSize: params.count(),
                        filterFieldParams: [
                        {
                            "fieldKey":"invoiceCustomer.name",
                            "fieldValue": params.filter().name,
                        }
                        ]
                    };

                    InvoiceService.getAllSavedInvoicesByPagination(tableParams).then(
                        function(successResponse){

                            vm.paginationLoaded = true;

                            vm.sno = PaginationService.getSno(tableParams);
                            vm.allSavedInvoicesPagination = successResponse.data.invoiceDto;

                            params.total(successResponse.data.totalNumberOfRecords);

                            $defer.resolve(vm.allSavedInvoicesPagination);
                        },
                        function(errorResponse){

                            vm.paginationLoaded = true;
                            vm.allSavedInvoicesPagination.length = 0;
                            $defer.resolve(vm.allSavedInvoicesPagination);

                        });
                }
            });

        } // end of getAllSavedInvoice function

        // send the invoice id to send email
        function sendEmail(invoiceId){
            vm.paginationLoaded = false;

            InvoiceService.sendEmail(invoiceId)
            .then(function(successResponse){
                vm.success = true;
                vm.success_message = successResponse.data.message;

                vm.tableParams.$params.page = 1; // set table to initial page
                vm.tableParams.reload();
            }, function(errorResponse){
                vm.error = true;
                vm.error_message = errorResponse.data.message;

                vm.tableParams.reload();
            });
        } // end of send Email function

    }

})();