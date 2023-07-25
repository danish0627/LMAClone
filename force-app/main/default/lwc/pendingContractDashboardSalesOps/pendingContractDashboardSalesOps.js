/* eslint-disable @lwc/lwc/no-async-operation */
/* eslint-disable no-alert */
import { LightningElement, track , api} from 'lwc';
import getdata from '@salesforce/apex/SSCDashboardLtngCtrl.getSSCTeamMember';
import getRecordDetail from '@salesforce/apex/CommonTableController.getRecordDetail';
import strUserId from '@salesforce/user/Id';
import {handleErrors} from 'c/lWCUtility';
const DELAY=300;

//Retrieve Custom Labels
import Account_Name from '@salesforce/label/c.Account_Name';
import Submission_Date from '@salesforce/label/c.Submission_Date';
import Opportunity_Owner from '@salesforce/label/c.Opportunity_Owner';


export default class PendingContractDashboardSalesOps extends LightningElement {

    @track openActionModal=false;
    @track recordId='';
    @track error;
    @track pendingContractCond;
    @track oppFields = '';
    @track oppFieldsLabels = '';
    @track toggleDelegateOppCon;
    @api isSalesOpsTeamMember;
    /**
    * Description: This method will call at the time of load.
    */
    connectedCallback(){
        this.getUserDetail();
        this.getSSCTeamMember();
    }
    
    /**
    * Description: This method will fetch the list of event series from ssc team member.
    */
    getSSCTeamMember(){
        getdata()
        .then(data=>{
            let ids = [];
            let datas = JSON.parse(JSON.stringify(data));
            for(let i=0; i<datas.length; i++){
                if(datas[i].SSC_Team__r.Event_Series__c!==undefined){
                    ids.push(datas[i].SSC_Team__r.Event_Series__c);
                }                
            }
            //Modified By: Garima Gupta As per jira ticket - BSM-835 - Start
            //this.pendingContractCond = '(Status__c = \'Pending Accounting Approval\' AND EventEdition__r.Part_of_Series__c IN (\''+ids.join('\',\'')+'\') AND x_Legacy_Id__c = \'\' AND SBQQ__Contracted__c = true AND Main_Contract__c != NULL AND Do_not_activate_Billing__c = false AND IsAmendContractOpp__c = false) AND (No_Billing__c = false OR (EventEdition__r.No_Billing__c = true AND EventEdition__r.Event_Price_Book__r.Name = \'Brazil\'))';
            this.pendingContractCond = '(Status__c = \'Sales Ops Review - Pending\' AND Exhibitor_Paid_By__c != \'Delegate Sales\' AND EventEdition__r.Part_of_Series__c IN (\''+ids.join('\',\'')+'\') AND SBQQ__Contracted__c = true AND Main_Contract__c != NULL AND Do_not_activate_Billing__c = false AND IsAmendContractOpp__c = false) AND (No_Billing__c = false OR (EventEdition__r.No_Billing__c = true AND EventEdition__r.Event_Price_Book__r.Name = \'Brazil\') )';

            this.toggleDelegateOppCon = '(Status__c = \'Sales Ops Review - Pending\' AND Exhibitor_Paid_By__c = \'Delegate Sales\' AND EventEdition__r.Part_of_Series__c IN (\''+ids.join('\',\'')+'\') AND SBQQ__Contracted__c = true AND Main_Contract__c != NULL AND Do_not_activate_Billing__c = false AND IsAmendContractOpp__c = false) AND (No_Billing__c = false OR (EventEdition__r.No_Billing__c = true AND EventEdition__r.Event_Price_Book__r.Name = \'Brazil\') )';
            //Modified By: Garima Gupta As per jira ticket - BSM-835 - END
        })
        .catch(error=>{
           handleErrors(this,error);
        });
    }

    /**
    * Description: This method will fetch the list of userrole from user based on login user id.
    */
    getUserDetail(){
        getRecordDetail({objectName:'User',allFields:'UserRole.Name',recordId:strUserId})
        .then(res=>{
            if(res.length > 0){
                if(res[0].UserRole.Name === 'SSC-Brazil'){
                    this.oppFields = 'Name,Account.Name,ISO_Code__c,Amount_Custom__c,CloseDate,Submission_Date__c,StageName,Status__c,Tax_Rule_SAP__c,SSC_Brazil_Status__c,Sales_Ops_Rejection_Reason__c,Sales_Ops_Notes__c,EventEdition__r.Name,Owner.Name,Exhibitor_Paid_By__c,User_Type__r.Name';
                    this.oppFieldsLabels = 'Opportunity Name,'+Account_Name+',ISO Code,Contract Total,Close Date,'+Submission_Date+',Stage,Status,TAX Rule,SSC Brazil Status,Sales Ops Rejection Responses,Sales Ops Notes,Event Edition,'+Opportunity_Owner+'Exhibitor Paid By,User Type';
                } else if(res[0].UserRole.Name !== 'SSC-Brazil') {
                    this.oppFields = 'Name,Account.Name,ISO_Code__c,Amount_Custom__c,CloseDate,StageName,Status__c,Tax_Rule_SAP__c,Sales_Ops_Rejection_Reason__c,Sales_Ops_Notes__c,EventEdition__r.Name,Owner.Name,Exhibitor_Paid_By__c,User_Type__r.Name';
                    this.oppFieldsLabels = 'Opportunity Name,'+Account_Name+',ISO Code,Contract Total,Close Date,Stage,Status,TAX Rule,Sales Ops Rejection Responses,Sales Ops Notes,Event Edition,'+Opportunity_Owner+'Exhibitor Paid By,User Type';
                }
            }
        })
        .catch(error=>{
            handleErrors(this,error);
        })
    }

    /**
    * Description: This method will call once user click on popup icon.
    */
    handleActionModal(event){
        this.recordId = event.detail;
        window.clearTimeout(this.delayTimeout);        
        this.openActionModal = false;
        this.delayTimeout = setTimeout(()=>{
            this.recordId = event.detail;
            this.openActionModal = true; 
            this.template.querySelector('c-pending-contract-modal').getOppDetail(this.recordId);           
        },DELAY);
    }

    /*
        * @description [This method is used to refresh this table while click on tab]
    */   
   handleRefreshPendingContract(){
        this.template.querySelector('c-common-table').refreshTable();
   }
}