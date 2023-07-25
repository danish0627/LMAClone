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
/*(function(skuid){
	var $ = skuid.$;
	$.noConflict();
	$(document.body).one('pageload',function(){
		jQuery(document).ready(function(){
    // This button will increment the value
    var a;
    var modelA = skuid.model.getModel('Product');
    var row= modelA.getFirstRow();
    $('.qtyplus').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        fieldName = $(this).attr('field');
        // Get its current value
        //var modelA = skuid.model.getModel('ContactEvent');
        var currentVal = parseInt($('input[name='+fieldName+']').val());
        // If is not undefined
        if (!isNaN(currentVal)) {
            // Increment
            $('input[name='+fieldName+']').val(currentVal + 1);
            
           
        } else {
            // Otherwise put a 0 there
             $('input[name='+fieldName+']').val(0);
            
            
        }
        a=currentVal+1;
        console.log(a);
      
        
    });
    // This button will decrement the value till 0
   $(".qtyminus").click(function(e) {
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        fieldName = $(this).attr('field');
        // Get its current value
        
        var currentVal = parseInt($('input[name='+fieldName+']').val());
        // If it isn't undefined or its greater than 0
        var row = modelA.getFirstRow;
        
        if (!isNaN(currentVal) && currentVal > 0) {
            // Decrement one
            $('input[name='+fieldName+']').val(currentVal - 1);
            
           
        } else {
            // Otherwise put a 0 there
            $('input[name='+fieldName+']').val(0);
            
            
        }
        a=currentVal-1;
        if(a==-1)
        {
            a=0;
        }
    
       
        
    });
});
	});
})(skuid);*/;
skuid.snippet.register('TESTpopulatePriceAndRelatedProduct',function(args) {/*var params = arguments[0],
	$ = skuid.$;

var modelP= skuid.model.getModel('Product');
var row= modelP.getFirstRow();
var ProductId= row.Id;
console.log(ProductId);
   
    //Getting the Pricebook Object Name
    var modelE = skuid.model.getModel('Pricebook');
    var rowE = modelE.getFirstRow();
    var PricebookObjName= rowE.Name;
    PricebookObjName=PricebookObjName.split(' ').join('_');
    PricebookObjName+='__c';
    
    console.log('PricebookObjName: '+PricebookObjName);
    
     
    //Getting Event ID
    var modelA = skuid.model.getModel('EventDetail');
    var rowA = modelA.getFirstRow();
    var eventId= rowA.Id;
    console.log('eventId: '+eventId);
    console.log('eventName: '+rowA.Name);
    var result = sforce.apex.execute('GetProductPriceOnCustomerPortal','getProductPriceOnCustomerPortal', {ProductId:ProductId, PricebookObjName:PricebookObjName, eventId:eventId},function(result){
        console.log('Result: '+result);
        var parsedResult = JSON.parse(result);
        var parsedLen = parsedResult.length;
        for(var i=0;i<parsedLen;++i)
        { 
            var modelProduct = skuid.model.getModel('Product');
            var modelOption = skuid.model.getModel('RelatedProducts');
            if(parsedResult[i].PrimaryProduct===true){
                console.log('Primary: '+parsedResult[i].Price);
                modelProduct.updateRow(
                    { Id: parsedResult[i].ProductID },
                    { Price:parsedResult[i].Price }
                );
                modelProduct.save();
            }   
            else{
                console.log('Option: '+parsedResult[i].Price);
                var productList = modelOption.createRow({ 
                    additionalConditions: [
                        { field: 'ProductID', value: parsedResult[i].ProductID},
                        { field: 'ProductName', value: parsedResult[i].ProductName},
                        { field: 'Price', value: parsedResult[i].Price},
                        { field: 'Type', value: parsedResult[i].Type},
                        { field: 'Feature', value: parsedResult[i].Feature},
                        { field: 'Quantity', value: parsedResult[i].Quantity},
                        { field: 'ProductFamily', value: parsedResult[i].ProductFamily},
                    ],doAppend: true});
               
                modelOption.save();
               
            } 
            
            
        }
        
     });*/
});
skuid.snippet.register('newSnippet',function(args) {var params = arguments[0],
	$ = skuid.$;
$( "div" ).remove( ".nx-field" );
});
skuid.snippet.register('productsAddToCart',function(args) {//Amish Ranjit
    /*$ = skuid.$;
    //Getting the Product Id & Name
    var modelP = skuid.model.getModel('Product');
    var rowP = modelP.getFirstRow();
    var ProductId= rowP.Id;
    var ProductName= rowP.Name;
    
    console.log('ProductId: '+ProductId);
    console.log('ProductName: '+ProductName);
    
    //Getting the User Id & Name
    var modelU = skuid.model.getModel('CurrentUser');
    var rowU = modelU.getFirstRow();
    var UserId= rowU.Id;
    var UserName= rowU.Name;
    var ContactId= rowU.ContactId;
    var ContactName= rowU.Contact.Name;
    
    console.log('UserId: '+UserId);
    console.log('UserName: '+UserName);
    console.log('ContactId: '+ContactId);
    console.log('ContactName: '+ContactName);
    
    var modelAddToCart = skuid.model.getModel('NewCustomerCenterCart');
    var AddToCartList = modelAddToCart.createRow({ 
                    additionalConditions: [
                        { field: 'User', value: UserId},
                        { field: 'Contact', value: ContactId},
                        { field: 'Product', value: ProductId},
                    ],doAppend: true});
                    
    console.log('AddToCartList: '+AddToCartList);
               // modelOption.save();
               
      */
});
skuid.snippet.register('populatePrice',function(args) {/* Comment By Amish
  var params = arguments[0],
    contextRow = params.item ? params.item.row : params.row,
    contextModel = params.model,
    $ = skuid.$;
    
    // Getting context row of the Product 
    var CustomerCenterId = contextModel.getFieldValue(contextRow, 'Id', true);
   
    var ProductId = contextModel.getFieldValue(contextRow, 'Product__c', true);
    var contextContent = contextRow.Product__r.Name;
  	console.log('Context ProductId: '+ProductId);
    console.log('Context Product: '+contextContent);
   
   
    //Getting the Pricebook Object Name
    var modelE = skuid.model.getModel('Pricebook');
    var rowE = modelE.getFirstRow();
    var PricebookObjName= rowE.Name;
    PricebookObjName=PricebookObjName.split(' ').join('_');
    PricebookObjName+='__c';
    
    console.log('PricebookObjName: '+PricebookObjName);
    
     
    //Getting Event ID
    var modelA = skuid.model.getModel('EventDetail');
    var rowA = modelA.getFirstRow();
    var eventId= rowA.Id;
    console.log('eventName: '+rowA.Name);
    
    var result = sforce.apex.execute('GetProductPriceOnCustomerPortal','getProductPriceOnCustomerPortal', {ProductId:ProductId, PricebookObjName:PricebookObjName, eventId:eventId, Quantity:'1'},function(result){
        //console.log('Result: '+result);
        var parsedResult = JSON.parse(result);
        var parsedLen = parsedResult.length;
        var modelForRelatedProductPrice = skuid.model.getModel('CustomerCenterCart');
        var TotalPriceofRelatedProducts = 0;
        for(var i=0;i<parsedLen;++i)
        { 
            var modelProduct = skuid.model.getModel('CustomerCenterCart');
            var modelOption = skuid.model.getModel('RelatedProducts');
            if(parsedResult[i].PrimaryProduct===true){
                console.log('Primary: '+parsedResult[i].Price);
                modelProduct.updateRow(
                    { Id: CustomerCenterId },
                    { Price:parsedResult[i].Price } 
                   
                );
                modelProduct.save();
            }   
            else{
               console.log('Option: '+parsedResult[i].ProductName);
               console.log('Option: '+parsedResult[i].Price);
               TotalPriceofRelatedProducts = TotalPriceofRelatedProducts + Number(parsedResult[i].Price);
               
                var productList = modelOption.createRow({ 
                    additionalConditions: [
                        { field: 'ProductID', value: parsedResult[i].ProductID},
                        { field: 'ProductName', value: parsedResult[i].ProductName},
                        { field: 'Price', value: parsedResult[i].Price},
                        { field: 'Type', value: parsedResult[i].Type},
                        { field: 'Feature', value: parsedResult[i].Feature},
                        { field: 'Quantity', value: parsedResult[i].Quantity},
                        { field: 'ProductFamily', value: parsedResult[i].ProductFamily},
                    ],doAppend: true});
               modelOption.save();
               
            } 
            
            
        }
         modelForRelatedProductPrice.updateRow(
                    { Id: CustomerCenterId },
                    { PriceRelatedProducts:TotalPriceofRelatedProducts } 
                   
                );
                modelForRelatedProductPrice.save();
     });
  
    */
});
skuid.snippet.register('saveUpdatedPrice',function(args) {//Comment By amish
  /* var params = arguments[0],
    contextRow = params.item ? params.item.row : params.row,
    contextModel = params.model,
    $ = skuid.$;
    
    // Getting context row of the Product 
    var CustomerCenterId = contextModel.getFieldValue(contextRow, 'Id', true);
   
    var ProductId = contextModel.getFieldValue(contextRow, 'Product__c', true);
    var ProductPrice = contextModel.getFieldValue(contextRow, 'Price', true);
    var ProductQuantity = contextModel.getFieldValue(contextRow, 'Quantity__c', true);
    var PriceRelatedProducts = contextModel.getFieldValue(contextRow, 'PriceRelatedProducts', true);
    
    var contextContent = contextRow.Product__r.Name;
    //var updatedPrice = ProductPrice*ProductQuantity;
    //updatedPrice=updatedPrice+PriceRelatedProducts;
    console.log('Product: '+contextContent);
   	//console.log('Updated: '+updatedPrice);
    
    //Getting the Pricebook Object Name
    var modelE = skuid.model.getModel('Pricebook');
    var rowE = modelE.getFirstRow();
    var PricebookObjName= rowE.Name;
    PricebookObjName=PricebookObjName.split(' ').join('_');
    PricebookObjName+='__c';
    
    console.log('PricebookObjName: '+PricebookObjName);
    
      //Getting Event ID
    var modelA = skuid.model.getModel('EventDetail');
    var rowA = modelA.getFirstRow();
    var eventId= rowA.Id;
    console.log('eventId: '+eventId);
    console.log('eventName: '+rowA.Name);
    
    
      var result = sforce.apex.execute('GetProductPriceOnCustomerPortal','getProductPriceOnCustomerPortal', {ProductId:ProductId, PricebookObjName:PricebookObjName, eventId:eventId,Quantity:ProductQuantity},function(result){
        console.log('Result: '+result);
        var parsedResult = JSON.parse(result);
        var parsedLen = parsedResult.length;
        var updatedPrice;
        for(var i=0;i<parsedLen;++i)
        { 
            if(parsedResult[i].PrimaryProduct===true){
                updatedPrice = Number(parsedResult[i].Price);
                console.log('updatedPrice: '+parsedResult[i].Price);
                
            }   
        }
        updatedPrice = updatedPrice*ProductQuantity; // This must be removed later
    
        updatedPrice = updatedPrice + PriceRelatedProducts;
        console.log('updatedPrice1: '+updatedPrice);
                
            var modelProduct = skuid.model.getModel('CustomerCenterCart');
             modelProduct.updateRow(
                { Id: CustomerCenterId },
                { Price__c:updatedPrice } 
                );
            modelProduct.save();
                  
            var modelCC= skuid.model.getModel('CustomerCenterCart');
            var cartlength = modelCC.data.length;
            var modelCart = skuid.model.getModel('CartTotal');
            var totalCartPrice = 0;
            	
            	for(var j=0;j<cartlength;++j)
                {   
                        console.log('Price: '+modelCC.data[j].Price__c);
                        totalCartPrice = totalCartPrice+modelCC.data[j].Price__c;
                }
                console.log('totalCartPrice: '+totalCartPrice);
            
            modelCart.emptyData();   
            modelCart.save();
                  
            var CartTotal = modelCart.createRow({ 
                                additionalConditions: [
                                    { field: 'CartTotal', value: totalCartPrice }
                                    
                                    ],doAppend: true});
                               
                                modelCart.save();
        	var a = modelCart.getFirstRow();
        	var b = a.CartTotal;
        	console.log('CartTotal: '+b);   
        	
        		//update Total Price on Master Cart
	        var modelMC= skuid.model.getModel('MasterCart');
            var rowMC= modelMC.getFirstRow();
            modelMC.updateRow(rowMC, 'Total_Amount__c', totalCartPrice);
            modelMC.updateRow(rowMC, 'Final_Amount__c', totalCartPrice);
            modelMC.save();
          
         
      });
    
    */
});
/* 
    function to populate cart total
*/
(function(skuid){
	var $ = skuid.$;
	$.noConflict();	
	$(document.body).one('pageload',function(){
	
    	var modelCC= skuid.model.getModel('CustomerCenterCart');
    	var cartlength = modelCC.data.length;
    	var modelCart = skuid.model.getModel('CartTotal');
        var totalCartPrice1 = 0;
    	var totalCartPrice=0;
    	for(var i=0;i<cartlength;++i)
        {   
                console.log('Price1: '+modelCC.data[i].Price__c);
                if(modelCC.data[i].Price__c){
                    totalCartPrice1 = totalCartPrice1+modelCC.data[i].Price__c;
                   // hasDecimalPlace(totalCartPrice);
                  totalCartPrice= totalCartPrice1.toFixed(2);
                }
        }
        
        console.log('totalCartPrice: '+totalCartPrice);
        
        var CartTotal = modelCart.createRow({ 
                            additionalConditions: [
                                { field: 'CartTotal', value: totalCartPrice  }
                            
                            ],doAppend: true});
                       
                        modelCart.save();
	var a = modelCart.getFirstRow();
	var b = a.CartTotal;
	console.log('CartTotal: '+b);
	
	//update Total Price on Master Cart
	var modelMC= skuid.model.getModel('MasterCart');
	var rowMC= modelMC.getFirstRow();
     modelMC.updateRow(rowMC, 'Total_Amount__c', totalCartPrice);
     //modelMC.updateRow(rowMC, 'Final_Amount__c', totalCartPrice);
     modelMC.save();
	});
})(skuid);

