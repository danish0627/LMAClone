import { api ,track} from 'lwc';
import LightningModal from 'lightning/modal';
import rollback from '@salesforce/apex/RollbackController.rollback';
import checkAsyncRequest from '@salesforce/apex/RollbackController.checkAsyncRequest';
import getTestClasses from '@salesforce/apex/RollbackController.getTestClasses';
import buildDestructivePackage from '@salesforce/apex/MetadataSelectController.buildDestructivePackage';
import deleteMetadata from '@salesforce/apex/RollbackController.deleteMetadata';
import { handleErrors,showToast } from 'c/rmaUtils';
import LightningConfirm from 'lightning/confirm';

import myLib from '@salesforce/resourceUrl/JS_Lib';
import { loadScript } from 'lightning/platformResourceLoader';

export default class RollbackModal extends LightningModal {

    @api packageId;
    @api content;

    @track spinner;
    @track cdMap;
    @track ddMap;
    @track depObjList;
    @track testClasses ='';
    @track isShowTestClasses;
    @track selectedClasses = [];//this is list of object[{name:'class_name'}]
    @track selectedClassList = [];//this is list of string
    @track classList = [];
    
    destructivePackageXML;

    coloums = [
        { label: 'Metadata Name', fieldName: 'value',type:'text'},        
        { label: 'Type', fieldName: 'type',type:'text'},        
    ];

    testcolumn = [
        {label: 'Test Class Name',fieldName:'name',type:'text'}
    ];

    connectedCallback(){
        this.destructivePackageXML = '';
        if(this.content.GKNRMA__Rollback_Data_Map__c){
            let data = JSON.parse(this.content.GKNRMA__Rollback_Data_Map__c);
            let opt = [];
            
            data.forEach(obj=>{
                for (const [key, value] of Object.entries(obj)) {
                    if(value){
                        console.log(JSON.stringify(value));
                        value.toString().split(',').forEach(name=>{
                            this.isShowTestClasses = key=='ApexClass'|| key=='ApexTrigger' || key=='Flow'?true:false;
                            opt.push({'type':key,'value':name,id:key+'_'+name});
                        })                            
                    }
                }                      
            });
            this.cdMap = opt;
        }
        if(this.content.GKNRMA__Destructive_Data_Map__c){
            let data = JSON.parse(this.content.GKNRMA__Destructive_Data_Map__c);
            let opt = [];
            
            data.forEach(obj=>{
                for (const [key, value] of Object.entries(obj)) {
                    if(value){
                        value.toString().split(',').forEach(name=>{
                            opt.push({'type':key,'value':name,id:key+'_'+name});
                        })                            
                    }
                }                      
            });
            this.ddMap = opt;
            this.initJs();
        }
        
        if(this.isShowTestClasses){
            this.fetchClasses();
        }
    };

    async rollbackConfirm() {
        const result = await LightningConfirm.open({
            variant: 'header',
            theme: 'warning',
            label: 'Are you sure want to RollBack?',
        });
        if(result){
            this.doRollBack();
            this.spinner = true;
        }
    }

    doRollBack(){
        if(this.cdMap.length>0){   
            rollback({depObjList:[this.content],testClasses:this.selectedClassList.toString()})
            .then(res=>{
                this.spinner = true;
                let data = JSON.parse(JSON.stringify(res));
                this.checkStatus(res);
            })
            .catch(error=>{
                handleErrors(this,error);
                this.spinner = false;
            });
        }
        else if(this.ddMap.length>0){
            this.deleteMetadatas();
        }
        else{
            showToast(this,'No metadata to rollback!','error','Error');
            this.close('error');
        }
    };

    //check rollback statuS
    checkStatus(jobId){
        this.spinner = true;
        checkAsyncRequest({jobId:jobId, targetOrgId:this.content.GKNRMA__Target_Org__c})
        .then(res=>{
            if(res.isDone){
                if(res.status=='success'){
                    showToast(this,'Rollback have been successfully completed.','success','Success');
                }
                if(this.ddMap.length>0){
                    this.deleteMetadatas(); 
                    showToast(this,'Now start deleting destructive changes...','success','Success');
                }
                else{
                    this.spinner = false;
                    this.close('success');
                }
            }
            else{        
                setTimeout(()=>{
                    this.checkStatus(jobId);
                },1000)
            }
        })
        .catch(error=>{
            this.spinner = false;
            handleErrors(this,error);
        })
    };

    deleteMetadatas(){
        deleteMetadata({data:this.destructivePackageXML,depObjList:[this.content]})
        .then(res=>{
            this.checkDeleteStatus(res)
        })
        .catch(error=>{
            handleErrors(this,error);
            this.close('error');
        });
    };

    //check metadata delete Status
    checkDeleteStatus(jobId){
        this.spinner = true;
        checkAsyncRequest({jobId:jobId, targetOrgId:this.content.GKNRMA__Target_Org__c})
        .then(res=>{
            if(res.isDone){
                if(res.status=='success'){
                    showToast(this,'Rollback and Destructive both operation successfully completed','success','Success');
                }
                this.spinner = false;                
                this.close('success');            
            }
            else{        
                setTimeout(()=>{
                    this.checkDeleteStatus(jobId);
                },1000)
            }
        })
        .catch(error=>{
            this.spinner = false;
            handleErrors(this,error);
        })
    }

    handleRowSelection(event){
        this.selectedClasses = event.detail.selectedRows;
        let data = [];
        this.selectedClasses.forEach(i=>{
            data.push(i.name);
        });
        this.selectedClassList = data;
        data = [];
    };
    
    fetchClasses(){
        getTestClasses({deploymentId:this.content.Id})
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
        })
        .catch(error=>{
            handleErrors(this,error);
        })
        .finally(()=>{
            this.spinner = false;
        });
    };    

    //JS Lib loaded
    initJs(){
        Promise.all([
            loadScript(this, myLib + '/jszipmin.js'),
            loadScript(this, myLib + '/fileSaverJs.js')
        ])
        .then(() => {
            if(this.ddMap.length>0){
                this.destructivePackages();
            }
        })
        .catch(error => {
            showToast(this,error.message,'error','JS Load error');
        });
    };
        
    destructivePackages(){
        let self = this;  
        buildDestructivePackage({destructivevalue:this.content.GKNRMA__Destructive_Data_Map__c})
        .then(res=>{
            let zipraw = new JSZip();
            zipraw.file("package.xml",res["package.xml"]);
            zipraw.file("destructiveChanges.xml",res["destructiveChanges.xml"]);
            zipraw.generateAsync({type:"base64"})
            .then(function(zipfile) {
                self.destructivePackageXML = zipfile;
                //console.log('@@@xml'+ self.destructivePackageXML);             
            })
            .catch(error=>{
                console.error(error.message);
            });
        })
        .catch(error=>{
            console.error(error);
        });
    }

}