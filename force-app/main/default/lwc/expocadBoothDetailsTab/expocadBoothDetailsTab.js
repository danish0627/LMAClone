/* eslint-disable no-console */
import { LightningElement,api,track } from 'lwc';
import { exportCSV,groupJSONByValue } from 'c/lWCUtility';

export default class ExpocadBoothDetailsTab extends LightningElement {
    @api mapBoothDetails;
    @track mapBoothDetailsTempVar;
    @api tableColumns;

    @track chartData;
    @track selectedTableRows=[];
    @track selectedRows;
    @track firstActiveClass='selected';
    @track pageList;    
    @track pasesizeVisible;
    @track showPageView;
    @track totalRows;
    @track totalPage;
    @track currentPageNo=1;
    @track offst=0;
    @track hasNext=false;
    @track hasPrev=false;
    @track pagesize=10;

    connectedCallback(){
        this.setData();
    }


    setData(){
        if(this.mapBoothDetails){
            this.chartData=[];
            let self = this;
            const dimensions = groupJSONByValue(this.mapBoothDetails,'Dimensions');
            Object.keys(dimensions).forEach(function(category){
                self.chartData.push({'Name':category+'(COUNT)','expr0':dimensions[category].length});
           }); 

            this.pasesizeVisible = this.pagesize.toString();
            this.totalRows = this.mapBoothDetails.length;
            this.totalPage = Math.ceil(this.totalRows/this.pagesize);

            this.lastind = parseInt(this.offst+this.pagesize,10);
            
            if(this.totalRows<this.lastind){
                this.lastind=this.totalRows;
            }
            this.showPageView = 'Showing: '+parseInt(this.offst+1,10)+'-'+this.lastind;

            this.mapBoothDetailsTempVar=[];
            const startIndex = this.offst;
            let endIndex = startIndex + this.pagesize;
            
            if(endIndex>this.lastind){
                endIndex = this.lastind;
            }

            for(let i=startIndex;i<endIndex;i++){
                this.mapBoothDetailsTempVar.push(this.mapBoothDetails[i]);
            }

            if(this.totalRows===0){                
                this.mapBoothDetailsTempVar=undefined;
                this.pageList = undefined;
            }
            this.highLightNumber(this.currentPageNo);
            this.generatePageListUtil();
        }
    }

    onPageSizeChange(event){
        
        this.offst = 0;
        this.currentPageNo = 1;
        this.hasNext = false;
        this.hasPrev = false;
        this.pagesize = parseInt(event.detail.value,10);
        //this.highLightNumber(1);
        this.setData();
    
    }
    getPrevData(){
        if(this.currentPageNo===1){
            return;
        }
        window.clearTimeout(this.delayTimeout);
        const prevPage = this.currentPageNo-1;
        const offset = (prevPage * this.pagesize)-this.pagesize;
        
        this.offst = offset;
        this.currentPageNo = prevPage;
        this.hasNext = false;
        this.hasPrev = true;
        //this.highLightNumber(prevPage);
        this.setData();    
    }
    getNextData(){
        if(this.lastind>=this.totalRows){
            return;
        }
        
        const nextPage = this.currentPageNo+1;
        const offset = (nextPage * this.pagesize)-this.pagesize;
        
        this.offst = offset;
        this.currentPageNo = nextPage;
        this.hasNext = true;
        this.hasPrev = false;
        //this.highLightNumber(nextPage);
        this.setData();
    
    }
    processMe(event){
        
        let currentPageNumber = this.currentPageNo;
        let selectedPage = parseInt(event.target.name,10);        
        let pagesize = this.pagesize;        
        let next = selectedPage < currentPageNumber?false:true;
        let prev = selectedPage < currentPageNumber?true:false;
        const offset=(selectedPage*pagesize)-pagesize;
        
        
        this.offst = offset;
        this.currentPageNo = selectedPage;
        this.hasNext = next;
        this.hasPrev = prev;
        //this.highLightNumber(selectedPage);
        this.setData();
    
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
    get lastActiveClass(){
        return this.currentPageNo===this.totalPage?'selected':'';
    }
    highLightNumber(pageNumber){ //Util method 1
        //reset 
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
    
    /**
    * description: This method will call once user click on any row checkbox.
    */
    handleRowSelection(event){
        this.selectedRows = event.detail.selectedRows;        
        if(this.selectedRows.length===0){
            this.selectedRows = undefined;
        }
    }

    /**
    * description: This method will fetch the selected record counts.
    */
    get rowsCount(){
        if(this.selectedRows){
            return this.selectedRows.length;
        }
        return 0;
    }

    /**
    * description: This method download the exported file in CSV format.
    */
    downloadCSVFile(){
        let requiredlabels = ['AccountName', 'BoothNumber', 'Dimensions', 'Area', 'DisplayNameOverride', 'IsRented'];
        if(this.selectedRows){
            exportCSV(this.selectedRows,requiredlabels,'GetAllBoothFromExpocad-export');
        } else {
            exportCSV(this.mapBoothDetails,requiredlabels,'GetAllBoothFromExpocad-export');
        }
    }
}