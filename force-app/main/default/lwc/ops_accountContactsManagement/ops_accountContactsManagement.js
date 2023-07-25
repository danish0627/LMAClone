/*
Created By	 : Girikon(Sunil[STL 21])
Created On	 : 16 Sept, ‎2019
@description : Display Account contact Management tab in ops admin.
                
Modification log --
Modified By	: 
*/

import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import Booth_Contact_Description from '@salesforce/label/c.Booth_Contact_Description';
import Operation_Contact_Description from '@salesforce/label/c.Operation_Contact_Description';
import Booth_Contact_Visibility_Description from '@salesforce/label/c.Booth_Contact_Visibility_Description';


export default class Ops_accountContactsManagement extends LightningElement {
    label = { Booth_Contact_Description, Operation_Contact_Description,Booth_Contact_Visibility_Description};
    @track isLoading = true;
    @api esId='';
    @track eId;
    connectedCallback() {
        let fullUrl = window.location.href;
        this.esId=this.GetQS(fullUrl,'esid');
        this.eId=this.GetQS(fullUrl,'id');
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
    }
    onSubmit(event)
    {
        event.preventDefault();
        const fields = event.detail.fields;
        fields.Is_Primary_Contact_Visibile__c = true;
        fields.Is_Invoice_Contact_Visible__c = true;
        fields.Is_Operations_Contact_Visible__c=  true;
        this.template.querySelector('.contactForm').submit(fields);
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
        const inputFields = this.template.querySelectorAll(
            'lightning-input-field'
        );
        if (inputFields) {
            inputFields.forEach(field => {
                field.reset();
            });
        }
    }
}