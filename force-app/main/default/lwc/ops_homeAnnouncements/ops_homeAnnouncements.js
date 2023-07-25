import { LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class Ops_homeAnnouncements  extends LightningElement {
    
    @track modalShowStatus = false;
    @track modalTitle = '';
    @track annId;
    @track esId;
    @track eId;
    connectedCallback() {
        let fullUrl = window.location.href;
        this.esId=this.GetQS(fullUrl,'esid');
        this.eId=this.GetQS(fullUrl,'id');
        this.qryCondition = 'Event_Edition__c =\'' +this.eId + '\'';
    } 
    openEdit(event) {
        this.modalTitle = 'Edit Announcement';
        this.annId = event.detail;
        this.modalShowStatus = true
    }
    addAnnouncement() {
        this.modalTitle = 'Add Announcement'; 
        this.modalShowStatus = true
        this.annId ='';
    }
    refreshTable() {
        try {
            this.template.querySelector('c-common-table').refreshTable();
        }
        catch (error) {
            window.console.error(error);
        }
    }
    onSuccess() {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Record updated successfully!',
                variant: 'Success',
            }),
        );
        this.refreshTable();
        this.annId='';
        this.modalShowStatus = false;
        window.location.href = '/lightning/n/ops_customer_centre_home#id=' + this.eId + '&esid=' + this.esId;

    }
    onsave() {
        this.template.querySelector('.Save').click();
    }
    onError() {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error',
                message: 'Error while updating',
                variant: 'error',
            }),
        );
    }
    closeModal() {
        this.modalShowStatus = false;
        this.annId='';
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
}