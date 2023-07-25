/*
Created By	 : (Himanshu)
Created On	 : Sep 04, 2019
@description : This component is use in form exhibitor   .

Modification log --
Modified By	: 
*/


/* eslint-disable no-console */

import { LightningElement ,track, api,wire} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import {getRecord } from 'lightning/uiRecordApi';
const FIELDS = ['Event_Settings__c.Event_Edition__r.Name'];
export default class Ops_formGeneral extends NavigationMixin(LightningElement) {
    @api recordId='';
    @track eventEditionId;
    @track selectedEventName='';
    @track renderedComponent = true;
    connectedCallback() {
        let fullUrl = window.location.href;
        if (fullUrl.indexOf("#") > -1) {
            let IdEventEditionSettings = decodeURIComponent(fullUrl.split("#id=")[1]);
            this.eventEditionId =  decodeURIComponent(IdEventEditionSettings.split("&esid=")[0]);
            let Id = decodeURIComponent(IdEventEditionSettings.split("&esid=")[1]);
            this.recordId=Id;
        }
    }
    // for get event edition name
    @wire(getRecord, { recordId: '$recordId',fields: FIELDS })
    wiredEventObject({ error, data }) {
        if (data) {
            this.selectedEventName = data.fields.Event_Edition__r.displayValue ? data.fields.Event_Edition__r.displayValue: '';
        } else if (error) {
            this.isLoading = 'hideLoading';
            this.record = undefined;
        }
    }
    
cancelForm(){
    const inputFields = this.template.querySelectorAll(
        'lightning-input-field'
    );
    if (inputFields) {
        inputFields.forEach(field => {
            field.reset();
        });
    }
}

    handleSuccess() {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Record Is Updated',
                variant: 'success',
            }),);

            this.renderedComponent = false;
            setTimeout(() => {
                this.renderedComponent = true;            
            }, 10);   
    }
}