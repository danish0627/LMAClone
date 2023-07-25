/******
Created By	 : (Himanshu[STL-19])
Created On	 : August 6, 2019
@description : This is simple drawer table component and apply all other feature like pagination, sorting, filter and search.

Modification log --
Modified By	: (Prashant[STL-282,STL-268] October 16 2019),[Aishwarya 10 June 2020 BK-5252],[Aishwarya 27 Jan 2021 BK-12824]
********/

/* eslint-disable no-console */
import { LightningElement, track, api, wire } from 'lwc';
import getDatas from '@salesforce/apex/CommonTableController.getGenericObjectRecord';
import getFileDetail from '@salesforce/apex/CommonTableController.getFileDetail';
import updateUserFormAction from '@salesforce/apex/CC_CustomerFormListCtrl.updateUserFormAction';
import getContentVerId from '@salesforce/apex/OPS_FormTemplatesCtrl.getContentVersionId';
import getFormSetting from "@salesforce/apex/LtngUtilityCtrl.getRecords";
import {loadScript} from 'lightning/platformResourceLoader';
import jquery from '@salesforce/resourceUrl/jquery_core';
import userId from '@salesforce/user/Id';
import {handleErrors, showToast }  from 'c/lWCUtility';
import {CurrentPageReference} from 'lightning/navigation';
import Form from '@salesforce/label/c.Form';
import Name from '@salesforce/label/c.Name';
import Category from '@salesforce/label/c.Category';
import Viewed from '@salesforce/label/c.Viewed';
import Status from '@salesforce/label/c.Status';
import Type from '@salesforce/label/c.Type';
import Provider from '@salesforce/label/c.Provider';
import Deadline from '@salesforce/label/c.Deadline';
import Required from '@salesforce/label/c.Required';
import Forms from '@salesforce/label/c.Forms';
import Additional from '@salesforce/label/c.Additional';
import close from '@salesforce/label/c.Close';
import currentUserId from '@salesforce/user/Id';
import LastUpdated from '@salesforce/label/c.Last_Updated';
import By from '@salesforce/label/c.By';
import Cancel from '@salesforce/label/c.Cancel';
import LinkPdfFormAlert from '@salesforce/label/c.Link_and_Pdf_Form_Alert';
import FormAgreement from '@salesforce/label/c.Form_Agreement';
import Agree from '@salesforce/label/c.Agree';

const DELAY = 300;
export default class Cc_createCustomerFormListTable extends LightningElement {

    label = {Form,Name,LastUpdated,Cancel,LinkPdfFormAlert,FormAgreement,Agree,By,Category,Viewed,Status,Type, Provider, Deadline, Required, Forms, Additional, close};
    lastUpdatedBy = this.label.LastUpdated + ' ' + this.label.By;
    //action properties
    @api isSupportNewRecord = 'false';
    @track isOpenSingleDeleteModal = false;
    @track selectedRecordId;
    //Pagination properties
    @track pagesize = 50;
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
    @api sortByName = '';
    @api sortType = '';

    //Set object and fields to create datatable
    @track tableData;
    @track tableColumn;
    @api objectName = 'User_Form_Action__c';
    @api objectLabel = 'User Form Action';
    @track showUpdatedHeading = false;
    @track formUrl;
    @track formId;
    @track formType;
    @track uploadAttachId;
    @track url;

