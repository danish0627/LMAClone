/*
Created By	 : Girikon(Mukesh[STL-27])
Created On	 : Aug ‎26, ‎2019
@description : Component to display Change request data in tabular format
                Support pagination,sorting,searching,filter,edit,delete,mass update&delete and open detail modal 

Modification log --
Modified By	: 
*/

/* eslint-disable no-console */
import {LightningElement,track,api } from 'lwc';
import getDatas from '@salesforce/apex/CommonTableController.getGenericObjectRecord';
import getAggregateData from '@salesforce/apex/CommonTableController.getAggregateData';
import deleteRecord from '@salesforce/apex/CommonTableController.deleteRecord';
import updateRecords from '@salesforce/apex/CommonTableController.massUpdateRecords';
import getFilePreview from '@salesforce/apex/CommonTableController.getFilePreview';
import {loadScript} from 'lightning/platformResourceLoader';
import jquery from '@salesforce/resourceUrl/jquery_core';
import {NavigationMixin} from 'lightning/navigation';
import userId from '@salesforce/user/Id';
import {handleErrors, showToast} from 'c/lWCUtility';

const DELAY=300;
export default class SssChangeRequest extends NavigationMixin(LightningElement) {
    //action properties
    @api isSupportNewRecord='false';
    @track isOpenSingleDeleteModal=false;
    @track selectedRecordId;    
    @track recordName;
    /*@track isOpenNewModal=false;
    @track isOpenEditModal=false;
    @track isOpenDetailModal=false;*/

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
    @track sortByFieldName='';
    @track sortByName='LastModifiedDate';
    @track sortType='desc';

    //Set object and fields to create datatable
    @track tableData;
    @track tableColumn;
    @api objectName='Opportunity';
    @api objectLabel='Opportunities';    
    @api fields='Id,Account.Name,Name,EventEdition__r.Name,CloseDate,StageName,Status__c,Tax_Rule_SAP__c,Event_Series__r.Name';
    @api fieldsLabel='Id,Name';
    @api condition='Id!=\'\'';
    @track tempCondition='';
    @api profile='';    
    @api isViewFile='false';
    
    @api isShowAction='false';
    @api showActionButton='false';
    //Filter property
    //Owner Filter
    @api isFilterByOwner;    
    @api selectedOwner;


    //filter1
    @api filterField1;
    @api filter1Label;
    @api isMultiPicklistFilter1;
    @track filterField1Options;
    @track filterField1Value='';
    
    //filter 2
    @api filterField2;
    @api filter2Label;
    @api isMultiPicklistFilter2;
    @track filterField2Options;
    @track filterField2Value='';

    //filter 3
    @api filterField3;
    @api filter3Label;
    @api isMultiPicklistFilter3;
    @track filterField3Options;
    @track filterField3Value='';

    @track error;
    @track firstTime;
    @track spinner;
    @track isShow;
    @track colSpan;
    @track lastind;
    
    connectedCallback(){
        this.selectedOwner = userId;
        //Load jquery
        loadScript(this,jquery)
        .then({
            
        })
        .catch(error=>{
            showToast(this,error,'error','Error');
        })


        this.firstTime=true;
        this.spinner = false;
        this.hasNext = false;
        this.hasPrev = false;
        this.pagesize = 10;
        this.offst = 0;
        
        const col = [];
        if(typeof this.fields === 'string'){
            this.fields.split(',').forEach((item,i) => {                
                col.push({label:this.fieldsLabel.split(',')[i],fieldName:item.trim()});
            });
            this.colSpan = col.length+1;
        }
        else{
            this.fields='';
        }
        
        if(typeof this.objectName !='string'){
            this.objectName = '';
        }        
        this.tableColumn = col;

        if(this.filterField1!==undefined){
            this.setFilterOptions(1,this.filterField1);
        }
        if(this.filterField2!==undefined){
            this.setFilterOptions(2,this.filterField2);
        }
        if(this.filterField3!==undefined){            
            this.setFilterOptions(3,this.filterField3);
        }
        this.isShow = this.spinner===false && this.firstTime;
        this.handleFilterChange();        
    }
    
