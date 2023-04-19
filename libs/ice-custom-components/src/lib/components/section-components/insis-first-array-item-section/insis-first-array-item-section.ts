import { Component, OnInit } from '@angular/core';
import { FlexSectionComponentImplementation } from '@impeo/ng-ice';
import { IceSection } from '@impeo/ice-core';
import { get, map } from 'lodash';

@Component({
  selector: 'insis-first-array-item-section',
  templateUrl: './insis-first-array-item-section.component.html',
})
export class InsisFistArrayItemSectionComponent extends FlexSectionComponentImplementation {
  static componentName = 'InsisFistArrayItemSection';

  componentName = 'InsisFistArrayItemSection';

  getArrayElement() {
    return get(this.recipe, `component.InsisFistArrayItemSection.arrayElement`, null);
  }

  get itemIndex() {
    return [0];
  }
}
