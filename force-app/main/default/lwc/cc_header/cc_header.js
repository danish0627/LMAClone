import { LightningElement, track, wire } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import CustomerCenterWS11 from '@salesforce/resourceUrl/CustomerCenterWS11';
import { CurrentPageReference } from 'lightning/navigation';
import fetchUserDetails from "@salesforce/apex/CC_HeaderCtrl.fetchUserDetails";
import checkUserPermission from "@salesforce/apex/CC_HomeCtrl.checkPermission";

export default class Cc_header extends LightningElement {
    @track eventDtls;
    @track eventSettings;
    @track userTypeMapping;
    @track lstEvents;
    @track lstAnnouncements;
    @track lstManuals;
    @track cssmenu = 'cssmenu';
    @track eventLocation;
    @track lstEventNameList = [];
    @track eventcode;
    @track pageName;
    @track accountName;
    @track accountId;
    @track eventLogo;
    @track totalEvents;
    @track isEventLive;
    //Added By Mukesh Gupta(19 Nov,2019) 
    @track isShowContrator=false;

    @wire(CurrentPageReference)
    setCurrentPageReference(currentPageReference) {
        if (currentPageReference) {
            this.eventcode = currentPageReference.state.eventcode;
            fetchUserDetails({ eventCode: this.eventcode })
                .then(result => {
                    if (result.totalEvents) {
                        this.totalEvents = result.totalEvents;
                    }
                    if (result.accountName) {
                        this.accountName = result.accountName;
                    }
                    if (result.accountId) {
                        this.accountId = result.accountId;
                        //this method used to check condition of Standard Contractor visibility.
                        this.fetchUserPermission(this.eventcode);
                    }
                    if (result.eventSettings) {
                        this.formatEventDtls(result.eventSettings);
                        this.eventSettings = result.eventSettings
                        //BK-4530 update url with customercenter
                        this.eventLogo = '/CustomerCenter/servlet/servlet.FileDownload?file=' + this.eventSettings.Event_Edition__r.Event_Edition_Image_URL__c;
                        if (this.eventSettings.Is_Event_Edition_Live__c) {
                            this.isEventLive = true;
                        }
                        else {
                            this.isEventLive = false;
                        }
                    }
                    if (result.userTypeMapping) {
                        this.userTypeMapping = result.userTypeMapping
                    }
                    if (result.lstEvents) {
                        this.lstEvents = result.lstEvents
                    }
                    if (result.lstAnnouncements) {
                        this.lstAnnouncements = result.lstAnnouncements
                    }
                    if (result.lstManuals) {
                        this.lstManuals = result.lstManuals
                    }
                    if (result.lstEvents) {
                        let tempArr = [];
                        for (let i = 0; i < result.lstEvents.length; i++) {
                            tempArr.push({ label: result.lstEvents[i].eventName, value: result.lstEvents[i].eventCode })
                        }
                        this.lstEventNameList = tempArr;
                    }
                })
                .catch(error => {
                    window.console.log('error...' + JSON.stringify(error));
                });
        }
    }

