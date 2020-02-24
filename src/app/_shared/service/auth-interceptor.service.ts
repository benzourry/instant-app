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

import { HttpInterceptor, HttpRequest, HttpHandler, HttpHeaderResponse, HttpSentEvent, HttpProgressEvent, HttpResponse, HttpUserEvent, HttpEvent, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  constructor(private router: Router, private userService: UserService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.headers.get("clear") == undefined) {
      if (sessionStorage.getItem('identity')) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${JSON.parse(sessionStorage.getItem('identity')).access_token}`
          }
        });
      }
    }
    return next.handle(req).pipe(tap((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
      }
    }, (err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          this.userService.logout()
          //   this.router.navigate(['login']);
        }
      }
    }));
  }
}