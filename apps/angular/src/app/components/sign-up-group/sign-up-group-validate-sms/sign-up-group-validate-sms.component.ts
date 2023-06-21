import { environment } from "@insis-portal/environments/environment";
import { Component, OnInit,ViewChild } from "@angular/core";
import { SignupGroupService } from '@insis-portal/services/signupgroup.service';
import { Router, ActivatedRoute } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { errorList } from "../errorList";
import { LocalStorageService } from "@insis-portal/services/local-storage.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ModalService } from "@insis-portal/services/modal.service";
import { ReCaptchaV3Service } from "ng-recaptcha";
import { RecapchaService } from "@insis-portal/services/recapcha.service";
import { Subject } from "rxjs/Rx";

@Component({
  selector: 'app-sign-up-group-validate-sms',
  templateUrl: './sign-up-group-validate-sms.component.html',
  styleUrls: ['./sign-up-group-validate-sms.component.scss']
})
export class SignUpGroupValidateSmsComponent implements OnInit {

  emailValid: boolean = false;
  regCodeValid: boolean = false;
  errorMsgMail: string;
  errorMsgRegCode: string;
  mail: string;
  regCode: number;
  showPassword: boolean;
  mobileNo: number;
  errorMsgVerifyMobile: string;
  smsCode: number;
  timeLeft: number;
  interval: any;
  timeIsOff: boolean;
  smsSentSuccess: boolean;
  errorMsgSmsCode: string;
  verifiedUser: boolean = false;
  companyName: string;
  contractKey: string;

  basicElements = "pages.signup.basic.basicElements.label";
  // infoResendEmail = "pages.signup.basic.infoResendEmail.label";

  emailText = "pages.signup.basic.emailText.label";
  uniqueEntryPassword = "pages.signup.basic.uniqueEntryPassword.text.label";
  registration = "pages.signup.basic.registration.label";
  next = "pages.signup.basic.next.label";
  cancel = "pages.signup.basic.cancel.label";

  submitEmail = "pages.signup.basic.submitEmail.label";
  signingroup = 'pages.signup.updated.signingroup.label';
  numberOfMobile2 = 'pages.signup.mobile.numberOfMobile2.label';
  resend = 'pages.signup.mobile.resend.label';

  eventsSubject: Subject<void> = new Subject<void>();






  constructor(
    private router: Router,
    private signupGroupService: SignupGroupService,
    public dialog: MatDialog,
    private recaptchaV3Service: ReCaptchaV3Service,
    private recapchaService: RecapchaService
  ) {}


  ngOnInit() {

    this.signupGroupService.setStageProtection(2);

    this.interval=this.signupGroupService.storedInterval;
    this.mobileNo=this.signupGroupService.storedMobile;
    this.companyName = this.signupGroupService.storedCompanyName;
    this.contractKey = this.signupGroupService.storedKivosCode.substring(3, 13);

    // if(this.signupGroupService.storedMobile != null){
    //   this.VerifyMobile();
    // }

  }

  emitEventToChild() {
    this.eventsSubject.next();
  }

  onBack() {
    this.signupGroupService.setStageProtection(1);

    this.router.navigate(["/groupform/confirmation"], {
      queryParams: {
        EmailVerified: this.signupGroupService.storedEmailCode,
        Email : this.signupGroupService.storedMail,
        RegistrationCode: this.signupGroupService.storedRegistrationCode
      }
    });

  }

  checkMobileNo() {

    if (this.mobileNo) {
      return this.mobileNo.toString().match(/^69\d{8}$/);
    }
    return false;
  }

  VerifyMobile() {
    this.emitEventToChild();
    this.errorMsgVerifyMobile = '';
    if (this.mobileNo) {
      this.signupGroupService.setstoredMobile(this.mobileNo);
      this.signupGroupService.verifyMobile(this.mobileNo.toString(), this.signupGroupService.storedMail, this.signupGroupService.storedRegistrationCode).subscribe((res: any) => {
        if (res.Success) {
             this.timeLeft = res.SMSTimeOut;
             this.signupGroupService.setTimeForClock(this.timeLeft);
             this.interval=this.signupGroupService.storedInterval;
        } else {

          this.errorMsgVerifyMobile = errorList[res.Errors[0].ErrorCode];
        }

      })
    }
  }

  VerifySmsCode(event: any) {
    this.errorMsgSmsCode = '';
    let smsCodeInt = +event.smsCode;
    if (smsCodeInt.toString().length === 6){
      this.signupGroupService.verifySMS(smsCodeInt, this.signupGroupService.storedMail, this.signupGroupService.storedRegistrationCode).subscribe((res: any) => {
        this.verifiedUser = res.Success;
        if (!res.Success) {
          this.errorMsgSmsCode = errorList[res.Errors[0].ErrorCode];
        }
        else
        {
          this.router.navigate(["/groupform/finalizeaccount"], {});
        }
      })
    }

  }


  get imageSource() {
    return this.getIcon("0B8BF05BD9C54878807163B1050D5AF3");
  }

  handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute("style", "display: block;");
    svg.setAttribute("width", "18");
    svg.setAttribute("height", "18");

    return svg;
  }

  getIcon(iconID: string): string {
    let icon = environment.sitecore_media + iconID + ".ashx";
    return icon;
  }

  handleEyeSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute("style", "display: block; margin: auto;");
    svg.setAttribute("width", "20");
    svg.setAttribute("height", "16");

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


}
