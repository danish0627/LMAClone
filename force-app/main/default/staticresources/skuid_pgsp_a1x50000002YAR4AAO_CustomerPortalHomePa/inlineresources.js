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
skuid.snippet.register('newSnippet',function(args) {var params = OpsTeam_EventView.eventED;
document.getElementById('id').innerHTML = params.Name.toString();
alert(' Name: ' + params.Name);
});
skuid.snippet.register('redirectToComponent',function(args) {/*var params = arguments[0],
	$ = skuid.$;
        var com = skuid.model.getModel('Component');
        for ( var i = 0; i<com.data.length;i++)
        {
            
            if (com.data[i].Name =="Exhibitor Badges")
            {
                console.log(com.data[i].Name);
                window.location="/apex/c__ExhibitorRedirectToSkuid";
            }
        }*/
});
skuid.snippet.register('updateUserManualActionMaster',function(args) {/*var params = arguments[0],
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
skuid.snippet.register('RowActionSnippetMaster',function(args) {/*var ROW_ACTION_ICON = 'sk-icon-account-transfer';
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
}*/
});
/*(function(skuid){
    
	var $ = skuid.$;
	$(document.body).one('pageload',function(){
		var currentUserModel = skuid.model.getModel('CurrentUser');
        var CurrentUser = currentUserModel.getFirstRow();
        var accountId= CurrentUser.AccountId;
		
		var EventSetModel = skuid.model.getModel('EventSet');
        var EventSet = EventSetModel.getFirstRow();
    	
    	var eventDetailModel = skuid.model.getModel('EventDetails');
        var eventDetail = eventDetailModel.getFirstRow();
        var eventId= eventDetail.Id;
    	var result = sforce.apex.execute('oppAccountDetails','oppAccountDetails', {accountId:accountId, eventId:eventId});
    	var accDetails = JSON.parse(result);
    	console.log('----result:'+result);
        console.log('----ACC2:'+accDetails.lstAmount);
		
		if(accDetails.boothDetails!==null)
        {   
            $.each(accDetails.boothDetails, function( index, value ) {
                //values = values +'<tr><td>'+value.boothName+'</td>';  
                //values = values +'<td>'+value.boothArea+' '+value.unitType+'</td></tr>';
                //console.log( index + " boothName : " + value.boothName +" boothArea :" +value.boothArea);
                //values = values +'</br>';
                
                var modelA = skuid.model.getModel('ExpoBoothDisplay');
                var a= modelA.createRow({ 
                        additionalConditions: [
                            { field: 'BoothNumber', value: value.boothName},
                            { field: 'Area', value: value.boothArea},
                            { field: 'BoothId', value: value.boothId},
                            { field: 'UnitType', value: value.unitType},
                            { field: 'OpptyId', value: value.oppty},
                        ],doAppend: true});
                        
                modelA.save();
                
            });
        }
		
		
	});
	
})(skuid);*/;
skuid.snippet.register('RowSnippet',function(args) {/*var ROW_ACTION_ICON = 'sk-16PFHn-552';
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
}*/
});
(function(skuid){
var $ = skuid.$;
$(document.body).one('pageload',function(){
skuid.$('.cc-exhibitor-flexbox-child:empty').remove();
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
        var modelUIT = skuid.model.getModel('ExpcadValueTrue');
        var modelUIF = skuid.model.getModel('ExpcadValueFalse');
        
        //var modelCT = skuid.model.getModel('ContactTypeUI');
        var result = sforce.apex.execute('captureOpportunityContactType','captureBoothId', { eId:eId, accId: accId});
        console.log('result123'+result);
        
        if(result=='T')
        {
            
            var T = modelUIT.createRow({ 
                    additionalConditions: [
                        { field: 'Value', value: result},
                    ],doAppend: true});
                    
            
            modelUIT.save();
        }
       
       if(result=='F')
        {
            
            var F = modelUIF.createRow({ 
                    additionalConditions: [
                        { field: 'Value', value: result},
                    ],doAppend: true});
                    
            
            modelUIF.save();
        }
        
        
        
        
	});
})(skuid);*/


/*var bopthIdList = JSON.parse(result);
        var boothIdArray =[];
        if(bopthIdList)
        {
            $.each(bopthIdList, function( index,value) {
             boothIdArray.push(value.booothId);
                    
            } );
        }

        var modelB = skuid.$M('Expocad');
            modelB.setCondition(modelB.getConditionByName('Id'),boothIdArray);
            modelB.updateData();*/;
