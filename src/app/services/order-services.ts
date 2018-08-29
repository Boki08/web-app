import { Injectable } from '@angular/core';
//import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { OrderData } from '../models/orderData';
/* import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map'; */

@Injectable({
  providedIn: 'root'
})
export class OrderServices {

  constructor( private httpClient: HttpClient) { }

  OrderVehicle(order:OrderData): Observable<any> {
    return this.httpClient.post("http://localhost:51680/api/order/postOrder", order);
  }
  GetAllUserOrders(pageIndex:number, pageSize:number):Observable<any>{
    return this.httpClient.get("http://localhost:51680/api/order/getAllUserOrders/"+pageIndex+"/"+pageSize, { observe: 'response' });
  }
 ReturnVehicle(orderId:number):Observable<any>{
    return this.httpClient.get("http://localhost:51680/api/order/returnVehicle/"+orderId, { observe: 'response' });
 }
}
