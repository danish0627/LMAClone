import { LightningElement, api, track } from 'lwc';
import getDeploymentDetails from '@salesforce/apex/MetadataSelectController.getDeploymentListByPackage';

import { handleErrors,showToast } from 'c/rmaUtils';
export default class DeploymentList extends LightningElement {
    deploymentColumns = [
        { label: 'Name', fieldName: 'Name',type:'text',sortable: true},        
        { label: 'Target Org', fieldName: 'GKNRMA__Target_Org_Name__c',type:'text',sortable: true},
        { label: 'Status', fieldName: 'GKNRMA__Status__c',type:'text',sortable: true},
        { label: 'Created Date', fieldName: 'CreatedDate',type:'date',sortable: true},
    ];

    @api package_Id = 'a02Dn000001JJkKIAW';
    @track data=[];

    connectedCallback()
    {
        this.getDeploymentData();
    }

    getDeploymentData()
    {
        getDeploymentDetails({packageId:this.package_Id})
        .then(res=>{
            window.alert('deployment@@@@@'+ JSON.stringify(res));      
            this.data = res;
        })
        .catch(error=>{
            handleErrors(this,error);
        })
    }
}