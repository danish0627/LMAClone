import { LightningElement,wire, api, track } from 'lwc';
import getRecord from '@salesforce/apex/CommonTableController.getRecordDetail';
import getProductBrasilCondition from '@salesforce/apex/SSCDashboardLtngCtrl.getProductBrasilCondition';
import { refreshApex } from '@salesforce/apex';
import getQLRecordsForBrazilTab from '@salesforce/apex/CommonTableController.getQLRecordsForBrazilTab';
const columns = [
    { label: 'Product Name', fieldName: 'prodName', type: 'url', typeAttributes: { label: { fieldName: 'SBQQ__Product__r.Name' }, target: '_blank' }, sortable: true },
    { label: 'Quantity', fieldName: 'SBQQ__Quantity__c', type: 'text', sortable: true },
    { label: 'Start Date', fieldName: 'Start_Date__c', type: 'date-local', sortable: true, editable: true, typeAttributes: { day: 'numeric', month: 'numeric', year: "numeric" } },
    { label: 'End Date', fieldName: 'End_Date__c', type: 'date-local', sortable: true, editable: true, typeAttributes: { day: 'numeric', month: 'numeric', year: 'numeric' } },
    { label: 'Net Unit Price', fieldName: 'SBQQ__NetPrice__c', type: 'text', sortable: true },
    { label: 'Sap Material Code', fieldName: 'SapCode', type: 'text',typeAttributes: { label: { fieldName: 'SBQQ__Product__r.SAP_Material_Code__c' } },sortable: true},
    { label: 'Sap Material Code Type', fieldName: 'SapCodeType', type: 'text',typeAttributes: { label: { fieldName: 'SBQQ__Product__r.SAP_Material_Code_Type__c' } },sortable: true},
    { label: 'Net Total', fieldName: 'SBQQ__NetTotal__c', type: 'text', sortable: true, cellAttributes:{ alignment: 'left' } },
];

export default class CommonDataTableBrazil extends LightningElement {
    @api recordId;
    @track sapMatCodeType;
    @track tableData = [];
    @track tableData1 = [];
    @track array =[
        {'label':'5','value':5},
        {'label':'10','value':10},
        {'label':'15','value':15},
        {'label':'20','value':20},
        {'label':'30','value':30},
        {'label':'50','value':50}
    ];
    columns=columns;
    @track finalTableData = [];
    @track finalTableData1 = [];
    @track finalTableData2 = [];
    @track finalTableData3 = [];
    @track finalTableData4 = [];
    @track finalTableData5 = [];
    @track finalTableData6 = [];
    @track finalTableData6 = [];
    @track finalTableData7 = [];
    @track finalTableData8 = []; 
    @track finalTableData9 = [];
    @track finalTableData10 = [];
    @track finalTableData11 = [];
    @track finalTableData12 = [];
    @track finalTableData13 = [];
    @track finalTableData14 = [];
    @track finalTableData15 = [];
    @track finalTableData16 = [];
    @track finalTableData17 = [];
    @track finalTableData18 = [];
    @track finalTableData19 = [];
    @track finalTableData20 = [];
    @track finalTableData21 = [];
    @track finalTableData22 = [];
    @track finalTableData23 = [];
    @track finalTableData24 = [];
    @track finalTableData25 = [];
    draftValues = [];
    @track shoWAct = true;
    @track totalAmount;
    @track totalAmount1
    @track totalAmount2
    @track totalAmount3
    @track totalAmount4
    @track totalAmount5
    @track totalAmount5
    @track totalAmount6
    @track totalAmount7
    @track totalAmount8
    @track totalAmount9
    @track totalAmount10
    @track totalAmount11
    @track totalAmount12
    @track totalAmount13
    @track totalAmount14
    @track totalAmount15
    @track totalAmount16
    @track totalAmount17
    @track totalAmount18
    @track totalAmount19
    @track totalAmount20
    @track totalAmount21
    @track totalAmount22
    @track totalAmount23
    @track totalAmount24
    @track totalAmount25
    @track isoCode;
    @track isEight;
    // pagination item list like (1..2-3-4-5..6)    
    @track page = 1;
    @track page1 = 1;
    @track page2 = 1;
    @track page3 = 1;
    @track page4 = 1;
    @track page5 = 1;
    @track page6 = 1;
    @track page7 = 1;
    @track page8 = 1;
    @track page9 = 1;
    @track page10 = 1;
    @track page11 = 1;
    @track page12 = 1;
    @track page13 = 1;
    @track page14 = 1;
    @track page15 = 1;
    @track page16 = 1;
    @track page17 = 1;
    @track page18 = 1;
    @track page19 = 1;
    @track page20 = 1;
    @track page21 = 1;
    @track page22 = 1;
    @track page23 = 1;
    @track page24 = 1;
    @track page25 = 1;
    @track startingRecord = 1;
    @track startingRecord1 = 1;
    @track startingRecord2 = 1;
    @track startingRecord3 = 1;
    @track startingRecord4 = 1;
    @track startingRecord5 = 1;
    @track startingRecord6 = 1;
    @track startingRecord7 = 1;
    @track startingRecord8 = 1;
    @track startingRecord9 = 1;
    @track startingRecord10 = 1;
    @track startingRecord11 = 1;
    @track startingRecord12 = 1;
    @track startingRecord13 = 1;
    @track startingRecord14 = 1;
    @track startingRecord15 = 1;
    @track startingRecord16 = 1;
    @track startingRecord17 = 1;
    @track startingRecord18 = 1;
    @track startingRecord19 = 1;
    @track startingRecord20 = 1;
    @track startingRecord21 = 1;
    @track startingRecord22 = 1;
    @track startingRecord23 = 1;
    @track startingRecord24 = 1;
    @track startingRecord25 = 1;
    @track endingRecord = 0;
    @track endingRecord1 = 0;
    @track endingRecord2 = 0;
    @track endingRecord3 = 0;
    @track endingRecord4 = 0;
    @track endingRecord5 = 0;
    @track endingRecord6 = 0;
    @track endingRecord7 = 0;
    @track endingRecord8 = 0;
    @track endingRecord9 = 0;
    @track endingRecord10 = 0;
    @track endingRecord11 = 0;
    @track endingRecord12 = 0;
    @track endingRecord13 = 0;
    @track endingRecord14 = 0;
    @track endingRecord15 = 0;
    @track endingRecord16 = 0;
    @track endingRecord17 = 0;
    @track endingRecord18 = 0;
    @track endingRecord19 = 0;
    @track endingRecord20 = 0;
    @track endingRecord21 = 0;
    @track endingRecord22 = 0;
    @track endingRecord23 = 0;
    @track endingRecord24 = 0;
    @track endingRecord25 = 0;
    @track pageSize = 10;
    @track pageSize1 = 10;
    @track pageSize2 = 10;
    @track pageSize3 = 10;
    @track pageSize4 = 10;
    @track pageSize5 = 10;
    @track pageSize6 = 10;
    @track pageSize7 = 10;
    @track pageSize8 = 10;
    @track pageSize9 = 10;
    @track pageSize10 = 10;
    @track pageSize11 = 10;
    @track pageSize12 = 10;
    @track pageSize13 = 10;
    @track pageSize14 = 10;
    @track pageSize15 = 10;
    @track pageSize16 = 10;
    @track pageSize17 = 10;
    @track pageSize18 = 10;
    @track pageSize19 = 10;
    @track pageSize20 = 10;
    @track pageSize21 = 10;
    @track pageSize22 = 10;
    @track pageSize23 = 10;
    @track pageSize24 = 10;
    @track pageSize25 = 10;
    @track totalRecountCount = 0;
    @track totalRecountCount1 = 0;
    @track totalRecountCount2 = 0;
    @track totalRecountCount3 = 0;
    @track totalRecountCount4 = 0;
    @track totalRecountCount5 = 0;
    @track totalRecountCount6 = 0;
    @track totalRecountCount7 = 0;
    @track totalRecountCount8 = 0;
    @track totalRecountCount9 = 0;
    @track totalRecountCount10 = 0;
    @track totalRecountCount11 = 0;
    @track totalRecountCount12 = 0;
    @track totalRecountCount13 = 0;
    @track totalRecountCount14 = 0;
    @track totalRecountCount15 = 0;
    @track totalRecountCount16 = 0;
    @track totalRecountCount17 = 0;
    @track totalRecountCount18 = 0;
    @track totalRecountCount19 = 0;
    @track totalRecountCount20 = 0;
    @track totalRecountCount21 = 0;
    @track totalRecountCount22 = 0;
    @track totalRecountCount23 = 0;
    @track totalRecountCount24 = 0;
    @track totalRecountCount25 = 0;
    @track totalPage = 0;
    @track totalPage1 = 0;
    @track totalPage2 = 0;
    @track totalPage3 = 0;
    @track totalPage4 = 0;
    @track totalPage5 = 0;
    @track totalPage6 = 0;
    @track totalPage7 = 0;
    @track totalPage8 = 0;
    @track totalPage9 = 0;
    @track totalPage10 = 0;
    @track totalPage11 = 0;
    @track totalPage12 = 0;
    @track totalPage13 = 0;
    @track totalPage14 = 0;
    @track totalPage15 = 0;
    @track totalPage16 = 0;
    @track totalPage17 = 0;
    @track totalPage18 = 0;
    @track totalPage19 = 0;
    @track totalPage20 = 0;
    @track totalPage21 = 0;
    @track totalPage22 = 0;
    @track totalPage23 = 0;
    @track totalPage24 = 0;
    @track totalPage25 = 0;
     @track pagesizeToVisible=10;
    @track pagesizeToVisible1=10;
    @track pagesizeToVisible2=10;
    @track pagesizeToVisible3=10;
    @track pagesizeToVisible4=10;
    @track pagesizeToVisible5=10;
    @track pagesizeToVisible6=10;
    @track pagesizeToVisible7=10;
    @track pagesizeToVisible8=10;
    @track pagesizeToVisible9=10;
    @track pagesizeToVisible10=10;
    @track pagesizeToVisible11=10;
    @track pagesizeToVisible12=10;
    @track pagesizeToVisible13=10;
    @track pagesizeToVisible14=10;
    @track pagesizeToVisible15=10;
    @track pagesizeToVisible16=10;
    @track pagesizeToVisible17=10;
    @track pagesizeToVisible18=10;
    @track pagesizeToVisible19=10;
    @track pagesizeToVisible20=10;
    @track pagesizeToVisible21=10;
    @track pagesizeToVisible22=10;
    @track pagesizeToVisible23=10;
    @track pagesizeToVisible24=10;
    @track pagesizeToVisible25=10;
    @track searchKey = ''; 
    @track searchKey1 = ''; 
    @track searchKey2 = ''; 
    @track searchKey3 = ''; 
    @track searchKey4 = ''; 
    @track searchKey5 = ''; 
    @track searchKey6 = ''; 
    @track searchKey7 = ''; 
    @track searchKey8 = ''; 
    @track searchKey9 = ''; 
    @track searchKey10 = ''; 
    @track searchKey11 = ''; 
    @track searchKey12 = ''; 
    @track searchKey13 = ''; 
    @track searchKey14 = ''; 
    @track searchKey15 = ''; 
    @track searchKey16 = ''; 
    @track searchKey17 = ''; 
    @track searchKey18 = ''; 
    @track searchKey19 = ''; 
    @track searchKey20 = ''; 
    @track searchKey21 = ''; 
    @track searchKey22 = ''; 
    @track searchKey23 = ''; 
    @track searchKey24 = ''; 
    @track searchKey25 = ''; 
    @track isShowProductAgg_brasil;
    @track isShowProductAgg_brasil1;
    @track isShowProductAgg_brasil2;
    @track isShowProductAgg_brasil3;
    @track isShowProductAgg_brasil4;
    @track isShowProductAgg_brasil5;
    @track isShowProductAgg_brasil6;
    @track isShowProductAgg_brasil7;
    @track isShowProductAgg_brasil8;
    @track isShowProductAgg_brasil10;
    @track isShowProductAgg_brasil11;
    @track isShowProductAgg_brasil12;
    @track isShowProductAgg_brasil13;
    @track isShowProductAgg_brasil14;
    @track isShowProductAgg_brasil15;
    @track isShowProductAgg_brasil16;
    @track isShowProductAgg_brasil17;
    @track isShowProductAgg_brasil18;
    @track isShowProductAgg_brasil19;
    @track isShowProductAgg_brasil20;
    @track isShowProductAgg_brasil21;
    @track isShowProductAgg_brasil22;
    @track isShowProductAgg_brasil23;
    @track isShowProductAgg_brasil24;
    @track isShowProductAgg_brasil25;
    @track isShowProductAgg_brasil26;

