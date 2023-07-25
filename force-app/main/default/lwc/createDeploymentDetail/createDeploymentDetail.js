import { api, LightningElement, track } from 'lwc';
import createDeployment from '@salesforce/apex/MetadataSelectController.createDeployment';
import getAllAuthorizedOrg from '@salesforce/apex/CreatePackageController.getAllAuthorizedOrg'; 
import { showToast,handleErrors } from 'c/rmaUtils';
import getDeploymentDetail from '@salesforce/apex/MetadataSelectController.getDeploymentDetail';
import checkAsyncRequest from '@salesforce/apex/MetadataSelectController.checkAsyncRequest';
import listMetadataItems from '@salesforce/apex/MetadataSelectController.listMetadataItems';
import updateDeployment from '@salesforce/apex/MetadataSelectController.updateDeployment';
import GitCommit from '@salesforce/apex/MetadataSelectController.GitCommit';
import fetchGitHubData from '@salesforce/apex/MetadataSelectController.fetchGitHubData';


import retrieveSelectedPackage from '@salesforce/apex/MetadataSelectController.retrieveSelectedPackage';

export default class CreateDeploymentDetail extends LightningElement {
    @api sourceOrgId;
    @api sourceOrgName;
    @api packageId;    
    @api deploymentId;
    
    @track orgList = [];
    @track deploymentObj = { sobjectType:'Deployment__c'};
    @track spinner;
    @track decodedString;
    constructiveDateMap = []; // this is use to get package zip file from source org
    destructiveDataMap = []; // this is use to delete newly metadata 
    rollbackDataMap = []; //  this is use to get package zip file from target org

    connectedCallback(){
        this.deploymentObj.GKNRMA__Package__c = this.packageId;
        this.getOrgList();

        if(this.deploymentId){
            this.getDeploymentDetailMethod();
        }
    };

    @track isUpdateDesabled;
    getDeploymentDetailMethod(){
        this.spinner = true;
        getDeploymentDetail({id:this.deploymentId})
        .then(res=>{            
            this.deploymentObj = JSON.parse(JSON.stringify(res));
            if(this.deploymentObj.GKNRMA__Package__r.GKNRMA__Constructive_Data_Map__c){
                this.constructiveDateMap = JSON.parse(this.deploymentObj.GKNRMA__Package__r.GKNRMA__Constructive_Data_Map__c);
            }
            if(this.deploymentObj.GKNRMA__Destructive_Data_Map__c){
                this.destructiveDataMap = JSON.parse(this.deploymentObj.GKNRMA__Destructive_Data_Map__c);
            }
            if(this.deploymentObj.GKNRMA__Rollback_Data_Map__c){
                this.rollbackDataMap = JSON.parse(this.deploymentObj.GKNRMA__Rollback_Data_Map__c);
            }

            this.isUpdateDesabled = this.deploymentObj.GKNRMA__Status__c=='Success' || this.deploymentObj.GKNRMA__Status__c=='Rolled Back' || this.deploymentObj.GKNRMA__Status__c=='Validated' || this.deploymentObj.GKNRMA__Status__c=='Draft';
        })
        .catch(error=>{
            handleErrors(this,error);
        })
        .finally(()=>{
            this.spinner = false;
        })
    };

    getOrgList(){
        this.spinner = true;
        getAllAuthorizedOrg()
        .then(res=>{
            let opt = [{label:'--None--',value:''}];
            res.forEach(i => {
                if(i.Id!=this.sourceOrgId){
                    opt.push({label:i.Name,value:i.Id});
                }
            });
            this.orgList = opt;
        })
        .catch(err=>{
            handleErrors(this,err);
        })
        .finally(()=>{
            this.spinner = false;
        })
    };

    handleFieldChange(event){
        let value = event.target.value;
        let name = event.target.name;
        if(name == 'targetorg'){
            this.deploymentObj.GKNRMA__Target_Org__c = value;
            this.orgList.forEach(i=>{
                console.log(i.value+"=="+value);
                if(i.value==value){
                    this.deploymentObj.GKNRMA__Target_Org_Name__c = i.label;
                }
            })
        }
        else if(name == 'testtype'){
            this.deploymentObj.GKNRMA__Test_Level__c = value;
        }
        else if(name == 'note'){
            this.deploymentObj.GKNRMA__Note__c = value;
        }
    };

