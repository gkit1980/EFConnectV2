import { Component, OnInit } from '@angular/core';
import { PageComponentImplementation } from '@impeo/ng-ice';

@Component({
  selector: 'confirmation-page',
  templateUrl: './confirmation-page.component.html'
})
export class ConfirmationPageComponent extends PageComponentImplementation implements OnInit {
  static componentName = 'ConfirmationPage';
}
