import { ItemElement, LifecycleEvent } from '@impeo/ice-core';
import { MaterialSelectComponentImplementation } from '@impeo/ng-ice';
import { Component, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material';
import { get } from 'lodash';

import { Subscription } from 'rxjs';
import { InsisDialogSectionContainer } from '../../shared-components/insis-dialog-section-container/insis-dialog-section-container';

type IconPosition = 'left' | 'right';

@Component({
  selector: 'insis-button-with-menu',
  templateUrl: './insis-button-with-menu.component.html'
})
export class InsisButtonWithMenuComponent extends MaterialSelectComponentImplementation {
  static componentName = 'InsisButtonWithMenu';

  //
  //
  constructor(
    @Inject(MAT_FORM_FIELD_DEFAULT_OPTIONS) defaults: MatFormFieldDefaultOptions,
    private dialog: MatDialog
  ) {
    super();
  }

  //
  //
  onClick(value: any): void {
    this.value = value;
    this.onComponentValueChange();
    let lifecycleSubscription: Subscription;
    const dialogSection = (<ItemElement>this.element.element).valuesRule.getAdditionalValue(
      value,
      'dialog'
    );
    const width = (<ItemElement>this.element.element).valuesRule.getAdditionalValue(value, 'width');
    const actionName = (<ItemElement>this.element.element).valuesRule.getAdditionalValue(
      value,
      'action'
    );
    if (dialogSection) {
      const section = get(this.context.iceModel.recipe, ['sections', dialogSection]);
      const dialogData = { section: section, page: this.context.iceModel.navigation.currentPage };
      const dialogRef = this.dialog.open(InsisDialogSectionContainer, {
        width: width,
        data: dialogData
      });

      dialogRef.afterClosed().subscribe(result => {
        if (lifecycleSubscription) lifecycleSubscription.unsubscribe();
      });

      if (actionName) {
        lifecycleSubscription = this.context.$lifecycle.subscribe((e: LifecycleEvent) => {
          const currentAction = get(e, ['payload', 'action']);
          if (e && e.type === 'ACTION_FINISHED' && currentAction && currentAction === actionName) {
            dialogRef.close({ succsess: true });
          }
        });
      }
      return;
    }

    if (!actionName || this.section.iceModel.actions[actionName] == null) return;
    const actionContext = { index: this.index };
    this.section.iceModel.actions[actionName].execute(actionContext);
  }
}
