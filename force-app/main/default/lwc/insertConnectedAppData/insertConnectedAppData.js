import { api, LightningElement, track } from 'lwc';
import saveAppData from '@salesforce/apex/SetupController.saveCustomMetadata';
import getCallbackURL from '@salesforce/apex/SetupController.getCallbackURL';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class InsertConnectedAppData extends LightningElement {
    @api isOpen;

    @track isDataFound;
    @track spinner;
    
    clientId;
    clientSecret; 
    callbackURL;

    connectedCallback(){
        getCallbackURL()
        .then(res=>{
            this.callbackURL = res;
        });
    };

    gotoConnectedApp(){
        window.open('/lightning/setup/NavigationMenus/page?address=%2Fapp%2Fmgmt%2Fforceconnectedapps%2FforceAppEdit.apexp%3FretURL%3D%252Fsetup%252FNavigationMenus%252Fhome');
    }
    
    handleChange(event){
        let name = event.target.name;
        let val = event.target.value;
        if(name=='clientid'){
            this.clientId = val;
        }
        else{
            this.clientSecret = val;
        }
    };

    handleClose(){
        this.isOpen = false;
        this.dispatchEvent(new CustomEvent('cancel'));
    };

    saveData(){
        if(this.isValida()){            
            this.spinner = true;
            saveAppData({clientId:this.clientId,clientSecret:this.clientSecret})
            .then(data=>{
                this.isOpen = false;
                this.dispatchEvent(new CustomEvent('checkdata'));
                this.showToast('Basic app data was saved.','success','Success');
            })
            .catch(error=>{
                this.showToast('Something went wrong, please contact System Admin.','error','Error');
            }).finally(()=>{
                this.spinner = false;
            });
        }
        else{
            this.showToast('Please update the invalid form entries and try again.','error','Error');
        }
    };
    
    isValida(){
        return [
            ...this.template.querySelectorAll('lightning-input'),
        ].reduce((validSoFar, inputCmp) => {
            inputCmp.reportValidity();
            return validSoFar && inputCmp.checkValidity();
        }, true);
    };

    showToast(message,type,title) {
        const event = new ShowToastEvent({
            title: title,
            message:message,
            variant:type
        });
        this.dispatchEvent(event);
    };   
}