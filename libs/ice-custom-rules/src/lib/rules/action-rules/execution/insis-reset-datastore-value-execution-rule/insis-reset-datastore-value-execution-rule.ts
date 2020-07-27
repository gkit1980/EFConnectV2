import { ExecutionRule } from '@impeo/ice-core';

export class InsisResetDatastoreValueExecutionRule extends ExecutionRule {
  execute(actionContext?: any): Promise<void> {
    const defaultValue = this.getParam('defaultValue', '');

    this.requireParam('paths').forEach((path) => {
      this.dataStore.set(path, defaultValue);
    });

    return;
  }
}
