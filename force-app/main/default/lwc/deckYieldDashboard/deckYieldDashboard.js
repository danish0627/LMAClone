/* eslint-disable no-alert */
/* eslint-disable no-console */
import {LightningElement,track,api } from 'lwc';
import getDatas from '@salesforce/apex/CommonTableController.getAgreegatedObjectRecord';
import getAggregateData from '@salesforce/apex/CommonTableController.getAggregateData';
import {loadScript} from 'lightning/platformResourceLoader';
import jquery from '@salesforce/resourceUrl/jquery_core';
import userId from '@salesforce/user/Id';
import {handleErrors, showToast} from 'c/lWCUtility';
const DELAY=300;

//custom label
import Product_Name1 from '@salesforce/label/c.Product_Name1';

export default class DeckYieldDashboard extends LightningElement {
    //action properties
    @api isSupportNewRecord='false';
    @track isOpenSingleDeleteModal=false;
    @track selectedRecordId;
    @track PRODUCTNAME = Product_Name1;

    //Pagination properties
    @track pagesize=10;
    @track currentPageNo=1;
    @track totalPages=0;    
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
    @api objectName='SBQQ__QuoteLine__c';
    @api objectLabel='Quote Line';    
    @api fields='SBQQ__Product__r.Name,SBQQ__Product__r.Event_Product_Type__c,SBQQ__NetTotal__c,SBQQ__Quantity__c';
    @api fieldsLabel='Product Name,Event Product Type,Total Amount Sold,Total Rented Area';
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
    @track pasesizeVisible;
    @api recordId;
    @track yield;

    connectedCallback(){
        this.selectedOwner = userId;
        //Load jquery
        loadScript(this,jquery)
        .then({})
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
        } else{
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
        this.pasesizeVisible = this.pagesize.toString();
        getDatas({searchValue:this.searchValue,eventId:this.recordId,pagesize:this.pagesize,
        next:this.hasNext,prev:this.hasPrev,off:this.offst})
        .then(data=>{ 
            if(this.offst === -1){
                this.offst = 0;
            }
            this.firstTime = false;
            this.spinner = false;
            this.isShow = this.spinner===false && this.firstTime;
            const totalRows = data.total>2000?2000:data.total;
            this.tableColumn = data.ltngTabWrap.tableColumn;   
            data.ltngTabWrap.tableRecord.forEach(item=>{
                item.expr0 = item.expr0!==undefined?item.expr0:0;

                if(item.expr0!==undefined && (item.expr1!==undefined && item.expr1!==0)){
                    item.yield = item.expr0/item.expr1;
                } else {
                    item.yield = 0;                    
                }
            });
            this.tableData = data.ltngTabWrap.tableRecord;
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
            } else{
                this.error = undefined;
            }
        })
        .catch(error=>{
            //alert('this.error: '+this.error);
            this.tableData=undefined;
            this.error = error;
            handleErrors(this,error);
        });      
    }
    
    handleFilterChange(){
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

    getNextData(){
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

    getPrevData(){
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
        } else if(sortFieldName===prevSortedBy && prevSortDir==='desc'){
            this.sortDirection = 'asc';
            this.sortType = 'asc';
            iconName = 'utility:arrowup';
        } else if(sortFieldName!==prevSortedBy){
            this.sortDirection = 'asc';
            this.sortType = 'asc';
            iconName = 'utility:arrowup';
        }
        
        window.clearTimeout(this.delayTimeout);
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

    processMe(event){
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

    highLightNumber(pageNumber){
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
        } catch(e){
            console.error(e);
        }
    }

    generatePageListUtil(){  
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

    /**
     * Description: This is used to build to set filter options.
     */
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
                }else{
                    opt.push({label:obj[i][f]+' ('+obj[i].expr0+')',value:obj[i][f],isChecked:false});
                }
            }
            if(filterNum === 1){
                opt.splice(0,0,{label:'All '+this.filter1Label,value:'',isChecked:true});
                this.filterField1Options = opt;    
            } else if(filterNum === 2){
                opt.splice(0,0,{label:'All '+this.filter2Label,value:'',isChecked:true});
                this.filterField2Options = opt;    
            } else if(filterNum === 3){
                opt.splice(0,0,{label:'All '+this.filter3Label,value:'',isChecked:true});
                this.filterField3Options = opt;    
            }
        })
        .catch(error=>{
            console.error(error);
            handleErrors(this,error);
        });
    }

    /**
     * Description: This is used to build the dynamic condition.
     */
    buildCondition(){
        let condition = this.condition;
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
        if(selectedValue1!=='' && selectedValue2!=='' && selectedValue3!==''){            
            customCond = customCond + ' AND ('+this.filterField1+' IN (\''+selectedValue1+'\') ';
            customCond = customCond + ' AND '+this.filterField2+' IN (\''+selectedValue2+'\') ';
            customCond = customCond + ' AND '+this.filterField3+' IN (\''+selectedValue3+'\')) ';
        } else if(selectedValue1!=='' && selectedValue2!=='' && selectedValue3===''){
            customCond = customCond + ' AND ('+this.filterField1+' IN (\''+selectedValue1+'\') ';
            customCond = customCond + ' AND '+this.filterField2+' IN (\''+selectedValue2+'\')) ';
        } else if(selectedValue1!=='' && selectedValue2==='' && selectedValue3!==''){
            customCond = customCond + ' AND ('+this.filterField1+' IN (\''+selectedValue1+'\') ';
            customCond = customCond + ' AND '+this.filterField3+' IN (\''+selectedValue3+'\')) ';
        } else if(selectedValue1==='' && selectedValue2!=='' && selectedValue3!==''){
            customCond = customCond + ' AND ('+this.filterField2+' IN (\''+selectedValue2+'\') ';
            customCond = customCond + ' AND '+this.filterField3+' IN (\''+selectedValue3+'\')) ';
        } else if(selectedValue1!==''){
            customCond = customCond + ' AND ('+this.filterField1+' IN (\''+selectedValue1+'\')) ';
        } else if(selectedValue2!==''){
            customCond = customCond + ' AND ('+this.filterField2+' IN (\''+selectedValue2+'\')) ';
        } else if(selectedValue3!==''){
            customCond = customCond + ' AND ('+this.filterField3+' IN (\''+selectedValue3+'\')) ';
        }
        customCond = customCond.replace(/NULL/g,'');
        return condition+customCond;
    }

    get isTrue(){
        return this.spinner && !this.firstTime;        
    }

    /**
     * description: This is used to refresh the table.
     */
    @api
    refreshCurrentTable(){
        this.getData();
    }
}