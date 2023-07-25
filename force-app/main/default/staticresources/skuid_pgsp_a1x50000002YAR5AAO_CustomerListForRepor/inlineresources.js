(function(skuid){
skuid.snippet.register('newSnippet11',function(args) {/*var params = arguments[0],
	$ = skuid.$;
	var modelA = skuid.model.getModel('CurrentUser');
    var rowUser = modelA.getFirstRow();
    var model = arguments[0].ManualPermissionRequired,
    row = arguments[0].row;
    var ManualPerId = arguments[0].item.row.Id;
    console.log(ManualPerId);
    var result = sforce.apex.execute('UpdateUserManualAction','updateUserManualAction', {ManualPermissionId:ManualPerId, ContactId:rowUser.ContactId, UserID:rowUser.Id},function(result){
      console.log(result);
            });*/
});
skuid.snippet.register('exportListOfExhibitors',function(args) {/*
    ** Snippet to export data for exhibitor list
*/
var model = skuid.model.getModel('ContactEventEditionMappingAgg');
var modelE = skuid.model.getModel('EventEdition');
var rowE= modelE.getFirstRow();
model.exportData({
    fileName: 'List of Exhibitors Report- '+rowE.Name,
    doNotAppendRowIdColumn: true,
    fields: 
    [
        model.getField('sFContactIDrAccountName'),
        model.getField('userTyperName'),
        model.getField('sFEventEditionIDrName')

    ]
});
});
skuid.snippet.register('exportLastLoginActivity',function(args) {/*
    ** Snippet to export data for exhibitor list
*/
var model = skuid.model.getModel('UserReport');
var modelE = skuid.model.getModel('EventEdition');
var rowE= modelE.getFirstRow();
model.exportData({
    fileName: 'Last Login Report-' +rowE.Name,
    doNotAppendRowIdColumn: true,
    fields: 
    [
        model.getField('Account.Name'),
        model.getField('Contact.Name'),
        model.getField('LastLoginDate')

    ]
});
});
skuid.snippet.register('exportWelcomeEmail1',function(args) {/*
    ** Snippet to export data for exhibitor list
*/
var model = skuid.model.getModel('ContactEventEditionMapping');
var modelE = skuid.model.getModel('EventEdition');
var rowE= modelE.getFirstRow();
model.exportData({
    fileName: 'Send Welcome Email Report-' +rowE.Name,
    doNotAppendRowIdColumn: true,
    fields: 
    [
        model.getField('SFContactID__r.Account.Name'),
        model.getField('SFContactID__r.Name'),
        model.getField('SFContactID__r.Email'),
        model.getField('User_Type__r.Name'),
        model.getField('Email_Sent__c')
    ]
});
});
skuid.snippet.register('exportWelcomeEmail',function(args) {var params = arguments[0],
	$ = skuid.$;
    var modelE = skuid.model.getModel('EventEdition');
    var rowE= modelE.getFirstRow();
    var eId= rowE.Id;
    console.log('eId  '+eId);
    var result = sforce.apex.execute('welcomeEmailReport','welcomeEmailReport', {eId:eId},function(result){;
    console.log('result Welcome email'+result);
    var exportDetail = JSON.parse(result);  
    JSONToCSVConvertor (exportDetail,rowE.Name,true);
	
    function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
      //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
        var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
        var CSV = '';
        //This condition will generate the Label/Header
        if (ShowLabel) 
        {
            var row = "";
            //This loop will extract the label from 1st index of on array
            for (var index in arrData[0]) {
              //Now convert each value to string and comma-seprated
              row += index + ',';
            }
            row = row.slice(0, -1);
            //append Label row with line break
            CSV += row + '\r\n';
        }
        
        //1st loop is to extract each row
        for (var i = 0; i < arrData.length; i++) {
            var row = "";
            //2nd loop will extract each column and convert it in string comma-seprated
            for (var index in arrData[i]) {
                row += '"' + arrData[i][index] + '",';
            }
            
            row.slice(0, row.length - 1);
            //add a line break after each row
            CSV += row + '\r\n';
        }
        
        if (CSV == '') {
            alert("Invalid data");
            return;
        }
        
        //Generate a file name
        var fileName = ReportTitle.replace(/ /g, "_");
        //Initialize file format you want csv or xls
        var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
        var link = document.createElement("a");
        link.href = uri;
        
        link.style = "visibility:hidden";
        link.download = fileName + ".csv";
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        }
});
});
skuid.snippet.register('exportProductCategory',function(args) {/*
    ** Snippet to export data for exhibitor list
*/
var model = skuid.model.getModel('ProductCategories');
var modelE = skuid.model.getModel('EventEdition');
var rowE= modelE.getFirstRow();
model.exportData({
    fileName: 'Product Category Report-' +rowE.Name,
    doNotAppendRowIdColumn: true,
    fields: 
    [
        model.getField('Event_Edition__r.Name'),
        model.getField('Account__r.Name'),
        model.getField('ExpocadBooth__r.Booth_Number__c'),
        model.getField('Event_Edition_Sub_Category_Mapping__r.Event_Edition_Product_Category_Mapping__r.Levels_Master__r.Mapped_To_Level__r.LevelValue__c'),
        model.getField('Event_Edition_Sub_Category_Mapping__r.Event_Edition_Product_Category_Mapping__r.Levels_Master__r.LevelValue__c'),
        model.getField('Event_Edition_Sub_Category_Mapping__r.Levels_Master__r.LevelValue__c')
    ]
});
});
/*
** Snippet to set Defult tab on load
*/
(function(skuid){
	var $ = skuid.$;
	$(document.body).one('pageload',function(){
	    //alert('hi')
	    //skuid.$( "#tabSetCustomerListForReports" ).tabs( "option", "active", 2); // index is zero-based, so this would activate the 2nd tab
	    
	    //var tabset = skuid.$("#tabSetCustomerListForReports");
       // tabset.tabs( "option", "active", tabset.tabs("option","active") + 1 );
	   
	  // var TAB_ID = 'testlog';
	  // var $ = skuid.$;
       // var tabset = $('#tabSetCustomerListForReports');
        //var tabPanels = tabset.children('.ui-tabs-panel');
       // var targetTabIndex = tabPanels.filter('#'+TAB_ID).index() - 1;
        //console.log('index '+targetTabIndex);
        //tabset.tabs('option','active',targetTabIndex);
        
	});
})(skuid);;
skuid.snippet.register('newSnippet',function(args) {(function(skuid){
  $Lightning.use("c:AccountContacts_App", function() {
       document.getElementById("sk-1vjg-626").innerHTML ='';
        $Lightning.createComponent("c:CustomLoggedInDetailCmp",{EventId : "{{{$Model.EventEdition.data.0.Id}}}"},
        "sk-1vjg-626",function(cmp) {
        });     
    });
})(skuid);
});
skuid.snippet.register('CustomerCenterHomeRedirect',function(args) {/*This snippet is to take back to customer center Home page*/
var params = arguments[0],
	$ = skuid.$;
var modelA = skuid.model.getModel('EventEdition');
        var rowE = modelA.getFirstRow();
        var eId= rowE.Id;
        window.location.href ='/one/one.app#/alohaRedirect/apex/Event_Assigned_To_You'; //'/apex/skuid__ui?page=Operation_Team_Event_List';
});
skuid.snippet.register('NavigationRedirect',function(args) {/*This snippet is to take back to customer center settings page*/
var params = arguments[0],
	$ = skuid.$;
var modelA = skuid.model.getModel('EventEdition');
        var rowE = modelA.getFirstRow();
        var eId= rowE.Id;
        window.location.href ='/one/one.app#/alohaRedirect/apex/c__Redirect_CC_Settings_Page?id='+eId;  //'/apex/skuid__ui?page=Customer_Center_Settings_Page&id='+eId;
});
}(window.skuid));