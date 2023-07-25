/* eslint-disable no-useless-concat */
/* eslint-disable no-alert */
/*
Created By	 : (ANUP [STL-])
Created On	 : August 22, 2019
@description : This component is use to show Home section in Customer Center Settings .

Modification log --
Modified By	: 
*/

import { LightningElement, track , wire} from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import {getRecord } from 'lightning/uiRecordApi';
const FIELDS = [
    'Event_Edition__c.Name'
];

export default class Ops_home extends NavigationMixin(LightningElement) {
    @track selectedTab;   
    @track recordId=''; 
    @track eventId = '';  
    @track eventEditionName = '';
    tabSelect(event) {
        this.selectedTab =  event.target.label;
    }
    connectedCallback() {
        let fullUrl = window.location.href;
        if (fullUrl.indexOf("#") > -1) {
            let id=fullUrl.split("#id=")[1];
            if(id.indexOf("&esid=")){
                this.eventId=id.split("&esid=")[0];
            }
            this.recordId = decodeURIComponent(fullUrl.split("#id=")[1]);
        }
    }
    @wire(getRecord, { recordId: '$eventId', fields: FIELDS})
    wiredEventObject({ error, data }) {
        if(data){
             this.eventEditionName = data.fields.Name.value;
        }else if(error){
            window.console.log(error);
        }
    }

    goToCustomerCenter(){
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                apiName: 'customer_center_lwc'
            }
        });
        
    }
    goToCustomerCenterSetting(){
   this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: "https://informage--devltn.lightning.force.com/lightning/n/ops_customer_center_settings#id="+this.recordId
            },
        });
    }

    ccUrl(){
        window.location.href= '/lightning/n/ops_customer_centre';
     }
     ccsettingUrl(){
      let redirectUrl = '/lightning/n/ops_customer_centre_settings' + '#id='+this.recordId;
       window.location.href= redirectUrl;
     }
    
}