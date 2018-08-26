import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OfficeServices } from '../services/office-services';
import { OfficeModel } from '../models/office-model';
import { Vehicle } from '../models/vehicles';
import { VehicleServices } from '../services/vehicle-services';
import { MapInfo } from '../models/map-info.model';
import { DataService } from '../cards/dataRentService';
import { ServiceData } from '../models/serviceData';
import { VehiclePictures } from '../models/vehicle-pictures';
import { RentServices } from '../services/rent-service';

@Component({
  selector: 'app-manage-offices-vehicles',
  templateUrl: './manage-offices-vehicles.component.html',
  styleUrls: ['./manage-offices-vehicles.component.css']
})
export class ManageOfficesVehiclesComponent implements OnInit {

  constructor(private rentServices: RentServices, private dataService: DataService, private vehicleServices: VehicleServices, private officeServices: OfficeServices, private activatedRoute: ActivatedRoute) {
    activatedRoute.params.subscribe(params => { this.rentServiceId = params["rentServiceId"] });


    this.mapInfo = new MapInfo(45.242268, 19.842954,
      "assets/ftn.png",
      "Jugodrvo", "", "http://ftn.uns.ac.rs/691618389/fakultet-tehnickih-nauka");
  }

  rentServiceId: number;
  pageSizeO: number = 5;
  pageIndexO: number = 1;
  totalPagesNumberO: number = 1;
  pageSizeV: number = 5;
  pageIndexV: number = 1;
  totalPagesNumberV: number = 1;
  offices: OfficeModel[];
  vehicles: Vehicle[];
  vehicle: Vehicle = null;
  vehicleCounter: number;
  vehicleEnabled: boolean;
  vehiclePictures: VehiclePictures[];
  tempPic: string;
  office: OfficeModel = new OfficeModel(1, 1, 'j', 1, 1, 'j');
  officeCounter: number;
  mapInfo: MapInfo;
  @Input() rentServiceTemp: ServiceData=new ServiceData(1," "," "," "," ",1,true,true);

  ngOnInit() {

    //this.dataService.currentMessage.subscribe(rentService => this.rentServiceTemp = rentService)

    this.rentServices.GetRentService(this.rentServiceId).subscribe(
      data => {
        this.rentServiceTemp = data.body[0];
      },
      error => {
        console.log(error);
      })

    this.vehicle = null;
    this.office.Latitude = 1;
    this.office.Longitude = 1;
    this.getServiceOffices();
  }




  placeMarker($event) {
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
    this.vehiclePictures = this.vehicle.VehiclePictures;
    //this.vehilePictures=this.vehicle.VehiclePictures;
    /* this.vehicleServices.GetVehiclePictures(vehicle.VehicleId).subscribe(
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
  setCheckBoxVehicle(event, vehicleId: number) {
    if (event.target.checked) {
      this.vehicleEnabled = true;
    }
    else {
      this.vehicleEnabled = false;
    }
    this.vehicleServices.DisableVehicle(vehicleId, this.vehicleEnabled).subscribe(
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
