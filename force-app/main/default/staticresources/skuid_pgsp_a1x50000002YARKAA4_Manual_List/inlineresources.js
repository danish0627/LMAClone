(function(skuid){
skuid.snippet.register('updateAttFieldsOnManual',function(args) {/*
    ** Snippet to update the attachment Id in Manual
*/
var manualModel = skuid.model.getModel('NewManual');
var manualModelRow = manualModel.getFirstRow();
console.log('manualModelRow.Id: '+manualModelRow.Id);
var attachmentModel = skuid.model.getModel('Attachment');
var attachmentRow = attachmentModel.getFirstRow();
console.log('attachmentRow.Id: '+attachmentRow.Id);
var result1 = sforce.apex.execute('updateAttFieldsOnFormAndManual','updateAttOnManual',{ManualId:manualModelRow.Id, AttId:attachmentRow.Id, AttName:attachmentRow.Name});
console.log(result1);
});
skuid.snippet.register('EditManualUpdate',function(args) {/*
    ** Snippet to update/delete Attachment field in manual
*/
var attachmentModel = skuid.model.getModel('AttachmentForEditManual');
var attachmentRow = attachmentModel.getFirstRow();
console.log(attachmentRow.Id);
var result1 = sforce.apex.execute('updateAttFieldsOnFormAndManual','updateAndDeleteAttOnManual',{ManualId:attachmentRow.ParentId, AttId:attachmentRow.Id, AttName:attachmentRow.Name});
});
skuid.snippet.register('ExportManualData',function(args) {/*
    **Snippet to mass export of all the user that are assigned with the list of manuals per event edition
*/
var model = skuid.model.getModel('UserManualAction');

skuid.$.blockUI({ message: 'Exporting all available manuals records...' });
skuid.$M("UserManualAction").loadAllRemainingRecords({
    finishCallback: function(totalRecordsRetrieved) {
        skuid.$.blockUI({ message: 'Finished exporting all ' + totalRecordsRetrieved + ' Manuals records!', timeout: 2000 }); 
        model.exportData({
            fileName: 'ManualExportData'+'.csv',
            doNotAppendRowIdColumn: true,
            fields: 
            [
                model.getField('Manual_Permission__r.Manuals__r.Name'),
                model.getField('User_Manual_Contact__r.Account.Name'),
                model.getField('User_Manual_Contact__r.Name'),
                model.getField('Is_Viewed__c'),
                model.getField('Is_Agree__c'),
                model.getField('User_Type__r.Name')
        
            ]
        });
    }
});


/*model.exportData({
    fileName: 'ManualExportData'+'.csv',
     doNotAppendRowIdColumn: true,
    fields: 
    [
        model.getField('Manual_Permission__r.Manuals__r.Name'),
        model.getField('User_Manual_Contact__r.Account.Name'),
        model.getField('User_Manual_Contact__r.Name'),
        model.getField('Is_Viewed__c'),
        model.getField('Is_Agree__c'),
        model.getField('User_Type__r.Name')

    ]
});*/
});
skuid.snippet.register('removeHyperlink',function(args) {/*
    ** Snippet te remove the hyperlnk from the field
*/
var field = arguments[0],
value = arguments[1],
$ = skuid.$;	
    

// If we're  in read mode, then remove hyperlink 

   //skuid.ui.fieldRenderers[field.metadata.displaytype][field.mode](field, value);
   skuid.ui.getFieldRenderer(field.metadata.displaytype).readonly(field, value);
    var linkTag = $('a', field.element);
    if(linkTag.length)
    {
        var output = $('<div>');
        output.append(linkTag.html());
    }   
    linkTag.replaceWith(output);
});
skuid.snippet.register('deleteManualWithoutAttachment',function(args) {/*
    ** Snippet to delete Manuals records without Attachment
*/
var manualModel = skuid.model.getModel('NewManual');
var manualModelRow = manualModel.getFirstRow();
console.log(manualModelRow.Id);
var result1 = sforce.apex.execute('updateAttFieldsOnFormAndManual','deleteAttOnManual',{ManualId:manualModelRow.Id});
console.log(result1);


/*
var params = arguments[0],
	$ = skuid.$;
var modelA = skuid.model.getModel('NewManual');
var rowA = modelA.getFirstRow();
console.log('NewManual: '+rowA.Id);

modelA.deleteRow({Id:modelA.data[0].Id});
modelA.save();
*/
});
skuid.snippet.register('massReminderEmail',function(args) {/*
    ** Snippet to send mass email reminder to all the users who hasn't viewed and agreed manuals.
*/
var params = arguments[0],
	$ = skuid.$;

    var modelE = skuid.model.getModel('EventEdition');
    var rowE = modelE.getFirstRow();
    var eID= rowE.Id;
    console.log(eID);
    
    /*var modelFP = skuid.model.getModel('FormPermission');
    var rowFP = modelFP.getFirstRow();
    var eFID= rowFP.Event_Edition_Form__c;
    console.log(eFID);*/
    
    //var modelUMA = skuid.model.getModel('UserManualAction');
    //console.log(modelUMA.data.length);
    
    
   // var modelUA = skuid.model.getModel('UserActionFormNotFilled');
   /*
    var uMAList=[]; // Array to pupulate User Id List to pass it to Salesforce
    if (modelUMA)
    {
        //var rowsToUpdate = {};    
        for (var i=0;i<modelUMA.data.length;i++)
        {
            
                uMAList.push(modelUMA.data[i].Id);
        }
       
    }
    console.log(uMAList);
    var JSONString = JSON.stringify(uMAList, null, 2);
    console.log(JSONString);
    */
    if (eID != null)
    {
        var result = sforce.apex.execute('MassManualReminderEmail','MassManualReminderEmail', {eventEditionId:eID},function(result){
        console.log(result);
        });
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
    },500);
}
function RandomID() {
    var S4 = function() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
};
/*
** Snippet to fetch dynamic booth class from event edition
*/
/*(function(skuid){
	var $ = skuid.$;
	$(document.body).one('pageload',function(){
		var modelE = skuid.model.getModel('ExpocadBoothClass');
		var boothClassArr=[];
		var boothProductTypeArr=[];
		for (var i = 0; i < modelE.data.length; i++) 
        {
            
            
            if (!boothClassArr.includes(modelE.data[i].Booth_Classes__c))
            
            {
                //boothClassArr.push({label: modelE.data[i].Booth_Classes__c, value: modelE.data[i].Booth_Classes__c  });
                boothClassArr.push ( modelE.data[i].Booth_Classes__c);
            }
            
        }
        console.log('boothProductTypeArr   '+boothProductTypeArr);
        console.log('boothClassArr   '+boothClassArr);
        var modelUI = skuid.model.getModel('BoothClassUI');
        for (var j = 0; j < boothClassArr.length; j++) 
        {
            var rowUI = modelUI.createRow({
            additionalConditions: [
                { field: 'BoothClass', value: boothClassArr[j]}],doAppend: true
                });
        }
       
	});
})(skuid);*/;
/*
** Snippet to fetch dynamic booth class from event edition
*/
(function(skuid){
	var $ = skuid.$;
	$(document.body).one('pageload',function(){
		var modelE = skuid.model.getModel('EventEdition');
		var boothTypeArr=[];
		var boothProductTypeArr=[];
	    var row= modelE.getFirstRow();
	    //var boothProducType= row.Booth_Product_Type__c;
	    var boothProducType= row.Matched_Product_Name__c;
	    var boothType= row.Booth_Type__c;

        if(boothProducType !=null && boothProducType !='')
        {
    		var bPT= boothProducType.split(";");
    		console.log(bPT);
    		var modelPT = skuid.model.getModel('ExpocadProTypeUI');
    		
    		for (var i = 0; i < bPT.length; i++) 
            {
                var rowPT = modelPT.createRow({
                additionalConditions: [
                { field: 'ProductType', value: bPT[i]}],doAppend: true
                });
            }
        }
        
        if(boothType !=null && boothType!='')
        {
    		var bT= boothType.split(",");
    		console.log(bT);
    		var modelBT = skuid.model.getModel('ExpocadBoothTypeUI');
    		
            for (var j = 0; j < bT.length; j++) 
            {
                var rowBT = modelBT.createRow({
                additionalConditions: [
                    { field: 'BoothType', value: bT[j]}],doAppend: true
                    });
            }
        }
    });
})(skuid);;
}(window.skuid));