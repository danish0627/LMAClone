(function(skuid){
skuid.snippet.register('exportFormData',function(args) {/*
    ** Snippet to export data for UserActionForm records
*/
var model = skuid.model.getModel('UserFormAction');
model.exportData({
    fileName: 'FormExportData',
    fields: 
    [
        model.getField('Form_Permission__r.Event_Edition_Form__r.Name'),
        model.getField('User_Form_Contact__r.Account.Name'),
        model.getField('User_Form_Contact__r.Name'),
        model.getField('Is_Viewed__c'),
        model.getField('Is_Filled_Up__c'),
        model.getField('Form_Permission__r.User_Type__r.Name')
    ]
});
});
skuid.snippet.register('newSnippet',function(args) {/*var $ = skuid.$;
$(".nx-page").one("pageload", function()  {
    var opportunity = skuid.model.getModel('EventEdition').getFirstRow();
        
        
    var renderFieldEditor = function() {
    var pageTitle = $('#pageTitle');
        var editor = pageTitle.data('object').editor;
    
    var fieldEditor = $('.nx-basicfieldeditor').data('object');
    
    };
    
    var renderAsReadOnly = function(fieldEditor) {
        fieldEditor.mode = 'readonly'; 
    fieldEditor.list.render({doNotCache:true});
    }
    
    var displayMessage = function(editor, message, severity) {
        editor.handleMessages(
           [
               {
                  message: message
                  ,severity: severity.toUpperCase()
               }
           ]
        );
        
        $(".nx-messages *").off("click");
        $(".nx-messages *").css("cursor", "default");
    }
    
    renderFieldEditor();
});*/
});
skuid.snippet.register('test',function(args) {/*var params = arguments[0],	$ = skuid.$;
var row = params.row;
//get the page include JS object
var pageInclude = $('#include').data('object');
var pageName, queryStr;

        pageName = 'UserFormActionReport';
        queryStr = 'id=' + row.eventEditionFormrEventEdi+'&edname='+row.eventEditionFormrName;
        
    

//set the page to load
pageInclude.pagename = pageName;
//set the querystring params
pageInclude.querystring = queryStr;
//load the page
pageInclude.load();*/
});
skuid.snippet.register('test1',function(args) {/*params.row.fieldName
var oppId = params.row.Id;
panelsOnPage = skuid.component.getByType('includepanel');
//goes through all includepanels and returns the one in your context 
//(additional filtering needs to be done if you have 
//multiple pageincludes per context)
panelInContext = panelsOnPage.filter(
    
    function(panel) {
    
        return panel.context.row.Id == oppId;
    })[0];

//set the query string and load the file
//like Moshe's code in Matt's comment
panelInContext.querystring= 'id=' + row.eventEditionFormrEventEdi+'&edname='+row.eventEditionFormrName;
panelInContext.load();*/
});
skuid.snippet.register('rowAction',function(args) {/*var ROW_ACTION_ICON = 'sk-icon-popup';
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
*/
});
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
skuid.snippet.register('newSnippet',function(args) {var params = arguments[0],
	$ = skuid.$;
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
}(window.skuid));