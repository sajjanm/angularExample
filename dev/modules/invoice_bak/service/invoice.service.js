angular.module('adminApp.invoice')
.service('InvoiceService', InvoiceService);

InvoiceService.$inject=['Restangular'];

function InvoiceService(Restangular){

	var service = {
		getAllAdmins : getAllAdmins,
		createAdmin : createAdmin,
		updateAdmin: updateAdmin,
		deleteAdmin: deleteAdmin,
		getAllAdminsByPagination: getAllAdminsByPagination,
		editAdmin: editAdmin,
		getPasswordPolicys : getPasswordPolicys,
		fetchAdminByUsername : fetchAdminByUsername
	};

	return service;

	function getAllAdmins() {
		return Restangular.all('SmartCardAdmin').getList();
	}

	function getAllAdminsByPagination(params) {
		return Restangular.one('SmartCardAdmin', "filterParam").customPOST(params, null);
	}

	function createAdmin(invoice) {
		return Restangular.all('SmartCardAdmin').post(invoice);
	}

	function updateAdmin(invoice, id) {
		return Restangular.one('SmartCardAdmin').customPUT(invoice, id);
	}

	function deleteAdmin(invoice, id) {
		return Restangular.one('SmartCardAdmin', id).one('Delete').customPUT(invoice);
	}

	function editAdmin(id) {
		return Restangular.one('SmartCardAdmin', id).customGET("");
	}

	function getPasswordPolicys() {
		return Restangular.all('passwordPolicy').getList();
	}

	function fetchAdminByUsername(name){
		return Restangular.one('SmartCardAdmin').getList("check", {username:name})
	}

}
