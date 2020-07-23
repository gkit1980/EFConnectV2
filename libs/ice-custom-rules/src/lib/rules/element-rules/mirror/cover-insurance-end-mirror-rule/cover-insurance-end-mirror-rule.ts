import { MirrorRule, IceElement, IndexedValue, ValueOrigin } from '@impeo/ice-core';
import * as moment from 'moment';

export class CoverInsuranceEndMirrorRule extends MirrorRule {
  protected getOriginElements(): IceElement[] {
    const originElements: IceElement[] = [];
    originElements.push(this.requireElement('dateOfBirth'));
    originElements.push(this.requireElement('endElement'));
    return originElements;
  }

  protected onElementValueChange(value: IndexedValue): void {
    const endElement = this.requireElement('endElement');
    const endElementIndex = IndexedValue.sliceIndexToElementLevel(endElement.name, value.index);
    const insuranceEnd = endElement.getValue().forIndex(endElementIndex);
    const maxEndAge = this.requireParam('maxEndAge');
    let endDate;

    this.element.getValue().values.forEach((cover) => {
      const birthDate = this.requireElement('dateOfBirth').getValue().forIndex(cover.index);
      const currentBirthDate = moment(birthDate);

      const monthsAtInsuranceEnd = moment(insuranceEnd).diff(currentBirthDate, 'months');
      const monthsAtMaxEndAge = maxEndAge * 12;

      if (monthsAtMaxEndAge > monthsAtInsuranceEnd) {
        endDate = moment(insuranceEnd).add(1, 'day').subtract(1, 'minute').toDate();
      } else {
        endDate = moment(currentBirthDate)
          .add(monthsAtMaxEndAge, 'months')
          .subtract(1, 'minute')
          .toDate();
      }

      const newIndexedValue = new IndexedValue(
        this.element,
        endDate,
        cover.index,
        ValueOrigin.INTERNAL
      );
      this.element.setValue(newIndexedValue);
    });
  }
}
