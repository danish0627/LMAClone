/* eslint-disable no-alert */
/*
Created By	 : (SUNIL [STL-38])
Created On	 : August 19, 2019
@description : This component is use to show Customer Center Settings .

Modification log --
Modified By	: 
*/



import { LightningElement, wire, track } from 'lwc';
import { getRecord,createRecord } from 'lightning/uiRecordApi';
import { CurrentPageReference, NavigationMixin } from 'lightning/navigation';
import fetchRecords from "@salesforce/apex/LtngUtilityCtrl.getRecords";
import getCommunityURL from "@salesforce/apex/LtngUtilityCtrl.getCommunityURL";


const FIELDS = [
    'Event_Edition__c.Name',
    'Event_Edition__c.Start_Date__c', 'Event_Edition__c.End_Date__c',
    'Event_Edition__c.Venue__c', 'Event_Edition__c.Event_Code__c',
];

export default class Ops_customerCenterSettings extends NavigationMixin(LightningElement) {
    @track eId;
    @track esId
    @track eventEditionDtls;
    @track eventSettings;
    @track eventCode;
    @track siteSettingUrl;

    @wire(CurrentPageReference)
    setCurrentPageReference(currentPageReference) {
        if (currentPageReference) {
            this.eId = currentPageReference.state.c__id;
            this.esId = currentPageReference.state.c__esId;
            if (this.eId) {
                this.fetchDetails();
            }
        }
    }

    connectedCallback() {
        let fullUrl = window.location.href;
        this.esId = this.GetQS(fullUrl, 'esid');
        this.eId = this.GetQS(fullUrl, 'id');
        if (this.eId) {
            this.fetchDetails();
            this.fetchDefaultPacakage();//check default pacakge ixist or not
        }
    }
    fetchDefaultPacakage()
    {
        fetchRecords({ objName: 'Profile_Package_Setting__c', fieldNames: 'Id,Name',compareWith:'Event_Edition__c',recordId: this.eId, pageNumber :1, pageSize:200})
        .then(result => { 
            if(result.recordList.length===0)
			{
				const fields = {Name : 'Default Package' ,Event_Edition__c:this.eId,Is_Default__c:true,Priority__c:'0'};
                const recordInput = { apiName: 'Profile_Package_Setting__c', fields };
                createRecord(recordInput)
                .then(data => {
                    })
                    .catch(error => {
                        window.console.log('error-----------'+JSON.stringify(error));  
                });
			}
        })
        .catch(error => {
            window.console.log('error...' + JSON.stringify(error));
        });
    }
    GetQS(url, key) {
        var a = "";
        if (url.includes('#')) {
            let Qs = url.split('#')[1].replace(/^\s+|\s+$/g, '');
            if (Qs !== "") {
                let qsArr = Qs.split("&");
                for (let i = 0; i < qsArr.length; i++)
                    if (qsArr[i].split("=")[0] === key)
                        a = qsArr[i].split("=")[1];
            }
            return a;
        }
        window.location.href = '/lightning/n/ops_customer_centre';
        return '';
    }
    fetchDetails() {
        fetchRecords({ objName: 'Event_Settings__c', fieldNames: 'Id,Name,Event_Edition__r.Event_Code__c', compareWith: 'Event_Edition__c', recordId: this.eId, pageNumber: 1, pageSize: 1 })
            .then(result => {
                this.eventSettings = result.recordList[0];
                if(this.eventSettings)
                {
                    this.eventCode = this.eventSettings.Event_Edition__r.Event_Code__c;
                    getCommunityURL().then(data => {
                        this.siteSettingUrl = data + '?eventcode=' + this.eventCode;
                    })
                    .catch(error => {
                        window.console.log('error...' + JSON.stringify(error));
                    });
                }
            })
            .catch(error => {
                window.console.log('error...' + JSON.stringify(error));
            });
    }
    @wire(getRecord, { recordId: '$eId', fields: FIELDS })
    wiredEventObject({ error, data }) {
        if (data) {
            let eventDtls = {
                'Name': data.fields.Name.value,
                'startDate': data.fields.Start_Date__c.value,
                'endDate': data.fields.End_Date__c.value,
                'venue': data.fields.Venue__c.value
            };
            this.eventEditionDtls = eventDtls;
        } else if (error) {
            window.console.log('---------->' + error);
        }
    }
    goToCC() {
        window.location.href = '/lightning/n/ops_customer_centre';
    }
    get siteUrl() {
        return this.siteSettingUrl;
    }

