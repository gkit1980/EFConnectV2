import { Component } from '@angular/core';
import { IceArrayComponent } from '@impeo/ng-ice';
import * as template from 'es6-template-strings';

@Component({
  selector: 'insis-array-tooltip',
  templateUrl: './insis-array-tooltip.component.html',
})
export class InsisArrayTooltipComponent extends IceArrayComponent {
  static componentName = 'InsisArrayTooltip';

  showTooltip = false;

  get showFirst(): number {
    return this.getRecipeParam('showFirst', 1);
  }

  get dynamicLabel(): string {
    const dynamicLabel = this.getRecipeParam('dynamicLabel', null)
      ? this.resource.resolve(this.getRecipeParam('dynamicLabel'))
      : null;
    return template(dynamicLabel, { param1: this.getItems().length });
  }

  get signpostLabelKey(): string | null {
    return this.getRecipeParam('signpostLabelKey', null)
      ? this.resource.resolve(this.getRecipeParam('signpostLabelKey'))
      : null;
  }

  get templateId(): string {
    return this.getRecipeParam('templateId', 'default');
  }

  get getTemplate() {
    return this.getRecipeParam(
      'items',
      this.itemElements().map(({ name }) => name)
    );
  }

  outsideClick(event) {
    const { target } = event;
    // TODO: We should find a better way of preventing buttons being clicked when they are inside tooltip
    const containMatButton = [...target.classList].some((className) =>
      className.includes('mat-button')
    );
    if (!containMatButton) {
      this.showTooltip = false;
    }
  }
}
