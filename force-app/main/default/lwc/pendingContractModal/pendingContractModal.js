/* eslint-disable no-console */
/*
Created By	 : Girikon(Mukesh)
Created On	 : Aug 08, 2019
@description : Used to display form in modal of SSC Dashboard (PendingContracts Tab) Form Will be open user click on (open window icon) of row.
Modification log
Modified By	: Rajesh Kumar - on 30-07-2020 to BK-6532
*/

import { LightningElement,api,track, wire } from 'lwc';
import {handleErrors, showToast} from 'c/lWCUtility';
import getRejectionOptions from '@salesforce/apex/SSCDashboardLtngCtrl.getRejectionOptions';
import getSalesOpsRejectionOptions from '@salesforce/apex/SSCDashboardLtngCtrl.getSalesOpsRejectionOptions';
import getRecordDetail from '@salesforce/apex/CommonTableController.getRecordDetail';
import isSSCBrazilRole from '@salesforce/apex/SSCDashboardLtngCtrl.isSSCBrazilUser';
import approveContract from '@salesforce/apex/SSCDashboardLtngCtrl.approveContract';
import userId from '@salesforce/user/Id';

export default class PendingContractModal extends LightningElement {

    @api isOpenActionModal;
    @api operationType='';
    @api recordId;    
    @api objectName;
    @api isSalesOpsTeamMember;
    @track chatterAppUrl;
    @track oppName;
    @track isDisabled;
    @track isSSCBrazilUser;
    @track rejectionOptions;
    @track salesOpsrejectionOptions;
    @track rejectionResponses='';
    @track spinner;
    @track isSalesopsProcess = false;
     
    @wire(getRejectionOptions,{})
    wireRejectionOptions(result){
        

        if(result.data){
            this.rejectionOptions = JSON.parse(JSON.stringify(result.data.Rejection_Responses.FieldPicklist));
            this.rejectionOptions.splice(0,1,{label:'--None--',value:''});
        }
        else if(result.error){
            handleErrors(this,result.error);
        }
    }

    @wire(getSalesOpsRejectionOptions,{})
    wireSalesOpsRejectionOptions(result){
        

        if(result.data){
            this.salesOpsrejectionOptions = JSON.parse(JSON.stringify(result.data.Rejection_Responses.FieldPicklist));
            this.salesOpsrejectionOptions.splice(0,1,{label:'--None--',value:''});
        }
        else if(result.error){
            handleErrors(this,result.error);
        }
    }

    getData(){
        isSSCBrazilRole()
        .then(result=>{
            this.isSSCBrazilUser = result;            
        })
        .catch(error=>{
            handleErrors(this,error)
        })
    }

    @api
    getOppDetail(recordId){        
        this.recordId = recordId;
        this.chatterAppUrl = '/apex/SSCChatter?Id='+this.recordId;
        getRecordDetail({objectName:'Opportunity',allFields:'Name',recordId:recordId})
        .then(data=>{
            if(data.length>0){
                this.oppName = data[0].Name;
                console.log('Data >> '+JSON.stringify(data[0]));
            }
            this.getData();
        })
        .catch(error=>{
            handleErrors(this,error);
        });
    }

    @track openRejectModal;
    openRejectConfirmationModal(){
        this.rejectionResponses = '';
        this.openRejectModal = true;
        if(this.operationType == 'SalesOps'){
            this.isSalesopsProcess = true;
        }
    }
    /**
     * Fire whenever user click Reject button of confirmation modal
     */
    yesReject(){

    }

