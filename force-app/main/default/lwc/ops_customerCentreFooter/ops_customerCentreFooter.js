/* eslint-disable no-useless-concat */
/*
Created By	 : (Himanshu[STL-51])
Created On	 : August 20, 2019
@description : This component is use to show Footer Setting Page  .

Modification log --
Modified By	: [Aishwarya BK-16654 15 June 2021]
*/

/* eslint-disable no-console */
import { LightningElement, track, api, wire } from 'lwc';
import { updateRecord, getRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const FIELDS = [
    'Event_Settings__c.Id',
    'Event_Settings__c.ShowHours1__c','Event_Settings__c.ShowHours2__c',
    'Event_Settings__c.ShowHours3__c','Event_Settings__c.About_Show__c',
    'Event_Settings__c.FaceBook__c','Event_Settings__c.LinkedIn__c',
    'Event_Settings__c.Twitter__c','Event_Settings__c.YouTube__c','Event_Settings__c.Instagram__c',
    'Event_Settings__c.Link_1_Label__c','Event_Settings__c.Link_1__c',
    'Event_Settings__c.Link_2_Label__c','Event_Settings__c.Link_2__c',
    'Event_Settings__c.Link_3_Label__c','Event_Settings__c.Link_3__c',
    'Event_Settings__c.Link_4_Label__c','Event_Settings__c.Link_4__c','Event_Settings__c.Event_Edition__r.Name'
];

export default class Ops_customerCentreFooter extends LightningElement {
    @track isLoading = '';
    @api recordId='';
    @track initialData;
    @track footerArr = [];
    @track eventEditionId;
    @track footerObj;
    @track selectedEventName;

    connectedCallback() {
        let fullUrl = window.location.href;
        if (fullUrl.indexOf("#") > -1) {
            let IdEventEditionSettings = decodeURIComponent(fullUrl.split("#id=")[1]);
            this.eventEditionId =  decodeURIComponent(IdEventEditionSettings.split("&esid=")[0]);
            let Id = decodeURIComponent(IdEventEditionSettings.split("&esid=")[1]);
            this.recordId=Id;
        }
    }
    @wire(getRecord, { recordId: '$recordId', fields: FIELDS})
    wiredEventObject({ error, data }) {
        if (data) {
            let tempObj = 
            { Id: data.fields.Id ? data.fields.Id.value : '',
             ShowHours1__c: data.fields.ShowHours1__c ? data.fields.ShowHours1__c.value: '', 
             ShowHours2__c: data.fields.ShowHours2__c ? data.fields.ShowHours2__c.value: '', 
             ShowHours3__c: data.fields.ShowHours3__c ? data.fields.ShowHours3__c.value: '', 
             About_Show__c : data.fields.About_Show__c ? data.fields.About_Show__c.value: '', 
             FaceBook__c: data.fields.FaceBook__c ? data.fields.FaceBook__c.value: '', 
             LinkedIn__c: data.fields.LinkedIn__c ? data.fields.LinkedIn__c.value: '', 
             Twitter__c: data.fields.Twitter__c ? data.fields.Twitter__c.value: '',
             YouTube__c: data.fields.YouTube__c ? data.fields.YouTube__c.value: '', 
             Instagram__c: data.fields.Instagram__c ? data.fields.Instagram__c.value: '',
             Link_1_Label__c: data.fields.Link_1_Label__c ? data.fields.Link_1_Label__c.value: '', 
             Link_1__c: data.fields.Link_1__c ? data.fields.Link_1__c.value: '',
             Link_2_Label__c: data.fields.Link_2_Label__c ? data.fields.Link_2_Label__c.value: '',
             Link_2__c: data.fields.Link_2__c ? data.fields.Link_2__c.value: '',
             Link_3_Label__c: data.fields.Link_3_Label__c ? data.fields.Link_3_Label__c.value: '', 
             Link_3__c: data.fields.Link_3__c ? data.fields.Link_3__c.value: '', 
             Link_4_Label__c: data.fields.Link_4_Label__c ? data.fields.Link_4_Label__c.value: '',
             Link_4__c: data.fields.Link_4__c ? data.fields.Link_4__c.value: '',
            }
            this.selectedEventName = data.fields.Event_Edition__r.displayValue ? data.fields.Event_Edition__r.displayValue: '';
            this.isLoading = 'hideLoading';
            this.footerObj =  JSON.parse(JSON.stringify(tempObj));
            this.initialData = JSON.parse(JSON.stringify(tempObj));
        } else if (error) {
            this.record = undefined;
        }
    }
    onChangeHandleForms(event) {
        let temp = {...this.footerObj};
        if(event.target.name === 'showhours1'){
            temp.ShowHours1__c = event.target.value;   
        }
        if(event.target.name === 'showhours2'){
            temp.ShowHours2__c = event.target.value;
        }
        if(event.target.name === 'showhours3'){
            temp.ShowHours3__c = event.target.value;
        }
        if(event.target.name === 'about'){
            temp.About_Show__c = event.target.value;  
        }
        if(event.target.name === 'fb'){
            temp.FaceBook__c = event.target.value;
        }
        if(event.target.name === 'linked'){
            temp.LinkedIn__c = event.target.value;
        }
        if(event.target.name === 'twitter'){
            temp.Twitter__c = event.target.value;
        }
        if(event.target.name === 'youtube'){
            temp.YouTube__c = event.target.value;
        }
        if(event.target.name === 'insta'){
            temp.Instagram__c = event.target.value;
        }
        
        if(event.target.name === 'link1lbl'){
            temp.Link_1_Label__c = event.target.value;   
        }
        if(event.target.name === 'link1val'){
            temp.Link_1__c = event.target.value;
        }
        if(event.target.name === 'link2lbl'){
            temp.Link_2_Label__c = event.target.value;
        }
        if(event.target.name === 'link2val'){
            temp.Link_2__c = event.target.value;
        }
        if(event.target.name === 'link3lbl'){
            temp.Link_3_Label__c = event.target.value;
        }
        if(event.target.name === 'link3val'){
            temp.Link_3__c = event.target.value;
        }
        if(event.target.name === 'link4lbl'){
            temp.Link_4_Label__c = event.target.value;
        }
        if(event.target.name === 'link4val'){
            temp.Link_4__c = event.target.value;
        }
        this.footerObj = temp;

    }
    saveBtnClick (){
        let InsertObj =  this.footerObj;
        let record = {
            fields: {
                ShowHours1__c: InsertObj.ShowHours1__c,
                ShowHours2__c: InsertObj.ShowHours2__c,
                ShowHours3__c: InsertObj.ShowHours3__c,
                About_Show__c: InsertObj.About_Show__c,
                FaceBook__c: InsertObj.FaceBook__c,
                LinkedIn__c: InsertObj.LinkedIn__c,
                Twitter__c: InsertObj.Twitter__c,
                YouTube__c: InsertObj.YouTube__c,
                Instagram__c: InsertObj.Instagram__c,
                Link_1_Label__c: InsertObj.Link_1_Label__c,
                Link_1__c: InsertObj.Link_1__c,
                Link_2_Label__c: InsertObj.Link_2_Label__c,
                Link_2__c: InsertObj.Link_2__c,
                Link_3_Label__c: InsertObj.Link_3_Label__c,
                Link_3__c: InsertObj.Link_3__c,
                Link_4_Label__c: InsertObj.Link_4_Label__c,
                Link_4__c: InsertObj.Link_4__c,
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
    cancelBtnClick(){
        let temp = {...this.initialData};
        this.footerObj = this.initialData;
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