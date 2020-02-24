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
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../_shared/service/user.service';
declare let OAUTH: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  redirect: string = '';
  constructor(private route: ActivatedRoute, private userService: UserService) { }

  cred:any={};

  useEmail:boolean=false;
  privacyPolicy:string=OAUTH.PRIVACY_POLICY;

  ngOnInit() {
    // Get the query params
    this.route.queryParams
      .subscribe(params => this.redirect = params['redirect'] || '/design');
  }

  login(server) {
    window.sessionStorage.setItem('server',server);
    window.sessionStorage.setItem('redirect',this.redirect);
    location.href = `${OAUTH.AUTH_URI}/${server}?redirect_uri=${OAUTH.CALLBACK}`;
    // location.href = `${OAUTH[server].AUTH_URI}?client_id=${OAUTH[server].CLIENT_ID}&response_type=token&scope=${OAUTH[server].SCOPE}&redirect_uri=${OAUTH.CALLBACK}`;
  }

  register = false;
  signin(data){
    this.userService.login(data)
    .subscribe(res=>{
      var token = res.accessToken;
      if (token !== undefined && token !== null) {
        var identity = {
            access_token: token
        };
        window.sessionStorage.setItem("identity", JSON.stringify(identity));
        fetch(OAUTH.USER_URI,{headers: {'Authorization': 'Bearer '+ token}})
        .then(function (response) {
            response.json().then(function (json) {
                if (!json.error){
                    window.sessionStorage.setItem("user", JSON.stringify(json));
                    window.location.href = OAUTH.FINAL_URI;
                }else{
                    alert(json.error);
                }
                
            });
        });

    } else {
        alert("Problem authenticating");
    }
    });

  }

  signup(data){
    this.userService.register(data)
    .subscribe(res=>{
      alert(res.message);
      this.register = false;
    })
  }

}
