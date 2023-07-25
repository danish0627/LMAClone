import { LightningElement, track, api } from 'lwc';
import getRecordDetail from '@salesforce/apex/CommonTableController.getRecordDetail';
import {handleErrors} from 'c/lWCUtility';

//Custom Labels
import Work_Order_Line_Item_Number from '@salesforce/label/c.Work_Order_Line_Item_Number';
import Work_Order_ID from '@salesforce/label/c.Work_Order_ID';
import Start_Date from '@salesforce/label/c.Start_Date';
import End_Date from '@salesforce/label/c.End_Date';

export default class CrmWorkOrderModel extends LightningElement 
{
    
    @api isOpenActionModal;
    @api recordId;    
    @api objectName;
    @track oppName;
    @track workOrderLineItemsCond;
    @track workOrderLabels = ''+Work_Order_Line_Item_Number+',Task Name,Status,'+Work_Order_ID+',Assign To,'+Start_Date+','+End_Date+'';

   /**
    * Description: This method is calling inside the operationTeamDashboard component.
    */
    @api
    getOppDetail(recordId)
    {
        getRecordDetail({objectName:'WorkOrder',allFields:'Opportunity__r.Name',recordId:recordId})
        .then(data=>{
            if(data.length>0){
                this.oppName = data[0].Opportunity__r.Name;
            }
            this.workOrderLineItemsCond = "WorkOrderId = '"+recordId+"'";
        })
        .catch(error=>{
            handleErrors(this,error);
        });
    }

    /*
    * @description [This method is used to close the model]
    */
    closeModal() 
    {
        this.isOpenActionModal = false;
    }
}