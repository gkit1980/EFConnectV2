import { MirrorRule, IceElement, IndexedValue, ValueOrigin } from '@impeo/ice-core';
import * as moment from 'moment';

export class InsisInsuranceDateAndDurationMirrorRule extends MirrorRule {
  protected getOriginElements(): IceElement[] {
    return [
      this.requireElement('startDateElement'),
      this.requireElement('durationElement'),
      this.requireElement('durationUnitElement'),
    ];
  }

  protected onElementValueChange(value: IndexedValue): void {
    this.setElementValueToBeautifiedStartAndDuration(value.index);
  }

  private setElementValueToBeautifiedStartAndDuration(index: number[]) {
    let startDate = this.requireElement('startDateElement').getValue().forIndex(index);

    if (!startDate) {
      return;
    }

    startDate = moment(startDate);
    const duration = this.requireElement('durationElement').getValue().forIndex(index);

    if (!duration) {
      return;
    }

    const listNameForDurationUnit = this.requireParam('durationUnitList');
    const listForDurationUnit = this.requireList(listNameForDurationUnit);

    let durationUnit = this.requireElement('durationUnitElement').getValue().forIndex(index);

    if (!durationUnit) {
      return;
    }

    durationUnit = listForDurationUnit.getItem(durationUnit);
    const locale = this.context.runtime.locale;
    durationUnit = durationUnit[`label_${locale}`];

    let dateFormat = this.requireParam('dateFormat');
    dateFormat = dateFormat || 'YYYY.MM.DD';

    const newIndexedValue = new IndexedValue(
      this.element,
      `${startDate.format(dateFormat)}, ${duration} ${durationUnit}`,
      index,
      ValueOrigin.INTERNAL
    );
    this.element.setValue(newIndexedValue);
  }
}
