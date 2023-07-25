/****
Created By	 : Girikon(Mukesh Gupta)
Created On	 : 19 Nov, 2019
@description : Component used on Opportunity Detail Page to fetch Migrated Products under 
                Qoutes Tab -> Opportunity Product tab-> Migrated Products.

Modification log --
Modified By	: 
*****/

/* eslint-disable no-console */
import { LightningElement, api, track } from 'lwc';

export default class crmMigratedProducts extends LightningElement {
    @api recordId;
    @track conditions;
    connectedCallback(){
        if(this.recordId){
            this.conditions = "OpportunityId='"+this.recordId+"' AND x_Product_Name__c!='' AND x_Product_Name__c!=null";
        }
    }
}