    @api fields = 'Form_Permission__r.Event_Edition_Form__r.Forms__r.Name,Form_Permission__r.Event_Edition_Form__r.Form_Group__c,Form_Permission__r.Event_Edition_Form__r.Form_Type__c,Form_Permission__r.Event_Edition_Form__r.Provider__c,Form_Permission__r.Event_Edition_Form__r.Deadline__c,Form_Permission__r.Event_Edition_Form__r.Forms__r.Url__c,Form_Permission__r.Event_Edition_Form__r.Allow_Submit_After_Deadline__c,Form_Permission__r.Event_Edition_Form__r.Forms__r.Uploaded_Attachment_Id__c,Form_Permission__r.Event_Edition_Form__r.Template_Form__c,Is_Viewed__c,Is_Filled_Up__c,Status__c,StatusDisplay__c,Last_Updated_By__r.Name,Last_Updated_Date__c,Last_Updated_By__c,Last_Updated_By__r.ContactId';
    @api fieldsLabel = 'FORM NAME,CATEGORY,FORM TYPE,PROVIDER,DEADLINE,VIEWED,STATUS';
    @api condition = 'Id!=\'\'';
    @track tempCondition = '';
    @api profile = 'System Administrator';
    @api isViewFile = 'false';
    @api message;
    @api lsteventsetting;
    @api formtype;
    @api isShowAction = 'false';
    @api showActionButton = 'false';
    @track eventcode;
    @track showLinkOrPdfDialog = false;
    //Filter property
    //Owner Filter
    @api isFilterByOwner;
    @api selectedOwner;
    @track showRequired;
    @track showAdditional;

    //filter1
    @api filterField1;
    @api filter1Label;
    @api isMultiPicklistFilter1;
    @track filterField1Options;
    @track filterField1Value = '';

    //filter 2
    @api filterField2;
    @api filter2Label;
    @api isMultiPicklistFilter2;
    @track filterField2Options;
    @track filterField2Value = '';

    //filter 3
    @api filterField3;
    @api filter3Label;
    @api isMultiPicklistFilter3;
    @track filterField3Options;
    @track filterField3Value = '';

    @track error;
    @track firstTime;
    @track spinner;
    @track isShow;
    @track colSpan;

    @track downloadModal;
    @track pdf;
    @track bShowModal;
    @track showPagination;
    @track showTable;
    @track url;
    @track showSpinner = true;

    @api eventEditionCode; // used from customer list component

    @wire(CurrentPageReference)
    setCurrentPageReference(currentPageReference) {
        this.selectedOwner = userId;
        //Load jquery
        loadScript(this, jquery)
            .then({

            })
            .catch(error => {
                showToast(this, error, 'error', 'Error');
            })
        this.firstTime = true;
        this.spinner = false;
        this.hasNext = false;
        this.hasPrev = false;
        this.pagesize = 50;
        this.offst = 0;
        const col = [];
        if (typeof this.fields === 'string') {
            this.fields.split(',').forEach((item, i) => {
                col.push({
                    label: this.fieldsLabel.split(',')[i],
                    fieldName: item.trim()
                });
            });
            this.colSpan = col.length + 1;
        } else {
            this.fields = '';
        }

        if (typeof this.objectName != 'string') {
            this.objectName = '';
        }
        this.tableColumn = col;

        this.isShow = this.spinner === false && this.firstTime;
        if (this.formtype === 'Required') {
            this.showRequired = true;
        }
        if (this.formtype === 'Addtional') {
            this.showAdditional = true;
        }

        if (currentPageReference && currentPageReference.state && currentPageReference.state.eventcode) {
            this.eventcode = currentPageReference.state.eventcode;
            this.fetchForms(this.eventcode);
        }
        else if (this.eventEditionCode) {
            this.eventcode = this.eventEditionCode;
            this.fetchForms(this.eventcode);
        }

    }
    fetchForms(evntCode) {
        getFormSetting({ objName: 'Event_Settings__c', fieldNames: 'id, Forms_Title__c ,Welcome_Text_Forms__c ,Deadline_Reached_Message_for_Forms__c ,Forms_Sub_Title__c ,Button_colors__c,Button_Text_Color__c', compareWith: 'Event_Edition__r.Event_Code__c', recordId: evntCode, pageNumber: 1, pageSize: 1 })
            .then(result => {
                this.eventDtls = result.recordList[0];
                this.handleFilterChange();
                this.message = this.eventDtls.Deadline_Reached_Message_for_Forms__c; //BK-12824
            })
            .catch(error => {
                window.console.log('error...' + JSON.stringify(error));
            });
    } 
    getData() {
        this.pagesizeVisible = this.pagesize.toString();
        this.spinner = true;
        getDatas({
            searchValue: this.searchValue,
            objectName: this.objectName,
            fieldstoget: this.fields,
            pagesize: this.pagesize,
            next: this.hasNext,
            prev: this.hasPrev,
            off: this.offst,
            sortBy: this.sortByName,
            sortType: this.sortType,
            condition: this.tempCondition,
            isAggregate: false
        })
        .then(data => {
            if (this.offst === -1) {
                this.offst = 0;
            }
            this.firstTime = false;
            this.spinner = false;
            this.isShow = this.spinner === false && this.firstTime;

            const totalRows = data.total > 2000 ? 2000 : data.total;
            this.tableColumn = data.ltngTabWrap.tableColumn;

            this.setParentFieldColumn(this.tableColumn, this.fields, data.ltngTabWrap.tableRecord);
            this.totalPage = Math.ceil(totalRows / this.pagesize);
            this.totalRows = totalRows;
            this.isMoreThan2000 = data.total > 2000 ? true : false;
            let lastind = parseInt(data.offst + this.pagesize, 10);

            if (data.total < lastind) {
                lastind = data.total;
            }
            if (this.totalRows > 15) {
                this.showPagination = true;
            }
            this.showPageView = 'Showing: ' + parseInt(data.offst + 1, 10) + '-' + lastind;

            this.generatePageListUtil();
            if (totalRows === 0) {
                this.error = 'No record found';

                this.tableData = undefined;
                this.pageList = undefined;
            } else {
                this.error = undefined;
                this.showTable = 'true';
            }
            this.showSpinner = false;

        })
        .catch(error => {
            this.tableData = undefined;
            this.error = error;
            handleErrors(this, error);
            this.showSpinner = false;
        });
    }

