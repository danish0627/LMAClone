import { LightningElement, api, wire, track} from 'lwc';
import { getRecord, updateRecord } from 'lightning/uiRecordApi';
import { getPicklistValues,getObjectInfo } from 'lightning/uiObjectInfoApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import LWCExternal from '@salesforce/resourceUrl/LWCExternal';
import { loadStyle } from 'lightning/platformResourceLoader';
import { refreshApex } from '@salesforce/apex';

import getGenericProductsCustomMetaDataAndStatus from '@salesforce/apex/GenericProductCtrl.getGenericProductsCustomMetaDataAndStatus';
import addValueToPicklistWithGVS from '@salesforce/apex/GenericProductCtrl.addValueToPicklistWithGVS';
import createDependency from '@salesforce/apex/GenericProductCtrl.createDependency';
import createProductsAndPBEs from '@salesforce/apex/GenericProductCtrl.createProductsAndPBEs';

import EventEditionId from '@salesforce/schema/Event_Edition__c.Id';
import EventEditionName from '@salesforce/schema/Event_Edition__c.Name';
import EventEditionSeriesId from '@salesforce/schema/Event_Edition__c.Part_of_Series__c';
import EventEditionPriceBook2Id from '@salesforce/schema/Event_Edition__c.Event_Price_Book__c';
import EventEditionCurrency from '@salesforce/schema/Event_Edition__c.Event_Currency__c';
import EventEditionAlternateCurrency from '@salesforce/schema/Event_Edition__c.Alternate_Currency__c';
import EventEditionCode from '@salesforce/schema/Event_Edition__c.Event_Edition_Code__c';
import EventEditionGenericProdCreated from '@salesforce/schema/Event_Edition__c.Generic_Products_Created__c';

import EventSeriesId from '@salesforce/schema/Event_Series__c.Id';
import EventSeriesName from '@salesforce/schema/Event_Series__c.Name';
import EventSeriesPool from '@salesforce/schema/Event_Series__c.Event_Edition_Pool__c';
import EventSeriesCode from '@salesforce/schema/Event_Series__c.Event_Series_Code__c';
import EventSeriesBrandId from '@salesforce/schema/Event_Series__c.Brand__c';

import BrandId from '@salesforce/schema/Brand__c.Id';
import BrandName from '@salesforce/schema/Brand__c.Name';

import PRODUCT_OBJECT from '@salesforce/schema/Product2';
import PRODUCTBRAND_FIELD from '@salesforce/schema/Product2.Brand__c';
import PRODUCTEEPICKLIST_FIELD from '@salesforce/schema/Product2.Product_Brand__c';
import PRODUCTEEPOOL_FIELD from '@salesforce/schema/Product2.Event_Edition_Pool__c';
import PRODUCTCURRENCY_FIELD from '@salesforce/schema/Product2.CurrencyIsoCode';

import ESPAlternateCurrecyWarning from '@salesforce/label/c.ESP_Alternate_Currecy_Warning';
import ESPGenericProductsCreatedError from '@salesforce/label/c.ESP_Generic_Products_Created_Error';
import ESPGenericProductsCreatedSuccess from '@salesforce/label/c.ESP_Generic_Products_Created_Success';
import ESPGenericProductsFieldError from '@salesforce/label/c.ESP_Generic_Products_Field_Error';

const EventEditionFields = [EventEditionId,EventEditionName,EventEditionSeriesId,EventEditionPriceBook2Id,EventEditionCurrency,EventEditionAlternateCurrency,EventEditionCode,EventEditionGenericProdCreated];
const EventSeriesFields = [EventSeriesId,EventSeriesName,EventSeriesPool,EventSeriesCode,EventSeriesBrandId];
const BrandFields = [BrandId,BrandName];
const TOAST_ERRORTITLE = 'Error!';
const TOAST_SUCCESSTITLE = 'Success!';
const TOAST_WARNINGTITLE = 'Warning!';
const TOAST_ERRORVARIANT = 'error';
const TOAST_SUCCESSVARIANT = 'success';
const TOAST_WARNINGVARIANT = 'warning';
const PVS_BRAND = 'Brand';
const PVS_EVENTEDITIONPOOL = 'Event_Edition_Pool';
const PVS_EVENTEDITION = 'Event_Edition';
const columns = [
    { label: 'Product Name', fieldName: 'Product_Name__c' },
    { label: 'Product Family', fieldName: 'Product_Family__c' },
    { label: 'Event Product Type', fieldName: 'Event_Product_Type__c'},
    { label: 'Standard Unit', fieldName: 'Standard_Unit__c'},
    { label: 'Product Description', fieldName: 'Product_Description__c'},
];

