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
    removePlugins: 'pagebreak,preview,print,save,selectall,showblocks,showborders,smiley,tab,panelbutton,colorbutton,colordialog,templates,div,resize,elementspath,enterkey,entities,popup,filebrowser,find,flash,floatingspace,forms,htmlwriter,iframe,menubutton,language,magicline,newpage,pagebreak,selectall,subscript,superscript,showblocks,showborders,scayt,tab,tabletools,justify,bidi,font'
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
skuid.snippet.register('CustomerCenterSettingPage',function(args) {/*This snippet is to take back to customer center settings page*/
var params = arguments[0],
	$ = skuid.$;
var modelA = skuid.model.getModel('EventEdition');
        var rowE = modelA.getFirstRow();
        var eId= rowE.Id;
        window.location.href ='/one/one.app#/alohaRedirect/apex/c__Redirect_CC_Settings_Page?id='+eId; // '/apex/skuid__ui?page=Customer_Center_Settings_Page&id='+eId;
});
skuid.snippet.register('CustomerCenterHomePage',function(args) {/*This snippet is to take back to customer center home page*/
var params = arguments[0],
	$ = skuid.$;
var modelA = skuid.model.getModel('EventEdition');
        var rowE = modelA.getFirstRow();
        var eId= rowE.Id;
        window.location.href ='/one/one.app#/alohaRedirect/apex/Event_Assigned_To_You'; //'/apex/skuid__ui?page=Operation_Team_Event_List';
});
skuid.snippet.register('PageReload',function(args) {/*This snippet will reload the page*/
var params = arguments[0],
	$ = skuid.$;
var modelA = skuid.model.getModel('EventEdition');
        var rowE = modelA.getFirstRow();
        var eId= rowE.Id;
        window.location.href ='/apex/skuid__ui?page=AgentOwnExhibitorsSetting&id='+eId;
});
}(window.skuid));