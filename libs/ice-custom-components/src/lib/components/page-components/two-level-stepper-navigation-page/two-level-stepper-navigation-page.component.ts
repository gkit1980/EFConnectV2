import { Component, OnInit } from '@angular/core';
import { PageComponentImplementation } from '@impeo/ng-ice';
import { IcePage } from '@impeo/ice-core';

@Component({
  selector: 'two-level-stepper-navigation-page',
  templateUrl: './two-level-stepper-navigation-page.component.html'
})
export class TwoLevelStepperNavigationPageComponent extends PageComponentImplementation
  implements OnInit {
  static componentName = 'TwoLevelStepperNavigationPage';

  get selectedIndex(): number {
    const currentPage = this.navigation.currentPage;
    const currentPageIndex = this.navigation.getPosition(currentPage);
    return currentPageIndex[0] - 1;
  }

  get currentTopLevelPage(): IcePage {
    const currentPage = this.navigation.getParent(this.navigation.currentPage);
    return currentPage ? currentPage : this.navigation.currentPage;
  }

  get topLevelNavigationPages() {
    return this.navigation.getChildren(null);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  navigateTo(page: IcePage): void {
    this.navigation.activatePage(page);
  }
}
