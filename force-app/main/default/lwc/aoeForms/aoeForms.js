/* eslint-disable no-console */
import { LightningElement, track, api } from 'lwc';
import customerFrmLst from '@salesforce/apex/AgentOwnedExhibitorForms.customerFormList';
import viewedRecord from '@salesforce/apex/AgentOwnedExhibitorForms.viewedRecord';
import getContentVerId from '@salesforce/apex/AgentOwnedExhibitorForms.getContentVersionId';
import formName from '@salesforce/label/c.FORM_NAME';
import Provider from '@salesforce/label/c.Provider';
import Type from '@salesforce/label/c.Type';
import Deadline from '@salesforce/label/c.Deadline';
import Status from '@salesforce/label/c.Status';
import LastUpdated from '@salesforce/label/c.Last_Updated';
import By from '@salesforce/label/c.By';
import ReqForms from '@salesforce/label/c.Required_Forms';
import Additional from '@salesforce/label/c.Additional';
import Forms from '@salesforce/label/c.Forms';
import Close from '@salesforce/label/c.Close';
import Cancel from '@salesforce/label/c.Cancel';
import LinkPdfFormAlert from '@salesforce/label/c.Link_and_Pdf_Form_Alert';
import FormAgreement from '@salesforce/label/c.Form_Agreement';
import Agree from '@salesforce/label/c.Agree';
import handleErrors from 'c/lWCUtility';

export default class AoeForms extends LightningElement {
    label = { formName, Provider, Type, Deadline, LastUpdated, By, ReqForms, Additional, Forms, Close, Cancel, LinkPdfFormAlert, FormAgreement, Agree, Status };
    @track dataArr = [];
    @track arrowdown = true;
    @track arrowUp = true;
    @api isReadOnly = false;
    @track requiredForms;
    @track additionalForms;
    @track addSize =false;
    @api eventCode;
    @api accountId;
    @track items = [];
    @track bShowModal = false;
    @track linkUrl;
    @track url;
    @track formType;
    @track attch;
    @track objectInfo;
    @track showLinkOrPdfDialog = false;
    @track sortingReqMap = { 1: 'asc', 2: 'asc', 3: 'asc', 4: 'asc', 5: 'asc' };
    @track sortingAddMap = { 1: 'asc', 2: 'asc', 3: 'asc', 4: 'asc', 5: 'asc' };

    addForms = this.label.Additional+ ' ' +this.label.Forms;
    lastUpdatedBy = this.label.LastUpdated+' '+this.label.By;

    connectedCallback() {
        this.getAllFormsData();

    }

