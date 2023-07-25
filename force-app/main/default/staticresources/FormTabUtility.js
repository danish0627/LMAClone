window.formTab = (function() {
    //public API
    return {
        gotoURL: function(url) {
            $A.get("e.force:navigateToURL").setParams({ 
                "url": url
            }).fire();
        },
        showToast: function(component, type, message) {
	        $A.createComponent("c:FormToast",{"msgbody":message,"msgtype":type},function(newToast, status,errorMessage)
	        {                
                if (status === "SUCCESS") {
                    var body = component.get("v.body");
                    body.push(newToast);
                    component.set("v.body", body);
                }
                else if (status === "INCOMPLETE") {
                    console.log("No response from server or client is offline.")
                }
                else if (status === "ERROR") {
                    console.log("Error: " + errorMessage);
                }
            });
	    },
	    fireEvent:function(eventName,param){
	    	var appEvent = $A.get("e.c:"+eventName);
	    	if(appEvent!=undefined){
	    		if(param!=null && param!=undefined){
	    			appEvent.setParams(param);
	    		}
	            appEvent.fire();
            }
	    },
	    showSpinner:function(component){
	    	component.set("v.spinner",true);
	    },
	    hideSpinner:function(component){
	    	component.set("v.spinner",false);
	    }
    };
}());