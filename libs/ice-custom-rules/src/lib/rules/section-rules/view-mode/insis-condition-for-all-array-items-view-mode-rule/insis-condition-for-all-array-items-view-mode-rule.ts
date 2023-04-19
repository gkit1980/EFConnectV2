import * as _ from 'lodash';
import { SectionViewMode, SectionViewModeRule, ArrayElement } from '@impeo/ice-core';

export class InsisConditionForAllArrayItemsViewModeRule extends SectionViewModeRule {
  //
  //
  public getViewMode(actionContext?: any): SectionViewMode {
    const matches = this.iceModel.elements[this.recipe['conditionElement']]
      .getValue()
      .values.filter((value) => {
        return (
          value.value ===
          this.iceModel.elements[this.recipe['conditionValue']].getValue().forIndex([0])
        );
      });

    if (matches) return this.recipe['conditionViewMode'];
    return this.recipe['elseViewMode'] ? this.recipe['elseViewMode'] : SectionViewMode.DEFAULT;
  }
}
