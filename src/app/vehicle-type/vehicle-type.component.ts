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

  pageIndex: number = 1;
  pageSize: number = 10;
  totalPagesNumber: number = 0;

  addVehicleTypeForm: FormGroup;
  Type: FormControl;

  vehicleTypes: VehicleTypes[]=new Array<VehicleTypes>();
  ngOnInit() {
    this.btmNavMessageService.currentMessage.subscribe(message => this.showProgress = message)

    this.GetVehicleTypes();

    this.CreateFormControls();
    this.CreateForm();
  }

  CreateFormControls() {
    this.Type = new FormControl('', [
      Validators.maxLength(50),
      Validators.required
    ]);
  }
  CreateForm() {
    this.addVehicleTypeForm = new FormGroup({
      Type: this.Type,
    });
  }

  ngOnDestroy() {
    this.btmNavMessageService.changeMessage(false);
  }

  onSubmit(vehicleType: VehicleTypes,form:NgForm) {
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
          //alert("Vehicle Type added");
        },
        error => {

          //alert(error.error.ModelState[""][0]);
          //alert(error.error.Message);
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

          //(error.error.Message);
        }
      );
  }
  DeleteVehicleTypes(typeId: number) {
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
          //alert("Vehicle Type deleted");

        },
        error => {
          this.toasterService.Error(error.error.Message, 'Error');
          //alert(error.error.Message);
        }
      );
  }
}
