import { Injectable } from '@angular/core';
//import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { OfficeModel } from '../models/office-model';
import { CommentModel } from '../models/commentData';
/* import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map'; */

@Injectable({
    providedIn: 'root'
})
export class CommentServices {

    constructor(private httpClient: HttpClient) { }


    GetComment(rentServiceId: number, userId: number): Observable<any> {
        return this.httpClient.get("http://localhost:51680/api/comments/getComment/" + rentServiceId + "/" + userId, { observe: 'response' });
    }
    CanComment(order: number, userId: number): Observable<any> {
        return this.httpClient.get("http://localhost:51680/api/comments/getCanUserComment/" + order + "/" + userId, { observe: 'response' });
    }
    PostComment(comment: CommentModel): Observable<any> {
        return this.httpClient.post("http://localhost:51680/api/comments/postComments", comment, { observe: 'response' });
    }
    GetServiceComments(serviceId: number): Observable<any> {
        return this.httpClient.get("http://localhost:51680/api/comments/getServiceComments/" + serviceId, { observe: 'response' });
    }
}
