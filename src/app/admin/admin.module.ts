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

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { SharedModule } from '../_shared/shared.module';
import { LookupComponent } from './lookup/lookup.component';
import { MailerComponent } from './mailer/mailer.component';

const routes: Routes = [
  { path: '', component: AdminHomeComponent },
  { path: 'lookup', component: LookupComponent },
  { path: 'mailer', component: MailerComponent },
];

@NgModule({
  declarations: [
    AdminHomeComponent,
    LookupComponent,
    MailerComponent
  ],
  imports: [RouterModule.forChild(routes), SharedModule],
  exports: [RouterModule]
})
export class AdminModule { }
