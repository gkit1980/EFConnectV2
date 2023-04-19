import { ExecutionRule, IndexedValue, ValueOrigin } from '@impeo/ice-core';

//
//
export class InsisCopyValueToDatastoreExecutionRule extends ExecutionRule {
  //
  //
  async execute(actionContext?: any): Promise<any> {
    const sourceElement = this.requireElement('source');
    const destPath = this.requireParam('destination');
    const index = actionContext != null && actionContext.index != null ? actionContext.index : null;
    const sourceValue = sourceElement.getValue().forIndex(index);
    this.context.dataStore.set(destPath, sourceValue);
  }
}
