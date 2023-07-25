(function(skuid){
skuid.snippet.register('OpenUrlNewTab',function(args) {/*added by Rajesh Girikon*/

var EventModal = skuid.model.getModel('EventEditionDetail');
var EventModalRecord = EventModal.getFirstRow();
var EventModalId = EventModalRecord.Id;
console.log('EventModalId: '+EventModalId);

window.open('/apex/c__ExpoCadDecks?id='+EventModalId+'&eid=&ic=1_blank');
});
}(window.skuid));