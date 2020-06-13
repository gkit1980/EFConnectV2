import { Component } from '@angular/core';
import { MaterialElementComponentImplementation } from '@impeo/ng-ice';
import { IceClientRuntime } from '@impeo/ice-core';

@Component({
  selector: 'insis-card',
  templateUrl: './insis-card.component.html',
})
export class InsisCardComponent extends MaterialElementComponentImplementation {
  static componentName = 'InsisCard';

  get src() {
    return `/assets/icons/${this.element.textRule.getText('icon', null, this.index)}`;
  }

  get url() {
    const url: string = this.getRecipeParam('url');
    return url ? url : null;
  }

  onClick() {
    if (this.url) (this.context.runtime as IceClientRuntime).goToUrl(this.url);
  }
}
