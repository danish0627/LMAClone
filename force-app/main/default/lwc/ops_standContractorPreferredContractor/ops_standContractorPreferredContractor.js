/*
Created By	 : Girikon(Himanshu) [STL-262]
Created On	 : OCT 16, 2019
@description : TThis component is used to show prefreed contractor tab in ops admin Stand Contractor.

Modification log --
Modified By	: 
*/

import { LightningElement,track } from 'lwc';

export default class Ops_standContractorPreferredContractor extends LightningElement {
    @track iframeurl;
    @track esId;
    @track eId;
 
    connectedCallback() {
    let fullUrl = window.location.href;
    this.esId = this.GetQS(fullUrl, 'esid');
    this.eId = this.GetQS(fullUrl, 'id');
    let recordID = this.eId;
        this.iframeurl='/apex/c__PrefferredContractorPage?Id='+recordID;
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

}