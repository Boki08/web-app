import { Component, OnInit } from '@angular/core';
import { VehicleServices } from '../services/vehicle-services';
import { VehicleTypes } from '../models/vehicleTypes';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Vehicle } from '../models/vehicles';

@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.css']
})
export class AddVehicleComponent implements OnInit {

  constructor(private vehicleServices: VehicleServices, private activatedRoute: ActivatedRoute) {
    activatedRoute.params.subscribe(params => { this.rentServiceId = params["rentServiceId"] });
  }
  rentServiceId: number;
  vehicleTypes: VehicleTypes[];
  selectedType: string = "Select Type";
  canUploadPictures: boolean = false;
  fileToUpload: Array<File> = [];
  imagesUrl: Array<string> = [] = ["/assets/images/default-placeholder.png", "/assets/images/default-placeholder.png", "/assets/images/default-placeholder.png", "/assets/images/default-placeholder.png"]
  imageUrl2: string = "/assets/images/default-placeholder.png"
  imageUrl3: string = "/assets/images/default-placeholder.png"
  vehicleId: number;
  selectedTypeId: number;

  ngOnInit() {
    this.vehicleServices.GetVehicleTypes()
      .subscribe(
        data => {
          this.vehicleTypes = data as VehicleTypes[];

        },
        error => {
          alert(error.error.ModelState[""][0]);

        }
      );
  }
  GetSelectedType(type:VehicleTypes) {
    this.selectedType = type.Type;
    this.selectedTypeId = type.TypeId;
  }

  onSubmit(vehicle: Vehicle, form: NgForm) {
    vehicle.RentServiceId = this.rentServiceId;
    vehicle.TypeId = this.selectedTypeId;
    this.vehicleServices.AddVehicle(vehicle, this.fileToUpload)
      .subscribe(
        data => {
          this.vehicleId = data.VehicleId as number;
          this.canUploadPictures = true;
        },
        error => {
          alert(error.error.ModelState[""][0]);

        }
      );

  }

  counter: number = 0;
  handleFileInput(file: FileList) {
    this.fileToUpload.push(file.item(0));
    //Show image preview
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.imagesUrl[this.counter] = event.target.result;
    }
    reader.readAsDataURL(this.fileToUpload[this.counter]);
    this.counter += 1;
  }
}
