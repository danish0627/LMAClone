/* eslint-disable @lwc/lwc/no-async-operation */
/* eslint-disable no-alert */
import { LightningElement, track, api } from "lwc";
import getSSCTeamMember from "@salesforce/apex/SSCDashboardLtngCtrl.getSSCTeamMember";
import getRecordDetail from '@salesforce/apex/CommonTableController.getRecordDetail';
import strUserId from '@salesforce/user/Id';
import {handleErrors} from 'c/lWCUtility';
const DELAY=300;

//Retrieve Custom Labels
import Account_Name from '@salesforce/label/c.Account_Name';
import Submission_Date from '@salesforce/label/c.Submission_Date';

export default class ApprovedContractDashboard extends LightningElement {

  @track showTable = false;
  @track toggleCondition = "Manual_Contract_Approved__c=true";
  @track toggleDelegateOppCon;
  @track pendingContractCond;
  @track openActionModal;
  @track oppFields = '';
  @track oppFieldsLabels = '';

  connectedCallback() {
    this.getUserDetail();
    this.retrieveSSCTeamMember();
  }

  /**
   * description: This method is used to fetch the list of Event_Series__c from SSC team.
   */
  retrieveSSCTeamMember() {
    getSSCTeamMember()
      .then(result => {
        if (result) {
          let ids = [];
          for (let i = 0; i < result.length; i++) {
              if(result[i].SSC_Team__r.Event_Series__c!==undefined){
                ids.push(result[i].SSC_Team__r.Event_Series__c);
              }    
          }
          //Modified By: Garima Gupta As per jira ticket - BSM-835 - Start
          //this.pendingContractCond ='(Status__c=\'Awaiting Payment\' AND EventEdition__r.Part_of_Series__c IN (\''+ids.join('\',\'')+'\') AND x_Legacy_Id__c = \'\' AND Do_not_activate_Billing__c = false) AND (No_Billing__c = false OR (EventEdition__r.No_Billing__c = true AND EventEdition__r.Event_Price_Book__r.Name = \'Brazil\'))';
          this.pendingContractCond ='(Status__c=\'Awaiting Payment\' AND Exhibitor_Paid_By__c != \'Delegate Sales\' AND EventEdition__r.Part_of_Series__c IN (\''+ids.join('\',\'')+'\') AND Do_not_activate_Billing__c = false) AND (No_Billing__c = false OR (EventEdition__r.No_Billing__c = true AND EventEdition__r.Event_Price_Book__r.Name = \'Brazil\'))';

          this.toggleDelegateOppCon = '(Status__c=\'Awaiting Payment\' AND Exhibitor_Paid_By__c = \'Delegate Sales\' AND EventEdition__r.Part_of_Series__c IN (\''+ids.join('\',\'')+'\') AND Do_not_activate_Billing__c = false) AND (No_Billing__c = false OR (EventEdition__r.No_Billing__c = true AND EventEdition__r.Event_Price_Book__r.Name = \'Brazil\'))';
          //Modified By: Garima Gupta As per jira ticket - BSM-835 - END
          this.showTable = true;
        }
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
                this.oppFields = 'Name,Account.Name,EventEdition__r.Name,CloseDate,Submission_Date__c,StageName,Status__c,Tax_Rule_SAP__c,Amount,SBQQ__PrimaryQuote__r.Nota_Fiscal_Due__c,Approved_Rejected_By__r.Name,Approved_Rejected_At__c';
                this.oppFieldsLabels = 'Opportunity Name,'+Account_Name+',Event Edition,Close Date,'+Submission_Date+',Stage,Status,TAX Rule,Amount,Amount to Pay,Approved By,Approved At';
            } else if(res[0].UserRole.Name !== 'SSC-Brazil') {
                this.oppFields = 'Name,Account.Name,EventEdition__r.Name,CloseDate,StageName,Status__c,Tax_Rule_SAP__c,Amount,Approved_Rejected_By__r.Name,Approved_Rejected_At__c';
                this.oppFieldsLabels = 'Opportunity Name,'+Account_Name+',Event Edition,Close Date,Stage,Status,TAX Rule,Amount,Approved By,Approved At';
            }
        }
    })
    .catch(error=>{
        handleErrors(this,error);
    })
}

  /**
   * description: This method is used to call the pop up model ie. approvedContractDashboardModel
   */
  handleActionModal(event){
    this.recordId = event.detail;
    window.clearTimeout(this.delayTimeout);
    this.openActionModal = false;
    this.delayTimeout = setTimeout(()=>{
        this.openActionModal = true;
        this.template.querySelector('c-approved-contract-dashboard-model').getOppDetail(this.recordId);
    },DELAY);
}

  /*
  * @description [This method is used to refresh this table while click on tab]
  */ 
  @api 
  refreshTableOnTabChange(){
      if(this.template.querySelector('c-common-table')){
        this.template.querySelector('c-common-table').refreshTable();
      }
  }
}