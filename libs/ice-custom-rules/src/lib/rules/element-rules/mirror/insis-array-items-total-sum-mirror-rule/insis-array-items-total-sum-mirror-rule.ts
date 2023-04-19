import * as _ from 'lodash';
import { MirrorRule, IceElement, IndexedValue, IceConsole, ArrayElement } from '@impeo/ice-core';
//
//
export class InsisArrayItemTotalSumMirrorRule extends MirrorRule {
  //
  //
  protected getOriginElements(): IceElement[] {
    const originElements: IceElement[] = [];
    originElements.push(this.requireElement('originElement'));
    if (this.getParam('conditionElement')) originElements.push(this.getElement('conditionElement'));
    return originElements;
  }

  //
  onElementValueChange(value: IndexedValue): void {
    const originElementValues = this.requireElement('originElement').getValue().values;
    const conditionElementValues = this.getParam('conditionElement')
      ? this.getElement('conditionElement').getValue().values
      : null;
    let sum = 0;
    originElementValues.forEach((element, index) => {
      if (
        !conditionElementValues ||
        conditionElementValues[index].value === this.getParam('conditionValue', null)
      )
        sum += element.value;
    });
    this.element.setSimpleValue(sum);
  }
}
