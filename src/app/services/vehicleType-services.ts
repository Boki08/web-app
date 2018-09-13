import { Injectable } from '@angular/core';
//import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { Vehicle } from '../models/vehicles';
import { VehicleTypes } from '../models/vehicleTypes';

/* import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map'; */

@Injectable({
  providedIn: 'root'
})
export class VehicleTypeServices {

  constructor(private httpClient: HttpClient) { }

 
  GetVehicleTypesPaged(pageIndex: number, pageSize: number): Observable<any> {
    return this.httpClient.get('http://localhost:51680/api/typeOfVehicle/getVehicleTypesPaged/'+pageIndex+"/"+pageSize, { observe: 'response' });
  }
  GetVehicleTypes(): Observable<any> {
    return this.httpClient.get('http://localhost:51680/api/typeOfVehicle/getVehicleTypes', { observe: 'response' });
  }

 AddVehicleType(vehileType:VehicleTypes): Observable<any> {
    return this.httpClient.post('http://localhost:51680/api/typeOfVehicle/addVehicleType',vehileType, { observe: 'response' });
  }
  
  DeleteVehicleType(vehileTypeId:number): Observable<any> {
    return this.httpClient.get('http://localhost:51680/api/typeOfVehicle/deleteTypeOfVehicle/'+vehileTypeId, { observe: 'response' });
  }
}
