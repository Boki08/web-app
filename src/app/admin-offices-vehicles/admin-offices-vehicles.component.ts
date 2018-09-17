import { Component, OnInit, Input } from '@angular/core';
import { ServiceData } from '../models/serviceData';
import { ActivatedRoute } from '@angular/router';
import { RentServices } from '../services/rent-service';
import { btmNavDataService } from '../bottom-navbar/btmNavDataService';
import { OfficeServices } from '../services/office-services';
import { VehicleServices } from '../services/vehicle-services';
import { OfficeModel } from '../models/office-model';
import { Vehicle } from '../models/vehicles';
import { VehiclePictures } from '../models/vehicle-pictures';
import { MapInfo } from '../models/map-info.model';
import { finalize } from 'rxjs/operators'
import { ToasterService } from '../toaster-service/toaster-service.component';

@Component({
  selector: 'app-admin-offices-vehicles',
  templateUrl: './admin-offices-vehicles.component.html',
  styleUrls: ['./admin-offices-vehicles.component.css']
})
export class AdminOfficesVehiclesComponent implements OnInit {

  constructor(private toasterService:ToasterService,private btmNavMessageService: btmNavDataService, private rentServices: RentServices, private vehicleServices: VehicleServices, private officeServices: OfficeServices, private activatedRoute: ActivatedRoute) {
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
  vehicle: Vehicle ;
  vehicleCounter: number;
 // vehicleEnabled: boolean;
  vehiclePictures: VehiclePictures[];
  tempPic: string;
  office: OfficeModel;
  officeCounter: number;
  mapInfo: MapInfo;
  @Input() rentServiceTemp: ServiceData ;
  showProgress: boolean;
  stopProgress: boolean;
  showVehicleProgress: boolean = false;
  showOffices: boolean = false;
  showVehicles: boolean = false;
  mapVisible: boolean = false;
  checkBoxDisabled: boolean = true;
  showOfficesWarning: boolean = false;
  showVehiclesWarning: boolean = false;

  ngOnInit() {

    this.btmNavMessageService.currentMessage.subscribe(message => this.showProgress = message)
    //this.dataService.currentMessage.subscribe(rentService => this.rentServiceTemp = rentService)
    this.btmNavMessageService.changeMessage(true);
    this.rentServices.GetRentService(this.rentServiceId) .pipe(finalize(
      () => {
        this.StopProgress();
      }))
    .subscribe(
      data => {
        
        this.rentServiceTemp = data.body;
        this.checkBoxDisabled=false;
      },
      error => {
        
        console.log(error);
      })

    /* this.vehicle = null;
    this.office.Latitude = 1;
    this.office.Longitude = 1; */
    this.getServiceOffices();
  }
  ngOnDestroy() {
    this.btmNavMessageService.changeMessage(false);
  }

  StopProgress() {
    if (this.stopProgress == true) {
      this.btmNavMessageService.changeMessage(false);
      //his.stopProgress = false;
    }
    else {
      this.stopProgress = true;
    }
  }


  placeMarker($event) {
    console.log($event.coords.lat);
    console.log($event.coords.lng);
  }






  public getServiceOffices() {
    this.btmNavMessageService.changeMessage(true);
    this.officeServices.GetRentOffices(this.rentServiceId, this.pageIndexO, this.pageSizeO).pipe(finalize(
      () => {
        this.StopProgress();
      })).subscribe(
      data => {
        this.offices = data.body as OfficeModel[];
        //this.userData=this.users[0];

      /*   if (this.offices.length > 0) { */
          let jsonData = JSON.parse(data.headers.get('Paging-Headers'));

          this.pageIndexO = jsonData.currentPage;
          this.pageSizeO = jsonData.pageSize;
          this.totalPagesNumberO = jsonData.totalPages;
          this.showOffices = true;
          this.showOfficesWarning=false;
        /* }
        else
        {
          this.showOffices = false;
        }   */     
      },
      error => {
        if(error.error.Message==='There are no Offices'){
          this.showOfficesWarning=true;
          this.toasterService.Warning(error.error.Message,'Warning');
        }
        else{
          this.showOfficesWarning=false;
          this.toasterService.Error(error.error.Message,'Error');
        }
        this.showOffices = false;
        //console.log(error);
      })
  }
  public getServiceVehicles() {
    this.btmNavMessageService.changeMessage(true);
    this.vehicleServices.GetRentVehicles(this.rentServiceId, this.pageIndexV, this.pageSizeV).pipe(finalize(
      () => {
        this.StopProgress();
      }))
    .subscribe(
      data => {
        this.vehicles = data.body as Vehicle[];

       /*  if (this.vehicles.length > 0) { */
          let jsonData = JSON.parse(data.headers.get('Paging-Headers'));

          this.pageIndexV = jsonData.currentPage;
          this.pageSizeV = jsonData.pageSize;
          this.totalPagesNumberV = jsonData.totalPages;
          this.showVehicles = true;
          this.showVehiclesWarning=false;
       /*  }
        else {
          
          
        } */
      
      },
      error => {
        if (error.error.Message === 'There are no Vehicles') {
          this.showVehiclesWarning=true;
          this.toasterService.Warning(error.error.Message, 'Warning');
        }
        else {
          this.showVehiclesWarning=false;
          this.toasterService.Error(error.error.Message, 'Error');

        }
        this.showVehicles = false;
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
    this.mapVisible=false;
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
    this.mapVisible=true;

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
  /* setCheckBoxVehicle(event, vehicleId: number) {
    let vehicleEnabled:boolean;
    if (event.target.checked) {
       vehicleEnabled = true;
    }
    else {
      vehicleEnabled = false;
    }
    this.showVehicleProgress = true;
    this.vehicleServices.DisableVehicle(vehicleId, vehicleEnabled).subscribe(
      data => {
        this.vehicle = data as Vehicle;
        this.vehicles[this.vehicleCounter] = data as Vehicle;
        this.showVehicleProgress = false;
      },
      error => {
        // this.disableButtons = false;
        this.showVehicleProgress = false;
        console.log(error);
      })


  } */

  setCheckBoxService(event) {
    this.btmNavMessageService.changeMessage(true);
    this.checkBoxDisabled = true;
    let serviceActivated: boolean;
    if (event.target.checked) {
      serviceActivated = true;
    }
    else {
      serviceActivated = false;
    }


    this.rentServices.ActivateRentService(this.rentServiceTemp.RentServiceId, serviceActivated) .pipe(finalize(
      () => {
        this.checkBoxDisabled=false
        this.btmNavMessageService.changeMessage(false);
      }))
    .subscribe(
      data => {
      
        this.rentServiceTemp.Activated=serviceActivated;
        this.toasterService.Info(data.body,'Info');
      },
      error => {
        this.toasterService.Error(error.error.Message,'Error');
       // alert(error.error.Message);
      }
    )
  }
}
