import { LightningElement, track ,api} from 'lwc';
import getPackageData from '@salesforce/apex/CreatePackageController.getPackageData';
import getPackagefilterData from '@salesforce/apex/CreatePackageController.getPackagefilterData';
import getAttachmentId from '@salesforce/apex/MetadataSelectController.getAttachmentId';
import { handleErrors,showToast } from 'c/rmaUtils';
import checkValidationOrDeployment from '@salesforce/apex/MetadataSelectController.checkValidationOrDeployment';
import quickDeployPackage from '@salesforce/apex/MetadataSelectController.quickDeployPackage';
import RollbackModal from 'c/rollbackModal';
export default class AllPackages extends LightningElement {
    
    packageColumns = [
        { label: 'Package Name', fieldName: 'Name',type:'text',sortable: true},        
        { label: 'Source Org', fieldName: 'GKNRMA__Source_SFDC_Org_Name__c',type:'text',sortable: true},
        { label: 'Target Org', fieldName: 'GKNRMA__Target_Org_Name__c',type:'text',sortable: true},
        { label: 'Deployment Type', fieldName: 'GKNRMA__Deployment_Type__c',type:'text',sortable: true},
        { label: 'Package Backup', fieldName: 'GKNRMA__Is_Backup_Taken__c',type:'boolean',sortable: true},
        { label: 'Status', fieldName: 'GKNRMA__Status__c',type:'text',sortable: true,
            cellAttributes:{
                class:{fieldName:'statusColor'}
            }
        },
        { label: 'Created By', fieldName: 'CreatedByName',type:'text',sortable: true},
        { label: 'Created Date', fieldName: 'CreatedDate',type:'date',sortable: true},
        {
            label:'Action',
            type: 'action',            
            typeAttributes: { rowActions: this.getRowActions}        
        }
    ];

    @track packageList;
    @track packageName;
    @track startDate; 
    @track endDate; 
    @track spinner;
    @api packageId;
    @api content;

    connectedCallback()
    {
        this.packageName = '';
        
        this.getPackageLists();
    };   
    
    getRowActions(row, doneCallback) {
        //console.log(JSON.stringify(row));
        const actions = [];     
        if(row.level==1){   
            actions.push({label: "New Deployment", name: 'new_deploy',iconName:'utility:add'});
            actions.push({label: "Clone", name: 'clone',iconName:'utility:copy'});
        }
        else if(row.level==2){
            actions.push({label: "View", name: 'view',iconName:'utility:preview'});
            if(row.GKNRMA__Status__c==='Validated'){
                actions.push({label: "Quick Deploy", name: 'quick_deploy',iconName:'utility:merge'});    
            }            
            else if(row.GKNRMA__Status__c==='Draft'){
                actions.push({label: "Modify", name: 'edit_deploy',iconName:'utility:edit'});
            }
            else if(row.GKNRMA__Status__c==='Failure' || row.GKNRMA__Status__c==='Validation Failure'){
                actions.push({label: "Try Again", name: 'edit_deploy',iconName:'utility:edit'});
            }
            else if(row.GKNRMA__Status__c==='Success'){
                actions.push({label: "Download Backup", name: 'backup',iconName:'utility:download'});
                actions.push({label: "Rollback", name: 'rollback',iconName:'utility:skip_back'});
            }
        }

        setTimeout(() => {
            doneCallback(actions);
        }, 200);
    };
    

    @track downloadLink;
    download(deploymentId){
        this.spinner = true;
        let self = this;
        getAttachmentId({parentId:deploymentId})
        .then(res=>{
            if(res){
                this.downloadLink = "/servlet/servlet.FileDownload?file="+res;
                setTimeout(()=>{
                    self.template.querySelector('.backup-download-link').click();
                },300);
            }
        })
        .catch(error=>{
            handleErrors(this,error);
        })
        .finally(()=>{
            this.spinner = false;
        })
    }
     
    
    reload(){
        this.getPackageLists();
    };

