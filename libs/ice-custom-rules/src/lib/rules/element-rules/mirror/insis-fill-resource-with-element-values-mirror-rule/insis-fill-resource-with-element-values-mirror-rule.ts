import { MirrorRule, IceElement, IndexedValue, ValueOrigin } from '@impeo/ice-core';
import * as _ from 'lodash';

export class InsisFillResourceWithElementValuesMirrorRule extends MirrorRule {
  getOriginElements(): IceElement[] {
    const originElements: IceElement[] = [];
    const allElements = this.requireParam('elements');

    allElements.forEach((elementName: string) => {
      originElements.push(this.iceModel.elements[elementName]);
    });

    return originElements;
  }

  onElementValueChange(value: IndexedValue): void {
    const paramList: any = {};

    this.getOriginElements().forEach((originElement, index) => {
      const _value = originElement.getValue().values[0].value;
      if (originElement.type === 'date')
        paramList[`param${index + 1}`] = this.resource.format(<Date>_value);
      else paramList[`param${index + 1}`] = _value;
    });

    this.element.setValue(
      new IndexedValue(
        this.element,
        this.resource.resolve(this.requireParam('resourceKey'), paramList),
        null,
        ValueOrigin.INTERNAL
      )
    );
  }
}
