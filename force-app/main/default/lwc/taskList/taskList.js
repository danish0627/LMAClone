import { LightningElement,api ,track} from 'lwc';
import getTaskDetails from '@salesforce/apex/CreatePackageController.getTaskDetails';
import { handleErrors,showToast } from 'c/rmaUtils';

export default class TaskList extends LightningElement {

    @track taskData;
    @track taskObj;

    @track actions = [
        { label: 'View Task', name: 'view_Task' },
        { label: 'Edit', name: 'edit' },
    ];
    
    @track taskColumns = [
        { label: 'Subject', fieldName: 'Subject' },
        { label: 'Descriptions', fieldName: 'Description' },
        { label: 'Task Status', fieldName: 'Status' },
        { label: 'Task Type', fieldName: 'Type' },
        {
            type: 'action',
            typeAttributes: { 
                rowActions: this.actions,
                menuAlignment: 'right' 
            },
        }
    ];

    connectedCallback(){
        this.taskObj = {sobjectType:'Task'};
        getTaskDetails({packageId:this.taskObj.WhatId})
        .then(result => {
            console.log('result@@@@@' +result);
            this.taskData = result;
        }) 
        .catch(error=>{
            handleErrors(this,error);
        })
    } 


    /* handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch (actionName) {
            case 'view_Task':
                
                break;
            case 'edit':
                
                break;
        }
    } */
}