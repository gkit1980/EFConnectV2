import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ForgetUsernameService } from '@insis-portal/services/forget-username.service';
import { FormControl, Validators } from '@angular/forms';
import { TermsConditionsComponent } from "../../components//terms-conditions/terms-conditions.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { RecapchaService } from '@insis-portal/services/recapcha.service';
import { errorList } from './../../components/sign-up-new/errorList';
import { CookieDeclarationComponent } from "../../components/cookie-declaration/cookie-declaration.component";


@Component({
  selector: 'forgot-username',
  templateUrl: './forgot-username.component.html',
  styleUrls: ['./forgot-username.component.scss'],
})
export class ForgotUsernameComponent implements OnInit {

  LOGO = 'https://scp.eurolife.gr/~/media/2DD9AC1C9B4E4CF48DCF613E5E1224FB.ashx';
  eurolife = 'pages.forgotUsername.eurolife.label';
  title = 'pages.forgotUsername.title.label';
  usernameText = 'pages.forgotUsername.usernameText.label';
  terms = 'pages.forgotUsername.terms.label';
  copyright = 'pages.forgotUsername.copyright.label';
  vatR = 'pages.forgotUsername.vatR.label';
  vatText = 'pages.forgotUsername.vatText.label';
  birthDateR = 'pages.forgotUsername.birthDateR.label';
  dayR = 'pages.forgotUsername.dayR.label';
  monthR = 'pages.forgotUsername.monthR.label';
  yearR = 'pages.forgotUsername.yearR.label';
  next = 'pages.forgotUsername.next.label';
  cancel = 'pages.forgotUsername.cancel.label';
  returnLogin = 'pages.forgotUsername.returnLogin.label';
  vatError = 'pages.forgotUsername.vatError.label';
  oroiXrishs = 'portal.login.oroiXrishs.label';
  prostasiadedomenwn = 'app.footer.prostasiadedomenwn.label';
  politikicookies = 'app.footer.politikicookies.label';

  success: boolean = false;
  errorMsg: string;
  successMsg: string = '';

  vatNo: string;
  birthDate: string;
  day: string;
  month: string;
  year: string;
  gotBirthDate: boolean = false;
  gotVatNo: boolean = false;
  regexp: RegExp = undefined;
  validateRegex: boolean = false;
  vatno = new FormControl("", [Validators.required]);

  days: Array<any> = [];
  months: Array<any> = [
    { value: '01', viewValue: 'Ιανουάριος' },
    { value: '02', viewValue: 'Φεβρουάριος' },
    { value: '03', viewValue: 'Μάρτιος' },
    { value: '04', viewValue: 'Απρίλιος' },
    { value: '05', viewValue: 'Μάιος' },
    { value: '06', viewValue: 'Ιούνιος' },
    { value: '07', viewValue: 'Ιούλιος' },
    { value: '08', viewValue: 'Αύγουστος' },
    { value: '09', viewValue: 'Σεπτέμβριος' },
    { value: '10', viewValue: 'Οκτώβριος' },
    { value: '11', viewValue: 'Νοέμβριος' },
    { value: '12', viewValue: 'Δεκέμβριος' }
  ];

  years: Array<any> = [];

  constructor(private forgetUsernameService: ForgetUsernameService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private recaptchaV3Service: ReCaptchaV3Service,
    private recapchaService: RecapchaService) {

    var d = new Date();
    let year = d.getFullYear()
    let j = 0;
    for (let i = year; i >= 1940; i--) {
      this.years.push(i);
      j++;
      if (j < 32) {
        this.days.push(j);
      }
    }
  }

  openDialog() {
    this.modalService.open(TermsConditionsComponent, { windowClass: 'xlModal' });
  }

  openDialogLegal() {
    window.open("https://www.eurolife.gr/prosopika-dedomena/ekseidikeumeni-enimerosi-ana-etaireia-kai-epeksergasia/" , "_blank");
  }

  ngOnInit(): void {
    // var acceptButton = document.getElementsByClassName("optanon-allow-all")[0];
    // var saveSettingButton = document.getElementsByClassName("optanon-white-button-middle")[0];
    // var allowAllButton = document.getElementsByClassName("optanon-white-button-middle")[1];

    // acceptButton.addEventListener('click', function(){
    //   location.reload()
    // });


    // allowAllButton.addEventListener('click', function(){
    //   location.reload()
    // });

    // saveSettingButton.addEventListener('click', function(){
    //   location.reload()
    // });
  }

  onOptionChange() {
    if (this.day != null && this.month != null && this.year != null) {

      this.gotBirthDate = true;
    }
  }

  cookieClick() {
    this.modalService.open(CookieDeclarationComponent, { windowClass: 'xlModal' });
    // document.getElementById('cookie-btn').click();
  }

  onVatChange() {
    this.regexp = this.regexp = new RegExp('^[0-9]{9}$');
    this.validateRegex = this.regexp.test(this.vatNo);
    if (this.validateRegex) {
      this.gotVatNo = true;
    }
    else {
      this.gotVatNo = false;
    }
  }

  executeForgotUserNameAction(): void {
    this.onSubmit();
    this.recaptchaV3Service.execute('forgotUserNameAction')
      .subscribe((token) => {
        this.recapchaService.recapchaValidation(token).subscribe((response: any) => {
          if (response.success) {
            if (response.score > 0.55) {
            } else {
              // this.router.navigate(["/login"])
            }
          } else {
            // this.router.navigate(["/login"])
          }
        })
      });
  }

  onSubmit() {
    this.errorMsg = ''
    this.birthDate = this.month + "/" + this.day.toString() + "/" + this.year.toString()
    this.success = false;
    var date = new Date(this.birthDate)
    this.forgetUsernameService.getUserName(this.vatNo, this.birthDate).subscribe((res: any) => {


      if (res.Success) {
        this.success = res.Success;
        this.successMsg = "Το username σας είναι " + res.UserName;
      } else {
        this.errorMsg = errorList[res.Errors[0].ErrorCode];
      }
    })
  }

  onCancelClick() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  get imageSource() {
    return 'https://scp.eurolife.gr/~/media/44B30F2D7E43462F8F82E832A481E10C.ashx';
  }
}
