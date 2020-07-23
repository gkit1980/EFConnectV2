import { Component } from '@angular/core';
import { IceArrayComponent } from '@impeo/ng-ice';

@Component({
  selector: 'insis-array',
  templateUrl: './insis-array.component.html',
})
export class InsisArrayComponent extends IceArrayComponent {
  static componentName = 'InsisArray';

  //
  //
  getIndexOfArrayItem(index: number): number | string {
    return this.showIndex() ? index + 1 : '';
  }

  //
  //
  showIndex(): boolean {
    return this.getRecipeParam('showIndex', true);
  }

  //
  //
  get removeLabel(): string {
    return this.resource.resolve(this.getRecipeParam('removeButtonLabelResourceKey'), 'Remove');
  }

  //
  //
  get addLabel(): string {
    return this.resource.resolve(this.getRecipeParam('addButtonLabelResourceKey'), 'Add');
  }

  //
  //
  showRemoveButton(): boolean {
    const hideRemoveButtonOnOneItem = this.getRecipeParam('hideRemoveButtonOnOneItem', false);

    if (hideRemoveButtonOnOneItem && this.getItems().length === 1) return false;

    return true;
  }
}
