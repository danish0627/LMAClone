(function(skuid){
skuid.snippet.register('SendRejectEmail',function(args) {/*$ = skuid.$;
var modelA = skuid.model.getModel('FormFilled');
var rowUser = modelA.getFirstRow();
var userActionId = rowUser.UserActionFormId;
console.log(userActionId);
console.log(userActionId);
var result = sforce.apex.execute('SendRejectEmail','sendRejectEmail', {FormUserActionId:userActionId},function(result){
console.log(result);
    });
*/
});
skuid.snippet.register('SendApproveEmail',function(args) {/*$ = skuid.$;
var modelA = skuid.model.getModel('FormFilled');
var rowUser = modelA.getFirstRow();
var userActionId = rowUser.UserActionFormId;
console.log(userActionId);
console.log(userActionId);
var result = sforce.apex.execute('SendRejectEmail','sendRejectEmail', {FormUserActionId:userActionId},function(result){
console.log(result);
    });*/
});
skuid.snippet.register('exportFilledFormData',function(args) {/* 
    ** Snippet to export list of users who has filled forms
*/
var model = skuid.model.getModel('UserAcionFormFilled');
var row= model.getFirstRow();
model.exportData({
    fileName: 'Form- '+row.Form_Permission__r.Event_Edition_Form__r.Name+'.csv',
    doNotAppendRowIdColumn: true,
    fields: 
    [
        model.getField('Form_Permission__r.Event_Edition_Form__r.Forms__r.Name'),
        model.getField('Is_Viewed__c'),
        model.getField('Is_Filled_Up__c'),
        model.getField('Account__r.Name'),
        model.getField('User_Form_Contact__r.Name'),
        model.getField('User_Form_Contact__r.Email'),
        model.getField('User_Type__r.Name'),
        model.getField('Form_Submitted__c')
    ]
});
});
skuid.snippet.register('exportNotFilledFormData',function(args) {/* 
    ** Snippet to export list of users who hasn't filled forms
*/
var params = arguments[0],
	$ = skuid.$;

var model = skuid.model.getModel('UserActionFormNotFilled');
var row= model.getFirstRow();
model.exportData({
    fileName: 'Form- '+row.Form_Permission__r.Event_Edition_Form__r.Forms__r.Name+'.csv',
    doNotAppendRowIdColumn: true,
    fields: 
    [
        model.getField('Form_Permission__r.Event_Edition_Form__r.Forms__r.Name'),
        model.getField('Is_Viewed__c'),
        model.getField('Is_Filled_Up__c'),
        model.getField('Account__r.Name'),
        model.getField('User_Form_Contact__r.Name'),
        model.getField('User_Form_Contact__r.Email'),
        model.getField('User_Type__r.Name')
        
    ]
});






/*
var params = arguments[0],
	$ = skuid.$;

    var modelCEEM= skuid.model.getModel('ContactEEM');
    var modelUFA = skuid.model.getModel('UserActionFormNotFilled');
    
    $.each(modelUFA.data,function(i,row){
           $.each(modelCEEM.data,function(j,rowj)
           {
                console.log(row.Account__c);
                console.log(rowj.SFContactID__r.AccountId);
                if (row.Account__c===rowj.SFContactID__r.AccountId)
                {
                    modelUFA.updateRow( row, 'UIEmail', rowj.SFContactID__r.Email);
                    console.log(' Value 1');
                } 
           });
       //}
    });
    
    modelUFA.save();
    
    var row= modelUFA.getFirstRow();
    modelUFA.exportData({
        fileName: 'Form- '+row.Form_Permission__r.Event_Edition_Form__r.Forms__r.Name+'.csv',
        doNotAppendRowIdColumn: true,
        fields: 
        [
            modelUFA.getField('Form_Permission__r.Event_Edition_Form__r.Forms__r.Name'),
            modelUFA.getField('Is_Viewed__c'),
            modelUFA.getField('Is_Filled_Up__c'),
            modelUFA.getField('Account__r.Name'),
            //modelUFA.getField('User_Form_Contact__r.name'),
           // modelUFA.getField('User_Form_Contact__r.Email'),
            modelUFA.getField('User_Type__r.Name'),
            modelUFA.getField('UIEmail')
        ]
    });
*/
});
skuid.snippet.register('rowActionSnippet',function(args) {/*
    ** Row Action snippet that will execute as row action from name field
    ** This snippet is called as field render snippet in name field
*/
var ROW_ACTION_ICON = 'sk-icon-go-to-full-detail-page';
var field = arguments[0],
    value = skuid.utils.decodeHTML(arguments[1]),
    $ = skuid.$;

skuid.ui.fieldRenderers[field.metadata.displaytype][field.mode](field,value);
// If we're NOT in edit mode, then have the "link" action show a popup
if (field.mode !== 'edit') {
    if (ROW_ACTION_ICON) {
        field.element.find('a').attr('href','#').on('click',function(){
            var closestTr = field.element.closest('tr');
            var tds = closestTr.children('td');
            var actionsCell;
            if (tds.length) {
                if (tds.first().find('input[type="checkbox"]').length) {
                    actionsCell = tds[1];
                } else {
                    actionsCell = tds[0];
                }
            }
            if (actionsCell) {
                var rowAction = $(actionsCell).find('.'+ROW_ACTION_ICON);
                if (rowAction) {
                    // Trigger the click action
                    rowAction.click();
                }
            }
        });
    }
}
});
skuid.snippet.register('newSnippet',function(args) {var params = arguments[0],
	$ = skuid.$;

$('a.testid a').click(function() {
   return false; 
});
});
skuid.snippet.register('editMode',function(args) {var $ = skuid.$;
// check for "global" toggle state variable
// if it doesn't exist, create it
if(!window.blEditorMode) window.blEditorMode = 'read';
// this will grab any visible field editor
var fieldeditors = $('.nx-basicfieldeditor');
if(window.blEditorMode == 'read') {
    // toggle button text / icon
    $('.ui-button:visible').has('.ui-silk-pencil').each(function() {
        $(this).find('.ui-button-text').text('Switch to Read Mode');            
        $(this).find('.ui-icon').removeClass('ui-silk-pencil')
            .addClass('ui-silk-book-open');
    });
    // find all field editors and switch their mode

    fieldeditors.each(function(){
        // get field editor's js component
        var fieldeditor = $(this).data('object');  
        fieldeditor.mode = 'edit'; 
        fieldeditor.list.render({doNotCache:true});         
    });
    window.blEditorMode = 'edit';
} else {
    // toggle button text / icon
    $('.ui-button:visible').has('.ui-silk-book-open').each(function() {
        $(this).find('.ui-button-text').text('Switch to Edit Mode');            
        $(this).find('.ui-icon').removeClass('ui-silk-book-open')
            .addClass('ui-silk-pencil');
    });
    fieldeditors.each(function(){
       // get field editor's js component        
     var fieldeditor = $(this).data('object');  
        fieldeditor.mode = 'read'; 
        fieldeditor.list.render({doNotCache:true});         
    });
    window.blEditorMode = 'read';
}
});
skuid.snippet.register('captureAttachmentID',function(args) {/*
    ** Snippet to capture uploaded attachmentID and populate in UI model-"UIAttachment"
*/
var params = arguments[0],
	$ = skuid.$;
	var modelA = skuid.model.getModel('UploadCenter');
    var modelB = arguments[0].UserAcionFormFilled,
    row = arguments[0].row;
    var userActionFormID = arguments[0].item.row.Id;
    console.log(userActionFormID);
    var attchID;
    console.log(modelA.data.length);
    for (var i = 0; i<modelA.data.length;i++)
    {
        if (modelA.data[i].User_Form_Action__c==userActionFormID)
        {
            attchID = modelA.data[i].Uploaded_Attachment_Id__c;
            console.log(attchID);
        }
    }
    var modelC = skuid.model.getModel('UIAttachment');
    modelC.createRow({
            additionalConditions: [
                {field: 'AttachmentID', value: attchID},
            ]
        });
    modelC.save();
    console.log(modelC.data[0].AttachmentID);
    console.log(modelC);
    
    
    /*var params = arguments[0],   
contextRow = params.item ? params.item.row : params.row,
contextModel = params.model,
$ = skuid.$;
var contextId = contextModel.getFieldValue(contextRow, 'Id', true);
console.log('contextId:'+contextId);
var modelA = skuid.model.getModel('UploadCenter');
var modelB = arguments[0].UserAcionFormFilled,
row = arguments[0].row;
console.log('modelB:'+modelB);
var userActionFormID = arguments[0].item.row.Id;
console.log(userActionFormID);
var attchID;
for (var i = 0; i<modelA.data.length;i++)
{
    if (modelA.data[i].User_Form_Action__c==userActionFormID)
    {
        attchID = modelA.data[i].Uploaded_Attachment_Id__c;
    }
}
var modelC = skuid.model.getModel('UIAttachment');
modelC.createRow({
        additionalConditions: [
            {field: 'AttachmentID', value: attchID},
        ]
    });
modelC.save();
console.log(modelC.data[0].AttachmentID);
console.log(modelC);
//return attchID;*/
});
skuid.snippet.register('singleReminderEmail',function(args) {/*
    ** Snippet to send single reminder email to all the user who hasn't filled that particular form
*/
var params = arguments[0],
	$ = skuid.$;

    var modelE = skuid.model.getModel('EventEdition');
    console.log(modelE);
    var rowE = modelE.getFirstRow();
    var eID= rowE.Id;
    console.log(eID);
    
    var modelEF = skuid.model.getModel('FormPermission');
    var rowEF = modelEF.getFirstRow();
    var eventForm= rowEF.Event_Edition_Form__c;
    console.log(eventForm);
    
    var modelUFA = skuid.model.getModel('UserActionFormNotFilled');
    console.log(modelUFA.data.length);
    
    
   // var modelUA = skuid.model.getModel('UserActionFormNotFilled');
    var uFAList=[]; // Array to pupulate User Id List to pass it to Salesforce
    if (modelUFA)
    {
        //var rowsToUpdate = {};    
        for (var i=0;i<modelUFA.data.length;i++)
        {
            
                //uFAList.push(modelUFA.data[i].User_Form_Contact__c);
                uFAList.push(modelUFA.data[i].Account__c);
        }
       
    }
    console.log(uFAList);
    var JSONString = JSON.stringify(uFAList, null, 2);
    console.log(JSONString);
    
    if (uFAList)
    {
        var result = sforce.apex.execute('SingleFormReminderEmail','SingleFormReminderEmail', {eventEditionId:eID,accList:JSONString,EventEditionForm:eventForm},function(result){ //conList
        console.log('==='+result);
        });
    }
});
skuid.snippet.register('sendFormAcceptEmail',function(args) {/*
    ** Snippet to send email once forms has been accepted
*/
var params = arguments[0],
	
$ = skuid.$;

var modelE = skuid.model.getModel('EventEdition');
    var rowE = modelE.getFirstRow();
    var eID= rowE.Id;
    
var modelA = skuid.model.getModel('FormFilled');
var rowUser = modelA.getFirstRow();
var userActionId = rowUser.UserActionFormId;
var appprovalNote = rowUser.ApprovalNote;
console.log(userActionId);
console.log(appprovalNote);

 var modelEF = skuid.model.getModel('FormPermission');
    var rowEF = modelEF.getFirstRow();
    var eventForm= rowEF.Event_Edition_Form__c;
    console.log(eventForm);

    var result = sforce.apex.execute('FormAcceptEmail','FormAcceptEmail', {eventEditionId:eID, userActionId: userActionId,EventEditionForm:eventForm,appprovalNote:appprovalNote},function(result){
    console.log(result);
    });
});
skuid.snippet.register('sendFormRejectEmail',function(args) {/*
    ** Snippet to send email once forms has been rejected
*/
var params = arguments[0],
	
$ = skuid.$;

var modelE = skuid.model.getModel('EventEdition');
    var rowE = modelE.getFirstRow();
    var eID= rowE.Id;
    
var modelA = skuid.model.getModel('FormFilled');
var rowUser = modelA.getFirstRow();
var userActionId = rowUser.UserActionFormId;
var rejectionNote = rowUser.RejectionNote;
console.log(userActionId);
console.log(rejectionNote);

 var modelEF = skuid.model.getModel('FormPermission');
    var rowEF = modelEF.getFirstRow();
    var eventForm= rowEF.Event_Edition_Form__c;
    console.log(eventForm);


    var result = sforce.apex.execute('FormRejectEmail','FormRejectEmail', {eventEditionId:eID, userActionId: userActionId,EventEditionForm:eventForm,rejectionNote:rejectionNote},function(result){
    console.log(result);
    });
});
skuid.snippet.register('EexportFormData',function(args) {/* 
    ** Snippet to export user filled data 
Event_Edition_Form__r.Name
*/
var model = skuid.model.getModel('UserFormData');
var row= model.getFirstRow();
model.exportData({
    //fileName: 'Form'+'.csv',
    fileName: 'Form- '+row.Event_Edition_Form__r.Name+'.csv',
    doNotAppendRowIdColumn: true,
    fields: 
    [
        model.getField('User_Contact_Label__c'),
        model.getField('User_Contact__r.Name'),
        model.getField('Name_Label__c'), 
		model.getField('Name'),      
        model.getField('Hall_No_Label__c'),
		model.getField('Hall_No__c'),
        model.getField('Booth_Label__c'), 
		model.getField('Booth__c'),        
        model.getField('Booth_Size_Dimension_Label__c'),
		model.getField('Booth_Size_Dimension__c'),
		model.getField('CheckBox_1_Label__c'),
        model.getField('CheckBox_1__c'), 
        model.getField('CheckBox_2_Label__c'),
        model.getField('CheckBox_2__c'),
        model.getField('CheckBox_3_Label__c'),
        model.getField('CheckBox_3__c'), 
        model.getField('Check_Box_4_Label__c'), 
        model.getField('Check_Box_4__c'),
        model.getField('Check_Box_5_Label__c'),
        model.getField('Check_Box_5__c'),
        model.getField('Check_Box_6_Label__c'),
        model.getField('Check_Box_6__c'),
        model.getField('Check_Box_7_Label__c'), 
        model.getField('Check_Box_7__c'),
        model.getField('Check_Box_8_Label__c'),
        model.getField('Check_Box_8__c'), 
        model.getField('Check_Box_9_Label__c'),
        model.getField('Check_Box_9__c'),
        model.getField('Check_Box_10_Label__c'),
        model.getField('Check_Box_10__c'), 
        model.getField('CheckBox_11_Label__c'),
        model.getField('Check_Box_11__c'),
        model.getField('Check_Box_12_Label__c'),
        model.getField('Check_Box_12__c'),
        model.getField('Check_Box_13_Label__c'),
        model.getField('Check_Box_13__c'),
        model.getField('Check_Box_14_Label__c'),
        model.getField('Check_Box_14__c'),
        model.getField('Check_Box_15_Label__c'),
        model.getField('Check_Box_15__c'), 
        model.getField('Check_Box_16_Label__c'),
        model.getField('Check_Box_16__c'),
        model.getField('Check_Box_17_Label__c'),
        model.getField('Check_Box_17__c'), 
        model.getField('Check_Box_18_Label__c'),
        model.getField('Check_Box_18__c'),
        model.getField('Check_Box_19_Label__c'), 
        model.getField('Check_Box_19__c'),
        model.getField('Check_Box_20_Label__c'),
        model.getField('Check_Box_20__c'),
        model.getField('Check_Box_21_Label__c'), 
        model.getField('Check_Box_21__c'),
        model.getField('Check_Box_22_Label__c'),
        model.getField('Check_Box_22__c'), 
        model.getField('Check_Box_23_Label__c'),
        model.getField('Check_Box_23__c'),
        model.getField('Check_Box_24_Label__c'),
        model.getField('Check_Box_24__c'), 
        model.getField('Check_Box_25_Label__c'),
        model.getField('Check_Box_25__c'),
        model.getField('Check_Box_26_Label__c'), 
        model.getField('Check_Box_26__c'),
        model.getField('Company_Name_Label__c'),
        model.getField('Company_Name__c'),
        model.getField('Confirm_Check_Box_Label__c'),
        model.getField('Confirm_Check_Box__c'),
        model.getField('Contact_Email_Label__c'),
        model.getField('Contact_Email__c'), 
        model.getField('Contact_Mobile_Number_Label__c'),
        model.getField('Contact_Mobile_Number__c'),
        model.getField('Contact_Name_Label__c'),
        model.getField('Contact_Name__c'),         
        model.getField('Contact_Position_Label__c'),
        model.getField('Contact_Position__c'), 
        model.getField('Date_Label__c'),
        model.getField('Date__c'),
        model.getField('Date_1_Label__c'),
        model.getField('Date_1__c'), 
        model.getField('Date_Time_1_Label__c'),
        model.getField('Date_Time_1__c'),
        model.getField('Date_Time_2_Label__c'), 
        model.getField('Date_Time_2__c'),
        model.getField('Date_Time_3_Label__c'),
        model.getField('Date_Time_3__c'),
        model.getField('Date_Time_4_Label__c'), 
        model.getField('Date_Time_4__c'),
        model.getField('Declaration_Authorised_By_Label__c'),
        model.getField('Declaration_Authorised_By__c'), 
        model.getField('Direct_No_Label__c'),
        model.getField('Direct_No__c'),
        model.getField('Email_Label__c'),
        model.getField('Email__c'), 
        model.getField('Estimate_of_people_Label__c'),
        model.getField('Estimate_of_people__c'),
        model.getField('Exhibiting_As_label__c'), 
        model.getField('Exhibiting_As__c'),
        model.getField('Field_1_Label__c'),
        model.getField('Field_1__c'),
        model.getField('Field_2_Label__c'), 
        model.getField('Field_2__c'),
        model.getField('Field_3_Label__c'),
        model.getField('Field_3__c'), 
        model.getField('Field_4_Label__c'),
        model.getField('Field_4__c'),
        model.getField('Field_5_Label__c'),
        model.getField('Field_5__c'), 
        model.getField('Field_6_Label__c'),
		model.getField('Field_6__c'),
        model.getField('Field_7_Label__c'), 
        model.getField('Field_7__c'),
        model.getField('Field_8_Label__c'),
        model.getField('Field_8__c'),
        model.getField('Field_9_Label__c'), 
        model.getField('Field_9__c'),
        model.getField('Field_10_Label__c'),
        model.getField('Field_10__c'), 
        model.getField('Field_11_Label__c'),
        model.getField('Field_11__c'),
        model.getField('Field_12_Label__c'),
        model.getField('Field_12__c'), 
        model.getField('Field_13_Label__c'),
        model.getField('Field_13__c'),
        model.getField('Field_14_Label__c'), 
        model.getField('Field_14__c'),
        model.getField('Field_15_Label__c'),
        model.getField('Field_15__c'),
        model.getField('Field_16_Label__c'), 
        model.getField('Field_16__c'),
        model.getField('Field_17_Label__c'),
        model.getField('Field_17__c'),
		model.getField('Full_Name_Label__c'),		
        model.getField('Full_Name__c'),
        model.getField('Long_Text_Field_1_Label__c'),
        model.getField('Long_Text_Field_1__c'),
        model.getField('Long_Text_Field_2_label__c'), 
        model.getField('Long_Text_Field_2__c'),
        model.getField('Long_Text_Field_3_Label__c'), 
        model.getField('Long_Text_Field_3__c'),
        model.getField('Position_Label__c'),
        model.getField('Position__c'),
        model.getField('Reason_for_exception_Label__c'), 
        model.getField('Reason_for_exception__c'),
        model.getField('Space_only_stand_area_FF_Label__c'),
        model.getField('Space_only_stand_area_FF__c'), 
        model.getField('Space_only_stand_area_GL_Label__c'),
        model.getField('Space_only_stand_area_GL__c'),
        model.getField('Stand_Contact_Name_Label__c'),
        model.getField('Stand_Contact_Name__c'), 
        model.getField('Stand_Contact_Number_Label__c'),
        model.getField('Stand_Contact_Number__c'),
        model.getField('Stand_Name_Label__c'), 
        model.getField('Stand_Name__c'),
        model.getField('Text_Area_1_Label__c'),
        model.getField('Text_Area_1__c'),
        model.getField('Text_Area_2_Label__c'), 
        model.getField('Text_Area_2__c')
        
    ]
    
});
});
}(window.skuid));