(function(skuid){
	var $ = skuid.$;
	$(document.body).one('pageload',function(){
		$(document).ready(function(){
            $(".cc-exhibitor-flexbox-child").hover(function(){
              $(this).css("background-color", "#ededed");
            }, 
            
            function(){
                $(this).css("background-color","white");
            });
        });
     
        
	});
})(skuid);;
skuid.snippet.register('ManualRed',function(args) {/* Snippet will redirect to Manuals tab*/
var params = arguments[0],
	$ = skuid.$;
var modelA = skuid.model.getModel('EventDetail');
        var rowE = modelA.getFirstRow();
        var eId= rowE.Event_Code__c;
        window.location.href ='/apex/manuals?eventcode='+eId;
});
skuid.snippet.register('FinancialsRed',function(args) {/* Snippet will redirect to Financials tab*/
var params = arguments[0],
	$ = skuid.$;
var modelA = skuid.model.getModel('EventDetail');
        var rowE = modelA.getFirstRow();
        var eId= rowE.Event_Code__c;
        window.location.href ='/apex/AccountAndBilling?eventcode='+eId;
});
skuid.snippet.register('FormRed',function(args) {/* Snippet will redirect to Forms tab*/
var params = arguments[0],
	$ = skuid.$;
var modelA = skuid.model.getModel('EventDetail');
        var rowE = modelA.getFirstRow();
        var eId= rowE.Event_Code__c;
        //window.parent.open('/apex/forms?eventcode='+eId);
        window.location.href ='/apex/forms?eventcode='+eId;
});
skuid.snippet.register('MyExhibitorRedi',function(args) {/* Snippet will redirect to Myexhibitor tab*/
var params = arguments[0],
	$ = skuid.$;
var modelA = skuid.model.getModel('EventDetail');
        var rowE = modelA.getFirstRow();
        var eId= rowE.Event_Code__c;
        window.location.href ='/apex/MyExhibitors?eventcode='+eId;
});
skuid.snippet.register('UploadCenterRed',function(args) {/* Snippet will redirect to Upload Center tab*/
var params = arguments[0],
	$ = skuid.$;
var modelA = skuid.model.getModel('EventDetail');
        var rowE = modelA.getFirstRow();
        var eId= rowE.Event_Code__c;
        window.location.href ='/apex/upload_center?eventcode='+eId;
});
skuid.snippet.register('ProductsRed',function(args) {/* Snippet will redirect to Products tab*/
var params = arguments[0],
	$ = skuid.$;
var modelA = skuid.model.getModel('EventDetail');
        var rowE = modelA.getFirstRow();
        var eId= rowE.Event_Code__c;
        window.location.href ='/apex/products?eventcode='+eId;
});
skuid.snippet.register('BadgeRed',function(args) {/* Snippet will redirect to Badges tab*/
var params = arguments[0],
	$ = skuid.$;
var modelA = skuid.model.getModel('EventDetail');
        var rowE = modelA.getFirstRow();
        var eId= rowE.Event_Code__c;
        window.location.href ='/apex/badges?eventcode='+eId;
});
skuid.snippet.register('StandContractorRed',function(args) {/* Snippet will redirect to Stand Contractor tab*/
var params = arguments[0],
	$ = skuid.$;
var modelA = skuid.model.getModel('EventDetail');
        var rowE = modelA.getFirstRow();
        var eId= rowE.Event_Code__c;
        window.location.href ='/apex/StandContractor?eventcode='+eId;
});
skuid.snippet.register('MyExhibitorRed',function(args) {/* Snippet will redirect to Myexhibitor tab*/
var params = arguments[0],
	$ = skuid.$;
var modelA = skuid.model.getModel('EventDetail');
        var rowE = modelA.getFirstRow();
        var eId= rowE.Event_Code__c;
        window.location.href ='/apex/MyExhibitors?eventcode='+eId;
});
skuid.snippet.register('SubContractorRed',function(args) {/* Snippet will redirect to Sub Contractor tab*/
var params = arguments[0],
	$ = skuid.$;
var modelA = skuid.model.getModel('EventDetail');
        var rowE = modelA.getFirstRow();
        var eId= rowE.Event_Code__c;
        window.location.href ='/apex/subContractor?eventcode='+eId;
});
skuid.snippet.register('AgentOwnExhibitorRed',function(args) {/* Snippet will redirect to Agen Own Exhibitor tab*/
var params = arguments[0],
	$ = skuid.$;
var modelA = skuid.model.getModel('EventDetail');
        var rowE = modelA.getFirstRow();
        var eId= rowE.Event_Code__c;
        window.location.href ='/apex/AgentOwnExhibitors?eventcode='+eId;
});
skuid.snippet.register('GERed',function(args) {/* Snippet will redirect to SSO Freeman tab*/
var params = arguments[0],
	$ = skuid.$;
var modelA = skuid.model.getModel('EventDetail');
        var rowE = modelA.getFirstRow();
        var eId= rowE.Event_Code__c;
        window.location.href ='/apex/SSO_Freeman?eventcode='+eId;
});
skuid.snippet.register('CustomPageRed',function(args) {/* Snippet will redirect to CustomPage_1 tab*/

var params = arguments[0],
	$ = skuid.$;
var modelA = skuid.model.getModel('EventDetail');
        var rowE = modelA.getFirstRow();
        var eId= rowE.Event_Code__c;
        window.location.href ='/apex/CustomPage_1?eventcode='+eId;
});
skuid.snippet.register('GorillaRrd',function(args) {/* Snippet will redirect to SSO Freeman tab*/
var params = arguments[0],
	$ = skuid.$;
	
	
    var modelE = skuid.model.getModel('EventDetails');
            var rowEE = modelE.getFirstRow();
            var eCode= rowEE.Event_Code__c;
            
    var modelA = skuid.model.getModel('CurrentUser');
            var rowE = modelA.getFirstRow();
            var eId= rowE.Account.SSO_ID__c;
            window.location.href ='http://digital.informacre.com/mybooth?ecode='+eId+'&eventCode='+eCode;
});
}(window.skuid));