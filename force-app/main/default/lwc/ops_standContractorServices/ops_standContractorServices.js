/* eslint-disable no-console */
import { LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//import getManualGeneralData from '@salesforce/apex/LtngUtilityCtrl.getRecords';
import { getRecord } from 'lightning/uiRecordApi';
const FIELDS = ['Event_Settings__c.Disable_this_information__c'];
export default class Ops_standContractorGeneral extends LightningElement {

    //@api recordId='';
    //@track eventEditionId;
    @track esId;
    @track eId;
    @track serviceValue;
    @track saveDisable;
    @track condition;
    @track showTable;
    @track openNewModal;
    @track errorMessage = '';
    @track serviceRecordValue;
    @track openEditModal;
    connectedCallback() {

        let fullUrl = window.location.href;
        this.esId = this.GetQS(fullUrl, 'esid');
        this.eId = this.GetQS(fullUrl, 'id');
        this.condition = "Event_Edition__c='" + this.eId + "'"


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
    @wire(getRecord, { recordId: '$esId', fields: FIELDS })
    wiredEventObject({ error, data }) {
        if (data) {
            let serviceDisableValue = data.fields.Disable_this_information__c.value ? data.fields.Disable_this_information__c.value : '';
            //console.log('disable value ' + serviceDisableValue);
            if (serviceDisableValue === true) {
                this.showTable = false;
            }
            else {
                this.showTable = true;
            }

        } else if (error) {
            this.isLoading = 'hideLoading';
            this.record = undefined;
        }
    }
    getValue(event) {
        this.serviceValue = event.target.value;
        //console.log('Get Value ' + this.serviceValue);
        this.template.querySelector('.save').click();
        if (this.serviceValue === true) {
            this.saveDisable = true;
            this.showTable = false;
        }
        else {
            this.saveDisable = false;
            this.showTable = true;
        }
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

    handleSuccess() {
        this.isLoading = false;
        // this.dispatchEvent(
        //     new ShowToastEvent({
        //         title: 'Success',
        //         message: 'Record Is Updated',
        //         variant: 'success',
        //     }));
        window.location.href = '/lightning/n/ops_stand_contractor#id=' + this.eId + '&esid=' + this.esId;
    }
    openModal() {
        //alert('Hii');
        this.openNewModal = true;
    }
    closeModal() {
        this.errorMessage = '';
        this.openNewModal = false;
        this.openEditModal = false;
    }
    callSaveBtn() {
        this.template.querySelector('.saveRecord').click();
    }
    submitContractorServices(event) {
        this.isLoading = true;
        event.preventDefault();
        this.errorMessage = '';
        const fields = event.detail.fields;
        let contServices = fields.Contractor_Service__c;
        if (!contServices) {
            this.errorMessage = 'Complete all the required fields';
        }
        fields.Event_Edition__c = this.eId;
        if (!this.errorMessage) {
            this.template.querySelector('.globalForms').submit(fields)
        }
    }
    handleServicesCreated() {
        this.isLoading = false;
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Record Is Created',
                variant: 'success',
            }));
        this.openNewModal = false;
        this.handleRefreshTable();
    }
    handleRefreshTable() {
        try {
            //alert(0);
            let table = this.template.querySelectorAll('c-events-list-custom-table');
            table[0].refreshTable();
            //table[2].refreshTable();
        } catch (error) {
            window.console.error(error);
        }
    }
    handleEditModal(event) {
        this.serviceRecordValue = event.detail;
        this.openEditModal = true;
    }
    submitEditServices(event) {
        this.isLoading = true;
        event.preventDefault();
        this.errorMessage = '';
        const fields = event.detail.fields;
        let contServices = fields.Contractor_Service__c;
        if (!contServices) {
            this.errorMessage = 'Complete all the required fields';
        }
        if (!this.errorMessage) {
            this.template.querySelector('.globalEditForm').submit(fields)
        }
    }
    handleEditServices() {
        this.isLoading = false;
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Record Is Updated',
                variant: 'success',
            }));
        this.openEditModal = false;
        this.handleRefreshTable();
    }
}