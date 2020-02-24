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
import { FormService } from '../../service/form.service';
import { AppService } from '../../service/app.service';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UtilityService } from 'src/app/_shared/service/utility.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlatformLocation } from '@angular/common';
// import { BrowserQRCodeReader } from '@zxing/library';
// declare const qrcode: any;
// declare const zdecoder: any;

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {
  appLoading: boolean;


  constructor(private userService: UserService, private formService: FormService,
    private appService: AppService, private router: Router, private route: ActivatedRoute, private utilityService: UtilityService, private modalService: NgbModal,
    private location: PlatformLocation) {
    location.onPopState(() => this.modalService.dismissAll(''));
    this.utilityService.testOnline$().subscribe(online => this.offline = !online);
  }


  user: any;
  formList: any;
  badge: any;
  app: any;
  searchText: string = "";
  active = false;

  navToggle = {};

  offline = false;

  ngOnInit() {
    this.userService.getUser()
      .subscribe((user) => {
        this.user = user;

        console.log(this.getPath());

        // if (this.)
        // if (this.getPath()) {
        // this.getAppByPath(this.getPath());
        // } else {
        this.route.params
          .subscribe((params: Params) => {
            const id = params['appId'];
            this.getApp(id);
            this.getForms(id);
            this.getStart(id);
          });
        // }


      })
  }

  //window.location.host
  getPath() {
    return window.location.host.match(/(?:http[s]*\:\/\/)*(.*?)\.(?=[^\/]*\.)?ia\.unimas\.my/);
    // return "https://research.ia.unimas.my/run".match(/(?:http:\/\/)?(?:([^.]+)\.)?ia\.unimas\.my/);
    // return "https://ia.unimas.my/run".match(/(?:http[s]*\:\/\/)*(.*?)\.(?=[^\/]*\..{2,5})/i)[1];
  }

  getApp(id) {
    this.appLoading = true;
    this.appService.getApp(id)
      .subscribe(res => {
        this.app = res;
        this.appLoading = false;
      }, res => this.appLoading = false)
  }

  // getAppByPath(path) {
  //   this.appLoading = true;
  //   this.appService.getAppByPath(path)
  //     .subscribe(res => {
  //       this.app = res;
  //       this.appLoading = false;
  //       this.getForms(res.id);
  //       this.getStart(res.id);
  //     }, res => this.appLoading = false)
  // }

  getStart(id) {
    this.appService.getStartBadge(id, this.user.email)
      .subscribe(res => {
        this.badge = res;
      })
  }

  getForms(id) {
    this.formService.getList(new HttpParams().append('appId', id))
      .subscribe(res => {
        this.formList = res.content;
      })
  }

  // qrValueChanged(event, action) {
  //   const file = event.target.files[0];
  //   const reader = new FileReader();
  //   if (file){
  //   reader.readAsDataURL(file);
  //   reader.onload = (e: any) => {
  //       const data = e.target.result;
  //       qrcode.callback = (res) => {
  //         var url = `form/${action.next}/${action.nextType}/${res}`;
  //         this.router.navigate([url],{relativeTo: this.route});
  //       };
  //       qrcode.decode(data);
  //     };
  //   }
  // }






  // qrValueChanged(event, action) {
  //   const file = event.target.files[0];
  //   const reader = new FileReader();
  //   if (file) {
  //     reader.readAsDataURL(file);
  //     reader.onload = (e: any) => {
  //       const data = e.target.result;
  //       var elem = document.createElement('canvas');
  //       var ctx = elem.getContext('2d');
  //       const img = new Image();
  //       img.onload = () => {
  //         // here canvas behavior
  //         elem.width = img.width;
  //         elem.height = img.height;

  //         ctx.drawImage(img, 0, 0);
  //         var imageData = ctx.getImageData(0, 0, img.width, img.height);

  //         var code = zdecoder.zbarProcessImageData(imageData);
  //         if (code.length > 0) {
  //           var res = code[0][2];
  //           var url = `form/${action.next}/${action.nextType}/${res}`;
  //           this.router.navigate([url], { relativeTo: this.route });
  //         }
  //       };
  //       img.src = data;
  //     };
  //   }
  // }
  qrValueChange(code, d) {
    console.log(this.screenData);
    console.log("code:"+code)
    // alert(event);
    d();
    if (code) {
      var url = `form/${this.screenData.next}/${this.screenData.nextType}/${code}`;
      this.router.navigate([url], { relativeTo: this.route });
    }
  }

  screenData: any = {};
  qrScanDialog(content, data, isNew) {
    this.screenData = data;
    history.pushState(null, null, window.location.href);
    this.modalService.open(content)
      .result.then(res => {
        console.log(res);
      }, res => { });
  }

  isAdmin = (form) => this.user && (form.admin).indexOf(this.user.email) > -1;

}