    handleAction(event){
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        if(row.level===1 && actionName==='new_deploy'){
            this.dispatchEvent(new CustomEvent('switchtab',{detail:{data:row,deploymentId:''}}));
        }
        else if(row.level===1 && actionName==='clone'){
            this.packageList.forEach(i=>{
                if(i.Id==row.GKNRMA__Package__c){
                    packageObj = i;
                }
            });
            this.dispatchEvent(new CustomEvent('switchtab',{detail:{data:row,cloneAction:actionName}}));
        }
        else if(row.level===2 && (actionName==='edit_deploy' || actionName=='view')){
            let packageObj = {};
            this.packageList.forEach(i=>{
                if(i.Id==row.GKNRMA__Package__c){
                    packageObj = i;
                }
            });
            this.dispatchEvent(new CustomEvent('switchtab',{detail:{data:packageObj,deploymentObj:row,deploymentId:row.Id,cloneAction:actionName}}));
        }
        else if(row.level===2 && actionName=='backup'){
            this.download(row.Id);
        }
        else if(row.level===2 && actionName=='quick_deploy'){
            this.initQuickDeployment(row);
        }
        else if(row.level===2 && actionName=='rollback'){
            RollbackModal.open({
                size: 'Medium',
                content: row,
            });
        }
    };

    // get All Packages Details
    getPackageLists()
    {
        this.spinner = true;
        getPackageData()
        .then(res=>{
            let data = JSON.stringify(res).replaceAll('GKNRMA__Deployment_Details__r','_children');
            data = JSON.parse(data);
            this.packageList = data.map(i=>{
                i.CreatedByName = i.CreatedBy.Name;                
                if(i._children && i._children.length>0){
                    i._children = i._children.sort(this.sortBy('Name', 1));
                    i._children = i._children.map(child=>{
                        let colorClass = '';
                        if(child.GKNRMA__Status__c=='Success'){
                            colorClass = 'slds-text-color_success';
                        }
                        else if(child.GKNRMA__Status__c=='Validated'){
                            colorClass = 'datatable-orange';
                        }
                        else if(child.GKNRMA__Status__c=='Failure' || child.GKNRMA__Status__c=='Validation Failure'){
                            colorClass = 'slds-text-color_error';
                        }
                        else if(child.GKNRMA__Status__c=='Rolled Back'){
                            colorClass = 'datatable-purples';
                        }
                        child.GKNRMA__Source_SFDC_Org_Name__c = i.GKNRMA__Source_SFDC_Org_Name__c;
                        child.GKNRMA__Source_SFDC_Org__c = i.GKNRMA__Source_SFDC_Org__c;
                        child.CreatedByName = child.CreatedBy.Name;
                        i.GKNRMA__Target_Org_Name__c = child.GKNRMA__Target_Org_Name__c;
                        i.GKNRMA__Status__c = child.GKNRMA__Status__c;
                        return {...child, 
                            "statusColor":colorClass
                        };
                    });
                }

                let colorClass2 = '';
                if(i.GKNRMA__Status__c=='Success'){
                    colorClass2 = 'slds-text-color_success';
                }
                else if(i.GKNRMA__Status__c=='Validated'){
                    colorClass2 = 'datatable-orange';
                }
                else if(i.GKNRMA__Status__c=='Failure' || i.GKNRMA__Status__c=='Validation Failure'){
                    colorClass2 = 'slds-text-color_error';
                }
                else if(i.GKNRMA__Status__c=='Rolled Back'){
                    colorClass2 = 'datatable-purples';
                }
                return {...i, 
                    "statusColor":colorClass2
                };
            });            
        })
        .catch(error=>{
            handleErrors(this,error);
        })
        .finally(()=>{
            this.spinner = false;
        })
    };

    //start filter
    filterChangeAction(event)
    {
        if(event.target.name == 'packageName')
        {
            this.packageName = event.target.value;
        }
        else if(event.target.name == 'startDate')
        {
            this.startDate = event.target.value;
        }
        else if(event.target.name == 'endDate')
        {
            this.endDate = event.target.value; 
        }
    };

    searchAction()
    {
        if(this.startDate && this.endDate)
        {
            let numberOfrecord = Date.parse(this.endDate) - Date.parse(this.startDate);
            let result = parseInt(numberOfrecord / (1000*60*60*24));
            if(result<=30)
            {
                this.getData();
            }
            else
            {                
                showToast(this,'Month is Less than or equal to 30 days and try again.','error','Error');
            }
        }
        else if(this.packageName)
        {
            this.getData();
        }
    };

