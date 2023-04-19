import {
  ExecutionRule,
  IndexedValue,
  ValueOrigin,
  IceUtil,
  ItemElement,
  IceElement,
} from '@impeo/ice-core';
import { forEach, last, get } from 'lodash';

//
//
export class InsisCalculateSumExecutionRule extends ExecutionRule {
  //
  //
  async execute(actionContext?: any): Promise<any> {
    const sourceElements = this.iceModel.namesToElements(this.requireParam('elements'));

    if (actionContext.index) return this.calculateSum(sourceElements, actionContext.index);
    const sourceArrayElement = this.requireElement('sourceArray');
    const items = sourceArrayElement.getValue();
    forEach(items.values[0].value, (item: any, index: number) => {
      this.calculateSum(sourceElements, [index]);
    });
  }

  //
  //
  private calculateSum(sourceElements: IceElement[], sourceIndex: number[]): void {
    let sum = 0;
    const destElement = this.requireElement('destination');
    forEach(sourceElements, (sourceElement) => {
      let _index = sourceIndex
        ? IndexedValue.sliceIndexToElementLevel(sourceElement.name, sourceIndex)
        : null;
      let items = sourceElement.getValue().forIndex(_index);
      if (sourceElement.isArrayItem()) {
        const parentElement = (<ItemElement>sourceElement).getParentArrayElement();
        _index = sourceIndex
          ? IndexedValue.sliceIndexToElementLevel(parentElement.name, sourceIndex)
          : null;
        items = parentElement.getValue().forIndex(_index);
      }

      forEach(items, (item) => {
        let value = item;
        if (sourceElement.isArrayItem())
          value = get(item, last(sourceElement.name.split(IceUtil.ARRAY_ITEM_SEPERATOR)));
        if (value != null) sum += <number>value;
      });
    });

    const index = sourceIndex
      ? IndexedValue.sliceIndexToElementLevel(destElement.name, sourceIndex)
      : null;
    destElement.setValue(new IndexedValue(destElement, sum, index, ValueOrigin.DATAMODEL));
  }
}
