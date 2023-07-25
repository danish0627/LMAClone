/* eslint-disable no-alert */
/* eslint-disable vars-on-top */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import { LightningElement, track } from "lwc";
import Account_Contacts from "@salesforce/label/c.Account_Contacts";
import Primary_Contact from "@salesforce/label/c.Primary_Contact";
import Health_and_Safety from "@salesforce/label/c.Health_and_Safety";
import Invoice_Contact from "@salesforce/label/c.Invoice_Contact";
import Operations_Contact from "@salesforce/label/c.Operations_Contact";
import Home_Button from "@salesforce/label/c.Home_Button";
import Booth from "@salesforce/label/c.Booth";
import Address from "@salesforce/label/c.Address";
import City from "@salesforce/label/c.City";
import State from "@salesforce/label/c.State";
import Zip from "@salesforce/label/c.Zip";
import Country from "@salesforce/label/c.Country";
import Booth_Contacts from "@salesforce/label/c.Booth_Contacts";
import getCurrentUser from "@salesforce/apex/CC_AccountContactCtrl.getCurrentUser";
import getEventDetail from "@salesforce/apex/CC_AccountContactCtrl.getEventDetail";
import getEventEditionAccountContact from "@salesforce/apex/CC_AccountContactCtrl.getEventEditionAccountContact";
import getContact from "@salesforce/apex/CC_AccountContactCtrl.getContact";
import saveContact from "@salesforce/apex/CC_AccountContactCtrl.saveContact";

//var type = "Pri";
var type = "Op1";
var eventCode = "";
var sourceURL = window.location.href;
var params_arr = [];
var queryString = sourceURL.indexOf("?") !== -1 ? sourceURL.split("?")[1] : "";
if (queryString !== "") {
  params_arr = queryString.split("&");
  for (var p = params_arr.length - 1; p >= 0; p -= 1) {
    if (params_arr[p].split("=")[0] === "eventcode")
      eventCode = params_arr[p].split("=")[1];
    if (params_arr[p].split("=")[0] === "type")
      type = params_arr[p].split("=")[1];
  }
}

export default class Cc_accountContacts extends LightningElement {
  @track showOp2Link=true;
  @track showOp3Link=true;
  @track showOp4Link=true;
  @track showOp5Link=true;
  @track showOp1Link=true;
  eventEditionAccountContact;
  eventEditionAccountEventBooth = [];
  @track showSpinner = true;
  label = {
    Account_Contacts,
    Primary_Contact,
    Health_and_Safety,
    Invoice_Contact,
    Operations_Contact,
    Booth_Contacts,
    Address,
    City,
    State,
    Zip,
    Country,
    Home_Button,
    Booth
  };
  @track isFormDataAvailable = false;
  @track welcomeText = "";
  @track accountOperationContactDescription = "";
  @track eventDetails;
  @track eventSetting;
  accountContactUIArray = [];
  accountContactUI = {
    ContactId: "",
    Type: "",
    Name: ""
  };
  primaryContact = {
    ContactId: "",
    Name: "",
    Type: ""
  };
  invoiceContact = {
    ContactId: "",
    Name: "",
    Type: ""
  };
  healthAndSafetyContact = {
    ContactId: "",
    Name: "",
    Type: ""
  };
  opp1ContactUI = {
    ContactId: "",
    Name: "",
    Type: ""
  };
  opp2ContactUI = {
    ContactId: "",
    Name: "",
    Type: ""
  };
  opp3ContactUI = {
    ContactId: "",
    Name: "",
    Type: ""
  };
  opp4ContactUI = {
    ContactId: "",
    Name: "",
    Type: ""
  };
  opp5ContactUI = {
    ContactId: "",
    Name: "",
    Type: ""
  };
  expocadBoothUI = {
    BoothId: "",
    BoothName: "",
    BoothContactId: "",
    BoothContactName: ""
  };
  @track opp1ContactUIHasData = false;
  @track opp2ContactUIHasData = false;
  @track opp3ContactUIHasData = false;
  @track opp4ContactUIHasData = false;
  @track opp5ContactUIHasData = false;
  @track expocadBoothUIHasNoData = false;
  @track primaryContactTypeNull = false;
  @track invoiceContactTypeNull = false;
  @track hNSContactTypeNull = false;
  @track primaryContactTypeNotNull = false;
  @track invoiceContactTypeNotNull = false;
  @track hNSContactTypeNotNull = false;
  eventCode = eventCode;
  type = type;
  conId = "";
  @track contact;
  @track userName = "";
  @track accountPrimaryContactDescription = "";
  @track accountInvoiceContactDescription = "";
  @track accountHealthSafetyContactDescription = "";
  @track boothId = "";
  @track currentUser;
  showContactToAdminButton = false;
  isPri = false;
  isInv = false;
  isHnS = false;
  isContainsOpp = false;
  isBooth = false;
  @track isEditable = false;
  @track readOnly = true;
  expocadBoothList = [];

