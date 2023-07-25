/**
 * Created By: {Girikon(Abhishek)}
 * Created On: 29/07/2019
 * Description/Purpose: C2E-11 : It is used to dispaly account Summary in AgentOwnedExhibitorDetails Aura component.
 */

import { LightningElement, api, track } from 'lwc';

//Import apex methods
import resendWelcomeMail from '@salesforce/apex/AgentOwnedExhibitorUtils.resendWelcomeMail';
import getInitialData from '@salesforce/apex/AgentOwnedExhibitorUtils.getInitialData';

//Import custom labels
import Account_Contacts from '@salesforce/label/c.Account_Contacts';
import AccountInfo_Stands from '@salesforce/label/c.AccountInfo_Stands';
import AccountInfo_Activity from '@salesforce/label/c.AccountInfo_Activity';
import AccountInfo_CoExhibitors from '@salesforce/label/c.AccountInfo_CoExhibitors';
import AccountInfo_Primary from '@salesforce/label/c.AccountInfo_Primary';
import AccountInfo_Billing from '@salesforce/label/c.AccountInfo_Billing';
import AccountInfo_Operations from '@salesforce/label/c.AccountInfo_Operations';
import Stand from '@salesforce/label/c.Stand';
import Dimensions from '@salesforce/label/c.Dimensions';
import AccountInfo_Classification from '@salesforce/label/c.AccountInfo_Classification';
import Required_Forms from '@salesforce/label/c.Required_Forms';
import Badges from '@salesforce/label/c.Badges';
import Manuals from '@salesforce/label/c.Manuals';
import Exhibitor_Profile from '@salesforce/label/c.Exhibitor_Profile';
import Stand_Contractor from '@salesforce/label/c.Stand_Contractor';
import AccountInfo_Last_Login from '@salesforce/label/c.AccountInfo_Last_Login';
import AccountInfo_Email_Last_Sent from '@salesforce/label/c.AccountInfo_Email_Last_Sent';
import Send_Welcome_Email from '@salesforce/label/c.Send_Welcome_Email';
import Incomplete from '@salesforce/label/c.Incomplete';
import AccountInfo_Complete from '@salesforce/label/c.AccountInfo_Complete';
import AccountInfo_CustomerType from '@salesforce/label/c.AccountInfo_CustomerType';
import Exhibitor from '@salesforce/label/c.Exhibitor';
import Co_Exhibitor from '@salesforce/label/c.Co_Exhibitor';
import Agent from '@salesforce/label/c.Agent';
import AccountInfo_AgentOwnedExhibitor from '@salesforce/label/c.AccountInfo_AgentOwnedExhibitor';
import Contractor from '@salesforce/label/c.Contractor';
import Confirm from '@salesforce/label/c.Confirm';
import Yes from '@salesforce/label/c.Yes';
import Cancel from '@salesforce/label/c.Cancel';
import Generic_Error from '@salesforce/label/c.Generic_Error';
import Status from '@salesforce/label/c.Status';
import AccountInfo_SendMailConfirmation from '@salesforce/label/c.AccountInfo_SendMailConfirmation';
import AccountInfo_Unknown from '@salesforce/label/c.AccountInfo_Unknown';
import Individual_Contract from '@salesforce/label/c.Individual_Contract';
import Agent_Own_Exhibitor_Message from '@salesforce/label/c.Agent_Own_Exhibitor_Message';
import Co_Exhibitor_Message from '@salesforce/label/c.Co_Exhibitor_Message';
import Individual_Contract_Message from '@salesforce/label/c.Individual_Contract_Message';
import Exhibitor_Caution_Message from '@salesforce/label/c.Exhibitor_Caution_Message';
import AccountInfo_NA from '@salesforce/label/c.AccountInfo_NA';

export default class AgentOwnedExhibitorAccountInfo extends LightningElement {

