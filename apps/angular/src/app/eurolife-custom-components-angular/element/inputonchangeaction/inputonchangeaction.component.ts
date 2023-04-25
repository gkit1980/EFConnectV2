import { trimTrailingNulls } from '@angular/compiler/src/render3/view/util';
import { Component, OnInit } from '@angular/core';
import { ElementComponentImplementation } from '@impeo/ng-ice';
import * as _ from 'lodash';
import { timingSafeEqual } from 'crypto';

@Component({
  selector: 'app-inputonchangeaction',
  templateUrl: './inputonchangeaction.component.html',
  styleUrls: ['./inputonchangeaction.component.scss']
})
export class InputonchangeactionComponent extends ElementComponentImplementation implements OnInit {

  newEmail = 'elements.customer.details.newEmail.label';
  newMobile = 'elements.customer.details.MobilePhoneI.label';
  email: any;

  changeFlow: boolean;

  ngOnInit(): void {
    let myElementName = this.getComponentRecipe().elementName;
    if (myElementName === "myEmail") {
      this.changeFlow = false;
    }
    else {
      this.changeFlow = true;
    }
  }

  async onEmailChange(myinput: string) {
    let myElementName = this.getComponentRecipe().elementName;
    if (myElementName === "myEmail") {
      this.value = myinput;
      if (this.value) {
        let action = this.context.iceModel.actions['actionVerifyEmail'];
        if (action != null) {
          action.executionRules[0].execute();
          this.context.iceModel.elements["customer.details.newEmail"].setSimpleValue(myinput);

          if (this.context.iceModel.elements["customer.details.verifyEmailBoolean"].getValue().forIndex(null)) {
            let action2 = this.context.iceModel.actions['actionChangeEmail'];
            action.executionRules[0].execute();

          }

        }
      }
    }
    else {
      this.value = myinput;
      if (this.value) {
        let action = this.context.iceModel.actions['actionVerifyMobilePhone'];
        if (action != null) {
          action.executionRules[0].execute();
          this.context.iceModel.elements["customer.details.MobilePhoneI"].setSimpleValue(myinput);

          if (this.context.iceModel.elements["customer.details.VerifyMobilePhone"].getValue().forIndex(null)) {
            let action2 = this.context.iceModel.actions['actionChangeMobile'];
            action.executionRules[0].execute();
          }

        }
      }

    }

    // this.applyComponentValueToDataModel();

  }

  // protected getSupportedTypes(): string[] {
  //   return ['text'];
  // }


}



