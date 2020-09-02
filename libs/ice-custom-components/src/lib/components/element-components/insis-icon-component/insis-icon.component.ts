import { Component, OnInit } from '@angular/core';
import { SelectComponentImplementation } from '@impeo/ng-ice';
import { IceConsole, ItemElement } from '@impeo/ice-core';

@Component({
  selector: 'insis-icon',
  templateUrl: './insis-icon.component.html',
})
export class InsisIconComponent extends SelectComponentImplementation implements OnInit {
  static componentName = 'InsisIcon';

  get showLabel() {
    return this.getRecipeParam('showLabel', false);
  }

  get iconLabel() {
    if (this.options.length === 0) {
      return this.label;
    } else {
      return this.textValue;
    }
  }

  get iconValue(): string | null {
    if (this.options.length === 0) {
      return this.value;
    }

    const element = <ItemElement>this.element;
    const iconAdditional = element.valuesRule.getAdditionalValue(this.value, 'icon');
    if (iconAdditional) return iconAdditional;
    return null;
  }
}