export default class AddGenericProducts extends NavigationMixin(LightningElement) {
    @api recordId;
    @api isClassic = false;
    @track eventEditionId;
    @track eventSeriesId;
    @track brandId;
    @track error;
    @track defaultProductRecordTypeId1;
    @track defaultProductRecordTypeId2;
    @track defaultProductRecordTypeId3;
    @track defaultProductRecordTypeId4;
    columns = columns;
    wiredEEResults;
    wiredESResults;
    loaded = false;
    isSave = false;
    isShowMainContent = false;
    eeFieldsMissing = false;
    esFieldsMissing = false;
    errorMessage = '';
    eventEdition;
    eventSeries;
    brand;
    productCustomMetadata;
    brandPicklist = {};
    eventEditionPoolPicklist = {};
    eventEditionsPicklist = {};
    currencyPicklist = {};
    currencyOptions = [];
    requiredCurrencyOptions = [];
    selectedOtherCurrencies = [];
    selectedOptions = [];
    eventEditionPoolPicklistExist = false;
    eventEditionPicklistExist = false;
    brandPicklistExist = false;
    fieldDependencyExist = false;
    eventEditionPoolValue;
    isShowMessageInClassic = false;
    messageType = false;
    message = '';
    messageTitle = '';
    messageCSSClass = '';
    messageIcon = '';
    messageIconClass = '';

    connectedCallback(){
        //console.log("connectedCallback value====");
        loadStyle(this, LWCExternal);
        this.loaded = false;
        this.isSave = false;
        this.isShowMainContent = false;
        this.eeFieldsMissing = false;
        this.esFieldsMissing = false;
        this.pbeCurrencies = [];
        this.currencyOptions = [];
        this.requiredCurrencyOptions = [];
        this.selectedOptions = [];
        return refreshApex(this.wiredEEResults);
    }

    @wire(getRecord, { recordId: '$eventEditionId', fields: EventEditionFields })
    EventEditionData(value) {
        this.wiredEEResults = value;
        const { data, error } = value;
        if (data) {
            if(!this.isSave){
                //console.log("EventEditionData====",JSON.stringify(value));
                this.eeFieldsMissing = false; 
                let errorMsg = '';
                if(data.fields.Part_of_Series__c.value == null){
                    this.eeFieldsMissing = true; 
                    errorMsg += 'Part of Series';
                }
                if(data.fields.Event_Price_Book__c.value == null){
                    this.eeFieldsMissing = true; 
                    errorMsg += (errorMsg==''?'Event Price Book':', Event Price Book');
                }
                if(data.fields.Event_Currency__c.value == null){
                    this.eeFieldsMissing = true; 
                    errorMsg += (errorMsg==''?'Event Currency':', Event Currency');
                }
                
                if(this.eeFieldsMissing)this.errorMessage = 'Event Edition: ' + errorMsg;
                if(this.eeFieldsMissing && data.fields.Part_of_Series__c.value == null && data.fields.Generic_Products_Created__c.value == false){
                    this.errorMessage = ESPGenericProductsFieldError + '\n' + this.errorMessage;
                    this.showToastMessage(TOAST_ERRORTITLE, TOAST_ERRORVARIANT, this.errorMessage);
                    this.loaded = true;
                    this.closeQuickAction();
                }
                if(data.fields.Generic_Products_Created__c.value == true && !this.isSave){
                    this.errorMessage = ESPGenericProductsCreatedError;
                    this.showToastMessage(TOAST_ERRORTITLE, TOAST_ERRORVARIANT, this.errorMessage);
                    this.loaded = true;
                    this.closeQuickAction();
                }
                this.eventEdition = data;

                if(data.fields.Part_of_Series__c.value != null && data.fields.Generic_Products_Created__c.value == false){
                    this.eventSeriesId = data.fields.Part_of_Series__c.value;
                    refreshApex(this.wiredESResults);
                }
                this.eventEditionPicklistExist = this.eventEditionsPicklist.hasOwnProperty(data.fields.Name.value);
                //console.log("EE value====",this.eventEditionPicklistExist);
                for (var key in this.currencyPicklist) {
                    var obj = {value:key, label:this.currencyPicklist[key]};   
                    this.currencyOptions.push(obj);        
                }
                if(data.fields.Event_Currency__c.value != null){
                    var obj = data.fields.Event_Currency__c.value;   
                    this.requiredCurrencyOptions.push(obj);
                    this.selectedOptions.push(obj);
                    this.selectedOtherCurrencies.push(obj);
                }
                if(data.fields.Alternate_Currency__c.value != null){
                    var obj = data.fields.Alternate_Currency__c.value; 
                    this.requiredCurrencyOptions.push(obj);
                    this.selectedOptions.push(obj);
                    this.selectedOtherCurrencies.push(obj);
                }
                this.error = undefined;     
                //console.log("EE value====",JSON.stringify(this.currencyPicklist));    
            }
        } else if (error) {
            this.error = error;
            this.loaded = true;
        }
    };

