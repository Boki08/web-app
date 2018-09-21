import { Component, OnInit } from '@angular/core';
import { VehicleTypes } from '../models/vehicleTypes';
import { VehicleTypeServices } from '../services/vehicleType-services';
import { btmNavDataService } from '../bottom-navbar/btmNavDataService';
import { finalize } from 'rxjs/operators'
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { ToasterService } from '../toaster-service/toaster-service.component';

@Component({
  selector: 'app-vehicle-type',
  templateUrl: './vehicle-type.component.html',
  styleUrls: ['./vehicle-type.component.css']
})
export class VehicleTypeComponent implements OnInit {

  constructor(private toasterService: ToasterService, private btmNavMessageService: btmNavDataService, private vehicleTypeServices: VehicleTypeServices, ) { }

  addDisabled: boolean = true;
  showTypeProgress: boolean = false;
  showProgress: boolean = false;
  showWarning: boolean = false;
  showEditTypeProgress: boolean = false;
  editDisabled: boolean = true;
  showEdit: boolean = false;

  pageIndex: number = 1;
  pageSize: number = 10;
  totalPagesNumber: number = 0;
  counter:number;

  ETag: string;

  selectedVehicleType: VehicleTypes;

  addVehicleTypeForm: FormGroup;
  editVehicleTypeForm: FormGroup;
  Type: FormControl;
  TypeEdit: FormControl;

  vehicleTypes: VehicleTypes[] = new Array<VehicleTypes>();
  ngOnInit() {
    this.btmNavMessageService.currentMessage.subscribe(message => this.showProgress = message)

    this.GetVehicleTypes();

    this.CreateFormControls();
    this.CreateForms();
  }

  CreateFormControls() {
    this.Type = new FormControl('', [
      Validators.maxLength(20),
      Validators.required
    ]);
    this.TypeEdit = new FormControl('', [
      Validators.maxLength(20),
      Validators.required
    ]);
  }
  CreateForms() {
    this.addVehicleTypeForm = new FormGroup({
      Type: this.Type,
    });
    this.editVehicleTypeForm = new FormGroup({
      TypeEdit: this.TypeEdit,
    });
  }

  ngOnDestroy() {
    this.btmNavMessageService.changeMessage(false);
  }

  onSubmit(vehicleType: VehicleTypes, form: NgForm) {
    console.log(vehicleType);

    this.addDisabled = true;
    this.showTypeProgress = true;
    this.vehicleTypeServices.AddVehicleType(vehicleType).pipe(finalize(
      () => {
        this.addDisabled = false;
        this.showTypeProgress = false;
      }))
      .subscribe(
        data => {


          this.vehicleTypes.push(data.body);
          this.showWarning = false;
          this.toasterService.Info("Vehicle Type was added", 'Info');
          form.reset();
        },
        error => {

          this.toasterService.Error(error.error.Message, 'Error');
        }
      );
  }
  GetVehicleTypes() {
    this.btmNavMessageService.changeMessage(true);
    this.vehicleTypeServices.GetVehicleTypesPaged(this.pageIndex, this.pageSize).pipe(finalize(
      () => {
        this.btmNavMessageService.changeMessage(false);
      }))
      .subscribe(
        data => {
          this.vehicleTypes = data.body as VehicleTypes[];

          let jsonData = JSON.parse(data.headers.get('Paging-Headers'));

          this.pageIndex = jsonData.currentPage;
          this.pageSize = jsonData.pageSize;
          this.totalPagesNumber = jsonData.totalPages;


          this.showWarning = false;
          this.addDisabled = false;

        },
        error => {
          if (error.error.Message === 'There are no Vehicle Types') {
            this.showWarning = true;
            this.toasterService.Warning(error.error.Message, 'Warning');
          } else {
            this.showWarning = false;
            this.toasterService.Error(error.error.Message, 'Error');
          }

          this.addDisabled = false;

        }
      );
  }
  DeleteVehicleType(typeId: number) {
    this.btmNavMessageService.changeMessage(true);
    this.vehicleTypeServices.DeleteVehicleType(typeId).pipe(finalize(
      () => {
        this.btmNavMessageService.changeMessage(false);
      }))
      .subscribe(
        data => {
          let vehiclePosition = this.vehicleTypes.findIndex(x => x.TypeId == data.body.TypeId);
          this.vehicleTypes.splice(vehiclePosition, 1);
          this.toasterService.Info("Vehicle Type was deleted", 'Info');

        },
        error => {
          this.toasterService.Error(error.error.Message, 'Error');
        }
      );
  }
  SelectedehicleType(typeId: number,counter:number) {
    this.counter=counter;
    this.showEditTypeProgress = true;
    this.editDisabled=true;
    this.showEdit=false;
    this.vehicleTypeServices.GetVehicleType(typeId).pipe(finalize(
      () => {
        this.showEditTypeProgress = false;
        
      }))
      .subscribe(
        data => {
          this.ETag = JSON.parse(data.headers.get('ETag'));
          this.selectedVehicleType = data.body;
         
          this.editDisabled=false;
          this.showEdit=true;
        },
        error => {
          this.toasterService.Error(error.error.Message, 'Error');

        }
      );
  }
  onSubmitEdit(vehicleType: any, form: NgForm) {
    console.log(vehicleType);

    this.editDisabled = true;
    this.showEditTypeProgress = true;
    let vehicleTypeTemp:VehicleTypes=new VehicleTypes(this.selectedVehicleType.TypeId,vehicleType.TypeEdit);
    this.vehicleTypeServices.EditVehicleType(vehicleTypeTemp,this.ETag).pipe(finalize(
      () => {
        this.editDisabled = false;
        this.showEditTypeProgress = false;
      }))
      .subscribe(
        data => {

          this.ETag = JSON.parse(data.headers.get('ETag'));
          this.vehicleTypes[this.counter]=data.body;
          this.toasterService.Info("Vehicle Type was edited", 'Info');

        },
        error => {

          this.toasterService.Error(error.error.Message, 'Error');
        }
      );
  }
}
