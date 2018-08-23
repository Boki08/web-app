import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OfficeServices } from '../services/office-services';
import { OfficeModel } from '../models/office-model';
import { Vehicle } from '../models/vehicles';
import { VehicleServices } from '../services/vehicle-services';
import { VehiclePictures } from '../models/vehicle-pictures';
import { MapInfo } from '../models/map-info.model';

@Component({
  selector: 'app-manage-offices-vehicles',
  templateUrl: './manage-offices-vehicles.component.html',
  styleUrls: ['./manage-offices-vehicles.component.css']
})
export class ManageOfficesVehiclesComponent implements OnInit {

  constructor(private vehicleServices: VehicleServices, private officeServices: OfficeServices, private activatedRoute: ActivatedRoute) {
    activatedRoute.params.subscribe(params => { this.rentServiceId = params["rentServiceId"] });


    this.mapInfo = new MapInfo(45.242268, 19.842954, 
      "assets/ftn.png",
      "Jugodrvo" , "" , "http://ftn.uns.ac.rs/691618389/fakultet-tehnickih-nauka");
  }

  rentServiceId: number;
  pageSizeO: number = 5;
  pageIndexO: number = 1;
  totalPagesNumberO: number;
  pageSizeV: number = 5;
  pageIndexV: number = 1;
  totalPagesNumberV: number;
  offices: OfficeModel[];
  vehicles: Vehicle[];
  vehicle: Vehicle;
  vehicleCounter: number;
  vehicleEnabled: boolean;
  vehilePictures: VehiclePictures[];
  tempPic:string;
  office :OfficeModel;
  officeCounter: number;
  mapInfo: MapInfo;

  
  ngOnInit() {
    this.getServiceOffices();
  }




  placeMarker($event){
    console.log($event.coords.lat);
    console.log($event.coords.lng);
  }






  public getServiceOffices() {
    this.officeServices.GetRentOffices(this.rentServiceId, this.pageIndexO, this.pageSizeO).subscribe(
      data => {
        this.offices = data.body as OfficeModel[];
        //this.userData=this.users[0];

        let jsonData = JSON.parse(data.headers.get('Paging-Headers'));

        this.pageIndexO = jsonData.currentPage;
        this.pageSizeO = jsonData.pageSize;
        this.totalPagesNumberO = jsonData.totalPages;
      },
      error => {
        console.log(error);
      })
  }
  public getServiceVehicles() {
    this.vehicleServices.GetRentVehicles(this.rentServiceId, this.pageIndexV, this.pageSizeV).subscribe(
      data => {
        this.vehicles = data.body as Vehicle[];
        //this.userData=this.users[0];

        let jsonData = JSON.parse(data.headers.get('Paging-Headers'));

        this.pageIndexV = jsonData.currentPage;
        this.pageSizeV = jsonData.pageSize;
        this.totalPagesNumberV = jsonData.totalPages;
      },
      error => {
        console.log(error);
      })
  }
  
 /*  getVehiclePictures(){
    this.vehicleServices.GetVehiclePictures(this.rentServiceId).subscribe(
      data => {
        this.vehilePictures = data as VehiclePictures[];
      },
      error => {
        console.log(error);
      })
  }
 */
  set pageO(val: number) {
    if (val !== this.pageIndexO) {

      this.pageIndexO = val;
      this.getServiceOffices();
    }
  }
  set pageV(val: number) {
    if (val !== this.pageIndexV) {

      this.pageIndexV = val;
      this.getServiceVehicles();
    }
  }

  vehicleDetails(vehicle: Vehicle, counter: number) {
    this.vehicle = vehicle;
    this.vehicleCounter = counter;

    this.vehicleServices.GetVehiclePictures(vehicle.VehicleId).subscribe(
      data => {
        this.vehilePictures = data as VehiclePictures[];
        this.tempPic=this.vehilePictures[0].Data;
        //this.vehilePictures[0]=null;
      },
      error => {
       // this.disableButtons = false;
        console.log(error);
      })
  }
  officeDetails(office: OfficeModel, counter: number) {
    this.office = office;
    this.officeCounter = counter;

   /*  this.vehicleServices.GetVehiclePictures(office.OfficeId).subscribe(
      data => {
        this.vehilePictures = data as VehiclePictures[];
        this.tempPic=this.vehilePictures[0].Data;
        //this.vehilePictures[0]=null;
      },
      error => {
       // this.disableButtons = false;
        console.log(error);
      }) */
  }
  setCheckBoxVehicle(event,vehicleId:number) {
    if (event.target.checked) {
      this.vehicleEnabled = true;
    }
    else {
      this.vehicleEnabled = false;
    }
    this.vehicleServices.DisableVehicle(vehicleId,this.vehicleEnabled).subscribe(
      data => {
        this.vehicle = data as Vehicle;
        this.vehicles[this.vehicleCounter] = data as Vehicle;
      },
      error => {
       // this.disableButtons = false;
        console.log(error);
      })

   
  }
}