    getData(){
        this.spinner = true;
        getPackagefilterData({packageName:this.packageName,startDate:this.startDate,endDate:this.endDate})
        .then(res=>{
            let data = JSON.stringify(res).replaceAll('GKNRMA__Deployment_Details__r','_children');
            data = JSON.parse(data);
            this.packageList = data.map(i=>{
                i.CreatedByName = i.CreatedBy.Name;                
                if(i._children && i._children.length>0){
                    i._children = i._children.sort(this.sortBy('Name', 1));
                    i._children = i._children.map(child=>{
                        let colorClass = '';
                        if(child.GKNRMA__Status__c=='Success'){
                            colorClass = 'slds-text-color_success';
                        }
                        else if(child.GKNRMA__Status__c=='Validated'){
                            colorClass = 'datatable-orange';
                        }
                        else if(child.GKNRMA__Status__c=='Failure' || child.GKNRMA__Status__c=='Validation Failure'){
                            colorClass = 'slds-text-color_error';
                        }
                        else if(child.GKNRMA__Status__c=='Rolled Back'){
                            colorClass = 'datatable-purples';
                        }
                        child.GKNRMA__Source_SFDC_Org_Name__c = i.GKNRMA__Source_SFDC_Org_Name__c;
                        child.GKNRMA__Source_SFDC_Org__c = i.GKNRMA__Source_SFDC_Org__c;
                        child.CreatedByName = child.CreatedBy.Name;
                        i.GKNRMA__Target_Org_Name__c = child.GKNRMA__Target_Org_Name__c;
                        i.GKNRMA__Status__c = child.GKNRMA__Status__c;
                        return {...child, 
                            "statusColor":colorClass
                        };
                    });
                }

                let colorClass2 = '';
                if(i.GKNRMA__Status__c=='Success'){
                    colorClass2 = 'slds-text-color_success';
                }
                else if(i.GKNRMA__Status__c=='Validated'){
                    colorClass2 = 'datatable-orange';
                }
                else if(i.GKNRMA__Status__c=='Failure' || i.GKNRMA__Status__c=='Validation Failure'){
                    colorClass2 = 'slds-text-color_error';
                }
                else if(i.GKNRMA__Status__c=='Rolled Back'){
                    colorClass2 = 'datatable-purples';
                }
                return {...i, 
                    "statusColor":colorClass2
                };
            });
        })
        .catch(error=>{
            handleErrors(this,error);
        })
        .finally(()=>{
            this.spinner = false;
        });
    };

    //Quick Deployment
    initQuickDeployment(deploymentObj){
        showToast(this,'Quick deployment started','success','Success');
        this.spinner = true;
        quickDeployPackage({jsonString:JSON.stringify(deploymentObj)})
        .then(res=>{            
            this.checkStatus(res,deploymentObj.GKNRMA__Target_Org__c);
        })
        .catch(error=>{
            this.spinner = false;
            handleErrors(this,error);
        });
    };
    
    checkStatus(jobId,targetOrgId){        
        this.spinner = true;
        checkValidationOrDeployment({type:'deploy', jobId:jobId, targetOrgId:targetOrgId})
        .then(res=>{                        
            if(res.isDone){
                showToast(this,'Quick deployment was done!','success','Success');
                this.reload();
            }
            else{                
                setTimeout(()=>{
                    this.checkStatus(jobId,targetOrgId);
                },500)
            }
        })
        .catch(error=>{
            this.spinner = false;
            handleErrors(this,error);
        })
    }
    //end quick deployment

    sortBy(field, reverse, primer) {
        const key = primer
            ? function (x) {
                  return primer(x[field]);
              }
            : function (x) {
                  return x[field];
              };

        return function (a, b) {
            a = key(a);
            b = key(b);
            return reverse * ((a > b) - (b > a));
        };
    };

    get isBtnDisabled(){        
        return !((this.startDate && this.endDate) || (this.packageName));
    }
}