import { LightningElement ,track, api} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getFormsGeneralData from '@salesforce/apex/LtngUtilityCtrl.getRecords';

export default class Ops_formGeneral extends LightningElement {
    @api recordId='';
    @track eventEditionId;
    
    @track welcomeText;
    @track onOffStatus;
    @track deadlineMessage;
    @track approvalNotReq;
    @track renderedComponent = true;
    connectedCallback() {
        let fullUrl = window.location.href;
        if (fullUrl.indexOf("#") > -1) {
            let IdEventEditionSettings = decodeURIComponent(fullUrl.split("#id=")[1]);
            this.eventEditionId =  decodeURIComponent(IdEventEditionSettings.split("&esid=")[0]);
            let Id = decodeURIComponent(IdEventEditionSettings.split("&esid=")[1]);
            this.recordId=Id;
        }
        getFormsGeneralData({
            objName: "Event_Settings__c",
            fieldNames:
                "id,Welcome_Text_Forms__c,On_Off_Form_Status__c,Deadline_Reached_Message_for_Forms__c,Forms_Approval_Not_Required__c",
            compareWith: "id",
            recordId: this.recordId,
            pageNumber: 1,
            pageSize: 1
        })
            .then(result => {
                this.welcomeText = result.recordList[0].Welcome_Text_Forms__c;
                this.onOffStatus = result.recordList[0].On_Off_Form_Status__c;
                this.deadlineMessage = result.recordList[0].Deadline_Reached_Message_for_Forms__c;
                this.approvalNotReq = result.recordList[0].Forms_Approval_Not_Required__c;
         })
            .catch(error => {
                window.console.log("error..." + JSON.stringify(error));
            });
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
     onSubmit()
        {
            this.isLoading = true;   
        }
    
    handleSuccess() {
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
                window.location.reload();
        }
}