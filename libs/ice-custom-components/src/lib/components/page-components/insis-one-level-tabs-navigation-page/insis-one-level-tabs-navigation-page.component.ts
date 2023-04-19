import { Component, OnInit } from '@angular/core';
import { IcePage } from '@impeo/ice-core';
import { PageComponentImplementation } from '@impeo/ng-ice';
import { get, first } from 'lodash';

const HEADER_SECTION_TAG = 'header';

const getTags = (section) => {
  const componentName = first(Object.keys(get(section, 'recipe.component', {})));
  return get(section, `recipe.component.${componentName}.tags`, []);
};

@Component({
  selector: 'insis-one-level-tabs-navigation-page',
  templateUrl: './insis-one-level-tabs-navigation-page.component.html',
})
export class InsisOneLevelTabsNavigationPageComponent extends PageComponentImplementation
  implements OnInit {
  static componentName = 'InsisOneLevelTabsNavigationPage';

  get mainSections() {
    return this.page.sections.filter((section) => {
      const tags = getTags(section);
      return !tags.includes(HEADER_SECTION_TAG);
    });
  }

  get headerSections() {
    return this.page.sections.filter((section) => {
      const tags = getTags(section);
      return tags.includes(HEADER_SECTION_TAG);
    });
  }

  navigateToPage($event): void {
    this.navigation.activatePage($event.page);
  }
}