window.oncontextmenu = function () {
   return false;
};;
skuid.snippet.register('populateCartTotalAfterDelete',function(args) {/*
    Snippet to update the cart after the product is removed from cart
*/
var params = arguments[0],
	$ = skuid.$;


    	var modelCC= skuid.model.getModel('CustomerCenterCart');
    	var cartlength = modelCC.data.length;
        var modelCart = skuid.model.getModel('CartTotal');
        var totalCartPrice = 0;
    	
    	for(var i=0;i<cartlength;++i)
        {   
                console.log('Price: '+modelCC.data[i].Price__c);
                totalCartPrice = totalCartPrice+modelCC.data[i].Price__c;
        }
        console.log('totalCartPrice: '+totalCartPrice);
   /*       
    modelCart.emptyData();   
    modelCart.save();
   */
   // updating cart total
    var CartTotal = modelCart.createRow({ 
                            additionalConditions: [
                                { field: 'CartTotal', value: totalCartPrice }
                            
                            ],doAppend: true});
                       
                        modelCart.save();
	var a = modelCart.getFirstRow();
	var b = a.CartTotal;
	console.log('CartTotal: '+b);
});
skuid.snippet.register('snippetToRestrictNegatives',function(args) {/*
    Preventing user from entering -ve quantity
*/
var params = arguments[0],
	$ = skuid.$;
	

var number = document.getElementById('sk-28_yQo-495');

// Listen for input event on numInput.
number.onkeydown = function(e) {
    if(!((e.keyCode > 95 && e.keyCode < 106)
      || (e.keyCode > 47 && e.keyCode < 58) 
      || e.keyCode == 8)) {
        return false;
    }
};

number.bind("cut copy paste",function(e) {
          e.preventDefault();
      });
      
      number.setAttribute('maxlength',9);
});
skuid.snippet.register('updateTotalCheckBox',function(args) {//Amish
/*
var params = arguments[0],
	$ = skuid.$;
    var modelMC= skuid.model.getModel('MasterCart');
	var row= modelMC.getFirstRow();

    if (row.Partial_Amount_CK__c===true)
    { modelMC.updateRow(row, 'Final_Amount_CK__c', false);modelMC.save();}
    else if (row.Partial_Amount_CK__c===false)
    { modelMC.updateRow(row, 'Final_Amount_CK__c', true);modelMC.save();}
      */
});
skuid.snippet.register('updatePartialCheckBox',function(args) {//Comment
/*
var params = arguments[0],
	$ = skuid.$;
        var modelMC= skuid.model.getModel('MasterCart');
    	var row= modelMC.getFirstRow();
        if (row.Final_Amount_CK__c===true)
        { modelMC.updateRow(row, 'Partial_Amount_CK__c', false);modelMC.save();}
        else if (row.Final_Amount_CK__c===false)
        { modelMC.updateRow(row, 'Partial_Amount_CK__c', true);modelMC.save();}
        
*/
});
/*(function(skuid){
	var $ = skuid.$;
	$(document.body).one('pageload',function()
	{
    	var eventDetailModel = skuid.model.getModel('EventDetail');
        var eventDetail = eventDetailModel.getFirstRow();
        var eventPaymentSchedule = eventDetail.Payment_Schedule__c;
        
        var nextPaymentDate;
        var NextPaymentSchedule;
        console.log(eventPaymentSchedule);
        //console.log(cutOffDate);
        
        var eventPaymentSchedule2 = eventPaymentSchedule.split('-');
        console.log('----'+eventPaymentSchedule2.length);
        var p1='';
        var p2='';
        var p3='';
        var p4='';
        if(eventPaymentSchedule2[0]){
            p1 =parseInt(eventPaymentSchedule2[0]);
        }
        if(eventPaymentSchedule2[1]){
            p2 =parseInt(eventPaymentSchedule2[1]);
        }
        if(eventPaymentSchedule2[2]){
            p3 =parseInt(eventPaymentSchedule2[2]);
        }
        if(eventPaymentSchedule2[3]){
            p4 =parseInt(eventPaymentSchedule2[3]);
        }
    	var modelCC= skuid.model.getModel('MasterCart');
    	var row= modelCC.getFirstRow();
    	var totalAmount= row.Total_Amount__c;
    	var partialAmount;
        var date='',date1='',date2='',date3='';
        var today = new Date(Date.now());
        console.log('today'+today);
        if (eventDetail.X50_Cutoff_Date__c)
        {
            date = skuid.time.parseSFDate(eventDetail.X50_Cutoff_Date__c);//new Date(eventDetail.X50_Cutoff_Date__c);
            //console.log(date);
        }
        if (eventDetail.Cutoff_Date_1__c)
        {
           date1 = skuid.time.parseSFDate(eventDetail.Cutoff_Date_1__c);//new Date(eventDetail.Cutoff_Date_1__c);
            //console.log(date1);
        }
        if (eventDetail.Cutoff_Date_2__c)
        {
            date2 = skuid.time.parseSFDate(eventDetail.Cutoff_Date_2__c);;//new Date(eventDetail.Cutoff_Date_2__c);
            //console.log(date2);
        }
        if (eventDetail.Cutoff_Date_3__c)
        {
            date3 = skuid.time.parseSFDate(eventDetail.Cutoff_Date_3__c);//new Date(eventDetail.Cutoff_Date_3__c);
            //console.log(date3);
        }
        console.log(Date.now());
        // comparing offset date with today's date
        if(date>today)
    	{
    	    partialAmount=(totalAmount*p1)/100;
    	    //console.log(partialAmount);
    	    if(date1)
    	    {
                nextPaymentDate=date1;
                NextPaymentSchedule= p2;
    	    }
    	    
    	} 
    	if(date<=today&&date1>today||date<=today&&!date1 )
    	{
    	    partialAmount=(totalAmount*(p1+p2))/100;
    	    if (date2)
    	    {
    	        
                nextPaymentDate=date2;
                NextPaymentSchedule=p3;
    	    }
    	    else
    	    {
    	        //partialAmount=(totalAmount*p1)/100;
    	        nextPaymentDate='';
    	        NextPaymentSchedule='';
    	    }
    	}
    	if(date1<=today&&date2>today ||date1<=today&&!date2 ) 
    	{
    	    partialAmount=(totalAmount*(p1+p2+p3))/100;
    	    if (date3)
    	    {
                nextPaymentDate=date3;
                NextPaymentSchedule=p4;
    	    }
    	    else
    	    {
    	        //partialAmount=(totalAmount*(p1+p2))/100;
    	        nextPaymentDate='';
                NextPaymentSchedule='';
    	    }
    	     
    	}
    	//console.log(date3);
    	if (date2)
    	{
    	    console.log(date2);
    	    console.log(today);
    	    console.log(date3);
            if(date2<=today&&date3>today ||date2<=today&&!date3) 
        	{
        	    partialAmount=(totalAmount*(p1+p2+p3+p4))/100;
        	    nextPaymentDate='';
                NextPaymentSchedule='';
    	        //nextPaymentDate=date4;
    	        //NextPaymentSchedule=p1+p2+p3+p4;
        	}
    	}
    	if(date3)
    	{
    	    console.log('date3'+date3);
        	if(date3<=today) 
        	{
        	     partialAmount=(totalAmount*(p1+p2+p3+p4))/100;
        	     nextPaymentDate='';
                NextPaymentSchedule='';
        	     //nextPaymentDate=date3;
        	     //NextPaymentSchedule=p1+p2+p3+p4;
        	}
    	}
    	console.log('partialAmount:  '+partialAmount);
        modelCC.updateRow(
        { Id: row.Id },
        {
            Partial_Amount__c:partialAmount,
            NextPaymentDate: nextPaymentDate,
            NextPaymentSchedule:NextPaymentSchedule,
            Payment1:p1,
            Payment2:p2,
            Payment3:p3,
            Payment4:p4,
            Date1:date,
            Date2:date1,
            Date3:date2,
            Date4:date3
            
        }
        );
        modelCC.save();
        console.log(modelCC.data[0].Partial_Amount__c);
        console.log('test on page load');
;	});
})(skuid);

*/
    	    /*var date11 = skuid.time.parseSFDate(eventDetail.Cutoff_Date_2__c);
    	    console.log('parseDatedate11'+date11);
    	    console.log('today'+new Date(Date.now()));*/
    	    
    	    /*var a = skuid.time.getSFDate(new Date(Date.now()));
    	    console.log('a'+a);
    	    var b = eventDetail.Cutoff_Date_2__c;
    	    console.log('b'+b);
    	    console.log('getLocalDateTime'+  skuid.time.parseSFDateTime(date2));
    	    console.log('date2:-   '+date2);
    	    console.log('Date.now:-   '+Date.now());*/
    	    
    	    



