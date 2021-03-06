import { Injectable, Output, EventEmitter } from '@angular/core';

import { Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ServiceData } from '../models/serviceData';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { Config } from '../../../node_modules/protractor';
import { LogInData } from '../models/logInData';
import { btmNavDataService } from '../bottom-navbar/btmNavDataService';
import { finalize } from 'rxjs/operators'


@Injectable({
    providedIn: 'root'
})
export class LogInService {
    showProgress: boolean = true;
    constructor(private btmNavMessageService: btmNavDataService,private httpClient: HttpClient) {
        this.btmNavMessageService.currentMessage.subscribe(message => this.showProgress = message) 
    }

    getTheToken(user: LogInData): any {
        this.btmNavMessageService.changeMessage(true);
        let headers = new HttpHeaders();
        headers = headers.append('Content-type', 'application/x-www-form-urlencoded');

        if (!localStorage.jwt) {
            //let x = this.httpClient.post('http://localhost:51680/oauth/token',`username=admin&password=admin&grant_type=password`, {"headers": headers}) as Observable<any>
            //let x = this.httpClient.post('http://localhost:51680/oauth/token',dataString, {"headers": headers}) as Observable<any>
            let x = this.httpClient.post('http://localhost:51680/oauth/token', `username=${user.Username}&password=${user.Password}&grant_type=password`, { "headers": headers }) as Observable<any>
            return x.pipe(finalize(
                () => {
                    this.btmNavMessageService.changeMessage(false);
                    let win = (window as any);
                    win.location.reload();
                }))
                .subscribe(
                res => {
                    console.log(res.access_token);

                    let jwt = res.access_token;

                    let jwtData = jwt.split('.')[1]
                    let decodedJwtJsonData = window.atob(jwtData)
                    let decodedJwtData = JSON.parse(decodedJwtJsonData)

                    let role = decodedJwtData.role

                    console.log('jwtData: ' + jwtData)
                    console.log('decodedJwtJsonData: ' + decodedJwtJsonData)
                    console.log('decodedJwtData: ' + decodedJwtData)
                    console.log('Role ' + role)

                    localStorage.setItem('jwt', jwt)
                    localStorage.setItem('role', role);

                   
                },
                err => {
                   
                    console.log("Error occured");
                }
            );
        }
        else {
            let x = this.httpClient.get('http://localhost:51680/api/rentService/getAll') as Observable<any>

            x.pipe(finalize(
                () => {
                  this.btmNavMessageService.changeMessage(false);
                }))
                .subscribe(
                res => {
                    
                    console.log(res);

                },
                err => {
                    
                    console.log("Error occured");
                }
            );

        }

        /* let headers = new HttpHeaders();
        headers = headers.append('Content-type', 'application/x-www-form-urlencoded');

        if (!localStorage.jwt) {
            //let x = this.httpClient.post('http://localhost:51680/oauth/token',`username=admin&password=admin&grant_type=password`, {"headers": headers}) as Observable<any>
            //let x = this.httpClient.post('http://localhost:51680/oauth/token',dataString, {"headers": headers}) as Observable<any>
            let x = this.httpClient.post('http://localhost:51680/oauth/token', `username=${user.Username}&password=${user.Password}&grant_type=password`, { "headers": headers }) as Observable<any>
            return x.subscribe(
                res => {
                    console.log(res.access_token);

                    let jwt = res.access_token;

                    let jwtData = jwt.split('.')[1]
                    let decodedJwtJsonData = window.atob(jwtData)
                    let decodedJwtData = JSON.parse(decodedJwtJsonData)

                    let role = decodedJwtData.role

                    console.log('jwtData: ' + jwtData)
                    console.log('decodedJwtJsonData: ' + decodedJwtJsonData)
                    console.log('decodedJwtData: ' + decodedJwtData)
                    console.log('Role ' + role)

                    localStorage.setItem('jwt', jwt)
                    localStorage.setItem('role', role);
                   return 1;
                },
                err => {
                    console.log("Error occured");
                }
            );
        }
        else {
            let x = this.httpClient.get('http://localhost:51680/api/rentService/getAll') as Observable<any>

            x.subscribe(
                res => {
                    console.log(res);
                   
                },
                err => {
                    console.log("Error occured");
                }
            );

        } */

    }
    ngOnDestroy() {
        this.btmNavMessageService.changeMessage(false);
      }
}