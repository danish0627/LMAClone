/* eslint-disable no-console */
import { LightningElement, api, track } from 'lwc';

export default class AmendmentOpportunityDrawr extends LightningElement {
    @api contractId;
    @track showData=false;
    connectedCallback(){
        this.showData=true;
        this.sContractId =this.contractId;
    }
    
}