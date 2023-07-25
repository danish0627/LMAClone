(function(skuid){
skuid.snippet.register('Reload Page',function(args) {skuid.$(function(){ 

    var ParentModel = skuid.model.getModel('Booth_Approval_Live');

    var listener = new skuid.ui.Editor(); 
    listener.handleSave = function() { 
        if (!ParentModel.hasChanged) { 
           ParentModel.updateData(); 
        } 
    }; 
    listener.registerModel(ParentModel); 
});
});
}(window.skuid));