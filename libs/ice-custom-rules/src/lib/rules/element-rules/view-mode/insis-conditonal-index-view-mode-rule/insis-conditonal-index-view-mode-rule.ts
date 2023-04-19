import * as _ from 'lodash';
import { IndexedValue, ViewModeRule } from '@impeo/ice-core';

export class InsisConditionalIndexViewModeRule extends ViewModeRule {
  /**
   * @param index the index of the element-component that wants to know the view mode
   * @returns the value of the element (if an index is provided,
   *          with the same index as the component that renders viewMode)
   */
  public getViewMode(actionContext?: any): string {
    const index = IndexedValue.key2Index(this.requireParam('conditionIndex'));
    let elementIndex = _.get(actionContext, 'index');
    elementIndex = IndexedValue.sliceIndexToElementLevel(this.element.name, elementIndex);

    if (_.isEqual(index, elementIndex)) return this.requireParam('conditionViewMode');
    return this.getParam('elseViewMode') || 'default';
  }
}
