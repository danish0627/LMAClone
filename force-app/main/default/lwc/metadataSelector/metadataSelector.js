import { api, LightningElement, track } from 'lwc';
import getMetadataTypes from '@salesforce/apex/MetadataSelectController.getMetadataTypes';
import listMetadataItems from '@salesforce/apex/MetadataSelectController.listMetadataItems';
import getPackageDetail from '@salesforce/apex/CreatePackageController.getPackageDetail';
import updatePackage from '@salesforce/apex/MetadataSelectController.updatePackage';
import checkAsyncRequest from '@salesforce/apex/MetadataSelectController.checkAsyncRequest';
import LightningAlert from 'lightning/alert';
import LightningConfirm from 'lightning/confirm';

// import myLib from '@salesforce/resourceUrl/JS_Lib';
// import {loadScript } from 'lightning/platformResourceLoader';

import {handleErrors,showToast} from 'c/rmaUtils';

export default class MetadataSelector extends LightningElement {
    
    @api packageId;
    @api orgId;//source org id
    @track packageObj;
    @track metadataTypeSearchBox='';
    @track selectedMetadataTypes = [];
    @track allMetadataTypes = [];
    filteredMetadataTypes = [];    

    @track className;
    @track spinner;

    @track allMetadataItems=[]; // property that hold all metadata that was search/filter 
    allMetadataItemsWithoutFilter=[]; // property that hold all metadata

    @track selectedMetadataItems=[];
    @track selectedRows=[]; //property to store selected row which is auto refresh by datatable
    allSelectedRows = [];//property to store selected row that refresh only on munual select/de-select.

    //Table column, pagination,sorting properties
    tableColumns = [
        { label: 'Name', fieldName: 'fullName',sortable: true},
        { label: 'Type', fieldName: 'metadataType',sortable: true,fixedWidth:200},
        { label: 'Created By', fieldName: 'createdByName',sortable: true,fixedWidth:160 },
        { label: 'Created Date', fieldName: 'createdDate', type:'date',sortable: true,fixedWidth:130 },
        { label: 'Last Modified By', fieldName: 'lastModifiedByName',sortable: true,fixedWidth:160 },
        { label: 'Last Modified Date', fieldName: 'lastModifiedDate',type:'date',sortable: true,fixedWidth:130 }
    ];
    @track defaultSortDirection='desc';
    @track sortedBy='lastModifiedDate';
    @track sortDirection='desc';

    //pagination property    
    @track totalPages;
    @track pageSize = '50';
    @track currentPage = 0;    
    @track isShowPagination;
    @track paginationText = '';
    @track filteredItems = [];
    @track isPrevBtnDisabled = true;
    @track isNextBtnDisabled;
    
    connectedCallback(){
        if(this.packageId){
            this.getPackageById();
        }
        /*Promise.all([
            loadScript(this, myLib + '/jszipmin.js'),
            loadStyle(this, myLib + '/fileSaverJs.js')
        ])
        .then(() => {
            console.log('JS Lib loaded');
        })
        .catch(error => {
            showToast(this,error.message,'error','JS Load error');
        });*/

        /*
        let newZip = new JSZip()
        newZip.loadAsync(result, { base64: true })
        .then(zip => {
            Object.keys(zip.files).forEach((filename) => {                  
                zip.files[filename].async('uint8array').then((fileData) => {
                    // I get needed file. fileData is Uint8Array
                    this.passFileToApex(fileData, filename)
                })                  
            })
        })
        .catch(error => {
            handleErrors(this,error);                
        })
        */
          
    };

    getPackageById(){
        this.spinner = true;
        getPackageDetail({id:this.packageId})
        .then(res=>{
            this.packageObj = JSON.parse(JSON.stringify(res));
            this.getAllMetadataTypes();
            //let selectedMetadataTypes = 
        })
        .catch(error=>{
            handleErrors(this,error);
        })
    };
    metadataTypeToRemove = ["AIApplication",
        "ActionLinkGroupTemplate",
        "AIApplicationConfig",
        "AnalyticSnapshot",
        "AppointmentAssignmentPolicy",
        "AppointmentSchedulingPolicy",
        "CallCenter",
        "ChatterExtension",
        "CustomHelpMenuSection",
        "CallCoachingMediaProvider",
        "CanvasMetadata",
        "EclairGeoData",
        "InboundNetworkConnection",
        "InstalledPackage",
        "LiveChatSensitiveDataRule",
        "PaymentGatewayProvider",
        "ManagedContentType",
        "MilestoneType",
        "MLDataDefinition",
        "MLPredictionDefinition",
        "MLRecommendationDefinition",
        "MyDomainDiscoverableLogin",
        "PlatformCachePartition",
        "PlatformEventChannel",
        "PlatformEventChannelMember",
        "PlatformEventSubscriberConfig",
        "RecommendationStrategy",
        "Settings"
    ];

