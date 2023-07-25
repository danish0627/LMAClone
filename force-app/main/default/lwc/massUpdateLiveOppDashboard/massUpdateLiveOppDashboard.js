/*
    Created By		: Girikon( Yash Gupta [STL-15] )
    Created On		: 1/8/2019
    @description 	: This ControllerJS is of mass update of booth approval.
    Modified By		: Yash Gupta [STL-15 2/8/2019]
*/

import { LightningElement,track,api } from 'lwc';
import {handleErrors} from 'c/lWCUtility';

export default class MassUpdateLiveOppDashboard extends LightningElement {
    @track isShow;    
    @track className;
    @api isOpenEditModal;
    @api recordId;
    @api recordTypeId;
    @api objectName;
    @api profileName;

    /*
        * @description [This method is call at the time of load]
    */
    connectedCallback(){
        this.isOpenEditModal = false;
        this.className = this.isShow?'slds-hide':'';

        this.isShow = true;        
        this.className = '';
    }
    
    /*
        * @description [This method is used ot close the model]
    */
    closeModal() {
        this.isOpenEditModal = false;
    }    

    /*
        * @description [This method is call at the time of submit the data]
    */
	handleSubmit(event) {        
        event.preventDefault(); // stop the form from submitting
        let fields = event.detail.fields;   
        this.dispatchEvent(new CustomEvent('submitform',{detail:fields}));
        this.isOpenEditModal = false;
    }
    
    /*
        * @description [This method is call after the data is submitted]
    */
	handleSuccess() {        
        this.dispatchEvent(new CustomEvent('refreshtable'));
		this.isOpenEditModal = false;
    }

    /*
        * @description [This method is call when there is any error]
    */
	handleError(event) {		
        handleErrors(this,event.detail.error);
    }  
    
    /*
        * @description [This method is call at the time of load]
    */
	handleLoad(){        
        this.isShow = false;
        this.className = this.isShow?'slds-hide':'';
    }
}