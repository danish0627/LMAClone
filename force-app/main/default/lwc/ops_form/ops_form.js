/*
Created By	 : (sunil)
Created On	 : August 29, 2019
@description : This component is use to show Form Main Tab under Form Settings in Customer Center.

Modification log --
Modified By	: 
*/

import { LightningElement, track, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { getRecord } from 'lightning/uiRecordApi';
const FIELDS = ['Event_Edition__c.Name'];

export default class Ops_form extends NavigationMixin(LightningElement) {
    @track recordId = '';
    @track eventId = '';
    @track selectedEventName = '';
    @track reqCondition;
    @track addCondition;

    connectedCallback() {
        let fullUrl = window.location.href;
        if (fullUrl.indexOf("#") > -1) {
            this.recordId = fullUrl.split("#id=")[1];
            if (this.recordId.indexOf("&esid=")) {
                this.eventId = this.recordId.split("&esid=")[0];
            }
        }
        this.reqCondition = "Event_Edition__c='" + this.eventId + "' AND Mandatory__c = true"
        this.addCondition = "Event_Edition__c='" + this.eventId + "' AND Mandatory__c = false"
    }
    tabSelect(event){
        this.selectedTab = event.target.label;
        let tabSelect = this.selectedTab;
        if(tabSelect==='Required Forms'){
            this.handleRefreshTable();
        }
        if(tabSelect==='Additional Forms'){
            this.handleRefreshTable();
        }
 }
 handleRefreshTable() {
    try {
       let table = this.template.querySelectorAll('c-ops_form-required-forms');
       let tabSelect = this.selectedTab;
       if(tabSelect==='Required Forms'){
        table[0].refreshTable();
       }
       if(tabSelect==='Additional Forms'){
        table[1].refreshTable();
       }
    } catch (error) {
        window.console.error(error);
    }
}
    @wire(getRecord, { recordId: '$eventId', fields: FIELDS })
    wiredEventObject({ error, data }) {
        if (data) {
            this.selectedEventName = data.fields.Name.value ? data.fields.Name.value : '';
        } else if (error) {
            this.isLoading = 'hideLoading';
            this.record = undefined;
        }
    }
    ccUrl() {
        window.location.href = '/lightning/n/ops_customer_centre';
    }
    ccsettingUrl() {
        let redirectUrl = '/lightning/n/ops_customer_centre_settings' + '#id=' + this.recordId;
        window.location.href = redirectUrl;
    }


}