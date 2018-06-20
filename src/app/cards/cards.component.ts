import { Component, OnInit, Input, ViewEncapsulation, Injectable, Output, EventEmitter } from '@angular/core';
import { Services } from '../services/services.component';
import { RentServices } from '../models/rentServices';
import { ProcessComponent } from '../rent-services/process';
import { DataService } from './dataRentService';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css'],
  encapsulation: ViewEncapsulation.None,
  //providers: [Services],
})
export class CardsComponent implements OnInit, ProcessComponent {

  //private rentService=new BehaviorSubject(new RentServices(1,'a','a','a','a',1));
  //currentMessage = this.rentService.asObservable();


  @Input() isVisible: boolean[];

  @Input() data: any;
  @Input() rentServices: any[];
  constructor(private dataRentService: DataService/* private Service: Services */) {
    this.isVisible = [false, false, false, false, false, false];
    this.rentServices = [true, true, true, false, false, false];
  }

  ngOnInit() {

    /* let temp:any;
    this.Service.getRentServiceInfo().subscribe(
      data => {
        this.rentServices = data;
        //alert("GET: id: " + this.methodResult.id + ", userId: " + this.methodResult.userId + ", title: " + this.methodResult.title + ", body: " + this.methodResult.body);
      },
      error => {
        console.log(error);
      })
        //this.RentServices = JSON.parse(temp); */

  }
  toggle(num: number): void {
    this.isVisible[num] = !this.isVisible[num];
  }

 
  sendMessage(serviceId:number){
    for (let item of this.rentServices) {
      if(item.RentServiceId==serviceId){
        this.dataRentService.changeMessage(item);
        break;
      }
    }
    
  }
}
