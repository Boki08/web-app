import { Injectable } from '@angular/core';
//import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { User } from '../models/user.model';
/* import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map'; */

@Injectable({
  providedIn: 'root'
})
export class UserServices {

  constructor( private httpClient: HttpClient) { }

  getImage(name: string): Observable<Blob> {
    return this.httpClient.get('http://localhost:51680/api/appUser/getDocumentPicture?path='+name, {responseType: "blob"});
}
  register(NewUser): Observable<any> {
    console.log(NewUser);
    return this.httpClient.post("http://localhost:51680/api/Account/Register", NewUser);
  }
  EditPassword1(NewPassword): Observable<any> {
    console.log(NewPassword);
    return this.httpClient.post("http://localhost:51680/api/Account/ChangePassword", NewPassword);
  }
  getProfile():Observable<any>{
    return this.httpClient.get("http://localhost:51680/api/appUser/getCurrentUser", { observe: 'response' });
  }
  getProfileById(userId:string):Observable<any>{
    return this.httpClient.get("http://localhost:51680/api/appUser/getUserById/"+userId, { observe: 'response' });
  }
  LogOut():Observable<any>{
    return this.httpClient.post("http://localhost:51680/api/Account/Logout",localStorage.jwt);
  }
  
  EditUser(userData:User, fileToUpload:File,ETag:string):Observable<any>{

    let headers = new HttpHeaders();
    headers = headers.append('if-match', ETag);

   
    const formData: FormData = new FormData();
    if(!userData.DocumentPicture && fileToUpload!=null)
    {
      formData.append('Image', fileToUpload, fileToUpload.name);
    }
    
    formData.append('FullName', userData.FullName.toString());
    formData.append('BirthDate', userData.BirthDate.toString());
    formData.append('Email', userData.Email.toString());
    formData.append('UserId', userData.UserId.toString());

    return this.httpClient.post('http://localhost:51680/api/appUser/editAppUser', formData, { "headers": headers,observe: 'response' });
  }

  GetAllUsers(type:string,pageIndex:number,pageSize:number,editedFirst:boolean,approvedFirst:boolean): Observable<any> {
    return this.httpClient.get("http://localhost:51680/api/appUser/allUsers/"+pageIndex+"/"+pageSize+"/"+type+"/"+editedFirst+"/"+approvedFirst, { observe: 'response' }) ;
    
  }
  ActivateUser(userId:number,activated:boolean,ETag:string): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('if-match', ETag);
    return this.httpClient.get("http://localhost:51680/api/appUser/activateUser/"+userId+"/"+activated, { "headers": headers,observe: 'response' }) ;
    
  }
  DeleteUser(userId:number): Observable<any> {
    return this.httpClient.get("http://localhost:51680/api/appUser/deleteUser/"+userId) ;
    
  }
  CanUserOrder(): Observable<any> {
    return this.httpClient.get("http://localhost:51680/api/appUser/canUserOrder/", { observe: 'response' }) ;
    
  }
}
