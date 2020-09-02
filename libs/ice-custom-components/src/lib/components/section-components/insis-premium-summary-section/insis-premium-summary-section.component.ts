import { Component, OnInit, HostBinding } from '@angular/core';
import { SectionComponentImplementation, IceSectionComponent } from '@impeo/ng-ice';
import { ItemElement, ViewModeRule } from '@impeo/ice-core';
import { get, toString, forEach, map, compact } from 'lodash';

@Component({
  selector: 'insis-premium-summary-section',
  templateUrl: './insis-premium-summary-section.component.html',
})
export class InsisPremiumSummarySection extends SectionComponentImplementation implements OnInit {
  static componentName = 'InsisPremiumSummarySection';

  premiumCategoryTitleResourceKey: string;
  taxesAndFeesCategoryTitleResourceKey: string;
  discountsAndLoadingsCategoryTitleResourceKey: string;
  expanded: boolean;

  @HostBinding('class.premium-section-for-agent')
  isPopup = false;

  isVisible = true;

  printButtonElementName: string;

  get css() {
    return get(this.recipe, 'component.InsisPremiumSummarySection.css');
  }

  get premiumElements(): string[] {
    return this.getElements('premiumElements');
  }

  get taxElements(): string[] {
    return this.getElements('taxesAndFeesElements');
  }

  get discountElements(): string[] {
    return this.getElements('discountElements');
  }

  get paymentFrequencyElementName() {
    const paymentsFrequencyName = get(this.recipe, [
      'component',
      InsisPremiumSummarySection.componentName,
      'paymentFrequencyElement',
    ]);
    return paymentsFrequencyName;
  }

  get premiumAmount(): number {
    const premimumElementName = get(this.recipe, [
      'component',
      InsisPremiumSummarySection.componentName,
      'premiumElement',
    ]);
    const premimumElement = get(this.iceModel.elements, premimumElementName);
    if (!premimumElement) return null;
    return premimumElement.getValue().forIndex(null);
  }

  get paymentFrequency(): string {
    const paymentsFrequencyName = get(this.recipe, [
      'component',
      InsisPremiumSummarySection.componentName,
      'paymentFrequencyElement',
    ]);

    if (!paymentsFrequencyName) {
      return null;
    }

    const paymentPageElement = get(this.page.elements, paymentsFrequencyName);
    const options = (paymentPageElement as ItemElement).valuesRule.getOptions(null);
    const value = paymentPageElement.getValue().forIndex(null);
    return get(
      options.filter((option) => toString(option.value) === toString(value)),
      '[0].label'
    );
  }

  get currencyISOCode(): string {
    const currencyElementName = get(this.recipe, [
      'component',
      InsisPremiumSummarySection.componentName,
      'currencyElement',
    ]);
    const currencyElement = get(this.iceModel.elements, currencyElementName);
    const currencyElementValue = currencyElement && currencyElement.getValue().forIndex([0]);
    return currencyElementValue || this.resource.resolve('currency-code');
  }

  get locale(): string {
    return this.context.locale;
  }

  constructor(parent: IceSectionComponent) {
    super(parent);
  }

  getLabel(resource: string): string {
    return this.resource.resolve(resource, resource);
  }

  ngOnInit() {
    super.ngOnInit();
    this.printButtonElementName = get(this.recipe, [
      'component',
      InsisPremiumSummarySection.componentName,
      'printElement',
    ]);

    this.premiumCategoryTitleResourceKey = get(
      this.recipe,
      ['component', InsisPremiumSummarySection.componentName, 'premiumsCategoryTitleResourceKey'],
      'premium-summary-section.dues.label'
    );

    this.taxesAndFeesCategoryTitleResourceKey = get(
      this.recipe,
      [
        'component',
        InsisPremiumSummarySection.componentName,
        'taxesAndFeesCategoryTitleResourceKey',
      ],
      'premium-summary-section.taxes-and-fees.label'
    );

    this.discountsAndLoadingsCategoryTitleResourceKey = get(
      this.recipe,
      [
        'component',
        InsisPremiumSummarySection.componentName,
        'discountsAndLoaingsCategoryTitleResourceKey',
      ],
      'premium-summary-section.discounts.label'
    );

    this.expanded = get(
      this.recipe,
      ['component', InsisPremiumSummarySection.componentName, 'expanded'],
      false
    );

    this.isPopup = get(
      this.recipe,
      ['component', InsisPremiumSummarySection.componentName, 'isPopup'],
      false
    );
  }

  toggleVisibility() {
    this.isVisible = !this.isVisible;
  }

  isArrayItemElement(name: string): boolean {
    return this.iceModel.elements[name].isArrayItem();
  }

  getArrayItems(name: string): any[] {
    const items = [];
    forEach(this.iceModel.elements[name].getValue().values, (value) => {
      const isVisible = value.value === 0 ? false : true;
      items.push({ index: value.index, isVisible: isVisible });
    });

    return items;
  }

  elementValueIsNotZero(name: string): boolean {
    const elementValue = this.iceModel.elements[name].getValue().values[0].value;
    return elementValue === 0 ? false : true;
  }

  private getElements(paramName: string): string[] {
    return (
      get(this.recipe, ['component', InsisPremiumSummarySection.componentName, paramName]) || []
    );
  }
}
