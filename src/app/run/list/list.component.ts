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

import { Component, OnInit } from '@angular/core';
import { EntryService } from '../../service/entry.service';
import { FormService } from '../../service/form.service';
import { UserService } from '../../_shared/service/user.service';
import { LookupService } from '../../service/lookup.service';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute, Params } from '@angular/router';
import { base,baseApi } from '../../_shared/constant.service';
import { UtilityService } from 'src/app/_shared/service/utility.service';
import { NgbDateAdapter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbUnixTimestampAdapter } from '../../_shared/service/date-adapter';
import { PlatformLocation } from '@angular/common';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  providers: [{ provide: NgbDateAdapter, useClass: NgbUnixTimestampAdapter }]
})
export class ListComponent implements OnInit {

  dataset: any;
  baseApi: string = baseApi;
  base: string = base;
  appId: number;
  formId: any;
  entryTotal: number;
  entryList: any[];
  user: any;
  draftTotal: number;
  draftList: any[];
  form: any={};
  pageSize = 25;
  itemLoading: boolean;
  searchText: string="";
  prevForm: any;
  pageNumber = 1;
  offline:boolean=false;
  filters:any = {};
  filtersEncoded:string;
  lookupIds: any;
  lookupKey = {};
  lookup = {};
  preurl:string = '';

  constructor(private userService: UserService, private formService: FormService, private entryService: EntryService,
    private lookupService: LookupService, private route: ActivatedRoute, private utilityService:UtilityService,
    private modalService: NgbModal,
    private location: PlatformLocation) { 
      location.onPopState(() => this.modalService.dismissAll(''));
      this.utilityService.testOnline$().subscribe(online=>this.offline = !online);
    }

  ngOnInit() {
    this.userService.getUser().subscribe((user) => {
      this.user = user;
      this.route.parent.params
      .subscribe((params:Params)=>{
        this.appId = params['appId'];
        if (this.appId){
          this.preurl = `/run/${this.appId}`;
        }
      });
      this.route.params
        .subscribe((params: Params) => {
          const formId = params['formId'];
          this.formId = formId;
          const id = params['id'];
          if (id) {
            this.getDataset(id);
            this.getForm(formId);
            this.getLookupIdList(formId)
          }
        });

    });
  }

  // action list : submitted
  // action archive list: approved, rejected, returned
  // admin submission : ['submitted','approved','rejected','returned']
  // my submission: 'approved,rejected,returned,resubmitted,submitted'
  // my draft: drafted
  

  getForm(id) {
    this.formService.getForm(id)
      .subscribe(res => {
        this.form['data'] = res;
        if (this.form['data'].prev){
          this.formService.getForm(this.form['data'].prev)
          .subscribe(res => {
            this.form['prev'] = res;
            this.getLookupIdList(this.form['prev'].id)
          })
        }else{
          this.form['prev'] = null;
        }
        // this.getEntryList(1);
      });
  }

  getDataset(id) {
    this.formService.getDataset(id)
      .subscribe(res => {
        this.dataset = res;
        this.getEntryList(1);
      });
  }

  getEntryList(pageNumber) {
    this.itemLoading = true;
    this.filtersEncoded = encodeURIComponent(JSON.stringify(this.filters));
    let params = {
      email: this.user.email,
      status: this.dataset.status,
      searchText: this.searchText,
      filters: this.filtersEncoded,
      page: pageNumber - 1,
      size: this.pageSize
    }
    this.entryService.getList(this.dataset.type,this.formId, params)
      .subscribe(res => {
        this.entryList = res.content;
        this.entryTotal = res.totalElements;
        this.itemLoading = false;
      }, res=> this.itemLoading=false)
  }

  deleteEntry(id) {
    this.entryService.delete(id, this.user.email)
      .subscribe(res => {
        this.getEntryList(1);
      })
  }

  cancelEntry(id) {
    this.entryService.cancel(id, this.user.email)
      .subscribe(res => {
        this.getEntryList(1);
      })
  }

  getLookupIdList(id) {
    this.lookupService.getInForm(id)
      .subscribe(res => {
        this.lookupIds = res;
        this.lookupIds.forEach(key => {
          this.lookupKey[key.code] = key.dataSource;
          var param = null;
          try {
          param = new Function('$user$', 'return ' + key.dataSourceInit)(this.user)
          } catch (e) { }
          this.getLookup(key.code, key.dataSourceInit ? param : null);
        });
      });
  }

  getLookup = (code, params?: any) => {
    if (code) {
      this.lookupService.getByKey(this.lookupKey[code], params)
        .subscribe(res => {
          this.lookup[code] = res.content;
        })
    }
  }

  getVal(field, entry, data){
    var value = data[field.code];
    if (field.type=='eval' && value==null){
      if (field.f) {
        try {
          value = this._eval(data,entry,field.f);
        } catch (e) { }
      }
    }
    return value;
  }

  _eval=(data,entry,v)=>new Function('$_','$', '$prev$', 'return ' + v)(entry, data, entry && entry.prev);


  filtersData: any={};
  editFilterItems: any
  editFilter(content, data, isNew) {
    this.filtersData = data;
    // this.editFilterItems = { section: section }
    history.pushState(null, null, window.location.href);
    this.modalService.open(content)
      .result.then(res => {
        console.log(res);
        this.filters = res;
        this.getEntryList(0);
      }, res => { });
  }

  clearFilter(){
    this.filters={};
    this.filtersData={};
  }

  checkFilter=()=>Object.keys(this.filters).length === 0 && this.filters.constructor === Object

}
