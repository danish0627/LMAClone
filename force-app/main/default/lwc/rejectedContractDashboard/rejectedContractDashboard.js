import { LightningElement, track, api} from 'lwc';
import getdata from '@salesforce/apex/SSCDashboardLtngCtrl.getSSCTeamMember';
import {handleErrors} from 'c/lWCUtility';
import getRecordDetail from '@salesforce/apex/CommonTableController.getRecordDetail';
import strUserId from '@salesforce/user/Id';

//Retrieve Custom Labels
import Account_Name from '@salesforce/label/c.Account_Name';
import Submission_Date from '@salesforce/label/c.Submission_Date';
const DELAY=300;

export default class RejectedContractDashboard extends LightningElement {
    @track rejectedContractCond;
    @track openActionModal;
    @track oppFields = '';
    @track oppFieldsLabels = '';
    @track toggleDelegateOppCon;


    connectedCallback(){
        this.getUserDetail();
        this.getOppData();
    }

    /**
     * description: This method will fetch the data from ssc team also it contains different conditions.
     */
    getOppData(){
        getdata()
        .then(data=>{
            let ids = [];
            let datas = JSON.parse(JSON.stringify(data));
            for(let i=0; i<datas.length; i++){
                if(datas[i].SSC_Team__r.Event_Series__c!==undefined){
                    ids.push(datas[i].SSC_Team__r.Event_Series__c);
                }                 
            }
            this.rejectedContractCond = 'Name!=\'\' AND (Status__c = \'Accounting Rejected\' AND Exhibitor_Paid_By__c != \'Delegate Sales\' AND Event_Series__c IN (\''+ids.join('\',\'')+'\') AND Do_not_activate_Billing__c = false) AND (No_Billing__c = false OR (EventEdition__r.No_Billing__c = true AND EventEdition__r.Event_Price_Book__r.Name = \'Brazil\'))';
            this.toggleDelegateOppCon = 'Name!=\'\' AND (Status__c = \'Accounting Rejected\' AND Exhibitor_Paid_By__c = \'Delegate Sales\' AND Event_Series__c IN (\''+ids.join('\',\'')+'\') AND Do_not_activate_Billing__c = false) AND (No_Billing__c = false OR (EventEdition__r.No_Billing__c = true AND EventEdition__r.Event_Price_Book__r.Name = \'Brazil\'))';
            
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
                this.oppFields = 'Name,Account.Name,EventEdition__r.Name,CloseDate,Submission_Date__c,StageName,Status__c,Tax_Rule_SAP__c,Amount,Rejection_Responses__c,SSC_Notes__c,Approved_Rejected_By__r.Name,Approved_Rejected_At__c';
                this.oppFieldsLabels = 'Opportunity Name,'+Account_Name+',Event Edition,Close Date,'+Submission_Date+',Stage,Status,TAX Rule,Contract Total,Rejection Reason,SSC Notes Comment,Rejected By,Rejected At'
            } else if(res[0].UserRole.Name !== 'SSC-Brazil') {
                this.oppFields =  'Name,Account.Name,EventEdition__r.Name,CloseDate,StageName,Status__c,Tax_Rule_SAP__c,Amount,Rejection_Responses__c,SSC_Notes__c,Approved_Rejected_By__r.Name,Approved_Rejected_At__c';
                this.oppFieldsLabels = 'Opportunity Name,'+Account_Name+',Event Edition,Close Date,Stage,Status,TAX Rule,Contract Total,Rejection Reason,SSC Notes Comment,Rejected By,Rejected At';
            }
        }
    })
    .catch(error=>{
        handleErrors(this,error);
    })
}

    /**
     * description: This method will the reject contract model.
     */
    handleActionModal(event){
        this.recordId = event.detail;
        window.clearTimeout(this.delayTimeout);
        this.openActionModal = false;
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(()=>{
            this.openActionModal = true;
            this.template.querySelector('c-rejected-contract-model').getOppDetail(this.recordId);
        },DELAY);
    }


    //handle to refresh table(Mukesh)
    @api 
    refreshTableOnTabChange(){
        if(this.template.querySelector('c-common-table')){
            this.template.querySelector('c-common-table').refreshTable();
        }
    }
}