    //<------------------Custom Labels Begin-------------------------->
    accountContactsLabel = Account_Contacts;
    standsLabel = AccountInfo_Stands;
    activityLabel = AccountInfo_Activity;
    coExhibitorsLabel = AccountInfo_CoExhibitors;
    primaryContactLabel = AccountInfo_Primary;
    billingContactLabel = AccountInfo_Billing;
    operationsContactLabel = AccountInfo_Operations;
    standLabel = Stand;
    dimensionsLabel = Dimensions;
    classificationLabel = AccountInfo_Classification;
    requiredFormsLabel = Required_Forms;
    badgesLabel = Badges;
    manualsLabel = Manuals;
    exhibitorProfileLabel = Exhibitor_Profile;
    standContractorLabel = Stand_Contractor;
    lastLoginLabel = AccountInfo_Last_Login;
    lastEmailSentLabel = AccountInfo_Email_Last_Sent;
    sendWelcomeEmailLabel = Send_Welcome_Email;
    incompleteLabel = Incomplete;
    completeLabel = AccountInfo_Complete;
    customerTypeLabel = AccountInfo_CustomerType;
    exhibitorLabel = Exhibitor;
    coExhibitorLabel = Co_Exhibitor;
    agentLabel = Agent;
    agentOwnedExhibitorLabel = AccountInfo_AgentOwnedExhibitor;
    contractorLabel = Contractor;
    confirmLabel = Confirm;
    yesLabel = Yes;
    cancelLabel = Cancel;
    genericErrorLabel = Generic_Error;
    statusLabel = Status;
    sendMailConfirmationLabel = AccountInfo_SendMailConfirmation;
    unknownLabel = AccountInfo_Unknown;
    individualContractLabel = Individual_Contract;
    agentOwnExhibitorMessageLabel = Agent_Own_Exhibitor_Message;
    coExhibitorMessageLabel = Co_Exhibitor_Message;
    individualContractMessageLabel = Individual_Contract_Message;
    exhibitorCautionMessageLabel = Exhibitor_Caution_Message;
    naLabel = AccountInfo_NA;
    //<------------------Custom Labels End-------------------------->

    //<----------------------Public variables Begin----------------->
    @api accountId;
    @api eventCode;
    @api modalViewMode;
    //<----------------------Public variables End------------------->

    //<-----------------Private reactive variables begin------------>
    @track accountContacts;
    @track accountBooths;
    @track agentOwnedCoExhibitors;
    @track exhibitorType;
    @track lastEmailSentDate;
    @track showMailResendConfirmation;
    @track showMailResendingSpinner;
    @track showStatusModal;
    @track statusMessage;
    @track sendMailConfirmationString;
    @track lastLoginDate;
    @track formsStatus;
    @track manualsStatus;
    @track badgesStatus;
    @track exhibitorProfileStatus;
    @track standContractorProfileStatus;
    @track showInModalMode;
    @track showExhibitorTypeTooltip;
    //<-----------------Private reactive variables End-------------->

    //<-----------------Lifecycle hooks Begin----------------------->
    connectedCallback() {
        this.hideMailResendConfirmationDialog();
        this.hideMailResendSpinner();
        this.fetchInitialData();
        if (this.modalViewMode === 'false') {
            this.showInModalMode = false;
        } else if (this.modalViewMode === 'true') {
            this.showInModalMode = true;
        }
    }

    renderedCallback() {
        // Uncomment below code to set uniform vertical line in all columns
        // if(this.accountBooths) {
        //     this.setDivHeights();
        // }
    }
    //<-----------------Lifecycle hooks End------------------------->

    //<----------------Getter methods Begin------------------------->
    get exhibitorTypeLabel() {

        let exhibitorTypeArray = [];
        if (this.exhibitorType !== undefined) {
            exhibitorTypeArray = this.exhibitorType.split(',');


            if (exhibitorTypeArray.length > 1 && exhibitorTypeArray[1] === 'Individual Contract') {
                return this.individualContractLabel;
            }
            if (exhibitorTypeArray[0] === 'Exhibitor') {
                return this.individualContractLabel;
            } else if (exhibitorTypeArray[0] === 'Agent') {
                return this.agentLabel;
            } else if (exhibitorTypeArray[0] === 'Co-Exhibitor') {
                return this.coExhibitorLabel;
            } else if (exhibitorTypeArray[0] === 'Agent Owned Exhibitor') {
                return this.exhibitorLabel;
            } else if (exhibitorTypeArray[0] === 'Contractor') {
                return this.contractorLabel;
            }
        }
        return this.unknownLabel;
    }
    //<----------------Getter methods End--------------------------->

    //<----------------Backend Calls Begin-------------------------->

    resendWelcomeMail() {
        this.showMailResendSpinner();
        if (this.accountContacts && this.accountContacts.Operations_Contact__c) {
            resendWelcomeMail({ contactId: this.accountContacts.Operations_Contact__c, eventCode: this.eventCode })
                .then(result => {
                    this.statusMessage = result;
                    this.hideMailResendSpinner();
                    this.hideMailResendConfirmationDialog();
                    this.showStatusModalDialog();
                })
                .catch(() => {
                    this.statusMessage = this.genericErrorLabel;
                    this.hideMailResendSpinner();
                    this.hideMailResendConfirmationDialog();
                    this.showStatusModalDialog();
                });
        } else {
            this.statusMessage = this.genericErrorLabel;
            this.hideMailResendSpinner();
            this.hideMailResendConfirmationDialog();
            this.showStatusModalDialog();
        }
    }

