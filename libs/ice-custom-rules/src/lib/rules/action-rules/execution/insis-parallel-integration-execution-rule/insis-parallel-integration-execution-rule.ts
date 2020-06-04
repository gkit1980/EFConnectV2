import { ExecutionRule, IceConsole, ActiveIntegration } from '@impeo/ice-core';
import { forEach } from 'lodash';
/**
 * Executes an integration
 */
export class InsisParallelIntegrationExecutionRule extends ExecutionRule {
  //
  //
  async execute(): Promise<void> {
    const integrationsNames = this.requireParam('integrations');
    const integrationExecutions = [];
    forEach(integrationsNames, integrationName => {
      const integration = this.iceModel.integrations[integrationName];
      if (!integration) return IceConsole.warn(`no such integration: '${integrationName}'`);
      if (!(integration instanceof ActiveIntegration))
        return IceConsole.warn(`can only execute ActiveIntegration`);
      integrationExecutions.push(integration.execute());
    });

    await Promise.all(
      integrationExecutions.map(
        p =>
          new Promise(resolve => {
            p.then(resolve).catch(resolve);
          })
      )
    );
  }
}
