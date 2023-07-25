/* eslint-disable no-console */
/*
Created By	 : Girikon(Mukesh[124])
Created On	 : 16 Sept, ‎2019
@description : Display "Interest level" and provide add/edit/delete features on Lead Record Page.
                
Modification log --
Modified By	: 
*/

import { LightningElement, api, track, wire } from 'lwc';
import LANG from '@salesforce/i18n/lang';
import massInsertRecords from '@salesforce/apex/CommonTableController.massInsertRecords';
import massUpdate from '@salesforce/apex/CommonTableController.massUpdateRecords';

import DIR from '@salesforce/i18n/dir';
import { handleErrors, showToast } from 'c/lWCUtility';
/* eslint-disable no-console */
//custom label

import Interest_Level from '@salesforce/label/c.Interest_Level';
import Add_Interest_Level from '@salesforce/label/c.Add_Interest_Level';

import isCreateable from '@salesforce/apex/CommonController.isCreateable';
import isUpdateable from '@salesforce/apex/CommonController.isUpdateable';

const DELAY=300;

export default class LeadInterestLevel extends LightningElement {
    //Custome label    
    @track Interest_Level = Interest_Level;
    @track Add_Interest_Level = Add_Interest_Level;
    
    @api showHeader;
    @api recordId;

    @track lang=LANG;
    @track dir = DIR;
    @track condition;
    @track tempCondition;
    @track interestLevel;
    @track isVisible;
    @track isOnlyOneRow = true;
    @track spinner;

    @track isCreateableRecord=false;
    @track isUpdateableRecord=false;
    @wire(isCreateable,{objectName:'LeadInterestLevelMapping__c',fieldName:'SFDCOpportunityID__c'})
    wireData1(result){
        if(result.data){
            this.isCreateableRecord = result.data;
        }
        else if(result.error){
            handleErrors(this,result.error);
        }
    }
    @wire(isUpdateable,{objectName:'LeadInterestLevelMapping__c',fieldName:'SFDCOpportunityID__c'})
    wireData2(result){
        if(result.data){
            this.isUpdateableRecord = result.data;
        }
        else if(result.error){
            handleErrors(this,result.error);
        }
    }
    
    connectedCallback(){
        this.interestLevel = [];
        this.condition = ' SFDCLeadID__c=\''+this.recordId+'\' ';
    }
    
    addRow(){
        this.isVisible = true;
        this.interestLevel.push({fieldValue1:'',fieldValue2:'',fieldValue3:'',index:this.interestLevel.length+'',condition1:'Mapped_To_Level__c=null ',condition2:'Mapped_To_Level__c!=null AND Mapped_To_Level__c=\'\'',condition3:'Mapped_To_Level__c!=null AND Mapped_To_Level__c=\'\''});
        if(this.interestLevel.length===1){
            this.isOnlyOneRow = true;
        }
        else{
            this.isOnlyOneRow = false;
        }
    }
    removeRow(event){
        const ind = parseInt(event.target.value,10);
        this.interestLevel.splice(ind,1);
        if(this.interestLevel.length===1){
            this.isOnlyOneRow = true;
        }
        else{
            this.isOnlyOneRow = false;
        }
    }

    cancelForm(){        
        this.interestLevel.splice(0,this.interestLevel.length);
        this.isVisible = false;
        this.massUpdateModal = false;
        this.template.querySelector("c-common-table").noCancelAll();
    }

    submitData(){        
        let objList = [];
        this.interestLevel.forEach(item => {
            if(item.fieldValue1!==''){
                objList.push({sobjectType:'LeadInterestLevelMapping__c',SFDCLeadID__c:this.recordId,L1__c:item.fieldValue1,L2__c:item.fieldValue2,L3__c:item.fieldValue3});
            }
        });
        if(objList.length>0){
            this.spinner = true;
            window.clearTimeout(this.delayTimeout);
            massInsertRecords({objList:objList})
            .then(res=>{
                this.spinner = false;
                showToast(this,res + ' Interest Level was inserted','success','Success');
                this.interestLevel.splice(0,this.interestLevel.length);
                this.isVisible = false;
                this.template.querySelector("c-common-table").refreshTable();
                
            })
            .catch(error=>{
                handleErrors(this,error);
            })
        }
    }

    editRow(event){
    }

    setLookupField(event){
        if(event.detail.field==='L1__c' && this.interestLevel.length>0){
            this.interestLevel[event.detail.index].fieldValue1 = event.detail.value;
            if(event.detail.value===''){
                this.interestLevel[event.detail.index].fieldValue2='';
                this.interestLevel[event.detail.index].fieldValue3='';
                this.interestLevel[event.detail.index].condition2 = undefined;
                this.interestLevel[event.detail.index].condition3 = undefined;
            }
            else{
                this.interestLevel[event.detail.index].condition2 = 'Mapped_To_Level__c!=null AND Mapped_To_Level__c=\''+event.detail.value+'\'';
            }
        }
        else if(event.detail.field==='L2__c' && this.interestLevel.length>0){
            this.interestLevel[event.detail.index].fieldValue2 = event.detail.value;
            if(event.detail.value===''){
                this.interestLevel[event.detail.index].fieldValue3='';
                this.interestLevel[event.detail.index].condition3 = undefined;
            }
            else{
                this.interestLevel[event.detail.index].condition3 = 'Mapped_To_Level__c!=null AND Mapped_To_Level__c=\''+event.detail.value+'\'';
            }
        }
        else if(event.detail.field==='L3__c' && this.interestLevel.length>0){
            this.interestLevel[event.detail.index].fieldValue3 = event.detail.value;
        }
    }

