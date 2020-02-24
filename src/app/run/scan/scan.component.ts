import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { BackendService } from '../service/backend.service';
// import { Params } from '@fortawesome/fontawesome-svg-core';
// declare const qrcode: any;
// declare const zdecoder: any;
// import jsQR from "jsqr";
import { BrowserQRCodeReader } from '@zxing/library';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.css']
})
export class ScanComponent implements OnInit, AfterViewInit {
  errorMsg: any;

  constructor(private route: ActivatedRoute, private router: Router, private cdr: ChangeDetectorRef) {
    this.captures = [];
  }

  @ViewChild("video", { static: true })
  public video: ElementRef;

  @ViewChild("canvas", { static: true })
  public canvas: ElementRef;

  public captures: Array<any>;

  value: String;
  token: String;
  user: any;
  error: boolean;
  // start:boolean;
  altClass: string;
  loading: boolean;
  codeReader = new BrowserQRCodeReader();

  @Output() valueChange = new EventEmitter();

  public ngOnInit() {

  }



  camSupport: boolean = false;

  public ngAfterViewInit() {
    var constraints = {
      audio: false,
      video: {
        facingMode: {
          exact: 'environment'
        }
      }
      // {
      //   width: { min: 240, ideal: 720, max: 1080 },
      //   height: { min: 240, ideal: 720, max: 1080 }
      // }
    };
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      this.camSupport = true;
      navigator.mediaDevices.getUserMedia(constraints).then(stream => {
        // this.video.nativeElement.src = window.URL.createObjectURL(stream);
        this.video.nativeElement.srcObject = stream;
        // this.video.nativeElement.play();

        this.codeReader
          .decodeFromInputVideoDevice(undefined, 'video')
          .then(result => {
            this.valueChange.emit(result);
          })
          .catch(err => console.error(err));

      }, error => {
        this.camSupport = false;
      });
    } else {
      this.camSupport = false;
    }
    this.cdr.detectChanges();
  }

  truncateColor(value) {
    if (value < 0) {
      value = 0;
    } else if (value > 255) {
      value = 255;
    }

    return value;
  }

  applyContrast(data, contrast) {
    var factor = (259.0 * (contrast + 255.0)) / (255.0 * (259.0 - contrast));

    for (var i = 0; i < data.length; i += 4) {
      data[i] = this.truncateColor(factor * (data[i] - 128.0) + 128.0);
      data[i + 1] = this.truncateColor(factor * (data[i + 1] - 128.0) + 128.0);
      data[i + 2] = this.truncateColor(factor * (data[i + 2] - 128.0) + 128.0);
    }
  }

  //   bgColor:string;

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
              this.valueChange.emit(result);
            })
            .catch(err => console.error(err));

          // here canvas behavior
          /*this.canvas.nativeElement.width = img.width;
          this.canvas.nativeElement.height = img.height;

          var context = this.canvas.nativeElement.getContext("2d");
          context.drawImage(img, 0, 0);
          var imageData = context.getImageData(0, 0, img.width, img.height);

          var code = zdecoder.zbarProcessImageData(imageData);
          if (code.length > 0) {
            var res = code[0][2];
            this.valueChange.emit(res);
          }*/
        };
        img.src = data;
      };
    }
  }


  // public capture() {
  //   this.error = false;
  //   var width: number = this.video.nativeElement.videoWidth;
  //   var height: number = this.video.nativeElement.videoHeight;
  //   this.canvas.nativeElement.width = width;
  //   this.canvas.nativeElement.height = height;

  //   var context = this.canvas.nativeElement.getContext("2d");
  //   context.drawImage(this.video.nativeElement, 0, 0, width, height);
  //   // preprocess image
  //   var imageData = context.getImageData(0, 0, width, height);
  //   // this.applyContrast(imageData.data, 100);
  //   // context.putImageData(imageData, 0, 0);

  //   // alert(decoder);
  //   // decoder.onmessage = (e)=>{
  //   //   alert(e);
  //   // }

  //   if (imageData) {

  //     var code = zdecoder.zbarProcessImageData(imageData);

  //     // const code = jsQR(imageData.data, width, height);
  //     // alert(code.length);
  //     // alert(code[0][2]);
  //     if (code.length > 0) {
  //       var res = code[0][2];
  //       this.valueChange.emit(res);
  //       // if (res.indexOf('IRIS-EXPO-EVAL') > -1) {
  //       //   var value = res.replace('IRIS-EXPO-EVAL-', '');
  //       //   this.value = value;
  //       //   this.altClass = 'swapStartSuccess';
  //       //   this.error = false;

  //       //   this.router.navigate(["f", value]);
  //       //   //   this.router.navigate(['blmrazif@unimas.my',"f",value]);
  //       // } else {
  //       //   this.altClass = 'swapStartError';
  //       //   this.error = true;
  //       //   this.errorMsg = res;
  //       // }
  //     } else {
  //       this.altClass = 'swapStartError';
  //       this.error = true;
  //       this.errorMsg = 'No QR Code detected';
  //     }

  //     // if(code){
  //     //   this.drawLine(context,code.location.topLeftCorner, code.location.topRightCorner, '#FF3B58');
  //     //   this.drawLine(context,code.location.topRightCorner, code.location.bottomRightCorner, '#FF3B58');
  //     //   this.drawLine(context,code.location.bottomRightCorner, code.location.bottomLeftCorner, '#FF3B58');
  //     //   this.drawLine(context,code.location.bottomLeftCorner, code.location.topLeftCorner, '#FF3B58');
  //     // }




  //     // qrcode.callback = (res) => {


  //     setTimeout(() => {
  //       this.altClass = '';
  //     }, 600);

  //     // };
  //     // qrcode.decode(this.canvas.nativeElement.toDataURL("image/png"));
  //   }
  // }

}