    connectedCallback(){
        this.isShowProductHeader=false;  
        this.getProductHeaderRenderCondition();
        this.getisoCode();
    }
    getProductHeaderRenderCondition(){
        getProductBrasilCondition({oppId:this.recordId})
        .then(res=>{
            this.isShowProductHeader = res.isShowProductHeader;
            this.isShowProductAgg_brasil = res.isShowProductAgg_brasil;
            if(res.isShowProductAgg_brasil==true){
               this.sapMatCodeType="001";
               getQLRecordsForBrazilTab( { oppId: this.recordId,searchKey: this.searchKey,sapMatJs:this.sapMatCodeType})
               .then(data => {
                var amt = 0;
                data.forEach(currentItem => {
             if(currentItem.SBQQ__Product__r.SAP_Material_Code_Type__c=='001'){
                amt=amt+currentItem.SBQQ__NetTotal__c;  
             
                    } 
                });
                this.totalAmount1 = amt; 
                this.tableData = data.map(record => Object.assign({ "SBQQ__Product__r.Name": record.SBQQ__Product__r.Name, "prodName": '/' + record.SBQQ__Product__c},{ "SBQQ__Product__r.SAP_Material_Code_Type__c":record.SBQQ__Product__r.SAP_Material_Code_Type__c, "SapCodeType": ( record.SBQQ__Product__r.SAP_Material_Code_Type__c)},{ "SBQQ__Product__r.SAP_Material_Code__c":record.SBQQ__Product__r.SAP_Material_Code__c, "SapCode":  record.SBQQ__Product__r.SAP_Material_Code__c}, record)); 
                this.endingRecord = this.pageSize; 
                this.totalRecountCount = data.length;
                this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize);  
                this.finalTableData = this.tableData.slice(0, this.pageSize);
                this.endingRecord = this.pageSize;    
            })
            } 
            this.isShowProductAgg_brasil1 = res.isShowProductAgg_brasil1; 
            if(res.isShowProductAgg_brasil1==true){
              this.sapMatCodeType="002"; 
              getQLRecordsForBrazilTab({ oppId: this.recordId,searchKey: this.searchKey,sapMatJs:this.sapMatCodeType})
              .then(data => {
               var amt = 0;
               data.forEach(currentItem => {
                   if(currentItem.SBQQ__Product__r.SAP_Material_Code_Type__c=='002'){
                     amt=amt+currentItem.SBQQ__NetTotal__c; 
                   }
               });
               this.totalAmount2 = amt;
               this.tableData1 = data.map(record => Object.assign({ "SBQQ__Product__r.Name": record.SBQQ__Product__r.Name, "prodName": '/' + record.SBQQ__Product__c},{ "SBQQ__Product__r.SAP_Material_Code_Type__c":record.SBQQ__Product__r.SAP_Material_Code_Type__c, "SapCodeType": ( record.SBQQ__Product__r.SAP_Material_Code_Type__c)},{ "SBQQ__Product__r.SAP_Material_Code__c":record.SBQQ__Product__r.SAP_Material_Code__c, "SapCode":  record.SBQQ__Product__r.SAP_Material_Code__c}, record)); 
               this.totalRecountCount1 = data.length;
               this.totalPage1 = Math.ceil(this.totalRecountCount1 / this.pageSize1);  
               this.finalTableData1 = this.tableData1.slice(0, this.pageSize1);
               this.endingRecord1 = this.pageSize1;     
           })  }  
            this.isShowProductAgg_brasil2 = res.isShowProductAgg_brasil2; 
            if(res.isShowProductAgg_brasil2==true){
              this.sapMatCodeType="003"; 
              getQLRecordsForBrazilTab({ oppId: this.recordId,searchKey: this.searchKey,sapMatJs:this.sapMatCodeType})
              .then(data => {
               var amt = 0;
               data.forEach(currentItem => {
                   if(currentItem.SBQQ__Product__r.SAP_Material_Code_Type__c=='003'){
                     amt=amt+currentItem.SBQQ__NetTotal__c; 
                   }});
               this.totalAmount3 = amt;
               this.tableData2 = data.map(record => Object.assign({ "SBQQ__Product__r.Name": record.SBQQ__Product__r.Name, "prodName": '/' + record.SBQQ__Product__c},{ "SBQQ__Product__r.SAP_Material_Code_Type__c":record.SBQQ__Product__r.SAP_Material_Code_Type__c, "SapCodeType": ( record.SBQQ__Product__r.SAP_Material_Code_Type__c)},{ "SBQQ__Product__r.SAP_Material_Code__c":record.SBQQ__Product__r.SAP_Material_Code__c, "SapCode":  record.SBQQ__Product__r.SAP_Material_Code__c}, record)); 
               this.totalRecountCount2 = data.length;
               this.totalPage2 = Math.ceil(this.totalRecountCount2 / this.pageSize2);  
               this.finalTableData2 = this.tableData2.slice(0, this.pageSize2);
               this.endingRecord2 = this.pageSize2;     
           }) 
            }  
            this.isShowProductAgg_brasil3 = res.isShowProductAgg_brasil3; 
            if(res.isShowProductAgg_brasil3==true){
              this.sapMatCodeType="004"; 
              getQLRecordsForBrazilTab({ oppId: this.recordId,searchKey: this.searchKey,sapMatJs:this.sapMatCodeType})
              .then(data => {
               var amt = 0;
               data.forEach(currentItem => {
                   if(currentItem.SBQQ__Product__r.SAP_Material_Code_Type__c=='004'){
                     amt=amt+currentItem.SBQQ__NetTotal__c; 
                   }
               });
               this.totalAmount4 = amt;
               this.tableData3 = data.map(record => Object.assign({ "SBQQ__Product__r.Name": record.SBQQ__Product__r.Name, "prodName": '/' + record.SBQQ__Product__c},{ "SBQQ__Product__r.SAP_Material_Code_Type__c":record.SBQQ__Product__r.SAP_Material_Code_Type__c, "SapCodeType": ( record.SBQQ__Product__r.SAP_Material_Code_Type__c)},{ "SBQQ__Product__r.SAP_Material_Code__c":record.SBQQ__Product__r.SAP_Material_Code__c, "SapCode":  record.SBQQ__Product__r.SAP_Material_Code__c}, record)); 
               this.totalRecountCount3 = data.length;
               this.totalPage3 = Math.ceil(this.totalRecountCount3 / this.pageSize3);  
               this.finalTableData3 = this.tableData3.slice(0, this.pageSize3);
               this.endingRecord3 = this.pageSize3;     
           }) 
            } 
            this.isShowProductAgg_brasil4 = res.isShowProductAgg_brasil4; 
            if(res.isShowProductAgg_brasil4==true){
              this.sapMatCodeType="005"; 
              getQLRecordsForBrazilTab({ oppId: this.recordId,searchKey: this.searchKey,sapMatJs:this.sapMatCodeType})
              .then(data => {
               var amt = 0;
               data.forEach(currentItem => {
                   if(currentItem.SBQQ__Product__r.SAP_Material_Code_Type__c=='005'){
                     amt=amt+currentItem.SBQQ__NetTotal__c; 
                   }
               });
               this.totalAmount5 = amt;
               this.tableData4 = data.map(record => Object.assign({ "SBQQ__Product__r.Name": record.SBQQ__Product__r.Name, "prodName": '/' + record.SBQQ__Product__c},{ "SBQQ__Product__r.SAP_Material_Code_Type__c":record.SBQQ__Product__r.SAP_Material_Code_Type__c, "SapCodeType": ( record.SBQQ__Product__r.SAP_Material_Code_Type__c)},{ "SBQQ__Product__r.SAP_Material_Code__c":record.SBQQ__Product__r.SAP_Material_Code__c, "SapCode":  record.SBQQ__Product__r.SAP_Material_Code__c}, record)); 
               this.totalRecountCount4 = data.length;
               this.totalPage4 = Math.ceil(this.totalRecountCount4 / this.pageSize4);  
               this.finalTableData4 = this.tableData4.slice(0, this.pageSize4);
               this.endingRecord4 = this.pageSize4;     
           })  
            } 
            this.isShowProductAgg_brasil5 = res.isShowProductAgg_brasil5; 
            if(res.isShowProductAgg_brasil5==true){
              this.sapMatCodeType="006"; 
              getQLRecordsForBrazilTab({ oppId: this.recordId,searchKey: this.searchKey,sapMatJs:this.sapMatCodeType})
              .then(data => {
               var amt = 0;
               data.forEach(currentItem => {
                   if(currentItem.SBQQ__Product__r.SAP_Material_Code_Type__c=='006'){
                     amt=amt+currentItem.SBQQ__NetTotal__c; 
                   }
               });
               this.totalAmount6 = amt;
               this.tableData5 = data.map(record => Object.assign({ "SBQQ__Product__r.Name": record.SBQQ__Product__r.Name, "prodName": '/' + record.SBQQ__Product__c},{ "SBQQ__Product__r.SAP_Material_Code_Type__c":record.SBQQ__Product__r.SAP_Material_Code_Type__c, "SapCodeType": ( record.SBQQ__Product__r.SAP_Material_Code_Type__c)},{ "SBQQ__Product__r.SAP_Material_Code__c":record.SBQQ__Product__r.SAP_Material_Code__c, "SapCode":  record.SBQQ__Product__r.SAP_Material_Code__c}, record)); 
               this.totalRecountCount5 = data.length;
               this.totalPage5 = Math.ceil(this.totalRecountCount5 / this.pageSize5);  
               this.finalTableData5 = this.tableData5.slice(0, this.pageSize5);
               this.endingRecord5 = this.pageSize5;     
           }) 
            } 
            this.isShowProductAgg_brasil6 = res.isShowProductAgg_brasil6; 
            if(res.isShowProductAgg_brasil6==true){
              this.sapMatCodeType="007"; 
              getQLRecordsForBrazilTab({ oppId: this.recordId,searchKey: this.searchKey,sapMatJs:this.sapMatCodeType})
              .then(data => {
               var amt = 0;
               data.forEach(currentItem => {
                   if(currentItem.SBQQ__Product__r.SAP_Material_Code_Type__c=='007'){
                     amt=amt+currentItem.SBQQ__NetTotal__c; 
                   }
               });
               this.totalAmount7 = amt;
               this.tableData6 = data.map(record => Object.assign({ "SBQQ__Product__r.Name": record.SBQQ__Product__r.Name, "prodName": '/' + record.SBQQ__Product__c},{ "SBQQ__Product__r.SAP_Material_Code_Type__c":record.SBQQ__Product__r.SAP_Material_Code_Type__c, "SapCodeType": ( record.SBQQ__Product__r.SAP_Material_Code_Type__c)},{ "SBQQ__Product__r.SAP_Material_Code__c":record.SBQQ__Product__r.SAP_Material_Code__c, "SapCode":  record.SBQQ__Product__r.SAP_Material_Code__c}, record)); 
               this.totalRecountCount6 = data.length;
               this.totalPage6 = Math.ceil(this.totalRecountCount6 / this.pageSize6);  
               this.finalTableData6 = this.tableData6.slice(0, this.pageSize6);
               this.endingRecord6 = this.pageSize6;     
           }) 
            } 
            this.isShowProductAgg_brasil7 = res.isShowProductAgg_brasil7; 
            if(res.isShowProductAgg_brasil7==true){
              this.sapMatCodeType="008"; 
              getQLRecordsForBrazilTab({ oppId: this.recordId,searchKey: this.searchKey,sapMatJs:this.sapMatCodeType})
              .then(data => {
               var amt = 0;
               data.forEach(currentItem => {
                   if(currentItem.SBQQ__Product__r.SAP_Material_Code_Type__c=='008'){
                     amt=amt+currentItem.SBQQ__NetTotal__c; 
                   }
               });
               this.totalAmount8 = amt;
               this.tableData7 = data.map(record => Object.assign({ "SBQQ__Product__r.Name": record.SBQQ__Product__r.Name, "prodName": '/' + record.SBQQ__Product__c},{ "SBQQ__Product__r.SAP_Material_Code_Type__c":record.SBQQ__Product__r.SAP_Material_Code_Type__c, "SapCodeType": ( record.SBQQ__Product__r.SAP_Material_Code_Type__c)},{ "SBQQ__Product__r.SAP_Material_Code__c":record.SBQQ__Product__r.SAP_Material_Code__c, "SapCode":  record.SBQQ__Product__r.SAP_Material_Code__c}, record)); 
               this.totalRecountCount7 = data.length;
               this.totalPage7 = Math.ceil(this.totalRecountCount7 / this.pageSize7);  
               this.finalTableData7 = this.tableData7.slice(0, this.pageSize7);
               this.endingRecord7 = this.pageSize7;     
           }) 
            } 
            this.isShowProductAgg_brasil8 = res.isShowProductAgg_brasil8; 
            if(res.isShowProductAgg_brasil8==true){
              this.sapMatCodeType="009"; 
              getQLRecordsForBrazilTab({ oppId: this.recordId,searchKey: this.searchKey,sapMatJs:this.sapMatCodeType})
              .then(data => {
               var amt = 0;
               data.forEach(currentItem => {
                   if(currentItem.SBQQ__Product__r.SAP_Material_Code_Type__c=='009'){
                     amt=amt+currentItem.SBQQ__NetTotal__c; 
               
                   }
               });
               this.totalAmount9 = amt;
               this.tableData8 = data.map(record => Object.assign({ "SBQQ__Product__r.Name": record.SBQQ__Product__r.Name, "prodName": '/' + record.SBQQ__Product__c},{ "SBQQ__Product__r.SAP_Material_Code_Type__c":record.SBQQ__Product__r.SAP_Material_Code_Type__c, "SapCodeType": ( record.SBQQ__Product__r.SAP_Material_Code_Type__c)},{ "SBQQ__Product__r.SAP_Material_Code__c":record.SBQQ__Product__r.SAP_Material_Code__c, "SapCode":  record.SBQQ__Product__r.SAP_Material_Code__c}, record)); 
               this.totalRecountCount8 = data.length;
               this.totalPage8 = Math.ceil(this.totalRecountCount8 / this.pageSize8);  
               this.finalTableData8 = this.tableData8.slice(0, this.pageSize8);
               this.endingRecord8 = this.pageSize8;     
           }) } 
            this.isShowProductAgg_brasil9 = res.isShowProductAgg_brasil10; 
            if(res.isShowProductAgg_brasil10==true){
              this.sapMatCodeType="010"; 
              getQLRecordsForBrazilTab({ oppId: this.recordId,searchKey: this.searchKey,sapMatJs:this.sapMatCodeType})
              .then(data => {
               var amt = 0;
               data.forEach(currentItem => {
                   if(currentItem.SBQQ__Product__r.SAP_Material_Code_Type__c=='010'){
                     amt=amt+currentItem.SBQQ__NetTotal__c; 
                   } });
               this.totalAmount10 = amt;
               this.tableData9 = data.map(record => Object.assign({ "SBQQ__Product__r.Name": record.SBQQ__Product__r.Name, "prodName": '/' + record.SBQQ__Product__c},{ "SBQQ__Product__r.SAP_Material_Code_Type__c":record.SBQQ__Product__r.SAP_Material_Code_Type__c, "SapCodeType": ( record.SBQQ__Product__r.SAP_Material_Code_Type__c)},{ "SBQQ__Product__r.SAP_Material_Code__c":record.SBQQ__Product__r.SAP_Material_Code__c, "SapCode":  record.SBQQ__Product__r.SAP_Material_Code__c}, record)); 
               this.totalRecountCount9 = data.length;
               this.totalPage9 = Math.ceil(this.totalRecountCount9 / this.pageSize9);  
               this.finalTableData9 = this.tableData9.slice(0, this.pageSize9);
               this.endingRecord9 = this.pageSize9;     
           })  } 
            this.isShowProductAgg_brasil10 = res.isShowProductAgg_brasil11; 
            if(res.isShowProductAgg_brasil11==true){
              this.sapMatCodeType="011"; 
              getQLRecordsForBrazilTab({ oppId: this.recordId,searchKey: this.searchKey,sapMatJs:this.sapMatCodeType})
              .then(data => {
               var amt = 0;
               data.forEach(currentItem => {
                   if(currentItem.SBQQ__Product__r.SAP_Material_Code_Type__c=='011'){
                     amt=amt+currentItem.SBQQ__NetTotal__c; 
                   }});
               this.totalAmount11 = amt;
               this.tableData10 = data.map(record => Object.assign({ "SBQQ__Product__r.Name": record.SBQQ__Product__r.Name, "prodName": '/' + record.SBQQ__Product__c},{ "SBQQ__Product__r.SAP_Material_Code_Type__c":record.SBQQ__Product__r.SAP_Material_Code_Type__c, "SapCodeType": ( record.SBQQ__Product__r.SAP_Material_Code_Type__c)},{ "SBQQ__Product__r.SAP_Material_Code__c":record.SBQQ__Product__r.SAP_Material_Code__c, "SapCode":  record.SBQQ__Product__r.SAP_Material_Code__c}, record)); 
               this.totalRecountCount10 = data.length;
               this.totalPage10 = Math.ceil(this.totalRecountCount10 / this.pageSize10);  
               this.finalTableData10 = this.tableData10.slice(0, this.pageSize10);
               this.endingRecord10 = this.pageSize10;     
           }) } 
            this.isShowProductAgg_brasil11 = res.isShowProductAgg_brasil12; 
            if(res.isShowProductAgg_brasil12==true){
              this.sapMatCodeType="012"; 
              getQLRecordsForBrazilTab({ oppId: this.recordId,searchKey: this.searchKey,sapMatJs:this.sapMatCodeType})
              .then(data => {
               var amt = 0;
               data.forEach(currentItem => {
                   if(currentItem.SBQQ__Product__r.SAP_Material_Code_Type__c=='012'){
                     amt=amt+currentItem.SBQQ__NetTotal__c; 
                   }
               });
               this.totalAmount12 = amt;
               this.tableData11 = data.map(record => Object.assign({ "SBQQ__Product__r.Name": record.SBQQ__Product__r.Name, "prodName": '/' + record.SBQQ__Product__c},{ "SBQQ__Product__r.SAP_Material_Code_Type__c":record.SBQQ__Product__r.SAP_Material_Code_Type__c, "SapCodeType": ( record.SBQQ__Product__r.SAP_Material_Code_Type__c)},{ "SBQQ__Product__r.SAP_Material_Code__c":record.SBQQ__Product__r.SAP_Material_Code__c, "SapCode":  record.SBQQ__Product__r.SAP_Material_Code__c}, record)); 
               this.totalRecountCount11 = data.length;
               this.totalPage11 = Math.ceil(this.totalRecountCount11 / this.pageSize11);  
               this.finalTableData11 = this.tableData11.slice(0, this.pageSize11);
               this.endingRecord11 = this.pageSize11;     
           })  } 
            this.isShowProductAgg_brasil12 = res.isShowProductAgg_brasil13; 
            if(res.isShowProductAgg_brasil13==true){
              this.sapMatCodeType="013"; 
              getQLRecordsForBrazilTab({ oppId: this.recordId,searchKey: this.searchKey,sapMatJs:this.sapMatCodeType})
              .then(data => {
               var amt = 0;
               data.forEach(currentItem => {
                   if(currentItem.SBQQ__Product__r.SAP_Material_Code_Type__c=='013'){
                     amt=amt+currentItem.SBQQ__NetTotal__c; 
                   }});
               this.totalAmount13 = amt;
               this.tableData12 = data.map(record => Object.assign({ "SBQQ__Product__r.Name": record.SBQQ__Product__r.Name, "prodName": '/' + record.SBQQ__Product__c},{ "SBQQ__Product__r.SAP_Material_Code_Type__c":record.SBQQ__Product__r.SAP_Material_Code_Type__c, "SapCodeType": ( record.SBQQ__Product__r.SAP_Material_Code_Type__c)},{ "SBQQ__Product__r.SAP_Material_Code__c":record.SBQQ__Product__r.SAP_Material_Code__c, "SapCode":  record.SBQQ__Product__r.SAP_Material_Code__c}, record)); 
               this.totalRecountCount12 = data.length;
               this.totalPage12 = Math.ceil(this.totalRecountCount12 / this.pageSize12);  
               this.finalTableData12 = this.tableData12.slice(0, this.pageSize12);
               this.endingRecord12 = this.pageSize12;     
           })  } 
            this.isShowProductAgg_brasil13 = res.isShowProductAgg_brasil14; 
            if(res.isShowProductAgg_brasil14==true){
              this.sapMatCodeType="014"; 
              getQLRecordsForBrazilTab({ oppId: this.recordId,searchKey: this.searchKey,sapMatJs:this.sapMatCodeType})
              .then(data => {
               var amt = 0;
               data.forEach(currentItem => {
                   if(currentItem.SBQQ__Product__r.SAP_Material_Code_Type__c=='014'){
                     amt=amt+currentItem.SBQQ__NetTotal__c; 
                   } });
               this.totalAmount14 = amt;
               this.tableData13 = data.map(record => Object.assign({ "SBQQ__Product__r.Name": record.SBQQ__Product__r.Name, "prodName": '/' + record.SBQQ__Product__c},{ "SBQQ__Product__r.SAP_Material_Code_Type__c":record.SBQQ__Product__r.SAP_Material_Code_Type__c, "SapCodeType": ( record.SBQQ__Product__r.SAP_Material_Code_Type__c)},{ "SBQQ__Product__r.SAP_Material_Code__c":record.SBQQ__Product__r.SAP_Material_Code__c, "SapCode":  record.SBQQ__Product__r.SAP_Material_Code__c}, record)); 
               this.totalRecountCount13 = data.length;
               this.totalPage13 = Math.ceil(this.totalRecountCount13 / this.pageSize13);  
               this.finalTableData13 = this.tableData13.slice(0, this.pageSize13);
               this.endingRecord13 = this.pageSize13;     
           })   } 
            this.isShowProductAgg_brasil14 = res.isShowProductAgg_brasil15; 
            if(res.isShowProductAgg_brasil15==true){
              this.sapMatCodeType="015"; 
              getQLRecordsForBrazilTab({ oppId: this.recordId,searchKey: this.searchKey,sapMatJs:this.sapMatCodeType})
              .then(data => {
               var amt = 0;
               data.forEach(currentItem => {
                   if(currentItem.SBQQ__Product__r.SAP_Material_Code_Type__c=='015'){
                     amt=amt+currentItem.SBQQ__NetTotal__c; 
                   } });
               this.totalAmount15 = amt;
               this.tableData14 = data.map(record => Object.assign({ "SBQQ__Product__r.Name": record.SBQQ__Product__r.Name, "prodName": '/' + record.SBQQ__Product__c},{ "SBQQ__Product__r.SAP_Material_Code_Type__c":record.SBQQ__Product__r.SAP_Material_Code_Type__c, "SapCodeType": ( record.SBQQ__Product__r.SAP_Material_Code_Type__c)},{ "SBQQ__Product__r.SAP_Material_Code__c":record.SBQQ__Product__r.SAP_Material_Code__c, "SapCode":  record.SBQQ__Product__r.SAP_Material_Code__c}, record)); 
               this.totalRecountCount14 = data.length;
               this.totalPage14 = Math.ceil(this.totalRecountCount14 / this.pageSize14);  
               this.finalTableData14 = this.tableData14.slice(0, this.pageSize14);
               this.endingRecord14 = this.pageSize14;     
           })  } 
            this.isShowProductAgg_brasil15 = res.isShowProductAgg_brasil16; 
            if(res.isShowProductAgg_brasil16==true){
              this.sapMatCodeType="016"; 
              getQLRecordsForBrazilTab({ oppId: this.recordId,searchKey: this.searchKey,sapMatJs:this.sapMatCodeType})
              .then(data => {
               var amt = 0;
               data.forEach(currentItem => {
                   if(currentItem.SBQQ__Product__r.SAP_Material_Code_Type__c=='015'){
                     amt=amt+currentItem.SBQQ__NetTotal__c; 
                   }  });
               this.totalAmount16 = amt;
               this.tableData15 = data.map(record => Object.assign({ "SBQQ__Product__r.Name": record.SBQQ__Product__r.Name, "prodName": '/' + record.SBQQ__Product__c},{ "SBQQ__Product__r.SAP_Material_Code_Type__c":record.SBQQ__Product__r.SAP_Material_Code_Type__c, "SapCodeType": ( record.SBQQ__Product__r.SAP_Material_Code_Type__c)},{ "SBQQ__Product__r.SAP_Material_Code__c":record.SBQQ__Product__r.SAP_Material_Code__c, "SapCode":  record.SBQQ__Product__r.SAP_Material_Code__c}, record)); 
               this.totalRecountCount15 = data.length;
               this.totalPage15 = Math.ceil(this.totalRecountCount15 / this.pageSize15);  
               this.finalTableData15 = this.tableData15.slice(0, this.pageSize15);
               this.endingRecord15 = this.pageSize15;     
           })  } 
            this.isShowProductAgg_brasil16 = res.isShowProductAgg_brasil17; 
            if(res.isShowProductAgg_brasil17==true){
              this.sapMatCodeType="017"; 
              getQLRecordsForBrazilTab({ oppId: this.recordId,searchKey: this.searchKey,sapMatJs:this.sapMatCodeType})
              .then(data => {
               var amt = 0;
               data.forEach(currentItem => {
                   if(currentItem.SBQQ__Product__r.SAP_Material_Code_Type__c=='017'){
                     amt=amt+currentItem.SBQQ__NetTotal__c; 
                   }});
               this.totalAmount17 = amt;
               this.tableData16 = data.map(record => Object.assign({ "SBQQ__Product__r.Name": record.SBQQ__Product__r.Name, "prodName": '/' + record.SBQQ__Product__c},{ "SBQQ__Product__r.SAP_Material_Code_Type__c":record.SBQQ__Product__r.SAP_Material_Code_Type__c, "SapCodeType": ( record.SBQQ__Product__r.SAP_Material_Code_Type__c)},{ "SBQQ__Product__r.SAP_Material_Code__c":record.SBQQ__Product__r.SAP_Material_Code__c, "SapCode":  record.SBQQ__Product__r.SAP_Material_Code__c}, record)); 
               this.totalRecountCount16 = data.length;
               this.totalPage16 = Math.ceil(this.totalRecountCount16 / this.pageSize16);  
               this.finalTableData16 = this.tableData16.slice(0, this.pageSize16);
               this.endingRecord16 = this.pageSize16;     
           })  } 
            this.isShowProductAgg_brasil17 = res.isShowProductAgg_brasil18; 
            if(res.isShowProductAgg_brasil18==true){
              this.sapMatCodeType="018"; 
              getQLRecordsForBrazilTab({ oppId: this.recordId,searchKey: this.searchKey,sapMatJs:this.sapMatCodeType})
              .then(data => {
               var amt = 0;
               data.forEach(currentItem => {
                   if(currentItem.SBQQ__Product__r.SAP_Material_Code_Type__c=='018'){
                     amt=amt+currentItem.SBQQ__NetTotal__c; 
                   } });
               this.totalAmount18 = amt;
               this.tableData17 = data.map(record => Object.assign({ "SBQQ__Product__r.Name": record.SBQQ__Product__r.Name, "prodName": '/' + record.SBQQ__Product__c},{ "SBQQ__Product__r.SAP_Material_Code_Type__c":record.SBQQ__Product__r.SAP_Material_Code_Type__c, "SapCodeType": ( record.SBQQ__Product__r.SAP_Material_Code_Type__c)},{ "SBQQ__Product__r.SAP_Material_Code__c":record.SBQQ__Product__r.SAP_Material_Code__c, "SapCode":  record.SBQQ__Product__r.SAP_Material_Code__c}, record)); 
               this.totalRecountCount17 = data.length;
               this.totalPage17 = Math.ceil(this.totalRecountCount17 / this.pageSize17);  
               this.finalTableData17 = this.tableData17.slice(0, this.pageSize17);
               this.endingRecord17 = this.pageSize17;     
                })  } 
            this.isShowProductAgg_brasil18 = res.isShowProductAgg_brasil19; 
            if(res.isShowProductAgg_brasil19==true){
              this.sapMatCodeType="019"; 
              getQLRecordsForBrazilTab({ oppId: this.recordId,searchKey: this.searchKey,sapMatJs:this.sapMatCodeType})
              .then(data => {
               var amt = 0;
               data.forEach(currentItem => {
                   if(currentItem.SBQQ__Product__r.SAP_Material_Code_Type__c=='019'){
                     amt=amt+currentItem.SBQQ__NetTotal__c; 
                   } });
               this.totalAmount19 = amt;
               this.tableData18 = data.map(record => Object.assign({ "SBQQ__Product__r.Name": record.SBQQ__Product__r.Name, "prodName": '/' + record.SBQQ__Product__c},{ "SBQQ__Product__r.SAP_Material_Code_Type__c":record.SBQQ__Product__r.SAP_Material_Code_Type__c, "SapCodeType": ( record.SBQQ__Product__r.SAP_Material_Code_Type__c)},{ "SBQQ__Product__r.SAP_Material_Code__c":record.SBQQ__Product__r.SAP_Material_Code__c, "SapCode":  record.SBQQ__Product__r.SAP_Material_Code__c}, record)); 
               this.totalRecountCount18 = data.length;
               this.totalPage18 = Math.ceil(this.totalRecountCount18 / this.pageSize18);  
               this.finalTableData18 = this.tableData18.slice(0, this.pageSize18);
               this.endingRecord18 = this.pageSize18;     
           })  } 
            this.isShowProductAgg_brasil19 = res.isShowProductAgg_brasil20; 
            if(res.isShowProductAgg_brasil20==true){
              this.sapMatCodeType="020"; 
              getQLRecordsForBrazilTab({ oppId: this.recordId,searchKey: this.searchKey,sapMatJs:this.sapMatCodeType})
              .then(data => {
               var amt = 0;
               data.forEach(currentItem => {
                   if(currentItem.SBQQ__Product__r.SAP_Material_Code_Type__c=='020'){
                     amt=amt+currentItem.SBQQ__NetTotal__c; 
                   } });
               this.totalAmount20 = amt;
               this.tableData19 = data.map(record => Object.assign({ "SBQQ__Product__r.Name": record.SBQQ__Product__r.Name, "prodName": '/' + record.SBQQ__Product__c},{ "SBQQ__Product__r.SAP_Material_Code_Type__c":record.SBQQ__Product__r.SAP_Material_Code_Type__c, "SapCodeType": ( record.SBQQ__Product__r.SAP_Material_Code_Type__c)},{ "SBQQ__Product__r.SAP_Material_Code__c":record.SBQQ__Product__r.SAP_Material_Code__c, "SapCode":  record.SBQQ__Product__r.SAP_Material_Code__c}, record)); 
               this.totalRecountCount19 = data.length;
               this.totalPage19 = Math.ceil(this.totalRecountCount19 / this.pageSize19);  
               this.finalTableData19 = this.tableData19.slice(0, this.pageSize19);
               this.endingRecord19 = this.pageSize19;     
           })  } 
            this.isShowProductAgg_brasil20 = res.isShowProductAgg_brasil21; 
            if(res.isShowProductAgg_brasil21==true){
              this.sapMatCodeType="021"; 
              getQLRecordsForBrazilTab({ oppId: this.recordId,searchKey: this.searchKey,sapMatJs:this.sapMatCodeType})
              .then(data => {
               var amt = 0;
               data.forEach(currentItem => {
                   if(currentItem.SBQQ__Product__r.SAP_Material_Code_Type__c=='021'){
                     amt=amt+currentItem.SBQQ__NetTotal__c; 
                   } });
               this.totalAmount21 = amt;
               this.tableData20 = data.map(record => Object.assign({ "SBQQ__Product__r.Name": record.SBQQ__Product__r.Name, "prodName": '/' + record.SBQQ__Product__c},{ "SBQQ__Product__r.SAP_Material_Code_Type__c":record.SBQQ__Product__r.SAP_Material_Code_Type__c, "SapCodeType": ( record.SBQQ__Product__r.SAP_Material_Code_Type__c)},{ "SBQQ__Product__r.SAP_Material_Code__c":record.SBQQ__Product__r.SAP_Material_Code__c, "SapCode":  record.SBQQ__Product__r.SAP_Material_Code__c}, record)); 
               this.totalRecountCount20 = data.length;
               this.totalPage20 = Math.ceil(this.totalRecountCount20 / this.pageSize20);  
               this.finalTableData20 = this.tableData20.slice(0, this.pageSize20);
               this.endingRecord20 = this.pageSize20;     
           })  } 
            this.isShowProductAgg_brasil21 = res.isShowProductAgg_brasil22; 
            if(res.isShowProductAgg_brasil22==true){
              this.sapMatCodeType="022"; 
              getQLRecordsForBrazilTab({ oppId: this.recordId,searchKey: this.searchKey,sapMatJs:this.sapMatCodeType})
              .then(data => {
               var amt = 0;
               data.forEach(currentItem => {
                   if(currentItem.SBQQ__Product__r.SAP_Material_Code_Type__c=='022'){
                     amt=amt+currentItem.SBQQ__NetTotal__c; 
                   }  });
               this.totalAmount22 = amt;
               this.tableData21 = data.map(record => Object.assign({ "SBQQ__Product__r.Name": record.SBQQ__Product__r.Name, "prodName": '/' + record.SBQQ__Product__c},{ "SBQQ__Product__r.SAP_Material_Code_Type__c":record.SBQQ__Product__r.SAP_Material_Code_Type__c, "SapCodeType": ( record.SBQQ__Product__r.SAP_Material_Code_Type__c)},{ "SBQQ__Product__r.SAP_Material_Code__c":record.SBQQ__Product__r.SAP_Material_Code__c, "SapCode":  record.SBQQ__Product__r.SAP_Material_Code__c}, record)); 
               this.totalRecountCount21 = data.length;
               this.totalPage21 = Math.ceil(this.totalRecountCount21 / this.pageSize21);  
               this.finalTableData21 = this.tableData21.slice(0, this.pageSize21);
               this.endingRecord21 = this.pageSize21;     
           })   } 
            this.isShowProductAgg_brasil22 = res.isShowProductAgg_brasil23; 
            if(res.isShowProductAgg_brasil23==true){
              this.sapMatCodeType="023"; 
              getQLRecordsForBrazilTab({ oppId: this.recordId,searchKey: this.searchKey,sapMatJs:this.sapMatCodeType})
              .then(data => {
               var amt = 0;
               data.forEach(currentItem => {
                   if(currentItem.SBQQ__Product__r.SAP_Material_Code_Type__c=='023'){
                     amt=amt+currentItem.SBQQ__NetTotal__c; 
                   }});
               this.totalAmount23 = amt;
               this.tableData22 = data.map(record => Object.assign({ "SBQQ__Product__r.Name": record.SBQQ__Product__r.Name, "prodName": '/' + record.SBQQ__Product__c},{ "SBQQ__Product__r.SAP_Material_Code_Type__c":record.SBQQ__Product__r.SAP_Material_Code_Type__c, "SapCodeType": ( record.SBQQ__Product__r.SAP_Material_Code_Type__c)},{ "SBQQ__Product__r.SAP_Material_Code__c":record.SBQQ__Product__r.SAP_Material_Code__c, "SapCode":  record.SBQQ__Product__r.SAP_Material_Code__c}, record)); 
               this.totalRecountCount22 = data.length;
               this.totalPage22 = Math.ceil(this.totalRecountCount22 / this.pageSize22);  
               this.finalTableData22 = this.tableData22.slice(0, this.pageSize22);
               this.endingRecord22 = this.pageSize22;     
           })  } 
            this.isShowProductAgg_brasil23 = res.isShowProductAgg_brasil24; 
            if(res.isShowProductAgg_brasil24==true){
              this.sapMatCodeType="024"; 
              getQLRecordsForBrazilTab({ oppId: this.recordId,searchKey: this.searchKey,sapMatJs:this.sapMatCodeType})
              .then(data => {
               var amt = 0;
               data.forEach(currentItem => {
                   if(currentItem.SBQQ__Product__r.SAP_Material_Code_Type__c=='024'){
                     amt=amt+currentItem.SBQQ__NetTotal__c; 
                   }  });
               this.totalAmount24 = amt;
               this.tableData23 = data.map(record => Object.assign({ "SBQQ__Product__r.Name": record.SBQQ__Product__r.Name, "prodName": '/' + record.SBQQ__Product__c},{ "SBQQ__Product__r.SAP_Material_Code_Type__c":record.SBQQ__Product__r.SAP_Material_Code_Type__c, "SapCodeType": ( record.SBQQ__Product__r.SAP_Material_Code_Type__c)},{ "SBQQ__Product__r.SAP_Material_Code__c":record.SBQQ__Product__r.SAP_Material_Code__c, "SapCode":  record.SBQQ__Product__r.SAP_Material_Code__c}, record)); 
               this.totalRecountCount23 = data.length;
               this.totalPage23 = Math.ceil(this.totalRecountCount23 / this.pageSize23);  
               this.finalTableData23 = this.tableData23.slice(0, this.pageSize23);
               this.endingRecord23 = this.pageSize23;     
           })  } 
            this.isShowProductAgg_brasil24 = res.isShowProductAgg_brasil25; 
            if(res.isShowProductAgg_brasil25==true){
              this.sapMatCodeType="025"; 
              getQLRecordsForBrazilTab({ oppId: this.recordId,searchKey: this.searchKey,sapMatJs:this.sapMatCodeType})
              .then(data => {
               var amt = 0;
               data.forEach(currentItem => {
                   if(currentItem.SBQQ__Product__r.SAP_Material_Code_Type__c=='025'){
                     amt=amt+currentItem.SBQQ__NetTotal__c; 
                   }   });
               this.totalAmount25 = amt;
               this.tableData24 = data.map(record => Object.assign({ "SBQQ__Product__r.Name": record.SBQQ__Product__r.Name, "prodName": '/' + record.SBQQ__Product__c},{ "SBQQ__Product__r.SAP_Material_Code_Type__c":record.SBQQ__Product__r.SAP_Material_Code_Type__c, "SapCodeType": ( record.SBQQ__Product__r.SAP_Material_Code_Type__c)},{ "SBQQ__Product__r.SAP_Material_Code__c":record.SBQQ__Product__r.SAP_Material_Code__c, "SapCode":  record.SBQQ__Product__r.SAP_Material_Code__c}, record)); 
               this.totalRecountCount24 = data.length;
               this.totalPage24 = Math.ceil(this.totalRecountCount24 / this.pageSize24);  
               this.finalTableData24 = this.tableData24.slice(0, this.pageSize24);
               this.endingRecord24 = this.pageSize24;     
           })  } 
            this.isShowProductAgg_brasil25 = res.isShowProductAgg_brasil26; 
            if(res.isShowProductAgg_brasil26==true){
              this.sapMatCodeType="026"; 
              getQLRecordsForBrazilTab({ oppId: this.recordId,searchKey: this.searchKey,sapMatJs:this.sapMatCodeType})
              .then(data => {
               var amt = 0;
               data.forEach(currentItem => {
                   if(currentItem.SBQQ__Product__r.SAP_Material_Code_Type__c=='026'){
                     amt=amt+currentItem.SBQQ__NetTotal__c; 
                   } });
               this.totalAmount26 = amt;
               this.tableData25 = data.map(record => Object.assign({ "SBQQ__Product__r.Name": record.SBQQ__Product__r.Name, "prodName": '/' + record.SBQQ__Product__c},{ "SBQQ__Product__r.SAP_Material_Code_Type__c":record.SBQQ__Product__r.SAP_Material_Code_Type__c, "SapCodeType": ( record.SBQQ__Product__r.SAP_Material_Code_Type__c)},{ "SBQQ__Product__r.SAP_Material_Code__c":record.SBQQ__Product__r.SAP_Material_Code__c, "SapCode":  record.SBQQ__Product__r.SAP_Material_Code__c}, record)); 
               this.totalRecountCount25 = data.length;
               this.totalPage25 = Math.ceil(this.totalRecountCount25 / this.pageSize25);  
               this.finalTableData25 = this.tableData25.slice(0, this.pageSize25);
               this.endingRecord25 = this.pageSize25;     
           })  }     
        }) 
    }
    firstHandler() {
        this.page = 1;
        this.displayRecordPerPage(this.page);
    }
    firstHandler1() {
        this.page1 = 1;
        this.displayRecordPerPage1(this.page1);
    }
    firstHandler2() {
        this.page2 = 1;
        this.displayRecordPerPage2(this.page2);
    }
    firstHandler3() {
        this.page3 = 1;
        this.displayRecordPerPage3(this.page3);
    }
    firstHandler4() {
        this.page4 = 1;
        this.displayRecordPerPage4(this.page4);
    }
    firstHandler5() {
        this.page5 = 1;
        this.displayRecordPerPage5(this.page5);
    }

    firstHandler6() {
        this.page6 = 1;
        this.displayRecordPerPage6(this.page6);
    }
    firstHandler7() {
        this.page7 = 1;
        this.displayRecordPerPage7(this.page7);
    }
    firstHandler8() {
        this.page8 = 1;
        this.displayRecordPerPage8(this.page8);
    }
    firstHandler9() {
        this.page9 = 1;
        this.displayRecordPerPage9(this.page9);
    }
    firstHandler10() {
        this.page10 = 1;
        this.displayRecordPerPage10(this.page10);
    }
    firstHandler11() {
        this.page11 = 1;
        this.displayRecordPerPage11(this.page11);
    }
    firstHandler12() {
        this.page12 = 1;
        this.displayRecordPerPage12(this.page12);
    }
    firstHandler13() {
        this.page13 = 1;
        this.displayRecordPerPage13(this.page13);
    }
    firstHandler14() {
        this.page14 = 1;
        this.displayRecordPerPage14(this.page14);
    }
    firstHandler15() {
        this.page15 = 1;
        this.displayRecordPerPage15(this.page15);
    }
    firstHandler16() {
        this.page16 = 1;
        this.displayRecordPerPage16(this.page16);
    }
    firstHandler17() {
        this.page17 = 1;
        this.displayRecordPerPage17(this.page17);
    }
    firstHandler18() {
        this.page18 = 1;
        this.displayRecordPerPage18(this.page18);
    }
    firstHandler19() {
        this.page19 = 1;
        this.displayRecordPerPage19(this.page19);
    }
    firstHandler20() {
        this.page20 = 1;
        this.displayRecordPerPage20(this.page20);
    }
    firstHandler21() {
        this.page21 = 1;
        this.displayRecordPerPage21(this.page21);
    }
    firstHandler22() {
        this.page22 = 1;
        this.displayRecordPerPage22(this.page22);
    }
    firstHandler23() {
        this.page23 = 1;
        this.displayRecordPerPage23(this.page23);
    }
    firstHandler24() {
        this.page24 = 1;
        this.displayRecordPerPage24(this.page24);
    }
    firstHandler25() {
        this.page25 = 1;
        this.displayRecordPerPage25(this.page25);
    }
    lastHandler() {
        this.page = this.totalPage;
        this.displayRecordPerPage(this.page);
    }
    lastHandler1() {
        this.page1 = this.totalPage1;
        this.displayRecordPerPage1(this.page1);
    }
    lastHandler2() {
        this.page2 = this.totalPage2;
        this.displayRecordPerPage2(this.page2);
    }
    lastHandler3() {
        this.page3 = this.totalPage3;
        this.displayRecordPerPage3(this.page3);
    }
    lastHandler4() {
        this.page4 = this.totalPage4;
        this.displayRecordPerPage4(this.page4);
    }
    lastHandler5() {
        this.page5 = this.totalPage5;
        this.displayRecordPerPage5(this.page5);
    }
    lastHandler6() {
        this.page6 = this.totalPage6;
        this.displayRecordPerPage6(this.page6);
    }
    lastHandler7() {
        this.page7 = this.totalPage7;
        this.displayRecordPerPage7(this.page7);
    }
    lastHandler8() {
        this.page8 = this.totalPage8;
        this.displayRecordPerPage8(this.page8);
    }
    lastHandler9() {
        this.page9 = this.totalPage9;
        this.displayRecordPerPage9(this.page9);
    }
    lastHandler10() {
        this.page10 = this.totalPage10;
        this.displayRecordPerPage10(this.page10);
    }
    lastHandler11() {
        this.page11 = this.totalPage11;
        this.displayRecordPerPage11(this.page11);
    }
    lastHandler12() {
        this.page12 = this.totalPage12;
        this.displayRecordPerPage12(this.page12);
    }
    lastHandler13() {
        this.page13 = this.totalPage13;
        this.displayRecordPerPage13(this.page13);
    }
    lastHandler14() {
        this.page14 = this.totalPage14;
        this.displayRecordPerPage14(this.page14);
    }
    lastHandler15() {
        this.page15 = this.totalPage15;
        this.displayRecordPerPage15(this.page15);
    }
    lastHandler16() {
        this.page16 = this.totalPage16;
        this.displayRecordPerPage16(this.page16);
    }
    lastHandler17() {
        this.page17 = this.totalPage17;
        this.displayRecordPerPage17(this.page17);
    }
    lastHandler18() {
        this.page18 = this.totalPage18;
        this.displayRecordPerPage18(this.page18);
    }
    lastHandler19() {
        this.page19 = this.totalPage19;
        this.displayRecordPerPage19(this.page19);
    }
    lastHandler20() {
        this.page20 = this.totalPage20;
        this.displayRecordPerPage20(this.page20);
    }
    lastHandler21() {
        this.page21 = this.totalPage21;
        this.displayRecordPerPage21(this.page21);
    }
    lastHandler22() {
        this.page22 = this.totalPage22;
        this.displayRecordPerPage22(this.page22);
    }
    lastHandler23() {
        this.page23 = this.totalPage23;
        this.displayRecordPerPage23(this.page23);
    }
    lastHandler24() {
        this.page24 = this.totalPage24;
        this.displayRecordPerPage24(this.page24);
    }
    lastHandler25() {
        this.page25 = this.totalPage25;
        this.displayRecordPerPage25(this.page25);
    }
    //clicking on previous button this method will be called
    previousHandler() {
        if (this.page > 1) {
            this.page = this.page - 1; 
            this.displayRecordPerPage(this.page);
        }
    }
    previousHandler1() {
        if (this.page1 > 1) {
            this.page1 = this.page1 - 1; 
            this.displayRecordPerPage1(this.page1);
        }
    }
    previousHandler2() {
        if (this.page2 > 1) {
            this.page2 = this.page2 - 1; 
            this.displayRecordPerPage2(this.page2);
        }
    }
    previousHandler3() {
        if (this.page3 > 1) {
            this.page3 = this.page3 - 1; 
            this.displayRecordPerPage3(this.page3);
        }
    }
    previousHandler4() {
        if (this.page4 > 1) {
            this.page4 = this.page4 - 1; 
            this.displayRecordPerPage4(this.page4);
        }
    }
    previousHandler5() {
        if (this.page5 > 1) {
            this.page5 = this.page5 - 1; 
            this.displayRecordPerPage5(this.page5);
        }
    }
    previousHandler6() {
        if (this.page6 > 1) {
            this.page6 = this.page6 - 1; 
            this.displayRecordPerPage6(this.page6);
        }
    }
    previousHandler7() {
        if (this.page7 > 1) {
            this.page7 = this.page7 - 1; 
            this.displayRecordPerPage7(this.page7);
        }
    }
    previousHandler8() {
        if (this.page8 > 1) {
            this.page8 = this.page8 - 1; 
            this.displayRecordPerPage8(this.page8);
        }
    }
    previousHandler9() {
        if (this.page9 > 1) {
            this.page9 = this.page9 - 1; 
            this.displayRecordPerPage9(this.page9);
        }
    }
    previousHandler10() {
        if (this.page10 > 1) {
            this.page10 = this.page10 - 1; 
            this.displayRecordPerPage10(this.page10);
        }
    }
    previousHandler11() {
        if (this.page11 > 1) {
            this.page11 = this.page11 - 1; 
            this.displayRecordPerPage11(this.page11);
        }
    }
    previousHandler12() {
        if (this.page12 > 1) {
            this.page12 = this.page12 - 1; 
            this.displayRecordPerPage12(this.page12);
        }
    }
    previousHandler13() {
        if (this.page13 > 1) {
            this.page13 = this.page13 - 1; 
            this.displayRecordPerPage13(this.page13);
        }
    }
    previousHandler14() {
        if (this.page14 > 1) {
            this.page14 = this.page14 - 1; 
            this.displayRecordPerPage14(this.page14);
        }
    }
    previousHandler15() {
        if (this.page15 > 1) {
            this.page15 = this.page15 - 1; 
            this.displayRecordPerPage15(this.page15);
        }
    }
    previousHandler16() {
        if (this.page16 > 1) {
            this.page16 = this.page16 - 1; 
            this.displayRecordPerPage16(this.page16);
        }
    }
    previousHandler17() {
        if (this.page17 > 1) {
            this.page17 = this.page17 - 1; 
            this.displayRecordPerPage17(this.page17);
        }
    }
    previousHandler18() {
        if (this.page18 > 1) {
            this.page18 = this.page18 - 1; 
            this.displayRecordPerPage18(this.page18);
        }
    }
    previousHandler19() {
        if (this.page19 > 1) {
            this.page19 = this.page19 - 1; 
            this.displayRecordPerPage19(this.page19);
        }
    }
    previousHandler20() {
        if (this.page20 > 1) {
            this.page20 = this.page20 - 1; 
            this.displayRecordPerPage20(this.page20);
        }
    }
    previousHandler21() {
        if (this.page21 > 1) {
            this.page21 = this.page21 - 1; 
            this.displayRecordPerPage21(this.page21);
        }
    }
    previousHandler22() {
        if (this.page22 > 1) {
            this.page22 = this.page22 - 1;
            this.displayRecordPerPage22(this.page22);
        }
    }
    previousHandler23() {
        if (this.page23 > 1) {
            this.page23 = this.page23 - 1; 
            this.displayRecordPerPage23(this.page23);
        }
    }
    previousHandler24() {
        if (this.page24 > 1) {
            this.page24 = this.page24 - 1; 
            this.displayRecordPerPage24(this.page24);
        }
    }
    previousHandler25() {
        if (this.page25 > 1) {
            this.page25 = this.page25 - 1;
            this.displayRecordPerPage25(this.page25);
        } }
    //clicking on next button this method will be called
    nextHandler() {
        if ((this.page < this.totalPage) && this.page !== this.totalPage) {
            this.page = this.page + 1; 
            this.displayRecordPerPage(this.page);
        }
    }
    nextHandler1() {
        if ((this.page1 < this.totalPage1) && this.page1 !== this.totalPage1) {
            this.page1 = this.page1 + 1; 
            this.displayRecordPerPage1(this.page1);
        }
    }
    nextHandler2() {
        if ((this.page2 < this.totalPage2) && this.page2 !== this.totalPage2) {
            this.page2 = this.page2 + 1; 
            this.displayRecordPerPage2(this.page2);
        }
    }
    nextHandler3() {
        if ((this.page3 < this.totalPage3) && this.page3 !== this.totalPage3) {
            this.page3 = this.page3 + 1; 
            this.displayRecordPerPage3(this.page3);
        }
    }
    nextHandler4() {
        if ((this.page4 < this.totalPage4) && this.page4 !== this.totalPage4) {
            this.page4 = this.page4 + 1; 
            this.displayRecordPerPage4(this.page4);
        }
    }
    nextHandler5() {
        if ((this.page5 < this.totalPage5) && this.page5 !== this.totalPage5) {
            this.page5 = this.page5 + 1; 
            this.displayRecordPerPage5(this.page5);
        } }
    nextHandler6() {
        if ((this.page6 < this.totalPage6) && this.page6 !== this.totalPage6) {
            this.page6 = this.page6 + 1; 
            this.displayRecordPerPage6(this.page6);
        }}
    nextHandler7() {
        if ((this.page7 < this.totalPage7) && this.page7 !== this.totalPage7) {
            this.page7 = this.page7 + 1; 
            this.displayRecordPerPage7(this.page7);
        }}
    nextHandler8() {
        if ((this.page8 < this.totalPage8) && this.page8 !== this.totalPage8) {
            this.page8 = this.page8 + 1;
            this.displayRecordPerPage8(this.page8);
        }  }
    nextHandler9() {
        if ((this.page9 < this.totalPage9) && this.page9 !== this.totalPage9) {
            this.page9 = this.page9 + 1; 
            this.displayRecordPerPage9(this.page9);
        } }
    nextHandler10() {
        if ((this.page10 < this.totalPage10) && this.page10 !== this.totalPage10) {
            this.page10 = this.page10 + 1;
            this.displayRecordPerPage10(this.page10);
        } }
    nextHandler11() {
        if ((this.page11 < this.totalPage11) && this.page11 !== this.totalPage11) {
            this.page11 = this.page11 + 1; 
            this.displayRecordPerPage11(this.page11);
        }  }
    nextHandler12() {
        if ((this.page12 < this.totalPage12) && this.page12 !== this.totalPage12) {
            this.page12 = this.page12 + 1;
            this.displayRecordPerPage12(this.page12);
        } }
    nextHandler14() {
        if ((this.page14 < this.totalPage14) && this.page14 !== this.totalPage14) {
            this.page14 = this.page14 + 1; 
            this.displayRecordPerPage14(this.page14);
        }}
    nextHandler15() {
        if ((this.page15 < this.totalPage15) && this.page15 !== this.totalPage15) {
            this.page15 = this.page15 + 1;
            this.displayRecordPerPage15(this.page15);
        } }
    nextHandler16() {
        if ((this.page16 < this.totalPage16) && this.page16 !== this.totalPage16) {
            this.page16 = this.page16 + 1;
            this.displayRecordPerPage16(this.page16);
        } }
    nextHandler17() {
        if ((this.page17 < this.totalPage17) && this.page17 !== this.totalPage17) {
            this.page17 = this.page17 + 1; 
            this.displayRecordPerPage17(this.page17);
        } }
    nextHandler18() {
        if ((this.page18 < this.totalPage18) && this.page18 !== this.totalPage18) {
            this.page18 = this.page18 + 1; 
            this.displayRecordPerPage18(this.page18);
        }  }
    nextHandler19() {
        if ((this.page19 < this.totalPage19) && this.page19 !== this.totalPage19) {
            this.page19 = this.page19 + 1; 
            this.displayRecordPerPage19(this.page19);
        }  }
    nextHandler20() {
        if ((this.page20 < this.totalPage20) && this.page20 !== this.totalPage20) {
            this.page20 = this.page20 + 1;
            this.displayRecordPerPage20(this.page20);
        } }
    nextHandler21() {
        if ((this.page21 < this.totalPage21) && this.page21 !== this.totalPage21) {
            this.page21 = this.page21 + 1; 
            this.displayRecordPerPage21(this.page21);
             } }
    nextHandler22() {
        if ((this.page22 < this.totalPage22) && this.page22 !== this.totalPage22) {
            this.page22 = this.page22 + 1; 
            this.displayRecordPerPage22(this.page22);
        } }
    nextHandler23() {
        if ((this.page23 < this.totalPage23) && this.page23 !== this.totalPage23) {
            this.page23 = this.page23 + 1;
            this.displayRecordPerPage23(this.page23);
        }}
    nextHandler24() {
        if ((this.page24 < this.totalPage24) && this.page24 !== this.totalPage24) {
            this.page24 = this.page24 + 1; 
            this.displayRecordPerPage24(this.page24);
        } }
    nextHandler25() {
        if ((this.page25 < this.totalPage25) && this.page25 !== this.totalPage25) {
            this.page25 = this.page25 + 1; 
            this.displayRecordPerPage25(this.page25);
        }
    }
    //this method displays records page by page
     displayRecordPerPage(page) {
        this.startingRecord = ((page - 1) * this.pageSize);
        this.endingRecord = (this.pageSize * page);
        this.endingRecord = (this.endingRecord > this.totalRecountCount)
            ? this.totalRecountCount : this.endingRecord;
        this.finalTableData = this.tableData.slice(this.startingRecord, this.endingRecord);
        this.startingRecord = this.startingRecord + 1;
    }
    displayRecordPerPage1(page1) {
        this.startingRecord1 = ((page1 - 1) * this.pageSize1);
        this.endingRecord1= (this.pageSize1 * page1);
        this.endingRecord1 = (this.endingRecord1 > this.totalRecountCount1)
            ? this.totalRecountCount1 : this.endingRecord1;
        this.finalTableData1 = this.tableData1.slice(this.startingRecord1, this.endingRecord1);
        this.startingRecord1 = this.startingRecord1 + 1;
    }
    displayRecordPerPage2(page2) {
        this.startingRecord2 = ((page2 - 1) * this.pageSize2);
        this.endingRecord2= (this.pageSize2 * page2);
        this.endingRecord2 = (this.endingRecord2 > this.totalRecountCount2)
            ? this.totalRecountCount2 : this.endingRecord2;
        this.finalTableData2 = this.tableData2.slice(this.startingRecord2, this.endingRecord2);
        this.startingRecord2 = this.startingRecord2 + 1;
    }
    displayRecordPerPage3(page3) {
        this.startingRecord3 = ((page3 - 1) * this.pageSize3);
        this.endingRecord3= (this.pageSize3 * page3);
        this.endingRecord3 = (this.endingRecord3 > this.totalRecountCount3)
            ? this.totalRecountCount3 : this.endingRecord3;
        this.finalTableData3 = this.tableData3.slice(this.startingRecord3, this.endingRecord3);
        this.startingRecord3 = this.startingRecord3 + 1;
    }
    displayRecordPerPage4(page4) {
        this.startingRecord4 = ((page4 - 1) * this.pageSize4);
        this.endingRecord4= (this.pageSize4 * page4);
        this.endingRecord4 = (this.endingRecord4 > this.totalRecountCount4)
            ? this.totalRecountCount4 : this.endingRecord4;
        this.finalTableData4 = this.tableData4.slice(this.startingRecord4, this.endingRecord4);
        this.startingRecord4 = this.startingRecord4 + 1;
    }
    displayRecordPerPage5(page5) {
        this.startingRecord5 = ((page5 - 1) * this.pageSize5);
        this.endingRecord5= (this.pageSize5 * page5);
        this.endingRecord5 = (this.endingRecord5 > this.totalRecountCount5)
            ? this.totalRecountCount5 : this.endingRecord5;
        this.finalTableData5 = this.tableData5.slice(this.startingRecord5, this.endingRecord5);
        this.startingRecord5 = this.startingRecord5 + 1;
    }
    displayRecordPerPage6(page6) {
        this.startingRecord6 = ((page6 - 1) * this.pageSize6);
        this.endingRecord6= (this.pageSize6 * page6);
        this.endingRecord6 = (this.endingRecord6 > this.totalRecountCount6)
            ? this.totalRecountCount6 : this.endingRecord6;
        this.finalTableData6 = this.tableData6.slice(this.startingRecord6, this.endingRecord6);
        this.startingRecord6 = this.startingRecord6 + 1;
    }
    displayRecordPerPage7(page7) {
        this.startingRecord7 = ((page7 - 1) * this.pageSize7);
        this.endingRecord7= (this.pageSize7 * page7);
        this.endingRecord7 = (this.endingRecord7 > this.totalRecountCount7)
            ? this.totalRecountCount7 : this.endingRecord7;
        this.finalTableData7 = this.tableData7.slice(this.startingRecord7, this.endingRecord7);
        this.startingRecord7 = this.startingRecord7 + 1;
    }
    displayRecordPerPage8(page8) {
        this.startingRecord8 = ((page8 - 1) * this.pageSize8);
        this.endingRecord8= (this.pageSize8 * page8);
        this.endingRecord8 = (this.endingRecord8 > this.totalRecountCount8)
            ? this.totalRecountCount8 : this.endingRecord8;
        this.finalTableData8 = this.tableData8.slice(this.startingRecord8, this.endingRecord8);
        this.startingRecord8 = this.startingRecord8 + 1;
    }
    displayRecordPerPage9(page9) {
        this.startingRecord9 = ((page9 - 1) * this.pageSize9);
        this.endingRecord9= (this.pageSize9 * page9);
        this.endingRecord9 = (this.endingRecord9 > this.totalRecountCount9)
            ? this.totalRecountCount9 : this.endingRecord9;
        this.finalTableData9 = this.tableData9.slice(this.startingRecord9, this.endingRecord9);
        this.startingRecord9 = this.startingRecord9 + 1;
    }
    displayRecordPerPage10(page10) {
        this.startingRecord10 = ((page10 - 1) * this.pageSize10);
        this.endingRecord10= (this.pageSize10 * page10);
        this.endingRecord10 = (this.endingRecord10 > this.totalRecountCount10)
            ? this.totalRecountCount10 : this.endingRecord10;
        this.finalTableData10 = this.tableData10.slice(this.startingRecord10, this.endingRecord10);
        this.startingRecord10 = this.startingRecord10 + 1;
    }
    displayRecordPerPage11(page11) {
        this.startingRecord11 = ((page11 - 1) * this.pageSize11);
        this.endingRecord11= (this.pageSize11 * page11);
        this.endingRecord11 = (this.endingRecord11 > this.totalRecountCount11)
            ? this.totalRecountCount11 : this.endingRecord11;
        this.finalTableData11 = this.tableData11.slice(this.startingRecord11, this.endingRecord11);
        this.startingRecord11 = this.startingRecord11 + 1;
    }
    displayRecordPerPage12(page12) {
        this.startingRecord12 = ((page12 - 1) * this.pageSize12);
        this.endingRecord12= (this.pageSize12 * page12);
        this.endingRecord12 = (this.endingRecord12 > this.totalRecountCount12)
            ? this.totalRecountCount12 : this.endingRecord12;
        this.finalTableData12 = this.tableData12.slice(this.startingRecord12, this.endingRecord12);
        this.startingRecord12 = this.startingRecord12 + 1;
    }
    displayRecordPerPage13(page13) {
        this.startingRecord13 = ((page13 - 1) * this.pageSize13);
        this.endingRecord13= (this.pageSize13 * page13);
        this.endingRecord13 = (this.endingRecord13 > this.totalRecountCount13)
            ? this.totalRecountCount13 : this.endingRecord13;
        this.finalTableData13 = this.tableData13.slice(this.startingRecord13, this.endingRecord13);
        this.startingRecord13 = this.startingRecord13 + 1;
    }
    displayRecordPerPage14(page14) {
        this.startingRecord14 = ((page14 - 1) * this.pageSize14);
        this.endingRecord14= (this.pageSize14 * page14);
        this.endingRecord14 = (this.endingRecord14 > this.totalRecountCount14)
            ? this.totalRecountCount14 : this.endingRecord14;
        this.finalTableData14 = this.tableData14.slice(this.startingRecord14, this.endingRecord14);
        this.startingRecord14 = this.startingRecord14 + 1;
    }
    displayRecordPerPage15(page15) {
        this.startingRecord15 = ((page15 - 1) * this.pageSize15);
        this.endingRecord15= (this.pageSize15 * page15);
        this.endingRecord15 = (this.endingRecord15 > this.totalRecountCount15)
            ? this.totalRecountCount15 : this.endingRecord15;
        this.finalTableData15 = this.tableData15.slice(this.startingRecord15, this.endingRecord15);
        this.startingRecord15 = this.startingRecord15 + 1;
    }
    displayRecordPerPage16(page16) {
        this.startingRecord16 = ((page16 - 1) * this.pageSize16);
        this.endingRecord16= (this.pageSize16 * page16);
        this.endingRecord16 = (this.endingRecord16 > this.totalRecountCount16)
            ? this.totalRecountCount16 : this.endingRecord16;
        this.finalTableData16 = this.tableData16.slice(this.startingRecord16, this.endingRecord16);
        this.startingRecord16 = this.startingRecord16 + 1;
    }
    displayRecordPerPage17(page17) {
        this.startingRecord17 = ((page17 - 1) * this.pageSize17);
        this.endingRecord17= (this.pageSize17 * page17);
        this.endingRecord17 = (this.endingRecord17 > this.totalRecountCount17)
            ? this.totalRecountCount17 : this.endingRecord17;
        this.finalTableData17 = this.tableData17.slice(this.startingRecord17, this.endingRecord17);
        this.startingRecord17 = this.startingRecord17 + 1;
    }
    displayRecordPerPage18(page18) {
        this.startingRecord18 = ((page18 - 1) * this.pageSize18);
        this.endingRecord18= (this.pageSize18 * page18);
        this.endingRecord18 = (this.endingRecord18 > this.totalRecountCount18)
            ? this.totalRecountCount18 : this.endingRecord18;
        this.finalTableData18 = this.tableData18.slice(this.startingRecord18, this.endingRecord18);
        this.startingRecord18 = this.startingRecord18 + 1;
    }
    displayRecordPerPage19(page19) {
        this.startingRecord19 = ((page19 - 1) * this.pageSize19);
        this.endingRecord19= (this.pageSize19 * page19);
        this.endingRecord19 = (this.endingRecord19 > this.totalRecountCount19)
            ? this.totalRecountCount19 : this.endingRecord19;
        this.finalTableData19 = this.tableData19.slice(this.startingRecord19, this.endingRecord19);
        this.startingRecord19 = this.startingRecord19 + 1;
    }
    displayRecordPerPage20(page20) {
        this.startingRecord20 = ((page20 - 1) * this.pageSize20);
        this.endingRecord20= (this.pageSize20 * page20);
        this.endingRecord20 = (this.endingRecord20 > this.totalRecountCount20)
            ? this.totalRecountCount20 : this.endingRecord20;
        this.finalTableData20 = this.tableData20.slice(this.startingRecord20, this.endingRecord20);
        this.startingRecord20 = this.startingRecord20 + 1;
    }
    displayRecordPerPage21(page21) {
        this.startingRecord21 = ((page21 - 1) * this.pageSize21);
        this.endingRecord21= (this.pageSize21 * page21);
        this.endingRecord21 = (this.endingRecord21 > this.totalRecountCount21)
            ? this.totalRecountCount21 : this.endingRecord21;
        this.finalTableData21 = this.tableData21.slice(this.startingRecord21, this.endingRecord21);
        this.startingRecord21 = this.startingRecord21 + 1;
    }
    displayRecordPerPage22(page22) {
        this.startingRecord22 = ((page22 - 1) * this.pageSize22);
        this.endingRecord22= (this.pageSize22 * page22);
        this.endingRecord22 = (this.endingRecord22 > this.totalRecountCount22)
            ? this.totalRecountCount22 : this.endingRecord22;
        this.finalTableData22 = this.tableData22.slice(this.startingRecord22, this.endingRecord22);
        this.startingRecord22 = this.startingRecord22 + 1;
    }
    displayRecordPerPage23(page23) {
        this.startingRecord23 = ((page23 - 1) * this.pageSize23);
        this.endingRecord23= (this.pageSize23 * page23);
        this.endingRecord23 = (this.endingRecord23 > this.totalRecountCount23)
            ? this.totalRecountCount23 : this.endingRecord23;
        this.finalTableData23 = this.tableData23.slice(this.startingRecord23, this.endingRecord23);
        this.startingRecord23 = this.startingRecord23 + 1;
    }
    displayRecordPerPage24(page24) {
        this.startingRecord24 = ((page24 - 1) * this.pageSize24);
        this.endingRecord24= (this.pageSize24 * page24);
        this.endingRecord24 = (this.endingRecord24 > this.totalRecountCount24)
            ? this.totalRecountCount24 : this.endingRecord24;
        this.finalTableData24 = this.tableData24.slice(this.startingRecord24, this.endingRecord24);
        this.startingRecord24 = this.startingRecord24 + 1;
    }
    displayRecordPerPage25(page25) {
        this.startingRecord25 = ((page25 - 1) * this.pageSize25);
        this.endingRecord25= (this.pageSize25 * page25);
        this.endingRecord25 = (this.endingRecord25 > this.totalRecountCount25)
            ? this.totalRecountCount25 : this.endingRecord25;
        this.finalTableData25 = this.tableData25.slice(this.startingRecord25, this.endingRecord25);
        this.startingRecord25 = this.startingRecord25 + 1;
    }
    reloadData(event){
        this.searchKey=event.target.value; 
        this.handleKeyChange(); 
    }
      handleKeyChange(event) {
       getProductBrasilCondition({oppId:this.recordId})
       .then(res=>{
           this.isShowProductHeader = res.isShowProductHeader;
           this.isShowProductAgg_brasil = res.isShowProductAgg_brasil;
           if(res.isShowProductAgg_brasil==true){
              this.sapMatCodeType="001";
              getQLRecordsForBrazilTab( { oppId: this.recordId,searchKey: this.searchKey,sapMatJs:this.sapMatCodeType})
              .then(data => { 
               this.tableData = data.map(record => Object.assign({ "SBQQ__Product__r.Name": record.SBQQ__Product__r.Name, "prodName": '/' + record.SBQQ__Product__c},{ "SBQQ__Product__r.SAP_Material_Code_Type__c":record.SBQQ__Product__r.SAP_Material_Code_Type__c, "SapCodeType": ( record.SBQQ__Product__r.SAP_Material_Code_Type__c)},{ "SBQQ__Product__r.SAP_Material_Code__c":record.SBQQ__Product__r.SAP_Material_Code__c, "SapCode":  record.SBQQ__Product__r.SAP_Material_Code__c}, record)); 
               this.endingRecord = this.pageSize; 
               this.totalRecountCount = data.length;
               this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize);  
               this.finalTableData = this.tableData.slice(0, this.pageSize);
               this.endingRecord = this.pageSize;    
           })
           } 
        })}
    reloadData_A(event){
        this.searchKey1= event.target.value;
        this.handleKeyChange1();
    }
    handleKeyChange1(event) {
       getProductBrasilCondition({oppId:this.recordId})
       .then(res=>{
           this.isShowProductHeader = res.isShowProductHeader;
           this.isShowProductAgg_brasil1 = res.isShowProductAgg_brasil1; 
           if(res.isShowProductAgg_brasil1==true){
             this.sapMatCodeType="002";
              getQLRecordsForBrazilTab( { oppId: this.recordId,searchKey: this.searchKey1,sapMatJs:this.sapMatCodeType})
              .then(data => {
               this.tableData1 = data.map(record => Object.assign({ "SBQQ__Product__r.Name": record.SBQQ__Product__r.Name, "prodName": '/' + record.SBQQ__Product__c},{ "SBQQ__Product__r.SAP_Material_Code_Type__c":record.SBQQ__Product__r.SAP_Material_Code_Type__c, "SapCodeType": ( record.SBQQ__Product__r.SAP_Material_Code_Type__c)},{ "SBQQ__Product__r.SAP_Material_Code__c":record.SBQQ__Product__r.SAP_Material_Code__c, "SapCode":  record.SBQQ__Product__r.SAP_Material_Code__c}, record)); 
               this.totalRecountCount1 = data.length;
               this.totalPage1 = Math.ceil(this.totalRecountCount1 / this.pageSize1);  
               this.finalTableData1 = this.tableData1.slice(0, this.pageSize1);
               this.endingRecord1 = this.pageSize1;     
           })  } 
        }) }
    reloadData_B(event){
        this.searchKey2= event.target.value;
         this.handleKeyChange2();
    }
    handleKeyChange2(event) {
       getProductBrasilCondition({oppId:this.recordId})
       .then(res=>{
           this.isShowProductHeader = res.isShowProductHeader;
           this.isShowProductAgg_brasil2 = res.isShowProductAgg_brasil2; 
           if(res.isShowProductAgg_brasil2==true){
             this.sapMatCodeType="003";
              getQLRecordsForBrazilTab( { oppId: this.recordId,searchKey: this.searchKey2,sapMatJs:this.sapMatCodeType})
              .then(data => {
               this.tableData2 = data.map(record => Object.assign({ "SBQQ__Product__r.Name": record.SBQQ__Product__r.Name, "prodName": '/' + record.SBQQ__Product__c},{ "SBQQ__Product__r.SAP_Material_Code_Type__c":record.SBQQ__Product__r.SAP_Material_Code_Type__c, "SapCodeType": ( record.SBQQ__Product__r.SAP_Material_Code_Type__c)},{ "SBQQ__Product__r.SAP_Material_Code__c":record.SBQQ__Product__r.SAP_Material_Code__c, "SapCode":  record.SBQQ__Product__r.SAP_Material_Code__c}, record)); 
               this.totalRecountCount2 = data.length;
               this.totalPage2 = Math.ceil(this.totalRecountCount2 / this.pageSize2);  
               this.finalTableData2 = this.tableData2.slice(0, this.pageSize2);
               this.endingRecord2 = this.pageSize2;     
           }) } 
        })}
    reloadData_C(event){
        this.searchKey3= event.target.value;
         this.handleKeyChange3();
    }
    handleKeyChange3(event) {
       getProductBrasilCondition({oppId:this.recordId})
       .then(res=>{
           this.isShowProductHeader = res.isShowProductHeader;
           this.isShowProductAgg_brasil3 = res.isShowProductAgg_brasil3; 
           if(res.isShowProductAgg_brasil3==true){
             this.sapMatCodeType="004";
              getQLRecordsForBrazilTab( { oppId: this.recordId,searchKey: this.searchKey3,sapMatJs:this.sapMatCodeType})
              .then(data => {
               this.tableData3 = data.map(record => Object.assign({ "SBQQ__Product__r.Name": record.SBQQ__Product__r.Name, "prodName": '/' + record.SBQQ__Product__c},{ "SBQQ__Product__r.SAP_Material_Code_Type__c":record.SBQQ__Product__r.SAP_Material_Code_Type__c, "SapCodeType": ( record.SBQQ__Product__r.SAP_Material_Code_Type__c)},{ "SBQQ__Product__r.SAP_Material_Code__c":record.SBQQ__Product__r.SAP_Material_Code__c, "SapCode":  record.SBQQ__Product__r.SAP_Material_Code__c}, record)); 
               this.totalRecountCount3 = data.length;
               this.totalPage3 = Math.ceil(this.totalRecountCount3 / this.pageSize3);  
               this.finalTableData3 = this.tableData3.slice(0, this.pageSize3);
               this.endingRecord3 = this.pageSize3;     
           }) } 
        }) }
    reloadData_D(event){
        this.searchKey4= event.target.value;
         this.handleKeyChange4();
    }
    handleKeyChange4(event) {
       getProductBrasilCondition({oppId:this.recordId})
       .then(res=>{
           this.isShowProductHeader = res.isShowProductHeader;
           this.isShowProductAgg_brasil4 = res.isShowProductAgg_brasil4; 
           if(res.isShowProductAgg_brasil4==true){
             this.sapMatCodeType="005";
              getQLRecordsForBrazilTab( { oppId: this.recordId,searchKey: this.searchKey4,sapMatJs:this.sapMatCodeType})
              .then(data => {
               this.tableData4 = data.map(record => Object.assign({ "SBQQ__Product__r.Name": record.SBQQ__Product__r.Name, "prodName": '/' + record.SBQQ__Product__c},{ "SBQQ__Product__r.SAP_Material_Code_Type__c":record.SBQQ__Product__r.SAP_Material_Code_Type__c, "SapCodeType": ( record.SBQQ__Product__r.SAP_Material_Code_Type__c)},{ "SBQQ__Product__r.SAP_Material_Code__c":record.SBQQ__Product__r.SAP_Material_Code__c, "SapCode":  record.SBQQ__Product__r.SAP_Material_Code__c}, record)); 
               this.totalRecountCount4 = data.length;
               this.totalPage4 = Math.ceil(this.totalRecountCount4 / this.pageSize4);  
               this.finalTableData4 = this.tableData4.slice(0, this.pageSize4);
               this.endingRecord4 = this.pageSize4;     
           })  } 
        }) }
    reloadData_E(event){
        this.searchKey5= event.target.value;
         this.handleKeyChange5();
    }
    handleKeyChange5(event) {
       getProductBrasilCondition({oppId:this.recordId})
       .then(res=>{
           this.isShowProductHeader = res.isShowProductHeader;
           this.isShowProductAgg_brasil5 = res.isShowProductAgg_brasil5; 
           if(res.isShowProductAgg_brasil5==true){
             this.sapMatCodeType="006";
              getQLRecordsForBrazilTab( { oppId: this.recordId,searchKey: this.searchKey5,sapMatJs:this.sapMatCodeType})
              .then(data => {
               this.tableData5 = data.map(record => Object.assign({ "SBQQ__Product__r.Name": record.SBQQ__Product__r.Name, "prodName": '/' + record.SBQQ__Product__c},{ "SBQQ__Product__r.SAP_Material_Code_Type__c":record.SBQQ__Product__r.SAP_Material_Code_Type__c, "SapCodeType": ( record.SBQQ__Product__r.SAP_Material_Code_Type__c)},{ "SBQQ__Product__r.SAP_Material_Code__c":record.SBQQ__Product__r.SAP_Material_Code__c, "SapCode":  record.SBQQ__Product__r.SAP_Material_Code__c}, record)); 
               this.totalRecountCount5 = data.length;
               this.totalPage5 = Math.ceil(this.totalRecountCount5 / this.pageSize5);  
               this.finalTableData5 = this.tableData5.slice(0, this.pageSize5);
               this.endingRecord5 = this.pageSize5;     
           }) } 
        }) }
    reloadData_F(event){
        this.searchKey6= event.target.value;
         this.handleKeyChange6();
    }
    handleKeyChange6(event) {
       getProductBrasilCondition({oppId:this.recordId})
       .then(res=>{
           this.isShowProductHeader = res.isShowProductHeader;
           this.isShowProductAgg_brasil6 = res.isShowProductAgg_brasil6; 
           if(res.isShowProductAgg_brasil6==true){
             this.sapMatCodeType="007";
              getQLRecordsForBrazilTab( { oppId: this.recordId,searchKey: this.searchKey6,sapMatJs:this.sapMatCodeType})
              .then(data => {
               this.tableData6 = data.map(record => Object.assign({ "SBQQ__Product__r.Name": record.SBQQ__Product__r.Name, "prodName": '/' + record.SBQQ__Product__c},{ "SBQQ__Product__r.SAP_Material_Code_Type__c":record.SBQQ__Product__r.SAP_Material_Code_Type__c, "SapCodeType": ( record.SBQQ__Product__r.SAP_Material_Code_Type__c)},{ "SBQQ__Product__r.SAP_Material_Code__c":record.SBQQ__Product__r.SAP_Material_Code__c, "SapCode":  record.SBQQ__Product__r.SAP_Material_Code__c}, record)); 
               this.totalRecountCount6 = data.length;
               this.totalPage6 = Math.ceil(this.totalRecountCount6 / this.pageSize6);  
               this.finalTableData6 = this.tableData6.slice(0, this.pageSize6);
               this.endingRecord6 = this.pageSize6;     
           })
           } 
        })}

    reloadData_G(event){
         this.searchKey7= event.target.value;
         this.handleKeyChange7();
    }
    handleKeyChange7(event) {
       getProductBrasilCondition({oppId:this.recordId})
       .then(res=>{
           this.isShowProductHeader = res.isShowProductHeader;
           this.isShowProductAgg_brasil7 = res.isShowProductAgg_brasil7; 
           if(res.isShowProductAgg_brasil7==true){
             this.sapMatCodeType="008";
              getQLRecordsForBrazilTab( { oppId: this.recordId,searchKey: this.searchKey7,sapMatJs:this.sapMatCodeType})
              .then(data => {
               this.tableData7 = data.map(record => Object.assign({ "SBQQ__Product__r.Name": record.SBQQ__Product__r.Name, "prodName": '/' + record.SBQQ__Product__c},{ "SBQQ__Product__r.SAP_Material_Code_Type__c":record.SBQQ__Product__r.SAP_Material_Code_Type__c, "SapCodeType": ( record.SBQQ__Product__r.SAP_Material_Code_Type__c)},{ "SBQQ__Product__r.SAP_Material_Code__c":record.SBQQ__Product__r.SAP_Material_Code__c, "SapCode":  record.SBQQ__Product__r.SAP_Material_Code__c}, record)); 
               this.totalRecountCount7 = data.length;
               this.totalPage7 = Math.ceil(this.totalRecountCount7 / this.pageSize7);  
               this.finalTableData7 = this.tableData7.slice(0, this.pageSize7);
               this.endingRecord7 = this.pageSize7;     
           })} 
        })}
    reloadData_H(event){
        this.searchKey8= event.target.value;
         this.handleKeyChange8();
    }
    handleKeyChange8(event) {
       getProductBrasilCondition({oppId:this.recordId})
       .then(res=>{
           this.isShowProductHeader = res.isShowProductHeader;
           this.isShowProductAgg_brasil8 = res.isShowProductAgg_brasil8; 
           if(res.isShowProductAgg_brasil8==true){
             this.sapMatCodeType="009";
              getQLRecordsForBrazilTab( { oppId: this.recordId,searchKey: this.searchKey8,sapMatJs:this.sapMatCodeType})
              .then(data => {
               this.tableData8 = data.map(record => Object.assign({ "SBQQ__Product__r.Name": record.SBQQ__Product__r.Name, "prodName": '/' + record.SBQQ__Product__c},{ "SBQQ__Product__r.SAP_Material_Code_Type__c":record.SBQQ__Product__r.SAP_Material_Code_Type__c, "SapCodeType": ( record.SBQQ__Product__r.SAP_Material_Code_Type__c)},{ "SBQQ__Product__r.SAP_Material_Code__c":record.SBQQ__Product__r.SAP_Material_Code__c, "SapCode":  record.SBQQ__Product__r.SAP_Material_Code__c}, record)); 
               this.totalRecountCount8 = data.length;
               this.totalPage8 = Math.ceil(this.totalRecountCount8 / this.pageSize8);  
               this.finalTableData8 = this.tableData8.slice(0, this.pageSize8);
               this.endingRecord8 = this.pageSize8;     
           })
           }})  
    }
    reloadData_I(event){
        this.searchKey9= event.target.value;
         this.handleKeyChange9();
    }
    handleKeyChange9(event) {
       getProductBrasilCondition({oppId:this.recordId})
       .then(res=>{
           this.isShowProductHeader = res.isShowProductHeader;
           this.isShowProductAgg_brasil9 = res.isShowProductAgg_brasil10; 
           if(res.isShowProductAgg_brasil10==true){
             this.sapMatCodeType="010";
              getQLRecordsForBrazilTab( { oppId: this.recordId,searchKey: this.searchKey9,sapMatJs:this.sapMatCodeType})
              .then(data => {
               this.tableData9 = data.map(record => Object.assign({ "SBQQ__Product__r.Name": record.SBQQ__Product__r.Name, "prodName": '/' + record.SBQQ__Product__c},{ "SBQQ__Product__r.SAP_Material_Code_Type__c":record.SBQQ__Product__r.SAP_Material_Code_Type__c, "SapCodeType": ( record.SBQQ__Product__r.SAP_Material_Code_Type__c)},{ "SBQQ__Product__r.SAP_Material_Code__c":record.SBQQ__Product__r.SAP_Material_Code__c, "SapCode":  record.SBQQ__Product__r.SAP_Material_Code__c}, record)); 
               this.totalRecountCount9 = data.length;
               this.totalPage9 = Math.ceil(this.totalRecountCount9 / this.pageSize9);  
               this.finalTableData9 = this.tableData9.slice(0, this.pageSize9);
               this.endingRecord9 = this.pageSize9;     
           }) } 
        })}
    reloadData_J(event){
        this.searchKey10= event.target.value;
         this.handleKeyChange10();
    }
    handleKeyChange10(event) {
       getProductBrasilCondition({oppId:this.recordId})
       .then(res=>{
           this.isShowProductHeader = res.isShowProductHeader;
           this.isShowProductAgg_brasil10 = res.isShowProductAgg_brasil11; 
           if(res.isShowProductAgg_brasil11==true){
             this.sapMatCodeType="011";
              getQLRecordsForBrazilTab( { oppId: this.recordId,searchKey: this.searchKey10,sapMatJs:this.sapMatCodeType})
              .then(data => {
               this.tableData10 = data.map(record => Object.assign({ "SBQQ__Product__r.Name": record.SBQQ__Product__r.Name, "prodName": '/' + record.SBQQ__Product__c},{ "SBQQ__Product__r.SAP_Material_Code_Type__c":record.SBQQ__Product__r.SAP_Material_Code_Type__c, "SapCodeType": ( record.SBQQ__Product__r.SAP_Material_Code_Type__c)},{ "SBQQ__Product__r.SAP_Material_Code__c":record.SBQQ__Product__r.SAP_Material_Code__c, "SapCode":  record.SBQQ__Product__r.SAP_Material_Code__c}, record)); 
               this.totalRecountCount10 = data.length;
               this.totalPage10 = Math.ceil(this.totalRecountCount10 / this.pageSize10);  
               this.finalTableData10 = this.tableData10.slice(0, this.pageSize10);
               this.endingRecord10= this.pageSize10;     
           })}  
           })}
    reloadData_K(event){
        this.searchKey11= event.target.value;
         this.handleKeyChange11();
    }
    handleKeyChange11(event) {
       getProductBrasilCondition({oppId:this.recordId})
       .then(res=>{
           this.isShowProductHeader = res.isShowProductHeader;
           this.isShowProductAgg_brasil11 = res.isShowProductAgg_brasil12; 
           if(res.isShowProductAgg_brasil12==true){
             this.sapMatCodeType="012";
              getQLRecordsForBrazilTab( { oppId: this.recordId,searchKey: this.searchKey11,sapMatJs:this.sapMatCodeType})
              .then(data => {
               this.tableData11 = data.map(record => Object.assign({ "SBQQ__Product__r.Name": record.SBQQ__Product__r.Name, "prodName": '/' + record.SBQQ__Product__c},{ "SBQQ__Product__r.SAP_Material_Code_Type__c":record.SBQQ__Product__r.SAP_Material_Code_Type__c, "SapCodeType": ( record.SBQQ__Product__r.SAP_Material_Code_Type__c)},{ "SBQQ__Product__r.SAP_Material_Code__c":record.SBQQ__Product__r.SAP_Material_Code__c, "SapCode":  record.SBQQ__Product__r.SAP_Material_Code__c}, record)); 
               this.totalRecountCount11 = data.length;
               this.totalPage11 = Math.ceil(this.totalRecountCount11 / this.pageSize11);  
               this.finalTableData11 = this.tableData11.slice(0, this.pageSize11);
               this.endingRecord11= this.pageSize11;     
           }) } 
        })}
    reloadData_L(event){
        this.searchKey12= event.target.value;
         this.handleKeyChange12();
    }
    handleKeyChange12(event) {
       getProductBrasilCondition({oppId:this.recordId})
       .then(res=>{
           this.isShowProductHeader = res.isShowProductHeader;
           this.isShowProductAgg_brasil12 = res.isShowProductAgg_brasil13; 
           if(res.isShowProductAgg_brasil13==true){
             this.sapMatCodeType="013";
              getQLRecordsForBrazilTab( { oppId: this.recordId,searchKey: this.searchKey12,sapMatJs:this.sapMatCodeType})
              .then(data => {
               this.tableData12 = data.map(record => Object.assign({ "SBQQ__Product__r.Name": record.SBQQ__Product__r.Name, "prodName": '/' + record.SBQQ__Product__c},{ "SBQQ__Product__r.SAP_Material_Code_Type__c":record.SBQQ__Product__r.SAP_Material_Code_Type__c, "SapCodeType": ( record.SBQQ__Product__r.SAP_Material_Code_Type__c)},{ "SBQQ__Product__r.SAP_Material_Code__c":record.SBQQ__Product__r.SAP_Material_Code__c, "SapCode":  record.SBQQ__Product__r.SAP_Material_Code__c}, record)); 
               this.totalRecountCount12 = data.length;
               this.totalPage12 = Math.ceil(this.totalRecountCount12 / this.pageSize12);  
               this.finalTableData12 = this.tableData12.slice(0, this.pageSize12);
               this.endingRecord12= this.pageSize12;     
           }) } 
        })}
    reloadData_M(event){
        this.searchKey13= event.target.value;
         this.handleKeyChange13();
    }
    handleKeyChange13(event) {
       getProductBrasilCondition({oppId:this.recordId})
       .then(res=>{
           this.isShowProductHeader = res.isShowProductHeader;
           this.isShowProductAgg_brasil13 = res.isShowProductAgg_brasil14; 
           if(res.isShowProductAgg_brasil14==true){
             this.sapMatCodeType="014";
              getQLRecordsForBrazilTab( { oppId: this.recordId,searchKey: this.searchKey13,sapMatJs:this.sapMatCodeType})
              .then(data => {
               this.tableData13 = data.map(record => Object.assign({ "SBQQ__Product__r.Name": record.SBQQ__Product__r.Name, "prodName": '/' + record.SBQQ__Product__c},{ "SBQQ__Product__r.SAP_Material_Code_Type__c":record.SBQQ__Product__r.SAP_Material_Code_Type__c, "SapCodeType": ( record.SBQQ__Product__r.SAP_Material_Code_Type__c)},{ "SBQQ__Product__r.SAP_Material_Code__c":record.SBQQ__Product__r.SAP_Material_Code__c, "SapCode":  record.SBQQ__Product__r.SAP_Material_Code__c}, record)); 
               console.log('Total Data Dup..'+JSON.stringify(data));
               this.totalRecountCount13 = data.length;
               this.totalPage13 = Math.ceil(this.totalRecountCount13 / this.pageSize13);  
               this.finalTableData13 = this.tableData13.slice(0, this.pageSize13);
               this.endingRecord13= this.pageSize13;     
           }) } 
             })   }
    reloadData_N(event){
        this.searchKey14= event.target.value;
         this.handleKeyChange14();
    }
    handleKeyChange14(event) {
       getProductBrasilCondition({oppId:this.recordId})
       .then(res=>{
           this.isShowProductHeader = res.isShowProductHeader;
           this.isShowProductAgg_brasil14 = res.isShowProductAgg_brasil15; 
           if(res.isShowProductAgg_brasil15==true){
             this.sapMatCodeType="015";
              getQLRecordsForBrazilTab( { oppId: this.recordId,searchKey: this.searchKey14,sapMatJs:this.sapMatCodeType})
              .then(data => {
               this.tableData14 = data.map(record => Object.assign({ "SBQQ__Product__r.Name": record.SBQQ__Product__r.Name, "prodName": '/' + record.SBQQ__Product__c},{ "SBQQ__Product__r.SAP_Material_Code_Type__c":record.SBQQ__Product__r.SAP_Material_Code_Type__c, "SapCodeType": ( record.SBQQ__Product__r.SAP_Material_Code_Type__c)},{ "SBQQ__Product__r.SAP_Material_Code__c":record.SBQQ__Product__r.SAP_Material_Code__c, "SapCode":  record.SBQQ__Product__r.SAP_Material_Code__c}, record)); 
               this.totalRecountCount14 = data.length;
               this.totalPage14 = Math.ceil(this.totalRecountCount14 / this.pageSize14);  
               this.finalTableData14 = this.tableData14.slice(0, this.pageSize14);
               this.endingRecord14= this.pageSize14;     
           }) } 
        })} 
    reloadData_O(event){
        this.searchKey15= event.target.value;
         this.handleKeyChange15();
    } 
    handleKeyChange15(event) {
       getProductBrasilCondition({oppId:this.recordId})
       .then(res=>{
           this.isShowProductHeader = res.isShowProductHeader;
           this.isShowProductAgg_brasil15 = res.isShowProductAgg_brasil16; 
           if(res.isShowProductAgg_brasil16==true){
             this.sapMatCodeType="016";
              getQLRecordsForBrazilTab( { oppId: this.recordId,searchKey: this.searchKey15,sapMatJs:this.sapMatCodeType})
              .then(data => {
               this.tableData15 = data.map(record => Object.assign({ "SBQQ__Product__r.Name": record.SBQQ__Product__r.Name, "prodName": '/' + record.SBQQ__Product__c},{ "SBQQ__Product__r.SAP_Material_Code_Type__c":record.SBQQ__Product__r.SAP_Material_Code_Type__c, "SapCodeType": ( record.SBQQ__Product__r.SAP_Material_Code_Type__c)},{ "SBQQ__Product__r.SAP_Material_Code__c":record.SBQQ__Product__r.SAP_Material_Code__c, "SapCode":  record.SBQQ__Product__r.SAP_Material_Code__c}, record)); 
               this.totalRecountCount15 = data.length;
               this.totalPage15 = Math.ceil(this.totalRecountCount15 / this.pageSize15);  
               this.finalTableData15 = this.tableData15.slice(0, this.pageSize15);
               this.endingRecord15= this.pageSize15;     
           })
           } })  
    }
    reloadData_P(event){
            this.searchKey16= event.target.value;
             this.handleKeyChange16();
        }
        handleKeyChange16(event) {
           getProductBrasilCondition({oppId:this.recordId})
           .then(res=>{
               this.isShowProductHeader = res.isShowProductHeader;
               this.isShowProductAgg_brasil16 = res.isShowProductAgg_brasil17; 
               if(res.isShowProductAgg_brasil17==true){
                 this.sapMatCodeType="017";
                  getQLRecordsForBrazilTab( { oppId: this.recordId,searchKey: this.searchKey16,sapMatJs:this.sapMatCodeType})
                  .then(data => {
                   this.tableData16 = data.map(record => Object.assign({ "SBQQ__Product__r.Name": record.SBQQ__Product__r.Name, "prodName": '/' + record.SBQQ__Product__c},{ "SBQQ__Product__r.SAP_Material_Code_Type__c":record.SBQQ__Product__r.SAP_Material_Code_Type__c, "SapCodeType": ( record.SBQQ__Product__r.SAP_Material_Code_Type__c)},{ "SBQQ__Product__r.SAP_Material_Code__c":record.SBQQ__Product__r.SAP_Material_Code__c, "SapCode":  record.SBQQ__Product__r.SAP_Material_Code__c}, record)); 
                   this.totalRecountCount16 = data.length;
                   this.totalPage16 = Math.ceil(this.totalRecountCount16 / this.pageSize16);  
                   this.finalTableData16 = this.tableData16.slice(0, this.pageSize16);
                   this.endingRecord16= this.pageSize16;     
               })
               } 
            })  
        }
    reloadData_Q(event){
            this.searchKey17= event.target.value;
             this.handleKeyChange17();
        }
        handleKeyChange17(event) {
           getProductBrasilCondition({oppId:this.recordId})
           .then(res=>{
               this.isShowProductHeader = res.isShowProductHeader;
               this.isShowProductAgg_brasil17 = res.isShowProductAgg_brasil18; 
               if(res.isShowProductAgg_brasil18==true){
                 this.sapMatCodeType="018";
                  getQLRecordsForBrazilTab( { oppId: this.recordId,searchKey: this.searchKey17,sapMatJs:this.sapMatCodeType})
                  .then(data => {
                   this.tableData17 = data.map(record => Object.assign({ "SBQQ__Product__r.Name": record.SBQQ__Product__r.Name, "prodName": '/' + record.SBQQ__Product__c},{ "SBQQ__Product__r.SAP_Material_Code_Type__c":record.SBQQ__Product__r.SAP_Material_Code_Type__c, "SapCodeType": ( record.SBQQ__Product__r.SAP_Material_Code_Type__c)},{ "SBQQ__Product__r.SAP_Material_Code__c":record.SBQQ__Product__r.SAP_Material_Code__c, "SapCode":  record.SBQQ__Product__r.SAP_Material_Code__c}, record)); 
                   this.totalRecountCount17 = data.length;
                   this.totalPage17 = Math.ceil(this.totalRecountCount17 / this.pageSize17);  
                   this.finalTableData17 = this.tableData17.slice(0, this.pageSize17);
                   this.endingRecord17= this.pageSize17;     
               })
               }  })  
        }
    reloadData_R(event){
            this.searchKey18= event.target.value;
             this.handleKeyChange18();
        }
        handleKeyChange18(event) {
           getProductBrasilCondition({oppId:this.recordId})
           .then(res=>{
               this.isShowProductHeader = res.isShowProductHeader;
               this.isShowProductAgg_brasil18 = res.isShowProductAgg_brasil19; 
               if(res.isShowProductAgg_brasil19==true){
                 this.sapMatCodeType="019";
                  getQLRecordsForBrazilTab( { oppId: this.recordId,searchKey: this.searchKey18,sapMatJs:this.sapMatCodeType})
                  .then(data => {
                   this.tableData18 = data.map(record => Object.assign({ "SBQQ__Product__r.Name": record.SBQQ__Product__r.Name, "prodName": '/' + record.SBQQ__Product__c},{ "SBQQ__Product__r.SAP_Material_Code_Type__c":record.SBQQ__Product__r.SAP_Material_Code_Type__c, "SapCodeType": ( record.SBQQ__Product__r.SAP_Material_Code_Type__c)},{ "SBQQ__Product__r.SAP_Material_Code__c":record.SBQQ__Product__r.SAP_Material_Code__c, "SapCode":  record.SBQQ__Product__r.SAP_Material_Code__c}, record)); 
                   console.log('Total Data Dup..'+JSON.stringify(data));
                   this.totalRecountCount18 = data.length;
                   this.totalPage18 = Math.ceil(this.totalRecountCount18 / this.pageSize18);  
                   this.finalTableData18 = this.tableData18.slice(0, this.pageSize18);
                   this.endingRecord18= this.pageSize18;     
               })
               } 
            })  
        }
    reloadData_S(event){
            this.searchKey19= event.target.value;
             this.handleKeyChange19();
        }
        handleKeyChange19(event) {
           getProductBrasilCondition({oppId:this.recordId})
           .then(res=>{
               this.isShowProductHeader = res.isShowProductHeader;
               this.isShowProductAgg_brasil19 = res.isShowProductAgg_brasil20; 
               if(res.isShowProductAgg_brasil20==true){
                 this.sapMatCodeType="020";
                  getQLRecordsForBrazilTab( { oppId: this.recordId,searchKey: this.searchKey19,sapMatJs:this.sapMatCodeType})
                  .then(data => {
                   this.tableData19 = data.map(record => Object.assign({ "SBQQ__Product__r.Name": record.SBQQ__Product__r.Name, "prodName": '/' + record.SBQQ__Product__c},{ "SBQQ__Product__r.SAP_Material_Code_Type__c":record.SBQQ__Product__r.SAP_Material_Code_Type__c, "SapCodeType": ( record.SBQQ__Product__r.SAP_Material_Code_Type__c)},{ "SBQQ__Product__r.SAP_Material_Code__c":record.SBQQ__Product__r.SAP_Material_Code__c, "SapCode":  record.SBQQ__Product__r.SAP_Material_Code__c}, record)); 
                   this.totalRecountCount19 = data.length;
                   this.totalPage19 = Math.ceil(this.totalRecountCount19 / this.pageSize19);  
                   this.finalTableData19 = this.tableData19.slice(0, this.pageSize19);
                   this.endingRecord19= this.pageSize19;     
               })
               } })   
        }
    reloadData_T(event){
            this.searchKey20= event.target.value;
             this.handleKeyChange20();
        }
        handleKeyChange20(event) {
           getProductBrasilCondition({oppId:this.recordId})
           .then(res=>{
               this.isShowProductHeader = res.isShowProductHeader;
               this.isShowProductAgg_brasil20 = res.isShowProductAgg_brasil21; 
               if(res.isShowProductAgg_brasil21==true){
                 this.sapMatCodeType="021";
                  getQLRecordsForBrazilTab( { oppId: this.recordId,searchKey: this.searchKey20,sapMatJs:this.sapMatCodeType})
                  .then(data => {
                   this.tableData20 = data.map(record => Object.assign({ "SBQQ__Product__r.Name": record.SBQQ__Product__r.Name, "prodName": '/' + record.SBQQ__Product__c},{ "SBQQ__Product__r.SAP_Material_Code_Type__c":record.SBQQ__Product__r.SAP_Material_Code_Type__c, "SapCodeType": ( record.SBQQ__Product__r.SAP_Material_Code_Type__c)},{ "SBQQ__Product__r.SAP_Material_Code__c":record.SBQQ__Product__r.SAP_Material_Code__c, "SapCode":  record.SBQQ__Product__r.SAP_Material_Code__c}, record)); 
                   console.log('Total Data Dup..'+JSON.stringify(data));
                   this.totalRecountCount20 = data.length;
                   this.totalPage20 = Math.ceil(this.totalRecountCount20 / this.pageSize20);  
                   this.finalTableData20 = this.tableData20.slice(0, this.pageSize20);
                   this.endingRecord20= this.pageSize20;     
               })} 
            })} 
    reloadData_U(event){
            this.searchKey21= event.target.value;
             this.handleKeyChange21();
        }
        handleKeyChange21(event) {
           getProductBrasilCondition({oppId:this.recordId})
           .then(res=>{
               this.isShowProductHeader = res.isShowProductHeader;
               this.isShowProductAgg_brasil21 = res.isShowProductAgg_brasil22; 
               if(res.isShowProductAgg_brasil22==true){
                 this.sapMatCodeType="022";
                  getQLRecordsForBrazilTab( { oppId: this.recordId,searchKey: this.searchKey21,sapMatJs:this.sapMatCodeType})
                  .then(data => {
                   this.tableData21 = data.map(record => Object.assign({ "SBQQ__Product__r.Name": record.SBQQ__Product__r.Name, "prodName": '/' + record.SBQQ__Product__c},{ "SBQQ__Product__r.SAP_Material_Code_Type__c":record.SBQQ__Product__r.SAP_Material_Code_Type__c, "SapCodeType": ( record.SBQQ__Product__r.SAP_Material_Code_Type__c)},{ "SBQQ__Product__r.SAP_Material_Code__c":record.SBQQ__Product__r.SAP_Material_Code__c, "SapCode":  record.SBQQ__Product__r.SAP_Material_Code__c}, record)); 
                   this.totalRecountCount21 = data.length;
                   this.totalPage21 = Math.ceil(this.totalRecountCount21 / this.pageSize21);  
                   this.finalTableData21 = this.tableData21.slice(0, this.pageSize21);
                   this.endingRecord21= this.pageSize21;     
               })} 
            }) }
    reloadData_V(event){
            this.searchKey22= event.target.value;
             this.handleKeyChange22();
        }
        handleKeyChange22(event) {
           getProductBrasilCondition({oppId:this.recordId})
           .then(res=>{
               this.isShowProductHeader = res.isShowProductHeader;
               this.isShowProductAgg_brasil22 = res.isShowProductAgg_brasil23; 
               if(res.isShowProductAgg_brasil23==true){
                 this.sapMatCodeType="023";
                  getQLRecordsForBrazilTab( { oppId: this.recordId,searchKey: this.searchKey22,sapMatJs:this.sapMatCodeType})
                  .then(data => {
                   this.tableData22 = data.map(record => Object.assign({ "SBQQ__Product__r.Name": record.SBQQ__Product__r.Name, "prodName": '/' + record.SBQQ__Product__c},{ "SBQQ__Product__r.SAP_Material_Code_Type__c":record.SBQQ__Product__r.SAP_Material_Code_Type__c, "SapCodeType": ( record.SBQQ__Product__r.SAP_Material_Code_Type__c)},{ "SBQQ__Product__r.SAP_Material_Code__c":record.SBQQ__Product__r.SAP_Material_Code__c, "SapCode":  record.SBQQ__Product__r.SAP_Material_Code__c}, record)); 
                   this.totalRecountCount22 = data.length;
                   this.totalPage22 = Math.ceil(this.totalRecountCount22 / this.pageSize22);  
                   this.finalTableData22 = this.tableData22.slice(0, this.pageSize22);
                   this.endingRecord22= this.pageSize22;     
               })} 
            }) }  
    reloadData_W(event){
            this.searchKey23= event.target.value;
             this.handleKeyChange23();
        }
        handleKeyChange23(event) {
           getProductBrasilCondition({oppId:this.recordId})
           .then(res=>{
               this.isShowProductHeader = res.isShowProductHeader;
               this.isShowProductAgg_brasil23 = res.isShowProductAgg_brasil24; 
               if(res.isShowProductAgg_brasil24==true){
                 this.sapMatCodeType="024";
                  getQLRecordsForBrazilTab( { oppId: this.recordId,searchKey: this.searchKey23,sapMatJs:this.sapMatCodeType})
                  .then(data => {
                   this.tableData23 = data.map(record => Object.assign({ "SBQQ__Product__r.Name": record.SBQQ__Product__r.Name, "prodName": '/' + record.SBQQ__Product__c},{ "SBQQ__Product__r.SAP_Material_Code_Type__c":record.SBQQ__Product__r.SAP_Material_Code_Type__c, "SapCodeType": ( record.SBQQ__Product__r.SAP_Material_Code_Type__c)},{ "SBQQ__Product__r.SAP_Material_Code__c":record.SBQQ__Product__r.SAP_Material_Code__c, "SapCode":  record.SBQQ__Product__r.SAP_Material_Code__c}, record)); 
                   this.totalRecountCount23 = data.length;
                   this.totalPage23 = Math.ceil(this.totalRecountCount23 / this.pageSize23);  
                   this.finalTableData23 = this.tableData23.slice(0, this.pageSize23);
                   this.endingRecord23= this.pageSize23;     
               }) } 
            }) }
    reloadData_X(event){
            this.searchKey24= event.target.value;
             this.handleKeyChange24();
        }
        handleKeyChange24(event) {
           getProductBrasilCondition({oppId:this.recordId})
           .then(res=>{
               this.isShowProductHeader = res.isShowProductHeader;
               this.isShowProductAgg_brasil24 = res.isShowProductAgg_brasil25; 
               if(res.isShowProductAgg_brasil25==true){
                 this.sapMatCodeType="025";
                  getQLRecordsForBrazilTab( { oppId: this.recordId,searchKey: this.searchKey24,sapMatJs:this.sapMatCodeType})
                  .then(data => {
                   this.tableData24 = data.map(record => Object.assign({ "SBQQ__Product__r.Name": record.SBQQ__Product__r.Name, "prodName": '/' + record.SBQQ__Product__c},{ "SBQQ__Product__r.SAP_Material_Code_Type__c":record.SBQQ__Product__r.SAP_Material_Code_Type__c, "SapCodeType": ( record.SBQQ__Product__r.SAP_Material_Code_Type__c)},{ "SBQQ__Product__r.SAP_Material_Code__c":record.SBQQ__Product__r.SAP_Material_Code__c, "SapCode":  record.SBQQ__Product__r.SAP_Material_Code__c}, record)); 
                   console.log('Total Data Dup..'+JSON.stringify(data));
                   this.totalRecountCount24 = data.length;
                   this.totalPage24 = Math.ceil(this.totalRecountCount24 / this.pageSize24);  
                   this.finalTableData24 = this.tableData24.slice(0, this.pageSize24);
                   this.endingRecord24= this.pageSize24;     
               })}
      }) }
    reloadData_Y(event){
            this.searchKey25= event.target.value;
             this.handleKeyChange25();
        }
        handleKeyChange25(event) {
           getProductBrasilCondition({oppId:this.recordId})
           .then(res=>{
               this.isShowProductHeader = res.isShowProductHeader;
               this.isShowProductAgg_brasil25 = res.isShowProductAgg_brasil26; 
               if(res.isShowProductAgg_brasil26==true){
                 this.sapMatCodeType="026";
                  getQLRecordsForBrazilTab( { oppId: this.recordId,searchKey: this.searchKey25,sapMatJs:this.sapMatCodeType})
                  .then(data => {
                   this.tableData25 = data.map(record => Object.assign({ "SBQQ__Product__r.Name": record.SBQQ__Product__r.Name, "prodName": '/' + record.SBQQ__Product__c},{ "SBQQ__Product__r.SAP_Material_Code_Type__c":record.SBQQ__Product__r.SAP_Material_Code_Type__c, "SapCodeType": ( record.SBQQ__Product__r.SAP_Material_Code_Type__c)},{ "SBQQ__Product__r.SAP_Material_Code__c":record.SBQQ__Product__r.SAP_Material_Code__c, "SapCode":  record.SBQQ__Product__r.SAP_Material_Code__c}, record)); 
                   this.totalRecountCount25 = data.length;
                   this.totalPage25 = Math.ceil(this.totalRecountCount25 / this.pageSize25);  
                   this.finalTableData25 = this.tableData25.slice(0, this.pageSize25);
                   this.endingRecord25= this.pageSize25;     
               }) } 
            }) }

        get pagesizeList(){
            return this.array;
        }
        get pagesizeList1(){
            return this.array;
        }
        get pagesizeList2(){
         return this.array;
        }
        get pagesizeList3(){
         return this.array;
        }
        get pagesizeList4(){
            return this.array;
        }
        get pagesizeList5(){
            return this.array;
        }
        get pagesizeList6(){
            return this.array;
        }
        get pagesizeList7(){
            return this.array;
        }
        get pagesizeList8(){
            return this.array;
        }
        get pagesizeList9(){
            return this.array;
        }
        get pagesizeList10(){
            return this.array;
        }
        get pagesizeList11(){
            return this.array;
        }
        get pagesizeList12(){
            return this.array;
        }
        get pagesizeList13(){
            return this.array;
        }
        get pagesizeList14(){
            return this.array;
        }
        get pagesizeList15(){
            return this.array;
        }
        get pagesizeList16(){
            return this.array;
        }
        get pagesizeList17(){
            return this.array;
        }
        get pagesizeList18(){
            return this.array;
        }
        get pagesizeList19(){
            return this.array;
        }
        get pagesizeList20(){
            return this.array;
        }
        get pagesizeList21(){
            return this.array;
        }
        get pagesizeList22(){
            return this.array;
        }
        get pagesizeList23(){
            return this.array;
        }
        get pagesizeList24(){
            return this.array; }
        get pagesizeList25(){
            return this.array; }     
   onPageSizeChange(event){
        this.pagesizeToVisible=parseInt(event.detail.value);
        this.pageSize= this.pagesizeToVisible;
        this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize);
            this.finalTableData = this.tableData.slice(0, this.pageSize);
            this.endingRecord = this.pageSize;
            this.page= 1;
            this.displayRecordPerPage(this.page);     
    }
    onPageSizeChange1(event){
        this.pagesizeToVisible1=parseInt(event.detail.value);
        this.pageSize1= this.pagesizeToVisible1;
        this.totalPage1 = Math.ceil(this.totalRecountCount1 / this.pageSize1);
            this.finalTableData1 = this.tableData1.slice(0, this.pageSize1);
            this.endingRecord1 = this.pageSize1;
            this.page1= 1;
            this.displayRecordPerPage1(this.page1);     
    }
    onPageSizeChange2(event){
        this.pagesizeToVisible2=parseInt(event.detail.value);
        this.pageSize2= this.pagesizeToVisible2;
        this.totalPage2 = Math.ceil(this.totalRecountCount2 / this.pageSize2);
            this.finalTableData2 = this.tableData2.slice(0, this.pageSize2);
            this.endingRecord2 = this.pageSize2;
            this.page2= 1;
            this.displayRecordPerPage2(this.page2);     
    }
    onPageSizeChange3(event){
        this.pagesizeToVisible3=parseInt(event.detail.value);
        this.pageSize3= this.pagesizeToVisible2;
        this.totalPage3 = Math.ceil(this.totalRecountCount3 / this.pageSize3);
            this.finalTableData3 = this.tableData3.slice(0, this.pageSize3);
            this.endingRecord3 = this.pageSize3;
            this.page3= 1;
            this.displayRecordPerPage3(this.page3);     
    }
    onPageSizeChange4(event){
        this.pagesizeToVisible4=parseInt(event.detail.value);
        this.pageSize4= this.pagesizeToVisible4;
        this.totalPage4 = Math.ceil(this.totalRecountCount4 / this.pageSize4);
            this.finalTableData4 = this.tableData4.slice(0, this.pageSize4);
            this.endingRecord4 = this.pageSize4;
            this.page4= 1;
            this.displayRecordPerPage4(this.page4);     
    }
    onPageSizeChange5(event){
        this.pagesizeToVisible5=parseInt(event.detail.value);
        this.pageSize5= this.pagesizeToVisible5;
        this.totalPage5 = Math.ceil(this.totalRecountCount5 / this.pageSize5);
            this.finalTableData5 = this.tableData5.slice(0, this.pageSize5);
            this.endingRecord5 = this.pageSize5;
            this.page5= 1;
            this.displayRecordPerPage5(this.page5);     
    }
    onPageSizeChange6(event){
        this.pagesizeToVisible6=parseInt(event.detail.value);
        this.pageSize6= this.pagesizeToVisible6;
        this.totalPage6 = Math.ceil(this.totalRecountCount6 / this.pageSize6);
            this.finalTableData6 = this.tableData6.slice(0, this.pageSize6);
            this.endingRecord6 = this.pageSize6;
            this.page6= 1;
            this.displayRecordPerPage6(this.page6);     
    }
    onPageSizeChange7(event){
        this.pagesizeToVisible7=parseInt(event.detail.value);
        this.pageSize7= this.pagesizeToVisible7;
        this.totalPage7 = Math.ceil(this.totalRecountCount7 / this.pageSize7);
            this.finalTableData7 = this.tableData7.slice(0, this.pageSize7);
            this.endingRecord7 = this.pageSize7;
            this.page7= 1;
            this.displayRecordPerPage7(this.page7);     
    }
    onPageSizeChange8(event){
        this.pagesizeToVisible8=parseInt(event.detail.value);
        this.pageSize8= this.pagesizeToVisible8;
        this.totalPage8 = Math.ceil(this.totalRecountCount8 / this.pageSize8);
            this.finalTableData8 = this.tableData8.slice(0, this.pageSize8);
            this.endingRecord8 = this.pageSize8;
            this.page8= 1;
            this.displayRecordPerPage8(this.page8);     
    }
    onPageSizeChange9(event){
        this.pagesizeToVisible9=parseInt(event.detail.value);
        this.pageSize9= this.pagesizeToVisible9;
        this.totalPage9 = Math.ceil(this.totalRecountCount9 / this.pageSize9);
            this.finalTableData9 = this.tableData9.slice(0, this.pageSize9);
            this.endingRecord9 = this.pageSize9;
            this.page9= 1;
            this.displayRecordPerPage9(this.page9);     
    }

    
    onPageSizeChange10(event){
        this.pagesizeToVisible10=parseInt(event.detail.value);
        this.pageSize10= this.pagesizeToVisible10;
        this.totalPage10 = Math.ceil(this.totalRecountCount10 / this.pageSize10);
            this.finalTableData10 = this.tableData10.slice(0, this.pageSize10);
            this.endingRecord10 = this.pageSize10;
            this.page10= 1;
            this.displayRecordPerPage10(this.page10);     
    }

    onPageSizeChange11(event){
        this.pagesizeToVisible11=parseInt(event.detail.value);
        this.pageSize11= this.pagesizeToVisible11;
        this.totalPage11 = Math.ceil(this.totalRecountCount11 / this.pageSize11);
            this.finalTableData11 = this.tableData11.slice(0, this.pageSize11);
            this.endingRecord11 = this.pageSize11;
            this.page11= 1;
            this.displayRecordPerPage11(this.page11);     
    }
    onPageSizeChange12(event){
        this.pagesizeToVisible12=parseInt(event.detail.value);
        this.pageSize12= this.pagesizeToVisible12;
        this.totalPage12 = Math.ceil(this.totalRecountCount12 / this.pageSize12);
            this.finalTableData12 = this.tableData12.slice(0, this.pageSize12);
            this.endingRecord12 = this.pageSize12;
            this.page12= 1;
            this.displayRecordPerPage12(this.page12);     
    }
    onPageSizeChange13(event){
        this.pagesizeToVisible13=parseInt(event.detail.value);
        this.pageSize13= this.pagesizeToVisible13;
        this.totalPage13 = Math.ceil(this.totalRecountCount13 / this.pageSize13);
            this.finalTableData13 = this.tableData13.slice(0, this.pageSize13);
            this.endingRecord13 = this.pageSize13;
            this.page13= 1;
            this.displayRecordPerPage13(this.page13);     
    }
    onPageSizeChange14(event){
        this.pagesizeToVisible14=parseInt(event.detail.value);
        this.pageSize14= this.pagesizeToVisible14;
        this.totalPage14 = Math.ceil(this.totalRecountCount14 / this.pageSize14);
            this.finalTableData14 = this.tableData14.slice(0, this.pageSize14);
            this.endingRecord14 = this.pageSize14;
            this.page14= 1;
            this.displayRecordPerPage14(this.page14);     
    }
    onPageSizeChange15(event){
        this.pagesizeToVisible15=parseInt(event.detail.value);
        this.pageSize15= this.pagesizeToVisible15;
        this.totalPage15 = Math.ceil(this.totalRecountCount15 / this.pageSize15);
            this.finalTableData15 = this.tableData15.slice(0, this.pageSize15);
            this.endingRecord15 = this.pageSize15;
            this.page15= 1;
            this.displayRecordPerPage15(this.page15);     
    }
    onPageSizeChange16(event){
        this.pagesizeToVisible16=parseInt(event.detail.value);
        this.pageSize16= this.pagesizeToVisible16;
        this.totalPage16 = Math.ceil(this.totalRecountCount16 / this.pageSize16);
            this.finalTableData16 = this.tableData16.slice(0, this.pageSize16);
            this.endingRecord16 = this.pageSize16;
            this.page16= 1;
            this.displayRecordPerPage16(this.page16);     
    }
    onPageSizeChange17(event){
        this.pagesizeToVisible17=parseInt(event.detail.value);
        this.pageSize17= this.pagesizeToVisible17;
        this.totalPage17 = Math.ceil(this.totalRecountCount17 / this.pageSize17);
            this.finalTableData17 = this.tableData17.slice(0, this.pageSize17);
            this.endingRecord17 = this.pageSize17;
            this.page17= 1;
            this.displayRecordPerPage17(this.page17);     
    }
    onPageSizeChange18(event){
        this.pagesizeToVisible18=parseInt(event.detail.value);
        this.pageSize18= this.pagesizeToVisible18;
        this.totalPage18 = Math.ceil(this.totalRecountCount18 / this.pageSize18);
            this.finalTableData18 = this.tableData18.slice(0, this.pageSize18);
            this.endingRecord18 = this.pageSize18;
            this.page18= 1;
            this.displayRecordPerPage18(this.page18);     
    }
    onPageSizeChange19(event){
        this.pagesizeToVisible19=parseInt(event.detail.value);
        this.pageSize19= this.pagesizeToVisible19;
        this.totalPage19 = Math.ceil(this.totalRecountCount19 / this.pageSize19);
            this.finalTableData19 = this.tableData19.slice(0, this.pageSize19);
            this.endingRecord19 = this.pageSize19;
            this.page19= 1;
            this.displayRecordPerPage19(this.page19);     
    }
    onPageSizeChange20(event){
        this.pagesizeToVisible20=parseInt(event.detail.value);
        this.pageSize20= this.pagesizeToVisible20;
        this.totalPage20 = Math.ceil(this.totalRecountCount20 / this.pageSize20);
            this.finalTableData20 = this.tableData20.slice(0, this.pageSize20);
            this.endingRecord20 = this.pageSize20;
            this.page20= 1;
            this.displayRecordPerPage20(this.page20);     
    }
    onPageSizeChange21(event){
        this.pagesizeToVisible21=parseInt(event.detail.value);
        this.pageSize21= this.pagesizeToVisible21;
        this.totalPage21 = Math.ceil(this.totalRecountCount21 / this.pageSize21);
            this.finalTableData21 = this.tableData21.slice(0, this.pageSize21);
            this.endingRecord21 = this.pageSize21;
            this.page21= 1;
            this.displayRecordPerPage21(this.page21);     
    }
    onPageSizeChange22(event){
        this.pagesizeToVisible22=parseInt(event.detail.value);
        this.pageSize22= this.pagesizeToVisible22;
        this.totalPage22 = Math.ceil(this.totalRecountCount22 / this.pageSize22);
            this.finalTableData22 = this.tableData22.slice(0, this.pageSize22);
            this.endingRecord22 = this.pageSize22;
            this.page22= 1;
            this.displayRecordPerPage22(this.page22);     
    }
    onPageSizeChange23(event){
        this.pagesizeToVisible23=parseInt(event.detail.value);
        this.pageSize23= this.pagesizeToVisible23;
        this.totalPage23 = Math.ceil(this.totalRecountCount23 / this.pageSize23);
            this.finalTableData23 = this.tableData23.slice(0, this.pageSize23);
            this.endingRecord23 = this.pageSize23;
            this.page23= 1;
            this.displayRecordPerPage23(this.page23);     
    }
    onPageSizeChange24(event){
        this.pagesizeToVisible24=parseInt(event.detail.value);
        this.pageSize24= this.pagesizeToVisible24;
        this.totalPage24 = Math.ceil(this.totalRecountCount24 / this.pageSize24);
            this.finalTableData24 = this.tableData24.slice(0, this.pageSize24);
            this.endingRecord24 = this.pageSize24;
            this.page24= 1;
            this.displayRecordPerPage24(this.page24);     
    }
    onPageSizeChange25(event){
        this.pagesizeToVisible25=parseInt(event.detail.value);
        this.pageSize25= this.pagesizeToVisible25;
        this.totalPage25 = Math.ceil(this.totalRecountCount25 / this.pageSize25);
            this.finalTableData25 = this.tableData25.slice(0, this.pageSize25);
            this.endingRecord25 = this.pageSize25;
            this.page25= 1;
            this.displayRecordPerPage25(this.page25);     
    }
    getisoCode(){
        getRecord({objectName:'Opportunity',allFields:'ISO_Code__c,Amount_Custom__c',recordId:this.recordId})
        .then(res=>{
            if(res.length>0){
                this.isoCode = res[0].ISO_Code__c;
            }
        })}   
}