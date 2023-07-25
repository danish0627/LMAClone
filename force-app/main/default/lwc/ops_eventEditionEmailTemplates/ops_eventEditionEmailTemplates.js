/*
Created By	 : (Himanshu[STL-160])
Created On	 : Sep 19, 2019
@description : This component is use to show Event Edition Email Templates in ops admin  .

Modification log --
Modified By	: 
*/


/* eslint-disable no-console */
import {
    LightningElement,
    track,wire
} from 'lwc';
const FIELDS = ['Event_Edition__c.Name'];

import { getRecord } from 'lightning/uiRecordApi';
import { NavigationMixin } from 'lightning/navigation';

import EmailTemplate from '@salesforce/schema/Event_Edition_Email_Template__c';
import FROM from '@salesforce/schema/Event_Edition_Email_Template__c.From_Email_Address__c';
import TEMPLATECODE from '@salesforce/schema/Event_Edition_Email_Template__c.Email_Template_Code__c';
import SUBJECT from '@salesforce/schema/Event_Edition_Email_Template__c.Subject__c';
import CONTENT from '@salesforce/schema/Event_Edition_Email_Template__c.Content__c';
import CONTENT2 from '@salesforce/schema/Event_Edition_Email_Template__c.Content__c';
import TEMPLATETITLE from '@salesforce/schema/Event_Edition_Email_Template__c.Name';
import getEmailTemplateData from "@salesforce/apex/LtngUtilityCtrl.getRecords";
import {handleErrors,showToast} from 'c/lWCUtility';

import getEmailList from '@salesforce/apex/ops_emailTemplatesCtrl.getEmails';
import getRecordDetail2 from '@salesforce/apex/CommonTableController.getRecordDetail2';

const DELAY = 300;
export default class Ops_eventEditionEmailTemplates extends NavigationMixin(LightningElement) {

    @track openNewModal = false;
    @track openEditModal = false;
    @track openActionModal = false;
    @track openSourceContentModal = false;
    @track showFormPlaceHolder = false;
    @track showManualPlaceHolder = false;
    @track showExhibitorBadges = false;
    @track showExhibitorProfile = false;
    @track showstandContractor = false;
    @track showAccountsAndBilling = false;
    @track showUploadcenter = false;
    @track showCPBR = false;
    @track showCPSR = false;
    @track showBDSR = false;
    @track showEPSR = false;
    @track showExhibitorProfileEPSR = false;
    @track showExhibitorProfileEWC = false;
    @track emailList =''
    @track evtseries ='';
    @track selectedEventName = '';
    @track fields='Email_Template__r.Group_Name__c,Name,Subject__c,Email_Template_Code__c';
    @track recordId = '';
    @track fieldlabel='';
    @track showForm = true;
    @track TEMPLATETITLE;
    @track FROM;
    @track TEMPLATECODE;
    @track GROUPNAME;
    @track SUBJECT;
    @track CONTENT;
    @track CONTENT2;
    @track PLACEHOLDER;
    @track opnebraces = '{';
    @track closebraces = '}';
    @track textAreaContent = '';
    @track errorMessage;
    @track errorMessageforinsert;
    @track tempCondition='';
    @track eventId='';
    @track grpName='';
    @track value = '';
    @track refreshEditForm;
    @track spinner=true;
    emailTemplateObject = EmailTemplate;
    from = FROM;
    templatecode = TEMPLATECODE;
    subject = SUBJECT;
    content = CONTENT;
    content2 = CONTENT2;
    templatetitle = TEMPLATETITLE;



