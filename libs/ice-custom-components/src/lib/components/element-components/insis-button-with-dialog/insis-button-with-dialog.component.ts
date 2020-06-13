import { Component, Inject } from '@angular/core';
import { get } from 'lodash';
import { MaterialElementComponentImplementation, IceButtonComponent } from '@impeo/ng-ice';
import { MatDialog } from '@angular/material/dialog';
import { LifecycleEvent } from '@impeo/ice-core';
import { Subscription } from 'rxjs';
import { InsisDialogSectionContainer } from '../../shared-components/insis-dialog-section-container/insis-dialog-section-container';

@Component({
  selector: 'insis-button-with-dialog',
  templateUrl: './insis-button-with-dialog.component.html',
})
export class InsisButtonWithDialogComponent extends IceButtonComponent {
  static componentName = 'InsisButtonWithDialog';

  get assetsIconPath() {
    return `/assets/${this.getRecipeParam('assetsIconName', null)}`;
  }

  get customClass() {
    return this.useAssetsIcon
      ? {
          'background-image': `url(${this.assetsIconPath})`,
          'background-repeat': 'no-repeat',
          height: '20px',
          width: '20px',
        }
      : {};
  }

  get useAssetsIcon() {
    return this.getRecipeParam('useAssetsIcon', false);
  }

  get actionName(): string {
    return this.getRecipeParam('actionName', null);
  }

  get afterCloseActionName(): string {
    return this.getRecipeParam('afterCloseActionName', null);
  }

  //
  //
  constructor(private dialog: MatDialog) {
    super();
  }

  //
  //
  onClick() {
    const section = get(this.context.iceModel.recipe, ['sections', this.getRecipeParam('section')]);
    const dialogData = { section: section, page: this.context.iceModel.navigation.currentPage };

    let lifecycleSubscription: Subscription;

    const dialogRef = this.dialog.open(InsisDialogSectionContainer, {
      width: this.getRecipeParam('width'),
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (lifecycleSubscription) lifecycleSubscription.unsubscribe();
      if (this.afterCloseActionName) {
        const action = this.context.iceModel.actions[this.afterCloseActionName];
        action.execute({ index: this.index });
      }
    });

    if (this.actionName) {
      lifecycleSubscription = this.context.$lifecycle.subscribe((e: LifecycleEvent) => {
        const currentAction = get(e, ['payload', 'action']);
        if (
          e &&
          e.type === 'ACTION_FINISHED' &&
          currentAction &&
          currentAction === this.actionName
        ) {
          dialogRef.close({ succsess: true });
        }
      });
    }
  }
}