    @wire(getRecord, { recordId: '$eventSeriesId', fields: EventSeriesFields })
    EventSeriesData(value) {
        this.wiredESResults = value;
        const { data, error } = value;
        if (data) {
            if(!this.isSave){
                //console.log("ES value====",JSON.stringify(value));
                if(data.fields.Brand__c.value != null){
                    this.brandId = data.fields.Brand__c.value;
                }
                var errorMsg = '';
                if(data.fields.Event_Edition_Pool__c.value == null && data.fields.Event_Series_Code__c.value == null){
                    this.esFieldsMissing = true; 
                    errorMsg = 'Event Series Code';
                }
                if(this.esFieldsMissing){
                    this.errorMessage += this.eeFieldsMissing?'\n':'';
                    this.errorMessage += 'Event Series: ' + errorMsg;
                }
                if(this.esFieldsMissing || this.eeFieldsMissing){
                    this.errorMessage = ESPGenericProductsFieldError + '\n' + this.errorMessage;
                    this.showToastMessage(TOAST_ERRORTITLE, TOAST_ERRORVARIANT, this.errorMessage);
                    this.loaded = true;
                    this.closeQuickAction();
                }
                if(this.eventEdition.fields.Alternate_Currency__c.value == null && this.eeFieldsMissing == false && this.esFieldsMissing == false && !this.isSave){
                    this.showToastMessage(TOAST_WARNINGTITLE, TOAST_WARNINGVARIANT, ESPAlternateCurrecyWarning);
                }
                this.eventSeries = data;
                this.error = undefined;  
                if(data.fields.Event_Series_Code__c.value != null){
                    this.eventEditionPoolValue = data.fields.Event_Edition_Pool__c.value==null?data.fields.Event_Series_Code__c.value:data.fields.Event_Edition_Pool__c.value;
                    this.eventEditionPoolPicklistExist = this.eventEditionPoolPicklist.hasOwnProperty(this.eventEditionPoolValue);
                    if(this.eventEditionPicklistExist){
                        this.fieldDependencyExist = (this.eventEditionsPicklist[this.eventEdition.fields.Name.value].validFor.indexOf(this.eventEditionPoolValue)!=-1)
                    }
                    this.fetchGenericProdutsDetail(); 
                }
                //console.log("ES value====",this.eventEditionPoolPicklistExist);
                //console.log("EE value====",this.fieldDependencyExist);    
            }  
        } else if (error) {
            this.error = error;
            this.loaded = true;
        }
    };

    @wire(getRecord, { recordId: '$brandId', fields: BrandFields })
    BrandData(value) {
        const { data, error } = value;
        if (data) {
            if(!this.isSave){
                //console.log("Brand value====",JSON.stringify(value));
                this.brandPicklistExist = this.brandPicklist.hasOwnProperty(data.fields.Name.value);
                //console.log("Brand value====",this.brandPicklistExist);
                this.brand = data;
                this.error = undefined; 
            }        
        } else if (error) {
           this.error = error;
           this.loaded = true;
       }
    };

