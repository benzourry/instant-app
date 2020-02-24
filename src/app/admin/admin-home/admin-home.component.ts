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
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../_shared/service/user.service';
import { AppService } from '../../service/app.service';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['../../../assets/css/tile.css']
})
export class AdminHomeComponent implements OnInit {

  itemTotal:number;
  itemLoading:boolean;
  user: any;
  itemList: any[]=[
    {title:'Lookup Manager',description:'Manage lookup used in your app', url:'/admin/lookup', icon: ['far','caret-square-down']},
    {title:'Mailer Manager',description:'Setup mailer template for your app', url:'/admin/mailer', icon: ['fas','mail-bulk']},
    {title:'User Manager',description:'Manage your app user', url:'/admin/user', icon: ['fas','users-cog'], disabled: true}
  ];
  pageSize = 15;
  searchText="";

  constructor(private http: HttpClient,private userService: UserService, private appService:AppService) { }

  ngOnInit() {
    this.userService.getUser()
      .subscribe(user => {
        this.user = user.activeProfile;
      });
  }


}
