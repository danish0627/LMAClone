import { api ,track} from 'lwc';
import checkAsyncRequest from '@salesforce/apex/RollbackController.checkAsyncRequest';
import buildDestructivePackage from '@salesforce/apex/MetadataSelectController.buildDestructivePackage';
import deleteMetadata from '@salesforce/apex/RollbackController.deleteMetadata';

import LightningModal from 'lightning/modal';
import LightningConfirm from 'lightning/confirm';
import { handleErrors,showToast } from 'c/rmaUtils';

import myLib from '@salesforce/resourceUrl/JS_Lib';
import { loadScript } from 'lightning/platformResourceLoader';

export default class DestructiveChangesModal extends LightningModal {
    @api content;

    @track spinner;
    @track ddMap;
    @track cdMap;
    @track depObjList;

    destructivePackageXML;

    coloums = [
        { label: 'Metadata Name', fieldName: 'value',type:'text'},        
        { label: 'Type', fieldName: 'type',type:'text'},        
    ];


    connectedCallback() {
        this.destructivePackageXML = '';
        if(this.content.GKNRMA__Rollback_Data_Map__c){
            let data = JSON.parse(this.content.GKNRMA__Rollback_Data_Map__c);
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
            this.cdMap = opt;
            this.initJs();
        }

       /* if(this.content.GKNRMA__Destructive_Data_Map__c){
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
        }*/
    }

    async destructiveConfirm() {
        const result = await LightningConfirm.open({
            variant: 'header',
            theme: 'warning',
            label: 'Are you sure want to do Destructive changes?',
        });
        if(result){
            this.deleteMetadatas();
            this.spinner = true;  
        }
    }

    deleteMetadatas(){
        deleteMetadata({data:this.destructivePackageXML,depObjList:[this.content]})
        .then(res=>{
            this.checkDeleteStatus(res);
        })
        .catch(error=>{
            handleErrors(this,error);
            this.close('error');
        });
    };

    //check metadata delete Status
    checkDeleteStatus(jobId){
        this.spinner = true;
        console.log(jobId);
        checkAsyncRequest({jobId:jobId, targetOrgId:this.content.GKNRMA__Target_Org__c})
        .then(res=>{
            if(res.isDone){
                if(res.status=='success'){
                    showToast(this,'Destructive operation successfully completed','success','Success');
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

    
    //JS Lib loaded
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
        buildDestructivePackage({destructivevalue:this.content.GKNRMA__Destructive_Data_Map__c})
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
            console.log("125"+this.content);
        })
        .catch(error=>{
            console.error(error);
        });
    }

}