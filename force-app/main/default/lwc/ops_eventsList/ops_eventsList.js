/*
Created By	 : (Sunil)
Created On	 : July 25, 2019
@description : This component is use to show Event List in Customer Center.

Modification log --
Modified By	: Aishwarya[BK-4043 22 Apr 2020]
*/


/* eslint-disable no-console */

import { LightningElement, track } from 'lwc';
import fetchSObject from "@salesforce/apex/LtngUtilityCtrl.getRecords";
import { NavigationMixin } from 'lightning/navigation';
import userId from '@salesforce/user/Id';
import { createRecord } from 'lightning/uiRecordApi';

export default class Ops_eventsList extends NavigationMixin(LightningElement) {
    userId=userId;
    @track error;
    @track qryCondition;
    connectedCallback() {
        fetchSObject({objName:'Operations_Team_Member__c',fieldNames:'Id,Name,Operations_Team__c,User_Name__c,Operations_Team__r.Event_Series__c',compareWith:'User_Name__c',recordId:userId,pageNumber:1,pageSize:100})
                    .then(result => {
                        let data =result.recordList;
                           if (data) {
                                let tempValue=[];
                                for(let i=0; i<data.length; i++){
                                    if(data[i].Operations_Team__r.Event_Series__c){
                                        tempValue.push(data[i].Operations_Team__r.Event_Series__c);    
                                    }
                                }    
                                this.qryCondition = ' (Event_Edition_Status__c = \'Completed\' OR Event_Edition_Status__c = \'Confirmed\') AND Part_of_Series__c IN (\''+tempValue.join('\',\'')+'\')';
                            console.log('this_Query_Condition',this.qryCondition);
                            }
                    })
                    .catch(error => {
                        window.console.log('error...'+JSON.stringify(error));
                    });
    }
    navigatetoEvent(event)
    {
        let eid=event.detail
        fetchSObject({ objName: 'Event_Settings__c', fieldNames: 'Id,Name,Event_Edition__r.Event_Code__c', compareWith: 'Event_Edition__c', recordId: eid, pageNumber: 1, pageSize: 1 })
        .then(result => {
            this.eventSettings = result.recordList[0];
            if(this.eventSettings)
            {
                let redirectUrl = '/lightning/n/ops_customer_centre_settings#id=' + eid+'&esid='+this.eventSettings.Id;
                window.location.href = redirectUrl;
            }
            else{
                const fields = {Event_Edition__c:eid};
                const recordInput = { apiName: 'Event_Settings__c', fields };
                createRecord(recordInput).then(data => {
                       if(data.id)
                       {
                        let redirectUrl = '/lightning/n/ops_customer_centre_settings#id=' + eid+'&esid='+data.id;
                        window.location.href = redirectUrl;
                       }
                    })
                    .catch(error => {
                        window.console.log('error...'+JSON.stringify(error));  
                });
            }
        })
        .catch(error => {
            window.console.log('error...' + JSON.stringify(error));
        });
        
    }
    navigatetoForms(event)
    {
        let redirectUrl = '/lightning/n/ops_form_templates#id=' + event.detail;
        window.location.href = redirectUrl;
    }
    navigatetoEmails(event)
    {
        let redirectUrl = '/lightning/n/ops_email_templates#id=' + event.detail;
        window.location.href = redirectUrl;
    }
}