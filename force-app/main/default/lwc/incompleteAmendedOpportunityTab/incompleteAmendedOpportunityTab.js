/*
Created By	 : Girikon(Yash Gupta)
Created On	 : sep ‎24, ‎2019
@description : This Component is used for incompleteAmended Opportunity tab

Modification log --
Modified By	: 
*/

/* eslint-disable no-console */
import { LightningElement, track, api } from "lwc";
import getDatas from "@salesforce/apex/CommonTableController.getGenericObjectRecord";
import getAggregateData from "@salesforce/apex/CommonTableController.getAggregateData";
import getFileDetail from "@salesforce/apex/CommonTableController.getFileDetail";
import getSSCTeamMember from "@salesforce/apex/SSCDashboardLtngCtrl.getSSCTeamMember";
import approveRejectAmmendedOpportunit from "@salesforce/apex/SSCDashboardLtngCtrl.approveRejectAmmendedOpportunit";
import getPickListValuesIntoList from "@salesforce/apex/SSCDashboardLtngCtrl.getPickListValuesIntoList";
import { loadScript } from "lightning/platformResourceLoader";
import jquery from "@salesforce/resourceUrl/jquery_core";
import { handleErrors, showToast } from "c/lWCUtility";
const DELAY = 300;
export default class IncompleteAmendedOpportunityTab extends LightningElement {
  @track detail_rows;
  @track sscNoteValue = "";
  @track modalContainerClass = "";
  @track textAreaValidity = "This field is required.";
  @track clickedOpportunity;
  @track showModal = false;
  @track isOpened = false;
  @track modalMessage = "";
  @track showSSCNote = false;
  @track sscRequired = false;
  @track buttonName = "";
  @api recordId;
  @track rejectResponseOptions = [{label:'--None--',value:'None'}];
  @track pagesize = 10;
  @track currentPageNo = 1;
  @track totalPages = 0;
  @track pageList;
  @track totalrows = 0;
  @track offst = 0;
  @track hasNext = false;
  @track hasPrev = false;
  @track searchValue = "";
  @track showPageView = "0";
  @track sortByFieldName = "";
  @track sortByName = "LastModifiedDate";
  @track sortType = "desc";
  @track dataLoaded = false;
  @track tableData;
  @track tableColumn;
  @track objectName = "Opportunity";
  @track objectLabel = "Opportunity";
  @track fields =
    "Name,Account.Name,EventEdition__r.Name,CloseDate,StageName,Status__c,Tax_Rule_SAP__c,Event_Series__r.Name";
  @track fieldsLabel =
    "Opportunity Name,Account,Event Edition,Close Date,Stage,Status,TAX Rule,Event Series";
  @track condition = "Id!=''";
  @track tempCondition = "";
  startCondition = "";
  @track filterField;
  @track filterLabel;
  @track isMultiPicklistFilter1;
  @track filterFieldOptions;
  @track filterFieldValue = "";

  //Delegate Opportunity filter
  @api filterDelegateOpp=false;
  @track conditionDelegate;
  @track toggleDelegateOpp=false;

  @track error;
  @track firstTime;
  @track spinner = true;
  @track isShow;
  @track colSpan;
  @track lastind;

  connectedCallback() {
    this.retrievePickListValuesIntoList();
    this.isMultiPicklistFilter1 = false;
    //Load jquery
    loadScript(this, jquery)
      .then({})
      .catch(error => {
        showToast(this, error, "error", "Error");
      });
    this.filterField = "EventEdition__r.Name";
    this.filterLabel = "Event Edition";
    this.firstTime = true;
    this.hasNext = false;
    this.hasPrev = false;
    this.pagesize = 10;
    this.offst = 0;

    const col = [];
    if (typeof this.fields === "string") {
      this.fields.split(",").forEach((item, i) => {
        col.push({
          label: this.fieldsLabel.split(",")[i],
          fieldName: item.trim()
        });
      });
      this.colSpan = col.length + 1;
    } else {
      this.fields = "";
    }

    if (typeof this.objectName != "string") {
      this.objectName = "";
    }
    this.tableColumn = col;

    this.isShow = this.spinner === false && this.firstTime;
    this.retrieveSSCTeamMember();
    if(this.toggleDelegateOpp!=undefined){
      this.toggleDelegateOpp = this.toggleDelegateOpp;
    }
    
  }