    getData(){
        this.spinner = true;
        getDatas({searchValue:this.searchValue,objectName:this.objectName,fieldstoget:this.fields,pagesize:this.pagesize,
            next:this.hasNext,prev:this.hasPrev,off:this.offst,sortBy:this.sortByName,sortType:this.sortType,condition:this.tempCondition})
        .then(data=>{            
            if(this.offst === -1){
                this.offst = 0;
            }
            this.firstTime = false;
            this.spinner = false;
            this.isShow = this.spinner===false && this.firstTime;

            const totalRows = data.total>2000?2000:data.total;
            
            this.tableColumn = data.ltngTabWrap.tableColumn;   
            this.setParentFieldColumn(this.tableColumn,this.fields,data.ltngTabWrap.tableRecord);
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
    
    handleFilterChange(){
        //this.spinner = true;

        const condition = this.buildCondition();
        window.clearTimeout(this.delayTimeout);
        
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(()=>{
            this.offst = 0;
            this.currentPageNo = 1;
            this.hasNext = false;
            this.hasPrev = false;
            this.tempCondition = condition;
            this.getData();
        },DELAY)
    }
    handleMultipicklistChange(event){
        window.clearTimeout(this.delayTimeout);
        const selectedOptions = event.target.selectedOptions;
        const filterName = event.target.filterName;        
        if(filterName==='3'){
            this.filterField3Value = selectedOptions;
        }
        if(filterName==='2'){
            this.filterField2Value = selectedOptions;
        }
        if(filterName==='1'){
            this.filterField1Value = selectedOptions;
        }
        const condition = this.buildCondition();
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(()=>{
            this.offst = 0;
            this.currentPageNo = 1;
            this.hasNext = false;
            this.hasPrev = false;
            this.tempCondition = condition;
            this.getData();
        },DELAY)
        
    }
    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;        
        switch (actionName) {
            case 'delete':
                this.isOpenSingleDeleteModal = true;
                this.selectedRecordId = row.Id;
                break;
            case 'edit':
                this.selectedRecordId = row.Id;
                this.openEditRecordModal(row.Id);
                break;
            case 'viewfile':                
                if(this.objectName.toLowerCase() === 'attachment'){
                    let win = window.open("https://"+window.location.host+"/servlet/servlet.FileDownload?file="+row.Id,'_blank');                    
                    win.focus();
                }
                else{
                    this.openFile(row.Id);
                }
                break;
                case 'openactionmodal':
                    this.openActionModal(row.Id);
                break;
            default:
        }
    }
    noDelete(){
        this.selectedRecordId = '';
        this.isOpenSingleDeleteModal = false;        
    }

    yesDeleteAll() {
        var records = [];        
        records.push({Id:this.selectedRecordId,sobjectType:this.objectName});
        this.spinner = true;
        deleteRecord({objList:records})
        .then(res=>{
            this.spinner = false;
            this.selectedRecordId = '';
            this.isOpenSingleDeleteModal = false;
            this.refreshTable();
        })
        .catch(error=>{
            handleErrors(this,error);
        })

        
    }

    setParentFieldValue(tbldatas){ 
        let datas = JSON.parse(JSON.stringify(tbldatas));

        for(let i=0;i<datas.length;i++){
            datas[i].RecordId = 'a'+datas[i].Id;
            datas[i].condition = 'Opportunity__c=\''+datas[i].Id+'\' ';
            if(datas[i].Change_Request_Status__c==='Rejected'){
                datas[i].disableRejected = true;
            }
            if(datas[i].Change_Request_Status__c==='Completed'){
                datas[i].disabledApproved = true;
            }
            if(datas[i].Change_Request_Status__c==='New'){
                datas[i].enabledApproved_Rejected = true;
            }


            //build link
            if(datas[i].hasOwnProperty('Name')){
                datas[i].NameLink='/lightning/r/'+this.objectName+'/'+datas[i].Id+'/view';
            }

            if(typeof datas[i] === 'object'){
                // Parent table data
                // eslint-disable-next-line guard-for-in                
                for (let k in datas[i]) {                    
                    if (datas[i].hasOwnProperty(k) && typeof datas[i][k] === 'object'){                        
                        Object.keys(datas[i][k]).forEach(item=>{
                            datas[i][k+''+item] = datas[i][k][item];
                            if(item.toLowerCase()==='name'){
                                datas[i][k+'NameLink']='/lightning/r/'+k+'/'+datas[i][k].Id+'/view';
                            }
                        });

                        //three level data                        
                        for (let j in datas[i][k]) {
                            if (datas[i][k].hasOwnProperty(j) && typeof datas[i][k][j] === 'object'){
                                Object.keys(datas[i][k][j]).forEach(item=>{                                    
                                    if(typeof datas[i][k][j][item] !== 'object'){
                                        datas[i][k+''+j+''+item] = datas[i][k][j][item];
                                        if(item.toLowerCase()==='name'){
                                            datas[i][k+''+j+''+item+'Link'] = '/lightning/r/'+j+'/'+datas[i][k][j].Id+'/view';
                                        }
                                    }
                                    else{
                                        Object.keys(datas[i][k][j][item]).forEach(item2=>{
                                            datas[i][k+''+j+''+item+''+item2] = datas[i][k][j][item][item2];
                                            if(item2.toLowerCase()==='name'){
                                                datas[i][k+''+j+''+item+''+item2+'Link'] = '/lightning/r/'+item+'/'+datas[i][k][j][item].Id+'/view';
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    
                    }
                }
            }
        }
        this.tableData = datas;        
    }

    setParentFieldColumn(columnObj,columnList,datas){
        columnObj = JSON.parse(JSON.stringify(columnObj));
        columnList = JSON.parse(JSON.stringify(columnList));
        if(columnList.indexOf('.')>0){
            let col = columnList.split(',');
            for(let i=0;i<col.length;i++){
                let test = col[i].split('.');
                let label = this.fieldsLabel.split(',')[i];                
                if(col[i].indexOf('.')>0 && test.length===2){
                    columnObj.splice(i,0,{fieldName: col[i],label:label});
                }
                if(col[i].indexOf('.')>0 && test.length===3){
                    columnObj.splice(i,0,{fieldName: col[i],label:label});
                }
            }
        }
        if(this.isViewFile==='true'){
            columnObj.splice(0, 0, 
                {
                    type: "button-icon",                    
                    typeAttributes: {
                        iconName: 'utility:preview',                        
                        name: 'viewfile',
                        title: 'View File',
                        variant:'bare',
                        disabled: false,
                        value: {fieldName: 'ContentDocumentId'}
                    }
                }
            );
        }
        if(this.showActionButton==='true'){
            columnObj.splice(0, 0, 
                {
                    type: "button-icon",                    
                    typeAttributes: {
                        iconName: 'utility:new_window',                        
                        name: 'openactionmodal',
                        title: 'Open',
                        variant:'bare',
                        disabled: false,
                        value: {fieldName: 'Id'}
                    }
                }
            );
        }

        for(let i=0;i<columnObj.length;i++){
            //format date field
            if(columnObj[i].type==='textarea' || columnObj[i].type==='button-icon' || columnObj[i].type==='multipicklist'){
                columnObj[i].sortable=false;
            }
            else{
                columnObj[i].sortable=true;
            }
            
            if(columnObj[i].type==='datetime'){
                columnObj[i].type='date';
                columnObj[i].typeAttributes= {day: 'numeric',month: 'short',year: 'numeric',hour: '2-digit',minute: '2-digit',second: '2-digit',hour12: true}
            }
            //format date field
            if(columnObj[i].type==='date'){                
                columnObj[i].typeAttributes= {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                }
            }

            if(columnObj[i].type==='currency'){
                columnObj[i].cellAttributes = { alignment: 'left' };
            }
            if(columnObj[i].fieldName!==undefined && columnObj[i].fieldName.toLowerCase().indexOf('name')>=0){
                if(columnObj[i].fieldName.toLowerCase()!=='stagename'){
                    columnObj[i].type='url';
                    columnObj[i].typeAttributes = {label: {fieldName:columnObj[i].fieldName},tooltip:'Open in new tab', target: '_blank'};
                    columnObj[i].fieldName=columnObj[i].fieldName+'Link';
                }
            }
        }
        if(this.isShowAction==='true'){
            let actions = [
                { label: 'Edit',title: 'Click to Edit', name: 'edit',iconName: 'utility:edit'}
            ];
            if(this.profile==='System Administrator'||this.profile==='GE System Administrator'||this.profile==='GE BA Administrator'){
                actions.push({ label: 'Delete',title: 'Click to Delete', name: 'delete',iconName: 'utility:delete'})
            }

            if(this.profile==='System Administrator'||this.profile==='GE System Administrator'||this.profile==='GE BA Administrator'||this.profile==='SSC Finance-Accounting'){
                columnObj.push({label: 'Action', type: 'action', typeAttributes: { rowActions: actions }});
            }
        }
        this.tableColumn = columnObj;
        this.setParentFieldValue(datas)
    }

    // Table pagination, sorting and page size change actions Start
    getNextData(){   //Table Action 1
        if(this.lastind>=this.totalRows){
            return;
        }
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
    searchData(){        
        let searchValue = this.template.querySelector(".search-box").value;
        searchValue = searchValue.trim();
        window.clearTimeout(this.delayTimeout);
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(() => {
            this.offst = 0;
            this.currentPageNo = 1;
            this.hasNext = false;
            this.hasPrev = false;   
            this.searchValue = searchValue;
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
        if(searchValue===''){
            window.clearTimeout(this.delayTimeout);
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
    }
    
    handleSorting(event){
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
    get ownerOptions(){
       return [{'label':'My '+this.objectLabel,'value':userId},{'label':'All '+this.objectLabel,'value':''}];
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

   setFilterOptions(filterNum,fieldName){
        getAggregateData({condition:this.condition,objectName:this.objectName,fieldName:fieldName})
        .then(result=>{
            let f = fieldName.split('.');
            if(f.length === 1){
                f = fieldName;
            }
            if(f.length === 2){
                f = f[1];
            }
            if(f.length === 3){
                f = f[2];
            }
            
            let obj = JSON.parse(JSON.stringify(result));
            let opt =[];
            
            for(let i=0;i<obj.length;i++){
                if(obj[i][f]===undefined){
                    opt.push({label:'N/A ('+obj[i].expr0+')',value:'NULL',isChecked:false});
                }
                else{
                    opt.push({label:obj[i][f]+' ('+obj[i].expr0+')',value:obj[i][f],isChecked:false});
                }
            }
            if(filterNum === 1){
                opt.splice(0,0,{label:'All '+this.filter1Label,value:'',isChecked:true});
                this.filterField1Options = opt;    
            }
            else if(filterNum === 2){
                opt.splice(0,0,{label:'All '+this.filter2Label,value:'',isChecked:true});
                this.filterField2Options = opt;    
            }
            else if(filterNum === 3){
                opt.splice(0,0,{label:'All '+this.filter3Label,value:'',isChecked:true});
                this.filterField3Options = opt;    
            }
        })
        .catch(error=>{
            console.error(error);
            handleErrors(this,error);
        });
    }

    buildCondition(){
        let condition = this.condition;

        //Only for Owner filter
        if(this.isFilterByOwner==='true'){
            this.selectedOwner = this.template.querySelector(".ownerfilter")?this.template.querySelector(".ownerfilter").value:userId;
            if(this.selectedOwner===''){
                return condition;   
            }
            return condition+' AND (OwnerId=\''+this.selectedOwner+'\')';
        }
        
        if(this.template.querySelector(".filter1")!==undefined && this.template.querySelector(".filter1")!==null){
            this.filterField1Value = this.template.querySelector(".filter1").value;
        }
        
        if(this.template.querySelector(".filter2")!==undefined && this.template.querySelector(".filter2")!==null){
            this.filterField2Value = this.template.querySelector(".filter2").value;
        }

        if(this.template.querySelector(".filter3")!==undefined && this.template.querySelector(".filter3")!==null){
            this.filterField3Value = this.template.querySelector(".filter3").value;
        }

        const selectedValue1 = this.filterField1Value?this.filterField1Value:'';
        const selectedValue2 = this.filterField2Value?this.filterField2Value:'';
        const selectedValue3 = this.filterField3Value?this.filterField3Value:'';

        let customCond = '';
        if(selectedValue1!=='' && selectedValue2!=='' && selectedValue3!=='')
        {            
            customCond = customCond + ' AND ('+this.filterField1+' IN (\''+selectedValue1+'\') ';
            customCond = customCond + ' AND '+this.filterField2+' IN (\''+selectedValue2+'\') ';
            customCond = customCond + ' AND '+this.filterField3+' IN (\''+selectedValue3+'\')) ';
        }
        else if(selectedValue1!=='' && selectedValue2!=='' && selectedValue3===''){
            customCond = customCond + ' AND ('+this.filterField1+' IN (\''+selectedValue1+'\') ';
            customCond = customCond + ' AND '+this.filterField2+' IN (\''+selectedValue2+'\')) ';
        }
        else if(selectedValue1!=='' && selectedValue2==='' && selectedValue3!==''){
            customCond = customCond + ' AND ('+this.filterField1+' IN (\''+selectedValue1+'\') ';
            customCond = customCond + ' AND '+this.filterField3+' IN (\''+selectedValue3+'\')) ';
        }
        else if(selectedValue1==='' && selectedValue2!=='' && selectedValue3!==''){
            customCond = customCond + ' AND ('+this.filterField2+' IN (\''+selectedValue2+'\') ';
            customCond = customCond + ' AND '+this.filterField3+' IN (\''+selectedValue3+'\')) ';
        }
        else if(selectedValue1!==''){
            customCond = customCond + ' AND ('+this.filterField1+' IN (\''+selectedValue1+'\')) ';
        }
        else if(selectedValue2!==''){
            customCond = customCond + ' AND ('+this.filterField2+' IN (\''+selectedValue2+'\')) ';
        }
        else if(selectedValue3!==''){
            customCond = customCond + ' AND ('+this.filterField3+' IN (\''+selectedValue3+'\')) ';
        }
        customCond = customCond.replace(/NULL/g,'');
        return condition+customCond;
    }

    get isTrue(){
        return this.spinner && !this.firstTime;        
    }
    get showNewButton(){
        return this.isSupportNewRecord==='true'?true:false;
    }
    openFile(parentId){        
        if(parentId){
            this.spinner = true;
            getFilePreview({objectName:'ContentDocumentLink',fields:'Id,ContentDocumentId, ContentDocument.Title',parentId:parentId})
            .then(result=>{
                this.spinner = false;
                if(Array.isArray(result) && result.length>0){
                    this.pdfName = result[0].Name;
                    //this.pdfUrl = "https://"+window.location.host+"/servlet/servlet.FileDownload?file="+result[0].Id;
                    // Naviagation Service to the show preview
                    this[NavigationMixin.Navigate]({
                        type: 'standard__namedPage',
                        attributes: {
                            pageName: 'filePreview'
                        },
                        state : {
                            // assigning ContentDocumentId to show the preview of file
                            selectedRecordId:result[0].ContentDocumentId
                        }
                    })
                }
                else{
                    showToast(this,'No file found','error','Error');
                }
            })
            .catch(error=>{
                this.spinner = false;
                console.error(error);
                handleErrors(this,error);
            })
        }
    }

    openNewRecordModal(){
        this.dispatchEvent(new CustomEvent('opennewmodal',{detail:''}));
    }
    openEditRecordModal(recordId){
        this.dispatchEvent(new CustomEvent('openeditmodal',{detail:recordId}));
    }
    openActionModal(recordId){
        this.dispatchEvent(new CustomEvent('openactionmodal',{detail:recordId}));
    }

    @api
    refreshTable(){
        this.getData();        
    }

    //Row Action
    viewFileAction(event){
        this.openFile(event.target.value);
    }
    @track boothType;
    @track sponsorshipType;
    @track digitalType;
    @track publishningType;
    @track nonProductType;

    @track isOpenRecordDetail;
    openRecordDetail(event){        
        this.selectedRecordId = event.target.value;
        this.recordName = event.target.dataset.changeRequestName;
        const productType = event.target.dataset.productType;
        if(productType==='Booth'){
            this.boothType=true;
            this.sponsorshipType = undefined;
            this.digitalType = undefined;
            this.publishningType = undefined;
            this.nonProductType = undefined;
        }
        else if(productType==='Sponsorship'){
            this.boothType=undefined;
            this.sponsorshipType = true;
            this.digitalType = undefined;
            this.publishningType = undefined;
            this.nonProductType = undefined;
        }
        else if(productType==='Digital'){
            this.boothType=undefined;
            this.sponsorshipType = undefined;
            this.digitalType = true;
            this.publishningType = undefined;
            this.nonProductType = undefined;
        }
        else if(productType==='Publishing'){
            this.boothType=undefined;
            this.sponsorshipType = undefined;
            this.digitalType = undefined;
            this.publishningType = true;
            this.nonProductType = undefined;
        }
        else if(productType==='Non Product'){
            this.boothType=undefined;
            this.sponsorshipType = undefined;
            this.digitalType = undefined;
            this.publishningType = undefined;
            this.nonProductType = true;
        }
        this.isOpenRecordDetail = true;
    }
    closeRecordDetail(){
        this.isOpenRecordDetail = false;

        this.boothType=undefined;
        this.sponsorshipType = undefined;
        this.digitalType = undefined;
        this.publishningType = undefined;
        this.nonProductType = undefined;
    }

    approvingContract(event){
    }

    @track isOpenAttachment;
    @track attachmentCondition;
    openAttachment(event){
        this.selectedRecordId = event.target.value;
        this.isOpenAttachment = true;
        this.attachmentCondition='ParentId=\''+event.target.value+'\'';
    }

    closeAttachment(){
        this.isOpenAttachment = false;
        this.attachmentCondition='';
    }

    approveRequest(event){
        const requestId = event.target.value;
        this.spinner = true;
        let objList = [{Change_Request_Status__c:"Completed",sobjectType:'Change_Request__c',Id:requestId}]
        
        updateRecords({objList:objList})
        .then(()=>{
            this.spinner = false;            
            showToast(this,'Amend request was approved.','success','Success');
            this.getData();
        })
        .catch(error=>{            
            this.spinner = false;
            handleErrors(this,error);
        })
    }

    @track openRejectModal;
    @track requestName;
    rejectRequest(event){
        this.openRejectModal = true;
        this.requestName = event.target.dataset.requestName;
        this.selectedRecordId = event.target.value;
    }
    hideRejectModal(){
        this.openRejectModal = false;
    }

    yesRejectRequest(event){
        let sscNote = this.template.querySelector('.ssc-note-text').value;
        let objList = [{SSC_Notes__c:sscNote,Change_Request_Status__c:"Rejected",sobjectType:'Change_Request__c',Id:this.selectedRecordId}]
        this.spinner = true;
        updateRecords({objList:objList})
        .then(()=>{
            this.spinner = false;           
            this.selectedRecordId=undefined; 
            showToast(this,'Amend request was rejected','success','Success');
            this.openRejectModal = false;
            this.getData();
        })
        .catch(error=>{            
            this.spinner = false;
            handleErrors(this,error);
        })
    }

}