import { ExecutionRule, IceConsole, ActiveIntegration } from '@impeo/ice-core';
import { forEach, clone } from 'lodash';
/**
 * Executes an integration
 */
export class InsisArrayIterationIntegrationExecutionRule extends ExecutionRule {
  //
  //
  async execute(actionContext: any): Promise<void> {
    if (actionContext == null || actionContext.index == null) actionContext = { index: [0] };
    const integrationName = this.requireParam('integration');
    const arrayElement = this.requireElement('arrayElement');
    const integrationExecutions = [];
    const integration = this.iceModel.integrations[integrationName] as ActiveIntegration;
    if (!integration) return IceConsole.warn(`no such ActiveIntegration: '${integrationName}'`);

    const items = arrayElement.getValue().forIndex(actionContext.index);

    forEach(items, (item: any, index: number) => {
      const subItemIndex = [[]];
      subItemIndex[0] = subItemIndex[0].concat(actionContext.index);
      subItemIndex[0].push(index);
      integrationExecutions.push(
        integration.execute({ index: actionContext.index, subItemIndex: subItemIndex })
      );
    });

    await Promise.all(
      integrationExecutions.map(
        (p) =>
          new Promise((resolve) => {
            p.then(resolve).catch(resolve);
          })
      )
    );
  }
}
