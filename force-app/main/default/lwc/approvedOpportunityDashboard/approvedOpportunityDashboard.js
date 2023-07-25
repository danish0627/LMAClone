/*
    Created By		: Girikon( Yash Gupta [STL-15] )
    Created On		: 26/7/2019
    @description 	: This ControllerJS is of approved Opportunity.
    Modified By		: Yash Gupta [STL-15 2/8/2019]
*/
import { LightningElement,api,track } from 'lwc';
import userId from '@salesforce/user/Id';

export default class ApprovedOpportunityDashboard extends LightningElement {
    @track approvedContractCond;

    connectedCallback(){
        this.approvedContractCond = 'Opportunity__r.Booth_Approval_Status__c=\'Approved\' AND Opportunity__r.MSA_Requested__c=false AND Opportunity__r.Multiple_Stands_Approval__c=true AND Status__c=\'Approved\'';// AND Opportunity__r.EventEdition__r.Event_Director__c = \''+userId+'\'';
    }
    
    /*
        * @description [This method is used to refresh this table while click on tab]
    */
    @api
    refreshTableOnTabChange(){
        this.template.querySelector('c-common-table').refreshTable();
    }
}