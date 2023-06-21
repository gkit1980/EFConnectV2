import { environment } from '@insis-portal/environments/environment';
import { Component, OnInit, Pipe, PipeTransform, AfterContentInit } from '@angular/core';
import { Router } from '@angular/router';
import { SignupService } from '@insis-portal/services/signup.service'
import { Observable } from 'rxjs/Rx';
import { ElementComponentImplementation } from '@impeo/ng-ice';
import { IndexedValue,LifecycleEvent } from '@impeo/ice-core';
import { get } from 'lodash';

@Component({
  selector: 'app-insert-code-email-timer',
  templateUrl: './insert-code-email-timer.component.html',
  styleUrls: ['./insert-code-email-timer.component.css']
})
export class InsertCodeEmailTimerComponent extends ElementComponentImplementation implements OnInit {

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
  insertCodeEmailTimer = 'elements.insertCodeEmailTimer.label';

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
    this.context.iceModel.elements["customer.details.changeEmailSuccess"].setSimpleValue(false);
    this.context.iceModel.elements["customer.details.emailResendButtonFlag"].setSimpleValue(false);
    this.context.iceModel.elements["customer.details.theEndEmailButtonValue"].setSimpleValue(false);


    this.VerifyMobile();
  }


  VerifyMobile() {
    if (!this.smsSentSuccess) //is the value is false , that means that we have clicked the resend button , so we want to clear the messages
    {
      this.errorMsgVerifyMob = null;
      this.errorMsgVerifySms = null;
      this.context.iceModel.elements["customer.details.changeEmailSuccess"].setSimpleValue(false);
      this.context.iceModel.elements["customer.details.emailResendButtonFlag"].setSimpleValue(true); // then we change the value here and we start the action= 'actionResendChnageEmail' , and we wait for the next sms code
    }

    // subscribe to the element which keeps the return value from chnageEmail service
    this.context.iceModel.elements["customer.details.changeEmailSuccess"].$dataModelValueChange.subscribe(
      (value: IndexedValue) => {
        if (value.element.getValue().forIndex(null)) {
          if (!this.smsSentSuccess) //the resend button has been clicked
          {
            //we change the value to the default value of the element
            this.context.iceModel.elements["customer.details.emailResendButtonFlag"].setSimpleValue(false);
          }

          this.smsSentSuccess = true;
          this.showVerify = true;

          //it's late to take the value , so we subscribe until the new value comes and we start the times when the return value of Success is true
          this.context.iceModel.elements["customer.details.smsEmailTimeOut"].$dataModelValueChange.subscribe(
            (value: IndexedValue) => {
              if (this.context.iceModel.elements["customer.details.changeEmailSuccess"].getValue().forIndex(null)) {
                this.timeLeft = this.context.iceModel.elements["customer.details.smsEmailTimeOut"].getValue().forIndex(null) as number;
                this.context.iceModel.elements["customer.details.hideEmailButton"].setSimpleValue(true);
                this.startTimer();
              }
            }
          )

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
      this.context.iceModel.elements["customer.details.smsCodeEmail"].setSimpleValue(smsCodeInt);// with the change of value an action = 'actionVerifyChangeEmailSMS',  is triggered

      this.context.$lifecycle.subscribe(
        (e: LifecycleEvent) => {

          const actioName = get(e, ['payload', 'action']);


          if (actioName.includes("actionVerifyChangeEmailSMS") && e.type==='ACTION_FINISHED') {

            if (this.context.iceModel.elements["customer.details.verifySmsEmailSuccess"].getValue().forIndex(null)) {
              this.successMsgMobileVerification = "Σας στείλαμε email με οδηγίες στην νέα διεύθυνση " + this.context.iceModel.elements["customer.details.newEmail"].getValue().forIndex(null) as string + " Παρακαλούμε ανοίξτε το email σας και πατήστε το link επιβεβαίωσης.";
              this.showVerify = false;
              this.showSuccess = true;
              this.context.iceModel.elements["customer.details.theEndEmailButtonValue"].setSimpleValue(true);

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
          //console.log(this.timeLeft);
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
    // console.log('Loaded SVG: ', svg, parent);
    svg.setAttribute('width', '10');
    svg.setAttribute('height', '18');
    return svg;
  }

  get imageSourceClock() {
    return this.getIcon('99105A3DB76C4494A235D3EEB13C54CD');
  }

  handleClockSVG(svg: SVGElement, parent: Element | null): SVGElement {
    // console.log('Loaded SVG: ', svg, parent);
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
  name: 'FormatTimePipeForEmail'
})
export class FormatTimePipeForEmail implements PipeTransform {

  transform(value: number): string {
    const minutes: number = Math.floor((value % 3600) / 60);
    return ('00' + minutes).slice(-2) + ':' + ('00' + Math.floor(value - minutes * 60)).slice(-2);
  }
}
