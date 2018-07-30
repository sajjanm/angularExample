angular.module('adminApp.memberBank')
.service('MemberBankService', MemberBankService);

MemberBankService.$inject=['Restangular'];

function MemberBankService(Restangular){

	var service = {
		getAllMemberBanks : getAllMemberBanks,
		createMemberBank : createMemberBank,
		updateMemberBank: updateMemberBank,
		deleteMemberBank: deleteMemberBank,
        getAllMemberBanksByPagination : getAllMemberBanksByPagination,
        editMemberBank: editMemberBank,
        fetchMemberBankByUsername : fetchMemberBankByUsername
	};

	return service;

	function getAllMemberBanks() {
		return Restangular.all('MemberBank').getList();
	}

	function createMemberBank(bank) {
		return Restangular.all('MemberBank').post(bank);
	}

	function updateMemberBank(bank, id) {
		return Restangular.one('MemberBank').customPUT(bank, id);
	}

	function deleteMemberBank(bank, id) {
		return Restangular.one('MemberBank', id).one('Delete').customPUT(bank);
	}
        
	function getAllMemberBanksByPagination(params) {
		return Restangular.one('MemberBank', "filterParam").customPOST(params,null);
	}

	function editMemberBank(id) {
		return Restangular.one('MemberBank', id).customGET("");
	}

	function fetchMemberBankByUsername(name){
		return Restangular.one('MemberBank').getList("check", {username:name})
	}

}
