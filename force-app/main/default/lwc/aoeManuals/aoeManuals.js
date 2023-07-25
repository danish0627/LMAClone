/* eslint-disable vars-on-top */
import { LightningElement, track, api } from 'lwc';

//Import Apex methods
import getAllManuals from '@salesforce/apex/AgentOwnedExhibitorManuals.getAllManuals';
import updateViewedAndAgreed from '@salesforce/apex/AgentOwnedExhibitorManuals.updateViewedAndAgreed';

//Import custom labels
import Required from '@salesforce/label/c.Required';
import FORM_NAME from '@salesforce/label/c.FORM_NAME';
import Provider from '@salesforce/label/c.Provider';
import Deadline from '@salesforce/label/c.Deadline';
import Viewed from '@salesforce/label/c.Viewed';
import Agreed from '@salesforce/label/c.Agreed';
import Additional from '@salesforce/label/c.Additional';
import Manuals from '@salesforce/label/c.Manuals';
import Cancel from '@salesforce/label/c.Cancel';
import Save from '@salesforce/label/c.Save';
import Read_and_agree_document from '@salesforce/label/c.Read_and_agree_document';
import Download from '@salesforce/label/c.Download';
import Pdf from '@salesforce/label/c.Pdf';
import Last_Updated from '@salesforce/label/c.Last_Updated';
import By from '@salesforce/label/c.By';
import Manual_has_been_expired from '@salesforce/label/c.Manual_has_been_expired';
import getContentVerId from '@salesforce/apex/OPS_FormTemplatesCtrl.getContentVersionId';

export default class AoeManuals extends LightningElement {

    //Custom Labels
    requiredManualsLabel = Required + ' ' + Manuals;
    additionalManualsLabel = Additional + ' ' + Manuals;
    formNameLabel = FORM_NAME;
    providerLabel = Provider;
    deadLineLabel = Deadline;
    viewedLabel = Viewed;
    agreedLabel = Agreed;
    cancelLabel = Cancel;
    saveLabel = Save;
    readAndAgreeLabel = Read_and_agree_document;
    downloadLabel = Download;
    pdfLabel = Pdf;
    lastUpdatedLabel = Last_Updated;
    byLabel = By;
    manualExpiredLabel = Manual_has_been_expired;

    //Public Variable
    @api accountId;
    @api eventCode;
    @api isReadOnly;

    //Private Reactive variables
    @track requiredManuals;
    @track additionalManuals;
    @track showManualFlag;
    @track manualURL;
    @track manualDownloadURL;
    @track currentManual;
    @track isReadAndAgreed;
    //@track isAlreadyViewed;
    @track isAllowedToView;
    @track enableSaveBtn;

    //Private variables
    disableReadAndAgree;
    requiredSortingMap = { 1: 'asc', 2: 'asc', 3: 'asc', 4: 'asc', 5: 'asc' };
    additionalSortingMap = { 1: 'asc', 2: 'asc', 3: 'asc', 4: 'asc', 5: 'asc' };

    //Lifecycle hooks
    connectedCallback() {
        this.getAllManualsData();
        this.resetValues();
        // this.isReadOnly = false;
    }

    //Backend calls
    getAllManualsData() {
        if (this.accountId && this.eventCode) {
            getAllManuals({ accountId: this.accountId, eventCode: this.eventCode })
                .then(result => {
                    this.requiredManuals = [];
                    this.additionalManuals = [];
                    for (let i = 0; i < result.length; i++) {
                        var tempDate = result[i].Manual_Permission__r.Manuals__r.Deadline__c;
                        if (tempDate) {
                            var tempDateArray = tempDate.split('-');
                            result[i].deadline = tempDateArray[1] + '/' + tempDateArray[2] + '/' + tempDateArray[0].substring(2);
                        }
                        if (result[i].Is_Agree__c || result[i].Is_Viewed__c) {
                            var lastModifiedDate = result[i].LastModifiedDate;
                            if (lastModifiedDate) {
                                var lastModifiedDateArray = lastModifiedDate.split('T')[0].split('-');
                                result[i].lastModifiedByString = this.lastUpdatedLabel + ' ' + this.byLabel + ' ' + result[i].LastModifiedBy.Name + ' (' + lastModifiedDateArray[1] + '/' + lastModifiedDateArray[2] + '/' + lastModifiedDateArray[0].substring(2) + ')';
                            } else {
                                result[i].lastModifiedByString = '--';
                            }
                        }
                        result[i].isNotALink = result[i].Manual_Permission__r.Manuals__r.Manual_Type__c === 'Downloadable PDF';
                        if (!result[i].isNotALink) 
                        {
                            let manualLinkUrl = result[i].Manual_Permission__r.Manuals__r.Url__c;
                            result[i].manualURL = (!manualLinkUrl.includes("http:") && !manualLinkUrl.includes("https:"))?'http://' +manualLinkUrl : manualLinkUrl;
                            result[i].Is_Agree__c = false;
                        }
                        //Add variable to top for sorting
                        result[i].formName = result[i].Manual_Permission__r.Manuals__r.Name;
                        result[i].provider = result[i].Manual_Permission__r.Manuals__r.Provider__c;
                        if (result[i].Manual_Permission__r.Manuals__r.Required__c) {
                            this.requiredManuals.push(result[i]);
                        } else {
                            this.additionalManuals.push(result[i]);
                        }
                    }
                });
        }
    }



