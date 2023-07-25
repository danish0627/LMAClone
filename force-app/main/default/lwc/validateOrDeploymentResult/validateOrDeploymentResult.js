import { api, LightningElement, track } from 'lwc';

export default class ValidateOrDeploymentResult extends LightningElement {
    
    @api totalComp = 0 ;
    @api deployedComp = 0;
    @api errorCount = 0 ;

    @api isTestRun;
    @api isTestRequired = false;
    @api isTestFailed;

    progress=0;    
    isError;
    color = '';
    
    connectedCallback(){
        
        this.isError = this.errorCount>0?true:false;        
        this.color = this.isError || this.isTestFailed ? '#e77c80' : '#19c376';
        this.color = (this.totalComp == 0 && this.totalComp == this.deployedComp) ? '#ddd':this.color;         
        console.log('numberComponentErrors '+this.errorCount);
        setTimeout(()=>{
            const meter = this.template.querySelector('.meter');            
            let length = meter.getTotalLength();
            console.log('length: '+length);
            if(this.totalComp > 0 && (!this.isError && !this.isTestFailed)){
                let value = parseInt(((this.deployedComp/this.totalComp)*100),10);
                this.progress = length * ((100 - value) / 100);        
            }
            else if(this.isError || this.isTestFailed){
                this.deployedComp = this.totalComp;
                let value = parseInt(((this.deployedComp/this.totalComp)*100),10);
                this.progress = length * ((100 - value) / 100);                        
                this.color = '#e77c80';
            }
            // Trigger Layout in Safari hack https://jakearchibald.com/2013/animated-line-drawing-svg/
            meter.getBoundingClientRect();
            // Set the Offset
            meter.style = 'stroke-dashoffset:'+Math.max(0, this.progress)+';stroke:'+this.color;   
            if(this.isTestRun && this.deployedComp == this.totalComp && this.totalComp==0){
                meter.nextElementSibling.textContent = 'Not Required';
            }
            else{
                meter.nextElementSibling.textContent = this.deployedComp +'/'+ this.totalComp;
            }                                    
        },1000);
    }
}