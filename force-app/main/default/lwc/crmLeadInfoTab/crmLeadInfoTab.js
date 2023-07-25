/* eslint-disable no-console */
/*
Created By	 : Girikon(Mukesh[124])
Created On	 : 4 Sept, ‎2019
@description : This component used to display lead Interest Level and Nature of Business on Opportunity Record Page
                
Modification log --
Modified By	: 
*/
import { LightningElement, api, track } from 'lwc';
import { handleErrors,showToast } from 'c/lWCUtility';
import { NavigationMixin } from 'lightning/navigation';

//Custom label
import LeadInfo_tab1 from '@salesforce/label/c.LeadInfo_tab1';
import LeadInfo_tab2 from '@salesforce/label/c.LeadInfo_tab2';
import Opportunity_Source from '@salesforce/label/c.Opportunity_Source';


export default class CrmLeadInfoTab extends NavigationMixin(LightningElement) {
    //Apply label
    @track LeadInfo_tab1 = LeadInfo_tab1;
    @track LeadInfo_tab2 = LeadInfo_tab2;
    @track Opportunity_Source = Opportunity_Source;

    @api recordId;
    
    @track editForm;
    @track viewForm;
    @track spinner;
    @track isShow=true;
    @track fields={};
    connectedCallback(){
        this.className = this.isShow?'slds-hide':'';
        this.viewForm = 'slds-show';
        this.editForm = 'slds-hide';
    }

    openEditForm(){
        this.viewForm = 'slds-hide';
        this.editForm = 'slds-show';
    }
    openViewForm(){
        this.viewForm = 'slds-show';
        this.editForm = 'slds-hide';
    }

    //Form event handlers
    handleLoad(){
        this.className = '';
        this.isShow = false;
    }
    
    handleSubmit(event){
        this.fields = event.detail.fields;
        this.spinner = true;
    }
    handleSuccess(){
        this.spinner = false;        
        showToast(this,'Lead source was updated!','success','Success');
        this.openViewForm();
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                "recordId": this.recordId,
                "objectApiName": "Opportunity",
                "actionName": 'view'
            },
        });
    }
    handleError(event){
        this.spinner = false;
        handleErrors(this,event.detail);
    }
}