/*(function(skuid){
	var $ = skuid.$;
	$(document.body).one('pageload',function()
	{
    	var eventDetailModel = skuid.model.getModel('EventDetail');
        var eventDetail = eventDetailModel.getFirstRow();
        var eventPaymentSchedule = eventDetail.Payment_Schedule__c;
        
        var nextPaymentDate;
        var NextPaymentSchedule
        console.log(eventPaymentSchedule);
        //console.log(cutOffDate);
        var eventPaymentSchedule2 = eventPaymentSchedule.split('-');
        console.log('----'+eventPaymentSchedule2.length);
        var p1='';
        var p2='';
        var p3='';
        var p4='';
        if(eventPaymentSchedule2[0]){
            p1 =parseInt(eventPaymentSchedule2[0]);
        }
        if(eventPaymentSchedule2[1]){
            p2 =parseInt(eventPaymentSchedule2[1]);
        }
        if(eventPaymentSchedule2[2]){
            p3 =parseInt(eventPaymentSchedule2[2]);
        }
        if(eventPaymentSchedule2[3]){
            p4 =parseInt(eventPaymentSchedule2[3]);
        }
    	var modelCC= skuid.model.getModel('MasterCart');
    	var row= modelCC.getFirstRow();
    	var totalAmount= row.Total_Amount__c;
    	var partialAmount;
        var date='',date1='',date2='',date3='';
        if (eventDetail.X50_Cutoff_Date__c)
        {
            date = new Date(eventDetail.X50_Cutoff_Date__c);
            //console.log(date);
        }
        if (eventDetail.Cutoff_Date_1__c)
        {
           date1 = new Date(eventDetail.Cutoff_Date_1__c);
            //console.log(date1);
        }
        if (eventDetail.Cutoff_Date_2__c)
        {
            date2 = new Date(eventDetail.Cutoff_Date_2__c);
            //console.log(date2);
        }
        if (eventDetail.Cutoff_Date_3__c)
        {
            date3 = new Date(eventDetail.Cutoff_Date_3__c);
            //console.log(date3);
        }
        console.log(Date.now());
        // comparing offset date with today's date
        if(date>Date.now() )
    	{
    	    partialAmount=(totalAmount*p1)/100;
    	    //console.log(partialAmount);
            nextPaymentDate=date;
            NextPaymentSchedule= p1;
    	    
    	} 
    	if(date<=Date.now()&&date1>Date.now()||date<=Date.now()&&date1===undefined )
    	{
    	    partialAmount=(totalAmount*p1)/100;
            nextPaymentDate=date;
            NextPaymentSchedule=p1;
    	}
    	if(date1<=Date.now()&&date2>Date.now() ||date1<=Date.now()&&date2===undefined ) 
    	{
    	    partialAmount=(totalAmount*(p1+p2))/100;
            nextPaymentDate=date1;
            NextPaymentSchedule=p1+p2;
    	     
    	}
    	//console.log(date3);
    	if (date2)
    	{
    	    var date11 = skuid.time.parseSFDate(eventDetail.Cutoff_Date_2__c);
    	    console.log('parseDatedate11'+date11);
    	    console.log('today'+new Date(Date.now()));
    	    console.log(eventDetail.Cutoff_Date_2__c);
    	    console.log('getLocalDateTime'+  skuid.time.parseSFDateTime(date2));
    	    console.log('date2:-   '+date2);
    	    console.log('Date.now:-   '+Date.now());
            if(date2<=Date.now()&&date3>Date.now() ||date2<=Date.now()&&date3===undefined) 
        	{
        	    partialAmount=(totalAmount*(p1+p2+p3))/100;
    	        nextPaymentDate=date2;
    	        NextPaymentSchedule=p1+p2+p3;
        	}
    	}
    	if(date3)
    	{
    	    console.log('date3'+date3);
        	if(date3<=Date.now()) 
        	{
        	     partialAmount=(totalAmount*(p1+p2+p3+p4))/100;
        	     nextPaymentDate=date3;
        	     NextPaymentSchedule=p1+p2+p3+p4;
        	}
    	}
    	console.log('partialAmount'+partialAmount);
        modelCC.updateRow(
        { Id: row.Id },
        {
            Partial_Amount__c:partialAmount,
            NextPaymentDate: nextPaymentDate,
            NextPaymentSchedule:NextPaymentSchedule,
            Payment1:p1,
            Payment2:p2,
            Payment3:p3,
            Payment4:p4,
            Date1:date,
            Date2:date1,
            Date3:date2,
            Date4:date3
            
        }
        );
        modelCC.save();
        
	});
})(skuid);*/


