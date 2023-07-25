import { LightningElement, track, api } from 'lwc';
import getRecordDetail from '@salesforce/apex/CommonTableController.getRecordDetail';
import {handleErrors} from 'c/lWCUtility';

export default class ApprovedContractDashboardModel extends LightningElement {
    @api isOpenActionModal;
    @api recordId;    
    @track oppName;
    @track agreementCond;
    @track creditNoteCond;
    @track invoiceCond;

    /**
    * description: This will call at the time of approvedcontractsdashboard.
    */
    @api
    getOppDetail(recordId){
        getRecordDetail({objectName:'Opportunity',allFields:'Name',recordId:recordId})
        .then(data=>{
            if(data.length>0){
                this.oppName = data[0].Name;
            }
            this.agreementCond = "Opportunity__c = '"+recordId+"'";
            this.creditNoteCond = 'blng__RelatedInvoice__r.blng__InvoiceStatus__c = \'Rebilled\''+" AND blng__RelatedInvoice__r.blng__Order__r.OpportunityId = '"+ recordId+"'";
            this.invoiceCond = "blng__Order__r.OpportunityId = '"+recordId+"'";
        })
        .catch(error=>{
            handleErrors(this,error);
        });
    }

    /*
    * @description [This method is used to close the model]
    */
    closeModal() {
        this.isOpenActionModal = false;
    }
}