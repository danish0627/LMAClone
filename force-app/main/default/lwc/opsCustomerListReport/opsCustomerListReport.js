/* eslint-disable no-console */
/*
Created By	 : Girikon(Mukesh[STL-216])
Created On	 : 27 Sept, 2019
@description : Display all customer by passing event edition id

Modification log -- [Rajeev (Girikon) 23 Dec 2020]
Modified By	: 
*/

/* eslint-disable no-console */
import { LightningElement, api, track } from 'lwc';
import getRecordDetail from '@salesforce/apex/CommonTableController.getRecordDetail';
import getOppBoothDetailsForExhProfile from '@salesforce/apex/BoothPickListCtrl.getOppBoothDetailsForExhProfile';

import customerFormListWrpData from '@salesforce/apex/CC_CustomerFormListCtrl.customerFormListWrpData';
import {handleErrors, showToast} from 'c/lWCUtility';
import getDatas from '@salesforce/apex/OPSCustomerListCtr.getGenericObjectRecord';
import USER_ID from '@salesforce/user/Id';
import jquery from '@salesforce/resourceUrl/jquery_core';
import {loadScript} from 'lightning/platformResourceLoader';

const DELAY=300;
export default class OpsCustomerListReport extends LightningElement {
    @api recordId; // is for event edition id
    @track agentList;
    @track eventObj;
     //Pagination properties
    @track pagesize=10;
    @track currentPageNo=1;
    @track totalPages=0;    
     // pagination item list like (1..2-3-4-5..6)    
    @track pageList; 
    @track totalrows=0;
    @track offst=0;
    @track hasNext=false;
    @track hasPrev=false;
    @track searchValue='';
    @track showPageView='0';
 
     //Set object and fields to create datatable
    @track tableData;
    @track objectLabel='Customers';
    @track error;
    @track firstTime;
    @track spinner;
    @track isShow;    
    @track lastind;
    @track pasesizeVisible;
    @track isModalOpen;
    @track agentName;

    @track sortDirection
    @track sortByName='User_Type__c';
    @track sortByFieldName
    @track sortType='ASC';

    connectedCallback(){
        //Load jquery
        loadScript(this,jquery)
        .then({
            
        })
        .catch(error=>{
            showToast(this,error,'error','Error');
        })
        this.agentName = '';
        this.getEventDetail();    
        this.getData();
    }

    sortTable(event){
        let prevSortDir = this.sortDirection;
        let prevSortedBy = this.sortByName;
        const newSortedBy = event.currentTarget.id.split('-')[0];
        let iconName = 'utility:arrowup';
        let sortFieldName = newSortedBy;
        
        this.sortByFieldName = sortFieldName;
        if(sortFieldName.toLowerCase().indexOf('namelink')>=0 || sortFieldName.toLowerCase().indexOf('name__clink')>=0){
            const n = sortFieldName.lastIndexOf('Link');
            sortFieldName = sortFieldName.slice(0, n) + sortFieldName.slice(n).replace('Link', '').trim();
        }
        
        this.sortByName = sortFieldName;
        
        if(sortFieldName===prevSortedBy && prevSortDir==='asc'){            
            this.sortDirection = 'desc';
            this.sortType = 'desc';
            iconName = 'utility:arrowdown';
        }
        else if(sortFieldName===prevSortedBy && prevSortDir==='desc'){
            this.sortDirection = 'asc';
            this.sortType = 'asc';
            iconName = 'utility:arrowup';
        }
        else if(sortFieldName!==prevSortedBy){
            this.sortDirection = 'asc';
            this.sortType = 'asc';
            iconName = 'utility:arrowup';
        }
        
        window.clearTimeout(this.delayTimeout);
        //add class to th element "slds-has-focus"            
        this.resetColumnClass();   
        const ele = event.currentTarget;         
        window.jQuery(ele).parent().addClass('slds-has-focus');
        event.currentTarget.querySelector('lightning-icon').iconName = iconName;        
        
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(()=>{
            this.currentPageNo = 1;
            this.offst = 0;            
            this.hasNext = false;
            this.hasPrev = false;
            
            this.highLightNumber(1);
            this.getData();
        },DELAY);
    }

