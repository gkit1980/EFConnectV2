import { environment } from '@insis-portal/environments/environment';
import { Component, OnInit } from '@angular/core';
import { SignupService } from '@insis-portal/services/signup.service';
import { errorList } from '../errorList';
import { LocalStorageService } from '@insis-portal/services/local-storage.service';
import { Observable } from 'rxjs/Rx';
import { timer } from 'rxjs';
import { scan, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-sign-up-new-confirmation',
  templateUrl: './sign-up-new-confirmation.component.html',
  styleUrls: ['./sign-up-new-confirmation.component.scss']
})
export class SignUpNewConfirmationComponent implements OnInit {


  text1 = 'pages.signup.confirmation.text1.label';
  text2 = 'pages.signup.confirmation.text2.label';
  text3 = 'pages.signup.confirmation.text3.label';
  text3_1 = 'pages.signup.confirmation.text3_1.label';
  text4 = 'pages.signup.confirmation.text4.label';

  email: string;
  interval: any;
  showSpinnerBtn: boolean=false;


  constructor(private signupService: SignupService, private localStorage: LocalStorageService) {

  }

  ngOnInit() {

    this.signupService.setStepperState(0, 'done');
    this.email = this.signupService.storedMail;
    this.startTimer();
  }


  startTimer(): any {
      this.interval = this.signupService.storedInterval;
  }

  get imageSource() {
    return this.getIcon('E027B38563E04D55B5AF8C3CFE1FD948');
  }

  handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('width', '88');
    svg.setAttribute('height', '88');
    return svg;
  }

  get imageSourceClock() {
    return this.getIcon('99105A3DB76C4494A235D3EEB13C54CD');
  }

  handleClockSVG(svg: SVGElement, parent: Element | null): SVGElement {
    //
    svg.setAttribute('width', '25');
    svg.setAttribute('height', '25');
    return svg;
  }

  get imageSourceNotification() {
    return this.getIcon('981D16C6FE5447429742308B97C23613');
  }

  handleNotificationSVG(svg: SVGElement, parent: Element | null): SVGElement {
    //
    svg.setAttribute('width', '24');
    svg.setAttribute('height', '24');
    return svg;
  }

  getIcon(iconID: string): string {
    let icon = environment.sitecore_media + iconID + '.ashx';
    return icon;
  }

  ResendEmail()
  {
    this.showSpinnerBtn=true;
    this.signupService.initSignUp(this.signupService.storedRegCode.toString(), this.signupService.storedMail).subscribe((res: any) => {
        if (res.Success) {
          this.signupService.setTimeForClock(1200);
          this.startTimer();
          this.showSpinnerBtn=false;
        }
      });
  }



}
