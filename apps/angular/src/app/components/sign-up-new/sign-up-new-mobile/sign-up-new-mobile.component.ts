import { environment } from '@insis-portal/environments/environment';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SignupService } from '@insis-portal/services/signup.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { errorList } from '../errorList';
import { LocalStorageService } from '@insis-portal/services/local-storage.service';
import { Observable } from 'rxjs/Rx';
import { TermsConditionsComponent } from '../../terms-conditions/terms-conditions.component';

import { ModalService } from '@insis-portal/services/modal.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CookieDeclarationComponent } from '../../../components/cookie-declaration/cookie-declaration.component';

@Component({
  selector: 'app-sign-up-new-mobile',
  templateUrl: './sign-up-new-mobile.component.html',
  styleUrls: ['./sign-up-new-mobile.component.scss'],
})
export class SignUpNewMobileComponent implements OnInit {
  state: string = 'inactive';
  emailValid: boolean = false;
  mobileCodeValid: boolean = false;
  errorMsgMail: string;
  errorMsgRegCode: string;
  mailVerified: boolean = false;
  isLinkExpired: boolean = false;
  mail: string;
  regCode: string;
  showPassword: boolean;
  mobileNo: number;
  errorMsgVerifyMobile: string;
  visible: boolean = true;

  SIGNUP_LOGO = 'https://scp.eurolife.gr/~/media/2DD9AC1C9B4E4CF48DCF613E5E1224FB.ashx';


  timer: any;

  @ViewChild('mobileInput') mobileInput: ElementRef;

  basicElements = 'pages.signup.basic.basicElements.label';
  // infoResendEmail = "pages.signup.basic.infoResendEmail.label";

  emailText = 'pages.signup.basic.emailText.label';
  uniqueEntryPassword = 'pages.signup.basic.uniqueEntryPassword.text.label';
  registration = 'pages.signup.basic.registration.label';
  next = 'pages.signup.basic.next.label';
  cancel = 'pages.signup.basic.cancel.label';

  submitEmail = 'pages.signup.basic.submitEmail.label';
  signin = 'pages.signup.updated.signin.label';
  numberOfMobile2 = 'pages.signup.mobile.numberOfMobile2.label';
  ohNo = 'pages.signup.create.ohNo.label';
  problem = 'pages.signup.create.problem.label';
  connection = 'pages.signup.create.connection.label';
  ok = 'pages.signup.create.ok.label';
  oroiXrishs = 'portal.login.oroiXrishs.label';
  copyright = 'portal.login.copyright.label';
  prostasiadedomenwn = 'app.footer.prostasiadedomenwn.label';
  politikicookies = 'app.footer.politikicookies.label';

  timeLeft: number;

  ///createaccount?EmailVerified=63b00000-bfde-11d3-b852-290676ece2d7&Email=gkit1980@yahoo.com&RegCode=100101010
  //http://localhost:4200/#/createaccount?EmailVerified=73bb7a85-7e89-42da-aa4f-c4578c04a1ed&Email=gkit1980@gmail.com&RegistrationCode=1000943811

  constructor(
    private router: Router,
    private signupService: SignupService,
    public dialog: MatDialog,
    private localStorage: LocalStorageService,
    private route: ActivatedRoute,
    private ngbModal: NgbModal,
    private modalService: ModalService
  ) {}

  ngOnInit() {



    this.route.queryParamMap.subscribe((params) => {
      this.signupService.storedMail = params.get('Email');
      this.signupService.storedRegCode = params.get('RegistrationCode');
      this.signupService.storedEmailCode = params.get('EmailVerified');

      this.signupService.verifyEmail(params.get('EmailVerified')).subscribe((res: any) => {
        if (res.Success) {
          this.visible = false;
          this.mailVerified = true;
          this.timer = setInterval(() => {
            if (!!this.mobileInput.nativeElement) {
              Observable.fromEvent(this.mobileInput.nativeElement, 'keyup')
                .map((evt: any) => evt.target.value)
                .debounceTime(500)
                .subscribe((text: string) => this.checkMobileNo());

              clearInterval(this.timer);
            }
          }, 1000);
        } else {
          if (res.Errors[0].ErrorCode === 22) {
            // ErrorCode(22) confirmation mail expiration
            this.isLinkExpired = true;
          }
          this.visible = false;
          this.mailVerified = false;
        }
      });
    });
  }

