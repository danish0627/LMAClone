/* eslint-disable no-alert */
/* eslint-disable no-console */
import { LightningElement,track,api } from 'lwc';
import getRecordDetail3 from '@salesforce/apex/CommonTableController.getRecordDetail3';
import {handleErrors,showToast} from 'c/lWCUtility';
import Id from '@salesforce/user/Id';

//Retrieve Custom Labels
import Bill_To_Contact from '@salesforce/label/c.Bill_To_Contact';
import Product_Name1 from '@salesforce/label/c.Product_Name1';
import Order_Number from '@salesforce/label/c.Order_Number';
import Invoice1 from '@salesforce/label/c.Invoice1';
import Payment_Due_Date from '@salesforce/label/c.Payment_Due_Date';
import Payment_Schedule1 from '@salesforce/label/c.Payment_Schedule1';
import First_Payment_Due_Date from '@salesforce/label/c.First_Payment_Due_Date';

export default class CrmOpportunityFinancialTab extends LightningElement {

    @track showSpinner = false;
    @track showEditButton;
    @track showEdit;
    userId=Id;
    @track showBrasilTab = false;
    @api recordId;
    @track orderCond1;
    @track orderCond2;
    @track paymentModelCond;
    @track productHistoryCond;
    @track finalInvoiceCondition1;
    @track finalInvoiceCondition2;
    @track contractCond;
    @track invHistoryCond;
    @track orderId;
    @track creditNotCond;
    @track creditCardChrgesCond;
    @track profileName;
    @track allowedProfiles;
    @track creditNoteFieldsLabels;
    @track productHistoryFieldsLabels;
    @track paymentsFieldsLabels;
    @track PAYMENTDUEDATE;
    @track PAYMENTSCHEDULE;
    @track FIRSTPAYMENTDUEDATE;
    

    /**
     * description: This method will call at the time of load
     */
    connectedCallback(){
        this.retrieveContractFromAmendOppty();
        this.retrieveAmendmentQuote();
        this.retrieveCurrentUserProfile();
        this.paymentModelCond = 'blng__Invoice__r.blng__Order__r.OpportunityId = \''+this.recordId+'\'';
        this.contractCond = 'SBQQ__Opportunity__c = \''+this.recordId+'\' AND Main_Contract__c = true AND Status = \'Activated\'';
        this.creditNotCond='blng__RelatedInvoice__r.blng__Order__r.OpportunityId=\''+this.recordId+'\' and blng__RelatedInvoice__r.blng__InvoiceStatus__c=\'Rebilled\'';
        this.creditCardChrgesCond='Opportunity_Name__c=\''+this.recordId+'\'';
        this.creditNoteFieldsLabels = 'Account,Allocation,Balance,'+Bill_To_Contact+',Credit Note Date,Credit Note Number,Sequential Number,Notes,Refunds, Status,Source Invoice,Subtotal,Tax,Total Amount (With Tax),Unallocation';
        this.productHistoryFieldsLabels = 'QUOTE,'+Product_Name1+',QUANTITY,NET UNIT PRICE,NET TOTAL,LIST UNIT PRICE,LIST TOTAL,LAST MODIFIED DATE"';
        this.paymentsFieldsLabels = 'Payment Number,Payment Type,'+Order_Number+','+Invoice1+',Amount,Created Date,Last Modified Date,Opportunity';
        this.PAYMENTDUEDATE = Payment_Due_Date;
        this.PAYMENTSCHEDULE = Payment_Schedule1;
        this.FIRSTPAYMENTDUEDATE = First_Payment_Due_Date;
    }

    /**
     * description : This method will fetch the data from SBQQ__Quote__c also it contains different conditions.
     */
    retrieveAmendmentQuote(){
        let condition='SBQQ__Opportunity2__r.Master_Opportunity__c = \''+ this.recordId+'\'';
        getRecordDetail3({objectName:'SBQQ__Quote__c',allFields:'Id',condition:condition})
        .then(result=>{
            if(result){
                let quoteId = [];
                for (let i = 0; i < result.length; i++) {
                    if(result[i].Id!==undefined){
                        quoteId.push(result[i].Id);
                    }    
                }
                this.productHistoryCond = '(SBQQ__Quote__r.SBQQ__Opportunity2__c = \''+this.recordId+'\' OR SBQQ__Quote__c IN (\''+quoteId.join('\',\'')+'\')) ';
            }
        })
        .catch(error=>{
            handleErrors(this,error);
        });
    }

