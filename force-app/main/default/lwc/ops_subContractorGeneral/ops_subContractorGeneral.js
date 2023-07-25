/**
 * Modified By: Mukesh Gupta(Fixed issue asked by Hari)
 * Modified Date: 16 Oct, 2019
 */
import { LightningElement, track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import { showToast} from 'c/lWCUtility';

export default class Ops_subContractGeneral extends LightningElement {
    @track isLoading = true;
    @api recordId='';
    @track initialData;
    @track homeSiteSettingObj;
    @track Welcome_Sub_Contractor;

    connectedCallback() {
        this.isLoading = true;
        let fullUrl = window.location.href;
        if (fullUrl.indexOf("#") > -1) {
            let IdEventEditionSettings = decodeURIComponent(fullUrl.split("#id=")[1]);
            if(IdEventEditionSettings.indexOf("&esid") > -1){
                let Id = decodeURIComponent(IdEventEditionSettings.split("&esid=")[1]);
                this.recordId=Id;

                
            }
        }
    }
    handleTextChange(event){
        
        this.Welcome_Sub_Contractor = event.detail.value;
    }
    onSuccess()
    {
        this.isLoading = false;
        showToast(this,'Record updated successfully!','success','Success');
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
        var Qs = url.split('?')[1].replace(/^\s+|\s+$/g, '');
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