    getAllMetadataTypes(){
        this.spinner = true;
        getMetadataTypes({orgId:this.packageObj.GKNRMA__Source_SFDC_Org__c})
        .then(res=>{
            let opt = [];
            res.forEach(item=>{
                if(this.metadataTypeToRemove.indexOf(item)<0){
                    opt.push({label:item,value:item});
                }
            });
            this.allMetadataTypes = opt;
            let metdataTypes = [];
            let selectedItems = [];
            //console.log(this.packageObj.GKNRMA__Constructive_Data_Map__c);
            let savedMetadata = [];
            if(this.packageObj.GKNRMA__Constructive_Data_Map__c){
                savedMetadata = JSON.parse(this.packageObj.GKNRMA__Constructive_Data_Map__c);
            }
            savedMetadata.forEach(i=>{                
                for (const [key, value] of Object.entries(i)) {
                    metdataTypes.push(key);                    
                    selectedItems = selectedItems.concat((key+'-'+(i[key].join(','+key+'-'))).split(','));
                }
            });            
            this.selectedMetadataTypes = metdataTypes;
            this.allSelectedRows = selectedItems;
            //console.log(JSON.stringify(selectedItems));
            selectedItems = [];
            metdataTypes = [];
            opt = [];
            savedMetadata = [];
            if(this.selectedMetadataTypes.length>0){
                this.retrieveMetadata();
            }
        })
        .catch(error=>{            
            handleErrors(this,error);
        })
        .finally(()=>{
            this.spinner = false;
        })
    };
    
    retrieveMetadata(){
        //Error: IO Exception: Read timed out
        const types = this.selectedMetadataTypes.toString();
        if(this.selectedMetadataTypes.length>0){
            this.spinner = true;
            listMetadataItems({metadataType:types,orgId:this.packageObj.GKNRMA__Source_SFDC_Org__c})
            .then(res=>{                
                let data = JSON.parse(JSON.stringify(res));                
                // set unique row Id, because two row may have same component name of two different metadata types. 
                let savedMetadataItems = [];
                let idset = [];
                let temp = [];
                data.forEach(i=>{                    
                    i.Id = i.metadataType+'-'+i.fullName;
                    if(idset.indexOf(i.Id)<0){
                        temp.push(i);
                        idset.push(i.Id);
                        if(this.allSelectedRows.indexOf(i.Id)>=0){
                            savedMetadataItems.push(i);
                        }
                    }
                });
                this.selectedMetadataItems = savedMetadataItems;
                this.allMetadataItems = temp;
                this.allMetadataItemsWithoutFilter = temp;
                data = [];//release memory by reset
                temp = [];
                savedMetadataItems = [];
                this.spinner = false;
                this.calculatePages();
            })
            .catch(error=>{
                if(error.includes('Read timed out')){
                    this.retrieveMetadata();
                }
                handleErrors(this,error);
            });
        }
        else{
            LightningAlert.open({
                message: 'Please select atleast one metadata type.',
                theme: 'warning',
                label: 'Alert!',
            });     
        }
    };
    
    async addSelectedMetadataToPackage(){
        try{
            let data = new Map();
            this.selectedMetadataItems.forEach(item=>{                       
                if(!data.has(item.metadataType)){
                    data.set(item.metadataType,[item.fullName]);
                }
                else{
                    data.get(item.metadataType).push(item.fullName);
                }
            });
            let buildData = [];
            data.forEach((value,key)=>{
                buildData.push('{"'+key+'":'+JSON.stringify(value)+'}');
            });
            buildData = buildData.join(',');            
            if(this.selectedMetadataItems.length>0){
                const result = await LightningConfirm.open({
                    message: 'Are you sure to add selected components to package?',
                    variant: 'header',
                    theme:'success',
                    label: 'Confirmation ',
                    // setting theme would have no effect
                });
                if(result){
                    this.spinner = true;
                    updatePackage({metadataItemMap:'['+buildData+']',packageId:this.packageId})
                    .then(syncId=>{
                        if(syncId!=''){
                            showToast(this,'Metadata items was added to package, retrieving package content...','success','Success');
                            this.retrievePackageContentBySyncId(syncId);
                        }
                        else{
                            showToast(this,'Error occurred during, fetching package content','error','Error!');    
                        }                                     
                    })
                    .catch(error=>{
                        handleErrors(this,error);
                    })
                    .finally(()=>{
                        this.spinner = false;
                    })
                }
            }
            else{
                showToast(this,'No metadata items found to add in package','error','Error');
            }
        }
        catch(e){            
            showToast(this,e.message,'error','Error');
            console.error(e.message);
        }               
    };

