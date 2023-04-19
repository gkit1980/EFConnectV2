import * as _ from 'lodash';
import { IndexedValue, ViewModeRule, ItemElement, IceUtil, FeelUtils } from '@impeo/ice-core';

export class InsisAllArrayIndexDtViewModeRule extends ViewModeRule {
  /**
   * @param element the array item element for which to compare teh value for the view mode
   * @returns the viewMode
   */
  public getViewMode(actionContext?: any): string {
    const dt = this.requireDt();
    const arrayElement = this.requireElement('arrayElement');
    const elementIndex = IndexedValue.sliceIndexToElementLevel(
      arrayElement.name,
      _.get(actionContext, 'index')
    );
    const values = arrayElement.getValue().forIndex(elementIndex);
    let allValuesApply = true;
    _.forEach(values, (value: any, index: number) => {
      const itemIndex = _.concat(elementIndex, [index]);
      const result = dt.getOutputValue(null, itemIndex);
      if (!result) allValuesApply = false;
    });
    if (allValuesApply) return this.requireParam('conditionViewMode');
    return this.getParam('elseViewMode') || 'default';
  }
}
