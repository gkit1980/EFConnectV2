import { ConditionRule } from '@impeo/ice-core';
import { isNil } from 'lodash';

export class InsisHasDatastoreValue extends ConditionRule {
  async evaluate(actionContext?: any): Promise<boolean> {
    const scopedToDefinition = !!this.getParam('scopeToDefinition');
    let dataStorePath = '';

    if (scopedToDefinition) {
      dataStorePath += this.definition + '.';
    }

    dataStorePath += this.requireParam('path');

    return !isNil(this.context.dataStore.get(dataStorePath));
  }
}
