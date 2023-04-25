import { TermsConditionsComponent } from '../../terms-conditions/terms-conditions.component';
import { LegalPopupComponent } from '../../legal-popup/legal-popup.component';
import { environment } from '../../../../../environments/environment';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SignupGroupService } from '../../../../services/signupgroup.service';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../../../services/local-storage.service';
import { DemoPageComponent} from "@impeo/ng-ice";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SignUpGroupConsentsModalComponent } from '../../sign-up-group-consents-modal/sign-up-group-consents-modal.component';

@Component({
  selector: 'app-sign-up-group-final-form',
  templateUrl: './sign-up-group-final-form.component.html',
  styleUrls: ['./sign-up-group-final-form.component.scss']
})
export class SignUpGroupFinalFormComponent  extends DemoPageComponent {

  @ViewChild('f') slForm: NgForm;
  SIGNUP_LOGO = 'https://scp.eurolife.gr/~/media/2DD9AC1C9B4E4CF48DCF613E5E1224FB.ashx';

  //state: string = 'inactive';
  success: boolean = false;
  password: string;
  confirmPassword: string;
  passwordStrengthStage: number; //1:low 2:high 3:very high
  isPasswordPassedRules: boolean = false;
  isPasswordConfirmed: boolean = true;
  passwordStrength: Array<string> = ['low', 'medium', 'high'];
  currentStrength: string;
  mail: string;
  regCode: number;
  showPassword: boolean;
  checkPrivacy: boolean = false;
  checkTerms: boolean = false;
  errMsgService: string;
  errMsgPasswordMatch: string = 'Οι κωδικοί δεν ταιριάζουν';
  mailVerified: boolean = false;
  serverError: boolean;
  gotPasswordConfirm: boolean = false;

  regexp: RegExp = undefined;
  validateRegex: boolean = false;

  passwordStrendthColor: number;
  isLinkExpired: boolean = false;
  showDaf = false;
  showSpinnerBtn = false;

  eurolife = 'pages.signup.create.eurolife.label';
  step = 'pages.signup.create.step.label';
  terms1 = 'pages.signup.create.terms1.label';
  terms2 = 'pages.signup.create.terms2.label';
  terms3 = 'pages.signup.create.terms3.label';
  privacy1 = 'pages.signup.create.privacy1.label';
  privacy2 = 'pages.signup.create.privacy2.label';
  enableRegistration1 = 'pages.signup.create.enableRegistration1.label';
  enableRegistration2 = 'pages.signup.create.enableRegistration2.label';
  myEurolife = 'pages.signup.create.myEurolife.label';
  ohNo = 'pages.signup.create.ohNo.label';
  problem = 'pages.signup.create.problem.label';
  connection = 'pages.signup.create.connection.label';
  ok = 'pages.signup.create.ok.label';
  signupCreatePasswordNewSignUpGroup = 'pages.signup.create.signupCreatePasswordNewSignUpGroup.label';
  signupCreatePasswordConfirmSignUpGroup = 'pages.signup.create.signupCreatePasswordConfirmSignUpGroup.label';
  signupCreateConfirmPasswordText2 = 'pages.signup.create.signupCreateConfirmPasswordText2.label';

  companyName: string;
  contractKey: string;

  basicElements = "pages.signup.basic.basicElements.label";
  next = "pages.signup.basic.next.label";
  cancel = "pages.signup.basic.cancel.label";
  signin = 'pages.signup.updated.signin.label';


  constructor(private router: Router, private signupGroupService: SignupGroupService,
    private localStorage: LocalStorageService,
    private modalService: NgbModal) {
    super();
  }

  ngOnInit() {

    this.signupGroupService.setStageProtection(3);
    this.companyName = this.signupGroupService.storedCompanyName;
    this.contractKey = this.signupGroupService.storedKivosCode.substring(3, 13);

  }


