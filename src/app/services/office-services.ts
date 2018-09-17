import { Injectable } from '@angular/core';
//import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { OfficeModel } from '../models/office-model';
/* import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map'; */

@Injectable({
  providedIn: 'root'
})
export class OfficeServices {

  constructor(private httpClient: HttpClient) { }

  
  GetOffice(rentServiceId: number): Observable<any> {
    return this.httpClient.get("http://localhost:51680/api/office/getOffice/" + rentServiceId, { observe: 'response' });
  }
  DeleteOffice(officeId: number) {
    return this.httpClient.get("http://localhost:51680/api/office/deleteOffice/" + officeId);
  }

  AddOffice(office: OfficeModel, fileToUpload: File) {
    const formData: FormData = new FormData();
    formData.append('Picture', fileToUpload, fileToUpload.name);
    formData.append('Address', office.Address.toString());
    formData.append('Latitude', office.Latitude.toString());
    formData.append('Longitude', office.Longitude.toString());
    formData.append('RentServiceId', office.RentServiceId.toString());
    return this.httpClient.post("http://localhost:51680/api/office/addOffice/", formData);

  }

  EditOffice(office: OfficeModel, fileToUpload: File,ETag:string) {


    let headers = new HttpHeaders();
    headers = headers.append('if-match', ETag);

    const formData: FormData = new FormData();
    formData.append('OfficeId', office.OfficeId.toString());
    formData.append('Picture', fileToUpload, fileToUpload.name);
    formData.append('Address', office.Address.toString());
    formData.append('Latitude', office.Latitude.toString());
    formData.append('Longitude', office.Longitude.toString());
    formData.append('RentServiceId', office.RentServiceId.toString());
    return this.httpClient.post("http://localhost:51680/api/office/editOffice/", formData, { "headers": headers });

  }
  GetRentOffices(serviceId: number, pageIndex: number, pageSize: number) {
    return this.httpClient.get("http://localhost:51680/api/office/allServiceOffices/" + pageIndex + "/" + pageSize + "/" + serviceId, { observe: 'response' });

  }
  GetRentOffice(officeId: number): Observable<any> {
    return this.httpClient.get("http://localhost:51680/api/office/getOffice/" + officeId, { observe: 'response' });

  }
  GetAllRentOffices(serviceId: number): Observable<any> {
    return this.httpClient.get("http://localhost:51680/api/office/getOffices/" + serviceId, { observe: 'response' });

  }
}
