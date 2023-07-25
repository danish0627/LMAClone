/*
Created By	 : (Sunil)
Created On	 : Sep 24, 2019
@description : This component is use to show Customer Badge allotment Settings in Customer Center.

Modification log 
Modified By	: 
*/
import { LightningElement, track, api, wire } from 'lwc';
import deleteRecord from '@salesforce/apex/CommonTableController.deleteRecord';
import { handleErrors, showToast } from 'c/lWCUtility';
import { getRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
let FIELDS = ['Booth_Size_Badge_Limit__c.Name', 'Booth_Size_Badge_Limit__c.Match_Product_Entry_Type__c']
let selectedType;

export default class Ops_customerBadgesAllotment extends LightningElement {
    @track esId;
    @track eId;
    @track badgesRules;
    @track pageSize = 10;
    @track totalRecords;
    @track pageNumber = 1;
    @track totalPages = 0;
    @track pageList;
    @track lastind;
    @track showViewedReport = false;
    @track isLoading = true;
    @track srchValue = '';
    @track qryConditionViewed = '';
    @track qryConditionNotViewed = '';
    @track selectedManaul = '';
    @track tablabelYes = '';
    @track tablabelNo = '';
    @track recordId;
    @track isOpenDeleteModal = false;
    @track chkBadgeValue = false;
    @track openNewModal = false;
    @track openEditModal = false;
    @track openEditModalMatched = false;

    @api whereCallFrom = '';
    @api conditionsValue;
    @api conditionsValueForMatched;
    @track chkText = 'Allocate badges by booth size';
    @track BoothAndMatchedShowStatus = true;
    @track isFormula = false;
    @track isFixed = false;
    @track isDefault = true;
    @track errorMessage;
    @track saveDisable=false;

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    badgeAllotment({ error, data }) {
        if (error) {
            let message = 'Unknown error';
            if (Array.isArray(error.body)) {
                message = error.body.map(e => e.message).join(', ');
            } else if (typeof error.body.message === 'string') {
                message = error.body.message;
            }
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error loading contact',
                    message,
                    variant: 'error',
                }),
            );
        } else if (data) {
            let alloType = data.fields.Match_Product_Entry_Type__c.value;
            if (alloType === 'Fixed') {
                this.isDefault = false;
                this.isFixed = true;
                this.isFormula = false;
            }
            else if (alloType === 'Formula') {
                this.isDefault = false;
                this.isFixed = false;
                this.isFormula = true;
            }
            else {
                this.isDefault = true;
                this.isFixed = false;
                this.isFormula = false;
            }

        }
    }

    connectedCallback() {
        let fullUrl = window.location.href;
        this.esId = this.GetQS(fullUrl, 'esid');
        this.eId = this.GetQS(fullUrl, 'id');
        if (this.whereCallFrom === 'boothSize') {
            this.chkText = 'Allocate badges by booth size';
            this.conditionsValue = " Event_Edition__c ='" + this.eId + "'  AND Booth_Type__c=null";
            this.BoothAndMatchedShowStatus = true;
        } else {
            this.chkText = 'Allocate Badges by Matched Product Name';
            this.BoothAndMatchedShowStatus = false;
            this.conditionsValue = " Event_Edition__c ='" + this.eId + "'  AND Booth_Type__c!=null";
        }
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
    srchManual(event) {
        this.srchValue = event.target.value;
        this.isLoading = true;
    }
    handleEditModal(event) {
        this.errorMessage = '';
        this.recordId = event.detail;
        this.saveDisable=true;
        this.openEditModal = true;
    }
    handleEditModalMatchedProduct(event) {
        this.errorMessage = '';
        this.recordId = event.detail;
        this.openEditModalMatched = true;
    }
    onLoad()
    {
        this.saveDisable=false;
    }
    deleteBadge(event) {
        this.recordId = event.target.dataset.recordId;
        this.isOpenDeleteModal = true;
    }
    yesDeleteBadgeRecord() {
        let records = [];
        records.push({ Id: this.recordId, sobjectType: 'Booth_Size_Badge_Limit__c' });
        deleteRecord({ objList: records })
            .then(res => {
                this.isOpenDeleteModal = false;
                if (res > 0) {
                    showToast(this, 'Record Deleted', 'success', 'Success');
                }
            })
            .catch(error => {
                this.isOpenDeleteModal = false;
                handleErrors(this, error);
            })
    }
    closeModal() {
        this.isOpenDeleteModal = false;
        this.openEditModal = false;
        this.openNewModal = false;
        this.openEditModalMatched = false;
        this.errorMessage = '';
    }
    onSucessBadgeUpdated() {
        showToast(this, 'Record Edited Successfully', 'success', 'Success');
        this.openEditModal = false;
        this.openEditModalMatched = false;
        this.template.querySelector('c-events-list-custom-table').refreshTable();
    }
    onSucessBadgeCreated() {
        this.openNewModal = false;
        showToast(this, 'Record Created Successfully', 'success', 'Success');
        this.template.querySelector('c-events-list-custom-table').refreshTable();
    }
    callSaveBtn() {
        this.template.querySelector('.save').click();
    }
    handleNewModal() {
        this.errorMessage = '';
        this.openNewModal = true;
    }
    submitForm(event) {
        event.preventDefault();
        this.errorMessage = '';
        const fields = event.detail.fields;
        let Name = fields.Name;
        let BoothSizeFrom = fields.Booth_Size_From__c;
        let BoothSizeTo = fields.Booth_Size_To__c;
        let BadgesAllowed = fields.Badges_Allowed__c;
        if (Name && BoothSizeFrom  && BoothSizeTo  && BadgesAllowed ) {
            fields.Event_Edition__c = this.eId;
            this.template.querySelector('.globalForm').submit(fields)
        } else {
            this.errorMessage = 'Complete all required fields';
        }
    }
    submitFormEdit(event) {
        event.preventDefault();
        this.errorMessage = '';
        const fields = event.detail.fields;
        let Name = fields.Name;
        let BoothSizeFrom = fields.Booth_Size_From__c;
        let BoothSizeTo = fields.Booth_Size_To__c;
        let BadgesAllowed = fields.Badges_Allowed__c;
        if (!Name || BoothSizeFrom===null || BoothSizeTo===null || BadgesAllowed===null || Name==="" || BoothSizeFrom===""
        || BoothSizeTo==="" || BadgesAllowed==="" )
        {  
            this.errorMessage = 'Complete all required fields';
        }
        else if (BoothSizeFrom >=0  && BoothSizeTo >=0  && BadgesAllowed >=0 ) {
            fields.Event_Edition__c = this.eId;
            this.template.querySelector('.globalEditForm').submit(fields)
        } else {
            this.errorMessage = 'Complete all required fields';
        }
        
    }
    onTypeChange(event) {
        selectedType = event.target.value;
        this.isDefault = false;
        if (!selectedType) {
            this.isDefault = true;
            this.isFixed = false;
            this.isFormula = false;
        }
        if (event.target.value === 'Fixed') {
            this.isFixed = true;
            this.isFormula = false;
        }
        else if (event.target.value === 'Formula') {
            this.isFormula = true;
            this.isFixed = false;
        }
    }
    submitFormMatchedProduct(event) {
        event.preventDefault();
        this.errorMessage = '';
        const fields = event.detail.fields;        
        if (fields.Match_Product_Entry_Type__c) {
            this.template.querySelector('.globalEditFormMatched').submit(fields)
        } else {
            this.errorMessage = 'Please select Match Product Entry Type';
        }
    }
}