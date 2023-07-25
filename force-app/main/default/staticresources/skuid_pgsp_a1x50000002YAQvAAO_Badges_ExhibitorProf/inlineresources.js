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
skuid.snippet.register('TotalAllocatedBages',function(args) {/*
    ** Field render snippet that will calculate the total allocated badges for each account
    ** snippet is called as field renderer in "TotalAllocatedField" field in ExpocadBadgeAgg-model table
*/
var field = arguments[0];
var value = arguments[1];
var modelA = skuid.model.getModel('ExpocadBooth');
var modelB = skuid.model.getModel('BadgesLimitSetting');
var model = arguments[0].ExpocadBadgeAgg,
row = arguments[0].row;
//var accountName = arguments[0].item.row.quoterSBQQAccountrName;
var accountId = arguments[0].item.row.quoterSBQQAccountrId;
//console.log(accountId);
var totalAllocatedBadge=0;
//console.log('ExpocadBooth Length:'+modelA.data.length);
//console.log('BadgesLimitSetting length:' +modelB.data.length);
if (modelA.data.length)
{
    for ( var i= 0; i <modelA.data.length;i++)
    {
       // console.log(modelA.data[i].Quote__c);
        if (modelA.data[i].Quote__c)
        {
            if (modelA.data[i].Quote__r.SBQQ__Account__c)
            {
                if(modelA.data[i].Quote__r.SBQQ__Account__c==accountId)
                {
                    for (var j= 0; j <modelB.data.length;j++)
                    {
                        /*console.log("accountId  "+ accountId);
                        console.log("am  "+modelA.data[i].Area_Number__c);
                        console.log("boothNum  "+modelA.data[i].Booth_Number__c);
                        console.log("a    "+modelB.data[j].Booth_Size_From__c);
                        console.log("r    "+modelB.data[j].Booth_Size_To__c);*/
                        if (modelA.data[i].Area_Number__c)
                        {
                            if(modelA.data[i].Area_Number__c>=modelB.data[j].Booth_Size_From__c && modelA.data[i].Area_Number__c<=modelB.data[j].Booth_Size_To__c)
                            {
                                 totalAllocatedBadge= totalAllocatedBadge+modelB.data[j].Badges_Allowed__c;
                                 console.log('====TT'+totalAllocatedBadge);
                            }
                        }
                    }
                }
            }
        }
    }
    skuid.ui.fieldRenderers.TEXT[field.mode](field,value=totalAllocatedBadge);
}
});
skuid.snippet.register('areaFilterSnippet',function(args) {/*
    ** Snippet to display the picklist value for Booth"
*/
var params = arguments[0],
/*contextModel = params.model,
contextRow = params.item ? params.item.row : params.row;*/
	$ = skuid.$;
	
    var modelE = skuid.model.getModel('AccountIdUI');
    var rowE = modelE.getFirstRow();
    var aName= rowE.AccountID;
    //console.log("test: "+ aName);
    var modelA = skuid.model.getModel('ExpocadBooth');
    console.log('modelA'+modelA);
    var boothArr=[];
    //console.log(modelA.data.length);
    if (modelA.data.length)
    {
        for ( var i= 0; i <modelA.data.length;i++)
        {
            //console.log(modelA.data[i].Quote__r.SBQQ__Account__r.Name);
            //console.log('aName '+aName);
            if(modelA.data[i].Quote__r.SBQQ__Account__r.Name==aName)
            {
                // display the picklist valus as name, booth number and square feet
                console.log('test booth pick');
                boothArr.push({value:modelA.data[i].Booth_Number__c, label:aName+'-' +modelA.data[i].Booth_Number__c+'('+modelA.data[i].Area__c+')'});
                console.log('booth'+ modelA.data[i].Booth_Number__c);
            }
        }
        return boothArr;
    }
});
skuid.snippet.register('createUIRecordSnippet',function(args) {/*
    ** Snippet to create the AccountIdUI model UI record
*/
var params = arguments[0],
	$ = skuid.$;
    var model = arguments[0].ExpocadBadgeAgg,
    row = arguments[0].row;
    console.log('row'+row);
    var accName = arguments[0].item.row.quoterSBQQAccountrName;
    console.log(accName);
    //console.log('testSnippet: '+accName);
    
    var UIModel = skuid.model.getModel('AccountIdUI');
    //var firstContact = contactModel.getFirstRow();
    var newRow = UIModel.createRow({
        additionalConditions: [
            { field: 'AccountID', value: accName}
        ], doAppend: true
    });
    UIModel.save();
});
skuid.snippet.register('massApproveSnippet',function(args) {/*var params = arguments[0],
	$ = skuid.$;
    var modelE = skuid.model.getModel('AccountIdUI');
    var rowE = modelE.getFirstRow();
    var aName= rowE.AccountID;
    console.log(aName);
    
    var modelB = skuid.model.getModel('ExhibitorBadgeList');
    var rowA = modelB.getFirstRow();
    if (aName)
    {
        var rowsToUpdate = {};    
        for (var i=0;i<modelB.data.length;i++)
        {
            console.log(i);
            console.log(modelB.data[i].Id);
            if (modelB.data[i].User_Name__r.Contact.Account.Name==aName)
            {
                if (modelB.data[i].Status__c!='Approved'&&modelB.data[i].MassAction=== true)
                {
                    rowsToUpdate[modelB.data[i].Id] = { Status__c: 'Approved' };
                }
                        
            }
        }
        modelB.updateRows( rowsToUpdate );
        modelB.save();
    }*/
});
skuid.snippet.register('massRejectSnippet',function(args) {/*var params = arguments[0],
	$ = skuid.$;
    var modelE = skuid.model.getModel('AccountIdUI');
    var rowE = modelE.getFirstRow();
    var aName= rowE.AccountID;
    console.log(aName);
    
    var modelB = skuid.model.getModel('ExhibitorBadgeList');
    var rowA = modelB.getFirstRow();
    if (aName)
    {
        var rowsToUpdate = {};    
        for (var i=0;i<modelB.data.length;i++)
        {
            console.log(i);
            console.log(modelB.data[i].Id);
            if (modelB.data[i].User_Name__r.Contact.Account.Name==aName)
            {
                if (modelB.data[i].Status__c!='Rejected'&&modelB.data[i].MassAction=== true)
                {
                    rowsToUpdate[modelB.data[i].Id] = { Status__c: 'Rejected' };
                }     
            }
        }
        modelB.updateRows( rowsToUpdate );
        modelB.save();
    }*/
});
skuid.snippet.register('massSelectedApproveSnippet',function(args) {/*var params = arguments[0],
    $ = skuid.$,
    list = arguments[0].list,
    selectedItems = list.getSelectedItems();
    var modelB = skuid.model.getModel('ExhibitorBadgeList');
    if (selectedItems.length > 0)
    {

        var rowsToUpdate = {};    
         $.each( selectedItems, function( i, item )
        {
            console.log(i);
            console.log(item.row.Id);
            console.log(item);
            console.log(item.row.Status__c);
            if (item.Status__c!='Approved')
            {
                rowsToUpdate[item.row.Id] = { Status__c: 'Approved' };
            }
        } );
        modelB.updateRows( rowsToUpdate );
        //modelB.save();
        modelB.save({callback: function(result){
        if (result.totalsuccess){
            console.log('Approved Success');
        }
        else {
            console.log('Approved Error');
        }
        }});
    }*/
});
skuid.snippet.register('massSelectedRejectSnippet',function(args) {/*var params = arguments[0],
    $ = skuid.$,
    list = arguments[0].list,
    selectedItems = list.getSelectedItems();
    var modelB = skuid.model.getModel('ExhibitorBadgeList');
    if (selectedItems.length > 0)
    {
        var rowsToUpdate = {};    
         $.each( selectedItems, function( i, item )
        {
            console.log(i);
            console.log(item.row.Id);
            console.log(item);
            console.log(item.row.Status__c);
            if (item.Status__c!='Rejected')
            {
                rowsToUpdate[item.row.Id] = { Status__c: 'Rejected' };
            }
        } );
        modelB.updateRows( rowsToUpdate );
        modelB.save({callback: function(result){
        if (result.totalsuccess){
            console.log('Reject Succes');
        }
        else {
            console.log('Reject Error');
        }
        }});
    }*/
});
skuid.snippet.register('NextRecordSnippet',function(args) {/*var params = arguments[0],
contextRow = params.item ? params.item.row : params.row,
contextModel = params.model,
$ = skuid.$;
var dfd = $.Deferred();
var contextId = contextModel.getFieldValue(contextRow, 'Id', true);
console.log(contextId);
//params.row.Id='a2Z0n0000000HPrEAM';
var modelE = skuid.model.getModel('AccountIdUI');
    var rowE = modelE.getFirstRow();
    var aName= rowE.AccountID;
    console.log(aName);
    
    var modelB = skuid.model.getModel('ExhibitorBadgeList');
    var rowA = modelB.getFirstRow();
    if (aName)
    {
        var k =0;
        for (var i=0;i<modelB.data.length;i++)
        {
            //console.log("first i: "+i);
            //console.log(modelB.data[i].Id);
            if (modelB.data[i].User_Name__r.Contact.Account.Name==aName)
            {
                if (modelB.data[i].Id==contextId)
                {
                    k=i;
                    break;
                }     
            }
        }
       
        var b=0;
        for (var j=k;j<modelB.data.length;j++)
        {
            //console.log("second i: "+i);
            console.log("firet"+modelB.data[i].Id);
            if (modelB.data[j].User_Name__r.Contact.Account.Name==aName)
            {
                if (modelB.data[j].Id!=contextId)
                {
                    console.log("amish ::");
                    params.row.Id = modelB.data[j].Id;
                    console.log("param1: "+ params.row.Id);
                    b=1;
                    break;
                }     
            }
        }
        if (b==1)
        {
            console.log("break");
        }
        else
        {
            for (var l=0;l<k;l++)
            {
                //console.log(i);
                //console.log(modelB.data[i].Id);
                if (modelB.data[l].User_Name__r.Contact.Account.Name==aName)
                {
                    if (modelB.data[l].Id!=contextId)
                    {
                        //console.log("ranjit ::");
                        params.row.Id = modelB.data[l].Id;
                        break;
                    }     
                }
            }
        }
        console.log("test");
    }
    dfd.resolve();	
    return dfd.promise();*/
});
skuid.snippet.register('sendSingleEmail',function(args) {/*
    ** Snippet to send the single email for acceptting and rejecting the  badge
*/
var params = arguments[0],
	
contextRow = params.item ? params.item.row : params.row,
contextModel = params.model,
$ = skuid.$;
var contextId = contextModel.getFieldValue(contextRow, 'Id', true);
//var contextContactEmail = contextModel.getFieldValue(contextRow, 'User_Name__r.Contact.Email', true);
var contextContact = contextModel.getFieldValue(contextRow, 'User_Name__r.ContactId', true);

var modelB= skuid.model.getModel('EmailMsssageUI');
var rowB=modelB.getFirstRow();
//console.log("boolean: "+rowB.RejectEmail);

//console.log("Id: "+contextContact);
var modelE = skuid.model.getModel('EventEdition');
    var rowE = modelE.getFirstRow();
    var eID= rowE.Id;

if (rowB.RejectEmail===true)
{
    console.log("send email: ");
    var emailType= "Reject";
    var rejectNote= rowB.RejectNote;
    if (!rejectNote)
    {
        rejectNote='';
    }
    var result = sforce.apex.execute('SingleBadgeEmail','SingleBadgeEmail', {eventEditionId:eID,conID:contextContact, ExhibitorBadgeID: contextId,emailType:emailType,Note:rejectNote},function(result){
    console.log(result);
    });
}
if (rowB.AcceptEmail===true)
{
    if (!approvalNote)
    {
        approvalNote='';
    }
    console.log("send email: ");
    var emailType= "Approve";
    var approvalNote= rowB.AcceptNote;
    var result = sforce.apex.execute('SingleBadgeEmail','SingleBadgeEmail', {eventEditionId:eID,conID:contextContact, ExhibitorBadgeID: contextId,emailType:emailType,Note:approvalNote },function(result){
    console.log(result);
    });
}
});
skuid.snippet.register('massEmail',function(args) {/*var params = arguments[0],
	
contextRow = params.item ? params.item.row : params.row,
contextModel = params.model,
$ = skuid.$;
   
    var contextContact = contextModel.getFieldValue(contextRow, 'User_Name__r.Id', true);
    var modelB= skuid.model.getModel('EmailMsssageUI');
    var rowB=modelB.getFirstRow();
    var modelE = skuid.model.getModel('EventEdition');
    var rowE = modelE.getFirstRow();
    var eID= rowE.Id;
    var modelA = skuid.model.getModel('AccountIdUI');
    var rowE = modelA.getFirstRow();
    var aName= rowE.AccountID;
    var badgesList=[]; // Array to pupulate Badges Id List to pass it to Salesforce
    var modelEB = skuid.model.getModel('ExhibitorBadgeList');
    if (aName)
    {
        var rowsToUpdate = {};    
        for (var i=0;i<modelEB.data.length;i++)
        {
            if (modelEB.data[i].User_Name__r.Contact.Account.Name==aName)
            {
                if (modelEB.data[i].Status__c!='Approved'&&modelEB.data[i].MassAction=== true&&(modelEB.data[i].Status__c=='Rejected' || modelEB.data[i].Status__c=='Pending'))
                {
                    rowsToUpdate[modelEB.data[i].Id] = { Status__c: 'Approved' };
                    badgesList.push(modelEB.data[i].Id);
                }
                if (modelEB.data[i].Status__c!='Rejected'&&modelEB.data[i].MassAction=== true&&(modelEB.data[i].Status__c=='Approved' || modelEB.data[i].Status__c=='Pending'))
                {
                    rowsToUpdate[modelEB.data[i].Id] = { Status__c: 'Rejected' };
                    badgesList.push(modelEB.data[i].Id);
                }
            }
        }
       
    }
    modelEB.updateRows( rowsToUpdate );
    modelEB.save();

    var JSONString = JSON.stringify(badgesList, null, 2);
    
    if (rowB.RejectEmail===true)
    {
        var emailType= "Reject";
        var rejectNote= rowB.RejectNote;
        if (!rejectNote)
        {
            rejectNote='';
        }
        var result = sforce.apex.execute('MassBadgeEmail','MassBadgeEmail', {eventEditionId:eID,User:contextContact, ExhibitorBadgeID: JSONString,emailType:emailType,Note:rejectNote},function(result){
        console.log(result);
        });
    }
    if (rowB.AcceptEmail===true)
    {
        if (!approvalNote)
        {
            approvalNote='';
        }
        var emailType= "Approve";
        var approvalNote= rowB.AcceptNote;
        var result = sforce.apex.execute('MassBadgeEmail','MassBadgeEmail', {eventEditionId:eID,User:contextContact, ExhibitorBadgeID: JSONString,emailType:emailType,Note:approvalNote },function(result){
        });
    }*/
});
skuid.snippet.register('massApproveSendEmail',function(args) {/*
    ** Snippet to send the mass email when mass badges is approved
*/
var params = arguments[0],
	
contextRow = params.item ? params.item.row : params.row,
contextModel = params.model,
$ = skuid.$;
   
    var contextContact = contextModel.getFieldValue(contextRow, 'User_Name__r.ContactId', true);
    var modelB= skuid.model.getModel('EmailMsssageUI');
    var rowB=modelB.getFirstRow();
    var modelE = skuid.model.getModel('EventEdition');
    var rowE = modelE.getFirstRow();
    var eID= rowE.Id;
    var modelA = skuid.model.getModel('AccountIdUI');
    //alert('==modelASzie '+modelA.data.length);
    var rowA = modelA.getFirstRow();
    var aName= rowA.AccountID;
    var badgesList=[]; // Array to pupulate Badges Id List to pass it to Salesforce
    var modelEB = skuid.model.getModel('ExhibitorBadgeList');
    // NEED TO update to account instead of user-account
    if (aName)
    {
        
        var rowsToUpdate = {};    
        for (var i=0;i<modelEB.data.length;i++)
        {
            //if (modelEB.data[i].User_Name__c!=null)
            if (modelEB.data[i].Account__c)
            {
                //if (modelEB.data[i].User_Name__r.Contact!=null)
                //{
                    //if (modelEB.data[i].User_Name__r.Contact.Account.Name==aName)

                    if (modelEB.data[i].Account__r.Name==aName)
                    {
                        if (modelEB.data[i].Status__c!='Approved' && modelEB.data[i].MassAction=== true && (modelEB.data[i].Status__c=='Rejected' || modelEB.data[i].Status__c=='Pending'))
                        {
                            console.log("Status:");
                            rowsToUpdate[modelEB.data[i].Id] = { Status__c: 'Approved' };
                            badgesList.push(modelEB.data[i].Id);
                        }
                        /*if (modelEB.data[i].Status__c!='Rejected'&&modelEB.data[i].MassAction=== true&&(modelEB.data[i].Status__c=='Approved' || modelEB.data[i].Status__c=='Pending'))
                        {
                            rowsToUpdate[modelEB.data[i].Id] = { Status__c: 'Rejected' };
                            badgesList.push(modelEB.data[i].Id);
                        }*/
                    }
                    
                //}
            }
            
        }
       
    }
    if (rowsToUpdate)
    {
        modelEB.updateRows( rowsToUpdate );
        modelEB.save();
    }
    console.log(badgesList.length);
    if (badgesList.length>0)
    {
        var JSONString = JSON.stringify(badgesList, null, 2);
        console.log(JSONString);
        if (JSONString)
        {
            /*if (rowB.RejectEmail===true)
            {
                var emailType= "Reject";
                var rejectNote= rowB.RejectNote;
                if (!rejectNote)
                {
                    rejectNote='';
                }
                var result = sforce.apex.execute('MassBadgeEmail','MassBadgeEmail', {eventEditionId:eID,User:contextContact, ExhibitorBadgeID: JSONString,emailType:emailType,Note:rejectNote},function(result){
                console.log(result);
                });
            }*/
            if (rowB.AcceptEmail===true)
            {
                console.log("TEstEmail");
                approvalNote="N/A";
                console.log(approvalNote);
                var emailType= "Approve";
                console.log(emailType);
                var approvalNote= rowB.AcceptNote;
                console.log(approvalNote);
                if (!approvalNote)
                {
                    approvalNote='NA';
                    console.log(approvalNote);
                }
                var result = sforce.apex.execute('MassBadgeEmail','MassBadgeEmail', {eventEditionId:eID,conID:contextContact, ExhibitorBadgeID: JSONString,emailType:emailType,Note:approvalNote },function(result){

                });
                
                
            }
        }
    }
});
skuid.snippet.register('massRejectSendEmail',function(args) {/*
    ** Snippet to send the mass email when mass badges is rejected
*/
var params = arguments[0],
	
contextRow = params.item ? params.item.row : params.row,
contextModel = params.model,
$ = skuid.$;
   
    var contextContact = contextModel.getFieldValue(contextRow, 'User_Name__r.ContactId', true);
    var modelB= skuid.model.getModel('EmailMsssageUI');
    var rowB=modelB.getFirstRow();
    var modelE = skuid.model.getModel('EventEdition');
    var rowE = modelE.getFirstRow();
    var eID= rowE.Id;
    var modelA = skuid.model.getModel('AccountIdUI');
    var rowE = modelA.getFirstRow();
    var aName= rowE.AccountID;
    var badgesList=[]; // Array to pupulate Badges Id List to pass it to Salesforce
    var modelEB = skuid.model.getModel('ExhibitorBadgeList');
    if (aName)
    {
        var rowsToUpdate = {};    
        for (var i=0;i<modelEB.data.length;i++)
        {
            if (modelEB.data[i].Account__c)
            {
                //if (modelEB.data[i].User_Name__r.Contact.Account.Name==aName)
                if (modelEB.data[i].Account__r.Name==aName)
                {
                    /*if (modelEB.data[i].Status__c!='Approved'&&modelEB.data[i].MassAction=== true&&(modelEB.data[i].Status__c=='Rejected' || modelEB.data[i].Status__c=='Pending'))
                    {
                        console.log("Status:");
                        rowsToUpdate[modelEB.data[i].Id] = { Status__c: 'Approved' };
                        badgesList.push(modelEB.data[i].Id);
                    }*/
                    if (modelEB.data[i].Status__c!='Rejected'&&modelEB.data[i].MassAction=== true&&(modelEB.data[i].Status__c=='Approved' || modelEB.data[i].Status__c=='Pending'))
                    {
                        rowsToUpdate[modelEB.data[i].Id] = { Status__c: 'Rejected' };
                        badgesList.push(modelEB.data[i].Id);
                    }
                }
            }
        }
       
    }
    if (rowsToUpdate)
    {
        modelEB.updateRows( rowsToUpdate );
        modelEB.save();
    }
    console.log(badgesList.length);
    if (badgesList.length>0)
    {
        var JSONString = JSON.stringify(badgesList, null, 2);
        if (JSONString)
        {
            if (rowB.RejectEmail===true)
            {
                var emailType= "Reject";
                var rejectNote= rowB.RejectNote;
                if (!rejectNote)
                {
                    rejectNote='NA';
                }
                var result = sforce.apex.execute('MassBadgeEmail','MassBadgeEmail', {eventEditionId:eID,conID:contextContact, ExhibitorBadgeID: JSONString,emailType:emailType,Note:rejectNote},function(result){
                });
            }
            /*if (rowB.AcceptEmail===true)
            {
                console.log("TEstEmail");
                approvalNote="N/A";
                console.log(approvalNote);
                var emailType= "Approve";
                var approvalNote= rowB.AcceptNote;
                console.log(approvalNote);
                if (!approvalNote)
                {
                    approvalNote='NA';
                    console.log(approvalNote);
                }
                var result = sforce.apex.execute('MassBadgeEmail','MassBadgeEmail', {eventEditionId:eID,User:contextContact, ExhibitorBadgeID: JSONString,emailType:emailType,Note:approvalNote },function(result){
                });
                
                
            }*/
        }
    }
});
skuid.snippet.register('Export',function(args) {/*
    ** Snipept to export the list of badges information
*/
var model = skuid.model.getModel('ExhibitorBadgeList');
var row= model.getFirstRow();
model.exportData({
    fileName: 'Badges Report'+'.csv',
    doNotAppendRowIdColumn: true,
    fields: 
    [
        model.getField('User_Name__r.Contact.Account.Name'),
        model.getField('Exhibitor_Name__c'),
        model.getField('ExpocadBooth__r.Booth_Number__c'),
        model.getField('First_Name__c'),
        model.getField('Last_Name__c'),
        model.getField('Email__c'),
        model.getField('Mobile_Number__c'),
        model.getField('Country__c'),
        model.getField('State__c'),
        model.getField('City__c'),
        model.getField('Address__c'),
        model.getField('Nationality__c'),
        model.getField('Age_Bracket__c'),
        model.getField('Job_Title__c'),
        //model.getField('Agent__c')
        //model.getField('Status__c'),
        //model.getField('Booth_Size__c'),
       
    ]
});
});
skuid.snippet.register('testTotalAlloacted',function(args) {/*
	var params = arguments[0],
	$ = skuid.$;
    var modelE = skuid.model.getModel('EventEdition');
    var rowE = modelE.getFirstRow();
    var eID= rowE.Id;
    console.log(eID);
    var modelEB = skuid.model.getModel('ExpocadBadgeAgg');
    var accList=[];
    // Adding List to the Array that will be passed to salesforce to update the "community_visibility" field in product object 
    for (var i=0;i<modelEB.data.length;i++)
    {
            accList.push(modelEB.data[i].quoterSBQQAccountrId);
    }
    
    console.log(accList);
    var JSONString = JSON.stringify(accList, null, 2);
    console.log(JSONString );
	var result = sforce.apex.execute('TotalAllocatedBadges','TotalAllocatedBadges', {acctList:JSONString,eventId:eID});
	console.log(result);
	var acctList = JSON.parse(result);
	console.log(acctList);
	//var rowsToUpdate = {};
	var modelUI = skuid.model.getModel('AcctTotalAllocatedUI');
	if (acctList)
	{
	    /*$.each(acctList, function( index,value) {
	        rowsToUpdate[value.acctId] ={TotalAllocatedField: value.totalAllocatedBadges};
	    });*/
	 /*   $.each(acctList, function( index,value) {
	    var productList = modelUI.createRow({ 
                    additionalConditions: [
                        { field: 'acctId', value: value.acctId},
                        { field: 'TotalAllocatedField', value: value.TotalAllocatedField},
                        
                    ],doAppend: true});
               
	        } );
            modelUI.save();
        }
        modelUI.save();
    console.log("modelUI"+modelUI);
	/*console.log(rowsToUpdate);
	modelEB.updateRows( rowsToUpdate );
    modelEB.save(rowsToUpdate);
    console.log(modelEB);
	});*/
});
/*(function(skuid){
	var $ = skuid.$;
	$(document.body).one('pageload',function(){
	
    var modelE = skuid.model.getModel('EventEdition');
    var rowE = modelE.getFirstRow();
    var eID= rowE.Id;
    console.log(eID);
    var modelEB = skuid.model.getModel('ExpocadBadgeAgg');
    console.log(modelEB);
    var accList=[];
    // Adding List to the Array that will be passed to salesforce to update the "community_visibility" field in product object 
    for (var i=0;i<modelEB.data.length;i++)
    {
            accList.push(modelEB.data[i].quoterSBQQAccountrId);
    }
    
    console.log(accList);
    var JSONString = JSON.stringify(accList, null, 2);
    console.log(JSONString );
	var result = sforce.apex.execute('TotalAllocatedBadges','TotalAllocatedBadges', {acctList:JSONString,eventId:eID});
	console.log(result);
	var acctList = JSON.parse(result);
	console.log(acctList);
	var rowsToUpdate = {};
	var modelUI = skuid.model.getModel('ExpocadBadgeAgg');
	var rowEB = modelUI.getFirstRow();
    var test= rowEB.Id;
    console.log('TEst Is:'+test);
	if (acctList)
	{
	    $.each(acctList, function( index,value) {
	        rowsToUpdate[value.acctId] ={TotalAllocatedField: value.totalAllocatedBadges};
	    });
	    
	}      
	console.log(rowsToUpdate);
	modelUI.updateRows( rowsToUpdate );

    modelUI.save(rowsToUpdate);
     modelUI.save();
    console.log(modelUI);
	});
})(skuid);*/;
skuid.snippet.register('TestRender',function(args) {/*var field = arguments[0];
var value = arguments[1];

var accountId = arguments[0].item.row.quoterSBQQAccountrId;
console.log(accountId);
var totalAllocatedBadge=1;

var modelUI = skuid.model.getModel('AcctTotalAllocatedUI');
console.log('length :'+modelUI.data.length);
var row =modelUI.getFirstRow();
var a= row.AcctId;
console.log("firstAcct:"+a);
for (var i =0; i<modelUI.data.length;i++)
{
    console.log('account: '+modelUI.data[i].AcctId);
    if(modelUI.data[i].AcctId==accountId)
    {
         totalAllocatedBadge= modelUI.data[i].TotalAllocatedField;
    }
               
}
    skuid.ui.fieldRenderers.TEXT[field.mode](field,value=totalAllocatedBadge);*/
});
skuid.snippet.register('FieldRendererTotalAllocated',function(args) {/*var field = arguments[0];
var value = arguments[1];
var model = arguments[0].ExpocadBadgeAgg,
row = arguments[0].row;
 var modelE = skuid.model.getModel('EventEdition');
    var rowE = modelE.getFirstRow();
    var eID= rowE.Id;
    console.log(eID);
//var accountName = arguments[0].item.row.quoterSBQQAccountrName;
var accountId = arguments[0].item.row.quoterSBQQAccountrId;
console.log(accountId);
    var result = sforce.apex.execute('TotalBadgesAllocated','TotalBadgesAllocated', {acctList:accountId,eventId:eID});
    skuid.ui.fieldRenderers.TEXT[field.mode](field,value=result);
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
skuid.snippet.register('massBadgeReminderEmail',function(args) {/*
    ** Snippet to send mass email reminder to all the users who haven't submitted their badges..
*/
var params = arguments[0],
	$ = skuid.$;

    var modelE = skuid.model.getModel('EventEdition');
    var rowE = modelE.getFirstRow();
    var eID= rowE.Id;
    console.log(eID);
    
    var modelExpocadBadge = skuid.model.getModel('ExpocadBadgeAgg');
    console.log(modelExpocadBadge.data.length);
    
    var eXBADGEList=[]; // Array to pupulate Account Id List to pass it to Salesforce
    if (modelExpocadBadge)
    {
        for (var i=0;i<modelExpocadBadge.data.length;i++)
        {
            //console.log('===COUNT'+modelExpocadBadge.data[i].sumCountBadgesc);
            //console.log('===ACC'+modelExpocadBadge.data[i].quoterSBQQAccountrId);
            if(modelExpocadBadge.data[i].sumCountBadgesc == 0){
               // alert(modelExpocadBadge.data[i].quoterSBQQAccountrId);
                eXBADGEList.push(modelExpocadBadge.data[i].quoterSBQQAccountrId);
            }
        }
    }
    console.log('eXBadgeList'+eXBADGEList);
    var JSONString = JSON.stringify(eXBADGEList, null, 2);
    //console.log(JSONString);
    
    if (eXBADGEList != '')
    {
        var result = sforce.apex.execute('MassBadgeReminderEmail','MassBadgeReminderEmail', {eventEditionId:eID,accList:JSONString},function(result){
        //console.log('res'+result);
        //alert('Email has been sent successfully!');
        });
        
    }
});
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
}(window.skuid));