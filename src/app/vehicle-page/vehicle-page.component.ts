import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { VehicleCardsComponent } from '../vehicle-cards/vehicle-cards.component';
import { Services } from '../services/services.component';
import { ServiceData } from '../models/serviceData';
import { DataService } from '../cards/dataRentService';
import { RentServices } from '../services/rent-service';
import { VehicleServices } from '../services/vehicle-services';
import { Vehicle } from '../models/vehicles';
import { VehiclePictures } from '../models/vehicle-pictures';
import { VehicleTypes } from '../models/vehicleTypes';
import { CommentServices } from '../services/comment-services';
import { btmNavDataService } from '../bottom-navbar/btmNavDataService';
import { CommentModel } from '../models/commentData';
import { VehicleTypeServices } from '../services/vehicleType-services';
import { finalize } from 'rxjs/operators'

@Component({
  selector: 'app-vehicle-page',
  templateUrl: './vehicle-page.component.html',
  styleUrls: ['./vehicle-page.component.css']
})
export class VehiclePageComponent implements OnInit {

  //@ViewChild('vehicleModal') modal; 
  Id: string = "-1";
  vehicles: Vehicle[];
  counter: number;
  rentServiceTemp: ServiceData;
  rentService: ServiceData = new ServiceData(1, " ", " ", " ", " ", 1, true, true);
  pageIndex: number = 1;
  pageSize: number = 9;
  totalPagesNumber: number = 0;
  rentServiceId: number;
  @Input() isVisible: boolean[];
  vehicle: Vehicle;
  vehiclePictures: VehiclePictures[];
  @Input() logedIn: boolean = false;
  selectedTypePrice: string = "Price Sort";
  typePriceToServer: string = "Mixed";
  vehicleTypes: VehicleTypes[];
  selectedTypeVehicle: string = "Type Sort";
  selectedTypeVehicleIdToServer: number = -1;
  availableCheckedToServer: boolean = false;
  showProgress: boolean;
  stopNav: number = 0;
  comments:CommentModel[];
  showOrderProgress:boolean=false;

  constructor(private vehicleTypeServices:VehicleTypeServices,private btmNavMessageService: btmNavDataService, private commentServices: CommentServices, private vehicleServices: VehicleServices, private rentServices: RentServices, private dataRentService: DataService, private Service: Services, private router: Router, private activatedRoute: ActivatedRoute) {
    activatedRoute.params.subscribe(params => { this.rentServiceId = params["rentServiceId"] });

    if (localStorage.role != null && localStorage.role == "AppUser") {
      this.logedIn = true;
    }
    else {
      this.logedIn = false;
    }
    this.btmNavMessageService.changeMessage(true);
    this.vehicleTypeServices.GetVehicleTypes().pipe(finalize(
      () => {
        this.StopNav();
      }))
      .subscribe(
        data => {
          this.vehicleTypes = data.body as VehicleTypes[];
          this.vehicleTypes.push(new VehicleTypes(-1, "All"))
          
         
        },
        error => {
       
          alert(error.error.ModelState[""][0]);

        }
      );
  }
  ngOnDestroy() {
    this.btmNavMessageService.changeMessage(false);
  }


  ngOnInit() {
    this.btmNavMessageService.currentMessage.subscribe(message => this.showProgress = message)

    /*  this.dataRentService.currentMessage.subscribe(rentService => this.rentServiceTemp = rentService) */
    this.btmNavMessageService.changeMessage(true);
    this.rentServices.GetRentService(this.rentServiceId).pipe(finalize(
      () => {
        this.StopNav();
      }))
    .subscribe(
      data => {
        this.rentService = data.body[0];

      },
      error => {
      
        console.log(error);
      })
    //this.rentService=this.rentServiceTemp;
    this.getVehicles();

  }
  vehicleDetails(vehicle: Vehicle, counter: number) {
    this.vehicle = vehicle;
    //this.vehicleCounter = counter;
    if (this.vehicle.VehiclePictures.length > 0) {
      this.vehiclePictures = this.vehicle.VehiclePictures;
    }
    else {
      this.vehiclePictures = [];
      this.vehiclePictures.push(new VehiclePictures(1, 1, 'pic'));
    }
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

  public getVehicles() {
    this.btmNavMessageService.changeMessage(true);
    this.vehicleServices.GetRentVehiclesUser(this.rentServiceId, this.pageIndex, this.pageSize, this.availableCheckedToServer, this.typePriceToServer, this.selectedTypeVehicleIdToServer).pipe(finalize(
      () => {
        this.StopNav();
      }))
    .subscribe(
      data => {
        this.counter = 0;

        this.vehicles = data.body as Vehicle[];


        let jsonData = JSON.parse(data.headers.get('Paging-Headers'));

        this.pageIndex = jsonData.currentPage;
        this.pageSize = jsonData.pageSize;
        this.totalPagesNumber = jsonData.totalPages;

       
        //alert("GET: id: " + this.methodResult.id + ", userId: " + this.methodResult.userId + ", title: " + this.methodResult.title + ", body: " + this.methodResult.body);
      },
      error => {
       
        console.log(error);
      })

    //this.RentServices = JSON.parse(temp);


    //(<ProcessComponent>componentRef.instance).data=step.desc;

  }

StopNav(){
  if (this.stopNav == 2) {
    this.btmNavMessageService.changeMessage(false);

  }
  else {
    this.stopNav += 1;
  }
}

  set page(val: number) {
    if (val !== this.pageIndex) {
      this.pageIndex = val;
      this.getVehicles();
    }
  }
  GetSelectedType(type: string) {
    if (type == "Low") {
      this.selectedTypePrice = "Price - Low to High";
      this.typePriceToServer = 'Low';
    }
    else if (type == "High") {
      this.selectedTypePrice = "Price - High to Low";
      this.typePriceToServer = 'High';
    }
    else {
      this.selectedTypePrice = "Price - Mixed";
      this.typePriceToServer = 'Mixed';
    }
    this.getVehicles();
  }
  GetSelectedTypeVehicle(type: VehicleTypes) {
    this.selectedTypeVehicle = type.Type;
    this.selectedTypeVehicleIdToServer = type.TypeId;

    this.getVehicles();
  }
  setCheckBoxAvailable(event) {
    if (event.target.checked) {
      this.availableCheckedToServer = true;
    }
    else {
      this.availableCheckedToServer = false;
    }
    this.getVehicles();
  }
  getComments() {
    this.showOrderProgress=true;
    this.commentServices.GetServiceComments(this.rentServiceId).pipe(finalize(
      () => {
        this.showOrderProgress=false;
      }))
    .subscribe(
      data => {
        this.counter = 0;

        this.comments = data.body as CommentModel[];
       

        //alert("GET: id: " + this.methodResult.id + ", userId: " + this.methodResult.userId + ", title: " + this.methodResult.title + ", body: " + this.methodResult.body);
      },
      error => {
     
        console.log(error);
      })
  }
}
