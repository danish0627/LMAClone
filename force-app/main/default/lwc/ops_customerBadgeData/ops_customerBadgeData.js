import { LightningElement ,track, api} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import CustomerCenterWS11 from '@salesforce/resourceUrl/CustomerCenterWS11';
import { loadStyle } from 'lightning/platformResourceLoader';

export default class Ops_customerBadgeData extends LightningElement {
    @api recordId='';
    @track eventEditionId;
    
    @track welcomeText;
    @track onOffStatus;
    @track deadlineMessage;
    @track approvalNotReq;
    connectedCallback() {
        let fullUrl = window.location.href;
        this.esId=this.GetQS(fullUrl,'esid');
        this.eId=this.GetQS(fullUrl,'id');
    }
    GetQS(url,key) {
        var a = "";
        if(url.includes('#'))
        {
            let Qs = url.split('#')[1].replace(/^\s+|\s+$/g, '');
            if (Qs !== "") {
                let qsArr = Qs.split("&");
                for (let i = 0; i < qsArr.length; i++)
                    if (qsArr[i].split("=")[0] === key)
                        a = qsArr[i].split("=")[1];
            }
            return a;
        }
        window.location.href='/lightning/n/ops_customer_centre';
        return '';
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
        }
}