  retrieveSSCTeamMember() {
    getSSCTeamMember()
      .then(result => {
        if (result) {
          let ids = [];
          for (let i = 0; i < result.length; i++) {
            if (result[i].SSC_Team__r.Event_Series__c !== undefined) {
              ids.push(result[i].SSC_Team__r.Event_Series__c);
            }
          }
          this.tempCondition =
            "StageName ='Closed Won' And IsAmendContractOpp__c=true And Status__c ='Pending Accounting Approval' AND Exhibitor_Paid_By__c != \'Delegate Sales\' And  EventEdition__r.Part_of_Series__c IN ('" +
            ids.join("','") +
            "')";
          this.conditionDelegate = "StageName ='Closed Won' And IsAmendContractOpp__c=true And Status__c ='Pending Accounting Approval' AND Exhibitor_Paid_By__c = \'Delegate Sales\' And  EventEdition__r.Part_of_Series__c IN ('" +
          ids.join("','") +
          "')";
          this.startCondition = this.tempCondition;
          this.getData();
          if (this.filterField !== undefined) {
            this.setFilterOptions(1, this.filterField);
          }
        }
      })
      .catch(error => {
        handleErrors(this, error);
      });
  }

  getData() {
    this.spinner = true;
    getDatas({
      searchValue: this.searchValue,
      objectName: this.objectName,
      fieldstoget: this.fields,
      pagesize: this.pagesize,
      next: this.hasNext,
      prev: this.hasPrev,
      off: this.offst,
      sortBy: this.sortByName,
      sortType: this.sortType,
      condition: this.tempCondition
    })
      .then(data => {
        if (this.offst === -1) {
          this.offst = 0;
        }
        this.firstTime = false;

        const totalRows = data.total > 2000 ? 2000 : data.total;
        this.tableData = data.ltngTabWrap.tableRecord;
        this.tableColumn = data.ltngTabWrap.tableColumn;
        this.setParentFieldColumn(
          this.tableColumn,
          this.fields,
          data.ltngTabWrap.tableRecord
        );
        this.totalPage = Math.ceil(totalRows / this.pagesize);
        this.totalRows = totalRows;
        this.isMoreThan2000 = data.total > 2000 ? true : false;
        this.lastind = parseInt(data.offst + this.pagesize, 10);

        if (data.total < this.lastind) {
          this.lastind = data.total;
        }
        this.showPageView =
          "Showing: " + parseInt(data.offst + 1, 10) + "-" + this.lastind;

        this.generatePageListUtil();
        if (totalRows === 0) {
          this.error = "No record found";
          this.tableData = undefined;
          this.pageList = undefined;
        } else {
          this.error = undefined;
        }
        this.spinner = false;
        this.isShow = this.spinner === false && this.firstTime;
        this.dataLoaded = true;
      })
      .catch(error => {
        this.tableData = undefined;
        this.error = error;
        handleErrors(this, error);
      });
  }
  handleFilterChange() {
    this.spinner = true;

    const condition = this.buildCondition();
    window.clearTimeout(this.delayTimeout);

    // eslint-disable-next-line @lwc/lwc/no-async-operation
    this.delayTimeout = setTimeout(() => {
      this.offst = 0;
      this.currentPageNo = 1;
      this.hasNext = false;
      this.hasPrev = false;
      this.tempCondition = this.startCondition + condition;
      this.getData();
    }, DELAY);
  }