    fetchGenericProdutsDetail(){
        getGenericProductsCustomMetaDataAndStatus({eventId:this.recordId})
        .then(result => {
            if(result.isProductsCreated){
                if(!this.isSave){
                    this.errorMessage = ESPGenericProductsCreatedError;
                    this.showToastMessage(TOAST_ERRORTITLE, TOAST_ERRORVARIANT, this.errorMessage);
                    this.loaded = true;
                    this.closeQuickAction();
                }
            }
            else{
                //console.log( 'Called : '+ JSON.stringify(result.lstGenericProducts)); 
                this.productCustomMetadata = result.lstGenericProducts;
                if(!this.isSave)this.loaded = true;
                this.isShowMainContent = true;
            }
        })
        .catch(error => {            
            this.error = error;
            this.loaded = true;
        });
    };

    @wire(getObjectInfo, { objectApiName: PRODUCT_OBJECT })
    objectInfo({ error, data }) {        
        if (data) {                   
            this.defaultProductRecordTypeId1 = data.defaultRecordTypeId;     
            //console.log('defaultRecordTypeId ' + JSON.stringify(data));                 
        } else if (error) {
            //console.log('Er :'+error);
            this.error = error;
            this.loaded = true;
        }
    };

    @wire(getPicklistValues, { recordTypeId: '$defaultProductRecordTypeId1', fieldApiName: PRODUCTEEPOOL_FIELD })
    productEventEditionPoolPickList({ error, data }) {
        if (data) {
            //console.log('productEventEditionPoolPickList '+JSON.stringify(data));
            for (var i = 0; i< data.values.length; i++) {
                var typeValue = data.values[i];   
                this.eventEditionPoolPicklist[typeValue.label] =  typeValue.value;        
            }
            //console.log('productEventEditionPoolPickList 2 '+JSON.stringify(this.eventEditionPoolPicklist));
            this.defaultProductRecordTypeId2 = this.defaultProductRecordTypeId1;
            this.defaultProductRecordTypeId3 = this.defaultProductRecordTypeId1;
        } else if (error) {
            this.error = error;
            this.loaded = true;
        }
    };

    @wire(getPicklistValues, { recordTypeId: '$defaultProductRecordTypeId2', fieldApiName: PRODUCTEEPICKLIST_FIELD })
    productEventEditionPickList({ error, data }) {
        if (data) {
            //console.log('productEventEditionPickList '+JSON.stringify(data));
            let controllerValues = {};
            for (var key in data.controllerValues) {
                var typeValue = data.controllerValues[key];   
                controllerValues[typeValue] =  key;        
            }
            //console.log('productEventEditionPickList 1 '+JSON.stringify(controllerValues));
            for (var i = 0; i< data.values.length; i++) {
                var typeValue = data.values[i];   
                var validFor = typeValue.validFor;
                var obj = {value:typeValue.value,validFor:[]};
                for (var j = 0; j < validFor.length; j++) {
                    var controllingValNum = validFor[j];
                    obj.validFor.push(controllerValues[controllingValNum]);
                }
                this.eventEditionsPicklist[typeValue.label] = obj;        
            }
            //console.log('productEventEditionPickList 2 '+JSON.stringify(this.eventEditionsPicklist));
            this.defaultProductRecordTypeId4 = this.defaultProductRecordTypeId3;
        } else if (error) {
            this.error = error;
            this.loaded = true;
        }
    };

    @wire(getPicklistValues, { recordTypeId: '$defaultProductRecordTypeId3', fieldApiName: PRODUCTBRAND_FIELD })
    productBrandPickList({ error, data }) {
        if (data) {
            //console.log('productBrandPickList '+JSON.stringify(data));
            for (var i = 0; i< data.values.length; i++) {
                var typeValue = data.values[i];   
                this.brandPicklist[typeValue.label] =  typeValue.value;        
            }
            //console.log('productBrandPickList 2 '+JSON.stringify(this.brandPicklist));
        } else if (error) {
            this.error = error;
            this.loaded = true;
        }
    };

    @wire(getPicklistValues, { recordTypeId: '$defaultProductRecordTypeId3', fieldApiName: PRODUCTCURRENCY_FIELD })
    productCurrencyPickList({ error, data }) {
        if (data) {
            //console.log('productCurrencyPickList '+JSON.stringify(data));
            for (var i = 0; i< data.values.length; i++) {
                var typeValue = data.values[i];   
                this.currencyPicklist[typeValue.value] =  typeValue.label;        
            }
            this.eventEditionId = this.recordId;
            //console.log('productCurrencyPickList 2 '+JSON.stringify(this.currencyPicklist));
        } else if (error) {
            this.error = error;
            this.loaded = true;
        }
    };

