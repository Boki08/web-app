import { Injectable } from '@angular/core';
//import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { User } from '../models/user.model';
/* import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map'; */

@Injectable({
  providedIn: 'root'
})
export class UserServices {

  constructor( private httpClient: HttpClient) { }

  register(NewUser): Observable<any> {
    console.log(NewUser);
    return this.httpClient.post("http://localhost:51680/api/Account/Register", NewUser);
  }
  EditPassword1(NewPassword): Observable<any> {
    console.log(NewPassword);
    return this.httpClient.post("http://localhost:51680/api/Account/ChangePassword", NewPassword);
  }
  getProfile():Observable<any>{
    return this.httpClient.get("http://localhost:51680/api/appUser/getCurrentUser");
  }
  LogOut():Observable<any>{
    return this.httpClient.post("http://localhost:51680/api/Account/Logout",localStorage.jwt);
  }
  
  EditUser(userData:User, fileToUpload:File){
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
  }
}
