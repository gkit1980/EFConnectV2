import { Component } from '@angular/core';
import { IceToogleComponent } from '@impeo/ng-ice';

@Component({
  selector: 'insis-button-toggle',
  templateUrl: './insis-button-toggle.component.html',
})
export class InsisButtonToggleComponent extends IceToogleComponent {
  static componentName = 'InsisButtonToggle';

  onClick() {
    this.value = !this.value;
    this.onComponentValueChange();
  }
}
