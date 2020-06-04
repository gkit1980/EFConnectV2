import * as _ from 'lodash';
import { MirrorRule, IceElement, IndexedValue } from '@impeo/ice-core';

//
//
export class InsisQRCodeMirrorRule extends MirrorRule {
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
    const originValue = value.value as string;
    const encodedValue = originValue.replace('#', '%23');
    const url = `https://chart.googleapis.com/chart?chs=352x352&cht=qr&choe=UTF-8&chl=${encodedValue}`;
    this.element.setValue(value.elementCopy(this.element, url));
  }
}
