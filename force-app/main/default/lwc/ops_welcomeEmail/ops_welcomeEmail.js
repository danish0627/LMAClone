/* eslint-disable no-alert */
/* eslint-disable no-console */
import { LightningElement, track } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import Setting from "@salesforce/label/c.Setting";
import Reports from "@salesforce/label/c.Reports";
import Banner from "@salesforce/label/c.Banner";
import Image from "@salesforce/label/c.Image";
import Exhibitor from "@salesforce/label/c.Exhibitor";
import StandContractor from "@salesforce/label/c.StandContractor";
import Agent from "@salesforce/label/c.Agent";
import Co_Exhibitor from "@salesforce/label/c.Co_Exhibitor";
import Contractor from "@salesforce/label/c.Contractor";
import BodyText1 from "@salesforce/label/c.BodyText1";
import BodyText2 from "@salesforce/label/c.BodyText2";
import getEventEditionSetting from "@salesforce/apex/OPS_WelcomeEmailCtrl.getEventEditionSetting";
import updateEventSetting from "@salesforce/apex/OPS_WelcomeEmailCtrl.saveEventSetting";
import sendWelcomeEmail from "@salesforce/apex/OPS_WelcomeEmailCtrl.sendWelcomeEmailPreview";
import saveFile from "@salesforce/apex/OPS_WelcomeEmailCtrl.saveFile";
import attachDocument from "@salesforce/apex/OPS_WelcomeEmailCtrl.attachDocument";
import deleteImage from "@salesforce/apex/OPS_WelcomeEmailCtrl.deleteImage";

export default class Ops_welcomeEmail extends LightningElement {
  @track showFrame = false;
  @track selectedTab = "Exhibitor";
  @track showSpinner = true;
  @track eventEditionSetting;
  @track eventEdition;
  @track boxType1Value = "";
  @track boxType2Value = "";
  @track showEmailPreview = false;
  @track showEmailSent = false;
  @track imageUrlOk = false;
  @track fileName = "";
  currentUserEmail = "";
  source = "";
  imageUrl = "";

  eventSettings;
  filesUploaded = [];
  file;
  fileContents;
  fileReader;
  content;
  MAX_FILE_SIZE = 1500000;
  label = {
    Setting,
    Reports,
    Image,
    Banner,
    Exhibitor,
    StandContractor,
    Agent,
    Co_Exhibitor,
    Contractor,
    BodyText2,
    BodyText1
  };
  eventId = "";

