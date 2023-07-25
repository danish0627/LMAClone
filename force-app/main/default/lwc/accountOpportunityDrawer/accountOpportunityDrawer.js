/* eslint-disable no-alert */
import { LightningElement,api, track } from 'lwc';
import getRecord from '@salesforce/apex/CommonTableController.getRecordDetail';
import { handleErrors,showToast } from 'c/lWCUtility';
import strUserId from '@salesforce/user/Id';

export default class AccountOpportunityDrawer extends LightningElement {
    @api relatedRecordId;
    @track condition1;
    @track condition2;
    @track condition3;
    @track isEditForm;
    @track isViewForm;
    @track spinner;
    @track currentUserProfileName;
    @track isCurrentNonAdminProfile = false;
    @track isCurrentAdminProfile = false;
    @track showPlaceholder=true;
    @track className='slds-hide';
    @api billingContactId;
    @api opportunityId;
    
    /**
     * Description: This method is used to call at the time of load.
     */
    connectedCallback(){
        this.isViewForm='slds-show';
        this.isEditForm='slds-hide';
        this.condition1='SBQQ__Opportunity2__c=\''+this.relatedRecordId+'\'';
        this.condition2='SBQQ__Opportunity__c=\''+this.relatedRecordId+'\'';
        this.condition3='Opportunity__c=\''+this.relatedRecordId+'\'';
        this.getProfileData();
    }

    /**
     * Description: This method is used to fetch the current user profile name.
     */
    getProfileData(){
        getRecord({objectName:'User',allFields:'Profile.Name',recordId:strUserId})
        .then(res=>{
            if(res.length>0){
                if(res[0].Profile.Name === 'Sales'){
                    this.isCurrentNonAdminProfile = true;
                }                
                if(res[0].Profile.Name !== 'System Administrator' && res[0].Profile.Name !== 'GE System Administrator'){
                    this.isCurrentAdminProfile = true;
                }
            }
        })
        .catch(error=>{
            alert(JSON.stringify(error));
            handleErrors(this,error);
        })
    }

    /**
     * Description: This method is used to show the edit form while click on pen icon.
     */
    editRecord(){
        this.isEditForm = 'slds-show';
        this.isViewForm = 'slds-hide';
    }

    /**
     * Description: This method is used to show the view form while click on cancel button.
     */
    viewForm(){
        this.isEditForm = 'slds-hide';
        this.isViewForm = 'slds-show';
    }

    /**
     * Description: This method is used to submit the data into opportunity while click on save button.
     */
    handleSubmit(event){
        event.preventDefault();
        const fields = event.detail.fields;
        fields.Billing_Contact__c = this.billingContactId?this.billingContactId:'';
        fields.Parent_Opportunity__c = this.opportunityId?this.opportunityId:'';
        this.template.querySelector(".my-form1").submit(fields);        
        this.spinner = true;
    }

    /**
     * Description: This method is used to call after the submit button to show the success message.
     */
    handleSucess(){
        this.spinner = false;
        showToast(this,'Record has been saved','success','Success');   
        this.viewForm();
        this.dispatchEvent(new CustomEvent('afterformsubmit'));
    }

    /**
     * Description: This method is used to call if there is any error on the save while save the data.
     */
    handleError(event){
        if(this.spinner){
            handleErrors(this,event.detail);
            this.spinner = false;
        }
    }

    /**
     * Description: called when lightning record edit form loading
     */
    handleEditFormLoad(){
        this.showPlaceholder=false;
        this.className='';
    }

    setLookupField(event){
        if(event.detail.field==='Name'){
            this.billingContactId = event.detail.value;
        }
    }

    setOpportunityLookupField(event){
        if(event.detail.field==='Name'){
            this.opportunityId = event.detail.value;
        }
    }
}