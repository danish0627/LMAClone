import { LightningElement, track, api, wire } from 'lwc';
import getRecords from "@salesforce/apex/OPS_FormsManualsCtrl.getAggregateRecords";
import getManualData from '@salesforce/apex/OPS_FormsManualsCtrl.getUserManualAction';
import singleReminderEmail from "@salesforce/apex/OPS_FormsManualsCtrl.SingleManualReminderEmail";
import { showToast} from 'c/lWCUtility';

export default class Ops_manualReports extends LightningElement {
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
    @track qryConditionViewed = '';
    @track qryConditionNotViewed = '';
    @track selectedManaul = '';
    @track tablabelYes='';
    @track tablabelNo='';
    @track manualsAccount;
    @track isSendEmail=false;
    @track isViewed='false';
    @track isAgreed='false';
    @track selectedTab='';
    @track manualstatus ='';
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

        getRecords({ objName: 'Manuals_Permission__c', fieldNames: 'Manuals__c,Manuals__r.Name,Manuals__r.Required__c,Manuals__r.ManualType__c,SUM(Total_User_Count__c),SUM(Total_User_Viewed__c),SUM(Total_User_Agreed__c) ', srchField: 'Manuals__r.Name,Manuals__r.ManualType__c', srchText: this.srchValue, conditions: 'where active__c=true and Manuals__c!=\'\' and Manuals__r.Event_Edition__c =\'' + this.eId + '\' ', groupbyFields: 'group by Manuals__r.Name,Manuals__c,Manuals__r.Event_Edition__c,Manuals__r.Required__c,Manuals__r.ManualType__c', sortBy: 'Manuals__r.Name', sortType: 'asc', pageNumber: this.pageNumber, pageSize: this.pageSize })
            .then(result => {
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
        this.isSendEmail =false;
        this.tablabelYes='Viewed';
        this.tablabelNo='Not Viewed';
        this.showViewedReport = false;
        this.isViewed = 'true';
        this.isAgreed = 'false';
        this.manualstatus = 'Viewed';
        window.clearTimeout(this.delayTimeout);
        let selectedRecordView = this.manualsList[event.currentTarget.dataset.id];
        this.selectedManaul = selectedRecordView.Name;
        this.manualId = event.target.dataset.recordId;
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(() => {
            this.qryConditionViewed = 'Manual_Permission__r.Active__c=true and Is_Viewed__c=true and Manual_Permission__r.Manuals__c=\'' + this.manualId + '\'';
            this.qryConditionNotViewed = 'Manual_Permission__r.Active__c=true and Is_Viewed__c=false and Manual_Permission__r.Manuals__c=\'' + this.manualId + '\'';
            this.showViewedReport = true;
        }, 200)
    }
    clickOnAgreed(event) {
        this.tablabelYes='Agreed';
        this.tablabelNo='Not Agreed';
        this.isSendEmail =true;
        this.showViewedReport = false;
        this.isAgreed = 'true';
        this.isViewed ='false';
        this.manualstatus = 'Agreed';
        window.clearTimeout(this.delayTimeout);
        let selectedRecordView = this.manualsList[event.currentTarget.dataset.id];
        this.selectedManaul = selectedRecordView.Name;
        this.manualId = event.target.dataset.recordId;
        this.delayTimeout = setTimeout(() => {
            this.qryConditionViewed = 'Manual_Permission__r.Active__c=true and Is_Agree__c=true and Manual_Permission__r.Manuals__c=\'' + this.manualId + '\'';
            this.qryConditionNotViewed = 'Manual_Permission__r.Active__c=true and Is_Agree__c=false and Manual_Permission__r.Manuals__c=\'' + this.manualId + '\'';
            this.showViewedReport = true;
        }, 200)
        let manualId = this.manualId;
        let tempArr=[];
        getManualData({ manualsId : manualId })
            .then(result => {
                
                for(let i = 0 ; i< result.length; i++){
                   let accounts = result[i].Account__c;
                   tempArr.push(accounts);
                }
                this.manualsAccount = JSON.stringify(tempArr);
                
            })
            .catch(error => {
                window.console.log("error..." + JSON.stringify(error));
            });
    }
    closeRightSection() {
        this.showViewedReport = false;
    }
    srchManual(event) {
        this.srchValue = event.target.value;
        this.isLoading = true;
        this.pageNumber  = 1;
        this.getData();
    }
    sendEmail()
    {   
        let eventId = this.eId;
        let manualId = this.manualId;
        singleReminderEmail({ eventEditionId : eventId , accList : this.manualsAccount , EventEditionManual : manualId})
            .then(result => {
                showToast(this,'Email Sent Successfully.','success','Success');
            })
            .catch(error => {
                window.console.log("error..." + JSON.stringify(error));
            });
    }
    exportReport(){
        let action = this.manualstatus;
        let selectedtab = this.selectedTab;
        let redirectUrl =  '/apex/ops_formsManualsReports?recordid='+this.manualId+'&action='+action+'&tab='+selectedtab+'&type=manuals';
        window.location.href = redirectUrl;
    }
    exportReportAll(){
       
        let action = 'no';
        let selectedtab ='t3';
        let redirectUrl =  '/apex/ops_formsManualsReports?recordid='+this.manualId+'&action='+action+'&tab='+selectedtab+'&type=manuals&eventedtid='+this.eId ;
        window.location.href = redirectUrl;
    }
    tabValue(event){
        let value = event.target.value;
        this.selectedTab = value;
    }
}