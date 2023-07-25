(function(skuid){
skuid.snippet.register('ValidateAlphabetCharacters',function(args) {var params = arguments[0], $ = skuid.$;
var modelECad = skuid.model.getModel('PaymentType');
var mileAmmount1 = modelECad.getFirstRow().Milestone_1_Amount__c;
var mileAmmount2 = modelECad.getFirstRow().Milestone_2_Amount__c;
var mileAmmount3 = modelECad.getFirstRow().Milestone_3_Amount__c;
var mileAmmount4 = modelECad.getFirstRow().Milestone_4_Amount__c;
var mileAmmount5 = modelECad.getFirstRow().Milestone_5_Amount__c;
var mileAmmount6 = modelECad.getFirstRow().Milestone_6_Amount__c;
var mileAmmount7 = modelECad.getFirstRow().Milestone_7_Amount__c;
var mileAmmount8 = modelECad.getFirstRow().Milestone_8_Amount__c;
var mileAmmount8 = modelECad.getFirstRow().Milestone_9_Amount__c;
var mileAmmount10 = modelECad.getFirstRow().Milestone_10_Amount__c;
var mileAmmount11 = modelECad.getFirstRow().Milestone_11_Amount__c;
var mileAmmount12 = modelECad.getFirstRow().Milestone_12_Amount__c;
alert('mileAmmount1: '+mileAmmount1);
var regex = /^[0-9]*$/gm;
var result = mileAmmount1.match( regex );
alert('result: '+result);
/*if(result){
  modelECad.save();
}
else {
  alert('Alphabet Characters are not allowed!');
}*/
});
}(window.skuid));