    getEventDetail(){
        getRecordDetail({objectName:'Event_Edition__c',allFields:'Name,Event_Code__c',recordId:this.recordId})
        .then(resp=>{
            if(resp.length>0){
                this.eventObj = resp[0];
            }
        })
        .catch(error=>{
            handleErrors(this,error);
        })
    }
    
    handleAgentChange(event){
        this.agentName = event.detail.value; 
        window.clearTimeout(this.delayTimeout);
        
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(() => {
            this.offst = 0;
            this.currentPageNo = 1;
            this.hasNext = true;
            this.hasPrev = false;
            this.highLightNumber(1);
            this.getData();
        },DELAY);
    }
    getData(){
        
        this.spinner = true;
        this.pasesizeVisible = this.pagesize.toString();
        getDatas({agentName:this.agentName,searchValue:this.searchValue,eventId:this.recordId,pagesize:this.pagesize,next:this.hasNext,prev:this.hasPrev,off:this.offst,sortBy:this.sortByName,sortType:this.sortType})
        .then(data=>{            
            if(this.offst === -1){
                this.offst = 0;
            }
            this.firstTime = false;
            this.spinner = false;
            this.isShow = this.spinner===false && this.firstTime;
            const totalRows = data.total>2000?2000:data.total;
            let agents = JSON.parse(JSON.stringify(data.ltngTabWrap.userAgents));
            this.agentList = [{label:'All',value:''}];
            agents.forEach(item => {
                this.agentList.push({label:item.Name,value:item.Name});
            });
            this.tableData = JSON.parse(JSON.stringify(data.ltngTabWrap.tableRecord));
            let tempTableData = JSON.parse(JSON.stringify(data.ltngTabWrap.tableRecord2));
            this.tableData.forEach(item=>{
                item.userTypeId = item.User_Type__c;
                tempTableData.forEach(item2=>{
                    if(item2.User_Type__c===item.User_Type__c){
                        item.User_Type__c = item2.Name;
                    }
                });
            });
            this.totalPage = Math.ceil(totalRows/this.pagesize);
            this.totalRows = totalRows;
            this.isMoreThan2000 = data.total>2000?true:false;
            this.lastind = parseInt(data.offst+this.pagesize,10);                              
            
            if(data.total<this.lastind){
                this.lastind=data.total;
            }
            this.showPageView = 'Showing: '+parseInt(data.offst+1,10)+'-'+this.lastind;
            
            this.generatePageListUtil();
            if(totalRows===0){
                this.error = 'No record found';
                this.tableData=undefined;
                this.pageList = undefined;
            }
            else{
                this.error = undefined;
            }  
        })
        .catch(error=>{
            this.tableData=undefined;
            this.error = error;
            handleErrors(this,error);
        });        
    }    

    setParentFieldValue(tbldatas){ 
        let datas = JSON.parse(JSON.stringify(tbldatas));
        this.tableData = datas;        
    }

    setParentFieldColumn(columnObj,columnList,datas){        
        this.setParentFieldValue(datas)
    }

    // Table pagination, sorting and page size change actions Start
    getNextData(){   //Table Action 1
        if(this.lastind>=this.totalRows){
            return;
        }
        //this.spinner = true;
        window.clearTimeout(this.delayTimeout);
        const nextPage = this.currentPageNo+1;
        const offset = (nextPage * this.pagesize)-this.pagesize;
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(() => {
            this.offst = offset;
            this.currentPageNo = nextPage;
            this.hasNext = true;
            this.hasPrev = false;
            this.highLightNumber(nextPage);
            this.getData();
        },DELAY);
    }

    getPrevData(){  //Table Action 2
        if(this.currentPageNo===1){return;}
        window.clearTimeout(this.delayTimeout);
        const prevPage = this.currentPageNo-1;
        const offset = (prevPage * this.pagesize)-this.pagesize;
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(() => {
            this.offst = offset;
            this.currentPageNo = prevPage;
            this.hasNext = false;
            this.hasPrev = true;
            this.highLightNumber(prevPage);
            this.getData();
        },DELAY);
    }
    onPageSizeChange(event){
        window.clearTimeout(this.delayTimeout);
        
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(() => {
            this.offst = 0;
            this.currentPageNo = 1;
            this.hasNext = false;
            this.hasPrev = false;
            this.pagesize = parseInt(event.detail.value,10);
            this.highLightNumber(1);
            this.getData();
        },DELAY);
    }
   
