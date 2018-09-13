import { Component, OnInit, ViewChild, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { ProcessItem } from './process-item';
import { CardsComponent } from '../cards/cards.component';
//import { ViewContainerRef } from '@angular/core/src/linker/view_container_ref';
import { ProcessComponent } from './process';
import { Services } from '../services/services.component';
import { btmNavDataService } from '../bottom-navbar/btmNavDataService';
//import { PagerServices } from '../services/pagerService';
import { finalize } from 'rxjs/operators'



@Component({
  selector: 'app-rent-services',
  templateUrl: './rent-services.component.html',
  styleUrls: ['./rent-services.component.css'],
  providers: [CardsComponent],
})
export class RentServicesComponent implements OnInit {

  rentServices: any;
  vehicles: any;
  counter: number;
  pageIndex: number = 1;
  pageSize: number = 9;
  totalPagesNumber: number = 0;
  cardsVisible: boolean = false;
  showProgress: boolean = true;
option:number=1;

  @ViewChild('processContainer', { read: ViewContainerRef }) container;
  constructor(private btmNavMessageService: btmNavDataService, private Cards: CardsComponent, private resolver: ComponentFactoryResolver/* ,private PagerService: PagerServices */, private Service: Services) {
    this.counter = 0;
  }
  //@ViewChild('cards') child: CardsComponent;
  //@ViewChild('vehicleCards') vehicleChild: VehicleCardsComponent;

  set page(val: number) {
    if (val !== this.pageIndex) {
      this.pageIndex = val;
      this.getRentServices();
    }
  }

  ngOnInit() {
    this.btmNavMessageService.currentMessage.subscribe(message => this.showProgress = message)
    
    this.getRentServices();

  }
  ngOnDestroy() {
    this.btmNavMessageService.changeMessage(false);
  }
  public getRentServices() {
    this.btmNavMessageService.changeMessage(true);
    this.Service.GetRentServiceInfo(this.pageIndex, this.pageSize,this.option) .pipe(finalize(
      () => {
        this.btmNavMessageService.changeMessage(false);
      }))
    .subscribe(
      data => {

        this.rentServices = data.body;
        this.cardsVisible = true;
        let jsonData = JSON.parse(data.headers.get('Paging-Headers'));

        this.pageIndex = jsonData.currentPage;
        this.pageSize = jsonData.pageSize;
        this.totalPagesNumber = jsonData.totalPages;
        /*   for (let item of this.rentServices) {
           
            this.child.rentServices[this.counter] = item;
            this.child.isVisible[this.counter++]=true;
          }
          for (let i=this.counter;i<this.pageSize;i++) {
              this.child.isVisible[i]=false;
            
          } */
        //alert("GET: id: " + this.methodResult.id + ", userId: " + this.methodResult.userId + ", title: " + this.methodResult.title + ", body: " + this.methodResult.body);
      },
      error => {
        console.log(error);
      })

    //this.RentServices = JSON.parse(temp);


    //(<ProcessComponent>componentRef.instance).data=step.desc;

  }
  /* getVehicles($event) {
    let a;
    this.Service.getRentServiceCars($event).subscribe(
      data => {
        this.vehicles = data;

        for (let i=0;i<this.counter;i++) {
          this.child.toggle(i);
        }
        this.counter=0
        for (let item of this.vehicles) {
         // this.vehicleChild.vehicles[this.counter] = item;
          //this.vehicleChild.toggle(this.counter++);
        }
        //alert("GET: id: " + this.methodResult.id + ", userId: " + this.methodResult.userId + ", title: " + this.methodResult.title + ", body: " + this.methodResult.body);

      },
      error => {
        console.log(error);
      })
  } */
  setRadio($event) {
    if ('noSorting' == $event.target.value) {
      this.option = 1;
    }
    else if ('bestGades' == $event.target.value) {
      this.option = 2;
    }
    else if ('mostVehicles' == $event.target.value) {
      this.option = 3;
    }
    else {//mostOrders
      this.option = 4;
    }
    this.getRentServices();
    /* this.Service.GetRentServiceInfo(this.pageNumber, this.pageSize,this.option).subscribe(
      data => {
        this.rentServices = data.body;
        this.cardsVisible = true;
        let jsonData = JSON.parse(data.headers.get('Paging-Headers'));

        this.pageNumber = jsonData.currentPage;
        this.pageSize = jsonData.pageSize;
        this.totalPagesNumber = jsonData.totalPages;
        this.btmNavMessageService.changeMessage(false);
      
      },
      error => {
        this.btmNavMessageService.changeMessage(false);
        console.log(error);
      }) */
  }
}