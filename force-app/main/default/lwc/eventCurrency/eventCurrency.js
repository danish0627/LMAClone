/* eslint-disable no-alert */
/*
Created By	 : Girikon(Mukesh[STL-137])
Created On	 : Sept 10, ‎2019
@description : Used on Event Edition detail page to show available currencies and update currency functionality
               

Modification log --
Modified By	: 
*/
/* eslint-disable no-console */
import { LightningElement, api, track } from 'lwc';
import getEventCurrency from '@salesforce/apex/OpportunityDetailsCtrl.getEventCurrency';
import getRecordDetail from '@salesforce/apex/CommonTableController.getRecordDetail';
import updateRecords from '@salesforce/apex/CommonTableController.massUpdateRecords';
import isUpdateable from '@salesforce/apex/CommonController.isUpdateable';
import { handleErrors, showToast } from 'c/lWCUtility';

export default class EventCurrency extends LightningElement {
    @api recordId;
    @api isLtng = 'false';
    @track eventCurrecies; 
    @track selectedCurrency;
    @track isOpenModal;
    @track savedCurrency;
    @track tempCurrencyName;
    @track eventEditionId;
    @track spinner;
    @track showChangeLink=false;
    
    connectedCallback(){
        isUpdateable({objectName:'Event_Edition__c',fieldName:'EventCurrency__c'})
        .then((res)=>{
            if(res===true){
                this.showChangeLink = true;
            } else if(res===false){
                this.showChangeLink = false;
            }
        })
        .catch(error=>{
            handleErrors(this,error);
        })
        
        this.eventEditionId = this.recordId;
        this.savedCurrency = '';
        this.isOpenModal = false;
        getRecordDetail({objectName:'Event_Edition__c',allFields:'EventCurrency__c,EventCurrency__r.Name',recordId:this.recordId})
        .then(res=>{
            if(res.length>0){                
                if(res[0].EventCurrency__r){
                    this.savedCurrency = res[0].EventCurrency__r.Name;
                    this.tempCurrencyName = res[0].EventCurrency__r.Name;
                    this.selectedCurrency = res[0].EventCurrency__c;
                }
            }
        })
        .catch(error=>{
            if(this.isLtng==='true'){
                handleErrors(this,error);
            } else{
                let message = 'Unknown Error';
                if (error) {
                    if (error.body!==undefined && Array.isArray(error.body)) {
                        message = error.body.map(e => e.message).join(', ');
                    } 
                    else if (error.body!==undefined && typeof error.body.message === 'string') {
                        message = error.body.message;
                    }
                    else if(error.detail!==undefined && error.detail!==''){
                        message = error.detail;
                    }
                    else if(error.message!==undefined && error.message!==''){
                        message = error.message;
                    }
                }
                alert(message);
            }
        })
    }

    fetchCurrency() {
        getEventCurrency({eventId:this.eventEditionId})
        .then(res=>{
            let currencies =res;
            let evntcurr=[];
            for(let i=0;i<currencies.length;i++)
            {
                evntcurr.push({'label': currencies[i].Name, 'value': currencies[i].Id});
            }
            this.eventCurrecies = evntcurr;
        })
        .catch(error=>{
            if(this.isLtng==='true'){
                handleErrors(this,error);
            } else {
                let message = 'Unknown Error';
                if (error) {
                    if (error.body!==undefined && Array.isArray(error.body)) {
                        message = error.body.map(e => e.message).join(', ');
                    } 
                    else if (error.body!==undefined && typeof error.body.message === 'string') {
                        message = error.body.message;
                    }
                    else if(error.detail!==undefined && error.detail!==''){
                        message = error.detail;
                    }
                    else if(error.message!==undefined && error.message!==''){
                        message = error.message;
                    }
                }
                alert(message);
            }
        })
    }

    hideModal(){
        this.isOpenModal = false;
    }
    showModal(){
        this.fetchCurrency();
        this.isOpenModal = true;
    }
   
    updateCurrency() {
        this.spinner = true;
        const objList = [];
        objList.push({sobjectType:'Event_Edition__c',Id:this.recordId,'EventCurrency__c':this.selectedCurrency});

        updateRecords({objList:objList})
        .then(()=>{
            this.savedCurrency = this.tempCurrencyName;            
            this.spinner = false;
            this.isOpenModal = false;
            if(this.isLtng==='true'){
                showToast(this,'Currency was updated','success','Success!');
            } else {
                alert('Currency was updated!');
            }
        })
        .catch(error=>{
            this.spinner = false;
            if(this.isLtng==='true'){
                handleErrors(this,error);
            } else {
                let message = 'Unknown Error';
                if (error) {
                    if (error.body!==undefined && Array.isArray(error.body)) {
                        message = error.body.map(e => e.message).join(', ');
                    } 
                    else if (error.body!==undefined && typeof error.body.message === 'string') {
                        message = error.body.message;
                    }
                    else if(error.detail!==undefined && error.detail!==''){
                        message = error.detail;
                    }
                    else if(error.message!==undefined && error.message!==''){
                        message = error.message;
                    }
                }
                alert(message);
            }
        });
    }
    handleSelection(event){
        this.selectedCurrency =  event.target.value;
        this.eventCurrecies.forEach(item => {
            if(item.value===this.selectedCurrency){
                this.tempCurrencyName = item.label;
            }
        });
    }
}