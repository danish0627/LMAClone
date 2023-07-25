/* eslint-disable @lwc/lwc/no-async-operation */
/* eslint-disable no-console */
/*
Created By	 : (Himanshu)
Created On	 : Sep 16, 2019
@description : This component is use to show Report under Form Settings in Customer Center.

Modification log --
Modified By	: 
*/

/* eslint-disable no-console */
import { LightningElement, track } from 'lwc';
import getRecords from "@salesforce/apex/OPS_FormsManualsCtrl.getAggregateRecords";
import approveAndRejectFormSendEmail from "@salesforce/apex/OPS_FormsManualsCtrl.approveAndRejectFormSendEmail";
import getRecordDetail from '@salesforce/apex/CommonTableController.getRecordDetail2'
import getFileDetail from '@salesforce/apex/CommonTableController.getFileDetail';
import updateRecords from '@salesforce/apex/CommonTableController.massUpdateRecords';
import { handleErrors,showToast} from 'c/lWCUtility';
import getFormData from "@salesforce/apex/OPS_FormsManualsCtrl.getUserFormAction";
import singleReminderEmail from "@salesforce/apex/OPS_FormsManualsCtrl.SingleFormReminderEmail";
import fetchhEvent from "@salesforce/apex/LtngUtilityCtrl.getRecords";

export default class Ops_formReports extends LightningElement {
    @track esId;
    @track eId;
    @track manualsList;
    @track pageSize = 10;
    @track totalRecords;
    @track pageNumber = 1;
    @track totalPages = 0;
    @track pageList;
    @track lastind;
    @track showViewedReport = false;
    @track isLoading = true;
    @track srchValue = '';
    @track qryConditionViewed = 'Id!=\'\'';
    @track qryConditionNotViewed = 'Id!=\'\'';
    @track qryConditionSubmitted = 'Id!=\'\'';
    @track qryConditionNotSubmitted = 'Id!=\'\'';
    @track selectedManaul = '';
    @track tablabelYes='';
    @track tablabelNo='';
    @track isEmaiSendButton=false;
    @track formsAccount;
    @track selectedTab='';
    @track showoption=false;
    connectedCallback() {
        let fullUrl = window.location.href;
        this.esId = this.GetQS(fullUrl, 'esid');
        this.eId = this.GetQS(fullUrl, 'id');
        this.getData();
    }
    GetQS(url, key) {
        var Qs = url.split('#')[1].replace(/^\s+|\s+$/g, '');
        var a = "";
        if (Qs !== "") {
            let qsArr = Qs.split("&");
            for (let i = 0; i < qsArr.length; i++)
                if (qsArr[i].split("=")[0] === key)
                    a = qsArr[i].split("=")[1];
        }
        return a;
    }
    getData() {
        getRecords({ objName: 'Forms_Permission__c', fieldNames: ' Event_Edition_Form__c,Event_Edition_Form__r.Name,Event_Edition_Form__r.Mandatory__c,Event_Edition_Form__r.FormType__c, SUM(Total_User_Count__c),SUM(Total_User_Viewed__c), SUM(Total_User_Filled_Up__c) ', srchField: ' Event_Edition_Form__r.Name,Event_Edition_Form__r.FormType__c', srchText: this.srchValue, conditions: ' where active__c=true and Event_Edition_Form__r.Event_Edition__r.Id =\'' + this.eId + '\' ', groupbyFields: ' group by Event_Edition_Form__c,Event_Edition_Form__r.Name,Event_Edition_Form__r.FormType__c, Event_Edition_Form__r.Mandatory__c', sortBy: ' Event_Edition_Form__r.Name', sortType: 'asc', pageNumber: this.pageNumber, pageSize: this.pageSize })
            .then(result => {
                window.console.log( this.eventcode+ '---footer Apex called--'+JSON.stringify(result)); 
                this.manualsList = result.recordList;
                this.totalRecords = result.totalRecords > 2000 ? 2000 : result.totalRecords;
                let totPages = Math.ceil(this.totalRecords / this.pageSize);
                this.totalPages = totPages;
                let offset = (this.pageNumber - 1) * this.pageSize;
                let size = this.pageSize;
                let lastIndex = offset + size;
                this.lastind = lastIndex;
                if (this.totalRecords < lastIndex) {
                    this.lastind = this.totalRecords;
                }
                this.showPageView = 'Showing: ' + parseInt(offset + 1, 10) + '-' + this.lastind;
                this.generatePageListUtil();
                this.isLoading = false;
                this.showoption = false;
            })
            .catch(error => {
                window.console.log('error...' + JSON.stringify(error));
            });
    }
    get showPagination() {
        return this.totalRecords > this.pageSize ? true : false;
    }
    get pagesizeList() {
        return [
            { 'label': '10', 'value': '10' },
            { 'label': '20', 'value': '20' },
            { 'label': '30', 'value': '30' },
            { 'label': '50', 'value': '50' }
        ];
    }
    onPageSizeChange(event) {
        this.isLoading = true;
        this.pageNumber  = 1;
        this.pageSize = parseInt(event.detail.value, 10);
        this.getData();
    }
    generatePageListUtil() {  // Util Method 2
        const pageNumber = this.pageNumber;
        const pageList = [];
        const totalPagess = this.totalPages;

        if (totalPagess > 1) {
            if (totalPagess <= 10) {
                for (let counter = 2; counter < (totalPagess); counter++) {
                    pageList.push(counter);
                }
            } else {
                if (pageNumber < 5) {
                    pageList.push(2, 3, 4, 5, 6);
                } else {
                    if (pageNumber > (totalPagess - 5)) {
                        pageList.push(totalPagess - 5, totalPagess - 4, totalPagess - 3, totalPagess - 2, totalPagess - 1);
                    } else {
                        pageList.push(pageNumber - 2, pageNumber - 1, pageNumber, pageNumber + 1, pageNumber + 2);
                    }
                }
            }
        }
        this.pageList = pageList;
    }
    processMe(event) {
        this.isLoading = true;
        let selectedPage = parseInt(event.target.name, 10);
        this.pageNumber = selectedPage;
        this.getData();
    }
    getNextData() {
        if (this.totalPages > this.pageNumber) {
            this.pageNumber = this.pageNumber + 1;
            this.isLoading = true;
            this.getData();
        }
    }
    getPrevData() {
        if (this.pageNumber > 1) {
            this.pageNumber = this.pageNumber - 1;
            this.isLoading = true;
            this.getData();
        }
    }
    clickOnViewed(event) {
        this.formstatus = 'Viewed';
        this.tablabelYes='Viewed';
        this.tablabelNo='Not Viewed';
        this.isEmaiSendButton = false;
        this.showViewedReport = false;
        window.clearTimeout(this.delayTimeout);
        let selectedRecordView = this.manualsList[event.currentTarget.dataset.id];
        this.selectedManaul = selectedRecordView.Name;
        this.manualId = event.target.dataset.recordId;
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(() => {
            this.qryConditionViewed = 'Form_Permission__r.Active__c=true and Is_Viewed__c=true and Form_Permission__r.Event_Edition_Form__c=\'' + this.manualId + '\'';
            this.qryConditionNotViewed = 'Form_Permission__r.Active__c=true and Is_Viewed__c=false and Form_Permission__r.Event_Edition_Form__c=\'' + this.manualId + '\'';
            this.showViewedReport = true;
        }, 200)
    }

