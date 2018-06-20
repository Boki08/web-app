import { Injectable } from '@angular/core';

import { Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RentServices } from '../models/rentServices';
import { Observable } from 'rxjs';
import { Vehicles } from '../models/vehicles';

@Injectable({
  providedIn: 'root'
})
export class Services {
  
 constructor(private httpClient: HttpClient) { }

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
  getRentServiceInfo():Observable<RentServices[]> {

    let headers = new HttpHeaders();
    headers = headers.append('Content-type', 'application/x-www-form-urlencoded');
    
    return this.httpClient.get('http://localhost:51680/api/rentService/getAll', {"headers": headers}) as Observable<any>

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