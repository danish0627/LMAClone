import { LightningElement, wire, track,  } from 'lwc';
import {getRecord } from 'lightning/uiRecordApi';
const FIELDS = ['Event_Edition__c.Name'];
export default class Ops_AccountContacts extends LightningElement {
    
    @track esId; 
    @track eId; 
    @track selectedEventName='';  
    connectedCallback() {
        let fullUrl = window.location.href;
        this.esId=this.GetQS(fullUrl,'esid');
        this.eId=this.GetQS(fullUrl,'id');
    }
    @wire(getRecord, { recordId: '$eId', fields: FIELDS})
    wiredEventObject({ error, data }) {
        if(data){
             this.selectedEventName = data.fields.Name.value? data.fields.Name.value: '';
        }else if(error){
            window.console.log(error);
        }
    }
    goToCustomerCenter(){
        window.location.href= '/lightning/n/ops_customer_centre';
     }
     goToCustomerCenterSetting(){
      let redirectUrl = '/lightning/n/ops_customer_centre_settings#id='+this.eId;
      window.location.href= redirectUrl;
     }
     GetQS(url, key) {
        var Qs = url.split('#')[1].replace(/^\s+|\s+$/g, '');
        var a = "";
        if (Qs !== "") {
            let qsArr = Qs.split("&");
            for (let i = 0; i < qsArr.length; i++)
                if (qsArr[i].split("=")[0] === key)
                    a = qsArr[i].split("=")[1];
        }
        return a;
    }
}