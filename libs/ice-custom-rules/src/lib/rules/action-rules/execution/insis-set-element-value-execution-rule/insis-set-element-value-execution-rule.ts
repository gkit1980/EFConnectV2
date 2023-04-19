import { ExecutionRule, IndexedValue, ValueOrigin } from '@impeo/ice-core';

//
//
export class InsisSetElementValueExecutionRule extends ExecutionRule {
  //
  //
  async execute(actionContext?: any): Promise<any> {
    const value = this.requireParam('value');
    const destElement = this.requireElement('element');
    const index = actionContext != null && actionContext.index != null ? actionContext.index : null;
    const destIndex = IndexedValue.sliceIndexToElementLevel(destElement.name, index);
    destElement.setValue(new IndexedValue(destElement, value, destIndex, ValueOrigin.DATAMODEL));
  }
}
