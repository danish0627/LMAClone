(function(skuid){
skuid.snippet.register('newSnippet',function(args) {var params = arguments[0],
	$ = skuid.$;
skuid.$('#SegmentsTable').find('table:first > tbody').children('.nx-item').not('.nx-item-has-drawer').find('.fa-truck:visible').click();
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
skuid.snippet.register('SendMailIncompleteObc',function(args) {/*
    Send Mail to Primary Contact for Incomplete OBC
*/
var params = arguments[0],
contextRow = params.item ? params.item.row : params.row,
contextModel = params.model,
$ = skuid.$;
// Getting context row
var OBCId = contextModel.getFieldValue(contextRow, 'Id', true);
console.log('OBCId : '+OBCId);
});
}(window.skuid));