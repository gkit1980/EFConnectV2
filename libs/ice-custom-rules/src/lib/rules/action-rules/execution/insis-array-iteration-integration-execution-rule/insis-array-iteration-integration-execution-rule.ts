import {
  ExecutionRule,
  IceConsole,
  ActiveIntegration,
  ArrayElement,
  IndexedValue,
} from '@impeo/ice-core';
import { forEach } from 'lodash';
/**
 * Executes an integration
 */
export class InsisArrayIterationIntegrationExecutionRule extends ExecutionRule {
  //
  //
  async execute(actionContext: any): Promise<void> {
    if (actionContext == null || actionContext.index == null) actionContext = { index: null };
    const integrationName = this.requireParam('integration');
    const arrayElement = this.requireElement('arrayElement') as ArrayElement;
    const conditionDtName = this.getParam('conditiondt');
    const conditionDt = this.getDt(conditionDtName);

    //console.log({ conditionDt, dtValue, index: actionContext.index });

    const integrationExecutions = [];
    const integration = this.iceModel.integrations[integrationName] as ActiveIntegration;
    if (!integration) return IceConsole.warn(`no such ActiveIntegration: '${integrationName}'`);

    const items = arrayElement.getValue().values;

    forEach(items[0].value, (item: any, i: number) => {
      const index = [[]];
      if (items[0].index) index[0] = items[0].index;
      index[0].push(i);

      let executeIntegration = true;
      if (conditionDt) executeIntegration = conditionDt.getOutputValue(null, [i]);

      if (executeIntegration) integrationExecutions.push(integration.execute({ index: index }));
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
