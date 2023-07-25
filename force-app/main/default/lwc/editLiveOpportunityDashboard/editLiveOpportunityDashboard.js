/*
    Created By		: Girikon( Yash Gupta[STL-15] )
    Created On		:  29/7/2019
    @description 	: This ControllerJS is of edit live Opportunity.
    Modified By		: Girikon( Yash Gupta[STL-15 2/8/2019 ]
*/

import { LightningElement, track, api } from 'lwc';
import {handleErrors} from 'c/lWCUtility';

export default class EditLiveOpportunityDashboard extends LightningElement {
    @track isShow;
    @track mySpinner;
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
        this.mySpinner = false;
        this.className = '';
    }

    /*
        * @description [This method is used to close the model]
    */
    closeModal() {
        this.isOpenEditModal = false;
    }    

    /*
        * @description [This method is call at the time of submit the data]
    */
	handleSubmit(event) {
        this.mySpinner = true;
        event.preventDefault(); // stop the form from submitting
		let fields = event.detail.fields;        
        this.template.querySelector(".edit_single_record").submit(fields);
    }
    
    /*
        * @description [This method is call after the data is submitted]
    */
	handleSuccess() {
        this.mySpinner = false;
        this.dispatchEvent(new CustomEvent('refreshtable'));
		this.isOpenEditModal = false;
    }
    
    /*
        * @description [This method is call if there is an error]
    */
	handleError(event) {
		this.mySpinner = false;		
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