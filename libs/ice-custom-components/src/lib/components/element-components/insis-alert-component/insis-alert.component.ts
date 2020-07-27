import { Component, OnInit, OnDestroy } from '@angular/core';
import { ElementComponentImplementation } from '@impeo/ng-ice';
import { get } from 'lodash';
import { filter, map } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { IceElement } from '@impeo/ice-core/src';

@Component({
  selector: 'insis-alert',
  templateUrl: './insis-alert.component.html',
})
export class InsisAlertComponent extends ElementComponentImplementation
  implements OnInit, OnDestroy {
  static componentName = 'InsisAlert';

  private removedSubject = new Subject();
  private timeout = null;
  private iceElement: IceElement = null;

  ngOnInit() {
    super.ngOnInit();

    const autoDismissSeconds = this.getRecipeParam('autoDismiss', 0);

    if (autoDismissSeconds) {
      this.iceElement = this.context.iceModel.elements[this.element.name];
      this.iceElement.$dataModelValueChange.pipe(filter((value) => value.value)).subscribe(() => {
        this.clearMessageAfterInterval();
      });

      this.clearMessageAfterInterval();
    }
  }

  clearMessageAfterInterval() {
    // This can be refactored to use rxjs
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.removeMessage();
    }, this.getRecipeParam('autoDismiss', 0) * 1000);
  }

  get classNames() {
    return ['insis-alert', 'insis-alert-' + this.type].join(' ');
  }

  get type() {
    return this.getRecipeParam('type', 'error');
  }

  get showDismissButton() {
    return this.getRecipeParam('showDismissButton', true);
  }

  get message() {
    return this.getComponentValue();
  }

  removeMessage() {
    this.removedSubject.next();
    this.setComponentValue('');
    this.applyComponentValueToDataModel();
  }

  ngOnDestroy() {
    this.removedSubject.next();
    if (this.iceElement) {
      this.iceElement.$dataModelValueChange.unsubscribe();
    }
  }
}
