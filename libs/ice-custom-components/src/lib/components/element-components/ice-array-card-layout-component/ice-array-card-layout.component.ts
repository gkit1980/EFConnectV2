import { Component, OnInit } from '@angular/core';
import { IceArrayComponent } from '@impeo/ng-ice';

@Component({
  selector: 'ice-array-card-layout',
  templateUrl: './ice-array-card-layout.component.html'
})
export class IceArrayCardLayoutComponent extends IceArrayComponent implements OnInit {
  static componentName = 'IceArrayCardLayout';
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
      case 'onMultiple':
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
