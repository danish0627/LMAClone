/****
Created By	 : Girikon(Mukesh[STL-4])
Created On	 : ‎July ‎23, ‎2019
@description : Generic Table Component 
                Support pagination,sorting,searching,filter,edit,delete,mass update & delete, open detail modal, 
                open link and date filter features supported in single component

Modification log --
Modified By	: 
*****/

/* eslint-disable no-console */
import {LightningElement,track,api } from 'lwc';
import getDatas from '@salesforce/apex/CommonTableController.getGenericObjectRecord';
import getAggregateData from '@salesforce/apex/CommonTableController.getAggregateData2';
import deleteRecord from '@salesforce/apex/CommonTableController.deleteRecord';
import massUpdateRecords from '@salesforce/apex/CommonTableController.massUpdateRecords';
import getFilePreview from '@salesforce/apex/CommonTableController.getFilePreview';
import stl_table from '@salesforce/resourceUrl/stl_table';

import {loadStyle} from 'lightning/platformResourceLoader';

import LANG from '@salesforce/i18n/lang';
import DIR from '@salesforce/i18n/dir';
import userId from '@salesforce/user/Id';
import {handleErrors, showToast} from 'c/lWCUtility';
import {NavigationMixin} from 'lightning/navigation';
import delete_confirm_message from '@salesforce/label/c.delete_confirm_message';
import delete_confirm_message_2 from '@salesforce/label/c.delete_confirm_message_2';

const DELAY=300;
export default class CommonTable extends NavigationMixin(LightningElement) {
    //Language
    @track lang = LANG;
    @track dir = DIR;
    @track delete_confirm_message = delete_confirm_message;
    @track delete_confirm_message_2 = delete_confirm_message_2;
    //action properties    
    @api isSupportNewRecord;
    @api button1Label;
    @api button2Label;
    @api isHideDeleteAction='false';
    @track isOpenSingleDeleteModal=false;
    @track selectedRecordId;


    //Pagination properties
    @track pagesize=10;
    @track pagesizeToVisible;
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
    @track sortByFieldName='LastModifiedDate';
    @api sortByName='LastModifiedDate';
    @api sortType='desc';

    //Set object and fields to create datatable
    @track tableData;
    @track tableColumn;

    @api objectName='';
    @api objectLabel='';
    @api fields='Id,Name';
    @api fieldsLabel='Id,Name';
    @api condition='Id!=\'\'';
    @track tempCondition='';
    @api profile='';    
    @api isViewFile='false';
    @api isOpenLink;    
    @api openLinkButtonText;
    @api openLinkIcon;
    
    @api isShowAction='false';
    @api showActionButton='false';
    @api hideCheckboxColumn;
    @api hidePerPage;
    @api modalIconName1='Open';
    @api openLinkText='Open Link';
    @api viewFileText='View File';

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

    //Date Filter
    @api dateFilter;
    @api dateFilterLabel;
    @api dateFilterFieldName;

    //Toggle filter
    @api toggleFilterLabel;
    @api toggleFilterCondition;
    @track toggleState=false;

    //Delegate Opportunity filter
    @api filterDelegateOpp;
    @api conditionDelegate;
    @track toggleDelegateOpp=false;

    @track metadataColumns;
    @track error;
    @track firstTime;
    @track spinner;
    @track isShow;
    @track isOpenMassDeleteModal;
    @track selectedRows;
    @track lastind;
    @track isAddedCurrencyCode;
    //applied for multi language    
    @api customLabel;//comma seperated true and false    
    @api isMultiLanguage='false';
    connectedCallback(){
        //loading css file which conains wrap text css
            loadStyle(this,stl_table).then({}).catch(error=>{showToast(this,error,'error','Error')});

        if(LANG==='en-US' && this.isMultiLanguage === 'false'){
            this.isMultiLanguage = 'false';
        }
        if(this.hideCheckboxColumn===true){
            this.hideCheckboxColumn = undefined;
        }
        this.isOpenMassDeleteModal = false;
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
        }
        else{
            this.fields='';
        }
        
