import { ExecutionRule, IndexedValue } from '@impeo/ice-core';
import * as _ from 'lodash';

//
//
export class InsisIndexesResetArrayItemExecutionRule extends ExecutionRule {
  //
  //
  async execute(actionContext: any): Promise<void> {
    const arrayElement = this.requireElement('element');
    let onlyIndexes = this.getIndexesFromRecipe('onlyIndexes');
    const excludedIndexes = this.getIndexesFromRecipe('excludedIndexes');

    const values = arrayElement.getValue().values;

    if (onlyIndexes.length === 0) {
      onlyIndexes = [...Array(values.length).keys()].filter(
        (index) => !excludedIndexes.includes(index)
      );
    }

    values.forEach((indexedValue: IndexedValue) => {
      const index = indexedValue.index;
      if (JSON.stringify(index) !== JSON.stringify(actionContext.index)) {
        if (onlyIndexes.includes(index[index.length - 1])) {
          arrayElement.reset({ index: index });
        }
      }
    });
  }

  getIndexesFromRecipe(paramName: string): number[] {
    return String(this.getParam(paramName))
      .split(',')
      .map((index) => Number.parseInt(index, 10))
      .filter((index) => !isNaN(index));
  }
}