  connectedCallback() {
    if (type === "Pri") {
      this.isPri = true;
    } else if (type === "Inv") {
      this.isInv = true;
    } else if (type === "HnS") {
      this.isHnS = true;
    } else if (type.includes("Op")) {
      this.isContainsOpp = true;
    } else if (type === "Booth") {
      this.isBooth = true;
    }
    this.retrieveCurrentUser();
  }
  retrieveCurrentUser() {
    getCurrentUser()
      .then(result => {
        if (result) {
          this.currentUser = result;
          this.retrieveEventDetail();
        }
      })
      .catch(error => {});
  }
  homeUrl() {
    window.location.href='/CustomerCenter/s/?eventcode='+this.eventCode;
  }

  retrieveContact(contactIdRecieved) {
    getContact({ sConId: contactIdRecieved })
      .then(result => {
        if (result) {
          let contactUser = result.listConUser;
          if(contactUser.length>0){
            this.userName=contactUser[0].Username;
            this.showContactToAdminButton=false;
          }
          else
          this.showContactToAdminButton=true;
          this.contact = result.con;
          this.isFormDataAvailable = true;
          if (
            this.contact.Contact_Type__c.includes("Primary Contact") ||
            this.contact.Contact_Type__c.includes("Invoice Contact") ||
            this.contact.Contact_Type__c.includes("Health & Safety") ||
            this.contact.Contact_Type__c.includes("Operations Contact")
          ) {
            this.readOnly = true;
          } else if (
            (!this.contact.Contact_Type__c.includes("Health & Safety") ||
              !this.contact.Contact_Type__c.includes("Primary Contact") ||
              !this.contact.Contact_Type__c.includes("Invoice Contact") ||
              !this.contact.Contact_Type__c.includes("Operations Contact")) &&
            this.contact.Contact_Type__c.includes("Booth Contact")
          ) {
            this.readOnly = false;
          }
          
        }
      })
      .catch(error => {});
  }
  onSave(event) {
    this.contact.Id = this.conId;
    var inputFields = this.template.querySelectorAll("lightning-input");
    if (inputFields.length > 0) {
      for (var i = 0; i < inputFields.length; i++) {
        var inputField = inputFields[i];
        if (inputField.name !== undefined || inputField.name !== "") {
          if (inputField.name === "firstname") {
            this.contact.FirstName = inputField.value;
          }
          if (inputField.name === "lastname") {
            this.contact.LastName = inputField.value;
          }
          if (inputField.name === "email") {
            this.contact.Email = inputField.value;
          }
          if (inputField.name === "city") {
            this.contact.MailingCity = inputField.value;
          }
          if (inputField.name === "state") {
            this.contact.MailingState = inputField.value;
          }
          if (inputField.name === "country") {
            this.contact.MailingCountry = inputField.value;
          }
          if (inputField.name === "zip") {
            this.contact.MailingPostalCode = inputField.value;
          }
          if (inputField.name === "title") {
            this.contact.Title = inputField.value;
          }
          if (inputField.name === "address") {
            this.contact.MailingStreet = inputField.value;
          }
        }
      }
    }
    saveContact({ con: this.contact })
      .then(result => {})
      .catch(error => {});
  }

  // This method is used to fetch event detals from server 
  retrieveEventDetail() {
    getEventDetail({
      sEventCode: this.eventCode
    })
      .then(result => {
        if (result) {
          this.eventDetails = result.eventEdition;
          this.eventSetting = result.eventSettings;
          if (
            this.eventDetails.Id !== undefined &&
            this.currentUser.AccountId !== undefined
          )
            this.retrieveEventEditionAccountContact(
              this.eventDetails.Id,
              this.currentUser.AccountId
            );
        }
      })
      .catch(error => {});
  }

  // This method is used to fetch event edititon Account and contacts details  from server 
  
