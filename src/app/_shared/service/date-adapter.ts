import { Injectable } from "@angular/core";
import { NgbDateStruct, NgbDateAdapter } from "@ng-bootstrap/ng-bootstrap";

@Injectable()
export class NgbUnixTimestampAdapter extends NgbDateAdapter<number> {

  fromModel(number): NgbDateStruct {

   var f: Date = new Date(number);
    return {
      year: f.getFullYear(),
      month: f.getMonth() + 1,
      day: f.getDate(),
    };
  }

  toModel(date: NgbDateStruct): number {
    // var d: Date = new Date(date.year, date.month, date.day);
    var d:Date = date && date.year && date.month ? new Date(date.year, date.month - 1, date.day, 12) : null;

    // var t:number=d?Math.round((d).getTime()):null;
    // console.log("toModel:"+ d+":");

    // if (!date || !isInt(date.day) || !isInt(date.day) || !isInt(date.day)) {
    //   return null;
    // }

    return d?Math.round((d).getTime()):null;// moment(`${date.year}-${date.month}-${date.day}`, 'YYYY-MM-DD');
  }
}