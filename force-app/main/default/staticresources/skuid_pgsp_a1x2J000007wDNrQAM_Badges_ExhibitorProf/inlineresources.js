(function(skuid){
skuid.snippet.register('newSnippet',function(args) {/*var params = arguments[0],
	$ = skuid.$;
	var modelA = skuid.model.getModel('CurrentUser');
    var rowUser = modelA.getFirstRow();
    var model = arguments[0].ManualPermissionRequired,
    row = arguments[0].row;
    var ManualPerId = arguments[0].item.row.Id;
    console.log(ManualPerId);
    var result = sforce.apex.execute('UpdateUserManualAction','updateUserManualAction', {ManualPermissionId:ManualPerId, ContactId:rowUser.ContactId, UserID:rowUser.Id},function(result){
      console.log(result);
            });*/
});
skuid.snippet.register('removeHyperlink',function(args) {/*
    ** Snippet to remove the hyperlink from the field
*/
var field = arguments[0],
value = arguments[1],
$ = skuid.$;	
    
//If we are in edit mode render the reference field as pick list    
    if(field.mode === 'edit') 
    {
// temporarily set to REFPICK so we get the stock reference picklist functionality
        field.options.type = 'REFPICK';
// render away 
        skuid.ui.fieldRenderers[field.metadata.displaytype][field.mode](field, value);
// set it back to custom
        field.options.type = 'CUSTOM';
    }

// If we're  in read mode, then remove hyperlink 
if (field.mode !== 'edit') 
{
   skuid.ui.fieldRenderers[field.metadata.displaytype][field.mode](field, value);
    var linkTag = $('a', field.element);
    if(linkTag.length)
    {
        var output = $('<div>');
        output.append(linkTag.html());
    }   
    linkTag.replaceWith(output);
}
});
skuid.snippet.register('ckTextArea',function(args) {SetupCKTextArea(
	arguments[0] //Field
	, arguments[1] //Value
);
});
var $ = skuid.$;

window.CKSettings = {
    removePlugins: 'pagebreak,preview,print,save,selectall,showblocks,showborders,smiley,tab,clipboard,panelbutton,colorbutton,colordialog,templates,div,resize,elementspath,enterkey,entities,popup,filebrowser,find,flash,floatingspace,forms,htmlwriter,iframe,menubutton,language,magicline,newpage,pagebreak,selectall,subscript,superscript,showblocks,showborders,scayt,tab,tabletools,justify,bidi,font'
    ,removeButtons: 'Subscript,Superscript,Underline'
};

function SetupCKTextArea(field, value) {
    /* Create and grab DOM elements */        
    skuid.ui.fieldRenderers.TEXTAREA.edit(field, value);
    var uniqid = RandomID();
    field.element.attr('id', uniqid);
    setTimeout(function(){
        var element = $("#" + uniqid + ">div");
        element.html(element.text());
        var instance = CKEDITOR.replace(element[0], window.CKSettings);
        instance.on('change', function() {
            var fieldRow = field.row
                , fieldId = field.id
                , fieldText = this.getData()
                , fieldData = {};
            fieldData[fieldId] = fieldText;
            console.log(field);
            field.model.updateRow(fieldRow, fieldData, {initiatorId : field._GUID});
            
        });
    },100);
}
function RandomID() {
    var S4 = function() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
};
skuid.snippet.register('newSnippet',function(args) {/*
    ** Snippet to send mass email reminder to all the users who hasn't viewed and agreed manuals.
*/
var params = arguments[0],
	$ = skuid.$;

    var modelE = skuid.model.getModel('EventEdition');
    var rowE = modelE.getFirstRow();
    var eID= rowE.Id;
    console.log(eID);

    if (eID !== null)
    {
        var result = sforce.apex.execute('TesBatchExports','TesBatchExports', {eventEditionId:eID},function(result){
        console.log(result);
        });
    }
});
skuid.snippet.register('NavigationRedirect',function(args) {/*This snippet is to take back to customer center settings page*/
var params = arguments[0],
	$ = skuid.$;
var modelA = skuid.model.getModel('EventEdition');
        var rowE = modelA.getFirstRow();
        var eId= rowE.Id;
        window.location.href ='/one/one.app#/alohaRedirect/apex/c__Redirect_CC_Settings_Page?id='+eId;  //'/apex/skuid__ui?page=Customer_Center_Settings_Page&id='+eId;
});
skuid.snippet.register('CustomerCenterHomeRedirect',function(args) {/*This snippet is to take back to customer center Home page*/
var params = arguments[0],
	$ = skuid.$;
var modelA = skuid.model.getModel('EventEdition');
        var rowE = modelA.getFirstRow();
        var eId= rowE.Id;
        window.location.href ='/one/one.app#/alohaRedirect/apex/Event_Assigned_To_You'; //'/apex/skuid__ui?page=Operation_Team_Event_List';
});
skuid.snippet.register('checkEmailFormat',function(args) {var params = arguments[0],
	$ = skuid.$;
var modelA = skuid.model.getModel('EventSettings');
        var rowE = modelA.getFirstRow();
        var emailFieldValue= rowE.VIP_badge_notification_recipient__c;
        var pageTitle = $('#sk-2bp-i_-156'); // Page Title to display the error message
        var editor = pageTitle.data('object').editor; 
        if(emailFieldValue){
            var regExpEmailformat = /^(([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)(\s*,\s*|\s*$))*$/;
            if(emailFieldValue.match(regExpEmailformat)){
                return true; 
            }
	        else{
                editor.handleMessages(
                [{
                    message: 'Please enter a valid email',
                    severity: 'ERROR'
                }]
                );
                    return false;
                }
        }
});
skuid.snippet.register('createBoothTypeRecords',function(args) {var params = arguments[0],
	$ = skuid.$;
    var modelEE = skuid.model.getModel('EventEdition');
    var row = modelEE.getFirstRow();
    var EEId = row.Id;
    console.log('==========eveId: '+EEId);
    if(EEId != null && EEId !=''){
        var result = sforce.apex.execute('CreateBoothTypeRecordsOfBadges','createBoothTypeRecordsBadges', {eventId:EEId},function(result){
            console.log(result);
        });
    }
});
skuid.snippet.register('pageLoad',function(args) {/*This snippet will reload the page*/
var params = arguments[0],
	$ = skuid.$;
var modelA = skuid.model.getModel('EventEdition');
        var rowE = modelA.getFirstRow();
        var eId= rowE.Id;
        window.location.href ='/apex/skuid__ui?page=Badges_ExhibitorProfile_ForOps&id='+eId;
});
skuid.snippet.register('checkBadgeSizeFromTo',function(args) {var params = arguments[0],
	$ = skuid.$;
	var pageTitle = $('#errorMessage');
    var editor = pageTitle.data('object').editor;
    var modelB = skuid.model.getModel('AddBadgesLimit');
    var rowB = modelB.getFirstRow();
    var fromSize= rowB.Booth_Size_From__c;
    var toSize = rowB.Booth_Size_To__c; 
    var badgeAllowed = rowB.Badges_Allowed__c;
    console.log('fromSize  '+fromSize);
    console.log('toSize  '+toSize);
    if ((fromSize <0 && fromSize) || (toSize <0 && toSize ) || (badgeAllowed <0 && badgeAllowed ))
    {
        editor.handleMessages(
        [{
            message: 'Please enter value greater or equal to 0',
            severity: 'ERROR'
        }]
    );
    return false;
    }
    if (fromSize >=toSize)
    {
        editor.handleMessages(
        [{
            message: '"From" should be smaller than "To" ',
            severity: 'ERROR'
        }]
    );
    return false;
    }
});
skuid.snippet.register('checkBadgeSizeFromTo_Edit',function(args) {var params = arguments[0],
    contextRow = params.item ? params.item.row : params.row,
    contextModel = params.model,
	$ = skuid.$;
    	var pageTitle = $('#errorMessageEdit');
        var editor = pageTitle.data('object').editor;
        var fromSize = contextModel.getFieldValue(contextRow, 'Booth_Size_From__c', true);
        var toSize = contextModel.getFieldValue(contextRow, 'Booth_Size_To__c', true);
        var badgeAllowed = contextModel.getFieldValue(contextRow, 'Badges_Allowed__c', true);
        console.log('fromSize  '+fromSize);
        console.log('toSize  '+toSize);
        if ((fromSize <0 && fromSize) || (toSize <0 && toSize )|| (badgeAllowed <0 && badgeAllowed )) 
        {
            editor.handleMessages(
            [{
                message: 'Please enter value greater or equal to 0',
                severity: 'ERROR'
            }]
        );
        return false;
        }
        if (fromSize >=toSize)
        {
            editor.handleMessages(
            [{
                message: '"From" should be smaller than "To" ',
                severity: 'ERROR'
            }]
        );
        return false;
    }
});
}(window.skuid));