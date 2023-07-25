/*
Created By	 : (Sunil)
Created On	 : Sep 24, 2019
@description : This component is use to show Customer Badge allotment Settings in Customer Center.

Modification log 
Modified By	: 
*/
import { LightningElement, track} from 'lwc';
import { showToast } from 'c/lWCUtility';
export default class Ops_myExhibitorsStandConDesigns extends LightningElement {
    @track esId;
    @track eId;
    @track recordId='';
    @track openNewModal=false;
    @track openEditModal = false;


    handleEditModal(event) {
        this.recordId = event.detail;
        setTimeout(()=>{
            this.openEditModal=true;
        },300);
    }
    closeModal(){
        this.openEditModal=false;
        this.openNewModal=false;
    }
    onSucessBadgeUpdated() {
        showToast(this, 'Record Edited Successfully', 'success', 'Success');
        this.openEditModal=false;
        this.template.querySelector('c-events-list-custom-table').refreshTable();
    }
    submitForm(event) {
        event.preventDefault();
        const fields = event.detail.fields;
        this.template.querySelector('.globalForm').submit(fields)
    }
    onSucessBadgeCreated() {
        this.openNewModal=false;
        showToast(this, 'Record Created Successfully', 'success', 'Success');
        this.template.querySelector('c-events-list-custom-table').refreshTable();
    }
    callSaveBtn() {
        this.template.querySelector('.save').click();
    }
    handleNewModal() {
        this.openNewModal = true;
    }
    
}