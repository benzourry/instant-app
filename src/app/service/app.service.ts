// Copyright (C) 2018 Razif Baital
// 
// This file is part of Instant App.
// 
// Instant App is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 2 of the License, or
// (at your option) any later version.
// 
// Instant App is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with Instant App.  If not, see <http://www.gnu.org/licenses/>.

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { baseApi } from '../_shared/constant.service';

@Injectable({
  providedIn: 'root'
})
export class AppService {
    activateCp(id: any, action: string) {
      return this.http.post<any>(`${this.baseApi}/app/request/${id}/${action}`,{})
    }
    getCopyRequestList(id: any) {
      return this.http.get<any>(`${this.baseApi}/app/${id}/request`)
    }
  checkActivate(id:number, email:string){
    return this.http.get<any>(`${this.baseApi}/app/${id}/activation-check?email=${email}`)

  }
  activate(id: number, result: string): any {
    return this.http.post<any>(`${this.baseApi}/app/${id}/activate?code=${result}`,{})
  }
  requestCopy(id: number, email: string): any {
    return this.http.post<any>(`${this.baseApi}/app/${id}/request?email=${email}`,{})
  }
    getTopList(): any {
      return this.http.get<any>(`${this.baseApi}/app/top`,{})
    }
    isPathTaken(value: any): any {
      return this.http.get(`${this.baseApi}/app/check?appPath=${value}`);
    }

  baseApi = baseApi;

  getStartBadge(id: number, email: string): any {
    return this.http.get(`${this.baseApi}/entry/${id}/start?email=${email}`);
  }
  constructor(private http: HttpClient) { }

  remove(app: any): any {
    return this.http.post(`${this.baseApi}/app/${app.id}/delete`,app)
  }
  save(data: any, email: string): any {
    return this.http.post(`${this.baseApi}/app?email=${email}`, data);
  }
  clone(data: any, email: string): any {
    return this.http.post(`${this.baseApi}/app/clone?email=${email}`, data);
  }
  getAppMyList(httpParam: HttpParams): any {
    return this.http.get<any>(`${this.baseApi}/app/my`,{params: httpParam});
  }
  getAppSharedList(httpParam: HttpParams): any {
    return this.http.get<any>(`${this.baseApi}/app/shared`,{params: httpParam});
  }
  getAppByStatusList(httpParam: HttpParams): any {
    return this.http.get<any>(`${this.baseApi}/app/status`,{params: httpParam});
  }
  getAppList(httpParam: any){
    return this.http.get<any>(`${this.baseApi}/app`,{params: httpParam})
  }
  getApp(appId:number,httpParam?: HttpParams){
    return this.http.get<any>(`${this.baseApi}/app/${appId}`,{params: httpParam})
  }
  getAppByPath(appPath:string,httpParam?: HttpParams){
    return this.http.get<any>(`${this.baseApi}/app/path/${appPath}`,{params: httpParam})
  }
  uploadLogo(file: any): any {
    let f = new FormData();
    f.append('file',file);
    return this.http.post<any>(`${this.baseApi}/app/logo`,f);
  }

}
