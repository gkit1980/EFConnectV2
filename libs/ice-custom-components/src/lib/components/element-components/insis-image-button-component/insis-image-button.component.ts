import { MaterialElementComponentImplementation, IceButtonComponent } from '@impeo/ng-ice';
import { Component } from '@angular/core';

@Component({
  selector: 'insis-image-button',
  templateUrl: './insis-image-button.component.html',
})
export class InsisImageButtonComponent extends IceButtonComponent {
  static componentName = 'InsisImageButton';

  get imageContent() {
    return this.label;
  }

  //
  //
  onClick(): void {
    this.onComponentValueChange();

    if (this.element.type === 'action') {
      const action = this.element.iceModel.actions[this.getElementValue()];
      if (action) action.execute({ index: this.index });
    }
  }
}
