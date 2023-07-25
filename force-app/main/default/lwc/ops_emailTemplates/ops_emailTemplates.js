/*
Created By	 : (Himanshu[STL-45])
Created On	 : August 19, 2019
@description : This component is use to show Email Templates .

Modification log --
Modified By	: 
*/


/* eslint-disable no-console */
import {
    LightningElement,
    track
} from 'lwc';
import EmailTemplate from '@salesforce/schema/Email_Templates__c';
import TEMPLATETITLE from '@salesforce/schema/Email_Templates__c.Name';
import TEMPLATECODE from '@salesforce/schema/Email_Templates__c.Template_Code__c';
import GROUPNAME from '@salesforce/schema/Email_Templates__c.Group_Name__c';
import SUBJECT from '@salesforce/schema/Email_Templates__c.Subject__c';
import CONTENT from '@salesforce/schema/Email_Templates__c.Content__c';
import CONTENT2 from '@salesforce/schema/Email_Templates__c.Content__c';
import getEmailTemplateData from "@salesforce/apex/LtngUtilityCtrl.getRecords";
import getRecordDetail2 from '@salesforce/apex/CommonTableController.getRecordDetail2';

const DELAY = 300;
export default class Ops_formTemplate extends LightningElement {
    // label = {UploadMessage};

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

    @track fields;
    @track recordId = '';
    @track fieldlabel;
    @track showForm = true;
    @track TEMPLATETITLE;
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
    @track refreshEditForm;


    emailTemplateObject = EmailTemplate;
    templatetitle = TEMPLATETITLE;
    templatecode = TEMPLATECODE;
    groupname = GROUPNAME;
    subject = SUBJECT;
    content = CONTENT;
    content2 = CONTENT2;

    constructor() {
        super();
        this.fields = 'Template_Code__c,Group_Name__c,Name,Subject__c';
        this.fieldlabel = 'TEMPLATE CODE,GROUP NAME,TITLE,SUBJECT';
    }

    handleformCreated(event) {
        this.recordId = event.detail.id;
        if (this.showForm === true) {
            this.openNewModal = false;
            this.openEditModal = false;
        }
        this.TEMPLATECODE = '';
        this.TEMPLATETITLE = '';
        this.SUBJECT = '';
        this.CONTENT = '';
        this.GROUPNAME = '';
        this.handleRefreshTable();
    }
    checkvalidation(event) {
        event.preventDefault();
        this.errorMessage = '';
        // stop the form from submitting
        const fields = event.detail.fields;
        let formgroup = fields.Group_Name__c;
       

        if (!formgroup) {
            this.errorMessage = 'Invalid value for group name';
        }
        if (!this.errorMessage) {
            this.template.querySelector('.globalForm').submit(fields);
        }
    }
    checkvalidation2(event) {
        event.preventDefault();
        this.errorMessageforinsert = '';
        // stop the form from submitting
        const fields = event.detail.fields;
        let formgroup = fields.Group_Name__c;
        fields.Content__c = this.CONTENT;   
        if (!formgroup) {
            this.errorMessageforinsert = 'Invalid value for group name';
        }
        if (!this.errorMessageforinsert) {
            this.template.querySelector('.globalFormInsert').submit(fields);
        }
    }
    closeModal() {
        if (this.showForm === true) {
            this.openNewModal = false;
            this.openEditModal = false;
            this.TEMPLATECODE = '';
            this.TEMPLATETITLE = '';
            this.SUBJECT = '';
            this.CONTENT = '';
            this.GROUPNAME = '';
            this.showForm = true;
            this.errorMessage = '';
            this.errorMessageforinsert = '';

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
    handleEditModal(event) {
        this.recordId = event.detail;
        window.clearTimeout(this.delayTimeout);
        this.openEditModal = false;

        getEmailTemplateData({
                objName: "Email_Templates__c",
                fieldNames: "id,Template_Code__c,Group_Name__c,Name,Subject__c",
                compareWith: "id",
                recordId: this.recordId,
                pageNumber: 1,
                pageSize: 1
            })
            .then(result => {
                this.TEMPLATETITLE = result.recordList[0].Name !== undefined ? result.recordList[0].Name : '';
                this.TEMPLATECODE = result.recordList[0].Template_Code__c !== undefined ? result.recordList[0].Template_Code__c : '';
                this.GROUPNAME = result.recordList[0].Group_Name__c !== undefined ? result.recordList[0].Group_Name__c : '';
                this.SUBJECT = result.recordList[0].Subject__c !== undefined ? result.recordList[0].Subject__c : '';

                if (this.GROUPNAME === 'Forms') {
                    this.showFormPlaceHolder = true;
                    this.showManualPlaceHolder = false;
                    this.showExhibitorBadges = false;
                    this.showExhibitorProfile = false;
                    this.showstandContractor = false;
                    this.showAccountsAndBilling = false;
                    this.showUploadcenter = false;
                    this.showCPSR = false;
                    this.showCPBR = false;
                    this.showBDSR = false;
                    this.showEWC = false;
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
                    this.showExhibitorProfile = true;
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
                    this.showEWC = true;
                }
            })
            .catch(error => {
                window.console.log("error..." + JSON.stringify(error));
            });

  

        getRecordDetail2({objectName: 'Email_Templates__c', allFields:'Content__c' , recordId:this.recordId }).
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
        this.textAreaContent = this.CONTENT;

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
}