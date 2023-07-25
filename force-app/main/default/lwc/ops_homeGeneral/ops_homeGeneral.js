import { LightningElement, track  } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class Ops_homeSiteSettings extends LightningElement {
    @track isLoading = true;
    @track esId;
    @track eId;
    @track renderedComponent = true;
    connectedCallback() 
    {
        let fullUrl = window.location.href;
        this.esId=this.GetQS(fullUrl,'esid');
        this.eId=this.GetQS(fullUrl,'id');
    }
    onSuccess()
    {
        this.isLoading = false;
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Record updated successfully!',
                variant: 'Success',
            }),
        );
        this.renderedComponent = false;
        setTimeout(() => {
            this.renderedComponent = true;            
        }, 10);       
    }
    onSubmit()
    {
        this.isLoading = true;   
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
    cancel()
    {
        const inputFields = this.template.querySelectorAll(
            'lightning-input-field'
        );
        if (inputFields) {
            inputFields.forEach(field => {
                field.reset();
            });
        }
    }
    GetQS(url,key) {
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
}