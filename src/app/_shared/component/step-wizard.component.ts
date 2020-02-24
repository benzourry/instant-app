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

import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'step-wizard',
  template: `<div class="wizardstep" [ngClass]="type" *ngIf="tiers?.length>0">
  <div class="step" *ngFor="let tier of tiers" [ngbTooltip]="tier.name">
      <span [ngClass]="{
        'bg-success':approval[tier.id] && approval[tier.id].status=='approved',
        'bg-warning':approval[tier.id] && approval[tier.id].status=='returned',
        'bg-danger':approval[tier.id] && approval[tier.id].status=='rejected',
        'bg-primary':approval[tier.id] && approval[tier.id].status=='submitted',
        'bg-primary':approval[tier.id] && approval[tier.id].status=='resubmitted'
       }">
          <fa-icon [icon]="['fas','question']" *ngIf="!approval[tier.id]"></fa-icon>
          <fa-icon [icon]="['fas','check']" *ngIf="['approved'].indexOf(approval[tier.id] && approval[tier.id].status)>-1"></fa-icon>
          <fa-icon [icon]="['fas','share']" *ngIf="['resubmitted','submitted'].indexOf(approval[tier.id] && approval[tier.id].status)>-1"></fa-icon>
          <fa-icon [icon]="['fas','reply']" *ngIf="['returned'].indexOf(approval[tier.id] && approval[tier.id].status)>-1"></fa-icon>
          <fa-icon [icon]="['fas','times']" *ngIf="['rejected'].indexOf(approval[tier.id] && approval[tier.id].status)>-1"></fa-icon>
      </span>
      <p *ngIf="type!='mini'">{{tier.name}}</p>
  </div>
</div>`,
  styles: [`/* mini version */

  mini.wizardstep .step {
      flex:1;
      font-size: 10px;
      position: relative;
      text-align: center;
      color: white;
  }
  .mini.wizardstep .step span{
      display: block;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      line-height: 14px;
      text-align: center;
      border: 2px solid #7d7d7d;
      background-color: #7d7d7d;
      color: white;
  }
  .mini.wizardstep .step:after {
      width: 100%;
      height: 20px;
      content: '';
      position: absolute;
      background-color: #bbb;
      top: 0px;
      left: -50%;
      z-index: -1;
  }
  .mini.wizardstep .step.active span {
      border-color: green;
      background-color: green;
  }
  /* full version */
  .wizardstep {
      padding: 0px;
      counter-reset: step;
      display:flex;
      justify-content: space-around;
      z-index: 3;
      position:relative;
  }
  .wizardstep .step {
      flex:1;
      font-size: 12px;
      position: relative;
      text-align: center;
  }
  .wizardstep .step span{
      display: block;
      width: 30px;
      height: 30px;
      margin: 0 auto;
      border-radius: 50%;
      line-height: 24px;
      text-align: center;
      border: 2px solid #7d7d7d;
      background-color: white;
  }
  .wizardstep .step p{
      margin-top: 10px;
      color:#333;
  }
  .wizardstep .step:after {
      width: 100%;
      height: 2px;
      content: '';
      position: absolute;
      background-color: #7d7d7d;
      top: 15px;
      left: -50%;
      z-index: -1;
  }
  .wizardstep .step:first-child:after {
      content: none;
  }
  .wizardstep .step.active span {
      border-color: green;
  }`]
})
export class StepWizardComponent implements OnInit {

  constructor() { }

  @Input() tiers: any;
  @Input() approval: any;
  @Input() type: string;

  ngOnInit() {
  }

}
