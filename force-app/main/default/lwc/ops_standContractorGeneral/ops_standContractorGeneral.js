/* eslint-disable no-console */
import { LightningElement ,track,wire} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import {getRecord } from 'lightning/uiRecordApi';
import getMatchedProductData from '@salesforce/apex/LtngUtilityCtrl.getRecords';
const FIELDS = ['Event_Edition__c.Event_Code__c','Event_Edition__c.Matched_Product_Name__c','Event_Edition__c.Booth_Type__c'];
export default class Ops_standContractorGeneral extends LightningElement {

    @track esId;
    @track eId;
    @track selectedMatchProductNew = [];
    @track matchProductOptions = [];
    @track initialValues = [];
    @track renderedComponent = true;

    
    connectedCallback() {
        
        let fullUrl = window.location.href;
        this.esId = this.GetQS(fullUrl, 'esid');
        this.eId = this.GetQS(fullUrl, 'id');
        let eventSetId = this.esId;
        getMatchedProductData({
            objName: "Event_Settings__c",
            fieldNames:
                "id,Allowed_Expocad_Product_Types__c",
            compareWith: "id",
            recordId: eventSetId,
            pageNumber: 1,
            pageSize: 1
        })
            .then(result => {
                let matchProductName = result.recordList[0].Allowed_Expocad_Product_Types__c;
                if(matchProductName){
                    let tempMatchProduct = matchProductName;
                    if(tempMatchProduct.indexOf(";")){
                        let splitArr = tempMatchProduct.split(';');
                        let tempArr=[];
                        for(let i = 0 ; i< splitArr.length; i++)  {
                            tempArr.push(splitArr[i]);
                        }
                        this.selectedMatchProductNew = tempArr; 
                        this.initialValues = tempArr;
                    }else{
                        this.selectedMatchProductNew.push(tempMatchProduct);
                        this.initialValues.push(tempMatchProduct);
                    } 
                }
           })
            .catch(error => {
                window.console.log("error..." + JSON.stringify(error));
            });
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
            let tempMatchProduct=data.fields.Matched_Product_Name__c.value ? data.fields.Matched_Product_Name__c.value: '';
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
    handleChangeMatchProductNew(event){
        this.selectedMatchProductNew = event.detail.value;
    }
    
cancelForm(){
    const inputFields = this.template.querySelectorAll(
        'lightning-input-field'
    );
    if (inputFields) {
        inputFields.forEach(field => {
            field.reset();
        });
    }
    this.selectedMatchProductNew = this.initialValues;
    window.location.href = '/lightning/n/ops_stand_contractor#id=' + this.eId + '&esid=' + this.esId;
 }
 onLoad()
 {
      this.isLoading = false;
 }
 onError()
 {
     this.isLoading = false;
     this.dispatchEvent(
         new ShowToastEvent({
             title: 'Error',
             message: 'Error while updating',
             variant: 'error',
         }),
     );
 }
onSubmit(event){
        this.isLoading = true;  
        event.preventDefault();
        const fields = event.detail.fields;
        fields.Allowed_Expocad_Product_Types__c= this.selectedMatchProductNew.join(';');
        this.template.querySelector('.globalForm').submit(fields)
        }

handleSuccess() {
    this.isLoading = false;
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Record Is Updated',
                variant: 'success',
            }),);
            this.renderedComponent = false;
            setTimeout(() => {
                this.renderedComponent = true;            
            }, 10);    
            window.location.href = '/lightning/n/ops_stand_contractor#id=' + this.eId + '&esid=' + this.esId;
    }
}