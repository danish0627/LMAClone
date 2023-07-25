/* eslint-disable no-alert */
/* eslint-disable no-console */
/*
Created By	 : Girikon(Mukesh[124])
Created On	 : 4 Sept, ‎2019
@description : This component used to display lead Interest Level and Nature of Business on Opportunity Record Page
Modified By	: Yash Gupta [10/3/2019]
*/

import { LightningElement, api, track } from 'lwc';
import getRecordDetail from '@salesforce/apex/CommonTableController.getRecordDetail';
import getExpocadForEventStats from '@salesforce/apex/ExpocadRentedBooth_LWC.getExpocadForEventStats';
import GetExpocadJsonForEventStats from '@salesforce/apex/ExpocadRentedBooth_LWC.GetExpocadJsonForEventStats';
import getRESTForExpocadAllBooth from '@salesforce/apex/ExpocadRentedBooth_LWC.getRESTForExpocadAllBooth';
import { handleErrors } from 'c/lWCUtility';

const columns = [
    { label: 'Exhibitor Name', fieldName: 'ExhibitorId2', type: 'url',
        typeAttributes: {label: {fieldName:'AccountName'},tooltip:'Open Account', target: '_blank'}
    },
    { label: 'Booth Number', fieldName: 'BoothNumber', type: 'text' },
    { label: 'Dimensions', fieldName: 'Dimensions', type: 'text' },
    { label: 'Area', fieldName: 'Area', type: 'text' },
    { label: 'Display Name Override', fieldName: 'DisplayNameOverride', type: 'text' },
    { label: 'Is Rented', fieldName: 'IsRented', type: 'boolean' }
];


const eventInformationcolumns = [
    { label: 'Total Booths', fieldName: 'TotalBooths', type: 'text' },
    { label: 'Booths Available', fieldName: 'AvailableBooths', type: 'text' },
    { label: 'Total Exhibitors', fieldName: 'TotalExhibitors', type: 'text' },
    { label: 'Booths Rented', fieldName: 'RentedBooths', type: 'text' },
    { label: 'Non-Inventory Booths', fieldName: 'NonInventoryBooths', type: 'text' },
    { label: 'Rented Percentage', fieldName: 'RentedBoothPercentage', type: 'text' }
];

const eventAllBoothscolumns = [
    { label: 'Area', fieldName: 'Area', type: 'text' },
    { label: 'Booth Classes', fieldName: 'BoothClasses', type: 'text' },
    { label: 'Booth Number', fieldName: 'BoothNumber', type: 'text' },
    { label: 'Booth Type', fieldName: 'BoothType', type: 'text' },
    { label: 'Dimensions', fieldName: 'Dimensions', type: 'text' },
    { label: 'DisplayNameOverride', fieldName: 'DisplayNameOverride', type: 'text' },
    { label: 'Exhibitor Name', fieldName: 'ExhibitorId2', type: 'url',
        typeAttributes: {label: {fieldName:'AccountName'},tooltip:'Open Account', target: '_blank'}
    },
    { label: 'IsOnHold', fieldName: 'IsOnHold', type: 'boolean' },
    { label: 'IsRented', fieldName: 'IsRented', type: 'boolean' },
    { label: 'OpenCorners', fieldName: 'OpenCorners', type: 'number' },
    { label: 'OpenSides', fieldName: 'OpenSides', type: 'number' },
    { label: 'Pavilion', fieldName: 'Pavilion', type: 'text' },
    { label: 'Showinshow', fieldName: 'ShowInShow', type: 'text' }
];

const rentedBoothColumns = [
    { label: 'Exhibitor Name', fieldName: 'ExhibitorId2', type: 'url' ,
        typeAttributes: {label: {fieldName:'AccountName'},tooltip:'Open Account', target: '_blank'}
    },
    { label: 'Area', fieldName: 'Area', type: 'text' },
    { label: 'Dimensions', fieldName: 'Dimensions', type: 'text' },
    { label: 'IsRented', fieldName: 'IsRented', type: 'boolean' },
    { label: 'Display Name Override', fieldName: 'DisplayNameOverride', type: 'text' },
    { label: 'Booth Number', fieldName: 'BoothNumber', type: 'text' }
];

