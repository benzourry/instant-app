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
// import { StartComponent } from './start/start.component';
import { RepoHomeComponent } from './repo-home/repo-home.component';
// import { BarChartModule, LineChartModule, PieChartModule, AreaChartModule } from '@swimlane/ngx-charts';
import { SharedModule } from '../_shared/shared.module';
// import { FormComponent } from './form/form.component';
// import { ViewComponent } from './view/view.component';
// import { ListComponent } from './list/list.component';
// import { InitDirective } from '../_shared/directive/init.directive';
// import { ListMyComponent } from './list-my/list-my.component';
// import { ListActionComponent } from './list-action/list-action.component';
// import { ListAdminComponent } from './list-admin/list-admin.component';
// import { TilesComponent } from './tiles/tiles.component';
// import { AuthGuardService } from '../_shared/service/auth-guard.service';
// import { FieldViewComponent } from '../_shared/component/field-view.component';
// import { FormViewComponent } from '../_shared/component/form-view.component';
// // import { FieldEditComponent } from '../_shared/field-edit/field-edit.component';
// import { StepWizardComponent } from '../_shared/component/step-wizard.component';
// import { DashboardComponent } from './dashboard/dashboard.component';
// import { UniqueAppPathDirective } from '../_shared/app-path-validator';

const routes: Routes = [
  { path: '', component: RepoHomeComponent },
  // {
  //   path: ':appId', component: StartComponent,
  //   // children: [
  //   //   { path: '', component: TilesComponent },
  //   //   { path: 'form/:formId/add', component: FormComponent },
  //   //   { path: 'form/:formId/view/:entryId', component: ViewComponent },
  //   //   { path: 'form/:formId/edit/:entryId', component: FormComponent },
  //   //   { path: 'form/:formId/prev/:prevId', component: FormComponent }, 
  //   //   // { path: 'list/:formId/my/:id', component: ListMyComponent },
  //   //   // { path: 'list/:formId/action/:id', component: ListActionComponent },
  //   //   // { path: 'list/:formId/admin/:id', component: ListAdminComponent },
  //   //   { path: 'form/:formId/list/:id', component: ListComponent },
  //   //   { path: 'dashboard/:id', component: DashboardComponent },

  //   // ],
  //   canActivate: [AuthGuardService]
  // }
];

@NgModule({
  declarations: [
    RepoHomeComponent,
    // EditorComponent,
    // FormComponent,
    // StartComponent,
    // ViewComponent,
    // ListComponent,
    // InitDirective,
    // ListMyComponent,
    // ListActionComponent,
    // ListAdminComponent,
    // TilesComponent,
    // FieldViewComponent,
    // FormViewComponent,
    // StepWizardComponent,
    // DashboardComponent
  ],
  imports: [RouterModule.forChild(routes), SharedModule],
  exports: [RouterModule],
  // declarations: []
})
export class RepoModule { }
