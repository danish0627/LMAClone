/*
Created By	 : Girikon(Mukesh)
Created On	 : ‎July ‎24, ‎2019
@description : placeholder for Form visible only once before form load

Modification log --
Modified By	: 
*/

import { LightningElement,api } from 'lwc';

export default class FormsPlaceholder extends LightningElement 
{
    @api isShow = false;

    get className()
    {
        let clname = 'slds-hide forceListViewPlaceholder';
        if(this.isShow){
            clname = 'forceListViewPlaceholder';
        }
        return clname;
    }
}