    @api createDeployment(){        
        if(this.isValid())
        {
            this.spinner = true;
            this.deploymentObj.GKNRMA__Status__c = 'Draft';
            createDeployment({jsonParam:JSON.stringify(this.deploymentObj)})
            .then(res=>{
                let data = JSON.parse(JSON.stringify(res));
                this.deploymentObj = data.deploymentObj;
                this.deploymentId = this.deploymentObj.Id;
                if(this.deploymentObj.GKNRMA__Package__r.GKNRMA__Constructive_Data_Map__c){
                    this.constructiveDateMap = JSON.parse(this.deploymentObj.GKNRMA__Package__r.GKNRMA__Constructive_Data_Map__c);
                }
                if(this.deploymentObj.GKNRMA__Package__r.GKNRMA__Is_Backup_Taken__c){
                    this.retreiveTargetOrgMetadataItems();
                    showToast(this,'Deployment have been created successfully. Wait please, retrieving target org metadata for backup.','success','Success');                    
                }
                else{
                    showToast(this,'Deployment have been created successfully.','success','Success');
                    this.dispatchEvent(new CustomEvent('aftercreate',{detail:{data:this.deploymentObj}}));
                    this.spinner = false;
                }
            })
            .catch(error=>{
                handleErrors(this,error);
                this.spinner = false;
            });
        }
        else{
            showToast(this,'Please fill all required fields','error','Error');
        }
    }
    
    metadataItemList = []; //list of metadata item of target org 
    retreiveTargetOrgMetadataItems(){  
        let metdataTypes = [];  
        let tempObj = new Map();
        let rollbackMap = new Map();
        let destructiveMap = new Map();        
        this.constructiveDateMap.forEach(i=>{            
            for (const [key, value] of Object.entries(i)) {
                metdataTypes.push(key);
                //console.log(key);
                tempObj.set(key,value);
            }            
        });
        this.spinner = true;
        if(metdataTypes.length>0){            
            listMetadataItems({metadataType:metdataTypes.toString(), orgId:this.deploymentObj.GKNRMA__Target_Org__c})
            .then(res=>{
                let data = JSON.parse(JSON.stringify(res));
                tempObj.forEach((value,key)=>{
                    //set rollback data map                    
                    let filterData = data.filter(i=>i.metadataType==key && value.includes(i.fullName));                    
                    if(filterData.length >0){
                        filterData.forEach(i=>{
                            if(!rollbackMap.has(i.metadataType)){
                                rollbackMap.set(i.metadataType,[i.fullName+'']);
                            }
                            else{
                                rollbackMap.get(i.metadataType).push(i.fullName+'');
                            }
                        });

                        //set desctructive data map
                        value.forEach(fullName=>{
                            if(rollbackMap.has(key) && rollbackMap.get(key).indexOf(fullName)<0){                                
                                if(!destructiveMap.has(key)){
                                    destructiveMap.set(key,[fullName]);
                                }
                                else{
                                    destructiveMap.get(key).push(fullName);
                                }
                            }
                        });
                    }
                    else{
                        //set desctructive data map
                        value.forEach(fullName=>{
                            if(!destructiveMap.has(key)){
                                destructiveMap.set(key,[fullName]);
                            }
                            else{
                                destructiveMap.get(key).push(fullName);
                            }                        
                        });
                    }
                });
                this.spinner = false;

                console.log('Rollback Changes----');
                let buildData1 = [];
                rollbackMap.forEach((value,key)=>{
                    buildData1.push('{"'+key+'":'+JSON.stringify(value)+'}');
                });
                buildData1 = buildData1.join(',');
                console.log(buildData1);

                console.log('Destructive Changes----');
                let buildData2 = [];
                destructiveMap.forEach((value,key)=>{                                        
                    buildData2.push('{"'+key+'":'+JSON.stringify(value)+'}');
                });
                buildData2 = buildData2.join(',');                
                console.log(buildData2);
                this.updateDataMapToDeploymentRecord(buildData1,buildData2);
            })
            .catch(error=>{
                if(error.includes('Read timed out')){
                    this.retreiveTargetOrgMetadataItems();
                }
                else{
                    handleErrors(this,error);
                    this.spinner = false;
                }                
            });
        }       
    }
    