    /**
     * Fire whenever user type in search box, but data load if search field empty      * 
     */
    reloadData(){
        let searchValue = this.template.querySelector(".search-box").value;
        searchValue = searchValue.trim();
        window.clearTimeout(this.delayTimeout);
        if(searchValue===''){            
            // eslint-disable-next-line @lwc/lwc/no-async-operation
            this.delayTimeout = setTimeout(() => {
                this.offst = 0;
                this.currentPageNo = 1;
                this.hasNext = false;
                this.hasPrev = false;   
                this.searchValue = '';                
                this.highLightNumber(1);
                this.getData();
            },DELAY);
        }
        else{           
            this.searchValue = searchValue;    
            // eslint-disable-next-line @lwc/lwc/no-async-operation
            this.delayTimeout = setTimeout(() => {
                this.offst = 0;
                this.currentPageNo = 1;
                this.hasNext = false;
                this.hasPrev = false;                                 
                this.highLightNumber(1);
                this.getData();
            },DELAY);
        }
    }
    
    resetColumnClass(){
        const els = this.template.querySelectorAll(".slds-is-sortable");
        els.forEach((item)=>{
            window.jQuery(item).removeClass('slds-has-focus');
            item.querySelector('lightning-icon').iconName = 'utility:arrowup';
            item.querySelector('lightning-icon').style = 'fill:rgb(0, 112, 210)';
        });
    }

    processMe(event){ //Table Action 3
        window.clearTimeout(this.delayTimeout);
        let currentPageNumber = this.currentPageNo;
        let selectedPage = parseInt(event.target.name,10);        
        let pagesize = this.pagesize;        
        let next = selectedPage < currentPageNumber?false:true;
        let prev = selectedPage < currentPageNumber?true:false;
        const offset=(selectedPage*pagesize)-pagesize;
        
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(() => {
            this.offst = offset;
            this.currentPageNo = selectedPage;
            this.hasNext = next;
            this.hasPrev = prev;
            this.highLightNumber(selectedPage);
            this.getData();
        },DELAY);
    }

    highLightNumber(pageNumber){ //Util method 1
        try{
            this.pageList.forEach(element => {
                if(this.template.querySelector('span[id*="'+element+'-"]')!==null && this.template.querySelector('span[id*="'+element+'-"]').firstChild!==null){
                    this.template.querySelector('span[id*="'+element+'-"]').firstChild.classList.remove('selected');    
                }
            });
            if(this.template.querySelector('span[id*="'+pageNumber+'-"]')!==null && this.template.querySelector('span[id*="'+pageNumber+'-"]').firstChild!==null){
                this.template.querySelector('span[id*="'+pageNumber+'-"]').firstChild.classList.add('selected');
            }
            
            
            if(pageNumber===1){
                if(this.template.querySelector(".prev-btn")!==null && this.template.querySelector(".prev-btn").firstChild!==null){
                    this.template.querySelector(".prev-btn").firstChild.setAttribute("disabled",true);
                }
            }
            if(pageNumber>=this.totalPage){
                if(this.template.querySelector(".next-btn")!==null && this.template.querySelector(".next-btn").firstChild!==null){
                    this.template.querySelector(".next-btn").firstChild.setAttribute("disabled",true);
                }
            }
        }
        catch(e){
            // eslint-disable-next-line no-console
            console.error(e);
        }
    }

    generatePageListUtil(){  // Util Method 2
        const pageNumber = this.currentPageNo;        
        const pageList = [];
        const totalPages = this.totalPage;

        if(totalPages > 1){
            if(totalPages <= 10){                
                for(let counter = 2; counter < (totalPages); counter++){
                    pageList.push(counter);
                } 
            } else{
                if(pageNumber < 5){
                    pageList.push(2, 3, 4, 5, 6);
                } else{
                    if(pageNumber>(totalPages-5)){
                        pageList.push(totalPages-5, totalPages-4, totalPages-3, totalPages-2, totalPages-1);
                    } else{
                        pageList.push(pageNumber-2, pageNumber-1, pageNumber, pageNumber+1, pageNumber+2);
                    }
                }
            }
        }
        this.pageList = pageList;
    }
    
