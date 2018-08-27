import { Injectable } from '@angular/core';
//import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { ServiceData } from '../models/serviceData';
/* import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map'; */

@Injectable({
  providedIn: 'root'
})
export class RentServices {

  constructor( private httpClient: HttpClient) { }

  
  AddRentService(serviceData:ServiceData, fileToUpload:File){
    const endpoint = 'http://localhost:51680/api/rentService/addRentService';
    const formData: FormData = new FormData();
    if(!serviceData.Logo)
    {
      formData.append('Logo', fileToUpload, fileToUpload.name);
    }
    
    formData.append('Name', serviceData.Name.toString());
    formData.append('Email', serviceData.Email.toString());
    formData.append('Description', serviceData.Description.toString());

    return this.httpClient.post(endpoint, formData);
  }

  GetAllServicesManager(isApproved:boolean,noOffices:boolean,noVehicles:boolean,pageIndex:number,pageSize:number): Observable<any> {
    return this.httpClient.get("http://localhost:51680/api/rentService/getAllRentServicesManager/"+pageIndex+"/"+pageSize+"/"+isApproved+"/"+noOffices+"/"+noVehicles, { observe: 'response' }) ;
    
  }
  
GetRentService(sericeId:number):Observable<any>{
  return this.httpClient.get("http://localhost:51680/api/rentService/getRentService/"+sericeId, { observe: 'response' }) ;
    
}
  
}