    /**
     * description : This method will fetch the data from Opportunity also it contains different conditions.
     */
    retrieveContractFromAmendOppty(){
        let condition='Id = \''+this.recordId+'\' AND SBQQ__AmendedContract__c!=null';
        let fields='SBQQ__AmendedContract__r.ContractNumber,SBQQ__AmendedContract__c,SBQQ__AmendedContract__r.Name';
        getRecordDetail3({objectName:'Opportunity',allFields:fields,condition:condition})
        .then(result=>{
            if(result){                
                if(result.length===0){
                    this.retrieveMainContract();
                    this.finalInvoiceCondition1='blng__InvoiceStatus__c NOT IN (\'Cancelled\',\'Rebilled\') AND Invoice_Heirarchy__c NOT IN(\'Parent Invoice\',\'Child Created\') AND (blng__Order__r.OpportunityId=\''+this.recordId+'\' or blng__Order__r.Opportunity.Master_Opportunity__c=\''+this.recordId+'\') ';
                } else {
                    this.orderCond1 ='OpportunityId =\''+this.recordId+'\' ';                        
                    this.finalInvoiceCondition2 = 'blng__InvoiceStatus__c NOT IN (\'Cancelled\',\'Rebilled\') AND blng__Order__r.Main_Order__c=true AND blng__Order__r.OpportunityId=\''+this.recordId+'\' AND Invoice_Heirarchy__c NOT IN(\'Parent Invoice\',\'Child Created\') ';
                    this.invHistoryCond='blng__Order__r.OpportunityId=\''+this.recordId+'\' and Invoice_Heirarchy__c NOT IN(\'Parent Invoice\',\'Child Created\') ';
                }                
            }
        })
        .catch(error=>{
            handleErrors(this,error);
        });
    }

    /**
     * description: This method will fetch the contact data based on condition.
     */
    retrieveMainContract(){
        let condition='SBQQ__Opportunity__c = \''+this.recordId+'\' AND Main_Contract__c = true AND Status = \'Activated\' order by ActivatedDate desc limit 1';
        let fields='Id';
        getRecordDetail3({objectName:'Contract',allFields:fields,condition:condition})
        .then(result=>{
            console.log(JSON.stringify(result));
            if(result){
                if(result.length > 0){
                    this.orderCond2='ContractId=\''+result[0].Id+'\' '; 
                    this.invHistoryCond='(blng__Order__r.OpportunityId=\''+this.recordId+'\' OR blng__Order__r.ContractId=\''+result[0].Id+'\') and Invoice_Heirarchy__c NOT IN (\'Parent Invoice\',\'Child Created\') ';
                }
                else{
                    this.orderCond2='Id=\'\' '; 
                    this.invHistoryCond = '(blng__Order__r.OpportunityId=\''+this.recordId+'\') and Invoice_Heirarchy__c NOT IN (\'Parent Invoice\',\'Child Created\') ';
                }
            }
        })
        .catch(error=>{
            handleErrors(this,error);
        })
    }

    /**
     * description: This method will match the current user profile.
     */
    retrieveCurrentUserProfile(){
        let condition='Id=\''+this.userId+'\'';
        let fields='Id,Profile.Name';
        let allProfiles=['Sales-Brasil','SSC Finance-Accounting','System Administrator','Global SFDC Team Integration Users','GE System Administrator','GE BA Administrator']
        getRecordDetail3({objectName:'User',allFields:fields,condition:condition})
        .then(result=>{
            if(result){
                if(result.length!==0){
                    this.profileName=result[0].Profile.Name;
                    if(allProfiles.includes(this.profileName)){
                        this.showBrasilTab=true;
                        this.retrieveAllowedProfile(this.profileName)
                    }
                }
            }
        })
        .catch(error=>{
            handleErrors(this,error);
        })
    }

    /**
     * description: This method will retrieve the allow profile custom setting data.
     */
    retrieveAllowedProfile(profileName){
        let condition='Name=\''+profileName+'\'';
        let fields='Id,Name';
        getRecordDetail3({objectName:'AllowedProfiles__c',allFields:fields,condition:condition})
        .then(result=>{
            if(result){
                if (result.length !== 0) {
                    this.allowedProfiles = result;
                    this.showEditButton = true;
                } else {
                    this.retrieveClosedOpps();
                }
            }
            
        })
        .catch(error=>{
            handleErrors(this,error);
        })
    }

    /**
    * description: This method will retrieve the opportunity data based on condition.
    */
    retrieveClosedOpps(){
        let condition='StageName in (\'Closed Won\',\'Closed Booked\',\'Closed Lost\') and Id = \''+this.recordId+'\'';
        let fields='Id,StageName';
        getRecordDetail3({objectName:'Opportunity',allFields:fields,condition:condition})
        .then(result=>{
            if (result) {
                if (result.length !== 0) {
                    this.showEditButton = false;
                } else {
                    this.showEditButton = true;
                }
            }
        })
        .catch(error=>{
            handleErrors(this,error);
        })
    }

    /**
     * description: This method is used to show the edit form.
     */
    showEditForm(){
        this.showEdit=!this.showEdit;
    }

    /**
     * description : This method will handle when user submit data after editing.
     */
    handleSubmit(){
        this.showSpinner=true;
    }
    
    /**
     * description : This method will handle when Data is successfully updated
     */
    handleSuccess(){
        this.showSpinner=false;
        showToast(this,'Order Updated','success','Success');
        this.showEditForm();
    }
}