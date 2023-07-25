/* eslint-disable no-console */
import { LightningElement,api, track } from 'lwc';
import {showToast,handleErrors} from 'c/lWCUtility';
import getRecordDetail3 from '@salesforce/apex/CommonTableController.getRecordDetail3';

//Retrieve Custom Labels
import Account_Name from '@salesforce/label/c.Account_Name';
import Quote from '@salesforce/label/c.Quote';
import Pricebook_Name from '@salesforce/label/c.Pricebook_Name';
import VAT_Number from '@salesforce/label/c.VAT_Number';
import Full_Name from '@salesforce/label/c.Full_Name';
import Estimated_Tax from '@salesforce/label/c.Estimated_Tax';
import Activated_Date from '@salesforce/label/c.Activated_Date';
import Created_Date from '@salesforce/label/c.Created_Date';
import Price_Calculation_Status from '@salesforce/label/c.Price_Calculation_Status';
import Order_Type from '@salesforce/label/c.Order_Type';

export default class CrmOrderDetailFinancialTab extends LightningElement {

    @track showSpinner=false;
    @track showEdit=false;
    @api orderId;
    @track orderDetails;
    @track invoiceCond;

    //Custom Labels Variables
    @track ACCOUNTNAME;
    @track QUOTENAME;
    @track PRICEBOOKNAME;
    @track VATNUMBER;
    @track FULLNAME;
    @track ESTIMATEDTAX;
    @track ACTIVATEDDATE;
    @track CREATEDDATE;
    @track PRICECALCULATIONSTATUS;
    @track ORDERTYPE;

    /**
     * description : This method will call at the time of load.
     */
    connectedCallback(){
        
        this.ACCOUNTNAME = Account_Name;
        this.QUOTENAME = Quote;
        this.PRICEBOOKNAME = Pricebook_Name;
        this.VATNUMBER = VAT_Number;
        this.FULLNAME = Full_Name;
        this.ESTIMATEDTAX = Estimated_Tax;
        this.ACTIVATEDDATE = Activated_Date;
        this.CREATEDDATE = Created_Date;
        this.PRICECALCULATIONSTATUS = Price_Calculation_Status;
        this.ORDERTYPE = Order_Type;

        this.invoiceCond='blng__Order__c=\''+this.orderId+'\'';
        this.retrieveOrderDetail();
    }

    /**
     * description : This method will show or hide edit form.
     */
    showEditForm(){
        this.showEdit=!this.showEdit;
    }

    /**
     * description : This method will handle when user submit data after editing.
     */
    handleSubmit(){
        this.showSpinner=true;
    }
    
    /**
     * description : This method will handle when Data is successfully updated
     */
    handleSuccess(){
        this.showSpinner=false;
        showToast(this,'Order Updated','success','Success');
        this.showEditForm();
    }

    /**
     * description : This method will fetch the order details based on order Id.
     */
    retrieveOrderDetail(){
        let condition='Id=\''+this.orderId+'\'';
        let fields='Id,BillToContactId,AccountId,OpportunityId,Pricebook2Id,BillToContact.Name,Account.Name,Opportunity.Name,PriceBook2.Name';
        getRecordDetail3({objectName:'Order',allFields:fields,condition:condition})
        .then(result=>{
            
            if(result){
                this.orderDetails=result[0];
            }
        })
        .catch(error=>{
            handleErrors(error);
        })
    }
}