  checkMobileNo() {
    if (this.mobileNo.toString().match(/^\d{10}$/)) this.VerifyMobile();
    else return;
  }

  VerifyMobile() {
    this.errorMsgVerifyMobile = '';
    if (this.mobileNo) {
      this.signupService.setstoredMobile(this.mobileNo);
      this.signupService
        .verifyMobile(
          this.mobileNo.toString(),
          this.signupService.storedMail,
          this.signupService.storedRegCode.toString()
        )
        .subscribe((res: any) => {
          if (res.Success) {
            this.mobileCodeValid = true;
            this.emailValid = true;
            this.timeLeft = res.SMSTimeOut;
            this.signupService.setTimeForClock(this.timeLeft);
            //  this.startTimer();
            //  this.showVerify = true;
            //  this.smsSentSuccess = res.Sucess;
          } else {
            this.errorMsgVerifyMobile = errorList[res.Errors[0].ErrorCode];
          }
        });
    }
  }

  gotitClick() {
    this.router.navigate(['login']);
  }

  onSubmit() {
    this.signupService.setStepperState(0, 'done');
    this.signupService.setstoredMobile(this.mobileNo);
    this.localStorage.setDataToLocalStorage('mail', this.signupService.storedMail);
    this.localStorage.setDataToLocalStorage('regCode', this.signupService.storedRegCode.toString());
    this.signupService.setStageProtection(2);
    this.router.navigate(['/signupform/smsvalidation'], {});
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
    return this.getIcon('0B8BF05BD9C54878807163B1050D5AF3');
  }

  handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block;');
    svg.setAttribute('width', '18');
    svg.setAttribute('height', '18');

    return svg;
  }

  getIcon(iconID: string): string {
    let icon = environment.sitecore_media + iconID + '.ashx';
    return icon;
  }

  handleEyeSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block; margin: auto;');
    svg.setAttribute('width', '20');
    svg.setAttribute('height', '16');

    return svg;
  }

  ngAfterViewInit() {
    this.signupService.setStepperState(0, "active");
    this.signupService.setStepperState(1, "inactive");
    this.signupService.setStepperState(2, "inactive");
  }

  openDialog() {
    let modalRef: NgbModalRef;
    this.modalService.ismodalOpened();
    modalRef = this.ngbModal.open(TermsConditionsComponent, { windowClass: 'xlModal' });
    modalRef.result.then(
      () => {
        console.log('When user closes');
      },
      () => {
        this.modalService.isModalClosed();
      }
    );
  }

  openDialogLegal() {
    window.open("https://www.eurolife.gr/prosopika-dedomena/ekseidikeumeni-enimerosi-ana-etaireia-kai-epeksergasia/" , "_blank");
    // let modalRef: NgbModalRef;
    // this.modalService.ismodalOpened();
    // modalRef = this.ngbModal.open(LegalPopupComponent, { windowClass: 'xlModal' });
    // modalRef.result.then(
    //   () => {
    //     console.log('When user closes');
    //   },
    //   () => {
    //     this.modalService.isModalClosed();
    //   }
    // );
  }

  cookieClick() {
    let modalRef: NgbModalRef;
    this.modalService.ismodalOpened();
    modalRef = this.ngbModal.open(CookieDeclarationComponent, { windowClass: 'xlModal' });
    modalRef.result.then(
      () => {
        console.log('When user closes');
      },
      () => {
        this.modalService.isModalClosed();
      }
    );
  }


}
