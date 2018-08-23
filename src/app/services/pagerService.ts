import { Injectable } from '@angular/core';

import { Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders,HttpResponse } from '@angular/common/http';
import { ServiceData } from '../models/serviceData';
import { Observable } from 'rxjs';
import { Vehicle } from '../models/vehicles';
import { Config } from '../../../node_modules/protractor';

@Injectable({
  providedIn: 'root'
})
export class PagerServices {
  
 constructor(private httpClient: HttpClient) { }


 pageNumber:number=1;
 pageSize:number=2;
 totalPagesNumber:number=20;

 set page(val: number){
    if(val!== this.pageNumber) {
      this.pageNumber=val;
      this.getRentServiceInfo();
    }
  }
  
  getRentServiceInfo():Observable<HttpResponse<Config>> {

    let headers = new HttpHeaders();
    headers = headers.append('Content-type', 'application/x-www-form-urlencoded');

   // return this.httpClient.get('http://localhost:51680/api/rentService/getAll?&pagenumber='+pageNumber+'&pageSize='+pageSize, {"headers": headers}) as Observable<any>
   return this.httpClient.get<Config>('http://localhost:51680/api/rentService/getAll?&pagenumber='+this.pageNumber+'&pageSize='+this.pageSize, { observe: 'response' });
    /* x.subscribe(
      res => {
        console.log(res.access_token);
        
        return res;
      },
      err => {
        console.log("Error occured");
      }
    ); */
  }
  getRentServiceCars(serviceId:number):Observable<Vehicle[]> {

    let headers = new HttpHeaders();
    headers = headers.append('Content-type', 'application/x-www-form-urlencoded');
    
    return this.httpClient.get('http://localhost:51680/api/vehicle/getServiceVehicles/'+serviceId, {"headers": headers}) as Observable<any>

    /* x.subscribe(
      res => {
        console.log(res.access_token);
        
        return res;
      },
      err => {
        console.log("Error occured");
      }
    ); */
  }
}