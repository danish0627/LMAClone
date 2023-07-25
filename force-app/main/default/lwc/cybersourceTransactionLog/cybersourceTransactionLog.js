import { LightningElement, track } from 'lwc';

export default class CybersourceTransactionLog extends LightningElement {
    
    /**
     * description: Variables Declarations.
     */
    @track successCond;
    @track notSuccessCond;

    /**
    * description: This method will call at the time of load.
    */
    connectedCallback(){
        this.successCond = 'Payment_Status__c = \'Success\'';
        this.notSuccessCond = 'Payment_Status__c = \'Initiated\'';
    }
}