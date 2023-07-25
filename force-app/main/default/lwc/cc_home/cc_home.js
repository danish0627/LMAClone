import { LightningElement, track,wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import welcome from '@salesforce/label/c.Welcome';
import standSummary from '@salesforce/label/c.Stand_Summary';
import Stand_Summary_Subtext from '@salesforce/label/c.Stand_Summary_Subtext';
import My_Exhibitors from '@salesforce/label/c.My_Exhibitors';
import Page from '@salesforce/label/c.Page';
import mapIt from '@salesforce/label/c.Map_It';
import userId from '@salesforce/user/Id';
import fecthBoothDetails from "@salesforce/apex/CC_HomeCtrl.getOppBoothDetails";
import checkUserPermission from "@salesforce/apex/CC_HomeCtrl.checkPermission";

import fetchUserDetails from "@salesforce/apex/CC_HeaderCtrl.fetchUserDetails";
import cancel from '@salesforce/label/c.Cancel';

export default class Cc_home extends LightningElement 
{
    @track booths = [];
    @track eventDtls;
    @track eventcode;
    @track isAgent=false;
    @track lstAnnouncements=[];
    @track isGreetingPopUp =false;
    @track isEventLive = true;
    @track accountId;
    label = { welcome, standSummary, mapIt,cancel,Page,My_Exhibitors,Stand_Summary_Subtext };
    userId = userId;
    @track isRemaningForms=true;

    //added By Mukesh Gupta(19 Nov,2019)
    @track isShowContrator=false;


    @wire(CurrentPageReference)
    setCurrentPageReference(currentPageReference) {
        if (currentPageReference) {
            this.eventcode = currentPageReference.state.eventcode;
            this.fetchUserDtls(this.eventcode);
            //fetch current login user booth details for satnd summary
            fecthBoothDetails({eventCode: this.eventcode})
            .then(result => {
                for (let i = 0; i < result.length; i++) {
                    let tempObj = Object.assign({ mapItLink: 'https://www.expocad.com/host/fx/informa/'+this.eventcode+'/exfx.html?zoomto='+result[i].boothName }, result[i]);
                    this.booths.push(tempObj);
                }
            })
            .catch(error => {
                window.console.log('error...' + JSON.stringify(error)); 
            });
        }
    }

    //added By Mukesh Gupta(19 Nov,2019)
    fetchUserPermission(sEventcode){
        checkUserPermission({sEventcode:sEventcode,accId:this.accountId})
        .then(res =>{
            if(res === 'success'){
                this.isShowContrator = true;
            }
        })
        .catch(error=>{
            // eslint-disable-next-line no-console
            console.error(error);
        });
    }

    //fetch current login user action items (visibilty of links, popup visibility),Announcemnts for current login user account. 
    fetchUserDtls(eventcode) {
        fetchUserDetails({ eventCode: eventcode })
        .then(result => {
            this.eventDtls = result;
            
            if(result.userType==='Agent')
            {
                this.isAgent=true;
            }
            if(result.lstAnnouncements)
            {
                this.lstAnnouncements=result.lstAnnouncements;
            }
            if(!result.eventSettings.Is_Event_Edition_Live__c)
            {
                this.isEventLive = false;
            }
            if(result.accountId)
            {
                this.accountId=result.accountId;
                //this method used to check condition of Standard Contractor visibility.
                this.fetchUserPermission(eventcode);
            }
            if(result.userTypeMapping)
            {
                if(result.eventSettings.Is_Pop_Up_Greeting__c && result.userTypeMapping.Pop_Up_Greeting_Show__c)
                {
                    this.ispopupvisible(eventcode);
                }
            }
        })
        .catch(error => {
            window.console.log('error...' + JSON.stringify(error));
        });
      
    }
    cancelModal()
    {
        this.isGreetingPopUp =false;
    }
    //show required manuals message for the current login user account
    get fetchReqManauls()
    {
        let remain=0;
        let reqManauls='';
        if(this.eventDtls.lstManuals)
        {
            if(this.eventDtls.lstManuals.length)
            {
                for (let i = 0; i < this.eventDtls.lstManuals.length; i++) {
                    if(this.eventDtls.lstManuals[i].Is_Agree__c && this.eventDtls.lstManuals[i].Is_Viewed__c)
                    {
                         remain=remain+1;
                    }
                }
                reqManauls = remain===this.eventDtls.lstManuals.length?'':'You have read and agreed to '+remain+' out of '+this.eventDtls.lstManuals.length+' required documents';
            }
        }
        return reqManauls;
    }

    //for future reference will be active in future
    get fetchReqForms()
    {
       let remain=0;
       let reqForms='';
     if(this.eventDtls.lstForms)
     {
        if(this.eventDtls.lstForms.length) 
        {
          for (let i = 0; i < this.eventDtls.lstForms.length; i++) {
             if(this.eventDtls.lstForms[i].Is_Filled_Up__c)
             {
               remain=remain+1;
             }
            }
        }
        if(remain===this.eventDtls.lstForms.length){
            this.isRemaningForms=false;
            reqForms ='You have submitted or agreed to complete '+this.eventDtls.lstForms.length+' out of '+this.eventDtls.lstForms.length+' required forms';
        }
        else{
            reqForms ='You have submitted or agreed to complete '+remain+' out of '+this.eventDtls.lstForms.length+' required forms'; 
        }
     }
     return reqForms;     
    }   
    get buttonBranding()
    {
        return 'background-color:'+ this.eventDtls.eventSettings.Button_colors__c+ ';color:'+this.eventDtls.eventSettings.Button_Text_Color__c+';border-color:'+ this.eventDtls.eventSettings.Button_colors__c;
    }
    get isStandSummaryVisble()
    {
        return this.booths.length>0 && this.eventDtls.eventSettings.Event_Summary_Visibility__c? true:false;
    }
    get isComingSoonVisible()
    {
        if(this.isFormVisible_Soon || this.isManualVisible_Soon || this.isBadgeVisible_Soon || this.isCustomerProfileVisible_Soon || this.isStandConVisible_Soon || this.isFreeManVisible_Soon || this.isMyExhVisible_Soon || this.isSubConVisible_Soon || this.isAgentOwnExhVisible_Soon || this.isGorrillaVisible_Soon || this.isCustom1Visible_Soon || this.isCustom2Visible_Soon || this.isCustom3Visible_Soon)
        {
            return true;
        }
        return false; 
    }
    get isFormVisible()
    {
        return this.eventDtls.eventSettings.Is_Form_Active__c && this.eventDtls.eventSettings.Is_Form_Visible__c && this.eventDtls.userTypeMapping.Form_Show__c ? true :false;
    }
    get formUrl()
    {
        return this.eventDtls.eventSettings.Forms_Redirect_URL__c?this.eventDtls.eventSettings.Forms_Redirect_URL__c:'/CustomerCenter/s/forms?eventcode='+ this.eventcode;
    }
    get isManualVisible()
    {
        return this.eventDtls.eventSettings.Is_Manual_Active__c &&this.eventDtls.eventSettings.Is_Manual_Visible__c && this.eventDtls.userTypeMapping.Manual_Show__c ? true :false;
    }
    get manualUrl()
    {
        return this.eventDtls.eventSettings.Manuals_Redirect_URL__c?this.eventDtls.eventSettings.Manuals_Redirect_URL__c:'/CustomerCenter/s/manuals?eventcode='+ this.eventcode;
    }
    get isBadgeVisible()
    {
        return this.eventDtls.eventSettings.Is_Customer_Badges_Active__c && this.eventDtls.eventSettings.Is_Customer_Badges_Visible__c && this.eventDtls.userTypeMapping.Badges_Show__c ? true :false;
    }
    get badgeUrl()
    {
        return this.eventDtls.eventSettings.Badges_Redirect_URL__c?this.eventDtls.eventSettings.Badges_Redirect_URL__c:'/CustomerCenter/s/badges?eventcode='+ this.eventcode;
    }
    get isCustomerProfileVisible()
    {
        return this.eventDtls.eventSettings.Is_Customer_Profile_Active__c && this.eventDtls.eventSettings.Is_Customer_Profile_Visible__c && this.eventDtls.userTypeMapping.Exhibitor_Directory_Show__c ? true :false;
    }
    get customerProfileUrl()
    {
        return this.eventDtls.eventSettings.Exhibitor_Directory_Redirect_URL__c?this.eventDtls.eventSettings.Exhibitor_Directory_Redirect_URL__c:'/CustomerCenter/s/exhibitorprofile?eventcode='+ this.eventcode;
    }
    get isStandConVisible()
    {
        return this.eventDtls.eventSettings.Is_Stand_Contractor_Active__c && 
        this.eventDtls.eventSettings.Is_Stand_Contractor_Visible__c && this.isShowContrator &&
        this.eventDtls.userTypeMapping.Standard_Contractor_Show__c ? true :false;
    }
    get standConUrl()
    {
        return this.eventDtls.eventSettings.Stand_Contractor_Redirect_URL__c?this.eventDtls.eventSettings.Stand_Contractor_Redirect_URL__c:'/CustomerCenter/s/standcontractors?eventcode='+ this.eventcode;
    } 
    get isFreeManVisible()
    {
        return this.eventDtls.eventSettings.Is_Freeman_Active__c && this.eventDtls.eventSettings.Is_Freeman_Visible__c && this.eventDtls.userTypeMapping.Freeman_Show__c ? true :false;
    }
    get freeManUrl()
    {
        return this.eventDtls.eventSettings.Freeman_Redirect_Url__c?this.eventDtls.eventSettings.Freeman_Redirect_Url__c:'/CustomerCenter/apex/SSO_Freeman?freemanshowid='+this.eventDtls.eventSettings.Event_Edition__r.Freeman_Show_ID__c;
    }
    get isMyExhVisible()
    {
        return this.eventDtls.eventSettings.Is_My_Exhibitor_Active__c && this.eventDtls.eventSettings.Is_My_Exhibitor_Visible__c && this.eventDtls.userTypeMapping.My_Exhibitor_Show__c ? true :false;
    }
    get myExhUrl()
    { 
        return this.eventDtls.eventSettings.My_Exhibitor_Redirect_URL__c?this.eventDtls.eventSettings.My_Exhibitor_Redirect_URL__c:'/CustomerCenter/s/myexhibitors?eventcode='+ this.eventcode;
    }
    get isSubConVisible()
    {
        return this.eventDtls.eventSettings.Is_SubContractors_Active__c && this.eventDtls.eventSettings.Is_SubContractors_Visible__c && this.eventDtls.userTypeMapping.SubContractor_Show__c ? true :false;
    }
    get subConUrl()
    { 
        return this.eventDtls.eventSettings.Subcontractor_Redirect_Url__c?this.eventDtls.eventSettings.Subcontractor_Redirect_Url__c:'/CustomerCenter/s/subcontractors?eventcode='+ this.eventcode;
    }
    get isAgentOwnExhVisible()
    {
        return this.eventDtls.eventSettings.Is_Agent_Own_Exhibitor_Active__c  && this.eventDtls.eventSettings.Is_Agent_Own_Exhibitor_Visible__c && this.eventDtls.userTypeMapping.Agent_Own_Exhibitor_Show__c ? true :false;
    }
    get agentOwnExhUrl()
    {
        return this.eventDtls.eventSettings.Agent_Own_Exhibitor_Redirect_URL__c?this.eventDtls.eventSettings.Agent_Own_Exhibitor_Redirect_URL__c:'/CustomerCenter/s/agentownexhibitors?eventcode='+ this.eventcode;
    }
    get isGorrillaVisible()
    {
        return this.eventDtls.eventSettings.Is_Gorrilla_Active__c && this.eventDtls.eventSettings.Is_Gorrilla_Visible__c && this.eventDtls.userTypeMapping.Gorrilla_Show__c ? true :false;
    }
    get GorrillaUrl()
    {
        let url = '';
        if(this.eventDtls.eventSettings.Gorrilla_Redirect_Url__c){
            url=this.eventDtls.eventSettings.Gorrilla_Redirect_Url__c;
            if(this.accountId)
            {
                url=url+this.accountId;
            }
        }
        else{
            url='/CustomerCenter/apex/CC_Maintenance';
        }
        if(this.eventDtls.eventSettings.Is_EventCode_Required__c)
        {
            url=url+'?eventCode='+this.eventcode;
        }
        return url;
    }
    get isCustom1Visible()
    {
        return this.eventDtls.eventSettings.Is_Custom_1_Active__c && this.eventDtls.eventSettings.Is_Custom_1_Visible__c && this.eventDtls.userTypeMapping.Custom_1_Show__c ? true :false;
    }
    get custom1Url()
    {
        return this.eventDtls.eventSettings.Custom_1_Redirect_URL__c?this.eventDtls.eventSettings.Custom_1_Redirect_URL__c:'/CustomerCenter/s/custompage1?eventcode='+ this.eventcode;
    }
    get isCustom2Visible()
    {
        return this.eventDtls.eventSettings.Is_Custom_2_Active__c && this.eventDtls.eventSettings.Is_Custom_2_Visible__c && this.eventDtls.userTypeMapping.Custom_2_Show__c ? true :false;
    }
    get custom2Url()
    {
        return this.eventDtls.eventSettings.Custom_2_Redirect_URL__c?this.eventDtls.eventSettings.Custom_2_Redirect_URL__c:'/CustomerCenter/s/custompage2?eventcode='+ this.eventcode;
    }
    get isCustom3Visible()
    {
        return this.eventDtls.eventSettings.Is_Custom_3_Active__c && this.eventDtls.eventSettings.Is_Custom_3_Visible__c && this.eventDtls.userTypeMapping.Custom_3_Show__c ? true :false;
    }
    get custom3Url()
    {
        return this.eventDtls.eventSettings.Custom_3_Redirect_URL__c?this.eventDtls.eventSettings.Custom_3_Redirect_URL__c:'/CustomerCenter/s/custompage3?eventcode='+ this.eventcode;
    }


    get isFormVisible_Soon()
    {
        return !this.eventDtls.eventSettings.Is_Form_Active__c  && this.eventDtls.eventSettings.Is_Form_Visible__c && this.eventDtls.userTypeMapping.Form_Show__c? true :false;
    }
   
    get isManualVisible_Soon()
    {
        return !this.eventDtls.eventSettings.Is_Manual_Active__c &&this.eventDtls.eventSettings.Is_Manual_Visible__c && this.eventDtls.userTypeMapping.Manual_Show__c ? true :false;
    }
  
    get isBadgeVisible_Soon()
    {
        return !this.eventDtls.eventSettings.Is_Customer_Badges_Active__c && this.eventDtls.eventSettings.Is_Customer_Badges_Visible__c && this.eventDtls.userTypeMapping.Badges_Show__c ? true :false;
    }
    
    get isCustomerProfileVisible_Soon()
    {
        return !this.eventDtls.eventSettings.Is_Customer_Profile_Active__c && this.eventDtls.eventSettings.Is_Customer_Profile_Visible__c && this.eventDtls.userTypeMapping.Exhibitor_Directory_Show__c ? true :false;
    }
   
    get isStandConVisible_Soon()
    {
        return !this.eventDtls.eventSettings.Is_Stand_Contractor_Active__c && this.eventDtls.eventSettings.Is_SubContractors_Visible__c && this.eventDtls.userTypeMapping.Standard_Contractor_Show__c ? true :false;
    }
   
    get isFreeManVisible_Soon()
    {
        return !this.eventDtls.eventSettings.Is_Freeman_Active__c && this.eventDtls.eventSettings.Is_Freeman_Visible__c && this.eventDtls.userTypeMapping.Freeman_Show__c ? true :false;
    }
   
    get isMyExhVisible_Soon()
    {
        return !this.eventDtls.eventSettings.Is_My_Exhibitor_Active__c && this.eventDtls.eventSettings.Is_My_Exhibitor_Visible__c && this.eventDtls.userTypeMapping.My_Exhibitor_Show__c ? true :false;
    }
   
    get isSubConVisible_Soon()
    {
        return !this.eventDtls.eventSettings.Is_SubContractors_Active__c && this.eventDtls.eventSettings.Is_SubContractors_Visible__c && this.eventDtls.userTypeMapping.SubContractor_Show__c ? true :false;
    }
   
    get isAgentOwnExhVisible_Soon()
    {
        return !this.eventDtls.eventSettings.Is_Agent_Own_Exhibitor_Active__c  && this.eventDtls.eventSettings.Is_Agent_Own_Exhibitor_Visible__c && this.eventDtls.userTypeMapping.Agent_Own_Exhibitor_Show__c ? true :false;
    }
   
    get isGorrillaVisible_Soon()
    {
        return !this.eventDtls.eventSettings.Is_Gorrilla_Active__c && this.eventDtls.eventSettings.Is_Gorrilla_Visible__c && this.eventDtls.userTypeMapping.Gorrilla_Show__c ? true :false;
    }
   
    get isCustom1Visible_Soon()
    {
        return !this.eventDtls.eventSettings.Is_Custom_1_Active__c && this.eventDtls.eventSettings.Is_Custom_1_Visible__c && this.eventDtls.userTypeMapping.Custom_1_Show__c ? true :false;
    }
   
    get isCustom2Visible_Soon()
    {
        return !this.eventDtls.eventSettings.Is_Custom_2_Active__c && this.eventDtls.eventSettings.Is_Custom_2_Visible__c && this.eventDtls.userTypeMapping.Custom_2_Show__c ? true :false;
    }
    
    get isCustom3Visible_Soon()
    {
        return !this.eventDtls.eventSettings.Is_Custom_3_Active__c && this.eventDtls.eventSettings.Is_Custom_3_Visible__c && this.eventDtls.userTypeMapping.Custom_3_Show__c ? true :false;
    }
    ispopupvisible(eventcode)
    {
        this.isGreetingPopUp=true;
        let  userSessionObj = userId+eventcode;
        let  userSession = localStorage.getItem('UserSession');
        if (userSession===userSessionObj) 
        { 
            this.isGreetingPopUp=false;
        }
        else{
            localStorage.setItem('UserSession',userSessionObj);
            this.isGreetingPopUp=true;
        }
    }
}