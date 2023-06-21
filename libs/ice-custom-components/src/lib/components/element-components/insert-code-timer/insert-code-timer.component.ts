import { environment } from '@insis-portal/environments/environment';
import { Component, OnInit, Pipe, PipeTransform, AfterContentInit } from '@angular/core';
import { Router } from '@angular/router';
import { SignupService } from '@insis-portal/services/signup.service'
import { Observable } from 'rxjs/Rx';
import { ElementComponentImplementation } from '@impeo/ng-ice';
import { IndexedValue } from '@impeo/ice-core';
import {LifecycleEvent } from '@impeo/ice-core';
import { get } from 'lodash';

@Component({
  selector: 'app-insert-code-timer',
  templateUrl: './insert-code-timer.component.html',
  styleUrls: ['./insert-code-timer.component.css']
})
export class InsertCodeTimerComponent extends ElementComponentImplementation implements OnInit {

  mobileNo: number;
  showVerify: boolean;
  smsCode: number;
  errorMsgVerifyMob: string;
  errorMsgVerifySms: string;
  error: boolean;
  timeLeft: number;
  interval: any;
  timeIsOff: boolean;
  smsSentSuccess: boolean;
  errorMsgSmsCode: string;
  successMsgMobileVerification: string;
  showSuccess: boolean;
  insertCodeTimer = 'elements.insertCodeTimer.label';

  constructor(private router: Router, private signupService: SignupService) {
    super();
  }

  ngOnInit() {
    this.smsSentSuccess = true;
    this.successMsgMobileVerification = null;
    this.showSuccess = false;
    this.showVerify = false;
    this.errorMsgVerifyMob = null;
    this.errorMsgVerifySms = null;
    //default values to all

    this.context.iceModel.elements["customer.details.verifyMobileSuccess"].setSimpleValue(false);

    this.context.iceModel.elements["customer.details.mobilePhoneResendButtonFlag"].setSimpleValue(false);
    //
    // this.context.iceModel.elements["customer.details.VerifyMobilePhone"].setSimpleValue(false);

    this.context.iceModel.elements["customer.details.theEndMobileButtonValue"].setSimpleValue(false);
    //
    // this.context.iceModel.elements["customer.details.verifyMobileFailure"].setSimpleValue(true);

    this.VerifyMobile();
  }


  VerifyMobile() {

    if (!this.smsSentSuccess) //is the value is false , that means that we have clicked the resend button , so we want to clear the messages
    {

      this.errorMsgVerifyMob = null;
      this.errorMsgVerifySms = null;
      this.context.iceModel.elements["customer.details.verifyMobileSuccess"].setSimpleValue(false);
      this.context.iceModel.elements["customer.details.mobilePhoneResendButtonFlag"].setSimpleValue(true); // then we change the value here and we start the action= 'actionResendChnageMobile' , and we wait for the next sms code
    }

    // subscribe to the element which keeps the return value from chnageMobile service
    this.context.iceModel.elements["customer.details.verifyMobileSuccess"].$dataModelValueChange.subscribe(
      (value: IndexedValue) => {


        if (value.element.getValue().forIndex(null)) {

          if (!this.smsSentSuccess) //the resend button has been clicked
          {
            //we change the value to the default value of the element
            this.context.iceModel.elements["customer.details.mobilePhoneResendButtonFlag"].setSimpleValue(false);
          }
          this.smsSentSuccess = true;
          this.showVerify = true;
          this.timeLeft = this.context.iceModel.elements["customer.details.smsTimeOut"].getValue().forIndex(null) as number;
          this.context.iceModel.elements["customer.details.hideMobileButton"].setSimpleValue(true);
          this.startTimer();
        }
        else {

        }
      }
    );

  }

  timerFinished() {
    this.errorMsgVerifyMob = "Ο χρόνος επαλήθευσης του κωδικου SMS έληξε";
    this.smsSentSuccess = false;
  }

  VerifySmsCode(event: any) {
    let smsCodeInt = +event.smsCode;

    if (smsCodeInt.toString().length === 6) {
      this.context.iceModel.elements["customer.details.smsCode"].setSimpleValue(smsCodeInt);// with the cahnge of value an action = 'actionChangeMobile',  is triggered

      this.context.$lifecycle.subscribe(
        (e: LifecycleEvent) => {

          const actionName = get(e, ['payload', 'action']);
          if (actionName.includes("actionVerifyChangeMobile")) {


            if (this.context.iceModel.elements["customer.details.verifySmsSuccess"].getValue().forIndex(null)) {
              this.context.iceModel.elements["customer.details.hideMobileButton"].setSimpleValue(true);
              this.successMsgMobileVerification = "Επιτυχής επαλήθευση";
              this.showVerify = false;
              this.showSuccess = true;
              this.context.iceModel.elements["customer.details.theEndMobileButtonValue"].setSimpleValue(true);


            }
            else // the user must type the sms code again this time right
            {
              this.smsSentSuccess = false;


              this.errorMsgVerifySms = "Παρακαλώ δοκιμάστε ξανά.";
            }
          }
        }
      );
    }


  }


  startTimer(): any {
    this.interval = Observable.timer(0, 1000)
      .take(this.timeLeft)
      .map(() => {
        if (this.timeLeft === 1) {
          //
          this.timeIsOff = true;
          this.timerFinished();
          return 0;
        } else {
          this.timeIsOff = false;
          return --this.timeLeft;
        }
      });
  }


  get imageSource() {
    return this.getIcon('AB7AD067ECBF48FFA0DEC42C9DC88E5B');
  }

  handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
    //
    svg.setAttribute('width', '10');
    svg.setAttribute('height', '18');
    return svg;
  }

  get imageSourceClock() {
    return this.getIcon('99105A3DB76C4494A235D3EEB13C54CD');
  }

  handleClockSVG(svg: SVGElement, parent: Element | null): SVGElement {
    //
    svg.setAttribute('width', '18');
    svg.setAttribute('height', '20');
    return svg;
  }

  getIcon(iconID: string): string {
    let icon = environment.sitecore_media + iconID + '.ashx';
    return icon;
  }

}

@Pipe({
  name: 'formatTimeForMobile'
})
export class FormatTimePipeForMobile implements PipeTransform {

  transform(value: number): string {
    const minutes: number = Math.floor((value % 3600) / 60);
    return ('00' + minutes).slice(-2) + ':' + ('00' + Math.floor(value - minutes * 60)).slice(-2);
  }
}
