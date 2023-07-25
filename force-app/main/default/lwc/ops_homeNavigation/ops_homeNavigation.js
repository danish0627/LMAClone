import { LightningElement, track, wire } from 'lwc';
import { updateRecord, getRecord } from 'lightning/uiRecordApi'; 
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

let FIELDS = ['Event_Settings__c.Id','Event_Settings__c.Forms_Title__c','Event_Settings__c.Forms_Sub_Title__c',
'Event_Settings__c.Forms_Redirect_URL__c','Event_Settings__c.Is_Form_Visible__c', 'Event_Settings__c.Is_Form_Active__c',  
'Event_Settings__c.Manuals_Title__c','Event_Settings__c.Manuals_Sub_Title__c','Event_Settings__c.Manuals_Redirect_URL__c',
'Event_Settings__c.Is_Manual_Visible__c','Event_Settings__c.Is_Manual_Active__c','Event_Settings__c.Badges_Title__c', 
'Event_Settings__c.Badges_Sub_Title__c','Event_Settings__c.Badges_Redirect_URL__c','Event_Settings__c.Is_Customer_Badges_Visible__c',
'Event_Settings__c.Is_Customer_Badges_Active__c','Event_Settings__c.E_Commerce_Title__c','Event_Settings__c.E_Commerce_Sub_Title__c',
'Event_Settings__c.E_Commerce_Redirect_URL__c','Event_Settings__c.Is_E_Commerce_Visible__c','Event_Settings__c.Is_E_Commerce_Active__c', 
'Event_Settings__c.Accounts_and_Billing_Title__c','Event_Settings__c.Accounts_and_Billing_Sub_Title__c', 
'Event_Settings__c.Accounts_and_Billing_Redirect_URL__c','Event_Settings__c.Is_Account_and_Billing_Visible__c',
'Event_Settings__c.Is_Account_and_Billing_Active__c','Event_Settings__c.Exhibitor_Directory_Title__c', 
'Event_Settings__c.Exhibitor_Directory_Sub_Title__c','Event_Settings__c.Exhibitor_Directory_Redirect_URL__c', 
'Event_Settings__c.Is_Customer_Profile_Visible__c','Event_Settings__c.Is_Customer_Profile_Active__c',
'Event_Settings__c.Upload_Center_Title__c','Event_Settings__c.Upload_Center_Sub_Title__c', 'Event_Settings__c.Upload_Center_Redirect_URL__c', 
'Event_Settings__c.Is_Upload_Center_Visible__c','Event_Settings__c.Is_Upload_Center_Active__c','Event_Settings__c.Freeman_Title__c', 
'Event_Settings__c.Freeman_Sub_Title__c','Event_Settings__c.Freeman_Redirect_Url__c', 'Event_Settings__c.Is_Freeman_Visible__c', 
'Event_Settings__c.Is_Freeman_Active__c','Event_Settings__c.Custom_1_Title__c', 
'Event_Settings__c.Custom_1_Sub_Title__c','Event_Settings__c.Custom_1_Redirect_URL__c',
'Event_Settings__c.Is_Custom_1_Visible__c','Event_Settings__c.Is_Custom_1_Active__c', 
'Event_Settings__c.Custom_2_Title__c','Event_Settings__c.Custom_2_Sub_Title__c', 'Event_Settings__c.Custom_2_Redirect_URL__c', 
'Event_Settings__c.Is_Custom_2_Visible__c','Event_Settings__c.Is_Custom_2_Active__c','Event_Settings__c.Custom_3_Title__c', 
'Event_Settings__c.Custom_3_Sub_Title__c','Event_Settings__c.Custom_3_Redirect_URL__c', 
'Event_Settings__c.Is_Custom_3_Visible__c','Event_Settings__c.Is_Custom_3_Active__c', 
'Event_Settings__c.Stand_Contractor_Title__c','Event_Settings__c.Stand_Contractor_Sub_Title__c', 
'Event_Settings__c.Stand_Contractor_Redirect_URL__c','Event_Settings__c.Is_Stand_Contractor_Visible__c', 
'Event_Settings__c.Is_Stand_Contractor_Active__c','Event_Settings__c.My_Exhibitor_Title__c', 
'Event_Settings__c.My_Exhibitor_Sub_Title__c','Event_Settings__c.My_Exhibitor_Redirect_URL__c',
'Event_Settings__c.Is_My_Exhibitor_Visible__c','Event_Settings__c.Is_My_Exhibitor_Active__c', 
'Event_Settings__c.Subcontractor_Title__c','Event_Settings__c.Subcontractor_Sub_Title__c','Event_Settings__c.Subcontractor_Redirect_Url__c', 
'Event_Settings__c.Is_SubContractors_Visible__c','Event_Settings__c.Is_SubContractors_Active__c',
'Event_Settings__c.Agent_Own_Exhibitor_Title__c','Event_Settings__c.Agent_Own_Exhibitor_Sub_Title__c', 
'Event_Settings__c.Agent_Own_Exhibitor_Redirect_URL__c','Event_Settings__c.Is_Agent_Own_Exhibitor_Visible__c',
'Event_Settings__c.Is_Agent_Own_Exhibitor_Active__c','Event_Settings__c.Gorrilla_Title__c', 'Event_Settings__c.Gorrilla_Sub_Title__c', 
'Event_Settings__c.Gorrilla_Redirect_Url__c','Event_Settings__c.Is_Gorrilla_Visible__c', 
'Event_Settings__c.Is_Gorrilla_Active__c','Event_Settings__c.Is_EventCode_Required__c',
'Event_Settings__c.Enable_Feedback__c','Event_Settings__c.Feedback_Sub_Title__c','Event_Settings__c.Feedback_Redirect_URL__c'];

