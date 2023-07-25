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
    removePlugins: 'pagebreak,preview,print,save,selectall,showblocks,showborders,smiley,tab,clipboard,panelbutton,colordialog,templates,div,resize,elementspath,enterkey,entities,popup,filebrowser,find,flash,floatingspace,forms,htmlwriter,iframe,menubutton,language,magicline,newpage,pagebreak,selectall,subscript,superscript,showblocks,showborders,scayt,tab,tabletools,bidi'
    ,removeButtons: 'Subscript,Superscript'
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
skuid.snippet.register('Checkboxrender',function(args) {alert('test');
});
skuid.snippet.register('checkBoothType',function(args) {/*
    ** Snippet to check booth type for stand contractor tab
*/
var eveModel = skuid.model.getModel('EventEdition');
var eveModelRow = evelModel.getFirstRow();

var userModel = skuid.model.getModel('CurrentUser');
var userModelRow = userModel.getFirstRow();
console.log('====Eve :'+eveModelRow.Event_Code__c);
console.log('====Acc :'+userModelRow.Account.Id);
var result1 = sforce.apex.execute('CheckStandContractorTabPermissionCC','checkPermission',{sEventcode:eveModelRow.Event_Code__c},{accId:userModelRow.Account.Id});
console.log(result1);
});
}(window.skuid));