import { LightningElement ,track, api} from 'lwc';
import createDeploymentTask from '@salesforce/apex/CreatePackageController.createDeploymentTask';
import { handleErrors,showToast } from 'c/rmaUtils';
import LightningModal from 'lightning/modal';

export default class CreateDeploymentTask extends LightningModal {

    @api content;
    @track taskObject;

    connectedCallback(){
        console.log('package id: '+this.content.packageId);
        this.taskObject = {sobjectType:'Task', WhatId:this.content.packageId};
    }

    taskCreated(){
        createDeploymentTask({taskObject:this.taskObject})
        .then(res=>{
            this.taskObject.Id = res;
            showToast(this,'Task is created.','success','Success');
            this.dispatchEvent(new CustomEvent('taskcreated',{detail:{task:this.taskObject}}));
        })
        .catch(error=>{
            handleErrors(this,error);
        })
    }
    
    get deploymentStatusValues() {
        return [
            { label: 'Not Started', value: 'Not Started' },
            { label: 'In Progress', value: 'In Progress' },
            { label: 'Completed', value: 'Completed' },
        ];
    }

    get deploymentTypeValues() {
        return [
            { label: 'Pre Deployment', value: 'Pre Deployment' },
            { label: 'Post Deployment', value: 'Post Deployment' },
        ];
    }

    handleTaskChange(event){
        if(event.target.name == "Subject"){
            this.taskObject.Subject = event.target.value;            
        }
        else if(event.target.name == "Description"){
            this.taskObject.Description = event.target.value;
        }
        else if(event.target.name =="Status"){
            this.taskObject.Status = event.target.value;
        }
        else if(event.target.name =="Type"){
            this.taskObject.Type = event.target.value;
        }
    }

}