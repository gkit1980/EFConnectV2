import { IndexedValue, LabelRule } from '@impeo/ice-core';

//
//
export class InsisResourceLabelRule extends LabelRule {
  public getLabel(index: number[] | null): string | null {
    const indexForElement = IndexedValue.sliceIndexToElementLevel(this.element.name, index);
    let value;
    if (this.getParam('element'))
      value = this.getElement('element').getValue().forIndex(indexForElement);
    else value = this.element.getValue().forIndex(indexForElement);

    return this.resource.resolve(value);
  }
}
