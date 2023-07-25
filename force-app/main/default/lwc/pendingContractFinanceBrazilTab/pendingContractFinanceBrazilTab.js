/* eslint-disable no-console */
/*
* Created By	 : Girikon(Mukesh)
* Created On	 : Aug 13, 2019
* @description   : This is finance tab form component that shown after user click on row of pending contract tab
*                 
* Modification log --
* Modified By	: 
*/
import { LightningElement,api,track,wire } from 'lwc';
import getUserRecordAccess from '@salesforce/apex/CommonController.getUserRecordAccess';
import getRecordDetail from '@salesforce/apex/CommonTableController.getRecordDetail2';
import updateRecord from '@salesforce/apex/CommonTableController.massUpdateRecords';
import {handleErrors,showToast} from 'c/lWCUtility';

//Retrieve Custom Labels
import Billing_Address_Line_2 from '@salesforce/label/c.Billing_Address_Line_2';
import Billing_City from '@salesforce/label/c.Billing_City';
import Billing_Postal_Code from '@salesforce/label/c.Billing_Postal_Code';
import City_Hall_Tax_Registration from '@salesforce/label/c.City_Hall_Tax_Registration';
import State_Tax_Registration from '@salesforce/label/c.State_Tax_Registration';

export default class PendingContractFinanceBrazilTab extends LightningElement {
    @api objectName;
    @api recordId;
    @api isSalesOpsTeamMember;
    
    @track oppObj;
    @track accObj;
    @track userAccess;
    @track isEditForm;
    @track isViewForm;
    @track spinner;
    @track className;
    @track isShow;

    //Account custom fields that
    @track SSC_SAP_CLient_Code;
    @track SSC_SAP_Cobr_Code;
    @track SSC_SAP_Ops_Code;

    @track oppOwnerId;
    @track oppOwnerLink;

    @track BILLINGAddLINE2;
    @track BILLINGCITY;
    @track BILLINGPOSTALCODE;
    @track CITYHALLTAXREGISTRATION;
    @track STATETAXREGISTRATION;

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
        this.BILLINGAddLINE2 = Billing_Address_Line_2;
        this.BILLINGCITY = Billing_City;
        this.BILLINGPOSTALCODE = Billing_Postal_Code;
        this.CITYHALLTAXREGISTRATION = City_Hall_Tax_Registration;
        this.STATETAXREGISTRATION = State_Tax_Registration;
    }

    @wire(getUserRecordAccess,{recordId:'$recordId'})
    wireUserData(result){
        if(result.data){
            if(result.data.length>0){
                this.userAccess = result.data[0];
            }
        }
        else if(result.error){
            handleErrors(this,result.error);
        }
        this.getAddressFields();
    }

    getAddressFields(){        
        let fields ='Billing_Contact__r.Phone,Billing_Contact__r.MobilePhone,Billing_Contact__r.Email,Operations_Contact__r.Phone,Operations_Contact__r.MobilePhone,Billing_Contact__r.Account.BillingStreet,Billing_Contact__r.Account.Billing_Address_Line_2__c,Billing_Contact__r.Account.BillingCity,Operations_Contact__r.Email,Billing_Contact__r.Account.BillingState,Billing_Contact__r.Account.BillingCountryCode,Billing_Contact__r.Account.BillingPostalCode';
        fields  = fields +',Billing_Contact__r.Account.ShippingStreet,Billing_Contact__r.Account.Shipping_Address_2__c,Billing_Contact__r.Account.ShippingCity,Billing_Contact__r.Account.ShippingState,Billing_Contact__r.Account.ShippingCountryCode,Billing_Contact__r.Account.ShippingPostalCode';
        fields  = fields +',SBQQ__PrimaryQuote__r.CurrencyIsoCode,Account.Tax_Id__c,Billing_Contact__r.Account.Tax_Id__c,SBQQ__PrimaryQuote__r.Payment_Schedule_amount1__c,SBQQ__PrimaryQuote__r.Payment_Schedule_Revised__c,SBQQ__PrimaryQuote__r.Name '
        fields  = fields +',Account.Simples_Nacional__c,Account.Nome_Fantasia__c,Account.CNPJ__c,Account.City_Hall_Tax_Registration__c,OwnerId,Owner.Name';
        getRecordDetail({objectName:'Opportunity',allFields:fields,recordId:this.recordId})
        .then(data=>{
            if(data.length>0){
                this.oppObj = data[0];
                this.oppOwnerId = this.oppObj.OwnerId;
                this.oppOwnerLink = '/lightning/r/'+this.oppObj.OwnerId+'/view';

                this.getAccountDetail(this.oppObj.AccountId);
            }
        })
        .catch(error=>{
            handleErrors(this,error);
        });
    }
    
    getAccountDetail(recordId){
        getRecordDetail({objectName:'Account',allFields:'SSC_SAP_CLient_Code__c,SSC_SAP_Cobr_Code__c,SSC_SAP_Ops_Code__c',recordId:recordId})
        .then(data=>{
            if(data.length>0){
                this.accObj = data[0];
                this.SSC_SAP_CLient_Code = this.accObj.SSC_SAP_CLient_Code__c;
                this.SSC_SAP_Cobr_Code = this.accObj.SSC_SAP_Cobr_Code__c;
                this.SSC_SAP_Ops_Code = this.accObj.SSC_SAP_Ops_Code__c;
            }
        })
        .catch(error=>{
            handleErrors(this,error);
        });
    }

    handleFieldChange(event){        
        if(event.target.label==='SSC SAP CLient Code' && event && event.target){
            this.SSC_SAP_CLient_Code = event.target.value;
        }
        if(event.target.label==='SSC SAP Cobr Code' && event && event.target){
            this.SSC_SAP_Cobr_Code = event.target.value;
        }
        if(event.target.label==='SSC SAP Ops Code' && event && event.target){
            this.SSC_SAP_Ops_Code = event.target.value;
        }
    }

    updateAccountRecord(){
        let records = [{'Id':this.accObj.Id,'sobjectType':'Account','SSC_SAP_CLient_Code__c':this.SSC_SAP_CLient_Code,'SSC_SAP_Cobr_Code__c':this.SSC_SAP_Cobr_Code,'SSC_SAP_Ops_Code__c':this.SSC_SAP_Ops_Code}];
        // eslint-disable-next-line no-console
        updateRecord({objList:records})
        .then(result=>{
            // eslint-disable-next-line no-console
        })
        .catch(error=>{
            handleErrors(this,error);
        })
    }

    editRecord(){
        if(this.userAccess.HasEditAccess){
            this.isEditForm = 'slds-show';
            this.isViewForm = 'slds-hide';
        }
        else{
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
        fields.OwnerId = this.oppOwnerId;
        this.template.querySelector(".edit_single_record").submit(fields);
        this.updateAccountRecord();
        this.spinner = true;
    }
    
    handleSucess(){
        showToast(this,'Record has been updated','success','Success');
        this.spinner = false;
        this.viewForm();
        //fire event to close modal
        this.dispatchEvent(new CustomEvent('afterformsubmission'));
    }
    handleError(event){
        this.spinner = false;
        handleErrors(this,event.detail);
    }

    
    setLookupField(event){
        this.oppObj = JSON.parse(JSON.stringify(this.oppObj));
        if(event.detail.field==='OwnerId'){
            this.oppOwnerId = event.detail.value;
            this.oppObj.OwnerId = event.detail.value;
            this.oppObj.Owner.Name = event.detail.name;
        }
    }
}