export default class CrmExpoCadDeckPage extends LightningElement {

    @api recordId;
    @track eventObj;
    @track yieldCondition;
    @track eventCode;
    @track lstCadDetails;
    @track mapBoothDetails;
    @track mapBoothEventDetails = [];
    @track mapBoothAllEvents;
    @track columns = columns;
    
    @track eventInformationcolumns = eventInformationcolumns;
    @track eventAllBoothscolumns = eventAllBoothscolumns;
    @track spinner;
    @track rentedBoothColumns = rentedBoothColumns;
    @track selectedRows;    

    @track eventAreaChartData;
    @track event1ChartArea;
    @track event2ChartArea;
    @track event3ChartArea;

    /**
     * Description: This method is call at the time of load.
     */
    connectedCallback() {
        this.yieldCondition = 'SBQQ__Quote__r.SBQQ__Opportunity2__r.EventEdition__c = \'' + this.recordId + '\' AND Event_Product_Type__c!=null AND SBQQ__Quote__r.SBQQ__Opportunity2__r.StageName IN (\'Closed Won\',\'Closed Booked\') AND Event_Product_Type__c NOT IN (\'Booth Cancellation\',\'Digital\',\'Premium\',\'Publishing\',\'Sponsorship\',\'Other\') AND SBQQ__Quote__r.SBQQ__Status__c = \'Contract Approved\' AND (NOT SBQQ__Product__r.Name LIKE \'%Booth Package%\') AND (NOT SBQQ__Product__r.Name LIKE \'%Corner%\') GROUP BY SBQQ__Product__r.Name,SBQQ__Product__r.Event_Product_Type__c,currencyIsoCode,SBQQ__Quote__r.SBQQ__Opportunity2__r.EventEdition__r.Measurement__c';
        this.getEventDetail();
    }

    /**
     * Description: This method is fetch the event edition record detail based on selected event edition.
     */
    getEventDetail() {
        this.spinner = true;
        getRecordDetail({ objectName: 'Event_Edition__c', allFields: 'Name,Event_Code__c', recordId: this.recordId })
            .then(resp => {
                if (resp.length > 0) {
                    this.eventObj = resp[0];
                    this.eventCode = resp[0].Event_Code__c;
                    this.handleEventAndAreaInfo();
                }
                this.spinner = false;
            })
            .catch(error => {
                this.spinner = false;
                handleErrors(this, error);
            })
    }

    /**
     * Description: This method will call once user click on booth details tab.
     */
    handleExpocadBoothDetails() {
        this.spinner = true;
        getExpocadForEventStats({ eventCode: this.eventCode })
            .then(res => {
                let data = JSON.parse(JSON.stringify(res));
                const accList = data.lstAcc;
                let accId = [];
                accList.forEach(item => {
                    accId.push(item.Id);
                });

                data.lstExpoBooth.forEach((item,i)=>{
                    item.myId = 'A'+i;
                    if(accId.length>0 && accId.indexOf(item.ExhibitorId)>=0){
                        accList.forEach(acc=>{
                            if(acc.Id===item.ExhibitorId){
                                item.ExhibitorId2 = '/'+item.ExhibitorId;
                                item.AccountName = acc.Name;
                            }
                        })
                    }                    
                })
                
                this.mapBoothDetails = data.lstExpoBooth;
                this.spinner = false;
            })
            .catch(error => {
                handleErrors(this, error);
                this.spinner = false;
            })
    }