    connectedCallback() {
        let fullUrl = window.location.href;
        if (fullUrl.indexOf("#") > -1) {
            this.recordId=fullUrl.split("#id=")[1];
            if(this.recordId.indexOf("&esid=")){
                this.eventId=this.recordId.split("&esid=")[0];
            }
        }
        this.fieldlabel = 'GROUP NAME,TITLE,SUBJECT,TEMPLATE CODE';
        this.tempCondition = 'Event_Edition__c=\''+ this.eventId +'\' ';
        
        getEmailList({evtid:this.eventId})
        .then(data=>{            
           let optionValueArray = [];
           for( let i=0;i<data.length;i++){
            optionValueArray.push( { label: data[i].Org_Wide_From_Email_Addresses__c, value:data[i].Id });
        }
        this.emailList = optionValueArray;
        })
        .catch(error=>{
            this.emailList=undefined;
            this.error = error;
            handleErrors(this,error);
        });    
    }
    @wire(getRecord, { recordId: '$eventId', fields: FIELDS })
    wiredEventObject({ error, data }) {
        if (data) {
            this.selectedEventName = data.fields.Name.value ? data.fields.Name.value : '';
        } else if (error) {
            this.isLoading = 'hideLoading';
            this.record = undefined;
        }
    }
    get options(){

        return this.emailList;
    }
    
    handleChange(event) {
            this.value = event.detail.value;
         }
    constructor() {
        super();
        this.fieldlabel = 'GROUP NAME,TITLE,SUBJECT,TEMPLATE CODE';
        this.tempCondition = 'Event_Edition__c=\''+ this.eventId +'\' ';
    }

    handleformCreated(event) {
        this.spinner = false;
        this.recordId = event.detail.id;
        if (this.showForm === true) {
            this.openNewModal = false;
            this.openEditModal = false;
        }
        this.openEditModal = false;
        this.handleRefreshTable();
    }
    
