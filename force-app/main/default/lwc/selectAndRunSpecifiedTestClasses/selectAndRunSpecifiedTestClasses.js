import { api, LightningElement, track } from 'lwc';
import getTestClasses from '@salesforce/apex/MetadataSelectController.getTestClasses';
import getDeploymentDetail from '@salesforce/apex/MetadataSelectController.getDeploymentDetail';
import updateDeployment from '@salesforce/apex/MetadataSelectController.updateDeployment';
import validateOrDeployPackage from '@salesforce/apex/MetadataSelectController.validateOrDeployPackage';
import checkValidationOrDeployment from '@salesforce/apex/MetadataSelectController.checkValidationOrDeployment';
import buildDestructivePackage from '@salesforce/apex/MetadataSelectController.buildDestructivePackage';
import deleteMetadata from '@salesforce/apex/DestructiveChangesController.deleteMetadata';
import checkAsyncRequest from '@salesforce/apex/DestructiveChangesController.checkAsyncRequest';

import myLib from '@salesforce/resourceUrl/JS_Lib';
import { loadScript } from 'lightning/platformResourceLoader';
//import DestructiveChangesModal from 'c/destructiveChangesModal';

import { handleErrors,showToast } from 'c/rmaUtils';
export default class SelectAndRunSpecifiedTestClasses extends LightningElement {
    @api packageId;
    @api orgName; //this is dource org name
    @api orgId; // this is source org id
    @api deploymentId;
    @api content;
    
    @track deploymentObj={};

    @track classList = [];
    columns = [{ label: 'Name', fieldName: 'name',sortable: true}];
    @track spinner;
    @track testType = '';
    @track isSpecifiedTest;    
    @track deploymentLabel = 'Create Deployment';
    @track activeTab = 'one';
    
    @track selectedClasses = [];//this is list of object[{name:'class_name'}]
    @track selectedClassList = [];//this is list of string

    @track processType;
    @track deploymentResult;
    @track deploymentErrorMessage;
    @track deploymentTestError;
    @track cmpList;

    @track isValidationDesabled;
    @track isDeploymentDesabled;
    @track isUpdateDesabled;
    //@track isRollbackDisabled;
    @track isRolledBacked = false;

    destructivePackageXML;
    
    connectedCallback(){
        this.destructivePackageXML = '';
        console.log('select test and run (deploymentId): '+this.deploymentId);
        if(this.deploymentId){
            this.deploymentLabel = 'Update Deployment';
            this.getDeploymentDetailMethod();
        };        
    };

