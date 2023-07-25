/* eslint-disable no-useless-concat */
import { LightningElement, api, track, wire } from 'lwc';
import { updateRecord, getRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getFormData from '@salesforce/apex/LtngUtilityCtrl.getRecords';
const FIELDS = [
    'Event_Settings__c.Id',
    'Event_Settings__c.Booth_Name__c','Event_Settings__c.Booth_size__c',
    'Event_Settings__c.Exhibiting_As__c','Event_Settings__c.Classification__c',
    'Event_Settings__c.Open_Sides__c','Event_Settings__c.Amount__c',
    'Event_Settings__c.Remaining_Balance__c','Event_Settings__c.UserType__c',
    'Event_Settings__c.Active__c','Event_Settings__c.Event_Edition__r.Name'
];
export default class Ops_customerCentreReferenceTags extends LightningElement {
    @track isLoading = '';
    @api recordId='';
    @track initialData;
    @track eventEditionId;
    @track selectedValues = [];
    @track userOptions = [];
    @track initialSelectedValues = [];
    @track selectedEventName = '';
    @track referenceTagObj ;
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
    wiredEventReferenceTagsObject({ error, data }) {
        if (data) {
            this.selectedValues = [];
            let tempObj = 
            { Id: data.fields.Id ? data.fields.Id.value : '',
             Booth_Name__c: data.fields.Booth_Name__c ? data.fields.Booth_Name__c.value: '', 
             Booth_size__c: data.fields.Booth_size__c ? data.fields.Booth_size__c.value: '', 
             Exhibiting_As__c: data.fields.Exhibiting_As__c ? data.fields.Exhibiting_As__c.value: '', 
             Classification__c : data.fields.Classification__c ? data.fields.Classification__c.value: '', 
             Open_Sides__c: data.fields.Open_Sides__c ? data.fields.Open_Sides__c.value: '', 
             Amount__c: data.fields.Amount__c ? data.fields.Amount__c.value: '', 
             Remaining_Balance__c: data.fields.Remaining_Balance__c ? data.fields.Remaining_Balance__c.value: '',
             UserType__c: data.fields.UserType__c ? data.fields.UserType__c.value: [], 
             Active__c: data.fields.Active__c ? data.fields.Active__c.value: false, 
             Event_Edition_Name: data.fields.Event_Edition__r.displayValue ? data.fields.Event_Edition__r.displayValue: '',
            }
            this.selectedEventName = data.fields.Event_Edition__r.displayValue ? data.fields.Event_Edition__r.displayValue: '';

            getFormData({ objName:'User_Type__c',fieldNames:'Id,Name', compareWith:'',recordId:'',pageNumber:1, pageSize:100})
            .then(result => {
                this.userOptions = [];
                for(let i = 0 ; i< result.recordList.length; i++)  {
                    let obj = {label: result.recordList[i].Name, value : result.recordList[i].Name};
                    this.userOptions.push(obj);
                }
            })
            .catch(er => {
                window.console.log("error..." + JSON.stringify(er));
            });
            if(tempObj.UserType__c != null){
                this.initialSelectedValues =[];
                let selctedUserArr = tempObj.UserType__c.split(';')
                for(let i = 0 ; i< selctedUserArr.length ; i++){
                 this.selectedValues.push(selctedUserArr[i]);
                 this.initialSelectedValues.push(selctedUserArr[i]);
                }
            }
            this.isLoading = 'hideLoading';
            this.referenceTagObj =  JSON.parse(JSON.stringify(tempObj));
            this.initialData = JSON.parse(JSON.stringify(tempObj));
        } else if(error) {
            this.isLoading = 'hideLoading';
            this.record = undefined;
        }
    }
    get selected() {
        return this.selectedValues.length ? this.selectedValues : [];
    }
    handleChangeActorSelector(event){
        this.selectedValues = event.detail.value;
    }
    onChangeHandleForms(event) {
        let temp = {...this.referenceTagObj};
        if(event.target.name === 'boothname'){
            temp.Booth_Name__c = event.target.value;   
        }
        if(event.target.name === 'boothsize'){
            temp.Booth_size__c = event.target.value;
        }
        if(event.target.name === 'exhibiting'){
            temp.Exhibiting_As__c = event.target.value;
        }
        if(event.target.name === 'classification'){
            temp.Classification__c = event.target.value;
        }
        if(event.target.name === 'openside'){
            temp.Open_Sides__c = event.target.value;
        }
        if(event.target.name === 'amount'){
            temp.Amount__c = event.target.value;
        }
        if(event.target.name === 'rbalance'){
            temp.Remaining_Balance__c = event.target.value;
        }
        if(event.target.name === 'activepayment'){
            temp.Active__c = !temp.Active__c;
        }
        this.referenceTagObj = temp;
    }
    ccUrl(){
        window.location.href= '/lightning/n/ops_customer_centre';
     }
     ccsettingUrl(){ 
        window.location.href= '/lightning/n/ops_customer_centre_settings' + '#id='+this.eventEditionId;
     }
     saveBtnClick(){
        let tempObj =  this.referenceTagObj;
        let tempUserType = '';
        for(let i =0 ; i < this.selectedValues.length ; i++){
            tempUserType = tempUserType + this.selectedValues[i] + ';';
        }
        let userTypeToSave = tempUserType.slice(0, -1);
        let record = {
            fields: {
                Booth_Name__c: tempObj.Booth_Name__c, 
                Booth_size__c: tempObj.Booth_size__c,
                Exhibiting_As__c: tempObj.Exhibiting_As__c,
                Classification__c: tempObj.Classification__c, 
                Open_Sides__c: tempObj.Open_Sides__c,
                Amount__c: tempObj.Amount__c,
                Remaining_Balance__c: tempObj.Remaining_Balance__c,
                Active__c: tempObj.Active__c,
                 UserType__c : userTypeToSave,
                Id: tempObj.Id
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
                this.initialData = {...tempObj};
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
     cancelBtnClick() {
         this.selectedValues =  this.initialSelectedValues;
         this.referenceTagObj = this.initialData;
    }
}