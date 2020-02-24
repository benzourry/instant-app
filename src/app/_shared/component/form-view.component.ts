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

import { Component, OnInit, Input } from '@angular/core';
import { baseApi } from '../constant.service';

@Component({
  selector: 'form-view',
  template: `
  <ngb-tabset *ngIf="form" justify="center" class="tab-custom centered" [class.no-tabs]="form.tabs?.length==0">
      <ngb-tab *ngFor="let tab of form.nav=='tabs'?form.tabs:[{}]">
        <ng-template ngbTabTitle>{{tab.title}}</ng-template>
        <ng-template ngbTabContent>

          <div class="limit-width mt-2 centered fix-gutter">
            <div class="row">

              <div [class.m-a]="filterSection(form.sections,['section','list'], tab?.id).length==1" [ngClass]="e.size||'col-sm-12'"
                *ngFor="let e of filterSection(form.sections,['section','list'], tab?.id)">
                <div class="card mb-3" *ngIf="e.type=='section' && preCheck(e)">
                  <div class="card-header p-3">
                    <h5 class="card-title m-0">{{e.title}}</h5>
                    <div class="card-subtitle mt-1" *ngIf="e.description" [innerHtml]="e.description"></div>

                  </div>
                  <div class="card-body p-3">
                    <div class="row">
                      <ng-container *ngFor="let f of e.items">
                        
                        <div [ngClass]="form.items[f.code]?.size" *ngIf="form.items[f.code] && !form.items[f.code]?.hidden && preCheck(form?.items[f.code])">
                          <div class="form-group" [ngClass]="form.items[f.code]?.altClass">
                            <label *ngIf="form.items[f.code]?.subType!='clearfix' && !form.items[f.code]?.hideLabel">{{form.items[f.code]?.label}}</label>

                            <p class="form-control-static">
                              <field-view [field]="form?.items[f.code]" *ngIf="data" [value]="getVal(form.items[f.code],data)"></field-view>
                            </p>
                          </div>
                        </div>

                      </ng-container>
                    </div>
                  </div>
                </div>

                <div class="card mb-3" *ngIf="e.type=='list'">
                  <div class="card-header p-3 bordered">
                    <h5 class="card-title m-0">{{e.title}}
                      <span class="badge badge-pill badge-secondary float-right">{{data && data[e.code]?.length}}</span>
                    </h5>
                    <div class="card-subtitle mt-1" *ngIf="e.description" [innerHtml]="e.description"></div>
                  </div>
                  <ul class="list-group list-group-flush" *ngIf="data && data[e.code]?.length>0">
                    <li class="list-group-item p-3 form-horizontal" *ngFor="let child of data[e.code]">
                      <div class="row mb-1" *ngFor="let f of e.items">
                        <div class="col-sm-4 f-label" *ngIf="!form.items[f.code].hideLabel" style="font-weight: 500">{{form.items[f.code].label}}</div>
                        <div [class.col-sm-8]="!form.items[f.code].hideLabel">
                          <field-view [field]="form.items[f.code]" [value]="child[f.code]"></field-view>
                        </div>
                      </div>
                    </li>
                  </ul>

                  <div class="card-body p-3" *ngIf="data && !data[e.code]">
                    <h4>No record</h4>
                    <p>No data available for {{e.title}}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </ng-template>
      </ngb-tab>
    </ngb-tabset>`,
    styles:[`.form-group>label,.custom-checkbox>label{ font-size:14px;font-weight:600;}`]
})
export class FormViewComponent implements OnInit {

  constructor() { }

  @Input() form: any;
  @Input() data: any;
  @Input() entry: any;

  baseApi: string = baseApi;

  filterSection = (sectionList, type, tab) => sectionList && sectionList.filter(s => type.indexOf(s.type) > -1 && (!tab || s.parent == tab));


  ngOnInit() {
  }

  getVal(field, data){
    var value = data[field.code];
    if (field.type=='eval' && value==null){
      if (field.f) {
        try {
          value = this._eval(data,field.f);
        } catch (e) { }
      }
    }
    return value;
  }

  preCheck(f) {
    let res = undefined;
    try{
      res=this._eval(this.entry.data,f.pre);
    }catch(e){}
    return !f.pre || res;
  }

  _eval=(data,v)=>new Function('$_','$', '$prev$', 'return ' + v)(this.entry, data, this.entry && this.entry.prev);


}
