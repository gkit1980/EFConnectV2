import { Component, OnInit } from '@angular/core';
import { PageComponentImplementation } from '@impeo/ng-ice';
import { IcePage } from '@impeo/ice-core';
import { get, first } from 'lodash';

const RIGHT_SECTION_TAG = 'pull-right';
const TOP_SECTION_TAG = 'header';

const getTags = (section) => {
  const componentName = first(Object.keys(get(section, 'recipe.component', {})));
  return get(section, `recipe.component.${componentName}.tags`, []);
};

@Component({
  selector: 'insis-two-level-stepper-navigation-page',
  templateUrl: './insis-two-level-stepper-navigation-page.component.html',
})
export class InsisTwoLevelStepperNavigationPageComponent extends PageComponentImplementation
  implements OnInit {
  static componentName = 'InsisTwoLevelStepperNavigationPage';

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

  get mainSections() {
    return this.page.sections.filter((section) => {
      const tags = getTags(section);
      return !tags.includes(RIGHT_SECTION_TAG) && !tags.includes(TOP_SECTION_TAG);
    });
  }

  get sideSections() {
    return this.page.sections.filter((section) => {
      const tags = getTags(section);
      return tags.includes(RIGHT_SECTION_TAG);
    });
  }

  get topSections() {
    return this.page.sections.filter((section) => {
      const tags = getTags(section);
      return tags.includes(TOP_SECTION_TAG);
    });
  }

  navigateTo(page: IcePage): void {
    this.navigation.activatePage(page);
  }
}
