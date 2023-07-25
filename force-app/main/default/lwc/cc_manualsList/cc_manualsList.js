import { LightningElement, track, wire } from "lwc";
import { CurrentPageReference } from "lightning/navigation";
import getUserType from "@salesforce/apex/CC_ManualsCtrl.getConUserType";
import getManualSetting from "@salesforce/apex/LtngUtilityCtrl.getRecords";
import AgentMessage from '@salesforce/label/c.Common_Notification_Part_Text';

export default class Cc_addManuals extends LightningElement {
  @track eventcode;
  label = {
		AgentMessage
	};
  @track condition1;
  @track condition2;
  @track spinner = true;
  @track showAgentMessage;
  @track eventDtls;

  @wire(CurrentPageReference)
  setCurrentPageReference(currentPageReference) {    
    if (currentPageReference) {
      this.eventcode = currentPageReference.state.eventcode;
      getUserType({ sEventcode: this.eventcode })
        .then(result => {
          this.userType = result.User_Type__c;
          let userTypeName = result.User_Type__r.Name;
          if(userTypeName==='Agent'){
            this.showAgentMessage = true;
          }
          this.conAccount = result.SFContactID__r.AccountId;
          this.condition1 =
            "Manual_Permission__r.Manuals__r.Event_Edition__r.Event_Code__c ='" +
            this.eventcode +
            "' AND Manual_Permission__r.Manuals__r.Required__c = true AND User_Type__r.Id = '" +
            this.userType +
            "' AND Manual_Permission__r.Active__c=true AND Account__c='" +
            this.conAccount +
            "'";
          this.condition2 =
            "Manual_Permission__r.Manuals__r.Event_Edition__r.Event_Code__c ='" +
            this.eventcode +
            "' AND Manual_Permission__r.Manuals__r.Required__c != true AND User_Type__r.Id = '" +
            this.userType +
            "' AND Manual_Permission__r.Active__c=true AND Account__c='" +
            this.conAccount +
            "'";
          
          this.error = undefined;
          this.spinner = false;
        })
        .catch(error => {
          window.console.log("error..." + JSON.stringify(error));
          this.error = error;
        });

      getManualSetting({
        objName: "Event_Settings__c",
        fieldNames:
          "id, Manuals_Title__c,Welcome_Text_Manuals__c,Show_Hide_Manual_Agreed__c,Deadline_Reached_Message_for_Manuals__c,Manuals_Sub_Title__c",
        compareWith: "Event_Edition__r.Event_Code__c",
        recordId: this.eventcode,
        pageNumber: 1,
        pageSize: 1
      })
        .then(result => {
          this.eventDtls = result.recordList[0];
          this.spinner = false;
          
        })
        .catch(error => {
          window.console.log("error..." + JSON.stringify(error));
        });
    }
  }
  homeUrl() {
    window.location.href = "/CustomerCenter/s/?eventcode=" + this.eventcode;
  }
}