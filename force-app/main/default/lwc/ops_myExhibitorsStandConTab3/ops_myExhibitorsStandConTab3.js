import { LightningElement ,track, api} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class Ops_myExhibitorsStandConTab3 extends LightningElement {
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
        }
}