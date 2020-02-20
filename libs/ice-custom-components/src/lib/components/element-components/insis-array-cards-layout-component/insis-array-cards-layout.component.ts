import { Component, OnInit } from '@angular/core';
import { IceArrayComponent } from '@impeo/ng-ice';

@Component({
  selector: 'insis-array-cards-layout',
  templateUrl: './insis-array-cards-layout.component.html'
})
export class InsisArrayCardsLayoutComponent extends IceArrayComponent implements OnInit {
  static componentName = 'InsisArrayCardsLayout';
  addButtonLabel = '';
  removeButtonLabel = '';

  ngOnInit() {
    super.ngOnInit();
    this.determineLabels();
  }

  hasCard(index) {
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

  private determineLabels() {
    this.addButtonLabel = this.resource.resolve(
      this.getRecipeParam('addButtonLabelResourceKey'),
      'Add'
    );
    this.removeButtonLabel = this.resource.resolve(
      this.getRecipeParam('removeButtonLabelResourceKey'),
      'Remove'
    );
  }
}
