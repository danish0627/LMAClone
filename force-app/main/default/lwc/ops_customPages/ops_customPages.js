/*
Created By	 : (Himanshu[STL-206])
Created On	 : Sep 27, 2019
@description : This component is use to show custom link pages ops admin  .

Modification log 
Modified By	: 
*/
import {
    LightningElement,
    api,
    track,
    wire
} from 'lwc';
import {
    getRecord
} from 'lightning/uiRecordApi';
const FIELDS = ['Event_Edition__c.Name'];
export default class Ops_customPages extends LightningElement {
    @api evtEditionId = '';
    @api pagelinkname = '';
    @track pageName;
    @track recordId;
    @track eventId = '';
    @track selectedEventName = '';
    @track reqCondition;
    @track addCondition;
    @track showLinkTabs = false;
    @track customPageLoad = true;
    @track pageLinkName = '';
    @track showForm = true;

    connectedCallback() {
        let fullUrl = window.location.href;
        if (fullUrl.indexOf("#") > -1) {
            this.recordId = fullUrl.split("#id=")[1];
            if (this.recordId.indexOf("&esid=")) {
                this.eventId = this.recordId.split("&esid=")[0];
                this.evtEditionId = this.eventId;
            }
            this.customPageLoad = true;
        }
    }
    renderedCallback(){

    }
    @wire(getRecord, {
        recordId: '$eventId',
        fields: FIELDS
    })
    wiredEventObject({
        error,
        data
    }) {
        if (data) {
            this.selectedEventName = data.fields.Name.value ? data.fields.Name.value : '';
        } else if (error) {
            this.isLoading = 'hideLoading';
            this.record = undefined;
        }
    }
    customerCareUrl() {
        window.location.href = '/lightning/n/ops_customer_centre';
    }
    customerCareSettingUrl() {
        let redirectUrl = "/lightning/n/ops_customer_centre_settings#id=" + this.recordId;
        window.location.href = redirectUrl;
    }
    customPagesUrl() {
         this.customPageLoad = true;
         this.pageLinkName = '';
    }
    handleClick1() {
        this.customPageLoad = false;
        this.pageLinkName = 'Custom Page 1';
    }
    handleClick2() {
        this.customPageLoad = false;
        this.pageLinkName = 'Custom Page 2';
    }
    handleClick3() {
        this.customPageLoad = false;
        this.pageLinkName = 'Custom Page 3';
    }
}