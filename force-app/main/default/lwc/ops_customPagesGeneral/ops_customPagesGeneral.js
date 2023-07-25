/*
Created By	 : (Himanshu[STL-206])
Created On	 : Sep 27, 2019
@description : This component is use to show custom link pages ops admin  .

Modification log 
Modified By	: [Aishwarya 16 sep 2020 BK-9045]
*/

/* eslint-disable @lwc/lwc/no-async-operation */
import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import getDatas from '@salesforce/apex/CommonTableController.getGenericObjectRecord';

export default class Ops_customPagesGeneral extends LightningElement {
    @track isLoading = true;
    @api recordId;
    @track initialData;
    @track homeSiteSettingObj;

    @track pageList;
	@track totalrows = 0;
	@track offst = 0;
	@track hasNext = false;
	@track hasPrev = false;
	@track searchValue = '';
	@track showPageView = '0';
	@track sortByFieldName = '';
	@track sortByName = '';
	@track sortType = '';
    @track pagesize = 15;
    @api pageLinkName='';
    @api evtEditionId ='';
    @track qryCondition ='';
    @track LeftPanel='';
    @track RightPanel='';
    @track spinner=true;
    @track renderedComponent = true;
    
    connectedCallback() {
        this.spinner=true
        this.qryCondition = 'Name =\'' + this.pageLinkName + '\' AND Event_Edition__c  =\'' + this.evtEditionId + '\'';
        getDatas({
            searchValue: this.searchValue,
            objectName: 'Custom_Setting_CC__c',
            fieldstoget: 'Name,Id,Left_Panel__c,Right_Panel__c',
            pagesize: this.pagesize,
            next: this.hasNext,
            prev: this.hasPrev,
            off: this.offst,
            sortBy: this.sortByName,
            sortType: this.sortType,
            condition: this.qryCondition
        })
        .then(data => {
            this.spinner=false;
            if(data!=null)
            {  
                this.recordId = data.ltngTabWrap.tableRecord[0].Id;
                this.LeftPanel = data.ltngTabWrap.tableRecord[0].Left_Panel__c;
                this.RightPanel = data.ltngTabWrap.tableRecord[0].Right_Panel__c;
             
            }
        })
        .catch(error => {
            this.spinner=false;
            this.tableData = undefined;
            this.error = error;
        });
        setTimeout(() => {
            this.spinner = false;
        }, 1000);
        
    }
    callSaveBtn() {
        this.template.querySelector('.save').click();
    }
    onSuccess(event)
    {
        // BK-9045
        this.recordId = event.detail.id;
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
    onSubmit(event)
    {
        this.isLoading = true;   
        event.preventDefault();
        const fields = event.detail.fields;
        fields.Event_Edition__c = this.evtEditionId;
        fields.Name = this.pageLinkName;
        this.template.querySelector('.globalForm').submit(fields);        
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