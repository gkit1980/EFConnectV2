import { environment } from "@insis-portal/environments/environment";
import { Component, OnInit,ViewChild } from "@angular/core";
import { SignupService } from "@insis-portal/services/signup.service";
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
  selector: 'app-sign-up-new-validate-sms',
  templateUrl: './sign-up-new-validate-sms.component.html',
  styleUrls: ['./sign-up-new-validate-sms.component.scss']
})
export class SignUpNewValidateSmsComponent implements OnInit {




  state: string = "inactive";
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

  basicElements = "pages.signup.basic.basicElements.label";
  // infoResendEmail = "pages.signup.basic.infoResendEmail.label";

  emailText = "pages.signup.basic.emailText.label";
  uniqueEntryPassword = "pages.signup.basic.uniqueEntryPassword.text.label";
  registration = "pages.signup.basic.registration.label";
  next = "pages.signup.basic.next.label";
  cancel = "pages.signup.basic.cancel.label";

  submitEmail = "pages.signup.basic.submitEmail.label";
  signin = 'pages.signup.updated.signin.label';
  numberOfMobile2 = 'pages.signup.mobile.numberOfMobile2.label';
  resend = 'pages.signup.mobile.resend.label';

  eventsSubject: Subject<void> = new Subject<void>();






  constructor(
    private router: Router,
    private signupService: SignupService,
    public dialog: MatDialog,
    private localStorage: LocalStorageService,
    private ngbModal: NgbModal,
    private modalService: ModalService,
    private recaptchaV3Service: ReCaptchaV3Service,
    private recapchaService: RecapchaService,
    private route: ActivatedRoute
  ) {}


  ngOnInit() {
    this.interval=this.signupService.storedInterval;
    this.mobileNo=this.signupService.storedMobile;

  }

  emitEventToChild() {
    this.eventsSubject.next();
  }

  executeSignupFormAction(serviceToBeCalled: string): void {
    var mailValidator = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (serviceToBeCalled === "checkRegCode" && this.regCode.toString().length === 10)
    {
   //** */   this.callCheckRegCode();
      this.recaptchaV3Service.execute("signupFormAction").subscribe(token => {
        this.recapchaService
          .recapchaValidation(token)
          .subscribe((response: any) => {
            if (response.success) {
              if (response.score > 0.55) {
              } else {
                // this.router.navigate(["/login"])
              }
            } else {
              // this.router.navigate(["/login"])
            }
          });
      });
    }
    if (serviceToBeCalled === "checkMail") {
      this.emailValid = false;
    }

    if (serviceToBeCalled === "checkMail" && mailValidator.test(this.mail.toLowerCase()))
    {
   //** */   this.checkEmail();
      this.recaptchaV3Service.execute("signupFormAction").subscribe(token => {
        this.recapchaService
          .recapchaValidation(token)
          .subscribe((response: any) => {
            if (response.success) {
              if (response.score > 0.55) {
              } else {
                // this.router.navigate(["/login"])
              }
            } else {
              // this.router.navigate(["/login"])
            }
          });
      });
    }
  }

  onBack() {

    this.router.navigate(["/createaccount"], {
      queryParams: {
        EmailVerified: this.signupService.storedEmailCode,
        Email : this.signupService.storedMail,
        RegistrationCode: this.signupService.storedRegCode
      }
    });

  }

  checkMobileNo() {

    if (this.mobileNo) {
      return this.mobileNo.toString().match(/^\d{10}$/);
    }
    return false;
  }

  VerifyMobile() {
    this.emitEventToChild();
    this.errorMsgVerifyMobile = '';
    if (this.mobileNo) {
      this.signupService.setstoredMobile(this.mobileNo);
      this.signupService.verifyMobile(this.mobileNo.toString(), this.signupService.storedMail, this.signupService.storedRegCode.toString()).subscribe((res: any) => {
        if (res.Success) {
             this.timeLeft = res.SMSTimeOut;
             this.signupService.setTimeForClock(this.timeLeft);
             this.interval=this.signupService.storedInterval;
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
      this.signupService.verifySMS(smsCodeInt, this.signupService.storedMail, this.signupService.storedRegCode.toString()).subscribe((res: any) => {
        this.verifiedUser = res.Success;
        if (!res.Success) {
          this.errorMsgSmsCode = errorList[res.Errors[0].ErrorCode];
        }
        else
        {
          this.signupService.setStageProtection(3);
          this.router.navigate(["/signupform/finalizeaccount"], {});
        }
      })
    }

  }



  // Error Message for the Email
  getEmailErrorMessage() {
    return 0;
  }

  // Error Message for the Passsword
  getRegCodeErrorMessage() {
    return 0;
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


  ngAfterViewInit()
  {
    this.signupService.setStepperState(0, "done");
    this.signupService.setStepperState(1, "active");
  }


}