    showToastMessage(title, variant, message) {
        if(!this.isClassic){
            const event = new ShowToastEvent({
                "title": title,
                "variant": variant,
                "message": message,
                "mode":(variant!=TOAST_SUCCESSVARIANT?'sticky':'dismissible')
            });
            this.dispatchEvent(event);
        }
        else{
            this.messageType = variant;
            this.messageIcon = 'utility:'+variant;
            this.messageCSSClass = 'slds-notify slds-notify_toast slds-theme_'+variant;
            this.messageIconClass = 'slds-icon_container slds-icon-utility-'+variant+' slds-m-right_small slds-no-flex slds-align-top'
            this.message = message;
            this.messageTitle = title;
            this.isShowMessageInClassic = true;
            if(variant==TOAST_ERRORVARIANT)this.isShowBackButton = true;
        }
    };

    closeQuickAction() {
        if(!this.isClassic){
            const closeQA = new CustomEvent('close');
            // Dispatches the event.
            this.dispatchEvent(closeQA);
        }
    };

    handleChange(e) {
        this.selectedOtherCurrencies = e.detail.value;
        //console.log('selectedOtherCurrencies '+JSON.stringify(this.selectedOtherCurrencies));
    };

    handleSave() {
        //console.log('selectedOtherCurrencies '+JSON.stringify(this.selectedOtherCurrencies));
        this.isSave = true;
        this.loaded = false;
        if(this.eventEditionPoolPicklistExist){
            if(this.brandId != null && !this.brandPicklistExist){
                this.addValueToBrandGlobalValueSet();
            }
            else{
                this.addValueToEventEditionGlobalValueSet();
            }
        }
        else{
            this.addValueToEventEditionPoolGlobalValueSet();
        }
    };

    addValueToEventEditionPoolGlobalValueSet(){
        var requestObject = {
            gvsName: PVS_EVENTEDITIONPOOL,
            gvsValue: this.eventEditionPoolValue,
            isCreateDependency: false,
            isAddGVS: (!this.eventEditionPoolPicklistExist),
            objectApiName: "",
            fieldDeveloperName: ""
        };
        addValueToPicklistWithGVS({ requestData: JSON.stringify(requestObject)})
        .then(result => {
            if(result.isSuccess){
                const fields = {};
                fields[EventSeriesId.fieldApiName] = this.eventSeriesId;
                fields[EventSeriesPool.fieldApiName] = this.eventEditionPoolValue;
                const recordInput = { fields };
                updateRecord(recordInput)
                .then(() => {
                    this.eventEditionPoolPicklistExist = true;
                    if(this.brandId != null && !this.brandPicklistExist){
                        this.addValueToBrandGlobalValueSet();
                    }
                    else{
                        this.addValueToEventEditionGlobalValueSet();
                    }
                })
                .catch(errorES => {            
                    this.error = errorES;
                    this.loaded = true;
                });
            }
            else{
                this.showToastMessage(TOAST_ERRORTITLE, TOAST_ERRORVARIANT, result.errorMessage);
                this.loaded = true;
            }
        })
        .catch(error => {            
            this.error = error;
            this.loaded = true;
        });
    };

    addValueToEventEditionGlobalValueSet(){
        this.loaded = false;
        var eventEditionName = this.eventEdition.fields.Name.value;
        var requestObject = {
            gvsName: PVS_EVENTEDITION,
            gvsValue: eventEditionName,
            isCreateDependency: (!this.fieldDependencyExist),
            isAddGVS: (!this.eventEditionPicklistExist),
            objectApiName: "Product2",
            fieldDeveloperName: "Product_Brand"
        };
        //console.log( 'addValueToEventEditionGlobalValueSet : '+ JSON.stringify(requestObject));
        addValueToPicklistWithGVS({ requestData: JSON.stringify(requestObject)})
        .then(result => {
            if(result.isSuccess){
                if(this.fieldDependencyExist){
                    this.createProductAndPbes();
                }
                else{
                    this.createFieldDependency(result);
                }
            }
            else{
                this.showToastMessage(TOAST_ERRORTITLE, TOAST_ERRORVARIANT, result.errorMessage);
                this.loaded = true;
            }
        })
        .catch(error => {            
            this.error = error;
            this.loaded = true;
        });
    };

