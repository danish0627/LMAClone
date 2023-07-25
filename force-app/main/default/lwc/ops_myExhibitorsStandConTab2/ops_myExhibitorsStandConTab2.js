import { LightningElement ,track, api} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import CustomerCenterWS11 from '@salesforce/resourceUrl/CustomerCenterWS11';
import { loadStyle } from 'lightning/platformResourceLoader';

export default class Ops_myExhibitorsStandConTab2 extends LightningElement {
    @api recordId='';
    @track eventEditionId;
    
    @track welcomeText;
    @track onOffStatus;
    @track deadlineMessage;
    @track approvalNotReq;
    @track isLoading=false;
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
    constructor() { // invoke the method when component rendered or loaded
        super()
        Promise.all([
            loadStyle(this, CustomerCenterWS11 + '/CustomerCenterWS11/css/ops_style.css'),
        ])
        .then(() => {
            // Call back function if scripts loaded successfully
        })
        .catch(errors => {
            window.console.log(errors);
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
     onSubmit(event)
        {
            event.preventDefault();
            const fields = event.detail.fields;
            let MaxStand = fields.Cont_MyExhibitor_Detail_Tab_2_Max_Stand__c;
            let MaxStandFrac = fields.Max_Stand_Height_Decimal__c;
            let MaxRigging = fields.Cont_MyExhibitor_Detail_Tab2_Max_Rigging__c;
            let MaxRiggingFrac = fields.Max_Rigging_Height_Decimal__c;
            if(!MaxStand || !MaxStandFrac){
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: 'Pelease Select Valid Stand Height',
                        variant: 'error',
                    }),);
            }
            else if(!MaxRigging || !MaxRiggingFrac){
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: 'Pelease Select Valid Rigging Height',
                        variant: 'error',
                    }),);
            }
            else{
                this.isLoading = true; 
                this.template.querySelector('.globalForm').submit(fields);
            }
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

        }
}