    handleSubmit(event){
        
        event.preventDefault();
        const fields = event.detail.fields;
 
        let dateTimeNow = new Date().toISOString();
        if(this.operationType == 'SSC')
        {
            if(this.rejectionResponses==='Other - Comment box will be provided for further explanation'){
                fields.SSC_Notes__c = this.template.querySelector(".ssc-notes-field").value;
                if(fields.SSC_Notes__c.trim()===''){
                    this.template.querySelector(".ssc-notes-field").showHelpMessageIfInvalid();
                    showToast(this,'SSC Note field must not empty','error','Error');
                    return;
                }
                else if(fields.SSC_Notes__c.length>131072){
                    this.template.querySelector(".ssc-notes-field").showHelpMessageIfInvalid();
                    showToast(this,'A maximum of 131072 characters are allowed in a SSC Note.','error','Error');
                    return;
                }
            }                      
                              
            fields.StageName = 'Customize';
            fields.Approved_Rejected_By__c = userId;
            fields.Status__c = 'Accounting Rejected';
            fields.Rejection_Responses__c = this.rejectionResponses;
            fields.Approved_Rejected_At__c = dateTimeNow;
            fields.Pending_Accounting_Approval_Since_Date__c = null;
        }
        else{
            if(this.rejectionResponses==='Other - Comment box will be provided for further explanation'){
                fields.Sales_Ops_Notes__c = this.template.querySelector(".ssc-notes-field").value;
                if(fields.Sales_Ops_Notes__c.trim()===''){
                    this.template.querySelector(".ssc-notes-field").showHelpMessageIfInvalid();
                    showToast(this,'Sales Ops Note field must not empty','error','Error');
                    return;
                }
                else if(fields.Sales_Ops_Notes__c.length>131072){
                    this.template.querySelector(".ssc-notes-field").showHelpMessageIfInvalid();
                    showToast(this,'A maximum of 131072 characters are allowed in a Sales Ops Notes.','error','Error');
                    return;
                }
            } 
            fields.StageName = 'Customize';
            fields.Status__c = 'Rejected by Sales Ops Team';
            fields.Approved_Rejected_By_Sales_Ops__c = userId;
            fields.Sales_Ops_Rejection_Reason__c = this.rejectionResponses;
            fields.Approved_Rejected_At_Sales_Ops__c = dateTimeNow;
             fields.Pending_Accounting_Approval_Since_Date__c = null;
        }
        
        
        this.template.querySelector(".reject-form").submit(fields);
        this.spinner = true;
    }
    handleSuccess(){
        showToast(this,'Contract was rejected','success','Success');
        this.spinner = false;
        this.openRejectModal = undefined;
        this.isOpenActionModal = undefined;
        //fire event to refresh Pending Contract tab
        this.dispatchEvent(new CustomEvent('refreshpendingcontract'));
    }
    handleError(event){
        handleErrors(this,event.detail);
    }

    closeRejectModal(){
        this.openRejectModal = undefined;        
    }

    @track openApprovModal;
    openApproveConfirmationModal(){
        this.openApprovModal = true;
        if(this.operationType == 'SalesOps'){
            this.isSalesopsProcess = true;
        }
    }
    /**
     * Fire whenever user click Approve button of confirmation modal
     */
    yesApprove(){
        this.spinner = true;
        let oppObj = {sobjectType:'Opportunity',Id:this.recordId};
        approveContract({oppObj:oppObj,isSalesOpsProcess : this.isSalesopsProcess})
        .then(()=>{
            showToast(this,'Contract Approved','success','Success');
            this.spinner = false;
            this.openApprovModal = undefined;
            this.isOpenActionModal = undefined;
            //fire event to refresh Pending Contract tab
            this.dispatchEvent(new CustomEvent('refreshpendingcontract'));
        })
        .catch(error=>{
            this.spinner = false;            
            handleErrors(this,error);
        })
    }
    closeApproveModal(){
        this.openApprovModal = undefined;
    }

    handleRejectionResponse(event){
        this.rejectionResponses = event.detail.value;
        if(this.rejectionResponses!==''){
            this.template.querySelector(".ssc-note-box").classList.remove('slds-hide');
        }
        else{
            this.template.querySelector(".ssc-note-box").classList.add('slds-hide');
        }

        if(this.rejectionResponses==='Other - Comment box will be provided for further explanation'){            
            this.template.querySelector(".ssc_note_2").classList.remove('slds-show');
            this.template.querySelector(".ssc_note_2").classList.add('slds-hide');
            this.template.querySelector(".ssc_note_1").classList.remove('slds-hide');
            this.template.querySelector(".ssc_note_1").classList.add('slds-show');
        }
        else{
            this.template.querySelector(".ssc_note_2").classList.remove('slds-hide');
            this.template.querySelector(".ssc_note_2").classList.add('slds-show');
            this.template.querySelector(".ssc_note_1").classList.remove('slds-show');
            this.template.querySelector(".ssc_note_1").classList.add('slds-hide');
        }
    }

    /**
     * fire after user form submit
     */
    handleAfterFormSubmission(){
        this.isOpenActionModal = false;
        this.dispatchEvent(new CustomEvent('refreshpendingcontract'));
    }

    /*
    * @description [This method is used to close the model]
    */
    closeModal() {
        this.isOpenActionModal = false;
    }
}