import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { VehicleCardsComponent } from '../vehicle-cards/vehicle-cards.component';
import { Services } from '../services/services.component';
import { RentServices } from '../models/rentServices';
import { DataService } from '../cards/dataRentService';
@Component({
  selector: 'app-vehicle-page',
  templateUrl: './vehicle-page.component.html',
  styleUrls: ['./vehicle-page.component.css']
})
export class VehiclePageComponent implements OnInit {

  @ViewChild('vehicleCards') child: VehicleCardsComponent;
  Id: string = "-1";
  vehicles: any;
  counter: number;
  rentServiceTemp:RentServices;
  rentService:RentServices;
  pageNumber:number=1;
  pageSize:number=2;
  totalPagesNumber:number=20;
  id: number;
  
  constructor(private dataRentService: DataService,private Service: Services, private router: Router, private activatedRoute: ActivatedRoute) {
    activatedRoute.params.subscribe(params => { this.Id = params["rentServiceId"] });
  }
  /*  constructor(private Service: Services, private _routeParams: ActivatedRoute) {
     var queryParam = this._routeParams.get('q');
  } */
  
  ngOnInit() {
    this.dataRentService.currentMessage.subscribe(rentService => this.rentServiceTemp = rentService)
    this.rentService=this.rentServiceTemp;
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

  public getVehicles() {
    this.Service.getRentServiceCars(parseInt(this.Id),this.pageNumber,this.pageSize).subscribe(
      data => {
        this.counter=0;
        this.vehicles = data.body;
      
        let jsonData = JSON.parse(data.headers.get('Paging-Headers')); 

        this.pageNumber=jsonData.currentPage;
        this.pageSize=jsonData.pageSize;
        this.totalPagesNumber=jsonData.totalPages;

        for (let item of this.vehicles) {
          /*   const factory = this.resolver.resolveComponentFactory(CardsComponent);
           let componentReference = this.container.createComponent(factory); 
           (<ProcessComponent>componentReference.instance).data=item; */
          //this.Cards.toggle(this.counter);
          this.child.vehicles[this.counter] = item;
          this.child.isVisible[this.counter++]=true;
        }
        for (let i=this.counter;i<this.pageSize;i++) {
            this.child.isVisible[i]=false;
          
        }
        //alert("GET: id: " + this.methodResult.id + ", userId: " + this.methodResult.userId + ", title: " + this.methodResult.title + ", body: " + this.methodResult.body);
      },
      error => {
        console.log(error);
      })
      
    //this.RentServices = JSON.parse(temp);


    //(<ProcessComponent>componentRef.instance).data=step.desc;
    
  }

  set page(val: number){
    if(val!== this.pageNumber) {
      this.pageNumber=val;
      this.getVehicles();
    }
  }
}
