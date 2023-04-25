import { Component, OnInit,ElementRef, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';




@Component({
    selector: 'app-otp-partitioned-input',
    templateUrl: './otp-partitioned-input.component.html',
    styleUrls: ['./otp-partitioned-input.component.scss']
})
export class OtpPartitionedInputComponent implements OnInit {
    @ViewChild('textInput') textInput: ElementRef;
    numbers = [0, 1, 2, 3, 4, 5];
    keys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    otpValueDigits: number[] = [null, null, null, null, null, null];
    otpValue = '';
    elementArr: ElementRef[] = [];
    value: string;
    @Output() onInputComplete: EventEmitter<any> = new EventEmitter();
    otpDigits: string;

    box:any;
    sub: any;
    mouseX: number;
    mouseY: number;


    //new otp-input

    @ViewChild('ngOtpInput') ngOtpInput: any;
    config:any

  


    //end new input  


   private eventsSubscription: Subscription;

   @Input() clearOtp: Observable<void>;



    constructor() { }

    ngOnInit()
    {
        // this.box = this.renderer.selectRootElement('#box');
        // let mouseup$ = fromEvent(this.textInput.nativeElement, 'mouseup');

        // this.sub = mouseup$.subscribe((e: any) => {
        //     this.mouseX = e.clientX;
        //     this.mouseY = e.clientY;


            // this.textInput.nativeElement.setSelectionRange(this.mouseX+1, this.mouseX+2);
            // this.renderer.setStyle(this.box, 'letter-spacing', '27px');
            // this.renderer.setStyle(this.box, 'position', 'relative');
            // this.renderer.setStyle(this.box, 'left', this.mouseX+30);
            // this.renderer.setStyle(this.box, 'top', this.mouseY);
            //          })

        let isMobile = window.matchMedia('only screen and (max-width: 760px)').matches;   
        if(isMobile)
        {
            this.config = {
                allowNumbersOnly: true,
                length: 6,
                isPasswordInput: false,
                disableAutoFocus: false,
                placeholder: '',
                inputStyles: {
                  'width': '30px',
                  'height': '30px',
                  'border': 'none',
                  'outline': 'none',
                  'border-bottom':'1px solid #383b38',
                  'border-radius': '1px',
                  'font-size':'15px'
                }
              };
        

        }
        else
        {
            this.config = {
                allowNumbersOnly: true,
                length: 6,
                isPasswordInput: false,
                disableAutoFocus: false,
                placeholder: '',
                inputStyles: {
                  'width': '30px',
                  'height': '30px',
                  'border': 'none',
                  'outline': 'none',
                  'border-bottom':'1px solid #383b38',
                  'border-radius': '1px',
                  'font-size':'20px'
                }
              };
        }

        this.eventsSubscription = this.clearOtp.subscribe(() =>
        {
        this.clearOtpCode();
        }
        );
    }

    clearOtpCode()
    {
        this.otpDigits="";
    }


    onOtpChange(otp:any) {

        this.otpDigits=otp;

        if (this.otpDigits.split('').length === 6)
        {
            this.onInputComplete.emit({ smsCode: this.otpDigits }
              )
        }

    }

    ngOnDestroy() {
        this.eventsSubscription.unsubscribe();
      }



}