    closeModal() {
        if (this.showForm === true) {
            this.openNewModal = false;
            this.openEditModal = false;
            this.TEMPLATECODE = '';
            this.TEMPLATETITLE = '';
            this.FROM ='';
            this.SUBJECT = '';
            this.GROUPNAME = '';
            this.showForm = false;
            this.errorMessage = '';
            this.errorMessageforinsert = '';
            this.value ='';

        }
        else{
            this.openEditModal = false;
        }
        this.refreshEditForm = false;
        this.refreshEditForm = true;

    }
    handleUploadFinished() {
        this.openNewModal = false;
        this.handleRefreshTable();
    }
    handleNewModal() {
        window.clearTimeout(this.delayTimeout);
        this.openNewModal = false;
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(() => {
            this.openNewModal = true;
        }, DELAY);
    }
    handleEditModal(event) 
    {
        this.recordId = event.detail;
        window.clearTimeout(this.delayTimeout);

        // this method is used to fetch event edition email templates data from server 
        getEmailTemplateData({
            objName: "Event_Edition_Email_Template__c",
            fieldNames: "id,Email_Template_Code__c,Email_Template__r.Group_Name__c,Name,Subject__c,From_Email_Address__c,From_Email_Address__r.Org_Wide_From_Email_Addresses__c",
            compareWith: "id",
            recordId: this.recordId,
            pageNumber: 1,
            pageSize: 1
        })
        .then(result => {
            let title = result.recordList[0].Name !== undefined ? result.recordList[0].Name : '';
            this.TEMPLATETITLE = title;
            this.FROM=result.recordList[0].From_Email_Address__c !== undefined ? result.recordList[0].From_Email_Address__c : '';
            this.TEMPLATECODE = result.recordList[0].Email_Template_Code__c !== undefined ? result.recordList[0].Email_Template_Code__c : '';
            this.grpName = result.recordList[0].Email_Template__r.Group_Name__c !== undefined ? result.recordList[0].Email_Template__r.Group_Name__c : '';
            this.GROUPNAME = result.recordList[0].Email_Template__r.Group_Name__c !== undefined ? result.recordList[0].Email_Template__r.Group_Name__c : '';
            this.SUBJECT = result.recordList[0].Subject__c !== undefined ? result.recordList[0].Subject__c : '';
            this.value = result.recordList[0].From_Email_Address__c !== undefined ? result.recordList[0].From_Email_Address__c : '';
            if (this.GROUPNAME === 'Forms') {
                this.showFormPlaceHolder = true;
                this.showManualPlaceHolder = false;
                this.showExhibitorBadges = false;
                this.showExhibitorProfile = false;
                this.showstandContractor = false;
                this.showAccountsAndBilling = false;
                this.showUploadcenter = false;
                this.showExhibitorProfileEPSR = false;
                this.showCPSR = false;
                this.showCPBR = false;
                this.showBDSR = false;
                this.showEWC = false;
                this.showExhibitorProfileEWC = false;

            }
            if (this.GROUPNAME === 'Manuals') {
                this.showFormPlaceHolder = false;
                this.showExhibitorBadges = false;
                this.showExhibitorProfile = false;
                this.showstandContractor = false;
                this.showAccountsAndBilling = false;
                this.showUploadcenter = false;
                this.showCPBR = false;
                this.showCPSR = false;
                this.showBDSR = false;
                this.showEWC = false;
                this.showExhibitorProfileEPSR = false;
                this.showExhibitorProfileEWC = false;
                this.showManualPlaceHolder = true;
                
            }
            if (this.GROUPNAME === 'Exhibitor Badges') {
                this.showFormPlaceHolder = false;
                this.showManualPlaceHolder = false;
                this.showExhibitorProfile = false;
                this.showstandContractor = false;
                this.showAccountsAndBilling = false;
                this.showUploadcenter = false;
                this.showCPBR = false;
                this.showCPSR = false;
                this.showBDSR = false;
                this.showEWC = false;
                this.showExhibitorProfileEPSR = false;
                this.showExhibitorProfileEWC = false;
                this.showExhibitorBadges = true;
            }

            if (this.GROUPNAME === 'Exhibitor Profile') {
                this.showFormPlaceHolder = false;
                this.showManualPlaceHolder = false;
                this.showExhibitorBadges = false;
                this.showstandContractor = false;
                this.showAccountsAndBilling = false;
                this.showUploadcenter = false;
                this.showCPBR = false;
                this.showCPSR = false;
                this.showBDSR = false;
                this.showEWC = false;
                this.showExhibitorProfileEPSR = false;
                this.showExhibitorProfileEWC = false;
                this.showExhibitorProfile = true;
            }
            if (this.GROUPNAME === 'Exhibitor Profile' && this.TEMPLATECODE === 'EPSR') {
                this.showFormPlaceHolder = false;
                this.showManualPlaceHolder = false;
                this.showExhibitorBadges = false;
                this.showstandContractor = false;
                this.showAccountsAndBilling = false;
                this.showUploadcenter = false;
                this.showCPBR = false;
                this.showCPSR = false;
                this.showBDSR = false;
                this.showEWC = false;
                this.showExhibitorProfile = false;
                this.showExhibitorProfileEWC = false;
                this.showExhibitorProfileEPSR = true;
            }
            if (this.GROUPNAME === 'Exhibitor Profile' && (this.TEMPLATECODE === 'EWC' || this.TEMPLATECODE === 'EWSP')) {
                this.showFormPlaceHolder = false;
                this.showManualPlaceHolder = false;
                this.showExhibitorBadges = false;
                this.showstandContractor = false;
                this.showAccountsAndBilling = false;
                this.showUploadcenter = false;
                this.showCPBR = false;
                this.showCPSR = false;
                this.showBDSR = false;
                this.showEWC = false;
                this.showExhibitorProfile = false;
                this.showExhibitorProfileEPSR = false;
                this.showExhibitorProfileEWC = true;
            }
            if (this.GROUPNAME === 'Stand Contractor/EAC') {
                this.showFormPlaceHolder = false;
                this.showManualPlaceHolder = false;
                this.showExhibitorBadges = false;
                this.showExhibitorProfile = false;
                this.showAccountsAndBilling = false;
                this.showUploadcenter = false;
                this.showCPBR = false;
                this.showCPSR = false;
                this.showBDSR = false;
                this.showEWC = false;
                this.showExhibitorProfileEPSR = false;
                this.showExhibitorProfileEWC = false;
                this.showstandContractor = true;
            }

            if (this.GROUPNAME === 'Accounts and Billing') {
                this.showFormPlaceHolder = false;
                this.showManualPlaceHolder = false;
                this.showExhibitorBadges = false;
                this.showExhibitorProfile = false;
                this.showstandContractor = false;
                this.showUploadcenter = false;
                this.showCPBR = false;
                this.showCPSR = false;
                this.showBDSR = false;
                this.showEWC = false;
                this.showExhibitorProfileEPSR = false;
                this.showExhibitorProfileEWC = false;
                this.showAccountsAndBilling = true;
            }

            if (this.GROUPNAME === 'Upload Center') {
                this.showFormPlaceHolder = false;
                this.showManualPlaceHolder = false;
                this.showExhibitorBadges = false;
                this.showExhibitorProfile = false;
                this.showstandContractor = false;
                this.showAccountsAndBilling = false;
                this.showCPBR = false;
                this.showCPSR = false;
                this.showBDSR = false;
                this.showEWC = false;
                this.showExhibitorProfileEPSR = false;
                this.showExhibitorProfileEWC = false;
                this.showUploadcenter = true;
            }
            if (this.GROUPNAME === 'Stand Contractor/EAC' && this.TEMPLATECODE === 'CPBR') {
                this.showFormPlaceHolder = false;
                this.showManualPlaceHolder = false;
                this.showExhibitorBadges = false;
                this.showExhibitorProfile = false;
                this.showstandContractor = false;
                this.showAccountsAndBilling = false;
                this.showUploadcenter = false;
                this.showCPSR = false;
                this.showBDSR = false;
                this.showEWC = false;
                this.showExhibitorProfileEPSR = false;
                this.showExhibitorProfileEWC = false;
                this.showCPBR = true;
            }

            if (this.GROUPNAME === 'Stand Contractor/EAC' && this.TEMPLATECODE === 'CPSR') {
                this.showFormPlaceHolder = false;
                this.showManualPlaceHolder = false;
                this.showExhibitorBadges = false;
                this.showExhibitorProfile = false;
                this.showstandContractor = false;
                this.showAccountsAndBilling = false;
                this.showUploadcenter = false;
                this.showCPBR = false;
                this.showBDSR = false;
                this.showEWC = false;
                this.showExhibitorProfileEPSR = false;
                this.showExhibitorProfileEWC = false;
                this.showCPSR = true;
            }

            if (this.GROUPNAME === 'Stand Contractor/EAC' && (this.TEMPLATECODE === 'BDSR' || this.TEMPLATECODE === 'BDSR-CR' || this.TEMPLATECODE === 'BDSR-PSA')) {
                this.showFormPlaceHolder = false;
                this.showManualPlaceHolder = false;
                this.showExhibitorBadges = false;
                this.showExhibitorProfile = false;
                this.showstandContractor = false;
                this.showAccountsAndBilling = false;
                this.showUploadcenter = false;
                this.showCPBR = false;
                this.showCPSR = false;
                this.showEWC = false;
                this.showExhibitorProfileEPSR = false;
                this.showExhibitorProfileEWC = false;
                this.showBDSR = true;
            }

            if (this.GROUPNAME === 'Stand Contractor/EAC' && this.TEMPLATECODE === 'EPSR') {
                this.showFormPlaceHolder = false;
                this.showManualPlaceHolder = false;
                this.showExhibitorBadges = false;
                this.showExhibitorProfile = false;
                this.showstandContractor = false;
                this.showAccountsAndBilling = false;
                this.showUploadcenter = false;
                this.showCPBR = false;
                this.showBDSR = false;
                this.showCPSR = false;
                this.showEWC = false;
                this.showExhibitorProfileEPSR = false;
                this.showExhibitorProfileEWC = false;
                this.showEPSR = true;
            }

            if (this.GROUPNAME === 'Stand Contractor/EAC' && this.TEMPLATECODE === 'EWC') {
                this.showFormPlaceHolder = false;
                this.showManualPlaceHolder = false;
                this.showExhibitorBadges = false;
                this.showExhibitorProfile = false;
                this.showstandContractor = false;
                this.showAccountsAndBilling = false;
                this.showUploadcenter = false;
                this.showCPBR = false;
                this.showBDSR = false;
                this.showCPSR = false;
                this.showEPSR = false;
                this.showExhibitorProfileEPSR = false;
                this.showExhibitorProfileEWC = false;
                this.showEWC = true;
            }
        })
        .catch(error => {
            window.console.log("error..." + JSON.stringify(error));
        });
        
        getRecordDetail2({objectName: 'Event_Edition_Email_Template__c', allFields:'Content__c' , recordId:this.recordId }).
        then(res=>{
            if(res.length>0){
                this.CONTENT = res[0].Content__c;                    
            }
            this.spinner = false;
            this.openEditModal = true;                    
            this.refreshEditForm = false;
            this.refreshEditForm = true;            
        
        })
        .catch(error=>{
            handleErrors(this,error);
        })        
    }    
   
