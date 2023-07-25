/* Created By		: Girikon(Sunil[STL-17])
Created On		: Aug 08 2019
@description 	: This LWC is used for customer center master page footer.

Modification log --
Modified By		: [Aishwarya BK-14358 28 Apr 2021], [Aishwarya BK-16654 15 June 2021]
*/ 

import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import fecthEvent from "@salesforce/apex/LtngUtilityCtrl.getRecords";

export default class Cc_footer extends LightningElement {
    @track eventDtls;

    @wire(CurrentPageReference)
    setCurrentPageReference(currentPageReference) {
        if (currentPageReference) {
            let eventcode = currentPageReference.state.eventcode;
            fecthEvent({ objName: 'Event_Settings__c', fieldNames: 'Id,Name,About_Show__c,Branding_Color__c,Utility_Navigation_text_Color__c,Main_Nav_Background_Color__c,Main_Nav_Text_Color__c,Footer_background_color__c,Footer_text_color__c,Button_colors__c,Button_Text_Color__c,Event_Edition__r.Name,FaceBook__c,LinkedIn__c,Twitter__c,YouTube__c,Instagram__c,Link_1__c,Link_2__c,Link_3__c,Link_4__c,Link_1_Label__c,Link_2_Label__c,Link_3_Label__c,Link_4_Label__c,ShowHours1__c,ShowHours2__c,ShowHours3__c,Enable_Feedback__c,Feedback_Redirect_URL__c,Feedback_Sub_Title__c', compareWith: 'Event_Edition__r.Event_Code__c', recordId: eventcode, pageNumber: 1, pageSize: 1 })
                .then(result => {
                    this.eventDtls = result.recordList[0];
                })
                .catch(error => {
                    window.console.log('error...' + JSON.stringify(error));
                });
        }
    }
    get footerBranding() {
        return 'background-color:' + this.eventDtls.Footer_background_color__c + ';color:' + this.eventDtls.Footer_text_color__c;
    }
    get bordercolor() {
        return 'border-bottom:1px solid ' + this.eventDtls.Footer_text_color__c;
    }
    get iconColors() {
        return 'font-size:18px;color:' + this.eventDtls.Footer_text_color__c;
    }
    get isLinksVisible() {
        if (this.eventDtls.Link_1_Label__c || this.eventDtls.Link_2_Label__c || this.eventDtls.Link_3_Label__c || this.eventDtls.Link_4_Label__c) {
            return true;
        }
        return false;
    }
    get isShowhrsVisible() {
        if (this.eventDtls.ShowHours1__c || this.eventDtls.ShowHours2__c || this.eventDtls.ShowHours3__c) {
            return true;
        }
        return false;
    }
    get isFollowVisible()
    {
        if (this.eventDtls.FaceBook__c || this.eventDtls.Twitter__c || this.eventDtls.LinkedIn__c || this.eventDtls.YouTube__c || this.eventDtls.Instagram__c) {
            return true;
        }
        return false;
    }
    get isFeedbackEnable()
    {
        if (this.eventDtls.Enable_Feedback__c) {
            return true;
        }
        return false;
    }
}