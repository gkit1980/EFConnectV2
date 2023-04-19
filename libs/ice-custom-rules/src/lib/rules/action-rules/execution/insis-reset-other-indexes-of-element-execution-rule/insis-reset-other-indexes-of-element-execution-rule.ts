import { ExecutionRule, IceConsole, IndexedValue } from '@impeo/ice-core';
import * as _ from 'lodash';

//
//
export class InsisResetOtherIndexesOfElementExecutionRule extends ExecutionRule {
  //
  //
  async execute(actionContext: any): Promise<void> {
    const arrayElement = this.requireElement('element');

    const values = arrayElement.getValue().values;

    values.forEach((item: IndexedValue) => {
      if (JSON.stringify(actionContext.index) !== JSON.stringify(item.index)) item.reset();
    });
  }
}
