import { SectionViewModeRule, SectionViewMode, PageElement, ArrayElement } from '@impeo/ice-core';
import { throttle } from 'lodash';

export class InsisHideSectionWhenArrayElementIsEmpty extends SectionViewModeRule {
  private viewModeCached;
  private getViewModeThrottled = throttle(() => {
    const arrayElement = this.requireElement('array') as ArrayElement;
    const elementsWithValue = arrayElement
      .getArrayItemElements()
      .map((element) => element.getValue().values)
      .filter((value) => value.length !== 0);
    this.viewModeCached =
      elementsWithValue.length !== 0 ? SectionViewMode.DEFAULT : SectionViewMode.HIDDEN;
  }, 120);

  getViewMode(): SectionViewMode {
    this.getViewModeThrottled();
    return this.viewModeCached;
  }
}
