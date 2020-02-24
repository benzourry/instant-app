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

import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { baseApi } from '../_shared/constant.service';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FormService {
    getScreenList(formId: any, pageNumber: any): any {
      return this.http.get<any>(`${this.baseApi}/form/${formId}/screen`);
    }
    removeScreen(id: any): any {
      return this.http.post<any>(`${this.baseApi}/form/screen/${id}/delete`, {})
    }
    saveScreen(formId: number, screen: any): any {
      return this.http.post<any>(`${this.baseApi}/form/${formId}/screen`, screen)
    }
    saveElement(formId: any, sectionId: any, rElement: any, sortOrder: any): any {
      return this.http.post<any>(`${this.baseApi}/form/${formId}/elements?parentId=${sectionId||''}&sortOrder=${sortOrder}`, rElement);
    }
    getFormColumns(formId: number): any {
      return this.http.get<any>(`${this.baseApi}/form/${formId}/columns`)
    }
    saveDsOrder(list: any): any {
      return this.http.post<any>(`${this.baseApi}/form/save-ds-order`, list);
    }

  baseApi = baseApi;

  constructor(private http: HttpClient) { }

  saveChartOrder(list: any): any {
    return this.http.post<any>(`${this.baseApi}/form/save-chart-order`, list);
  }
  saveChart(formId: any, chart: any): any {
    return this.http.post<any>(`${this.baseApi}/form/dashboard/${formId}/chart`, chart)
  }
  saveDashboard(formId: number, dashboard: any): any {
    return this.http.post<any>(`${this.baseApi}/form/${formId}/dashboard`, dashboard)
  }

  saveSection(formId: number, section: any): any {
    return this.http.post<any>(`${this.baseApi}/form/${formId}/section`, section)
  }

  saveTab(formId: number, tab: any): any {
    return this.http.post<any>(`${this.baseApi}/form/${formId}/tab`, tab)
  }
  removeForm(data): any {
    return this.http.post<any>(`${this.baseApi}/form/${data.id}/delete`, {})
  }
  getItemList(id: number, params: any): Observable<PageList> {
    return this.http.get<PageList>(`${this.baseApi}/form/${id}/item`, { params: params });
  }
  getItemMap(id: number, params: any): Observable<PageList> {
    return this.http.get<PageList>(`${this.baseApi}/form/${id}/item-map`, { params: params });
  }
  getForm(id: number): any {
    return this.http.get<any>(`${this.baseApi}/form/` + id);
  }
  getScreen(id: number): any {
    return this.http.get<any>(`${this.baseApi}/form/screen/${id}`);
  }
  getListBasic(params: any): any {
    return this.http.get<any>(`${this.baseApi}/form/basic`, { params: params });
  }
  getList(params: any): any {
    return this.http.get<any>(`${this.baseApi}/form`, { params: params });
  }
  getDashboardList(formId: number, pageNumber: any): any {
    return this.http.get<any>(`${this.baseApi}/form/${formId}/dashboard`);
  }
  removeDashboard(dashboardId: number, key: string) {
    return this.http.post<any>(`${this.baseApi}/form/dashboard/${dashboardId}/delete`, {})
  }
  getDashboard(id: any): any {
    return this.http.get<any>(`${this.baseApi}/form/dashboard/${id}`)
  }


  saveForm(appId: number, data: any) {
    return this.http.post<any>(`${this.baseApi}/form?appId=${appId}`, data);
  }

  saveItem(formId: number, sectionId: number, data: any, sortOrder: number) {
    // console.log(data);
    return this.http.post<any>(`${this.baseApi}/form/${formId}/items?sectionId=${sectionId}&sortOrder=${sortOrder}`, data);
  }

  getSectionList(formId: number, pageNumber: number) {
    return this.http.get<any>(`${this.baseApi}/form/${formId}/section`);
  }

  getTabList(formId: number, pageNumber: number) {
    return this.http.get<any>(`${this.baseApi}/form/${formId}/tab`);
  }

  removeItem(formId: number, id: number) {
    return this.http.post<any>(`${this.baseApi}/form/${formId}/items/${id}/delete`, {})
  }

  removeItemSource(formId: number, id: number) {
    return this.http.post<any>(`${this.baseApi}/form/${formId}/items-source/${id}/delete`, {})
  }

  removeSection(id: number) {
    return this.http.post<any>(`${this.baseApi}/form/section/${id}/delete`, {})
  }

  removeTab(id: number) {
    return this.http.post<any>(`${this.baseApi}/form/tab/${id}/delete`, {})
  }

  removeChart(id: number) {
    return this.http.post<any>(`${this.baseApi}/form/dashboard/chart/${id}/delete`, {})
  }

  removeTier(id: number) {
    return this.http.post<any>(`${this.baseApi}/form/tier/${id}/delete`, {})
  }

  saveItemOrder(list: any) {
    return this.http.post<any>(`${this.baseApi}/form/save-item-order`, list);
  }

  saveSectionOrder(list: any) {
    return this.http.post<any>(`${this.baseApi}/form/save-section-order`, list);
  }

  saveTabOrder(list: any) {
    return this.http.post<any>(`${this.baseApi}/form/save-tab-order`, list);
  }

  saveTierOrder(list: any) {
    return this.http.post<any>(`${this.baseApi}/form/save-tier-order`, list);
  }

  saveTier(formId: number, tier: any) {
    return this.http.post<any>(`${this.baseApi}/form/${formId}/tier`, tier)
  }

  saveDataset(formId: number, dataset: any) {
    return this.http.post<any>(`${this.baseApi}/form/${formId}/dataset`, dataset)
  }

  getDataset(id: number) {
    return this.http.get<any>(`${this.baseApi}/form/dataset/${id}`)
  }

  removeDataset(datasetId: number, key: string) {
    return this.http.post<any>(`${this.baseApi}/form/dataset/${datasetId}/delete`, {})
  }

  removeDatasetItem(diId: number, key: string) {
    return this.http.post<any>(`${this.baseApi}/form/dataset-item/${diId}/delete`, {})
  }

  getFormByDatasetId(id: number) {
    return this.http.get<any>(`${this.baseApi}/form/by-dataset/${id}`)
  }

}