    @track showSubmittedReport;
    clickOnSubmitted(event) {
        this.formstatus = 'Agreed';
        this.tablabelYes='Submitted';
        this.tablabelNo='Not Submitted';
        this.isEmaiSendButton = true;
        this.showSubmittedReport = false;
        window.clearTimeout(this.delayTimeout);
        let selectedRecordView = this.manualsList[event.currentTarget.dataset.id];
        // eslint-disable-next-line no-console
        console.log('selectedRecordView=='+JSON.stringify(selectedRecordView));
        this.selectedManaul = selectedRecordView.Name;
        this.manualId = event.target.dataset.recordId;
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(() => {
            this.qryConditionSubmitted = 'Form_Permission__r.Active__c=true and Is_Filled_Up__c=true and Form_Permission__r.Event_Edition_Form__c=\'' + this.manualId + '\' AND Account__c!=null ';
            this.qryConditionNotSubmitted = 'Form_Permission__r.Active__c=true and Is_Filled_Up__c=false and Form_Permission__r.Event_Edition_Form__c=\'' + this.manualId + '\' AND Account__c!=null ';
            this.showSubmittedReport = true;
        }, 200)
        
        if(selectedRecordView.FormType__c==='Online'){
            this.isOnlineForm = true;
        }
        else{
            this.isOnlineForm = undefined;
        }
        let formId = this.manualId;
        let tempArr=[];
        getFormData({ formsId : formId })
            .then(result => {
                
                for(let i = 0 ; i< result.length; i++){
                   let accounts = result[i].Account__c;
                   tempArr.push(accounts);
                }
                this.formsAccount = JSON.stringify(tempArr);
                
            })
            .catch(error => {
                window.console.log("error..." + JSON.stringify(error));
            });
    }
    closeRightSection() {
        this.showViewedReport = false;
        this.showSubmittedReport = false;
    }
    srchForms(event) {
        this.srchValue = event.target.value;
        this.isLoading = true;
        this.pageNumber  = 1;
        this.getData();
    }
    sendEmail()
    {
        let eventId = this.eId;
        let formId = this.manualId;
        singleReminderEmail({ eventEditionId : eventId , accList : this.formsAccount , EventEditionForm : formId})
            .then(result => {
                showToast(this,'Email Sent Successfully.','success','Success');                
            })
            .catch(error => {
                window.console.log("error..." + JSON.stringify(error));
            });
    }

