/**
 * Created By: {Girikon(Abhishek)}
 * Created On: 30/07/2019
 * Description/Purpose: Why and where it is used [ticket No] 
 */

import { LightningElement, api, track } from 'lwc';

//import custom labels
import Phone_Short_Form from '@salesforce/label/c.Phone_Short_Form';
import Email_Short_Form from '@salesforce/label/c.Email_Short_Form';

export default class ContactDisplayUtility extends LightningElement {

    //Custom Labels
    phoneLabel = Phone_Short_Form;
    emailLabel = Email_Short_Form;

    //Public variables
    @api typeOfContact;
    @api contact;

    //Private reactive variables
    @track contactName;
    @track contactPhone;
    @track contactEmail;
    @track contactEmailLink;

    connectedCallback(){
        this.setContactValues();
    }

    setContactValues() {
        if (this.typeOfContact === 'Primary') {
            if (this.contact && this.contact.Opportunity_Contact__r) {
                this.contactName = this.contact.Opportunity_Contact__r.Name;
                this.contactPhone = this.contact.Opportunity_Contact__r.Phone;
                this.contactEmail = this.contact.Opportunity_Contact__r.Email;
                this.contactEmailLink = 'mailto:' + this.contact.Opportunity_Contact__r.Email;
            }
        } else if (this.typeOfContact === 'Billing') {
            if (this.contact && this.contact.Billing_Contact__r) {
                this.contactName = this.contact.Billing_Contact__r.Name;
                this.contactPhone = this.contact.Billing_Contact__r.Phone;
                this.contactEmail = this.contact.Billing_Contact__r.Email;
                this.contactEmailLink = 'mailto:' + this.contact.Billing_Contact__r.Email;
            }
        } else if (this.typeOfContact === 'Operations') {
            if (this.contact && this.contact.Operations_Contact__r) {
                this.contactName = this.contact.Operations_Contact__r.Name;
                this.contactPhone = this.contact.Operations_Contact__r.Phone;
                this.contactEmail = this.contact.Operations_Contact__r.Email;
                this.contactEmailLink = 'mailto:' + this.contact.Operations_Contact__r.Email;
            }
        }
    }

}