    getDeploymentDetailMethod(){
        this.spinner = true;
        getDeploymentDetail({id:this.deploymentId})
        .then(res=>{
            this.deploymentObj = JSON.parse(JSON.stringify(res));
            if(this.deploymentObj.GKNRMA__Package__r.GKNRMA__Deployment_Type__c=='Destructive Changes'){
                this.initJs();
            }
            
            if(this.deploymentObj.GKNRMA__Package__r.GKNRMA__Constructive_Data_Map__c){
                let data = JSON.parse(this.deploymentObj.GKNRMA__Package__r.GKNRMA__Constructive_Data_Map__c);
                let opt = [];

                data.forEach(obj=>{
                    for (const [key, value] of Object.entries(obj)) {
                        if(value){
                            console.log(JSON.stringify(value));
                            value.toString().split(',').forEach(name=>{
                                opt.push({'type':key,'value':name,id:key+'_'+name});
                            })                            
                        }
                    }                      
                });
                this.cmpList = opt;
            }
            this.deploymentErrorMessage = this.deploymentObj.GKNRMA__Deployment_Error__c;
            if(this.deploymentErrorMessage){
                this.deploymentResult = JSON.parse(this.deploymentErrorMessage);
            }
            
            this.isDeploymentDesabled = this.deploymentObj.GKNRMA__Status__c=='Success';
            this.isValidationDesabled = this.deploymentObj.GKNRMA__Status__c=='Validated' || this.isDeploymentDesabled;
            this.isUpdateDesabled     = this.isValidationDesabled || this.isDeploymentDesabled;
                        
            if(this.deploymentObj.GKNRMA__Status__c=='Success' || this.deploymentObj.GKNRMA__Status__c=='Failure'){
                this.processType = 'Deployment';
            }
            if(this.deploymentObj.GKNRMA__Status__c=='Validated' || this.deploymentObj.GKNRMA__Status__c=='Validation Failure'){
                this.processType = 'Validation';
            }
            
            if(this.deploymentObj.GKNRMA__Status__c=='Rolled Back'){                
                this.isRolledBacked = true;                
            }
            else{
                this.isRolledBacked = false;
            }

            if(this.deploymentObj.GKNRMA__Status__c=='Rolled Back'||this.deploymentObj.GKNRMA__Status__c=='Rollback Failed'){                
                this.processType = 'Rollback';
            }

            if(this.isUpdateDesabled || this.isRolledBacked){
                this.activeTab = 'three';
            }
            

            this.deploymentTestError  = this.deploymentObj.GKNRMA__Test_Error__c;
            
            if(this.deploymentObj.GKNRMA__Test_Level__c==='RunSpecifiedTests'){
                this.isSpecifiedTest = true;
                if(this.deploymentObj.GKNRMA__Test_Classes__c){
                    let opt = [];
                    this.deploymentObj.GKNRMA__Test_Classes__c.split(',').forEach(i=>{
                        opt.push({name:i});
                    })
                    this.selectedClassList = this.deploymentObj.GKNRMA__Test_Classes__c.split(',');
                    this.selectedClasses = opt;
                    opt = [];
                }
                this.fetchClasses();
            }
            else{
                this.isSpecifiedTest = false;
            }
        })
        .catch(error=>{
            handleErrors(this,error);
        })
        .finally(()=>{
            this.spinner = false;
        })
    };
    
    handleRowSelection(event){
        this.selectedClasses = event.detail.selectedRows;
        let data = [];
        this.selectedClasses.forEach(i=>{
            data.push(i.name);
        });
        this.selectedClassList = data;
        data = [];
        console.log(JSON.stringify(this.selectedClasses));
    };

    fetchClasses(){
        this.spinner = true;
        getTestClasses({packageId:this.packageId})
        .then(res=>{            
            let data = JSON.parse(res).testClasses;
            let temp = [];
            data.forEach(i => {
                if(i.ns=='[My Namespace]'){
                    temp.push({name:i.name});
                }
            });
            this.classList = temp;
            temp = [];
            data = [];
            console.log(JSON.stringify(this.classList));
        })
        .catch(error=>{
            handleErrors(this,error);
        })
        .finally(()=>{
            this.spinner = false;
        });
    };    

    createDeploymentRecord(){        
        this.template.querySelector('c-create-deployment-detail').createDeployment();
    };
    
    handleDeploymentData(event){
        //alert(JSON.stringify(event.detail.data));
        this.deploymentObj = JSON.parse(JSON.stringify(event.detail.data));
        this.deploymentId = this.deploymentObj.Id; 
        this.deploymentLabel = 'Update Deployment';
        //fetch latest deployment record details
        this.getDeploymentDetailMethod();

        console.log("deploymentObj"+JSON.stringify(this.deploymentObj));
        if(this.deploymentObj.GKNRMA__Test_Level__c==='RunSpecifiedTests'){
            this.isSpecifiedTest = true;
            setTimeout(()=>{
                this.activeTab = 'two';
            },500);
            this.fetchClasses();
        }
        else{
            this.isSpecifiedTest = false;
        }
    };

