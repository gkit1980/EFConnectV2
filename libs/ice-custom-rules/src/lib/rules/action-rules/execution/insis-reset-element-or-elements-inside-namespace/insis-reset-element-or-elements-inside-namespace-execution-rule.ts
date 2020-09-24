import { ExecutionRule } from '@impeo/ice-core';
import { values, get, isNil, toArray } from 'lodash';

export class InsisResetElementOrElementsInsideNamespaceExecutionRule extends ExecutionRule {
  execute(actionContext?: any): Promise<void> {
    const namespace = this.requireParam('elementOrNamespace');

    const excludingNamespaces: Array<string> = toArray(this.getParam('excludingNamespaces', []));

    let index = this.getParam('index');
    index = !isNil(index) ? [index] : get(actionContext, 'index', []);

    const resetActionContext = {
      index: index,
    };

    values(this.context.iceModel.elements)
      .filter((element) => {
        const isInNamespace =
          element.name.startsWith(namespace) && !element.name.replace(namespace, '').includes('~');
        const isExcluded = excludingNamespaces.some((excludedNamespace) => {
          return element.name.startsWith(excludedNamespace);
        });
        return isInNamespace && !isExcluded;
      })
      .forEach((element) => {
        if (element.getValue().getIndexedValue(index)) element.reset(resetActionContext);
      });

    return;
  }
}
