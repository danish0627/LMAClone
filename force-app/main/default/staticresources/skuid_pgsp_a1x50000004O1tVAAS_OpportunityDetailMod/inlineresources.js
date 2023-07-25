(function(skuid){
skuid.snippet.register('ReloadPurchasedBooth',function(args) {var params = arguments[0],
$ = skuid.$;
var frame = $( '#PurchasedBoothFrame' );
if(frame.length) frame.attr( 'src', function ( i, val ) { return val; });
});
skuid.snippet.register('EmailTest',function(args) {var params = arguments[0],
	$ = skuid.$;

var query = window.location.search.substring(1);
var CompId  = query.split('&id=')[1];

window.open("/_ui/core/email/author/EmailAuthor?p3_lkid=" + CompId + "&isdtp=mn","_blank","toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, width=1200, height=700");

// + "&retURL=https://dumpsterfile.beefyhost.com:8444/SuperSkookum/Skuid/closewindow.html
});
skuid.snippet.register('testredirect',function(args) {var params = arguments[0],
	$ = skuid.$;
var modelA = skuid.model.getModel('Opportunity');
var row= modelA.getFirstRow();
console.log(row);
var acctID=row.AccountId;
console.log(acctID);
var oppId =row.Id; 
window.location.href = "/apex/SBQQ__AssetSelector?accountId="+acctID+"&oppId="+oppId;
});
skuid.snippet.register('Add 7 Days',function(args) {var params = arguments[0],
	$ = skuid.$,
	JRModel = skuid.$M('QuoteModal'),
	JRModelRow = JRModel.getFirstRow(),
	startDay = new Date(),
	endDay = new Date();
	
	//The start date is set on the skuid page and this snippet is run when the report type, SBQQ__StartDate__c or SBQQ__ExpirationDate__c is updated
	
 // startDay = skuid.time.parseDate(...);
     // This makes endDay a clone of startDay
 // endDay.setDate(startDay.getDate() + 6);
//	if (JRModel.getFieldValue(JRModelRow,'SBQQ__Account__c') !== '') {
	    
   // startDay = skuid.time.parseSFDate(JRModel.getFieldValue(JRModelRow,'SBQQ__StartDate__c'));
   /// endDay = startDay;
	    
//	} else {
	    startDay = skuid.time.parseDate(JRModel.getFieldValue(JRModelRow,'SBQQ__ExpirationDate__c'));
	    endDay = startDay;
	    endDay = new Date(startDay.getTime()); 
	    endDay.setDate(startDay.getDate() + 7);
//	}
	
	var fields = {
        //SBQQ__StartDate__c: skuid.time.getSFDate(startDay),
        SBQQ__ExpirationDate__c: skuid.time.getSFDate(endDay)
    };
	
	JRModel.updateRow(JRModelRow,fields);
});
skuid.snippet.register('Removehyperlink',function(args) {var field = arguments[0],
value = arguments[1],
$ = skuid.$;	
    

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
skuid.snippet.register('RowAction',function(args) {/*var ROW_ACTION_ICON = 'fa-angle-double-down';
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
}*/
});
skuid.snippet.register('Check Null Value For Cancel Reason',function(args) {var $ = skuid.$;
var pageTitle = $('#Opportunity');
var editor = pageTitle.data('Opportunity').editor;
var applicationModel = skuid.model.getModel('Opportunity');
var applicationRow =  applicationModel.data[0];
var appId =applicationRow.Id;
//var stat=applicationRow.Cancel_Reason__c;

    
if (applicationRow.Cancel_Reason__c) {
    alert("1");
} 
else { 
    skuid.$.blockUI({ message: '<h1>You  used Skuid exclusively through JavaScript!</h1><h2>You on your way to becoming a pro Skuid developer</h2><h3>Also notice how you can use HTML within your blockUI message!</h3><br/>How <i>cool</i> is that?' });
}
var retVal = sforce.apex.execute("DemooOrgUtils","borrowerAccepted",{app:appId}); 
alert("retVal"+ retVal);
window.location.reload();
});
skuid.snippet.register('newSnippet',function(args) {(function(skuid){   
   var $ = skuid.$;
   $(function(){
      var myModel = skuid.model.getModel('Opportunity');
      if (myModel) {
          var myField = myModel.getField('Body');
          if (myField) {
              myField.label = skuid.label.read('Comment_To_Add');
          }
      }
   });
})(skuid);
});
/*(function(skuid){
	var $ = skuid.$;
	$(document.body).one('pageload',function()
	{
        $(function (){
             var navOffset= $("#sk-3jGn5q-93").offset().top;
            $(window).scroll(function ()
             { 
                 $('#sk-yI7r-98').scroll(function ()
                 {
                     var scrollPos= $('#sk-yI7r-98').scrollTop();
                     
                     console.log("scrol por"+scrollPos);
                     if (scrollPos>=navOffset)
                     {
                         $('#sk-3jGn5q-93').addClass("fixed");
                     }
                     else
                     {
                         $('#sk-3jGn5q-93').removeClass("fixed");
                     }
                 });
                 
            });
        });
   });
})(skuid);*/;
(function (skuid) {
   var $ = skuid.$;
   $(document.body).one('pageload', function () {
      $(function () {
         var navOffset = $("#sk-3jGn5q-93").offset().top;
         $(window).scroll(function () {
            var scrollPos = $('#sk-yI7r-98').scrollTop();

            console.log("scrol por" + scrollPos);
            if (scrollPos >= navOffset) {
               $('#sk-3jGn5q-93').addClass("fixed");
            }
            else {
               $('#sk-3jGn5q-93').removeClass("fixed");
            }

         });
         $('#sk-yI7r-98').scroll(function () {
            var scrollPos = $('#sk-yI7r-98').scrollTop();

            console.log("scrol por" + scrollPos);
            if (scrollPos >= navOffset) {
               $('#sk-3jGn5q-93').addClass("fixed");
            }
            else {
               $('#sk-3jGn5q-93').removeClass("fixed");
            }

         });
      });
   });
})(skuid);;
skuid.snippet.register('PageRefresh',function(args) {location.reload();
});
/*(function(skuid){
 var $ = skuid.$;
 $(document.body).one('pageload',function(){
  
  var mainNav = $('#sk-IivFR-1400'),
      tempWidth;
  $(window).scroll(function(){
      //console.warn('scroll top',$(window).scrollTop());
      
      if($(window).scrollTop() > 300) {
          // grab the curre
          tempWidth = mainNav.width();
          // console.log(mainNav, tempWidth);
          // if we're past our scroll point, fix the menu to the top
          mainNav.addClass('fixed-top-center').css('width',tempWidth + "px");
          
      } else {
          // otherwise let leave it alone
          mainNav.removeClass('fixed-top-center').css('width','');
      }
  });
  
 });
})(skuid);*/;
skuid.snippet.register('Display_Name',function(args) {var params = arguments[0],
	$ = skuid.$;
});
skuid.snippet.register('ValidateDisplayName',function(args) {//added by Rajesh Girikon 30/03/2018

var params = arguments[0], $ = skuid.$;
var modelECad = skuid.model.getModel('Expocad_Booth');
var DisplayName = modelECad.getFirstRow().Display_Name__c;
//var regex = /^[a-zA-Z0-9/!\s@#\$%\'\^\&*?\',):;\[\]\(+=._\-}`{~]+$/g;
var regex = /^[a-zA-Z0-9ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿıŒœŠšŸŽž/!\s@#\$%\'\^\&*?\',):;\[\]\(+=._\-}`{~]+$/g;
var result = DisplayName.match( regex );
if (isEmptyOrSpaces(DisplayName)){
    alert( DisplayName + 'Please enter display name');
    return false;
}
  
/*if(result && (DisplayName.indexOf(' ') >0)){
  modelECad.save();
}*/

if(result){
  modelECad.save();
}
else {
  alert('Special Characters (<, >, |, ",\\) & Blank Values Cannot Saved.\nTo Cancel the Changes, Please Click on the Cancel Button.');
}
function isEmptyOrSpaces(str){
    return str === null || str.match(/^ *$/) !== null;
}
});
skuid.snippet.register('UnCheckIsBarter',function(args) {var params = arguments[0],$ = skuid.$;

var modelECad = skuid.model.getModel('Opportunity');
var IsBarterName = modelECad.getFirstRow().Is_Barter_Opportunity__c;
var PrimaryQuote = modelECad.getFirstRow().SBQQ__PrimaryQuote__c;
var modelQuote = skuid.model.getModel('SBQQ__Quote__c');
var PrimaryQuoteOpportunity = modelQuote.getFirstRow().SBQQ__Opportunity2__c;
alert('PrimaryQuote : '+PrimaryQuote);
if(IsBarterName)
{
    
    if(PrimaryQuote!==null && PrimaryQuote!=='')
    {
         alert('If PrimaryQuote: '+PrimaryQuote);
         alert('PrimaryQuoteOpportunity : '+PrimaryQuoteOpportunity);
    }
    else
    {
        alert('else PrimaryQuote : '+PrimaryQuote);
    }
}
});
skuid.snippet.register('ValidateContactMailingAddress',function(args) {/*Get all fields from contact model*/
var params = arguments[0], $ = skuid.$;
var modelECad = skuid.model.getModel('NewContact');
var DisplayName = modelECad.getFirstRow().MailingStreet;
var sMailingCity = modelECad.getFirstRow().MailingCity;
var sMailingPostalCode = modelECad.getFirstRow().MailingPostalCode;
var sFirstName = modelECad.getFirstRow().FirstName;
var sLastName = modelECad.getFirstRow().LastName;
var sEmail = modelECad.getFirstRow().Email;
var sPhone = modelECad.getFirstRow().Phone;
var sMobilePhone = modelECad.getFirstRow().MobilePhone;
var sTitle = modelECad.getFirstRow().Title;


/*Trim all fields of contact*/
DisplayName = typeof DisplayName === 'undefined' ? '': DisplayName.trim();
sMailingCity = typeof sMailingCity === 'undefined' ? '': sMailingCity.trim();
sMailingPostalCode = typeof sMailingPostalCode === 'undefined' ? '': sMailingPostalCode.trim();
sFirstName = typeof sFirstName === 'undefined' ? '': sFirstName.trim();
sLastName = typeof sLastName === 'undefined' ? '': sLastName.trim();
sEmail = typeof sEmail === 'undefined' ? '': sEmail.trim();
sPhone = typeof sPhone === 'undefined' ? '': sPhone.trim();
sMobilePhone = typeof sMobilePhone === 'undefined' ? '': sMobilePhone.trim();
sTitle = typeof sTitle === 'undefined' ? '': sTitle.trim();

var regex1 = /^[0-9- ()#+]*$/;
var regex12 = /^[0-9- ()#+]*$/;
var regex = /^[a-zA-Z0-9/!\s@#\$%\'\^\&*?\',):;\[\]\(+=._\-}`{~]+$/g;
var result = DisplayName.match( regex );
var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
var sMinimumSevenDigit = /^(?:[\D]*[0-9][\D]*){0,7}$/;
var sMinimumSevenDigit1 = /^(?:[\D]*[0-9][\D]*){0,7}$/;


var rege = /[^a-zA-Z]/;
var specialChar = /^[- ()#+]*$/;

/*Get all Custom labels*/
window.$Label = window.$Label || {};
var FirstNameMessage = skuid.utils.mergeAsText("global","{{$Label.FirstNameMessage}}");	  
var LastNameMessage = skuid.utils.mergeAsText("global","{{$Label.LastNameMessage}}");
var BusinessPhoneMessage = skuid.utils.mergeAsText("global","{{$Label.BusinessPhoneMessage}}");
var MobilePhoneMessage = skuid.utils.mergeAsText("global","{{$Label.MobilePhoneMessage}}");
var MailingStreetMessage = skuid.utils.mergeAsText("global","{{$Label.MailingStreetMessage}}");
var MailingCityMessage = skuid.utils.mergeAsText("global","{{$Label.MailingCityMessage}}");
var MailingPostalCodeMessage = skuid.utils.mergeAsText("global","{{$Label.MailingPostalCodeMessage}}");
var FirstNameCharacterMessage = skuid.utils.mergeAsText("global","{{$Label.FirstNameCharacterMessage}}");
var LastNameCharacterMessage = skuid.utils.mergeAsText("global","{{$Label.LastNameCharacterMessage}}");


var str = '';
var sAplphabets = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

for(i = 0; i < sAplphabets.length; i++){
    if(sPhone!=='' && (sPhone.startsWith(sAplphabets[i]) || sPhone.endsWith(sAplphabets[i]))&& !sMinimumSevenDigit.test(sPhone) || sPhone.includes(sAplphabets[i])){
        alert(BusinessPhoneMessage);
        return false;
    } 
}

if(sFirstName === ''){
    alert(FirstNameMessage);
    return false;
} else if(sFirstName!=='' && sFirstName.length > 40){
    alert(FirstNameCharacterMessage);
    return false;
} else if(sLastName === ''){
    alert(LastNameMessage);
    return false;
} else if(sLastName !=='' && sLastName.length > 80){
    alert(LastNameCharacterMessage);
    return false;
} else if(sTitle!=='' && sTitle.length > 128){
    alert('Title: data value too large: '+sTitle+' (max length=128)');
    return false;
} else if(sEmail === ''){
    alert('Email is missing!');
    return false;
} else if(!filter.test(sEmail)){
    alert('Email: invalid email address:'+sEmail);
    sEmail.focus;
    return false;
} else if(sPhone!=='' && (!rege.test(sPhone) || sMinimumSevenDigit.test(sPhone) || specialChar.test(sPhone) || sPhone.includes("@") || sPhone.includes("!") || sPhone.includes("_") || sPhone.includes("%") || sPhone.includes("$") || sPhone.includes("*") || sPhone.includes(",") || sPhone.includes(".") || sPhone.includes("?") || sPhone.includes("<") || sPhone.includes(">") || sPhone.includes("=") || sPhone.includes("/") || sPhone.includes("|") || sPhone.includes("{") || sPhone.includes("}") || sPhone.includes("[") || sPhone.includes("]") || sPhone.includes("~") || sPhone.includes("`") || sPhone.includes(";") || sPhone.includes(":") || sPhone.includes("^") || sPhone.includes("&") || sPhone.includes("\\"))){
    alert(BusinessPhoneMessage);
    return false;
} else if(sMobilePhone!=='' && (!regex12.test(sMobilePhone) || sMinimumSevenDigit1.test(sMobilePhone))){
    alert(MobilePhoneMessage);
    return false;
} else if(DisplayName === ''){
    alert(MailingStreetMessage);
    return false;
} else if(sMailingCity === ''){
   alert(MailingCityMessage);
    return false;
} /*else if(sPhone === ''){
    alert(BusinessPhoneMessage);
    return false;
} else if(sMailingPostalCode === ''){
    alert(MailingPostalCodeMessage);
    return false;
} */
else {
        skuid.model.save([
            modelECad
        ],{callback: function(result){
            if (result.totalsuccess){
                var r = modelECad.getFirstRow();
                window.location.href = '/apex/ContactDetail_Skuid?id='+r.Id;
            } else {
                console.log(result.insertResults[0]);
            }
        }});
}


/*else if(sPhone!=='' && (!regex1.test(sPhone) || sMinimumSevenDigit.test(sPhone))){
    alert(BusinessPhoneMessage);
    return false;
}*/
});
skuid.snippet.register('AssignAccountValuesToContact',function(args) {/*Get all fields from contact model*/
var params = arguments[0], $ = skuid.$;
var modelECad = skuid.model.getModel('NewContact');
var row = modelECad.getFirstRow();
var sMailingStreet = modelECad.getFirstRow().MailingStreet;
var sMailingCity = modelECad.getFirstRow().MailingCity;
var sMailingPostalCode = modelECad.getFirstRow().MailingPostalCode;
var sFirstName = modelECad.getFirstRow().FirstName;
var sLastName = modelECad.getFirstRow().LastName;
var sEmail = modelECad.getFirstRow().Email;
var sBillingStreet = modelECad.getFirstRow().Account.BillingStreet;
var sBillingAddLine2 = modelECad.getFirstRow().Account.Billing_Address_Line_2__c;

/*concatenate BillingStreet and Billing_Address_Line_2__c*/
var Str = '';
if(typeof sBillingStreet!='undefined'){
    Str = modelECad.getFirstRow().Account.BillingStreet;
} else {
    Str += '';
}
if(typeof sBillingAddLine2!='undefined'){
    Str += ', '+modelECad.getFirstRow().Account.Billing_Address_Line_2__c;
} else {
    Str += '';
}

/*update contact row*/
modelECad.updateRow(row, {
    MailingStreet: Str,
    MailingCity: modelECad.getFirstRow().Account.BillingCity,
    MailingCountryCode: modelECad.getFirstRow().Account.BillingCountryCode,
    MailingStateCode: modelECad.getFirstRow().Account.BillingStateCode,
    MailingPostalCode: modelECad.getFirstRow().Account.BillingPostalCode
});
});
skuid.snippet.register('removeHyperlinkSnippet',function(args) {var field = arguments[0],
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
skuid.snippet.register('Stageclosedlost',function(args) {/*
    Capturing Opportunity  information as per event edition as User 
*/
var params = arguments[0], 
$ = skuid.$;
var NewOpportunity = skuid.model.getModel('Opportunity');
var vopportunity = NewOpportunity.getFirstRow();
var sOppId= vopportunity.Id; 

$.blockUI({message: 'Please Wait...', timeout: 1000 });
var result = sforce.apex.execute('updateClosedLost','updateClosedLostInOpp',{sOppId:sOppId} , function(result){ 
    window.location.href = '/'+sOppId;
});
});
skuid.snippet.register('CancelReasonValidation',function(args) {/*Get all fields from contact model*/
var params = arguments[0], $ = skuid.$;
var modelECad = skuid.model.getModel('Opportunity');
var sCancelReason = modelECad.getFirstRow().Cancel_Reason__c;

/*Trim all fields of contact*/
sCancelReason = typeof sCancelReason === 'undefined' ? '': sCancelReason.trim();


/*Get all Custom labels*/
window.$Label = window.$Label || {};
var LabelMissingCancelReason = skuid.utils.mergeAsText("global","{{$Label.LabelMissingCancelReason}}");	

if(sCancelReason === ''){
    alert(LabelMissingCancelReason);
    return false;
} else {
    return true;
}
});
}(window.skuid));