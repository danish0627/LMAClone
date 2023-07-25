/*
Created By	 : Himanshu 
Created On	 : September 18, 2019
@description : This component is use to show product categories tab on exhibitor profile .

Modification log --
Modified By	: 
*/


/* eslint-disable no-console */

import {
    LightningElement,
    api,
    track
} from 'lwc';
import {
    handleErrors
} from 'c/lWCUtility';

const DELAY = 300;
export default class Ops_productCategories extends LightningElement {
    @track bShowModal;
    @track searchValue;
    @track spinner;
    @track objectName = 'Levels_Master__c';
    @track fields = 'id,Name,LevelValue__c,MDM_Code__c,Level_Name__c,Mapped_To_Level__r.LevelValue__c';
    @track pagesize;
    @track offst;
    @track tempCondition = 'Mapped_To_Level__r.LevelValue__c!=null';
    @track sortByName = 'LastModifiedDate';
    @track iframeurl;
    @track eventId;
    @track eventEditionId;
    @track recordId;
    @track catData=[];
    @track categories;
    @track productlabels;
    @api lstL3CheckBox;
    @track selectedCat = '';
    @track notSelectedCat = '';


    connectedCallback() {
        this.pagesize = 15;
        this.offst = 0;
        let fullUrl = window.location.href;
        if (fullUrl.indexOf("#") > -1) {
            let IdEventEditionSettings = decodeURIComponent(fullUrl.split("#id=")[1]);
            this.eventEditionId = decodeURIComponent(IdEventEditionSettings.split("&esid=")[0]);
            this.eventId = decodeURIComponent(IdEventEditionSettings.split("&esid=")[0]);
            let Id = decodeURIComponent(IdEventEditionSettings.split("&esid=")[1]);
            this.recordId = Id;
        }
           this.iframeurl='/apex/c__AddProductCategory?eventId='+this.eventEditionId;
    }


    openCategoryModal() {
        this.bShowModal = true;
    }
    openCloseModal() {
    this.handleRefreshTable();
    this.bShowModal = false;
    }
    handleRefreshTable() {
        try {
           this.template.querySelector('c-ops_product-categories-drawer-table').refreshTable();
           
        } catch (error) {
            window.console.error(error);
        }
    }
}