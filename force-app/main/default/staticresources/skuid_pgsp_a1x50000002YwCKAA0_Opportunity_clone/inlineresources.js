(function(skuid){
skuid.snippet.register('IsNotModal',function(args) {return skuid.page.name == "OpportunityNew" || skuid.page.name == "OpportunityNewModal";
});
skuid.snippet.register('IsModal',function(args) {return skuid.page.name != "OpportunityNew" && skuid.page.name != "OpportunityNewModal";
});
skuid.snippet.register('UpdateBillingContact',function(args) {/*Get first row from ContactModal model*/
var ContactModalModal = skuid.model.getModel('ContactModal');
var ContactModalRecord = ContactModalModal.getFirstRow();
var ContactId ;

/*Check Condition for ContactModalRecord*/
if (typeof ContactModalRecord !== 'undefined') {
    ContactId = ContactModalRecord.Id;
    
    /*Get fields from NewOpportunity model*/
    var vOpportunityModal = skuid.model.getModel('NewOpportunity');
    var vOpportunityRecord = vOpportunityModal.getFirstRow();
    var vBillingContact = vOpportunityRecord.Billing_Contact__c;
    var sOpportunityName = vOpportunityRecord.Name;
    
    /*Trim sOpportunityName from NewOpportunity model*/
    sOpportunityName = typeof sOpportunityName === 'undefined' ? '': sOpportunityName.trim();
    
    /*Check Validation for opportunity name*/
    if (sOpportunityName === ''){
        alert('Please enter Missing Field values!');
        return false;
    } else {
        if(typeof vBillingContact === 'undefined' || vBillingContact === '') {
            vOpportunityModal.updateRow(vOpportunityRecord, {
            Billing_Contact__c: ContactId
            }); 
        }   
    }
}
});
skuid.snippet.register('Updateseries',function(args) {/*Get first row and Id from NewOpportunity model*/
var OpportunityModal = skuid.model.getModel('NewOpportunity');
var OpportunityRecord = OpportunityModal.getFirstRow();
var oppId = OpportunityRecord.Id;
var OpportunitySeries = OpportunityRecord.EventEdition__r.Part_of_Series__c;
var modal1A = skuid.model.getModel('NewOpportunity');

/*Update row of NewOpportunity model*/
modal1A.updateRow(  { Id: oppId }, {Event_Series__c: OpportunitySeries});

/*Save row of NewOpportunity model*/
modal1A.save();
});
skuid.snippet.register('UpdateNotesAttachmentActivity',function(args) {/*Capturing Opportunity and NewOpportunity model*/
var params = arguments[0],
	$ = skuid.$;
var OpportunityModel = skuid.model.getModel('Opportunity');
var NewOpportunityModel = skuid.model.getModel('NewOpportunity');

/*Capturing first row from Opportunity and NewOpportunity model*/
var OpportunityRow = NewOpportunityModel.getFirstRow();
var OpportunityModelRow = OpportunityModel.getFirstRow();

/*Capturing Id's of Opportunity and NewOpportunity model*/
var sPickVal;
var sOppId = OpportunityRow.Id;
var sOppParentId = OpportunityModelRow.Id;

/*Validate Copy_Notes_Attachment_Activities__c field and Call global class along with its webserive method on the basis of parameters related to opportunity*/
if(typeof OpportunityRow.Copy_Notes_Attachment_Activities__c !== 'undefined'){
    sPickVal = OpportunityRow.Copy_Notes_Attachment_Activities__c;  
    var result = sforce.apex.execute('OpportunityNotesAttachmentActivityClass','oppNotesAttachActivity',{sOppId:sOppId, sPickVal:sPickVal, sOppParentId:sOppParentId} , function(result){ 
        if(result[0] == 'Success'){
            window.location.href = '/'+sOppId;        
        }
    }); 
} else {
    window.location.href = '/'+sOppId;
}
});
skuid.snippet.register('ButtonHide',function(args) {/*Capturing Opportunity and NewOpportunity model*/
var params = arguments[0],
	$ = skuid.$;
var NewOpportunityModel = skuid.model.getModel('NewOpportunity');
var sCloseDate = NewOpportunityModel.getFirstRow().CloseDate;


/*Get all Custom labels*/
window.$Label = window.$Label || {};
var CloseDateLabel = skuid.utils.mergeAsText("global","{{$Label.Missing_Close_Date_Label}}");	 


if(typeof sCloseDate!='undefined'){
    document.getElementById("sk-3WIv3Q-88").style.display = "none";    
}else{
    alert(CloseDateLabel);
    return false;
}
});
}(window.skuid));