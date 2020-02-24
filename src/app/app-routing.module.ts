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
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuardService } from './_shared/service/auth-guard.service';
import { LoginComponent } from './login/login.component';
import { CallbackComponent } from './callback/callback.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'callback', component: CallbackComponent },
  { path: '', component: HomeComponent,
    children: [
      { path: '', redirectTo:'design', pathMatch:'full'},
      { path: 'profile', component: ProfileComponent },
      { path: 'run',    loadChildren: './run/run.module#RunModule' },
      { path: 'repo',    loadChildren: './repo/repo.module#RepoModule' },
      { path: 'design', loadChildren: './design/design.module#DesignModule' },
      { path: 'admin', loadChildren: './admin/admin.module#AdminModule' }

    ],
    canActivate: [AuthGuardService]
  }
  // { path: 'run', loadChildren: './run/run.module#RunModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes,{useHash: true,relativeLinkResolution: 'corrected'})
  ],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }
