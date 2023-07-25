/*
Created By	 : Girikon(Mukesh)
Created On	 : ‎July ‎23, ‎2019
@description : This is child component for opp-home-page-dash-board component

Modification log --
Modified By	: 
*/

import { LightningElement,api, track } from 'lwc';
import getRecordDetail from '@salesforce/apex/CommonTableController.getRecordDetail';
import {handleErrors} from 'c/lWCUtility';

export default class DashboardOpportunity extends LightningElement {
    @api relatedRecordId;
    @track testAmount=0.00;
    @track condition1;
    @track condition2;
    @track condition3;

    connectedCallback(){
        this.condition1='SBQQ__Opportunity2__c=\''+this.relatedRecordId+'\'';
        this.condition2='SBQQ__Opportunity__c=\''+this.relatedRecordId+'\'';
        this.condition3='Opportunity__c=\''+this.relatedRecordId+'\'';
        this.getOpportunityAmount(this.relatedRecordId);
    }

    /**
     * Get Opportunity Amount by opportunity id and amount divide by 3.
     * 
     * @param oppId Opportunity Id
     */
    getOpportunityAmount(oppId){
        getRecordDetail({objectName:'Opportunity',allFields:'Amount',recordId:oppId})
        .then(data=>{
            if(data.length>0){
                this.testAmount = data[0].Amount;
                if(this.testAmount){
                    this.testAmount = this.testAmount/3;
                }
            }
            
        })
        .catch(error=>{
            handleErrors(this,error,'error','error');
        })
    }
}