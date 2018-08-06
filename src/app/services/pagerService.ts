import { Injectable } from '@angular/core';

import { Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders,HttpResponse } from '@angular/common/http';
import { RentServices } from '../models/rentServices';
import { Observable } from 'rxjs';
import { Vehicles } from '../models/vehicles';
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

getTheToken(dataString:string){

    let headers = new HttpHeaders();
    headers = headers.append('Content-type', 'application/x-www-form-urlencoded');
    
    if(!localStorage.jwt)
    {
       //let x = this.httpClient.post('http://localhost:51680/oauth/token',`username=admin&password=admin&grant_type=password`, {"headers": headers}) as Observable<any>
       let x = this.httpClient.post('http://localhost:51680/oauth/token',dataString, {"headers": headers}) as Observable<any>

      x.subscribe(
        res => {
          console.log(res.access_token);
          
          let jwt = res.access_token;

          let jwtData = jwt.split('.')[1]
          let decodedJwtJsonData = window.atob(jwtData)
          let decodedJwtData = JSON.parse(decodedJwtJsonData)

          let role = decodedJwtData.role

          console.log('jwtData: ' + jwtData)
          console.log('decodedJwtJsonData: ' + decodedJwtJsonData)
          console.log('decodedJwtData: ' + decodedJwtData)
          console.log('Role ' + role)

          localStorage.setItem('jwt', jwt)
          localStorage.setItem('role', role);
        },
        err => {
          console.log("Error occured");
        }
      );
    }
    else
    {
       let x = this.httpClient.get('http://localhost:51680/api/Services') as Observable<any>

      x.subscribe(
        res => {
          console.log(res);
        },
        err => {
          console.log("Error occured");
        }
      );
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
  getRentServiceCars(serviceId:number):Observable<Vehicles[]> {

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