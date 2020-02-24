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
import { EntryService } from '../../service/entry.service';
import { LookupService } from '../../service/lookup.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  dashboard: any;
  chartData: any;
  // form: any;
  user: any;

  constructor(private userService: UserService, private formService: FormService, private entryService: EntryService,
    private lookupService: LookupService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.userService.getUser().subscribe((user) => {
      this.user = user;
      this.route.params
        .subscribe((params: Params) => {
          const id = params['id'];
          if (id) {
            this.getDashboard(id);
          }
        });

    });
  }

  getDashboard(id) {
    this.formService.getDashboard(id)
      .subscribe(res => {
        this.dashboard = res;
        this.getChartData(1);
      });
  }

  getChartData(arg0: any): any {
    this.entryService.getChartData(this.dashboard.id)
      .subscribe(res => {
        this.chartData = res;
      })
  }

}
