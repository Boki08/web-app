import { Component, OnInit, ViewChild, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { ProcessItem } from './process-item';
import { CardsComponent } from '../cards/cards.component';
//import { ViewContainerRef } from '@angular/core/src/linker/view_container_ref';
import { ProcessComponent } from './process';
import { Services } from '../services/services.component';

@Component({
  selector: 'app-rent-services',
  templateUrl: './rent-services.component.html',
  styleUrls: ['./rent-services.component.css']
})
export class RentServicesComponent implements OnInit {

  rentServices: any;

  @ViewChild('processContainer', { read: ViewContainerRef }) container;
  constructor(private resolver: ComponentFactoryResolver, private Service: Services) {

  }

  ngOnInit() {


    this.Service.getRentServiceInfo().subscribe(
      data => {
        this.rentServices = data;

        for(let item of this.rentServices){
          const factory = this.resolver.resolveComponentFactory(CardsComponent);
          let componentReference = this.container.createComponent(factory);
          (<ProcessComponent>componentReference.instance).data=item;
          
        }
        //alert("GET: id: " + this.methodResult.id + ", userId: " + this.methodResult.userId + ", title: " + this.methodResult.title + ", body: " + this.methodResult.body);
        
      },
      error => {
        console.log(error);
      })
    //this.RentServices = JSON.parse(temp);


    //(<ProcessComponent>componentRef.instance).data=step.desc;
  }

}