import { api, LightningElement, track  } from 'lwc';
import getAllAuthorizedOrg from '@salesforce/apex/CreatePackageController.getAllAuthorizedOrg'; 
import savePackage from '@salesforce/apex/CreatePackageController.savePackage';
import getPackageDetail from '@salesforce/apex/CreatePackageController.getPackageDetail';
import { handleErrors,showToast } from 'c/rmaUtils';
export default class CreatePackage extends LightningElement {
    @api packageId;
    @api orgId; //source org id
    @track orgOptions = [];
    @track packageObj;    
    @track spinner;

    // lwc component load then call method 
    connectedCallback()
    {
        this.packageObj = {sobjectType:'GKNRMA__Package__c',GKNRMA__Deployment_Type__c:'Constructive Changes'};
        this.getAuthorizedorgList();
        if(this.packageId){
            this.getPakageDetails();
        }
    }

    reset(){
        this.packageId = '';
        this.orgId = '';
        this.packageObj = {sobjectType:'GKNRMA__Package__c',GKNRMA__Deployment_Type__c:'Constructive Changes'};
    }

    getPakageDetails(){
        getPackageDetail({id:this.packageId})
        .then(res=>{
            this.packageObj = JSON.parse(JSON.stringify(res));
        })
        .catch(error=>{
            handleErrors(this,error);
        })
    }

    // this method is fetch AUthorized Org Name and Id
    getAuthorizedorgList()
    {
        getAllAuthorizedOrg()
        .then(result => {
            let lstOption = [];
            result.forEach(item => {
                lstOption.push({value: item.Id,label: item.Name}); 
            });
            this.orgOptions = lstOption;        
        })
        .catch(error => {
            handleErrors(this,error);
        });
    }

    // call onchange function then value Assigned in Declare variable
    packageOnchange(event){
        if(event.target.name == 'packageName')
        {
            this.packageObj.Name = event.target.value;
        }
        else if(event.target.name == 'description')
        {
            this.packageObj.GKNRMA__Description__c = event.target.value;
        }
        else if(event.target.name == 'packageBackup')
        {
            this.packageObj.GKNRMA__Is_Backup_Taken__c = event.target.checked;
        }
        else if(event.target.name == 'deploymenttype')
        {
            this.packageObj.GKNRMA__Deployment_Type__c = event.target.value;
        }
        else if(event.target.name == 'sourceOrgname')
        {
            this.packageObj.GKNRMA__Source_SFDC_Org__c = event.target.value;
            this.orgOptions.forEach(item=>{
                if(item.value==this.packageObj.GKNRMA__Source_SFDC_Org__c){
                    this.packageObj.GKNRMA__Source_SFDC_Org_Name__c = item.label;
                }
            });
        }
    };

    handleSubmit(){
        if(this.validate()){
            this.spinner = true;    
            let isNew = this.packageObj.Id?false:true;        
            savePackage({packageObj:this.packageObj})
            .then(res=>{
                this.packageObj.Id = res;
                showToast(this,'Package was created.','success','Success');
                this.dispatchEvent(new CustomEvent('packagecreated',{detail:{package:this.packageObj,isNew:isNew}}));
            })
            .catch(error=>{
                handleErrors(this,error);
            })
            .finally(()=>{
                this.spinner = false;
            });
        }
        else{
            showToast(this,'Please update the invalid form entries and try again.','error','Error');
        }
    };

    validate(){
        const isInputValid = [
            ...this.template.querySelectorAll('lightning-input'),
        ].reduce((validSoFar, inputCmp) => {
            inputCmp.reportValidity();
            return validSoFar && inputCmp.checkValidity();
        }, true);

        const isPicklistValid = [
            ...this.template.querySelectorAll('lightning-combobox'),
        ].reduce((validSoFar, inputCmp) => {
            inputCmp.reportValidity();
            return validSoFar && inputCmp.checkValidity();
        }, true);
        return isInputValid && isPicklistValid;
    };

    get deploymentType(){
        return [{label:'Constructive Changes',value:'Constructive Changes'}, {label:'Destructive Changes',value:'Destructive Changes'}];
    };

    get isDisabled(){
        return this.packageObj.Id?true:false;       
    }
}