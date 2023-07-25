/*
Created By	 : (Mukesh Gupta[STL-216])
Created On	 : 3 Oct, 2019
@description : Display User form and this component used on (opsExhibitorProfileReports) component

Modification log --
Modified By	: 
*/

/* eslint-disable no-console */
import {
    LightningElement,
    track,
    api

}
from 'lwc';
import getDatas from '@salesforce/apex/CommonTableController.getGenericObjectRecord';
import getAggregateData from '@salesforce/apex/CommonTableController.getAggregateData';


import updateUserFormAction from '@salesforce/apex/CC_CustomerFormListCtrl.updateUserFormAction';

import getFormSetting from "@salesforce/apex/LtngUtilityCtrl.getRecords";

import {
    loadScript
}
from 'lightning/platformResourceLoader';
import jquery from '@salesforce/resourceUrl/jquery_core';

import userId from '@salesforce/user/Id';
import {
    handleErrors,
    showToast
}
from 'c/lWCUtility';


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

const DELAY = 300;

export default class OpsCustomerListFormTab extends LightningElement {

    label = {
        Form,
        Name,
        Category,
        Viewed,
        Status,
        Type,
        Provider,
        Deadline,
        Required,
        Forms,
        Additional,
        close
    };
    //action properties
    @api isSupportNewRecord = 'false';
    @track isOpenModal = false;
    @track selectedRecordId;

    //Pagination properties
    @track pagesize = 15;
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

    @api fields = 'Form_Permission__r.Event_Edition_Form__r.Forms__r.Name,Form_Permission__r.Event_Edition_Form__r.Form_Type__c,Form_Permission__r.Event_Edition_Form__r.Provider__c,Form_Permission__r.Event_Edition_Form__r.Deadline__c,Form_Permission__r.Event_Edition_Form__r.Forms__r.Url__c,Form_Permission__r.Event_Edition_Form__r.Allow_Submit_After_Deadline__c,Form_Permission__r.Event_Edition_Form__r.Forms__r.Uploaded_Attachment_Id__c,Form_Permission__r.Event_Edition_Form__r.Template_Form__c,Is_Viewed__c,Status__c,StatusDisplay__c,Form_Permission__r.Event_Edition_Form__r.Forms__r.Doc_Type__c,Is_Filled_Up__c,User_Form_Contact__r.Name';
    @api fieldsLabel = 'FORM NAME,CATEGORY,FORM TYPE,PROVIDER,DEADLINE,VIEWED,STATUS';
    @api condition;
    @track tempCondition = '';
    @api profile = 'System Administrator';
    @api isViewFile = 'false';
    @api message;
    @api lsteventsetting;
    @api formtype;
    @api isShowAction = 'false';
    @api showActionButton = 'false';
    @track eventcode;
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

    @api accountId;
    @api eventEditionCode; // used from customer list component
    @track hideTable;//used to hide table if there is record count 0 
    connectedCallback() {

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
        this.pagesize = 15;
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

        if(this.condition){
            this.isShow = this.spinner===false && this.firstTime;
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
            if (this.formtype === 'Required') {
                this.showRequired = true;
            }
            if (this.formtype === 'Addtional') {
                this.showAdditional = true;
            }
            this.eventcode = this.eventEditionCode;
            this.fetchForms(this.eventcode);
        }
    }
    fetchForms(evntCode)
    {
        getFormSetting({objName:'Event_Settings__c',fieldNames:'id, Forms_Title__c ,Welcome_Text_Forms__c ,Deadline_Reached_Message_for_Forms__c ,Forms_Sub_Title__c ,Button_colors__c,Button_Text_Color__c',compareWith:'Event_Edition__r.Event_Code__c',recordId:evntCode,pageNumber:1,pageSize:1})
            .then(result => {
                this.eventDtls=result.recordList[0];
                this.handleFilterChange();
            })
            .catch(error => {
                window.console.log('error...'+JSON.stringify(error));
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
                condition: this.tempCondition
            })
            .then(data => {
                if (this.offst === -1) {
                    this.offst = 0;
                }
                this.firstTime = false;
                this.spinner = false;
                this.isShow = this.spinner === false && this.firstTime;

                const totalRows = data.total > 2000 ? 2000 : data.total;

                if(totalRows>0){
                    this.hideTable = true;
                }
                else{
                    this.hideTable = false;
                }
                
                data.ltngTabWrap.tableRecord.forEach(item=>{
                    if(item.Form_Permission__r.Event_Edition_Form__r.Forms__r.Doc_Type__c==='Online'){
                        item.isVisibleIcon = true;
                    }
                })
                
                this.tableData = data.ltngTabWrap.tableRecord;

                this.tableColumn = data.ltngTabWrap.tableColumn;

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

            })
            .catch(error => {
                this.tableData = undefined;
                this.error = error;
                handleErrors(this, error);
            });
    }

