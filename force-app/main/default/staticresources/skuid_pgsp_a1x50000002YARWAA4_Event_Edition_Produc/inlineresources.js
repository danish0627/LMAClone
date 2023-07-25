(function(skuid){
skuid.snippet.register('ProductListSnippet_test',function(args) {/*
    ** Snippet to display product lists as per event edition
*/
var params = arguments[0],
	$ = skuid.$;
    var modelA = skuid.model.getModel('EventEdition');
        var rowE = modelA.getFirstRow();
        var eID= rowE.Name;
        console.log(eID);
        var result = sforce.apex.execute('EventBasedProductList','EventBasedProductList', { eventId:eID});
        console.log(result);
    	var proList = JSON.parse(result);
    	console.log(proList);
    	//var rowsToInsert = {};
    	var modelB = skuid.model.getModel('EventProduct');// UI model
    	// Populating UI Model with data capture from salesforce for product
    	if(proList)
        {
            $.each(proList, function( index,value) {
            var productList = modelB.createRow({ 
                    additionalConditions: [
                        { field: 'ProductID', value: value.Id},
                        { field: 'ProductName', value: value.Name},
                        { field: 'CommunityVisibility', value: value.CommunityVisibility},
                        { field: 'AddToCartVisibility', value: value.AddToCartVisibility},
                        { field: 'SoldOut', value: value.SoldOut},
                        { field: 'ProductOwner', value: value.ProductOwner},
                    ],doAppend: true});
               
            } );
            modelB.save();
        }
        modelB.save();
});
/*
    ** PageLoad Snippet to display product lists as per event edition
*/
(function(skuid){
	var $ = skuid.$;
	$(document.body).one('pageload',function(){
	 //$(window).on('load',function(){
    	var modelA = skuid.model.getModel('EventEdition');
        var rowE = modelA.getFirstRow();
        var eID= rowE.Name;
        console.log(eID);
        var result = sforce.apex.execute('EventBasedProductList','EventBasedProductList', { eventName:eID});
        console.log(result);
    	var proList = JSON.parse(result);
    	console.log(proList);
    	//var rowsToInsert = {};
    	var modelB = skuid.model.getModel('EventProduct');// UI model
    	// Populating UI Model with data capture from salesforce for product
    	if(proList)
        {
            $.each(proList, function( index,value) {
            var productList = modelB.createRow({ 
                    additionalConditions: [
                        { field: 'ProductID', value: value.Id},
                        { field: 'ProductName', value: value.Name},
                        { field: 'CommunityVisibility', value: value.CommunityVisibility},
                        { field: 'AddToCartVisibility', value: value.AddToCartVisibility},
                        { field: 'SoldOut', value: value.SoldOut},
                        { field: 'ProductOwner', value: value.ProductOwner},
                    ],doAppend: true});
               
            } );
            modelB.save();
        }
        modelB.save();
	});
	
})(skuid);;
/*
    ** Snippet to capture Pirce book name and Id as per event edition
*/
(function(skuid){
	var $ = skuid.$;
	$(document.body).one('pageload',function(){
	 //$(window).on('load',function(){
    	var modelA = skuid.model.getModel('EventEdition');
        var rowE = modelA.getFirstRow();
        var eID= rowE.Id;
        console.log(eID);
        var result = sforce.apex.execute('EventBasedPriceBook','EventBasedPriceBook', { eventId:eID});
        console.log(result);
    	var proList = JSON.parse(result);
    	console.log(proList);
    	//var rowsToInsert = {};
    	var modelB = skuid.model.getModel('PriceBookUI');// UI Model
    	// Populating UI Model with data capture from salesforce 
    	if(proList)
        {
            $.each(proList, function( index,value) {
            var productList = modelB.createRow({ 
                    additionalConditions: [
                        { field: 'PriceBookId', value: value.Id},
                        { field: 'Name', value: value.Name},
                    ],doAppend: true});
               
            } );
            modelB.save();
        }
        modelB.save();
	});
	
})(skuid);;
skuid.snippet.register('updateCommunityVisibilitySnippet',function(args) {/*
    ** Snippet to update the community visibility
*/
var params = arguments[0],
	$ = skuid.$;
	var modelA = skuid.model.getModel('EventEdition');
        var rowE = modelA.getFirstRow();
        var eID= rowE.Name;
	var modelB = skuid.model.getModel('EventProduct');
	var ProductIdList=[];
    // Adding List to the Array that will be passed to salesforce to update the "community_visibility" field in product object 
    for (var i=0;i<modelB.data.length;i++)
    {
            ProductIdList.push(modelB.data[i].ProductID+modelB.data[i].CommunityVisibility);
    }
    
    console.log(ProductIdList);
    var JSONString = JSON.stringify(ProductIdList, null, 2);
    console.log(JSONString );
	var result = sforce.apex.execute('UpdateCommunityVisibility','UpdateCommunityVisibility', {ProductIdList:JSONString,eventId:eID});
	console.log(result);
});
skuid.snippet.register('RelatedProductList',function(args) {/* 
    ** Snippet to capture all the related product for the products
*/
var params = arguments[0],
	$ = skuid.$;
    // Grabing the context ID	
	contextRow = params.item ? params.item.row : params.row,
        contextModel = params.model;
    	var rowId = contextModel.getFieldValue(contextRow, 'Id', true);
	// Grading the Product ID of the row
    var model = arguments[0].EventProduct,
        row = arguments[0].row;
        var proId = arguments[0].item.row.ProductID;
    var modelEP =skuid.model.getModel('EventProduct'); 
    //Getting the Pricebook Object Name
    var modelE = skuid.model.getModel('PriceBookUI');
        var rowE = modelE.getFirstRow();
        var priceBookId = rowE.PriceBookId;
        console.log(priceBookId);
       /* var PricebookObjName= rowE.Name;
        PricebookObjName=PricebookObjName.split(' ').join('_');
        PricebookObjName+='__c';*/
    
    //console.log('PricebookObjName: '+PricebookObjName);
    var modelA = skuid.model.getModel('EventEdition');
        var rowE = modelA.getFirstRow();
        var eID= rowE.Name;
        console.log(eID);
    // updateing the price of main product
    var resultPrice = sforce.apex.execute('GetProductPriceOnOperationPortal','getMainProductPriceOnOperationPortal', {ProductId:proId, priceBookId:priceBookId,eventId:eID},function(resultPrice){
        console.log(resultPrice);
        var proMainList = JSON.parse(resultPrice);
    	console.log(proMainList);
        var rowsToUpdate = {};
        if("Main Product : "+proMainList){
        /*$.each( modelEP.getRows(), function(){
            rowsToUpdate[rowId] = { Price: proMainList[0].mainPrice };
        });*/
            for(var i=0;i<proMainList.length;++i)
            { 
                    modelEP.updateRow(
                        { Id: rowId},
                        { Price:proMainList[i].mainPrice ,
                         Quantity:proMainList[i].mainQuantity,
                         EventProductType:proMainList[i].eventProductType,
                         ProductFamily:proMainList[i].productFamily
                        }
                    );
                    modelEP.save();
            }
        }
       // modelEP.updateRows( rowsToUpdate );
       // modelEP.save(); 
        
    
     });
     
    // captuiring the price Id, price, name of related product and populating the value in  'RelatedProduct' UI Model
    var result = sforce.apex.execute('GetProductPriceOnOperationPortal','getProductPriceOnOperationPortal', {ProductId:proId, priceBookId:priceBookId,eventId:eID},function(result){
        console.log(result);
    	var proList = JSON.parse(result);
    	console.log(proList);
    	//var rowsToInsert = {};
    	var modelB = skuid.model.getModel('RelatedProduct');
    	var modelC = skuid.model.getModel('RelatedProductOptional');
    	if(proList)
        {
            $.each(proList, function( index,value) {
                if (value.Required===true)
                {
                    var productList = modelB.createRow({ 
                            additionalConditions: [
                                { field: 'ProductID', value: value.ProductID},
                                { field: 'ProductName', value: value.ProductName},
                                { field: 'Price', value: value.Price},
                                { field: 'Quantity', value: value.Quantity},
                                { field:'Required', value:value.Required},
                                { field:'Feature', value:value.Feature},
                                { field:'ProductFamily', value:value.ProductFamily},
                                
                            ],doAppend: true});
                }
                else if (value.Required===false)
                {
                    var productListNotRequired = modelC.createRow({ 
                            additionalConditions: [
                                { field: 'ProductID', value: value.ProductID},
                                { field: 'ProductName', value: value.ProductName},
                                { field: 'Price', value: value.Price},
                                { field: 'Quantity', value: value.Quantity},
                                { field:'Required', value:value.Required},
                                { field:'Feature', value:value.Feature},
                                { field:'ProductFamily', value:value.ProductFamily},
                                
                            ],doAppend: true});
                }
                       
                    } );
            modelB.save();
            modelC.save();
        }
        modelB.save();
        modelC.save();
    });
});
/*(function(skuid){
	var $ = skuid.$;
	$(document.body).one('pageload',function(){
		$(function() {

    var $sidebar = $("#sk-yiAOM-236 .ui-button.ui-widget.ui-state-default.ui-corner-all.ui-button-text-only"),
        $window = $(window),
        offset = $sidebar.offset(),
        topPadding = 0;

    $window.scroll(function() {
        if ($window.scrollTop() > offset.top) {
            $sidebar.stop().animate({
                top: $window.scrollTop() -offset.top + topPadding
            });
        } else {
            $sidebar.stop().animate({
                top: 0
            });
        }
    });

});
	});
})(skuid);*/;
skuid.snippet.register('updateAddToProductVisibilitySnippet',function(args) {/*var params = arguments[0],
	$ = skuid.$;
	var modelA = skuid.model.getModel('EventEdition');
        var rowE = modelA.getFirstRow();
        var eID= rowE.Name;
	var modelB = skuid.model.getModel('EventProduct');
	var ProductIdList=[];
    // Adding List to the Array that will be passed to salesforce to update the "AddToProduct_visibility" field in product object 
    for (var i=0;i<modelB.data.length;i++)
    {
            ProductIdList.push(modelB.data[i].ProductID+modelB.data[i].AddToCartVisibility);
    }
    
    console.log(ProductIdList);
    var JSONString = JSON.stringify(ProductIdList, null, 2);
    console.log(JSONString );
	var result = sforce.apex.execute('UpdateAddToCartVisibility','updateAddToCartVisibility', {ProductIdList:JSONString,eventId:eID});
	console.log(result);*/
});
/*
    ** Snippet for sticky header
*/
(function(skuid){
	var $ = skuid.$;
	$(document.body).one('pageload',function(){
		$(function() {
    var siteHeaderTop = $('#sk-yiAOM-236 .sk-button-action').offset().top;
    var $window = $(window);

    $window.scroll(function() {
        var windowTop = $window.scrollTop();
        $('#sk-yiAOM-236 .sk-button-action').toggleClass('fixed', windowTop >= siteHeaderTop);

        // Add class .scrolled on scroll to control show/hide of back-top button
        //$('body').toggleClass('scrolled', windowTop > 200);
    });
});
	});
})(skuid);;
skuid.snippet.register('updateSoldOutSnippet',function(args) {/*
    ** Snippet to update the community soldout filed
*/
var params = arguments[0],
	$ = skuid.$;
	var modelA = skuid.model.getModel('EventEdition');
        var rowE = modelA.getFirstRow();
        var eID= rowE.Name;
	var modelB = skuid.model.getModel('EventProduct');
	var ProductIdList=[];
    // Adding List to the Array that will be passed to salesforce to update the "community_visibility" field in product object 
    for (var i=0;i<modelB.data.length;i++)
    {
            ProductIdList.push(modelB.data[i].ProductID+modelB.data[i].SoldOut);
    }
    
    console.log(ProductIdList);
    var JSONString = JSON.stringify(ProductIdList, null, 2);
    console.log(JSONString );
	var result = sforce.apex.execute('UpdateSoldOutOnCommunity','UpdateSoldOutOnCommunity', {ProductIdList:JSONString,eventId:eID});
	console.log(result);
});
skuid.snippet.register('ckTextArea',function(args) {SetupCKTextArea(
	arguments[0] //Field
	, arguments[1] //Value
);
});
var $ = skuid.$;

window.CKSettings = {
    removePlugins: 'pagebreak,preview,print,save,selectall,showblocks,showborders,smiley,tab,clipboard,panelbutton,colorbutton,colordialog,templates,div,resize,elementspath,enterkey,entities,popup,filebrowser,find,flash,floatingspace,forms,htmlwriter,iframe,menubutton,language,magicline,newpage,pagebreak,selectall,subscript,superscript,showblocks,showborders,scayt,tab,tabletools,justify,bidi,font'
    ,removeButtons: 'Subscript,Superscript,Underline'
};

function SetupCKTextArea(field, value) {
    /* Create and grab DOM elements */        
    skuid.ui.fieldRenderers.TEXTAREA.edit(field, value);
    var uniqid = RandomID();
    field.element.attr('id', uniqid);
    setTimeout(function(){
        var element = $("#" + uniqid + ">div");
        element.html(element.text());
        var instance = CKEDITOR.replace(element[0], window.CKSettings);
        instance.on('change', function() {
            var fieldRow = field.row
                , fieldId = field.id
                , fieldText = this.getData()
                , fieldData = {};
            fieldData[fieldId] = fieldText;
            console.log(field);
            field.model.updateRow(fieldRow, fieldData, {initiatorId : field._GUID});
            
        });
    },500);
}
function RandomID() {
    var S4 = function() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
};
}(window.skuid));