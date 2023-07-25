/*
Created By	 : Garima
Created On	 : September 9, 2019
@description : This component is use to show Manual Main Tab under manuals Settings in Customer Center.

Modification log --
Modified By	: 
*/


/* eslint-disable no-console */
import { LightningElement, track, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
const FIELDS = ['Event_Edition__c.Name'];

export default class Ops_manualsSetting extends LightningElement {
    @track recordId = '';
    @track eventId = '';
    @track selectedEventName = '';
    @track reqCondition;
    @track addCondition;
    @track reportCondition;
    @track selectedTab;

    connectedCallback() {
        let fullUrl = window.location.href;
        if (fullUrl.indexOf("#") > -1) {
            this.recordId = fullUrl.split("#id=")[1];
            if (this.recordId.indexOf("&esid=")) {
                this.eventId = this.recordId.split("&esid=")[0];
            }
        }
        this.reqCondition = "Event_Edition__c='" + this.eventId + "' AND Required__c = true"
        this.addCondition = "Event_Edition__c='" + this.eventId + "' AND Required__c = false"
        this.reportCondition = "Manuals__r.Event_Edition__c ='" + this.eventId + "' AND Active__c = true AND Manuals__c != '"
        
    }
    tabSelect(event){
        this.selectedTab = event.target.label;
        let tabSelect = this.selectedTab;
        if(tabSelect==='Required Manuals'){
            this.handleRefreshTable();
        }
        if(tabSelect==='Additional Manuals'){
            this.handleRefreshTable();
        }
 }
    handleRefreshTable() {
        try {
           let table = this.template.querySelectorAll('c-ops_req-add-manuals');
           let tabSelect = this.selectedTab;
           if(tabSelect==='Required Manuals'){
            table[0].refreshTable();
           }
           if(tabSelect==='Additional Manuals'){
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