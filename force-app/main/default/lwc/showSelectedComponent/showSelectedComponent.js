import { api, LightningElement, track } from 'lwc';
import { sortBy } from 'c/rmaUtils';

export default class ShowSelectedComponent extends LightningElement {
    @api destructiveDatamap;
    @api rollbackDatamap;
    
    @track tableData;
    @track defaultSortDirection = 'asc';
    @track sortDirection = 'desc';
    @track sortedBy='dtype';

    columns = [
        {label:'Name',fieldName:'name',type:'text',sortable: true},
        {label:'Type',fieldName:'type',type:'text',sortable: true},        
        { label: '#', fieldName: 'dtype',type:'text',sortable: true,
            cellAttributes:{
                class:{fieldName:'dtypeColor'}
            }
        }
    ];

    connectedCallback(){
        try{
            let temp1 = JSON.parse(JSON.stringify(this.destructiveDatamap));
            let temp2 = JSON.parse(JSON.stringify(this.rollbackDatamap));

            if(temp1){
                temp1 = temp1.map(i=>{
                    i.dtype = 'New';
                    return {...i,"dtypeColor":"slds-text-color_success"};
                }); 
            }
            else{
                temp1 = [];
            }

            if(temp2){
                temp2 = temp2.map(i=>{
                    i.dtype = 'Existing';
                    return {...i,"dtypeColor":"datatable-orange"};
                });
            }
            
            else{
                temp2 = [];
            }
            this.tableData = temp1.concat(temp2);
            temp2 = [];
            temp1 = [];
        }
        catch(e){
            console.error(e.message);
        }
    };
    
    onHandleSort(event) {
        const { fieldName: sortedBy, sortDirection } = event.detail;
        const cloneData = [...this.tableData];

        cloneData.sort(sortBy(sortedBy, sortDirection === 'asc' ? 1 : -1));
        this.tableData = cloneData;
        this.sortDirection = sortDirection;
        this.sortedBy = sortedBy;
    }
}