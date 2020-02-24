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

import { Component, OnInit, Input, Output, EventEmitter, forwardRef, ViewChild, AfterViewInit, Optional, Inject } from '@angular/core';
import { baseApi } from '../../_shared/constant.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, Validator, FormControl, NG_ASYNC_VALIDATORS, NG_VALIDATORS, NgModel } from '@angular/forms';
import { NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { NgbUnixTimestampAdapter } from '../service/date-adapter';
import { of } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { ElementBase } from './element-base';
import { ViewEncapsulation} from '@angular/core';
import { BrowserQRCodeReader } from '@zxing/library';
// declare const qrcode: any;
// declare const zdecoder: any;



export const CUSTOMINPUT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => FieldEditComponent),
  multi: true,
};

// export const CUSTOMINPUT_VALUE_VALIDATOR: any = {
//   provide: NG_VALIDATORS,
//   useExisting: forwardRef(() => FieldEditComponent),
//   multi: true,
// }

@Component({
  selector: 'field-edit',
  templateUrl: './field-edit.component.html',
//   template: `<input
//   type="text"
//   [placeholder]="placeholder"
//   [(ngModel)]="value"
//   [ngClass]="{invalid: (invalid | async)}"
//   [id]="identifier"
// />`,
  styleUrls: ['./field-edit.component.css'],
  providers: [{ provide: NgbDateAdapter, useClass: NgbUnixTimestampAdapter }, CUSTOMINPUT_VALUE_ACCESSOR],
  encapsulation: ViewEncapsulation.None
})

export class FieldEditComponent  extends ElementBase<string> {
  // protected model: NgModel;


  // private innerValue: any = '';

  // private onTouchedCallback: () => void = () => { };
  // private onChangeCallback: (_: any) => void = () => { };

  // @ViewChild('form') form;
  // @ViewChild('formField') input;
  @Input() field: any;
  @Input() user: any;
  @Input() itemList: any;
  @Input() always: boolean=false;
  data: any;
  file: any = {}
  scaleTo10 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  scaleTo5 = [1, 2, 3, 4, 5];
  baseApi: string = baseApi;
  codeReader = new BrowserQRCodeReader();


  @Input() lookupList: any;

  @Output() valueChange = new EventEmitter();
  @Output() selectFocus = new EventEmitter();
  @Output() fileValueChange = new EventEmitter();



  @ViewChild(NgModel, {static:false}) model: NgModel;

  public identifier = `form-text-${identifier++}`;

  constructor(
    @Optional() @Inject(NG_VALIDATORS) validators: Array<any>,
    @Optional() @Inject(NG_ASYNC_VALIDATORS) asyncValidators: Array<any>,
  ) {
    super(validators, asyncValidators);
  }




  // ngAfterViewInit(): void {
  //   // this.ngControl = this.injector.get(NgControl);

  //   // Force restart of validation
  //   if (this.input && this.input.control) {
  //     this.input.control.updateValueAndValidity({
  //       onlySelf: true
  //     });
  //   }
  // }


  // // ControlValueAccessor Interface
  // writeValue(value: any) {
  //   // if (value !== this.data) {
  //     this.data = value;
  //   // }
  // }


  // // ControlValueAccessor Interface
  // registerOnChange(fn: any) {
  //   this.onChangeCallback = fn;
  // }

  // // ControlValueAccessor Interface
  // registerOnTouched(fn: any) {
  //   // this.onTouchedCallback = fn;
  // }

  compareFn = (val1: any, val2: any) => val1 && val1.code == val2.code;

  valueChanged(event) {
    // console.log("fe:value Change")
    this.valueChange.emit(event);
  //   this.onChangeCallback(event);
  }

  selectFocused(event){
    this.selectFocus.emit(event);
  }

  fileValueChanged(event) {
    this.fileValueChange.emit(event);
  }

  // qrValueChanged(event) {
  //   const file = event.target.files[0];
  //   const reader = new FileReader();
  //   if (file){
  //   reader.readAsDataURL(file);
  //   reader.onload = (e: any) => {
  //       const data = e.target.result;
  //       qrcode.callback = (res) => {
  //         this.value = res;
  //         this.valueChanged(res)};
  //       qrcode.decode(data);
  //     };
  //   }
  // }


  qrValueChanged(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onload = (e: any) => {
        const data = e.target.result;

        // var elem = document.createElement('canvas');
        // var ctx = elem.getContext('2d');
        const img = new Image();        

        img.onload = () => {

          this.codeReader
            .decodeFromImage(img)
            .then(result => {
              this.value = result+"";
              this.valueChanged(result);
            })
            .catch(err => console.error(err));

          // here canvas behavior
          /*elem.width = img.width;
          elem.height = img.height;

          ctx.drawImage(img, 0, 0);
          var imageData = ctx.getImageData(0, 0, img.width, img.height);

          var code = zdecoder.zbarProcessImageData(imageData);
          if (code.length > 0) {
            var res = code[0][2];
            this.value = res;
            this.valueChanged(res);
          }*/
        };
        img.src = data;

      };
    }
  }


  // // Validator Interface
  // public validate(c: FormControl): any {
  //   // console.log(this.form.invalid);
  //   return this.form.invalid?{'error':true}:null;
  //     // return this.input && this.input.control && this.input.control.errors;
  // }

  // preCheck(f) {
  //   return !f.pre || new Function('$', 'user', 'return ' + f.pre)(this.data.content, this.user);
  // }



}

let identifier = 0;
