/* eslint-disable no-console */
 /* eslint-disable no-alert */
 /* eslint-disable @lwc/lwc/no-async-operation */
import { LightningElement,wire, track } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getRecordDetail from '@salesforce/apex/CommonTableController.getRecordDetail';
import { handleErrors } from 'c/lWCUtility';

const FIELDS = ['Event_Edition__c.Name',
    'Event_Edition__c.Start_Date__c', 'Event_Edition__c.End_Date__c',
    'Event_Edition__c.Venue__c', 'Event_Edition__c.Event_Code__c',
];
export default class Ops_siteSettings extends LightningElement {
    @track isLoading = true;
    @track esId;
    @track eId;
    @track eventEditionDtls;
    @track areDetailsVisible = false;
    @track areDetailsNotVisible = false;
    @track bShowModal = false;
    @track recentBooleanValue ;
    @track defaultBoolean ;
    
    connectedCallback() {        
        this.esId = this.GetQS(window.location.href, 'esid');
        this.eId = this.GetQS(window.location.href, 'id');
        
        getRecordDetail({objectName:'Event_Settings__c',allFields:'Send_Welcome_Email__c',recordId:this.esId})
        .then(res=>{
            if(res.length>0){
                this.defaultBoolean=res[0].Send_Welcome_Email__c;
                let checkValue = res[0].Send_Welcome_Email__c;
                console.log('!!!!checkValue onload',checkValue);
                setTimeout(() => {
                    this.template.querySelector('lightning-input.cb').checked = checkValue;
                }, 2000);
            }
        })
        .catch(error=>{
            handleErrors(this,error);
        })
    }
    GetQS(url, key) {
        var a = "";
        if(url.includes('#'))
        {
            var Qs = url.split('#')[1].replace(/^\s+|\s+$/g, '');
            if (Qs !== "") {
                let qsArr = Qs.split("&");
                for (let i = 0; i < qsArr.length; i++)
                    if (qsArr[i].split("=")[0] === key)
                        a = qsArr[i].split("=")[1];
            }
            return a;
        }
        return a;
    }
    @wire(getRecord, { recordId: '$eId', fields: FIELDS })
    wiredEventObject({ error, data }) {
        if (data) {
            window.console.log('data---------->' + JSON.stringify(data));
            let eventDtls = {
                'Name': data.fields.Name.value,
                'startDate': data.fields.Start_Date__c.value,
                'endDate': data.fields.End_Date__c.value,
                'venue': data.fields.Venue__c.value
            };
            this.eventEditionDtls = eventDtls;
            //this.error = undefined;
        } else if (error) {
            window.console.log('---------->' + error);
        }
    }
    gotoCC()
    {
        window.location.href= '/lightning/n/ops_customer_centre';
    }
    gotoCCS()
    {
        window.location.href= '/lightning/n/ops_customer_centre_settings#id='+this.eId;
    }
    onSuccess()
    {
        this.isLoading = false;
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Record updated successfully!',
                variant: 'Success',
            }),
        );
    }
    onSubmit(event)
    {
        event.preventDefault();
        console.log('finalValue'+this.template.querySelector('lightning-input.cb').checked);
        const fields = event.detail.fields;
        fields.Send_Welcome_Email__c = this.template.querySelector('lightning-input.cb').checked ;
        this.template.querySelector('.globalForm').submit(fields);
        this.isLoading = true;   
    }
    onLoad()
    {
        this.isLoading = false;
    }
    onError()
    {
        this.isLoading = false;
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error',
                message: 'Error while updating',
                variant: 'error',
            }),
        );
    }
    cancel()
    {
        this.template.querySelector('lightning-input.cb').checked =this.defaultBoolean;
        const inputFields = this.template.querySelectorAll(
            'lightning-input-field'
        );
        if (inputFields) {
            inputFields.forEach(field => {
                field.reset();
            });
        }
    }

    handleChange(event) {    
        this.bShowModal=true;    
        let welcumEmailVisible=event.detail.checked;
        this.recentBooleanValue=welcumEmailVisible;
        if(welcumEmailVisible)
        {
            this.areDetailsNotVisible=false;
            this.areDetailsVisible=true;
        }
        else
        {
            this.areDetailsVisible=false;
            this.areDetailsNotVisible=true;
        }
    }
    saveVal()
    {
        this.template.querySelector('lightning-input.cb').checked=this.recentBooleanValue;
        this.bShowModal = false; 
    }
    closeModal() {
        // Regarding The Ticket Welcome Email 
       console.log('!!! recentBooleanValue',this.recentBooleanValue);
       if(this.recentBooleanValue){
            this.template.querySelector('lightning-input.cb').checked=false;
        }
       else {
            this.template.querySelector('lightning-input.cb').checked=true;
        }
       this.bShowModal = false;
    }
}