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
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-admin-offices-vehicles',
  templateUrl: './admin-offices-vehicles.component.html',
  styleUrls: ['./admin-offices-vehicles.component.css']
})
export class AdminOfficesVehiclesComponent implements OnInit {

  constructor(private sanitizer: DomSanitizer, private toasterService: ToasterService, private btmNavMessageService: btmNavDataService, private rentServices: RentServices, private vehicleServices: VehicleServices, private officeServices: OfficeServices, private activatedRoute: ActivatedRoute) {
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
  vehicle: Vehicle;
  vehicleCounter: number;

  vehiclePictures: VehiclePictures[];
  tempPic: string;
  office: OfficeModel;
  officeCounter: number;
  mapInfo: MapInfo;
  @Input() rentServiceTemp: ServiceData;
  showProgress: boolean;
  stopProgress: boolean;
  showVehicleProgress: boolean = false;
  showOffices: boolean = false;
  showVehicles: boolean = false;
  mapVisible: boolean = false;
  checkBoxDisabled: boolean = true;
  showOfficesWarning: boolean = false;
  showVehiclesWarning: boolean = false;
  showVehicleProgressPic: boolean = false;
  rentServiceEtag:string;

  img: Array<SafeUrl> = ["/assets/images/default-placeholder.png", "/assets/images/default-placeholder.png", "/assets/images/default-placeholder.png"];

  ngOnInit() {

    this.btmNavMessageService.currentMessage.subscribe(message => this.showProgress = message)

    this.btmNavMessageService.changeMessage(true);
    this.rentServices.GetRentService(this.rentServiceId).pipe(finalize(
      () => {
        this.StopProgress();
      }))
      .subscribe(
        data => {
          this.rentServiceEtag = JSON.parse(data.headers.get('ETag'));
          this.rentServiceTemp = data.body;
          this.checkBoxDisabled = false;
        },
        error => {

          console.log(error);
        })

    this.getServiceOffices();
  }
  ngOnDestroy() {
    this.btmNavMessageService.changeMessage(false);
  }

  StopProgress() {
    if (this.stopProgress == true) {
      this.btmNavMessageService.changeMessage(false);

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

          let jsonData = JSON.parse(data.headers.get('Paging-Headers'));

          this.pageIndexO = jsonData.currentPage;
          this.pageSizeO = jsonData.pageSize;
          this.totalPagesNumberO = jsonData.totalPages;
          this.showOffices = true;
          this.showOfficesWarning = false;

        },
        error => {
          if (error.error.Message === 'There are no Offices') {
            this.showOfficesWarning = true;
            this.toasterService.Warning(error.error.Message, 'Warning');
          }
          else {
            this.showOfficesWarning = false;
            this.toasterService.Error(error.error.Message, 'Error');
          }
          this.showOffices = false;

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


          let jsonData = JSON.parse(data.headers.get('Paging-Headers'));

          this.pageIndexV = jsonData.currentPage;
          this.pageSizeV = jsonData.pageSize;
          this.totalPagesNumberV = jsonData.totalPages;
          this.showVehicles = true;
          this.showVehiclesWarning = false;


        },
        error => {
          if (error.error.Message === 'There are no Vehicles') {
            this.showVehiclesWarning = true;
            this.toasterService.Warning(error.error.Message, 'Warning');
          }
          else {
            this.showVehiclesWarning = false;
            this.toasterService.Error(error.error.Message, 'Error');

          }
          this.showVehicles = false;
          console.log(error);
        })
  }

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
    this.mapVisible = false;


    this.img = ["/assets/images/default-placeholder.png", "/assets/images/default-placeholder.png", "/assets/images/default-placeholder.png"];

    this.showVehicleProgressPic = true;

    let count=0;
    for (let i = 0; i < this.vehiclePictures.length; i++) {
      this.vehicleServices.getImage(this.vehiclePictures[i].Data).pipe(finalize(
        () => {
          count+=1;
          if (count == this.vehiclePictures.length) {
            this.showVehicleProgressPic = false;
          }
        }))
        .subscribe(
          data => {
            this.createImageFromBlob(data, i);
          },
          error => {
            this.toasterService.Error(error.error.Message, 'Error');
          })
    }
  }


  createImageFromBlob(image: Blob, counter: number) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.img[counter] = this.sanitizer.bypassSecurityTrustResourceUrl(reader.result as string);
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  officeDetails(office: OfficeModel, counter: number) {
    this.office = office;
    this.officeCounter = counter;
    this.mapVisible = true;


  }



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


    this.rentServices.ActivateRentService(this.rentServiceTemp.RentServiceId, serviceActivated,this.rentServiceEtag).pipe(finalize(
      () => {
        this.checkBoxDisabled = false
        this.btmNavMessageService.changeMessage(false);
      }))
      .subscribe(
        data => {
          this.rentServiceEtag = JSON.parse(data.headers.get('ETag'));
          this.rentServiceTemp.Activated = serviceActivated;
          this.toasterService.Info(data.body, 'Info');
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
      )
  }
}
