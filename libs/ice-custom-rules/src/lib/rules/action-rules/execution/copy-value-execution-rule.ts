import { ExecutionRule, IndexedValue, ValueOrigin } from '@impeo/ice-core';

//
//
export class CopyValueExecutionRule extends ExecutionRule {
  //
  //
  async execute(actionContext?: any): Promise<any> {
    const sourceElement = this.requireElement('source');
    const destElement = this.requireElement('destination');
    const index = actionContext != null && actionContext.index != null ? actionContext.index : null;
    const sourceValue = sourceElement.getValue().forIndex([index]);
    const destIndex = IndexedValue.sliceIndexToElementLevel(destElement.name, index);
    destElement.setValue(
      new IndexedValue(destElement, sourceValue, destIndex, ValueOrigin.DATAMODEL)
    );
  }
}
