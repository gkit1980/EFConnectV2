import { ConditionRule } from '@impeo/ice-core';
import { isNil } from 'lodash';

export class InsisHasDatastoreValue extends ConditionRule {
  async evaluate(actionContext?: any): Promise<boolean> {
    return !isNil(this.context.dataStore.get(this.requireParam('path')));
  }
}
