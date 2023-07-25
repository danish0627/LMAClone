/*
* Created By	 : Girikon(Mukesh)
* Created On	 : Aug 08, 2019
* @description   : This is finance tab form component that shown after user click on row of pending contract tab
* Modified By	: 
*/
import { LightningElement,api,track,wire } from 'lwc';
import getUserRecordAccess from '@salesforce/apex/CommonController.getUserRecordAccess';
import getRecordDetail from '@salesforce/apex/CommonTableController.getRecordDetail2';
import {handleErrors,showToast} from 'c/lWCUtility';

//Retrieve Custom Labels
import Billing_Invoice_Contact from '@salesforce/label/c.Billing_Invoice_Contact';
import Billing_Address_Line_2 from '@salesforce/label/c.Billing_Address_Line_2';
import Billing_City from '@salesforce/label/c.Billing_City';
import Billing_Postal_Code from '@salesforce/label/c.Billing_Postal_Code';
import Shipping_City from '@salesforce/label/c.Shipping_City';
import Shipping_Postal_Code from '@salesforce/label/c.Shipping_Postal_Code';

export default class PendingContractFinanceTab extends LightningElement {
    @api objectName;
    @api recordId;
    @api isSalesOpsTeamMember;
    @track oppObj;
    @track userAccess;
    @track isEditForm;
    @track isViewForm;
    @track spinner;
    @track className;
    @track isShow;
    @track BILLINGINVOICECONTACT;
    @track BILLINGAddLINE2;
    @track BILLINGCITY;
    @track BILLINGPOSTALCODE;
    @track SHIPPINGCITY;
    @track SHIPPINGPOSTALCODE;

    //BSM-879 Start
    @track isShowprimaryQuote;
    @track primaryQuoteLink;
    //BSM-879 End

    constructor(){
        super();
        this.isShow = true;
        this.spinner = false;
        this.className = '';
    }

    connectedCallback(){      
        this.isViewForm = 'slds-show';
        this.isEditForm = 'slds-hide'  ;
        this.className = this.isShow?'slds-hide':'';
        this.BILLINGINVOICECONTACT = Billing_Invoice_Contact;
        this.BILLINGAddLINE2 = Billing_Address_Line_2;
        this.BILLINGCITY = Billing_City;
        this.BILLINGPOSTALCODE = Billing_Postal_Code;
        this.SHIPPINGCITY = Shipping_City;
        this.SHIPPINGPOSTALCODE = Shipping_Postal_Code;
    }

    @wire(getUserRecordAccess,{recordId:'$recordId'})
    wireUserData(result){
        if(result.data){
            if(result.data.length>0){
                this.userAccess = result.data[0];
            }
        } else if(result.error) {
            handleErrors(this,result.error);
        }
        this.getAddressFields();
    }

    getAddressFields(){
        let fields ='Billing_Contact__r.Account.BillingStreet,Billing_Contact__r.Account.Billing_Address_Line_2__c,Billing_Contact__r.Account.BillingCity,Billing_Contact__r.Account.BillingState,Billing_Contact__r.Account.BillingCountryCode,Billing_Contact__r.Account.BillingPostalCode';
        fields  = fields +',Billing_Contact__r.Account.ShippingStreet,Billing_Contact__r.Account.Shipping_Address_2__c,Billing_Contact__r.Account.ShippingCity,Billing_Contact__r.Account.ShippingState,Billing_Contact__r.Account.ShippingCountryCode,Billing_Contact__r.Account.ShippingPostalCode';
        fields  = fields +',SBQQ__PrimaryQuote__r.CurrencyIsoCode,Account.Tax_Id__c,Billing_Contact__r.Account.Tax_Id__c,SBQQ__PrimaryQuote__r.Payment_Schedule_amount1__c,SBQQ__PrimaryQuote__r.Payment_Schedule_Revised__c,Account.GAZT_Number__c,Account.CR_Number__c '
        fields  = fields +',SBQQ__PrimaryQuote__c,SBQQ__PrimaryQuote__r.Name ';//BSM-879
        getRecordDetail({objectName:'Opportunity',allFields:fields,recordId:this.recordId})
        .then(data=>{
            if(data.length>0){
                this.oppObj = data[0];
                 //BSM-879 Start
                 this.isShowprimaryQuote = this.oppObj.SBQQ__PrimaryQuote__c==null?false:true;
                 this.primaryQuoteLink = '/lightning/r/'+this.oppObj.SBQQ__PrimaryQuote__c+'/view';
                 //BSM-879 End
            }
        })
        .catch(error=>{
            handleErrors(this,error);
        });
    }

    editRecord(){
        if(this.userAccess.HasEditAccess){
            this.isEditForm = 'slds-show';
            this.isViewForm = 'slds-hide';
        } else {
            this.isEditForm = 'slds-hide';
            this.isViewForm = 'slds-show';
            showToast(this,'You do not have edit permission to edit record','error','Error!');
        }
    }

    viewForm(){
        this.isEditForm = 'slds-hide';
        this.isViewForm = 'slds-show';
    }

    handleLoad(){        
        this.className = '';
        this.isShow = false;
    }

    handleSubmit(event){
        event.preventDefault();
        const fields = event.detail.fields;
        this.template.querySelector(".edit_single_record").submit(fields);
        this.spinner = true;
    }

    handleSucess(){
        showToast(this,'Opportunity has been updated','success','Success');
        this.spinner = false;
        this.viewForm();
        //fire event to close modal
        this.dispatchEvent(new CustomEvent('afterformsubmission'));
    }

    handleError(event){
        handleErrors(this,event.detail);
    }
}