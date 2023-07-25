/* eslint-disable @lwc/lwc/no-async-operation */
import { LightningElement, api, track } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import getOppAttachments from "@salesforce/apex/UploadDocumentAttachment_class.getOppAttachments";
import { handleErrors } from "c/lWCUtility";

//Retrieve Custom Labels
import Last_Modified_Date from "@salesforce/label/c.Last_Modified_Date";
import Opportunity from "@salesforce/label/c.Opportunity";

export default class PendingContractUploadDocument extends NavigationMixin(LightningElement) {
    @api recordId;
    @track filesData;
    @track totalRows;
    //@track searchValue;
    @track spinner;
    @track isShow;
    @track firstTime;
    @track pagesize;
    @track LASTMODIFIEDDATE;
    @track OPPORTUNITY;
    @track attachmentUrlLink;

    connectedCallback() {
        this.LASTMODIFIEDDATE = Last_Modified_Date;
        this.OPPORTUNITY = Opportunity;
        this.firstTime = true;
        //this.searchValue = "";
        this.spinner = false;
        this.isShow = this.spinner === false && this.firstTime;
        this.getData();
        this.attachmentUrlLink = "";
    }

    getData() {
        this.spinner = true;
        getOppAttachments({ ParentId: this.recordId})
            .then((result) => {
                this.firstTime = false;
                this.spinner = false;
                this.filesData = result;
                console.log('files datra ' + JSON.stringify(this.filesData));
                if (result.length > 0) {
                    this.totalRows = result.length;
                } else {
                    this.totalRows = undefined;
                }
                this.isShow = this.spinner === false && this.firstTime;
            })
            .catch((error) => {
                handleErrors(this, error);
            });
    }

    get isTrue() {
        return this.spinner && !this.firstTime;
    }
    openAttachmentLink(event){
        const contentDocumentLinkId = event.target.dataset.recordId;
        const contentVersionId = this.filesData.find(element => element.Id === contentDocumentLinkId).ContentDocument.LatestPublishedVersion.Id;
        window.open('/sfc/servlet.shepherd/version/download/' + contentVersionId,'_blank');
    }


    openAttachment(event){
        const contentDocumentLinkId = event.target.dataset.recordId;
        const contentDocumentId = this.filesData.find(element => element.Id === contentDocumentLinkId).ContentDocumentId;
        this[NavigationMixin.Navigate]({
            type: 'standard__namedPage',
            attributes: {
                pageName: 'filePreview'
            },
            state : {
                // assigning ContentDocumentId to show the preview of file
                selectedRecordId:contentDocumentId
            }
        })
    }
    goToOpp(event) {
        let oppId = event.target.dataset.recordId;
        this[NavigationMixin.Navigate]({
            type: "standard__recordPage",
            attributes: {
                recordId: oppId,
                objectApiName: "Opportunity",
                actionName: "view"
            }
        });
    }
    navToDetailPage = (event) => {
        const contentDocumentLinkId = event.target.dataset.recordId;
        const contentDocumentId = this.filesData.find(element => element.Id === contentDocumentLinkId).ContentDocumentId;
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: contentDocumentId, // objectApiName is optional
                actionName: 'view'
            }
        });
    }
}