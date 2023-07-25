/**
 * Created By: {Girikon(Abhishek)}
 * Created On: 02/09/2019
 * Description/Purpose: C2E-4 : It is used to Notification to Exhibitors
 */
import { LightningElement, track, api } from 'lwc';

//Custom Labels
import Please_note from '@salesforce/label/c.Please_note';
import Stand_Contractor_Note_1 from '@salesforce/label/c.Stand_Contractor_Note_1';
import Space_only from '@salesforce/label/c.Space_only';
import Stand_Contractor_Note_2 from '@salesforce/label/c.Stand_Contractor_Note_2';
import My_Exhibitors from '@salesforce/label/c.My_Exhibitors';
import Page from '@salesforce/label/c.Page';
import Common_Notification_Part_Text from '@salesforce/label/c.Common_Notification_Part_Text'

export default class AgentNotificationUtility extends LightningElement {
    //Custom Labels
    pleaseNoteLabel = Please_note;
    standContractorNote1Label = Stand_Contractor_Note_1;
    standContractorNote2Label = Stand_Contractor_Note_2;
    spaceOnlyLabel = Space_only;
    myExhibitorsLabel = My_Exhibitors;
    pageLabel = Page;
    commonNotificationPartTextLabel = Common_Notification_Part_Text;

    //Public reactive variables
    @api eventCode;
    @api message;

    //Private reactive variables
    @track showNotificationFlag;
    @track formattedMessage;

    // Private variables
    exhibitorURL;

    // Life cycle hooks
    connectedCallback() {
        this.exhibitorURL = 'agentownexhibitors?eventcode=' + this.eventCode;
        this.showNotificationFlag = true;
        this.formatMessage();
    }

    hideNotification() {
        this.showNotificationFlag = false;
    }

    formatMessage() {
        let messageArray = this.message.split('#$');
        this.formattedMessage = '';
        let arrayCounter = 0
        while (arrayCounter < messageArray.length) {
            if (messageArray[arrayCounter] !== 'b') {
                this.formattedMessage += messageArray[arrayCounter] + '&nbsp;';
                arrayCounter++;
            } else {
                arrayCounter++;
                this.formattedMessage += '<b>'+messageArray[arrayCounter]+'</b>&nbsp;';
                arrayCounter++;
            }
        }
    }
}