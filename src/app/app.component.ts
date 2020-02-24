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

import { Component} from '@angular/core';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { PushService } from './_shared/service/push.service';
import { UtilityService } from './_shared/service/utility.service';
// import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  title = 'app';
  
  updateAvailable:boolean=false;

  // onlineEvent: Observable<Event>;
  // offlineEvent: Observable<Event>;
  // subscriptions: Subscription[] = [];
  
  constructor(private swPush: SwPush, private pushService: PushService,private swUpdate: SwUpdate, private utilityService: UtilityService) {
    this.swUpdate.available.subscribe(evt => {
      this.updateAvailable = true;
    });
    this.utilityService.testOnline$().subscribe(v=>this.offline = !v)
    // this.subscribeToNotifications();
  }

  reload(){
    window.location.reload();
  }

  offline=false;

}
