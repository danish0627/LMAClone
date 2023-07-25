/* eslint-disable @lwc/lwc/no-async-operation */
/* eslint-disable no-undef */
/*
Created By	 : Girikon(Mukesh)
Created On	 : July 22, 2019
@description : Table that show event report along with pie chart

Modification log --
Modified By	: 
*/

import { LightningElement,api,wire, track } from 'lwc';

import {loadScript} from 'lightning/platformResourceLoader';
import jquery from '@salesforce/resourceUrl/jquery_core';
import {toast,handleErrors} from 'c/lWCUtility';
import getDatas from '@salesforce/apex/EventAnalyticsCtr.getDatas';
import { NavigationMixin } from 'lightning/navigation';
import Product_Family from '@salesforce/label/c.Product_Family';
import Total_Price from '@salesforce/label/c.Total_Price';
import Amount1 from '@salesforce/label/c.Amount1';

const DELAY=300;
export default class EventAnalytic extends NavigationMixin(LightningElement) {
    //using custom label for multi lang
    @track prodFamly = Product_Family;
    @track tprice = Total_Price;
    @track amount = Amount1;
    
    @track parentTable;

    @track sortType='';
    @track sortDirection='';
    @track searchValue='';
    @track pagesize=10;
    @track offset=0;
    @track hasNext=false;
    @track hasPrev=false;
    @track totalPage;
    @track currentPageNo=1;
    @track sortByFieldName='';
    @track sortByName='';
    @track showPageView;
    @track totalRows;
    @track isMoreThan2000;
    @track lastind;

    @track
    spinner = true;

    @api
    recordId='';
    @track pagesizeVisible;
    toggleDetail(event){
        if(event.target.iconName ==='utility:chevronright'){
            event.target.iconName = "utility:chevrondown";
        }
        else{
            event.target.iconName = "utility:chevronright";
        }    
        const ele = this.template.querySelector("[id^="+event.target.value+"-]");

        window.jQuery(ele).css({width:window.jQuery(ele).parent().width()});
        window.jQuery(ele).find('td').css({width:window.jQuery(ele).parent().width()});
        window.jQuery(ele).slideToggle();
    }

    connectedCallback(){
        this.spinner = true;
        loadScript(this,jquery)
        .then(()=>{
        })
        .catch(error=>{
            toast(this,error,'error','Error');
        })
    }
    @wire(getDatas,{recordId:'$recordId',orderType:'$sortType',pageSize:'$pagesize',off:'$offset',searchValue:'$searchValue',next:'$hasNext',prev:'$hasPrev'})
    wireAnalyticsdata(result){
        if(result.data){
            this.spinner = false;
            let eventSeries = JSON.parse(JSON.stringify(result.data.eventSeriesList));
            let oppList = JSON.parse(JSON.stringify(result.data.oppList));
            let oppProductFamily = JSON.parse(JSON.stringify(result.data.oppProductFamily));
            this.pagesizeVisible = this.pagesize.toString();
            for(let i=0;i<oppList.length;i++){
                oppList[i].childRecord = [];
            }
            
            for(let i=0;i<eventSeries.length;i++){
                if(eventSeries[i].Name === undefined){
                    eventSeries[i].Name='N/A';
                }
                eventSeries[i].subParent = [];
            }
            
            //set child record in sub parent record
            for(let i=0;i<oppList.length;i++){
                for(let j=0;j<oppProductFamily.length;j++){
                    if(oppProductFamily[j].expr0===undefined){
                        oppProductFamily[j].expr0 = 0.0;
                    }

                    if(oppList[i].EventEdition__c === oppProductFamily[j].EventEdition__c && oppProductFamily[j].added===undefined){
                        oppList[i].childRecord.push(oppProductFamily[j]);
                        oppProductFamily[j].added=true;
                    }
                }	
            }


            //set sub parent
            for(let i=0;i<eventSeries.length;i++){
                for(let j=0;j<oppList.length;j++){
                    if(oppList[j].expr0===undefined){
                        oppList[j].expr0 = 0.0;
                    }
                    if(eventSeries[i].Event_Series__c === oppList[j].Event_Series__c && oppList[j].added===undefined){
                        eventSeries[i].subParent.push(oppList[j]);
                        oppList[j].added=true;
                    }
                }	
            }
            if(eventSeries.length>0){
                this.parentTable = eventSeries;
            }
            else{
                this.parentTable = undefined;
            }

            this.totalPage = result.data.total;
            this.hasNext = result.data.hasnext;
            this.hasPrev = result.data.hasprev;            
            this.offset = result.data.offst;

            const totalRows = result.data.total>2000?2000:result.data.total;
            this.totalPage = Math.ceil(totalRows/this.pagesize);
            this.totalRows = totalRows;
            this.isMoreThan2000 = result.data.total>2000?true:false;
            this.lastind = parseInt(result.data.offst+this.pagesize,10);                              
            
            if(result.data.total<this.lastind){
                this.lastind=result.data.total;
            }
            this.showPageView = 'Showing: '+parseInt(result.data.offst+1,10)+'-'+this.lastind;

            if(this.totalRows>0){
                this.generatePageListUtil();
            }
            else{
                this.pageList = undefined;
            }
        }
        else if(result.error){
            handleErrors(this,result.error);
        }
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
            this.offset = offset;
            this.currentPageNo = nextPage;
            this.hasNext = true;
            this.hasPrev = false;
            this.highLightNumber(nextPage);
        },DELAY);
    }

    getPrevData(){  //Table Action 2
        if(this.currentPageNo===1){return;}
        window.clearTimeout(this.delayTimeout);
        const prevPage = this.currentPageNo-1;
        const offset = (prevPage * this.pagesize)-this.pagesize;
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(() => {
            this.offset = offset;
            this.currentPageNo = prevPage;
            this.hasNext = false;
            this.hasPrev = true;
            this.highLightNumber(prevPage);
        },DELAY);
    }
    onPageSizeChange(event){
        window.clearTimeout(this.delayTimeout);
        
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(() => {
            this.offset = 0;
            this.currentPageNo = 1;
            this.hasNext = false;
            this.hasPrev = false;
            this.pagesize = parseInt(event.detail.value,10);
            this.highLightNumber(1);
        },DELAY);
    }
    searchData(){        
        let searchValue = this.template.querySelector(".search-box").value;
        searchValue = searchValue.trim();
        window.clearTimeout(this.delayTimeout);
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(() => {
            this.offset = 0;
            this.currentPageNo = 1;
            this.hasNext = false;
            this.hasPrev = false;   
            this.searchValue = searchValue;
            this.highLightNumber(1);            
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
                this.offset = 0;
                this.currentPageNo = 1;
                this.hasNext = false;
                this.hasPrev = false;   
                this.searchValue = '';                
                this.highLightNumber(1);
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
        
        const ele = event.currentTarget;
        window.jQuery(ele).parent().addClass('slds-has-focus');
        event.currentTarget.querySelector('lightning-icon').iconName = iconName;
        
        this.delayTimeout = setTimeout(()=>{
            this.currentPageNo = 1;
            this.offset = 0;            
            this.hasNext = false;
            this.hasPrev = false;
            this.highLightNumber(1);
        },DELAY);
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
            this.offset = offset;
            this.currentPageNo = selectedPage;
            this.hasNext = next;
            this.hasPrev = prev;
            this.highLightNumber(selectedPage);            
        },DELAY);
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

    gotoEventDetail(event){
         // Navigate to the Event Series Detail Page         
         this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: event.currentTarget.dataset.eventSeriesId,
                actionName: 'view',
            },
        });
    }
}