    getAllFormsData() {
        if (this.accountId && this.eventCode) {
            customerFrmLst({ accId: this.accountId, eventCode: this.eventCode })
                .then(data => {
                    //console.log('data ' + JSON.stringify(data));
                    this.dataArr = data;
                    this.requiredForms = [];
                    this.additionalForms = [];
                    for (let i = 0; i < data.requiredForms.length; i++) {
                        if (data.requiredForms[i].Form_Permission__r.Event_Edition_Form__r.FormType__c === 'Online') {
                            data.requiredForms[i].isOnline = true;
                            data.requiredForms[i].formsName = data.requiredForms[i].Form_Permission__r.Event_Edition_Form__r.Forms__r.Name;
                            data.requiredForms[i].provider = data.requiredForms[i].Form_Permission__r.Event_Edition_Form__r.Provider__c;
                            data.requiredForms[i].formType = data.requiredForms[i].Form_Permission__r.Event_Edition_Form__r.FormType__c;
                            data.requiredForms[i].deadLine = data.requiredForms[i].Form_Permission__r.Event_Edition_Form__r.Deadline__c;
                            data.requiredForms[i].status = data.requiredForms[i].StatusDisplay__c;
                        }
                        else {
                            data.requiredForms[i].isOnline = false;
                            data.requiredForms[i].formsName = data.requiredForms[i].Form_Permission__r.Event_Edition_Form__r.Forms__r.Name;
                            data.requiredForms[i].provider = data.requiredForms[i].Form_Permission__r.Event_Edition_Form__r.Provider__c;
                            data.requiredForms[i].formType = data.requiredForms[i].Form_Permission__r.Event_Edition_Form__r.FormType__c;
                            data.requiredForms[i].deadLine = data.requiredForms[i].Form_Permission__r.Event_Edition_Form__r.Deadline__c;
                            data.requiredForms[i].status = data.requiredForms[i].StatusDisplay__c;

                        }
                        if (data.requiredForms[i].Last_Updated_By__c && data.requiredForms[i].Last_Updated_Date__c) {
                            data.requiredForms[i].updatedBy = data.requiredForms[i].Last_Updated_By__r.Name;
                            data.requiredForms[i].updatedDate = data.requiredForms[i].Last_Updated_Date__c;
                        }
                        this.requiredForms.push(data.requiredForms[i]);
                    }
                    for (let i = 0; i < data.additionalForms.length; i++) {
                        if (data.additionalForms[i].Form_Permission__r.Event_Edition_Form__r.FormType__c === 'Online') {
                            data.additionalForms[i].isOnline = true;
                            data.additionalForms[i].formsName = data.additionalForms[i].Form_Permission__r.Event_Edition_Form__r.Forms__r.Name;
                            data.additionalForms[i].provider = data.additionalForms[i].Form_Permission__r.Event_Edition_Form__r.Provider__c;
                            data.additionalForms[i].formType = data.additionalForms[i].Form_Permission__r.Event_Edition_Form__r.FormType__c;
                            data.additionalForms[i].deadLine = data.additionalForms[i].Form_Permission__r.Event_Edition_Form__r.Deadline__c;
                            data.additionalForms[i].status = data.additionalForms[i].StatusDisplay__c;
                        }
                        else {
                            data.additionalForms[i].isOnline = false;
                            data.additionalForms[i].formsName = data.additionalForms[i].Form_Permission__r.Event_Edition_Form__r.Forms__r.Name;
                            data.additionalForms[i].provider = data.additionalForms[i].Form_Permission__r.Event_Edition_Form__r.Provider__c;
                            data.additionalForms[i].formType = data.additionalForms[i].Form_Permission__r.Event_Edition_Form__r.FormType__c;
                            data.additionalForms[i].deadLine = data.additionalForms[i].Form_Permission__r.Event_Edition_Form__r.Deadline__c;
                            data.additionalForms[i].status = data.additionalForms[i].StatusDisplay__c;
                        }
                        if (data.additionalForms[i].Last_Updated_By__c && data.additionalForms[i].Last_Updated_Date__c) {
                            data.additionalForms[i].updatedBy = data.additionalForms[i].Last_Updated_By__r.Name;
                            data.additionalForms[i].updatedDate = data.additionalForms[i].Last_Updated_Date__c;
                        }
                        this.addSize = true;
                        this.additionalForms.push(data.additionalForms[i]);
                    }
                })
                .catch(error => {
                    console.log("error" + JSON.stringify(error));
                    this.error = error;
                });
        }
    }

    updateSingleForm(isViewed,isFilled)
    {
        viewedRecord({ id: this.objectInfo, isViewed: isViewed, isFilled: isFilled })
        .then(data => {
            if(data.length>0)
            {
                this.getAllFormsData();
            }
        })
        .catch(error=>{
            handleErrors(this,error);
        })
    }

    handleLinkPdf() {
        if (this.formType === 'Link') {
            //this.linkUrl.includes("http:");
            window.open(this.linkUrl);
            this.showLinkOrPdfDialog = false;
            //console.log('this.objectInfo ' + this.objectInfo);
            if (this.isReadOnly === false) 
            {
                //window.parent.location.reload();
                //viewedRecord({ id: this.objectInfo, isViewed: true, isFilled: true });
                this.updateSingleForm(true,true);
            }
        }
        else if (this.formType === 'Downloadable PDF') {
            window.open(this.url, '_blank');
            this.showLinkOrPdfDialog = false;
            if (this.isReadOnly === false) {
                //window.parent.location.reload();
                // viewedRecord({ id: this.objectInfo, isViewed: true, isFilled: true });
                this.updateSingleForm(true,true);
            }
        }
    }

