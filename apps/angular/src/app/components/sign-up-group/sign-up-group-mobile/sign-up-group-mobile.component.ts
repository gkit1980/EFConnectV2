import { environment } from '@insis-portal/environments/environment';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SignupGroupService } from '@insis-portal/services/signupgroup.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { errorList } from '../errorList';
import { LocalStorageService } from '@insis-portal/services/local-storage.service';
import { Observable } from 'rxjs/Rx';
import { TermsConditionsComponent } from '../../terms-conditions/terms-conditions.component';
import { ModalService } from '@insis-portal/services/modal.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CookieDeclarationComponent } from '../../cookie-declaration/cookie-declaration.component';
import { FormControl, Validators, NgForm } from '@angular/forms';

@Component({
  selector: 'app-sign-up-group-mobile',
  templateUrl: './sign-up-group-mobile.component.html',
  styleUrls: ['./sign-up-group-mobile.component.scss'],
})
export class SignUpGroupMobileComponent implements OnInit {

  //state: string = 'inactive';
  emailValid: boolean = false;
  mobileCodeValid: boolean = false;
  errorMsgMail: string;
  errorMsgRegCode: string;
  visible: boolean = true;
  mailVerified: boolean = false;
  gotmobileNo: boolean = false;

  isLinkExpired: boolean = false;
  mail: string;
  regCode: string;
  showPassword: boolean;
  mobileNo: number;
  landlineNo: number;
  errorMsgVerifyMobile: string;
  timer: any;
  companyName: string;
  regexp: RegExp = undefined;
  validateRegex: boolean = false;
  contractKey:string;


  SIGNUP_LOGO = 'https://scp.eurolife.gr/~/media/2DD9AC1C9B4E4CF48DCF613E5E1224FB.ashx';


  @ViewChild('mobileInput') mobileInput: ElementRef;

  basicElements = 'pages.signup.basic.basicElements.label';
  // infoResendEmail = "pages.signup.basic.infoResendEmail.label";

  emailText = 'pages.signup.basic.emailText.label';
  uniqueEntryPassword = 'pages.signup.basic.uniqueEntryPassword.text.label';
  registration = 'pages.signup.basic.registration.label';
  next = 'pages.signup.basic.next.label';
  cancel = 'pages.signup.basic.cancel.label';

  submitEmail = 'pages.signup.basic.submitEmail.label';
  signingroup = 'pages.signup.updated.signingroup.label';
  numberOfMobile2 = 'pages.signup.mobile.numberOfMobile2.label';
  numberOfMobileError = 'pages.signup.mobile.numberOfMobileError.label';
  numberOfHome = 'pages.signup.mobile.numberOfHome.label';
  numberOfHomeError = 'pages.signup.mobile.numberOfHomeError.label';

  mobileNumber= new FormControl("", [Validators.required]);
  landlineNumber = new FormControl("", [Validators.required]);

  ohNo = 'pages.signup.create.ohNo.label';
  problem = 'pages.signup.create.problem.label';
  connection = 'pages.signup.create.connection.label';
  ok = 'pages.signup.create.ok.label';
  oroiXrishs = 'portal.login.oroiXrishs.label';
  copyright = 'portal.login.copyright.label';
  prostasiadedomenwn = 'app.footer.prostasiadedomenwn.label';
  politikicookies = 'app.footer.politikicookies.label';

  timeLeft: number;

  constructor(
    private router: Router,
    private signupGroupService: SignupGroupService,
    public dialog: MatDialog,
    private localStorage: LocalStorageService,
    private route: ActivatedRoute,
    private ngbModal: NgbModal,
    private modalService: ModalService
  ) {}

  ngOnInit() {

    this.signupGroupService.setStageProtection(1);
    this.companyName = this.signupGroupService.storedCompanyName;
    this.contractKey = this.signupGroupService.storedKivosCode.substring(3, 13);


  }

  checkMobileNo() {
    if (this.mobileNo != undefined) {
      this.regexp = new RegExp('^69[0-9]{8}');
      this.validateRegex = this.regexp.test(this.mobileNo.toString());
      if (this.validateRegex) {
        this.VerifyMobile();
      }
      else {
        this.gotmobileNo = false;
      }
    }

  }


  gotitClick() {
    this.router.navigate(['login']);
  }

  VerifyMobile() {
    this.errorMsgVerifyMobile = '';
    if (this.mobileNo) {
      this.signupGroupService.setstoredMobile(this.mobileNo);
      this.signupGroupService
        .verifyMobile(
          this.mobileNo.toString(),
          this.signupGroupService.storedMail,
          this.signupGroupService.storedRegistrationCode.toString()
        )
        .subscribe((res: any) => {
          if (res.Success) {
            this.mobileCodeValid = true;
            this.emailValid = true;
            this.gotmobileNo = true;
            this.timeLeft = res.SMSTimeOut;
            this.signupGroupService.setTimeForClock(this.timeLeft);

          } else {
            this.errorMsgVerifyMobile = errorList[res.Errors[0].ErrorCode];
          }
        });
    }
  }


  onSubmit() {

    this.signupGroupService.setstoredMobile(this.mobileNo);
    if (this.landlineNo != undefined){
      this.signupGroupService.setStoredLandline(this.landlineNo);
    }else{
      this.signupGroupService.setStoredLandline(null);
    }
    this.router.navigate(['/groupform/smsvalidation'], {});
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
