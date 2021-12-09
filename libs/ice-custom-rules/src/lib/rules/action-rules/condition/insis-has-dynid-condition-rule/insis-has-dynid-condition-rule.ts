import { ConditionRule } from '@impeo/ice-core';
import { isNil } from 'lodash';

export class InsisHasDynIdConditionRule extends ConditionRule {
  async evaluate(actionContext?: any): Promise<boolean> {
    const currentDefinition = this.context.iceModel.definition.name;
    return !isNil(this.context.dataStore.get(`${currentDefinition}.dynId`));
  }
}