 @track pagesizeVisible
  
    handleFilterChange() {
        //this.spinner = true;

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

handleSorting(event){
    let prevSortDir = this.sortType;
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
    const ele = event.currentTarget;
    this.resetColumnClass();
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

    setFilterOpptions(filterNum, fieldName) {
        getAggregateData({
                condition: this.condition,
                objectName: this.objectName,
                fieldName: fieldName
            })
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
                        opt.push({
                            label: 'Empty (' + obj[i].expr0 + ')',
                            value: 'NULL',
                            isChecked: false
                        });
                    } else {
                        opt.push({
                            label: obj[i][f] + ' (' + obj[i].expr0 + ')',
                            value: obj[i][f],
                            isChecked: false
                        });
                    }
                }
                if (filterNum === 1) {
                    opt.splice(0, 0, {
                        label: 'All ' + this.filter1Label,
                        value: '',
                        isChecked: true
                    });
                    this.filterField1Options = opt;
                } else if (filterNum === 2) {
                    opt.splice(0, 0, {
                        label: 'All ' + this.filter2Label,
                        value: '',
                        isChecked: true
                    });
                    this.filterField2Options = opt;
                } else if (filterNum === 3) {
                    opt.splice(0, 0, {
                        label: 'All ' + this.filter3Label,
                        value: '',
                        isChecked: true
                    });
                    this.filterField3Options = opt;
                }
            })
            .catch(error => {
                console.error(error);
                handleErrors(this, error);
            });
    }

    buildCondition() {
        let condition = this.condition;

        //Only for Owner filter
        if (this.isFilterByOwner === 'true') {
            this.selectedOwner = this.template.querySelector(".ownerfilter") ? this.template.querySelector(".ownerfilter").value : userId;
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
            customCond = customCond + ' OR ' + this.filterField2 + ' IN (\'' + selectedValue2 + '\') ';
            customCond = customCond + ' OR ' + this.filterField3 + ' IN (\'' + selectedValue3 + '\')) ';
        } else if (selectedValue1 !== '' && selectedValue2 !== '' && selectedValue3 === '') {
            customCond = customCond + ' AND (' + this.filterField1 + ' IN (\'' + selectedValue1 + '\') ';
            customCond = customCond + ' OR ' + this.filterField2 + ' IN (\'' + selectedValue2 + '\')) ';
        } else if (selectedValue1 !== '' && selectedValue2 === '' && selectedValue3 !== '') {
            customCond = customCond + ' AND (' + this.filterField1 + ' IN (\'' + selectedValue1 + '\') ';
            customCond = customCond + ' OR ' + this.filterField3 + ' IN (\'' + selectedValue3 + '\')) ';
        } else if (selectedValue1 === '' && selectedValue2 !== '' && selectedValue3 !== '') {
            customCond = customCond + ' AND (' + this.filterField2 + ' IN (\'' + selectedValue2 + '\') ';
            customCond = customCond + ' OR ' + this.filterField3 + ' IN (\'' + selectedValue3 + '\')) ';
        } else if (selectedValue1 !== '') {
            customCond = customCond + ' AND (' + this.filterField1 + ' IN (\'' + selectedValue1 + '\')) ';
        } else if (selectedValue2 !== '') {
            customCond = customCond + ' AND (' + this.filterField2 + ' IN (\'' + selectedValue2 + '\')) ';
        } else if (selectedValue3 !== '') {
            customCond = customCond + ' AND (' + this.filterField3 + ' IN (\'' + selectedValue3 + '\')) ';
        }
        customCond = customCond.replace(/NULL/g, '');
        return condition + customCond;
    }

    get isTrue() {
        return this.spinner && !this.firstTime;
    }
    get showNewButton() {
        return this.isSupportNewRecord === 'true' ? true : false;
    }
    
    updateUserViewed(formId, isView) {

        updateUserFormAction({
                formId: formId,
                isViewed: isView
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

    @api
    refreshTable() {
        this.getData();
    }

    get buttonColor(){
        return 'background-color:'+ this.eventDtls.Button_colors__c+ ';color:'+this.eventDtls.Button_Text_Color__c;
    }

    @track iframeURL;
    openDocument(event){
        let tempId = this.tableData[event.target.value].Form_Permission__r.Event_Edition_Form__r.Template_Form__c;
        tempId = tempId?tempId:'';
        this.iframeURL  ='/apex/FormPreviewOpsAdmin?Id='+tempId+'&eventCode='+this.eventcode+'&AccId='+this.accountId;
        this.isOpenModal = true;
    }

    closeModal(){
        this.isOpenModal = false;
    }
}