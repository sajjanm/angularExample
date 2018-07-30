angular.module('adminApp')
.filter('Trim',Trim);

// Setup the filter
function Trim(){
	// capitalize the first letter in the word
	return function(value) {
		if(!angular.isString(value)) {
			return value;
		}  
    	return value.replace(/^\s+|\s+$/g, ''); // you could use .trim, but it's not going to work in IE<9
	}
}
