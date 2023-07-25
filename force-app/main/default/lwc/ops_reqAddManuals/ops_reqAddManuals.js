/*
Created By		: Girikon(Garima[STL-151])
Created On	 : September 14, 2019
@description : This component is use to show Required and Additional Manuals settings page at ops admin side.

Modification log --
Modified By	: [Aishwarya 11 Aug 2020 BK-5771], [Aishwarya 1 Feb 2021 BK-13198] 
*/


/* eslint-disable no-console */

import { LightningElement, track, api,wire } from 'lwc';
import getDatas from '@salesforce/apex/CommonTableController.getGenericObjectRecord';
import deleteRecord from '@salesforce/apex/CommonTableController.deleteRecord';
import getManualData from '@salesforce/apex/LtngUtilityCtrl.getRecords';
import updateAndDeleteAttOnManuals from '@salesforce/apex/OPS_FormTemplatesCtrl.updateAndDeleteAttOnManual';
import updateAttachOnManuals from '@salesforce/apex/OPS_FormTemplatesCtrl.updateAttachOnManual';
import getContentVerId from '@salesforce/apex/OPS_FormTemplatesCtrl.getContentVersionId';

import { loadScript } from 'lightning/platformResourceLoader';
import jquery from '@salesforce/resourceUrl/jquery_core';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import TemplateForm from '@salesforce/schema/Form__c.Template_Form_Name__c';
import UploadMessage from "@salesforce/label/c.UploadAttachmentMessage";

import userId from '@salesforce/user/Id';
import { handleErrors, showToast } from 'c/lWCUtility';
import { NavigationMixin } from 'lightning/navigation';
import {getRecord } from 'lightning/uiRecordApi';
const FIELDS = ['Event_Edition__c.Event_Code__c','Event_Edition__c.Matched_Product_Name__c','Event_Edition__c.Booth_Type__c'];

const DELAY = 300;
export default class Ops_reqAddManuals extends NavigationMixin(LightningElement) {
    label = { UploadMessage };
   
    templateForm = TemplateForm;
    @track templateName;
    @track myVar;
    @track showLinkField;
    @track showTemplateField;
    @track showAttach = false;
    @track name;
    @track provider;
    @track manualDesc;
    @track deadline;
    @track url;
    @track submitDeadline;
    @track userType;
    @track attachName;
    @track attachmentId;
    @track pdf;
    @track tempManualType;
    @track downloadModal;
    @track showDoc;
    @track manualName;
    @track required;
    @api callFrom;
    @track tempArr;

    @api isSupportNewRecord;
    @api button1Label = 'Add Manual';
    @track isOpenSingleDeleteModal = false;
    @track selectedRecordId;
    @track recordId; // Edit mode
    @track openEditModal;
    @track showUploader;
    @track deleteAttach;
    @track errorMessage;
    @track isPDF = false; //BK-5771
   

    //Pagination properties
    @track pagesize = 30;
    @track currentPageNo = 1;
    @track totalPages = 0;
    @track pageList;
    @track totalrows = 0;
    @track offst = 0;
    @track hasNext = false;
    @track hasPrev = false;
    @track searchValue = '';
    @track showPageView = '0';
    @track sortByFieldName = '';
    @track sortByName = '';
    @track sortType = 'desc';
    @track esId;
    @track eId;

    //Set object and fields to create datatable
    @track tableData;
    @track tableColumn;

    @api objectName = 'Manual__c';
    @api objectLabel = 'Manuals';
    @api fields = 'Name,Provider__c,Manual_Type__c,Required__c,Deadline__c,Manual_Description__c,Section__c,Url__c,Uploaded_Attachment_Id__c,Uploaded_Attachment_Name__c,User_Type__c,Allow_Submit_After_Deadline__c';
    @api fieldsLabel = 'Id,Name';
    @api condition = 'Id!=\'\' ';
    @track tempCondition = '';
    @api profile = '';
    @api isViewFile = 'false';
    @api isOpenLink;
    @api openLinkIcon;
    @track showIcon = false;
    @track showForm = true;
    @track openNewModal;
    @track sortByName = 'LastModifiedDate';
    @track sortType = 'desc';


    @api isShowAction = 'true';
    @api showActionButton = 'false';
    //Filter property
    //Owner Filter
    @api isFilterByOwner;
    @api selectedOwner;


    //filter1
    @api filterField1 = '';
    @api filter1Label = 'Form Type';
    @api isMultiPicklistFilter1;
    @track filterField1Options;
    @track filterField1Value = '';

    //filter 2
    @api filterField2 = '';
    @api filter2Label = 'Group Type';
    @api isMultiPicklistFilter2;
    @track filterField2Options;
    @track filterField2Value = '';

    //filter 3
    @api filterField3 = '';
    @api filter3Label = 'Select Business Unit';
    @api isMultiPicklistFilter3;
    @track filterField3Options;
    @track filterField3Value = '';

    //Toggle filter
    @api toggleFilterLabel;
    @api toggleFilterCondition;
    @track toggleState = false;

    @track error;
    @track firstTime;
    @track spinner;
    @track isShow;
    @track isOpenMassDeleteModal;
    @track selectedRows;
    @track lastind;

    @track viewManualModal=false;
    @track selectedRecordView;

