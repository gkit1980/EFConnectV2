import * as _ from 'lodash';
import { MirrorRule, IceElement, IndexedValue } from '@impeo/ice-core';

//
//
export class InsisExtractFileNameMirrorRule extends MirrorRule {
  //
  //
  protected getOriginElements(): IceElement[] {
    const originElements: IceElement[] = [];
    originElements.push(this.requireElement('originElement'));
    return originElements;
  }

  //
  //
  protected onElementValueChange(value: IndexedValue): void {
    const pathToFile = value.value as string;
    const fileName = pathToFile.split('/').pop();
    this.element.setValue(value.elementCopy(this.element, fileName));
  }
}