    connectedCallback() {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 100) {
                this.cssmenu = 'cssmenu fixed-header'
            } else {
                this.cssmenu = 'cssmenu'
            }
        });
    }

    constructor() { // invoke the method when component rendered or loaded
        super()
        Promise.all([
            loadScript(this, CustomerCenterWS11 + '/CustomerCenterWS11/js/jquery-1.7.1.min.js'),
            loadStyle(this, CustomerCenterWS11 + '/CustomerCenterWS11/css/style.css'),
            loadStyle(this, CustomerCenterWS11 + '/CustomerCenterWS11/css/font-awesome.min.css'),
        ])
            .then(() => {
                // Call back function if scripts loaded successfully
                this.showSuccessMessage();
            })
            .catch(errors => {
                window.console.log(errors);
            });
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


    showSuccessMessage() { // call back method 
    }
    formatEventDtls(eventSettings) {
        let Venue;
        if (eventSettings.Event_Edition__r.Venue__c) {
            Venue = ' | ' + eventSettings.Event_Edition__r.Venue__c;
        }
        else {
            Venue = '';
        }
        let startDate = eventSettings.Event_Edition__r.Start_Date__c;
        let endDate = eventSettings.Event_Edition__r.End_Date__c;
        let startMOnth;
        let endMOnth;
        if (startDate) {
            startMOnth = this.formatDate(startDate);
        }
        else {
            startMOnth = '';
        }

        if (endDate) {
            endMOnth = ' - ' + this.formatDate(endDate);
        }
        else {
            endMOnth = '';
        }
        this.eventLocation = startMOnth + endMOnth + Venue;
    }
    formatDate(date) {
        let dt = new Date(date), month = '' + (dt.getUTCMonth() + 1), day = '' + dt.getUTCDate(), year = dt.getFullYear(), mon = '';
        if (month === '1') { mon = 'Jan'; }
        if (month === '2') { mon = 'Feb'; }
        if (month === '3') { mon = 'Mar'; }
        if (month === '4') { mon = 'Apr'; }
        if (month === '5') { mon = 'May'; }
        if (month === '6') { mon = 'Jun'; }
        if (month === '7') { mon = 'Jul'; }
        if (month === '8') { mon = 'Aug'; }
        if (month === '9') { mon = 'Sept'; }
        if (month === '10') { mon = 'Oct'; }
        if (month === '11') { mon = 'Nov'; }
        if (month === '12') { mon = 'Dec'; }
        if (day.length < 2) day = '0' + day;
        return [day, mon, year].join(' ');
    }
    handleChange(event) {
        localStorage.removeItem('UserSession');
        location.href = '/CustomerCenter/s/?eventcode=' + event.detail.value;
    }
    get isFormSelected() {
        if (this.pageName === 'forms') { return 'border-bottom: 5px solid black;padding-bottom: 12px;'; } return '';
    }
    get isManualsSelected() {
        if (this.pageName === 'manuals') { return 'border-bottom: 5px solid black;padding-bottom: 12px;'; } return '';
    }
    get utilityBarBranding() {
        return 'background-color:' + this.eventSettings.Branding_Color__c + ';color:' + this.eventSettings.Utility_Navigation_text_Color__c;
    }
    get utilityBarTextColor() {
        return 'color:' + this.eventSettings.Utility_Navigation_text_Color__c;
    }
    get manuBarBranding() {
        return 'background-color:' + this.eventSettings.Main_Nav_Background_Color__c + ';color:' + this.eventSettings.Main_Nav_Text_Color__c;
    }
    get homeUrl() {
        return '/CustomerCenter/s/?eventcode=' + this.eventcode;
    }
    get accConUrl() {
        return '/CustomerCenter/s/accountcontacts?eventcode=' + this.eventcode;
    }
    logOut() {
        localStorage.removeItem('UserSession');
        let url = location.host;
        location.href = '../secur/logout.jsp?retUrl=https://' + url + '/CustomerCenter/UserLogin?eventcode=' + this.eventcode;
    }
    get isFormVisible() {
        return this.eventSettings.Is_Form_Active__c && this.userTypeMapping.Form_Show__c ? true : false;
    }
    get formUrl() {
        if (this.eventSettings.Forms_Redirect_URL__c) {
            return this.eventSettings.Forms_Redirect_URL__c;
        }
        return '/CustomerCenter/s/forms?eventcode=' + this.eventcode;
    }
    get isManualVisible() {
        return this.eventSettings.Is_Manual_Active__c && this.userTypeMapping.Manual_Show__c ? true : false;
    }
    get manualUrl() {
        if (this.eventSettings.Manuals_Redirect_URL__c) {
            return this.eventSettings.Manuals_Redirect_URL__c;
        }
        return '/CustomerCenter/s/manuals?eventcode=' + this.eventcode;
    }
    get isBadgeVisible() {
        return this.eventSettings.Is_Customer_Badges_Active__c && this.userTypeMapping.Badges_Show__c ? true : false;
    }
    get badgeUrl() {
        if (this.eventSettings.Badges_Redirect_URL__c) {
            return this.eventSettings.Badges_Redirect_URL__c;
        }
        return '/CustomerCenter/s/badges?eventcode=' + this.eventcode;
    }
    get isExhibitorProfileVisible() {
        return this.eventSettings.Is_Customer_Profile_Active__c && this.userTypeMapping.Exhibitor_Directory_Show__c ? true : false;
    }
    get exhibitorProfileUrl() {
        if (this.eventSettings.Exhibitor_Directory_Redirect_URL__c) {
            return this.eventSettings.Exhibitor_Directory_Redirect_URL__c;
        }
        return '/CustomerCenter/s/exhibitorprofile?eventcode=' + this.eventcode;
    }
    get isStandConVisible() {
        return this.isShowContrator && this.eventSettings.Is_Stand_Contractor_Active__c && this.userTypeMapping.Standard_Contractor_Show__c ? true : false;
    }
    get standConUrl() {
        if (this.eventSettings.Stand_Contractor_Redirect_URL__c) {
            return this.eventSettings.Stand_Contractor_Redirect_URL__c;
        }
        return '/CustomerCenter/s/standcontractors?eventcode=' + this.eventcode;
    }
    get isFreeManVisible() {
        return this.eventSettings.Is_Freeman_Active__c && this.userTypeMapping.Freeman_Show__c ? true : false;
    }
    get freeManUrl() {
        if (this.eventSettings.Freeman_Redirect_Url__c) {
            return this.eventSettings.Freeman_Redirect_Url__c;
        }
        return '/CustomerCenter/apex/SSO_Freeman?freemanshowid='+this.eventSettings.Event_Edition__r.Freeman_Show_ID__c;
    }
    get isMyExhVisible() {
        return this.eventSettings.Is_My_Exhibitor_Active__c && this.userTypeMapping.My_Exhibitor_Show__c ? true : false;
    }
    get myExhUrl() {
        if (this.eventSettings.My_Exhibitor_Redirect_URL__c) {
            return this.eventSettings.My_Exhibitor_Redirect_URL__c;
        }
        return'/CustomerCenter/s/myexhibitors?eventcode=' + this.eventcode;
    }
    get isSubConVisible() {
        return this.eventSettings.Is_SubContractors_Active__c && this.userTypeMapping.SubContractor_Show__c ? true : false;
    }
    get subConUrl() {
        if (this.eventSettings.Subcontractor_Redirect_Url__c) {
            return this.eventSettings.Subcontractor_Redirect_Url__c;
        }
        return '/CustomerCenter/s/subcontractors?eventcode=' + this.eventcode;
    }
    get isAgentOwnExhVisible() {
        return this.eventSettings.Is_Agent_Own_Exhibitor_Active__c && this.userTypeMapping.Agent_Own_Exhibitor_Show__c ? true : false;
    }
    get agentOwnExhUrl() {
        if (this.eventSettings.Agent_Own_Exhibitor_Redirect_URL__c) {
            return this.eventSettings.Agent_Own_Exhibitor_Redirect_URL__c;
        }
        return '/CustomerCenter/s/agentownexhibitors?eventcode=' + this.eventcode;
    }
    get isGorrillaVisible() {
        return this.eventSettings.Is_Gorrilla_Active__c && this.userTypeMapping.Gorrilla_Show__c ? true : false;
    }
    get GorrillaUrl() {
        let url = '';
        if (this.eventSettings.Gorrilla_Redirect_Url__c) {
            url = this.eventSettings.Gorrilla_Redirect_Url__c;
            if (this.accountId) {
                url = url + this.accountId;
            }
        }
        else {
            url = '/CustomerCenter/apex/CC_Maintenance';
        }
        if (this.eventSettings.Is_EventCode_Required__c) {
            url=url+'?eventCode='+this.eventcode;
        }
        return url;
    }
    get isCustom1Visible() {
        return this.eventSettings.Is_Custom_1_Active__c && this.userTypeMapping.Custom_1_Show__c ? true : false;
    }
    get custom1Url() {
        if (this.eventSettings.Custom_1_Redirect_URL__c) {
            return this.eventSettings.Custom_1_Redirect_URL__c;
        }
        return '/CustomerCenter/s/custompage1?eventcode=' + this.eventcode;
    }
    get isCustom2Visible() {
        return this.eventSettings.Is_Custom_2_Active__c && this.userTypeMapping.Custom_2_Show__c ? true : false;
    }
    get custom2Url() {
        if (this.eventSettings.Custom_2_Redirect_URL__c) {
            return this.eventSettings.Custom_2_Redirect_URL__c;
        }
        return '/CustomerCenter/s/custompage2?eventcode=' + this.eventcode;
    }
    get isCustom3Visible() {
        return this.eventSettings.Is_Custom_3_Active__c && this.userTypeMapping.Custom_3_Show__c ? true : false;
    }
    get custom3Url() {
        if (this.eventSettings.Custom_3_Redirect_URL__c) {
            return this.eventSettings.Custom_3_Redirect_URL__c;
        }
        return'/CustomerCenter/s/custompage3?eventcode=' + this.eventcode;
    }

    // BK-10408
    get isCustom1URL() {
        return this.eventSettings.Custom_1_Redirect_URL__c ? true : false;
    }
    get isCustom2URL() {
        return this.eventSettings.Custom_2_Redirect_URL__c ? true : false;
    }
    get isCustom3URL() {
        return this.eventSettings.Custom_3_Redirect_URL__c ? true : false;
    }
    get isGorillaURL(){
        return this.eventSettings.Gorrilla_Redirect_Url__c ? true : false;
    }
    get isFreeManURL(){
        return this.eventSettings.Freeman_Redirect_Url__c ? true : false;
    }  
}