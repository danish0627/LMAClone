(function(skuid){
skuid.snippet.register('UserAcionFormViewSnippet',function(args) {/* 
    ** Snippet to export list of users who has views forms
*/
var model = skuid.model.getModel('UserAcionFormView');
var row= model.getFirstRow();
model.exportData({
    fileName: 'Form- '+row.Form_Permission__r.Event_Edition_Form__r.Forms__r.Name+'.csv',
    doNotAppendRowIdColumn: true,
    fields: 
    [
        model.getField('Form_Permission__r.Event_Edition_Form__r.Forms__r.Name'),
        model.getField('Is_Viewed__c'),
        model.getField('Account__r.Name'),
        model.getField('User_Type__r.Name'),
        model.getField('User_Form_Contact__r.Email')
    ]
});
});
skuid.snippet.register('UserActionFormNotViewSnippet',function(args) {/* 
    ** Snippet to export list of users who hasn't views forms
*/
var model = skuid.model.getModel('UserActionFormNotView');
var row= model.getFirstRow();
model.exportData({
    fileName: 'Form- '+row.Form_Permission__r.Event_Edition_Form__r.Forms__r.Name+'.csv',
    doNotAppendRowIdColumn: true,
    fields: 
    [
        model.getField('Form_Permission__r.Event_Edition_Form__r.Forms__r.Name'),
        model.getField('Is_Viewed__c'),
        model.getField('Account__r.Name'),
        model.getField('User_Type__r.Name'),
        model.getField('User_Form_Contact__r.Email')
        
    ]
});
});
}(window.skuid));