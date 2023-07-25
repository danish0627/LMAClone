/*
Created By	 : (Mukesh[STL-216])
Created On	 : August 29, 2019
@description : This component is use to show Form Main Tab under Form Settings in Customer Center.

Modification log --
Modified By	: 
*/

import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference,NavigationMixin } from 'lightning/navigation';
import { getRecord } from 'lightning/uiRecordApi';
const FIELDS = ['Event_Edition__c.Name'];

export default class OpsCustomers extends NavigationMixin(LightningElement) {
    @track eventId = 'a1S56000000pkpW';
    @track esId='';
    @track selectedEventName = '';
    @track reqCondition;
    @track addCondition;
    
    @wire(CurrentPageReference)
	setCurrentPageReference(currentPageReference) {
		if (currentPageReference) {
            this.eventId = currentPageReference.state.c__id;
            this.esId = currentPageReference.state.c__esId?currentPageReference.state.c__esId:'';     
        }
    }

    connectedCallback() {
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
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                apiName: 'ops_customer_centre'
            },
            state: {
            }
        });

    }
    ccsettingUrl() {
        const eid = this.eventId;
        const esId = this.esId;
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                apiName: 'ops_customer_centre_settings'
            },
            state: {
                'c__id':eid,
                'c__esId': esId
            }
        });
    }
}