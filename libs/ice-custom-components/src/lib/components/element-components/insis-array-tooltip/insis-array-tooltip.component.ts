import { Component } from '@angular/core';
import { IceArrayComponent } from '@impeo/ng-ice';
import * as template from 'es6-template-strings';

@Component({
  selector: 'insis-array-tooltip',
  templateUrl: './insis-array-tooltip.component.html'
})
export class InsisArrayTooltipComponent extends IceArrayComponent {
  static componentName = 'InsisArrayTooltip';

  showTooltip = false;

  get showFirst(): number {
    return this.getRecipeParam('showFirst', 1);
  }

  get dynamicLabel(): string {
    const dynamicLabel = this.element.textRule.getText('dynamic-label', null, this.index);
    return template(dynamicLabel, { param1: this.getItems().length });
  }

  get getTemplate() {
    return this.getRecipeParam('items', this.itemElements().map(({ name }) => name));
  }

  outsideClick(event) {
    const { target } = event;
    // TODO: We should find a better way of preventing buttons being clicked when they are inside tooltip
    const containMatButton = [...target.classList].some(className =>
      className.includes('mat-button')
    );
    if (!containMatButton) {
      this.showTooltip = false;
    }
  }
}
