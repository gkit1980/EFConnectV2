import { ConditionRule } from '@impeo/ice-core';
import { map, get } from 'lodash';
//
//
export class InsisCovers910211ConditionRule extends ConditionRule {
  //
  //
  async evaluate(): Promise<boolean> {
    const getElement = (name) => this.context.iceModel.elements[name];

    const getIndexValue = (element, index) => element.getValue().forIndex([index]);

    const insuredObjects = getElement('policy.insured.person-objects');
    const deathAnyCover = getElement('policy.insured.person-objects~cover.death-any.active');
    const tpdaccdCover = getElement('policy.insured.person-objects~cover.tpdaccd.active');
    const deathAccCover = getElement('policy.insured.person-objects~cover.death-acc.active');

    const insuredObjectsSize = get(insuredObjects.getValue(), 'values.0.value.length');

    if (insuredObjectsSize === 1 && getIndexValue(deathAnyCover, 0)) return true;
    if (
      insuredObjectsSize === 2 &&
      (getIndexValue(tpdaccdCover, 1) || getIndexValue(deathAccCover, 1))
    )
      return true;

    return false;
  }
}
