import { Component, OnInit, ViewChild, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { ProcessItem } from './process-item';
import { CardsComponent } from '../cards/cards.component';
//import { ViewContainerRef } from '@angular/core/src/linker/view_container_ref';
import { ProcessComponent } from './process';
import { Services } from '../services/services.component';
import { RentServices } from '../models/rentServices';


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

  @ViewChild('processContainer', { read: ViewContainerRef }) container;
  constructor(private Cards: CardsComponent, private resolver: ComponentFactoryResolver, private Service: Services) {
    this.counter = 0;
  }
  @ViewChild('cards') child: CardsComponent;
  //@ViewChild('vehicleCards') vehicleChild: VehicleCardsComponent;

  ngOnInit() {

    this.Service.getRentServiceInfo().subscribe(
      data => {
        this.rentServices = data;

        for (let item of this.rentServices) {
          /*   const factory = this.resolver.resolveComponentFactory(CardsComponent);
           let componentReference = this.container.createComponent(factory); 
           (<ProcessComponent>componentReference.instance).data=item; */
          //this.Cards.toggle(this.counter);
          this.child.rentServices[this.counter] = item;
          this.child.toggle(this.counter++);
        }
        //alert("GET: id: " + this.methodResult.id + ", userId: " + this.methodResult.userId + ", title: " + this.methodResult.title + ", body: " + this.methodResult.body);

      },
      error => {
        console.log(error);
      })
    //this.RentServices = JSON.parse(temp);


    //(<ProcessComponent>componentRef.instance).data=step.desc;
  }
  getVehicles($event) {
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
  }
  
}