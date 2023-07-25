(function(skuid){
skuid.snippet.register('StatusUpdateForRejected',function(args) {var OpportunityModal = skuid.model.getModel('OpportunityList');
var OpportunityRecord = OpportunityModal.getFirstRow();
var oppId = OpportunityRecord.Id;
console.log('oppId: '+oppId);

var status = 'Accounting Rejected';

console.log('status' + status);

var modal1A = skuid.model.getModel('OpportunityList');
console.log('debug ' + modal1A);

modal1A.updateRow(  { Id: oppId }, {Status__c: status});
console.log('Test ==== '+ modal1A.Status__c);
modal1A.save();
});
skuid.snippet.register('RemovedHyperlink',function(args) {var field = arguments[0],
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
skuid.snippet.register('NewTab',function(args) {"window.location.reload();"
});
skuid.snippet.register('PageRefresh',function(args) {location.reload();
});
skuid.snippet.register('Currency',function(args) {var field = arguments[0],
    value = arguments[1];

var newValue= value;
if (newValue)
{
    if (field.mode !== 'edit') {
        if (value !== null) 
        {
            console.log('value  ' + value);
            if (value==7830)
            {
                newValue = 222;
                console.log('newValue:   '+newValue);
            }
            
           /* else if (value.startsWith("EUR ")) {
               newValue = value.replace("EUR ","€");
            }
            else if (value.startsWith("AUD ")) {
                newValue = value.replace("AUD ","$");
            }*/
            //you could add more currencies with more if/else statements here
            //NOTE:
            //the risk with having something like $ to replace both AUD and USD is that 
            //users won't be able to tell which is USD or AUD
            //so you might have to make USD be "$" and AUD be "A$"
        }
    }
}
else 
{
    newValue='';
}

// Run the standard picklist renderer for the given mode

//console.log(newValue);
skuid.ui.fieldRenderers[field.metadata.displaytype][field.mode](field,newValue);
});
skuid.snippet.register('GoToNextTabURL',function(args) {var params = arguments[0],
	$ = skuid.$;
	var AgreementModal = skuid.model.getModel('Agreement');
var AgreementModalRecord = AgreementModal.getFirstRow();
var Agreementid = AgreementModalRecord.Id;
console.log('Agreementid: '+Agreementid);

window.open('/apex/c__Agreement_Attachment?id='+Agreementid, '_blank');
});
skuid.snippet.register('SendEmailRowSnippet',function(args) {var ROW_ACTION_ICON = 'sk-icon-send-email';
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
}
console.log('===rajesh');
});
skuid.snippet.register('Approve Invoice',function(args) {//Mass action snippet to capture only selected rowIds and ativate the model condition
var params = arguments[0],
	$ = skuid.$;
var params = arguments[0],   
    list = params.list,
    selectedIds = skuid.$.map(list.getSelectedItems(),function(item){
       return item.row.Id; 
    });
    console.log(selectedIds);
    // activating model condition
    var model = skuid.$M('Invoice_BA');
        model.setCondition(model.getConditionByName('ApprovedId'),selectedIds);
        model.updateData();
});
skuid.snippet.register('SaveRejectReasonJS',function(args) {/*Get all fields from contact model*/
var params = arguments[0], $ = skuid.$;
var modelECad = skuid.model.getModel('OpportunityList');
var vRejectResponse = modelECad.getFirstRow().Rejection_Responses__c;
var sNoteSSC = modelECad.getFirstRow().SSC_Notes__c;

sNoteSSC = typeof sNoteSSC === 'undefined' ? '': sNoteSSC.trim();
vRejectResponse = typeof vRejectResponse === 'undefined' ? '': vRejectResponse.trim();

if(vRejectResponse!==''){
    if(vRejectResponse === 'Other - Comment box will be provided for further explanation'){
        if(sNoteSSC === ''){
            alert('Required Fields have no Value [SSC Notes]');
            return false;
        } else {
            return true;
        }
    } else {
        return true;
    }
}
});
}(window.skuid));