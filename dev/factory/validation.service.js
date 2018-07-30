angular.module('adminApp')
.factory('ValidationService',ValidationService);

ValidationService.$inject=['Restangular', '$q'];

function ValidationService(Restangular, $q){

    // properties
    var loaded = false;
    var passwordPolicies = [];
    var pwdPolicies = {};
    var passwordPoliciesText = [];
    
    // returning attributes 
    var service = {
        getPasswordPolicy : getPasswordPolicy,
        validatePassword : validatePassword,
        getPasswordPolicyTextConverter : getPasswordPolicyTextConverter  
    };

    return service;

    // Call the api and fetch data
    function getPasswordPolicys() {

        return Restangular.all('passwordPolicy').getList();
    } // end of get Password policies function


    function getPasswordPolicy(){

        var deferred = $q.defer();

        getPasswordPolicys()
        .then(function(successResponse){
            passwordPolicies = [];
            pwdPolicies = successResponse.data;

            angular.forEach(pwdPolicies, function(pwdPolicy){
                passwordPolicies.push({
                    id : pwdPolicy.id,
                    label : pwdPolicy.label,
                    passwordPolicyValue : pwdPolicy.passwordPolicyValue,
                    passwordRegularExpressionLengthType : pwdPolicy.passwordRegularExpressionLengthType,
                    regularExpression : pwdPolicy.regularExpression,
                    regularExpressionToRegex : new RegExp(pwdPolicy.regularExpression,"g")
                });
            });

            getPasswordPolicyTextConverter();
            deferred.resolve(passwordPoliciesText);

        },function(errorResponse){
            // TO DO
            deferred.resolve(false);
        });

        
        return deferred.promise;
    }


    function getPasswordPolicyTextConverter() {

        var deferred = $q.defer();

        if(passwordPoliciesText.length == undefined || passwordPoliciesText.length < 1){
            passwordPoliciesText.push("The overall length of password must be greater than "+ passwordPolicies[5].passwordPolicyValue + " and less than "+ passwordPolicies[4].passwordPolicyValue);
            angular.forEach(passwordPolicies, function(pwdPolicy){
                if(pwdPolicy.passwordRegularExpressionLengthType != null && pwdPolicy.passwordRegularExpressionLengthType !=undefined && pwdPolicy.passwordRegularExpressionLengthType !="NONE"){
                    if(pwdPolicy.passwordRegularExpressionLengthType=="MIN"){
                        // pwdPolicy.passwordPolicyDesc
                        passwordPoliciesText.push("Atleast "+ pwdPolicy.passwordPolicyValue +" "+ pwdPolicy.label);
                    } else if(pwdPolicy.passwordRegularExpressionLengthType == "MAX"){
                        passwordPoliciesText.push("Atmost "+ pwdPolicy.passwordPolicyValue +" "+ pwdPolicy.label);
                    } else if(pwdPolicy.passwordRegularExpressionLengthType == "FIX"){
                        passwordPoliciesText.push(pwdPolicy.label + " must be " + pwdPolicy.passwordPolicyValue);
                    }               
                }            
            });
        }

        deferred.resolve(passwordPoliciesText);

        return deferred.promise;
    }

    function validatePassword(password){
        var response ={};
        var sectionToCheck = password;
        var resultArr=[];
        var i=0;
        var fail = false;
        //maximum ko id5
        if( sectionToCheck.length >= passwordPolicies[5].passwordPolicyValue && sectionToCheck.length <= passwordPolicies[4].passwordPolicyValue) {
            
            angular.forEach(passwordPolicies, function(pwdPolicy){
                if(pwdPolicy.passwordRegularExpressionLengthType != null && pwdPolicy.passwordRegularExpressionLengthType !=undefined && pwdPolicy.passwordRegularExpressionLengthType !="NONE"){
                    
                    var result = sectionToCheck.match(pwdPolicy.regularExpressionToRegex);
                    if(result !=null || result !=undefined){
                        if(pwdPolicy.passwordRegularExpressionLengthType=="MIN"){
                            if(result.length<pwdPolicy.passwordPolicyValue){
                                resultArr[i]=false;                         
                            }
                            else{
                                resultArr[i]=true;
                            }
                        } else if(pwdPolicy.passwordRegularExpressionLengthType=="MAX"){
                            if(result.length>pwdPolicy.passwordPolicyValue){
                                resultArr[i]=false;
                            }
                            else{
                                resultArr[i]=true;
                            }
                        } else if(pwdPolicy.passwordRegularExpressionLengthType=="FIX"){
                            if(result.length==pwdPolicy.passwordPolicyValue){
                                resultArr[i]=true;
                            }
                            else{
                                resultArr[i]=false;
                            }
                        }
                    } else{
                        resultArr[i]=false;

                    }
                    
                    i++;               
                }
                
            });

            angular.forEach(resultArr, function(index){
                if(!index){ //check if it is truly false
                    fail = true
                }
            });

            if(fail){
                  //test failed
                  response.boolean = true;
                  response.message = "Validation Error!"
                  return response;
                  // return true;
            } else{
                response.boolean = false;
                response.message = "Validation Success!"
                return response;
                    // return false;
            }

        } 
        else{
            // DIRECTLY ERROR AAUNXA
            response.boolean = true;
            response.message = "Password length not meet"
            return response;
            // return true;
        }           
    }

}

