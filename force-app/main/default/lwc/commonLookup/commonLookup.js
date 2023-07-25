import { LightningElement,api,track } from 'lwc';
import getRecordDetail from '@salesforce/apex/CommonTableController.getRecordDetail';
import getDatas from '@salesforce/apex/CommonTableController.getGenericObjectRecord'
import {handleErrors} from 'c/lWCUtility';

export default class CommonLookup extends LightningElement {
    @api selectedItemId;//String
    @api selectedItem;//Object
    @api isBilling;//Boolean
    @api objectLabel='Account';//String
    @api placeholder='Search Account';//String
    @api label='Account Name';//String
    @api helpText='Enter Account Name';//String    
    @api objectName='account';//String
    @api nameFieldApi='Name';//String
    @api fieldName='AccountId';
    @api accountId;//String
    @api parterAccId;//String
    @api isOpenModal;//boolean
    @api isRequired;//boolean
    @api isDisabled;//boolean
    @api index=0;
    @api searchPlaceholder='';

    //update on 5 Sept, 2019
    @api condition;
    

    @track isHide;
    @track lookupData;//list
    @track isLoading;
    @track iconName='standard:contact';
    @api showLabel;
    @track recordFound;
    connectedCallback(){
        this.recordFound = '';
        this.showLabel = this.label.length===0?false:true;

        if(this.condition===undefined){
            this.condition='';
        }
        if(this.objectName==='order'){
            this.iconName = 'standard:orders';
        }
        else if(this.objectName.indexOf('__')>0){
            this.iconName = 'standard:record';
        }
        else{
            this.iconName = 'standard:'+this.objectName;
        }

        this.selectedItem = {id:'',Name:''};
        if(this.selectedItemId){
            getRecordDetail({objectName:this.objectName,allFields:this.nameFieldApi,recordId:this.selectedItemId})
            .then(res=>{
                if(res.length>0){
                    this.selectedItem = {id:res[0].Id,Name:res[0][this.nameFieldApi]};
                    this.isHide = true;
                }
            })
            .catch(error=>{
                handleErrors(this,error);
            });
        }
    }
    loadDefault(){        
        this.isLoading = true;        
        getDatas({searchValue:'',objectName:this.objectName,fieldstoget:this.nameFieldApi,pagesize:10,
            next:false,prev:false,off:0,sortBy:this.nameFieldApi,sortType:'ASC',condition:this.condition})
        .then(data=>{
            this.isLoading = false;  
            this.lookupData = data.ltngTabWrap.tableRecord;
            if(this.lookupData.length===0){
                this.recordFound = false;
            }
            else{
                this.recordFound = true;
            }
            let searchLookup = this.template.querySelector(".searchLookup");
            searchLookup.classList.add("slds-is-open");
            searchLookup.classList.remove("slds-combobox-lookup");                   
        })
        .catch(error=>{                
            handleErrors(this,error);
        });
    }
    
    searchDatas(event) {        
        let fieldValue = event.target.value;
        if(fieldValue.length>1){
            this.isLoading = true;
            const input = this.template.querySelector(".lookupField");            
            input.reportValidity();
            getDatas({searchValue:fieldValue,objectName:this.objectName,fieldstoget:this.nameFieldApi,pagesize:10,
                next:false,prev:false,off:0,sortBy:this.nameFieldApi,sortType:'ASC',condition:this.condition})
            .then(data=>{          
                this.isLoading = false;  
                this.lookupData = data.ltngTabWrap.tableRecord;   
                if(this.lookupData.length===0){
                    this.recordFound = false;
                }
                else{
                    this.recordFound = true;
                }
                let searchLookup = this.template.querySelector(".searchLookup");
                searchLookup.classList.add("slds-is-open");
                searchLookup.classList.remove("slds-combobox-lookup");                   
            })
            .catch(error=>{                
                handleErrors(this,error);
            });   
        }
    }     
    // Custom Lookup Auto complete Start
    handleBlur(){                
        window.clearTimeout(this.delayTimeout);
        let searchLookup = this.template.querySelector(".searchLookup");
        const that = this;        
        // eslint-disable-next-line @lwc/lwc/no-async-operation        
        this.delayTimeout = setTimeout(()=>{            
            searchLookup.classList.remove("slds-is-open");
            searchLookup.classList.add("slds-combobox-lookup");            
            that.template.querySelector(".lookupField").value="";
            this.isLoading = false;
        },400);
    }
    handleSelect(event){  
        window.clearTimeout(this.delayTimeout);
        let searchLookup = this.template.querySelector(".searchLookup");
        searchLookup.classList.remove("slds-is-open");
        searchLookup.classList.add("slds-combobox-lookup");  
        let value = event.currentTarget.getAttribute("data-value1");
        let name = event.currentTarget.getAttribute("data-name1");
        if(!name){
            name = event.currentTarget.getAttribute("data-name2");
        }
        if(!name){
            name = event.currentTarget.getAttribute("data-name3");
        }
        if(!name){
            name = event.currentTarget.getAttribute("data-name4");
        }
        this.selectedItem = {id:value,Name:name};
        this.selectedItemId = value;
        this.dispatchEvent(new CustomEvent('handlelookup',{detail:{'field':this.fieldName,'value':value,'name':name,'index':this.index}}))

        // eslint-disable-next-line @lwc/lwc/no-async-operation        
        this.delayTimeout = setTimeout(()=>{            
            this.isHide = true;
        },500);
    }

    // Custom Lookup Auto complete End
	openModal(){
		this.isOpenModal = true;
    }
    hideModal(){
		this.isOpenModal = false;
	}
    clearSelected() {
        this.selectedItem = {id:'',Name:''};
        this.selectedItemId = '';
        this.isHide = false;
        this.dispatchEvent(new CustomEvent('handlelookup',{detail:{'field':this.fieldName,'value':'','name':'','index':this.index}}));
    }
    //this is event handler which is fire from parent component
    handleValidation(event) {
        if(!event.detail && this.lookupField!==undefined){            
            this.template.querySelector(".lookupField").showHelpMessageIfInvalid();
        }
    }

    //get record detail by passing condition [update on 5 Sept, 2019]
    

}