    updateDataMapToDeploymentRecord(rollbackData,destructiveData){
        let obj = {
            sobjectType: 'Deployment__c',
            "Id" : this.deploymentObj.Id,
            "GKNRMA__Rollback_Data_Map__c" : '['+rollbackData+']',
            "GKNRMA__Destructive_Data_Map__c" : '['+destructiveData+']'
        };
        this.spinner = true;
        updateDeployment({jsonParam:JSON.stringify(obj)})
        .then(res=>{
            this.deploymentObj = JSON.parse(JSON.stringify(res));
            showToast(this,'Rollback and Destructive data map have been saved. Now retrieving package zip for backup.','success','Success');
            this.getRollbackZip('['+rollbackData+']');
        })
        .catch(error=>{
            this.spinner = false;
            handleErrors(this,error);
        })
    };

    getRollbackZip(rollbackDataMap){
        this.spinner = true;
        retrieveSelectedPackage({packagevalueJson:rollbackDataMap,orgId:this.deploymentObj.GKNRMA__Target_Org__c})
        .then(syncId=>{
            this.takeBackup(syncId);
        })
        .catch(error=>{
            this.spinner = false;
            handleErrors(this,error);
        })
    }

    // code to take backup from target org. this backup use to rollback
    takeBackup(syncId){
        this.spinner = true;
        checkAsyncRequest({requestId:syncId,packageId:this.deploymentObj.Id,orgId:this.deploymentObj.GKNRMA__Target_Org__c})
        .then(res=>{
            if(res!=''){
                this.spinner = false;
                showToast(this,'Backup was taken from  target org. Now you can deploy and rollback.','success','Success');
                this.dispatchEvent(new CustomEvent('aftercreate',{detail:{data:this.deploymentObj}}));
            }
            else{
                this.takeBackup(syncId);
            }
        })
        .catch(error=>{
            handleErrors(this,error);
            this.spinner = false;
        })
    };

    isValid(){        
        const isPicklistValid = [
            ...this.template.querySelectorAll('lightning-combobox'),
        ].reduce((validSoFar, inputCmp) => {
            inputCmp.reportValidity();
            return validSoFar && inputCmp.checkValidity();
        }, true);
        return isPicklistValid;
    };

    get testTypeOptions(){
        return [
            {label:'--None--',value:''},
            {label:'Run specified tests',value:'RunSpecifiedTests'},
            {label:'Run local tests',value:'RunLocalTests'},
            {label:'No test run',value:'NoTestRun'},
            {label:'Run all tests in Org.',value:'RunAllTestsInOrg'}];
    };

    get isDisabled(){
        return !this.packageId;
    }
    CommitMetadata(){
     console.log('metadata->>'+ JSON.stringify(this.constructiveDateMap)); 
     const that = this;
     let covertedfile = atob(JSON.stringify(this.constructiveDateMap));
     console.log('covertedfile@@@@@@'+ covertedfile);
     let readZip = new JSZip();
     readZip.loadAsync(covertedfile)
     .then(readZip=>{
        console.log('test----------------->'+JSON.stringify(readZip.files));
              let content = readZip.generateAsync({type:"base64"})
              .then(content=>{
                console.log('content26=='+content);  
                // Decode the String
                this.decodedString = atob(content);
                console.log('dec'+ decodedString);
              })
     })

     GitCommit({fileName:'Package1Demo18Oct.zip',fileBlobBody: this.decodedString, commentTextValue:'Testing 18 Oct'})
     .then(res=>{
        if(res!=null){
            // custom functionality
            //.......................................................................
            //.......................................................................
        }
     })
    }
    GetDataFromRepo(){
        fetchGitHubData()

    }
}