import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getFormData from '@salesforce/apex/LtngUtilityCtrl.getRecords';
export default class Ops_formPermissions extends LightningElement {

  @track recordId = '';
  @track openNewModal = false;
  @track openEditModal = false;
  @track openEditModalInner = false;
  @track fields = 'Event_Edition_Form__r.Name,Active__c,Name';
  @track fieldlabel = 'Form Name, Active, Forms Permission Name';
  @track renderingCondition = '';
  @track lookupCondition;
  @track formLookup;
  @track errorMessage = '';
  @track activeCheck;
  @track formPermId;
  @track openPermissionModal;
  connectedCallback() {
    let fullUrl = window.location.href;
    this.esId = this.GetQS(fullUrl, 'esid');
    this.eId = this.GetQS(fullUrl, 'id');
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
  handleNewModal() {
    this.openNewModal = true;
    this.errorMessage = '';
    let eventId = this.eId;
    this.lookupCondition = "Event_Edition__c='" + eventId + "'"
  }
  setLookupField(event) {
    let lookupValue = event.detail.value;
    this.formLookup = lookupValue;
  }
  submitFormPer(event) {
    event.preventDefault();
    this.errorMessage = '';
    const fields = event.detail.fields;
    let userType = fields.User_Type__c;
    let formsLookup = this.formLookup;
    if (!userType) {
      this.errorMessage = 'Complete all required fields.';
    }
    else if (formsLookup === undefined) {
      this.errorMessage = 'Complete all required fields.';
    }
    else {
      fields.Event_Edition_Form__c = formsLookup;
    }
    if (!this.errorMessage) {
      this.template.querySelector('.globalForm').submit(fields)
    }
    this.isLoading = true;
  }
  callSaveBtn() {
    this.template.querySelector('.save').click();
  }
  handleFormCreated() {
    this.isLoading = false;
    this.dispatchEvent(
      new ShowToastEvent({
        title: 'Success',
        message: 'Record created successfully!',
        variant: 'Success',
      }),
    );
    this.openNewModal = false;

  }
  handleEditModal(event) {
    this.recordId = event.detail;
    let eventId = this.eId;
    this.renderingCondition = "Event_Edition_Form__r.Event_Edition__r.Id='" + eventId + "' AND User_Type__c='" + this.recordId + "'"
    this.openEditModal = true;
  }
  closeModal() {
    this.openNewModal = false;
    this.openEditModal = false;
    this.isLoading = false;
  }
  handleformCreated() {
    this.openNewModal = false;
    this.dispatchEvent(
      new ShowToastEvent({
        title: 'Success',
        message: 'Permission Created Sucessfully',
        variant: 'success',
      }));
  }
  handleEditInnerModal(event) {
    this.formPermId = event.detail;
    this.openPermissionModal = true;
    let formPerId = this.formPermId;
    getFormData({
      objName: "Forms_Permission__c",
      fieldNames:
        "id,Active__c ",
      compareWith: "id",
      recordId: formPerId,
      pageNumber: 1,
      pageSize: 1
    })
      .then(result => {
        this.activeCheck = result.recordList[0].Active__c;
      })
      .catch(error => {
        window.console.log("error..." + JSON.stringify(error));
      });

  }
  closeModalInner() {
    this.openEditModalInner = false;
    this.isLoading = false;
  }
  onSuccess() {
    this.isLoading = false;
    this.dispatchEvent(
      new ShowToastEvent({
        title: 'Success',
        message: 'Record updated successfully!',
        variant: 'Success',
      }),
    );
    this.openPermissionModal = false;
    this.handleRefreshTable();

  }
  handleRefreshTable() {
    try {
      let table = this.template.querySelectorAll('c-events-list-custom-table');
      table[1].refreshTable();
    } catch (error) {
      window.console.error(error);
    }
  }
  closeEditModal() {
    this.openPermissionModal = false;
  }
}