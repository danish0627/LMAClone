import { LightningElement,track } from 'lwc';
import getdata from '@salesforce/apex/SSCDashboardLtngCtrl.getOperationTeamMember';
import {handleErrors} from 'c/lWCUtility';
const DELAY=300;

//Custom Labels
import Product_Name1 from '@salesforce/label/c.Product_Name1';
import Account_Id from '@salesforce/label/c.Account_Id';
import Event_Series1 from '@salesforce/label/c.Event_Series1';
import Event_Edition1 from '@salesforce/label/c.Event_Edition1';
import ownerId from '@salesforce/label/c.Owner_ID';
import Event_Product_Type from '@salesforce/label/c.Event_Product_Type';
import Work_Order_Number from '@salesforce/label/c.Work_Order_Number';

export default class OperationTeamDashboard extends LightningElement 
{
    @track isOperationTeamMember;
    @track workOdrCond;
    @track qryCondition;
    @track openActionModal;
    @track recordId;
    @track fieldLabel1 = 'Work Order Number,Work Order Name,Start Date,End Date,Status,'+Product_Name1+','+Account_Id+',Opportunity,'+Event_Series1+',Event Product Type,'+Event_Edition1+','+ownerId+',Last Modified Date';
    @track fieldLabel2 = ''+Work_Order_Number+',Work Order Name,Account Name,'+Event_Series1+','+Event_Edition1+','+Event_Product_Type+',Work Order Line Item Number,Task Name,Status,Assign To,Start Date,End Date,Assign To';

    /**
     * description : This will call once the data is loaded
     */
    connectedCallback() {
        this.workOdrCond = 'WorkOrder.WorkOrderNumber!=\'\'';
        this.qryCondition = 'WorkOrderNumber!=\'\'';
        this.getSSCTeamMember();
    }

    /**
     * description : It help us to open once user click on popup icon.
     */
    handleActionModal(event) {
        this.recordId = event.detail;
        window.clearTimeout(this.delayTimeout);
        this.openActionModal = false;
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(()=>{
            this.openActionModal = true;
            this.template.querySelector('c-crm-work-order-model').getOppDetail(this.recordId);
        },DELAY);
    }
    
    /**
     * description : It fetches the records from the controller
     */
    getSSCTeamMember() {
        getdata()
        .then(data=>{
            if(data.length > 0){
                this.isOperationTeamMember = true;
            }
            let ids = [];
            let datas = JSON.parse(JSON.stringify(data));
            for(let i=0; i<datas.length; i++){
                if(datas[i].Operations_Team__r !==undefined && datas[i].Operations_Team__r.Event_Series__c!==undefined){
                    ids.push(datas[i].Operations_Team__r.Event_Series__c);
                }                
            }
            this.workOdrCond = 'WorkOrder.Event_SeriesL__c IN (\''+ids.join('\',\'')+'\')';
            this.qryCondition = 'Event_SeriesL__c IN (\''+ids.join('\',\'')+'\')';
        })
        .catch(error=>{
           handleErrors(this,error);
        });
    } 
}