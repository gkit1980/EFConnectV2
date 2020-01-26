import { Component } from '@angular/core';
import { IceButtonComponent } from '@impeo/ng-ice';

@Component({
  selector: 'dummy-button',
  templateUrl: './dummy-button.component.html'
})
export class DummyButtonComponent extends IceButtonComponent {
  static componentName = 'DummyButtonComponent';
}