// comment by amish
/*(function(skuid){
	var $ = skuid.$;
	$(document.body).one('pageload',function()
	{
    	var eventDetailModel = skuid.model.getModel('EventDetail');
        var eventDetail = eventDetailModel.getFirstRow();
        var eventPaymentSchedule = eventDetail.Payment_Schedule__c;
        
        var nextPaymentDate;
        var NextPaymentSchedule
        console.log(eventPaymentSchedule);
        //console.log(cutOffDate);
        var eventPaymentSchedule2 = eventPaymentSchedule.split('-');
        console.log('----'+eventPaymentSchedule2.length);
        var p1='';
        var p2='';
        var p3='';
        var p4='';
        if(eventPaymentSchedule2[0]){
            p1 =parseInt(eventPaymentSchedule2[0]);
        }
        if(eventPaymentSchedule2[1]){
            p2 =parseInt(eventPaymentSchedule2[1]);
        }
        if(eventPaymentSchedule2[2]){
            p3 =parseInt(eventPaymentSchedule2[2]);
        }
        if(eventPaymentSchedule2[3]){
            p4 =parseInt(eventPaymentSchedule2[3]);
        }
    	var modelCC= skuid.model.getModel('MasterCart');
    	var row= modelCC.getFirstRow();
    	var totalAmount= row.Total_Amount__c;
    	var partialAmount;
        var date='',date1='',date2='',date3='';
        if (eventDetail.X50_Cutoff_Date__c)
        {
        //date = new Date(cutOffDate);
            //date.toISOString().slice(0,10);
            //console.log(date);
            date = new Date(eventDetail.X50_Cutoff_Date__c);
            //console.log(date);
        }
        if (eventDetail.Cutoff_Date_1__c)
        {
           date1 = new Date(eventDetail.Cutoff_Date_1__c);
            //console.log(date1);
        }
        if (eventDetail.Cutoff_Date_2__c)
        {
            date2 = new Date(eventDetail.Cutoff_Date_2__c);
            //console.log(date2);
        }
        if (eventDetail.Cutoff_Date_3__c)
        {
            date3 = new Date(eventDetail.Cutoff_Date_3__c);
            //console.log(date3);
        }
        console.log(Date.now());
        // comparing offset date with today's date
        if(date>Date.now() )
    	{
    	    partialAmount=(totalAmount*p1)/100;
    	    //console.log(partialAmount);
            nextPaymentDate=date;
            NextPaymentSchedule= p1;
    	    
    	} 
    	if(date<=Date.now()&&date1>Date.now()||date<=Date.now()&&date1===undefined )
    	{
    	    partialAmount=(totalAmount*p1)/100;
            nextPaymentDate=date;
            NextPaymentSchedule=p1
    	}
    	if(date1<=Date.now()&&date2>Date.now() ||date1<=Date.now()&&date2===undefined ) 
    	{
    	    partialAmount=(totalAmount*(p1+p2))/100;
            nextPaymentDate=date1;
            NextPaymentSchedule=p1+p2;
    	     
    	}
    	//console.log(date3);
    	if (date2)
    	{
    	    console.log("test totalAmount");
    	    console.log('date2: '+date2);
    	    console.log('tpday:'+Date.now());
            if(date2<=Date.now()&&date3>Date.now() ||date2<=Date.now()&&date3===undefined) 
        	{
        	    console.log("test totalAmount");
        	    partialAmount=(totalAmount*(p1+p2+p3))/100;
    	        nextPaymentDate=date2;
    	        NextPaymentSchedule=p1+p2+p3;
        	}
    	}
    	if(date3)
    	{
    	    console.log('date3'+date3);
        	if(date3<=Date.now()) 
        	{
        	     partialAmount=(totalAmount*(p1+p2+p3+p4))/100;
        	     nextPaymentDate=date3;
        	     NextPaymentSchedule=p1+p2+p3+p4;
        	}
    	}
    	console.log('partialAmount:'+partialAmount);
        modelCC.updateRow(
        { Id: row.Id },
        {
            Partial_Amount__c:partialAmount,
            NextPaymentDate: nextPaymentDate,
            NextPaymentSchedule:NextPaymentSchedule,
            Payment1:p1,
            Payment2:p2,
            Payment3:p3,
            Payment4:p4,
            Date1:date,
            Date2:date1,
            Date3:date2,
            Date4:date3
            
        }
        );
        modelCC.save();
        
	});
})(skuid);
*/;
skuid.snippet.register('updatePartialAmount',function(args) {/*
    Snippet to capture the payment schedule and due date from event edition
    Also capture tax accordingly  to be displayed on "pay by invoice" page 
*/
var params = arguments[0],
	$ = skuid.$;

	var eventDetailModel = skuid.model.getModel('EventDetail');
        var eventDetail = eventDetailModel.getFirstRow();
        var eventPaymentSchedule = eventDetail.Payment_Schedule__c;
        
        var nextPaymentDate;
        var NextPaymentSchedule;
        console.log(eventPaymentSchedule);
        //console.log(cutOffDate);
        
        var eventPaymentSchedule2 = eventPaymentSchedule.split('-');
        console.log('----'+eventPaymentSchedule2.length);
        var p1='';
        var p2='';
        var p3='';
        var p4='';
        if(eventPaymentSchedule2[0]){
            p1 =parseInt(eventPaymentSchedule2[0]);
        }
        if(eventPaymentSchedule2[1]){
            p2 =parseInt(eventPaymentSchedule2[1]);
        }
        if(eventPaymentSchedule2[2]){
            p3 =parseInt(eventPaymentSchedule2[2]);
        }
        if(eventPaymentSchedule2[3]){
            p4 =parseInt(eventPaymentSchedule2[3]);
        }
    	var modelCC= skuid.model.getModel('MasterCart');
    	var row= modelCC.getFirstRow();
    	var totalAmount= row.Total_Amount__c;
    	var totalTaxAmount= row.Total_Tax_Amount__c;
    	var partialAmount;
    	var taxAmount;
        var date='',date1='',date2='',date3='';
        var today = new Date(Date.now());
        console.log('today'+today);
        if (eventDetail.X50_Cutoff_Date__c)
        {
            date = skuid.time.parseSFDate(eventDetail.X50_Cutoff_Date__c);//new Date(eventDetail.X50_Cutoff_Date__c);
            //console.log(date);
        }
        if (eventDetail.Cutoff_Date_1__c)
        {
           date1 = skuid.time.parseSFDate(eventDetail.Cutoff_Date_1__c);//new Date(eventDetail.Cutoff_Date_1__c);
            //console.log(date1);
        }
        if (eventDetail.Cutoff_Date_2__c)
        {
            date2 = skuid.time.parseSFDate(eventDetail.Cutoff_Date_2__c);;//new Date(eventDetail.Cutoff_Date_2__c);
            //console.log(date2);
        }
        if (eventDetail.Cutoff_Date_3__c)
        {
            date3 = skuid.time.parseSFDate(eventDetail.Cutoff_Date_3__c);//new Date(eventDetail.Cutoff_Date_3__c);
            //console.log(date3);
        }
        console.log(Date.now());
        // comparing offset date with today's date
        if(date>today)
    	{
    	    partialAmount=(totalAmount*p1)/100;
    	    taxAmount= (totalTaxAmount*p1)/100;
    	    //console.log(partialAmount);
    	    if(date1)
    	    {
                nextPaymentDate=date1;
                NextPaymentSchedule= p2;
    	    }
    	    
    	} 
    	if(date<=today&&date1>today||date<=today&&!date1 )
    	{
    	    partialAmount=(totalAmount*(p1+p2))/100;
    	    taxAmount= (totalTaxAmount*(p1+p2))/100;
    	    if (date2)
    	    {
    	        
                nextPaymentDate=date2;
                NextPaymentSchedule=p3;
    	    }
    	    else
    	    {
    	        //partialAmount=(totalAmount*p1)/100;
    	        nextPaymentDate='';
    	        NextPaymentSchedule='';
    	    }
    	}
    	if(date1<=today&&date2>today ||date1<=today&&!date2 ) 
    	{
    	    partialAmount=(totalAmount*(p1+p2+p3))/100;
    	    taxAmount= (totalTaxAmount*(p1+p2+p3))/100;
    	    if (date3)
    	    {
                nextPaymentDate=date3;
                NextPaymentSchedule=p4;
    	    }
    	    else
    	    {
    	        //partialAmount=(totalAmount*(p1+p2))/100;
    	        nextPaymentDate='';
                NextPaymentSchedule='';
    	    }
    	     
    	}
    	//console.log(date3);
    	if (date2)
    	{
    	    console.log(date2);
    	    console.log(today);
    	    console.log(date3);
            if(date2<=today&&date3>today ||date2<=today&&!date3) 
        	{
        	    partialAmount=(totalAmount*(p1+p2+p3+p4))/100;
        	    taxAmount= (totalTaxAmount*(p1+p2+p3+p4))/100;
        	    nextPaymentDate='';
                NextPaymentSchedule='';
    	        //nextPaymentDate=date4;
    	        //NextPaymentSchedule=p1+p2+p3+p4;
        	}
    	}
    	if(date3)
    	{
    	    console.log('date3'+date3);
        	if(date3<=today) 
        	{
        	    console.log(totalTaxAmount);
        	     partialAmount=(totalAmount*(p1+p2+p3+p4))/100;
        	     taxAmount= (totalTaxAmount*(p1+p2+p3+p4))/100;
        	     nextPaymentDate='';
                NextPaymentSchedule='';
        	     //nextPaymentDate=date3;
        	     //NextPaymentSchedule=p1+p2+p3+p4;
        	}
    	}
    	console.log('partialAmount: '+partialAmount);
    	console.log('invoice taxAmount: '+taxAmount);
        modelCC.updateRow(
        { Id: row.Id },
        {
            Partial_Amount__c:partialAmount,
            NextPaymentDate: nextPaymentDate,
            NextPaymentSchedule:NextPaymentSchedule,
            Invoice_Tax__c:taxAmount,
            Payment1:p1,
            Payment2:p2,
            Payment3:p3,
            Payment4:p4,
            Date1:date,
            Date2:date1,
            Date3:date2,
            Date4:date3
            
        }
        );
       
        console.log("amish");
        modelCC.save();
         console.log('Partial_Amount__c----'+modelCC.data[0].Partial_Amount__c);



       /* 
       var eventDetailModel = skuid.model.getModel('EventDetail');var eventDetail = eventDetailModel.getFirstRow();
        var eventPaymentSchedule = eventDetail.Payment_Schedule__c;
        
        var nextPaymentDate;
        var NextPaymentSchedule
        console.log(eventPaymentSchedule);
        //console.log(cutOffDate);
        
        var eventPaymentSchedule2 = eventPaymentSchedule.split('-');
        console.log('----'+eventPaymentSchedule2.length);
        var p1='';
        var p2='';
        var p3='';
        var p4='';
        if(eventPaymentSchedule2[0]){
            p1 =parseInt(eventPaymentSchedule2[0]);
        }
        if(eventPaymentSchedule2[1]){
            p2 =parseInt(eventPaymentSchedule2[1]);
        }
        if(eventPaymentSchedule2[2]){
            p3 =parseInt(eventPaymentSchedule2[2]);
        }
        if(eventPaymentSchedule2[3]){
            p4 =parseInt(eventPaymentSchedule2[3]);
        }
    	var modelCC= skuid.model.getModel('MasterCart');
    	var row= modelCC.getFirstRow();
    	var totalAmount= row.Total_Amount__c;
    	var partialAmount;
        var date='',date1='',date2='',date3='';
        var today = new Date(Date.now());
        console.log('today'+today);
        if (eventDetail.X50_Cutoff_Date__c)
        {
            date = skuid.time.parseSFDate(eventDetail.X50_Cutoff_Date__c);//new Date(eventDetail.X50_Cutoff_Date__c);
            //console.log(date);
        }
        if (eventDetail.Cutoff_Date_1__c)
        {
           date1 = skuid.time.parseSFDate(eventDetail.Cutoff_Date_1__c);//new Date(eventDetail.Cutoff_Date_1__c);
            //console.log(date1);
        }
        if (eventDetail.Cutoff_Date_2__c)
        {
            date2 = skuid.time.parseSFDate(eventDetail.Cutoff_Date_2__c);;//new Date(eventDetail.Cutoff_Date_2__c);
            //console.log(date2);
        }
        if (eventDetail.Cutoff_Date_3__c)
        {
            date3 = skuid.time.parseSFDate(eventDetail.Cutoff_Date_3__c);//new Date(eventDetail.Cutoff_Date_3__c);
            //console.log(date3);
        }
        console.log(Date.now());
        // comparing offset date with today's date
        if(date>today)
    	{
    	    partialAmount=(totalAmount*p1)/100;
    	    //console.log(partialAmount);
            nextPaymentDate=date;
            NextPaymentSchedule= p1;
    	    
    	} 
    	if(date<=today&&date1>today||date<=today&&!date1 )
    	{
    	    partialAmount=(totalAmount*p1)/100;
            nextPaymentDate=date;
            NextPaymentSchedule=p1;
    	}
    	if(date1<=today&&date2>today ||date1<=today&&!date2 ) 
    	{
    	    partialAmount=(totalAmount*(p1+p2))/100;
            nextPaymentDate=date1;
            NextPaymentSchedule=p1+p2;
    	     
    	}
    	//console.log(date3);
    	if (date2)
    	{
    	    console.log(date2);
    	    console.log(today);
    	    console.log(date3);
            if(date2<=today&&date3>today ||date2<=today&&!date3) 
        	{
        	    partialAmount=(totalAmount*(p1+p2+p3))/100;
    	        nextPaymentDate=date2;
    	        NextPaymentSchedule=p1+p2+p3;
        	}
    	}
    	if(date3)
    	{
    	    console.log('date3'+date3);
        	if(date3<=today) 
        	{
        	     partialAmount=(totalAmount*(p1+p2+p3+p4))/100;
        	     nextPaymentDate=date3;
        	     NextPaymentSchedule=p1+p2+p3+p4;
        	}
    	}
    	console.log('partialAmount'+partialAmount);
        modelCC.updateRow(
        { Id: row.Id },
        {
            //Partial_Amount__c:partialAmount,
            NextPaymentDate: nextPaymentDate,
            NextPaymentSchedule:NextPaymentSchedule,
            Payment1:p1,
            Payment2:p2,
            Payment3:p3,
            Payment4:p4,
            Date1:date,
            Date2:date1,
            Date3:date2,
            Date4:date3
            
        }
        );
        modelCC.save();
*/



	
/*	var eventDetailModel = skuid.model.getModel('EventDetail');
    var eventDetail = eventDetailModel.getFirstRow();
    var eventPaymentSchedule = eventDetail.Payment_Schedule__c;
    
    console.log(eventPaymentSchedule);
    //console.log(cutOffDate);
    var eventPaymentSchedule2 = eventPaymentSchedule.split('-');
    console.log('----'+eventPaymentSchedule2.length);
    var p1;
    var p2;
    var p3;
    var p4;
    if(eventPaymentSchedule2[0]){
        p1 =parseInt(eventPaymentSchedule2[0]);
    }
    if(eventPaymentSchedule2[1]){
        p2 =parseInt(eventPaymentSchedule2[1]);
    }
    if(eventPaymentSchedule2[2]){
        p3 =parseInt(eventPaymentSchedule2[2]);
    }
    if(eventPaymentSchedule2[3]){
        p4 =parseInt(eventPaymentSchedule2[3]);
    }
    
    
    	var modelCC= skuid.model.getModel('MasterCart');
    	var row= modelCC.getFirstRow();
    	var totalAmount= row.Total_Amount__c;
    	var partialAmount;
        var date,date1,date2,date3;
        if (eventDetail.X50_Cutoff_Date__c)
        {
        
            date = new Date(eventDetail.X50_Cutoff_Date__c);
            //console.log(date);
        }
        if (eventDetail.Cutoff_Date_1__c)
        {
           date1 = new Date(eventDetail.Cutoff_Date_1__c);
            //console.log(date1);
        }
        if (eventDetail.Cutoff_Date_2__c)
        {
            date2 = new Date(eventDetail.Cutoff_Date_2__c);
            //console.log(date2);
        }
        if (eventDetail.Cutoff_Date_3__c)
        {
            date3 = new Date(eventDetail.Cutoff_Date_3__c);
            //console.log(date3);
        }
        console.log(Date.now());
        // comparing offset date with today's date
        if(date>Date.now() )
    	{
    	    partialAmount=(totalAmount*p1)/100;
    	    console.log(partialAmount);
    	} 
    	if(date<=Date.now()&&date1>Date.now()||date<=Date.now()&&date1===undefined )
    	{
    	    partialAmount=(totalAmount*p1)/100;
    	    console.log(partialAmount);
    	}
    	if(date1<=Date.now()&&date2>Date.now() ||date1<=Date.now()&&date2===undefined ) 
    	{
    	     partialAmount=(totalAmount*(p1+p2))/100;
    	      console.log(partialAmount);
    	}
    	//console.log(date3);
        if(date2<=Date.now()&&date3>Date.now() ||date2<=Date.now()&&date3===undefined) 
    	{
    	     partialAmount=(totalAmount*(p1+p2+p3))/100;
    	      console.log(partialAmount);
    	}
    	
    	if(date3<=Date.now()) 
    	{
    	     partialAmount=(totalAmount*(p1+p2+p3+p4))/100;
    	      console.log(partialAmount);
    	}
    	
    	
        modelCC.updateRow(row, 'Partial_Amount__c', partialAmount);
        
        modelCC.save();
        
        /*if (row.Partial_Amount__c==row.Total_Amount__c)
        {
            modelCC.updateRow(row, 'RenderPartialAmount', true);
        }*/
        /*date = new Date(cutOffDate);
            date.toISOString().slice(0,10);
            console.log(date);*/
});
skuid.snippet.register('sendInvoiceAsPDF',function(args) {//Comment By Amish
/*var params = arguments[0],
	$ = skuid.$;
	
 //Getting Event ID
    var modelA = skuid.model.getModel('EventDetail');
    var rowA = modelA.getFirstRow();
    var eventId= rowA.Id;
    var eventCode = rowA.Event_Code__c;
    console.log('eventCode: '+eventCode);
 
 //Getting Contact ID and UserID
    var modelCU = skuid.model.getModel('CurrentUser');
    var rowCU = modelCU.getFirstRow();
    var UserId= rowCU.Id;
    var ContactId = rowCU.ContactId;
    console.log('ContactId: '+ContactId);
    console.log('UserId: '+UserId);
     
 //Getting Master Cart ID
    var modelM = skuid.model.getModel('MasterCart');
    var rowM = modelM.getFirstRow();
    var mCartId= rowM.Id;
    console.log('mCartId: '+mCartId);
    
    
    var result = sforce.apex.execute('SendPDFEmail','sendPDFEmail', {EventCode:eventCode, ContactId:ContactId, UserID:UserId, mCartId:mCartId},function(result){
        console.log('Result: '+result);
    });   */
});
skuid.snippet.register('fieldRenderZero',function(args) {var field = arguments[0], 
    value = arguments[1], 
    model = field.model, 
    row = field.row, 
    
$ = skuid.$; 
console.log(model);
console.log(row);
if (value <=0 )
{
     value= 1;
}
else{
    value=value;
}
 
skuid.ui.fieldRenderers[field.metadata.displaytype][field.mode](field, value);
field.model.updateRow();
});
skuid.snippet.register('updateAmountDue',function(args) {/*
    Field render Snippet to update the amount due when customer change the quantity on the cart page
    This snippet is called on "Price__c" filed 
*/
var field = arguments[0],
    value = arguments[1],
    $ = skuid.$,
    dt = field.metadata.displaytype;
if (field.mode != 'edit') {
    skuid.ui.fieldRenderers[dt][field.mode](field,value);
} else {
    skuid.ui.fieldRenderers[dt].edit(field,value); 
}
var calculateCost = function(){
    value = (field.model.getFieldValue(field.row,'Quantity__c',true) || 0)
        * (field.model.getFieldValue(field.row,'Rate__c',true) || 0);
    value = Math.round(value * 100) / 100;
    field.model.updateRow(
        field.row,
        'Price__c',
        value
    );
    if (field.mode == 'edit') {
        field.element.find('input').val(value);
    }
};
calculateCost();
var listener = new skuid.ui.Field(field.row,field.model,null,{fieldId: 'Price__c'});
listener.handleChange = function(){
    calculateCost();
};
field.model.registerField(listener,'Rate__c');
field.model.registerField(listener,'Quantity__c');
});
skuid.snippet.register('updateCartTotal',function(args) {/*
    Snippet to update the cart total
*/
var params = arguments[0],
	$ = skuid.$;

	    
    	var modelCC= skuid.model.getModel('CustomerCenterCart');
    	var cartlength = modelCC.data.length;
    	var modelCart = skuid.model.getModel('CartTotal');
        var totalCartPrice1 = 0;
    	var totalCartPrice= 0;
    	//
    	for(var i=0;i<cartlength;++i)
        {   
                
               
        }
    	//
        
    	for(var i=0;i<cartlength;++i)
        {   
                console.log('Price1: '+modelCC.data[i].Price__c);
                if(modelCC.data[i].Price__c){
                    totalCartPrice1 = totalCartPrice1+modelCC.data[i].Price__c;
                    totalCartPrice= totalCartPrice1.toFixed(2);
                }
        }
        console.log('totalCartPrice: '+totalCartPrice);
        
        var CartTotal = modelCart.createRow({ 
                            additionalConditions: [
                                { field: 'CartTotal', value: totalCartPrice  }
                            
                            ],doAppend: true});
                       
                        modelCart.save();
	var a = modelCart.getFirstRow();
	var b = a.CartTotal;
	console.log('CartTotal: '+b);
	
	//update Total Price on Master Cart
	var modelMC= skuid.model.getModel('MasterCart');
	var rowMC= modelMC.getFirstRow();
     modelMC.updateRow(rowMC, 'Total_Amount__c', totalCartPrice);
     //modelMC.updateRow(rowMC, 'Final_Amount__c', totalCartPrice);
     modelMC.save();
});
skuid.snippet.register('captureTax',function(args) {/*
    Snippet to capture the tax from VF 
*/

var params = arguments[0],
	$ = skuid.$;
	var dfd = jQuery.Deferred();
	var modelA = skuid.model.getModel('EventDetail');
        var rowE = modelA.getFirstRow();
        var eID= rowE.Id;
        console.log('eID:  '+eID);

	var modelB = skuid.model.getModel('MasterCart');
	var rowM = modelB.getFirstRow();
        var mCartID= rowM.Id;
        console.log(mCartID);

	var Url ="/CaptureProductTax?mCartID="+mCartID+"&eventId="+eID;
    console.log('URL:-  ' +Url);
    $.get(Url,function(data){   
        // $( "#sk-1XnBxH-513" ).html(data);
         console.log('data:-  ' +data);
          dfd.resolve();
    });
    return dfd.promise();
    
    	/*var customerCartList=[];
    // Adding List to the Array that will be passed to salesforce to update the "community_visibility" field in product object 
    for (var i=0;i<modelB.data.length;i++)
    {
            customerCartList.push(modelB.data[i].Product__r.ProductCode);
    }
    
    console.log(customerCartList);
    var JSONString = JSON.stringify(customerCartList, null, 2);
    console.log(JSONString );
	var result = sforce.apex.execute('CaptureProductTax','CaptureProductTax', {customerCartList:JSONString,eventId:eID});
	console.log(result);*/
});
skuid.snippet.register('newSnippet',function(args) {var params = arguments[0],
	$ = skuid.$;
		var modelCC= skuid.model.getModel('Attachment');
		var row = modelCC.getFirstRow();
var content = row.Id
// any kind of extension (.txt,.cpp,.cs,.bat)
var filename = "INvoice.pdf";

var blob = new Blob([content], {
 type: "text/plain;charset=utf-8"
});

saveAs(blob, filename);
});
/*
    Page load snippet that will capture the total tax of the product 
 */
 (function(skuid){
     var $ = skuid.$;
     $.noConflict(); 
     
     $(document.body).one('pageload',function(){
     var dfd = jQuery.Deferred();
    
    console.log('**Calculating Tax**');
    //Getting the MasterCart Object Name
    var modelM = skuid.model.getModel('MasterCartForTax');
    var rowM = modelM.getFirstRow();
    var mCartId= rowM.Id;
    
    console.log('mCartId: '+mCartId);
      //Getting Event ID
    var modelA = skuid.model.getModel('EventDetail');
    var rowA = modelA.getFirstRow();
    var eventId= rowA.Id;
    console.log('eventId: '+eventId);
    console.log('eventName: '+rowA.Name);
  
    var Url ="/CaptureProductTax?mCartID="+mCartId+"&eventId="+eventId;
    $.get(Url,function(data){   
          //$( "#sk-1XnBxH-513" ).html(data);
           dfd.resolve();
    });
    console.log('URL:-  ' +Url);
    console.log("CaptureProductTax");
    
   
    return dfd.promise(); 
    });
})
(skuid); 
    
      
   /*
    var result = sforce.apex.execute('CaptureProductTaxCtrl','CaptureProductTax', {eventId:eventId, mCartId:mCartId},function(result){
    console.log('Result: '+result);
    dfd.resolve();
    });
    */;
