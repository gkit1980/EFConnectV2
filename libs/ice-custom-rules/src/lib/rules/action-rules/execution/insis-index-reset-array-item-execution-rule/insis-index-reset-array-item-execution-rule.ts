import { ExecutionRule, IndexedValue } from '@impeo/ice-core';
import * as _ from 'lodash';

//
//
export class InsisIndexResetArrayItemExecutionRule extends ExecutionRule {
  //
  //
  async execute(actionContext: any): Promise<void> {
    const arrayElement = this.requireElement('element');

    const onlyIndex = this.requireParam('onlyIndex');

    const values = arrayElement.getValue().values;

    const elementWithOnlyIndex = values.find(
      (indexedValue: IndexedValue) =>
        indexedValue.index[indexedValue.index.length - 1] === onlyIndex
    );

    if (elementWithOnlyIndex) arrayElement.reset({ index: elementWithOnlyIndex.index });
  }
}
