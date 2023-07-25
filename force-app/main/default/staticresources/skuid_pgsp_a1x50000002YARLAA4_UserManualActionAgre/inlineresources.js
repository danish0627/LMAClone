(function(skuid){
skuid.snippet.register('UserActionManualAgreeSnippet',function(args) {/*
    ** Snippet to export all the userlist who has agreed the Manuals
*/
var model = skuid.model.getModel('UserActionManualAgree');
var row= model.getFirstRow();
model.exportData({
    fileName: 'Manual- '+row.Manual_Permission__r.Manuals__r.Name+'.csv',
     doNotAppendRowIdColumn: true,
    fields: 
    [
        model.getField('Manual_Permission__r.Manuals__r.Name'),
        model.getField('Account__r.Name'),
        model.getField('Is_Viewed__c'),
        model.getField('Is_Agree__c'),
        model.getField('User_Type__r.Name'),
        model.getField('User_Manual_Contact__r.Email')
    ]
});
});
skuid.snippet.register('UserActionManualNotAgreeSnippet',function(args) {/*
    ** Snippet to export all the userlist who hasn't agreed the Manuals
*/
var model = skuid.model.getModel('UserActionManualNotAgree');
var row= model.getFirstRow();
model.exportData({
    fileName: 'Manual- '+row.Manual_Permission__r.Manuals__r.Name+'.csv',
     doNotAppendRowIdColumn: true,
    fields: 
    [
        model.getField('Manual_Permission__r.Manuals__r.Name'),
        model.getField('Account__r.Name'),
        model.getField('Is_Viewed__c'),
        model.getField('Is_Agree__c'),
        model.getField('User_Type__r.Name'),
        model.getField('User_Manual_Contact__r.Email')
    ]
});
});
skuid.snippet.register('SingleManualReminderEmail',function(args) {/*
    ** Snippet to send the single email reminder to all the user who has't viewed and aggred the particular manual
*/
var params = arguments[0],
	$ = skuid.$;

   var modelE = skuid.model.getModel('EventEdition');
   console.log(modelE);
    var rowE = modelE.getFirstRow();
    console.log(rowE);
    var eID= rowE.Id;
    console.log(eID);
    
    var modelEM = skuid.model.getModel('ManualPermission');
    var rowEM = modelEM.getFirstRow();
    var eventManual= rowEM.Manuals__c;
    console.log(eventManual);
    
    var modelUMA = skuid.model.getModel('UserActionManualNotAgree');
    console.log(modelUMA.data.length);
    
    
   // var modelUA = skuid.model.getModel('UserActionFormNotFilled');
    var uMAList=[]; // Array to pupulate User Id List to pass it to Salesforce
    if (modelUMA)
    {
        //var rowsToUpdate = {};    
        for (var i=0;i<modelUMA.data.length;i++)
        {
            
                //uMAList.push(modelUMA.data[i].User_Manual_Contact__c);
                if (modelUMA.data[i].Account__c)
                {
                    uMAList.push(modelUMA.data[i].Account__c);
                }
        }
       
    }
    console.log(uMAList);
    var JSONString = JSON.stringify(uMAList, null, 2);
    console.log(JSONString);
    
    if (uMAList)
    {
        var result = sforce.apex.execute('SingleManualReminderEmail','SingleManualReminderEmail', {eventEditionId:eID,accList:JSONString,EventEditionManual:eventManual},function(result){
        console.log(result);
        });
    }
});
}(window.skuid));