        // add currency code
        const objList = ['order','blng__payment__c','blng__creditnote__c','sbqq__subscription__c','sbqq__quoteline__c','contract','opportunity','sbqq__quote__c','sbqq__quotedocument__c'];
        if(objList.indexOf(this.objectName.toLowerCase())>=0 && this.fields.toLowerCase().indexOf('currencyisocode')<0){
            if(this.fields.indexOf(',(')>0){
                this.fields = this.fields.split(',(')[0]+',CurrencyIsoCode'+',('+this.fields.split(',(')[1];
            }
            else{
                this.fields = this.fields+',CurrencyIsoCode';
            }
            this.isAddedCurrencyCode = true;
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
        if(this.filterDelegateOpp!=undefined){
            this.filterDelegateOpp = this.filterDelegateOpp;
        }
        if(this.conditionDelegate!=undefined){
            this.conditionDelegate = this.conditionDelegate;
        }
        this.isShow = this.spinner===false && this.firstTime;
        this.handleFilterChange();
       
    }
    
    getData(){    
        this.spinner = true;
        this.pagesizeToVisible = this.pagesize.toString();
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
            
            this.tableData = data.ltngTabWrap.tableRecord;
            this.tableColumn = data.ltngTabWrap.tableColumn;
            this.setParentFieldColumn(this.tableColumn,this.fields,this.tableData);
        
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
            this.spinner=false;
            this.tableData=undefined;
            this.error = error;
            console.log(error);
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

    /**
     * Fire when use do any operation link row delete,row edit,open link or open modal dialog
     * @param Event object to get current row detail
     */
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
                this.openEditRecordModal(row);
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
            case 'openlink':
                this.openLink(row.Id);
                break;
            case 'openlinkbutton':
                this.dispatchEvent(new CustomEvent('openlinkbutton',{detail:row}));
                break;
            default:
        }
    }
    
    /**
     * This method build json data of related object
     * @param {table data that return by apex action} tbldatas 
     */
    setParentFieldValue(tbldatas){ 
        let datas = JSON.parse(JSON.stringify(tbldatas));

        for(let i=0;i<datas.length;i++){
            
            //build link
            if(datas[i].hasOwnProperty('Name')){
                datas[i].NameLink='/lightning/r/'+this.objectName+'/'+datas[i].Id+'/view';
            }
            if(datas[i].hasOwnProperty('x_Product_Name__c')){
                datas[i].x_Product_Name__cLink='/lightning/r/'+this.objectName+'/'+datas[i].Id+'/view';
            }
            if(datas[i].hasOwnProperty('WorkOrderNumber')){
                datas[i].WorkOrderNumberLink='/lightning/r/'+this.objectName+'/'+datas[i].Id+'/view';
            }
            if(datas[i].hasOwnProperty('LineItemNumber')){
                datas[i].LineItemNumberLink='/lightning/r/'+this.objectName+'/'+datas[i].Id+'/view';
            }
            if(datas[i].hasOwnProperty('ContractNumber')){
                datas[i].ContractNumberLink='/lightning/r/'+this.objectName+'/'+datas[i].Id+'/view';
            }
            if(typeof datas[i] === 'object'){
                // Parent table data
                // eslint-disable-next-line guard-for-in                
                for (let k in datas[i]) {
                    //Build child table data
                    if(Array.isArray(datas[i][k]) && datas[i][k].length>0){
                        datas[i].childData = datas[i][k][0].Booth_Number__c;
                    }

                    if (datas[i].hasOwnProperty(k) && typeof datas[i][k] === 'object'){                        
                        Object.keys(datas[i][k]).forEach(item=>{
                            datas[i][k+'.'+item] = datas[i][k][item];
                            if(item.toLowerCase()==='name'){
                                datas[i][k+'.NameLink']='/lightning/r/'+k+'/'+datas[i][k].Id+'/view';
                            }
                            if(item.toLowerCase()==='contractnumber'){
                                datas[i][k+'.ContractNumberLink']='/lightning/r/'+k+'/'+datas[i][k].Id+'/view';
                            }                            
                            if(item.toLowerCase()==='workordernumber'){
                                datas[i][k+'.WorkOrderNumberLink']='/lightning/r/'+k+'/'+datas[i][k].Id+'/view';
                            }
                            if(item.toLowerCase()==='levelvalue__c'){
                                datas[i][k+'.LevelValue__cLink']='/lightning/r/'+k+'/'+datas[i][k].Id+'/view';
                            }
                            if(item.toLowerCase()==='value__c'){
                                datas[i][k+'.Value__cLink']='/lightning/r/'+k+'/'+datas[i][k].Id+'/view';
                            }                            
                        });

                        //three level data                        
                        for (let j in datas[i][k]) {
                            if (datas[i][k].hasOwnProperty(j) && typeof datas[i][k][j] === 'object'){
                                Object.keys(datas[i][k][j]).forEach(item=>{                                    
                                    if(typeof datas[i][k][j][item] !== 'object'){
                                        datas[i][k+'.'+j+'.'+item] = datas[i][k][j][item];
                                        if(item.toLowerCase()==='name'){
                                            datas[i][k+'.'+j+'.'+item+'Link'] = '/lightning/r/'+j+'/'+datas[i][k][j].Id+'/view';
                                        }
                                    }
                                    else{
                                        Object.keys(datas[i][k][j][item]).forEach(item2=>{
                                            datas[i][k+'.'+j+'.'+item+'.'+item2] = datas[i][k][j][item][item2];
                                            if(item2.toLowerCase()==='name'){
                                                datas[i][k+'.'+j+'.'+item+'.'+item2+'Link'] = '/lightning/r/'+item+'/'+datas[i][k][j][item].Id+'/view';
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

    /**
     * Set Table column and apply sorting on column, build link if required, apply action column
     *
     * @param {Column object return by apex ation } columnObj 
     * @param {This is actuly comma seperated fields api name} columnList 
     * @param {Data return by apex action} datas 
     */
    setParentFieldColumn(columnObj,columnList,datas){
        columnObj = JSON.parse(JSON.stringify(columnObj));
        columnList = JSON.parse(JSON.stringify(columnList));
        let fieldsAndInnerQuery = columnList.split(',(');

        if(columnList.indexOf('.')>0){            
            let col = fieldsAndInnerQuery[0].split(',');
            if(this.isMultiLanguage==='false'){
                
                for(let i=0;i<col.length;i++){                
                    let test = col[i].split('.');
                    let label = this.fieldsLabel.split(',')[i];                
                    if(col[i].indexOf('.')>0 && (test.length===2||test.length===3||test.length===4)){
                        columnObj.splice(i,1);
                        columnObj.splice(i,0,{fieldName: col[i],label:label});
                    }
                    else {
                        columnObj[i].label = label;
                    }
                }
            }
            else{
                this.customLabel = ','+this.customLabel+',';
                for(let i=0;i<col.length;i++){                
                    let test = col[i].split('.');
                    let label = this.fieldsLabel.split(',')[i];                
                    if(this.customLabel.indexOf(','+i+',')>=0){                        
                        if(col[i].indexOf('.')>0 && (test.length===2||test.length===3||test.length===4)){
                            columnObj.splice(i,1);
                            columnObj.splice(i,0,{fieldName: col[i],label:label});
                        }
                        else {
                            columnObj[i].label = label;
                        }
                    }
                }
            }
        }
        if(this.isViewFile==='true'){
            columnObj.splice(0, 0, 
                {
                    type: "button-icon",
                    initialWidth: 34,
                    typeAttributes: {
                        iconName: 'doctype:attachment',
                        name: 'viewfile',
                        title: this.viewFileText,
                        variant:'bare',
                        disabled: false,
                        value: {fieldName: 'ContentDocumentId'}
                    }
                }
            );
        }
        if(this.isOpenLink){
            let isOpenLinkIcon = this.openLinkIcon?this.openLinkIcon:'utility:forward_up';
            columnObj.splice(0, 0, 
                {
                    type: "button-icon",  
                    initialWidth: 34,                  
                    typeAttributes: {
                        iconName: isOpenLinkIcon,
                        name: 'openlink',
                        title: this.openLinkText,
                        variant:'bare',
                        disabled: false,
                        value: {fieldName: 'Id'}
                    }
                }
            );
        }
        if(this.openLinkButtonText){            
            columnObj.splice(0, 0, 
                {
                    type: "button",  
                    label: 'Send Invoice by Email',
                    initialWidth:180,
                    typeAttributes: {                        
                        name: 'openlinkbutton',                        
                        label: this.openLinkButtonText,
                        variant:'base',
                        disabled: false,
                        value: {fieldName: 'Id'}
                    }
                }
            );
        }
        if(this.showActionButton==='true'){
            columnObj.splice(0, 0, 
                {
                    type: "button-icon",  
                    initialWidth: 34,                  
                    typeAttributes: {
                        iconName: 'utility:new_window',                        
                        name: 'openactionmodal',
                        title: this.modalIconName1,
                        variant:'bare',
                        disabled: false,
                        value: {fieldName: 'Id'}
                    }
                }
            );
        }
        
        for(let i=0;i<columnObj.length;i++){

            //format date field
            if(columnObj[i].type==='textarea' || columnObj[i].type==='button' || columnObj[i].type==='button-icon' || columnObj[i].type==='multipicklist'){
                columnObj[i].sortable=false;
            }
            else{
                columnObj[i].sortable=true;
            }
            
            if(columnObj[i].type==='datetime'){
                columnObj[i].type='date';
                columnObj[i].typeAttributes= {day: 'numeric',month: 'numeric',year: 'numeric',hour: '2-digit',minute: '2-digit'}
            }
            //format date field
            if(columnObj[i].type==='date'){                
                columnObj[i].typeAttributes= {
                    day: 'numeric',
                    month: 'numeric',
                    year: 'numeric'
                }
            }
            if(columnObj[i].fieldName!==undefined && columnObj[i].fieldName.toLowerCase()==='transaction_date__c'){
                columnObj[i].type='date';
                columnObj[i].typeAttributes= {day: 'numeric',month: 'numeric',year: 'numeric',hour: '2-digit',minute: '2-digit'}
            }
            if(columnObj[i].type==='double'){
                columnObj[i].type='number';
                columnObj[i].cellAttributes = { alignment: 'left' };
            }
            if(columnObj[i].type==='currency'){
                columnObj[i].type='text';
                          
                columnObj[i].cellAttributes = { alignment: 'left' };
            }
            if(columnObj[i].fieldName!==undefined && 
                (columnObj[i].fieldName.toLowerCase().indexOf('name')>=0 || columnObj[i].fieldName.toLowerCase() === 'workordernumber' || (columnObj[i].fieldName.toLowerCase().indexOf('value__c')>=0  && this.objectName !== 'Communication_Directory__c')|| columnObj[i].fieldName.toLowerCase().indexOf('levelvalue__c')>=0
                 || columnObj[i].fieldName.toLowerCase() === 'lineitemnumber'  || columnObj[i].fieldName.toLowerCase() === 'workorder.workordernumber'|| columnObj[i].fieldName.toLowerCase().indexOf('contractnumber')>=0 )){
                
                if(columnObj[i].fieldName.toLowerCase()!=='stagename' && columnObj[i].fieldName.toLowerCase()!=='group_name__c' && columnObj[i].fieldName.toLowerCase()!=='workorder.work_order_name__c'
                && columnObj[i].fieldName.toLowerCase()!=='work_order_name__c' && columnObj[i].fieldName.toLowerCase()!=='task_name__c' && columnObj[i].fieldName.toLowerCase()!=='sbqq__productname__c'
                && columnObj[i].fieldName.toLowerCase()!=='display_name__c' && columnObj[i].fieldName.toLowerCase()!=='account_name__c' && columnObj[i].fieldName.toLowerCase()!=='asigneename__c' && columnObj[i].fieldName.toLowerCase()!=='online_booth_capture_name__c'
                && columnObj[i].fieldName.toLowerCase()!=='event_edition_name__c' && columnObj[i].fieldName.toLowerCase()!=='blng__relatedinvoice__r.event_edition_name__c' && columnObj[i].fieldName.toLowerCase()!=='company_name__c' 
                && columnObj[i].fieldName.toLowerCase()!=='first_name__c' && columnObj[i].fieldName.toLowerCase()!=='last_name__c' && columnObj[i].fieldName.toLowerCase()!=='state_name__c' && columnObj[i].fieldName.toLowerCase()!=='country_name__c'){
                    columnObj[i].type='url';
                    columnObj[i].typeAttributes = {label: {fieldName:columnObj[i].fieldName},tooltip:'Open in new tab', target: '_blank'};
                    columnObj[i].fieldName=columnObj[i].fieldName+'Link';
                }
            }
        }
        if(this.isAddedCurrencyCode){
            columnObj.pop();
        }
        if(fieldsAndInnerQuery.length===2){
            columnObj.push({label:'Booth Number',fieldName:'childData',type:'text'});
        }
        if(this.isShowAction==='true'){
            let actions = [
                { label: 'Edit',title: 'Click to Edit', name: 'edit',iconName: 'utility:edit'}
            ];
            
            if(this.isHideDeleteAction!=='true'){    
                actions.push({ label: 'Delete',title: 'Click to Delete', name: 'delete',iconName: 'utility:delete'});
            }
            columnObj.push({label: '', type: 'action', initialWidth: 100, typeAttributes: { rowActions: actions }});
            
        }
        this.tableColumn = columnObj;
        this.setParentFieldValue(datas)
    }

    // Table pagination, sorting and page size change actions Start
    /**
     * Get next page data if available
     */
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
    /**
     * Get previous page data
     */
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
    /**
     * Fire when user change page size drop down
     * @param {Event Object to get which option is selected} event 
     */
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
    /**
     * Fire when user click on table header to sort by column
     * @param {Event Object to get which column click to sort} event 
     */    
    handleSorting(event){
        window.clearInterval(this.delayTimeout);
        const sortField = event.detail.fieldName;
        const sortDir = event.detail.sortDirection;
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(()=>{
           let sortFieldName = sortField;
           this.sortByFieldName = sortField;
           
            if(sortFieldName.toLowerCase().indexOf('namelink')>=0 || sortFieldName.toLowerCase().indexOf('name__clink')>=0){
                const n = sortFieldName.lastIndexOf('Link');
                sortFieldName = sortFieldName.slice(0, n) + sortFieldName.slice(n).replace('Link', '').trim();
            }
            if(sortFieldName.toLowerCase().indexOf('workordernumberlink')>=0 || sortFieldName.toLowerCase().indexOf('lineitemnumberlink')>=0){
                const n = sortFieldName.lastIndexOf('Link');
                sortFieldName = sortFieldName.slice(0, n) + sortFieldName.slice(n).replace('Link', '').trim();
            }
            if(sortFieldName.toLowerCase().indexOf('levelvalue__clink')>=0){
                const n = sortFieldName.lastIndexOf('Link');
                sortFieldName = sortFieldName.slice(0, n) + sortFieldName.slice(n).replace('Link', '').trim();
            }
            if(sortFieldName.toLowerCase().indexOf('value__clink')>=0){
                const n = sortFieldName.lastIndexOf('Link');
                sortFieldName = sortFieldName.slice(0, n) + sortFieldName.slice(n).replace('Link', '').trim();
            }
            if(sortFieldName.toLowerCase().indexOf('contractnumberlink')>=0){
                const n = sortFieldName.lastIndexOf('Link');
                sortFieldName = sortFieldName.slice(0, n) + sortFieldName.slice(n).replace('Link', '').trim();
            }
            this.currentPageNo = 1;
            this.offst = 0;            
            this.hasNext = false;
            this.hasPrev = false;
            
            this.highLightNumber(1);

            this.sortType = sortDir;
            this.sortByName = sortFieldName;
            this.getData();
        },DELAY);
    }
    /**
     * fire when user click on page number
     * @param event Event Object to get which number clicked
     */
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

    /**
     * Add selected class on page number
     * @param pageNumber current page number to highlight
     */    
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
    /**
     * Generate page list like 1..2 3 4 ...5
     */
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
    
    // Table pagination, sorting and page size change actions END

    

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
     * Called apex action to get aggregate data to set filter options
     * @param filterNum pass which filter number there are three filter but you have to pass filter number
     * @param fieldName field api name name 
     */    
    setFilterOptions(filterNum,fieldName){
        getAggregateData({condition:this.condition,objectName:this.objectName,fieldName:fieldName})
        .then(result=>{
            let f = fieldName.split('.');
            if(f.length === 1){
                f = fieldName;
            }
            else if(f.length === 2){
                f = f[1];
            }
            else if(f.length === 3){
                f = f[2];
            }
            else if (f.length === 4) {
                f = f[3];
            }
            else if (f.length === 5) {
                f = f[4];
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

    /**
     * Used to build condition of all three filters value and fields
     */
    buildCondition(){
        let condition;
        if (this.toggleDelegateOpp){
            condition = this.conditionDelegate;
        }
        else{
            condition = this.condition;
        }
        

        //Only for Owner filter
        if(this.isFilterByOwner){
            this.selectedOwner = this.template.querySelector(".ownerfilter")?this.template.querySelector(".ownerfilter").value:'';
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
    
    /**
     * This method called from handleRowAction method to open attachment file in new tab
     * @param Parent ID of Attachment Object
     */
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
    openNewRecordModal2(){
        this.dispatchEvent(new CustomEvent('openformlink',{detail:''}));
    }
    openEditRecordModal(record){
        this.dispatchEvent(new CustomEvent('openeditmodal',{detail:record.Id}));
        this.dispatchEvent(new CustomEvent('recordedit',{detail:record}));
    }
    openActionModal(recordId){
        this.dispatchEvent(new CustomEvent('openactionmodal',{detail:recordId}));
    }
    openLink(recordId){        
        this.dispatchEvent(new CustomEvent('openlink',{detail:recordId}));
    }
    // this metod called after insert/update/delete operation from parent component 
    @api
    refreshTable(){
        if(this.filterField1!==undefined){
            this.setFilterOptions(1,this.filterField1);
        }
        if(this.filterField2!==undefined){
            this.setFilterOptions(2,this.filterField2);
        }
        if(this.filterField3!==undefined){            
            this.setFilterOptions(3,this.filterField3);
        }
        this.getData();        
    }

    // Fire whenever user select row and assing selected rows to a property
    handleRowSelection(event){
        this.selectedRows = event.detail.selectedRows;        
        if(this.selectedRows.length===0){
            this.selectedRows = undefined;
        }
    }

    //get MASS Action picklist options
    get bulkActionList(){
        return [
            {
                label:'--Mass Actions--', value:''
            },
            {
                label:'Mass Update', value:'mass_update'
            },
            {
                label:'Mass Delete', value:'mass_delete'
            }
        ];
    }

    //fire if chnaging mass action picklist like mass update and mass delete
    onChangeMassAction(event){
        let selectedValue = event.detail.value;
        if(selectedValue==='mass_update'){
            this.openMassUpdateForm();        
        }
        else if(selectedValue==='mass_delete'){
            this.isOpenMassDeleteModal = true;
        }
        else{            
            this.isOpenMassDeleteModal = false;
        }
    }

    // create custom event and fire to open mass update form
    openMassUpdateForm(){
        this.dispatchEvent(new CustomEvent('openmassupdate',{detail:this.selectedRows}));
    }

    //This method called from parent component that called common-table component
    //get all fields and fields value in object{} and update all selected rows
    @track showMassUpdateConfirmationBar;
    @track fieldValues;
    @track selectedTableRows;
    @api
    massUpdateHandler(fieldValues){
        this.fieldValues = fieldValues;
        this.showMassUpdateConfirmationBar = true;
        let tableData = JSON.parse(JSON.stringify(this.tableData));
        tableData.forEach(item=>{
            this.selectedRows.forEach(item2=>{
                if(item.Id===item2.Id){
                    Object.keys(this.fieldValues).forEach(item3=>{
                        item[item3] = this.fieldValues[item3];
                    });
                }
            });
        });
        this.tableData = tableData;
        JSON.parse(JSON.stringify(this.tableData));
    }

    /**
     * This method fire when user click Yes Update All button on confirmation screen and used to update all selected rows of table.
     */
    yesUpdateAll(){
        let records = [];
        const record = this.fieldValues;
        
        this.selectedRows.forEach(item=>{
            const recordToUpdate = record;
            recordToUpdate.Id = item.Id;
            recordToUpdate.sobjectType = this.objectName;            
            records.push(JSON.parse(JSON.stringify(recordToUpdate)));
        });
        
        this.spinner = true;
        massUpdateRecords({objList:records})
        .then(res=>{
            this.spinner = false;
            this.selectedRows = undefined;
            this.selectedRecordId = '';
            this.isOpenMassDeleteModal = false;
            this.isOpenSingleDeleteModal = false;
            this.selectedTableRows = [];
            this.showMassUpdateConfirmationBar = false;
            if(res>0){
                showToast(this,'All selected records was updated.','success','Success');
            }
            this.refreshTable();
        })
        .catch(error=>{
            handleErrors(this,error);
        })
    }

    /**
     * Fire where user click Cancle button of mass update confirmation
     */
    @api
    noCancelAll(){
        this.showMassUpdateConfirmationBar = false;
        this.selectedRows = undefined;
        this.selectedTableRows = [];
        this.refreshTable();
    }

    /**
     * Fire where user click No button of delete confirmation modal
     */
    noDelete(){
        this.selectedRecordId = '';
        this.selectedRows = undefined;
        this.isOpenMassDeleteModal = false;
        this.isOpenSingleDeleteModal = false;    
        this.selectedTableRows = [];    
    }
    /**
     * This method used to delete single record from table
     */
    yesDeleteSingleRecord() {
        var records = [];        
        records.push({Id:this.selectedRecordId,sobjectType:this.objectName});
        this.spinner = true;
        deleteRecord({objList:records})
        .then(res=>{
            this.spinner = false;
            this.selectedRecordId = '';
            this.isOpenSingleDeleteModal = false;
            this.selectedTableRows = [];
            if(res>0){
                showToast(this,'Record Deleted','success','Success');
            }            
            this.refreshTable();
        })
        .catch(error=>{
            handleErrors(this,error);
        })
    }
    /**
     * This method fire when user click confirm button and used to delete all selected rows from table.
     */
    yesDeleteAll() {
        var records = [];        
        this.selectedRows.forEach(item=>{
            records.push({Id:item.Id,sobjectType:this.objectName});
        });
        this.spinner = true;
        deleteRecord({objList:records})
        .then(res=>{
            this.spinner = false;
            this.selectedRows = undefined;
            this.selectedRecordId = '';
            this.isOpenMassDeleteModal = false;
            this.isOpenSingleDeleteModal = false;
            this.selectedTableRows = [];
            if(res>0){
                showToast(this,'All selected records was deleted.','success','Success');
            }            
            this.refreshTable();
        })
        .catch(error=>{
            handleErrors(this,error);
        })
    }

    /**
     * This action fire when apply button filter on table. this method get condition of button filter and append in current condition
     */
    handleToggleButtonClick(){
        this.toggleState = !this.toggleState;
        let condition = this.buildCondition();
        if(this.toggleState){
            condition = condition +' AND '+this.toggleFilterCondition;
        }
        
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

    /**
     * This action fire when apply Delegate opportunity filter on table. this method get condition of Delegate opportunity filter and append in current condition
     */
    
     handleDelegateOppButtonClick(event){     
        this.toggleDelegateOpp = event.target.checked; 
        let condition = this.buildCondition();
        if(this.toggleDelegateOpp){
            condition = this.conditionDelegate;
        }
        else{
            condition = this.condition;
        }
        
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

    //Open Date filter
    openDateFilter(){
        this.template.querySelector(".slds-popover").classList.remove('slds-hide');
    }

    //close
    closeDateFilter(){
        this.template.querySelector(".slds-popover").classList.add('slds-hide');
    }
    
    clearDateFilterAction(){
        this.template.querySelector(".startdate").value = '';
        this.template.querySelector(".enddate").value = '';
    }
    handleDateFieldChange(){
        const startDate = this.template.querySelector(".startdate").value;
        const endDate = this.template.querySelector(".enddate").value;
        if(startDate!=='' || endDate!==''){
            this.isShowClear = true;
        }
        else{
            this.isShowClear = false;
        }
    }

    @track isShowClear;
    @track clearDateFilter;
    @track dateFilterApplied;
    @track labelOnHover=' All Time ';
    applyDateFilter(){
        this.closeDateFilter();
        const startDate = this.template.querySelector(".startdate").value;
        const endDate = this.template.querySelector(".enddate").value;
        if(this.dateFilterFieldName){
            let condition = this.buildCondition();
            if(startDate && endDate){
                this.dateFilterApplied = false;
                condition = condition +' AND ('+this.dateFilterFieldName+'>='+startDate+' AND '+this.dateFilterFieldName+'<='+endDate+')';
                this.template.querySelector(".date-filter-box").setAttribute("style","position: absolute;display: inline-block;margin-left: -188px;top: 1px;");
                this.template.querySelector(".slds-popover").setAttribute("style","top: 48px;position: absolute;margin-left: -188px;");
                this.clearDateFilter = startDate+' - '+endDate;
                this.labelOnHover = this.clearDateFilter;                
            }
            else{
                this.dateFilterApplied = false;
                this.clearDateFilter =' All Time';
                this.labelOnHover = this.clearDateFilter;
                this.template.querySelector(".slds-popover").setAttribute("style","top: 48px;position: absolute;margin-left: -114px;");
            }

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
    }
}