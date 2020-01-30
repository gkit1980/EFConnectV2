import { PageNavigationComponentImplementation } from '@impeo/ng-ice';
import { IcePage } from '@impeo/ice-core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'stepper-navigation',
  templateUrl: './stepper-navigation.component.html'
})
export class StepperNavigationComponent extends PageNavigationComponentImplementation
  implements OnInit {
  static componentName = 'StepperNavigation';

  selectedIndex = 0;

  get currentPage(): IcePage {
    return this.pages[this.selectedIndex];
  }

  ngOnInit() {
    const parentPage = this.navigation.getParent(this.page);
    const position = this.navigation.getPosition(this.page);

    if (!parentPage) {
      this.selectedIndex = 0;
      this.pages = this.navigation.getChildren(this.page);
    } else {
      this.selectedIndex = position[1] - 1;
      this.pages = this.navigation.getChildren(parentPage);
    }
  }
}
