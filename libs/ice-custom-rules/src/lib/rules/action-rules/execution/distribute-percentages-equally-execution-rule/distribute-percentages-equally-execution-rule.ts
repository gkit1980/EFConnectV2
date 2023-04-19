import { ExecutionRule, ItemElement } from '@impeo/ice-core';
import { forEach, last } from 'lodash';

//
//
export class DistributePercentagesEquallyExecutionRule extends ExecutionRule {
  //
  //
  async execute(actionContext?: any): Promise<void> {
    const percentageElement = this.requireElement('percentageElement') as ItemElement;
    const elementValue = percentageElement.getValue();
    const percentageValue = Number((100 / elementValue.values.length).toFixed());
    const lastPercentageValue = 100 - percentageValue * (elementValue.values.length - 1);
    forEach(elementValue.values, (value) => {
      percentageElement.setValue(value.getValueCopy(percentageValue));
    });
    percentageElement.setValue(last(elementValue.values).getValueCopy(lastPercentageValue));
  }
}
