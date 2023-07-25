(function(skuid){
function callAddVal(param)
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
skuid.snippet.register('updateContent',function(args) {/*
    ** Snippet to prevent user from entering script tag in rich text (wisywig)
*/
var params = arguments[0],
	
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
skuid.snippet.register('popFields',function(args) {/*
Snippet fiecthing the id of the context.
*/

var params = arguments[0],
	
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
skuid.snippet.register('populateProductCategoryforSubCat',function(args) {var params = arguments[0],
    contextRow = params.item ? params.item.row : params.row,
    contextModel = params.model,
    $ = skuid.$;
    
    // Getting context row of the Product
    var ProductCat = contextModel.getFieldValue(contextRow, 'Product_Category__c', true);
    var eventEdition = contextRow.Event_Edition__c;
  	var productCat = contextRow.Product_Category__c;
  	console.log('Context productCat: '+productCat);
    console.log('Context eventEdition: '+eventEdition);
    
   /* //Getting the New Event Edition Product Pricebook Object Name
    var modelSubCat = skuid.model.getModel('NewEEPCMForSubCat');
    var prodAdd = modelSubCat.createRow({ 
                    additionalConditions: [
                        { field: 'Event_Edition__c', value: eventEdition},
                        { field: 'Product_Category__c', value: productCat},
                    ],doAppend: true});
               
                 modelSubCat.save();
                 */
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
skuid.snippet.register('updateCustomerProSunCategoryId',function(args) {/*var params = arguments[0],
	
contextRow = params.item ? params.item.row : params.row,
contextModel = params.model,
$ = skuid.$;
   
var contextEPSubId = contextModel.getFieldValue(contextRow, 'Id', true);
console.log('contextEPSubId  '+contextEPSubId);
var modelCPSCat = skuid.$M('CustomerProSubCate');
//var a = modelCusProSubCat.data.length;
//console.log('a'+a);
var rowsToDelete = {};
var modelCPSCat = skuid.$M('CustomerProSubCate');
            modelCPSCat.setCondition(modelCPSCat.getConditionByName('SubCatMapId'),contextEPSubId);
            modelCPSCat.updateData();

console.log("len"+modelCPSCat.data.length);*/
});
skuid.snippet.register('deleteCPSCategory',function(args) {/*var params = arguments[0],
	$ = skuid.$;
var modelCPSCatt = skuid.$M('CustomerProSubCate');
console.log("lenSevvc"+modelCPSCatt.data.length);
var rowsToDelete = {};
for (var i = 0; i<modelCPSCatt.data.length;i++)
{
    console.log("IDDD"+modelCPSCatt.data[i].Id);
    modelCPSCatt.deleteRow({Id:modelCPSCatt.data[i].Id});
}

modelCPSCatt.save();*/
});
skuid.snippet.register('deleteEEPSCMapping',function(args) {var params = arguments[0],
   contextRow = params.item ? params.item.row : params.row,
    contextModel = params.model,
    $ = skuid.$;
    // Getting context row of the Form Permission   
    var contextEPSubId = contextModel.getFieldValue(contextRow, 'Id', true);
    console.log('contextEPSubId  '+contextEPSubId);
   
    var result = sforce.apex.execute('DeleteCustomerProdCubCategory','deleteCustomerProdSubCategory', {EPSCMId:contextEPSubId},function(result){
      console.log('====='+result);
            });
});
skuid.snippet.register('deleteEEPCMapping',function(args) {var params = arguments[0],
   contextRow = params.item ? params.item.row : params.row,
    contextModel = params.model,
    $ = skuid.$;
    // Getting context row of the Form Permission   
    var contextEPCatMapId = contextModel.getFieldValue(contextRow, 'Id', true);
    console.log('contextEPSubId  '+contextEPCatMapId);
   
    var result = sforce.apex.execute('DeleteCustomerProdCubCategory','deleteCustomerProdCatCategory', {EPCMId:contextEPCatMapId},function(result){
      console.log('========'+result);
            });
});
skuid.snippet.register('NavigationRedirect',function(args) {/*This snippet is to take back to customer center settings page*/
var params = arguments[0],
	$ = skuid.$;
var modelA = skuid.model.getModel('EventEdition');
        var rowE = modelA.getFirstRow();
        var eId= rowE.Id;
        window.location.href ='/one/one.app#/alohaRedirect/apex/c__Redirect_CC_Settings_Page?id='+eId;//   '/apex/skuid__ui?page=Customer_Center_Settings_Page&id='+eId;
});
skuid.snippet.register('CustomerCenterHomeRedirect',function(args) {/*This snippet is to take back to customer center Home page*/
var params = arguments[0],
	$ = skuid.$;
var modelA = skuid.model.getModel('EventEdition');
        var rowE = modelA.getFirstRow();
        var eId= rowE.Id;
        window.location.href ='/one/one.app#/alohaRedirect/apex/Event_Assigned_To_You';// '/apex/skuid__ui?page=Operation_Team_Event_List';
});
}(window.skuid));