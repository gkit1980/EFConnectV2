import { PageNavigationComponentImplementation } from '@impeo/ng-ice';
import { IcePage } from '@impeo/ice-core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'vertical-stepper-navigation',
  templateUrl: './vertical-stepper-navigation.component.html'
})
export class VerticalStepperNavigationComponent extends PageNavigationComponentImplementation
  implements OnInit {
  static componentName = 'VerticalStepperNavigation';

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