  setParentFieldValue(tbldatas) {
    let datas = JSON.parse(JSON.stringify(tbldatas));

    for (let i = 0; i < datas.length; i++) {
      datas[i].drawerOpen = false;
      datas[i].condition = "Amended_Opportunity__c='" + datas[i].Id + "'";
      datas[i].RecordId = "a" + datas[i].Id;
      datas[i].emailLink =
        "/apex/sendInvoice?id=" +
        datas[i].Id +
        "&retUrl=" +
        datas[i].OpportunityId__c +
        "&accountId=" +
        datas[i].blng__Account__c +
        "&IsAccount=true";
      //build link
      if (datas[i].hasOwnProperty("Name")) {
        datas[i].oppLink = "/lightning/r/Opportunity/" + datas[i].Id + "/view";
      }
      if (datas[i].hasOwnProperty("AccountId")) {
        datas[i].accLink =
          "/lightning/r/Account/" + datas[i].AccountId + "/view";
      }
      if (datas[i].hasOwnProperty("EventEdition__c")) {
        datas[i].eventLink =
          "/lightning/r/EventEdition__c/" + datas[i].EventEdition__c + "/view";
      }
      if (datas[i].hasOwnProperty("Event_Series__c")) {
        datas[i].eventSeries =
          "/lightning/r/Event_Series__c/" + datas[i].Event_Series__c + "/view";
      }
    }
    // eslint-disable-next-line no-console
    console.log("datas setParentFieldValue" + JSON.stringify(datas));
    this.tableData = datas;
  }

  setParentFieldColumn(columnObj, columnList, datas) {
    columnObj = JSON.parse(JSON.stringify(columnObj));
    columnList = JSON.parse(JSON.stringify(columnList));

    //console.log(columnObj);
    if (columnList.indexOf(".") > 0) {
      let col = columnList.split(",");
      for (let i = 0; i < col.length; i++) {
        let test = col[i].split(".");
        let label = this.fieldsLabel.split(",")[i];
        if (col[i].indexOf(".") > 0 && test.length === 2) {
          columnObj.splice(i, 0, { fieldName: col[i], label: label });
        }
        if (col[i].indexOf(".") > 0 && test.length === 3) {
          columnObj.splice(i, 0, { fieldName: col[i], label: label });
        }
      }
    }

    for (let i = 0; i < columnObj.length; i++) {
      //format date field
      if (
        columnObj[i].type === "textarea" ||
        columnObj[i].type === "button-icon" ||
        columnObj[i].type === "multipicklist"
      ) {
        columnObj[i].sortable = false;
      } else {
        columnObj[i].sortable = true;
      }

      if (columnObj[i].type === "datetime") {
        columnObj[i].type = "date";
        columnObj[i].typeAttributes = {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true
        };
      }
      //format date field
      if (columnObj[i].type === "date") {
        columnObj[i].typeAttributes = {
          day: "numeric",
          month: "short",
          year: "numeric"
        };
      }

      if (columnObj[i].type === "currency") {
        columnObj[i].cellAttributes = { alignment: "left" };
      }
      if (
        columnObj[i].fieldName !== undefined &&
        columnObj[i].fieldName.toLowerCase().indexOf("name") >= 0
      ) {
        if (columnObj[i].fieldName.toLowerCase() !== "stagename") {
          columnObj[i].type = "url";
          columnObj[i].typeAttributes = {
            label: { fieldName: columnObj[i].fieldName },
            tooltip: "Open in new tab",
            target: "_blank"
          };
          columnObj[i].fieldName = columnObj[i].fieldName + "Link";
        }
      }
    }

    // eslint-disable-next-line no-console
    console.log(columnObj);
    this.tableColumn = columnObj;
    this.setParentFieldValue(datas);
  }

  // Table pagination, sorting and page size change actions Start
  getNextData() {
    //Table Action 1
    if (this.lastind >= this.totalRows) {
      return;
    }
    //this.spinner = true;
    window.clearTimeout(this.delayTimeout);
    const nextPage = this.currentPageNo + 1;
    const offset = nextPage * this.pagesize - this.pagesize;
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    this.delayTimeout = setTimeout(() => {
      this.offst = offset;
      this.currentPageNo = nextPage;
      this.hasNext = true;
      this.hasPrev = false;
      this.highLightNumber(nextPage);
      this.getData();
    }, DELAY);
  }

