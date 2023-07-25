(function(skuid){
skuid.snippet.register('TotalAllocatedBages',function(args) {/*
    ** Snippet that will capture total allocated badges per account
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
                        console.log("accountId  "+ accountId);
                        console.log("am  "+modelA.data[i].Area_Number__c);
                        console.log("boothNum  "+modelA.data[i].Booth_Number__c);
                        console.log("a    "+modelB.data[j].Booth_Size_From__c);
                        console.log("r    "+modelB.data[j].Booth_Size_To__c);
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



/*var field = arguments[0];
var value = arguments[1];
var modelA = skuid.model.getModel('ExpocadBooth');
var modelB = skuid.model.getModel('BadgesLimitSetting');
var model = arguments[0].ExpocadBadgeAgg,
row = arguments[0].row;
//var accountName = arguments[0].item.row.quoterSBQQAccountrName;
var accountId = arguments[0].item.row.quoterSBQQAccountrId;
console.log(accountId);
var totalAllocatedBadge=0;
console.log('ExpocadBooth Length:'+modelA.data.length);
console.log('BadgesLimitSetting length:' +modelB.data.length);
if (modelA.data.length)
{
    for ( var i= 0; i <modelA.data.length;i++)
    {
        console.log(modelA.data[i].Quote__r.SBQQ__Account__r.ID);
        if(modelA.data[i].Quote__r.SBQQ__Account__c==accountId)
        {
            for (var j= 0; j <modelB.data.length;j++)
            {
                console.log("amish"+modelA.data[i].Area__c);
                console.log("a    "+modelB.data[j].Booth_Size_From__c);
                console.log("r    "+modelB.data[j].Booth_Size_To__c);
                if (modelA.data[i].Area_Number__c)
                {
                    if(modelA.data[i].Area__c>=modelB.data[j].Booth_Size_From__c && modelA.data[i].Area__c<=modelB.data[j].Booth_Size_To__c)
                    {
                         totalAllocatedBadge= totalAllocatedBadge+modelB.data[j].Badges_Allowed__c;
                         console.log('====TT'+totalAllocatedBadge);
                    }
                }
            }
        }
    }
    skuid.ui.fieldRenderers.TEXT[field.mode](field,value=totalAllocatedBadge);
}*/
});
skuid.snippet.register('createUIRecordSnippet',function(args) {/*
    ** Snippet that will create the new UI records for AccountIdUI
*/
var params = arguments[0],
	$ = skuid.$;
    var model = arguments[0].ExpocadBadgeAgg,
    row = arguments[0].row;
    var accName = arguments[0].item.row.quoterSBQQAccountrName;
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
skuid.snippet.register('massApproveSendEmail',function(args) {/*
    ** Snippet to send mass email for mass approval of badges
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
            if (modelEB.data[i].User_Name__r.Contact.Account.Name==aName)
            {
                if (modelEB.data[i].Status__c!='Approved'&&modelEB.data[i].MassAction=== true&&(modelEB.data[i].Status__c=='Rejected' || modelEB.data[i].Status__c=='Pending'))
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
    ** Snippet to send mass email for mass rejection of badges
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
            if (modelEB.data[i].User_Name__r.Contact.Account.Name==aName)
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
            if (rowB.RejectEmail===true)
            {
                var emailType= "Reject";
                var rejectNote= rowB.RejectNote;
                if (!rejectNote)
                {
                    rejectNote='NA';
                }
                var result = sforce.apex.execute('MassBadgeEmail','MassBadgeEmail', {eventEditionId:eID,conID:contextContact, ExhibitorBadgeID: JSONString,emailType:emailType,Note:rejectNote},function(result){
                console.log(result);
                });
            }
            if (rowB.AcceptEmail===true)
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
                
                
            }
        }
    }
});
skuid.snippet.register('removeHyperlink',function(args) {/*
    ** Snippet to remove hyperlink from the field
    ** The snippet is calles as fieldrenderer
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
skuid.snippet.register('Export',function(args) {/*
    ** Snippet to export the bagges reports in csv form
*/
var model = skuid.model.getModel('ExhibitorBadgeList');
var row= model.getFirstRow();
model.exportData({
    fileName: 'Badges Report'+'.csv',
    doNotAppendRowIdColumn: true,
    fields: 
    [
        model.getField('User_Name__r.Contact.Account.Name'),
        model.getField('First_Name__c'),
        model.getField('Last_Name__c'),
        model.getField('Email__c'),
        model.getField('Country_Code__c'),
        model.getField('Mobile_Number__c'),
        model.getField('Country__c'),
        model.getField('State__c'),
        model.getField('City__c'),
        model.getField('Address__c'),
        model.getField('Nationality__c'),
        model.getField('Age_Bracket__c'),
        model.getField('Job_Title__c')
        //model.getField('Status__c'),
        //model.getField('Booth_Size__c'),
       
    ]
});
});
skuid.snippet.register('sendSingleEmail',function(args) {/*
    ** Snippet to sned single email for single badges approval and rejection
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
console.log("boolean: "+rowB.RejectEmail);

console.log("Id: "+contextContact);
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
skuid.snippet.register('AddAndUpdateAttacment',function(args) {/*
    ** Snippet to add and update attachmen ID 
*/
var attachmentModel = skuid.model.getModel('AttachmentForEditForm');
var attachmentRow = attachmentModel.getFirstRow();
console.log(attachmentRow.Id);
var result1 = sforce.apex.execute('updateAttFieldsOnFormAndManual','updateAndDeleteAttOnForm',{FormId:attachmentRow.ParentId, AttId:attachmentRow.Id, AttName:attachmentRow.Name});
});
/*
    ** Snippet to re-render the template for customer profile tab
*/
(function(skuid){
var $ = skuid.$;
$(document.body).on('pageload',function(){
    var intervalID = window.setInterval(myCallback, 3000);
    function myCallback() {
        var plcomp = skuid.component.getById('ProductListingsTemplate');
        if (plcomp !== undefined)plcomp.rerender();
        var pCcomp = skuid.component.getById('productCategoryTemplate');
        if (pCcomp !== undefined)pCcomp.rerender();
        var sScomp = skuid.component.getById('ShowSpecialsTemplate');
        if (sScomp !== undefined)sScomp.rerender();
       
        var Vcomp = skuid.component.getById('VideoTemplate');
        if (Vcomp !== undefined)Vcomp.rerender();
        var Dcomp = skuid.component.getById('DocumentsTemplate');
        if (Dcomp !== undefined)Dcomp.rerender();
        
    }
});
})(skuid);;
skuid.snippet.register('updateUIPackageSetting',function(args) {/*
    ** Snippet that will create the new record for PackageSettingPerBoothUI UI model
    ** this snippet will check for user default package and upgrade package and create the PackageSettingPerBoothUI UI records accordingly
*/
var params = arguments[0],
	$ = skuid.$;
	//var intervalID = window.setInterval(myCallback, 3000);
/*function myCallback() 
{*/

    var modelUI = skuid.$M('PackageSettingPerBoothUI');
    console.log("modelUI "+modelUI.data.length);
    
    var modelPPS = skuid.$M('ProfilePackageSetting');
    var modelPPSDefault = skuid.$M('ProfilePackageSettingDefault');
    var modelUUP = skuid.$M('UserUpgradePackage');
    var lenUUP= modelUUP.data.length;
    console.log('lenUUP userPackage upgrade: '+ lenUUP);
    var lenPPS=  modelPPS.data.length;
    console.log(lenPPS);
    var lenPPSDefault=  modelPPSDefault.data.length;
    
    if (lenUUP && lenUUP>0)
    {
        var rowUUPProLis= modelUUP.getFirstRow().Profile_Package_Setting__c;
        for (var i = 0; i <modelPPS.data.length;i++)
        {
           
            console.log('rowUUPProLis:   '+rowUUPProLis);
            if (modelPPS.data[i].Id==rowUUPProLis)
            {
                console.log("Equal-equal");
                //console.log('rowPPSId.Product_Listing__c: '+modelPPS.data[i].Product_Listing__c);
                var row = modelUI.getFirstRow();
                modelUI.updateRow(row, 'BoothContactInfo', modelPPS.data[i].Booth_Contact_Info__c);
                modelUI.updateRow(row, 'ProductListingNumber', modelPPS.data[i].Product_Listing__c);
                modelUI.updateRow(row, 'ShowSpecialsNumber', modelPPS.data[i].Show_Specials__c);
                modelUI.updateRow(row, 'VideosNumber', modelPPS.data[i].Videos__c);
                modelUI.updateRow(row, 'ProductCategoriesNumbers', modelPPS.data[i].Product_Categories__c);
                modelUI.updateRow(row, 'DocumentsNumber', modelPPS.data[i].Documents__c);
                modelUI.updateRow(row, 'PressRelease', modelPPS.data[i].Press_Release__c);
                //modelUI.updateRow(row, 'SocialMediaLinks', modelPPS.data[i].Social_Media_Links__c);
                modelUI.updateRow(row, 'BoothLogo', modelPPS.data[i].Logo__c);
                modelUI.updateRow(row, 'BoothDescription', modelPPS.data[i].Booth_Description__c);
                modelUI.updateRow(row, 'BoothSchedule', modelPPS.data[i].Booth_Schedule__c);
                modelUI.updateRow(row, 'PrintDescription', modelPPS.data[i].Print_Description__c);
                modelUI.updateRow(row, 'WebDescription', modelPPS.data[i].Web_Description__c);
                modelUI.save();
                 
            }
        }
    }
    else 
    {
        console.log("Amish Ranjit");
        var rowPPSDefault = modelPPSDefault.getFirstRow();
        var defaultId= rowPPSDefault.Id;
        console.log('rowPPSDefault: '+rowPPSDefault.Id);
        console.log('rowPPSDefault.Product_Listing__c  '+rowPPSDefault.Product_Listing__c);
        var row1 = modelUI.getFirstRow();
        modelUI.updateRow(row1, 'BoothContactInfo', rowPPSDefault.Booth_Contact_Info__c);
        modelUI.updateRow(row1, 'ProductListingNumber', rowPPSDefault.Product_Listing__c);
        modelUI.updateRow(row1, 'ShowSpecialsNumber', rowPPSDefault.Show_Specials__c);
        modelUI.updateRow(row1, 'VideosNumber', rowPPSDefault.Videos__c);
        modelUI.updateRow(row1, 'ProductCategoriesNumbers',rowPPSDefault.Product_Categories__c);
        modelUI.updateRow(row1, 'DocumentsNumber',rowPPSDefault.Documents__c);
        modelUI.updateRow(row1, 'PressRelease', rowPPSDefault.Press_Release__c);
        //modelUI.updateRow(row1, 'SocialMediaLinks', rowPPSDefault.Social_Media_Links__c);
        modelUI.updateRow(row1, 'BoothLogo', rowPPSDefault.Logo__c);
        modelUI.updateRow(row1, 'BoothDescription', rowPPSDefault.Booth_Description__c);
        modelUI.updateRow(row1, 'BoothSchedule', rowPPSDefault.Booth_Schedule__c);
        modelUI.updateRow(row1, 'PrintDescription', rowPPSDefault.Print_Description__c);
        modelUI.updateRow(row1, 'WebDescription', rowPPSDefault.Web_Description__c);
        modelUI.save();
    }
//}
//}    
    /*if (lenPPS && lenPPS>0)
    {
        var rowPPS = modelPPS.getFirstRow();
        var row = modelUI.getFirstRow();
        modelUI.updateRow(row, 'BoothContactInfo', rowPPS.Booth_Contact_Info__c);
        modelUI.updateRow(row, 'ProductListing', rowPPS.Product_Listing__c);
        modelUI.updateRow(row, 'ShowSpecials', rowPPS.Show_Specials__c);
        modelUI.save();
    }
    else 
    {
        var rowPPSDefault = modelPPSDefault.getFirstRow();
        var row = modelUI.getFirstRow();
        modelUI.updateRow(row, 'BoothContactInfo', rowPPSDefault.Booth_Contact_Info__c);
        modelUI.updateRow(row, 'ProductListing', rowPPSDefault.Product_Listing__c);
        modelUI.updateRow(row, 'ShowSpecials', rowPPSDefault.Show_Specials__c);
        modelUI.save();
    }*/
});
skuid.snippet.register('updateAddNewButtonAvailiability',function(args) {/*
    ** Snippet that will create the new record for AddBttmHideUnHide UI model
    ** Snippet  capture the boolean value for the AddBttmHideUnHide's fields as per user's number of records for each items and package type 

*/
var params = arguments[0],
	$ = skuid.$;
    var modelSS = skuid.$M('ShowSpecial');
    var modelPL = skuid.$M('ProducListing');
    var modelD = skuid.$M('Documents');
    //var modelPC = skuid.$M('CustomerProductSubCat');
    var modelEV = skuid.$M('ExhibitorVideo');
    
    var modelPSB = skuid.$M('PackageSettingPerBoothUI');
    var rowSSN =modelPSB.getFirstRow().ShowSpecialsNumber;
    var rowPCN =modelPSB.getFirstRow().ProductCategoriesNumbers;
    //console.log('rowPCN  '+rowPCN);
    var rowVN =modelPSB.getFirstRow().VideosNumber;
    var rowPLN =modelPSB.getFirstRow().ProductListingNumber;
    console.log("rowPLN:"+rowPLN);
    var rowDN =modelPSB.getFirstRow().DocumentsNumber;
    
    var modelABHU = skuid.$M('AddBttmHideUnHide');
    var row = modelABHU.getFirstRow();
    //console.log("test Show Butone");
    if (modelSS.data.length==rowSSN)
    {
        modelABHU.updateRow(row, 'ShowSpecialBtn', true);
        modelABHU.save();
        //console.log("test ShowSpecialBtn  Butone");
    }
    else
    {
        modelABHU.updateRow(row, 'ShowSpecialBtn', false);
        modelABHU.save();
       //console.log("test ShowSpecialBtnF  Butone");
    }
    
    if (modelPL.data.length==rowPLN)
    {
        modelABHU.updateRow(row, 'ProductListingBtn', true);
        modelABHU.save();
       // console.log("test ProductListingBtn  Butone");
    }
    else
    {
        modelABHU.updateRow(row, 'ProductListingBtn', false);
        modelABHU.save();
        //console.log("test ProductListingBtn F Butone");
    
    }
    
    if (modelD.data.length==rowDN)
    {
    modelABHU.updateRow(row, 'DocumentBtn', true);
    modelABHU.save();
    }
    else
    {
        modelABHU.updateRow(row, 'DocumentBtn', false);
        modelABHU.save();
    }
    
    
    
    if (modelEV.data.length==rowVN)
    {
        modelABHU.updateRow(row, 'VideoBtn', true);
        modelABHU.save();
    }
    else
    {
        modelABHU.updateRow(row, 'VideoBtn', false);
        modelABHU.save();
    }
    
    /*if (modelPC.data.length==rowPCN)
    {
        modelABHU.updateRow(row, 'ProCatBtn', true);
        modelABHU.save();
    }
    else
    {
        modelABHU.updateRow(row, 'ProCatBtn', false);
        modelABHU.save();
    }*/
// console.log('OpenDrawer');
skuid.$('#sk-2FG_1Q-3344').find('table:first > tbody').children('.nx-item').not('.nx-item-has-drawer').find('.sk-icon-tasks-open:visible').click();
});
/*
    ** Snippet to auto open the drawer for product sub- category
*/
/*(function(skuid){
	var $ = skuid.$;
	$(document.body).one('pageload',function(){
	var params = arguments[0],
	$ = skuid.$;
skuid.$('#sk-2FG_1Q-3344').find('table:first > tbody').children('.nx-item').not('.nx-item-has-drawer').find('.sk-webicon-ionicons:ios-minus-empty:visible').click();
	});
})(skuid);*/;
skuid.snippet.register('newSnippet',function(args) {var params = arguments[0],
	$ = skuid.$;
});
skuid.snippet.register('delProCategoryIfNoSubCat',function(args) {/*
    ** Snippet to delete customer product category records in all sub catogory records is deleted
*/
var params = arguments[0],
	$ = skuid.$;
    var modelPC = skuid.$M('CustomerProductCat');
    var modelPSC = skuid.$M('CustomerProductSubCat');
    var model = arguments[0].CustomerProductSubCat,
    row = arguments[0].row;
    var proSubCatId = arguments[0].item.row.Id;
    var proCatId = arguments[0].item.row.Customer_Product_Category__c;
    console.log(proCatId);
    var flag=0;
    for (var i =0; i <modelPC.data.length;i++)
    {
        console.log("modelPC.data[i].id:" +modelPC.data[i].Id);
        if (modelPC.data[i].Id==proCatId)
        {
            for (var j =0; j <modelPSC.data.length;j++)
            {
                if (modelPSC.data[j].Customer_Product_Category__c==proCatId)
                {
                    flag=1;
                }
            }
        }
    }
    if (flag!=1)
    {
         modelPC.deleteRow({ Id: proCatId } );
    }
    modelPC.save();
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
skuid.snippet.register('createDefaultExpoContact2',function(args) {/*
    ** Snippet that will create the new UI records for AccountIdUI
*/
var params = arguments[0],
	$ = skuid.$;
	var ExpoCadContactModel = skuid.model.getModel('ExpoCadContact');
    console.log('========SizeOLD '+ExpoCadContactModel.data.length);
	var ExpoModel = skuid.model.getModel('OpportunityExpoCADBoothMapping');
    var modelRow = ExpoModel.getFirstRow();
    console.log('modelRow.Id'+modelRow.Id);
    
    if(ExpoCadContactModel.data.length == 0)
    {
        var ExpoConModel = skuid.model.getModel('ExpoCadContact');
        var firstContact = ExpoConModel.getFirstRow();
        console.log('Tytsyug');
        var newRow = ExpoConModel.createRow({
            additionalConditions: [
                { field: 'First_Name__c', value: modelRow.Primary_Contact__r.FirstName},
                { field: 'Last_Name__c', value:  modelRow.Primary_Contact__r.LastName},
                { field: 'Address__c', value: modelRow.Primary_Contact__r.MailingStreet},
                { field: 'Telephone__c', value:  modelRow.Primary_Contact__r.Phone},
                { field: 'Zip_Code__c', value: modelRow.Primary_Contact__r.MailingPostalCode},
                { field: 'City__c', value: modelRow.Primary_Contact__r.MailingCity},
                { field: 'State__c', value:  modelRow.Primary_Contact__r.MailingStateCode},
                { field: 'Fax__c', value: modelRow.Primary_Contact__r.Fax__c},
                { field: 'Email__c', value: modelRow.Primary_Contact__r.Email},
                { field: 'Website__c', value:  modelRow.Primary_Contact__r.Website__c},
                { field: 'Country__c', value: modelRow.Primary_Contact__r.MailingCountryCode},
                { field: 'Event_Edition__c', value: modelRow.Opportunity__r.EventEdition__c},
                { field: 'Opportunity_Booth_Mapping__c', value: modelRow.Id}
            ], doAppend: true
        });
        ExpoConModel.save();
    }
});
skuid.snippet.register('validateCCEmail',function(args) {var params = arguments[0],
	$ = skuid.$;

var modelECad = skuid.model.getModel('ExpoCadContact');
var sEmail = modelECad.getFirstRow().CC_Email__c;
sEmail = typeof sEmail === 'undefined' ? '': sEmail.trim();
var filter = /^(([a-zA-Z0-9_\-]+([a-zA-Z0-9_\-\.]+))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)(\s*,\s*|\s*$))*$/;

if(!filter.test(sEmail)){
    alert('Please Enter a Valid Email Address: '+sEmail);
    sEmail.focus;
    return false;
}
});
skuid.snippet.register('validateEmail',function(args) {var params = arguments[0],
	$ = skuid.$;

var modelECad = skuid.model.getModel('ExpoCadContact');
var sEmail = modelECad.getFirstRow().Email__c;
sEmail = typeof sEmail === 'undefined' ? '': sEmail.trim();
var filter = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

if(sEmail != '' && !filter.test(sEmail)){
    alert('Please Enter a Valid Email Address: '+sEmail);
    sEmail.focus;
    return false;
}
});
}(window.skuid));