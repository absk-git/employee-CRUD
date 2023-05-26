import { Component, OnInit, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { CellClickedEvent, ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Observable } from 'rxjs';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeListService } from './employee-list.service';
import Swal from 'sweetalert2';

//to show buttons on action column
function actionCellRenderer(params: any) {
  let eGui = document.createElement('div');
  let editingCells = params.api.getEditingCells();
  let isCurrentRowEditing = editingCells.some((cell: any) => {
    return cell.rowIndex === params.node.rowIndex;
  });
  if (isCurrentRowEditing) {
    eGui.innerHTML = `
    <i class="material-icons text-yellow-600"><button  class="font-bold py-2 px-1 rounded-sm text-2xl"  data-action="update">save</button></i>
    <i class="material-icons text-red-600"><button  class="font-bold py-2 px-1 rounded-sm text-2xl"  data-action="cancel">cancel </button></i>
        `;
  } else {
    eGui.innerHTML = `
    <i class="material-icons text-green-600"><button class="font-bold py-2 px-1 rounded-sm text-2xl" data-action="edit" >edit</button></i>
    <i class="material-icons text-red-600"><button class="font-bold py-2 px-1 rounded-sm text-2xl" data-action="delete" >delete</button></i>`;
  }

  return eGui;
}

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  private gridApi!: GridApi;
  private columnApi: any;
  editType :any;
  public rowData$:any = [];
  EmployeeForm: FormGroup;
  
  ngOnInit(): void {
    this._service.fetchEmployees().subscribe(res =>{
      console.log(res);
      this.rowData$ = res
    })
    //Form Group
    this.EmployeeForm = this.fb.group({
      name: ['', Validators.required],
      department: ['', Validators.required],
      salary: ['',Validators.required]
    });
  }

  // Defined Columns
  public columnDefs: ColDef[] = [
    { field: 'employee_name',headerName:"Name", editable:true},
    { field: 'departments',headerName:"Departments",editable:true},
    { field: 'salary',headerName:"Salary",editable:true},
    {field:'Action',cellRenderer: actionCellRenderer,colId: "action"}
  ];
  
  // DefaultColDef sets props common to all Columns
  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable:true,
    minWidth:355
  };

  
  constructor(public dialog: MatDialog,private fb: FormBuilder,private _service:EmployeeListService) {
    this.editType = "fullRow";
  }
  
  //Function hit when ag grid table is ready
  onGridReady(params: GridReadyEvent) {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;
      this.gridApi.sizeColumnsToFit();
  }
  
  //target cell click
  onCellClicked( params: any): void {
    console.log(params.data._id);
    
    if (
      params.column.colId === 'action' &&
      params.event.target.dataset.action
    ) {
      let action = params.event.target.dataset.action;
      if (action === 'edit') {
        this.gridApi.startEditingCell({
          rowIndex: params.node.rowIndex,
          colKey: params.column.colId,
        });
      }
      if (action === 'update'){
        this.gridApi.stopEditing(false);
        this._service.updateEmployee(params.data._id,params.data).subscribe(res =>{
          console.log(res);
          Swal.fire('Updated', 'Data updated successfully', 'success')
          this.ngOnInit()
        },(err)=>{
          console.log("error",err);
          Swal.fire('Oops', 'Something went wrong', 'error')
          this.ngOnInit()
        })
      }
      if (action === 'cancel'){
        this.gridApi.stopEditing(true);
      }
      if(action === 'delete'){
        Swal.fire({
          position: 'center',
          title: 'Are you sure?',
          text: 'This process is irreversible.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, go ahead.',
          cancelButtonText: 'No, let me think'
        }).then((result) => {
          if (result.value) {
            Swal.fire(
              'Removed!',
              'Item removed successfully.',
              'success'
            )
            this._service.deleteEmployee(params.data._id).subscribe(res =>{
              console.log(res);
              this.ngOnInit();
            })
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire(
              'Cancelled',
              'Item is safe.)',
              'error'
            )
          }
        })
      }
    }
  }


  onRowEditingStarted(params: any) {
    params.api.refreshCells({
      columns: ['action'],
      rowNodes: [params.node],
      force: true
    });
  }
  onRowEditingStopped(params: any) {
    params.api.refreshCells({
      columns: ['action'],
      rowNodes: [params.node],
      force: true
    });
  }

  // to open Modal
  openAddEmployeeDialog(content:any){
    const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.width = '60rem';
      dialogConfig.height = '60vh';
      this.dialog.open(content, dialogConfig)
  }

  // to save data in backend
  dataSubmit(){
    this._service.addEmployee(this.EmployeeForm.value).subscribe(res =>{
      console.log(res);
      Swal.fire('Added', 'Employee added successfully', 'success')
      this.dialog.closeAll()
      this.ngOnInit();
    })
  }
}
