import { IceCurrencyComponent } from '@impeo/ng-ice';
import { Component, OnInit } from '@angular/core';
import { IndexedValue } from '@impeo/ice-core';
import { clone, defaults, get } from 'lodash';

@Component({
  selector: 'insis-currency',
  templateUrl: './insis-currency.component.html',
})
export class InsisCurrencyComponent extends IceCurrencyComponent implements OnInit {
  static componentName = 'InsisCurrency';

  options: any;

  ngOnInit() {
    super.ngOnInit();
  }

  //
  //
  onBlur(): void {
    let value = this.getComponentValue();

    if (!value || !value.length || (typeof value === 'string' && value.trim().length === 0)) {
      value = '';
    }

    value = get(value.split(/\s+/g), [0], '');
    this.value = Number(value);

    this.onComponentValueChange();
    this.setComponentValue(value);
  }

  //
  //
  protected get currencyCode(): string {
    let currencyElementName = this.element.name.substr(0, this.element.name.lastIndexOf('.'));
    currencyElementName = currencyElementName + '.currency';
    currencyElementName = this.getRecipeParam('currencyElementName', currencyElementName);
    if (!this.context.iceModel.elements[currencyElementName])
      return this.resource.resolve('currency-code');
    const index = IndexedValue.sliceIndexToElementLevel(currencyElementName, this.index);
    return this.context.iceModel.elements[currencyElementName].getValue().forIndex(index);
  }

  setComponentValue(value: any): void {
    this.value = `${value || 0} ${this.currencyCode}`;
  }

  //
  //
  protected getSupportedTypes(): string[] {
    return ['currency'];
  }
}
