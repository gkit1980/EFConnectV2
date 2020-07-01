import { ExecutionRule } from '@impeo/ice-core';
import { values, get } from 'lodash';

export class InsisResetElementOrElementsInsideNamespaceExecutionRule extends ExecutionRule {
  execute(actionContext?: any): Promise<void> {
    const namespace = this.requireParam('elementOrNamespace');
    let index = this.getParam('index');
    index = [index] || get(actionContext, 'index', []);
    const resetActionContext = {
      index: index,
    };

    values(this.context.iceModel.elements)
      .filter(
        (element) =>
          element.name.includes(namespace) && !element.name.replace(namespace, '').includes('~')
      )
      .forEach((element) => {
        element.reset(resetActionContext);
      });

    return;
  }
}
