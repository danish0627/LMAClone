/*
Created By	 : (Sunil)
Created On	 : Sep 4, 2019
@description : This component is use to show Report under Form Settings in Customer Center.

Modification log --
Modified By	: 
*/


import { LightningElement, track, api,wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

import getFormList from '@salesforce/apex/FormReportController.searchForm';
const DELAY = 300;
export default class Ops_formReport extends NavigationMixin(LightningElement) {
 @track txtSearch='';
 @api pageNumber = 1;  
 @track pageSize = 10;
 @api totalRecords = 0;  
 @api totalPage = 0;  
 @track tableData=[];
    
 @wire(getFormList,{pageNumber:'$pageNumber',pageSize:'$pageSize',searchTxt:'$txtSearch'})    
    wiredAccounts({ error, data }) {
        if (data) {
            this.tableData = data.formList;
            this.totalRecords = data.totalRecords;
            this.totalPage=Math.ceil(this.totalRecords /this.pageSize);
        } else if (error) {
        }
    }
    searchData(event){
        this.txtSearch = event.target.value;
    }

}