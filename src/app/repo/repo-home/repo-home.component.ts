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

import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { UserService } from '../../_shared/service/user.service';
import { AppService } from '../../service/app.service';
import { baseApi } from '../../_shared/constant.service';
import { SpeechRecognitionService } from 'src/app/_shared/service/speech-recognition.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlatformLocation } from '@angular/common';
import { UtilityService } from 'src/app/_shared/service/utility.service';

@Component({
  selector: 'app-run-home',
  templateUrl: './repo-home.component.html',
  styleUrls: ['../../../assets/css/tile.css', './repo-home.component.css']
})
export class RepoHomeComponent implements OnInit, OnDestroy {

  offline=false;
  
  editItemData: any;

  itemTotal: number;
  itemLoading: boolean;
  user: any;
  itemList: any[];
  pageSize = 24;
  pageNumber = 1;
  searchText = "";
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
  topLoading: boolean;
  topList: any;
  topTotal: any;

  constructor(private http: HttpClient, private userService: UserService, private appService: AppService,
    private speechRecognitionService: SpeechRecognitionService,
    private modalService: NgbModal,
    private location: PlatformLocation,
    private router: Router,
    private utilityService:UtilityService) {
      location.onPopState(() => this.modalService.dismissAll(''));
      this.utilityService.testOnline$().subscribe(online=>this.offline = !online);
     }

  ngOnInit() {
    this.userService.getUser()
      .subscribe(user => {
        this.user = user;
        this.getItemList(1);
        this.getTopList();
      });
  }

  ngOnDestroy() {
    this.speechRecognitionService.DestroySpeechObject();
  }

  speechData: string;
  showSearchButton: boolean = true;
  activateSpeechSearchMovie(): void {
    this.showSearchButton = false;

    this.speechRecognitionService.record()
      .subscribe(
        //listener
        (value) => {
          if (['clear', 'reset'].indexOf(value) > -1) {
            this.searchText = "";
            this.getItemList(1);
          } else if (['run'].indexOf(value.split(" ")[0]) > -1) {
            var id = this.itemList[0].id;
            this.router.navigate(['/run/' + id]);
          } else if (['find'].indexOf(value.split(" ")[0]) > -1) {
            var term = value.replace("find ", "");
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
            console.log("--restarting service--");
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

  initialAppPath: string="";

  toSpaceCase = (string)=> string.replace(/[\W_]+(.|$)/g, (matches, match) => match ? ' ' + match : '').trim();

  toHyphen = (string) => string ? this.toSpaceCase(string).replace(/\s/g, '-').toLowerCase() : '';

  getHost = () => window.location.host;

  buyItemData:any={};
  activationStatus:any = {};
  buyItem(content, data, isNew){
    this.buyItemData = data;
    history.pushState(null, null, window.location.href);
    this.appService.checkActivate(data.id, this.user.email)
    .subscribe(ca=>{
      this.activationStatus[data.id]=ca.result;
    })
    this.modalService.open(content)
      .result.then(result => {
        this.appService.activate(data.id, result)
        .subscribe(res=>{
            alert(res.result);
        });
        // this.appService.remove(data)
        //   .subscribe(res => {
        //     this.getItemList(1);
        //   }, res => {
        //   });
      }, res => { });
  }

  requestCopy(){
    this.appService.requestCopy(this.buyItemData.id, this.user.email)
    .subscribe(res=>{
      this.activationStatus[this.buyItemData.id]="pending";
    })
  }
  cloneItem(content, data, isNew, d) {
    if (d){d();}
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
          this.getItemList(1);
          if (isNew) {
            this.router.navigate([`design/${res.id}`]);
            // $location.path("design/" + res.data.id);
          }
        });
    }, res => { });
  }


  getItemList(pageNumber) {
    this.itemLoading = true;
    let params = new HttpParams()
      .set("size", this.pageSize.toString())
      .set("page", (pageNumber - 1).toString())
      .set("searchText", this.searchText)

    this.appService.getAppList(params)
      .subscribe(res => {
        this.itemList = res.content;
        this.itemTotal = res.totalElements;
        this.itemLoading = false;
      }, res => { this.itemLoading = false; })
  }

  getTopList() {
    this.topLoading = true;
    // let params = new HttpParams()
    //   .set("size", this.pageSize.toString())
    //   .set("page", (pageNumber - 1).toString())
    //   .set("searchText", this.searchText)

    this.appService.getTopList()
      .subscribe(res => {
        this.topList = res.content;
        this.topTotal = res.totalElements;
        this.topLoading = false;
      }, res => { this.topLoading = false; })
  }



}
