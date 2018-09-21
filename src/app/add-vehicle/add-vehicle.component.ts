import { Component, OnInit } from '@angular/core';
import { VehicleServices } from '../services/vehicle-services';
import { VehicleTypes } from '../models/vehicleTypes';
import { ActivatedRoute } from '@angular/router';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { Vehicle } from '../models/vehicles';
import { VehicleTypeServices } from '../services/vehicleType-services';
import { finalize } from 'rxjs/operators'
import { ToasterService } from '../toaster-service/toaster-service.component';
import { btmNavDataService } from '../bottom-navbar/btmNavDataService';

@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.css']
})
export class AddVehicleComponent implements OnInit {

  constructor(private btmNavMessageService: btmNavDataService,private toasterService:ToasterService,private vehicleTypeServices:VehicleTypeServices,private vehicleServices: VehicleServices, private activatedRoute: ActivatedRoute) {
    activatedRoute.params.subscribe(params => { this.rentServiceId = params["rentServiceId"] });
  }
  rentServiceId: number;
  vehicleTypes: VehicleTypes[];
  selectedType: string = "Select Type";
  fileToUpload: Array<File> = [];
  imagesUrl: Array<string>  = ["/assets/images/default-placeholder.png", "/assets/images/default-placeholder.png", "/assets/images/default-placeholder.png", "/assets/images/default-placeholder.png"];
  selectedTypeId: number;
  disableBtn:boolean=false;

  addVehicleForm: FormGroup;
  Model: FormControl;
  YearOfManufacturing: FormControl;
  Manufacturer: FormControl;
  Description: FormControl;
  HourlyPrice: FormControl;

  pictureAdded:boolean=false;
  //TypeId: FormControl;
 //Pictures: FormControl;


  ngOnInit() {
    let file=new File([new Blob([ "/assets/images/default-placeholder.png"], { type: 'application/zip' })], "/assets/images/default-placeholder.png", { type: 'application/zip' })
    this.fileToUpload.push(file);
    this.fileToUpload.push(file);
    this.fileToUpload.push(file);
    this.btmNavMessageService.changeMessage(true);
    this.CreateFormControls() ;
    this.CreateForm();
    this.vehicleTypeServices.GetVehicleTypes().pipe(finalize(
      () => {
        this.btmNavMessageService.changeMessage(false);
      
      }))
      .subscribe(
        data => {
          this.vehicleTypes = data.body as VehicleTypes[];
          this.selectedType =this.vehicleTypes[0].Type
          this.selectedTypeId = this.vehicleTypes[0].TypeId;
        },
        error => {
          //alert(error.error.Message);
          this.toasterService.Error(error.error.Message,'Error');

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
    
   /*  this.Pictures = new FormControl('', [
      Validators.required,
    ]); */
  }
  CreateForm() {
    this.addVehicleForm = new FormGroup({
      Model: this.Model,
      YearOfManufacturing: this.YearOfManufacturing,
      Manufacturer: this.Manufacturer,
      Description: this.Description,
      HourlyPrice: this.HourlyPrice,
      //TypeId: this.TypeId,
     // Pictures: this.Pictures,
    });
  }

  GetSelectedType(type:VehicleTypes) {
    this.selectedType = type.Type;
    this.selectedTypeId = type.TypeId;
  }

  onSubmit(vehicle: Vehicle, form: NgForm) {
    this.disableBtn = true;
    this.btmNavMessageService.changeMessage(true);
    vehicle.RentServiceId = this.rentServiceId;
    vehicle.TypeId = this.selectedTypeId;
    this.vehicleServices.AddVehicle(vehicle, this.fileToUpload) .pipe(finalize(
      () => {
       
        this.btmNavMessageService.changeMessage(false);
        this.disableBtn = false;
      }))
      .subscribe(
        data => {
          this.pictureAdded=false;
          form.reset();
          for(let i=0;i<this.fileToUpload.length;i++){
            this.fileToUpload[i]=new File([new Blob([ "/assets/images/default-placeholder.png"], { type: 'application/zip' })], "/assets/images/default-placeholder.png", { type: 'application/zip' })
          }
            this.imagesUrl = ["/assets/images/default-placeholder.png", "/assets/images/default-placeholder.png", "/assets/images/default-placeholder.png", "/assets/images/default-placeholder.png"];
         this.toasterService.Info(data,'Info');
        },
        error => {
          this.toasterService.Error(error.error.Message,'Error');
        }
      );

  }

  counter: number = 0;
 /*  handleFileInput(file: FileList) {
    this.fileToUpload.push(file.item(0));
    //Show image preview
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.imagesUrl[this.counter] = event.target.result;
    }
    reader.readAsDataURL(this.fileToUpload[this.counter]);
    this.counter += 1;
  } */

  handleFileInput(file: FileList, element: number) {
    this.pictureAdded=true;
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
}
