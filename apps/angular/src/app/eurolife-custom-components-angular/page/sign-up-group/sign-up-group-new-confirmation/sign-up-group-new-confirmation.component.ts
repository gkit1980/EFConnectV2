import { environment } from '../../../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { errorList } from '../errorList';
import { LocalStorageService } from '../../../../services/local-storage.service';
import { Observable } from 'rxjs/Rx';
import { timer } from 'rxjs';
import { scan, takeWhile } from 'rxjs/operators';
import { SignupGroupService } from '../../../../services/signupgroup.service';

@Component({
  selector: 'app-sign-up-group-new-confirmation',
  templateUrl: './sign-up-group-new-confirmation.component.html',
  styleUrls: ['./sign-up-group-new-confirmation.component.scss']
})
export class SignUpGroupNewConfirmationComponent implements OnInit {


  text1 = 'pages.signup.confirmation.text1.label';
  text2 = 'pages.signup.confirmation.text2.label';
  text3 = 'pages.signup.confirmation.text3.label';
  text3_1 = 'pages.signup.confirmation.text3_1.label';
  text4 = 'pages.signup.confirmation.text4.label';

  email: string;
  companyName: string;
  interval: any;
  showSpinnerBtn: boolean=false;
  contractKey:string;


  constructor( private localStorage: LocalStorageService,private signupGroupService: SignupGroupService) {

  }

  ngOnInit() {
   
    //this.signupGroupService.setStepperState(1, 'done');
    this.email = this.signupGroupService.storedMail;
    this.companyName = this.signupGroupService.storedCompanyName;
    this.contractKey = this.signupGroupService.storedKivosCode.substring(3, 13);
    this.startTimer();
  }

  
  startTimer(): any {
      this.interval = this.signupGroupService.storedInterval;
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
    this.signupGroupService.InitSignUpGroup(this.signupGroupService.storedKivosCode, this.signupGroupService.storedMail,this.signupGroupService.storedCompanyName.toString()).subscribe((res: any) => { 
        if (res.SsignupGroupServiceuccess) {
          this.signupGroupService.setTimeForClock(1200);
          this.startTimer();
          this.showSpinnerBtn=false;
        } 
      });
  }



}