    sortReqData(event) {
        let n = event.currentTarget.getAttribute("data-index");
        let key_map = {
            1: 'formsName',
            2: 'provider',
            3: 'formType',
            4: 'deadLine',
            5: 'status'
        };
        let sortFieldName = key_map[n];
        let sorting_map = this.sortingReqMap;
        let sortDirection = sorting_map[n];

        let data = this.requiredForms;
        //function to return the value stored in the field
        let key = (a) => a[sortFieldName];
        let reverse = sortDirection === 'asc' ? 1 : -1;
        data.sort((a, b) => {
            let valueA = key(a) ? key(a).toLowerCase() : '';
            let valueB = key(b) ? key(b).toLowerCase() : '';
            return reverse * ((valueA > valueB) - (valueB > valueA));
        });
        //set sorted data to opportunities attribute
        this.requiredForms = data;
        if (sorting_map[n] === 'asc') {
            sorting_map[n] = 'desc';
        }
        else {
            sorting_map[n] = 'asc';
        }
        this.sortingReqMap = sorting_map;
    }

    sortAdditionalData(event) {
        let n = event.currentTarget.getAttribute("data-index");
        let key_map = {
            1: 'formsName',
            2: 'provider',
            3: 'formType',
            4: 'deadLine',
            5: 'status'
        };
        let sortFieldName = key_map[n];
        let sorting_map = this.sortingAddMap;
        let sortDirection = sorting_map[n];

        let data = this.additionalForms;
        //function to return the value stored in the field
        let key = (a) => a[sortFieldName];
        let reverse = sortDirection === 'asc' ? 1 : -1;
        data.sort((a, b) => {
            let valueA = key(a) ? key(a).toLowerCase() : '';
            let valueB = key(b) ? key(b).toLowerCase() : '';
            return reverse * ((valueA > valueB) - (valueB > valueA));
        });
        //set sorted data to opportunities attribute
        this.additionalForms = data;
        if (sorting_map[n] === 'asc') {
            sorting_map[n] = 'desc';
        }
        else {
            sorting_map[n] = 'asc';
        }
        this.sortingAddMap = sorting_map;
    }

