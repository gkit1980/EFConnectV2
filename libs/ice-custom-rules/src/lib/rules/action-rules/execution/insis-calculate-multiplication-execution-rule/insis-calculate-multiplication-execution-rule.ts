import { ExecutionRule, IndexedValue, ValueOrigin } from '@impeo/ice-core';
import { forEach } from 'lodash';
export class InsisCalculateMultiplicationExecutionRule extends ExecutionRule {
  //
  //
  async execute(actionContext?: any): Promise<any> {
    const sourceElements = this.iceModel.namesToElements(this.requireParam('elements'));
    const sourceValues = this.getParam('values', []);
    const destElement = this.requireElement('destination');

    let multiplication = 1;

    forEach(sourceElements, (sourceElement) => {
      const _index: number[] = actionContext.index
        ? IndexedValue.sliceIndexToElementLevel(sourceElement.name, actionContext.index)
        : null;
      const value = sourceElement.getValue().forIndex(_index);

      if (value != null) multiplication *= <number>value;
    });

    forEach(sourceValues, (sourceValue) => {
      if (sourceValue != null) multiplication *= <number>sourceValue;
    });

    const index = actionContext.index
      ? IndexedValue.sliceIndexToElementLevel(destElement.name, actionContext.index)
      : null;
    destElement.setValue(
      new IndexedValue(destElement, multiplication, index, ValueOrigin.DATAMODEL)
    );
  }
}
