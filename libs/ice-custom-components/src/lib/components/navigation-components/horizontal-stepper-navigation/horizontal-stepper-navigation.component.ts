import { PageNavigationComponentImplementation } from '@impeo/ng-ice';
import { Component } from '@angular/core';

@Component({
  selector: 'horizontal-stepper-navigation',
  templateUrl: './horizontal-stepper-navigation.component.html'
})
export class HorizontalStepperNavigationComponent extends PageNavigationComponentImplementation {
  static componentName = 'HorizontalStepperNavigation';

  get selectedIndex(): number {
    const currentPage = this.navigation.currentPage;
    return this.getPosition(currentPage)[0] - 1;
  }
}
