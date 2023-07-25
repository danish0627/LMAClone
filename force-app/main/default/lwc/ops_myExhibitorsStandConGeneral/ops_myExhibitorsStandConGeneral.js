import { LightningElement, track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class Ops_myExhibitorsStandConGeneral extends LightningElement {
    @track eId;
    @track esId;
    
    connectedCallback() {
        let fullUrl = window.location.href;
        this.esId=this.GetQS(fullUrl,'esid');
        this.eId=this.GetQS(fullUrl,'id');
    } 
    cancelForm() {
        const inputFields = this.template.querySelectorAll(
            'lightning-input-field'
        );
        if (inputFields) {
            inputFields.forEach(field => {
                field.reset();
            });
        }
    }
    onLoad() {
        this.isLoading = false;
    }
    onError() {
        this.isLoading = false;
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error',
                message: 'Error while updating',
                variant: 'error',
            }),
        );
    }
    onSubmit() {
        this.isLoading = true;
    }

    handleSuccess() {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Record Is Updated',
                variant: 'success',
            }));
    }
    GetQS (url, key) {
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
    }
}