    fetchInitialData() {
        if (this.accountId && this.eventCode) {
            getInitialData({ accountId: this.accountId, eventCode: this.eventCode })
                .then(result => {
                    let completedBadges = 0;
                    let totalBagdes = 0;
                    //Set Account Contacts
                    this.accountContacts = result.accountContacts;

                    //Set Account Booths
                    if (!this.isUndefindedOrEmptyList(result.eventBooths)) {
                        this.accountBooths = result.eventBooths;
                    }

                    //Set Co-Exhibitors
                    if (!this.isUndefindedOrEmptyList(result.coExhibitors)) {
                        this.agentOwnedCoExhibitors = result.coExhibitors;
                    }

                    //Set Exhibitor Type
                    this.exhibitorType = result.exhibitorType;

                    //Set Last Email Sent date
                    if (result.lastMailSentDate !== undefined) {
                        this.lastEmailSentDate = this.getHumanReadableDateTime(result.lastMailSentDate);
                    } else {
                        this.lastEmailSentDate = '--';
                    }

                    //Set Last Login Date
                    if (result.lastLoginDate !== undefined) {
                        this.lastLoginDate = this.getHumanReadableDateTime(result.lastLoginDate);
                    } else {
                        this.lastLoginDate = '--';
                    }

                    //Set Forms Status
                    if (result.formsStatus !== undefined) {
                        this.formsStatus = result.formsStatus.completed + ' / ' + result.formsStatus.total + ' ' + this.completeLabel;
                    } else {
                        this.formsStatus = this.unknownLabel;
                    }

                    //Set Manuals Status
                    if (result.manualsStatus !== undefined) {
                        this.manualsStatus = result.manualsStatus.completed + ' / ' + result.manualsStatus.total + ' ' + this.completeLabel;
                    } else {
                        this.manualsStatus = this.unknownLabel;
                    }

                    //Set Badges Status
                    if (result.badges !== undefined) {
                        Object.keys(result.badges).forEach(function (key) {
                            if (!isNaN(result.badges[key].total)) {
                                totalBagdes += result.badges[key].total;
                            }
                            if (!isNaN(result.badges[key].completed)) {
                                completedBadges += result.badges[key].completed;
                            }
                        });
                        this.badgesStatus = completedBadges + ' / ' + totalBagdes + ' ' + this.completeLabel;
                    } else {
                        this.badgesStatus = this.unknownLabel;
                    }

                    //Set Exhibitor Profile Status
                    let exhProfileStatuses = Object.values(result.exhibitorProfileStatus);
                    let notSubmittedIndex;
                    if (!this.isUndefindedOrEmptyList(exhProfileStatuses)) {
                        notSubmittedIndex = exhProfileStatuses.indexOf("Not Submitted");
                    }
                    if (notSubmittedIndex !== -1) {
                        this.exhibitorProfileStatus = this.incompleteLabel;
                    } else {
                        this.exhibitorProfileStatus = this.completeLabel;
                    }

                    //Set Stand Contractor Profile Status
                    let spaceOnlyBooths = this.getSpaceOnlyBooths(result.eventBooths, result.standContractorProfileStatus);
                    if (spaceOnlyBooths.length !== 0) {
                        let notSubmittedIndexStandCon = spaceOnlyBooths.indexOf("Not Submitted");
                        if (notSubmittedIndexStandCon !== -1) {
                            this.standContractorProfileStatus = this.incompleteLabel;
                        } else {
                            this.standContractorProfileStatus = this.completeLabel;
                        }
                    } else {
                        this.standContractorProfileStatus = this.naLabel;
                    }

                });
        }
    }
    //<----------------Backend Calls End---------------------------->
    //<-----------------Utility Methods Begin----------------------->
    getSpaceOnlyBooths(booths, statusMap) {  
        let spaceOnlyBoothsStatuses = [];
        booths.forEach(booth => {
            if (booth.Expocad_Booth__r.Matched_Product_Name__c === 'Space Only' || booth.Expocad_Booth__r.Matched_Product_Name__c === 'Agent Pavilion Space Only' || booth.Expocad_Booth__r.Matched_Product_Name__c === 'Pavilion Space Only') {
                spaceOnlyBoothsStatuses.push(statusMap[booth.Id]);
            }
        });
        return spaceOnlyBoothsStatuses;
    }

