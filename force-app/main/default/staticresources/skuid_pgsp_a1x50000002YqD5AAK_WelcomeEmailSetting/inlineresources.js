(function(skuid){
skuid.snippet.register('removeHyperlink',function(args) {/*var field = arguments[0],
value = arguments[1],
$ = skuid.$;	

// If we're  in read mode, then remove hyperlink 

   skuid.ui.fieldRenderers[field.metadata.displaytype][field.mode](field, value);
    var linkTag = $('a', field.element);
    if(linkTag.length)
    {
        var output = $('<div>');
        output.append(linkTag.html());
    }   
    linkTag.replaceWith(output);
*/
});
skuid.snippet.register('lookupToPickList',function(args) {/*var field = arguments[0],
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
}*/
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
    },500);
}
function RandomID() {
    var S4 = function() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
};
skuid.snippet.register('Checkboxrender',function(args) {alert('test');
});
skuid.snippet.register('createDocument',function(args) {var params = arguments[0],
	$ = skuid.$;
var Att = skuid.model.getModel('AttachmentUpload');
var AttRow =  Att.getFirstRow();
console.log('=====AttRow'+AttRow.Id);

var Folder = skuid.model.getModel('FolderForImage');
var FolderId = Folder.getFirstRow().Id;
console.log('=========FolderId '+FolderId);

var EventSetting = skuid.model.getModel('EventSettings');
var EventSettingId =  EventSetting.getFirstRow().Id;
console.log('=====EventSettingId'+EventSettingId);

var result1 = sforce.apex.execute('AttachDocumentCtr','AttachDocumentCtr',{AttachmentId:AttRow.Id, sFolderid:FolderId, sEventSettingId:EventSettingId});
console.log(result1);
});
skuid.snippet.register('newSnippet',function(args) {var params = arguments[0],
	$ = skuid.$;
});
skuid.snippet.register('newSnippet',function(args) {var params = arguments[0],
	$ = skuid.$;
});
skuid.snippet.register('openEmailpopup',function(args) {window.open('https://www.google.com', '_blank', 'width=' + screen.width + ',height=' + screen.height);
});
skuid.snippet.register('sendEmail',function(args) {var params = arguments[0],
	$ = skuid.$;
	
var UType = skuid.model.getModel('UserTypeModel');
var UserType = UType.getFirstRow().UserType;
console.log('==========UserType'+UserType);

var eventSettingModel = skuid.model.getModel('EventSettings');
var eventId = eventSettingModel.getFirstRow().Event_Edition__c;

var sendEmail = 'sendemail';
var result = sforce.apex.execute('SendWelcomeEmailPreview','SendWelcomeEmailPreview',{sendEmail:sendEmail, UserType:UserType, sEventId:eventId});
console.log(result);
});
}(window.skuid));