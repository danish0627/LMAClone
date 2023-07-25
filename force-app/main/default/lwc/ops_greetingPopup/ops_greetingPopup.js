/*
Created By	 : (SUNIL [STL-])
Created On	 : August 23, 2019
@description : This component is use to show Greeting Popup in Customer Center Settings .

Modification log --
Modified By	: [Aishwarya 28 Sep 2020 BK-9045]
*/

import { LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class Ops_greetingPopup extends LightningElement {
    @track isLoading = true;
    @track esId;
    @track eid;
    @track renderedComponent = true;

    connectedCallback() {
        let fullUrl = window.location.href;
        this.esId=this.GetQS(fullUrl,'esid');
        this.eid=this.GetQS(fullUrl,'id');
        this.qryCondition = 'Event_Edition__c =\'' +this.eid + '\'';
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
       this.renderedComponent = false;
       setTimeout(() => {
           this.renderedComponent = true;            
       }, 10); 
   }
   onSubmit()
   {
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
        try {
            // reset edit form fields 
            const inputFields = this.template.querySelectorAll(
                'lightning-input-field'
            );
            if (inputFields) {
                inputFields.forEach(field => {
                    field.reset();
                });
            }

            this.template.querySelector('lightning-record-edit-form').refreshTable();
        }
        catch (error) {
            window.console.error(error);
        }
   }
   
}