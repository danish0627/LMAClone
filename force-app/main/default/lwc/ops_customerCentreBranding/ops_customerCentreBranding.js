/* eslint-disable no-useless-concat */
/*
Created By	 : (Garima[STL-46])
Created On	 : August 20, 2019
@description : This component is use to show Branding .

Modification log --
Modified By	: 
*/

/* eslint-disable no-console */
import { LightningElement, track, api, wire } from 'lwc';
import {updateRecord, getRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const FIELDS = [
    'Event_Settings__c.Id',
    'Event_Settings__c.Branding_Color__c','Event_Settings__c.Utility_Navigation_text_Color__c',
    'Event_Settings__c.Main_Nav_Background_Color__c','Event_Settings__c.Main_Nav_Text_Color__c',
    'Event_Settings__c.Footer_background_color__c','Event_Settings__c.Footer_text_color__c',
    'Event_Settings__c.Button_colors__c','Event_Settings__c.Button_Text_Color__c','Event_Settings__c.Event_Edition__r.Name'
];
export default class Ops_customerCentreBranding extends LightningElement {
    @track isLoading = '';
    @api recordId='';
    @track initialData;
    @track brandingArr = [];
    @track getRecordId ;
    @track eventEditionId;
    @track selectedEventName;
    @track brandObj;

    connectedCallback() {
        let fullUrl = window.location.href;
        if (fullUrl.indexOf("#") > -1) {
            let IdEventEditionSettings = decodeURIComponent(fullUrl.split("#id=")[1]);
            this.eventEditionId =  decodeURIComponent(IdEventEditionSettings.split("&esid=")[0]);
            let Id = decodeURIComponent(IdEventEditionSettings.split("&esid=")[1]);
            this.recordId=Id;
        }
    }
    @wire(getRecord, { recordId: '$recordId',fields: FIELDS })
    wiredEventObject({ error, data }) {
        if (data) {
            let tempObj = 
            { 
             Id: data.fields.Id ? data.fields.Id.value : '',
             Branding_Color__c: data.fields.Branding_Color__c ? data.fields.Branding_Color__c.value: '', 
             Utility_Navigation_text_Color__c: data.fields.Utility_Navigation_text_Color__c ? 
             data.fields.Utility_Navigation_text_Color__c.value: '', 
             Main_Nav_Background_Color__c: data.fields.Main_Nav_Background_Color__c ? data.fields.Main_Nav_Background_Color__c.value: '', 
             Main_Nav_Text_Color__c : data.fields.Main_Nav_Text_Color__c ? data.fields.Main_Nav_Text_Color__c.value: '', 
             Footer_background_color__c: data.fields.Footer_background_color__c ? data.fields.Footer_background_color__c.value: '', 
             Footer_text_color__c: data.fields.Footer_text_color__c ? data.fields.Footer_text_color__c.value: '', 
             Button_colors__c: data.fields.Button_colors__c ? data.fields.Button_colors__c.value: '',
             Button_Text_Color__c: data.fields.Button_Text_Color__c ? data.fields.Button_Text_Color__c.value: '',     
            }
            
            this.selectedEventName = data.fields.Event_Edition__r.displayValue ? data.fields.Event_Edition__r.displayValue: '';
            this.isLoading = 'hideLoading';
            this.brandObj =  JSON.parse(JSON.stringify(tempObj));
            this.initialData = JSON.parse(JSON.stringify(tempObj));
        } else if (error) {
            this.isLoading = 'hideLoading';
            this.record = undefined;
        }
    }
    onChangeHandleForms(event) {
       
        let temp = {...this.brandObj};
        if(event.target.name === 'Branding_Color__c'){
            temp.Branding_Color__c = event.target.value;   
        }
        if(event.target.name === 'Utility_Navigation_text_Color__c'){
            temp.Utility_Navigation_text_Color__c = event.target.value;
        }
        if(event.target.name === 'Main_Nav_Background_Color__c'){
            temp.Main_Nav_Background_Color__c = event.target.value;
        }
        if(event.target.name === 'Main_Nav_Text_Color__c'){
            temp.Main_Nav_Text_Color__c = event.target.value;
        }
        if(event.target.name === 'Footer_background_color__c'){
            temp.Footer_background_color__c = event.target.value;
        }
        if(event.target.name === 'Footer_text_color__c'){
            temp.Footer_text_color__c = event.target.value;
        }
        if(event.target.name === 'Button_colors__c'){
            temp.Button_colors__c = event.target.value;
        }
        if(event.target.name === 'Button_Text_Color__c'){
            temp.Button_Text_Color__c = event.target.value;
        }
        this.brandObj = temp;
        
    }
    cancelBtnClick(){
        this.brandObj = this.initialData;
    }
    saveBtnClick(){
        let InsertObj =  this.brandObj;
        let record = {
            fields: {
                Branding_Color__c: InsertObj.Branding_Color__c,
                Utility_Navigation_text_Color__c: InsertObj.Utility_Navigation_text_Color__c,
                Main_Nav_Background_Color__c: InsertObj.Main_Nav_Background_Color__c,
                Main_Nav_Text_Color__c: InsertObj.Main_Nav_Text_Color__c,
                Footer_background_color__c: InsertObj.Footer_background_color__c,
                Footer_text_color__c: InsertObj.Footer_text_color__c,
                Button_colors__c: InsertObj.Button_colors__c,
                Button_Text_Color__c: InsertObj.Button_Text_Color__c,
                Id: InsertObj.Id
            },
        };
        updateRecord(record)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Record Is Updated',
                        variant: 'success',
                    }),
                );
            this.initialData = {...InsertObj};
            })
            .catch(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: 'Error while updating',
                        variant: 'error',
                    }),
                );
            }); 
    }
    GetQS(url,key) {
        //Get querystring  
        var Qs = url.split('?')[1].replace(/^\s+|\s+$/g, '');
        var a = "";
        if (Qs !== "") {
            let qsArr = Qs.split("&");
            for (let i = 0; i < qsArr.length; i++)
                if (qsArr[i].split("=")[0] === key)
                    a = qsArr[i].split("=")[1];
        }
        return a;
    }  
    ccUrl(){
        window.location.href= '/lightning/n/ops_customer_centre';
     }
     ccsettingUrl(){
      let redirectUrl = '/lightning/n/ops_customer_centre_settings' + '#id='+this.eventEditionId;
      window.location.href= redirectUrl;
     }
}