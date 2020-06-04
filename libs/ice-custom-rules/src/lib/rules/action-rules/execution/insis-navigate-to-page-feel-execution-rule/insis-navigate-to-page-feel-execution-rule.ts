import { ExecutionRule, IceConsole, FeelUtils, IceClientRuntime } from '@impeo/ice-core';
import { get } from 'lodash';

export class InsisNavigateToPageFeelExecutionRule extends ExecutionRule {
  execute(actionContext?: any): Promise<void> {
    const expression = this.requireParam('expression');
    const index = get(actionContext, 'index');
    try {
      const result = FeelUtils.evaluate(expression, index, this.iceModel);
      const clientRuntime = this.context.runtime as IceClientRuntime;
      clientRuntime.goToDefinition(this.definition, result);
    } catch (e) {
      IceConsole.error(`
				FeelConditionRule: expression '${expression}' is not a valid feel expression.`);
    }

    return;
  }
}
