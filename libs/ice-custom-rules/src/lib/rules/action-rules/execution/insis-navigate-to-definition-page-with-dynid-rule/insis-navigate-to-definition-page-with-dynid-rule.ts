import { ExecutionRule, IceClientRuntime, IceConsole } from '@impeo/ice-core';

export class InsisNavigateToDefinitionPageWithDynidRule extends ExecutionRule {
  execute(actionContext?: any): Promise<void> {
    const clientRuntime = this.context.runtime as IceClientRuntime;
    if (!clientRuntime)
      return IceConsole.error(
        `Rule '${this.ruleName}' attempted to get ClientRuntime but not available`
      );

    const dynIdElement = this.getElement('dynIdElement');
    const index = (actionContext && actionContext.index) || [0];
    const dynId = dynIdElement ? dynIdElement.getValue().forIndex(index) : null;
    const definition = this.getParam('definitionElement')
      ? this.getElement('definitionElement').getValue().forIndex(index)
      : this.requireParam('definition');
    const page = this.getParam('page');

    clientRuntime.goToDefinition(definition, page, dynId);
  }
}
