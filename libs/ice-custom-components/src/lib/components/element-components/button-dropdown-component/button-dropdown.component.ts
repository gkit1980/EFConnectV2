import { MaterialSelectComponentImplementation } from '@impeo/ng-ice';
import { Component } from '@angular/core';

@Component({
  selector: 'button-dropdown',
  templateUrl: './button-dropdown.component.html'
})
export class ButtonDropdownComponent extends MaterialSelectComponentImplementation {
  static componentName = 'ButtonDropdown';

  get src() {
    const iconName = this.element.textRule.getText('icon', null, this.index);
    return iconName ? `/assets/icons/${iconName}` : null;
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
