import { Component, OnInit } from '@angular/core';
import { PageComponentImplementation } from '@impeo/ng-ice';

@Component({
  selector: 'insis-confirmation-page',
  templateUrl: './insis-confirmation-page.component.html',
})
export class InsisConfirmationPageComponent extends PageComponentImplementation implements OnInit {
  static componentName = 'InsisConfirmationPage';
}
