(function(skuid){
skuid.snippet.register('ckEditorModalFix',function(args) {orig_allowInteraction = $.ui.dialog.prototype._allowInteraction;
$.ui.dialog.prototype._allowInteraction = function(event) {
  if ($(event.target).closest('.cke_dialog').length) {
    return true;
  }
  return orig_allowInteraction.apply(this, arguments);
};
});
skuid.snippet.register('populateFields',function(args) {var params = arguments[0],
	$ = skuid.$;
var modelA = skuid.model.getModel('New_EEE_Template1');
var rowA = modelA.getFirstRow();
console.log('EE_Template== '+rowA.Id);
var modelB = skuid.model.getModel('EmailTemplate');
var rowB = modelB.getFirstRow();
console.log('EmailTemplate=== '+rowB.Id);

   var title_B = modelB.data[0].Name;
   var content_B = modelB.data[0].Content__c;
   var subject_B = modelB.data[0].Subject__c;
   var templaceCode_B = modelB.data[0].Template_Code__c;

//console.log('title_B= '+title_B+' content_B= '+content_B+' subject_B= '+subject_B+' templaceCode_B= '+templaceCode_B);


modelA.updateRow(
    { Id: rowA.Id },
    { Name: title_B, Subject__c: subject_B, Content__c: content_B,Email_Template_Code__c:templaceCode_B }
);

modelA.save();
});
skuid.snippet.register('deleteFields',function(args) {var params = arguments[0],
	$ = skuid.$;
var modelA = skuid.model.getModel('New_EEE_Template1');
var rowA = modelA.getFirstRow();
console.log('EEE_Template ID: '+rowA.Id);

modelA.deleteRow({Id:modelA.data[0].Id});
modelA.save();
});
function insertIntoEditor(param)
{
    var div = document.getElementsByClassName('nx-richtext-input');
    
    div[0].focus() ; // DIV with cursor is 'myInstance1' (Editable DIV)
    var sel, range;
    var text =param; // Textarea containing the text to add to the myInstance1 DIV
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) 
        {
            range = sel.getRangeAt(0);
            range.deleteContents();

            var lines = text.replace("\r\n", "\n").split("\n");
            var frag = document.createDocumentFragment();
            for (var i = 0, len = lines.length; i < len; ++i) {
                if (i > 0) 
                {
                    frag.appendChild( document.createElement("br") );
                }
                frag.appendChild( document.createTextNode(lines[i]) );
            }
            range.insertNode(frag);
            div[0].focus() ;
           //$ = skuid.$;
           //alert(div[0].innerHTML);
        }
    } else if (document.selection && document.selection.createRange) {
        document.selection.createRange().text = text;
    }
};
skuid.snippet.register('updateContent',function(args) {var params = arguments[0],
	
contextRow = params.item ? params.item.row : params.row,
contextModel = params.model,
$ = skuid.$;

var contextId = contextModel.getFieldValue(contextRow, 'Id', true);
var contextContent = contextRow.Content__c;
//contextRow.HTML_Content = contextContent;


	console.log('contextId: '+contextId);
    console.log('contextContent: '+contextContent);
    console.log('contextRow: '+contextRow.HTML_Content);
    var inpObj = contextRow.HTML_Content;
    var scriptTagArray = ["<script>", "<\/script>", "<script type='text\/javascript'>","<\/script>"];
    for (i = 0; i < scriptTagArray.length; i++) { 
    	var isJScrpt= inpObj.indexOf(scriptTagArray[i]);
    	if(isJScrpt>-1)
    	{
    		alert('Please do not use script tag in side HTML Content');
    		return false;
    	}
    }
    var modelA = skuid.model.getModel('EEE_Template');
    modelA.updateRow(
        { Id: contextId },
        { Content__c:contextRow.HTML_Content  }
    );
    
    modelA.save();
});
skuid.snippet.register('popFields',function(args) {var params = arguments[0],
	
contextRow = params.item ? params.item.row : params.row,
contextModel = params.model,
$ = skuid.$;

var contextId = contextModel.getFieldValue(contextRow, 'Id', true);
var contextContent = contextRow.Content__c;
contextRow.HTML_Content = contextContent;
	console.log('contextId: '+contextId);
    console.log('contextContent: '+contextContent);
    console.log('contextRow: '+contextRow.HTML_Content);
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
function insertIntoEditor(text){
		//console.log(text);
		//var str = document.getElementById('string').value;
		CKEDITOR.instances['editor1'].insertText(text);
};
skuid.snippet.register('reloadPage',function(args) {window.location.reload();
});
skuid.snippet.register('ckModalInputFix',function(args) {/*$.fn.modal.Constructor.prototype.enforceFocus = function() {
  modal_this = this
  $(document).on('focusin.modal', function (e) {
    if (modal_this.$element[0] !== e.target && !modal_this.$element.has(e.target).length 
    && !$(e.target.parentNode).hasClass('cke_dialog_ui_input_select') 
    && !$(e.target.parentNode).hasClass('cke_dialog_ui_input_text')) {
      modal_this.$element.focus()
    }
  })
};*/
});
}(window.skuid));