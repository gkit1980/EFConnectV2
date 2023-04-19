import { Component } from '@angular/core';
import { InsisArrayComponentImplementation } from '../insis-array-component-implementation';

@Component({
  selector: 'insis-array-cards-layout',
  templateUrl: './insis-array-cards-layout.component.html',
})
export class InsisArrayCardsLayoutComponent extends InsisArrayComponentImplementation {
  static componentName = 'InsisArrayCardsLayout';

  hasCard() {
    const cardLayoutParam = this.getRecipeParam('cardLayout');
    switch (cardLayoutParam) {
      case 'never':
        return false;
      case 'onMultipleItems':
        return this.getItems().length > 1;
      case 'always':
      default:
        return true;
    }
  }

  canRemove(): boolean {
    return this.getRecipeParam('showRemoveButton', super.canRemove());
  }

  canAdd(): boolean {
    return this.getRecipeParam('showAddButton', super.canAdd());
  }
}