    isUndefindedOrEmptyList(data_list) {
        return !data_list || data_list.length === 0;
    }
    getHumanReadableDateTime(dateTimeString) {
        const zuluTimeFormat = RegExp(/[0-9-]*T[0-9:.]*Z/i);
        const ISO8601WithoutTFormat = RegExp(/[0-9-]*\s[0-9:]*/i);
        var readableDateTime;
        if (dateTimeString !== undefined && dateTimeString.length > 0) {
            if (dateTimeString.search(zuluTimeFormat) !== -1) {
                let dateStringArray = dateTimeString.split('T')[0].split('-');
                readableDateTime = dateStringArray[1] + '/' + dateStringArray[2] + '/' + dateStringArray[0] + ' ' + dateTimeString.split('T')[1].split('.')[0];
            } else if (dateTimeString.search(ISO8601WithoutTFormat) !== -1) {
                let dateStringArray = dateTimeString.split(' ')[0].split('-');
                readableDateTime = dateStringArray[1] + '/' + dateStringArray[2] + '/' + dateStringArray[0] + ' ' + dateTimeString.split(' ')[1];
            } else {
                readableDateTime = '--'
            }
        } else {
            readableDateTime = '--'
        }
        return readableDateTime;
    }

    modalInModalChangeEvent(type) {
        const modalInModalEvent = new CustomEvent('modalinmodal', {
            detail: { type },
        });
        //Fire Custom Event
        this.dispatchEvent(modalInModalEvent);
    }

    showMailResendConfirmationDialog(event) {
        event.preventDefault();
        if (this.accountContacts && this.accountContacts.Operations_Contact__c) {
            this.sendMailConfirmationString = this.sendMailConfirmationLabel.replace("{0}", this.accountContacts.Operations_Contact__r.Name);
            this.modalInModalChangeEvent('open');
            this.showMailResendConfirmation = true;
        } else {
            this.statusMessage = this.genericErrorLabel;
            this.showStatusModalDialog();
        }
    }

    //Hide mail resend confirmation dialog
    hideMailResendConfirmationDialog() {
        this.showMailResendConfirmation = false;
        this.sendMailConfirmationString = '';
        this.modalInModalChangeEvent('close');
    }

    //Show spinner while sending mail
    hideMailResendSpinner() {
        this.showMailResendingSpinner = false;
    }

    //Hide spinner after mail is sent
    showMailResendSpinner() {
        this.showMailResendingSpinner = true;
    }

    //Show status messages in a popup
    showStatusModalDialog() {
        this.modalInModalChangeEvent('open');
        this.showStatusModal = true;
    }

    //Hide status messages when close is cliked
    hideStatusModalDialog() {
        this.showStatusModal = false;
        this.statusMessage = '';
        this.modalInModalChangeEvent('close');
    }
    //Navigate to Co-Exhibitor
    navigateToCoExhibitorAccount(event) {
        event.preventDefault();
        let accountId = event.currentTarget.getAttribute('data-aid');
        let coExhURL = 'agentownexhibitordetails?eventcode=' + this.eventCode + '&accid=' + accountId;
        window.open(coExhURL, '_parent');
    }

    //Hide tooltip modal
    hideTooltipModal() {
        this.showExhibitorTypeTooltip = false;
        this.modalInModalChangeEvent('close');
    }

    //Show tooltip modal
    showTooltipModal() {
        this.modalInModalChangeEvent('open');
        this.showExhibitorTypeTooltip = true;
    }

    //Fix Div Height
    setDivHeights() {
        let heightString;
        let vlDivs = this.template.querySelectorAll("div.vl");
        let standsHeight = vlDivs[2].clientHeight > 300 ? vlDivs[2].clientHeight : 300;
        let contactsHeight = vlDivs[1].clientHeight > 300 ? vlDivs[1].clientHeight : 300;
        if (standsHeight > contactsHeight) {
            heightString = standsHeight + "px";
            vlDivs[0].style.height = heightString;
            vlDivs[1].style.height = heightString;
            vlDivs[3].style.height = heightString;
        } else if (contactsHeight > standsHeight) {
            heightString = contactsHeight + "px";
            vlDivs[0].style.height = heightString;
            vlDivs[2].style.height = heightString;
            vlDivs[3].style.height = heightString;
        }
        //console.log('calculated height : ', heightString);
    }
    //<-----------------Utility Methods End------------------------->
}