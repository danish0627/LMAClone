/*
Created By	 : Girikon(Yash Gupta[STL-30])
Created On	 : Aug ‎26, ‎2019
@description : Component to display report Dashboard
               

Modification log --
Modified By	: 
*/

/* eslint-disable no-console */
import { LightningElement } from 'lwc';
//import { NavigationMixin } from 'lightning/navigation';
var urlHalf1='/one/one.app?source=aloha#/sObject/';
var urlHalf2='/view';
export default class ReportDashboard extends LightningElement {
    navigateToViewReport(event) {
        let reportId = event.currentTarget.getAttribute('data-record-id');
        let reportUrl=urlHalf1+reportId+urlHalf2;
        window.open(reportUrl,'_blank');
    }
}