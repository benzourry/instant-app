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
import { baseApi } from '../../_shared/constant.service';

@Component({
  selector: 'field-view',
  template: `
  <span *ngIf="value===undefined">
    <span class="text-muted" *ngIf="['static'].indexOf(field?.type)==-1">Data not available</span>
    <span *ngIf="['static'].indexOf(field?.type)>-1">
      <span *ngIf="field?.subType=='html'" [innerHtml]="field?.placeholder"></span>
      <div *ngIf="field?.subType=='clearfix'"></div>
    </span>
  </span>
  <span style="white-space:pre-wrap" *ngIf="value!==undefined">
    <span *ngIf="['text','textarea'].indexOf(field?.type)>-1" [innerHtml]="value"></span>
    <span *ngIf="['qr'].indexOf(field?.type)>-1" [innerHtml]="value"></span>
    <span *ngIf="['eval'].indexOf(field?.type)>-1">
      <span *ngIf="field.subType=='text'">
        <span *ngIf="field.placeholder">{{field.placeholder}}</span>
        <span [innerHtml]="value"></span>
      </span>
      <span *ngIf="field?.subType=='qr'">
        <img [src]="value?baseApi+'/form/qr?code='+value:'assets/img/blank-qr.svg'" width="100%">
      </span>
    </span>
    <span *ngIf="['checkbox'].indexOf(field?.type)>-1">
    <fa-icon [icon]="['fas', value?'check-square':'square']"></fa-icon>
     {{field?.placeholder}}</span>
    <span *ngIf="['number','scaleTo5','scaleTo10'].indexOf(field?.type)>-1">{{value}}
      <sup *ngIf="field?.type=='scaleTo5'">/5</sup>
      <sup *ngIf="field?.type=='scaleTo10'">/10</sup>
    </span>
    <span *ngIf="['date'].indexOf(field?.type)>-1">{{value|date:'dd-MMM-yyyy'}}</span>
    <span *ngIf="['radio'].indexOf(field?.type)>-1">{{value?.name}}</span>
    <span *ngIf="['select'].indexOf(field?.type)>-1">{{value?.name}}</span>
    <span *ngIf="['file'].indexOf(field?.type)>-1">
      <a class="thumbnail" *ngIf="field.subType=='image'" href="{{baseApi}}/entry/file/{{value}}" target="_blank">
        <img src="{{baseApi}}/entry/file/inline/{{value}}" style="max-width:100%" onError="this.src='./assets/img/placeholder-128.png'">
      </a>
      <a *ngIf="field.subType=='other'||!field.subType" href="{{baseApi}}/entry/file/{{value}}" target="_blank">
        {{value}}
      </a>
    </span>
    <span *ngIf="['imagePreview'].indexOf(field?.type)>-1">
      <a class="thumbnail" href="{{value}}" target="_blank">
        <img src="{{value}}" style="max-width:100%" onError="this.src='./assets/img/placeholder-128.png'">
      </a>
    </span>
  </span>`
})
export class FieldViewComponent implements OnInit {

  constructor() { }

  // @Input() data: any;
  @Input() value: any;
  @Input() field: any;
  // @Input() lookupList: any;

  baseApi: string = baseApi;

  ngOnInit() {
  }

  // getLookupName(code) {
  //   return this.lookupList && code && this.lookupList.filter(e => e.code == code)[0].name;
  // }

}
