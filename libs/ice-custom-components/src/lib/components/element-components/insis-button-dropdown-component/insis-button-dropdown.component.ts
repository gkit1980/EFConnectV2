import { MaterialSelectComponentImplementation } from '@impeo/ng-ice';
import { Component } from '@angular/core';

@Component({
  selector: 'insis-button-dropdown',
  templateUrl: './insis-button-dropdown.component.html',
})
export class InsisButtonDropdownComponent extends MaterialSelectComponentImplementation {
  static componentName = 'InsisButtonDropdown';

  get src() {
    const iconName = this.element.textRule.getText('icon', null, this.index);
    return iconName ? `/assets/icons/${iconName}` : null;
  }
  get accesskey() {
    return this.getRecipeParam('accesskey', null);
  }

  //
  //
  onClick(value: any): void {
    this.setComponentValue(value);
    this.onComponentValueChange();

    if (this.element.element.type === 'action') {
      const action = this.element.element.iceModel.actions[this.getElementValue()];
      if (action) action.execute({ index: this.index });
    }
  }
}
