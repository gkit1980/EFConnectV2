import { SectionComponentImplementation, IceSectionComponent } from '@impeo/ng-ice';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import * as _ from 'lodash';
 import { LocalStorageService } from '@insis-portal/services/local-storage.service';

@Component({
  selector: 'app-sign-up-card',
  templateUrl: './sign-up-card.component.html',
  styleUrls: ['./sign-up-card.component.scss']
})



export class SignUpCardComponent extends SectionComponentImplementation {
  email = new FormControl('', [Validators.required, Validators.email]);
  items: any[] = [];

  constructor(parent: IceSectionComponent, private service: LocalStorageService) {
    super(parent);
  }

  ngOnInit() {
     this.service.clearFromLocalStorage();

  }

  getErrorMessage() {
    return 'Το email Υπάρχει ήδη';
  }
  emailExists(): any {
    return this.context.iceModel.elements['signup.EmailExists'].getValue().values[0].value;
  }
  getRegistrationCode(): any {
    return this.context.iceModel.elements['signup.registrationCode'].getValue().values[0].value;
  }
  getInitSignupStatus(): any {
    if (this.context.iceModel.elements['signup.initSignupStatus'].getValue().values[0].value == true) {
      //return this.context.gotoToPage('signupsuccessfully');
      this.context.iceModel.elements["signup.initSignupStatusNumber"].setSimpleValue(1);
    } else {
      this.context.iceModel.elements["signup.initSignupStatusNumber"].setSimpleValue(0);
    }
  }
  getEmail(): any {

      return this.context.iceModel.elements['signup.email'].getValue().values[0].value;
  }


  setEmailToLocalStorage(): void {
    this.service.storeOnLocalStorage(this.context.iceModel.elements['signup.email'].getValue().values[0].value);
  }
  getEmailFromLocalStorage(): any {
    return this.service.getFromLocalStorage();
  }





}
