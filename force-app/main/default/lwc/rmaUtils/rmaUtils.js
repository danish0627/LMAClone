/*
Created By	 : Girikon(Mukesh)
Created On	 : Dec 15, 2022
@description : 

Modification log --
Modified By	: 
*/

import {ShowToastEvent} from 'lightning/platformShowToastEvent';


/**
 * Handle error that is thrown by Apex action and show Error in toast(ShowToastEvent)
 * 
 * @param that pass this object of lwc component
 * @param error pass error object return by apex AuraEnabled action  
 */
const handleErrors = (that,error)=>{
    console.error('Error: '+JSON.stringify(error));
    let message = 'Unknown Error';
    let title = 'Error';
    if (error) {

        if (error.body!==undefined && Array.isArray(error.body)) {
            message = error.body.map(e => e.message).join(', ');
        } 
        else if (error.body!==undefined && typeof error.body.message === 'string') {
            message = error.body.message;
        }
        else if(error.detail!==undefined && error.detail!==''){
            message = error.detail;
        }
        else if(error.message!==undefined && error.message!==''){
            message = error.message;
        }
        else if(error.body && error.body.pageErrors){
            message = error.body.pageErrors[0].message;
            title = error.body.pageErrors[0].statusCode;
        }
    }    
    return that.dispatchEvent(new ShowToastEvent({
        variant:'error',
        title:title,
        mode:'sticky',
        message : message
    }));
};

/**
 * Show toast message in Lightning Experience and Lightning community only.
 * 
 * @param that pass this object of lwc component
 * @param message pass message text body 
 * @param type toast type
 * @param title toast title
 */
const showToast = (that,message,type,title)=>{    
    return that.dispatchEvent(new ShowToastEvent({
        variant:type,
        title:title,        
        message : message
    }));    
};

const sortBy = (field, reverse, primer) =>{
    const key = primer
        ? function (x) {
              return primer(x[field]);
          }
        : function (x) {
              return x[field];
          };

    return function (a, b) {
        a = key(a);
        b = key(b);
        return reverse * ((a > b) - (b > a));
    };
};

export {handleErrors,showToast,sortBy};