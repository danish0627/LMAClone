(function(skuid){
skuid.snippet.register('ContactAddress',function(args) {/*Get all fields from contact model*/
var params = arguments[0], $ = skuid.$;
var modelECad = skuid.model.getModel('Contact');
var DisplayName = modelECad.getFirstRow().MailingStreet;
var sMailingCity = modelECad.getFirstRow().MailingCity;
var sMailingPostalCode = modelECad.getFirstRow().MailingPostalCode;

/*Trim all fields of contact*/
DisplayName = typeof DisplayName === 'undefined' ? '': DisplayName.trim();
sMailingCity = typeof sMailingCity === 'undefined' ? '': sMailingCity.trim();
sMailingPostalCode = typeof sMailingPostalCode === 'undefined' ? '': sMailingPostalCode.trim();

if(DisplayName!=='' && sMailingCity!=='' && sMailingPostalCode!==''){
	 modelECad.getFirstRow().MailingStreet = DisplayName;
     modelECad.getFirstRow().MailingCity = sMailingCity;
     modelECad.getFirstRow().MailingPostalCode = sMailingPostalCode;
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
} else {
    skuid.model.save([
            modelECad
        ],{callback: function(result){
            if (result.totalsuccess){
                /*Get all fields from contact model*/
				var modelECad1 = skuid.model.getModel('Contact');
                var row = modelECad1.getFirstRow();
                var sBillingAddressLine2 = row.Account.Billing_Address_Line_2__c;
                var sBillingStreet = row.Account.BillingStreet;
				
				/*Trim all fields of contact*/
                sBillingAddressLine2 = typeof sBillingAddressLine2 === 'undefined' ? '': sBillingAddressLine2.trim();
				sBillingStreet = typeof sBillingStreet === 'undefined' ? '': sBillingStreet.trim();
				
                /*concatenate sBillingStreet and sBillingAddressLine2*/
				var Str = '';
                if(sBillingStreet!==''){
                    Str = sBillingStreet;                    
                } else {
                    Str = '';
                }
                if(sBillingAddressLine2!==''){
                    Str += ', '+sBillingAddressLine2; 
                } else {
                    Str += '';
                }
				
                /*Update and save contact model*/
                modelECad1.updateRow(row, {
                    MailingStreet: Str,
                    MailingCity: row.Account.BillingCity,
                    MailingCountryCode: row.Account.BillingCountryCode,
                    MailingStateCode: row.Account.BillingStateCode,
                    MailingPostalCode: row.Account.BillingPostalCode
                }); 
                modelECad.save();
                 setTimeout(function(){
                    window.location.href = '/apex/ContactDetail_Skuid?id='+row.Id;    					
				},1000);
            } else {
                console.log(result.insertResults[0]);
            }
        }});
     }
});
skuid.snippet.register('NameAndEmailValidation',function(args) {/*Get all fields from contact model*/
var params = arguments[0], $ = skuid.$;
var modelECad = skuid.model.getModel('Contact');
var sFirstName = modelECad.getFirstRow().FirstName;
var sLastName = modelECad.getFirstRow().LastName;
var sEmail = modelECad.getFirstRow().Email;
var sPhone = modelECad.getFirstRow().Phone;
var sMobilePhone = modelECad.getFirstRow().MobilePhone;
var sTitle = modelECad.getFirstRow().Title;
var sAccountId = modelECad.getFirstRow().AccountId;

/*Trim all fields of contact*/
sFirstName = typeof sFirstName === 'undefined' ? '': sFirstName.trim();
sLastName = typeof sLastName === 'undefined' ? '': sLastName.trim();
sEmail = typeof sEmail === 'undefined' ? '': sEmail.trim();
sPhone = typeof sPhone === 'undefined' ? '': sPhone.trim();
sMobilePhone = typeof sMobilePhone === 'undefined' ? '': sMobilePhone.trim();
sTitle = typeof sTitle === 'undefined' ? '': sTitle.trim();
sAccountId = typeof sAccountId === 'undefined' ? '': sAccountId.trim();

var regex1 = /^[0-9- ()#+]*$/;
var regex12 = /^[0-9- ()#+]*$/;
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
} /*else if(sPhone === ''){
    alert(BusinessPhoneMessage);
    return false;
}*/



/*else if(sPhone!=='' && (!regex1.test(sPhone) || sMinimumSevenDigit.test(sPhone))){
    alert(BusinessPhoneMessage);
    return false;
}*/
});
}(window.skuid));