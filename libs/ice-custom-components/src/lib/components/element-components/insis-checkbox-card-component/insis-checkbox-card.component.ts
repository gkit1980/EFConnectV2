import { Component } from '@angular/core';
import { MaterialElementComponentImplementation } from '@impeo/ng-ice';

@Component({
  selector: 'insis-checkbox-card',
  templateUrl: './insis-checkbox-card.component.html',
})
export class InsisCheckboxCardComponent extends MaterialElementComponentImplementation {
  static componentName = 'InsisCheckboxCard';

  //
  //
  onChange(): void {
    this.value = !this.value;
    this.onComponentValueChange();
  }

  get description() {
    return this.element.textRule.getText('description', null, this.index);
  }
  get src() {
    return `/assets/icons/${this.element.textRule.getText('icon', null, this.index)}`;
  }
}
