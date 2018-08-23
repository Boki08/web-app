import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ServiceData } from '../models/serviceData';

@Injectable()
export class DataService {

  private rentService=new BehaviorSubject(new ServiceData(1,'a','a','a','a',1,true,true));
  currentMessage = this.rentService.asObservable();

  constructor() { }

  changeMessage(rentService1: ServiceData) {
    this.rentService.next(rentService1)
  }

}