/* eslint-disable no-alert */
/* eslint-disable no-console */
import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import getManualData from '@salesforce/apex/LtngUtilityCtrl.getRecords';

export default class Ops_manualPermissions extends NavigationMixin(LightningElement)  {
    @track modalShowStatus = false;
    @track esId;
    @track eId;
    @track recordId;
    @track userMappingObj = {};
    @track test = true;
    @track isLoading = false;
    @track userTypeId;
    @track openNewModal;
    @track errorMessage;
    @track openUserModal;
    @track condition;
    @track fields = 'Manuals__r.Name,Active__c';
    @track fieldLabel = 'Manual,Active';
    @track addCondition;
    @track manualPermId;
    @track openPermissionModal;
    @track activeCheck;
    @track lookupCondition = '';
    

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
    handleRefreshTable() {
        try {
            let table = this.template.querySelectorAll('c-events-list-custom-table');
            table[1].refreshTable();
            table[2].refreshTable();
        } catch (error) {
            window.console.error(error);
        }
    }
    openMyLink(event) {
        this.isLoading = true;
        this.userTypeId = event.detail;
        let eventId = this.eId;
        this.openUserModal = true;
        this.condition = "Manuals__r.Event_Edition__c='"+eventId+"' AND User_Type__c='"+this.userTypeId+"' AND Manuals__r.Required__c = true"
        this.addCondition = "Manuals__r.Event_Edition__c='"+eventId+"' AND User_Type__c='"+this.userTypeId+"' AND Manuals__r.Required__c = false"
        
    }
    closeModal() {
        const inputFields = this.template.querySelectorAll(
            'lightning-input-field'
        );
        if (inputFields) {
            inputFields.forEach(field => {
                field.reset();
            });
        }
        this.openNewModal = false;
        this.openUserModal = false;
        this.isLoading = false;
        
    }
    onSuccess() {
        this.isLoading = false;
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Record updated successfully!',
                variant: 'Success',
            }),
        );
        this.openPermissionModal = false;
        this.handleRefreshTable();
    }
    handleNewModal(){
        this.openNewModal = true;
        this.errorMessage = '';
        let eventId = this.eId;
        this.lookupCondition = "Event_Edition__c='"+eventId+"'"
    }
    setLookupField(event){
        let lookupValue = event.detail.value;
        this.manualLookup = lookupValue;
    }
    handleEditInnerModal(event){
        this.manualPermId = event.detail;
        this.openPermissionModal = true;
        let manPerId = this.manualPermId;
        getManualData({
            objName: "Manuals_Permission__c",
            fieldNames:
                "id,Active__c ",
            compareWith: "id",
            recordId: manPerId,
            pageNumber: 1,
            pageSize: 1
        })
            .then(result => {
                this.activeCheck = result.recordList[0].Active__c;
         })
            .catch(error => {
                window.console.log("error..." + JSON.stringify(error));
            });
        
    }
    submitManualPer(event) {
        event.preventDefault();
        this.errorMessage = '';
        const fields = event.detail.fields;
        let userType = fields.User_Type__c;
        let manualLookup = this.manualLookup;
        if(!userType){
            this.errorMessage = 'Complete all required fields.';
        }
        else if(manualLookup===undefined){
            this.errorMessage = 'Complete all required fields.'; 
        }
        else {
            fields.Manuals__c = manualLookup;
        }
        if (!this.errorMessage) {
            this.template.querySelector('.globalForm').submit(fields)
            }
        this.isLoading = true;
    }
    callSaveBtn() {
        this.template.querySelector('.save').click();
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
    handleManualCreated(){
        this.isLoading = false;
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Record updated successfully!',
                variant: 'Success',
            }),
        );
        this.openNewModal = false;

    }
    closeEditModal(){
        this.openPermissionModal = false;
        this.isLoading = false;
    }
}