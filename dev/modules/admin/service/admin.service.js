angular.module('adminApp.admin')
.service('AdminService', AdminService);

AdminService.$inject=['Restangular'];

function AdminService(Restangular){

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

	function createAdmin(admin) {
		return Restangular.all('SmartCardAdmin').post(admin);
	}

	function updateAdmin(admin, id) {
		return Restangular.one('SmartCardAdmin').customPUT(admin, id);
	}

	function deleteAdmin(admin, id) {
		return Restangular.one('SmartCardAdmin', id).one('Delete').customPUT(admin);
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
