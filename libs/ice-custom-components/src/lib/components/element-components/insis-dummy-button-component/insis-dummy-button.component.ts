import { Component } from '@angular/core';
import { IceButtonComponent } from '@impeo/ng-ice';

@Component({
  selector: 'insis-dummy-button',
  templateUrl: './insis-dummy-button.component.html',
})
export class InsisDummyButtonComponent extends IceButtonComponent {
  static componentName = 'InsisDummyButtonComponent';
}