export default class Ops_homeNavigation extends LightningElement {
    @track isLoading = true;
    @track recordId = '';
    @track initialData;
    @track homeNavigationArr = [];
    @track objHomeNav ; 
    connectedCallback() {
        let fullUrl = window.location.href;
        if (fullUrl.indexOf("#") > -1) {
            let IdEventEditionSettings = decodeURIComponent(fullUrl.split("#id=")[1]);
            let Id = decodeURIComponent(IdEventEditionSettings.split("&esid=")[1]);
            this.recordId=Id;
        }
    }
    @wire(getRecord, { recordId: '$recordId', fields : FIELDS})
    wiredEventObject({ error, data }) {
        if (data) {
            let tempObj = { Id: data.fields.Id ? data.fields.Id.value : '',Forms_Title__c: data.fields.Forms_Title__c ? data.fields.Forms_Title__c.value: '', 
             Forms_Sub_Title__c: data.fields.Forms_Sub_Title__c ? data.fields.Forms_Sub_Title__c.value: '', Forms_Redirect_URL__c : data.fields.Forms_Redirect_URL__c ? data.fields.Forms_Redirect_URL__c.value: '', 
             Is_Form_Visible__c : data.fields.Is_Form_Visible__c ? data.fields.Is_Form_Visible__c.value: false, Is_Form_Active__c: data.fields.Is_Form_Active__c ? data.fields.Is_Form_Active__c.value: false, 
             Manuals_Title__c: data.fields.Manuals_Title__c ? data.fields.Manuals_Title__c.value: '', Manuals_Sub_Title__c: data.fields.Manuals_Sub_Title__c ? data.fields.Manuals_Sub_Title__c.value: '',
             Manuals_Redirect_URL__c: data.fields.Manuals_Redirect_URL__c ? data.fields.Manuals_Redirect_URL__c.value: '', Is_Manual_Visible__c: data.fields.Is_Manual_Visible__c ? data.fields.Is_Manual_Visible__c.value: false, 
             Is_Manual_Active__c: data.fields.Is_Manual_Active__c ? data.fields.Is_Manual_Active__c.value: false, Badges_Title__c: data.fields.Badges_Title__c ? data.fields.Badges_Title__c.value: '',
             Badges_Sub_Title__c: data.fields.Badges_Sub_Title__c ? data.fields.Badges_Sub_Title__c.value: '',Badges_Redirect_URL__c: data.fields.Badges_Redirect_URL__c ? data.fields.Badges_Redirect_URL__c.value: '',
             Is_Customer_Badges_Visible__c: data.fields.Is_Customer_Badges_Visible__c ? data.fields.Is_Customer_Badges_Visible__c.value: false, Is_Customer_Badges_Active__c: data.fields.Is_Customer_Badges_Active__c ? data.fields.Is_Customer_Badges_Active__c.value: false, 
             E_Commerce_Title__c: data.fields.E_Commerce_Title__c ? data.fields.E_Commerce_Title__c.value: '', E_Commerce_Sub_Title__c: data.fields.E_Commerce_Sub_Title__c ? data.fields.E_Commerce_Sub_Title__c.value: '',
             E_Commerce_Redirect_URL__c: data.fields.E_Commerce_Redirect_URL__c ? data.fields.E_Commerce_Redirect_URL__c.value: false, Is_E_Commerce_Visible__c: data.fields.Is_E_Commerce_Visible__c ? data.fields.Is_E_Commerce_Visible__c.value: false, 
             Is_E_Commerce_Active__c: data.fields.Is_E_Commerce_Active__c ? data.fields.Is_E_Commerce_Active__c.value: false,  Accounts_and_Billing_Title__c: data.fields.Accounts_and_Billing_Title__c ? data.fields.Accounts_and_Billing_Title__c.value: '',
             Accounts_and_Billing_Sub_Title__c: data.fields.Accounts_and_Billing_Sub_Title__c ? data.fields.Accounts_and_Billing_Sub_Title__c.value: '',Accounts_and_Billing_Redirect_URL__c: data.fields.Accounts_and_Billing_Redirect_URL__c ? data.fields.Accounts_and_Billing_Redirect_URL__c.value: false, 
             Is_Account_and_Billing_Visible__c: data.fields.Is_Account_and_Billing_Visible__c ? data.fields.Is_Account_and_Billing_Visible__c.value: false, Is_Account_and_Billing_Active__c: data.fields.Is_Account_and_Billing_Active__c ? data.fields.Is_Account_and_Billing_Active__c.value: false, 
             Exhibitor_Directory_Title__c: data.fields.Exhibitor_Directory_Title__c ? data.fields.Exhibitor_Directory_Title__c.value: '',
             Exhibitor_Directory_Sub_Title__c: data.fields.Exhibitor_Directory_Sub_Title__c ? data.fields.Exhibitor_Directory_Sub_Title__c.value: '',
             Exhibitor_Directory_Redirect_URL__c: data.fields.Exhibitor_Directory_Redirect_URL__c ? data.fields.Exhibitor_Directory_Redirect_URL__c.value: false, 
             Is_Customer_Profile_Visible__c: data.fields.Is_Customer_Profile_Visible__c ? data.fields.Is_Customer_Profile_Visible__c.value: false, 
             Is_Customer_Profile_Active__c: data.fields.Is_Customer_Profile_Active__c ? data.fields.Is_Customer_Profile_Active__c.value: false, 
             Upload_Center_Title__c: data.fields.Upload_Center_Title__c ? data.fields.Upload_Center_Title__c.value: '', 
             Upload_Center_Sub_Title__c: data.fields.Upload_Center_Sub_Title__c ? data.fields.Upload_Center_Sub_Title__c.value: '', 
             Upload_Center_Redirect_URL__c : data.fields.Upload_Center_Redirect_URL__c ? data.fields.Upload_Center_Redirect_URL__c.value: '', 
             Is_Upload_Center_Visible__c : data.fields.Is_Upload_Center_Visible__c ? data.fields.Is_Upload_Center_Visible__c.value: false, 
             Is_Upload_Center_Active__c: data.fields.Is_Upload_Center_Active__c ? data.fields.Is_Upload_Center_Active__c.value: false, 
             Freeman_Title__c: data.fields.Freeman_Title__c ? data.fields.Freeman_Title__c.value: '', 
             Freeman_Sub_Title__c: data.fields.Freeman_Sub_Title__c ? data.fields.Freeman_Sub_Title__c.value: '', 
             Freeman_Redirect_Url__c : data.fields.Freeman_Redirect_Url__c ? data.fields.Freeman_Redirect_Url__c.value: '', 
             Is_Freeman_Visible__c : data.fields.Is_Freeman_Visible__c ? data.fields.Is_Freeman_Visible__c.value: false, 
             Is_Freeman_Active__c: data.fields.Is_Freeman_Active__c ? data.fields.Is_Freeman_Active__c.value: false, 
             Custom_1_Title__c: data.fields.Custom_1_Title__c ? data.fields.Custom_1_Title__c.value: '', 
             Custom_1_Sub_Title__c: data.fields.Custom_1_Sub_Title__c ? data.fields.Custom_1_Sub_Title__c.value: '', 
             Custom_1_Redirect_URL__c : data.fields.Custom_1_Redirect_URL__c ? data.fields.Custom_1_Redirect_URL__c.value: '', 
             Is_Custom_1_Visible__c : data.fields.Is_Custom_1_Visible__c ? data.fields.Is_Custom_1_Visible__c.value: false, 
             Is_Custom_1_Active__c: data.fields.Is_Custom_1_Active__c ? data.fields.Is_Custom_1_Active__c.value: false, 
             Custom_2_Title__c: data.fields.Custom_2_Title__c ? data.fields.Custom_2_Title__c.value: '', 
             Custom_2_Sub_Title__c: data.fields.Custom_2_Sub_Title__c ? data.fields.Custom_2_Sub_Title__c.value: '', 
             Custom_2_Redirect_URL__c : data.fields.Custom_2_Redirect_URL__c ? data.fields.Custom_2_Redirect_URL__c.value: '', 
             Is_Custom_2_Visible__c : data.fields.Is_Custom_2_Visible__c ? data.fields.Is_Custom_2_Visible__c.value: false, 
             Is_Custom_2_Active__c: data.fields.Is_Custom_2_Active__c ? data.fields.Is_Custom_2_Active__c.value: false, 
             Custom_3_Title__c: data.fields.Custom_3_Title__c ? data.fields.Custom_3_Title__c.value: '', 
             Custom_3_Sub_Title__c: data.fields.Custom_3_Sub_Title__c ? data.fields.Custom_3_Sub_Title__c.value: '', 
             Custom_3_Redirect_URL__c : data.fields.Custom_3_Redirect_URL__c ? data.fields.Custom_3_Redirect_URL__c.value: '', 
             Is_Custom_3_Visible__c : data.fields.Is_Custom_3_Visible__c ? data.fields.Is_Custom_3_Visible__c.value: false, 
             Is_Custom_3_Active__c: data.fields.Is_Custom_3_Active__c ? data.fields.Is_Custom_3_Active__c.value: false, 
             Stand_Contractor_Title__c: data.fields.Stand_Contractor_Title__c ? data.fields.Stand_Contractor_Title__c.value: '', 
             Stand_Contractor_Sub_Title__c: data.fields.Stand_Contractor_Sub_Title__c ? data.fields.Stand_Contractor_Sub_Title__c.value: '', 
             Stand_Contractor_Redirect_URL__c : data.fields.Stand_Contractor_Redirect_URL__c ? data.fields.Stand_Contractor_Redirect_URL__c.value: '', 
             Is_Stand_Contractor_Visible__c : data.fields.Is_Stand_Contractor_Visible__c ? data.fields.Is_Stand_Contractor_Visible__c.value: false, 
             Is_Stand_Contractor_Active__c: data.fields.Is_Stand_Contractor_Active__c ? data.fields.Is_Stand_Contractor_Active__c.value: false, 
             My_Exhibitor_Title__c: data.fields.My_Exhibitor_Title__c ? data.fields.My_Exhibitor_Title__c.value: '', 
             My_Exhibitor_Sub_Title__c: data.fields.My_Exhibitor_Sub_Title__c ? data.fields.My_Exhibitor_Sub_Title__c.value: '', 
             My_Exhibitor_Redirect_URL__c : data.fields.My_Exhibitor_Redirect_URL__c ? data.fields.My_Exhibitor_Redirect_URL__c.value: '', 
             Is_My_Exhibitor_Visible__c : data.fields.Is_My_Exhibitor_Visible__c ? data.fields.Is_My_Exhibitor_Visible__c.value: false, 
             Is_My_Exhibitor_Active__c: data.fields.Is_My_Exhibitor_Active__c ? data.fields.Is_My_Exhibitor_Active__c.value: false,
             Subcontractor_Title__c: data.fields.Subcontractor_Title__c ? data.fields.Subcontractor_Title__c.value: '', 
             Subcontractor_Sub_Title__c: data.fields.Subcontractor_Sub_Title__c ? data.fields.Subcontractor_Sub_Title__c.value: '', 
             Subcontractor_Redirect_Url__c : data.fields.Subcontractor_Redirect_Url__c ? data.fields.Subcontractor_Redirect_Url__c.value: '', 
             Is_SubContractors_Visible__c : data.fields.Is_SubContractors_Visible__c ? data.fields.Is_SubContractors_Visible__c.value: false, 
             Is_SubContractors_Active__c: data.fields.Is_SubContractors_Active__c ? data.fields.Is_SubContractors_Active__c.value: false,
             Agent_Own_Exhibitor_Title__c: data.fields.Agent_Own_Exhibitor_Title__c ? data.fields.Agent_Own_Exhibitor_Title__c.value: '', 
             Agent_Own_Exhibitor_Sub_Title__c: data.fields.Agent_Own_Exhibitor_Sub_Title__c ? data.fields.Agent_Own_Exhibitor_Sub_Title__c.value: '', 
             Agent_Own_Exhibitor_Redirect_URL__c : data.fields.Agent_Own_Exhibitor_Redirect_URL__c ? data.fields.Agent_Own_Exhibitor_Redirect_URL__c.value: '', 
             Is_Agent_Own_Exhibitor_Visible__c : data.fields.Is_Agent_Own_Exhibitor_Visible__c ? data.fields.Is_Agent_Own_Exhibitor_Visible__c.value: false, 
             Is_Agent_Own_Exhibitor_Active__c: data.fields.Is_Agent_Own_Exhibitor_Active__c ? data.fields.Is_Agent_Own_Exhibitor_Active__c.value: false,
             Gorrilla_Title__c: data.fields.Gorrilla_Title__c ? data.fields.Gorrilla_Title__c.value: '', 
             Gorrilla_Sub_Title__c: data.fields.Gorrilla_Sub_Title__c ? data.fields.Gorrilla_Sub_Title__c.value: '', 
             Gorrilla_Redirect_Url__c : data.fields.Gorrilla_Redirect_Url__c ? data.fields.Gorrilla_Redirect_Url__c.value: '', 
             Is_Gorrilla_Visible__c : data.fields.Is_Gorrilla_Visible__c ? data.fields.Is_Gorrilla_Visible__c.value: false, 
             Is_Gorrilla_Active__c: data.fields.Is_Gorrilla_Active__c ? data.fields.Is_Gorrilla_Active__c.value: false,
             Is_EventCode_Required__c: data.fields.Is_EventCode_Required__c ? data.fields.Is_EventCode_Required__c.value: false,
             Enable_Feedback__c: data.fields.Enable_Feedback__c ? data.fields.Enable_Feedback__c.value: false,
             Feedback_Sub_Title__c: data.fields.Feedback_Sub_Title__c ? data.fields.Feedback_Sub_Title__c.value: '',
             Feedback_Redirect_URL__c: data.fields.Feedback_Redirect_URL__c ? data.fields.Feedback_Redirect_URL__c.value: '',
            }
            this.objHomeNav =  JSON.parse(JSON.stringify(tempObj));
            this.initialData = JSON.parse(JSON.stringify(tempObj));
        } else if (error) {
            this.record = undefined;
            window.console.log('=====> error ' + JSON.stringify(error));
        }
        this.isLoading = false;
    }
    cancelBtnClick() {
        this.objHomeNav = this.initialData;
   }
    onChangeHandleForms(event){
        let temp =  {...this.objHomeNav};
        if(event.target.name === 'formstitle'){
            temp.Forms_Title__c = event.target.value;   
        }
        if(event.target.name === 'formssubtitle'){
            temp.Forms_Sub_Title__c = event.target.value;
        }
        if(event.target.name === 'formsurl'){
            temp.Forms_Redirect_URL__c = event.target.value;
        }
        if( event.target.name === 'isvisible'){
            temp.Is_Form_Visible__c  = !temp.Is_Form_Visible__c ;
        }
        if( event.target.name === 'isavailable'){
            temp.Is_Form_Active__c = !temp.Is_Form_Active__c;
        }
        this.objHomeNav = temp;
    }
    onChangeHandleManuals(event){
        let temp =  {...this.objHomeNav};
        if(event.target.name === 'manualstitle'){
            temp.Manuals_Title__c = event.target.value;
        }
        if(event.target.name === 'manualssubtitle'){
            temp.Manuals_Sub_Title__c = event.target.value;
        }
        if(event.target.name === 'manualsurl'){
            temp.Manuals_Redirect_URL__c = event.target.value;
        }
        if( event.target.name === 'isvisible'){
            temp.Is_Manual_Visible__c = !temp.Is_Manual_Visible__c;
        }
        if( event.target.name === 'isavailable'){
            temp.Is_Manual_Active__c = !temp.Is_Manual_Active__c;
        }
        this.objHomeNav = temp;
    }
    onChangeHandleBadges(event){
        let temp =  {...this.objHomeNav};
        if(event.target.name === 'badgestitle'){
            temp.Badges_Title__c = event.target.value;
        }
        if(event.target.name === 'badgessubtitle'){
            temp.Badges_Sub_Title__c = event.target.value;
        }
        if(event.target.name === 'badgesurl'){
            temp.Badges_Redirect_URL__c = event.target.value;
        }
        if( event.target.name === 'isvisible'){
            temp.Is_Customer_Badges_Visible__c = !temp.Is_Customer_Badges_Visible__c;
        }
        if( event.target.name === 'isavailable'){
            temp.Is_Customer_Badges_Active__c = !temp.Is_Customer_Badges_Active__c;
        }
        this.objHomeNav = temp;
    }
    onChangeHandleProductCatalog(event){
        let temp =  {...this.objHomeNav};
        if(event.target.name === 'pctitle'){
            temp.E_Commerce_Title__c = event.target.value;
        }
        if(event.target.name === 'pcsubtitle'){
            temp.E_Commerce_Sub_Title__c = event.target.value;
        }
        if(event.target.name === 'pcurl'){
            temp.E_Commerce_Redirect_URL__c = event.target.value;
        }
        if( event.target.name === 'isvisible'){
            temp.Is_E_Commerce_Visible__c = !temp.Is_E_Commerce_Visible__c ;
        }
        if( event.target.name === 'isavailable'){
            temp.Is_E_Commerce_Active__c = !temp.Is_E_Commerce_Active__c;
        }
        this.objHomeNav = temp;
    }
    onChangeHandleAccountAndBilling(event){
        let temp =  {...this.objHomeNav};
        if(event.target.name === 'abtitle'){
            temp.Accounts_and_Billing_Title__c = event.target.value;
        }
        if(event.target.name === 'absubtitle'){
            temp.Accounts_and_Billing_Sub_Title__c = event.target.value;
        }
        if(event.target.name === 'aburl'){
            temp.Accounts_and_Billing_Redirect_URL__c = event.target.value;
        }
        if( event.target.name === 'isvisible'){
            temp.Is_Account_and_Billing_Visible__c = !temp.Is_Account_and_Billing_Visible__c;
        }
        if( event.target.name === 'isavailable'){
            temp.Is_Account_and_Billing_Active__c = !temp.Is_Account_and_Billing_Active__c;
        }
        this.objHomeNav = temp;
    }
    onChangeHandleExibitorProfile(event){
        let temp =  {...this.objHomeNav};
        if(event.target.name === 'eptitle'){
            temp.Exhibitor_Directory_Title__c = event.target.value;
        }
        if(event.target.name === 'epsubtitle'){
            temp.Exhibitor_Directory_Sub_Title__c = event.target.value;
        }
        if(event.target.name === 'epurl'){
            temp.Exhibitor_Directory_Redirect_URL__c = event.target.value;
        }
        if( event.target.name === 'isvisible'){
            temp.Is_Customer_Profile_Visible__c = !temp.Is_Customer_Profile_Visible__c;
        }
        if( event.target.name === 'isavailable'){
            temp.Is_Customer_Profile_Active__c =!temp.Is_Customer_Profile_Active__c;
        }
        this.objHomeNav = temp;
    }
    onChangeHandleUploadCenter(event){
        let temp =  {...this.objHomeNav};
        if(event.target.name === 'uploadcentertitle'){
            temp.Upload_Center_Title__c = event.target.value;
        }
        if(event.target.name === 'uploadcentersubtitle'){
            temp.Upload_Center_Sub_Title__c = event.target.value;
        }
        if(event.target.name === 'uploadcenterurl'){
            temp.Upload_Center_Redirect_URL__c = event.target.value;
        }
        if( event.target.name === 'isvisible'){
            temp.Is_Upload_Center_Visible__c = !temp.Is_Upload_Center_Visible__c;
        }
        if( event.target.name === 'isavailable'){
            temp.Is_Upload_Center_Active__c = !temp.Is_Upload_Center_Active__c;
        }
        this.objHomeNav = temp;
    }
    onChangeHandleFreeman(event){
        let temp =  {...this.objHomeNav};
        if(event.target.name === 'freemantitle'){
            temp.Freeman_Title__c = event.target.value;
        }
        if(event.target.name === 'freemansubtitle'){
            temp.Freeman_Sub_Title__c = event.target.value;
        }
        if(event.target.name === 'freemanurl'){
            temp.Freeman_Redirect_Url__c = event.target.value;
        }
        if( event.target.name === 'isvisible'){
            temp.Is_Freeman_Visible__c = !temp.Is_Freeman_Visible__c;
        }
        if( event.target.name === 'isavailable'){
            temp.Is_Freeman_Active__c = !temp.Is_Freeman_Active__c;   
        }
        this.objHomeNav = temp;
    }
    onChangeHandleCustomPage1(event){
        let temp =  {...this.objHomeNav};
        if(event.target.name === 'custompage1title'){
            temp.Custom_1_Title__c = event.target.value;
        }
        if(event.target.name === 'custompage1subtitle'){
            temp.Custom_1_Sub_Title__c = event.target.value;
        }
        if(event.target.name === 'custompage1url'){
            temp.Custom_1_Redirect_URL__c = event.target.value;
        }
        if( event.target.name === 'isvisible'){
            temp.Is_Custom_1_Visible__c = !temp.Is_Custom_1_Visible__c;
        }
        if( event.target.name === 'isavailable'){
            temp.Is_Custom_1_Active__c = !temp.Is_Custom_1_Active__c;
        }
        this.objHomeNav = temp;
    }
    onChangeHandleCustomPage2(event){
        let temp =  {...this.objHomeNav};
        if(event.target.name === 'custompage2title'){
            temp.Custom_2_Title__c = event.target.value;
        }
        if(event.target.name === 'custompage2subtitle'){
            temp.Custom_2_Sub_Title__c = event.target.value;
        }
        if(event.target.name === 'custompage2url'){
            temp.Custom_2_Redirect_URL__c = event.target.value;
        }
        if( event.target.name === 'isvisible'){
            temp.Is_Custom_2_Visible__c = !temp.Is_Custom_2_Visible__c;
        }
        if( event.target.name === 'isavailable'){
            temp.Is_Custom_2_Active__c = !temp.Is_Custom_2_Active__c;
        }
        this.objHomeNav = temp;
    }
    onChangeHandleCustomPage3(event){
        let temp =  {...this.objHomeNav};
        if(event.target.name === 'custompage3title'){
            temp.Custom_3_Title__c = event.target.value;
        }
        if(event.target.name === 'custompage3subtitle'){
            temp.Custom_3_Sub_Title__c = event.target.value;
        }
        if(event.target.name === 'custompage3url'){
            temp.Custom_3_Redirect_URL__c = event.target.value;
        }
        if( event.target.name === 'isvisible'){
            temp.Is_Custom_3_Visible__c = !temp.Is_Custom_3_Visible__c;
        }
        if( event.target.name === 'isavailable'){
            temp.Is_Custom_3_Active__c = !temp.Is_Custom_3_Active__c;
        }
        this.objHomeNav = temp;
    }
    onChangeHandleStandContructor(event){
        let temp =  {...this.objHomeNav};
        if(event.target.name === 'sctitle'){
            temp.Stand_Contractor_Title__c = event.target.value;
        }
        if(event.target.name === 'scsubtitle'){
            temp.Stand_Contractor_Sub_Title__c = event.target.value;
        }
        if(event.target.name === 'scurl'){
            temp.Stand_Contractor_Redirect_URL__c = event.target.value;
        }

        if( event.target.name === 'isvisible'){
            temp.Is_Stand_Contractor_Visible__c = !temp.Is_Stand_Contractor_Visible__c;
        }
        if( event.target.name === 'isavailable'){
            temp.Is_Stand_Contractor_Active__c = !temp.Is_Stand_Contractor_Active__c;
        }
        this.objHomeNav = temp;
    }
    onChangeHandleMyExibitor(event){
        let temp =  {...this.objHomeNav};
        if(event.target.name === 'myexibitortitle'){
            temp.My_Exhibitor_Title__c = event.target.value;
        }
        if(event.target.name === 'myexibitorsubtitle'){
            temp.My_Exhibitor_Sub_Title__c = event.target.value;
        }
        if(event.target.name === 'myexibitorurl'){
            temp.My_Exhibitor_Redirect_URL__c = event.target.value;
        }
        if( event.target.name === 'isvisible'){
            temp.Is_My_Exhibitor_Visible__c  = !temp.Is_My_Exhibitor_Visible__c;
        }
        if( event.target.name === 'isavailable'){
            temp.Is_My_Exhibitor_Active__c = !temp.Is_My_Exhibitor_Active__c;
        }
        this.objHomeNav = temp;
    }
    onChangeHandleSubcontractor(event){
        let temp =  {...this.objHomeNav};
        if(event.target.name === 'subcontructortitle'){
            temp.Subcontractor_Title__c = event.target.value;
        }
        if(event.target.name === 'subcontructorsubtitle'){
            temp.Subcontractor_Sub_Title__c = event.target.value;
        }
        if(event.target.name === 'subcontructorurl'){
            temp.Subcontractor_Redirect_Url__c = event.target.value;
        }
        if( event.target.name === 'isvisible'){
            temp.Is_SubContractors_Visible__c = !temp.Is_SubContractors_Visible__c;
        }
        if( event.target.name === 'isavailable'){
            temp.Is_SubContractors_Active__c = !temp.Is_SubContractors_Active__c;
        }
        this.objHomeNav = temp;
    }
    onChangeHandleAgentOwn(event){
        let temp =  {...this.objHomeNav};
        if(event.target.name === 'agentownedtitle'){
            temp.Agent_Own_Exhibitor_Title__c = event.target.value;
        }
        if(event.target.name === 'agentownedsubtitle'){
            temp.Agent_Own_Exhibitor_Sub_Title__c = event.target.value;
        }
        if(event.target.name === 'agentownedurl'){
            temp.Agent_Own_Exhibitor_Redirect_URL__c = event.target.value;
        }
        if( event.target.name === 'isvisible'){
            temp.Is_Agent_Own_Exhibitor_Visible__c = !temp.Is_Agent_Own_Exhibitor_Visible__c;
        }
        if( event.target.name === 'isavailable'){
            temp.Is_Agent_Own_Exhibitor_Active__c = !temp.Is_Agent_Own_Exhibitor_Active__c;
        }
        this.objHomeNav = temp;
    }
    onChangeHandleSSOLink(event){
        let temp =  {...this.objHomeNav};
        if(event.target.name === 'ssolinktitle'){
            temp.Gorrilla_Title__c = event.target.value;
        }
        if(event.target.name === 'ssolinksubtitle'){
            temp.Gorrilla_Sub_Title__c = event.target.value;
        }
        if(event.target.name === 'ssolinkurl'){
            temp.Gorrilla_Redirect_Url__c = event.target.value;
        }
        if( event.target.name === 'isvisible'){
            temp.Is_Gorrilla_Visible__c = !temp.Is_Gorrilla_Visible__c;
        }
        if( event.target.name === 'isavailable'){
            temp.Is_Gorrilla_Active__c = !temp.Is_Gorrilla_Active__c;
        }
        this.objHomeNav = temp;
    }
    onChangeHandleFeedback(event){
        let temp =  {...this.objHomeNav};
        if(event.target.name === 'feedbacktitle'){
            temp.Feedback_Sub_Title__c = event.target.value;
        }
        if(event.target.name === 'feedbacklinkurl'){
            temp.Feedback_Redirect_URL__c = event.target.value;
        }
        if(event.target.name === 'feedbackenable'){
            temp.Enable_Feedback__c = !temp.Enable_Feedback__c; 
        }
        this.objHomeNav = temp;
    }
    onChangeHandleEventCode(){
        let temp =  {...this.objHomeNav};
        temp.Is_EventCode_Required__c = !temp.Is_EventCode_Required__c;
        this.objHomeNav = temp;
    }
    saveBtnClick() {
        
        let tempObj = this.objHomeNav;
        if( (tempObj.Enable_Feedback__c && tempObj.Feedback_Redirect_URL__c) || (!tempObj.Enable_Feedback__c) ){

            let record = {
                fields: {
                    Forms_Title__c: tempObj.Forms_Title__c, Forms_Sub_Title__c : tempObj.Forms_Sub_Title__c, Map_it_button_visibility__c: tempObj.Map_it_button_visibility__c,
                    Forms_Redirect_URL__c: tempObj.Forms_Redirect_URL__c,Is_Form_Visible__c: tempObj.Is_Form_Visible__c,Is_Form_Active__c: tempObj.Is_Form_Active__c,
                    Manuals_Title__c: tempObj.Manuals_Title__c,Manuals_Sub_Title__c: tempObj.Manuals_Sub_Title__c,Manuals_Redirect_URL__c: tempObj.Manuals_Redirect_URL__c,
                    Is_Manual_Visible__c: tempObj.Is_Manual_Visible__c,Is_Manual_Active__c: tempObj.Is_Manual_Active__c, Badges_Title__c: tempObj.Badges_Title__c,
                    Badges_Sub_Title__c: tempObj.Badges_Sub_Title__c, Badges_Redirect_URL__c: tempObj.Badges_Redirect_URL__c,
                    Is_Customer_Badges_Visible__c: tempObj.Is_Customer_Badges_Visible__c, Is_Customer_Badges_Active__c: tempObj.Is_Customer_Badges_Active__c,
                    E_Commerce_Title__c: tempObj.E_Commerce_Title__c, E_Commerce_Sub_Title__c: tempObj.E_Commerce_Sub_Title__c,E_Commerce_Redirect_URL__c: tempObj.E_Commerce_Redirect_URL__c,
                    Is_E_Commerce_Visible__c: tempObj.Is_E_Commerce_Visible__c,Is_E_Commerce_Active__c: tempObj.Is_E_Commerce_Active__c,
                    Accounts_and_Billing_Title__c: tempObj.Accounts_and_Billing_Title__c,Accounts_and_Billing_Sub_Title__c: tempObj.Accounts_and_Billing_Sub_Title__c,
                    Accounts_and_Billing_Redirect_URL__c: tempObj.Accounts_and_Billing_Redirect_URL__c,Is_Account_and_Billing_Visible__c: tempObj.Is_Account_and_Billing_Visible__c,
                    Is_Account_and_Billing_Active__c: tempObj.Is_Account_and_Billing_Active__c, Exhibitor_Directory_Title__c: tempObj.Exhibitor_Directory_Title__c,
                    Exhibitor_Directory_Sub_Title__c: tempObj.Exhibitor_Directory_Sub_Title__c, Exhibitor_Directory_Redirect_URL__c: tempObj.Exhibitor_Directory_Redirect_URL__c,
                    Is_Customer_Profile_Visible__c: tempObj.Is_Customer_Profile_Visible__c, Is_Customer_Profile_Active__c: tempObj.Is_Customer_Profile_Active__c,
                    Upload_Center_Title__c: tempObj.Upload_Center_Title__c,Upload_Center_Sub_Title__c: tempObj.Upload_Center_Sub_Title__c,
                    Upload_Center_Redirect_URL__c: tempObj.Upload_Center_Redirect_URL__c, Is_Upload_Center_Visible__c: tempObj.Is_Upload_Center_Visible__c,
                    Is_Upload_Center_Active__c: tempObj.Is_Upload_Center_Active__c, Freeman_Title__c: tempObj.Freeman_Title__c, Freeman_Sub_Title__c: tempObj.Freeman_Sub_Title__c,
                    Freeman_Redirect_Url__c: tempObj.Freeman_Redirect_Url__c, Is_Freeman_Visible__c: tempObj.Is_Freeman_Visible__c, Is_Freeman_Active__c: tempObj.Is_Freeman_Active__c,
                     Custom_1_Title__c: tempObj.Custom_1_Title__c, Custom_1_Sub_Title__c: tempObj.Custom_1_Sub_Title__c, Custom_1_Redirect_URL__c: tempObj.Custom_1_Redirect_URL__c,
                     Is_Custom_1_Visible__c: tempObj.Is_Custom_1_Visible__c,Is_Custom_1_Active__c: tempObj.Is_Custom_1_Active__c,
                    Custom_2_Title__c: tempObj.Custom_2_Title__c,Custom_2_Sub_Title__c: tempObj.Custom_2_Sub_Title__c,
                    Custom_2_Redirect_URL__c: tempObj.Custom_2_Redirect_URL__c, Is_Custom_2_Visible__c: tempObj.Is_Custom_2_Visible__c,
                    Is_Custom_2_Active__c: tempObj.Is_Custom_2_Active__c, Custom_3_Title__c: tempObj.Custom_3_Title__c,
                    Custom_3_Sub_Title__c: tempObj.Custom_3_Sub_Title__c,Custom_3_Redirect_URL__c: tempObj.Custom_3_Redirect_URL__c,
                    Is_Custom_3_Visible__c: tempObj.Is_Custom_3_Visible__c,Is_Custom_3_Active__c: tempObj.Is_Custom_3_Active__c,
                    Stand_Contractor_Title__c: tempObj.Stand_Contractor_Title__c,Stand_Contractor_Sub_Title__c: tempObj.Stand_Contractor_Sub_Title__c,
                    Stand_Contractor_Redirect_URL__c: tempObj.Stand_Contractor_Redirect_URL__c,
                    Is_Stand_Contractor_Visible__c: tempObj.Is_Stand_Contractor_Visible__c,Is_Stand_Contractor_Active__c: tempObj.Is_Stand_Contractor_Active__c,
                    My_Exhibitor_Title__c: tempObj.My_Exhibitor_Title__c, My_Exhibitor_Sub_Title__c: tempObj.My_Exhibitor_Sub_Title__c,
                    My_Exhibitor_Redirect_URL__c: tempObj.My_Exhibitor_Redirect_URL__c,Is_My_Exhibitor_Visible__c: tempObj.Is_My_Exhibitor_Visible__c,
                    Is_My_Exhibitor_Active__c: tempObj.Is_My_Exhibitor_Active__c,Subcontractor_Title__c: tempObj.Subcontractor_Title__c,
                    Subcontractor_Sub_Title__c: tempObj.Subcontractor_Sub_Title__c,Subcontractor_Redirect_Url__c: tempObj.Subcontractor_Redirect_Url__c,
                    Is_SubContractors_Visible__c: tempObj.Is_SubContractors_Visible__c,Is_SubContractors_Active__c: tempObj.Is_SubContractors_Active__c,
                    Agent_Own_Exhibitor_Title__c: tempObj.Agent_Own_Exhibitor_Title__c,Agent_Own_Exhibitor_Sub_Title__c: tempObj.Agent_Own_Exhibitor_Sub_Title__c,
                    Agent_Own_Exhibitor_Redirect_URL__c: tempObj.Agent_Own_Exhibitor_Redirect_URL__c, Is_Agent_Own_Exhibitor_Visible__c: tempObj.Is_Agent_Own_Exhibitor_Visible__c,
                    Is_Agent_Own_Exhibitor_Active__c: tempObj.Is_Agent_Own_Exhibitor_Active__c, Gorrilla_Title__c: tempObj.Gorrilla_Title__c,
                    Gorrilla_Sub_Title__c: tempObj.Gorrilla_Sub_Title__c, Gorrilla_Redirect_Url__c: tempObj.Gorrilla_Redirect_Url__c,
                    Is_Gorrilla_Visible__c: tempObj.Is_Gorrilla_Visible__c,Is_Gorrilla_Active__c: tempObj.Is_Gorrilla_Active__c,
                    Is_EventCode_Required__c: tempObj.Is_EventCode_Required__c,Enable_Feedback__c: tempObj.Enable_Feedback__c,
                    Feedback_Sub_Title__c: tempObj.Feedback_Sub_Title__c,Feedback_Redirect_URL__c: tempObj.Feedback_Redirect_URL__c,
                    Id: tempObj.Id
                },
            };
            updateRecord(record)
                .then(() => {
                    this.dispatchEvent(
                        new ShowToastEvent({ title: 'Success', message: 'Record Is Updated', variant: 'success',
                        }),
                    );
                    this.objHomeNav = {...tempObj};
                })
                .catch(() => {
                    this.dispatchEvent(
                        new ShowToastEvent({ title: 'Error',message: 'Error while updating', variant: 'error',
                        }),
                    );
                });
        }
        else{
            this.dispatchEvent(
                new ShowToastEvent({ title: 'Error',message: 'Feedback Redirect URL is required when Enable Feedback is checked', variant: 'error',
                }),
            );
        }
        
    }
 
}