  getPrevData() {
    //Table Action 2
    if (this.currentPageNo === 1) {
      return;
    }
    //this.spinner = true;
    window.clearTimeout(this.delayTimeout);
    const prevPage = this.currentPageNo - 1;
    const offset = prevPage * this.pagesize - this.pagesize;
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    this.delayTimeout = setTimeout(() => {
      this.offst = offset;
      this.currentPageNo = prevPage;
      this.hasNext = false;
      this.hasPrev = true;
      this.highLightNumber(prevPage);
      this.getData();
    }, DELAY);
  }
  onPageSizeChange(event) {
    //this.spinner = true;
    window.clearTimeout(this.delayTimeout);

    // eslint-disable-next-line @lwc/lwc/no-async-operation
    this.delayTimeout = setTimeout(() => {
      this.offst = 0;
      this.currentPageNo = 1;
      this.hasNext = false;
      this.hasPrev = false;
      this.pagesize = parseInt(event.detail.value, 10);
      this.highLightNumber(1);
      this.getData();
    }, DELAY);
  }
  searchData() {
    //this.spinner = true;
    let searchValue = this.template.querySelector(".search-box").value;
    searchValue = searchValue.trim();
    window.clearTimeout(this.delayTimeout);
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    this.delayTimeout = setTimeout(() => {
      this.offst = 0;
      this.currentPageNo = 1;
      this.hasNext = false;
      this.hasPrev = false;
      this.searchValue = searchValue;
      // eslint-disable-next-line no-console
      console.log(this.searchValue);
      this.highLightNumber(1);
      this.getData();
    }, DELAY);
  }

  /**
   * Fire whenever user type in search box, but data load if search field empty      *
   */
  reloadData() {
    let searchValue = this.template.querySelector(".search-box").value;
    searchValue = searchValue.trim();
    if (searchValue === "") {
      window.clearTimeout(this.delayTimeout);
      // eslint-disable-next-line @lwc/lwc/no-async-operation
      this.delayTimeout = setTimeout(() => {
        this.offst = 0;
        this.currentPageNo = 1;
        this.hasNext = false;
        this.hasPrev = false;
        this.searchValue = "";
        this.highLightNumber(1);
        this.getData();
      }, DELAY);
    }
  }

  handleSorting(event) {
    let prevSortDir = this.sortDirection;
    let prevSortedBy = this.sortByName;
    const newSortedBy = event.currentTarget.id.split("-")[0];
    let iconName = "utility:arrowup";
    let sortFieldName = newSortedBy;

    this.sortByFieldName = sortFieldName;
    if (
      sortFieldName.toLowerCase().indexOf("namelink") >= 0 ||
      sortFieldName.toLowerCase().indexOf("name__clink") >= 0
    ) {
      const n = sortFieldName.lastIndexOf("Link");
      sortFieldName =
        sortFieldName.slice(0, n) +
        sortFieldName
          .slice(n)
          .replace("Link", "")
          .trim();
    }

    this.sortByName = sortFieldName;

    if (sortFieldName === prevSortedBy && prevSortDir === "asc") {
      this.sortDirection = "desc";
      this.sortType = "desc";
      iconName = "utility:arrowdown";
    } else if (sortFieldName === prevSortedBy && prevSortDir === "desc") {
      this.sortDirection = "asc";
      this.sortType = "asc";
      iconName = "utility:arrowup";
    } else if (sortFieldName !== prevSortedBy) {
      this.sortDirection = "asc";
      this.sortType = "asc";
      iconName = "utility:arrowup";
    }

    window.clearTimeout(this.delayTimeout);
    //add class to th element "slds-has-focus"
    this.resetColumnClass();

    const ele = event.currentTarget;
    window
      .jQuery(ele)
      .parent()
      .addClass("slds-has-focus");
    event.currentTarget.querySelector("lightning-icon").iconName = iconName;

    // eslint-disable-next-line @lwc/lwc/no-async-operation
    this.delayTimeout = setTimeout(() => {
      this.currentPageNo = 1;
      this.offst = 0;
      this.hasNext = false;
      this.hasPrev = false;

      this.highLightNumber(1);
      this.getData();
    }, DELAY);
  }
  resetColumnClass() {
    const els = this.template.querySelectorAll(".slds-is-sortable");
    els.forEach(item => {
      window.jQuery(item).removeClass("slds-has-focus");
      item.querySelector("lightning-icon").iconName = "utility:arrowup";
      item.querySelector("lightning-icon").style = "fill:rgb(0, 112, 210)";
    });
  }

