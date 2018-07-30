angular.module('adminApp')
.filter('Capitalize',Capitalize);

// Setup the filter
function Capitalize(){
	// capitalize the first letter in the word
	return function(input) {
		return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
	}
	
}
