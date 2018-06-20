import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RentServices } from '../models/rentServices';

@Injectable()
export class DataService {

  private rentService=new BehaviorSubject(new RentServices(1,'a','a','a','a',1));
  currentMessage = this.rentService.asObservable();

  constructor() { }

  changeMessage(rentService1: RentServices) {
    this.rentService.next(rentService1)
  }

}