    addValueToBrandGlobalValueSet(){
        this.loaded = false;
        var brandName = this.brand.fields.Name.value;
        var requestObject = {
            gvsName: PVS_BRAND,
            gvsValue: brandName,
            isCreateDependency: false,
            isAddGVS: (!this.brandPicklistExist),
            objectApiName: "",
            fieldDeveloperName: ""
        };
        addValueToPicklistWithGVS({ requestData: JSON.stringify(requestObject)})
        .then(result => {
            if(result.isSuccess){
                this.brandPicklistExist = true;
                this.addValueToEventEditionGlobalValueSet();
            }
            else{
                this.showToastMessage(TOAST_ERRORTITLE, TOAST_ERRORVARIANT, result.errorMessage);
                this.loaded = true;
            }
        })
        .catch(error => {            
            this.error = error;
            this.loaded = true;
        });
    };

    createFieldDependency(picklistData){
        //console.log( 'result pick detail : '+ picklistData.fieldDetail); 
        var eventEditionName = this.eventEdition.fields.Name.value;
        var eventEditionPool = this.eventEditionPoolValue;
        var fieldDetail = JSON.parse(picklistData.fieldDetail);
        var fieldDetailUpdateTemp = JSON.parse(JSON.stringify(fieldDetail.records[0].Metadata));
        var index = -1;
        for(var i=0; i<fieldDetailUpdateTemp.valueSet.valueSettings.length;i++){
            var valueSetting = fieldDetailUpdateTemp.valueSet.valueSettings[i];
            if(valueSetting.valueName == eventEditionName)index = i;
        }
        //console.log( 'result pick detail index : '+ index); 
        if(index == -1){
            var obj = {valueName:eventEditionName, controllingFieldValue:[]};
            obj.controllingFieldValue.push(eventEditionPool);
            fieldDetailUpdateTemp.valueSet.valueSettings.push(obj);
        }
        else{
            if(fieldDetailUpdateTemp.valueSet.valueSettings[index].controllingFieldValue.indexOf(eventEditionPool) == -1){
                //console.log( 'result pick detail index2 : '+ index); 
                fieldDetailUpdateTemp.valueSet.valueSettings[index].controllingFieldValue.push(eventEditionPool);
            }
        }
        var fieldDetailUpdate = {Metadata:fieldDetailUpdateTemp};
        createDependency({fieldURL: fieldDetail.records[0].attributes.url,requestBody:JSON.stringify(fieldDetailUpdate)})
        .then(result => {
            console.log( 'result pick detail123 : '+ result);
            this.createProductAndPbes();
        })
        .catch(error => {            
            this.error = error;
            this.loaded = true;
        });
    };

    createProductAndPbes(){
        //console.log( 'save : ');
        var brandVal = '';
        if(this.brandId != null && this.brandPicklistExist){
            brandVal = this.brand.fields.Name.value;
        }
        var objRequest = {
            eventEditionId: this.recordId,
            eventEditionName: this.eventEdition.fields.Name.value,
            eventEditionPool: this.eventEditionPoolValue,
            currencies: this.selectedOtherCurrencies.join(","),
            eventPriceBookId: this.eventEdition.fields.Event_Price_Book__c.value,
            brand: brandVal
        };
        //console.log( 'save : '+ JSON.stringify(objRequest));
        createProductsAndPBEs({requestString: JSON.stringify(objRequest)})
        .then(result => {
            //console.log( 'save : '+ result);

            const fields = {};
            fields[EventEditionId.fieldApiName] = this.recordId;
            fields[EventEditionGenericProdCreated.fieldApiName] = true;

            const recordInput = { fields };

            updateRecord(recordInput)
                .then(() => {
                    this.loaded = true;
                    this.isSave = true;
                    this.showToastMessage(TOAST_SUCCESSTITLE, TOAST_SUCCESSVARIANT, ESPGenericProductsCreatedSuccess);
                   
                    if(this.isClassic){
                        this.isShowMainContent = false;
                        this.isShowBackButton = true;
                    }
                    else{
                        this.closeQuickAction();
                    }
                    // Display fresh data in the form
                    //return refreshApex(this.wiredEEResults);
                })
                .catch(error2 => {            
                    this.error = error2;
                    this.loaded = true;
                });
        })
        .catch(error => {            
            this.error = error;
            this.loaded = true;
        });
    };

    handleClickCloseError(){
        this.isShowMessageInClassic = false;
    };

    handleClickGoBack(){
        window.top.location = '/'+this.recordId;
    };
}