    handleClick(event) {
        let targetId = event.currentTarget.getAttribute("data-target-id");
        this.formType = event.currentTarget.getAttribute("data-target-type");
        this.attch = event.currentTarget.getAttribute("data-target-attchid");
        let deadline = event.currentTarget.getAttribute("data-endeddate");
        let allowSubmitAfterDeadline = event.currentTarget.getAttribute("data-deadline");
        this.objectInfo = event.currentTarget.getAttribute("data-target-object");
        let isFilled = event.currentTarget.getAttribute("data-isfilled");
        this.linkUrl = event.currentTarget.getAttribute("data-target-url");

        let today = new Date();
        let date2 = new Date(deadline);
        // check if link url contains http or https
        if(this.linkUrl !== null && (!this.linkUrl.includes("http:") && !this.linkUrl.includes("https:")) ) 
        {
            this.linkUrl = "https://" +this.linkUrl;
        }
        if (this.formType === 'Link') {
            if (allowSubmitAfterDeadline === 'true' || deadline == null) {
                //this.linkUrl = event.currentTarget.getAttribute("data-target-url");
                if (isFilled === 'true') {
                    window.open(this.linkUrl);
                    if (this.isReadOnly === false) {
                        // window.parent.location.reload();
                        // viewedRecord({ id: this.objectInfo, isViewed: true, isFilled: true });
                        this.updateSingleForm(true,true);
                    }
                }
                else if(this.isReadOnly === false){
                    this.showLinkOrPdfDialog = true;
                }
                else{
                    window.open(this.linkUrl);
                }
            }
            else if (allowSubmitAfterDeadline === 'false' && date2 >= today && deadline != null) {
                //this.linkUrl = event.currentTarget.getAttribute("data-target-url");
                if (isFilled === 'true') {
                    window.open(this.linkUrl);
                    if (this.isReadOnly === false) {
                        // window.parent.location.reload();
                        // viewedRecord({ id: this.objectInfo, isViewed: true, isFilled: true });
                        this.updateSingleForm(true,true);
                    }
                }
                else if(this.isReadOnly === false){
                    this.showLinkOrPdfDialog = true;
                }
                else{
                    window.open(this.linkUrl);
                }
            }
            else {
                this.bShowModal = true;
            }

        }
        else if (this.formType === 'Downloadable PDF') 
        { 
            let attid = this.attch;
            let fileId1 = attid.toString();
            let fileId2 = fileId1.match(/00P/);
                if (fileId2) 
                {
                    this.url = 'https://' + window.location.host + '/CustomerCenter/servlet/servlet.FileDownload?file=' + attid;

                    if (allowSubmitAfterDeadline === 'true' || deadline == null) 
                    {  // after 1st time reseller
                        if (isFilled === 'true') {
                            window.open(this.url, '_blank');
                            if (this.isReadOnly === false) {
                                this.updateSingleForm(true,true);
                            }
                        }
                        else if(this.isReadOnly === false)  // 1st time reseller
                        {
                            this.showLinkOrPdfDialog = true;
                        }
                        else{
                            window.open(this.url, '_blank');  // For Agent 
                        }

                    } else if (allowSubmitAfterDeadline === 'false' && (date2 >= today && deadline != null)) {
                        if (isFilled === 'true') {
                            window.open(this.url, '_blank');
                            if (this.isReadOnly === false) {
                                this.updateSingleForm(true,true);
                            }
                        }
                        else if(this.isReadOnly === false){
                            this.showLinkOrPdfDialog = true;
                        }
                        else{
                            window.open(this.url, '_blank');
                        }

                    } else if (deadline == null) {
                        if (isFilled === 'true') {
                            window.open(this.url, '_blank');
                            if (this.isReadOnly === false) {
                                this.updateSingleForm(true,true);
                            }
                        }
                        else if(this.isReadOnly === false){
                            this.showLinkOrPdfDialog = true;
                        }
                        else{
                            window.open(this.url, '_blank');
                        }
                    } else {
                        this.bShowModal = true;
                    }
                } else {
                    getContentVerId({
                        docId: attid
                    })
                    .then(result => 
                        {
                            let fileId = result.Id;
                            this.url = 'https://' + window.location.host + '/CustomerCenter/sfc/servlet.shepherd/version/download/' + fileId;
                            
                            if (allowSubmitAfterDeadline === 'true' || deadline == null) 
                            {
                                if (isFilled === 'true') 
                                {
                                   
                                    window.open(this.url, '_blank');
                                    if (this.isReadOnly === false) {
                                        this.updateSingleForm(true,true);
                                    }
                                }
                                else if(this.isReadOnly === false){
                                    this.showLinkOrPdfDialog = true;
                                }
                                else{
                                    window.open(this.url, '_blank');
                                }
        
                            } else if (allowSubmitAfterDeadline === 'false' && (date2 >= today && deadline != null)) 
                            {
                                if (isFilled === 'true') {
                                    window.open(this.url, '_blank');
                                    if (this.isReadOnly === false) {
                                        this.updateSingleForm(true,true);
                                    }
                                }
                                else if(this.isReadOnly === false){
                                    this.showLinkOrPdfDialog = true;
                                }
                                else{
                                    window.open(this.url, '_blank');
                                }
        
                            } else if (deadline == null) 
                            {
                                if (isFilled === 'true') 
                                {
                                    window.open(this.url, '_blank');
                                    if (this.isReadOnly === false) {
                                        this.updateSingleForm(true,true);
                                    }
                                }
                                else if(this.isReadOnly === false){
                                    this.showLinkOrPdfDialog = true;
                                }
                                else{
                                    window.open(this.url, '_blank');
                                }
                            } else {
                                this.bShowModal = true;
                            }

                    })
                    .catch(error => {
                        window.console.log("error..." + JSON.stringify(error));
                    });
            }


        }
        else 
        {
            if (allowSubmitAfterDeadline === 'true' || deadline == null) {
                let urlEventCode = 'https://' + window.location.host + '/CustomerCenter/s/formpreview?Id=' + targetId + '&eventcode=' + this.eventCode + '&accId=' + this.accountId
                window.open(urlEventCode, '_self');
                this.updateSingleForm(true,isFilled);
            }
            else if (date2 >= today && deadline != null && allowSubmitAfterDeadline === 'false') {
                let urlEventCode = 'https://' + window.location.host + '/CustomerCenter/s/formpreview?Id=' + targetId + '&eventcode=' + this.eventCode + '&accId=' + this.accountId
                window.open(urlEventCode, '_self');
                this.updateSingleForm(true,isFilled);
            }
            else {
                this.bShowModal = true;
            }
        }

    }

    closeModal() {
        this.bShowModal = false;
    }

    closeLinkPdfModal() {
        this.showLinkOrPdfDialog = false;
    }

}