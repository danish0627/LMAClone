/****
Created By	 : (Himanshu[STL-19])
Created On	 : August 3, 2019
@description : This is simple drawer table component and apply all other feature like pagination, sorting, filter and search.

Modification log 
Modified By	: (Prashant[STL-282 Oct 16 2019])
*****/

import { LightningElement, wire, track } from 'lwc';

import USER_ID from '@salesforce/user/Id';
import customerFormListWrpData from '@salesforce/apex/CC_CustomerFormListCtrl.customerFormListWrpData';
import getCurrentUserType from '@salesforce/apex/CC_ManualsCtrl.getConUserType';
import Required from '@salesforce/label/c.Required';
import Forms from '@salesforce/label/c.Forms';
import Additional from '@salesforce/label/c.Additional';
import AgentMessage from '@salesforce/label/c.Common_Notification_Part_Text';
import { CurrentPageReference } from 'lightning/navigation';

export default class Cc_customerFormList extends LightningElement {
	label = { Required, Forms, Additional, AgentMessage };
	@track error;
	@track qryCondition;
	@track qryConditionAddtional;
	@track AccountId;
	@track userFormPermission;
	@track eventcode;
	@track userType;
	@track deadlineMessage;
	@track lstEventSetting;

	@wire(CurrentPageReference)
	setCurrentPageReference(currentPageReference) {
		if (currentPageReference) {
			this.eventcode = currentPageReference.state.eventcode;
			customerFormListWrpData({
				userId: USER_ID,
				eventCode: this.eventcode
			})
				.then(result => {
					let data = JSON.parse(JSON.stringify(result));
					let permissionid = JSON.parse(JSON.stringify(data.lstformPermissions));
					let permissionidAdditional = JSON.parse(JSON.stringify(data.lstformPermissionsAdditional));
					this.qryCondition = 'Account__c =\'' + data.usr.AccountId + '\' AND Form_Permission__c IN  (\'' + permissionid.join('\',\'') + '\') AND User_Type__c  =\'' + data.contactEventEditionMApping + '\'';
					this.qryConditionAddtional = 'Account__c =\'' + data.usr.AccountId + '\' AND Form_Permission__c IN  (\'' + permissionidAdditional.join('\',\'') + '\') AND User_Type__c  =\'' + data.contactEventEditionMApping + '\'';
					this.deadlineMessage = data.deadlineMessage;
					this.lstEventSetting = data.lstEventSetting;
				})
				.catch(error => {
					window.console.log('error...!' + JSON.stringify(error));
					this.error = error;
				});
			getCurrentUserType({
				sEventcode: this.eventcode
			})
				.then(result => {
					let userTypeName = result.User_Type__r.Name;
					if (userTypeName === 'Agent') {
						this.userType = true;
					}
				})
				.catch(error => {
					window.console.log('error...!' + JSON.stringify(error));
					this.error = error;
				});
		}
	}

	homeUrl() {
		if (this.eventcode) {

			let eventCode = this.eventcode;
			window.location.href = "/CustomerCenter/s/?eventcode=" + eventCode;
		}


	}
}