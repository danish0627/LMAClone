import { LightningElement, api, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import base_Url from '@salesforce/label/c.base_url';
import getActiveOrders from '@salesforce/apex/GetActiveOrdersForProducts.getActiveOrders';

const PAGE_SIZE = 5;
const BASE_URL = base_Url;

export default class ActiveOrders extends LightningElement {
    @api recordId;
    gridData;
    initalRecords;
    frstBool = false;
    lastBool = false;
    nextBool = false;
    prevBool = false;
    offset = 0;
    pageSize = PAGE_SIZE;
    dataCount = 0;

    columns = [
        {label:'Order Number', fieldName:'Id', type:'url', typeAttributes: {label: { fieldName: 'OrderNumber'}, target: '_blank'}},
        {label:'Product', fieldName:'Product_Name__c', type:'text'},
        {label:'Quantity', fieldName:'SBQQ__OrderedQuantity__c', type:'text'},
        {label:'Total price', fieldName:'TotalPrice', type:'text'},
        {label:'Estimated Tax', fieldName:'SBQQ__TaxAmount__c', type:'text'},
        {label:'Total Amount (With Tax)', fieldName:'SBQQ__TotalAmount__c', type:'text'},
        {label:'Activation Status', fieldName:'SBQQ__Status__c', type:'text'},
        {label:'Quote Line', fieldName:'Quote_Line_Name__c', type:'text'},
        {label:'SAP Primary Tax Rate', fieldName:'SAP_Primary_Tax_Rate__c', type:'text'},
        {label:'SAP Tax Code', fieldName:'SAP_Tax_Code__c', type:'text'},
        {label:'Tax Calculation Status', fieldName:'blng__TaxStatus__c', type:'text'},
    ]

    connectedCallback(){
        console.log(this.recordId);
        getActiveOrders({productId:this.recordId})
            .then(result => {
                console.log(result);
                // this.gridData = result;
                this.createTreeGridData(result);
            })
            .catch(error => {
                console.error(error);
            });
    }

    createTreeGridData(result){
        let tempData = JSON.parse(JSON.stringify(result));
        for ( let i = 0; i < tempData.length; i++ ){
            tempData[ i ]._children = tempData[ i ]['OrderItems'];
            delete tempData[ i ].OrderItems;
            tempData[i].Id = BASE_URL+tempData[ i ].Id;
            for(let j = 0; j < tempData[i]._children.length; j++){
                tempData[i]._children[j].Id = '';
            }
        }
        this.initalRecords = tempData;
        
        if ( this.initalRecords ) {
            this.dataCount = this.initalRecords.length;
            if ( this.dataCount > this.pageSize ) {
                this.nextBool = true;
                this.lastBool = true;
            }

            //console.log( 'Count is ' + this.dataCount );
            this.fetchData();
        }
    }

    /* Method to expand all Account records to display related Contact records  */
    expandAll() {
        const grid =  this.template.querySelector( 'lightning-tree-grid' );
        grid.expandAll();
    }
        
    /*  Method to collapse all Account records to hide related Contact records  */
    collapseAll() {
        const grid =  this.template.querySelector( 'lightning-tree-grid' );
        grid.collapseAll();   
    }
    
    /*  Method to handle when View button is clicked   */
    handleRowAction(event){
        const row = event.detail.row;
        //console.log( 'Row is ' + JSON.stringify( row ) );
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: row.Id,
                actionName: 'view'
            }
        });
    }
    
    /* Method to navigate to previous set of Account records */
    goPrevious() {
        this.offset -= this.pageSize;
        this.nextBool = true;
        if( this.offset === 0 ){
            this.prevBool = false;
            this.frstBool = false;
        } else{
            this.nextBool = true;
            this.lastBool = true;
        }
        this.fetchData();
    }
    
    /*  Method to navigate to next set of Account records  */
    goNext() {
        this.offset += this.pageSize;
        this.prevBool = true;
        if ( ( this.offset + this.pageSize ) >= this.dataCount ) {
            this.nextBool = false;
            this.lastBool = false;
        } else {
            this.prevBool = true;
            this.frstBool = true;
        }
        this.fetchData();
    }
    
    /*  Method to navigate to first set of Account records  */
    goFirst() {
        this.offset = 0;
        this.nextBool = true;
        this.prevBool = false;
        this.frstBool = false;
        this.lastBool = true;
        this.fetchData();
    }
    
    /*  Method to nanigate to last set of Account records */
    goLast(){
        this.offset = this.dataCount - ( this.dataCount % this.pageSize );
        this.nextBool = false;
        this.prevBool = true;
        this.frstBool = true;
        this.lastBool = false;
        this.fetchData();
    }
    
    /*  Method to fetch the data from the original list of records.
        slice() is used to get the right set of records based on page size and offset values. */
    fetchData() {
        this.gridData = this.initalRecords.slice( this.offset, ( this.offset + this.pageSize ) );
        console.log( this.gridData.length + ' - ' + JSON.stringify( this.gridData ) );
    }    
}