    @track condition1='Mapped_To_Level__c=null ';
    @track condition2='Mapped_To_Level__c!=null AND Mapped_To_Level__c=\'\'';
    @track condition3='Mapped_To_Level__c!=null AND Mapped_To_Level__c=\'\'';
    @track interestLevel1ToUpdate;
    @track interestLevel2ToUpdate;
    @track interestLevel3ToUpdate;
    setEditLookupField(event){        
        
        if(event.detail.field==='L1__c'){
            if(event.detail.value===''){                
                this.interestLevel2ToUpdate = undefined;
                this.interestLevel3ToUpdate = undefined;
            }
            else{
                this.interestLevel1ToUpdate = event.detail.value;                
            }
            
            this.condition2 = 'Mapped_To_Level__c!=null AND Mapped_To_Level__c=\''+event.detail.value+'\'';
            this.condition3 = 'Mapped_To_Level__c!=null AND Mapped_To_Level__c=\'\'';
        }
        else if(event.detail.field==='L2__c'){
            if(event.detail.value===''){                
                this.interestLevel3ToUpdate = undefined;    
            }
            this.interestLevel2ToUpdate = event.detail.value;  
            this.selectedRecord.L2__c = event.detail.value;                      
            this.condition3 = 'Mapped_To_Level__c!=null AND Mapped_To_Level__c=\''+event.detail.value+'\'';
        }
        else if(event.detail.field==='L3__c'){
            this.selectedRecord.L3__c = event.detail.value;
            this.interestLevel3ToUpdate = event.detail.value;
        }
    }

    @track selectedId;
    @track selectedRecord;    
    @track openEditModal;
    handleEditModal(event){
        this.selectedId = event.detail.Id;
        this.selectedRecord = event.detail;

        this.interestLevel1ToUpdate = this.selectedRecord.L1__c?this.selectedRecord.L1__c:'';
        this.interestLevel2ToUpdate = this.selectedRecord.L2__c?this.selectedRecord.L2__c:'';
        this.interestLevel3ToUpdate = this.selectedRecord.L3__c?this.selectedRecord.L3__c:'';
        
        this.condition2 = 'Mapped_To_Level__c!=null AND Mapped_To_Level__c=\''+this.interestLevel1ToUpdate+'\'';
        this.condition3 = 'Mapped_To_Level__c!=null AND Mapped_To_Level__c=\''+this.interestLevel2ToUpdate+'\'';

        window.clearTimeout(this.delayTimeout);
        this.openEditModal = false;        
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(()=>{
            this.openEditModal = true;
        },DELAY);
    }


    closeModal(){
        this.openEditModal = false;
    }

    handleSubmit(event){
        event.preventDefault();
        const fields = event.detail.fields;
        fields.L1__c = this.interestLevel1ToUpdate?this.interestLevel1ToUpdate:'';
        fields.L2__c = this.interestLevel2ToUpdate?this.interestLevel2ToUpdate:'';
        fields.L3__c = this.interestLevel3ToUpdate?this.interestLevel3ToUpdate:'';        
        this.template.querySelector('.edit_single_record').submit(fields);
        this.spinner = true;
    }
    handleSuccess(){
        this.spinner = false;
        showToast(this,'Record was updated','success','Success');
        this.template.querySelector("c-common-table").refreshTable();
        this.openEditModal = false;
    }
    handleError(event){
        this.spinner = false;
        handleErrors(this,event.detail);
    }


    //bulk update modal
    @track massUpdateModal;
    massUpdateFormOpener(event){
        this.massUpdateModal = true;
        const selectedRows = JSON.parse(JSON.stringify(event.detail));
        selectedRows.forEach(item=>{
            item.L1__c = item.L1__c?item.L1__c:'';
            item.L2__c = item.L2__c?item.L2__c:'';
            item.L3__c = item.L3__c?item.L3__c:'';
            this.interestLevel.push({Id:item.Id,fieldValue1:item.L1__c,fieldValue2:item.L2__c,fieldValue3:item.L3__c,
                index:this.interestLevel.length+'',
            condition1:'Mapped_To_Level__c=null ',condition2:'Mapped_To_Level__c!=null AND Mapped_To_Level__c=\''+item.L1__c+'\'',
            condition3:'Mapped_To_Level__c!=null AND Mapped_To_Level__c=\''+item.L2__c+'\''});
        })
        if(this.interestLevel.length===1){
            this.isOnlyOneRow = true;
        }
        else{
            this.isOnlyOneRow = false;
        }
    }

    updateBulkData(){        
        let objList = [];
        this.interestLevel.forEach(item => {            
            objList.push({sobjectType:'LeadInterestLevelMapping__c',Id:item.Id,SFDCLeadID__c:this.recordId,L1__c:item.fieldValue1,L2__c:item.fieldValue2,L3__c:item.fieldValue3});
        });
        if(objList.length>0){
            this.spinner = true;
            window.clearTimeout(this.delayTimeout);
            massUpdate({objList:objList})
            .then(res=>{
                this.spinner = false;
                showToast(this,res + ' Interest Level was updated','success','Success');
                this.interestLevel.splice(0,this.interestLevel.length);
                this.isVisible = false;
                this.massUpdateModal = false;
                this.template.querySelector("c-common-table").noCancelAll();      //called to reset table    
            })
            .catch(error=>{
                handleErrors(this,error);
            })
        }
    }

}