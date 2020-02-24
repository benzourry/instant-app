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

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of, merge, fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { base } from '../constant.service';
declare let OAUTH: any;
// import { NgxPermissionsService } from 'ngx-permissions';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  promise:any;

  base = base;

  constructor(private router: Router,
  private http:HttpClient) { }


  public isLoggedIn():boolean{
    return !!sessionStorage.getItem("identity");
  } 

  login(cred:any){
    return this.http.post<any>(`${this.base}/auth/login`,cred);
  }

  register(cred:any){
    return this.http.post<any>(`${this.base}/auth/signup`,cred);
  }

  getUser():Observable<any>{
    let rt:Observable<any>;

    if (sessionStorage.getItem("user")){
      var access_token = this.getToken();
      this.promise = of(JSON.parse(sessionStorage.getItem("user")));
    }else{

      let server = sessionStorage.getItem('server');
      if(!sessionStorage.getItem("identity")){
        this.router.navigate(['/login']);
        window.location.href = OAUTH.AUTH_URI+"/"+server+"?redirect_uri="+OAUTH.CALLBACK;
        // location.href = OAUTH[server].AUTH_URI+"?client_id=" + OAUTH[server].CLIENT_ID + "&response_type=token&scope="+OAUTH[server].SCOPE+"&redirect_uri="+OAUTH.CALLBACK;
      }else{
        // this.router.navigate(['/login']);
          var access_token = this.getToken();
          // // $http.defaults.headers.common['Authorization'] = 'Bearer '+ this.getToken();
          if (!this.promise){
              this.http.get<any>(OAUTH.USER_URI+"?access_token="+access_token)
              .subscribe(res=>{
                  window.sessionStorage.setItem("user",JSON.stringify(OAUTH.USER_UNBOX?res[OAUTH.USER_UNBOX]:res));
                  this.promise = of(res);
              }, res=>{
                  window.location.href = OAUTH.AUTH_URI+"/"+server+"?redirect_uri="+OAUTH.CALLBACK;
              });
          }
      }
    }
    return this.promise;
  }

  getToken=()=>JSON.parse(window.sessionStorage.getItem("identity")).access_token;

  public logout(){
    sessionStorage.removeItem("identity");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("server");
    this.router.navigate(['/login']);
  }
}