    @track eventAreacolumns =  [
        { label: 'Total Booth Area', fieldName: 'TotalBoothArea', type: 'text' },
        { label: 'Available Booth Area', fieldName: 'AvailableBoothArea', type: 'text' },
        { label: 'Rented Booth Area', fieldName: 'RentedBoothArea', type: 'text' },
        { label: 'Percentage Rented', fieldName: 'RentedBoothPercentage', type: 'text' }
    ];
    /**
      * Description: This method will call once user click on booth details tab.
      */
    handleEventAndAreaInfo() {
        GetExpocadJsonForEventStats({ eventCode: this.eventCode })
            .then(data => {                
                this.mapBoothEventDetails = JSON.parse(JSON.stringify(data.lstExpoBooth1));
                console.log(JSON.stringify(this.mapBoothEventDetails));
                if(this.mapBoothEventDetails && Array.isArray(this.mapBoothEventDetails) && this.mapBoothEventDetails.length>0){
                    this.eventAreaChartData = [
                        {'expr0':parseFloat(this.mapBoothEventDetails[0].RentedBoothArea,10),'Name':'Rented Booths '+this.mapBoothEventDetails[0].RentedBooths},
                        {'expr0':parseFloat(this.mapBoothEventDetails[0].AvailableBoothArea,10),'Name':'Available Booths '+this.mapBoothEventDetails[0].AvailableBooths}
                    ];                

                    this.event1ChartArea=[
                        {'expr0':parseFloat(this.mapBoothEventDetails[0].AvailableBoothArea,10),'Name':'Available Area '+this.mapBoothEventDetails[0].AvailableBoothArea},
                        {'expr0':parseFloat(this.mapBoothEventDetails[0].RentedBoothArea,10),'Name':'Rented Area '+this.mapBoothEventDetails[0].RentedBoothArea}
                    ];

                    this.event2ChartArea=[
                        {'expr0':parseFloat(this.mapBoothEventDetails[0].TotalExhibitors,10),'Name':'Total Exhibitors '+this.mapBoothEventDetails[0].TotalExhibitors}
                    ];
                    
                    this.event3ChartArea=[
                        {'expr0':parseFloat(this.mapBoothEventDetails[0].RentedBoothPercentage,10),'Name':'Total Percentage '+this.mapBoothEventDetails[0].RentedBoothPercentage}
                    ];
                }
                console.log(JSON.stringify(this.eventAreaChartData));
            })
            .catch(error => {
                handleErrors(this, error);
            })
    }

    /**
      * Description: This method will call once user click on booth details tab.
      */
    handleEventAllBooth() {
        this.spinner = true;
        getRESTForExpocadAllBooth({ eventCode: this.eventCode })
            .then(res => {
                let data = JSON.parse(JSON.stringify(res));
                const accList = data.lstAccount;
                let accId = [];
                accList.forEach(item => {
                    accId.push(item.Id);
                });

                data.lstBooth.forEach((item,i) => {
                    //add Exhibitor Name
                    if(accId.length>0 && accId.indexOf(item.ExhibitorId)>=0){
                        accList.forEach(acc=>{
                            console.log(acc.Id+'==='+item.ExhibitorId);
                            if(acc.Id===item.ExhibitorId){
                                item.ExhibitorId2 = '/'+item.ExhibitorId;
                                item.AccountName = acc.Name;
                            }
                            else{
                                item.ExhibitorId2 = '';
                                item.AccountName = '';
                            }
                        })
                    }
                    
                    item.myId = 'A'+i;
                    item.OpenSides = item.OpenCorners === 0 ? 1 : (item.OpenCorners === 1 ? 2 : (item.OpenCorners === 2 ? 3 : 4));
                    item.BoothClasses = item.BoothClasses.toString();                    
                })
                this.mapBoothAllEvents = data.lstBooth;
                this.spinner = false;
            })
            .catch(error => {
                handleErrors(this, error);
                this.spinner = false;
            })
    }

    /**
     * Description: This method is used to refresh the table.
     */
    handleRefreshTable() {
        if (this.template.querySelector('c-deck-yield-dashboard') != null){
            this.template.querySelector('c-deck-yield-dashboard').refreshCurrentTable();
        }
    }
    
}