/* eslint-disable no-alert */
/*
* Created By	 : Girikon(Mukesh)
* Created On	 : Aug 16, 2019
* @description   : This is product brazil tab component that shown after user click on table row action of pending contract tab.
*                      
*                 
* Modification log
* Modified By	: 
*/
import { LightningElement,wire, api, track } from 'lwc';
import getRecord from '@salesforce/apex/CommonTableController.getRecordDetail';
import getUserRecordAccess from '@salesforce/apex/CommonController.getUserRecordAccess';
import getProductBrasilCondition from '@salesforce/apex/SSCDashboardLtngCtrl.getProductBrasilCondition';
import { refreshApex } from '@salesforce/apex';
import getRecordDetail from '@salesforce/apex/CommonTableController.getRecordDetail2';
import getQLRecordsForBrazilTab from '@salesforce/apex/CommonTableController.getQLRecordsForBrazilTab';
import updateRecord from '@salesforce/apex/CommonTableController.massUpdateRecords';
import {handleErrors,showToast} from 'c/lWCUtility';
export default class PendingContractProductBrazilTab extends LightningElement {
    @api recordId;
    @track oppObj;
    @track accObj;
    @track userAccess;
    @track isEditForm;
    @track isViewForm;
    @track spinner;
    @track sapMatCodeType;
     //Account custom fields that
     @track SSC_SAP_CLient_Code;
     @track SSC_SAP_Cobr_Code;
     @track SSC_SAP_Ops_Code;

    wiredMarketData;
     result;
    
    @track oppOwnerId;
    @track mainOrderId;
    @track fieldsLabels;
    @track opportunityId;
   
    connectedCallback(){
        this.isViewForm='slds-show';
        this.isEditForm='slds-hide';
        this.getAmount();   
        
     
    }

    getAmount(){
        getRecord({objectName:'Opportunity',allFields:'ISO_Code__c,Amount_Custom__c',recordId:this.recordId})
        .then(res=>{
            if(res.length>0){
                this.isoCode = res[0].ISO_Code__c;
                this.totalAmount = res[0].Amount_Custom__c;
            }
        })
        .catch(error=>{
            handleErrors(this,error);
        })
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
        let fields ='SBQQ__PrimaryQuote__r.CurrencyIsoCode,OwnerId,Owner.Name,Main_Order__c,Main_Order__r.OrderNumber,AccountId';
        getRecordDetail({objectName:'Opportunity',allFields:fields,recordId:this.recordId})
        .then(data=>{
            if(data.length>0){
                this.oppObj = data[0];
                this.opportunityId = this.oppObj.Id;
                this.oppOwnerId = this.oppObj.Owner.Id;
                this.mainOrderId = this.oppObj.Main_Order__c;
                if(this.oppObj.Main_Order__c===undefined){
                    this.mainOrderId='';
                    this.oppObj.Main_Order__r={OrderNumber:''};
                }                
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

    handleFieldChange(event){        
        if(event.target.label==='SSC SAP CLient Code'){
            this.SSC_SAP_CLient_Code = event.target.value;
        }
        if(event.target.label==='SSC SAP Cobr Code'){
            this.SSC_SAP_Cobr_Code = event.target.value;
        }
        if(event.target.label==='SSC SAP Ops Code'){
            this.SSC_SAP_Ops_Code = event.target.value;
        }
    }

    updateAccountRecord(){
        
        let records = [{'Id':this.accObj.Id,'sobjectType':'Account','SSC_SAP_CLient_Code__c':this.SSC_SAP_CLient_Code,'SSC_SAP_Cobr_Code__c':this.SSC_SAP_Cobr_Code,'SSC_SAP_Ops_Code__c':this.SSC_SAP_Ops_Code}];
        // eslint-disable-next-line no-console
        updateRecord({objList:records})
        .then(result=>{
            // eslint-disable-next-line no-console
            console.log(result);
            this.spinner = false;
            this.viewForm();
            //fire event to close modal
            this.dispatchEvent(new CustomEvent('afterformsubmission'));
        })
        .catch(error=>{
            handleErrors(this,error);
        })
    }

    handleSubmit(event){
        event.preventDefault();
        const fields = event.detail.fields;
        fields.OwnerId = this.oppOwnerId;
        fields.Main_Order__c = this.mainOrderId;
        this.template.querySelector(".my-form1").submit(fields);        
        this.spinner = true;
    }
    handleSucess(){
        showToast(this,'Record has been updated','success','Success');        
        this.updateAccountRecord();        
    }
    handleError(event){
        handleErrors(this,event.detail);
        this.spinner = false;
    }

    handleSubmit2(event){
        event.preventDefault();
        const fields = event.detail.fields;        
        this.template.querySelector(".my-form2").submit(fields);        
        this.spinner = true;
    }
    handleSucess2(){
        showToast(this,'Record has been updated','success','Success');
        this.updateAccountRecord();        
    }
    handleError2(event){
        handleErrors(this,event.detail);
        this.spinner = true;
    }
    

    setLookupField(event){
        const oppObj = JSON.parse(JSON.stringify(this.oppObj));
        if(event.detail.field==='OwnerId'){
            this.oppOwnerId = event.detail.value;
            oppObj.OwnerId = event.detail.value;
            oppObj.Owner.Name = event.detail.name;
        }
        if(event.detail.field==='mainOrder'){
            this.mainOrderId = event.detail.value;
            oppObj.Main_Order__c = event.detail.value;
            oppObj.Main_Order__r.OrderNumber = event.detail.name;
        }
        this.oppObj = oppObj;
    }

   
}