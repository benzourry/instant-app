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
import { UserService } from '../../_shared/service/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EntryService } from '../../service/entry.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LookupService } from '../../service/lookup.service';
import { FormService } from '../../service/form.service';
import { baseApi } from '../../_shared/constant.service';
import { UtilityService } from 'src/app/_shared/service/utility.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  lookupIds: any[];
  user: any;
  baseApi: string = baseApi;
  prevEntry: any;
  prevForm: any;
  appId:number;
  preurl:string = '';


  offline=false;

  constructor(private userService: UserService, private modalService: NgbModal,
    private entryService: EntryService, private route: ActivatedRoute, private lookupService: LookupService,
    private http: HttpClient,
    private formService: FormService, private router: Router,private utilityService: UtilityService) { 
      this.utilityService.testOnline$().subscribe(online=>this.offline = !online);
    }

  ngOnInit() {
    this.userService.getUser().subscribe((user) => {
      this.user = user;
      this.approval['email'] = user.email;
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
          const entryId = params['entryId']
          if (formId) {
            this.getForm(formId, entryId);

            this.getLookupIdList(formId);
          }
          // const entryId = params['entryId'];
          // if (entryId) {
          //   this.getData(entryId);
          // }

          // this.route.queryParams
          //   .subscribe((params: Params) => {
          //     const entryId = params['id']
          //     this.getData(entryId, formId);
          //   })

        })


    });
  }

  pageSize = 15;

  // scaleTo10 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  // scaleTo5 = [1, 2, 3, 4, 5];


  approval = { data: {} }
  watchList = [];
  loading;

  filterSection = (sectionList, type, tab) => sectionList && sectionList.filter(s => type.indexOf(s.type) > -1 && (!tab || s.parent == tab));

  // evalf(f) {
  //   this.approval.data[f.code] = new Function('$', '$user$', 'return ' + f.f)(this.entry && this.entry.data, this.user);
  // }

  // this.preCheck = preCheck;
  preCheck(f) {
    return !f.pre || new Function('$', '$user$', 'return ' + f.pre)(this.entry && this.entry.data, this.user);
  }

  evalAll(data) {

    this.watchList.forEach(f => {
      data[f.code] = this.changeEval(data, f);//$scope.$eval(f.placeholder);

    })
  }

  changeEval(data, f) {
    let res = undefined;
    try {
      res = this._eval(data,f.f); // new Function('$', '$$', '$prev$', '$user$', 'return ' + f.f)(this.entry && this.entry.data, data, this.prevEntry && this.prevEntry.data, this.user);
    } catch (e) { }
    return res;
  }

  // getLookupName(lookupId, code) {
  //   // return code && code.name;
  //   return this.lookup[lookupId] && code && this.lookup[lookupId].filter(e => e.code == code)[0].name;
  // }

  entry: any;
  form: any = { tiers: [] };


  lookup = {};

  lookupKey = {};

  getLookupIdList(id) {
    this.lookupService.getInForm(id)
      .subscribe(res => {
        this.lookupIds = res;
        this.lookupIds.forEach((key) => {
          this.lookupKey[key.code] = key.dataSource;
          this.getLookup(key.code);
        });
      });
  }

  getLookup = (code, params?: any) => {
    this.lookupService.getByKey(this.lookupKey[code], params)
      .subscribe(res => {
        this.lookup[code] = res.content;
      })
  }

  httpGet = (url, callback) => {
    this.http.get(url,{headers:{'clear':'true'}})
      .subscribe(callback);
  }

  fieldChange(data, f) {
    if (f.post) {
      new Function('$_','$', '$$','$prev$', '$user$', '$lookup$', '$http$', 'return ' + f.post)(this.entry,this.entry && this.entry.data, data, this.entry && this.entry.prev, this.user, this.getLookup, this.httpGet);
      // new Function('$', '$$', '$prev$', '$user$', '$lookup$', 'return ' + f.post)(this.entry && this.entry.data, data, this.prevEntry && this.prevEntry.data, this.user, this.getLookup);
    }
    this.evalAll(data);
  }

  _eval=(data,v)=>new Function('$_','$', '$$','$prev$', '$user$', '$lookup$', '$http$', 'return ' + v)(this.entry,this.entry && this.entry.data, data, this.entry && this.entry.prev, this.user, this.getLookup, this.httpGet);

  getForm(formId, entryId) {
    this.formService.getForm(formId)
      .subscribe(res => {
        this.form = res;
        this.entryService.getEntry(entryId, formId)
          .subscribe(res => {
            this.entry = res;

            if (this.form.prev) {
              this.formService.getForm(this.form.prev)
                .subscribe(res => {
                  this.prevForm = res;
                  // this.getPrevData(this.entry.prev, res.id);
                })
            }
          })
      });
  }


  updateWatchList(s) {
    s.items.forEach((i) => {
      if (this.form.items[i.code].type == 'eval') {
        this.watchList.push(this.form.items[i.code]);
      }
    })
  }

  getData(id, formId) {
    this.entryService.getEntry(id, formId)
      .subscribe(res => {
        this.entry = res;
        // this.prevEntry = res.prev;
        // this.prevForm = res.prev && res.prev.form;
      });
  }

  // getPrevData(id, formId) {
  //   this.entryService.getEntry(id, formId)
  //     .subscribe(res => {
  //       this.prevEntry = res;
  //       this.prevForm = res.form;
  //     });
  // }

  checkPerson() {
    var result = false;
    if (this.form.tiers[this.entry]) {
      // if (this.form.tiers[this.entry.currentTier].type == 'PERSON') {
      result = this.form.tiers[this.entry.currentTier].approver == 'all' || this.form.tiers[this.entry.currentTier].approver.indexOf(this.user.email) > -1
      // }
    }
    return result;
  }

  checkTier(tier) {
    return this.entry && this.entry.approver[tier.id] && ((tier.type == 'ALL' || this.entry.approver[tier.id].indexOf(this.user.email)>-1) && tier.sortOrder == this.entry.currentTier && !this.entry.approval[tier.id]);
    // console.log(tier.approver+"="+this.user.email+","+tier.sortOrder+"="+this.entry.currentTier);
    // return this.entry && ((tier.type == 'ALL' || tier.approver.indexOf(this.user.email) > -1) && tier.sortOrder == this.entry.currentTier && !this.entry.approval[tier.id]);
  }

  cancelEntry() {
    this.entryService.cancel(this.entry.id, this.user.email)
      .subscribe(res => {
        this.getData(this.entry.id, this.form.id);
      })
  }

  submitApproval() {
    this.approval['tier'] = this.form.tiers[this.entry.currentTier];

    this.entryService.action(this.entry.id, this.user.email, this.approval)
      .subscribe(res => {
        this.getData(this.entry.id, this.form.id);
        //["run", this.form.app.id, "form", this.form.id, "view", res.id]
        // this.router.navigate(["run",this.form.app.id,"form",this.form.id,"view",this.entry.id]);
      });
  }

  file: any = {};
  uploading = {};
  onUpload(event, data, field) {
    if (event.target.files && event.target.files.length) {

      this.entryService.uploadAttachment(event.target.files[0])
        .subscribe(res => {
          data[field.code] = res.fileUrl;
        })

    }
  }

  editApprovalData = {};

  assignApprover(content,tier){
    this.editApprovalData = tier;
    history.pushState(null, null, window.location.href);
    this.modalService.open(content)
      .result.then(res => {
        this.entryService.assign(this.entry.id, tier.id, res.approver)
        .subscribe(res=>{
          this.getForm(this.form.id, this.entry.id);
        });
      }, res => { });
  }

}

