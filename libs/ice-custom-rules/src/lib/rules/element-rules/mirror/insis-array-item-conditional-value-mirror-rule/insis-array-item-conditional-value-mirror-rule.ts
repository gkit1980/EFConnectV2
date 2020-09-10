import * as _ from 'lodash';
import { MirrorRule, IceElement, IndexedValue, IceConsole, ArrayElement } from '@impeo/ice-core';
//
//
export class InsisArrayItemConditionalValueMirrorRule extends MirrorRule {
  //
  //
  protected getOriginElements(): IceElement[] {
    const originElements: IceElement[] = [];
    originElements.push(this.requireElement('originElement'));
    return originElements;
  }

  //
  onElementValueChange(value: IndexedValue): void {
    const originElementValue = this.requireElement('originElement').getValue().values[0].value;

    const conditionalArrayItemValue = this.requireElement('conditionalArrayItem').getValue().values;

    const mirroredArrayItemValue = this.requireElement('mirroredArrayItem').getValue().values;

    const index = conditionalArrayItemValue.findIndex(
      (indexedValue) => indexedValue.value === originElementValue
    );

    this.element.setSimpleValue(index >= 0 ? mirroredArrayItemValue[index].value : null);
  }
}
