import { LightningElement, track, wire, api } from 'lwc';
import getQLRecords from '@salesforce/apex/CommonTableController.getQLRecords';
import getRecord from '@salesforce/apex/CommonTableController.getRecordDetail';
import { refreshApex } from '@salesforce/apex';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class PendingContractProductTabDuplicate extends LightningElement {
    @track tableData = [];
    @track finalTableData = [];
    @api recordId;
    draftValues = [];
    @track columns = [
        //{ label: 'Product Name', fieldName: 'SBQQ__Product__r.Name', type: 'url', sortable: true},
        { label: 'Product Name', fieldName: 'prodName', type: 'url', typeAttributes: { label: { fieldName: 'SBQQ__Product__r.Name' }, target: '_blank' }, sortable: true },
        { label: 'Quantity', fieldName: 'SBQQ__Quantity__c', type: 'text', sortable: true },
        { label: 'Booth Number', fieldName: 'Booth_Number__c', type: 'text', sortable: true },
        { label: 'Start Date', fieldName: 'Start_Date__c', type: 'date-local', sortable: true, editable: true, typeAttributes: { day: 'numeric', month: 'numeric', year: "numeric" } },
        { label: 'End Date', fieldName: 'End_Date__c', type: 'date-local', sortable: true, editable: true, typeAttributes: { day: 'numeric', month: 'numeric', year: 'numeric' } },
        { label: 'Event Product Type', fieldName: 'Event_Product_Type__c', type: 'text', sortable: true },
        { label: 'Line Description', fieldName: 'Line_Description__c', type: 'text', sortable: true },
        { label: 'Total Price', fieldName: 'formatedCurrency', type: 'text', sortable: true, cellAttributes:{ alignment: 'left' } },
    ];

    wiredMarketData;
    @track shoWAct = true;
    @track totalAmount;
    @track isoCode;

    // pagination item list like (1..2-3-4-5..6)    
    @track page = 1;
    @track startingRecord = 1;
    @track endingRecord = 0;
    @track pageSize = 10;
    @track totalRecountCount = 0;
    @track totalPage = 0;

    @track pagesizeToVisible=10;
    // Search Variables
    @track searchKey = '';
    result;
    connectedCallback(){
        this.getAmount();
    }
    @wire(getQLRecords, { oppId: '$recordId',searchKey: '$searchKey' })
    wiredQuoteLineItems(wireQLResult) {
        this.wiredMarketData = wireQLResult;
        const { data, error } = wireQLResult;

        if (data) {
            console.log('Total Data Dup..'+JSON.stringify(data));
            this.totalRecountCount = data.length;
            this.tableData = data.map(record => Object.assign({ "SBQQ__Product__r.Name": record.SBQQ__Product__r.Name, "prodName": '/' + record.SBQQ__Product__c}, record));           
             console.log('Final Data------>' + this.tableData);
            this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize);  
            this.finalTableData = this.tableData.slice(0, this.pageSize);
            this.endingRecord = this.pageSize;
        }
        else if (error) {
            this.error = error;
            this.tableData = undefined;

        }
    }

    firstHandler() {
        this.page = 1;
        this.displayRecordPerPage(this.page);
    }

    lastHandler() {
        this.page = this.totalPage;
        this.displayRecordPerPage(this.page);
    }

    //clicking on previous button this method will be called
    previousHandler() {
        if (this.page > 1) {
            this.page = this.page - 1; //decrease page by 1
            this.displayRecordPerPage(this.page);
        }
    }

    //clicking on next button this method will be called
    nextHandler() {
        if ((this.page < this.totalPage) && this.page !== this.totalPage) {
            this.page = this.page + 1; //increase page by 1
            this.displayRecordPerPage(this.page);
        }
    }

    //this method displays records page by page
    displayRecordPerPage(page) {

        this.startingRecord = ((page - 1) * this.pageSize);
        this.endingRecord = (this.pageSize * page);

        this.endingRecord = (this.endingRecord > this.totalRecountCount)
            ? this.totalRecountCount : this.endingRecord;

        this.finalTableData = this.tableData.slice(this.startingRecord, this.endingRecord);

        this.startingRecord = this.startingRecord + 1;
    }

    handleKeyChange(event) {
        this.searchKey = this.template.querySelector('lightning-input').value;
        return refreshApex(this.result);
    }

    reloadData(){
        let searchKey = this.template.querySelector('lightning-input').value;
        searchKey = searchKey.trim();
        if(searchKey===''){
            this.searchKey = this.template.querySelector('lightning-input').value;
            return refreshApex(this.result);
        }
    }

    get pagesizeList(){
        return [
            {'label':'5','value':5},
            {'label':'10','value':10},
            {'label':'15','value':15},
            {'label':'20','value':20},
            {'label':'30','value':30},
            {'label':'50','value':50}
        ];
    }

    onPageSizeChange(event){
        this.pagesizeToVisible=parseInt(event.detail.value);
        this.pageSize= this.pagesizeToVisible;
        //alert('Call this===='+this.pagesizeToVisible);
        this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize);
            this.finalTableData = this.tableData.slice(0, this.pageSize);
            this.endingRecord = this.pageSize;
            this.page= 1;
            this.displayRecordPerPage(this.page);
            
        
    }

    getAmount(){
        getRecord({objectName:'Opportunity',allFields:'ISO_Code__c,Amount_Custom__c',recordId:this.recordId})
        .then(res=>{
            if(res.length>0){
                this.isoCode = res[0].ISO_Code__c;
                this.totalAmount = res[0].Amount_Custom__c;
            }
        })
        .catch(error=>{
            handleErrors(this,error);
        })
    }

    
    handleSave(event) {

        const fields = {};
        fields['Id'] = event.detail.draftValues[0].Id;
        fields['Start_Date__c'] = event.detail.draftValues[0].Start_Date__c;
        fields['End_Date__c'] = event.detail.draftValues[0].End_Date__c;

        const recordInput = { fields };

        updateRecord(recordInput)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Record updated',
                        variant: 'success'
                    })
                );

                // Display fresh data in the datatable
                refreshApex(this.wiredMarketData).then(() => {

                    // Clear all draft values in the datatable
                    this.draftValues = [];

                });
            }).catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error updating or reloading record',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
    }
    
}