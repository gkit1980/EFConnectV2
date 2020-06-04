import { MirrorRule, IceElement, IndexedValue, ValueOrigin } from '@impeo/ice-core';

export class InsisGetFirstValueFromElementThatsInsideArray extends MirrorRule {
  protected getOriginElements(): IceElement[] {
    return [this.requireElement('originElement')];
  }

  protected onElementValueChange(value: IndexedValue): void {
    const originElement = value.element;
    const firstValue = originElement.getValue().forIndex([0]);
    const newElementValue = firstValue || '';
    const newElementIndexedValue = new IndexedValue(
      this.element,
      newElementValue,
      null,
      ValueOrigin.INTERNAL
    );
    //this.element.setValue(newElementIndexedValue);  //Obviously there is a bug in the setValue method !!!
    this.element.setSimpleValue(newElementValue);
  }
}