    //Utility 
    sortTable(event) {
        //Get clicked index
        let n = event.currentTarget.getAttribute("data-index");
        //Get the name of the table which was clicked
        let dataTableType = event.currentTarget.getAttribute("data-table-type");
        //Create a map of all the rows
        let key_map = {
            "1": "formName",
            "2": "provider",
            "3": "deadline",
            "4": "Is_Viewed__c",
            "5": "Is_Agree__c"
        };
        //Get sorting key
        let sort_key = key_map[n];
        //Define ascending sort function
        let asc_sort_function = function (a, b) {
            if (a[sort_key] === null || a[sort_key] === undefined) {
                return -1;
            }
            if (b[sort_key] === null || b[sort_key] === undefined) {
                return 1;
            }
            if (a[sort_key].toLowerCase() < b[sort_key].toLowerCase()) {
                return -1;
            }
            if (a[sort_key].toLowerCase() > b[sort_key].toLowerCase()) {
                return 1;
            }
            return 0;
        }
        //define descending sort function
        let desc_sort_function = function (a, b) {
            if (a[sort_key] === null || a[sort_key] === undefined) {
                return 1;
            }
            if (b[sort_key] === null || b[sort_key] === undefined) {
                return -1;
            }
            if (a[sort_key].toLowerCase() < b[sort_key].toLowerCase()) {
                return 1;
            }
            if (a[sort_key].toLowerCase() > b[sort_key].toLowerCase()) {
                return -1;
            }
            return 0;
        }
        //Get current sorting order for clicked index
        let sort_order;
        if (dataTableType === 'required') {
            sort_order = this.requiredSortingMap[n];
            if (sort_order === 'asc') {
                this.requiredManuals.sort(asc_sort_function);
                this.requiredSortingMap[n] = 'desc';
            }
            if (sort_order === 'desc') {
                this.requiredManuals.sort(desc_sort_function);
                this.requiredSortingMap[n] = 'asc';

            }
        }
        if (dataTableType === 'additional') {
            sort_order = this.additionalSortingMap[n];
            if (sort_order === 'asc') {
                this.additionalManuals.sort(asc_sort_function);
                this.additionalSortingMap[n] = 'desc';
            }
            if (sort_order === 'desc') {
                this.additionalManuals.sort(desc_sort_function);
                this.additionalSortingMap[n] = 'asc';
            }
        }
    }

    showClickedManual(event) {
        event.preventDefault();
        this.enableSaveBtn = false;
        let manualType = event.currentTarget.getAttribute('data-manualtype');
        let manualId = event.currentTarget.getAttribute('data-mid');
        if (manualType === 'required') {
            this.currentManual = this.requiredManuals.find(manual => manual.Id === manualId);
        }
        if (manualType === 'additional') {
            this.currentManual = this.additionalManuals.find(manual => manual.Id === manualId);
        }
        let currentManualId = this.currentManual.Manual_Permission__r.Manuals__r.Uploaded_Attachment_Id__c;
        if (this.currentManual.Manual_Permission__r.Manuals__r.Manual_Type__c === 'Downloadable PDF') 
        {
            let fileId1 = currentManualId.toString();
            let fileId2 = fileId1.match(/00P/);
            if(fileId2)
            {
                this.manualURL ='/CustomerCenter/servlet/servlet.FileDownload?file=' +currentManualId;
                this.manualDownloadURL = '/CustomerCenter/servlet/servlet.FileDownload?file=' + currentManualId + '&amp;operationContext=S1';
            }else
            {
                getContentVerId({
                    docId: currentManualId
                    })
                    .then(result => {
                        let fileId = result.Id;
                        //window.console.log('edit attach' + fileId);
                        this.manualURL = '/CustomerCenter/sfc/servlet.shepherd/version/download/'+fileId;
                        this.manualDownloadURL = '/CustomerCenter/sfc/servlet.shepherd/version/download/' + fileId;
                        //this.manualDownloadURL = '/CustomerCenter/servlet/servlet.FileDownload?file=' + fileId + '&amp;operationContext=S1';
                    })
                    .catch(error => {
                        window.console.log("error..." + JSON.stringify(error));
                    });
                }
             
         }
            let today = new Date(new Date().getFullYear(),new Date().getMonth() , new Date().getDate());
            let manualDeadline = new Date(this.currentManual.Manual_Permission__r.Manuals__r.Deadline__c);
            if (today > manualDeadline && !this.currentManual.Manual_Permission__r.Manuals__r.Allow_Submit_After_Deadline__c) {
                this.isAllowedToView = false;
                this.disableReadAndAgree = true;
            } else {
                this.isAllowedToView = true;
                this.disableReadAndAgree = this.currentManual.Is_Agree__c || this.isReadOnly;
                //this.isAlreadyViewed = this.currentManual.Is_Viewed__c;
            }
        
        this.showManual();
    }

