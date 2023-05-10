import { errorList } from './../../page/sign-up-new/errorList';
import { environment } from './../../../../environments/environment';
import { SectionComponentImplementation, IceSectionComponent,IcePrincipalService } from '@impeo/ng-ice';
import { Component } from '@angular/core';
import { LifecycleEvent } from '@impeo/ice-core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../../services/modal.service';
import { get } from 'lodash';

@Component({
  selector: 'app-change-password-fields',
  templateUrl: './change-password-fields.component.html',
  styleUrls: ['./change-password-fields.component.scss']
})
export class ChangePasswordFieldComponent extends SectionComponentImplementation {

  constructor(private icePrincipalService: IcePrincipalService, parent: IceSectionComponent, public ngbModal: NgbModal, public modalService: ModalService) {
    super(parent);
  }

  showPassword: boolean;
  showNewPassword: boolean;
  showConfirmPassword: boolean;
  passwordStrength: Array<string> = ['low', 'medium', 'high'];
  isPasswordPassedRules: boolean = false;
  currentStrength: string;
  password: string;
  newpassword: string;
  confirmpassword: string;
  isPasswordConfirmed: boolean = true;
  errMsgPasswordMatch: string = 'Οι κωδικοί δεν ταιριάζουν';
  confirmPassword: string;
  passwordStrendthColor: number;
  errorMsg: string;
  showError: boolean = false;

  title = 'sections.changePassword.title.label';
  currentPassword = 'sections.changePassword.currentPassword.label';
  newPassword = 'sections.changePassword.newPassword.label';
  confirmPasswordd = 'sections.changePassword.confirmPasswordd.label';
  changePasswordPasswordText = 'sections.changePassword.changePasswordPasswordText.label';
  changePasswordPasswordText2 = 'sections.changePassword.changePasswordPasswordText2.label';
  newPasswordText = 'sections.changePassword.newPasswordText.label';
  newPasswordText2 = 'sections.changePassword.newPasswordText2.label';
  confirmPasswordText = 'sections.changePassword.confirmPasswordText.label';
  confirmPasswordText2 = 'sections.changePassword.confirmPasswordText2.label';
  changePassword = 'sections.changePassword.changePass.label';

  ngOnInit() {
    this.context.$lifecycle.subscribe((e: LifecycleEvent) => {

      const actionName = get(e, ['payload', 'action']);


      if (actionName.includes('actionChangePassword') &&  e.type === 'ACTION_FINISHED') {
        let response = this.context.iceModel.elements["changePasswordError"].getValue().values[0].value;
        this.checkCurrentPass(response);
        // let data1 = this.context.iceModel.elements["changePasswordResult"].getValue().forIndex(null);
        // console.log(data1);
      }
    })
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


  onShowPassword(show: boolean) {
    this.showPassword = show;
  }

  onShowNewPassword(show: boolean) {
    this.showNewPassword = show;
  }

  onShowConfirmPassword(show: boolean) {
    this.showConfirmPassword = show;
  }

  setpasswordvalue(newpassword: string, currentpassword: string) {
    this.context.iceModel.elements['customer.changePassword'].setSimpleValue(null);
    this.context.iceModel.elements['customer.details.username'].setSimpleValue(this.icePrincipalService.principal.id);
    this.context.iceModel.elements['customer.details.newPassword'].setSimpleValue(newpassword);
    this.context.iceModel.elements['customer.details.currentPassword'].setSimpleValue(currentpassword);
    this.context.iceModel.elements['customer.changePassword'].setSimpleValue(1);


    // this.context.iceModel.elements['customer.details.newPassword'].setSimpleValue(newpassword);
    // this.context.iceModel.elements['customer.details.currentPassword'].setSimpleValue(currentpassword);
  }

  checkPasswordMatchConfirm() {

    this.errMsgPasswordMatch = '';
    this.isPasswordConfirmed = false;
    if (this.newpassword == this.confirmpassword) {
      this.isPasswordConfirmed = true;
    } else {
      this.errMsgPasswordMatch = 'Οι κωδικοί δεν ταιριάζουν'
    }
  }

  checkCurrentPass(resp: any) {
    this.errorMsg = '';
    if (this.context.iceModel.elements["changePasswordResult"].getValue().forIndex(null)) {
      this.ngbModal.dismissAll();
      this.showError = false;
    }
    else {
      this.errorMsg = errorList[resp];
      this.showError = true;
    }
  }

  checkPasswordMatchRegex() {
    this.isPasswordPassedRules = false;
    this.currentStrength = '';
    if (this.newpassword.match(/(((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[A-Z])(?=.*[~!@#$%^&*()_\-+=}{\[\]\/|;:'"<>,.?]))|((?=.*[a-z])(?=.*[0-9])(?=.*[~!@#$%^&*()_\-+=}{\[\]\/|;:'"<>,.?]))|((?=.*[0-9])(?=.*[A-Z])(?=.*[~!@#$%^&*()_\-+=}{\[\]\/|;:'"<>,.?]))).{8,}/)) {
      this.currentStrength = this.passwordStrength[2];
      this.passwordStrendthColor = 2;
      this.isPasswordPassedRules = true;
    } else if (this.newpassword.match(/(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[0-9])(?=.*[a-z]))|((?=.*[0-9])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[~!@#$%^&*()_\-+=}{\[\]\/|;:'"<>,.?]))|((?=.*[A-Z])(?=.*[~!@#$%^&*()_\-+=}{\[\]\/|;:'"<>,.?]))|((?=.*[0-9])(?=.*[~!@#$%^&*()_\-+=}{\[\]\/|;:'"<>,.?]))).{8,}/)) {
      this.currentStrength = this.passwordStrength[1];
      this.passwordStrendthColor = 1;
      this.isPasswordPassedRules = false;
    } else if (this.newpassword.match(/(?=.*[a-z]|[A-Z]|[~!@#$%^&*()_\-+=}{\[\]\/|;:'"<>,.?]|[0-9]).{4,}/)) {
      this.currentStrength = this.passwordStrength[0];
      this.passwordStrendthColor = 0;
      this.isPasswordPassedRules = false;
    }
  }

  handleEyeSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('style', 'display: block; margin: auto;');
    svg.setAttribute('width', '20');
    svg.setAttribute('height', '16');

    return svg;
  }

  getIcon(iconID: string): string {
    let icon = environment.sitecore_media + iconID + '.ashx';
    return icon;
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
}
