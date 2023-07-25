/* eslint-disable no-alert */
/*
    Created By		: Girikon( Yash Gupta [STL-15] )
    Created On		: 26/7/2019
    @description 	: This ControllerJS is of live Opportunity.
    Modified By		: Yash Gupta [STL-15 2/8/2019]
*/
import { LightningElement, track, wire  } from 'lwc';
import userId from '@salesforce/user/Id';
const DELAY=300;

export default class LiveOpportunityDashboard extends LightningElement {
    @track openEditModal=false;
    @track recordId='';
    @track liveOppQryCond;
    @track isOpenMassUpdateForm;
    /*
        * @description [This method is call at the time of load]
    */

    connectedCallback(){
        this.liveOppQryCond='Opportunity__r.MSA_Requested__c=true AND Status__c=\'\'';//AND Opportunity__r.EventEdition__r.Event_Director__c = \''+userId+'\'';
        
    }
    

    /*
        * @description [This method is call at the time of edit record]
    */
    handleEditModal(event){
        this.recordId = event.detail;
        window.clearTimeout(this.delayTimeout);
        this.openEditModal = false;
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(()=>{
            this.openEditModal = true;
        },DELAY);
    }

    /*
        * @description [This method is used to refresh the table]
    */
    handleRefreshTable(){
        try {
            this.template.querySelector('c-common-table').refreshTable();    
        }
        catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
    }
    
    /*
        * @description [This method is used update the record in bulk]
    */
    massUpdateFormOpner(){
        window.clearTimeout(this.delayTimeout);
        this.isOpenMassUpdateForm = false;
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(()=>{
            this.isOpenMassUpdateForm = true;
        },DELAY);        
    }
    
    /*
        * @description [This method is used call at the time of submit]
    */
    handleSubmitForm(event){        
        this.template.querySelector('c-common-table').massUpdateHandler(event.detail);
    }
}