import { Component } from '@angular/core';
import { SectionComponentImplementation } from '@impeo/ng-ice';
import { first, get } from 'lodash';
import { ItemElement } from '@impeo/ice-core';
import * as moment from 'moment';

@Component({
  selector: 'insis-policy-summary-section',
  templateUrl: './insis-policy-summary-section.component.html',
})
export class InsisPolicySummarySectionComponent extends SectionComponentImplementation {
  static componentName = 'InsisPolicySummarySection';

  get type() {
    return get(this.recipe, 'component.InsisPolicySummarySection.type');
  }

  get css() {
    return get(this.recipe, 'component.InsisPolicySummarySection.css');
  }

  get fxFlexValue() {
    const columnsCount: string = get(
      this.recipe,
      'component.InsisPolicySummarySection.columns',
      'two'
    );
    return columnsCount === 'two' ? '50%' : '25%';
  }

  getElementLabel(elementName: string): string {
    return this.runtime.iceResource.resolve(`elements.${elementName}.label`);
  }

  getElementValue(elementName: string, index = [0]): string {
    const element = (this.iceModel.elements[elementName] as unknown) as ItemElement;
    if (!element) return '';
    const value = element.getValue().forIndex(index);
    let displayValue = '';

    // format the date when elements is of type date
    if (element.type === 'date') {
      displayValue = moment(value).format(
        this.resource.resolve('formats.date.default', 'YYYY-MM-DD')
      );

      /// get display value instead of actual value when the element is DropDown or similar
    } else if (element.valuesRule) {
      const options = element.valuesRule.getOptions(null);
      displayValue =
        // option.value is string, and element.value is number that's why we need to use == insted of ===
        // tslint:disable-next-line:triple-equals
        first(options.filter((option) => option.value == value).map((option) => option.label)) ||
        value;
    } else {
      displayValue = value;
    }

    return displayValue;
  }

  getArrayElementIndexes(elementName: string, index = [0]): number[] {
    const element = this.iceModel.elements[elementName];
    if (!element) return [];
    return element
      .getValue()
      .forIndex(index)
      .map((_, i) => i);
  }

  formatIBAN(iban: string): string {
    const ibanCharArray = iban.split('');
    for (let i = 4; i < ibanCharArray.length - 4; i++) {
      if (i < 8) ibanCharArray[i] = '*';
      else ibanCharArray[i] = null;
    }
    return ibanCharArray.join('');
  }
}
