import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ForgetPasswordService } from '@insis-portal/services/forget-password.service';
import { environment } from '@insis-portal/environments/environment';
import { errorList } from '../sign-up-new/errorList'


@Component({
    selector: 'forgot-password-reset',
    templateUrl: './forgot-password-reset.component.html',
    styleUrls: ['./forgot-password-reset.component.scss'],
})
export class ForgotPasswordResetComponent implements OnInit {

    eurolife = 'pages.forgotPasswordReset.eurolife.label';
    title = 'pages.forgotPasswordReset.title.label';
    forgotPasswordResetfFllInEmail = 'pages.forgotPasswordReset.forgotPasswordResetfFllInEmail.label';
    terms = 'pages.forgotPasswordReset.terms.label';
    copyright = 'pages.forgotPasswordReset.copyright.label';
    newPasswordR = 'pages.forgotPasswordReset.newPassword.label';
    newPasswordText = 'pages.forgotPasswordReset.newPasswordText.label';
    newPasswordText2 = 'pages.forgotPasswordReset.newPasswordText2.label';
    newPasswordConfirm = 'pages.forgotPasswordReset.newPasswordConfirm.label';
    newPasswordConfirmText = 'pages.forgotPasswordReset.newPasswordConfirmText.label';
    next = 'pages.forgotPasswordReset.next.label';
    cancel = 'pages.forgotPasswordReset.cancel.label';
    returnLogin = 'pages.forgotPasswordReset.returnLogin.label';

    success: boolean = false;
    errorMsg: string;
    successMsg: string;

    verifyPasswordCode: string;
    newPassword: string;

    passwordStrengthStage: number; //1:low 2:high 3:very high
    isPasswordPassedRules: boolean = false;
    isPasswordConfirmed: boolean = true;
    passwordStrength: Array<string> = ['low', 'medium', 'high'];
    currentStrength: string;
    password: string
    showPassword: boolean;
    errMsgPasswordMatch: string = 'Οι κωδικοί δεν ταιριάζουν';
    confirmPassword: string;
    passwordStrendthColor: number;


    constructor(private forgetPasswordService: ForgetPasswordService, private router: Router, private route: ActivatedRoute) {

    }

    ngOnInit(): void {
        this.route.queryParamMap.subscribe(params => {
            this.verifyPasswordCode = params.get("forgetpassword");
        });
    }

    onSubmit() {

        this.success = false;
        console.log("this.verifyPasswordCode: " + this.verifyPasswordCode);
        console.log("this.password: " + this.password);
        this.forgetPasswordService.verifyForgetPassword(this.verifyPasswordCode, this.password).subscribe((res: any) => {
            if (res.Success) {
                this.success = res.Success;
                this.successMsg = "Ο κωδικός σας άλλαξε με επιτυχία.";
            } else {
                this.errorMsg = errorList[res.Errors[0].ErrorCode];
            }
        })
    }

    onCancelClick() {
        this.router.navigate(['../../'], { relativeTo: this.route });
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

    getStrengthText(i: any) {
        if (i === 'low' || i === 'medium') {
            return 'Μη αποδεκτό'
        } else if (i === 'high') {
            return 'Αποδεκτό'
        }
    }

    checkPasswordMatchRegex() {
        // this.isPasswordPassedRules = false;
        // if ( this.password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)){
        //   this.isPasswordPassedRules = true;
        // }
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
        } else {
            this.errMsgPasswordMatch = 'Οι κωδικοί δεν ταιριάζουν';
        }
    }


    get imageSource() {
        return 'https://scp.eurolife.gr/~/media/44B30F2D7E43462F8F82E832A481E10C.ashx';
    }

    handleEyeSVG(svg: SVGElement, parent: Element | null): SVGElement {
        svg.setAttribute('style', 'display: block; margin: auto;');
        svg.setAttribute('width', '20');
        svg.setAttribute('height', '16');

        return svg;
    }

    handleSVGInfo(svg: SVGElement, parent: Element | null): SVGElement {
        svg.setAttribute('style', 'display: block;');
        svg.setAttribute('width', '18');
        svg.setAttribute('height', '18');

        return svg;
    }

    get imageSourceIcon() {
        return this.getIcon('0B8BF05BD9C54878807163B1050D5AF3');
    }

    getIcon(iconID: string): string {
        let icon = environment.sitecore_media + iconID + '.ashx';
        return icon;
    }

}
