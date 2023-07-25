/* eslint-disable no-console */
/*
Created By	 : Girikon (Sunil [STL-180])
Created On	 : August 26, 2019
@description : This component is use for import functionality in customer badges .

Modification log --
Modified By	: 
*/

import { LightningElement, track, api } from 'lwc';
import saveFile from '@salesforce/apex/LtngUtilityCtrl.saveFile';
import fetchhEvent from "@salesforce/apex/LtngUtilityCtrl.getRecords";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { showToast, handleErrors } from 'c/lWCUtility';

export default class Ops_customerBadgeBulkImport extends LightningElement {

    @track fileName = '';
    @track UploadFile = 'Upload File';
    @track showLoadingSpinner = false;
    @track isTrue = false;
    @track esId = '';
    @track eid = '';
    
    filesUploaded = [];
    file;
    fileContents;
    fileReader;
    content;
    MAX_FILE_SIZE = 1500000;
    @track attachmentLink;

    connectedCallback() {
        let fullUrl = window.location.href;
        this.esId = this.GetQS(fullUrl, 'esid');
        this.eid = this.GetQS(fullUrl, 'id');
        this.qryCondition = 'Event_Edition__c  =\'' + this.eid + '\'';


        fetchhEvent({
            objName: 'Event_Settings__c',
            fieldNames: 'Id,Name,Allow_VIP_Badges__c,Badges_MatchMaking__c',
            compareWith: 'Event_Edition__c',
            recordId: this.eid,
            pageNumber: 1,
            pageSize: 1
        })
            .then(result => {
                if (result.recordList[0] != null) {
                    let vipBadges = result.recordList[0].Allow_VIP_Badges__c;
                    let MatchMaking = result.recordList[0].Badges_MatchMaking__c;
                    this.getDocId(vipBadges,MatchMaking);
                }


            })
            .catch(error => {
                window.console.log('error...' + JSON.stringify(error));
            });
    }

    // getting file  information 
    handleFilesChange(event) {
        if (event.target.files.length > 0) {
            this.filesUploaded = event.target.files;
			this.fileName = event.target.files[0].name;
			this.isTrue = false;
        }
    }

    handleSave() {
        if (this.filesUploaded.length > 0) {
            this.uploadHelper();
        } else {
            this.fileName = 'Please select file to upload!!';
        }
    }

    uploadHelper() {
        this.file = this.filesUploaded[0];
        if (this.file.size > this.MAX_FILE_SIZE) {
            window.console.log('File Size is to long');
            return;
        }
        this.showLoadingSpinner = true;
        // create a FileReader object 
        this.fileReader = new FileReader();
        // set onload function of FileReader object  
        this.fileReader.onloadend = (() => {
            this.fileContents = this.fileReader.result;
            let base64 = 'base64,';
            this.content = this.fileContents.indexOf(base64) + base64.length;
            this.fileContents = this.fileContents.substring(this.content);
            // call the uploadProcess method 
            this.saveToFile();
        });

        this.fileReader.readAsDataURL(this.file);
    }

    // Calling apex class to insert the file
    saveToFile() {
        saveFile({
            parentId: this.esId,
            fileName: this.file.name,
            base64Data: encodeURIComponent(this.fileContents)
        })
		.then(() => {
			this.fileName = this.fileName + ' - Uploaded Successfully';
			this.UploadFile = 'File Uploaded Successfully';
			this.isTrue = true;
			this.showLoadingSpinner = false;
			showToast(this,this.file.name + ' - Uploaded Successfully!!!','success','Success');			
		})
		.catch(error => {
			window.console.log(JSON.stringify(error));
			handleErrors(this,error);
		});
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
    getDocId(allowBadges ,allowMatchMaking) {
        var developerName = '';
        if (allowBadges && allowMatchMaking) {
            developerName = 'Badge_CSV_File';
        }
        else if(allowBadges===true && allowMatchMaking===false) {
            developerName = 'Badges_CSV_File_Without_MatchMaking';
        }
        else if(allowBadges===false && allowMatchMaking===true) {
            developerName ='Badge_CSV_File_Without_VIP';
        }
        else{
            developerName ='Badge_CSV_File_Without_VIP_Match';
        }
        fetchhEvent({
            objName: 'Document',
            fieldNames: 'Id,DeveloperName',
            compareWith: 'DeveloperName',
            recordId: developerName,
            pageNumber: 1,
            pageSize: 1
        })
            .then(result => {
                console.log('getthe--->Attchmnt:',result.recordList[0]); 
                if (result.recordList[0] != null) {
                    let docId = '';
                    docId = result.recordList[0].Id;
                    this.attachmentLink = '/servlet/servlet.FileDownload?file='+docId;
                   
                }
            })
            .catch(error => {
                window.console.log('error...' + JSON.stringify(error));
            });

    }
}