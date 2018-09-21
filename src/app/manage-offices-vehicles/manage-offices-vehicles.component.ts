import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OfficeServices } from '../services/office-services';
import { OfficeModel } from '../models/office-model';
import { Vehicle } from '../models/vehicles';
import { VehicleServices } from '../services/vehicle-services';
import { MapInfo } from '../models/map-info.model';
import { ServiceData } from '../models/serviceData';
import { VehiclePictures } from '../models/vehicle-pictures';
import { RentServices } from '../services/rent-service';
import { btmNavDataService } from '../bottom-navbar/btmNavDataService';
import { finalize, retry } from 'rxjs/operators'
import { ToasterService } from '../toaster-service/toaster-service.component';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-manage-offices-vehicles',
  templateUrl: './manage-offices-vehicles.component.html',
  styleUrls: ['./manage-offices-vehicles.component.css']
})
export class ManageOfficesVehiclesComponent implements OnInit {

  constructor(private sanitizer: DomSanitizer, private toasterService: ToasterService, private router: Router, private btmNavMessageService: btmNavDataService, private rentServices: RentServices, private vehicleServices: VehicleServices, private officeServices: OfficeServices, private activatedRoute: ActivatedRoute) {
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

  vehiclePictures: VehiclePictures[];
  tempPic: string;
  office: OfficeModel = new OfficeModel(1, 1, 'j', 1, 1, 'j');
  officeCounter: number;
  mapInfo: MapInfo;
  @Input() rentServiceTemp: ServiceData = new ServiceData(1, " ", " ", " ", " ", 1, true, true);
  showProgress: boolean;
  stopProgress: boolean;
  showVehicleProgress: boolean = false;
  showOffices: boolean = false;
  showVehicles: boolean = false;
  showOfficesWarning: boolean = false;
  showVehiclesWarning: boolean = false;
  loading: boolean = true;
  rentServiceETag: string;
  showService: boolean = false;
  showServiceWarning: boolean = false;
  editBtnDisabled: boolean = false;
  checkBoxDisabled: boolean = false;
  showVehicleProgressPic: boolean = false;
  fileToUpload: File = null;

  vehicleEtag:string;
  officeEtag:string;

  imageUrl: string = "/assets/images/default-placeholder.png"
  img: Array<SafeUrl> = ["/assets/images/default-placeholder.png", "/assets/images/default-placeholder.png", "/assets/images/default-placeholder.png"];



  editServiceForm: FormGroup;
  Name: FormControl;
  Email: FormControl;
  Description: FormControl;



  ngOnInit() {

    this.btmNavMessageService.currentMessage.subscribe(message => this.showProgress = message)
    this.btmNavMessageService.changeMessage(true);
    this.rentServices.GetRentService(this.rentServiceId).pipe(finalize(
      () => {
        this.StopProgress();
        this.loading = false;
      }))
      .subscribe(
        data => {
          this.rentServiceTemp = data.body;
          this.rentServiceETag = JSON.parse(data.headers.get('ETag'));
        },
        error => {

          console.log(error);
        })

    this.vehicle = null;
    this.office.Latitude = 1;
    this.office.Longitude = 1;
    this.getServiceOffices();

    this.CreateFormControls();
    this.CreateForm();
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
      }))
      .subscribe(
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
            this.toasterService.Warning(error.error.Message, 'Warning');
            this.showVehiclesWarning = true;
          }
          else {
            this.toasterService.Error(error.error.Message, 'Error');
            this.showVehiclesWarning = false;
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

    this.img = ["/assets/images/default-placeholder.png", "/assets/images/default-placeholder.png", "/assets/images/default-placeholder.png"];


    this.showVehicleProgressPic = true;

    this.vehicleServices.getVehicleInfo(this.vehicle.VehicleId).pipe(finalize(
      () => {
        
      }))
      .subscribe(
        data => {
          this.vehicleEtag = JSON.parse(data.headers.get('ETag'));
          this.vehicle = data.body;

         this.vehicles[counter]=  this.vehicle;


          let count = 0;
          for (let i = 0; i < this.vehiclePictures.length; i++) {
            this.vehicleServices.getImage(this.vehiclePictures[i].Data).pipe(finalize(
              () => {
                count += 1;
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

        },
        error => {
       
            this.toasterService.Error(error.error.Message, 'Error');
        
        })
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


  }
  setCheckBoxVehicle(event, vehicleId: number) {
    let vehicleEnabled: boolean;
    this.checkBoxDisabled = true;
    if (event.target.checked) {
      vehicleEnabled = true;
    }
    else {
      vehicleEnabled = false;
    }
    this.showVehicleProgress = true;
    this.vehicleServices.DisableVehicle(vehicleId, vehicleEnabled,this.vehicleEtag).pipe(finalize(
      () => {
        this.checkBoxDisabled = false;
        this.showVehicleProgress = false;
      }))
      .subscribe(
        data => {
          this.vehicleEtag = JSON.parse(data.headers.get('ETag'));
          this.vehicle = data.body as Vehicle;
          this.vehicles[this.vehicleCounter] = data.body as Vehicle;
          this.toasterService.Info("Vehicle was disabled", 'Info');
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
          console.log(error);
        })
  }
  deleteVehicle($event, vehicleId: number) {
    this.btmNavMessageService.changeMessage(true);
    this.vehicleServices.DeleteVehicle(vehicleId).pipe(finalize(
      () => {
        this.btmNavMessageService.changeMessage(false);
      }))
      .subscribe(
        data => {
          this.getServiceVehicles();
          this.toasterService.Info("Vehicle Deleted", 'Info');

        },
        error => {

          this.toasterService.Error(error.error.Message, 'Error');
          console.log(error);
        })
  }

  deleteOffice($event, officeId: number) {
    this.btmNavMessageService.changeMessage(true);
    this.officeServices.DeleteOffice(officeId).pipe(finalize(
      () => {
        this.btmNavMessageService.changeMessage(false);
      }))
      .subscribe(
        data => {
          this.getServiceOffices();
          this.toasterService.Info("Office was deleted", 'Info');
          //alert("Office Deleted");

        },
        error => {
          // this.disableButtons = false;
          //alert(error.error.Message);
          this.toasterService.Error(error.error.Message, 'Error');
          console.log(error);
        })
  }
  deleteService($event, serviceId: number) {
    this.btmNavMessageService.changeMessage(true);
    this.rentServices.DeleteRentService(serviceId).pipe(finalize(
      () => {
        this.btmNavMessageService.changeMessage(false);
      }))
      .subscribe(
        data => {
          this.toasterService.Info("Service was deleted", 'Info');
          // alert("Service Deleted");
          this.router.navigate(['/editServicesComponent']);
        },
        error => {
          // this.disableButtons = false;
          //alert(error.error.Message);
          this.toasterService.Error(error.error.Message, 'Error');
          console.log(error);
        })
  }

  getServiceInfo() {
    this.showService = false;
    this.editBtnDisabled = true;
    this.btmNavMessageService.changeMessage(true);
    this.rentServices.GetRentService(this.rentServiceId).pipe(finalize(
      () => {
        this.StopProgress();
        this.loading = false;
        if (this.rentServiceTemp.Logo != null && this.rentServiceTemp.Logo != '') {
          this.imageUrl = 'http://localhost:51680/api/rentService/getServiceLogo?path=' + this.rentServiceTemp.Logo;

          this.editBtnDisabled = false;
          this.fileToUpload==null;
        }
        else {
          this.editBtnDisabled = true;
        }
      }))
      .subscribe(
        data => {
          this.rentServiceETag = JSON.parse(data.headers.get('ETag'));
          this.rentServiceTemp = data.body;
          this.showService = true;
          this.showServiceWarning = false


        },
        error => {
          this.showServiceWarning = true;
          console.log(error);
        })
  }

  handleFileInput(file: FileList) {

    this.editBtnDisabled = false;
    this.fileToUpload = file.item(0);
    //Show image preview---
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
    }
    reader.readAsDataURL(this.fileToUpload);
  }

  onSubmit(rentService: ServiceData, form: NgForm) {
    this.btmNavMessageService.changeMessage(true);
    this.editBtnDisabled = true;
    console.log(rentService);


    rentService.RentServiceId = this.rentServiceTemp.RentServiceId;
    debugger;
    if (this.fileToUpload != null && this.fileToUpload.name != null && this.fileToUpload.name != '') {
      rentService.Logo = this.fileToUpload.name;
    }
    this.rentServices.EditRentService(rentService, this.fileToUpload, this.rentServiceETag).pipe(finalize(
      () => {
        
        this.editBtnDisabled = false;
        this.btmNavMessageService.changeMessage(false);
      }))
      .subscribe(
        data => {
          this.rentServiceETag = JSON.parse(data.headers.get('ETag'));
          this.rentServiceTemp=data.body;
          this.toasterService.Info("Rent Service was edited", 'Info');

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


  CreateFormControls() {
    this.Name = new FormControl('', [
      Validators.required,
      Validators.maxLength(50),
    ]);
    this.Description = new FormControl('', [
      Validators.required,
      Validators.maxLength(250),
    ]);
    this.Email = new FormControl('', [
      Validators.pattern('^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$'),
      Validators.required,
      Validators.maxLength(100),
    ]);

  }
  CreateForm() {
    this.editServiceForm = new FormGroup({
      Name: this.Name,
      Description: this.Description,
      Email: this.Email

    });
  }
}
