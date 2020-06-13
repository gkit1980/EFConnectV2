import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SectionComponentImplementation, IceSectionComponent } from '@impeo/ng-ice';
import { PageElement, ItemElement, ViewModeRule } from '@impeo/ice-core';
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

  printButtonElementName: string;

  get premiumElements(): string[] {
    return this.getElements('premiumElements');
  }

  get taxElements(): string[] {
    return this.getElements('taxesElements');
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
    const options = (paymentPageElement.element as ItemElement).valuesRule.getOptions(null);
    const value = paymentPageElement.element.getValue().forIndex(null);
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
  }

  isArrayItemElement(name: string): boolean {
    return this.iceModel.elements[name].isArrayItem();
  }

  getArrayItems(name: string): any[] {
    const items = [];
    forEach(this.iceModel.elements[name].getValue().values, (value) =>
      items.push({ index: value.index })
    );
    return items;
  }

  areSomeElementsVisible(elementNames: string[]): boolean {
    if (!elementNames) return false;
    const elements = this.getPageElements(elementNames);

    if (elementNames.length !== 0 && elements.length === 0) {
      return true;
    }

    let areNotInvisible = false;
    forEach(elements, (element) => {
      forEach(element.indexedElements, (indexedElement) => {
        const viewMode = element.viewModeRule.getViewMode({
          index: indexedElement.index,
        });
        const resolved = ViewModeRule.resolved[viewMode];
        if (resolved['visible']) areNotInvisible = true;
      });
    });
    return areNotInvisible;
  }

  private getElements(paramName: string): string[] {
    return (
      get(this.recipe, ['component', InsisPremiumSummarySection.componentName, paramName]) || []
    );
  }

  private getPageElements(elementNames: string[]): PageElement[] {
    return compact(map(elementNames, (elementName) => this.section.page.elements[elementName]));
  }
}
