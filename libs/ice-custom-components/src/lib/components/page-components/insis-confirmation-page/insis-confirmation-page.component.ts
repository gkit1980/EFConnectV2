import { Component, OnInit } from '@angular/core';
import { PageComponentImplementation } from '@impeo/ng-ice';
import { get } from 'lodash';
import { Router } from '@angular/router';

@Component({
  selector: 'insis-confirmation-page',
  templateUrl: './insis-confirmation-page.component.html',
})
export class InsisConfirmationPageComponent extends PageComponentImplementation implements OnInit {
  static componentName = 'InsisConfirmationPage';

  product: string;

  constructor(private router: Router) {
    super();
  }

  navigateToPolicyDetails() {
    const policyNumber = this.context.dataModel.getValue('policy.contract.policy-number');
    const role = this.context.principal.data.role;
    const policyDetailsLink = `${policyNumber}/ice/insis.products.policy-details.${role}/summary`;
    this.router.navigate([policyDetailsLink]);
  }

  ngOnInit() {
    super.ngOnInit();
    this.product = get(
      this.recipe,
      ['component', InsisConfirmationPageComponent.componentName, 'product'],
      'motor'
    );
  }
}