  processMe(event) {
    window.clearTimeout(this.delayTimeout);
    let currentPageNumber = this.currentPageNo;
    let selectedPage = parseInt(event.target.name, 10);
    let pagesize = this.pagesize;
    let next = selectedPage < currentPageNumber ? false : true;
    let prev = selectedPage < currentPageNumber ? true : false;
    const offset = selectedPage * pagesize - pagesize;

    // eslint-disable-next-line @lwc/lwc/no-async-operation
    this.delayTimeout = setTimeout(() => {
      this.offst = offset;
      this.currentPageNo = selectedPage;
      this.hasNext = next;
      this.hasPrev = prev;
      this.highLightNumber(selectedPage);
      this.getData();
    }, DELAY);
  }

  highLightNumber(pageNumber) {
    //Util method 1
    //reset
    try {
      this.pageList.forEach(element => {
        if (
          this.template.querySelector('span[id*="' + element + '-"]') !==
            null &&
          this.template.querySelector('span[id*="' + element + '-"]')
            .firstChild !== null
        ) {
          this.template
            .querySelector('span[id*="' + element + '-"]')
            .firstChild.classList.remove("selected");
        }
      });
      if (
        this.template.querySelector('span[id*="' + pageNumber + '-"]') !==
          null &&
        this.template.querySelector('span[id*="' + pageNumber + '-"]')
          .firstChild !== null
      ) {
        this.template
          .querySelector('span[id*="' + pageNumber + '-"]')
          .firstChild.classList.add("selected");
      }

      if (pageNumber === 1) {
        if (
          this.template.querySelector(".prev-btn") !== null &&
          this.template.querySelector(".prev-btn").firstChild !== null
        ) {
          this.template
            .querySelector(".prev-btn")
            .firstChild.setAttribute("disabled", true);
        }
      }
      if (pageNumber >= this.totalPage) {
        if (
          this.template.querySelector(".next-btn") !== null &&
          this.template.querySelector(".next-btn").firstChild !== null
        ) {
          this.template
            .querySelector(".next-btn")
            .firstChild.setAttribute("disabled", true);
        }
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }

  generatePageListUtil() {
    // Util Method 2
    const pageNumber = this.currentPageNo;
    const pageList = [];
    const totalPages = this.totalPage;

    if (totalPages > 1) {
      if (totalPages <= 10) {
        for (let counter = 2; counter < totalPages; counter++) {
          pageList.push(counter);
        }
      } else {
        if (pageNumber < 5) {
          pageList.push(2, 3, 4, 5, 6);
        } else {
          if (pageNumber > totalPages - 5) {
            pageList.push(
              totalPages - 5,
              totalPages - 4,
              totalPages - 3,
              totalPages - 2,
              totalPages - 1
            );
          } else {
            pageList.push(
              pageNumber - 2,
              pageNumber - 1,
              pageNumber,
              pageNumber + 1,
              pageNumber + 2
            );
          }
        }
      }
    }
    this.pageList = pageList;
  }
  // get ownerOptions() {
  //   return [
  //     { label: "My " + this.objectLabel, value: userId },
  //     { label: "All " + this.objectLabel, value: "" }
  //   ];
  // }
  get pagesizeList() {
    return [
      { label: "5", value: "5" },
      { label: "10", value: "10" },
      { label: "15", value: "15" },
      { label: "20", value: "20" },
      { label: "30", value: "30" },
      { label: "50", value: "50" }
    ];
  }
  get firstActiveClass() {
    return this.currentPageNo === 1 ? "selected" : "";
  }
  get lastActiveClass() {
    return this.currentPageNo === this.totalPage ? "selected" : "";
  }

  setFilterOptions(filterNum, fieldName) {
    getAggregateData({
      condition: this.tempCondition,
      objectName: this.objectName,
      fieldName: fieldName
    })
      .then(result => {
        let f = fieldName.split(".");
        if (f.length === 1) {
          f = fieldName;
        }
        if (f.length === 2) {
          f = f[1];
        }
        if (f.length === 3) {
          f = f[2];
        }

        let obj = JSON.parse(JSON.stringify(result));
        let opt = [];

        for (let i = 0; i < obj.length; i++) {
          if (obj[i][f] === undefined) {
            opt.push({
              label: "N/A (" + obj[i].expr0 + ")",
              value: "NULL",
              isChecked: false
            });
          } else {
            opt.push({
              label: obj[i][f] + " (" + obj[i].expr0 + ")",
              value: obj[i][f],
              isChecked: false
            });
          }
        }
        if (filterNum === 1) {
          opt.splice(0, 0, {
            label: "All " + this.filterLabel,
            value: "",
            isChecked: true
          });
          this.filterFieldOptions = opt;
        }
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error(error);
        handleErrors(this, error);
      });
  }

  buildCondition() {
    let condition;
    if (this.toggleDelegateOpp){
        condition = this.conditionDelegate;
    }
    else{
        condition = this.condition;
    }
    if (
      this.template.querySelector(".filter1") !== undefined &&
      this.template.querySelector(".filter1") !== null
    ) {
      this.filterFieldValue = this.template.querySelector(".filter1").value;
    }
    const selectedValue1 = this.filterFieldValue ? this.filterFieldValue : "";
    let customCond = "";

    if (selectedValue1 !== "") {
      customCond =
        customCond +
        " AND (" +
        this.filterField +
        " IN ('" +
        selectedValue1 +
        "')) ";
    }

    customCond = customCond.replace(/NULL/g, "");
    return condition+customCond;
  }

  get showNewButton() {
    return this.isSupportNewRecord === "true" ? true : false;
  }
  openFile(parentId) {
    if (parentId) {
      this.spinner = true;
      getFileDetail({
        objectName: "Attachment",
        fields: "Id",
        parentId: parentId
      })
        .then(result => {
          this.spinner = false;
          if (Array.isArray(result) && result.length > 0) {
            let win = window.open(
              "https://" +
                window.location.host +
                "/servlet/servlet.FileDownload?file=" +
                result[0].Id,
              "_blank"
            );
            win.focus();
          } else {
            showToast(this, "No file found", "error", "Error");
          }
        })
        .catch(error => {
          this.spinner = false;
          // eslint-disable-next-line no-console
          console.error("error opne file" + error);
          handleErrors(this, error);
        });
    }
  }

  onRowClick(event) {
    let index = event.target.name;
    let title = event.target.title;
    this.clickedOpportunity = this.tableData[index];
    
    if (title === "View Change Request") {
      try {
        if (event.target.iconName === "utility:open_folder") {
          event.target.iconName = "utility:opened_folder";
        } else {
          event.target.iconName = "utility:open_folder";
        }
        const ele = this.template.querySelector("[id^="+event.target.value+"-]");
        window.jQuery(ele).css({
          width: window
            .jQuery(ele)
            .parent()
            .width()
        });
        window
          .jQuery(ele)
          .find("td")
          .css({
            width: window
              .jQuery(ele)
              .parent()
              .width()
          });
        window.jQuery(ele).slideToggle();
      } catch (e) {
        console.error(e);
      }
    } else if (title === "Approve") {
      this.modalContainerClass = "slds-modal__content slds-p-around_medium ";
      this.buttonName = "Approve";
      this.modalMessage =
        "Are you sure you want to approve the Amended Opportunity?";
      this.showModal = true;
    } else if (title === "Reject") {
      this.modalContainerClass =
        "slds-modal__content slds-p-around_medium modal-height";
      this.buttonName = "Reject";
      this.modalMessage = undefined;
      this.showModal = true;
    }
  }
  closeModal() {
    this.showModal = false;
    this.showSSCNote = false;
  }
  modalButtonClick(event) {
    let action = event.target.label;
    if (action === "Approve") {
      this.spinner = true;
      this.onApproveReject(this.clickedOpportunity.Id, action);
      this.showModal = false;
    }
    if (action === "Reject") {
      let textArea = this.template.querySelectorAll("lightning-textarea");
      let requiredArea;
      for (let i = 0; i < textArea.length; i++) {
        if(this.sscRequired){
           if (textArea[i].name === "sscnotesrequired")
              this.sscNoteValue = textArea[i].value !==undefined? textArea[i].value: "";
              requiredArea=textArea[i];
        }
        else{
          if (textArea[i].name === "sscnotes")
            this.sscNoteValue = textArea[i].value !==undefined? textArea[i].value: "";
          }
        }
      if (this.sscRequired && this.sscNoteValue === "") {
        requiredArea.reportValidity();
        this.textAreaValidity = "This field is required.";
      } else {
        
        this.spinner = true;
        this.onApproveReject(this.clickedOpportunity.Id, action);
        this.showModal = false;
      }
    }
  }
  onApproveReject(oppId, action) {
    approveRejectAmmendedOpportunit({
      sOppId: oppId,
      sAction: action,
      sSSCNotes: this.sscNoteValue
    })
      .then(result => {
        if (result) {
          if (action === "Approve") {
            this.spinner = false;
            let primaryQuote = result;
            window.open("/apex/c__CompleteAmend?qId=" + primaryQuote, "_self");
          }
          if (action === "Reject") {
            this.getData();
          }
          this.sscRequired=false;
          this.showSSCNote=false;
        }
      })
      .catch(error => {
        this.showModal = false;
        if (error.body.message.includes("Id not specified in an update")) {
          showToast(
            this,
            "Change request does no exist for this opportunity",
            "error",
            "Error"
          );
        }
        //handleErrors(this, error);
        this.spinner = false;
      });
  }
  retrievePickListValuesIntoList() {
    getPickListValuesIntoList()
      .then(result => {
        if (result) {
          for (let i = 0; i < result.length; i++) {
            let obj = {
              label: result[i],
              value: result[i]
            };
            this.rejectResponseOptions.push(obj);
          }
        }
      })
      .catch(error => {
        handleErrors(this, error);
      });
  }
  onReasonChange(event) {
    if(event.detail.value!=='None'){
    this.showSSCNote = true;
    if (
      event.detail.value ===
      "Other - Comment box will be provided for further explanation"
    ) {
      this.sscRequired = true;
    } else {
      this.sscRequired = false;
    }
  }
  else{
    this.showSSCNote = false;
    this.sscRequired=false;
  }
}

 /**
     * This action fire when apply Delegate opportunity filter on table. this method get condition of Delegate opportunity filter and append in current condition
     */
  handleDelegateOppButtonClick(event){     
    this.toggleDelegateOpp = event.target.checked; 
    let condition = this.buildCondition();
    if(this.toggleDelegateOpp){
        condition = this.conditionDelegate;
    }
    else{
        condition = this.startCondition;
    }
    
    window.clearTimeout(this.delayTimeout);
    
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    this.delayTimeout = setTimeout(()=>{
        this.offst = 0;
        this.currentPageNo = 1;
        this.hasNext = false;
        this.hasPrev = false;
        this.tempCondition = condition;
        this.getData();
    },DELAY)
}
}