    retrievePackageContentBySyncId(syncId){
        this.spinner = true;
        checkAsyncRequest({requestId:syncId,packageId:this.packageId,orgId:this.packageObj.GKNRMA__Source_SFDC_Org__c})
        .then(res=>{
            if(res!=''){
                this.spinner = false;
                showToast(this,'Metadata content have been added to package.','success','Success');
                this.dispatchEvent(new CustomEvent('aftermetadataaddition')); 
            }
            else{
                this.retrievePackageContentBySyncId(syncId);
            }
        })
        .catch(error=>{
            handleErrors(this,error);
            this.spinner = false;
        })
    };

    //pagination methods    
    calculatePages(){
        try{
            const pageSize = parseInt(this.pageSize,10);        
            let startIndex = this.currentPage * pageSize;            
            
            let endIndex = this.allMetadataItems.length < pageSize?this.allMetadataItems.length:startIndex+pageSize;            
            endIndex = endIndex>this.allMetadataItems.length?this.allMetadataItems.length:endIndex;
            
            this.totalPages = Math.ceil(this.allMetadataItems.length/pageSize);
            this.isShowPagination = this.totalPages>0?true:false;
            this.paginationText = 'Showing '+(startIndex+1)+' - '+endIndex+' of '+this.totalFilteredMetadataItems;
            this.filteredItems = this.allMetadataItems.slice(startIndex,endIndex);
            this.isPrevBtnDisabled = this.currentPage==0?true:false;
            this.isNextBtnDisabled = this.totalPages==this.currentPage||this.totalPages==1||endIndex==this.totalFilteredMetadataItems;
            this.presetSelectedItems();
        }
        catch(e){
            LightningAlert.open({message: e,theme: 'error',label: 'Error!'});
        }
    };
    
    gotoPrev(){
        if(this.currentPage>0){
            this.currentPage = this.currentPage - 1;                        
            this.calculatePages();
        }
    };
    
    gotoNext(){
        if(this.totalPages>=this.currentPage){
            this.currentPage = this.currentPage + 1;
            this.calculatePages();
        }        
    };

    //all metadata items selection
    handleRowSelectionAllMetadataItems(event){
        let data = [];        
        try{
            let config = event.detail.config;
            console.log('config',config.action);
            if (config.action && config.action.toLowerCase() == 'rowdeselect') {  
                console.log('config.dh',config.value);
                let index = this.allSelectedRows.indexOf(config.value);
                this.allSelectedRows.splice(index,1);//remove an item from array
            }
            else if (config.action && config.action.toLowerCase() == 'selectallrows') {
                console.log('config.sd',config.value);
                event.detail.selectedRows.forEach(i=>{
                    if(this.allSelectedRows.indexOf(i.Id)<0){
                        this.allSelectedRows.push(i.Id);
                    }
                });
            }
            else if (config.action && config.action.toLowerCase() == 'deselectallrows') {     
                console.log('config.ki',config.value);
                //iterate over current page, which is deselect all rows
                this.filteredItems.forEach(i=>{
                    let index = this.allSelectedRows.indexOf(i.Id);
                    if(index>=0){
                        this.allSelectedRows.splice(index,1);
                    }
                });
            }
            else if (config.action) {
                console.log('config.value',config.value);
                this.allSelectedRows.push(config.value);
            }

            this.allMetadataItemsWithoutFilter.forEach(row=>{
                if(this.allSelectedRows.indexOf(row.Id)>=0){
                    data.push(row);
                }
            });
            console.log('data',JSON.stringify(data));
            console.log('this.allSelectedRows',JSON.stringify(this.allSelectedRows));
            console.log('this.allMetadataItemsWithoutFilter',JSON.stringify(this.allMetadataItemsWithoutFilter));


            this.selectedMetadataItems = data;
            data = [];//release memory
            this.presetSelectedItems();
        }
        catch(e){
            LightningAlert.open({message: e.message,theme: 'error',label: 'Error!'});            
        }
    };