    //Open PDF 
    @track spinner;
    handleOpenFileEvent(event){
        let tempForm;
        this.spinner = true;
        getRecordDetail({objectName:'User_Form_Action__c',allFields:'Form_Permission__r.Event_Edition_Form__r.Template_Form__c',recordId:event.detail.Id})
        .then(res=>{
            if(res.length>0 && res[0].Form_Permission__r && res[0].Form_Permission__r.Event_Edition_Form__r)
            {
                tempForm = res[0].Form_Permission__r.Event_Edition_Form__r.Template_Form__c;
                getRecordDetail({objectName:'Event_Edition__c',allFields:'Event_Code__c',recordId:this.eId})
                .then(res2=>{   
                    this.spinner = false;             
                    if(res2.length>0){
                        window.open('/apex/FormPreviewOpsSetting?Id='+tempForm+'&eventCode='+res2[0].Event_Code__c+'&AccId='+event.detail.Account__c);
                    }
                })
                .catch(error2=>{
                    this.spinner = false;             
                    handleErrors(this,error2)
                })
            }
            else{
                this.spinner = false;
            }
        })
        .catch(error=>{
            this.spinner = false;             
            handleErrors(this,error)
        });

    }
    //Open record Detail
    @track isOpenApprovalForm;
    @track accountName;
    @track formName;
    @track isApprove;
    @track isReject;
    @track btnRender;
    @track iframeUrl;
    @track selectedUserForm;
    @track accountId;
    @track isOnlineForm;
    handleOpenlinkEvent(event){        
        this.btnRender = false;
        this.isReject = false;
        this.isApprove = false;
        this.isOpenApprovalForm = true;        
        this.selectedUserForm = event.detail.Id;
        this.accountId = event.detail.Account__c;
        this.getUserFormAction();
    }
    hideApprovalForm(){
        this.isOpenApprovalForm = false;
    }
    getUserFormAction(){
        this.spinner = true;
        this.isApprove = undefined;
        this.isReject = undefined;
        
        getRecordDetail({objectName:'User_Form_Action__c',allFields:'Form_Permission__r.Event_Edition_Form__r.Template_Form__c,Status__c,User_Form_Contact__r.Account.Name,Form_Permission__r.Event_Edition_Form__r.Forms__r.Name',recordId:this.selectedUserForm})
        .then(res=>{
            let tempForm;
            if(res.length>0 && res[0].Form_Permission__r && res[0].Form_Permission__r.Event_Edition_Form__r)
            {
                this.accountName = res[0].User_Form_Contact__r.Account.Name;
                this.formName = res[0].Form_Permission__r.Event_Edition_Form__r.Forms__r.Name;                
                tempForm = res[0].Form_Permission__r.Event_Edition_Form__r.Template_Form__c;

                if(this.isOnlineForm){
                    getRecordDetail({objectName:'Event_Edition__c',allFields:'Event_Code__c',recordId:this.eId})
                    .then(res2=>{   
                        this.spinner = false;
                        if(res2.length>0){
                            this.iframeUrl = '/apex/FormPreviewOpsAdmin?Id='+tempForm+'&eventCode='+res2[0].Event_Code__c+'&AccId='+this.accountId;
                        }
                    })
                    .catch(error2=>{
                        this.spinner = false;             
                        handleErrors(this,error2)
                    })
                }
                else if(this.isOnlineForm===false){
                    //get attachment Id
                    getFileDetail({objectName:'Attachment',fields:'Id',parentId:this.selectedUserForm})
                    .then(res2=>{
                        this.spinner = false;
                        if(res2.length>0){
                            this.iframeUrl = '/servlet/servlet.FileDownload?file='+res2[0].Id;
                        }
                    })
                    .catch(error2=>{
                        this.spinner = false;             
                        handleErrors(this,error2)
                    })
                }
            }

            if(res.length>0){
                if(res[0].Status__c!=='Pending' && res[0].Status__c==='Approved'){
                    this.isApprove = true;
                }
                else if(res[0].Status__c!=='Pending Approval' && res[0].Status__c==='Rejected'){
                    this.isReject = true;
                }

                //button render condition
                if(res[0].Status__c!=='Approved' && res[0].Status__c!=='Rejected'){
                    this.btnRender = true;
                }
            }
        })
        .catch(error=>{
            handleErrors(this,error);
        })
    }

