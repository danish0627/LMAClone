(function(skuid){
skuid.snippet.register('createNewComUserTypeMap',function(args) {/* 
**Snippet to create the componnetUserTypeMapping records for the User type
*/
var params = arguments[0],
	$ = skuid.$;
	var modelA = skuid.model.getModel('UserType');
    var rowUser = modelA.getFirstRow();
    var model = arguments[0].ManualPermissionRequired,
    row = arguments[0].row;
    var userType = arguments[0].item.row.Id;
    var userTypeName= arguments[0].item.row.Name;
    //console.log('usertype '+userTypeName);  
    var eventEd = skuid.model.getModel('EventEdition');
    var modelB = skuid.model.getModel('ComponenrUserTypeMapping');
    //console.log(modelB.data.length);
    //console.log('Id '+eventEd.data[0].Id);
    var a =0;
     if (modelB.data.length<=0 )
    {
         a=1;
          modelB.createRow(
                { additionalConditions:[
                    {field:'Event_Edition__c',value:eventEd.data[0].Id},
                    {field:'Name',value:userTypeName+'_Permisssion_'+eventEd.data[0].Name},
                    {field:'User_Type__c',value:userType}]
                }); 
    }
    else
    {
        //console.log( modelB.data.length);
        for (var i = 0; i < modelB.data.length;i++)
        {
            //console.log('user ' +modelB.data[i].Name);
            
            if (userType==modelB.data[i].User_Type__c)
            {
                a=1;
            }
        }
    }
    if (a===0)
    {
        //console.log("dad");
        modelB.createRow(
            { additionalConditions:[
                {field:'Event_Edition__c',value:eventEd.data[0].Id},
                {field:'Name',value:userTypeName+'_Permisssion_'+eventEd.data[0].Name},
                {field:'User_Type__c',value:userType}]
            });
    }
    modelB.save();
});
skuid.snippet.register('priorityOrder',function(args) {/*
    ** Snippet to identify the priority level
*/
(function(skuid){
var $ = skuid.$;
$(document.body).one('pageload',function(){
var component = skuid.$C('sk-1ZF7zF-297'),
   listContents = component && component.element.find('.nx-list-contents');
listContents.sortable({
   placeholder: "ui-state-highlight",
   stop: function( event, ui ) {
       var data = ui.item.data('object'),
           model = data.list.model,
           movedRow = data.row,
           target = $(event.target);
       
       target.children().each(function(index,tr){
           var row =  $(tr).data('object').row,
               order = row.Priority__c;
          if (index + 1 !== order) {
              model.updateRow(row,'Priority__c',index+1,{initiatorId:component._GUID});
           }
       });
           
   }
});
});
})(skuid);
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
    removePlugins: 'pagebreak,preview,print,save,selectall,showblocks,showborders,smiley,tab,clipboard,panelbutton,colordialog,templates,div,resize,elementspath,enterkey,entities,popup,filebrowser,find,flash,floatingspace,forms,htmlwriter,iframe,menubutton,language,magicline,newpage,pagebreak,selectall,subscript,superscript,showblocks,showborders,scayt,tab,tabletools,justify,bidi'
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
skuid.snippet.register('apexLogin',function(args) {/*
var result1 = sforce.apex.execute('LoginCtrl_clone','getUserData');

alert('result1 :' +result1);
*/

var redirectUrl= 'https://ws10devpro-globalexhibitions.cs90.force.com/CustomerCenter/UserLogin';
var username = 'sachin.exhibitor@girikon.org.ws10devpro';
var password = 'Girikon!2018#';


 document.cookie = "ws__uname=' + username + ';Path=/;Max-Age=50";
 document.cookie = "ws__pass=' + password + ';Path=/;Max-Age=50";
 
//window.location = redirectUrl;
});
skuid.snippet.register('SSOURLFieldValidation',function(args) {var params = arguments[0],
	$ = skuid.$;
    var modelE = skuid.model.getModel('CMS');
	    var rowEe = modelE.getFirstRow();
        var isActive= rowEe.Is_Gorrilla_Active__c;
        var isVisible= rowEe.Is_Gorrilla_Visible__c;
        var url=  rowEe.Gorrilla_Redirect_Url__c;
    if(((isActive===true && isVisible ===true)||(isActive===true && isVisible ===false))&&(!url) )
    {
        alert ('Please make sure to have the "Redirect Link" field populated with the correct SSO link');
        modelE.updateRow(rowEe,'Is_Gorrilla_Active__c',false);
    }
});
}(window.skuid));