    @track onLineTypeTemplate=false;
    @track linkTypeTemplate=false;
    @track downloadablePdfTypeTemplate=false;
    @track iframeLinkValue=''
    @track inputDisabled=true
    @track saveDisable;
    @track eventEditionId=''
    @track eventCode=''
    @api whereCallFrom = '';
    @track boothTypeOptions=[];
    @track selectedValuesBoothType = [];
    @track showCheckboxField;
   @track matchProductOptions=[];
   @track selectedMatchProduct = [];
   

@track selectedValuesBoothTypeNew = [];
@track selectedMatchProductNew = [];
@track prefilledRequiredField = false;

    connectedCallback() {
        loadScript(this, jquery)
            .then({

            })
            .catch(error => {
                showToast(this, error, 'error', 'Error');
            })


        this.isOpenMassDeleteModal = false;
        this.firstTime = true;
        this.spinner = false;
        this.hasNext = false;
        this.hasPrev = false;
        this.pagesize = 30;
        this.offst = 0;

        const col = [];
        if (typeof this.fields === 'string') {
            this.fields.split(',').forEach((item, i) => {
                col.push({ label: this.fieldsLabel.split(',')[i], fieldName: item.trim() });
            });
        }
        else {
            this.fields = '';
        }

        if (typeof this.objectName != 'string') {
            this.objectName = '';
        }
        this.tableColumn = col;

      
        this.isShow = this.spinner === false && this.firstTime;

        this.handleFilterChange();

        if (this.objectName !== '') {
            //this.getData();
        }
    
        

        let fullUrl = window.location.href;
        this.esId = this.GetQS(fullUrl, 'esid');
        this.eId = this.GetQS(fullUrl, 'id');

         if(this.whereCallFrom==='required'){
            this.showCheckboxField=true;
            this.prefilledRequiredField = true;
            this.refreshTable();
        }else if(this.whereCallFrom==='additional'){
            this.showCheckboxField=false;
            this.prefilledRequiredField = false;
            this.refreshTable();
        }


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
    
    @wire(getRecord, { recordId: '$eId',fields: FIELDS })
    wiredEventObject({ error, data }) {
        if (data) {
            this.eventCode = data.fields.Event_Code__c.value ? data.fields.Event_Code__c.value: '';
            let tempBoothType=data.fields.Booth_Type__c.value ? data.fields.Booth_Type__c.value: '';
            let tempMatchProduct=data.fields.Matched_Product_Name__c.value ? data.fields.Matched_Product_Name__c.value: '';
            try{
                this.boothTypeOptions = [];
                if(tempBoothType.indexOf(",")){
                    let splitArr = tempBoothType.split(',');
                     this.tempArr=[];
                    for(let i = 0 ; i< splitArr.length; i++)  {
                        let obj = {label: splitArr[i], value : splitArr[i]};
                        this.tempArr.push(obj);
                    }
                    this.boothTypeOptions = this.tempArr; 
                }else{
                    this.boothTypeOptions.push({label:tempBoothType,value:tempBoothType}) ;
                }
            // eslint-disable-next-line no-empty
            }catch(e){                
            }
            try{
                this.matchProductOptions = [];
                if(tempMatchProduct.indexOf(",")){
                    let splitArr = tempMatchProduct.split(';');
                    let tempArr=[];
                    for(let i = 0 ; i< splitArr.length; i++)  {
                        let obj = {label: splitArr[i], value : splitArr[i]};
                        tempArr.push(obj);
                    }
                    this.matchProductOptions = tempArr; 
                }else{
                    this.matchProductOptions.push({label:tempMatchProduct,value:tempMatchProduct}) ;
                }
            // eslint-disable-next-line no-empty
            }catch(e){                
            }
        } else if (error) {  
            this.isLoading = 'hideLoading';
            this.record = undefined;
        }
    }
    chkRequired(event){

        this.prefilledRequiredField = event.target.checked;
    }

    handleChangeBoothType(event){
        this.selectedValuesBoothType = event.detail.value;
    }

    handleChangeMatchProduct(event){
        this.selectedMatchProduct = event.detail.value;
    }

    handleChangeBoothTypeNew(event){
        this.selectedValuesBoothTypeNew = event.detail.value;
    }
 
    handleChangeMatchProductNew(event){
        this.selectedMatchProductNew = event.detail.value;
    }

    ccUrl() {
        window.location.href = '/lightning/n/ops_customer_centre';
    }
    callSaveBtn(){
        this.template.querySelector('.save').click();
    }

    getData() {
        this.spinner = true;
        getDatas({
            searchValue: this.searchValue, objectName: this.objectName, fieldstoget: this.fields, pagesize: this.pagesize,
            next: this.hasNext, prev: this.hasPrev, off: this.offst, sortBy: this.sortByName, sortType: this.sortType, condition: this.tempCondition
        })
            .then(data => {
                if (this.offst === -1) {
                    this.offst = 0;
                }
                this.firstTime = false;
                this.spinner = false;
                this.isShow = this.spinner === false && this.firstTime;

                const totalRows = data.total > 2000 ? 2000 : data.total;
                this.tableData = data.ltngTabWrap.tableRecord;

                this.tableColumn = data.ltngTabWrap.tableColumn;
                this.setParentFieldColumn(this.tableColumn, this.fields, this.tableData);
                this.totalPage = Math.ceil(totalRows / this.pagesize);
                this.totalRows = totalRows;
                this.isMoreThan2000 = data.total > 2000 ? true : false;
                this.lastind = parseInt(data.offst + this.pagesize, 10);

                if (data.total < this.lastind) {
                    this.lastind = data.total;
                }
                this.showPageView = 'Showing: ' + parseInt(data.offst + 1, 10) + '-' + this.lastind;

                this.generatePageListUtil();
                if (totalRows === 0) {
                    this.error = 'No record found';
                    this.tableData = undefined;
                    this.pageList = undefined;
                }
                else {
                    this.error = undefined;
                }

            })
            .catch(error => {
                this.tableData = undefined;
                this.error = error;
                handleErrors(this, error);
            });
    }

    handleFilterChange() {
        const condition = this.buildCondition();
        window.clearTimeout(this.delayTimeout);

        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(() => {
            this.offst = 0;
            this.currentPageNo = 1;
            this.hasNext = false;
            this.hasPrev = false;
            this.tempCondition = condition;
            this.getData();
        }, DELAY)
    }
    handleMultipicklistChange(event) {
        window.clearTimeout(this.delayTimeout);
        const selectedOptions = event.target.selectedOptions;
        const filterName = event.target.filterName;
        if (filterName === '3') {
            this.filterField3Value = selectedOptions;
        }
        if (filterName === '2') {
            this.filterField2Value = selectedOptions;
        }
        if (filterName === '1') {
            this.filterField1Value = selectedOptions;
        }
        const condition = this.buildCondition();
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(() => {
            this.offst = 0;
            this.currentPageNo = 1;
            this.hasNext = false;
            this.hasPrev = false;
            this.tempCondition = condition;
            this.getData();
        }, DELAY)

    }
    
    /**
     * This method build json data of related object
     * @param {table data that return by apex action} tbldatas 
     */
    setParentFieldValue(tbldatas) {
        let datas = JSON.parse(JSON.stringify(tbldatas));

        for (let i = 0; i < datas.length; i++) {
            if (datas[i].Form_Type__c === 'Online') {
                datas[i].isShowIcon = true;
            }

            //build link
            if (datas[i].hasOwnProperty('Name')) {
                datas[i].NameLink = '/lightning/r/' + this.objectName + '/' + datas[i].Id + '/view';
            }
            if (datas[i].hasOwnProperty('WorkOrderNumber')) {
                datas[i].WorkOrderNumberLink = '/lightning/r/' + this.objectName + '/' + datas[i].Id + '/view';
            }
            if (datas[i].hasOwnProperty('LineItemNumber')) {
                datas[i].LineItemNumberLink = '/lightning/r/' + this.objectName + '/' + datas[i].Id + '/view';
            }

            if (typeof datas[i] === 'object') {
                // Parent table data
                // eslint-disable-next-line guard-for-in                
                for (let k in datas[i]) {
                    if (datas[i].hasOwnProperty(k) && typeof datas[i][k] === 'object') {
                        Object.keys(datas[i][k]).forEach(item => {
                            datas[i][k + '.' + item] = datas[i][k][item];
                            if (item.toLowerCase() === 'name') {
                                datas[i][k + '.NameLink'] = '/lightning/r/' + k + '/' + datas[i][k].Id + '/view';
                            }
                            if (item.toLowerCase() === 'workordernumber') {
                                datas[i][k + '.WorkOrderNumberLink'] = '/lightning/r/' + k + '/' + datas[i][k].Id + '/view';
                            }
                        });

                        //three level data                        
                        for (let j in datas[i][k]) {
                            if (datas[i][k].hasOwnProperty(j) && typeof datas[i][k][j] === 'object') {
                                Object.keys(datas[i][k][j]).forEach(item => {
                                    if (typeof datas[i][k][j][item] !== 'object') {
                                        datas[i][k + '.' + j + '.' + item] = datas[i][k][j][item];
                                        if (item.toLowerCase() === 'name') {
                                            datas[i][k + '.' + j + '.' + item + 'Link'] = '/lightning/r/' + j + '/' + datas[i][k][j].Id + '/view';
                                        }
                                    }
                                    else {
                                        Object.keys(datas[i][k][j][item]).forEach(item2 => {
                                            datas[i][k + '.' + j + '.' + item + '.' + item2] = datas[i][k][j][item][item2];
                                            if (item2.toLowerCase() === 'name') {
                                                datas[i][k + '.' + j + '.' + item + '.' + item2 + 'Link'] = '/lightning/r/' + item + '/' + datas[i][k][j][item].Id + '/view';
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
    setParentFieldColumn(columnObj, columnList, datas) {
        columnObj = JSON.parse(JSON.stringify(columnObj));
        columnList = JSON.parse(JSON.stringify(columnList));

        if (columnList.indexOf('.') > 0) {
            let col = columnList.split(',');
            for (let i = 0; i < col.length; i++) {
                let test = col[i].split('.');
                let label = this.fieldsLabel.split(',')[i];

                if (col[i].indexOf('.') > 0 && test.length === 2) {
                    columnObj.splice(i, 0, { fieldName: col[i], label: label });
                }
                else if (col[i].indexOf('.') > 0 && test.length === 3) {
                    columnObj.splice(i, 0, { fieldName: col[i], label: label });
                }
                else if (col[i].indexOf('.') > 0 && test.length === 4) {
                    columnObj.splice(i, 0, { fieldName: col[i], label: label });
                }
                else {
                    columnObj[i].label = label;
                }
            }
        }
        if (this.isViewFile === 'true') {
            columnObj.splice(0, 0,
                {
                    type: "button-icon",
                    initialWidth: 34,
                    typeAttributes: {
                        iconName: 'utility:preview',
                        name: 'viewfile',
                        title: 'View File',
                        variant: 'bare',
                        disabled: false,
                        value: { fieldName: 'Id' }
                    }
                }
            );
        }
        if (this.isOpenLink) {
            let isOpenLinkIcon = this.openLinkIcon ? this.openLinkIcon : 'utility:forward_up';
            columnObj.splice(0, 0,
                {
                    type: "button-icon",
                    initialWidth: 34,
                    typeAttributes: {
                        iconName: isOpenLinkIcon,
                        name: 'openlink',
                        title: 'Open Link',
                        variant: 'bare',
                        disabled: false,
                        value: { fieldName: 'Id' }
                    }
                }
            );
        }
        if (this.showActionButton === 'true') {
            columnObj.splice(0, 0,
                {
                    type: "button-icon",
                    initialWidth: 34,
                    typeAttributes: {
                        iconName: 'utility:new_window',
                        name: 'openactionmodal',
                        title: 'Open',
                        variant: 'bare',
                        disabled: false,
                        value: { fieldName: 'Id' }
                    }
                }
            );
        }

        for (let i = 0; i < columnObj.length; i++) {
            //format date field
            if (columnObj[i].type === 'textarea' || columnObj[i].type === 'button-icon' || columnObj[i].type === 'multipicklist') {
                columnObj[i].sortable = false;
            }
            else {
                columnObj[i].sortable = true;
            }

            if (columnObj[i].type === 'datetime') {
                columnObj[i].type = 'date';
                columnObj[i].typeAttributes = { day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }
            }
            //format date field
            if (columnObj[i].type === 'date') {
                columnObj[i].typeAttributes = {
                    day: 'numeric',
                    month: 'numeric',
                    year: 'numeric'
                }
            }
            if (columnObj[i].type === 'double') {
                columnObj[i].type = 'number';
                columnObj[i].cellAttributes = { alignment: 'left' };
            }
            if (columnObj[i].type === 'currency') {
                columnObj[i].cellAttributes = { alignment: 'left' };
            }
            if (columnObj[i].fieldName !== undefined &&
                (columnObj[i].fieldName.toLowerCase().indexOf('name') >= 0 || columnObj[i].fieldName.toLowerCase() === 'workordernumber'
                    || columnObj[i].fieldName.toLowerCase() === 'lineitemnumber' || columnObj[i].fieldName.toLowerCase() === 'workorder.workordernumber')) {
                if (columnObj[i].fieldName.toLowerCase() !== 'stagename') {
                    columnObj[i].type = 'url';
                    columnObj[i].typeAttributes = { label: { fieldName: columnObj[i].fieldName }, tooltip: 'Open in new tab', target: '_blank' };
                    columnObj[i].fieldName = columnObj[i].fieldName + 'Link';
                }
            }
        }
        this.tableColumn = columnObj;
        this.setParentFieldValue(datas)
    }

    // Table pagination, sorting and page size change actions Start
    /**
     * Get next page data if available
     */
    getNextData() {   //Table Action 1
        if (this.lastind >= this.totalRows) {
            return;
        }
        window.clearTimeout(this.delayTimeout);
        const nextPage = this.currentPageNo + 1;
        const offset = (nextPage * this.pagesize) - this.pagesize;
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(() => {
            this.offst = offset;
            this.currentPageNo = nextPage;
            this.hasNext = true;
            this.hasPrev = false;
            this.highLightNumber(nextPage);
            this.getData();
        }, DELAY);
    }
    /**
     * Get previous page data
     */
    getPrevData() {  //Table Action 2
        if (this.currentPageNo === 1) { return; }
        window.clearTimeout(this.delayTimeout);
        const prevPage = this.currentPageNo - 1;
        const offset = (prevPage * this.pagesize) - this.pagesize;
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(() => {
            this.offst = offset;
            this.currentPageNo = prevPage;
            this.hasNext = false;
            this.hasPrev = true;
            this.highLightNumber(prevPage);
            this.getData();
        }, DELAY);
    }
    /**
     * Fire when user change page size drop down
     * @param {Event Object to get which option is selected} event 
     */
    onPageSizeChange(event) {
        window.clearTimeout(this.delayTimeout);

        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(() => {
            this.offst = 0;
            this.currentPageNo = 1;
            this.hasNext = false;
            this.hasPrev = false;
            this.pagesize = parseInt(event.detail.value, 10);
            this.highLightNumber(1);
            this.getData();
        }, DELAY);
    }
    searchData() {
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
        }, DELAY);
    }
    /**
     * Fire whenever user type in search box, but data load if search field empty      * 
     */
    reloadData() {
        let searchValue = this.template.querySelector(".search-box").value;
        searchValue = searchValue.trim();
        if (searchValue === '') {
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
            }, DELAY);
        }
    }
    
    /**
     * fire when user click on page number
     * @param event Event Object to get which number clicked
     */
    processMe(event) { //Table Action 3
        window.clearTimeout(this.delayTimeout);
        let currentPageNumber = this.currentPageNo;
        let selectedPage = parseInt(event.target.name, 10);
        let pagesize = this.pagesize;
        let next = selectedPage < currentPageNumber ? false : true;
        let prev = selectedPage < currentPageNumber ? true : false;
        const offset = (selectedPage * pagesize) - pagesize;

        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(() => {
            this.offst = offset;
            this.currentPageNo = selectedPage;
            this.hasNext = next;
            this.hasPrev = prev;
            this.highLightNumber(selectedPage);
            this.getData();
        }, DELAY);
    }

    /**
     * Add selected class on page number
     * @param pageNumber current page number to highlight
     */
    highLightNumber(pageNumber) { //Util method 1
        //reset 
        try {
            this.pageList.forEach(element => {
                if (this.template.querySelector('span[id*="' + element + '-"]') !== null && this.template.querySelector('span[id*="' + element + '-"]').firstChild !== null) {
                    this.template.querySelector('span[id*="' + element + '-"]').firstChild.classList.remove('selected');
                }
            });
            if (this.template.querySelector('span[id*="' + pageNumber + '-"]') !== null && this.template.querySelector('span[id*="' + pageNumber + '-"]').firstChild !== null) {
                this.template.querySelector('span[id*="' + pageNumber + '-"]').firstChild.classList.add('selected');
            }


            if (pageNumber === 1) {
                if (this.template.querySelector(".prev-btn") !== null && this.template.querySelector(".prev-btn").firstChild !== null) {
                    this.template.querySelector(".prev-btn").firstChild.setAttribute("disabled", true);
                }
            }
            if (pageNumber >= this.totalPage) {
                if (this.template.querySelector(".next-btn") !== null && this.template.querySelector(".next-btn").firstChild !== null) {
                    this.template.querySelector(".next-btn").firstChild.setAttribute("disabled", true);
                }
            }
        }
        catch (e) {
            console.error(e);
        }
    }
    /**
     * Generate page list like 1..2 3 4 ...5
     */
    generatePageListUtil() {  // Util Method 2
        const pageNumber = this.currentPageNo;
        const pageList = [];
        const totalPages = this.totalPage;

        if (totalPages > 1) {
            if (totalPages <= 10) {
                for (let counter = 2; counter < (totalPages); counter++) {
                    pageList.push(counter);
                }
            } else {
                if (pageNumber < 5) {
                    pageList.push(2, 3, 4, 5, 6);
                } else {
                    if (pageNumber > (totalPages - 5)) {
                        pageList.push(totalPages - 5, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1);
                    } else {
                        pageList.push(pageNumber - 2, pageNumber - 1, pageNumber, pageNumber + 1, pageNumber + 2);
                    }
                }
            }
        }
        this.pageList = pageList;
    }

    // Table pagination, sorting and page size change actions END



    get ownerOptions() {
        return [{ 'label': 'My ' + this.objectLabel, 'value': userId }, { 'label': 'All ' + this.objectLabel, 'value': '' }];
    }
    get pagesizeList() {
        return [
            { 'label': '30', 'value': '30' },
            { 'label': '50', 'value': '50' }
        ];
    }
    get firstActiveClass() {
        return this.currentPageNo === 1 ? 'selected' : '';
    }
    get lastActiveClass() {
        return this.currentPageNo === this.totalPage ? 'selected' : '';
    }

    
    /**
     * Used to build condition of all three filters value and fields
     */
    buildCondition() {
        let condition = this.condition;

        //Only for Owner filter
        if (this.isFilterByOwner) {
            this.selectedOwner = this.template.querySelector(".ownerfilter") ? this.template.querySelector(".ownerfilter").value : '';
            if (this.selectedOwner === '') {
                return condition;
            }
            return condition + ' AND (OwnerId=\'' + this.selectedOwner + '\')';
        }

        if (this.template.querySelector(".filter1") !== undefined && this.template.querySelector(".filter1") !== null) {
            this.filterField1Value = this.template.querySelector(".filter1").value;
        }

        if (this.template.querySelector(".filter2") !== undefined && this.template.querySelector(".filter2") !== null) {
            this.filterField2Value = this.template.querySelector(".filter2").value;
        }

        if (this.template.querySelector(".filter3") !== undefined && this.template.querySelector(".filter3") !== null) {
            this.filterField3Value = this.template.querySelector(".filter3").value;
        }

        const selectedValue1 = this.filterField1Value ? this.filterField1Value : '';
        const selectedValue2 = this.filterField2Value ? this.filterField2Value : '';
        const selectedValue3 = this.filterField3Value ? this.filterField3Value : '';


        let customCond = '';
        if (selectedValue1 !== '' && selectedValue2 !== '' && selectedValue3 !== '') {
            customCond = customCond + ' AND (' + this.filterField1 + ' IN (\'' + selectedValue1 + '\') ';
            customCond = customCond + ' AND ' + this.filterField2 + ' IN (\'' + selectedValue2 + '\') ';
            customCond = customCond + ' AND ' + this.filterField3 + ' IN (\'' + selectedValue3 + '\')) ';
        }
        else if (selectedValue1 !== '' && selectedValue2 !== '' && selectedValue3 === '') {
            customCond = customCond + ' AND (' + this.filterField1 + ' IN (\'' + selectedValue1 + '\') ';
            customCond = customCond + ' AND ' + this.filterField2 + ' IN (\'' + selectedValue2 + '\')) ';
        }
        else if (selectedValue1 !== '' && selectedValue2 === '' && selectedValue3 !== '') {
            customCond = customCond + ' AND (' + this.filterField1 + ' IN (\'' + selectedValue1 + '\') ';
            customCond = customCond + ' AND ' + this.filterField3 + ' IN (\'' + selectedValue3 + '\')) ';
        }
        else if (selectedValue1 === '' && selectedValue2 !== '' && selectedValue3 !== '') {
            customCond = customCond + ' AND (' + this.filterField2 + ' IN (\'' + selectedValue2 + '\') ';
            customCond = customCond + ' AND ' + this.filterField3 + ' IN (\'' + selectedValue3 + '\')) ';
        }
        else if (selectedValue1 !== '') {
            customCond = customCond + ' AND (' + this.filterField1 + ' IN (\'' + selectedValue1 + '\')) ';
        }
        else if (selectedValue2 !== '') {
            customCond = customCond + ' AND (' + this.filterField2 + ' IN (\'' + selectedValue2 + '\')) ';
        }
        else if (selectedValue3 !== '') {
            customCond = customCond + ' AND (' + this.filterField3 + ' IN (\'' + selectedValue3 + '\')) ';
        }
        customCond = customCond.replace(/NULL/g, '');
        return condition + customCond;
    }

    get isTrue() {
        return this.spinner && !this.firstTime;
    }

    
    // this metod called after insert/update/delete operation from parent component 
    @api
    refreshTable() {
        this.getData();
    }

    // Fire whenever user select row and assing selected rows to a property
    handleRowSelection(event) {
        this.selectedRows = event.detail.selectedRows;
        if (this.selectedRows.length === 0) {
            this.selectedRows = undefined;
        }
    }

    //get MASS Action picklist options
    get bulkActionList() {
        return [
            {
                label: '--Mass Actions--', value: ''
            },
            {
                label: 'Mass Update', value: 'mass_update'
            },
            {
                label: 'Mass Delete', value: 'mass_delete'
            }
        ];
    }

    //fire if chnaging mass action picklist like mass update and mass delete
    onChangeMassAction(event) {
        let selectedValue = event.detail.value;
        if (selectedValue === 'mass_update') {
            this.openMassUpdateForm();
        }
        else if (selectedValue === 'mass_delete') {
            this.isOpenMassDeleteModal = true;
        }
        else {
            this.isOpenMassDeleteModal = false;
        }
    }

    // create custom event and fire to open mass update form
    openMassUpdateForm() {
        this.dispatchEvent(new CustomEvent('openmassupdate'));
    }

    //This method called from parent component that called common-table component
    //get all fields and fields value in object{} and update all selected rows
    @track showMassUpdateConfirmationBar;
    @track fieldValues;
    @track selectedTableRows;
    @api
    

    /**
     * Fire where user click No button of delete confirmation modal
     */
    noDelete() {
        this.selectedRecordId = '';
        this.selectedRows = undefined;
        this.isOpenMassDeleteModal = false;
        this.isOpenSingleDeleteModal = false;
        this.selectedTableRows = [];
    }
    /**
     * This method used to delete single record from table
     */
    yesDeleteSingleRecord(showMessage) {
        var records = [];
        records.push({ Id: this.selectedRecordId, sobjectType: this.objectName });
        this.spinner = true;
        deleteRecord({ objList: records })
            .then(res => {
                this.spinner = false;
                this.selectedRecordId = '';
                this.isOpenSingleDeleteModal = false;
                this.selectedTableRows = [];
                if (res > 0) {
                    //BK-5771
                    if(showMessage !='show'){
                        showToast(this, 'Record Deleted', 'success', 'Success');
                    }
                }
                this.refreshTable();
            })
            .catch(error => {
                handleErrors(this, error);
            })
    }

    /**
     * This action fire when apply button filter on table. this method get condition of button filter and append in current condition
     */
    handleToggleButtonClick() {
        this.toggleState = !this.toggleState;
        let condition = this.buildCondition();
        if (this.toggleState) {
            condition = condition + ' AND ' + this.toggleFilterCondition;
        }

        window.clearTimeout(this.delayTimeout);

        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(() => {
            this.offst = 0;
            this.currentPageNo = 1;
            this.hasNext = false;
            this.hasPrev = false;
            this.tempCondition = condition;
            this.getData();
        }, DELAY)
    }
    input(event) {
        this.showLinkField = false;
        this.saveDisable = false;
        this.myVar = event.target.value;
        if (this.myVar === 'Link') {
            this.showLinkField = true;
            this.showAttach = false;
        }
        else if (!this.myVar){
            this.saveDisable = true;
        }
    }
    handleManualCreated(event) {
        this.recordId = event.detail.id;
        if(this.showAttach){
            this.showForm = false;
        }
        else{
            const evt = new ShowToastEvent({
                title: "Success",
                message: "Record Is Updated Sucessfully",
                variant: "success"
            });
            this.showForm = true;
            this.dispatchEvent(evt);
            this.refreshTable();
            this.openNewModal = false;
            
            window.location.href = '/lightning/n/ops_customer_centre_manuals#id=' + this.eId + '&esid=' + this.esId;
        }
        
  }
    submitManual(event){
        event.preventDefault();
        this.errorMessage = '';
        const fields = event.detail.fields;
        let manualType = fields.Manual_Type__c;
        let name = fields.Name;
        let url = fields.Url__c;
        
        if(manualType === 'Downloadable PDF'){
            this.showAttach = true;
            this.isPDF = true; //BK-5771
        }
        if (!name) {
            this.errorMessage = 'Complete all required fields';
            this.isPDF = false; //BK-5771
        }
        else if (manualType === 'Link') {
            if (!url) {
                this.errorMessage = 'Complete all required fields';
                this.isPDF = false; //BK-5771
            }
        }
        fields.Event_Edition__c = this.eId;
        fields.Expocad_Booth_Type__c = this.selectedValuesBoothTypeNew.join(';');
        fields.Expocad_Product_Type__c= this.selectedMatchProductNew.join(';');
        fields.Required__c = this.prefilledRequiredField;
        if (!this.errorMessage) {
        this.template.querySelector('.globalForm').submit(fields)
        }
    }
    handleEditModal(event) {        
        this.recordId = event.target.dataset.recordId;
        this.showLinkField = false;
        this.showUploader = false;
        let manualId = this.recordId;
        let tempTableData = this.tableData;
        let manualType = tempTableData[event.currentTarget.dataset.id].Manual_Type__c;
        this.name = tempTableData[event.currentTarget.dataset.id].Name;
        this.provider = tempTableData[event.currentTarget.dataset.id].Provider__c;
        this.url = tempTableData[event.currentTarget.dataset.id].Url__c;
        this.deadline = tempTableData[event.currentTarget.dataset.id].Deadline__c;
        this.submitDeadline = tempTableData[event.currentTarget.dataset.id].Allow_Submit_After_Deadline__c;
        this.manualDesc = tempTableData[event.currentTarget.dataset.id].Manual_Description__c;
        this.userType = tempTableData[event.currentTarget.dataset.id].User_Type__c;
        this.required = tempTableData[event.currentTarget.dataset.id].Required__c;
        this.tempManualType = manualType;
        if (manualType === 'Link') {
            this.showLinkField = true;
        }
        else if (manualType === 'Downloadable PDF') {
            this.showUploader = true;
            this.attachName = tempTableData[event.currentTarget.dataset.id].Uploaded_Attachment_Name__c;
            this.attachmentId = tempTableData[event.currentTarget.dataset.id].Uploaded_Attachment_Id__c;
        }
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(()=>{
            this.openEditModal = true;
        },DELAY);
       //get custom dual picklist value for pre-populated
       getManualData({
        objName: "Manual__c",
        fieldNames:
            "id,Expocad_Booth_Type__c,Expocad_Product_Type__c ",
        compareWith: "id",
        recordId: manualId,
        pageNumber: 1,
        pageSize: 1
    })
        .then(result => {
            let boothType = result.recordList[0].Expocad_Booth_Type__c;
            let matchProductName = result.recordList[0].Expocad_Product_Type__c;
            if(boothType){
                let selectedBoothType=boothType;
                if(selectedBoothType.indexOf(";")){
                    let splitArr = selectedBoothType.split(';');
                    let tempArr=[];
                    for(let i = 0 ; i< splitArr.length; i++)  {
                        tempArr.push(splitArr[i]);
                    }
                    this.selectedValuesBoothType = tempArr;
                    
                }else{
                    this.selectedValuesBoothType.push(selectedBoothType) ;
                } 
            }
            
            if(matchProductName){
                let tempMatchProduct = matchProductName;
                if(tempMatchProduct.indexOf(";")){
                    let splitArr = tempMatchProduct.split(';');
                    let tempArr=[];
                    for(let i = 0 ; i< splitArr.length; i++)  {
                        tempArr.push(splitArr[i]);
                    }
                    this.selectedMatchProduct = tempArr; 
                }else{
                    this.selectedMatchProduct.push(tempMatchProduct) ;
                } 
            }


        })
        .catch(error => {
            window.console.log("error..." + JSON.stringify(error));
        });
    
    }
    onSubmitEditManual(event){
        event.preventDefault();
        this.errorMessage = '';
        const fields = event.detail.fields;
        let manualType = this.tempManualType;
        let name = fields.Name;
        let url = fields.Url__c;
        if (!name) {
            this.errorMessage = 'Complete all required fields';
        }
        else if (manualType === 'Link') {
            if (!url) {
                this.errorMessage = 'Complete all required fields';
            }
        }
        fields.Expocad_Booth_Type__c = this.selectedValuesBoothType.join(';');
        fields.Expocad_Product_Type__c= this.selectedMatchProduct.join(';');
        if (!this.errorMessage) {
        this.template.querySelector('.globalEditForm').submit(fields)
        }
    }
    onSucessManualUpdated(event){
        this.recordId = event.detail.id;
           const evt = new ShowToastEvent({
                title: "Success",
                message: "Record Is Updated Sucessfully",
                variant: "success"
            });
            this.dispatchEvent(evt);
            this.refreshTable();
            this.openEditModal = false;
            window.location.href = '/lightning/n/ops_customer_centre_manuals#id=' + this.eId + '&esid=' + this.esId;
        
    }
    get acceptedFormats() {
        return ['.pdf'];
    }

    handleUploadFinished(event) {
        this.attachmentId = '';
        const uploadedFiles = event.detail.files;
        let data = JSON.parse(JSON.stringify(uploadedFiles));
        let attachmentName = data[0].name;
        let attachId = data[0].documentId;
        this.attachmentId = attachId;

        let record;

        if (this.recordId !== '') {
            record = this.recordId;
        }
        this.openNewModal = false;
        updateAttachOnManuals({ ManualId: record, AttId: attachId, AttName: attachmentName })
            .then(() => {
            })
            .catch(error => {
                window.console.log("error..." + JSON.stringify(error));
            });
        this.refreshTable(); // BK-13198
        window.location.reload(); // BK-13198
    }

    handleEditUploadFinished(event) {
        this.attachmentId = '';
        const uploadedFiles = event.detail.files;
        let data = JSON.parse(JSON.stringify(uploadedFiles));
        let attachmentName = data[0].name;
        let attachId = data[0].documentId;
        let record;
        if (this.recordId !== '') {
            record = this.recordId;
        }
        this.attachName = attachmentName;
        this.attachmentId = attachId;
        updateAndDeleteAttOnManuals({
            ManualId: record, AttID: attachId, AttName: attachmentName })
            .then(() => {
            })
            .catch(error => {
                window.console.log("error..." + JSON.stringify(error));
            });
    }

    closeModal() {
        this.errorMessage = '';
        this.openNewModal = false;
        this.openEditModal = false;
        this.viewManualModal = false;
        this.refreshTable();
    }

    //BK-5771 Start
    closeModalNew() {
        this.errorMessage = '';
        this.openNewModal = false;
        this.openEditModal = false;
        this.viewManualModal = false;
        if(this.recordId){
            this.selectedRecordId = this.recordId;
            this.yesDeleteSingleRecord('show');
            this.isPDF = false; 
            this.refreshTable();
        }
        else{
            this.isPDF = false;
            this.refreshTable();
        }
    }
    // BK-5771 End

    deleteForm(event) {
        let formID = event.target.dataset.recordId;
        this.isOpenSingleDeleteModal = true;
        this.selectedRecordId = formID;
    }
    handleNewModal(){
        window.clearTimeout(this.delayTimeout);
        this.openNewModal = false;
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(()=>{
            this.saveDisable = false;
            this.openNewModal = true;
            this.showForm = true;
            this.showLinkField = false;
            this.selectedValuesBoothTypeNew = [];
            this.selectedMatchProductNew = [];
        },DELAY);        
    }
    handleSorting(event) {
        let prevSortDir = this.sortType;
        let prevSortedBy = this.sortByName;
        const newSortedBy = event.currentTarget.id.split('-')[0];
        let iconName = 'utility:arrowup';
        let sortFieldName = newSortedBy;

        this.sortByFieldName = sortFieldName;
        if (sortFieldName.toLowerCase().indexOf('namelink') >= 0 || sortFieldName.toLowerCase().indexOf('name__clink') >= 0) {
            const n = sortFieldName.lastIndexOf('Link');
            sortFieldName = sortFieldName.slice(0, n) + sortFieldName.slice(n).replace('Link', '').trim();
        }

        this.sortByName = sortFieldName;

        if (sortFieldName === prevSortedBy && prevSortDir === 'asc') {
            this.sortDirection = 'desc';
            this.sortType = 'desc';
            iconName = 'utility:arrowdown';
        }
        else if (sortFieldName === prevSortedBy && prevSortDir === 'desc') {
            this.sortDirection = 'asc';
            this.sortType = 'asc';
            iconName = 'utility:arrowup';
        }
        else if (sortFieldName !== prevSortedBy) {
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
        this.delayTimeout = setTimeout(() => {
            this.currentPageNo = 1;
            this.offst = 0;
            this.hasNext = false;
            this.hasPrev = false;

            this.highLightNumber(1);
            this.getData();
        }, DELAY);

    }
    resetColumnClass() {
        const els = this.template.querySelectorAll(".slds-is-sortable");
        els.forEach((item) => {
            window.jQuery(item).removeClass('slds-has-focus');
            item.querySelector('lightning-icon').iconName = 'utility:arrowup';
            item.querySelector('lightning-icon').style = 'fill:rgb(0, 112, 210)';
        });
    }

viewManual(event){
    // eslint-disable-next-line no-alert
    let tempArr = this.tableData;
    let manualType = tempArr[event.currentTarget.dataset.id].Manual_Type__c;
    let manualUrl = tempArr[event.currentTarget.dataset.id].Url__c;
    this.manualName = tempArr[event.currentTarget.dataset.id].Name;
    let manualAttachId = tempArr[event.currentTarget.dataset.id].Uploaded_Attachment_Id__c;
        if(manualType==='Link'){
            if(manualUrl){
                if(!manualUrl.includes("http:") && !manualUrl.includes("https:"))
                {
                 let newUrl= "https://" +manualUrl;
                 manualUrl = newUrl;
                }
            }
         this.iframeLinkValue = manualUrl;
         this.linkTypeTemplate=true;
         this.downloadablePdfTypeTemplate=false;    
        } 
        else if(manualType==='Downloadable PDF'){
            let fileId1 = manualAttachId.toString();
            let fileId2 = fileId1.match(/00P/);
            if(fileId2){
                this.pdf= '/servlet/servlet.FileDownload?file=' +manualAttachId;
            }
            else{
               getContentVerId({
                   docId: manualAttachId
                   })
                   .then(result => {
                       let fileId = result.Id;
                       this.pdf = '/sfc/servlet.shepherd/version/download/'+fileId;
                   })
                   .catch(error => {
                       window.console.log("error..." + JSON.stringify(error));
                   });
               }
                        
            this.linkTypeTemplate=false;
            this.downloadablePdfTypeTemplate=true; 
        }
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(()=>{
            this.viewManualModal = true;
        },DELAY);
}

viewLink(){
    window.open(this.iframeLinkValue, '_blank');
}


}