(function(skuid){
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
skuid.snippet.register('appendCurrecny',function(args) {/* This JS will capture the currecny unit from each row and append it back to the roww again */
/* This JS is created to resolved the issue with Skuid Currecny not being compatible with lightning */
var field = arguments[0],
    value = arguments[1],
    displayType = field.metadata.displaytype,
    model = field.model,
    mode = field.mode,
	$ = skuid.$;

/*find the actual currency of the row*/
var realCur = field.row.CurrencyIsoCode;

/*append the currency field*/
if(value!==null)
{
    value=realCur + ' ' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    // check to see if amount has decimal values
    if(value.includes('.'))
    {
        /*display the field as text*/
        skuid.ui.getFieldRenderer('TEXT', model.getDataSource())[mode](field, value);
    }
    else
    {
        /*display the field as text*/
        var dec= '.00';
        /**display the field as text**/
        skuid.ui.getFieldRenderer('TEXT', model.getDataSource())[mode](field, value.concat(dec));
    }
    
}
});
}(window.skuid));