  retrieveEventEditionAccountContact(eId, accId) {
    getEventEditionAccountContact({
      eId: eId,
      accId: accId
    })
      .then(result => {
        this.eventEditionAccountContact = JSON.parse(result.contactDetailJson);
        for (let i = 0; i < this.eventEditionAccountContact.length; i++) {
          var currentEdition = this.eventEditionAccountContact[i];
          if (currentEdition.Type.includes("Pri")) {
            this.primaryContactTypeNull = false;
            this.primaryContactTypeNotNull = true;
            this.primaryContact.Name = currentEdition.Name;
            this.primaryContact.Type = currentEdition.Type;
            this.primaryContact.ContactId = currentEdition.ContactId;
          } else if (currentEdition.Type.includes("Inv")) {
            this.invoiceContactTypeNull = false;
            this.invoiceContactTypeNotNull = true;
            this.invoiceContact.Name = currentEdition.Name;
            this.invoiceContact.Type = currentEdition.Type;
            this.invoiceContact.ContactId = currentEdition.ContactId;
          } else if (currentEdition.Type.includes("Hlt")) {
            this.hNSContactTypeNotNull = true;
            this.hNSContactTypeNull = false;
            this.healthAndSafetyContact.Name = currentEdition.Name;
            this.healthAndSafetyContact.Type = currentEdition.Type;
            this.healthAndSafetyContact.ContactId = currentEdition.ContactId;
          } else if (currentEdition.Type.includes("Op1")) {
            this.opp1ContactUIHasData = true;
            this.opp1ContactUI.Name = currentEdition.Name;
            this.opp1ContactUI.Type = currentEdition.Type;
            this.opp1ContactUI.ContactId = currentEdition.ContactId;
          } else if (currentEdition.Type.includes("Op2")) {
            this.opp2ContactUIHasData = true;
            this.opp2ContactUI.Name = currentEdition.Name;
            this.opp2ContactUI.Type = currentEdition.Type;
            this.opp2ContactUI.ContactId = currentEdition.ContactId;
          } else if (currentEdition.Type.includes("Op3")) {
            this.opp3ContactUIHasData = true;
            this.opp3ContactUI.Name = currentEdition.Name;
            this.opp3ContactUI.Type = currentEdition.Type;
            this.opp3ContactUI.ContactId = currentEdition.ContactId;
          } else if (currentEdition.Type.includes("Op4")) {
            this.opp4ContactUIHasData = true;
            this.opp4ContactUI.Name = currentEdition.Name;
            this.opp4ContactUI.Type = currentEdition.Type;
            this.opp4ContactUI.ContactId = currentEdition.ContactId;
          } else if (currentEdition.Type.includes("Op5")) {
            this.opp5ContactUIHasData = true;
            this.opp5ContactUI.Name = currentEdition.Name;
            this.opp5ContactUI.Type = currentEdition.Type;
            this.opp5ContactUI.ContactId = currentEdition.ContactId;
          }
        }

        if(this.type==='Pri'){
          this.conId=this.primaryContact.ContactId;
          this.retrieveContact(this.primaryContact.ContactId);
        }
        else if(this.type==='Inv'){
          this.conId=this.invoiceContact.ContactId;
          this.retrieveContact(this.invoiceContact.ContactId);
        }
        else if(this.type==='HnS'){
          this.conId=this.healthAndSafetyContact.ContactId;
          this.retrieveContact(this.healthAndSafetyContact.ContactId);
        }
        else if(this.type==='Op1'){
          this.conId=this.opp1ContactUI.ContactId;
          this.retrieveContact(this.opp1ContactUI.ContactId);
        }
        else if(this.type==='Op2'){
          this.conId=this.opp2ContactUI.ContactId;
          this.retrieveContact(this.opp2ContactUI.ContactId);
        }
        else if(this.type==='Op3'){
          this.conId=this.opp3ContactUI.ContactId;
          this.retrieveContact(this.opp3ContactUI.ContactId);
        }
        else if(this.type==='Op4'){
          this.conId=this.opp4ContactUI.ContactId;
          this.retrieveContact(this.opp4ContactUI.ContactId);
        }
        else if(this.type==='Op5'){
          this.conId=this.opp5ContactUI.ContactId;
          this.retrieveContact(this.opp5ContactUI.ContactId);
        }
        else if(this.type==='Booth'){
          this.retrieveContact(this.conId);
        }
        if (this.type !== "Pri" || this.type === "") {
          this.primaryContactTypeNull = true;
          this.primaryContactTypeNotNull = false;
        }
        if (this.type === "Pri") {
          this.primaryContactTypeNull = false;
          this.primaryContactTypeNotNull = true;
        }
        if (this.type !== "Inv" || this.type === "") {
          this.invoiceContactTypeNull = true;
          this.invoiceContactTypeNotNull = false;
        }
        if (this.type === "Inv") {
          this.invoiceContactTypeNull = false;
          this.invoiceContactTypeNotNull = true;
        }
        if (this.type !== "HnS" || this.type === "") {
          this.hNSContactTypeNull = true;
          this.hNSContactTypeNotNull = false;
        }
        if (this.type === "HnS") {
          this.hNSContactTypeNull = false;
          this.hNSContactTypeNotNull = true;
        }
        this.retrieveEventEditionAccountEventBooth(
          JSON.parse(result.boothDetailJson)
        );
      })
      .catch(error => {});
  }
  retrieveEventEditionAccountEventBooth(eventEditionAccountEventBooth) {
    this.eventEditionAccountEventBooth=[];
    var tempEventBooth = eventEditionAccountEventBooth;
    for (let i = 0; i < tempEventBooth.length; i++) {
      var curent = tempEventBooth[i];
      var expocadBoothObj = {
        BoothId: curent.boothId !== undefined ? curent.boothId : "",
        BoothName: curent.boothName !== undefined ? curent.boothName : "",
        BoothContactId:
          curent.boothContactId !== undefined ? curent.boothContactId : "",
        BoothContactName:
          curent.boothContactName !== undefined ? curent.boothContactName : ""
      };
      this.eventEditionAccountEventBooth.push(expocadBoothObj);
    }
    this.showSpinner = false;
  }
  openNewUrl(event){
    this.showSpinner=true;
    this.isFormDataAvailable=false;
      var source = event.currentTarget.name;
      
      if(source==='invoice'){
        this.type='Inv';
        this.showOp1Link=true;
        this.showOp2Link=true;
        this.showOp5Link=true;
        this.showOp3Link=true;
        this.showOp4Link=true;
      }
      if(source==='primary'){
        this.type='Pri';
        this.showOp1Link=true;
        this.showOp2Link=true;
        this.showOp5Link=true;
        this.showOp3Link=true;
        this.showOp4Link=true;
      }
      if(source==='hns'){
        this.type='HnS';
        this.showOp1Link=true;
        this.showOp2Link=true;
        this.showOp5Link=true;
        this.showOp3Link=true;
        this.showOp4Link=true;
      }
      if(source==='opp1'){
        this.type='Op1';
        this.showOp1Link=false;
        this.showOp2Link=true;
        this.showOp5Link=true;
        this.showOp3Link=true;
        this.showOp4Link=true;
      }
      
      if(source==='opp2'){
        this.type='Op2';
        this.showOp1Link=true;
        this.showOp2Link=false;
        this.showOp5Link=true;
        this.showOp3Link=true;
        this.showOp4Link=true;
      }
      if(source==='opp3'){
        this.type='Op3';
        this.showOp1Link=true;
        this.showOp2Link=true;
        this.showOp5Link=true;
        this.showOp3Link=false;
        this.showOp4Link=true;
      }
      if(source==='opp4'){
        this.type='Op4';
        this.showOp1Link=true;
        this.showOp2Link=true;
        this.showOp5Link=true;
        this.showOp3Link=true;
        this.showOp4Link=false;
      }
      if(source==='opp5'){
        this.type='Op5';
        this.showOp1Link=true;
        this.showOp2Link=true;
        this.showOp5Link=false;
        this.showOp3Link=true;
        this.showOp4Link=true;
      }
      if(source!=='primary' && source!=='invoice' && source!=='hns' && source!=='opp1' && source!=='opp2' && source!=='opp3'
      && source!=='opp3' && source!=='opp4' && source!=='opp5'){
        
        this.type='Booth';
        this.showOp1Link=true;
        this.showOp2Link=true;
        this.showOp5Link=true;
        this.showOp3Link=true;
        this.showOp4Link=true;
        for(var i=0;i<this.eventEditionAccountEventBooth.length;i++){
          var currentBooth = this.eventEditionAccountEventBooth[i];
          if(currentBooth.BoothId===source){
            this.conId=currentBooth.BoothContactId;
            this.boothNumber=currentBooth.BoothName;
          }
        }
      }
      this.retrieveCurrentUser();
      if (this.type === "Pri") {
        this.isPri = true;
        this.isInv=false;
        this.isHnS = false;
        this.isContainsOpp = false;
        this.isBooth = false;
      } else if (this.type === "Inv") {
        this.isPri = false;
        this.isHnS = false;
        this.isContainsOpp = false;
        this.isBooth = false;
        this.isInv = true;
      } else if (this.type === "HnS") {
        this.isHnS = true;
        this.isPri = false;
        this.isContainsOpp = false;
        this.isBooth = false;
        this.isInv = false;
      } else if (this.type.includes("Op")) {
        this.isHnS = false;
        this.isPri = false;
        this.isBooth = false;
        this.isInv = false;
        this.isContainsOpp = true;
      } else if (this.type === "Booth") {
        this.isBooth = true;
        this.isHnS = false;
        this.isPri = false;
        this.isContainsOpp = false;
        this.isInv = false;
      }
  }
}