skuid.snippet.register('calculateAmountWithTax',function(args) {/*
    Update the Final amount for the MasterCartForTax model
    Check for undefiend tax value
*/
var params = arguments[0],
	$ = skuid.$;
 var modelMC= skuid.model.getModel('MasterCartForTax');
	var row= modelMC.getFirstRow();
	var tax = row.Invoice_Tax__c;
	if (!tax)
	{
	    tax=0;
	}
	var amount= row.Partial_Amount__c;
	console.log('amount: '+amount);
	var finalAmount= tax+amount;
	console.log('finalAmount:'+finalAmount);
	modelMC.updateRow(
        { Id: row.Id },
        {
            Final_Amount__c: finalAmount
        }
    );
    modelMC.save();
});
skuid.snippet.register('testRoe',function(args) {var params = arguments[0],    
contextRow = params.item ? params.item.row : params.row,
contextModel = params.CustomerCenterCart,
$ = skuid.$;
var contextId = contextModel.getFieldValue(contextRow, 'Id', true);
    console.log('contextId'+contextId);
});
skuid.snippet.register('sendEmailToCustomerForInvoice',function(args) {//Send Email to Customer while clickin on Pay by invoice Button

var params = arguments[0],
	$ = skuid.$;

	var Url ='/SendPDFEmail?eventCode={{{$Model.EventDetail.data.0.Event_Code__c}}}&ContactId={{{$Model.CurrentUser.data.0.ContactId}}}&UserId={{{$Model.CurrentUser.data.0.Id}}}&mCartId={{{$Model.MasterCart.data.0.Id}}}&paymentType=Invoice';
	console.log('Url : '+Url);
	$.get(Url,function(data){
          $( "#sk-1JGpNE-553" ).html(data);
     });
});
(function(skuid){
 var $ = skuid.$;
 $(document.body).one('pageload',function(){
    $('#MyButton1').button('disable');
    });
})(skuid);;
}(window.skuid));