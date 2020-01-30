import { PageNavigationComponentImplementation } from '@impeo/ng-ice';
import { Component } from '@angular/core';

@Component({
  selector: 'insis-navigation',
  templateUrl: './insis-navigation.component.html'
})
export class InsisNavigationComponent extends PageNavigationComponentImplementation {
  static componentName = 'InsisNavigation';

  get selectedIndex(): number {
    const currentPage = this.navigation.currentPage;
    return this.getPosition(currentPage)[0] - 1;
  }
}
