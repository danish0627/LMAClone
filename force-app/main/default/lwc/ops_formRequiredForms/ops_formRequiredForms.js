/* eslint-disable no-console */
import { LightningElement, track, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getDatas from '@salesforce/apex/CommonTableController.getGenericObjectRecord';
import getAggregateData from '@salesforce/apex/CommonTableController.getAggregateData';
import deleteRecord from '@salesforce/apex/CommonTableController.deleteRecord';
import getFormData from '@salesforce/apex/LtngUtilityCtrl.getRecords';
import getContentVerId from '@salesforce/apex/OPS_FormTemplatesCtrl.getContentVersionId';
import Form from '@salesforce/schema/Form__c';
import { loadScript } from 'lightning/platformResourceLoader';
import jquery from '@salesforce/resourceUrl/jquery_core';
import cloneFormTemplate from '@salesforce/apex/OPS_CloneFormBuilderTemplateCtrl.cloneFormBuilderTemplate';
import userId from '@salesforce/user/Id';
import { handleErrors, showToast } from 'c/lWCUtility';
import { NavigationMixin } from 'lightning/navigation';
import { getRecord } from 'lightning/uiRecordApi';
const FIELDS = ['Event_Edition__c.Event_Code__c', 'Event_Edition__c.Matched_Product_Name__c', 'Event_Edition__c.Booth_Type__c'];
const DELAY = 300;
export default class Ops_formTemplate extends NavigationMixin(LightningElement) {

    formObject = Form;
    @track templateName;
    @track groupValue;
    @track businessValue;
    @track formTypeValue;
    @track showLinkField;
    @track showTemplateField;
    @track showAttach = false;
    @track Name;
    @track BusinessUnit;
    @track FormGroup;
    @track DocType;
    @track Url;
    @track TemplateForm;
    @track FormDescription;
    @track attachName;
    @track attachmentId;
    @track pdf;
    @track temp;
    @track downloadModal;
    @track showDoc;
    @track formName;
    @track lookupCondition;

    @api isSupportNewRecord;
    @api button1Label = 'Create Global Form Template';
    @api button2Label = 'Create Online Form';
    @track isOpenSingleDeleteModal = false;
    @track selectedRecordId;
    @track recordId; // Edit mode
    @track tempId;
    @track openEditModal;
    @track showUploader;
    @track deleteAttach;
    @track errorMessage;


    //Pagination properties
    @track pagesize = 30;
    @track currentPageNo = 1;
    @track totalPages = 0;
    // pagination item list like (1..2-3-4-5..6)    
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

    //Set object and fields to create datatable
    @track tableData;
    @track tableColumn;

    @api objectName = 'Event_Edition_Form__c';
    @api objectLabel = 'Event Edition Forms';
    @api fields = 'Forms__r.Name,Business_Unit__c,Form_Group__c,Form_Type__c,Mandatory__c,Forms__r.Template_Form_Name__c,Forms__r.Uploaded_Attachment_Id__c,Forms__r.Url__c,Forms__r.Template_Form_Name__r.Name,Template_Form__c';
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
    @track showTemplateColumn;


    @api isShowAction = 'true';
    @api showActionButton = 'false';
    //Filter property
    //Owner Filter
    @api isFilterByOwner;
    @api selectedOwner;


    //filter1
    @api filterField1 = '';
    @api filter1Label = '';
    @api isMultiPicklistFilter1;
    @track filterField1Options;
    @track filterField1Value = '';

    //filter 2
    @api filterField2 = '';
    @api filter2Label = '';
    @api isMultiPicklistFilter2;
    @track filterField2Options;
    @track filterField2Value = '';

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

    @track viewFormModal = false;
    @track selectedRecordView;

    @track onLineTypeTemplate = false;
    @track linkTypeTemplate = false;
    @track downloadablePdfTypeTemplate = false;
    @track iframeLinkValue = ''
    @track inputDisabled = true
    @track eId = '';
    @track esId = '';
    @track eventCode = ''
    @api whereCallFrom = '';
    @track showCheckboxField = false;
    @track boothTypeOptions = [];
    @track selectedValuesBoothType = [];

    @track matchProductOptions = [];
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

        if (this.filterField1 !== undefined) {
            this.setFilterOptions(1, this.filterField1);
        }
        if (this.filterField2 !== undefined) {
            this.setFilterOptions(2, this.filterField2);
        }
        if (this.filterField3 !== undefined) {
            this.setFilterOptions(3, this.filterField3);
        }
        this.isShow = this.spinner === false && this.firstTime;

        this.handleFilterChange();
        let fullUrl = window.location.href;
        this.esId = this.GetQS(fullUrl, 'esid');
        this.eId = this.GetQS(fullUrl, 'id');

        if (this.whereCallFrom === 'required') {
            this.prefilledRequiredField = true;
            this.showTemplateColumn = true;
            this.showCheckboxField = true;
        } else if(this.whereCallFrom === 'additonal'){ 
            this.prefilledRequiredField = false;
            this.showTemplateColumn = false;
            this.showCheckboxField = false;
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

    @wire(getRecord, { recordId: '$eId', fields: FIELDS })
    wiredEventObject({ error, data }) {
        if (data) {
            this.eventCode = data.fields.Event_Code__c.value ? data.fields.Event_Code__c.value : '';
            let tempBoothType = data.fields.Booth_Type__c.value ? data.fields.Booth_Type__c.value : '';
            let tempMatchProduct = data.fields.Matched_Product_Name__c.value ? data.fields.Matched_Product_Name__c.value : '';
            try {
                this.boothTypeOptions = [];
                if (tempBoothType.indexOf(",")) {
                    let splitArr = tempBoothType.split(',');
                    let tempArr = [];
                    for (let i = 0; i < splitArr.length; i++) {
                        let obj = { label: splitArr[i], value: splitArr[i] };
                        tempArr.push(obj);
                    }
                    this.boothTypeOptions = tempArr;
                } else {
                    this.boothTypeOptions.push({ label: tempBoothType, value: tempBoothType });
                }
                // eslint-disable-next-line no-empty
            } catch (e) {
            }
            try {
                this.matchProductOptions = [];
                if (tempMatchProduct.indexOf(",")) {
                    let splitArr = tempMatchProduct.split(';');
                    let tempArr = [];
                    for (let i = 0; i < splitArr.length; i++) {
                        let obj = { label: splitArr[i], value: splitArr[i] };
                        tempArr.push(obj);
                    }
                    this.matchProductOptions = tempArr;
                } else {
                    this.matchProductOptions.push({ label: tempMatchProduct, value: tempMatchProduct });
                }
                // eslint-disable-next-line no-empty
            } catch (e) {
            }
        } else if (error) {
            this.isLoading = 'hideLoading';
            this.record = undefined;
        }
    }

    handleChangeBoothType(event) {
        this.selectedValuesBoothType = event.detail.value;
    }

    handleChangeMatchProduct(event) {
        this.selectedMatchProduct = event.detail.value;
    }

    handleChangeBoothTypeNew(event) {
        this.selectedValuesBoothTypeNew = event.detail.value;
    }
 
    handleChangeMatchProductNew(event) {
        this.selectedMatchProductNew = event.detail.value;
    }

    ccUrl() {
        window.location.href = '/lightning/n/ops_customer_centre';
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
                let tempTableData = data.ltngTabWrap.tableRecord;
                let tempDataArr = [];
                for (let i = 0; i < tempTableData.length; i++) {
                    let TemplateFormValue = '';
                    if (tempTableData[i].Template_Form__r && tempTableData[i].Template_Form__r.Name) {
                        TemplateFormValue = tempTableData[i].Template_Form__r.Name;
                    }
                    tempDataArr.push(Object.assign({ TemplateFormName: TemplateFormValue }, tempTableData[i]));
                }
                this.tableData = tempDataArr;

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
     * Called apex action to get aggregate data to set filter options
     * @param filterNum pass which filter number there are three filter but you have to pass filter number
     * @param fieldName field api name name 
     */
    setFilterOptions(filterNum, fieldName) {
        getAggregateData({ condition: this.condition, objectName: this.objectName, fieldName: fieldName })
            .then(result => {
                let f = fieldName.split('.');
                if (f.length === 1) {
                    f = fieldName;
                }
                if (f.length === 2) {
                    f = f[1];
                }
                if (f.length === 3) {
                    f = f[2];
                }

                let obj = JSON.parse(JSON.stringify(result));
                let opt = [];

                for (let i = 0; i < obj.length; i++) {
                    if (obj[i][f] === undefined) {
                        opt.push({ label: 'N/A (' + obj[i].expr0 + ')', value: 'NULL', isChecked: false });
                    }
                    else {
                        opt.push({ label: obj[i][f] + ' (' + obj[i].expr0 + ')', value: obj[i][f], isChecked: false });
                    }
                }
                if (filterNum === 1) {
                    opt.splice(0, 0, { label: 'All ' + this.filter1Label, value: '', isChecked: true });
                    this.filterField1Options = opt;
                }
                else if (filterNum === 2) {
                    opt.splice(0, 0, { label: 'All ' + this.filter2Label, value: '', isChecked: true });
                    this.filterField2Options = opt;
                }
                else if (filterNum === 3) {
                    opt.splice(0, 0, { label: 'All ' + this.filter3Label, value: '', isChecked: true });
                    this.filterField3Options = opt;
                }
            })
            .catch(error => {
                console.error(error);
                handleErrors(this, error);
            });
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
    massUpdateHandler(fieldValues) {
        this.fieldValues = fieldValues;
        this.showMassUpdateConfirmationBar = true;
        let tableData = JSON.parse(JSON.stringify(this.tableData));
        tableData.forEach(item => {
            this.selectedRows.forEach(item2 => {
                if (item.Id === item2.Id) {
                    Object.keys(this.fieldValues).forEach(item3 => {
                        item[item3] = this.fieldValues[item3];
                    });
                }
            });
        });
        this.tableData = tableData;
        JSON.parse(JSON.stringify(this.tableData));
    }

    /**
     * Fire where user click Cancle button of mass update confirmation
     */
    noCancelAll() {
        this.showMassUpdateConfirmationBar = false;
        this.selectedRows = undefined;
        this.selectedTableRows = [];
        this.refreshTable();
    }

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
    yesDeleteSingleRecord() {
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
                    showToast(this, 'Record Deleted', 'success', 'Success');
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


    @track lookupValue = undefined;
    inputGroup(event) {
        this.lookupValue = undefined;
        this.groupValue = event.target.value;
        this.lookupCondition = "Form_Group__c='" + this.groupValue + "' AND Doc_Type__c = '" + this.formTypeValue + "' AND Business_Unit__c = '" + this.businessValue + "'";
    }
    inputBusiness(event) {
        this.businessValue = event.target.value;
        this.lookupValue = undefined;
        this.lookupCondition = "Form_Group__c='" + this.groupValue + "' AND Doc_Type__c = '" + this.formTypeValue + "' AND Business_Unit__c = '" + this.businessValue + "'";
    }
    inputFormType(event) {
        this.lookupValue = undefined;
        this.formTypeValue = event.target.value;
        this.lookupCondition = "Form_Group__c='" + this.groupValue + "' AND Doc_Type__c = '" + this.formTypeValue + "' AND Business_Unit__c = '" + this.businessValue + "'";
    }

    handleformCreated(event) {
        const payload = event.detail;
        this.recordId = payload.id;
        this.tempId=payload.fields.Forms__c.value;
        this.errorMessage = '';
        this.openNewModal = false;
     
        if(payload.fields.Form_Type__c.value === 'Online')
        {
            cloneFormTemplate({
                globalFormId: this.tempId,
                formId: this.recordId 
            })
            .then()
            .catch(error => {
                window.console.log("error..." + JSON.stringify(error));
            });
        }
        else{
            const evt = new ShowToastEvent({
                title: "Success",
                message: "Record Is Created Sucessfully",
                variant: "success"
            });
            this.dispatchEvent(evt);
        }
        this.refreshTable();

        window.location.href = '/lightning/n/ops_customer_centre_forms#id=' + this.eId + '&esid=' + this.esId;
   }
    handleEditUpdated() {
        this.openEditModal = false;
        this.refreshTable();
    }
    get acceptedFormats() {
        return ['.pdf'];
    }

    closeModal() {
        this.errorMessage = '';
        this.openNewModal = false;
        this.openEditModal = false;
        this.viewFormModal = false;
        this.refreshTable();

    }
    deleteForm(event) {
        let formID = event.target.dataset.recordId;
        this.isOpenSingleDeleteModal = true;
        this.selectedRecordId = formID;
    }
    handleNewModal() {
        this.selectedValuesBoothTypeNew = [];
        this.selectedMatchProductNew = [];
        this.openNewModal = true;
    }
    setLookupField(event) {
        this.lookupValue = event.detail.value;
    }

    handleeditformSubmit(event) {
        event.preventDefault();
        this.errorMessage = '';
        // stop the form from submitting
        const fields = event.detail.fields;
        let name = fields.Name;
        let formgroup = fields.Form_Group__c;
        let bussUnit = fields.Business_Unit__c;
        let doctyper = this.temp;
        let url = fields.Url__c;
        let online = fields.Template_Form_Name__c;
        if (!name || !formgroup || !bussUnit) {
            this.errorMessage = 'Complete all required fields';
        }
        else if (doctyper === 'Link') {
            if (!url) {
                this.errorMessage = 'Complete all required fields';
            }
        }
        else if (doctyper === 'Online') {
            if (!online) {
                this.errorMessage = 'Complete all required fields';
            }
        }
        if (!this.errorMessage) {
            this.template.querySelector('.globalForm').submit(fields);
        }
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
   
    viewForm(event) {
        this.recordId = event.target.dataset.recordId;
        let tempArr = this.tableData;
        let formType = tempArr[event.currentTarget.dataset.id].Form_Type__c;
        let formUrl = tempArr[event.currentTarget.dataset.id].Forms__r.Url__c;
        let templateForm = tempArr[event.currentTarget.dataset.id].Template_Form__c;
        this.formName = tempArr[event.currentTarget.dataset.id].Forms__r.Name;
        let formAttachId = tempArr[event.currentTarget.dataset.id].Forms__r.Uploaded_Attachment_Id__c;
        if (formType === 'Link') {
            this.iframeLinkValue = formUrl;
            this.linkTypeTemplate = true;
            this.downloadablePdfTypeTemplate = false;
            this.onLineTypeTemplate = false;
        }
        else if (formType === 'Downloadable PDF') {
            let fileId1 = formAttachId.toString();
            let fileId2 = fileId1.match(/00P/);
            if (fileId2) {
                this.pdf = '/servlet/servlet.FileDownload?file=' + formAttachId;
            }
            else {
                getContentVerId({
                    docId: formAttachId
                })
                    .then(result => {
                        let fileId = result.Id;
                        this.pdf = '/sfc/servlet.shepherd/version/download/' + fileId;
                    })
                    .catch(error => {
                        window.console.log("error..." + JSON.stringify(error));
                    });
            }

            this.linkTypeTemplate = false;
            this.downloadablePdfTypeTemplate = true;
            this.onLineTypeTemplate = false;
        }
        else if (formType === 'Online') {
            this.onlineFormView = '/apex/FormPreviewOpsAdmin?Id=' + templateForm + '&eventCode=' + this.eventCode;
            this.onLineTypeTemplate = true;
            this.linkTypeTemplate = false;
            this.downloadablePdfTypeTemplate = false;
        }
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(() => {
            this.viewFormModal = true;
        }, DELAY);
    }
    viewLink() {
        window.open("http://" + this.iframeLinkValue, '_blank');
    }

    openOnlineFile(event) {
        this.recordId = event.target.dataset.recordId;
        this.selectedRecordView = this.tableData[event.currentTarget.dataset.id];
        //window.location.href = '/apex/RedirectUrlForEvent?tempId=' + this.selectedRecordView.Template_Form__c;
        //BK-6789
        window.location.href = '/lightning/n/RedirectUrlForEvent#tempId=' + this.selectedRecordView.Template_Form__c;
    }
    @track provider;
    @track exclusive;
    @track deadline;
    @track submitDeadline;
    @track userType;
    @track required;
    handleEditModal(event) {
        this.recordId = event.target.dataset.recordId;
        let formId = this.recordId;
        let tempTableData = this.tableData;
        this.provider = tempTableData[event.currentTarget.dataset.id].Provider__c;
        this.exclusive = tempTableData[event.currentTarget.dataset.id].Exclusive__c;
        this.deadline = tempTableData[event.currentTarget.dataset.id].Deadline__c;
        this.submitDeadline = tempTableData[event.currentTarget.dataset.id].Allow_Submit_After_Deadline__c;
        this.userType = tempTableData[event.currentTarget.dataset.id].User_Type__c;
        this.required = tempTableData[event.currentTarget.dataset.id].Mandatory__c;
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(()=>{
            this.openEditModal = true;
        },DELAY);
       //get custom dual picklist value for pre-populated
       getFormData({
        objName: "Event_Edition_Form__c",
        fieldNames:
            "id,Expocad_Booth_Type__c,Expocad_Product_Type__c ",
        compareWith: "id",
        recordId: formId,
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

    onsubmitEditForm(event) {
        event.preventDefault();
        const fields = event.detail.fields;
        fields.Expocad_Booth_Type__c = this.selectedValuesBoothType.join(';');
        fields.Expocad_Product_Type__c= this.selectedMatchProduct.join(';');
        
        this.template.querySelector('.globalEditForm').submit(fields)
        
    }
    onSucessFormUpdated(event) {
        this.recordId = event.detail.id;
           const evt = new ShowToastEvent({
                title: "Success",
                message: "Record Is Updated Sucessfully",
                variant: "success"
            });
            this.dispatchEvent(evt);
            this.refreshTable();
            this.openEditModal = false;
            window.location.href = '/lightning/n/ops_customer_centre_forms#id=' + this.eId + '&esid=' + this.esId;
    }
    chkRequired(event) {
        this.prefilledRequiredField = event.target.checked;
    }
    callSaveBtn() {
        this.template.querySelector('.save').click();
    }
    submitForm(event) {
        event.preventDefault();
        this.errorMessage = '';
        const fields = event.detail.fields;
        let formType = fields.Form_Type__c;
        let formGroup = fields.Form_Group__c;
        let businessUnit = fields.Business_Unit__c;
        //form custom lookup value
        let lookupValue = this.lookupValue;
        if (!formType && !formGroup && !businessUnit) {
            this.errorMessage = 'Complete all required fields';
        }
        else if (lookupValue === undefined) {
            this.errorMessage = 'Complete all required fields';
        }
        else {
            fields.Forms__c = lookupValue;
        }
        fields.Event_Edition__c = this.eId;
        fields.Expocad_Booth_Type__c = this.selectedValuesBoothTypeNew.join(';');
        fields.Expocad_Product_Type__c = this.selectedMatchProductNew.join(';');
        fields.Mandatory__c = this.prefilledRequiredField;

        if (!this.errorMessage) {
            this.template.querySelector('.globalForm').submit(fields)
        }

    }


}