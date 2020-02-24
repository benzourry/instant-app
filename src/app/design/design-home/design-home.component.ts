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

import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { UserService } from '../../_shared/service/user.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppService } from '../../service/app.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { PlatformLocation } from '@angular/common';
import { baseApi } from '../../_shared/constant.service';
import { UtilityService } from 'src/app/_shared/service/utility.service';
import { SpeechRecognitionService } from 'src/app/_shared/service/speech-recognition.service';

@Component({
  selector: 'app-design-home',
  templateUrl: './design-home.component.html',
  styleUrls: ['../../../assets/css/tile.css', './design-home.component.css']
})
export class DesignHomeComponent implements OnInit, OnDestroy {

  @ViewChild('editItemTpl', {static:false}) public editItemTpl: TemplateRef<any>;

  offline=false;
  
  editItemData: any;
  itemList: any[];
  itemTotal: number;
  itemLoading:boolean;
  sharedList: any[];
  sharedTotal: number;
  sharedLoading:boolean;
  pageSizeShared: number = 8;
  tplList: any[];
  tplTotal: number;
  tplLoading:boolean;
  user: any;
  searchText: string = "";
  pageSize: number = 24;
  pageNumber: number = 1;
  pageSizeTpl: number = 7;
  pageNumberTpl: number = 1;
  pageNumberShared: number = 1;
  baseApi: string = baseApi;
  themes: any[] = [
    { name: "BarBlue", color: "#0747a6" },
    { name: "Dark", color: "#212529" },
    { name: "Blue", color: "#0069d9" },
    { name: "Blue", color: "#2196F3" },
    { name: "Teal", color: "#009688" },
    { name: "Purple", color: "#673AB7" },
    { name: "Orange", color: "#F44336" },
    { name: "Orange", color: "#FF5722" },
    { name: "Indigo", color: "#3F51B5" },
  ]
  initialAppPath: string="";
  constructor(private http: HttpClient,
    private userService: UserService,
    private appService: AppService,
    private router: Router,
    private modalService: NgbModal,
    private location: PlatformLocation,
    private speechRecognitionService: SpeechRecognitionService,
    private utilityService:UtilityService) {
      location.onPopState(() => this.modalService.dismissAll(''));
      this.utilityService.testOnline$().subscribe(online=>this.offline = !online);
    }

  ngOnInit() {
    this.userService.getUser()
      .subscribe(user => {
        this.user = user;
        this.getItemList(1);
        this.getSharedList(1);
        this.getTplList(1);
      })
  }

  ngOnDestroy(){
    this.speechRecognitionService.DestroySpeechObject();
  }

  speechData: string;
  showSearchButton:boolean=true;
  activateSpeechSearchMovie(): void {
    this.showSearchButton = false;

    this.speechRecognitionService.record()
        .subscribe(
        //listener
        (value) => {
          if (['clear','reset'].indexOf(value)>-1){
            this.searchText = "";
            this.getItemList(1);
          }else if (['create app','new app'].indexOf(value)>-1){
            this.editItem(this.editItemTpl,{useGoogle:true,useUnimas:true},true)
          }else if (['edit'].indexOf(value.split(" ")[0])>-1){
            var id = this.itemList[value.split(" ")[1]].id;
            this.router.navigate(['/design/'+id]);
          }else if (['find'].indexOf(value.split(" ")[0])>-1){
            var term = value.replace("find ","");
            this.speechData = term;
            this.searchText = term;
            this.getItemList(1);
            console.log(value);
          }
            
        },
        //errror
        (err) => {
            console.log(err);
            if (err.error == "no-speech") {
                console.log("--restatring service--");
                this.activateSpeechSearchMovie();
            }
        },
        //completion
        () => {
            this.showSearchButton = true;
            console.log("--complete--");
            this.activateSpeechSearchMovie();
        });
}


  getTplList(pageNumber) {
    this.tplLoading = true;
    let params = new HttpParams()
      .set("size", this.pageSizeTpl.toString())
      .set("page", (pageNumber - 1).toString())
      .set("searchText", this.searchText)
      .set("status", "template")
    // .set("sort", 'id, desc');

    this.appService.getAppByStatusList(params)
      .subscribe(res => {
        this.tplTotal = res.totalElements;
        this.tplList = res.content;
        this.tplLoading = false;
      }, res=>{this.tplLoading = false;});
  }

  getItemList(pageNumber) {
    this.itemLoading = true;
    let params = new HttpParams()
      .set("size", this.pageSize.toString())
      .set("page", (pageNumber - 1).toString())
      .set("searchText", this.searchText)
      .set("email", this.user.email)
    // .set("sort", 'id, desc');

    this.appService.getAppMyList(params)
      .subscribe(res => {
        this.itemTotal = res.totalElements;
        this.itemList = res.content;
        this.itemLoading = false;
      }, res=>{this.itemLoading = false;});
  }

  getSharedList(pageNumber) {
    this.sharedLoading = true;
    let params = new HttpParams()
      .set("size", this.pageSizeShared.toString())
      .set("page", (pageNumber - 1).toString())
      .set("searchText", this.searchText)
      .set("email", this.user.email)
    // .set("sort", 'id, desc');

    this.appService.getAppSharedList(params)
      .subscribe(res => {
        this.sharedTotal = res.totalElements;
        this.sharedList = res.content;
        this.sharedLoading = false;
      }, res=>{this.sharedLoading = false;});
  }



  editItem(content, data, isNew) {
    var items = {};
    this.initialAppPath = data.appPath;
    this.editItemData = data;
    // alert(JSON.stringify(this.editItemData));
    history.pushState(null, null, window.location.href);
    this.modalService.open(content).result.then(rItem => {
      console.log(rItem);
      this.appService.save(rItem, this.user.email)
        .subscribe(res => {
          this.getItemList(this.pageNumber);
          this.getTplList(this.pageNumberTpl);
          if (isNew) {
            this.router.navigate([`design/${res.id}`]);
            // $location.path("design/" + res.data.id);
          }
        });
    }, res => { });
  }


  cloneItem(content, data, isNew) {
    var items = {};
    this.initialAppPath = data.appPath;
    data.status = "local";
    delete data.appPath;
    this.editItemData = data;
    if (this.user.email.indexOf("@unimas.my")==-1){
      this.editItemData.useUnimas = false;
    }
    history.pushState(null, null, window.location.href);
    this.modalService.open(content).result.then(rItem => {
      console.log(rItem);
      this.appService.clone(rItem, this.user.email)
        .subscribe(res => {
          this.getItemList(this.pageNumber);
          if (isNew) {
            this.router.navigate([`design/${res.id}`]);
            // $location.path("design/" + res.data.id);
          }
        });
    }, res => { });
  }

  removeItemData: any;
  removeItem(content, data) {
    this.removeItemData = data;
    history.pushState(null, null, window.location.href);
    this.modalService.open(content)
      .result.then(result => {
        this.appService.remove(data)
          .subscribe(res => {
            this.getItemList(this.pageNumber);
          }, res => {
          });
      }, res => { });
  }

  toSpaceCase = (string)=> string.replace(/[\W_]+(.|$)/g, (matches, match) => match ? ' ' + match : '').trim();

  toHyphen = (string) => string ? this.toSpaceCase(string).replace(/\s/g, '-').toLowerCase() : '';

  getHost = () => window.location.host;

  uploadLogo($event){
    if ($event.target.files && $event.target.files.length) {
      this.appService.uploadLogo($event.target.files[0])
        .subscribe(res => {
          this.editItemData['logo'] = res.fileUrl;
        })

    }
  }
}
