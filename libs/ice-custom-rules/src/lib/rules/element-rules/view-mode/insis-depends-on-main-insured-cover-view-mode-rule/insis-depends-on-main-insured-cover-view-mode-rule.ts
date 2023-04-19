import * as _ from 'lodash';
import { IndexedValue, ViewModeRule } from '@impeo/ice-core';

export class InsisDependsOnMainInsuredCoverViewModeRule extends ViewModeRule {
  public getViewMode(actionContext?: any): string {
    const entityAccidentInsuredElementValues = this.context.iceModel.elements[
      'policy.insured.person-objects~entity-accident-insured.type'
    ].getValue().values;

    const mainIndex = entityAccidentInsuredElementValues.find((item) => item.value === 1).index;

    if (String(mainIndex) === String(actionContext.index))
      return this.getParam('mainCoverViewMode') || 'default';

    const elementValues = this.requireElement('coverElement').getValue().values;
    const mainCoverValue = elementValues.find((item) => String(item.index) === String(mainIndex))
      .value;

    if (mainCoverValue) return this.requireParam('conditionViewMode');
    return this.getParam('elseViewMode') || 'default';
  }
}
