import { Injectable } from '@angular/core';
//import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { Vehicle } from '../models/vehicles';

/* import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map'; */

@Injectable({
  providedIn: 'root'
})
export class VehicleServices {

  constructor(private httpClient: HttpClient) { }

  GetRentVehicles(serviceId: number, pageIndex: number, pageSize: number) {
    return this.httpClient.get("http://localhost:51680/api/vehicle/allServiceVehicles/" + pageIndex + "/" + pageSize + "/" + serviceId, { observe: 'response' });

  }
  //getServiceVehiclesSort/{pageIndex}/{pageSize}/{serviceID}/{available}/{price}/{type}
  GetRentVehiclesUser(serviceId: number, pageIndex: number, pageSize: number,available:boolean,price:string,type:number) {
    return this.httpClient.get("http://localhost:51680/api/vehicle/getServiceVehiclesSort/" + pageIndex + "/" + pageSize + "/" + serviceId+ "/" + available+ "/" + price+ "/" + type, { observe: 'response' });

  }
  DisableVehicle(vehicleId: number, enabled: boolean) {
    return this.httpClient.get("http://localhost:51680/api/vehicle/disableVehicle/" + vehicleId + "/" + enabled);
  }

  DeleteVehicle(vehicleId: number) {
    return this.httpClient.get("http://localhost:51680/api/vehicle/deleteVehicle/" + vehicleId);
  }


  GetVehiclePictures(vehicleId: number) {
    return this.httpClient.get('http://localhost:51680/api/vehicle/getVehiclePictures/' + vehicleId);
  }

 /*  GetVehicleTypes(): Observable<any> {
    return this.httpClient.get('http://localhost:51680/api/typeOfVehicle/getVehicleTypes', { observe: 'response' });
  } */

  AddVehicle(vehicle: Vehicle, photos: File[]): Observable<any> {

    const formData: FormData = new FormData();

    for (let i = 0; i < photos.length; i++) {
      formData.append('Image' + i, photos[i], photos[i].name);

    }
    formData.append('HourlyPrice', vehicle.HourlyPrice.toString());
    formData.append('TypeId', vehicle.TypeId.toString());
    formData.append('RentServiceId', vehicle.RentServiceId.toString());
    formData.append('Description', vehicle.Description.toString());
    formData.append('Manufacturer', vehicle.Manufacturer.toString());
    formData.append('Model', vehicle.Model.toString());
    formData.append('YearOfManufacturing', vehicle.YearOfManufacturing.toString());
    formData.append('ImagesNum', photos.length.toString());

    return this.httpClient.post('http://localhost:51680/api/vehicle/addVehicle', formData);

  }

  EditVehicle(vehicle: Vehicle, photos: File[],ETag:string): Observable<any> {

    let headers = new HttpHeaders();
    headers = headers.append('if-match', ETag);


    const formData: FormData = new FormData();

    for (let i = 0; i < photos.length; i++) {
      formData.append('Image' + i, photos[i], photos[i].name);

    }
    formData.append('HourlyPrice', vehicle.HourlyPrice.toString());
    formData.append('TypeId', vehicle.TypeId.toString());
    formData.append('VehicleId', vehicle.VehicleId.toString());
    formData.append('Description', vehicle.Description.toString());
    formData.append('Manufacturer', vehicle.Manufacturer.toString());
    formData.append('Model', vehicle.Model.toString());
    formData.append('YearOfManufacturing', vehicle.YearOfManufacturing.toString());
    formData.append('ImagesNum', photos.length.toString());

    return this.httpClient.post('http://localhost:51680/api/vehicle/editVehicle', formData, { "headers": headers });

  }

  getVehicleInfo(vehicleId:number):Observable<any> {
    return this.httpClient.get("http://localhost:51680/api/vehicle/getVehicle/"+vehicleId, { observe: 'response' }) ;
  }
}
