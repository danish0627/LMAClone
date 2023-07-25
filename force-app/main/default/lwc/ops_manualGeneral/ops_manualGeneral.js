import { LightningElement ,track, api} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getManualGeneralData from '@salesforce/apex/LtngUtilityCtrl.getRecords';
export default class Ops_manualGeneral extends LightningElement {

    @api recordId='';
    @track eventEditionId;
    @track selectedEventName='';
    @track welcomeText;
    @track showHideAgree;
    @track deadlineMessage;
    @track renderedComponent = true;

    
    connectedCallback() {
        let fullUrl = window.location.href;
        if (fullUrl.indexOf("#") > -1) {
            let IdEventEditionSettings = decodeURIComponent(fullUrl.split("#id=")[1]);
            this.eventEditionId =  decodeURIComponent(IdEventEditionSettings.split("&esid=")[0]);
            let Id = decodeURIComponent(IdEventEditionSettings.split("&esid=")[1]);
            this.recordId=Id;
        }
        getManualGeneralData({
            objName: "Event_Settings__c",
            fieldNames:
                "id,Welcome_Text_Manuals__c,Show_Hide_Manual_Agreed__c,Deadline_Reached_Message_for_Manuals__c",
            compareWith: "id",
            recordId: this.recordId,
            pageNumber: 1,
            pageSize: 1
        })
            .then(result => {
                this.welcomeText = result.recordList[0].Welcome_Text_Manuals__c;
                this.showHideAgree = result.recordList[0].Show_Hide_Manual_Agreed__c;
                this.deadlineMessage = result.recordList[0].Deadline_Reached_Message_for_Manuals__c;
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
            //window.location.href = '/lightning/n/ops_customer_centre_manuals#id=' + this.eventEditionId + '&esid=' + this.recordId;
    }
}