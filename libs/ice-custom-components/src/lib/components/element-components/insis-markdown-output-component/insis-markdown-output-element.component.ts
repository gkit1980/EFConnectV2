import { Component } from '@angular/core';
import { MaterialElementComponentImplementation } from '@impeo/ng-ice';

@Component({
  selector: 'insis-markdown-output-element',
  templateUrl: './insis-markdown-output-element.component.html',
})
export class InsisMarkdownOutputElementComponent extends MaterialElementComponentImplementation {
  static componentName = 'InsisMarkdownOutputElement';

  get text() {
    const label = this.element.labelRule.getLabel([0]);
    return this.value ? `${label} ${this.value}` : `${label}`;
  }
}
