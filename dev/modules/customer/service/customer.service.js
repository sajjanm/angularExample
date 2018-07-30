angular.module('adminApp.customer')
        .service('CustomerService', CustomerService);

CustomerService.$inject = ['Restangular'];

function CustomerService(Restangular) {

    var service = {
        getAllCustomerByPagination: getAllCustomerByPagination,
        getCustomerKycDetail : getCustomerKycDetail,
        getAllCustomerProfile :getAllCustomerProfile,
        approveCustomer : approveCustomer,
        disapproveCustomer : disapproveCustomer,
        confirm : confirm,
        downloadDocument : downloadDocument,
        fetchCustomerByUsername : fetchCustomerByUsername,
        getAllBlockedCustomerByPagination : getAllBlockedCustomerByPagination,
        unblockCustomer : unblockCustomer

    };

    return service;

    function getAllCustomerByPagination(params) {
console.log('asdasd');
        return Restangular.one('customerSetupResource').customPOST(params, null);
    }

    function getCustomerKycDetail(id) {
        return Restangular.one('customerSetupResource', id).customGET("");
    }

    function getAllCustomerProfile() {
        return Restangular.all('CustomerProfile').getList();
    }

    function approveCustomer(customerId, customerProfileId) {
        return Restangular.all('CustomerProfile').getList();
    }

    function disapproveCustomer(customerId, disapproveReason) {
        return Restangular.all('customerSetupResource/'+customerId+'/disapprove').customPUT(disapproveReason);
    }

    function confirm(customerId, customerProfileId) {
        return Restangular.all('customerSetupResource/'+customerId+'/approve').customPUT(customerProfileId);
    }

    function downloadDocument(downloadFileId) {
        return  Restangular.one('customerSetupResource/'+downloadFileId+'/attachment').withHttpConfig({responseType: 'blob'}).customGET();
    }

    function fetchCustomerByUsername(name){
        return Restangular.one('customerSetupResource').getList("check", {username:name})
    }

    function getAllBlockedCustomerByPagination(params) {
        return Restangular.one('customerSetupResource/blockedCustomer').customPOST(params, null);
    }

    function unblockCustomer(customerLogin, id) {
        return Restangular.one('customerSetupResource', id).one('unblockCustomer').customPUT(customerLogin);
    }
}
