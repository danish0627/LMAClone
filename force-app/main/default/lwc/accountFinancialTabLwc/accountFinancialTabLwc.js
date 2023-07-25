import { LightningElement,track,api,wire } from 'lwc';
import getOrderList from '@salesforce/apex/CommonController.getOrderList';
import {handleErrors} from 'c/lWCUtility';

export default class AccountFinancialTabLwc extends LightningElement {
    @api recordId;
    @track orderCond;
    @track paymentModelCond;
    @track productHistoryCond;
    @track finalInvoiceCondition;
    @track contractCond;
    @track invHistoryCond;
    @track orderId;

    connectedCallback(){
        this.orderCond = '(AccountId = \''+this.recordId+'\' OR Opportunity.AccountId = \''+this.recordId+'\') AND OrderNumber!=null';
        this.paymentModelCond = 'blng__Account__c = \''+this.recordId+'\'';
        this.productHistoryCond = 'SBQQ__Quote__r.SBQQ__Account__c = \''+this.recordId+'\'';
        this.contractCond = 'AccountId = \''+this.recordId+'\' AND Main_Contract__c = true AND Status = \'Activated\'';
        //this.invHistoryCond = 'Name!=\'\'';

        this.finalInvoiceCondition = 'blng__InvoiceStatus__c NOT IN (\'Cancelled\') AND blng__Order__r.Main_Order__c=true AND blng__InvoiceStatus__c NOT IN(\'Rebilled\') AND blng__Account__c=\''+this.recordId+'\' AND Invoice_Heirarchy__c NOT IN(\'Parent Invoice\',\'Child Created\')'
    }

    @wire(getOrderList,{recordId:'$recordId'})
    wireUserData(result){
        if(result.data){
            let ids = [];
            if(result.data.length > 0){
                for(let i=0; i<result.data.length; i++){
                    if(result.data[i].Id!==undefined){
                        ids.push(result.data[i].Id);
                    }                
                }
                this.invHistoryCond = "(blng__Account__c = '"+this.recordId+"' OR blng__Order__c IN ('"+ids.join('\',\'')+"') ) AND Invoice_Heirarchy__c NOT IN ('Parent Invoice','Child Created')";
            }
            //Added/Modified By Rajesh Kumar - BK-5121 on 11-06-2020
            else{
                this.invHistoryCond = "(blng__Account__c = '"+this.recordId+"')";
            }
        } else if(result.error){
            handleErrors(this,result.error);
        }
    }

    /*
        * @description [This method is used to call the method of refreshTable from common table component while click on tab]
    */
   handleTabClick(){
        /*if(event.target.label==='Order'){            
            if(this.template.querySelector('c-common-table')!==null){
                this.template.querySelector('c-common-table').refreshTable();
            }
        } else if(event.target.label==='Final Invoices'){            
            if(this.template.querySelector('c-common-table')!==null){
                this.template.querySelector('c-common-table').refreshTable();
            }
        } else if(event.target.label==='Payments'){            
            if(this.template.querySelector('c-common-table')!==null){
                this.template.querySelector('c-common-table').refreshTable();
            }
        } else if(event.target.label==='Product History'){
            if(this.template.querySelector('c-common-table')!==null){
                this.template.querySelector('c-common-table').refreshTable();
            }
        } else if(event.target.label==='Contract'){
            if(this.template.querySelector('c-common-table')!==null){
                this.template.querySelector('c-common-table').refreshTable();
            }
        } else if(event.target.label==='Invoice History'){
            if(this.template.querySelector('c-common-table')!==null){
                this.template.querySelector('c-common-table').refreshTable();
            }
        }*/
    }
}