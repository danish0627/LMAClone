(function(skuid){
skuid.snippet.register('UpdateFormFields',function(args) {var formModel = skuid.model.getModel('NewForm');
var formModelRow =  formModel.getFirstRow();
console.log(formModelRow.Id);
var attachmentModel = skuid.model.getModel('Attachment');
var attachmentRow = attachmentModel.getFirstRow();
console.log(attachmentRow.Id);
var result1 = sforce.apex.execute('updateAttFieldsOnFormAndManual','updateAttOnForm',{FormId:formModelRow.Id, AttId:attachmentRow.Id, AttName:attachmentRow.Name});
});
skuid.snippet.register('EditFormUpdate',function(args) {var attachmentModel = skuid.model.getModel('AttachmentForEditForm');
var attachmentRow = attachmentModel.getFirstRow();
console.log(attachmentRow.Id);
var result1 = sforce.apex.execute('updateAttFieldsOnFormAndManual','updateAndDeleteAttOnForm',{FormId:attachmentRow.ParentId, AttId:attachmentRow.Id, AttName:attachmentRow.Name});
});
skuid.snippet.register('deleteFormWithoutAttachment',function(args) {var params = arguments[0],
	$ = skuid.$;
var modelA = skuid.model.getModel('NewForm');
var rowA = modelA.getFirstRow();
console.log('NewForm: '+rowA.Id);

modelA.deleteRow({Id:modelA.data[0].Id});
modelA.save();
});
}(window.skuid));