    handleLoad(){
        const editor = this.template.querySelector('lightning-input-rich-text');        
        if(editor){
            editor.focus();
        }
    }
    handleActionModal(event) {
        this.recordId = event.detail;
        window.clearTimeout(this.delayTimeout);
        this.openActionModal = false;

        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(() => {
            this.openActionModal = true;
        }, DELAY);
    }

    /** Handle refresh table     
     * */
    handleRefreshTable() {
        try {
            //alert(0);
            this.template.querySelector('c-events-list-custom-table').refreshTable();
            this.showForm = true;
        } catch (error) {
            window.console.error(error);
        }
    }

    @track formats = ['font', 'size', 'bold', 'italic', 'underline',
        'strike', 'list', 'indent', 'align', 'link',
        'image', 'clean', 'table', 'header', 'color'];

    appendPlaceholder(event) {
        let data = event.target.name;
        data = '{' + data + '}';

        const editor = this.template.querySelector('lightning-input-rich-text');
        editor.insertTextAtCursor(data);
        editor.focus();        
    }

    ccUrl() {
        window.location.href = '/lightning/n/ops_customer_centre';
    }
    viewsourceCode() {
        this.openSourceContentModal = true;
        this.textAreaContent = this.CONTENT2;

    }
    closeSourceCodeModal() {
        this.openSourceContentModal = false;
    }
    savetextAreaContent() {
        this.CONTENT = this.CONTENT2;
        this.openSourceContentModal = false;
        this.handleRefreshTable();
    }
    fetchContentData(event) {
        let data2 = event.target.value;
        this.textAreaContent = data2;
        this.CONTENT = data2;
        this.CONTENT2 = data2;

    }
    mapData(event) {
        let data2 = event.target.value;
        this.CONTENT2 = data2;

    }
    goToCustomerCenter(){
    
        let redirectUrl = '/lightning/n/ops_customer_centre';
        window.location.href = redirectUrl;
    }
    goToCustomerCenterSetting(){
        let recordid = this.recordId;
        let redirectUrl ="/lightning/n/ops_customer_centre_settings#id="+recordid;
        window.location.href = redirectUrl;
    }
    checkvalidation(event){
        event.preventDefault();
        this.spinner = true;
        const fields = event.detail.fields;
        fields.From_Email_Address__c= this.value;
        fields.Content__c = this.CONTENT;        
        this.template.querySelector('.globalForm').submit(fields)
    }
    handleError(event){
        this.spinner = false;
        handleErrors(this,event.detail);
    }
}