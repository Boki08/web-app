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
  pageNumber: number = 1;
  pageSize: number = 9;
  totalPagesNumber: number = 20;
  rentServiceId: number;
  @Input() isVisible: boolean[];
  vehicle: Vehicle;
  vehiclePictures: VehiclePictures[];
  @Input() logedIn:boolean=false;
  selectedTypePrice:string="Price Sort";
  typePriceToServer:string="Mixed";
  vehicleTypes: VehicleTypes[];
  selectedTypeVehicle :string = "Type Sort";
  selectedTypeVehicleIdToServer: number=-1;
  availableCheckedToServer:boolean=false;
  
  
  constructor(private commentServices:CommentServices,private vehicleServices: VehicleServices, private rentServices: RentServices, private dataRentService: DataService, private Service: Services, private router: Router, private activatedRoute: ActivatedRoute) {
    activatedRoute.params.subscribe(params => { this.rentServiceId = params["rentServiceId"] });

    if (localStorage.role!=null &&  localStorage.role == "AppUser") {
      this.logedIn = true;
    }
    else {
      this.logedIn = false;
    }
    this.vehicleServices.GetVehicleTypes()
      .subscribe(
        data => {
          this.vehicleTypes = data.body as VehicleTypes[];
          this.vehicleTypes.push(new VehicleTypes(-1,"All"))
        },
        error => {
          alert(error.error.ModelState[""][0]);

        }
      );
  }
  ngOnDestroy(): void {
    
  }
  /*  constructor(private Service: Services, private _routeParams: ActivatedRoute) {
     var queryParam = this._routeParams.get('q');
  } */

  ngOnInit() {
    /*  this.dataRentService.currentMessage.subscribe(rentService => this.rentServiceTemp = rentService) */
    this.rentServices.GetRentService(this.rentServiceId).subscribe(
      data => {
        this.rentService = data.body[0];
      },
      error => {
        console.log(error);
      })
    //this.rentService=this.rentServiceTemp;
    this.getVehicles();
    /*  //this.sub = this.activatedRoute.params.subscribe(params => {
     // this.id = +params['rentServiceId'];
    //}); 

    for (let i=0;i<this.counter;i++) {
      this.child.toggle(i);
    }

    this.counter = 0;
    this.Service.getRentServiceCars(parseInt(this.Id)).subscribe(
      data => {
        this.vehicles = data;

        for (let item of this.vehicles) {
          this.child.vehicles[this.counter] = item;
          this.child.toggle(this.counter++);
        }

      },
      error => {
        console.log(error);
      }) */
  }
  vehicleDetails(vehicle: Vehicle, counter: number) {
    this.vehicle = vehicle;
    //this.vehicleCounter = counter;
    if(this.vehicle.VehiclePictures.length>0){
    this.vehiclePictures = this.vehicle.VehiclePictures;}
    else{
      this.vehiclePictures=[];
      this.vehiclePictures.push(new VehiclePictures(1,1,'pic'));
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
    this.vehicleServices.GetRentVehiclesUser(this.rentServiceId, this.pageNumber, this.pageSize,this.availableCheckedToServer,this.typePriceToServer,this.selectedTypeVehicleIdToServer).subscribe(
      data => {
        this.counter = 0;
        
        this.vehicles = data.body as Vehicle[];


        let jsonData = JSON.parse(data.headers.get('Paging-Headers'));

        this.pageNumber = jsonData.currentPage;
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

  set page(val: number) {
    if (val !== this.pageNumber) {
      this.pageNumber = val;
      this.getVehicles();
    }
  }
  GetSelectedType(type:string) {
    if(type=="Low")
   {
    this.selectedTypePrice="Price - Low to High";
    this.typePriceToServer='Low';
   }
   else if(type=="High"){
    this.selectedTypePrice="Price - High to Low";
    this.typePriceToServer='High';
   }
   else{
    this.selectedTypePrice="Price - Mixed";
    this.typePriceToServer='Mixed';
   }
   this.getVehicles();
  }
  GetSelectedTypeVehicle(type:VehicleTypes) {
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
  getComments(){
    this.commentServices.GetServiceComments(this.rentServiceId).subscribe(
      data => {
        this.counter = 0;
        
        this.vehicles = data.body as Vehicle[];


        let jsonData = JSON.parse(data.headers.get('Paging-Headers'));

        this.pageNumber = jsonData.currentPage;
        this.pageSize = jsonData.pageSize;
        this.totalPagesNumber = jsonData.totalPages;

        
       
        //alert("GET: id: " + this.methodResult.id + ", userId: " + this.methodResult.userId + ", title: " + this.methodResult.title + ", body: " + this.methodResult.body);
      },
      error => {
        console.log(error);
      })
  }
}
