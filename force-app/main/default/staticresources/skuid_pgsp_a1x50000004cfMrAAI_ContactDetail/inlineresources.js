(function(skuid){
/*(function (skuid) {
   var $ = skuid.$;
   $(document.body).one('pageload', function () {
      $(function () {
         var navOffset = $("#sk-BC9N6-591").offset().top;
         $(window).scroll(function () {
            var scrollPos = $(window).scrollTop();

            console.log("scrol por" + scrollPos);
            if (scrollPos >= navOffset) {
               $('#sk-BC9N6-591').addClass("fixed");
            }
            else {
               $('#sk-BC9N6-591').removeClass("fixed");
            }

         });
      });
   });
})(skuid);*/;
skuid.snippet.register('phonerender',function(args) {var  timeout,
field = arguments[0],    
   value = skuid.utils.decodeHTML(arguments[1]),
    $ = skuid.$;
    
// Run the default renderer    

skuid.ui.fieldRenderers[field.metadata.displaytype][field.mode](field,value);
if (field.mode==='edit') 
{
    var errorMessageBox;
    var addFieldError = function(errorMessage) {
    if (!errorMessageBox) 
    {
      errorMessageBox = field.element.find('.field-error-messages');
      if(!errorMessageBox.length) {
        errorMessageBox = $('<div class="field-error-messages">');
        field.element.append(errorMessageBox);
      }
    }
    errorMessageBox.show();
    field.element.addClass('my-required-field');
    errorMessageBox.text(errorMessage);
    };
    
    var input = field.element.find(':input');
    skuid.utils.delayInputCallback(input,function(newValue,oldValue){
     console.log('[' + field.id + '] New value: ' + newValue +' old value: ' + oldValue);
     
         addFieldError(' ');
         newValue = newValue.replace(/[^\d.-\s\+)\(]/g,'');
         newValue = newValue.replace(/\s\s+/g,' ');
         input.val(newValue);
     if(timeout){clearTimeout(timeout);}
     
        if(!numericFilter(newValue)){
            if(newValue.length>9){
                timeout = window.setTimeout(function(){
                    input.val("");
                },2000);
            }else{
                timeout = window.setTimeout(function(){
                    input.val("");
                },4000);
            }
        }  
      
    });
    
    function numericFilter(mobile)    { 
      
      //var phoneno = /(^(\+([0-9]{2}))|(0?))?[- ]?(\d{3})?[- ]?(\d{3})[- ]?(\d{4})|$/;
      //var phoneno =  /(^(\+([0-9]{2}))|(0?))?[- ]?(\d{3})?[- ]?(\d{3})[- ]?(\d{4})$/;
      //var phoneno = /^\+?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;  
      var phoneno = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;  
      if(mobile.match(phoneno))  
        {  
            addFieldError(' ');
            return true; 
        }  
      else  
        {  
            addFieldError('Invalid Number!!! Please Enter Correct Information and Try Again.');
            return false;  
            
        }  
}
    
}
});
skuid.snippet.register('SaveContactForInactiveReason',function(args) {/*Get all fields from contact model*/
var params = arguments[0], $ = skuid.$;
var modelECad = skuid.model.getModel('Contact');
var InactiveReason = modelECad.getFirstRow().Inactive_Reason__c;
var InactiveAdditionalReason = modelECad.getFirstRow().Inactive_Additional_Reason__c;

/*Trim InactiveAdditionalReason Field*/
InactiveAdditionalReason = typeof InactiveAdditionalReason === 'undefined' ? '': InactiveAdditionalReason.trim();

/*Show alert message on the basis of Inactive_Additional_Reason__c*/
if(InactiveReason == 'Other' && InactiveAdditionalReason === ''){
    alert('Please Enter Additional Reason');
    return false;
} else {
    modelECad.save();
}
});
skuid.snippet.register('ValidateCharacterLimit',function(args) {/*Get all fields from contact model*/
var params = arguments[0], $ = skuid.$;
var modelECad = skuid.model.getModel('Contact');
var row = modelECad.getFirstRow();
var sFirstName = modelECad.getFirstRow().FirstName;
var sLastName = modelECad.getFirstRow().LastName;
var sTitle = modelECad.getFirstRow().Title;
var sPhone = modelECad.getFirstRow().Phone;
//alert('sPhone: '+sPhone);
//var testBusiness = ;
//alert('testBusiness: '+document.getElementById("phone").value);
/*Trim all fields*/
sFirstName = typeof sFirstName === 'undefined' ? '': sFirstName.trim();
sLastName = typeof sLastName === 'undefined' ? '': sLastName.trim();
sTitle = typeof sTitle === 'undefined' ? '': sTitle.trim();
sPhone = typeof sPhone === 'undefined' ? '': sPhone.trim();

var regex1 = /[^a-zA-Z]/;
var specialChar = /^[- ()#+]*$/;
var sMinimumSevenDigit = /^(?:[\D]*[0-9][\D]*){0,7}$/;
/*Get all Custom labels*/  
var BusinessPhoneMessage = skuid.utils.mergeAsText("global","{{$Label.BusinessPhoneMessage}}");

var str = '';
var sAplphabets = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

for(i = 0; i < sAplphabets.length; i++){
    if(sPhone!=='' && (sPhone.startsWith(sAplphabets[i]) || sPhone.endsWith(sAplphabets[i]))&& !sMinimumSevenDigit.test(sPhone) || sPhone.includes(sAplphabets[i])){
        alert(BusinessPhoneMessage);
        return false;
    } 
}

if(sFirstName === ''){
    alert('Required fields are missing: [First Name]');
    return false;
} else if(sFirstName!=='' && sFirstName.length > 40){
    alert('FirstName: data value too large: '+sFirstName+' (max length=40)');
    return false;
} else if(sLastName !=='' && sLastName.length > 80){
    alert('LastName: data value too large: '+sLastName+' (max length=80)');
    return false;
} else if(sTitle!=='' && sTitle.length > 128){
    alert('Title: data value too large: '+sTitle+' (max length=128)');
    return false;
} else if(sPhone!=='' && (!regex1.test(sPhone) || sMinimumSevenDigit.test(sPhone) || specialChar.test(sPhone) || sPhone.includes("@") || sPhone.includes("!") || sPhone.includes("_") || sPhone.includes("%") || sPhone.includes("$") || sPhone.includes("*") || sPhone.includes(",") || sPhone.includes(".") || sPhone.includes("?") || sPhone.includes("<") || sPhone.includes(">") || sPhone.includes("=") || sPhone.includes("/") || sPhone.includes("|") || sPhone.includes("{") || sPhone.includes("}") || sPhone.includes("[") || sPhone.includes("]") || sPhone.includes("~") || sPhone.includes("`") || sPhone.includes(";") || sPhone.includes(":") || sPhone.includes("^") || sPhone.includes("&") || sPhone.includes("\\"))){
    alert(BusinessPhoneMessage);
    return false;
}
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
skuid.snippet.register('ValidateBusinessPhone',function(args) {/*Get all fields from contact model*/
var params = arguments[0], $ = skuid.$;
var modelECad = skuid.model.getModel('Contact');
var sPhone = modelECad.getFirstRow().Phone;

/*Trim all fields*/
sPhone = typeof sPhone === 'undefined' ? '': sPhone.trim();

var regex1 = /^[0-9- ()#+]*$/;
var sMinimumSevenDigit = /^(?:[\D]*[0-9][\D]*){0,7}$/;

/*Get all Custom labels*/
var BusinessPhoneMessage = skuid.utils.mergeAsText("global","{{$Label.BusinessPhoneMessage}}");

if(sPhone!=='' && (!regex1.test(sPhone) || sMinimumSevenDigit.test(sPhone))){
    alert(BusinessPhoneMessage);
    return false;
}
});
}(window.skuid));