  checkPasswordMatchRegex() {

    this.isPasswordPassedRules = false;
    this.currentStrength = '';
    if (this.password.match(/(((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[A-Z])(?=.*[~!@#$%^&*()_\-+=}{\[\]\/|;:'"<>,.?]))|((?=.*[a-z])(?=.*[0-9])(?=.*[~!@#$%^&*()_\-+=}{\[\]\/|;:'"<>,.?]))|((?=.*[0-9])(?=.*[A-Z])(?=.*[~!@#$%^&*()_\-+=}{\[\]\/|;:'"<>,.?]))).{8,}/)) {
      this.currentStrength = this.passwordStrength[2];
      this.passwordStrendthColor = 2;
      this.isPasswordPassedRules = true;
    } else if (this.password.match(/(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[0-9])(?=.*[a-z]))|((?=.*[0-9])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[~!@#$%^&*()_\-+=}{\[\]\/|;:'"<>,.?]))|((?=.*[A-Z])(?=.*[~!@#$%^&*()_\-+=}{\[\]\/|;:'"<>,.?]))|((?=.*[0-9])(?=.*[~!@#$%^&*()_\-+=}{\[\]\/|;:'"<>,.?]))).{8,}/)) {
      this.currentStrength = this.passwordStrength[1];
      this.passwordStrendthColor = 1;
      this.isPasswordPassedRules = false;
    } else if (this.password.match(/(?=.*[a-z]|[A-Z]|[~!@#$%^&*()_\-+=}{\[\]\/|;:'"<>,.?]|[0-9]).{4,}/)) {
      this.currentStrength = this.passwordStrength[0];
      this.passwordStrendthColor = 0;
      this.isPasswordPassedRules = false;
    }
  }

  onShowPassword(show: boolean) {
    this.showPassword = show;
  }

  checkPasswordMatchConfirm() {

    this.errMsgPasswordMatch = '';
    this.isPasswordConfirmed = false;
    if (this.password == this.confirmPassword) {
      this.isPasswordConfirmed = true;
      this.gotPasswordConfirm = true;
    } else {
      this.errMsgPasswordMatch = 'Οι κωδικοί δεν ταιριάζουν';
      this.gotPasswordConfirm = false;
    }

  }

  getStrengthColor(index: number) {
    if (this.currentStrength == 'low' && index == 0) {
      return 'low'
    } else if (this.currentStrength == 'medium' && index <= 1) {
      return 'medium'
    } else if (this.currentStrength == 'high' && index <= 2) {
      return 'high'
    }
  }

  getStrengthColorText(index: number) {
    if (this.currentStrength == 'low' && index == 0) {
      return 'lowText'
    } else if (this.currentStrength == 'medium' && index <= 1) {
      return 'mediumText'
    } else if (this.currentStrength == 'high' && index <= 2) {
      return 'highText'
    }
  }

  getStrengthText(i: any){
    if (i === 'low' || i === 'medium'){
      return 'Μη αποδεκτό'
    }else if ( i === 'high') {
      return 'Αποδεκτό'
    }
  }

  checkBoxHandle(event: any) {
    if (event.target.id === 'privacy') {
      this.checkPrivacy = event.target.checked;
    } else if (event.target.id === 'terms') {
      this.checkTerms = event.target.checked;
    }
  }

  onSubmit() {
    this.consentsDialogLegal();
    this.signupGroupService.setstoredPassword(this.password);
  }

  get imageSource() {
    return this.getIcon('44B30F2D7E43462F8F82E832A481E10C');
  }

  get imageSourceIcon() {
    return this.getIcon('0B8BF05BD9C54878807163B1050D5AF3');
  }



  handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
    //
    svg.setAttribute('width', '52');
    svg.setAttribute('height', '64');
    return svg;
  }

  getIcon(iconID: string): string {
    let icon = environment.sitecore_media + iconID + '.ashx';
    return icon;
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

  handleSVGInfo(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block;');
    svg.setAttribute('width', '18');
    svg.setAttribute('height', '18');

    return svg;
  }

  ngOnDestroy(): void {
    this.localStorage.clearFromLocalStorage();
  }

  gotitClick() {
    this.router.navigate(['\login'])
  }

  handleEyeSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block; margin: auto;');
    svg.setAttribute('width', '20');
    svg.setAttribute('height', '16');

    return svg;
  }


  openTermsDialog() {
    this.modalService.open(TermsConditionsComponent, { windowClass: 'xlModal' });
  }

  openDialogLegal() {
    this.modalService.open(LegalPopupComponent, { windowClass: 'xlModal' });
  }

  consentsDialogLegal() {
    this.modalService.open(SignUpGroupConsentsModalComponent, {
    windowClass: 'xlModal',
    backdrop : 'static',
    keyboard : false});
  }




}
