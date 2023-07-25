(function(skuid){
skuid.snippet.register('UserActionManualViewSnippet',function(args) {/*
    ** Snippet to export all the userlist who has view the Manuals
*/
var model = skuid.model.getModel('UserActionManualView');
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
skuid.snippet.register('UserActionManualNotViewSnippet',function(args) {/*
    ** Snippet to export all the userlist who hasn't view the Manuals
*/
var model = skuid.model.getModel('UserActionManualNotView');
var row= model.getFirstRow();
model.exportData({
    fileName: 'Manual- '+row.Manual_Permission__r.Manuals__r.Name+'.csv',
     doNotAppendRowIdColumn: true,
    fields: 
    [
        model.getField('Manual_Permission__r.Manuals__r.Name'),
        model.getField('Account__r.Name'),
        model.getField('Is_Viewed__c'),
        model.getField('User_Type__r.Name'),
        model.getField('User_Manual_Contact__r.Email')
    ]
});
});
}(window.skuid));