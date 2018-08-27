import { Component, OnInit, Input, ViewEncapsulation, Injectable, Output, EventEmitter } from '@angular/core';
import { Services } from '../services/services.component';
import { ServiceData } from '../models/serviceData';
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
@Input() isUser:boolean;
imgSrc:string[]=["http://placehold.it/700x400","http://placehold.it/700x400","http://placehold.it/700x400","http://placehold.it/700x400","http://placehold.it/700x400","http://placehold.it/700x400","http://placehold.it/700x400"]

  constructor(private dataRentService: DataService/* private Service: Services */) {
    this.isVisible = [false, false, false, false, false, false];
    this.rentServices = [true, true, true, false, false, false];
  }

  ngOnInit() {

  }



  toggle(num: number): void {
    this.isVisible[num] = !this.isVisible[num];
  }


  sendMessage(serviceId: number) {
    for (let item of this.rentServices) {
      if (item.RentServiceId == serviceId) {
        this.dataRentService.changeMessage(item);
        break;
      }
    }

  }
}
