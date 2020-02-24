import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { baseApi } from '../../_shared/constant.service';

@Injectable({
  providedIn: 'root'
})
export class PushService {

  constructor(private http:HttpClient) { }

  baseApi = baseApi;

  addPushSubscriber(sub:any){
    console.log(sub);
    return this.http.post(`${this.baseApi}/push`,sub);
  }
}