    @track isApprovalFormConfirm;
    @track isRejectFormConfirm;
    @track RejectAndSendEmail;
    @track RejectionNote='';
    @track ApproveAndSendEmail;
    @track ApprovalNote='';

    setStatusPending(){
        let objList = [];
        objList.push({sobjectType:'User_Form_Action__c',Status__c:'Pending',Id:this.selectedUserForm});
        updateRecords({objList:objList})
        .then(()=>{
            this.getUserFormAction();
        })
        .catch(error=>{
            handleErrors(this,error);
        })
    }

    approve_rejectFormAction(event){
        this.spinner = true;
        let objList = [];
        const status = event.target.value;
        objList.push({sobjectType:'User_Form_Action__c',Status__c:status,Id:this.selectedUserForm});
        updateRecords({objList:objList})
        .then(()=>{
            this.spinner = false;
            showToast(this,'Form have been "'+status+'".','success','Success');
            this.isRejectFormConfirm = undefined;
            this.isApprovalFormConfirm = undefined;
            this.isOpenApprovalForm = undefined;
        })
        .catch(error=>{
            handleErrors(this,error);
        })
    }

    approve_rejectForm_SendEmailAction(event){
        this.spinner = true;        
        const status = event.target.value;
        let note='';
        if(status==='Approved'){
            note = this.ApprovalNote?this.ApprovalNote:'';
        }
        else if(status==='Rejected'){
            note = this.RejectionNote?this.RejectionNote:'';
        }        
        approveAndRejectFormSendEmail({status:status,note:note,eventEditionId:this.eId,userActionId:this.selectedUserForm,eventEditionForm:this.manualId,formData:{sobjectType:'User_Form_Action__c',Status__c:status,Id:this.selectedUserForm}})
        .then(()=>{
            this.spinner = false;
            showToast(this,'Form have been "'+status+'" and email was sent.','success','Success');
            this.isRejectFormConfirm = undefined;
            this.isApprovalFormConfirm = undefined;
            this.isOpenApprovalForm = undefined;
        })
        .catch(error=>{
            handleErrors(this,error);
        })
    }

    closeConfirmModal(){
        this.isApprovalFormConfirm = false;
        this.isRejectFormConfirm = false;
        this.showoption = false;
    }

    //update fields
    handleChangeEvent(event){        
        if(event.target.name==='ApproveAndSendEmail'){
            this.ApproveAndSendEmail =  event.detail.checked;
        }
        else if(event.target.name==='ApprovalNote'){
            this.ApprovalNote = event.detail.value;
        }
        else if(event.target.name==='RejectAndSendEmail'){
            this.RejectAndSendEmail = event.detail.checked;
        }
        else if(event.target.name==='RejectionNote'){
            this.RejectionNote = event.detail.value;
        }
    }

    //Approve form action
    approveFormAction(){
        this.isApprovalFormConfirm = true;
        this.isRejectFormConfirm = false;
        this.ApproveAndSendEmail = undefined;
    }
    rejectFormAction(){
        this.isApprovalFormConfirm = false;
        this.isRejectFormConfirm = true;
        this.RejectAndSendEmail=undefined;
    }

    exportReport(){
            let action = this.formstatus;
            let selectedtab = this.selectedTab;
            let redirectUrl =  '/apex/ops_formsManualsReports?recordid='+this.manualId+'&action='+action+'&tab='+selectedtab+'&type=forms';
           window.location.href = redirectUrl;
    }
    exportMarketingList(){
        let action = 'no';
        let selectedtab ='t3';
        let redirectUrl =  '/apex/ops_formsManualsReports?recordid='+this.manualId+'&action='+action+'&tab='+selectedtab+'&type=forms&eventedtid='+this.eId ;
        window.location.href = redirectUrl;
    }
    exportFormData(){
      fetchhEvent({
        objName: 'Event_Edition_Form__c',
        fieldNames: 'Id,Event_Edition__r.Event_Code__c,Template_Form__c',
        compareWith: 'id',
        recordId: this.manualId,
        pageNumber: 1,
        pageSize: 1
    })
    .then(result => {
        if (result.recordList[0] != null) {
            let templateForm = '';
            let eveId='';
            templateForm = result.recordList[0].Template_Form__c;
            eveId = result.recordList[0].Event_Edition__r.Event_Code__c;
           let redirectUrl =  '/apex/c__FormReport?formId='+templateForm+'&EveId='+eveId ;
            window.location.href = redirectUrl;
        }

    })
    .catch(error => {
        window.console.log('error...' + JSON.stringify(error));
    });
    }
    tabValue(event){
        let value = event.target.value;
        this.selectedTab = value;
    }
    showOptiondropdown(){
        if(this.showoption){
            this.showoption = false;
        }
        else{
            this.showoption = true;
        }
    }
}