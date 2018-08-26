import { Injectable } from '@angular/core';
//import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { HttpClient } from '@angular/common/http';

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

  register(NewUser): Observable<any> {
    console.log(NewUser);
    return this.httpClient.post("http://localhost:51680/api/Account/Register", NewUser);
  }
  EditPassword1(NewPassword): Observable<any> {
    console.log(NewPassword);
    return this.httpClient.post("http://localhost:51680/api/Account/ChangePassword", NewPassword);
  }
  getProfile(): Observable<any> {
    return this.httpClient.get("http://localhost:51680/api/appUser/getCurrentUser");
  }
  LogOut(): Observable<any> {
    return this.httpClient.post("http://localhost:51680/api/Account/Logout", localStorage.jwt);
  }

  EditUser(userData: User, fileToUpload: File) {
    const endpoint = 'http://localhost:51680/api/appUser/editAppUser';
    const formData: FormData = new FormData();
    if (!userData.DocumentPicture) {
      formData.append('Image', fileToUpload, fileToUpload.name);
    }

    formData.append('FullName', userData.FullName.toString());
    formData.append('BirthDate', userData.BirthDate.toString());
    formData.append('Email', userData.Email.toString());
    formData.append('UserId', userData.UserId.toString());

    return this.httpClient.post(endpoint, formData);
  }

  GetAllUsers(type: string, pageIndex: number, pageSize: number): Observable<any> {
    return this.httpClient.get("http://localhost:51680/api/appUser/allUsers/" + pageIndex + "/" + pageSize + "/" + type, { observe: 'response' });

  }
  ActivateUser(userId: number, activated: boolean): Observable<any> {
    return this.httpClient.get("http://localhost:51680/api/appUser/activateUser/" + userId + "/" + activated);

  }



  GetRentVehicles(serviceId: number, pageIndex: number, pageSize: number) {
    return this.httpClient.get("http://localhost:51680/api/vehicle/allServiceVehicles/" + pageIndex + "/" + pageSize + "/" + serviceId, { observe: 'response' });

  }
  DisableVehicle(vehicleId: number, enabled: boolean) {
    return this.httpClient.get("http://localhost:51680/api/vehicle/disableVehicle/" + vehicleId + "/" + enabled);
  }

  GetVehiclePictures(vehicleId: number) {
    return this.httpClient.get('http://localhost:51680/api/vehicle/getVehiclePictures/' + vehicleId);
  }

  GetVehicleTypes() {
    return this.httpClient.get('http://localhost:51680/api/typeOfVehicle/getVehicleTypes');
  }

  AddVehicle(vehicle: Vehicle, photos: File[]): Observable<any> {

    const endpoint = 'http://localhost:51680/api/vehicle/addVehicle';
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

    return this.httpClient.post(endpoint, formData);

  }

  /* EditUser(userData:User, fileToUpload:File){
    const endpoint = 'http://localhost:51680/api/appUser/editAppUser';
    const formData: FormData = new FormData();
    if(!userData.DocumentPicture)
    {
      formData.append('Image', fileToUpload, fileToUpload.name);
    }
    
    formData.append('FullName', userData.FullName.toString());
    formData.append('BirthDate', userData.BirthDate.toString());
    formData.append('Email', userData.Email.toString());
    formData.append('UserId', userData.UserId.toString());

    return this.httpClient.post(endpoint, formData);
  } */
}
