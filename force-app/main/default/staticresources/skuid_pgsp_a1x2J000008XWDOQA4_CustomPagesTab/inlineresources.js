(function(skuid){
skuid.snippet.register('eventRedirect',function(args) {/* Snippet will redirect to Customer Cnter Main Event List Page*/
var params = arguments[0],
	$ = skuid.$;
    window.location.href ='/one/one.app#/alohaRedirect/apex/Event_Assigned_To_You';
});
}(window.skuid));