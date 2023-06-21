import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ForgetPasswordService } from '@insis-portal/services/forget-password.service';
import { FormControl, Validators } from '@angular/forms';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { RecapchaService } from '@insis-portal/services/recapcha.service';
import { errorList } from '../sign-up-new/errorList';


@Component({
  selector: 'forgot-password-recovery',
  templateUrl: './forgot-password-recovery.component.html',
  styleUrls: ['./forgot-password-recovery.component.scss'],
})
export class ForgotPasswordRecoveryComponent implements OnInit {

  title = 'pages.forgotPasswordRecovery.title.label';
  forgotPasswordRecoveryFillInEmail = 'pages.forgotPasswordRecovery.forgotPasswordRecoveryFillInEmail.text.label';
  emailR = 'pages.forgotPasswordRecovery.email.label';
  emailText = 'pages.forgotPasswordRecovery.emailText.label';
  next = 'pages.forgotPasswordRecovery.next.label';
  cancel = 'pages.forgotPasswordRecovery.cancel.label';
  returnLogin = 'pages.forgotPasswordRecovery.returnLogin.label';
  emailError = 'pages.forgotPasswordRecovery.emailError.label';

  success: boolean = false;
  errorMsg: string;
  successMsg: string = '';

  Email: string;
  regexp: RegExp = undefined;
  validateRegex: boolean = false;
  gotEmail: boolean = false;
  email = new FormControl("", [Validators.required]);


  constructor(private forgetPasswordService: ForgetPasswordService,
    private router: Router,
    private route: ActivatedRoute,
    private recaptchaV3Service: ReCaptchaV3Service,
    private recapchaService: RecapchaService) {

  }

  ngOnInit(): void {

  }

  executeForgotPasswordAction(): void {
    this.onSubmit();
    this.recaptchaV3Service.execute('forgotPasswordAction')
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

    this.success = false;

    this.forgetPasswordService.forgetPassword(this.Email).subscribe((res: any) => {
      if (res.Success) {
        this.success = res.Success;
        this.successMsg = 'pages.forgotPasswordRecovery.successMsg.label';
      } else {
        this.errorMsg = errorList[res.Errors[0].ErrorCode];
      }
    })
  }

  onCancelClick() {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }

  onEmailChange() {
    this.regexp = this.regexp = new RegExp("^[a-zA-Z0-9.!#$%&' * +/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$");
    this.validateRegex = this.regexp.test(this.Email);
    if (this.validateRegex) {
      this.gotEmail = true;
    }
    else {
      this.gotEmail = false;
    }
  }

  get imageSource() {
    return 'https://scp.eurolife.gr/~/media/44B30F2D7E43462F8F82E832A481E10C.ashx';
  }
}
