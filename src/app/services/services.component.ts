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

}