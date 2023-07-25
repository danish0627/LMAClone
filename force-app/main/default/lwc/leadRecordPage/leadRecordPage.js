/**  eslint-disable no-console **/
import { LightningElement, track, api } from 'lwc';
import {loadScript,loadStyle} from 'lightning/platformResourceLoader';
import jquery from '@salesforce/resourceUrl/jquery_core';
import stl_table from '@salesforce/resourceUrl/stl_table';
import getRecordDetail from '@salesforce/apex/CommonTableController.getRecordDetail';
import { handleErrors,showToast } from 'c/lWCUtility'; 

//Retrieve custom labels
import Interest_Level from '@salesforce/label/c.Interest_Level';
import Nature_of_Business from '@salesforce/label/c.Nature_of_Business';
import Communication_Email from '@salesforce/label/c.Communication_Email';
import Communication_Phone from '@salesforce/label/c.Communication_Phone';
import Communication_Address from '@salesforce/label/c.Communication_Address';

export default class LeadRecordPage extends LightningElement {

    //lead id which is auto filled when component load on lead record page
    @api recordId;

    //Assign values in track variables.
    @track Communication_Email = Communication_Email;
    @track Communication_Phone = Communication_Phone;
    @track Communication_Address = Communication_Address;
    @track Interest_Level = Interest_Level;
    @track Nature_of_Business = Nature_of_Business;

    //Conditional track variables.
    @track commEmailCondtion;
    @track commPhoneCondtion;
    @track commAddCondtion;
    @track communicationEmailLabels;

    connectedCallback(){
        //Load jquery
        loadScript(this,jquery).then({}).catch(error=>{showToast(this,error,'error','Error');});
        loadStyle(this,stl_table).then({}).catch(error=>{showToast(this,error,'error','Error')});

        getRecordDetail({objectName:'Lead',allFields:'MDM_ID__c',recordId:this.recordId})
        .then(res=>{
            this.commEmailCondtion = 'Lead_MDM_Id__c!=null AND Communication_Group__c LIKE \'%EMAIL%\'';
            this.commPhoneCondtion = 'Lead_MDM_Id__c!=null AND Communication_Group__c LIKE \'%PHONE%\'';
            this.commAddCondtion   = 'Lead_MDM_Id__c!=null AND Communication_Group__c IN (\'ADDRESS\',\'Direct Post\')';
            if(res.length>0) {
                const str = res[0].MDM_ID__c?res[0].MDM_ID__c:'null';
                this.commEmailCondtion = this.commEmailCondtion + ' AND Lead_MDM_Id__c=\''+str+'\'';
                this.commPhoneCondtion = this.commPhoneCondtion + ' AND Lead_MDM_Id__c=\''+str+'\'';
                this.commAddCondtion   = this.commAddCondtion + ' AND Lead_MDM_Id__c=\''+str+'\'';
            } else {
                this.commEmailCondtion = this.commEmailCondtion + ' AND Lead_MDM_Id__c=null';
                this.commPhoneCondtion = this.commPhoneCondtion + ' AND Lead_MDM_Id__c=null';
                this.commAddCondtion   = this.commAddCondtion + ' AND Lead_MDM_Id__c=null';
            }            
        })
        .catch(error=>{
            handleErrors(this,error);
        });
    }

    toggleDetail(event){
        try{                        
            const ele = this.template.querySelector("[id^="+event.currentTarget.getAttribute("aria-controls").split("-")[0]+"-]");            
            window.jQuery(ele).parent('section').toggleClass('slds-is-open');
            window.jQuery(ele).css({width:window.jQuery(ele).parent().width()});
            window.jQuery(ele).find('td').css({width:window.jQuery(ele).parent().width()});
            window.jQuery(ele).slideToggle(500);
        } catch(e){
            console.error(e);
        }
    }

    /***
     * Description: fire when user click action icon of "communication email" table rows
     */
    updateLeadCommunication(event){
        window.open('/apex/c__UpdateLeadCommunication?id='+event.detail,'_self');
    }
}