    validateOrDeployPackage(event)
    {
        /*if(this.deploymentObj.GKNRMA__Package__r.GKNRMA__Deployment_Type__c =='Constructive Changes')
        {*/
            let type = event.target.dataset.dtype;        
            //check is test class selected or not
            if(this.deploymentObj.GKNRMA__Package__r.GKNRMA__Deployment_Type__c =='Constructive Changes')
            {
                if(this.isSpecifiedTest && this.selectedClassList.length==0)
                {
                    showToast(this,'Please select test classes to '+type+' package','error','Error');
                }
                else if(this.isSpecifiedTest)
                {
                    //update deployment record with test classes
                    this.spinner = true;
                    this.deploymentObj.GKNRMA__Test_Classes__c = this.selectedClassList.toLocaleString();
                    updateDeployment({jsonParam:JSON.stringify(this.deploymentObj)})
                    .then(res=>{
                        this.deploymentObj = JSON.parse(JSON.stringify(res));
                        this.initValidationOrDeployment(type);
                    })
                    .catch(error=>{
                        handleErrors(this,error);
                    })
                    .finally(()=>{
                        this.spinner = false;
                    })
                }
                else{
                    this.initValidationOrDeployment(type);
                }
            }
            else if(this.deploymentObj.GKNRMA__Package__r.GKNRMA__Deployment_Type__c =='Destructive Changes'){                
                this.deleteMetadatas(type);
            }
        /*}
        else if(this.deploymentObj.GKNRMA__Package__r.GKNRMA__Deployment_Type__c =='Destructive Changes')
        {
            //if(this.rollbackDatamap){
                DestructiveChangesModal.open({
                    size: 'Medium',
                    content: this.deploymentObj,
                });
         /*   }
        }*/
    };

    initValidationOrDeployment(type){
        let message = type=='deploy'?'deployment':'validation';
        showToast(this,'Package '+message+' has been initiated...','success','Success');
        this.spinner = true;
        validateOrDeployPackage({type:type, jsonString:JSON.stringify(this.deploymentObj)})
        .then(res=>{
            this.deploymentObj.GKNRMA__JobId__c = res; //sync id
            this.deploymentObj.GKNRMA__Status__c = 'Validation - In Progress';
            this.checkStatus(type,res);
        })
        .catch(error=>{
            this.spinner = false;
            handleErrors(this,error);
        });
    };
    
    checkStatus(type,jobId){
        this.processType = type=='deploy'?'Deployment':'Validation';
        this.spinner = true;
        checkValidationOrDeployment({type:type, jobId:jobId, targetOrgId:this.deploymentObj.GKNRMA__Target_Org__c})
        .then(res=>{
            this.deploymentResult = JSON.parse(res.message);            
            if(res.isDone){
                this.deploymentObj.GKNRMA__Status__c = (type=='deploy' && res.status=='success')?'Success':'Validated';
                this.deploymentTestError = res.testError;
                if(res.status=='success'){
                    showToast(this,this.processType+' have been successfully completed.','success','Success');
                }
                
                this.isDeploymentDesabled = (type=='deploy' && res.status=='success');
                this.isValidationDesabled = (type=='validate' && res.status=='success') || this.isDeploymentDesabled;
                this.isUpdateDesabled     = this.isValidationDesabled || this.isDeploymentDesabled;
                //this.isRollbackDisabled   = !this.isUpdateDesabled;
                this.activeTab = 'three';
                this.spinner = false;
            }
            else{                
                setTimeout(()=>{
                    this.checkStatus(type,jobId);
                },1000)
            }
        })
        .catch(error=>{
            this.spinner = false;
            handleErrors(this,error);
        })
    }

    //for destructive changes... Changes by Rafiq at 21/2/23
    deleteMetadatas(type){
        let message = type=='deploy'?'Deployment':'Validation';
        showToast(this,'Package '+message+' has been initiated...','success','Success');
        this.spinner = true;
        deleteMetadata({data:this.destructivePackageXML,depObjList:[this.deploymentObj]})
        .then(res=>{
            this.checkDeleteStatus(type,res);
        })
        .catch(error=>{
            handleErrors(this,error);
            this.close('error');
        });
    };

