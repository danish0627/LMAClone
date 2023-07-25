import { LightningElement, track } from 'lwc';
import getCmpUserTypeMap from "@salesforce/apex/LtngUtilityCtrl.getRecords";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class Ops_homeUser extends LightningElement  {
    @track modalShowStatus = false;
    @track esId;
    @track eId;
    @track recordId;
    @track userMappingObj = {};
    @track test = true;
    @track isLoading = false;
    @track userTypeId;

    connectedCallback() {
        let fullUrl = window.location.href;
        this.esId = this.GetQS(fullUrl, 'esid');
        this.eId = this.GetQS(fullUrl, 'id');
        this.qryCondition = 'Event_Edition__c =\'' + this.eid + '\'';
    }
    GetQS(url, key) {
        var Qs = url.split('#')[1].replace(/^\s+|\s+$/g, '');
        var a = "";
        if (Qs !== "") {
            let qsArr = Qs.split("&");
            for (let i = 0; i < qsArr.length; i++)
                if (qsArr[i].split("=")[0] === key)
                    a = qsArr[i].split("=")[1];
        }
        return a;
    }
    openMyLink(event) {
        this.isLoading = true;
        this.userTypeId = event.detail;
        getCmpUserTypeMap({ objName: 'ComponentUserTypeMapping__c', fieldNames: 'Id,Name,User_Type__c', compareWith: 'Event_Edition__c', recordId: this.eId, pageNumber: 1, pageSize: 10 })
            .then(result => {
                this.isLoading = false;
                let isRecordExists = false;
                for (let i = 0; i < result.recordList.length; i++) {
                    if (result.recordList[i].User_Type__c === this.userTypeId) {
                        this.recordId = result.recordList[i].Id;
                        isRecordExists = true;
                    }
                }
                if (!isRecordExists) {
                    this.recordId = '';
                }
                this.modalShowStatus = true;
            })
            .catch(error => {
                window.console.log('error...' + JSON.stringify(error));
            });
    }
    closeModal() {
        this.modalShowStatus = false;
    }
    onSuccess() {
        this.recordId='';
        this.isLoading = false;
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Record updated successfully!',
                variant: 'Success',
            }),
        );
        this.modalShowStatus = false;
        window.location.href = '/lightning/n/ops_customer_centre_home#id=' + this.eId + '&esid=' + this.esId;
    } 
    onSubmit() {
        this.isLoading = true;
    } 
    onsave() {
        this.template.querySelector('.Save').click();
    }
    onLoad() {
        this.isLoading = false;
    }
    onError() {
        this.isLoading = false;
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error',
                message: 'Error while updating',
                variant: 'error',
            }),
        );
    }
}