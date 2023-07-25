(function(skuid){
skuid.snippet.register('ProdcutInBoothApplication',function(args) {console.log(args);
var currentContactModel = skuid.model.getModel('ProductsList');
var currentContactCondition = currentContactModel.getConditionByName('Booth_ApplicationID');
currentContactModel.setCondition(currentContactCondition,args.item.row.Id);
currentContactModel.updateData();
});
skuid.snippet.register('reviewprocess',function(args) {/*
    Capturing Opportunity  information as per event edition as User 
*/
var params = arguments[0], 
$ = skuid.$;
var NewOpportunity = skuid.model.getModel('NewOpportunity');
var Opportunity = NewOpportunity.getFirstRow();
var eventDetailModel = skuid.model.getModel('onlineboothcapture');
var eventDetail = eventDetailModel.getFirstRow();
var accountId= Opportunity.AccountId; 
var OppName = Opportunity.Name;
var sobcId = eventDetail.Id;
var salesuser ;

if (typeof Opportunity.OwnerId !== 'undefined'){
    salesuser = Opportunity.OwnerId;
}
else {
    salesuser = skuid.utils.userInfo.userId;
}
$.blockUI({message: 'Conversion is processed please wait for few second ...', timeout: 1000 });
var result = sforce.apex.execute('ReviewProcess_cls','reviewprocess',{OppName:OppName, accountId:accountId, sobcId:sobcId , salesuser:salesuser} , function(result){ 
  if(result != 'Opportunity is not created due to getting exception'){
        //window.location.href = '/'+result[0];
         window.location.href = '/apex/c__OnlineBoothCapture';
    }
    else {
        alert(result[0]);
        window.location.href = '/apex/c__OnlineBoothRequest?id='+sobcId;
    }
});
});
skuid.snippet.register('createaccountopp',function(args) {/*
    Capturing Opportunity  information as per event edition as User 
*/
var params = arguments[0], 
$ = skuid.$;
var NewAccount = skuid.model.getModel('NewAccount');
var Accountdetails = NewAccount.getFirstRow();
//var accountname = Accountdetails.Name;
var accountId= Accountdetails.Id;
//var NewOpportunity = skuid.model.getModel('NewOpportunity');
//var Opportunity = NewOpportunity.getFirstRow();
var eventDetailModel = skuid.model.getModel('onlineboothcapture');
var eventDetail = eventDetailModel.getFirstRow();
$.blockUI({message: 'Conversion is processed please wait for few second ...', timeout: 1000 });
//var OppName = Accountdetails.Opportunity_Name__c;
var sobcId = eventDetail.Id;

var salesuser ;
if (typeof Accountdetails.Sales_Rep__c !== 'undefined'){
    salesuser = Accountdetails.Sales_Rep__c;
}
else {
    salesuser = skuid.utils.userInfo.userId;
}

if (typeof Accountdetails.Opportunity_Name__c !== 'undefined'){
    OppName = Accountdetails.Opportunity_Name__c;
}
else {
    OppName = Accountdetails.Name;
}

var result = sforce.apex.execute('ReviewProcess_cls','reviewprocess', {OppName:OppName, accountId:accountId, sobcId:sobcId , salesuser:salesuser} , function(result){ 
    if(result != 'Opportunity is not created due to getting exception'){
        //window.location.href = '/'+result[0];
        window.location.href = '/apex/c__OnlineBoothCapture';
    }
    else {
        alert(result[0]);
        window.location.href = '/apex/c__OnlineBoothRequest?id='+sobcId;
    }
});
});
skuid.snippet.register('ExistingUseropp',function(args) {/*
    Capturing Opportunity  information as per event edition as User 
*/
var params = arguments[0], 
$ = skuid.$;
var NewOpportunity = skuid.model.getModel('NewOpportunity1');
var Opportunity = NewOpportunity.getFirstRow();
$.blockUI({message: 'Conversion is processed please wait for few second ...', timeout: 1000 });
var eventDetailModel = skuid.model.getModel('onlineboothcapture');
var eventDetail = eventDetailModel.getFirstRow();
var accountId= Opportunity.AccountId;
var OppName = Opportunity.Name;
var sobcId = eventDetail.Id;
///var ClosedDate = Opportunity.CloseDate;
var salesuser ;

if (typeof Opportunity.OwnerId !== 'undefined'){
    salesuser = Opportunity.OwnerId;
}
else {
    salesuser = skuid.utils.userInfo.userId;
}
var result = sforce.apex.execute('ReviewProcess_cls','reviewprocess', {OppName:OppName, accountId:accountId, sobcId:sobcId , salesuser:salesuser} , function(result){ 
    if(result != 'Opportunity is not created due to getting exception')
    {
        //window.location.href = '/'+result[0];
        window.location.href = '/apex/c__OnlineBoothCapture';
    }
    else {
        alert(result[0]);
        window.location.href = '/apex/c__OnlineBoothRequest?id='+sobcId;
    }
});
});
skuid.snippet.register('ExistingOppReviewProcess',function(args) {/*
    Existing opportuntiy for review process information as per event edition as User 
*/
var params = arguments[0], 
$ = skuid.$;

var OnlineBoothCaptureModal = skuid.model.getModel('onlineboothcapture');
var OnlineBooth = OnlineBoothCaptureModal.getFirstRow();
var isConverted = OnlineBooth.Isconvert__c;
console.log('isConverted' + isConverted);
if(isConverted === true){
    
    alert('This booth request already converted please choose another one');
}
else{
    $.blockUI({message: 'Conversion is processed please wait for few second ...', timeout: 1000 });    
    var OppId = OnlineBooth.Opportunity__c;
    var OppName = OnlineBooth.Opportunity__c;
    //alert('OppName :'+OppName);
    //var accountId = OnlineBooth.Account__c;
    
    var sobcId = OnlineBooth.Id;
    //alert('sobcId :'+sobcId);
    var salesuser;
    var accountId;
    //get accountid from obc request
   // alert('accountId :'+OnlineBooth.Account__c);
   // alert('accountId 2:'+OnlineBooth.Opportunity__r.AccountId);
    if (typeof OnlineBooth.Account__c !== 'undefined'){
        accountId = OnlineBooth.Account__c;
        //alert('Account If :'+accountId);
    }
    else {
        accountId = OnlineBooth.Opportunity__r.AccountId;
        //alert('salesuser else :'+accountId);
    }
    
    if (typeof OnlineBooth.User__c !== 'undefined'){
        salesuser = OnlineBooth.User__c;
        //alert('salesuser If :'+salesuser);
    }
    else {
        salesuser = skuid.utils.userInfo.userId;
        //alert('salesuser else :'+salesuser);
    }
     if (typeof OnlineBooth.User__c !== 'undefined'){
        salesuser = OnlineBooth.User__c;
        //alert('salesuser If :'+salesuser);
    }
    else {
        salesuser = skuid.utils.userInfo.userId;
        //alert('salesuser else :'+salesuser);
    }
    
    var result = sforce.apex.execute('ReviewProcess_cls','reviewprocess', {OppName:OppName, accountId:accountId, sobcId:sobcId , salesuser:salesuser} , function(result){ 
        if(result != 'Opportunity is not created due to getting exception' && result != 'Cybersource API Not Working !!' ){
           // window.location.href = '/'+result[0];
           window.location.href = '/apex/c__OnlineBoothCapture';
        }
        else {
            //alert(result[0]);
            window.location.href = '/apex/c__OnlineBoothRequest?id='+sobcId;
        }
    });
}
});
skuid.snippet.register('newSnippet',function(args) {var params = arguments[0],
	$ = skuid.$;
document.getElementById("sk-1WfX6T-704").style.display = "none";
});
skuid.snippet.register('SaveButtonRender',function(args) {var params = arguments[0],
	$ = skuid.$;
document.getElementById("sk-1elNQv-775").style.display = "none";
});
skuid.snippet.register('ExistingContact',function(args) {/*
    Capturing Opportunity  information as per event edition as User 
*/
var params = arguments[0], 
$ = skuid.$;
var NewOpportunity = skuid.model.getModel('NewOpportunity2');
var Opportunity = NewOpportunity.getFirstRow();
$.blockUI({message: 'Conversion is processed please wait for few second ...', timeout: 1000 });
var eventDetailModel = skuid.model.getModel('onlineboothcapture');
var eventDetail = eventDetailModel.getFirstRow();
var accountId= Opportunity.AccountId;
var OppName = Opportunity.Name;
var sobcId = eventDetail.Id;
var salesuser ; 
var ContactId = Opportunity.Opportunity_Contact__c;

if (typeof Opportunity.OwnerId !== 'undefined'){
    salesuser = Opportunity.OwnerId;
}
else {
    salesuser = skuid.utils.userInfo.userId;
}

var result = sforce.apex.execute('ReviewProcessExistingContact_cls','ExistingContact', {OppName:OppName, accountId:accountId, sobcId:sobcId , salesuser:salesuser, ContactId:ContactId } , function(result){ 
    if(result != 'Opportunity is not created due to getting exception' && result != 'Cybersource API Not Working !!' ){
        //window.location.href = '/'+result[0];
        window.location.href = '/apex/c__OnlineBoothCapture';
    }
    else {
        alert(result[0]);
        window.location.href = '/apex/c__OnlineBoothRequest?id='+sobcId;
    }
});
});
skuid.snippet.register('ExistingAccount',function(args) {/*
    Capturing Opportunity  information as per event edition as User 
*/
var params = arguments[0], 
$ = skuid.$;
var NewOpportunity = skuid.model.getModel('NewOpportunity3');
var Opportunity = NewOpportunity.getFirstRow();
var eventDetailModel = skuid.model.getModel('onlineboothcapture');
var eventDetail = eventDetailModel.getFirstRow();
var accountId= Opportunity.AccountId;
var OppName = Opportunity.Name;
var sobcId = eventDetail.Id;
//var ClosedDate = Opportunity.CloseDate;
var salesuser ;

if (typeof Opportunity.OwnerId !== 'undefined'){
    salesuser = Opportunity.OwnerId;
}
else {
    salesuser = skuid.utils.userInfo.userId;
}

$.blockUI({message: 'Conversion is processed please wait for few second ...', timeout: 1000 });
var result = sforce.apex.execute('ReviewProcess_cls','reviewprocess', {OppName:OppName, accountId:accountId, sobcId:sobcId , salesuser:salesuser} , function(result){ 
   if(result != 'Opportunity is not created due to getting exception' && result != 'Cybersource API Not Working !!' ){
        //window.location.href = '/'+result[0];
        window.location.href = '/apex/c__OnlineBoothCapture';
    }
    else {
        alert(result[0]);
        window.location.href = '/apex/c__OnlineBoothRequest?id='+sobcId;
    }
});
});
skuid.snippet.register('NewAccountButtonisHide1',function(args) {var params = arguments[0],
	$ = skuid.$;
document.getElementById("sk-iACSo-571").style.display = "none";
});
skuid.snippet.register('ExistingButtonHide',function(args) {var params = arguments[0],
	$ = skuid.$;
document.getElementById("sk-1WfR6W-639").style.display = "none";
});
skuid.snippet.register('NewOpportuntiyButton',function(args) {var params = arguments[0],
	$ = skuid.$;
document.getElementById("sk-1WfR6v-655").style.display = "none";
});
skuid.snippet.register('ExistingOppButton',function(args) {var params = arguments[0],
	$ = skuid.$;
document.getElementById("sk-1WfX65-690").style.display = "none";
});
skuid.snippet.register('NewOpportunityButton1',function(args) {var params = arguments[0],
	$ = skuid.$;
document.getElementById("sk-1WfX6T-704").style.display = "none";
});
skuid.snippet.register('ContactExists',function(args) {var params = arguments[0],
	$ = skuid.$;
document.getElementById("sk-1elNQv-775").style.display = "none";
});
skuid.snippet.register('AccountExist',function(args) {var params = arguments[0],
	$ = skuid.$;
document.getElementById("sk-1vNIYj-3681").style.display = "none";
});
skuid.snippet.register('ContactExists1',function(args) {var params = arguments[0],
	$ = skuid.$;
document.getElementById("sk-1vRZRa-811").style.display = "none";
});
skuid.snippet.register('AccountExists1',function(args) {var params = arguments[0],
	$ = skuid.$;
document.getElementById("sk-2JBGod-1282").style.display = "none";
});
skuid.snippet.register('ContactMatch',function(args) {var params = arguments[0],
	$ = skuid.$;
document.getElementById("sk-1SkZvQ-656").style.display = "none";
});
skuid.snippet.register('ContactMatch1',function(args) {var params = arguments[0],
	$ = skuid.$;
document.getElementById("sk-1SkZvo-668").style.display = "none";
});
skuid.snippet.register('AccountExits2',function(args) {var params = arguments[0],
	$ = skuid.$;
document.getElementById("sk-1Sj-sZ-556").style.display = "none";
});
skuid.snippet.register('NewOpp1',function(args) {var params = arguments[0],
	$ = skuid.$;
document.getElementById("sk-1Sj-sx-570").style.display = "none";
});
skuid.snippet.register('ExistingOpp',function(args) {var params = arguments[0],
	$ = skuid.$;
document.getElementById("sk-1vQmEB-484").style.display = "none";
});
skuid.snippet.register('NewOpp2',function(args) {var params = arguments[0],
	$ = skuid.$;
document.getElementById("sk-1__YVJ-690").style.display = "none";
});
skuid.snippet.register('NewOpp3',function(args) {var params = arguments[0],
	$ = skuid.$;
document.getElementById("sk-1MHbL5-526").style.display = "none";
});
skuid.snippet.register('NewOpp4',function(args) {var params = arguments[0],
	$ = skuid.$;
document.getElementById("sk-1MHbLP-541").style.display = "none";
});
skuid.snippet.register('RemoveHyperlink',function(args) {var field = arguments[0],
value = arguments[1],
$ = skuid.$;	
    

// If we're  in read mode, then remove hyperlink 
if (field.mode !== 'edit' || field.mode === 'edit') 
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
skuid.snippet.register('SendMailRejectReason',function(args) {/*
    Send Mail to Primary Contact Once Rejected
*/

var params = arguments[0], 
$ = skuid.$;
var BoothCaptureModel = skuid.model.getModel('onlineboothcapture');
var OBCRecord = BoothCaptureModel.getFirstRow();

var BoothId = OBCRecord.Id;
var DeclinedReason = OBCRecord.Reason_Of_Declined__c;

var ReasonDefined;
if (typeof OBCRecord.Reject_Reason__c !== 'undefined'){
    ReasonDefined = OBCRecord.Reject_Reason__c;
}
else{
  ReasonDefined = '';  
}
var result = sforce.apex.execute('RejectReasonCls','SendMailForRejectReason', {BoothId:BoothId, DeclinedReason:DeclinedReason, ReasonDefined:ReasonDefined} , function(result){ 
   // alert('result : '+result[0]);
});
});
skuid.snippet.register('ButtonHideJS',function(args) {var params = arguments[0],
	$ = skuid.$;
document.getElementById("sk-1WfR6v-655").style.display = "none";
});
}(window.skuid));