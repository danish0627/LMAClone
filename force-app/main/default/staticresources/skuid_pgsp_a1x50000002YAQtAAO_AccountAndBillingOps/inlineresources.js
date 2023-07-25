(function(skuid){
skuid.snippet.register('updateAttFieldsOnManual',function(args) {var manualModel = skuid.model.getModel('NewManual');
var manualModelRow = manualModel.getFirstRow();
console.log(manualModelRow.Id);
var attachmentModel = skuid.model.getModel('Attachment');
var attachmentRow = attachmentModel.getFirstRow();
console.log(attachmentRow.Id);
var result1 = sforce.apex.execute('updateAttFieldsOnFormAndManual','updateAttOnManual',{ManualId:manualModelRow.Id, AttId:attachmentRow.Id, AttName:attachmentRow.Name});
console.log(result1);
});
skuid.snippet.register('EditManualUpdate',function(args) {var attachmentModel = skuid.model.getModel('AttachmentForEditManual');
var attachmentRow = attachmentModel.getFirstRow();
console.log(attachmentRow.Id);
var result1 = sforce.apex.execute('updateAttFieldsOnFormAndManual','updateAndDeleteAttOnManual',{ManualId:attachmentRow.ParentId, AttId:attachmentRow.Id, AttName:attachmentRow.Name});
});
skuid.snippet.register('ExportManualData',function(args) {var model = skuid.model.getModel('UserManualAction');
model.exportData({
    fileName: 'FormExportData',
    fields: 
    [
        model.getField('Manual_Permission__r.Manuals__r.Name'),
        model.getField('User_Manual_Contact__r.Account.Name'),
        model.getField('User_Manual_Contact__r.Name'),
        model.getField('Is_Viewed__c'),
        model.getField('Is_Agree__c'),
        model.getField('Manual_Permission__r.User_Type__r.Name')
    ]
});
});
skuid.snippet.register('removeHyperlink',function(args) {var field = arguments[0],
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
});
skuid.snippet.register('deleteManualWithoutAttachment',function(args) {var manualModel = skuid.model.getModel('NewManual');
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
skuid.snippet.register('viewAccountSummary',function(args) {/*
    ** Snippet to display list of booth as per account
*/
 var params = arguments[0],
    contextRow = params.item ? params.item.row : params.row,
    contextModel = params.model,
    $ = skuid.$;
    
    // Getting context row of the User Account
    var AccountId = contextModel.getFieldValue(contextRow, 'Account.Id', true);
    //var contextContent = contextRow.Name;
  	console.log('Context AccountId: '+AccountId);

       
	var EventSetModel = skuid.model.getModel('EventSettings');
    var EventSet = EventSetModel.getFirstRow();
	
	var eventDetailModel = skuid.model.getModel('EventEdition');
    var eventDetail = eventDetailModel.getFirstRow();
    var eventId= eventDetail.Id;
	var result = sforce.apex.execute('oppAccountDetails','oppAccountDetails', {accountId:AccountId, eventId:eventId});
	var accDetails = JSON.parse(result);
	console.log('----result:'+result);
    
    var modelAccountSummary1 = skuid.model.getModel('AccountSummary');
        var accountsumamryList1 = modelAccountSummary1.createRow({ 
            additionalConditions: [
                { field: 'TotalAmount', value: accDetails.amount},
                { field: 'RemainingAmount', value: accDetails.remainingAmount},
            ],doAppend: true});
            console.log('accountsumamryList1'+accountsumamryList1); 
            modelAccountSummary1.save();
                
    // For expocad booth details
    
    if(accDetails.boothDetails != null){
        var vlen = accDetails.boothDetails.length;
        for(var i=0;i<vlen;++i)
            { 
                console.log('====hi');
                var modelAccountSummary = skuid.model.getModel('AccountSummary');
                var accountsumamryList = modelAccountSummary.createRow({ 
                    additionalConditions: [
                       // { field: 'TotalAmount', value: accDetails[i].amount},
                       // { field: 'RemainingAmount', value: accDetails[i].remainingAmount},
                        { field: 'Booth', value: accDetails.boothDetails[i].boothName},
                        { field: 'BoothSize', value: accDetails.boothDetails[i].unitType},
                        { field: 'BoothArea', value: accDetails.boothDetails[i].boothArea},
                        { field: 'Opportunity', value: accDetails.boothDetails[i].oppty},
                    ],doAppend: true});
                    console.log('accountsumamryList'+accountsumamryList); 
                    modelAccountSummary.save();
            }
    }
    
    /*
    var values = '<b>'+EventSet.Amount__c+': </b>'+accDetails.amount+'<br /> <b>'+EventSet.Remaining_Balance__c+':</b> '+accDetails.remainingAmount+'<br />';
	values = values +'<table>';
    values = values +'<tr>';
    values = values +'<th style="width:150px">'+EventSet.Booth_Name__c+'</th>';
    //values = values +'<th style="width:150px">'+EventSet.Booth_size__c+'</th></tr>';
    values = values +'<th style="width:150px">'+EventSet.Booth_size__c+'</th>';
    values = values +'<th style="width:150px">'+EventSet.OpportunityName__c+'</th></tr>';
    if(accDetails.boothDetails!=null)
    {   
        $.each(accDetails.boothDetails, function( index, value ) {
            values = values +'<tr><td>'+value.boothName+'</td>';  
            //values = values +'<td>'+value.boothArea+' '+value.unitType+'</td></tr>';
            values = values +'<td>'+value.boothArea+' '+value.unitType+' </td>';
            values = values +'<td>'+value.oppty+' </td></tr>';
            console.log( index + " boothName : " + value.boothName +" boothArea :" +value.boothArea);
        });
    }
    values = values +'</table>';
    window.alert('======'+values);
	$('#sk-4YcI4-885').append(values);
	*/
});
}(window.skuid));