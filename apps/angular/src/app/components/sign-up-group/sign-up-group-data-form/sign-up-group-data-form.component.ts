import { ConsentsComponent } from  '../../consents/consents.component';
import { environment } from '@insis-portal/environments/environment';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, NgForm } from '@angular/forms';
import { SignupGroupService } from '@insis-portal/services/signupgroup.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from '@insis-portal/services/local-storage.service';

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";



@Component({
  selector: 'app-sign-up-group-group-data-form',
  templateUrl: './sign-up-group-data-form.component.html',
  styleUrls: ['./sign-up-group-data-form.component.scss']
})
export class SignUpGroupDataFormComponent implements OnInit {

  @ViewChild('f') slForm: NgForm;
  SIGNUP_LOGO = 'https://scp.eurolife.gr/~/media/2DD9AC1C9B4E4CF48DCF613E5E1224FB.ashx';
  success: boolean = false;

  nameValue: string;
  surnameValue: string;
  fathernameValue: string;
  birtdateValue: any;
  vatNo: string;
  ibanValue: string;
  genderValue: number;
  consentYes: boolean;
  infoText: string = 'show';
  radioOptions: string = 'checked';
  policyholderName: string ;
  companyName: string;
  contractKey:any;
  groupRegCode:string;
  codeLength:any;


  errMsgService: string;

  serverError: boolean;
  gotVatNo: boolean = false;
  gotName: boolean = false;
  gotSurname: boolean = false;
  gotFathername: boolean = false;
  gotDate: boolean = false;
  gotIban: boolean = false;
  gotGender: boolean = false;
  gotCheckConsent: boolean = false;
  regexp: RegExp = undefined;
  validateRegex: boolean = false;

  isLinkExpired: boolean = false;
  showDaf = false;
  showSpinnerBtn = false;

  male: string = 'male';
  female: string = 'female';

  visible: boolean = true;
  mailVerified: boolean = false;
  timer: any;
  mobileCodeValid: boolean = false;
  formattedBrirthDate : any;

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

  vatno = new FormControl("", [Validators.required]);
  namevalue = new FormControl("", [Validators.required]);
  surnamevalue = new FormControl("", [Validators.required]);
  fathernamevalue = new FormControl("", [Validators.required]);
  birthDatevalue = new FormControl("", [Validators.required]);
  ibanvalue = new FormControl("", [Validators.required]);
  gendervalue = new FormControl("", [Validators.required]);
  consentYesvalue = new FormControl("", [Validators.required]);


  nameText = 'pages.signup.create.nameText.label';
  surnameText = 'pages.signup.create.surnameText.label';
  fathernameText = 'pages.signup.create.fathernameText.label';
  birthDateText = 'pages.signup.create.birthDateText.label';
  vatText = 'pages.signup.create.vatText.label';
  ibanText = 'pages.signup.create.ibanText.label';
  gender = 'sections.signupGroupPopup.groupCodeRegister.gender.label';

  nameError = 'pages.signup.create.nameError.label';
  surnameError = 'pages.signup.create.surnameError.label';
  fathernameError = 'pages.signup.create.fathernameError.label';
  birthdateError = 'pages.signup.create.birthdateError.label';
  vatError = 'pages.signup.create.vatError.label';
  ibanError = 'pages.signup.create.ibanError.label';



  basicElements = "pages.signup.basic.basicElements.label";
  next = "pages.signup.basic.next.label";
  cancel = "pages.signup.basic.cancel.label";
  signin = 'pages.signup.updated.signin.label';


  constructor(private router: Router, private signupGroupService: SignupGroupService, private route: ActivatedRoute,
    private localStorage: LocalStorageService,
    private modalService: NgbModal) {

  }

  ngOnInit() {
    this.signupGroupService.setStageProtection(0);

    this.route.queryParamMap.subscribe((params) => {
      this.signupGroupService.storedMail = params.get('Email');
      this.signupGroupService.storedKivosCode = params.get('KivosCode');
      this.signupGroupService.storedEmailCode = params.get('EmailVerified');
      this.signupGroupService.storedCompanyName = params.get('CompanyName');
      this.signupGroupService.storedRegistrationCode = params.get('RegistrationCode');

      this.companyName = this.signupGroupService.storedCompanyName;
      this.contractKey = this.signupGroupService.storedKivosCode.substring(3, 13);




      this.signupGroupService.verifyEmail(params.get('EmailVerified')).subscribe((res: any) => {
        if (res.Success) {
          this.visible = false;
          this.mailVerified = true;
          //this.timer = setInterval(() => { }, 1000);
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

  onGenderChecked() {
    if (this.genderValue != undefined) {
      this.gotGender = true;
    } else {
      this.gotGender = false;
    }
  }
  onConsentChange() {
    if (this.consentYes != undefined) {
      this.gotCheckConsent = true;
    } else {
      this.gotCheckConsent = false;
    }
  }
  onNameChange() {
    if (this.nameValue != undefined) {
      this.gotName = true;
    } else {
      this.gotName = false;
    }
  }
  onSurnameChange() {
    if (this.surnameValue != undefined) {
      this.gotSurname = true;
    } else {
      this.gotSurname = false;
    }
  }
  onFathernameChange() {
    if (this.fathernameValue != undefined) {
      this.gotFathername = true;
    } else {
      this.gotFathername = false;
    }
  }

  onDateChange() {

    if (this.birtdateValue != undefined) {

      let splitBirthDate = this.birtdateValue.split("/");
      let oldBrithDate = new Date (splitBirthDate[2], splitBirthDate[1]-1,splitBirthDate[0]);
      var yyyy = oldBrithDate.getFullYear().toString();
      var mm= oldBrithDate.getMonth()+1;
      var dd = oldBrithDate.getDate();

      let mm_str='';
      let dd_str='';

      ///convertion month of the year to string format
      if(mm<10 )
      mm_str='0'+mm.toString();
      else
       mm_str=mm.toString();
      //end

      if(dd<10)
      dd_str='0'+dd.toString();
      else
      dd_str=dd.toString();


      this.formattedBrirthDate = yyyy + "-" + mm_str + "-" + dd_str;

      this.gotDate = true;
    } else {
      this.gotDate = false;
    }

  }
  onVatChange() {

    if (this.vatNo != undefined) {
      this.regexp = new RegExp('^[0-9]{9}$');
      this.validateRegex = this.regexp.test(this.vatNo.toString());
      if (this.validateRegex) {
        this.gotVatNo = true;
      }
      else {
        this.gotVatNo = false;
      }
    }
  }

  onIbanChange() {
    if (this.ibanValue != undefined) {
      this.regexp = new RegExp('^GR[0-9]{25}');
      this.validateRegex = this.regexp.test(this.ibanValue.toString());
      if (this.validateRegex) {
        this.gotIban = true;
      }
      else {
        this.gotIban = false;
      }
    }
  }

  onSubmit() {


    this.signupGroupService.setStoredName(this.nameValue);
    this.signupGroupService.setStoredSurname(this.surnameValue);
    this.signupGroupService.setStoredFathername(this.fathernameValue);
    this.signupGroupService.setStoredBirthdate(this.formattedBrirthDate);
    this.signupGroupService.setStoredVatNo(this.vatNo.toString());
    this.signupGroupService.setStoredIbanNo(this.ibanValue);
    this.signupGroupService.setStoredGender(this.genderValue);
    this.router.navigate(['/groupform/confirmation'], {});
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

  openUpdateDialog() {
    //TODO need to be changed with the new content
    this.modalService.open(ConsentsComponent, { windowClass: 'xlModal' });
  }


  ShowDiv(value: string) {
    this.infoText = value;
  }



}
