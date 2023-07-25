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

export default class Ops_badgesMyexhibitorsStandContractor extends NavigationMixin(LightningElement) {
    @track recordId = '';
    @track eventId = '';
    @track selectedEventName = '';

    connectedCallback() {
        let fullUrl = window.location.href;
        if (fullUrl.indexOf("#") > -1) {
            this.recordId = fullUrl.split("#id=")[1];
            if (this.recordId.indexOf("&esid=")) {
                this.eventId = this.recordId.split("&esid=")[0];
            }
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
    goToCustomerCenter() {
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                apiName: 'ops_customer_centre'
            }
        });
    }
    goToCustomerCenterSetting() {
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: "/lightning/n/ops_customer_centre_settings#id=" + this.recordId
            },
        });
    }

}