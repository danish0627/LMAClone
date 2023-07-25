window._LtngUtility = (function() {    
    return { 
        // there are two useable method [handleErrors() and toast()]
        handleErrors: function(errors) {        
            let isUnknownError = true;
    		// Display raw error stack in console
            console.error(JSON.stringify(errors));
            
            // Retrieve and display the error message(s) sent by the server
            if (typeof errors !== 'undefined' && Array.isArray(errors) && errors.length > 0) {
                errors.forEach(error => {
                    // Check for 'regular' errors
                    if (typeof error.message != 'undefined') {
                        this.error(error.message);
                        isUnknownError = false;
                    }
                    // Check for 'pageError' errors
                    const pageErrors = error.pageErrors;
                    console.log(pageErrors);
                    if (typeof pageErrors !== 'undefined' && Array.isArray(pageErrors) && pageErrors.length > 0) {
                        pageErrors.forEach(pageError => {
                            if (typeof pageError.message !== 'undefined') {                            
                                this.error(pageError.message);
                                isUnknownError = false;
                            }
                        });
                    }
    
                    // Check for 'fieldErrors' errors
                    const fieldErrors = error.fieldErrors;
                    if (typeof fieldErrors !== 'undefined') {
                        if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
                            fieldErrors.forEach(fieldError => {
                                if (typeof fieldError.message !== 'undefined') {                                
                                    this.error(fieldError.message);                                
                                    isUnknownError = false;
                                }
                            });
                        } else {
                            for (var k in fieldErrors) {
                                if (fieldErrors.hasOwnProperty(k)) {
                                    let fieldError = fieldErrors[k];
                                    fieldError.forEach(err => {
                                        if (typeof err.message !== 'undefined') {                                    
                                            this.error(err.message);                                        
                                            isUnknownError = false;
                                        }
                                    });
                                }
                            }
                        }
                    }
                });
            }
            // Make sure that we display at least one error message
            if (isUnknownError) {            
                this.error('Unknown error');
            }
    	},
        error:function(msg){
            this.toast('Error!','error',msg);
        },
        handleError:function(error){
            var title = error.statusText;
            if(error.body!=undefined && error.body.output!=undefined)
            {
                var fieldErrors  = error.body.output.fieldErrors;
                
                for (var k in fieldErrors) {
                    if (fieldErrors.hasOwnProperty(k)) {
                        let fieldError = fieldErrors[k];
                        fieldError.forEach(err => {
                            if (typeof err.message !== 'undefined') {                                    
                            this.toast(title,'error',err.message);
                        }
                                           });
                    }
                }    
                
                var errors  = error.body.output.errors;
                for (var k in errors) {
                    if (errors.hasOwnProperty(k)) {
                        let fieldError = errors[k];
                        if (typeof fieldError.message !== 'undefined') {    
                            this.toast(title,'error',fieldError.message);
                        }
                    }
                }
            }
            else if(error.body!=undefined && error.body.message!=undefined){
                this.toast(title,'error',error.body.message);
            }
        },
        toast: function(title,type,msg) {
            let toastEvent = $A.get("e.force:showToast");
            if (typeof toastEvent !== "undefined") {
                let title2 = title || ((type == "success") ? "Success" : "Ooops!");
                toastEvent.setParams({
                    title: title2,
                    message: msg,
                    type: type || "error"
                });
                toastEvent.fire();
            }
            else{
                console.error(msg)
            }
    	},
        validate:function(cmp){
            var allValid = cmp.find('inputFields').reduce(function (validSoFar, inputCmp) {
                inputCmp.showHelpMessageIfInvalid();
                return validSoFar && inputCmp.get('v.validity').valid;
            }, true);
            if (!allValid) {
             	this.toast('Error!','error','Please update the invalid form entries and try again.');   
            }
            return allValid;
        }
    };
}());