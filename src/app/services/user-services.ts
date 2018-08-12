import { Injectable } from '@angular/core';
//import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
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


}
