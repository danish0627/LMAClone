/*
    Created By		: Girikon( Yash Gupta [STL-15] )
    Created On		: 26/7/2019
    @description 	: This ControllerJS is of booth approval dashboard.
    Modified By		: Yash Gupta [STL-15 2/8/2019]
*/

import { LightningElement } from 'lwc';

export default class BoothApprovalDashboard extends LightningElement {

    /*
        * @description [This method is used to call the method of approved and declined opportunity method while click on tab]
    */
    handleTabClick(event){
        if(event.target.label==='Approved Opportunity'){            
            if(this.template.querySelector('c-approved-opportunity-dashboard')!==null){
                this.template.querySelector('c-approved-opportunity-dashboard').refreshTableOnTabChange();
            }
        }
        else if(event.target.label==='Declined Opportunity'){
            if(this.template.querySelector('c-declined-opportunity-dashboard')!==null){
                this.template.querySelector('c-declined-opportunity-dashboard').refreshTableOnTabChange();
            }
        }
    }
}