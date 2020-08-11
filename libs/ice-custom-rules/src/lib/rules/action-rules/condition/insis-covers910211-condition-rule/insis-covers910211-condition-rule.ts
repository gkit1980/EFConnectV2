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

    const triggerType = this.getParam('type', 'calculate');

    const policyIDElement = getElement('policy.contract.policy-id');
    const policyStateElement = getElement('policy.status.policy-status');
    const policyID = getIndexValue(policyIDElement, 0);
    const policyState = getIndexValue(policyStateElement, 0);

    let triggerPolicyConditions = true;
    if (triggerType === 'calculate') {
      triggerPolicyConditions = policyID == null && policyState === -4;
    } else if (triggerType === 'recalculate') {
      triggerPolicyConditions = policyID != null && policyState === -4;
    }

    const insuredObjectsSize = get(insuredObjects.getValue(), 'values.0.value.length');

    if (triggerPolicyConditions && getIndexValue(deathAnyCover, 0)) {
      if (insuredObjectsSize === 1) {
        return true;
      } else if (insuredObjectsSize === 2) {
        return (
          (getIndexValue(tpdaccdCover, 0) && getIndexValue(tpdaccdCover, 1)) ||
          (getIndexValue(deathAccCover, 0) && getIndexValue(deathAccCover, 1))
        );
      } else {
        return false;
      }
    }
    return false;
  }
}
