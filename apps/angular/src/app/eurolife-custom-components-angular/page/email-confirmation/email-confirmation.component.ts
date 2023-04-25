import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { DemoPageComponent, IcePrincipalService, PageComponentImplementation } from "@impeo/ng-ice";
import { IndexedValue } from '@impeo/ice-core';

@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.component.html',
  styleUrls: ['./email-confirmation.component.scss']
})


/*
This page is apperared when the user click the confirmation link in his new email
 */
export class EmailConfirmationComponent extends PageComponentImplementation {

  success: boolean = false;

  mail: string;

  text1 = 'pages.emailConfirmation.text1.label';
  text2 = 'pages.emailConfirmation.text2.label';
  text3 = 'pages.emailConfirmation.text3.label';

  constructor(private router: Router, private route: ActivatedRoute, ) {
    super();
  }


  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      params.get("EmailVerified");
      this.context.iceModel.elements["customer.details.ChangeEmailCode"].setSimpleValue(params.get("EmailVerified"));
      this.context.iceModel.elements["customer.details.confirmationEmail"].setSimpleValue(true);
    });

    this.mail = this.context.iceModel.elements["customer.details.Email"].getValue().forIndex(null);
    this.context.iceModel.elements["customer.details.VerifyChangeEmailSuccess"].$dataModelValueChange.subscribe(
      (value: IndexedValue) => {
        if (value.element.getValue().forIndex(null)) //confirmation about email changed
        {
          this.context.iceModel.elements["customer.details.confirmationEmail"].setSimpleValue(false);
        }
        else {
        }
      }
    )
  }


}
