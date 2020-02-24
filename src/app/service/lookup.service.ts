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
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LookupService {

  baseApi = baseApi;

    getLookup(lookupId: any): any {
        return this.http.get(`${this.baseApi}/lookup/${lookupId}`);
    }
  getEntryList(lookupId: any, params: HttpParams): any {
    return this.http.get(`${this.baseApi}/lookup/${lookupId}/entry`,{params:params});
  }
  removeEntry(id: any, data: any): any {
    return this.http.post(`${this.baseApi}/lookup/entry/${id}/delete`,data)
  }
  saveEntry(lookupId: any, data: any): any {
    return this.http.post(`${this.baseApi}/lookup/${lookupId}/entry`,data);
  }
  deleteLookup(id: any, data: any): any {
    return this.http.post(`${this.baseApi}/lookup/${id}/delete`,data)
  }
  save(email: string, data: any): any {
    return this.http.post(`${this.baseApi}/lookup?email=${email}`,data)
  }
constructor(private http: HttpClient) { }

  getByKey(key: string, params?: any): Observable<any> {
    return this.http.get<any>(`${this.baseApi}/lookup/${key}/entry?enabled=1&size=9999`,{params:params})
  }
  getInForm(id: any): any {
    return this.http.get<any>(`${this.baseApi}/lookup/in-form/${id}`)
  }

  getLookupList(params?: HttpParams): any {
    return this.http.get<any>(`${this.baseApi}/lookup`,{params: params});
  }

  getFullLookupList(params?: HttpParams): any {
    return this.http.get<any>(`${this.baseApi}/lookup/full`,{params: params});
  }


}
