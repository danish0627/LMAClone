/*
Created By	 : Girikon(Mukesh[STL-16])
Created On	 : July 22, 2019
@description : Placeholder for table visible only once before tabel load

Modification log --
Modified By	:
*/

import { LightningElement,api } from 'lwc';
export default class TablePlaceholder extends LightningElement 
{
    @api
    isShow = false;
    get className()
    {
        let clname = 'slds-hide forceListViewPlaceholder';
        if(this.isShow){
            clname = 'forceListViewPlaceholder';
        }
        return clname;
    }


}