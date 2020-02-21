import { Component } from '@angular/core';
import { InsisArrayComponentImplementation } from '../insis-array-component-implementation';

@Component({
  selector: 'insis-array-cards-layout',
  templateUrl: './insis-array-cards-layout.component.html'
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
}
