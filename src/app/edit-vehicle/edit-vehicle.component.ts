import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, NgForm } from '@angular/forms';
import { VehicleTypes } from '../models/vehicleTypes';
import { Vehicle } from '../models/vehicles';
import { btmNavDataService } from '../bottom-navbar/btmNavDataService';
import { ToasterService } from '../toaster-service/toaster-service.component';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { VehicleTypeServices } from '../services/vehicleType-services';
import { VehicleServices } from '../services/vehicle-services';
import { forEach } from '@angular/router/src/utils/collection';
import { VehiclePictures } from '../models/vehicle-pictures';

@Component({
  selector: 'app-edit-vehicle',
  templateUrl: './edit-vehicle.component.html',
  styleUrls: ['./edit-vehicle.component.css']
})
export class EditVehicleComponent implements OnInit {

  constructor(private vehicleServices: VehicleServices, private vehicleTypeServices: VehicleTypeServices, private btmNavMessageService: btmNavDataService, private toasterService: ToasterService, private activatedRoute: ActivatedRoute) {
    activatedRoute.params.subscribe(params => { this.vehicleId = params["vehicleId"] });
  }

  vehicleId: number;
  selectedTypeId: number;

  btnDisabled: boolean;
  showDangerErrorMessage: boolean;
  firstLoad: boolean = false;


  dangerErrMessage: string;
  ETag: string;

  fileToUpload: Array<File> = [];
  imagesUrl: Array<string> = ["/assets/images/default-placeholder.png", "/assets/images/default-placeholder.png", "/assets/images/default-placeholder.png", "/assets/images/default-placeholder.png"];

  vehicleTypes: VehicleTypes[];
  selectedType: string = "Select Type";

  addVehicleForm: FormGroup;
  Model: FormControl;
  YearOfManufacturing: FormControl;
  Manufacturer: FormControl;
  Description: FormControl;
  HourlyPrice: FormControl;


  vehicle: Vehicle = new Vehicle(0, 0, ' ', 0, ' ', ' ', 0, 0, true, true, null, null);

  ngOnInit() {

    let file=new File([new Blob([ "/assets/images/default-placeholder.png"], { type: 'application/zip' })], "/assets/images/default-placeholder.png", { type: 'application/zip' })
    this.fileToUpload.push(file);
    this.fileToUpload.push(file);
    this.fileToUpload.push(file);
    this.btmNavMessageService.changeMessage(true);
    this.CreateFormControls();
    this.CreateForm();
    this.vehicleServices.getVehicleInfo(this.vehicleId).pipe(finalize(
      () => {
        this.checkIfAllLoaded();
      }))
      .subscribe(
        data => {
          this.vehicle = data.body as Vehicle;

          this.ETag = JSON.parse(data.headers.get('ETag'));


          this.selectedTypeId = this.vehicle.TypeId;

          for (let i = 0; i < this.vehicle.VehiclePictures.length; i++) {
            this.imagesUrl[i] = 'http://localhost:51680/api/vehicle/getVehiclePicture?path=' + this.vehicle.VehiclePictures[i].Data;
            this.counter += 1;
            let file=new File([new Blob([ this.vehicle.VehiclePictures[i].Data], { type: 'application/zip' })], this.vehicle.VehiclePictures[i].Data, { type: 'application/zip' })
            this.fileToUpload[i] = file;
          }


        },
        error => {
          if (error.error.Message === 'Vehicle does not exist') {
            this.btnDisabled = true;

            this.dangerErrMessage = "This Vehicle is not Available!";
            this.showDangerErrorMessage = true;

            this.toasterService.Warning(error.error.Message, 'Warning');
          }
          else {
            this.toasterService.Error(error.error.Message, 'Error');
          }

        }
      );
    this.vehicleTypeServices.GetVehicleTypes().pipe(finalize(
      () => {
        this.checkIfAllLoaded();
      
      }))
      .subscribe(
        data => {
          this.vehicleTypes = data.body as VehicleTypes[];


        },
        error => {
          this.btnDisabled = true;
          this.toasterService.Error(error.error.Message, 'Error');

        }
      );
  }
  CreateFormControls() {
    this.Model = new FormControl('', [
      Validators.required,
      Validators.maxLength(50),
    ]);
    this.YearOfManufacturing = new FormControl('', [
      Validators.required,
      Validators.maxLength(4),
      Validators.pattern("^[0-9][0-9][0-9][0-9]$"),
    ]);
    this.Manufacturer = new FormControl('', [
      Validators.required,
      Validators.maxLength(50),
    ]);
    this.Description = new FormControl('', [
      Validators.required,
      Validators.maxLength(250),
    ]);
    this.HourlyPrice = new FormControl('', [
      Validators.required,
      Validators.maxLength(7),
      Validators.pattern("^[0-9]+(\.[0-9][0-9]?)?$"),
    ]);

  }
  CreateForm() {
    this.addVehicleForm = new FormGroup({
      Model: this.Model,
      YearOfManufacturing: this.YearOfManufacturing,
      Manufacturer: this.Manufacturer,
      Description: this.Description,
      HourlyPrice: this.HourlyPrice,
      
    });
  }

  GetSelectedType(type: VehicleTypes) {
    this.selectedType = type.Type;
    this.selectedTypeId = type.TypeId;
  }

  onSubmit(vehicle: Vehicle, form: NgForm,) {
    this.btmNavMessageService.changeMessage(true);
    this.btnDisabled=true;
    vehicle.TypeId = this.selectedTypeId;
    vehicle.VehicleId=this.vehicle.VehicleId;
    this.vehicleServices.EditVehicle(vehicle, this.fileToUpload,this.ETag).pipe(finalize(
      () => {
         this.btmNavMessageService.changeMessage(false);
         this.btnDisabled = false;
      }))
      .subscribe(
        data => {
          this.ETag = JSON.parse(data.headers.get('ETag'));
          
          this.vehicle = data.body;
          this.toasterService.Info("Vehicle was edited", 'Info');
        },
        error => {
          if(error.statusText== "Precondition Failed")
          {
            this.toasterService.Error("Data was already changed, please reload",'Error');
          }
          else
          {
          this.toasterService.Error(error.error.Message,'Error');
          }
        }
      );

  }

  counter: number = 0;
  handleFileInput(file: FileList, element: number) {
    this.fileToUpload[element] = (file.item(0));

    //Show image preview
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.imagesUrl[element] = event.target.result;
    }
    reader.readAsDataURL(file.item(0));
    this.counter += 1;
    if (this.counter == 3) {
      this.counter = 0;
    }
  }
  checkIfAllLoaded() {
    if (this.firstLoad == true) {
      this.btmNavMessageService.changeMessage(false);

      for (let i = 0; i < this.vehicleTypes.length; i++) {
        if (this.vehicleTypes[i].TypeId == this.selectedTypeId) {
          this.selectedType = this.vehicleTypes[i].Type;
        }
      }
    }
    else {
      this.firstLoad = true;
    }
  }
}
