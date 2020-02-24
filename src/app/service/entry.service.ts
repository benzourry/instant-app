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
import { HttpClient, HttpParams } from '@angular/common/http';
import { baseApi } from '../_shared/constant.service';

@Injectable({
  providedIn: 'root'
})
export class EntryService {
  assign(id: any, tierId: any, email: any) {
    return this.http.post(`${this.baseApi}/entry/${id}/assign?tierId=${tierId}&email=${email}`,{})
  }

  baseApi = baseApi;

  getChartData(dashboardId: any): any {
    return this.http.get(`${this.baseApi}/entry/dashboard/${dashboardId}`);
  }

  getActionList(id: number, email: string, params: any): any {
    return this.http.get(`${this.baseApi}/entry/action-list`,{params: params});
  }

  getActionArchiveList(id: number, email: string, params: any): any {
    return this.http.get(`${this.baseApi}/entry/action-archive-list`,{params: params});
  }

  delete(id: number, email: string): any {
    return this.http.post(`${this.baseApi}/entry/${id}/delete?email=${email}`,{})
  }
  getList(type: string, formId: number, params: any): any {
    return this.http.get(`${this.baseApi}/entry/list/${type}?formId=${formId}`,{params:params});
  }
  getAdminList(formId: number, params: any): any {
    return this.http.get(`${this.baseApi}/entry/admin?formId=${formId}`,{params:params});
  }
  action(id: number, email: string, approval: any): any {
    return this.http.post(`${this.baseApi}/entry/${id}/action?email=${email}`,approval)
  }
  cancel(id: number, email: string): any {
    return this.http.post(`${this.baseApi}/entry/${id}/retract?email=${email}`,{})
  }
  uploadAttachment(file: any): any {
    let f = new FormData();
    f.append('file',file);
    return this.http.post<any>(`${this.baseApi}/entry/upload-file`,f);
  }
  getEntry(id: number, formId: number): any {
    return this.http.get(`${this.baseApi}/entry/${id}?formId=${formId}`)
  }
  save(formId: number, data: any, email: string): any {
    
    return this.http.post(`${this.baseApi}/entry?formId=${formId}&email=${email}`, data)
  }
  constructor(private http:HttpClient) { }

  submit(id: number, entry: any, email: string, resubmit: boolean): any {
    return this.http.post(`${this.baseApi}/entry/${id}/${resubmit?'re':''}submit?email=${email}`, entry)
  }
}
