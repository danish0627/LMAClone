/*
Created By	 : (Mukesh Gupta[STL-216])
Created On	 : 3 Oct, 2019
@description : getting Account Detail and Stand Summery and this component used on (opsExhibitorProfileReports) component

Modification log --
Modified By	: 
*/

import { LightningElement,api, track } from 'lwc';
import getRecordDetail from '@salesforce/apex/CommonTableController.getRecordDetail3';
import getOppBoothDetail from '@salesforce/apex/AccountSummeryCtr.getOppBoothDetails';
import { handleErrors, showToast } from 'c/lWCUtility';

export default class OpsCustomerListAccountDetailTab extends LightningElement {

    @api accountId;
    @api eventId;
    @api eventCode;
    
    @track oppList;
    @track contactId;
    @track viewForm;
    @track editForm;
    @track form
    @track spinner;
    @track isShow;

    @track accountName;
    @track userType;
    connectedCallback(){
        this.isShow = true;
        this.viewFormAction();
        
        if(this.accountId && this.eventId){
            this.getContact();
            this.getBoothDetail();
        }
    }

    getBoothDetail(){
        this.oppList = undefined;
        getOppBoothDetail({accountId:this.accountId,eventId:this.eventId})
        .then(res=>{
            let tempList = JSON.parse(JSON.stringify(res));

            tempList.forEach(item => {
                item.boothNameTitle = item.boothNameTitle!==''?item.boothNameTitle:'Booth Name';
                item.mapLink = 'https://www.expocad.com/host/fx/informa/'+this.eventCode+'/exfx.html?zoomto='+item.boothName;
                item.exhibitingAsTitle = item.exhibitingAsTitle!==''?item.exhibitingAsTitle:'Exhibiting As';
                item.exhibitingAs = item.exhibitingAs!==''?item.exhibitingAs:item.exhibitingAcc;
                item.boothAreaTitle = item.boothAreaTitle!==''?item.boothAreaTitle:'Booth Area';
                item.boothTypeTitle = item.boothTypeTitle!==''?item.boothTypeTitle:'Classification';
                item.mapOpportunityId = '/'+item.mapOpportunityId;

            });
            if(tempList.length>0){
                this.oppList = tempList;
            }
            
        })
        .catch(error=>{
            handleErrors(this,error);
        })
    }
    getContact(){
        getRecordDetail({objectName:'Contact',allFields:'Id,Type__r.Name,Account.Name',condition:'AccountId=\''+this.accountId+'\''})
        .then(res=>{
            if(res.length>0){                
                this.contactId = res[0].Id;
                if(res[0].Type__r){
                    this.userType = res[0].Type__r.Name;
                }
                if(res[0].Account){
                    this.accountName = res[0].Account.Name;
                }
            }
        })
        .catch(error=>{
            handleErrors(this,error);
        })
    }
    viewFormAction(){
        this.viewForm = 'slds-show';
        this.editForm = 'slds-hide';
    }
    openEditForm(){
        this.viewForm = 'slds-hide';
        this.editForm = 'slds-show';
    }

    //Handle Account detail form submisison
    handleAccountSubmit(){
        this.spinner = true;
    }
    handleAccountSuccess(){
        showToast(this,'Account details was updated','success','Success');
        this.spinner = false;
    }
    handleAccountError(event){
        this.spinner = false;
        handleErrors(this,event.detail);
    }

    //handle contact form submission
    handleSubmit(){
        this.spinner = true;
    }
    handleSuccess(){
        showToast(this,'Contact details was updated','success','Success');
        this.spinner = false;
    }
    handleError(event){
        this.spinner = false;
        handleErrors(this,event.detail);
    }
    //handle contact form submission end here

    handleLoad(){
        this.isShow = false;
    }
}