    @track pagesizeVisible

    handleFilterChange() {
        let condition = this.condition;
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
        let condition = this.condition;
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
                if (this.objectName.toLowerCase() === 'attachment') {
                    let win = window.open("https://" + window.location.host + "/CustomerCenter/servlet/servlet.FileDownload?file=" + row.Id, '_blank');
                    win.focus();
                } else {
                    this.openFile(row.Id);
                }
                break;
            case 'openactionmodal':
                this.openActionModal(row.Id);
                break;
            default:
        }
    }
    noDelete() {
        this.selectedRecordId = '';
        this.isOpenSingleDeleteModal = false;
    }
    setParentFieldValue(tbldatas) {
        let datas = JSON.parse(JSON.stringify(tbldatas));
        for (let i = 0; i < datas.length; i++) {
            datas[i].showUpdated = false;
            datas[i].RecordId = 'a' + datas[i].Id;
            //build link
            if (datas[i].hasOwnProperty('Name')) {
                datas[i].NameLink = '/lightning/r/' + this.objectName + '/' + datas[i].Id + '/view';
            }
            if (datas[i].Last_Updated_By__c && datas[i].Last_Updated_Date__c && currentUserId !== datas[i].Last_Updated_By__c && datas[i].Last_Updated_By__r.ContactId) {
                datas[i].showUpdated = true;
                this.showUpdatedHeading = true;
                datas[i].updatedBy = datas[i].Last_Updated_By__r.Name;
                datas[i].updatedDate = datas[i].Last_Updated_Date__c;
            }

            if (typeof datas[i] === 'object') {
                // Parent table data
                // eslint-disable-next-line guard-for-in                
                for (let k in datas[i]) {
                    if (datas[i].hasOwnProperty(k) && typeof datas[i][k] === 'object') {
                        Object.keys(datas[i][k]).forEach(item => {
                            datas[i][k + '' + item] = datas[i][k][item];
                            if (item.toLowerCase() === 'name') {
                                datas[i][k + 'NameLink'] = '/lightning/r/' + k + '/' + datas[i][k].Id + '/view';
                            }
                        });
                        //three level data                        
                        for (let j in datas[i][k]) {
                            if (datas[i][k].hasOwnProperty(j) && typeof datas[i][k][j] === 'object') {
                                Object.keys(datas[i][k][j]).forEach(item => {
                                    if (typeof datas[i][k][j][item] !== 'object') {
                                        datas[i][k + '' + j + '' + item] = datas[i][k][j][item];
                                        if (item.toLowerCase() === 'name') {
                                            datas[i][k + '' + j + '' + item + 'Link'] = '/lightning/r/' + j + '/' + datas[i][k][j].Id + '/view';
                                        }
                                    } else {
                                        Object.keys(datas[i][k][j][item]).forEach(item2 => {
                                            datas[i][k + '' + j + '' + item + '' + item2] = datas[i][k][j][item][item2];
                                            if (item2.toLowerCase() === 'name') {
                                                datas[i][k + '' + j + '' + item + '' + item2 + 'Link'] = '/lightning/r/' + item + '/' + datas[i][k][j][item].Id + '/view';
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

    setParentFieldColumn(columnObj, columnList, datas) {
        columnObj = JSON.parse(JSON.stringify(columnObj));
        columnList = JSON.parse(JSON.stringify(columnList));

        if (columnList.indexOf('.') > 0) {
            let col = columnList.split(',');
            for (let i = 0; i < col.length; i++) {
                let test = col[i].split('.');
                let label = this.fieldsLabel.split(',')[i];
                if (col[i].indexOf('.') > 0 && test.length === 2) {
                    columnObj.splice(i, 0, {
                        fieldName: col[i],
                        label: label
                    });
                }
                if (col[i].indexOf('.') > 0 && test.length === 3) {
                    columnObj.splice(i, 0, {
                        fieldName: col[i],
                        label: label
                    });
                }
            }
        }
        if (this.isViewFile === 'true') {
            columnObj.splice(0, 0, {
                type: "button-icon",
                typeAttributes: {
                    iconName: 'utility:preview',
                    name: 'viewfile',
                    title: 'View File',
                    variant: 'bare',
                    disabled: false,
                    value: {
                        fieldName: 'Id'
                    }
                }
            });
        }
        if (this.showActionButton === 'true') {
            columnObj.splice(0, 0, {
                type: "button-icon",
                typeAttributes: {
                    iconName: 'utility:new_window',
                    name: 'openactionmodal',
                    title: 'Open',
                    variant: 'bare',
                    disabled: false,
                    value: {
                        fieldName: 'Id'
                    }
                }
            });
        }

        for (let i = 0; i < columnObj.length; i++) {
            //format date field
            if (columnObj[i].type === 'textarea' || columnObj[i].type === 'button-icon' || columnObj[i].type === 'multipicklist') {
                columnObj[i].sortable = false;
            } else {
                columnObj[i].sortable = true;
            }

            if (columnObj[i].type === 'datetime') {
                columnObj[i].type = 'date';
                columnObj[i].typeAttributes = {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                }
            }
            //format date field
            if (columnObj[i].type === 'date') {
                columnObj[i].typeAttributes = {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                }
            }

            if (columnObj[i].type === 'currency') {
                columnObj[i].cellAttributes = {
                    alignment: 'left'
                };
            }
            if (columnObj[i].fieldName !== undefined && columnObj[i].fieldName.toLowerCase().indexOf('name') >= 0) {
                if (columnObj[i].fieldName.toLowerCase() !== 'stagename') {
                    columnObj[i].type = 'url';
                    columnObj[i].typeAttributes = {
                        label: {
                            fieldName: columnObj[i].fieldName
                        },
                        tooltip: 'Open in new tab',
                        target: '_blank'
                    };
                    columnObj[i].fieldName = columnObj[i].fieldName + 'Link';
                }
            }
        }
        if (this.isShowAction === 'true') {
            let actions = [{
                label: 'Edit',
                title: 'Click to Edit',
                name: 'edit',
                iconName: 'utility:edit'
            }];
            if (this.profile === 'System Administrator' || this.profile === 'GE System Administrator' || this.profile === 'GE BA Administrator') {
                actions.push({
                    label: 'Delete',
                    title: 'Click to Delete',
                    name: 'delete',
                    iconName: 'utility:delete'
                })
            }

            if (this.profile === 'System Administrator' || this.profile === 'GE System Administrator' || this.profile === 'GE BA Administrator' || this.profile === 'SSC Finance-Accounting') {
                columnObj.push({
                    label: 'Action',
                    type: 'action',
                    typeAttributes: {
                        rowActions: actions
                    }
                });
            }
        }

        this.tableColumn = columnObj;
        this.setParentFieldValue(datas)
    }

    // Table pagination, sorting and page size change actions Start
    getNextData() { //Table Action 1
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

    getPrevData() { //Table Action 2
        if (this.currentPageNo === 1) {
            return;
        }
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
        const searchValue = this.template.querySelector(".search-box").value;
        if (searchValue.length > 2 || searchValue.length === 0) {
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
    }


    resetColumnClass() {
        const els = this.template.querySelectorAll(".slds-is-sortable");
        els.forEach((item) => {
            window.jQuery(item).removeClass('slds-has-focus');
            item.querySelector('lightning-icon').iconName = 'utility:arrowup';
            item.querySelector('lightning-icon').style = 'fill:rgb(0, 112, 210)';
        });
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
        const ele = event.currentTarget;
        this.resetColumnClass();
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
        } catch (e) {
            console.error(e);
        }
    }

    generatePageListUtil() { // Util Method 2
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

    handlePagesize(event) { //Table Action 4
        const pagesize = parseInt(event.target.value, 10);
        this.currentPageNo = 1;
        window.clearTimeout(this.delayTimeout);
        const offset = (this.currentPageNo * pagesize) - pagesize;

        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(() => {
            this.pagesize = pagesize;
            this.offst = offset;
            this.getData();
        }, DELAY);
    }
    // Table pagination, sorting and page size change actions END

    get ownerOptions() {
        return [{
            'label': 'My ' + this.objectLabel,
            'value': userId
        }, {
            'label': 'All ' + this.objectLabel,
            'value': ''
        }];
    }
    get pagesizeList() {
        return [{
            'label': '15',
            'value': '15'
        }, {
            'label': '20',
            'value': '20'
        }, {
            'label': '30',
            'value': '30'
        }, {
            'label': '50',
            'value': '50'
        }];
    }
    get firstActiveClass() {
        return this.currentPageNo === 1 ? 'selected' : '';
    }
    get lastActiveClass() {
        return this.currentPageNo === this.totalPage ? 'selected' : '';
    }
    get isTrue() {
        return this.spinner && !this.firstTime;
    }
    get showNewButton() {
        return this.isSupportNewRecord === 'true' ? true : false;
    }
    openFile(parentId) {
        if (parentId) {
            this.spinner = true;
            getFileDetail({
                objectName: 'Attachment',
                fields: 'Id',
                parentId: parentId
            })
                .then(result => {
                    this.spinner = false;
                    if (Array.isArray(result) && result.length > 0) {
                        let win = window.open("https://" + window.location.host + "/CustomerCenter/servlet/servlet.FileDownload?file=" + result[0].Id, '_blank');
                        win.focus();
                    } else {
                        showToast(this, 'No file found', 'error', 'Error');
                    }
                })
                .catch(error => {
                    this.spinner = false;
                    handleErrors(this, error);
                })
        }
    }

    openNewRecordModal() {
        this.dispatchEvent(new CustomEvent('opennewmodal', {
            detail: ''
        }));
    }
    openEditRecordModal(recordId) {
        this.dispatchEvent(new CustomEvent('openeditmodal', {
            detail: recordId
        }));
    }
    openActionModal(recordId) {
        this.dispatchEvent(new CustomEvent('openactionmodal', {
            detail: recordId
        }));
    }
    openAction(event) {
        this.formType = this.tableData[event.target.dataset.id].Form_Permission__r.Event_Edition_Form__r.Form_Type__c;
        this.formUrl = this.tableData[event.target.dataset.id].Form_Permission__r.Event_Edition_Form__r.Forms__r.Url__c
        this.uploadAttachId = this.tableData[event.target.dataset.id].Form_Permission__r.Event_Edition_Form__r.Forms__r.Uploaded_Attachment_Id__c;
        let deadline = this.tableData[event.target.dataset.id].Form_Permission__r.Event_Edition_Form__r.Deadline__c;
        let allowSubmitAfterDeadline = this.tableData[event.target.dataset.id].Form_Permission__r.Event_Edition_Form__r.Allow_Submit_After_Deadline__c;
        let targetId = this.tableData[event.target.dataset.id].Form_Permission__r.Event_Edition_Form__r.Template_Form__c;
        this.formid = this.tableData[event.target.dataset.id].Id;
        let isFilled = this.tableData[event.target.dataset.id].Is_Filled_Up__c;
        let date2;
        let today = new Date();

        if (deadline != null) {
            date2 = new Date(deadline);
        }
        if (this.formType === 'Link') {

            if (allowSubmitAfterDeadline === true) {
                if (isFilled === true) {
                    window.open(this.makeSecureUrl(this.formUrl), '_blank');
                    this.updateUserViewed(this.formid, 'true', true);
                }
                else {
                    this.showLinkOrPdfDialog = true;
                }
            }
            else if (allowSubmitAfterDeadline === false && (date2 >= today && deadline != null)) {

                if (isFilled === true) {
                    window.open(this.makeSecureUrl(this.formUrl), '_blank');
                    this.updateUserViewed(this.formid, 'true', true);
                }
                else {
                    this.showLinkOrPdfDialog = true;
                }
            }
            else if (deadline == null) {
                if (isFilled === true) {
                    window.open(this.makeSecureUrl(this.formUrl), '_blank');
                    this.updateUserViewed(this.formid, 'true', true);
                }
                else {
                    this.showLinkOrPdfDialog = true;
                }
            }
            else {
                this.bShowModal = true;
            }
        } else if (this.formType === 'Downloadable PDF') {
            let attid = this.uploadAttachId;
            let fileId1 = attid.toString();
            let fileId2 = fileId1.match(/00P/);
            if (fileId2) {
                this.url = 'https://' + window.location.host + '/CustomerCenter/servlet/servlet.FileDownload?file=' + attid;
                if (allowSubmitAfterDeadline === true) {
                    if (isFilled === true) {
                        window.open(this.url, '_blank');
                        this.updateUserViewed(this.formid, 'true', true)
                    }
                    else {
                        this.showLinkOrPdfDialog = true;
                    }

                } else if (allowSubmitAfterDeadline === false && (date2 >= today && deadline != null)) {
                    if (isFilled === true) {
                        window.open(this.url, '_blank');
                        this.updateUserViewed(this.formid, 'true', true)
                    }
                    else {
                        this.showLinkOrPdfDialog = true;
                    }

                } else if (deadline == null) {
                    if (isFilled === true) {
                        window.open(this.url, '_blank');
                        this.updateUserViewed(this.formid, 'true', true)
                    }
                    else {
                        this.showLinkOrPdfDialog = true;
                    }
                } else {
                    this.bShowModal = true;
                }
            } else {
                getContentVerId({
                    docId: attid
                })
                    .then(result => {
                        let fileId = result.Id;
                        this.url = 'https://' + window.location.host + '/CustomerCenter/sfc/servlet.shepherd/version/download/' + fileId;

                        if (allowSubmitAfterDeadline === true) {
                            if (isFilled === true) {
                                window.open(this.url, '_blank');
                                this.updateUserViewed(this.formid, 'true', true)
                            }
                            else {
                                this.showLinkOrPdfDialog = true;
                            }
                        } else if (allowSubmitAfterDeadline === false && (date2 >= today && deadline != null)) {
                            if (isFilled === true) {
                                window.open(this.url, '_blank');
                                this.updateUserViewed(this.formid, 'true', true)
                            }
                            else {
                                this.showLinkOrPdfDialog = true;
                            }
                        } else if (deadline == null) {
                            if (isFilled === true) {
                                window.open(this.url, '_blank');
                                this.updateUserViewed(this.formid, 'true', true)
                            }
                            else {
                                this.showLinkOrPdfDialog = true;
                            }
                        } else {
                            this.bShowModal = true;
                        }
                    })
                    .catch(error => {
                        window.console.log("error..." + JSON.stringify(error));
                    });
            }
        } 
        else 
        {
            let eventcode = this.eventcode;
            if (allowSubmitAfterDeadline === true) {
                let urlEventCode = 'https://' + window.location.host + '/CustomerCenter/s/formpreview?Id=' + targetId + '&eventcode=' + eventcode;
                window.open(urlEventCode, '_self');
                this.updateUserViewed(this.formid, 'true', isFilled);
            } else if (allowSubmitAfterDeadline === false && (date2 >= today && deadline != null)) {
                let urlEventCode = 'https://' + window.location.host + '/CustomerCenter/s/formpreview?Id=' + targetId + '&eventcode=' + eventcode;
                window.open(urlEventCode, '_self');
                this.updateUserViewed(this.formid, 'true', isFilled);
            } else if (deadline == null) {
                let urlEventCode = 'https://' + window.location.host + '/CustomerCenter/s/formpreview?Id=' + targetId + '&eventcode=' + eventcode;
                window.open(urlEventCode, '_self');
                this.updateUserViewed(this.formid, 'true', isFilled)
            } else {
                this.bShowModal = true;
            }
        }
    }
    updateUserViewed(formId, isView, isFilled) {

        updateUserFormAction({
            formId: formId,
            isViewed: isView,
            isFilled: isFilled
        })
            .then(result => {
                this.view = result.Is_Viewed__c;
                this.refreshTable();
            })
            .catch(error => {
                window.console.log('error...' + JSON.stringify(error));
                this.error = error;
            });
    }

    closeModal() {
        this.bShowModal = false;
    }
    @api
    refreshTable() {
        this.getData();
    }

    toggleDetail(event) {
        try {
            if (event.target.iconName === 'utility:chevronright') {
                event.target.iconName = "utility:chevrondown";
            } else {
                event.target.iconName = "utility:chevronright";
            }

            const ele = this.template.querySelector("[id^=" + event.target.value + "-]");

            window.jQuery(ele).css({
                width: window.jQuery(ele).parent().width()
            });
            window.jQuery(ele).find('td').css({
                width: window.jQuery(ele).parent().width()
            });
            window.jQuery(ele).slideToggle();
        } catch (e) {
            console.error(e);
        }
    }
    get buttonColor() {
        return 'background-color:' + this.eventDtls.Button_colors__c + ';color:' + this.eventDtls.Button_Text_Color__c;
    }
    // Added for [STL-268]
    handleLinkPdf() {
        if (this.formType === 'Link') {

            window.open(this.makeSecureUrl(this.formUrl), '_blank');
            this.showLinkOrPdfDialog = false;
            this.updateUserViewed(this.formid, 'true', true)
        }
        else if (this.formType === 'Downloadable PDF') {
            window.open(this.url, '_blank');
            this.showLinkOrPdfDialog = false;
            this.updateUserViewed(this.formid, 'true', true)
        }
    }
    makeSecureUrl(url) {
        let finalUrl;
        if (!url.includes("http:") && !url.includes("https:")) {
            finalUrl = "https://" + url;
        } else {
            finalUrl = url;
        }
        return finalUrl;
    }
    closeLinkPdfModal() {
        this.showLinkOrPdfDialog = false;
    }
}