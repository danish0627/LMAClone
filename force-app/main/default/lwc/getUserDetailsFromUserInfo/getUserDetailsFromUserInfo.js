import { LightningElement ,track, wire} from 'lwc';
import getAllUserDetails from '@salesforce/apex/UserInformationHelper.getAllUserDetails';
export default class GetUserDetailsFromUserInfo extends LightningElement {
 @track columns = [{
            label: 'User Information Name',
            fieldName: 'Name',
            type: 'text',
           
        }, {
            label: 'UserName',
            fieldName: 'Username__c',
            type: 'text',
            sortable: true
        }, {
            label: 'First Name',
            fieldName: 'First_Name__c',
            type: 'text',
            sortable: true
        }, {
            label: 'Last Name',
            fieldName: 'First_Name__c',
            type: 'text',
            sortable: true
        }, {
            label: 'Email',
            fieldName: 'Email__c',
            type: 'text',
            sortable: true
        }, {
            label: 'Email',
            fieldName: 'Email__c',
            type: 'text',
            sortable: true
        }, {
            label: 'Last Login Date',
            fieldName: 'Last_Login_Date__c',
            type: 'text',
            sortable: true
        }
    ];
    @track UserInfoList;
    @track error;

   @wire(getAllUserDetails)
    wiredUserData({
        error,
        data
    }) {
        if (data) {
            this.UserInfoList = data;
        } else if (error) {
            this.error = error;
        }
    }
}