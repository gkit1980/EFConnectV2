import { MirrorRule, IceElement, IndexedValue, ValueOrigin } from '@impeo/ice-core';
import * as _ from 'lodash';

export class InsisResolveElementValueAsResourcePathMirrorRule extends MirrorRule {
  getOriginElements(): IceElement[] {
    const originElements: IceElement[] = [];
    const elementName = this.requireParam('originElement');

    originElements.push(this.iceModel.elements[elementName]);

    return originElements;
  }

  onElementValueChange(value: IndexedValue): void {
    let _value: string;

    this.getOriginElements().forEach((originElement) => {
      const indexForElement = IndexedValue.sliceIndexToElementLevel(
        originElement.name,
        value.index
      );
      _value = originElement.getValue().forIndex(indexForElement);
    });

    this.element.setValue(
      new IndexedValue(
        this.element,
        this.resource.resolve(_value),
        value.index,
        ValueOrigin.INTERNAL
      )
    );
  }
}
