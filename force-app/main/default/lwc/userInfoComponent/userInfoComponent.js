import { LightningElement, track } from 'lwc';
import getOrgDetails from '@salesforce/apex/UserInfoHandler.getOrgDetails';
import getAllOrg from '@salesforce/apex/UserInfoHandler.getAllOrg';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
const columns = [
    { label: 'Name', fieldName: 'Name' , sortable: true},
    { label: 'UserName', fieldName: 'Username', sortable: true},
    { label: 'First Name', fieldName: 'FirstName', sortable: true},
    { label: 'Last Name', fieldName: 'LastName', sortable: true} ,
    { label: 'Email', fieldName: 'Email',  sortable: true} ,
    {label:'Created Date',fieldName:'CreatedDate',sortable:true},
    { label: 'Last Login Date', fieldName: 'LastLoginDate', sortable: true}];
    export default class UserInfoComponent extends LightningElement {
        get options(){
            return this.orgArray;
        }

   LisenseOption = [{label:'Salesforce',value:'Salesforce'}];

    columnHeader = ['Name', 'Username', 'FirstName', ,'LastName','Email','CreatedDate','LastLoginDate']

    pageSizeOptions = [10, 25, 50, 75, 100];
    records = [];
    totalRecords = 0;
    pageSize;
    totalPages;
    pageNumber = 1;
    recordsToDisplay = [];
    rowOffset = 0;
    Isdata = false;
    @track OrgName;
    @track License;
    @track startDate;
    @track endDate;
    columns;
    apiresponsebody = null;
    allrecords = null;
    @track isLoading = false;
    @track sortedBy;
    @track sortedDirection;
    @track value ='';
    @track orgArray = [];
    connectedCallback(){
        getAllOrg()
        .then(result=>{
            let arr = [];
            for(var i = 0; i<result.length; i++){
                arr.push({label : result[i].Name, value : result[i].Name})  
            }
            this.orgArray = arr;

        })   
    }

    handleChanged(event){
     this.value = event.detail.value;
    }

    refresh() {
     window.location.reload(true); 
    }

    get bDisableFirst() {
        return this.pageNumber == 1;
    }
    get bDisableLast() {
        return this.pageNumber == this.totalPages;
    }
    SelectOrg(event){
        this.OrgName = event.target.value;
    }
    LicenseType(event){
        this.License = event.target.value;
    }
    handleStDateCahngeEvent(event){
        this.startDate = event.target.value;
    }
    handleEdDateCahngeEvent(event){
        this.endDate = event.target.value;  
    }
    handleClick(){
        if(this.value!=null &&this.License!=null){
        this.isLoading = true;
        getOrgDetails({OrgName:this.value,License:this.License,startDate:this.startDate,endDate:this.endDate}).then(res=>{
            if(res){
                this.Isdata = true;
                var result = JSON.parse(res);
                this.apiresponsebody= result.records;
                this.allrecords = result.records;
                this.totalRecords = (this.apiresponsebody).length;
                this.pageSize = this.pageSizeOptions[0];
                this.records = this.apiresponsebody;
                this.columns = columns;
                this.paginationHelper();
                this.isLoading = false;
            }
        })
        .catch(error => {
           if(error) {
            this.isLoading = false;
           }
        });
    }else{
        const evt = new ShowToastEvent({
            title: 'Missing Required',
            message: 'Please fill all reqired filed',
            variant: 'warning'
        });
        this.dispatchEvent(evt); 
        return;
    }
    }
    handleRecordsPerPage(event) {
        this.pageSize = event.target.value;
        this.paginationHelper();
    }
    previousPage() {
        this.pageNumber = this.pageNumber - 1;
        this.paginationHelper();
    }
    nextPage() {
        this.pageNumber = this.pageNumber + 1;
        this.paginationHelper();
    }
    firstPage() {
        this.pageNumber = 1;
        this.paginationHelper();
    }
    lastPage() {
        this.pageNumber = this.totalPages;
        this.paginationHelper();
    }
    paginationHelper() {
        this.apiresponsebody = [];
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        if (this.pageNumber <= 1) {
            this.pageNumber = 1;
        } else if (this.pageNumber >= this.totalPages) {
            this.pageNumber = this.totalPages;
        }

        for (let i = (this.pageNumber - 1) * this.pageSize; i < this.pageNumber * this.pageSize; i++) {
            if (i === this.totalRecords) {
                break;
            }
            this.apiresponsebody.push(this.records[i]);

       
        }
    }
// for sorting the data table
    onSort(event) {
        this.sortedBy = event.detail.fieldName;
        this.sortedDirection = event.detail.sortDirection;
        this.sortData(this.sortedBy, this.sortedDirection);
      }
      sortData(fieldname, direction) {
        let parseData = JSON.parse(JSON.stringify(this.allrecords));
        let keyValue = (a) => {
          return a[fieldname];
        };
        let isReverse = direction === "asc" ? 1 : -1;
        parseData.sort((x, y) => {
          x = keyValue(x) ? keyValue(x) : "";
          y = keyValue(y) ? keyValue(y) : "";
          return isReverse * ((x > y) - (y > x));
        });
        this.records = parseData;
        this.paginationHelper();   
      }
    // Export User Data into CSV

    exportUserData(){
        let doc = '<table>';
        doc += '<style>';
        doc += 'table, th, td {';
        doc += '    border: 1px solid black;';
        doc += '    border-collapse: collapse;';
        doc += '}';          
        doc += '</style>';
        doc += '<tr>';
        this.columnHeader.forEach(element => {            
            doc += '<th>'+ element +'</th>'           
        });
        doc += '</tr>';
        this.allrecords.forEach(records => {
            doc += '<tr>';
            doc += '<th>'+records.Name+'</th>'; 
            doc += '<th>'+records.Username+'</th>'; 
            doc += '<th>'+records.FirstName+'</th>';
            doc += '<th>'+records.LastName+'</th>';
            doc += '<th>'+records.Email+'</th>';
            doc += '<th>'+records.CreatedDate+'</th>';
            doc += '<th>'+records.LastLoginDate+'</th>'; 
            doc += '</tr>';
        });
        doc += '</table>';
        var element = 'data:application/vnd.ms-excel,' + encodeURIComponent(doc);
        let downloadElement = document.createElement('a');
        downloadElement.href = element;
        downloadElement.target = '_self';
        downloadElement.download = 'User Data.xls';
        document.body.appendChild(downloadElement);
        downloadElement.click();
    }

}