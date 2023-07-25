(function(skuid){
skuid.snippet.register('newSnippet',function(args) {var params = OpsTeam_EventView.eventED;
alert(' Id: ' + params.Id);
});
skuid.snippet.register('eventRedirect',function(args) {/* Snippet will redirect to Customer Setting Page*/
 var params = arguments[0],
    contextRow = params.item ? params.item.row : params.row,
    contextModel = params.model,
    $ = skuid.$;
    var eId = contextModel.getFieldValue(contextRow, 'Id', true);
    window.location.href ='/one/one.app#/alohaRedirect/apex/c__Redirect_CC_Settings_Page?id='+eId;
});
}(window.skuid));