    get goToFooter() {
        if (this.eventSettings) {
            return '/lightning/n/ops_customer_centre_footer#id=' + this.eId + '&esid=' + this.eventSettings.Id;
        }
        return '';
    }
    get goToReferenceTags() {
        if (this.eventSettings) {
            return '/lightning/n/ops_customer_centre_reference_tags#id=' + this.eId + '&esid=' + this.eventSettings.Id;
        }
        return '';
    }
    get goToBranding() {
        if (this.eventSettings) {
            return '/lightning/n/ops_customer_centre_branding#id=' + this.eId + '&esid=' + this.eventSettings.Id;
        }
        return '';
    }
    get navigatetoWelcomeEmail() {
        if (this.eventSettings) {
            return '/lightning/n/ops_welcome_email#id=' + this.eId + '&esid=' + this.eventSettings.Id;
        }
        return '';
    }
    redirectToSetting() {
        window.location.href = '/lightning/n/ops_site_settings#id=' + this.eId + '&esid=' + this.eventSettings.Id;
    }
    get goToHome() {
        if (this.eventSettings) {
            return '/lightning/n/ops_customer_centre_home#id=' + this.eId + '&esid=' + this.eventSettings.Id;
        }
        return '';

    }
    get goToForm() {
        if (this.eventSettings) {
            return '/lightning/n/ops_customer_centre_forms#id=' + this.eId + '&esid=' + this.eventSettings.Id;
        }
        return '';
    }
    get goToExhibitorProfile() {
        if (this.eventSettings) {
            return '/lightning/n/ops_exhibitor_profile#id=' + this.eId + '&esid=' + this.eventSettings.Id;
        }
        return '';
    }
    get goToAccCons() {
        if (this.eventSettings) {
            return '/lightning/n/ops_customer_centre_account_contacts#id=' + this.eId + '&esid=' + this.eventSettings.Id;
        }
        return '';
    }
    get goToManual() {
        if (this.eventSettings) {
            return '/lightning/n/ops_customer_centre_manuals#id=' + this.eId + '&esid=' + this.eventSettings.Id;
        }
        return '';
    }
    get goToEmailTemplate() {
        if (this.eventSettings) {
            return '/lightning/n/ops_event_edition_email_templates#id=' + this.eId + '&esid=' + this.eventSettings.Id;
        }
        return '';
    }
    get goToCustomerBadges() {
        if (this.eventSettings) {
            return '/lightning/n/ops_customer_badges#id=' + this.eId + '&esid=' + this.eventSettings.Id;
        }
        return '';
    }
    get gotoStandCon() {
        if (this.eventSettings) {
            return '/lightning/n/ops_stand_contractor#id=' + this.eId + '&esid=' + this.eventSettings.Id;
        }
        return '';
    }
    get gotoSubCon() {
        if (this.eventSettings) {
            return '/lightning/n/ops_sub_contractor#id=' + this.eId + '&esid=' + this.eventSettings.Id;
        }
        return '';
    }
    get gotoMyExhAgent() {
        if (this.eventSettings) {
            return '/lightning/n/ops_my_exhibitors_agent#id=' + this.eId + '&esid=' + this.eventSettings.Id;
        }
        return '';
    }
    get gotoCustomPages() {
        if (this.eventSettings) {
            return '/lightning/n/ops_custom_pages#id=' + this.eId + '&esid=' + this.eventSettings.Id;
        }
        return '';
    }
    get gotoMyexhibitorStandCont() {
        if (this.eventSettings) {
            return '/lightning/n/ops_my_exhibitors_stand_contractor#id=' + this.eId + '&esid=' + this.eventSettings.Id;
        }
        return '';
    }
    get gotoReports() {
        if (this.eventSettings) {
            return '/lightning/n/ops_customer_centre_reports#id=' + this.eId + '&esid=' + this.eventSettings.Id;
        }
        return '';
    }
    get gotoAgentExhibitors() {
        if (this.eventSettings) {
            return '/lightning/n/ops_agent_exhibitors_details#id=' + this.eId + '&esid=' + this.eventSettings.Id;
        }
        return '';
    }
    goToCustomerList() {
        if (this.eventSettings) {
            const rid = this.eId;
            const esId = this.eventSettings.Id;
            this[NavigationMixin.Navigate]({
                type: 'standard__navItemPage',
                attributes: {
                    apiName: 'Customer_List'
                },
                state: {
                    'c__id': rid,
                    'c__esId': esId
                }
            });
        }

    }
}