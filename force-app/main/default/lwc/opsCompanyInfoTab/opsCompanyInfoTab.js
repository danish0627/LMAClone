/*
Created By	 : (Mukesh Gupta[STL-216])
Created On	 : 3 Oct, 2019
@description : Display contact information and social media in form and Stand Summery and this component used on (opsExhibitorProfileReports) component

Modification log --
Modified By	: 
*/

import { LightningElement, track,  api } from 'lwc';
import getRecordDetail from '@salesforce/apex/CommonTableController.getRecordDetail3';
import getFieldVisibility from '@salesforce/apex/CommonTableController.getFieldVisibility';
import getFileDetail from '@salesforce/apex/CommonTableController.getFileDetail';
import { handleErrors, showToast } from 'c/lWCUtility';

export default class OpsCompanyInfoTab extends LightningElement {
   
    @track expoCadBoothMapping;
    @track boothContactInfo;
    @track attachment;
    
    @api selectedBooth='';
    @api eventCode;
    @api eventId;
    @api accountId;
    @api userType;
    @track visibility={};
    
    connectedCallback(){
        if(this.selectedBooth!==''){
            this.getExpoCadBoothMappings(this.selectedBooth);            
        }
    }

    getExpoCadBoothMappings(id){
        getRecordDetail({objectName:'Opportunity_ExpoCAD_Booth_Mapping__c',allFields:'Id,Booth_Logo_Id__c,Web_Description__c,Print_Description__c',condition:'Event_Code__c=\''+this.eventCode+'\' AND Id=\''+id+'\''})
        .then(data=>{
            if(data && data.length>0){
                this.expoCadBoothMapping = JSON.parse(JSON.stringify(data[0]));                
                this.getBoothContactInfo(data[0].Id);
                this.getAttachment(data[0].Id);
            }
        })
        .catch(error=>{
            handleErrors(this,error);
        })
    }
    
    getBoothContactInfo(boothMappingId){
        getRecordDetail({objectName:'BoothContactInfo__c',allFields:'Id',condition:'Opportunity_Booth_Mapping__c=\''+boothMappingId+'\''})
        .then(data=>{
            if(data && data.length>0){
                this.boothContactInfo = data[0];
            }
            this.getProfileOptionVisibility();
        })
        .catch(error=>{
            handleErrors(this,error);
        })
    }
    
    getAttachment(boothMappingId){
        getFileDetail({objectName:'Attachment',fields:'Id,Name',parentId:boothMappingId})
        .then(data=>{
            if(data && data.length>0){
                this.attachment = data[0];
            }
        })
        .catch(error=>{
            handleErrors(this,error);
        })
    }
    
    getProfileOptionVisibility(){
        getFieldVisibility({accountId:this.accountId,eventId:this.eventId})
        .then(data=>{            
            if(data){
                this.visibility = JSON.parse(JSON.stringify(data));
            }
        })
        .catch(error=>{
            handleErrors(this,error);
        })
    }
    
    @track spinner;
    handleSubmit2(){
        this.spinner=true;        
    }
    handleSuccess2(){
        this.spinner=false;
    }
    handleError2(){
        this.spinner=false;
    }
    validateEmail(mail) 
    {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
        {
            return true;
        }        
        return false;
    }

    submitForm(){
        let isValid = true;
        if(this.template.querySelector('.form2')){
            //validate email            
            let CC_Email = this.template.querySelector(".CC_Email").value;
            if(CC_Email){
                let emaillist = CC_Email.split(',');
                if(emaillist.length>0){
                    emaillist.forEach(item => {
                        isValid = this.validateEmail(item);
                    });
                }
            }
            if(isValid){
                this.template.querySelector('.form2').submit();
            }
            else{
                showToast(this,'Please enter valid CC Email','error','Error');
                return;
            }            
        }
        if(this.template.querySelector('.form1')){   
            this.template.querySelector('.form1').submit();
        }
        if(this.template.querySelector('.form3')){
            this.template.querySelector('.form3').submit();
        }
        if(this.template.querySelector('.form4')){
            this.template.querySelector('.form4').submit();
        }

        window.clearTimeout(this.delayTimeout);
        this.spinner=true;
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = window.setTimeout(()=>{
            this.spinner=false;
            showToast(this,'Record was updated','success','Success');
        },2000);
    }

    get buttonVisibility(){
        return this.expoCadBoothMapping || this.boothContactInfo;
    }

    openFile(){
        window.open('/servlet/servlet.FileDownload?file='+this.attachment.Id);
    }
}