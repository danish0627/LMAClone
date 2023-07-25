/*
Created By	 : (Sunil[STL-431])
Created On	 : Sep 27, 2019
@description : This component is use to show event packages  pages on  ops admin  .

Modification log 
Modified By	: 
*/


import { LightningElement, track } from 'lwc';
import fecthEvent from "@salesforce/apex/LtngUtilityCtrl.getRecords";
import fecthPackages from "@salesforce/apex/LtngUtilityCtrl.getSobjectRecords";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import CustomerCenterWS11 from '@salesforce/resourceUrl/CustomerCenterWS11';
import { loadStyle } from 'lightning/platformResourceLoader';
import { createRecord } from 'lightning/uiRecordApi';

export default class Ops_eventPackages extends LightningElement {
   
    @track profileId;
    @track profilePackages=[];
    @track isLoading = true;
    connectedCallback() {
        let fullUrl = window.location.href;
        this.esId = this.GetQS(fullUrl, 'esid');
        this.eId = this.GetQS(fullUrl, 'id');
        this.getProfileData();
        this.getPPS();
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
    constructor() { // invoke the method when component rendered or loaded
        super()
        Promise.all([
            loadStyle(this, CustomerCenterWS11 + '/CustomerCenterWS11/css/ops_style.css'),
        ])
        .then(() => {
            // Call back function if scripts loaded successfully
        })
        .catch(errors => {
            window.console.log(errors);
        });
    }
    getProfileData() {
        fecthEvent({ objName: 'Profile_Option_Visibility__c', fieldNames: 'Id,Name', compareWith: 'Event_Edition__c', recordId: this.eId, pageNumber: 1, pageSize: 1 })
        .then(result => {
            if(result.recordList.length>0)
            {
                this.profileId = result.recordList[0].Id;
            }
            else{
                const fields = {Event_Edition__c :this.eId};
                const recordInput = { apiName: 'Profile_Option_Visibility__c', fields };
                createRecord(recordInput)
                .then(data => {
                    if(data.id)
                    {
                        this.profileId = data.id;
                    }
                })
                .catch(error => 
                {
                    window.console.log('error...'+JSON.stringify(error));  
                });
            }
        })
        .catch(error => {
            window.console.log('error...' + JSON.stringify(error));
        });
    }
    getPPS() {
        let qryCondition = ' where Event_Edition__c=\'' + this.eId + '\' and Priority__c!=null ';
        fecthPackages({ objName: 'Profile_Package_Setting__c', fieldNames: 'Id,Name,Is_Default__c,Priority__c,Product__r.Name',srchField:'',srchText:'',conditions:qryCondition,sortBy:'Priority__c', sortType:'asc',pageNumber :1, pageSize:200})
        .then(result => {
            for(let i=0;i<result.recordList.length;i++)
            {
                if(!(result.recordList[i]).hasOwnProperty('Product__c')) 
                {
                    result.recordList[i].Product__r={Name:'Default Package'};
                }
            }
            this.profilePackages=result.recordList;
        })
        .catch(error => {
            window.console.log('error...' + JSON.stringify(error));
        });
    }
    onsave() {
        var allButtons= this.template.querySelectorAll('.Save');
        for (let i = 0; i < allButtons.length; i++) {
            allButtons[i].click()
        }
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
    onSuccess() {
        this.isLoading = false;
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Record updated successfully!',
                variant: 'Success',
            }),
        );
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
    onSubmit() {
        this.isLoading = true;
    } 
    onload()
    {
        this.isLoading = false;
    }
}