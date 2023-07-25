import { LightningElement, track , wire} from 'lwc';
import {getRecord } from 'lightning/uiRecordApi';
const FIELDS = [
    'Event_Edition__c.Name'
];

export default class Ops_agentExhibitorsDetails extends LightningElement {
    @track selectedTab;   
    @track esId; 
    @track eId;  
    @track eventEditionName = '';

    connectedCallback() {
        let fullUrl = window.location.href;
        this.esId=this.GetQS(fullUrl,'esid');
        this.eId=this.GetQS(fullUrl,'id');
    } 
   
    GetQS(url, key) {
        var a = "";
        if(url.includes('#'))
        {
            let Qs = url.split('#')[1].replace(/^\s+|\s+$/g, '');
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
    @wire(getRecord, { recordId: '$eId', fields: FIELDS})
    wiredEventObject({ error, data }) {
        if(data){
             this.eventEditionName = data.fields.Name.value;
        }else if(error){
            window.console.log(error);
        }
    }
    ccUrl(){
        window.location.href= '/lightning/n/ops_customer_centre';
     }
     ccSettingUrl(){
        window.location.href= '/lightning/n/ops_customer_centre_settings#id='+this.eId;
     }
}