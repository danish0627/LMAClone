/* eslint-disable no-console */
/*
Created By	 : Girikon(Mukesh[STL-216])
Created On	 : 30 Sept, 2019
@description : This component used in modal when user click row action on customer list table.
                This component used on(opsCustomerListReport) component
Modification log --
Modified By	: 
*/

import { LightningElement, track,  api } from 'lwc';
import getRecordDetail from '@salesforce/apex/CommonTableController.getRecordDetail3';
import { handleErrors } from 'c/lWCUtility';

export default class OpsExhibitorProfileReports extends LightningElement {
    @track isExpoCadBoothMappingFound=true;
    @track opsCustomerProfileProdCateTabAppURL;

    @api selectedBooth='';
    @api eventCode;
    @api eventId;
    @api accountId;
    @api userTypeId;
    
    connectedCallback(){
        if(this.selectedBooth!==''){
            this.getBooth();
            this.getProfileOptionVisibility();
        }
        else{
            this.isExpoCadBoothMappingFound = undefined;
        }
    }

    getBooth(){
        getRecordDetail({objectName:'Opportunity_ExpoCAD_Booth_Mapping__c',allFields:'Name',condition:'Event_Code__c=\''+this.eventCode+'\' AND Id= \''+this.selectedBooth+'\''})
        .then(data=>{            
            if(data && data.length>0){
                this.isExpoCadBoothMappingFound = true;
            }
            else{
                this.isExpoCadBoothMappingFound = undefined;
            }
            this.opsCustomerProfileProdCateTabAppURL = '/c/opsCustomerProfileProdCateTabApp.app?eventCode='+this.eventCode+'&eventId='+this.eventId+'&exhAccountID='+this.accountId+'&boothId='+this.selectedBooth;
        })
        .catch(error=>{
            handleErrors(this,error);
        })
    }
    @track productCategories;
    @track productListing;
    @track showSpecials;
    @track videos;
    @track pressRelease;
    @track boothSchedule;
    @track documents;
    getProfileOptionVisibility(){        
        getRecordDetail({objectName:'Profile_Option_Visibility__c',allFields:'Product_Categories__c,Product_Listing__c,Show_Specials__c,Videos__c,Press_Release__c,Booth_Schedule__c,Documents__c',condition:'Event_Edition__c=\''+this.eventId+'\''})
        .then(data=>{
            if(data && data.length>0){
                this.productCategories = data[0].Product_Categories__c;
                this.productListing = data[0].Product_Listing__c;
                this.showSpecials = data[0].Show_Specials__c;
                this.videos = data[0].Videos__c;
                this.pressRelease = data[0].Press_Release__c;
                this.boothSchedule = data[0].Booth_Schedule__c;
                this.documents = data[0].Documents__c;
            }
            else{
                this.productCategories = undefined;
                this.productListing = undefined;
                this.showSpecials = undefined;
                this.videos = undefined;
                this.pressRelease = undefined;
                this.boothSchedule = undefined;
                this.documents = undefined;
            }
        })
        .catch(error=>{
            handleErrors(this,error);
        })
    }
    
}