    searchInAllMetadataItems(event){
        let key = event.target.value.toLowerCase();
        let isFound = false;
        let filteredData = [];
        this.allMetadataItemsWithoutFilter.forEach(row=>{
            isFound = false;
            if(row.fullName.toLowerCase().indexOf(key)>=0){
                isFound = true;
            }
            else if(row.metadataType.toLowerCase().indexOf(key)>=0){
                isFound = true;
            }
            else if(row.createdByName.toLowerCase().indexOf(key)>=0){
                isFound = true;
            }
            else if(row.lastModifiedByName.toLowerCase().indexOf(key)>=0){
                isFound = true;
            }
            else if(row.createdDate.toLowerCase().indexOf(key)>=0){
                isFound = true;
            }
            else if(row.lastModifiedDate.toLowerCase().indexOf(key)>=0){
                isFound = true;
            }
            if(isFound){
                filteredData.push(row);                
            }
        });
        this.allMetadataItems = filteredData;
        filteredData = [];//release memory       
        
        this.presetSelectedItems();
        //reset pagination after filter datatable
        this.currentPage = 0;
        this.calculatePages();
    };

    //preset selected items
    presetSelectedItems(){
        let temp = [];
        this.selectedMetadataItems.forEach(i=>{
            temp.push(i.Id);
        })
        console.log(JSON.stringify(temp));
        this.selectedRows = temp;
        this.allSelectedRows = temp;
        temp = [];//release memory
    };

    //all metadata items pagination and sorting logic start    
    onHandleSortAllMetadataItems(event){
        const { fieldName: sortedBy, sortDirection } = event.detail;
        let cloneData = [...this.allMetadataItems];

        cloneData.sort(this.sortBy(sortedBy, sortDirection === 'asc' ? 1 : -1));
        this.allMetadataItems = cloneData;
        this.sortDirection = sortDirection;
        this.sortedBy = sortedBy;
        cloneData = [];//release memory

        //reset pagination after filter datatable        
        this.calculatePages();
    };

    sortBy(field, reverse, primer) {
        const key = primer
            ? function (x) {
                  return primer(x[field]);
              }
            : function (x) {
                  return x[field];
              };

        return function (a, b) {
            a = key(a);
            b = key(b);
            return reverse * ((a > b) - (b > a));
        };
    }
    //pagination and sorting logic end

    searchMetadataTypes(event){
        let keyword = event.target.value.toLowerCase();        
        if(keyword){
            this.filteredMetadataTypes = this.allMetadataTypes.filter(i=>i.label.toLowerCase().indexOf(keyword)>=0);
        }
        else{
            this.filteredMetadataTypes = this.allMetadataTypes;
        }
        this.showDropdown();
    };

    hideDropdown(event){
        event.stopPropagation();
        this.className = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
    };

    showDropdown(event){
        if(this.filteredMetadataTypes && this.filteredMetadataTypes.length==0){
            this.filteredMetadataTypes = this.allMetadataTypes;
        }

        this.className = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open';
        this.template.querySelector('lightning-input').focus();
    };

    selectOption(event){        
        let item = event.currentTarget.dataset.metadatatype;
        this.selectedMetadataTypes.push(item);
        this.metadataTypeSearchBox = '';
        this.hideDropdown(event);
    };

    removePill(event){
        let item = event.target.name;
        let index = this.selectedMetadataTypes.indexOf(item);
        let items = JSON.parse(JSON.stringify(this.selectedMetadataTypes));
        items.splice(index,1);
        this.selectedMetadataTypes = items;        
    };

    //get all Metadata type that show on search box.
    get metadataType(){
        return this.filteredMetadataTypes.filter(i=>this.selectedMetadataTypes.indexOf(i.value)==-1);
    };

    get isOpenDropdown(){
        return this.metadataType.length>0;
    };

    get isSelected(){
        return this.selectedMetadataTypes.length>0;
    };

    get totalMetadataItems(){
        return this.allMetadataItemsWithoutFilter?this.allMetadataItemsWithoutFilter.length:0;
    };

    get totalFilteredMetadataItems(){
        return this.allMetadataItems ? this.allMetadataItems.length:0;
    }

    get totalSelectedMetadataItems(){
        return this.selectedMetadataItems?this.selectedMetadataItems.length:0;
    };

    get pageSizes(){
        return [{label:'Page Size: 10',value:'10'},{label:'Page Size: 25',value:'25'},{label:'Page Size: 50',value:'50'},{label:'Page Size: 75',value:'75'},{label:'Page Size: 100',value:'100'},{label:'Page Size: 200',value:'200'}];
    };

    get isDisabledAddToPackage(){
        return this.allSelectedRows && this.allSelectedRows.length>0?false:true;
    };

    get isLocked(){
        return this.packageObj && this.packageObj.GKNRMA__IsLocked__c;
    }

    handleKeyUp(event){
        if(event.keyCode==40){
            //down arrow
            this.template.querySelector(".gkn-search-list").focus();
        }
        else if(event.keyCode==38){
            //up arrow
            this.template.querySelector(".gkn-search-list").focus();
        }
        else{
            //nothing happen here
        }
    };
}