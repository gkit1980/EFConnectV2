import { Component, OnInit, ViewChildren, QueryList, AfterViewInit, ElementRef, Output, EventEmitter } from '@angular/core';
import { SignupService } from '../../../services/signup.service';

@Component({
    selector: 'app-otp-input',
    templateUrl: './otp-input.component.html',
    styleUrls: ['./otp-input.component.scss']
})
export class OtpInputComponent implements OnInit {
    @ViewChildren('otpInput') inputComponents: QueryList<ElementRef>;
    numbers = [0, 1, 2, 3, 4, 5];
    keys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    otpValueDigits: number[] = [null, null, null, null, null, null];
    otpValue = '';
    elementArr: ElementRef[] = [];
    value: string;
    @Output() onInputComplete: EventEmitter<any> = new EventEmitter();
    otpDigits: string;
    constructor(private signupService: SignupService) { }

    ngOnInit() {

    }

    // ngAfterViewInit() {
    //     this.elementArr = this.inputComponents.toArray();
    //     this.elementArr[0].nativeElement.focus();
    // }

    // setOtpValue() { }

    // onKeyUp(index: number, e: any) {
    //     const currentCode = e.which || e.code;
    //     let currentKey = e.key;
    //     if (!currentKey) {
    //         currentKey = String.fromCharCode(currentCode);
    //     }

    //     if (this.keys.includes(e.target.value)) {
    //         this.otpValueDigits.splice(index, 1, e.target.value);
    //         this.elementArr[index].nativeElement.value = e.target.value;
    //         if (index !== this.numbers.length - 1) {
    //                 this.elementArr[index + 1].nativeElement.focus();
    //                 this.elementArr[index + 1].nativeElement.select();
    //         }
    //     }

    //     if (index === 5 ) {
    //         this.elementArr[index].nativeElement.select();
    //     }

    //     if (currentKey === 'Backspace' && index !== 0) {
    //         this.otpValueDigits[index] = null;
    //             this.elementArr[index - 1].nativeElement.focus();
    //             this.elementArr[index - 1].nativeElement.select();
    //     }else if (currentKey === 'Backspace'){
    //         this.otpValueDigits[index] = null;
    //     }else if (currentKey === 'ArrowRight' && index !== 5){

    //             this.elementArr[index + 1].nativeElement.focus();
    //             this.elementArr[index + 1].nativeElement.select();

    //     }else if ((currentKey === 'ArrowLeft' && index !== 0)){
    //             this.elementArr[index - 1].nativeElement.focus();
    //             this.elementArr[index - 1].nativeElement.select();
    //     }
    //     if (this.otpValueDigits.length === 6) {
    //         this.setupOtpValue();
    //     }

    //     if (currentKey === 'ArrowLeft' && index == 0){
    //         this.elementArr[index].nativeElement.focus();
    //         this.elementArr[index].nativeElement.select();
    //     }

    //     console.log(this.otpValueDigits);
    // }

    // focus(i:any) {
    //     this.elementArr[i].nativeElement.select();
    // }

    setupOtpValue() {
        this.otpValue = '';
        this.otpValueDigits.forEach((element) => {
            this.otpValue = this.otpValue + element;
        });
        // this.signupService.setOtp(this.otpValue);
        this.onInputComplete.emit({ smsCode: this.otpValue })
    }

    onKeyDown(index: any, e: any) { }

    onOtpChange() {
        if (this.otpDigits.split('').length === 6) {
            this.onInputComplete.emit({ smsCode: this.otpDigits })
        }
    }

}
