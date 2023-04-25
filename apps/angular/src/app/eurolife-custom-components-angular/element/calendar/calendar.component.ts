import { Component } from '@angular/core';
import { ElementComponentImplementation } from '@impeo/ng-ice';
import { NgbDateStruct, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { ItemElement } from '@impeo/ice-core';
//import { d } from '@angular/core/src/render3';

@Component({
  selector: 'calendar.mixin.scss',
  templateUrl: './calendar.component.html'
})
export class CalendarComponent extends ElementComponentImplementation {

  static componentName = 'Calendar';

  dateValue: NgbDateStruct;

  //
  //
  get maxDate(): NgbDateStruct {
    if ((<ItemElement>this.element).rangeRule == null) return null;
    const maxValue  = ((<ItemElement>this.element).rangeRule.getMax)[0];
    return this.convertToNgbDateStruct(maxValue);
  }

  //
  //
  get minDate(): NgbDateStruct {
    if ((<ItemElement>this.element).rangeRule == null) return null;
    const minValue = ((<ItemElement>this.element).rangeRule.getMin)[0];
    return this.convertToNgbDateStruct(minValue);
  }

  change(date: NgbDate): void {
    const selectedDate = date != null ? new Date(date.year, date.month - 1, date.day) : null;
    this.setComponentValue(selectedDate);
    this.onComponentValueChange();
  }

  //
  //
  private convertToNgbDateStruct(date: Date | null): NgbDateStruct {
    if (date == null) return null;
    return {
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear()
    };
  }

  //
  //
  protected getSupportedTypes(): string[] { return ['date']; }
}
