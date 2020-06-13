import { PageNavigationComponentImplementation } from '@impeo/ng-ice';
import { Component } from '@angular/core';

@Component({
  selector: 'insis-horizontal-stepper-navigation',
  templateUrl: './insis-horizontal-stepper-navigation.component.html',
})
export class InsisHorizontalStepperNavigationComponent extends PageNavigationComponentImplementation {
  static componentName = 'InsisHorizontalStepperNavigation';

  get selectedIndex(): number {
    const currentPage = this.navigation.currentPage;
    return this.getPosition(currentPage)[0] - 1;
  }
}
