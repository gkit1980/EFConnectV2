import { ListValuesRule } from '@impeo/ice-core/default-rules/rules/element-rules';
import * as _ from 'lodash';
import { IceConsole, IceList, IceElement } from '@impeo/ice-core';

export class InsisDtListValuesRule extends ListValuesRule {
  private dtElement: IceElement;
  requireList(): IceList {
    this.initialize();
    const dtName = _.get(this.recipe, 'dt');
    const dt = this.getDt();

    if (!dt) {
      IceConsole.error(`Required DT with name: ${dtName} not found.`);
      return null;
    }

    const customDtOutput = this.getParam('output') || 'output';

    const listName = dt.getOutputValue(customDtOutput);

    if (!listName) {
      IceConsole.error(`List not found! DT '${dtName}' outputs list with name '${listName}'.`);
      return null;
    }

    const list = super.requireList(listName);

    return list;
  }

  //
  //
  private initialize(): void {
    if (this.dtElement != null) return;
    this.dtElement = this.requireElement('dtElement');
    this.triggerReevaluationOnElementsChange([this.dtElement]);
  }
}
