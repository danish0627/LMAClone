(function(skuid){
skuid.snippet.register('SendEmail',function(args) {var params = arguments[0],
	$ = skuid.$;

var query = window.location.search.substring(1);
var CompId  = query.split('&id=')[1];
console.log('id ' + CompId );

window.open("/_ui/core/email/author/EmailAuthor?p2_lkid=" + CompId + "&isdtp=mn","_blank","toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, width=1200, height=700");

// + "&retURL=https://dumpsterfile.beefyhost.com:8444/SuperSkookum/Skuid/closewindow.html
});
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
skuid.snippet.register('disable cancel',function(args) {var params = arguments[0],
	$ = skuid.$;
skuid.$("#MyButton").button("disable");
});
skuid.snippet.register('readyonly',function(args) {var field = arguments[0], 
value = arguments[1]; 
//field.mode = 'read'; 
var $ = skuid.$;

var modelWF = skuid.model.getModel('Account');
    var modelWFSize = skuid.model.getModel('Account').data.length;
    var rowE = modelWF.getFirstRow();
    var checkInactive= rowE.Inactive__c;
    
    
    if(modelWFSize >0 && checkInactive == true){
        field.mode = 'readonly'; 
        console.log('====CHECKTRUE '+checkInactive);
        var renderers = skuid.ui.fieldRenderers; 
        var dt = field.metadata.displaytype; 
        var r = renderers[dt]; 
        if (!r) r = renderers.TEXT; 
        r.readonly(field,value);
    }
    if(modelWFSize >0 && checkInactive == false){
        console.log('====CHECKFALSE: '+checkInactive);
        field.mode = 'read';
        var renderers = skuid.ui.fieldRenderers; 
        var dt = field.metadata.displaytype; 
        var r = renderers[dt]; 
        if (!r) r = renderers.TEXT; 
        r.read(field,value);

        //console.log($('.nx-basicfieldeditor:visible').length);
        //var fieldeditor = $('.nx-basicfieldeditor:visible').data('object');
        //fieldeditor.mode = 'read' 
    }
});
skuid.snippet.register('AddressComplete',function(args) {var $ = skuid.$;

SetupAddressSearch(
	arguments[0] //Field
	, arguments[1] //Value
	, "PlacesAPI" //Lookup Service Model
	, "GeocodeAPI" //Populate Service Model
	//Edit below values to match the target fields on your Model
	,{ "Street"    : "BillingStreet"
		, "Street1" : "Billing_Address_Line_2__c"
		, "City"    : "BillingCity"
		, "County"  : "BillingCounty"
		, "State"   : "BillingStateCode"
		, "Country" : "BillingCountryCode"
		, "Zip"     : "BillingPostalCode"
	}
);

function SetupAddressSearch(field, value, placesAPIModelName, geocodeAPIModelName, targetModelInfo) {
	if(field.mode == 'read') {
		//skuid.ui.fieldRenderers.STRING.read(field, value);
		skuid.ui.getFieldRenderer('STRING').read(field, value);
	}
	else if(field.mode == 'edit') {
		/* Create and grab DOM elements */		
		//skuid.ui.fieldRenderers.STRING.edit(field, value);
        skuid.ui.getFieldRenderer('STRING').edit(field, value);
		var searchID = RandomID();
		var searchResultsID = searchID + "Results";

		var BoxHTML = "<div id='" + searchResultsID + "' class='GoogleAPIAddressPicker' style='position: absolute; max-width: 200%; max-height: 150px; top: 25; left: 0; background: white; margin: 0 0 10px 10px; border: 1px solid #ddd; z-index: 999;overflow-x: hidden; overflow-y: auto;'></div>";

		if(!field.element) { console.error("Field did not contain a DOM element"); return; }
		var $searchContainer = field.element;

		$searchContainer.append(BoxHTML);

		var $searchBox = $searchContainer.find('input');
		if($searchBox.length < 1) { console.error("Error finding the input field in the field element"); return; }
		var $searchResults = $searchContainer.find("#" + searchResultsID);
		if($searchResults.length < 1) { console.error("Error creating the result picker"); return; }

		/* Set up models and conditions */
		var placesAPIModel = skuid.model.getModel(placesAPIModelName);
		if(!placesAPIModel) { console.error("Could not find Google Places API model named " + placesAPIModelName); return; }
		var placesAPICondition = placesAPIModel.getConditionByName("AddressQuery");
		if(!placesAPICondition) { console.error("Could not find 'AddressQuery' condition in " + placesAPIModelName + " model"); return; }
		var geocodeAPIModel = skuid.model.getModel(geocodeAPIModelName);
		if(!geocodeAPIModel) { console.error("Could not find Google Geocode API model named " + geocodeAPIModelName); return; }
		var geocodeAPICondition = geocodeAPIModel.getConditionByName("PlaceIDQuery");
		if(!geocodeAPICondition) { console.error("Could not find 'PlaceIDQuery' condition in " + geocodeAPIModelName + " model"); return; }

		var targetModel = field.model;
		var targetModelFields = {};

		/* Timer for the search to prevent API spamming */
		var runningSearch = false;
        var addressTest = '';
		/* Search Box Changes */
		$searchBox.keypress(function(e) {
			if(runningSearch) clearTimeout(runningSearch);
			runningSearch = setTimeout(function() {
				var searchValue = $searchBox.val();
				if(searchValue.length > 2) {
					if (e.which !== 0) {
						/* Box has met all conditions to initiate API call */
						placesAPIModel.setCondition(placesAPICondition, searchValue);
						placesAPIModel.updateData(function() {
							var options = ''
								, currentList = []
								;
							$.each(placesAPIModel.data, function(i, row) {
							    addressTest = row.formatted_address;
							    //console.log('addressTest: '+addressTest);
								options += "<a href='javascript:void(0);' id='" + searchResultsID + currentList.length + "' class='AddressPickerItem' style='padding: 3px;'>" + HTMLEscape(row.formatted_address) + '</a><br />';
								currentList.push({ "id" : row.place_id, "address": row.formatted_address });
							});
							$searchResults.html(options);
							$.each(currentList, function(i, row) {
								$('#' + searchResultsID + i).click(function() {
									$searchResults.html('').css({ display: 'none' });
									geocodeAPIModel.setCondition(geocodeAPICondition, row.id);
									geocodeAPIModel.updateData(function() {
										if(geocodeAPIModel.data.length > 0) {
											address = {
												Street: null,
												Street1: null,
												City: null,
												County: null,
												State: null,
												Zip: null,
												Country: null
											};
											$.each(geocodeAPIModel.data, function(i, row) {
											    console.log('addressTest: '+addressTest);
											    var allow1 = ["street_number", "route", "political"];
											    var testadd = '';
  											    if(row){
											       for (j = 0; j < row.types[0].length; j++) {
                                                            if (row.types[0] && row.types[0].length > 0 && allow1.indexOf(row.types[0]) === -1) {
                                                                addressTest = addressTest.replace(row.long_name + ",", "").replace(row.short_name + ",", "");
                                                                if (row.types[0] === "country") {
                                                                    addressTest = addressTest.replace(new RegExp(row.long_name + '$'), "");
                                                                    addressTest = addressTest.replace(new RegExp(countryShortNameList1(row.short_name) + '$'), "");
                                                                } 
                                                            }
                                                            if (j === row.types[0].length - 1) {
                                                                addressTest = addressTest.trim().replace(new RegExp("," + '$'), "");
                                                            }
                                                            if (row.types[0] === "administrative_area_level_1") {
                                                                addressTest = addressTest.replace(row.long_name, ""); 
                                                            } 
                                                            if (row.types[0] === "postal_code") {
                                                                addressTest = addressTest.replace(new RegExp(row.long_name + '$'), "");
                                                                testadd = addressTest;
                                                            } 
                                                            
                                                            
                                                            address.Street = testadd!==''?testadd:address.City;
                                                            address.Street1 = address.Street1!==''?'':'';
                                                            
                                                            if(row.types[0] == 'locality'){
                                                             address.City = row.long_name;
                                                            }
                                                            if(row.types[0] == 'administrative_area_level_2'){
                                                                address.County = row.long_name;
                                                            }
                                                            if(row.types[0] == 'administrative_area_level_1'){
                                                                address.State = row.short_name;
                                                            }
                                                            if(row.types[0] == 'country'){
                                                                address.Country = row.short_name;
                                                            }
                                                            if(row.types[0] == 'postal_code'){
                                                                address.Zip = row.long_name;
                                                            }
											       } 
											   }
 										});
                                            
											var output = {};

											$.each(targetModelInfo, function(fieldName, resultName) {
												output[resultName] = (address[fieldName] !== undefined) ? address[fieldName] : null;
											});

											targetModel.updateRow(targetModel.data[0], output);
										}
									});
								});
							});
						});
					}
				}
			}, 300);
		}).focus(function() { $searchResults.css({ display: 'block' }); }).blur(function() { setTimeout(function() { $searchResults.css({ display: 'none' }); }, 100); });
	}
}

function HTMLEscape(text) { return $('<div/>').text(text).html(); }

function RandomID() {
	var S4 = function() {
		return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	};
	return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}





var countryShortNameList1 = function (str) {
    if (str === "AF") return "AFG";
    if (str === "AL") return "ALB";
    if (str === "DZ") return "DZA";
    if (str === "AD") return "AND";
    if (str === "AO") return "AGO";
    if (str === "AG") return "ATG";
    if (str === "AR") return "ARG";
    if (str === "AM") return "ARM";
    if (str === "AU") return "AUS";
    if (str === "AT") return "AUT";
    if (str === "AZ") return "AZE";
    if (str === "BS") return "BHS";
    if (str === "BH") return "BHR";
    if (str === "BD") return "BGD";
    if (str === "BB") return "BRB";
    if (str === "BY") return "BLR";
    if (str === "BE") return "BEL";
    if (str === "BZ") return "BLZ";
    if (str === "BJ") return "BEN";
    if (str === "BT") return "BTN";
    if (str === "BO") return "BOL";
    if (str === "BA") return "BIH";
    if (str === "BW") return "BWA";
    if (str === "BR") return "BRA";
    if (str === "BN") return "BRN";
    if (str === "BG") return "BGR";
    if (str === "BF") return "BFA";
    if (str === "BI") return "BDI";
    if (str === "CV") return "CPV";
    if (str === "KH") return "KHM";
    if (str === "CM") return "CMR";
    if (str === "CA") return "CAN";
    if (str === "CF") return "CAF";
    if (str === "TD") return "TCD";
    if (str === "CL") return "CHL";
    if (str === "CN") return "CHN";
    if (str === "CO") return "COL";
    if (str === "KM") return "COM";
    if (str === "CG") return "COG";
    if (str === "CK") return "COK";
    if (str === "CR") return "CRI";
    if (str === "HR") return "HRV";
    if (str === "CU") return "CUB";
    if (str === "CY") return "CYP";
    if (str === "CZ") return "CZE";
    if (str === "CI") return "CIV";
    if (str === "KP") return "PRK";
    if (str === "CD") return "COD";
    if (str === "DK") return "DNK";
    if (str === "DJ") return "DJI";
    if (str === "DM") return "DMA";
    if (str === "DO") return "DOM";
    if (str === "EC") return "ECU";
    if (str === "EG") return "EGY";
    if (str === "SV") return "SLV";
    if (str === "GQ") return "GNQ";
    if (str === "ER") return "ERI";
    if (str === "EE") return "EST";
    if (str === "ET") return "ETH";
    if (str === "FO") return "FRO";
    if (str === "FJ") return "FJI";
    if (str === "FI") return "FIN";
    if (str === "FR") return "FRA";
    if (str === "GA") return "GAB";
    if (str === "GM") return "GMB";
    if (str === "GE") return "GEO";
    if (str === "DE") return "DEU";
    if (str === "GH") return "GHA";
    if (str === "GR") return "GRC";
    if (str === "GD") return "GRD";
    if (str === "GT") return "GTM";
    if (str === "GN") return "GIN";
    if (str === "GW") return "GNB";
    if (str === "GY") return "GUY";
    if (str === "HT") return "HTI";
    if (str === "HN") return "HND";
    if (str === "HU") return "HUN";
    if (str === "IS") return "ISL";
    if (str === "IN") return "IND";
    if (str === "ID") return "IDN";
    if (str === "IR") return "IRN";
    if (str === "IQ") return "IRQ";
    if (str === "IE") return "IRL";
    if (str === "IL") return "ISR";
    if (str === "IT") return "ITA";
    if (str === "JM") return "JAM";
    if (str === "JP") return "JPN";
    if (str === "JO") return "JOR";
    if (str === "KZ") return "KAZ";
    if (str === "KE") return "KEN";
    if (str === "KI") return "KIR";
    if (str === "KW") return "KWT";
    if (str === "KG") return "KGZ";
    if (str === "LA") return "LAO";
    if (str === "LV") return "LVA";
    if (str === "LB") return "LBN";
    if (str === "LS") return "LSO";
    if (str === "LR") return "LBR";
    if (str === "LY") return "LBY";
    if (str === "LT") return "LTU";
    if (str === "LU") return "LUX";
    if (str === "MG") return "MDG";
    if (str === "MW") return "MWI";
    if (str === "MY") return "MYS";
    if (str === "MV") return "MDV";
    if (str === "ML") return "MLI";
    if (str === "MT") return "MLT";
    if (str === "MH") return "MHL";
    if (str === "MR") return "MRT";
    if (str === "MU") return "MUS";
    if (str === "MX") return "MEX";
    if (str === "FM") return "FSM";
    if (str === "MC") return "MCO";
    if (str === "MN") return "MNG";
    if (str === "ME") return "MNE";
    if (str === "MA") return "MAR";
    if (str === "MZ") return "MOZ";
    if (str === "MM") return "MMR";
    if (str === "NA") return "NAM";
    if (str === "NR") return "NRU";
    if (str === "NP") return "NPL";
    if (str === "NL") return "NLD";
    if (str === "NZ") return "NZL";
    if (str === "NI") return "NIC";
    if (str === "NE") return "NER";
    if (str === "NG") return "NGA";
    if (str === "NU") return "NIU";
    if (str === "NO") return "NOR";
    if (str === "OM") return "OMN";
    if (str === "PK") return "PAK";
    if (str === "PW") return "PLW";
    if (str === "PA") return "PAN";
    if (str === "PG") return "PNG";
    if (str === "PY") return "PRY";
    if (str === "PE") return "PER";
    if (str === "PH") return "PHL";
    if (str === "PL") return "POL";
    if (str === "PT") return "PRT";
    if (str === "QA") return "QAT";
    if (str === "KR") return "KOR";
    if (str === "MD") return "MDA";
    if (str === "RO") return "ROU";
    if (str === "RU") return "RUS";
    if (str === "RW") return "RWA";
    if (str === "KN") return "KNA";
    if (str === "LC") return "LCA";
    if (str === "VC") return "VCT";
    if (str === "WS") return "WSM";
    if (str === "SM") return "SMR";
    if (str === "ST") return "STP";
    if (str === "SA") return "SAU";
    if (str === "SN") return "SEN";
    if (str === "RS") return "SRB";
    if (str === "SC") return "SYC";
    if (str === "SL") return "SLE";
    if (str === "SG") return "SGP";
    if (str === "SK") return "SVK";
    if (str === "SI") return "SVN";
    if (str === "SB") return "SLB";
    if (str === "SO") return "SOM";
    if (str === "ZA") return "ZAF";
    if (str === "SS") return "SSD";
    if (str === "ES") return "ESP";
    if (str === "LK") return "LKA";
    if (str === "SD") return "SDN";
    if (str === "SR") return "SUR";
    if (str === "SZ") return "SWZ";
    if (str === "SE") return "SWE";
    if (str === "CH") return "CHE";
    if (str === "SY") return "SYR";
    if (str === "TJ") return "TJK";
    if (str === "TH") return "THA";
    if (str === "MK") return "MKD";
    if (str === "TL") return "TLS";
    if (str === "TG") return "TGO";
    if (str === "TK") return "TKL";
    if (str === "TO") return "TON";
    if (str === "TT") return "TTO";
    if (str === "TN") return "TUN";
    if (str === "TR") return "TUR";
    if (str === "TM") return "TKM";
    if (str === "TV") return "TUV";
    if (str === "UG") return "UGA";
    if (str === "UA") return "UKR";
    if (str === "AE") return "ARE";
    if (str === "GB") return "GBR";
    if (str === "TZ") return "TZA";
    if (str === "US") return "USA";
    if (str === "UY") return "URY";
    if (str === "UZ") return "UZB";
    if (str === "VU") return "VUT";
    if (str === "VE") return "VEN";
    if (str === "VN") return "VNM";
    if (str === "YE") return "YEM";
    if (str === "ZM") return "ZMB";
    if (str === "ZW") return "ZWE";
    else return str;
    }
});
skuid.snippet.register('AddressCompleteShipping',function(args) {var $ = skuid.$;
SetupAddressSearch(
	arguments[0] //Field
	, arguments[1] //Value
	, "PlacesAPI" //Lookup Service Model
	, "GeocodeAPI" //Populate Service Model
	//Edit below values to match the target fields on your Model
	,{ "Street"    : "ShippingStreet"
	    , "Street1" : "Shipping_Address_2__c"
		, "City"    : "ShippingCity"
		, "County"  : "ShippingCounty"
		, "State"   : "ShippingStateCode"
		, "Country" : "ShippingCountryCode"
		, "Zip"     : "ShippingPostalCode"
	}
);

function SetupAddressSearch(field, value, placesAPIModelName, geocodeAPIModelName, targetModelInfo) {
	if(field.mode == 'read') {
		//skuid.ui.fieldRenderers.STRING.read(field, value);
		skuid.ui.getFieldRenderer('STRING').read(field, value);
	}
	else if(field.mode == 'edit') {
		/* Create and grab DOM elements */		
		//skuid.ui.fieldRenderers.STRING.edit(field, value);
        skuid.ui.getFieldRenderer('STRING').edit(field, value);
		var searchID = RandomID();
		var searchResultsID = searchID + "Results";

		var BoxHTML = "<div id='" + searchResultsID + "' class='GoogleAPIAddressPicker' style='position: absolute; max-width: 200%; max-height: 150px; top: 25; left: 0; background: white; margin: 0 0 10px 10px; border: 1px solid #ddd; z-index: 999;overflow-x: hidden; overflow-y: auto;'></div>";

		if(!field.element) { console.error("Field did not contain a DOM element"); return; }
		var $searchContainer = field.element;

		$searchContainer.append(BoxHTML);

		var $searchBox = $searchContainer.find('input');
		if($searchBox.length < 1) { console.error("Error finding the input field in the field element"); return; }
		var $searchResults = $searchContainer.find("#" + searchResultsID);
		if($searchResults.length < 1) { console.error("Error creating the result picker"); return; }

		/* Set up models and conditions */
		var placesAPIModel = skuid.model.getModel(placesAPIModelName);
		if(!placesAPIModel) { console.error("Could not find Google Places API model named " + placesAPIModelName); return; }
		var placesAPICondition = placesAPIModel.getConditionByName("AddressQuery");
		if(!placesAPICondition) { console.error("Could not find 'AddressQuery' condition in " + placesAPIModelName + " model"); return; }
		var geocodeAPIModel = skuid.model.getModel(geocodeAPIModelName);
		if(!geocodeAPIModel) { console.error("Could not find Google Geocode API model named " + geocodeAPIModelName); return; }
		var geocodeAPICondition = geocodeAPIModel.getConditionByName("PlaceIDQuery");
		if(!geocodeAPICondition) { console.error("Could not find 'PlaceIDQuery' condition in " + geocodeAPIModelName + " model"); return; }

		var targetModel = field.model;
		var targetModelFields = {};

		/* Timer for the search to prevent API spamming */
		var runningSearch = false;
        var addressTest = '';
		/* Search Box Changes */
		$searchBox.keypress(function(e) {
			if(runningSearch) clearTimeout(runningSearch);
			runningSearch = setTimeout(function() {
				var searchValue = $searchBox.val();
				if(searchValue.length > 2) {
					if (e.which !== 0) {
						/* Box has met all conditions to initiate API call */
						placesAPIModel.setCondition(placesAPICondition, searchValue);
						placesAPIModel.updateData(function() {
							var options = ''
								, currentList = []
								;
							$.each(placesAPIModel.data, function(i, row) {
							    addressTest = row.formatted_address;
								options += "<a href='javascript:void(0);' id='" + searchResultsID + currentList.length + "' class='AddressPickerItem' style='padding: 3px;'>" + HTMLEscape(row.formatted_address) + '</a><br />';
								currentList.push({ "id" : row.place_id, "address": row.formatted_address });
							});
							$searchResults.html(options);
							$.each(currentList, function(i, row) {
								$('#' + searchResultsID + i).click(function() {
									$searchResults.html('').css({ display: 'none' });
									geocodeAPIModel.setCondition(geocodeAPICondition, row.id);
									geocodeAPIModel.updateData(function() {
										if(geocodeAPIModel.data.length > 0) {
											address = {
												Street: null,
												Street1: null,
												City: null,
												County: null,
												State: null,
												Zip: null,
												Country: null
											};
											$.each(geocodeAPIModel.data, function(i, row) {
												/*switch(row.types[0]) {
													case "street_number":
														//address.Street = (address.Street !== null) ? row.short_name + " " + address.Street : row.short_name;
														address.Street = addressTest;
														break;
													case "route":
														//address.Street = (address.Street !== null) ? address.Street + " " + row.short_name : row.short_name;
														address.Street = addressTest;
														break;
													case "political":
    												    address.Street = addressTest;
	    											    break;
													case "locality" : address.City = row.long_name; break;
													case "administrative_area_level_2": address.County = row.long_name; break;
													case "administrative_area_level_1": address.State = row.short_name; break;
													case "country": address.Country = row.short_name; break;
													case "postal_code": address.Zip = row.long_name; break;
													default: break;
													//alert('targetModelInfo : '+targetModelInfo);
												}*/
												
												var allow1 = ["street_number", "route", "political"];
											    var testadd = '';
  											    if(row){
											       for (j = 0; j < row.types[0].length; j++) {
                                                            if (row.types[0] && row.types[0].length > 0 && allow1.indexOf(row.types[0]) === -1) {
                                                                addressTest = addressTest.replace(row.long_name + ",", "").replace(row.short_name + ",", "");
                                                                if (row.types[0] === "country") {
                                                                    addressTest = addressTest.replace(new RegExp(row.long_name + '$'), "");
                                                                    addressTest = addressTest.replace(new RegExp(countryShortNameList1(row.short_name) + '$'), "");
                                                                } 
                                                            }
                                                            if (j === row.types[0].length - 1) {
                                                                addressTest = addressTest.trim().replace(new RegExp("," + '$'), "");
                                                            }
                                                            if (row.types[0] === "administrative_area_level_1") {
                                                                addressTest = addressTest.replace(row.long_name, ""); 
                                                            } 
                                                            if (row.types[0] === "postal_code") {
                                                                addressTest = addressTest.replace(new RegExp(row.long_name + '$'), "");
                                                                testadd = addressTest;
                                                            } 
                                                            
                                                            
                                                            address.Street = testadd!==''?testadd:address.City;
                                                            address.Street1 = address.Street1!==''?'':'';
                                                            
                                                            if(row.types[0] == 'locality'){
                                                             address.City = row.long_name;
                                                            }
                                                            if(row.types[0] == 'administrative_area_level_2'){
                                                                address.County = row.long_name;
                                                            }
                                                            if(row.types[0] == 'administrative_area_level_1'){
                                                                address.State = row.short_name;
                                                            }
                                                            if(row.types[0] == 'country'){
                                                                address.Country = row.short_name;
                                                            }
                                                            if(row.types[0] == 'postal_code'){
                                                                address.Zip = row.long_name;
                                                            }
											       } 
											   }
											   
											});

											var output = {};

											$.each(targetModelInfo, function(fieldName, resultName) {
												output[resultName] = (address[fieldName] !== undefined) ? address[fieldName] : null;
											});

											targetModel.updateRow(targetModel.data[0], output);
										}
									});
								});
							});
						});
					}
				}
			}, 300);
		}).focus(function() { $searchResults.css({ display: 'block' }); }).blur(function() { setTimeout(function() { $searchResults.css({ display: 'none' }); }, 100); });
	}
}

function HTMLEscape(text) { return $('<div/>').text(text).html(); }

function RandomID() {
	var S4 = function() {
		return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	};
	return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}


var countryShortNameList1 = function (str) {
    if (str === "AF") return "AFG";
    if (str === "AL") return "ALB";
    if (str === "DZ") return "DZA";
    if (str === "AD") return "AND";
    if (str === "AO") return "AGO";
    if (str === "AG") return "ATG";
    if (str === "AR") return "ARG";
    if (str === "AM") return "ARM";
    if (str === "AU") return "AUS";
    if (str === "AT") return "AUT";
    if (str === "AZ") return "AZE";
    if (str === "BS") return "BHS";
    if (str === "BH") return "BHR";
    if (str === "BD") return "BGD";
    if (str === "BB") return "BRB";
    if (str === "BY") return "BLR";
    if (str === "BE") return "BEL";
    if (str === "BZ") return "BLZ";
    if (str === "BJ") return "BEN";
    if (str === "BT") return "BTN";
    if (str === "BO") return "BOL";
    if (str === "BA") return "BIH";
    if (str === "BW") return "BWA";
    if (str === "BR") return "BRA";
    if (str === "BN") return "BRN";
    if (str === "BG") return "BGR";
    if (str === "BF") return "BFA";
    if (str === "BI") return "BDI";
    if (str === "CV") return "CPV";
    if (str === "KH") return "KHM";
    if (str === "CM") return "CMR";
    if (str === "CA") return "CAN";
    if (str === "CF") return "CAF";
    if (str === "TD") return "TCD";
    if (str === "CL") return "CHL";
    if (str === "CN") return "CHN";
    if (str === "CO") return "COL";
    if (str === "KM") return "COM";
    if (str === "CG") return "COG";
    if (str === "CK") return "COK";
    if (str === "CR") return "CRI";
    if (str === "HR") return "HRV";
    if (str === "CU") return "CUB";
    if (str === "CY") return "CYP";
    if (str === "CZ") return "CZE";
    if (str === "CI") return "CIV";
    if (str === "KP") return "PRK";
    if (str === "CD") return "COD";
    if (str === "DK") return "DNK";
    if (str === "DJ") return "DJI";
    if (str === "DM") return "DMA";
    if (str === "DO") return "DOM";
    if (str === "EC") return "ECU";
    if (str === "EG") return "EGY";
    if (str === "SV") return "SLV";
    if (str === "GQ") return "GNQ";
    if (str === "ER") return "ERI";
    if (str === "EE") return "EST";
    if (str === "ET") return "ETH";
    if (str === "FO") return "FRO";
    if (str === "FJ") return "FJI";
    if (str === "FI") return "FIN";
    if (str === "FR") return "FRA";
    if (str === "GA") return "GAB";
    if (str === "GM") return "GMB";
    if (str === "GE") return "GEO";
    if (str === "DE") return "DEU";
    if (str === "GH") return "GHA";
    if (str === "GR") return "GRC";
    if (str === "GD") return "GRD";
    if (str === "GT") return "GTM";
    if (str === "GN") return "GIN";
    if (str === "GW") return "GNB";
    if (str === "GY") return "GUY";
    if (str === "HT") return "HTI";
    if (str === "HN") return "HND";
    if (str === "HU") return "HUN";
    if (str === "IS") return "ISL";
    if (str === "IN") return "IND";
    if (str === "ID") return "IDN";
    if (str === "IR") return "IRN";
    if (str === "IQ") return "IRQ";
    if (str === "IE") return "IRL";
    if (str === "IL") return "ISR";
    if (str === "IT") return "ITA";
    if (str === "JM") return "JAM";
    if (str === "JP") return "JPN";
    if (str === "JO") return "JOR";
    if (str === "KZ") return "KAZ";
    if (str === "KE") return "KEN";
    if (str === "KI") return "KIR";
    if (str === "KW") return "KWT";
    if (str === "KG") return "KGZ";
    if (str === "LA") return "LAO";
    if (str === "LV") return "LVA";
    if (str === "LB") return "LBN";
    if (str === "LS") return "LSO";
    if (str === "LR") return "LBR";
    if (str === "LY") return "LBY";
    if (str === "LT") return "LTU";
    if (str === "LU") return "LUX";
    if (str === "MG") return "MDG";
    if (str === "MW") return "MWI";
    if (str === "MY") return "MYS";
    if (str === "MV") return "MDV";
    if (str === "ML") return "MLI";
    if (str === "MT") return "MLT";
    if (str === "MH") return "MHL";
    if (str === "MR") return "MRT";
    if (str === "MU") return "MUS";
    if (str === "MX") return "MEX";
    if (str === "FM") return "FSM";
    if (str === "MC") return "MCO";
    if (str === "MN") return "MNG";
    if (str === "ME") return "MNE";
    if (str === "MA") return "MAR";
    if (str === "MZ") return "MOZ";
    if (str === "MM") return "MMR";
    if (str === "NA") return "NAM";
    if (str === "NR") return "NRU";
    if (str === "NP") return "NPL";
    if (str === "NL") return "NLD";
    if (str === "NZ") return "NZL";
    if (str === "NI") return "NIC";
    if (str === "NE") return "NER";
    if (str === "NG") return "NGA";
    if (str === "NU") return "NIU";
    if (str === "NO") return "NOR";
    if (str === "OM") return "OMN";
    if (str === "PK") return "PAK";
    if (str === "PW") return "PLW";
    if (str === "PA") return "PAN";
    if (str === "PG") return "PNG";
    if (str === "PY") return "PRY";
    if (str === "PE") return "PER";
    if (str === "PH") return "PHL";
    if (str === "PL") return "POL";
    if (str === "PT") return "PRT";
    if (str === "QA") return "QAT";
    if (str === "KR") return "KOR";
    if (str === "MD") return "MDA";
    if (str === "RO") return "ROU";
    if (str === "RU") return "RUS";
    if (str === "RW") return "RWA";
    if (str === "KN") return "KNA";
    if (str === "LC") return "LCA";
    if (str === "VC") return "VCT";
    if (str === "WS") return "WSM";
    if (str === "SM") return "SMR";
    if (str === "ST") return "STP";
    if (str === "SA") return "SAU";
    if (str === "SN") return "SEN";
    if (str === "RS") return "SRB";
    if (str === "SC") return "SYC";
    if (str === "SL") return "SLE";
    if (str === "SG") return "SGP";
    if (str === "SK") return "SVK";
    if (str === "SI") return "SVN";
    if (str === "SB") return "SLB";
    if (str === "SO") return "SOM";
    if (str === "ZA") return "ZAF";
    if (str === "SS") return "SSD";
    if (str === "ES") return "ESP";
    if (str === "LK") return "LKA";
    if (str === "SD") return "SDN";
    if (str === "SR") return "SUR";
    if (str === "SZ") return "SWZ";
    if (str === "SE") return "SWE";
    if (str === "CH") return "CHE";
    if (str === "SY") return "SYR";
    if (str === "TJ") return "TJK";
    if (str === "TH") return "THA";
    if (str === "MK") return "MKD";
    if (str === "TL") return "TLS";
    if (str === "TG") return "TGO";
    if (str === "TK") return "TKL";
    if (str === "TO") return "TON";
    if (str === "TT") return "TTO";
    if (str === "TN") return "TUN";
    if (str === "TR") return "TUR";
    if (str === "TM") return "TKM";
    if (str === "TV") return "TUV";
    if (str === "UG") return "UGA";
    if (str === "UA") return "UKR";
    if (str === "AE") return "ARE";
    if (str === "GB") return "GBR";
    if (str === "TZ") return "TZA";
    if (str === "US") return "USA";
    if (str === "UY") return "URY";
    if (str === "UZ") return "UZB";
    if (str === "VU") return "VUT";
    if (str === "VE") return "VEN";
    if (str === "VN") return "VNM";
    if (str === "YE") return "YEM";
    if (str === "ZM") return "ZMB";
    if (str === "ZW") return "ZWE";
    else return str;
    }
});
skuid.snippet.register('ValidateContactMailingAddress',function(args) {/*Get all fields from contact model*/
var params = arguments[0], $ = skuid.$;
var modelECad = skuid.model.getModel('NewContact');
var DisplayName = modelECad.getFirstRow().MailingStreet;
var sMailingCity = modelECad.getFirstRow().MailingCity;
var sMailingPostalCode = modelECad.getFirstRow().MailingPostalCode;
var sFirstName = modelECad.getFirstRow().FirstName;
var sLastName = modelECad.getFirstRow().LastName;
var sEmail = modelECad.getFirstRow().Email;
var sPhone = modelECad.getFirstRow().Phone;
var sMobilePhone = modelECad.getFirstRow().MobilePhone;
var sTitle = modelECad.getFirstRow().Title;

/*Trim all fields*/
DisplayName = typeof DisplayName === 'undefined' ? '': DisplayName.trim();
sMailingCity = typeof sMailingCity === 'undefined' ? '': sMailingCity.trim();
sMailingPostalCode = typeof sMailingPostalCode === 'undefined' ? '': sMailingPostalCode.trim();
sFirstName = typeof sFirstName === 'undefined' ? '': sFirstName.trim();
sLastName = typeof sLastName === 'undefined' ? '': sLastName.trim();
sEmail = typeof sEmail === 'undefined' ? '': sEmail.trim();
sPhone = typeof sPhone === 'undefined' ? '': sPhone.trim();
sMobilePhone = typeof sMobilePhone === 'undefined' ? '': sMobilePhone.trim();
sTitle = typeof sTitle === 'undefined' ? '': sTitle.trim();

var regex1 = /^[0-9- ()#+]*$/;
var regex12 = /^[0-9- ()#+]*$/;
var regex = /^[a-zA-Z0-9/!\s@#\$%\'\^\&*?\',):;\[\]\(+=._\-}`{~]+$/g;
var result = DisplayName.match( regex );
var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
var sMinimumSevenDigit = /^(?:[\D]*[0-9][\D]*){0,7}$/;
var sMinimumSevenDigit1 = /^(?:[\D]*[0-9][\D]*){0,7}$/;

/*Get all Custom labels*/
window.$Label = window.$Label || {};
var FirstNameMessage = skuid.utils.mergeAsText("global","{{$Label.FirstNameMessage}}");	  
var LastNameMessage = skuid.utils.mergeAsText("global","{{$Label.LastNameMessage}}");
var BusinessPhoneMessage = skuid.utils.mergeAsText("global","{{$Label.BusinessPhoneMessage}}");
var MobilePhoneMessage = skuid.utils.mergeAsText("global","{{$Label.MobilePhoneMessage}}");
var MailingStreetMessage = skuid.utils.mergeAsText("global","{{$Label.MailingStreetMessage}}");
var MailingCityMessage = skuid.utils.mergeAsText("global","{{$Label.MailingCityMessage}}");
var MailingPostalCodeMessage = skuid.utils.mergeAsText("global","{{$Label.MailingPostalCodeMessage}}");
var FirstNameCharacterMessage = skuid.utils.mergeAsText("global","{{$Label.FirstNameCharacterMessage}}");
var LastNameCharacterMessage = skuid.utils.mergeAsText("global","{{$Label.LastNameCharacterMessage}}");

if(sFirstName === ''){
    alert(FirstNameMessage);
    return false;
} else if(sFirstName!=='' && sFirstName.length > 40){
    alert(FirstNameCharacterMessage);
    return false;
} else if(sLastName === ''){
    alert(LastNameMessage);
    return false;
} else if(sLastName !=='' && sLastName.length > 80){
    alert(LastNameCharacterMessage);
    return false;
} else if(sTitle!=='' && sTitle.length > 128){
    alert('Title: data value too large: '+sTitle+' (max length=128)');
    return false;
} else if(sEmail === ''){
    alert('Email is missing.');
    return false;
} else if(!filter.test(sEmail)){
    alert('Email: invalid email address:'+sEmail);
    sEmail.focus;
    return false;
} else if(sPhone!=='' && (!regex1.test(sPhone) || sMinimumSevenDigit.test(sPhone))){
    alert(BusinessPhoneMessage);
    return false;
} else if(sMobilePhone!=='' && (!regex12.test(sMobilePhone) || sMinimumSevenDigit1.test(sMobilePhone))){
    alert(MobilePhoneMessage);
    return false;
} else if(DisplayName === ''){
    alert(MailingStreetMessage);
    return false;
} else if(sMailingCity === ''){
   alert(MailingCityMessage);
    return false;
}/* else if(sMailingPostalCode === ''){
    alert(MailingPostalCodeMessage);
    return false;
}*/ else {
        skuid.model.save([
            modelECad
        ],{callback: function(result){
            if (result.totalsuccess){
                var r = modelECad.getFirstRow();
                window.location.href = '/apex/ContactDetail_Skuid?id='+r.Id;
            } else {
                console.log(result.insertResults[0]);
            }
        }});
}
});
skuid.snippet.register('AssignAccountValuesToContact',function(args) {/*Get all fields from contact model*/
var params = arguments[0], $ = skuid.$;
var modelECad = skuid.model.getModel('NewContact');
var row = modelECad.getFirstRow();
var sMailingStreet = modelECad.getFirstRow().MailingStreet;
var sMailingCity = modelECad.getFirstRow().MailingCity;
var sMailingPostalCode = modelECad.getFirstRow().MailingPostalCode;
var sFirstName = modelECad.getFirstRow().FirstName;
var sLastName = modelECad.getFirstRow().LastName;
var sEmail = modelECad.getFirstRow().Email;

/*Get fields from Account model*/
var AccountModel = skuid.model.getModel('Account');
var sBillingAddLine2 = AccountModel.getFirstRow().Billing_Address_Line_2__c;
var sBillingStreet = AccountModel.getFirstRow().BillingStreet;

/*concatenate BillingStreet and Billing_Address_Line_2__c*/
var Str = '';
if(typeof sBillingStreet!='undefined'){
    Str = AccountModel.getFirstRow().BillingStreet;
} else {
    Str += '';
}
if(typeof sBillingAddLine2!='undefined'){
    Str += ', '+AccountModel.getFirstRow().Billing_Address_Line_2__c;
} else {
    Str += '';
}
/*Update Contact Row*/
modelECad.updateRow(row, {
    MailingStreet: Str,
    MailingCity: AccountModel.getFirstRow().BillingCity,
    MailingCountryCode: AccountModel.getFirstRow().BillingCountryCode,
    MailingStateCode: AccountModel.getFirstRow().BillingStateCode,
    MailingPostalCode: AccountModel.getFirstRow().BillingPostalCode
});
});
skuid.snippet.register('AddPartner',function(args) {/* Get all fields from contact model */
var params = arguments[0], $ = skuid.$;
var modelECad = skuid.model.getModel('partnerAgg');
var AddPartnerModal = skuid.model.getModel('Add_Partner');
var AccountModel = skuid.model.getModel('Account');

/* Get model row and Id */
var PartnerNewModal = AddPartnerModal.getFirstRow();
var sNewAccountId = PartnerNewModal.AccountToId;
var sAccountFromId =  PartnerNewModal.AccountFromId;
var AccountRow = AccountModel.getFirstRow();
var AccountId = AccountRow.Id;

/* Variables declarations */
var checkDuplicate = false;
var checkDuplicateParent = false;
var counter = 0;
var CountAcc = 0;

/* Trim fields */
sNewAccountId = typeof sNewAccountId === 'undefined' ? '': sNewAccountId.trim();
AccountId = typeof AccountId === 'undefined' ? '': AccountId.trim();

/* Array to pupulate User Id List to pass it to Salesforce */
var uFAList = [];
var lstAccount = [];

/*Add all AccountToId from partnerAgg model in a list*/
if(modelECad) {
    for (var i=0; i<modelECad.data.length; i++) {
        uFAList.push(modelECad.data[i].AccountToId);
    }
}

/*Add all AccountToId from Add_Partner model in a list*/
if(AddPartnerModal) {
    for (var i=0; i<AddPartnerModal.data.length; i++) {
        lstAccount.push(AddPartnerModal.data[i].AccountToId);
    }
}

/* Loop to check for duplicate partner account while choosing in partner account */
for(counter; counter < uFAList.length; counter++) {
    if(uFAList[counter] == sNewAccountId){
        checkDuplicate = true;
    }
}

/* Loop to check for duplicate account while choosing in partner account */
for(CountAcc; CountAcc < lstAccount.length; CountAcc++) {
    if(lstAccount[CountAcc] == AccountId){
            checkDuplicateParent = true;
    }
}

/* Save records into database */
if(checkDuplicate) {
    alert('Duplicate Account Id for Partner!');
    return false;
} else if(sNewAccountId === '' && !checkDuplicate && !checkDuplicateParent) {
    alert('Required Fields have no Value [Account To ID]');
    return false;
} else if(checkDuplicateParent) {
    alert('An Account cannot partner to itself');
    return false;
} else {
    skuid.model.save([
    AddPartnerModal
    ],{callback: function(result){
        if (result.totalsuccess){
            var r = AddPartnerModal.getFirstRow();
            //skuid.model.updateData([AddPartnerModal]);
            window.location.href = '/'+AccountId;
        } else {
            console.log(result.insertResults[0]);
        }
        
    }});
}
});
skuid.snippet.register('ValidateForFirstName',function(args) {/*Get all fields from contact model*/
var params = arguments[0], $ = skuid.$;
var modelECad = skuid.model.getModel('Contacts');
var modelECadrow = modelECad.getFirstRow();
var sFirstName = modelECad.getFirstRow().FirstName;


/*Trim all fields*/
sFirstName = typeof sFirstName === 'undefined' ? '': sFirstName.trim();

/*Get all Custom labels*/
window.$Label = window.$Label || {};
var FirstNameMessage = skuid.utils.mergeAsText("global","{{$Label.FirstNameMessage}}");	

if(sFirstName === ''){
    alert(FirstNameMessage);
    return false;
} else {
    modelECad.updateRow(modelECadrow, {
            FirstName: sFirstName
    }); 
}
});
}(window.skuid));