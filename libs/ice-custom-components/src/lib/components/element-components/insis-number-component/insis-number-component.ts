import { MaterialElementComponentImplementation, IceNumberComponent } from '@impeo/ng-ice';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'insis-number',
  templateUrl: './insis-number-component.html',
})
export class InsisNumberComponent extends IceNumberComponent implements OnInit {
  static componentName = 'InsisNumber';

  shouldRenderAsDisabled = false;

  ngOnInit() {
    super.ngOnInit();
    this.shouldRenderAsDisabled = !!this.getRecipeParam('shouldRenderAsDisabled', false);
  }
}
