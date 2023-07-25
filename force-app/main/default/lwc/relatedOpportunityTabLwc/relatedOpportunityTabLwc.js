import { LightningElement,track,api } from 'lwc';

//custom label
import Account_Name from '@salesforce/label/c.Account_Name';
import Close_Date from '@salesforce/label/c.Close_Date';

export default class RelatedOpportunityTabLwc extends LightningElement {
    @track boothLabel = Account_Name+',Display Name,Booth Number,Product Type,Status,Created';
    @track oppLabel = 'Opportunity,Account,Amount,Stage,Status,'+Close_Date+',Booth Number';
    @track individualContractLabel = 'Opportunity,Account,Amount,Stage,Status,'+Close_Date;
    @track oppQryCondition;
    @track oppQryCondition1;
    @track individualContractCond;
    @api recordId;

    connectedCallback(){
        this.oppQryCondition = 'Parent_Opportunity__c IN (\''+this.recordId+'\')';
        this.oppQryCondition1 = 'Related_Opportunity__r.Parent_Opportunity__c IN (\''+this.recordId+'\')';
        this.individualContractCond = 'Agent_s_Opportunity__c!=null AND Agent_s_Opportunity__c IN (\''+this.recordId+'\')';
    }

    handleTabClick(){
        if(this.template.querySelector('c-common-table')!=null){
            this.template.querySelector('c-common-table').refreshTable();    
        }
    }
}