  connectedCallback() {
        let fullUrl = window.location.href;
        this.eventId = this.GetQS(fullUrl, 'id');
        this.fetchEventEditionSetting(this.eventId);
  }
  GetQS(url, key) {
    var Qs = url.split('#')[1].replace(/^\s+|\s+$/g, '');
    var a = "";
    if (Qs !== "") {
        let qsArr = Qs.split("&");
        for (let i = 0; i < qsArr.length; i++)
            if (qsArr[i].split("=")[0] === key)
                a = qsArr[i].split("=")[1];
    }
    return a;
  }
  fetchEventEditionSetting(eventId) {
    getEventEditionSetting({ sEventId: eventId })
      .then(result => {
        if (result) {
          this.eventEditionSetting = result;
          this.eventEdition = this.eventEditionSetting.eventEdition;
          this.eventSettings = this.eventEditionSetting.eventSettings;
          this.currentUserEmail = this.eventEditionSetting.sUserEmail;
          this.boxType1Value =
            this.eventSettings.Exhibitor_Email_Content1__c !== undefined
              ? this.eventSettings.Exhibitor_Email_Content1__c
              : "";
          this.boxType2Value =
            this.eventSettings.Exhibitor_Email_Content2__c !== undefined
              ? this.eventSettings.Exhibitor_Email_Content2__c
              : "";
          if (this.eventSettings.Welcome_Email_Banner__c !== undefined) {
            this.imageUrl =
              "/servlet/servlet.ImageServer?id=" +
              this.eventSettings.Welcome_Email_Banner__c +
              "&oid=" +
              this.eventSettings.Organization_Id_Ops_Admin__c;

            this.imageUrlOk = true;
          } else {
            this.imageUrlOk = false;
          }
          this.showSpinner = false;
        }
      })
      // eslint-disable-next-line no-unused-vars
      .catch(error => {
      });
  }
  onTabSelection(event) {
    this.selectedTab = event.target.label;
    this.initiateBoxValue();
  }
  onSave() {
    this.showSpinner = true;
    let eventSettingObj = {
      EventId: this.eventId,
      boxType1Value: this.boxType1Value,
      boxType2Value: this.boxType2Value,
      selectedTab: this.selectedTab
    };
    updateEventSetting({ eventSettingJson: JSON.stringify(eventSettingObj) })
      .then(result => {
        if (result) {
          this.fetchEventEditionSetting(this.eventId);
        }
      })
      .catch(error => {});
  }
  onCancel() {
    this.initiateBoxValue();
  }
  initiateBoxValue() {
    if (this.selectedTab === "Exhibitor") {
      this.boxType1Value =
        this.eventSettings.Exhibitor_Email_Content1__c !== undefined
          ? this.eventSettings.Exhibitor_Email_Content1__c
          : "";
      this.boxType2Value =
        this.eventSettings.Exhibitor_Email_Content2__c !== undefined
          ? this.eventSettings.Exhibitor_Email_Content2__c
          : "";
    } else if (this.selectedTab === "Stand Contractor") {
      this.boxType1Value =
        this.eventSettings.Stand_Contractor_Content1__c !== undefined
          ? this.eventSettings.Stand_Contractor_Content1__c
          : "";
      this.boxType2Value =
        this.eventSettings.Stand_Contractor_Content2__c !== undefined
          ? this.eventSettings.Stand_Contractor_Content2__c
          : "";
    } else if (this.selectedTab === "Agent") {
      this.boxType1Value =
        this.eventSettings.Agent_Email_Content1__c !== undefined
          ? this.eventSettings.Agent_Email_Content1__c
          : "";
      this.boxType2Value =
        this.eventSettings.Agent_Email_Content2__c !== undefined
          ? this.eventSettings.Agent_Email_Content2__c
          : "";
    } else if (this.selectedTab === "Co-Exhibitor") {
      this.boxType1Value =
        this.eventSettings.Co_Exhibitor_Email_Content1__c !== undefined
          ? this.eventSettings.Co_Exhibitor_Email_Content1__c
          : "";
      this.boxType2Value =
        this.eventSettings.Co_Exhibitor_Email_Content2__c !== undefined
          ? this.eventSettings.Co_Exhibitor_Email_Content2__c
          : "";
    } else if (this.selectedTab === "Contractor") {
      this.boxType1Value =
        this.eventSettings.Contractor_Email_Content1__c !== undefined
          ? this.eventSettings.Contractor_Email_Content1__c
          : "";
      this.boxType2Value =
        this.eventSettings.Contractor_Email_Content2__c !== undefined
          ? this.eventSettings.Contractor_Email_Content2__c
          : "";
    }
  }
  onRichTextChange(event) {
   /* if (event.currentTarget.title === "boxType1Value") {
      if (event.currentTarget.id.includes(this.selectedTab)) {
        this.boxType1Value = event.currentTarget.value;
      }
    }
    if (event.target.title === "boxType2Value") {
      if (event.currentTarget.id.includes(this.selectedTab)) {
        this.boxType2Value = event.currentTarget.value;
      }
    }*/

    if (event.currentTarget.title === "boxType1Value") {
      if(this.selectedTab === 'Stand Contractor') {
        let standTab = event.currentTarget.id;
        let finalstandaTab = event.currentTarget.id.split('-')[0]+' '+event.currentTarget.id.split('-')[1].split(' ')[1];
          if(finalstandaTab === this.selectedTab) {
            this.boxType1Value = event.currentTarget.value;
          }
      }
      else if(event.currentTarget.id.includes(this.selectedTab)) {
        this.boxType1Value = event.currentTarget.value;
      }
    }
    if (event.target.title === "boxType2Value") { 
      if(this.selectedTab === 'Stand Contractor') {
        let standTab = event.currentTarget.id;
        let finalstandaTab = event.currentTarget.id.split('-')[0]+' '+event.currentTarget.id.split('-')[1].split(' ')[1];
          if(finalstandaTab === this.selectedTab) {
            this.boxType2Value = event.currentTarget.value;
          }
      }
      else
       if (event.currentTarget.id.includes(this.selectedTab)) {
        this.boxType2Value = event.currentTarget.value;
      }
    }
    
  }
  showIframe() {
    this.showFrame = !this.showFrame;
    this.showEmailPreview = true;
    this.showEmailSent = false;
  }
  sendEmail() {
    var userType = "";
    if (this.selectedTab === "Exhibitor") {
      userType = "Exhibitor";
    } else if (this.selectedTab === "Stand Contractor") {
      userType = "StandContractor";
    } else if (this.selectedTab === "Agent") {
      userType = "Agent";
    } else if (this.selectedTab === "Co-Exhibitor") {
      userType = "Co_Exhibitor";
    } else if (this.selectedTab === "Contractor") {
      userType = "Contractor";
    }
    sendWelcomeEmail({ UserType: userType, sEventId: this.eventEdition.Id })
      .then(result => {
        if (result) {
          this.showFrame = true;
          this.showEmailPreview = false;
          this.showEmailSent = true;
        }
      })
      .catch(error => {});
  }
  handleFilesChange(event) {
    if (event.target.files.length > 0) {
      this.filesUploaded = event.target.files;
      this.fileName = event.target.files[0].name;
      this.uploadHelper(this.filesUploaded);
    } else {
      this.fileName = "Please select file to upload!!";
    }
  }
  uploadHelper(filesUploaded) {
    this.file = filesUploaded[0];
    if (this.file.size > this.MAX_FILE_SIZE) {
      return;
    }
    this.showSpinner = true;
    this.fileReader = new FileReader();
    this.fileReader.onloadend = () => {
      this.fileContents = this.fileReader.result;
      let base64 = "base64,";
      this.content = this.fileContents.indexOf(base64) + base64.length;
      this.fileContents = this.fileContents.substring(this.content);
      this.saveToFile();
    };

    this.fileReader.readAsDataURL(this.file);
  }
  saveToFile() {
    saveFile({
      idParent: this.eventSettings.Id,
      eventId: this.eventEdition.Id,
      strFileName: this.file.name,
      base64Data: encodeURIComponent(this.fileContents)
    })
      .then(result => {
        this.saveAttachDocument(result);
      })
      .catch(error => {});
  }
  saveAttachDocument(attachmentId) {
    attachDocument({
      AttachmentId: attachmentId,
      sEventSettingId: this.eventSettings.Id
    })
      .then(result => {
        this.fetchEventEditionSetting(this.eventId);
        let title = "Success!!";
        let message = "BANNER IMAGE - Uploaded Successfully";
        let variant = "success";
        this.showToast(title, message, variant);
      })
      .catch(error => {
        let title = "Error while uploading File";
        let message = error.message;
        let variant = "error";
        this.showToast(title, message, variant);
      });
  }
  showToast(title, message, variant) {
    this.dispatchEvent(
      new ShowToastEvent({
        title: title,
        message: message,
        variant: variant
      })
    );
  }
  onImageDelete() {
    if (
      this.eventSettings.Welcome_Email_Banner__c === undefined ||
      this.eventSettings.Welcome_Email_Banner__c === ""
    ) {
      let title = "No file";
      let message = "There is no file to delete";
      let variant = "warning";
      this.showToast(title, message, variant);
    } else {
      deleteImage({ sEventSettingId: this.eventSettings.Id })
        .then(result => {
          if (result === true) {
            this.imageUrl ="";
            this.showSpinner = true;
            let title = "Success";
            let message = "BANNER IMAGE - Deleted Successfully";
            let variant = "success";
            this.fetchEventEditionSetting(this.eventId);
            this.showToast(title, message, variant);
          }
        })

        .catch(error => {
          let title = "Error while Deleting File";
          let message = error.message;
          let variant = "error";
          this.showToast(title, message, variant);
        });
    }
  }
  navigateTo(event) {
    let breadCrumName = event.target.name;
    if (breadCrumName === "cc")
      window.location.href = "/lightning/n/ops_customer_centre";
    else if (breadCrumName === "ccs") {
      window.location.href =
        "/lightning/n/ops_customer_centre_settings#id=" + this.eventId;
    }
  }
}