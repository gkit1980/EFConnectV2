import * as _ from 'lodash';
import { MirrorRule, IceElement, IndexedValue, IceConsole, ArrayElement } from '@impeo/ice-core';

//
//
export class GetArrayLengthMirrorRule extends MirrorRule {
  //
  //
  protected getOriginElements(): IceElement[] {
    const originElements: IceElement[] = [];
    originElements.push(this.requireElement('originElement'));
    return originElements;
  }

  //
  onElementValueChange(value: IndexedValue): void {
    if (!(this.requireElement('originElement') instanceof ArrayElement))
      IceConsole.error('Origin element is not an array');
    this.element.setSimpleValue(
      (this.requireElement('originElement') as ArrayElement).getArrayItemElements().length
    );
  }
}