    get pagesizeList(){
        return [
            {'label':'5','value':'5'},
            {'label':'10','value':'10'},
            {'label':'15','value':'15'},
            {'label':'20','value':'20'},
            {'label':'30','value':'30'},
            {'label':'50','value':'50'}
        ];
    }
    get firstActiveClass(){
        return this.currentPageNo===1?'selected':'';
    }
    get lastActiveClass(){
        return this.currentPageNo===this.totalPage?'selected':'';
    }    
    get isTrue(){
        return this.spinner && !this.firstTime;        
    }

    @api
    refreshTable(){
        this.getData();        
    }
    @track accountId;
    @track userTyperId;    
    @track boothList;
    @track selectedBooth;
    @track eventCode;
    @track accountContactURL;
    @track badgesURL;
    @track condition1;
    @track condition2;
    toggleDetail(event){
        this.accountContactURL = undefined;
        this.boothList = [];
        this.selectedBooth=undefined;
        const row = JSON.parse(JSON.stringify(this.tableData));
        this.accountId = row[event.target.value].AccountId;
        this.userTyperId = row[event.target.value].userTypeId;  
        this.eventCode = this.eventObj.Event_Code__c;
        this.accountContactURL = '/c/opsAccountContactsTabApp.app?uType='+row[event.target.value].User_Type__c+'&eventId='+this.recordId+'&exhAccountID='+this.accountId;
        this.badgesURL = '/apex/opsCustomerProfileProdCateTab?uType='+row[event.target.value].User_Type__c+'&eventId='+this.recordId+'&exhAccountID='+this.accountId+'&eventCode='+this.eventCode;
        
        //Set condition for form and manuals
        this.condition1 =
            "Manual_Permission__r.Manuals__r.Event_Edition__r.Event_Code__c ='" +this.eventCode +
            "' AND Manual_Permission__r.Manuals__r.Required__c = true AND User_Type__r.Id = '" +this.userTyperId +
            "' AND Manual_Permission__r.Active__c=true AND Account__c='" +this.accountId +"'";
          this.condition2 = "Manual_Permission__r.Manuals__r.Event_Edition__r.Event_Code__c ='" +this.eventCode +
            "' AND Manual_Permission__r.Manuals__r.Required__c != true AND User_Type__r.Id = '" +this.userTyperId +
            "' AND Manual_Permission__r.Active__c=true AND Account__c='" +this.accountId +"'";

        this.getAllBooths();
        this.getFormCondition();
        this.isModalOpen = true;
    }
    closeModal(){
        this.isModalOpen = false;
    }

    //get booth detail to display picklist    
    getAllBooths(){
        getOppBoothDetailsForExhProfile({accountId:this.accountId,eventId:this.recordId})
        .then(res=>{
            if(res.length>0){                
                const test = JSON.parse(JSON.stringify(res));
                test.forEach(item=>{
                    this.boothList.push({label:item.accountName+' - '+item.boothName,value:item.boothId});
                });
                this.selectedBooth = res[0].boothId;
            }
        })
        .catch(error=>{
            handleErrors(this,error);
        })
    }
    
    boothChange(event){
        window.clearTimeout(this.delayTimeout);
        this.selectedBooth = undefined;
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(() => {
            this.selectedBooth = event.detail.value;
        },DELAY);
    }

    get options() {
        if(this.boothList && this.boothList.length>0){
            return this.boothList;
        }
        return false;
    }

    
    @track qryCondition;
    @track qryConditionAddtional;    
    @track lstEventSetting;
    getFormCondition(){
        customerFormListWrpData({
            userId: USER_ID,
            eventCode: this.eventcode
        })
        .then(result => {
            let data = JSON.parse(JSON.stringify(result));
            this.qryCondition = '(Account__c=\''+this.accountId+'\' AND Form_Permission__r.Event_Edition_Form__r.Event_Edition__r.Id=\''+this.recordId+'\' AND Form_Permission__r.Event_Edition_Form__r.Mandatory__c=true AND User_Type__c=\''+this.userTyperId+'\') ';
            this.qryConditionAddtional = '(Account__c=\''+this.accountId+'\' AND Form_Permission__r.Event_Edition_Form__r.Event_Edition__r.Id=\''+this.recordId+'\' AND Form_Permission__r.Event_Edition_Form__r.Mandatory__c=false AND User_Type__c=\''+this.userTyperId+'\') ';
            this.lstEventSetting = data.lstEventSetting;
        })
        .catch(error => {
            handleErrors(this,error);
        });
    }

    
}