    //check metadata delete Status..Changes by Rafiq at 21/2/23
    checkDeleteStatus(type, jobId){
        this.processType = type=='deploy'?'Deployment':'Validation';
        this.spinner = true;
        checkAsyncRequest({type:type, jobId:jobId, targetOrgId:this.deploymentObj.GKNRMA__Target_Org__c})
        .then(res=>{
            this.deploymentResult = JSON.parse(res.message);        
            if(res.isDone){
                this.deploymentObj.GKNRMA__Status__c = (type=='deploy' && res.status=='success')?'Success':'Validated';
                this.deploymentTestError = res.testError;
                if(res.status=='success'){
                    showToast(this,this.processType+' have been successfully completed.','success','Success');
                }
                this.isDeploymentDesabled = (type=='deploy' && res.status=='success');
                this.isValidationDesabled = (type=='validate' && res.status=='success') || this.isDeploymentDesabled;
                this.isUpdateDesabled     = this.isValidationDesabled || this.isDeploymentDesabled;
                //this.isRollbackDisabled   = !this.isUpdateDesabled;
                this.activeTab = 'three';
                this.spinner = false;
            }
            else{                
                setTimeout(()=>{
                    this.checkDeleteStatus(type,jobId);
                },1000)
            }
        })
        .catch(error=>{
            this.spinner = false;
            handleErrors(this,error);
        })
    }
    //JS Lib loaded ...Changes by Rafiq at 21/2/23
    initJs(){
        Promise.all([
            loadScript(this, myLib + '/jszipmin.js'),
            loadScript(this, myLib + '/fileSaverJs.js')
        ])
        .then(() => {            
            this.destructivePackages();
        })
        .catch(error => {
            showToast(this,error.message,'error','JS Load error');
        });
    };

    destructivePackages(){
        let self = this;  
        buildDestructivePackage({destructivevalue:this.deploymentObj.GKNRMA__Package__r.GKNRMA__Constructive_Data_Map__c})
        .then(res=>{
            let zipraw = new JSZip();
            zipraw.file("package.xml",res["package.xml"]);
            zipraw.file("destructiveChanges.xml",res["destructiveChanges.xml"]);
            zipraw.generateAsync({type:"base64"})
            .then(function(zipfile) {
                self.destructivePackageXML = zipfile;
            })
            .catch(error=>{
                console.error(error.message);
            });
        })
        .catch(error=>{
            console.error(error);
        });
    }

    get testTypeOptions(){
        return [
            {label:'--None--',value:''},
            {label:'RunSpecifiedTests',value:'RunSpecifiedTests'},
            {label:'RunLocalTests',value:'RunLocalTests'},
            {label:'NoTestRun',value:'NoTestRun'},
            {label:'RunAllTestsInOrg',value:'RunAllTestsInOrg'}];
    };
        
    get rollbackDatamap(){
        let data = [];
        try{        
            if(this.deploymentObj && this.deploymentObj.GKNRMA__Rollback_Data_Map__c){
                let temp = JSON.parse(this.deploymentObj.GKNRMA__Rollback_Data_Map__c);
                temp.forEach(i=>{            
                    for (const [key, value] of Object.entries(i)) {                    
                        value.forEach(fullName=>{
                            data.push({type:key,name:fullName,id:key+'_'+fullName});
                        });                    
                    }      
                });
            }
        }
        catch(e){
            console.error(e.message);
        }
        return data.length>0?data:false;
    };
    get destructiveDatamap(){
        let data = [];
        try{
            if(this.deploymentObj && this.deploymentObj.GKNRMA__Destructive_Data_Map__c){
                let temp = JSON.parse(this.deploymentObj.GKNRMA__Destructive_Data_Map__c);
                temp.forEach(i=>{            
                    for (const [key, value] of Object.entries(i)) {                    
                        value.forEach(fullName=>{
                            data.push({type:key,name:fullName,id:key+'_'+fullName});
                        });                    
                    }      
                });
            }
        }
        catch(e){
            console.error(e.message);
        }
        return data.length>0?data:false;
    };

    get isShowCmp(){
        return this.destructiveDatamap || this.rollbackDatamap;
    }
}