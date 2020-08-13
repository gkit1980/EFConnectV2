import { ExecutionRule } from '@impeo/ice-core';

export class InsisResetDatastoreValueExecutionRule extends ExecutionRule {
  execute(actionContext?: any): Promise<void> {
    const defaultValue = this.getParam('defaultValue', null);
    const scopeToDefinition = this.getParam('scopeToDefinition', false);
    const skipIfSet = this.getParam('skipIfValueIsSet', false);
    const prefix = scopeToDefinition ? `${this.context.definition}.` : '';

    this.requireParam('paths').forEach((path) => {
      if (!skipIfSet || this.dataStore.get(`${prefix}${path}`) == null)
        this.dataStore.set(`${prefix}${path}`, defaultValue);
    });

    return;
  }
}
