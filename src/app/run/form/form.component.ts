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
import { FormService } from '../../service/form.service';
import { UserService } from '../../_shared/service/user.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { LookupService } from '../../service/lookup.service';
import { EntryService } from '../../service/entry.service';
import { NgbModal, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { baseApi } from '../../_shared/constant.service';
import { NgbUnixTimestampAdapter } from '../../_shared/service/date-adapter';
import { map } from 'rxjs/operators';
import { PlatformLocation } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/_shared/service/utility.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
  providers: [{ provide: NgbDateAdapter, useClass: NgbUnixTimestampAdapter }]
})
export class FormComponent implements OnInit {

  user: any;
  form: any;
  lookupIds: any;
  baseApi: string = baseApi;
  // prevEntry: any;
  prevForm: any;

  pageSize = 15;

  chartOptions = { legend: { display: true } };

  entry: any = { currentStatus: 'drafted', data: {} };

  payload: any = {};

  lookup = {};

  saving = false;

  lookupKey = {};

  lookups = {};
  appId:number;
  preurl:string = '';

  constructor(private userService: UserService, private formService: FormService,
    private router: Router, private route: ActivatedRoute, private http: HttpClient,
    private lookupService: LookupService, private entryService: EntryService,
    private modalService: NgbModal,
    private location: PlatformLocation) {
    location.onPopState(() => this.modalService.dismissAll(''));
    // this.utilityService.testOnline$().subscribe(online=>this.offline = !online);
  }

