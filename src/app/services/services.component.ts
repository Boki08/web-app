import { Injectable } from '@angular/core';

import { Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders,HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { Config } from '../../../node_modules/protractor';

@Injectable({
  providedIn: 'root'
})
export class Services {
  
 constructor(private httpClient: HttpClient) { }

  
  getRentServiceInfo(pageIndex:number,pageSize:number):Observable<HttpResponse<Config>> {
    return this.httpClient.get("http://localhost:51680/api/rentService/getAll/"+pageIndex+"/"+pageSize, { observe: 'response' }) ;
  }
  getRentServiceCars(serviceId:number,pageNumber:number,pageSize:number):Observable<HttpResponse<Config>>{//Observable<Vehicles[]> {

    let headers = new HttpHeaders();
    headers = headers.append('Content-type', 'application/x-www-form-urlencoded');
    
    //return this.httpClient.get('http://localhost:51680/api/vehicle/getServiceVehicles/'+serviceId, {"headers": headers}) as Observable<any>
    return this.httpClient.get<Config>('http://localhost:51680/api/vehicle/getServiceVehicles/'+serviceId+'?&pagenumber='+pageNumber+'&pageSize='+pageSize, { observe: 'response' }); //as Observable<any>

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
  postAddUser(newUser: User): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-type', 'application/json');
    return this.httpClient.post('http://localhost:51680/api/appUser/addAppUser', newUser, {"headers": headers});
  }

}