    navigateToManualLink(event) {
        event.preventDefault();
        this.isAllowedToView = false; //This will always be false as Links will never be shown in a modal
        let manualType = event.currentTarget.getAttribute('data-manualtype');
        let manualId = event.currentTarget.getAttribute('data-mid');
        if (manualType === 'required') {
            this.currentManual = this.requiredManuals.find(manual => manual.Id === manualId);
        }
        if (manualType === 'additional') {
            this.currentManual = this.additionalManuals.find(manual => manual.Id === manualId);
        }
        let today = new Date(new Date().getFullYear(),new Date().getMonth() , new Date().getDate());
        let manualDeadline = new Date(this.currentManual.Manual_Permission__r.Manuals__r.Deadline__c);
        if (today > manualDeadline && !this.currentManual.Manual_Permission__r.Manuals__r.Allow_Submit_After_Deadline__c) 
        {
            this.showManual();
        } else {
            window.open(this.currentManual.manualURL, '_blank');
            //this.updateViewFlag();
            if(this.isReadOnly === false) // disable Agent[STL-277]
            {
                updateViewedAndAgreed({ manualActionId: this.currentManual.Id, viewed: 'true', agreed: 'false' })
                .then(result => 
                    {
                        if (result === 'Success') 
                        {
                            this.getAllManualsData();
                        }
                    });
            }
        }
    }

    checkManual(event) {
        if (event.currentTarget.checked) {
            this.isReadAndAgreed = true;
            this.enableSaveBtn = true;
        } else {
            this.isReadAndAgreed = false;
            this.enableSaveBtn = false;
        }
    }

    showManual() {
        this.showManualFlag = true;
    }

    hideManual() {
        this.updateViewFlag();
        this.showManualFlag = false;
        this.resetValues();
    }

    updateViewFlag() {
        if (this.isReadOnly !== true && this.isAllowedToView) {
            //if (!this.isAlreadyViewed) {
            updateViewedAndAgreed({ manualActionId: this.currentManual.Id, viewed: 'true', agreed: 'false' })
                .then(result => {
                    if (result === 'Success') {
                        this.getAllManualsData();
                    }
                });
            //}
        }
    }

    resetValues() {
        this.currentManual = undefined;
        this.manualURL = undefined;
        this.manualDownloadURL = undefined;
        this.disableReadAndAgree = false;
        this.isReadAndAgreed = false;
        //this.isAlreadyViewed = false;
        this.isDownloadablePDF = false;
        this.isAllowedToView = false;
        this.enableSaveBtn = false;
    }

    saveManual() {
        //Code for saving read and agree, uncomment below code and related variables for enabling first time read receipt save only, currently read receipt is being saved every time manual is read
        if (this.isReadAndAgreed) {
            // if (this.currentManual.isAlreadyViewed) {
            //     updateViewedAndAgreed({ manualActionId: this.currentManual.Id, viewed: 'false', agreed: 'true' })
            //         .then(result => {
            //             if (result === 'Success') {
            //                 this.getAllManualsData();
            //             }
            //         });
            // } else {
            updateViewedAndAgreed({ manualActionId: this.currentManual.Id, viewed: 'true', agreed: 'true' })
                .then(result => {
                    if (result === 'Success') {
                        this.getAllManualsData();
                    }
                });
            // }
        }
        this.showManualFlag = false;
    }

}