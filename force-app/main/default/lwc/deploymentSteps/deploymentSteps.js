import { LightningElement ,api} from 'lwc';

export default class DeploymentSteps extends LightningElement {

    @api currentStep = '1';

    @api setCurrentStep(step){
        this.currentStep = step;
    };

    handleChange(event){
        this.currentStep = event.target.value;        
        this.dispatchEvent(new CustomEvent('stepchange', { detail: this.currentStep}));
    }
}