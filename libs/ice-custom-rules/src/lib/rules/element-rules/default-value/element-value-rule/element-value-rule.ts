import { ValueRule } from '@impeo/ice-core';

//
//
export class ElementValueRule extends ValueRule {
  //
  //
  public getValue(index: number[] | null): any {
    const conditionIndex: number = Number.parseInt(
      this.getParam('index', index[index.length - 1]),
      10
    );

    if (index[index.length - 1] !== conditionIndex) return null;

    const sourceElement = this.requireElement();

    const sourceElementIndex: number[] | null = this.getParam('sourceElementIndex', null);

    return sourceElement.getValue().forIndex(sourceElementIndex);
  }
}
