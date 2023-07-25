(function(skuid){
/*(function(skuid){
	var $ = skuid.$;
	$(document.body).one('pageload',function()
	{
		var modelCEEM = skuid.$M('contactEventEditionMapping');
        var lencEEM = modelCEEM.data.length;
        
        if(lencEEM == '0')
        {
            window.location = '/secur/logout.jsp?retUrl=/CustomerCenter/UserLogin';
        }
	});
})(skuid);*/;
skuid.snippet.register('SkuidSample.CardView',function(args) {var params = arguments[0],
	$ = skuid.$;
function renderCard( item )
{
    var row = item.row,
        model = item.list.model;

    var isNew = skuid.model.isNewId( row.Id );

    // set the Item's mode to "edit" for new rows. This will cause the Item's
    // field's to be automatically rendered in edit mode.
    if ( isNew )
        item.mode = 'edit';

    // create a wrapper function to make creating fields a bit less verbose
    var createField =
        function( fieldId )
        {
            return createEditableField( fieldId, model, row, item );
        };

    // create the editable fields
    var fName = createField( 'Name' ),
        fCode = createField( 'ProductCode' ),
        fFamily = createField( 'Family' ),
        fDesc = createField( 'Description' );

    var card = item.element
        .addClass( 'customview-card' );

    // header
    var header = $( '<div>' )
        .addClass( 'customview-header' )
        .appendTo( card );

    // card delete button
    $('<div>')
        .addClass( 'ui-silk ui-silk-delete' )
        .addClass( 'customview-cardbutton' )
        .on( 'click', function() { item.toggleDelete( true ); })
        .appendTo( header );

    // card edit button
    $('<div>')
        .addClass( 'ui-silk ui-silk-pencil' )
        .addClass( 'customview-cardbutton' )
        .on( 'click', function() { item.toggleEdit(); })
        .appendTo( header );

    // product name
    fName.element
        .addClass( 'customview-content' )
        .appendTo( header );

    var content = $( '<div>' )
        .appendTo( card );

    // image
    $( '<img>' )
        .attr( 'src',
            row.Image__r ?
                skuid.utils.getUrlFromAttachmentId(
                    row.Image__r.skuid__AttachmentId__c ) :
                $( '#nx-images .default_org' ).text()
        )
        .appendTo(
            $( '<a>' )
                .addClass( 'customview-imageframe' )
                .appendTo( content )
                .attr( 'href', '/' + row.Id )
        );

    // properties
    $( '<div>' )
        .addClass( 'customview-details' )
        .append([
            $( '<div>' ).addClass( 'customview-label' )
            .text( 'Product Code' ),
            fCode.element,
            $( '<div>' ).addClass( 'customview-label' )
            .text( 'Product Family' ),
            fFamily.element,
            $( '<div>' ).addClass( 'customview-label' )
            .text( 'Description' ),
            fDesc.element
        ])
        .appendTo( content );

    // clear fix for floated elements
    $( '<div>' ).css( 'clear', 'both' ).appendTo( content );
}
});
skuid.snippet.register('test',function(args) {var params = arguments[0],
	$ = skuid.$;

                    var modelA = skuid.model.getModel('ContactEvent');
                    var row =modelA.getFirstRow();
                   return row.Event_Code__c;
});
skuid.snippet.register('Hyperlink_Hidden',function(args) {var field = arguments[0],
value = arguments[1],
$ = skuid.$;	
    
//If we are in edit mode render the reference field as pick list    
    if(field.mode === 'edit') 
    {
// temporarily set to REFPICK so we get the stock reference picklist functionality
        field.options.type = 'REFPICK';
// render away 
        skuid.ui.fieldRenderers[field.metadata.displaytype][field.mode](field, value);
// set it back to custom
        field.options.type = 'CUSTOM';
    }

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
(function(skuid){
	var $ = skuid.$;
	$(document.body).one('pageload',function(){
		
		var menuItems = $('.cc-main-nav .sk-navigation-item.top-level'),
		    counter = 0;
		    
        // we need to run a check to look for our dom elements
        // once we find them, we remove the timer and run our function
		var checkDomTimer = setInterval(function(){
		    if(menuItems.length > 1) {
		        setSelectedNavItem();
		        clearInterval(checkDomTimer);
		    } else {
		        if(counter == 10) {
		            clearInterval(checkDomTimer);
		        }
		    }
		    counter++;
		}, 100);
		
		
		// **IMPORTANT**
		// This logic relies on icons that are set for each navigation item
		// and are hidden with css. If the icons change or are removed, this
		// WILL BREAK. 
		
		var financialsNavItem   = $('.cc-main-nav .sk-navigation-item.top-level:has(.fa-money)'),
		    formsNavItem        = $('.cc-main-nav .sk-navigation-item.top-level:has(.fa-files-o)'),
		    manualsNavItem      = $('.cc-main-nav .sk-navigation-item.top-level:has(.fa-file-text-o)'),
		    profileNavItem      = $('.cc-main-nav .sk-navigation-item.top-level:has(.fa-file-archive-o)'),
		    uploadNavItem       = $('.cc-main-nav .sk-navigation-item.top-level:has(.fa-cloud-upload)'),
		    catalogNavItem      = $('.cc-main-nav .sk-navigation-item.top-level:has(.fa-barcode)'),
		    badgesNavItem       = $('.cc-main-nav .sk-navigation-item.top-level:has(.fa-ticket)');
		    
		
		function setSelectedNavItem() {
    		switch(skuid.page.name) {
    		    // HOME
    		    case "CustomerPortalHomePage":
    		        break;
    		    
    		    // FINANCIALS & BILLING
    		    case "AccountAndBilling":
    		        // set selected menu item
    		        financialsNavItem.addClass('cc-selected-item');
    		        break;
    		    
    		    // ORDER FORMS   
    		    case "CustomerFormList":
    		        // set selected menu item
    		        formsNavItem.addClass('cc-selected-item');
    		        break;
    		    
    		    // MANUALS
                case "CustomerManualList":
                    // set selected menu item
    		        manualsNavItem.addClass('cc-selected-item');
    		        break;
    		    
    		    // BOOTH PROFILE
                case "CustomerProfile":
    		        // set selected menu item
    		        profileNavItem.addClass('cc-selected-item');
    		        break;
    		    
    		    // DOCUMENT UPLOAD  
    		    case "CustomerUploadCenter":
    		        // set selected menu item
    		        uploadNavItem.addClass('cc-selected-item');
    		        break;
    		        
    		    // SPONSORSHIP GALLERY
    		    case "DisplayProductsOnCommunity":
    		        // set selected menu item
    		        catalogNavItem.addClass('cc-selected-item');
    		        break;
    		        
                // EXHIBITOR REGISTRATION
    		    case "CustomerBadges":
    		        // set selected menu item
    		        badgesNavItem.addClass('cc-selected-item');
    		        break;    	
    		}
    		clearInterval(checkDomTimer);
		}
		
	});
})(skuid);;
(function(skuid){
 var $ = skuid.$;
 $(document.body).one('pageload',function(){
    var modelA = skuid.model.getModel('EventSetting');
    var rowUser = modelA.getFirstRow();
    var uNBC = rowUser.Branding_Color__c;
    var uNTC = rowUser.Utility_Navigation_text_Color__c;
    var mNBC = rowUser.Main_Nav_Background_Color__c;
    var mNTC = rowUser.Main_Nav_Text_Color__c;
    var fBC = rowUser.Footer_background_color__c;
    var fTC = rowUser.Footer_text_color__c;
    var bBC = rowUser.Button_colors__c;  //Button Background color (label)
    var bTC = rowUser.Button_Text_Color__c;
    console.log('uNTC:   '+bTC);
    // var colorCode = arguments[0].item.row.Branding_Color__c;
    // window.alert('-----'+colorCode);
    
    // skuid.$C('Header').element.css('background-color',colorCode);
    // skuid.$C('NavigationBorder').element.css('border-color',colorCode);
    //.sk-navigation-item-label, .sk-navigation-item-iconlabel
        $('.cc-header-wrapper').css('background-color',uNBC);
        $('.cc-utility-nav  .sk-navigation-item-label').css('color',uNTC);
        $(' .cc-utility-nav .sk-navigation-item-iconlabel').css('color',uNTC);
        $('.cc-utility-nav .fa-shopping-cart ').css('color',uNTC);
        $('.cc-utility-nav .fa-angle-double-down ').css('color',uNTC);
        $('.sk-navigation-item .sk-navigation-item').css('background-color',uNBC);
        $('#main-nav').css('border-color',uNBC);
        $('.cc-navBack').css('background-color',mNBC);
        $('.cc-navText .sk-navigation-item-label').css('color',mNTC);
        $('.cc-navText .sk-navigation-item-iconlabel').css('color',mNTC); 
        $('.cc-footer').css('background-color',fBC);
        $('.cc-footer .nx-template').css('color',fTC);
        $('.cc-footer .nx-template .nx-fieldtext').css('color',fTC);
        $('.cc-footer .fa').css('color',fTC);
        $('.cc-footer .sk-wrapper').css('border-color',fTC);
        

        var buttons = $('.cc-custom-button-style, .branding-btn, .ui-button, .ui-button-text, .ui-button-icon-primary , .ui-widget-content .ui-button.ui-state-default');
        buttons.css('background-color',bBC).css('color',bTC);
        
        var buttonStyle = "" + 
            "\n\n .cc-custom-button-style, div.cc-custom-button-style:hover, " + 
            ".ui-button,.branding-btn, .ui-widget-content .ui-button.ui-state-default, .ui-widget-content .ui-button.ui-state-default.ui-state-hover, .ui-widget-content .ui-button.ui-state-default.ui-state-focus, .ui-button.ui-state-focus, .ui-button.nx-button-secondary, .ui-widget-content .ui-button.nx-button-secondary.ui-state-default, .ui-button.ui-state-active, .ui-widget-content .ui-button.ui-state-default.ui-state-active, .ui-button.ui-state-hover, .ui-widget-content .ui-button.ui-state-default.ui-state-hover, .ui-button.ui-state-focus, .ui-widget-content .ui-button.ui-state-default.ui-state-focus, .ui-button.nx-button-secondary.ui-state-active, .ui-widget-content .ui-button.nx-button-secondary.ui-state-default.ui-state-active, .ui-button.nx-button-secondary.ui-state-hover, ui-widget-content .ui-button.nx-button-secondary.ui-state-default.ui-state-hover, .ui-button.nx-button-secondary.ui-state-focus, .ui-widget-content .ui-button.nx-button-secondary.ui-state-default.ui-state-focus" 
            + "{ " + 
            "background-color: " + bBC + ";" + 
            "border-color: " + bBC + ";" + 
            "color:" + bTC + ";" + 
            "}";
        $('style').append(buttonStyle);
            
        
        
    });
})(skuid);;
(function(skuid){
	var $ = skuid.$;
	$(document.body).one('pageload',function(){
		
		var mainNav = $('.cc-main-nav.sk-navigation-horizontal'),
		    tempWidth;
		$(window).scroll(function(){
		    //console.warn('scroll top',$(window).scrollTop());
		    
		    if($(window).scrollTop() > 184) {
		        // grab the curre
		        tempWidth = mainNav.width();
		        // console.log(mainNav, tempWidth);
		        // if we're past our scroll point, fix the menu to the top
		        mainNav.addClass('fixed-top-center').css('width',tempWidth + "px");
		        
		    } else {
		        // otherwise let leave it alone
		        mainNav.removeClass('fixed-top-center').css('width','');
		    }
		});
		
	});
})(skuid);;
(function (skuid) {
    var $ = skuid.$,
        hidePaginationAtRecords = 20,
        models = {};
    $(document.body).one('pageload', function () {
        setInterval(function () {
            var components = skuid.component.getByType('skootable');
            for (var i = 0; i < components.length; i++) {
                var component = components[i],
                    model = (component.list !== undefined) ? component.list.model : false;
                if (model) {
                    if (!models.hasOwnProperty(model.id)) {
                        models[model.id] = {
                            model: model,
                            recordCount: -1
                        };
                    }
                    if (model.data.length != models[model.id].recordCount) {
                        var currentViewCount = component.list.currentPageSize,
                            show = Boolean(Math.min(hidePaginationAtRecords, currentViewCount) < model.data.length || model.canRetrieveMoreRows);
                        console.log(show);
                        if(show) component.element.removeClass('cc-no-footer');
                        else component.element.addClass('cc-no-footer');
                    }
                }
            }
            for (var modelId in models) {
                if (models.hasOwnProperty(modelId)) {
                    models[modelId].recordCount = models[modelId].model.data.length;
                }
            }
        }, 1000);
    });
})(skuid);;
(function(skuid){
	var $ = skuid.$;
	$(document.body).one('pageload',function(){
    $("#sk-2JQ-LW-4").css("direction", "rtl");
	});
})(skuid);;
/*(function(skuid){
	var $ = skuid.$;
	$(document.body).one('pageload',function(){
    	var modelA = skuid.model.getModel('EventDetail');
        var rowE = modelA.getFirstRow();
        var eId= rowE.Id;
        
		var modelCU = skuid.model.getModel('CurrentUser');
        var rowCU = modelCU.getFirstRow();
        var accId = rowCU.Contact.AccountId;
        var contId= rowCU.ContactId;
        
        var modelCT = skuid.model.getModel('ContactTypeUI');
        
        var result = sforce.apex.execute('captureOpportunityContactType','captureOpportunityContactType', { eId:eId, accId: accId, contId:contId});
        var conList = JSON.parse(result);
        
    	if(conList)
        {
            $.each(conList, function( index,value) {
            var contactList = modelCT.createRow({ 
                    additionalConditions: [
                        { field: 'ContactId', value: value.ContactId},
                        { field: 'Name', value: value.name},
                        { field: 'Type', value: value.type },
                    ],doAppend: true});
                    
            } );
            
            modelCT.save();
        }
        modelCT.save();
        
	});
})(skuid);*/;
skuid.snippet.register('captureOpportunityContactType',function(args) {var params = arguments[0],
	$ = skuid.$;
    var modelA = skuid.model.getModel('EventDetail');
        var rowE = modelA.getFirstRow();
        var eId= rowE.Id;
        
		var modelCU = skuid.model.getModel('CurrentUser');
        var rowCU = modelCU.getFirstRow();
        var accId = rowCU.Contact.AccountId;
        var contId= rowCU.ContactId;
        
        var modelCT = skuid.model.getModel('ContactTypeUI');
        
        var result = sforce.apex.execute('captureOpportunityContactType','captureOpportunityContactType', { eId:eId, accId: accId, contId:contId});
        var conList = JSON.parse(result);
       
    	if(conList)
        {
            $.each(conList, function( index,value) {
            var contactList = modelCT.createRow({ 
                    additionalConditions: [
                        { field: 'ContactId', value: value.ContactId},
                        { field: 'Name', value: value.name},
                        { field: 'Type', value: value.type },
                    ],doAppend: true});
                    
            } );
            
            modelCT.save();
        }
        modelCT.save();
});
(function(skuid){
	var $ = skuid.$;
	$(document.body).one('pageload',function(){
	    
	 /* $("#sk-2NVolG-303").mouseover(function(event) {
          event.removeEventListener();
          // Run any other needed code here
        });*/
        
	});
})(skuid);;
(function(skuid){
	var $ = skuid.$;
	$(document.body).one('pageload',function(){
		var currentUserModel = skuid.model.getModel('EventDetail');
        var CurrentUser = currentUserModel.getFirstRow();
        var startDate= CurrentUser.Start_Date__c;
        var endDate= CurrentUser.End_Date__c;
        
	});
})(skuid);;
skuid.snippet.register('FormRedirect',function(args) {/* Snippet will redirect to Forms tab*/
var params = arguments[0],
	$ = skuid.$;
var modelA = skuid.model.getModel('EventDetail');
        var rowE = modelA.getFirstRow();
        var eId= rowE.Event_Code__c;
        //window.parent.open('/CustomerCenter/apex/forms?eventcode='+eId);
        window.location.href ='/CustomerCenter/forms?eventcode='+eId;
});
skuid.snippet.register('ManualsRedirect',function(args) {/* Snippet will redirect to Manuals tab*/
var params = arguments[0],
	$ = skuid.$;
var modelA = skuid.model.getModel('EventDetail');
        var rowE = modelA.getFirstRow();
        var eId= rowE.Event_Code__c;
        window.location.href ='/CustomerCenter/manuals?eventcode='+eId;
});
skuid.snippet.register('BoothProfileRedirect',function(args) {/* Snippet will redirect to Customer Profile tab*/
var params = arguments[0],
	$ = skuid.$;
var modelA = skuid.model.getModel('EventDetail');
        var rowE = modelA.getFirstRow();
        var eId= rowE.Event_Code__c;
        window.location.href ='/CustomerCenter/CustomerProfile?eventcode='+eId;
});
skuid.snippet.register('UploadCenterRedirect',function(args) {/* Snippet will redirect to Upload Center tab*/
var params = arguments[0],
	$ = skuid.$;
var modelA = skuid.model.getModel('EventDetail');
        var rowE = modelA.getFirstRow();
        var eId= rowE.Event_Code__c;
        window.location.href ='/CustomerCenter/upload_center?eventcode='+eId;
});
skuid.snippet.register('SubContractorRedirect',function(args) {/* Snippet will redirect to Sub Contractor tab*/
var params = arguments[0],
	$ = skuid.$;
var modelA = skuid.model.getModel('EventDetail');
        var rowE = modelA.getFirstRow();
        var eId= rowE.Event_Code__c;
        window.location.href ='/CustomerCenter/subContractor?eventcode='+eId;
});
skuid.snippet.register('MyExhibitorRedirect',function(args) {/* Snippet will redirect to Myexhibitor tab*/
var params = arguments[0],
	$ = skuid.$;
var modelA = skuid.model.getModel('EventDetail');
        var rowE = modelA.getFirstRow();
        var eId= rowE.Event_Code__c;
        window.location.href ='/CustomerCenter/MyExhibitors?eventcode='+eId;
});
skuid.snippet.register('StandContractorRedirect',function(args) {/* Snippet will redirect to Stand Contractor tab*/
var params = arguments[0],
	$ = skuid.$;
var modelA = skuid.model.getModel('EventDetail');
        var rowE = modelA.getFirstRow();
        var eId= rowE.Event_Code__c;
        window.location.href ='/CustomerCenter/StandContractor?eventcode='+eId;
});
skuid.snippet.register('AgentOwnExhibitorRedirect',function(args) {/* Snippet will redirect to Agen Own Exhibitor tab*/
var params = arguments[0],
	$ = skuid.$;
var modelA = skuid.model.getModel('EventDetail');
        var rowE = modelA.getFirstRow();
        var eId= rowE.Event_Code__c;
        window.location.href ='/CustomerCenter/AgentOwnExhibitors?eventcode='+eId;
});
skuid.snippet.register('FinancialsRedirect',function(args) {/* Snippet will redirect to Financials tab*/
var params = arguments[0],
	$ = skuid.$;
var modelA = skuid.model.getModel('EventDetail');
        var rowE = modelA.getFirstRow();
        var eId= rowE.Event_Code__c;
        window.location.href ='/CustomerCenter/AccountAndBilling?eventcode='+eId;
});
skuid.snippet.register('ProductsRedirect',function(args) {/* Snippet will redirect to Products tab*/
var params = arguments[0],
	$ = skuid.$;
var modelA = skuid.model.getModel('EventDetail');
        var rowE = modelA.getFirstRow();
        var eId= rowE.Event_Code__c;
        window.location.href ='/CustomerCenter/products?eventcode='+eId;
});
skuid.snippet.register('BadgeRedirect',function(args) {/* Snippet will redirect to Badges tab*/
var params = arguments[0],
	$ = skuid.$;
var modelA = skuid.model.getModel('EventDetail');
        var rowE = modelA.getFirstRow();
        var eId= rowE.Event_Code__c;
        window.location.href ='/CustomerCenter/badges?eventcode='+eId;
});
skuid.snippet.register('CustomPageRedirect',function(args) {/* Snippet will redirect to CustomPage_1 tab*/

var params = arguments[0],
	$ = skuid.$;
var modelA = skuid.model.getModel('EventDetail');
        var rowE = modelA.getFirstRow();
        var eId= rowE.Event_Code__c;
        window.location.href ='/CustomerCenter/CustomPage_1?eventcode='+eId;
});
skuid.snippet.register('GERedirect',function(args) {/* Snippet will redirect to SSO Freeman tab*/
var params = arguments[0],
	$ = skuid.$;
var modelA = skuid.model.getModel('EventDetail');
        var rowE = modelA.getFirstRow();
        var eId= rowE.Event_Code__c;
        window.location.href ='/CustomerCenter/SSO_Freeman?eventcode='+eId;
});
skuid.snippet.register('AccountContactRedirect',function(args) {/* Snippet will redirect to Account Contacts tab*/

var params = arguments[0],
	$ = skuid.$;
	var dfd = jQuery.Deferred();
    var modelA = skuid.model.getModel('EventDetail');
        var rowE = modelA.getFirstRow();
        var eId= rowE.Event_Code__c;
    var modelB = skuid.model.getModel('ContactTypeUI');
        var rowC = modelB.getFirstRow();
        var conId= rowC.ContactId;
        var type= rowC.Type;
        window.location.href ='/CustomerCenter/AccountContactList?eventcode='+eId+'&conId='+conId+'&type='+type;
        dfd.resolve();
});
skuid.snippet.register('LogoutRedirect',function(args) {/* Snippet will redirect to logout screen*/
var params = arguments[0],
	$ = skuid.$;
var modelA = skuid.model.getModel('EventDetail');
        var rowE = modelA.getFirstRow();
        var eId= rowE.Event_Code__c;
        console.log('Event Code'+eId);
       // window.location.href ='/secur/logout.jsp?retUrl=/CustomerCenter/UserLogin?eventcode='+eId; 
        var url =window.location.host;
        window.location.href ='/secur/logout.jsp?retUrl=https://'+url+'/CustomerCenter/UserLogin?eventcode='+eId;
});
skuid.snippet.register('LogoRedirect',function(args) {/* Snippet will redirect to Home page*/
var params = arguments[0],
	$ = skuid.$;
var modelA = skuid.model.getModel('EventDetail');
        var rowE = modelA.getFirstRow();
        var eId= rowE.Event_Code__c;
        window.location.href ='/CustomerCenter/home?eventcode='+eId;
});
skuid.snippet.register('CartRedirect',function(args) {var params = arguments[0],
	$ = skuid.$;
var modelA = skuid.model.getModel('EventDetail');
        var rowE = modelA.getFirstRow();
        var eId= rowE.Event_Code__c;
        window.location.href ='/CustomerCenter/Cart?eventcode='+eId;
});
skuid.snippet.register('EventPicklistRedirect',function(args) {var params = arguments[0],
	$ = skuid.$;
var modelA = skuid.model.getModel('EventDetail');
        var rowE = modelA.getFirstRow();
        var eId= rowE.OtherEventsPL;
        window.location.href ='/CustomerCenter/home?eventcode='+eId;
});
skuid.snippet.register('GorillaRedirect',function(args) {/* Snippet will redirect to SSO Freeman tab*/
var params = arguments[0],
	$ = skuid.$;
	var modelE = skuid.model.getModel('EventDetail');
	    var rowEe = modelE.getFirstRow();
        var eventCode= rowEe.Event_Code__c;
    var modelA = skuid.model.getModel('CurrentUser');
        var rowE = modelA.getFirstRow();
        var eId= rowE.Account.SSO_ID__c;
        //window.location.href ='http://digital.informacre.com/mybooth?ecode='+eId+'&eventCode='+eventCode,'_blank' ;
        window.open('http://digital.informacre.com/mybooth?ecode='+eId+'&eventCode='+eventCode,'_blank');
});
(function(skuid){
	var $ = skuid.$;
	$(document.body).one('pageload',function(){
    	var eveModel = skuid.model.getModel('EventDetail');
        var eveModelRow = eveModel.getFirstRow();
        var userModel = skuid.model.getModel('CurrentUser');
        var userModelRow = userModel.getFirstRow();
        console.log('====Eve :'+eveModelRow.Event_Code__c);
        console.log('====Acc :'+userModelRow.Contact.AccountId);
        var result1 = sforce.apex.execute('CheckStandContractorTabPermissionCC','checkPermission',{sEventcode:eveModelRow.Event_Code__c, accId:userModelRow.Contact.AccountId});
        console.log('=====Res'+result1);
        var modelB = skuid.model.getModel('CheckStandBoothType');
        if(result1 == 'success'){
            var standList = modelB.createRow({ 
                        additionalConditions: [
                            { field: 'HasBoothType', value: true}
                        ],doAppend: true});
            modelB.save();
	    }

	});
})(skuid);;
skuid.snippet.register('boothType',function(args) {var eveModel = skuid.model.getModel('EventDetail');
    var eveModelRow = eveModel.getFirstRow();
    var userModel = skuid.model.getModel('CurrentUser');
    var userModelRow = userModel.getFirstRow();
    console.log('====Eve :'+eveModelRow.Event_Code__c);
    console.log('====Acc :'+userModelRow.Contact.AccountId);
    var result1 = sforce.apex.execute('CheckStandContractorTabPermissionCC','checkPermission',{sEventcode:eveModelRow.Event_Code__c, accId:userModelRow.Contact.AccountId});
    var conList = JSON.parse(result1);
    console.log(conList);
    alert('result1'+result1);
    console.log('=====Res'+result1);
});
/* Capture the browser version and alert the user who are using unsupported version */
/*(function(skuid){
	var $ = skuid.$;
	$(document.body).one('pageload',function(){
		navigator.sayswho= (function(){
            var ua= navigator.userAgent, tem, 
            M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
            if(/trident/i.test(M[1])){
                tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
                return 'IE '+(tem[1] || '');
            }
            if(M[1]=== 'Chrome'){
                tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
                if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
            }
            M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
            if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
            return M.join(' ');
        })();
        
        var browser = (navigator.sayswho).substr(0,(navigator.sayswho).indexOf(' '));
        var version = (navigator.sayswho).substr((navigator.sayswho).indexOf(' ')+1);
        if  (browser == 'Chrome' && parseInt(version)<70)
        {
            alert ('Please use updated version of Chrome 72 or above');
        }
	});
})(skuid);*/;
skuid.snippet.register('CustomPage2Redirect',function(args) {/* Snippet will redirect to CustomPage_2 tab*/

var params = arguments[0],
	$ = skuid.$;
var modelA = skuid.model.getModel('EventDetail');
        var rowE = modelA.getFirstRow();
        var eId= rowE.Event_Code__c;
        window.location.href ='/CustomerCenter/CustomPage_2?eventcode='+eId;
});
skuid.snippet.register('CustomPage3Redirect',function(args) {/* Snippet will redirect to CustomPage_3 tab*/

var params = arguments[0],
	$ = skuid.$;
var modelA = skuid.model.getModel('EventDetail');
        var rowE = modelA.getFirstRow();
        var eId= rowE.Event_Code__c;
        window.location.href ='/CustomerCenter/CustomPage_3?eventcode='+eId;
});
skuid.snippet.register('BoothInfo',function(args) {/*
    Capturing booth information as per event edition as User ( shows as picklist on the badges registartion tab on customer center)
*/
var params = arguments[0], 
$ = skuid.$;
var currentUserModel = skuid.model.getModel('CurrentUser');
var CurrentUser = currentUserModel.getFirstRow();
var accountId= CurrentUser.AccountId;
var userName = CurrentUser.Name;
var eventDetailModel = skuid.model.getModel('EventDetail');
var eventDetail = eventDetailModel.getFirstRow();
var eventId= eventDetail.Id;
var result = sforce.apex.execute('oppAccountDetails','oppAccountDetails', {accountId:accountId, eventId:eventId});
var accDetails = JSON.parse(result);
var boothArr=[];
console.log('boothDetails: '+accDetails.boothDetails);
if(accDetails.boothDetails!==null)
{
    $.each(accDetails.boothDetails, function( index,value) {
        //boothArr.push({value:value.boothId,label:userName +" -AA "+ value.boothName +" ("+value.boothArea +")"});
        boothArr.push({value:value.boothId,label:value.displayName +" "+ value.boothName +" ("+value.boothArea +")"});
        //boothArr.push({value:value.boothId,label:userName +" - "+ value.boothName +" ("+value.boothArea +" "+value.unitType+")"});
        console.log('booth: '+value.boothName +' ('+value.boothArea +' '+value.unitType);
    });
    console.log('boothArr: '+boothArr);
}    
return boothArr;
});
skuid.snippet.register('SaveBoothId',function(args) {/*
    Snippet check for badges limitation
*/
var params = arguments[0],
	$ = skuid.$;
    var ExhibitorBadgeNewModel = skuid.model.getModel('ExhibitorBadgeNew');
    var ExhibitorBadgeNewModel11 = ExhibitorBadgeNewModel.getFirstRow();
    var boothInforid = ExhibitorBadgeNewModel11.Booth_Size__c;
    ExhibitorBadgeNewModel.updateRow(ExhibitorBadgeNewModel11, {
        ExpocadBooth__c: boothInforid
    });
    var eventDetailModel = skuid.model.getModel('EventDetail');
    var eventDetail = eventDetailModel.getFirstRow();
    var eventId= eventDetail.Id;
	var result = sforce.apex.execute('checkAllowBadges','isCheckAllow', {eventId:eventId, boothInforid:boothInforid});
    console.log(result[0]);
    if(result[0]=="false")
    {   
        alert("Badges Limit reached...OR No Badges Limit defined..");
        return false;
    }
});
skuid.snippet.register('BoothInfo2',function(args) {/*
    Capturing booth information as per event edition as User ( shows as picklist on the badges registartion tab on customer center)
*/
var params = arguments[0], 
	$ = skuid.$;
	var currentUserModel = skuid.model.getModel('CurrentUser');
    var CurrentUser = currentUserModel.getFirstRow();
    var accountId= CurrentUser.AccountId;
	var userName = CurrentUser.Name;
	console.log('accountId'+accountId);
	var eventDetailModel = skuid.model.getModel('EventDetail');
    var eventDetail = eventDetailModel.getFirstRow();
    var eventId= eventDetail.Id;
	var result = sforce.apex.execute('oppAccountDetails','oppAccountDetails', {accountId:accountId, eventId:eventId});
	var accDetails = JSON.parse(result);
    var boothArr=[];
    if(accDetails.boothDetails!==null)
    {
        $.each(accDetails.boothDetails, function( index,value) {
            boothArr.push({value:value.boothArea,label:userName +" - "+ value.boothName +" ("+value.boothArea +" "+value.unitType+".)"});
    		//boothArr.push({value:value.boothId,label:value.boothName +"("+value.boothArea +" "+value.unitType+")"});
    		 
        });
    }
    return boothArr;
});
skuid.snippet.register('displayBadgesLimitAddNew',function(args) {/*
    Snippet check for badges limitation and display data in HTML format in template
*/
var params = arguments[0],
	$ = skuid.$;
	
    var ExhibitorBadgeNewModel = skuid.model.getModel('ExhibitorBadgeNew');
    var ExhibitorBadgeNewModel11 = ExhibitorBadgeNewModel.getFirstRow();
    var boothInforid = ExhibitorBadgeNewModel11.Booth_Size__c;
    ExhibitorBadgeNewModel.updateRow(ExhibitorBadgeNewModel11, {
        ExpocadBooth__c: boothInforid
    });
    
    var eventDetailModel = skuid.model.getModel('EventDetail');
    var eventDetail = eventDetailModel.getFirstRow();
    var eventId= eventDetail.Id;
	var result = sforce.apex.execute('checkAllowBadges','detailBadges', {eventId:eventId, boothInforid:boothInforid});
    console.log('====res '+result[0]);
    $('#sk-3K_rFu-391').html(result[0]);
});
skuid.snippet.register('fieldRenderer2',function(args) {/*
    Field render snippet to check for badges limitation
*/
var field = arguments[0], 
    value = arguments[1], 
    model = field.model, 
    row = field.row, 
$ = skuid.$; 
field.element.change(function(){ 
   
   skuid.snippet.getSnippet('displayBadgesLimitAddNew')();
}); 
skuid.ui.fieldRenderers[field.metadata.displaytype][field.mode](field, value);
});
/*
    Page load snippet that will check for branding color
*/

/*(function(skuid){
 var $ = skuid.$;
 $(document.body).one('pageload',function(){
    var modelA = skuid.model.getModel('EventSetting');
    var rowUser = modelA.getFirstRow();
    var colorCode = rowUser.Branding_Color__c;
    var borderColor = '2px solid ' + colorCode;
    skuid.$('.ui-button .ui-button-text').css('background-color',colorCode);
    skuid.$('.ui-button-text').css('background-color',colorCode);
    skuid.$('.ui-button, .ui-widget-content .ui-button.ui-state-default').css('border',borderColor);
    });
})(skuid);*/;
skuid.snippet.register('ExportBadge',function(args) {/*
    ** Snippet to export data for badges records
*/
var params = arguments[0],
	$ = skuid.$;

var model = skuid.model.getModel('ExhibitorBadge');
model.exportData({
    fileName: 'Badge' + '.csv',
     doNotAppendRowIdColumn: true,
    fields: 
    [
        model.getField('ExpocadBooth__r.Booth_Number__c'),
        model.getField('Account_Name__c'), 
        model.getField('Exhibitor_Name__c'),
        model.getField('First_Name__c'),
        model.getField('Last_Name__c'),
        model.getField('Email__c'),
        model.getField('Job_Title__c'),
        model.getField('Status__c'),
        model.getField('Country__c'),
        model.getField('State__c'),
        model.getField('City__c'),
        model.getField('Address__c'),
        model.getField('Nationality__c'),
        model.getField('Age_Bracket__c'),
        model.getField('Country_Code__c'),
        model.getField('Mobile_Number__c')
    ]
});
});
skuid.snippet.register('dataCharacterLimit',function(args) {/*
    ** The snippet is used to filter the character limits for badge ( JIRA # CCEN 112)
*/

var params = arguments[0],
$ = skuid.$;
contextRow = params.item ? params.item.row : params.row,
contextModel = params.model,
$ = skuid.$;
   
    var pageTitle = $('#sk-13GAPb-972'); // Page Title to diaply the error message
    var editor = pageTitle.data('object').editor; 
    
    var model = skuid.model.getModel('BadgeSetting');
    var fNameCharLimit= model.getFirstRow().Badge_FName_Character_Limit__c;
    var lNameCharLimit= model.getFirstRow().Badge_LName_Character_Limit__c;
    var jobTitleCharLimit= model.getFirstRow().Badge_JobTitle_Character_Limit__c;
    var emailCharLimit= model.getFirstRow().Badge_Email_Character_Limit__c;
    var mobileCharLimit= model.getFirstRow().Badge_Mobile_Character_Limit__c;
    var addressCharLimit= model.getFirstRow().Badge_Address_Character_Limit__c;
    var cityCharLimit= model.getFirstRow().Badge_City_Character_Limit__c;
    var companyNameLimit = model.getFirstRow().Company_Name_on_Badge_Character_Limit__c;
    
    var fName= contextModel.getFieldValue(contextRow, 'First_Name__c', true);
    if (fName){
        var fNameLength = fName.length;
    }
    var lName=contextModel.getFieldValue(contextRow, 'Last_Name__c', true);
    if (lName){
        var lNameLength = lName.length;
    }
    var jobTitle = contextModel.getFieldValue(contextRow, 'Job_Title__c', true);
    if (jobTitle){
        var jObTitleLength = jobTitle.length;
    }
    var email=contextModel.getFieldValue(contextRow, 'Email__c', true);
    if (email){
        var emailLength = email.length;
    }
    var mobile=contextModel.getFieldValue(contextRow, 'Mobile_Number__c', true);
    if (mobile){
        var mobileLength = mobile.length;
    }
    var address = contextModel.getFieldValue(contextRow, 'Address__c', true);
    if (address){
        var addressLength = address.length;
    }
    var city= contextModel.getFieldValue(contextRow, 'City__c', true);
    if (city){
        var cityLength = city.length;
    }
    var compName = contextModel.getFieldValue(contextRow, 'Exhibitor_Name__c', true);
    if(compName){
        var cNameLength = compName.length;
    }
    if(fNameLength)
    {
        if (fNameLength>fNameCharLimit){
            editor.handleMessages(
                [{
                    message: 'You have reached the character limit of ' +fNameCharLimit + '  for First Name',
                    severity: 'ERROR'
                }]
            );
        return false;
        }
    }
    
    if(lNameLength)
    {
        if (lNameLength>lNameCharLimit){
            editor.handleMessages(
                [{
                    message: 'You have reached the character limit of ' +lNameCharLimit + '  for Last Name',
                    severity: 'ERROR'
                }]
            );
        return false;
        }
    }
    
    if(jObTitleLength)
    {
        if (jObTitleLength>jobTitleCharLimit){
            editor.handleMessages(
                [{
                    message: 'You have reached the character limit of ' +jobTitleCharLimit + '  for Job Title',
                    severity: 'ERROR'
                }]
            );
        return false;
        }
    }
    
    if(emailLength)
    {
    if (emailLength>emailCharLimit){
            editor.handleMessages(
                [{
                    message: 'You have reached the character limit of ' +emailCharLimit + '  Email',
                    severity: 'ERROR'
                }]
            );
        return false;
        }
    }
    
    if(mobileLength)
    {
        if (mobileLength>mobileCharLimit){
            editor.handleMessages(
                [{
                    message: 'You have reached the character limit of ' +mobileCharLimit + '  mobile',
                    severity: 'ERROR'
                }]
            );
        return false;
        }
    }
    
    if(addressLength)
    {
        if (addressLength>addressCharLimit){
            editor.handleMessages(
                [{
                    message: 'You have reached the character limit of ' +addressCharLimit + ' address',
                    severity: 'ERROR'
                }]
            );
        return false;
        }
    }
    
    if(cityLength)
    {
        if (cityLength>cityCharLimit){
            editor.handleMessages(
                [{
                    message: 'You have reached the character limit of ' +cityCharLimit + ' city',
                    severity: 'ERROR'
                }]
            );
        return false;
        }
    }
    if(cNameLength)
    {
        if (cNameLength>companyNameLimit){
            editor.handleMessages(
                [{
                    message: 'You have reached the character limit of ' +companyNameLimit + ' for Company Name on Badge',
                    severity: 'ERROR'
                }]
            );
        return false;
        }
    }
     
   /* var displayMessage = function (message, severity) {
        var pageTitle = $('#sk-13GAPb-972');
        var editor = pageTitle.data('object').editor;
        editor.handleMessages([
            {
                message: message,
                severity: severity
            }
        ]);
        
    };*/
});
skuid.snippet.register('blankBadgeForm',function(args) {/*
    Snippet check for badges limitation
*/
});
skuid.snippet.register('fieldRenderUpperCase',function(args) {/*
    Field render Snippet to chane to the upper case
*/
/*var field = arguments[0],
    value = arguments[1],
    $ = skuid.$,
    dt = field.metadata.displaytype;
if (field.mode != 'edit') {
    skuid.ui.fieldRenderers[dt][field.mode](field,value);
} else {
    skuid.ui.fieldRenderers[dt].edit(field,value); 
}
var upperCase = function(){
    value = (field.model.getFieldValue(field.row,'First_Name__c',true) || 0);
        
    value = value.toUpperCase();
    field.model.updateRow(
        field.row,
        'First_Name__c',
        value
    );
    if (field.mode == 'edit') {
        field.element.find('input').val(value);
    }
};
upperCase();
var listener = new skuid.ui.Field(field.row,field.model,null,{fieldId: 'First_Name__c'});
listener.change = function(){
    upperCase();
};
field.model.registerField(listener,'First_Name__c');*/
});
skuid.snippet.register('converToUpperCase',function(args) {/*
    ** the snippet is used to convert to uperCase ( JIRA # CCEN 150)
*/
var params = arguments[0],
$ = skuid.$;
contextRow = params.item ? params.item.row : params.row,
contextModel = params.model,
$ = skuid.$;
   
    var model = skuid.model.getModel('BadgeSetting');
    var firstUppercase= model.getFirstRow().Badge_FName_To_UpperCase__c;
    var lastUppercase= model.getFirstRow().Badge_LName_To_UpperCase__c;
    var CompNameUppercase= model.getFirstRow().Company_Name_on_Badge_ToUpperCase__c;
    // condition to check if firstName setting is set to upper case
    if(firstUppercase===true)
    {
        var firstName = contextModel.getFieldValue(contextRow, 'First_Name__c', true);
        if (firstName)
        {
            var resFirst = firstName.toUpperCase();
            console.log(resFirst);
            contextModel.updateRow(contextRow, {First_Name__c: resFirst});
        }
    }
    // condition to check if lastName setting is set to upper case
    if(lastUppercase===true)
    {
        var lastName = contextModel.getFieldValue(contextRow, 'Last_Name__c', true);
        if (lastName)
        {
            var reslast = lastName.toUpperCase();
            console.log(reslast);
            contextModel.updateRow(contextRow, {Last_Name__c: reslast});
        }
    }
    // condition to check if company name on badge setting is set to upper case
    if(CompNameUppercase===true)
    {
        var cName = contextModel.getFieldValue(contextRow, 'Exhibitor_Name__c', true);
        if (cName)
        {
            var rescName = cName.toUpperCase();
            console.log(rescName);
            contextModel.updateRow(contextRow, {Exhibitor_Name__c: rescName});
        }
    }
});
skuid.snippet.register('dataCharacterLimitForNewBadge',function(args) {/*
    ** The snippet is used to filter the character limits for badges.  ( JIRA # CCEN 112)
    ** The snippet will also validate the required field if user missed to populate the value.
*/

var params = arguments[0],
$ = skuid.$;
    var ExhibitorBadgeNewModel = skuid.model.getModel('ExhibitorBadgeNew');
    var newRow= ExhibitorBadgeNewModel.getFirstRow();
    //console.log("amish"+ ExhibitorBadgeNewModel.getFirstRow().First_Name__c);
   
    var pageTitle = $('#sk-1DW2UR-1182'); // Page Title to diaply the error message
    //var pageTitle = $('#sk-1SPh2E-4110');
    var editor = pageTitle.data('object').editor; 
    
    var model = skuid.model.getModel('BadgeSetting');
    var fNameCharLimit= model.getFirstRow().Badge_FName_Character_Limit__c;
    var lNameCharLimit= model.getFirstRow().Badge_LName_Character_Limit__c;
    var jobTitleCharLimit= model.getFirstRow().Badge_JobTitle_Character_Limit__c;
    var emailCharLimit= model.getFirstRow().Badge_Email_Character_Limit__c;
    var mobileCharLimit= model.getFirstRow().Badge_Mobile_Character_Limit__c;
    var addressCharLimit= model.getFirstRow().Badge_Address_Character_Limit__c;
    var cityCharLimit= model.getFirstRow().Badge_City_Character_Limit__c;
    var companyNameLimit = model.getFirstRow().Company_Name_on_Badge_Character_Limit__c;
    
    var badgeCNameCheckBox= model.getFirstRow().Company_Name_on_Badge__c;
    var badgeFNameCheckBox= model.getFirstRow().Badge_First_Name__c;
    var BadgeLNameCheckBox= model.getFirstRow().Badge_Last_Name__c;
    var badgeJTitleCheckBox= model.getFirstRow().Badge_Job_Title__c;
    var badgeEmailCheckBox= model.getFirstRow().Badge_Email__c;
    var badgeMobileCheckBox= model.getFirstRow().Badge_Mobile_Number__c;
    var badgeAgeBracketCheckBox= model.getFirstRow().Badge_Age_Bracket__c;
    var badgeAddressCheckBox= model.getFirstRow().Badge_Address__c;
    var badgeCityCheckBox= model.getFirstRow().Badge_City__c;
    var badgeStateCheckBox= model.getFirstRow().Badge_State__c;
    var badgeCountryCheckBox= model.getFirstRow().Badge_Country__c;
    var badgeNationalityCheckBox= model.getFirstRow().Badge_Nationality__c;

    
    if(newRow.First_Name__c){
        var fNameLength =(newRow.First_Name__c).length;
    }
    if(newRow.Last_Name__c){
        var lNameLength =(newRow.Last_Name__c).length; 
    }
    if(newRow.Job_Title__c){
        var jObTitleLength =(newRow.Job_Title__c).length; 
    }
    if(newRow.Email__c){
        var emailLength =(newRow.Email__c).length; 
    }
    if(newRow.Mobile_Number__c){
        var mobileLength =(newRow.Mobile_Number__c).length; 
    }
    if(newRow.Address__c){
        var addressLength =(newRow.Address__c).length; 
    }
    if(newRow.City__c){
        var cityLength =(newRow.City__c).length; 
    }
    if(newRow.Exhibitor_Name__c){
        var cNameLength = (newRow.Exhibitor_Name__c).length;
    }
    
    // Condition for checking undefined
    
    if (badgeCNameCheckBox===true)
    {
        if(cNameLength)
        {
            if (cNameLength>companyNameLimit){
                editor.handleMessages(
                    [{
                        message: 'You have reached the character limit of ' +companyNameLimit + ' for Company Name on Badge',
                        severity: 'ERROR'
                    }]
                );
            return false;
            }
        }
        else
        {
            editor.handleMessages(
                    [{
                        message: 'Required Field Missing :Company Name',
                        severity: 'ERROR'
                    }]
                );
            return false;
        }
    }
    
    if (badgeFNameCheckBox===true)
    {
        if(fNameLength)
        {
            if (fNameLength>fNameCharLimit){
                editor.handleMessages(
                    [{
                        message: 'You have reached the character limit of  ' +fNameCharLimit + '  for First Name',
                        severity: 'ERROR'
                    }]
                );
            return false;
            }
        }
        else
        {
            editor.handleMessages(
                    [{
                        message: 'Required Field Missing :First Name',
                        severity: 'ERROR'
                    }]
                );
            return false;
        }
    }
    
    if (BadgeLNameCheckBox===true)
    {
        if(lNameLength)
        {
            if (lNameLength>lNameCharLimit){
                editor.handleMessages(
                    [{
                        message: 'You have reached the character limit of  ' +lNameCharLimit + '  for Last Name',
                        severity: 'ERROR'
                    }]
                );
            return false;
            }
        }
        else
        {
            editor.handleMessages(
                    [{
                        message: 'Required Field Missing :Last Name',
                        severity: 'ERROR'
                    }]
                );
            return false;
        }
    }
    
    if (badgeJTitleCheckBox===true)
    {
        if(jObTitleLength)
        {
            if (jObTitleLength>jobTitleCharLimit){
                editor.handleMessages(
                    [{
                        message: 'You have reached the character limit of ' +jobTitleCharLimit + '  for Job Title',
                        severity: 'ERROR'
                    }]
                );
            return false;
            }
        }
        else
        {
            editor.handleMessages(
                    [{
                        message: 'Required Field Missing :Job Title',
                        severity: 'ERROR'
                    }]
                );
            return false;
        }
    }
    
    
    if (badgeNationalityCheckBox===true)
    {
         if(newRow.Nationality__c=='None') // && model.getFirstRow().Badge_Nationality__c){
        {
          editor.handleMessages(
                [{
                    message: 'Please Select Nationality',
                    severity: 'ERROR'
                }]
            );
        return false;
        }
        
    }
    
    if (badgeCountryCheckBox===true)
    {
        if(newRow.Country__c=='None')
        {
            editor.handleMessages(
                [{
                    message: 'Please Select Country',
                    severity: 'ERROR'
                }]
            );
            return false;
        }
        
    }
    
    if (badgeStateCheckBox===true)
    {
        if(!(newRow.State__c))
        {
            editor.handleMessages(
                [{
                    message: 'Required Field Missing :State',
                    severity: 'ERROR'
                }]
            );
        return false;
        }
    }
    
    if (badgeCityCheckBox===true)
    {
        if(cityLength)
        {
            if (cityLength>cityCharLimit){
                editor.handleMessages(
                    [{
                        message: 'You have reached the character limit of ' +cityCharLimit + ' city',
                        severity: 'ERROR'
                    }]
                );
            return false;
            }
        }
        else
        {
            editor.handleMessages(
                    [{
                        message: 'Required Field Missing :City',
                        severity: 'ERROR'
                    }]
                );
            return false;
        }
    }
    
    if (badgeAddressCheckBox===true)
    {
        if(addressLength)
        {
            if (addressLength>addressCharLimit){
                editor.handleMessages(
                    [{
                        message: 'You have reached the character limit of ' +addressCharLimit + ' address',
                        severity: 'ERROR'
                    }]
                );
            return false;
            }
        }
        else
        {
            editor.handleMessages(
                    [{
                        message: 'Required Field Missing :Address',
                        severity: 'ERROR'
                    }]
                );
            return false;
        }
    }
    
    if (badgeMobileCheckBox===true)
    {
        if(mobileLength)
        {
            if (mobileLength>mobileCharLimit){
                editor.handleMessages(
                    [{
                        message: 'You have reached the character limit of ' +mobileCharLimit + '  mobile',
                        severity: 'ERROR'
                    }]
                );
            return false;
            }
        }
        else
        {
            editor.handleMessages(
                    [{
                        message: 'Required Field Missing :Mobile',
                        severity: 'ERROR'
                    }]
                );
            return false;
        }
    }
    
    
    if (badgeEmailCheckBox===true)
    {
        if(emailLength)
        {
            if (emailLength>emailCharLimit){
                editor.handleMessages(
                    [{
                        message: 'You have reached the character limit of ' +emailCharLimit + '  Email',
                        severity: 'ERROR'
                    }]
                );
            return false;
            }
        }
        else
        {
            editor.handleMessages(
                    [{
                        message: 'Required Field Missing :Email Address',
                        severity: 'ERROR'
                    }]
                );
            return false;
        }
    }
    
    
    
    
    
    
    
   
    
     
   /* var displayMessage = function (message, severity) {
        var pageTitle = $('#sk-13GAPb-972');
        var editor = pageTitle.data('object').editor;
        editor.handleMessages([
            {
                message: message,
                severity: severity
            }
        ]);
        
    };*/
});
skuid.snippet.register('converToUpperCaseForNewBadge',function(args) {/*
    ** the snippet is used to convert to uperCase ( JIRA # CCEN 150)
*/
var params = arguments[0],
$ = skuid.$;
contextRow = params.item ? params.item.row : params.row,
contextModel = params.model,
$ = skuid.$;
   
    var model = skuid.model.getModel('BadgeSetting');
    var firstUppercase= model.getFirstRow().Badge_FName_To_UpperCase__c;
    var lastUppercase= model.getFirstRow().Badge_LName_To_UpperCase__c;
    var CompNameUppercase= model.getFirstRow().Company_Name_on_Badge_ToUpperCase__c;
    // condition to check if firstName setting is set to upper case
    if(firstUppercase===true)
    {
        var firstName = contextModel.getFieldValue(contextRow, 'First_Name__c', true);
        if (firstName)
        {
            var resFirst = firstName.toUpperCase();
            console.log(resFirst);
            contextModel.updateRow(contextRow, {First_Name__c: resFirst});
        }
    }
    // condition to check if lastname setting is set to upper case
    if(lastUppercase===true)
    {
        var lastName = contextModel.getFieldValue(contextRow, 'Last_Name__c', true);
        if (lastName)
        {
            var reslast = lastName.toUpperCase();
            console.log(reslast);
            contextModel.updateRow(contextRow, {Last_Name__c: reslast});
        }
    }
    // condition to check if company name on badge setting is set to upper case
    if(CompNameUppercase===true)
    {
        var cName = contextModel.getFieldValue(contextRow, 'Exhibitor_Name__c', true);
        if (cName)
        {
            var rescName = cName.toUpperCase();
            console.log(rescName);
            contextModel.updateRow(contextRow, {Exhibitor_Name__c: rescName});
        }
    }
});
skuid.snippet.register('testLoad',function(args) {var params = arguments[0],
	$ = skuid.$;
    $("#sk-1Zf73b-885").load();
});
(function(skuid){
	var $ = skuid.$;
	$(document.body).one('pageload',function(){
		$("#sk-1DW2UR-1182").addClass("nx-error");
	});
})(skuid);;
skuid.snippet.register('MobileNumberValidationForNewBadge',function(args) {var params = arguments[0],
	$ = skuid.$;
  contextRow = params.item ? params.item.row : params.row,
  contextModel = params.model,
  	$ = skuid.$;
	var model = skuid.model.getModel('ExhibitorBadgeNew');
    var mobileNum= model.getFirstRow().Mobile_Number__c;
    var pageTitle = $('#sk-1DW2UR-1182'); // Page Title to diaply the error message
    //var pageTitle = $('#sk-1SPh2E-4110');
    var editor = pageTitle.data('object').editor; 
   if(mobileNum){
    var fName = contextModel.getFieldValue(contextRow,'Mobile_Number__c', true);
     console.log("fName===="+fName);
     var phoneno = /^\d+$/;
           if(fName.match(phoneno)){
              return true; 
           }
	 else{
         editor.handleMessages(
           [{
              message: 'Please enter numbers only :Mobile Number',
              severity: 'ERROR'
            }]
                );
            return false;
       }
 }
});
skuid.snippet.register('MobileNumberValidation',function(args) {var params = arguments[0],
	$ = skuid.$;
  contextRow = params.item ? params.item.row : params.row,
  contextModel = params.model,
  	$ = skuid.$;
	var model = skuid.model.getModel('ExhibitorBadge');
   // var mobileNum= model.getFirstRow().Mobile_Number__c;
    var mobileNum = contextModel.getFieldValue(contextRow,'Mobile_Number__c', true);
    var pageTitle = $('#sk-13GAPb-972'); // Page Title to diaply the error message
    //var pageTitle = $('#sk-1SPh2E-4110');
    var editor = pageTitle.data('object').editor; 
    console.log("mobileNum==="+mobileNum);
   if(mobileNum){
   //  console.log("fName===="+fName);
     var phoneno = /^\d+$/;
           if(mobileNum.match(phoneno)){
              return true; 
           }
	  else{
         editor.handleMessages(
           [{
              message: 'Please enter numbers only :Mobile Number',
              severity: 'ERROR'
            }]
                );
            return false;
       }
   }
  else{
         editor.handleMessages(
           [{
              message: 'Required Field Missing :Mobile Number',
              severity: 'ERROR'
            }]
                );
            return false;
       }
});
skuid.snippet.register('updateBadgeStatus',function(args) {var params = arguments[0],
	$ = skuid.$;
var modelE = skuid.model.getModel('EventSetting');
    var rowE = modelE.getFirstRow();
    var eventEditionId= rowE.Event_Edition__c;
    console.log('==EVeID '+eventEditionId);
    if(eventEditionId != null){
        var result = sforce.apex.execute('UpdateStatusOfBadge','UpdateStatusOfBadge', {eventEditionId:eventEditionId},function(result){
            //console.log(result);
        });
    }
});
skuid.snippet.register('ClosePopUp',function(args) {var params = arguments[0],
	$ = skuid.$;
	setTimeout(myFunction, 1000);
	function myFunction() {
        skuid.$('.ui-dialog-content').dialog('close');
    }
});
}(window.skuid));