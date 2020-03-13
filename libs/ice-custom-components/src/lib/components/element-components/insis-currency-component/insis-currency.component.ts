import { IceCurrencyComponent } from '@impeo/ng-ice';
import { Component } from '@angular/core';
import { IndexedValue } from '@impeo/ice-core';
import { CurrencyPipe } from '@angular/common';
@Component({
  selector: 'insis-currency',
  templateUrl: './insis-currency.component.html'
})
export class InsisCurrencyComponent extends IceCurrencyComponent {
  static componentName = 'InsisCurrency';
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
    this.value = `${value} ${this.currencyCode}`;
  }

  //
  //
  protected getSupportedTypes(): string[] {
    return ['currency'];
  }
}
