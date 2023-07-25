(function(skuid){
skuid.snippet.register('IsNotModal',function(args) {return skuid.page.name == "OpportunityNew" || skuid.page.name == "OpportunityNewModal";
});
skuid.snippet.register('IsModal',function(args) {return skuid.page.name != "OpportunityNew" && skuid.page.name != "OpportunityNewModal";
});
skuid.snippet.register('UpdateBillingContact',function(args) {var ContactModalModal = skuid.model.getModel('ContactModal');
var ContactModalRecord = ContactModalModal.getFirstRow();
var ContactId ;
if (typeof ContactModalRecord !== 'undefined'){
  ContactId = ContactModalRecord.Id;
  console.log('Cont: '+ContactId);
  var vOpportunityModal = skuid.model.getModel('NewOpportunity');
  var vOpportunityRecord = vOpportunityModal.getFirstRow();
  var vBillingContact = vOpportunityRecord.Billing_Contact__c;
  var sOpportunityName = vOpportunityRecord.Name;
  sOpportunityName = typeof sOpportunityName === 'undefined' ? '': sOpportunityName.trim();  
  if(sOpportunityName === ''){
      alert('Opportunity name is missing!');
      return false;
  }
  if(sOpportunityName!==''){ 
      if(typeof vBillingContact === 'undefined' || vBillingContact === ''){
            console.log('fields values 1' + vBillingContact );
            vOpportunityModal.updateRow(vOpportunityRecord, {
              Billing_Contact__c: ContactId
            }); 
      }
  }
}
});
skuid.snippet.register('Updateseries',function(args) {var OpportunityModal = skuid.model.getModel('NewOpportunity');
var OpportunityRecord = OpportunityModal.getFirstRow();
var oppId = OpportunityRecord.Id;
console.log('oppId: '+oppId);
console.log('Test ==== '+OpportunityRecord.EventEdition__r.Part_of_Series__c);
var OpportunitySeries = OpportunityRecord.EventEdition__r.Part_of_Series__c;

console.log('OpportunitySeries' + OpportunitySeries);

var modal1A = skuid.model.getModel('NewOpportunity');
console.log(modal1A);

modal1A.updateRow(  { Id: oppId }, {Event_Series__c: OpportunitySeries});
modal1A.save();
});
}(window.skuid));