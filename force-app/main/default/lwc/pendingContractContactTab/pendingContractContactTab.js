/* eslint-disable @lwc/lwc/no-async-operation */
import { LightningElement, api, track } from 'lwc';
import {NavigationMixin} from 'lightning/navigation';
import getAgreements from '@salesforce/apex/SSCDashboardLtngCtrl.getAgreements';
import getFilePreview from '@salesforce/apex/CommonTableController.getFilePreview';
import getFilePreviewLink from '@salesforce/apex/CommonTableController.getFilePreviewLink';
import { handleErrors } from 'c/lWCUtility';
const DELAY=300;

//Retrieve Custom Labels
import Last_Modified_Date from '@salesforce/label/c.Last_Modified_Date';
import Opportunity from '@salesforce/label/c.Opportunity';

export default class PendingContractContactTab extends NavigationMixin(LightningElement) {
    @api recordId;
    @track agreementData;
    @track totalRows;
    @track searchValue;
    @track spinner;
    @track isShow;
    @track firstTime;
    @track pagesize;
    @track LASTMODIFIEDDATE;
    @track OPPORTUNITY;
    @track attachmentUrlLink;

    connectedCallback(){
        this.LASTMODIFIEDDATE = Last_Modified_Date;
        this.OPPORTUNITY = Opportunity;
        this.firstTime=true;
        this.searchValue = '';
        this.spinner = false;
        this.isShow = this.spinner===false && this.firstTime;
        this.getData();
        this.attachmentUrlLink = '';
    }

    getData(){
        this.spinner = true;
        getAgreements({oppId:this.recordId,searchValue:this.searchValue})
        .then(result=>{
            this.firstTime = false;
            this.spinner = false;
            this.agreementData = result;
            if(result.length>0){
                this.totalRows = result.length;
            }
            else{
                this.totalRows = undefined;
            }
            this.isShow = this.spinner===false && this.firstTime;
        })
        .catch(error=>{
            handleErrors(this,error);
        });
    }

    onPageSizeChange(){
        window.clearTimeout(this.delayTimeout);
        this.delayTimeout = setTimeout(() => {
        },DELAY);
    }

    get isTrue(){
        return this.spinner && !this.firstTime;        
    }

    get pagesizeList(){
        return [
            {'label':'5','value':'5'},
            {'label':'10','value':'10'},
            {'label':'15','value':'15'},
            {'label':'20','value':'20'},
            {'label':'30','value':'30'},
            {'label':'50','value':'50'}
        ];
    }

    /**
     * Fire whenever user type in search box, but data load if search field empty
     */
    reloadData(){
        let searchValue = this.template.querySelector(".search-box").value;
        searchValue = searchValue.trim();
        if(searchValue===''){
            window.clearTimeout(this.delayTimeout);
            this.delayTimeout = setTimeout(() => {
                this.searchValue = searchValue;
                this.getData();
            },DELAY);
        }
    }

    searchData(){        
        let searchValue = this.template.querySelector(".search-box").value;
        searchValue = searchValue.trim();
        window.clearTimeout(this.delayTimeout);
        this.delayTimeout = setTimeout(() => {
            this.searchValue = searchValue;
            this.getData();
        },DELAY);
    }
    openAttachmentLink(event){
        let parentId = event.target.dataset.recordId;
        getFilePreviewLink({objectName:'ContentDocumentLink',fields:'Id,ContentDocumentId, ContentDocument.Title',parentId:parentId})
        .then(result=>{
            this.spinner = false;
            if(Array.isArray(result) && result.length>0){
                window.open('/sfc/servlet.shepherd/version/download/' + result[0].Id,'_blank');
                //this.attachmentUrlLink = "https://"+window.location.host+'/sfc/servlet.shepherd/version/download/'+result[0].Id;
            }
            else{
                showToast(this,'No file found','error','Error');
            }
        })
        .catch(error=>{
            handleErrors(this,error);
        })
    }


    openAttachment(event){
        let parentId = event.target.dataset.recordId;
        getFilePreview({objectName:'ContentDocumentLink',fields:'Id,ContentDocumentId, ContentDocument.Title',parentId:parentId})
        .then(result=>{
            this.spinner = false;
            if(Array.isArray(result) && result.length>0){
                this.pdfName = result[0].Name;
                //this.pdfUrl = "https://"+window.location.host+'/sfc/servlet.shepherd/version/download/'+result[0].Id};
                
                // Naviagation Service to the show preview
                this[NavigationMixin.Navigate]({
                    type: 'standard__namedPage',
                    attributes: {
                        pageName: 'filePreview'
                    },
                    state : {
                        // assigning ContentDocumentId to show the preview of file
                        selectedRecordId:result[0].ContentDocumentId
                    }
                })
            }
            else{
                showToast(this,'No file found','error','Error');
            }
        })
        .catch(error=>{
            handleErrors(this,error);
        })
    }

    goToRecord(event){
        let recordId = event.target.dataset.recordId;
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: recordId,
                objectApiName: 'Agreement__c',
                actionName: 'view'
            },
        });
        
    }

    goToOpp(event){
        let oppId = event.target.dataset.recordId;        
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: oppId,
                objectApiName: 'Opportunity',
                actionName: 'view'
            },
        });
    }
}