  ngOnInit() {

    
    this.userService.getUser().subscribe(user => {
      this.user = user;
      this.entry['email'] = user.email;
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
          const entryId = params['entryId'];
          const prevId = params['prevId'];
          if (formId) {
            this.getForm(formId, entryId, prevId);
            this.getLookupIdList(formId);
          }
          // if (entryId) {
          //   this.getData(entryId, id);
          // }
          // if (prevId){
          //   this.getPrevData(prevId);
          // }
          
        });
    });
  }

  getForm(formId, entryId, prevEntryId) {
    this.formService.getForm(formId)
      .subscribe(form => {
        this.form = form;
        if (entryId){
          this.getData(entryId, form.id);
        } 
        
        this.watchList = [];
        for (var key in this.form.items) {
          if (this.form.items.hasOwnProperty(key)) {
            if (this.form.items[key].type == 'eval') {
              this.watchList.push(this.form.items[key]);
            }
          }
        }
        this.evalAll(this.entry.data);
        this.initForm(this.form.f);

        if (form.prev){
          this.formService.getForm(form.prev)
          .subscribe(prevForm => {
            this.prevForm = prevForm;
            if(prevEntryId){
              this.getPrevData(prevEntryId, prevForm.id);
            }            
          });
        }
      });
  }


  getAllLookup() {
    var items = this.form.items.filter(c => { c.dataSource != null });
    for (var i in items) {
      if (!items.hasOwnProperty(i)) {

      }
    }
  }

  getLookupIdList(id) {
    this.lookupService.getInForm(id)
      .subscribe(res => {
        this.lookupIds = res;
        this.lookupIds.forEach(key => {
          this.lookupKey[key.code] = key.dataSource;
          // var param = null;
          // try {
          // param = this._eval(this.entry.data, key.dataSourceInit);// new Function('$', '$prev$', '$user$', '$lookup$', '$http$', 'return ' + key.dataSourceInit)(this.entry, this.entry && this.entry.prev, this.user, this.getLookup, this.httpGet)
          // } catch (e) { }
          this.getLookup(key.code, key.dataSourceInit);
        });
      });
  }

  // updateLookup(code,str){
  //   this.getLookup(code,param);
  // }

  getLookup = (code, dsInit: string) => {
    var param = null;
    try {
    param = this._eval(this.entry.data, dsInit);// new Function('$', '$prev$', '$user$', '$lookup$', '$http$', 'return ' + key.dataSourceInit)(this.entry, this.entry && this.entry.prev, this.user, this.getLookup, this.httpGet)
    } catch (e) { }

    // console.log("lookup:"+code)
    if (code) {
      this.lookupService.getByKey(this.lookupKey[code], dsInit ? param : null)
        .subscribe(res => {
          this.lookup[code] = res.content;
        })
    }
  }

  httpGet = (url, callback) => {
    this.http.get(url,{headers:{'clear':'true'}})
      .subscribe(callback);
  }

  fieldChange($event, data, f) {
    if (f.post) {
      try {
        //this._eval(data,f);
        new Function('$_','$', '$prev$', '$user$', '$lookup$', '$http$', 'return ' + f.post)(this.entry, data, this.entry && this.entry.prev, this.user, this.getLookup, this.httpGet);
      } catch (e) { }
    }
    this.evalAll(data);
  }

  submit(resubmit:boolean) {
    this.saving = true;
    this._save()
      .subscribe(res => {
        this.saving = false;
        this.entryService.submit(res.id, this.entry, this.user.email, resubmit)
          .subscribe(res => {
            this.router.navigate([this.preurl, "form", this.form.id, "view", res.id]);
          });
      });
  }

  watchList = [];

  // getForm(id) {
  //   this.formService.getForm(id)
  //     .subscribe(res => {

  //     });
  // }

  filterSection = (sectionList, type, tab) => sectionList && sectionList.filter(s => type.indexOf(s.type) > -1 && (!tab || s.parent == tab));

  getData(id, formId) {
    this.entryService.getEntry(id, formId)
      .subscribe(res => {
        this.entry = res;
        // this.prevEntry = res.prev;
        // this.prevForm = res.prev && res.prev.form;
        this.evalAll(this.entry.data);
      });
  }

  getPrevData(id, formId) {
    this.entryService.getEntry(id, formId)
      .subscribe(res => {
        this.entry.prev = res.data;
        this.evalAll(this.entry.data);
      });
  }

  save() {
    this.saving = true;
    this._save()
      .subscribe(res => {
        this.entry = res;
        this.saving = false;
        // this.router.navigate(["run", this.form.app.id, "form", this.form.id, "view", this.entry.id]);
        this.router.navigate([this.preurl, "form", this.form.id, "view", this.entry.id]);

      });
  }

  _save() {
    this.evalAll(this.entry.data);
    return this.entryService.save(this.form.id, this.entry, this.user.email)
  }

  file: any = {}

  preCheck(f) {
    let res = undefined;
    try{
      res=this._eval(this.entry.data,f.pre);//new Function('$', '$prev$', '$user$', 'return ' + f.pre)(this.entry.data, this.entry && this.entry.prev, this.user);
    }catch(e){}
    return !f.pre || res;
  }

  evalAll(data) {

    this.watchList.forEach(f => {
      if (f.f !== 'void') {
        data[f.code] = this.changeEval(data, f);
      }
    })
  }

  changeEval(data, f) {
    let res = undefined;
    try {
      res = this._eval(data,f.f);// new Function('$', '$prev$', '$user$', '$http$', 'return ' + f.f)(data, this.entry && this.entry.prev, this.user, this.httpGet);
    } catch (e) { }
    return res;
  }


  initForm(f) {
    let res = undefined;
    try {
      res = this._eval(this.entry.data,f);// new Function('$', '$prev$', '$user$', '$http$', 'return ' + f)(this.entry.data, this.entry && this.entry.prev, this.user, this.httpGet);
    } catch (e) { }
    return res;
  }

  _eval=(data,v)=>new Function('$_','$', '$prev$', '$user$', '$lookup$', '$http$', 'return ' + v)(this.entry, data, this.entry && this.entry.prev, this.user,this.getLookup, this.httpGet);


  editChildData: any;
  editChildItems: any
  editChild(content, section, data, isNew) {
    this.editChildData = data;
    this.editChildItems = { section: section }
    history.pushState(null, null, window.location.href);
    this.modalService.open(content)
      .result.then(res => {
        if (res) {
          Object.assign(data, res);
        }
        if (isNew) {
          if (!this.entry.data[section.code]) {
            this.entry.data[section.code] = []
          }
          this.entry.data[section.code].push(res);
        }
        this.evalAll(this.entry.data);
      }, res => { });
  }

  removeChild(section, $index) {
    this.entry.data[section.code].splice($index, 1);
  }

  uploading = {};

  onUpload($event, data, f) {
    if ($event.target.files && $event.target.files.length) {
      this.entryService.uploadAttachment($event.target.files[0])
        .subscribe(res => {
          data[f.code] = res.fileUrl;
        })

    }
  }
}
