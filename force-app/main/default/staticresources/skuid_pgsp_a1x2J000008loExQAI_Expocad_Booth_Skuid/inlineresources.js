(function(skuid){
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
}(window.skuid));