import { Component, OnInit } from '@angular/core';
import { MaterialElementComponentImplementation } from '@impeo/ng-ice';

@Component({
  selector: 'insis-null-output',
  templateUrl: './insis-null-output.component.html',
})
export class InsisNullOutputComponent extends MaterialElementComponentImplementation
  implements OnInit {
  static componentName = 'InsisNullOutput';
  nullOutputLabel: string;

  ngOnInit() {
    super.ngOnInit();
    this.nullOutputLabel = this.resource.resolve(this.getRecipeParam('key'), '--');
  }

  get outputValue() {
    return this.value ? this.value : this.nullOutputLabel;
  }
}
