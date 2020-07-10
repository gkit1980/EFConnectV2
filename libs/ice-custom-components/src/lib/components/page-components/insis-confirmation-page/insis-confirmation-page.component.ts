import { Component, OnInit } from '@angular/core';
import { PageComponentImplementation } from '@impeo/ng-ice';
import { get } from 'lodash';

@Component({
  selector: 'insis-confirmation-page',
  templateUrl: './insis-confirmation-page.component.html',
})
export class InsisConfirmationPageComponent extends PageComponentImplementation implements OnInit {
  static componentName = 'InsisConfirmationPage';

  product: string;

  ngOnInit() {
    super.ngOnInit();
    this.product = get(
      this.recipe,
      ['component', InsisConfirmationPageComponent.componentName, 'product'],
      'motor'
    );
  }
}
