/* eslint-disable no-console */
/*
Created By	 : Girikon(Mukesh[124])
Created On	 : 16 Sept, ‎2019
@description : Display "Nature Of Bussiness" and provide add/edit/delete features on Lead Record Page.
                
Modification log --
Modified By	: 
*/

import { LightningElement, api, track, wire } from 'lwc';
import LANG from '@salesforce/i18n/lang';
import massInsertRecords from '@salesforce/apex/CommonTableController.massInsertRecords';
import massUpdate from '@salesforce/apex/CommonTableController.massUpdateRecords';
import isCreateable from '@salesforce/apex/CommonController.isCreateable';
import isUpdateable from '@salesforce/apex/CommonController.isUpdateable';

import DIR from '@salesforce/i18n/dir';
import { handleErrors, showToast } from 'c/lWCUtility';
/* eslint-disable no-console */
//custom label
import Nature_of_Business from '@salesforce/label/c.Nature_of_Business';
import Add_Nature_of_Business from '@salesforce/label/c.Add_Nature_of_Business';

const DELAY=300;

export default class LeadNatureOfBusiness extends LightningElement {
    //Custom Label
    @track Nature_of_Business = Nature_of_Business;
    @track Add_Nature_of_Business = Add_Nature_of_Business;

    @api showHeader;
    @api recordId;

    @track lang=LANG;
    @track dir = DIR;
    @track condition;    
    @track interestLevel;
    @track isVisible;
    @track isOnlyOneRow = true;
    @track spinner;

    @track isCreateableRecord=false;
    @track isUpdateableRecord=false;
    @wire(isCreateable,{objectName:'Lead_Nature_Of_Business_Mapping__c',fieldName:'General_Master__c'})
    wireData1(result){
        if(result.data){
            this.isCreateableRecord = result.data;
        }
        else if(result.error){
            handleErrors(this,result.error);
        }
    }
    @wire(isUpdateable,{objectName:'Lead_Nature_Of_Business_Mapping__c',fieldName:'General_Master__c'})
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
        this.condition = ' Lead__c=\''+this.recordId+'\' AND Status__c=true '; 
    }
    
    addRow(){
        this.isVisible = true;
        this.interestLevel.push({fieldValue:'',index:this.interestLevel.length+''});
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
            if(item.fieldValue!==''){
                objList.push({sobjectType:'Lead_Nature_Of_Business_Mapping__c',Lead__c:this.recordId,Status__c:true,General_Master__c:item.fieldValue});
            }
        });
        if(objList.length>0){
            this.spinner = true;
            window.clearTimeout(this.delayTimeout);
            massInsertRecords({objList:objList})
            .then(res=>{
                this.spinner = false;
                showToast(this,res + ' Nature of Business was inserted','success','Success');
                this.interestLevel.splice(0,this.interestLevel.length);
                this.isVisible = false;
                this.template.querySelector("c-common-table").refreshTable();                
            })
            .catch(error=>{
                this.spinner = false;
                handleErrors(this,error);
            })
        }
    }


    updateBulkData(){        
        let objList = [];
        this.interestLevel.forEach(item => {
            if(item.fieldValue!==''){
                objList.push({sobjectType:'Lead_Nature_Of_Business_Mapping__c',Id:item.Id,Lead__c:this.recordId,Status__c:true,General_Master__c:item.fieldValue});
            }
        });
        if(objList.length>0){
            this.spinner = true;
            window.clearTimeout(this.delayTimeout);
            massUpdate({objList:objList})
            .then(res=>{
                this.spinner = false;
                showToast(this,res + ' Nature of Business was updated','success','Success');
                this.interestLevel.splice(0,this.interestLevel.length);
                this.isVisible = false;
                this.massUpdateModal = false;
                this.template.querySelector("c-common-table").noCancelAll();      //called to reset table        
            })
            .catch(error=>{
                this.spinner = false;
                handleErrors(this,error);
            })
        }
    }

    editRow(event){
    }

    setLookupField(event){
        if(event.detail.field==='Value__c' && this.interestLevel.length>0 && event.detail.index>=0){
            this.interestLevel[event.detail.index].fieldValue = event.detail.value;
        }
        else if(event.detail.field==='Value__c' && event.detail.index==="-1"){             
            this.updatedNatureOfBusiness = event.detail.value;
        }
    }

    @track selectedId;
    @track selectedRecord;
    @track updatedNatureOfBusiness;    
    @track openEditModal;
    handleEditModal(event){        
        this.updatedNatureOfBusiness = '';
        this.selectedId = event.detail.Id;
        this.selectedRecord = event.detail;
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
        if(this.updatedNatureOfBusiness){
            fields.General_Master__c = this.updatedNatureOfBusiness;
            this.template.querySelector('.edit_single_record').submit(fields);
            this.spinner = true;
        }
        else{
            showToast(this,'No change was found','info','No Update');   
            this.openEditModal = false;   
        }
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
            this.interestLevel.push({fieldValue:item.General_Master__c,Id:item.Id,index:this.interestLevel.length+''});    
        })
        if(this.interestLevel.length===1){
            this.isOnlyOneRow = true;
        }
        else{
            this.isOnlyOneRow = false;
        }
    }
}