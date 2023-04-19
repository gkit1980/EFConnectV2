import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { SectionComponentImplementation, IceSectionComponent } from '@impeo/ng-ice';
import { ItemElement, ViewModeRule } from '@impeo/ice-core';
import { get, toString, forEach, map, compact } from 'lodash';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'insis-premium-summary-section',
  templateUrl: './insis-premium-summary-section.component.html',
})
export class InsisPremiumSummarySection extends SectionComponentImplementation
  implements OnInit, OnDestroy {
  static componentName = 'InsisPremiumSummarySection';
  totalElementSubscriptions: Subscription[] = [];
  premiumAmount = 0;

  premiumCategoryTitleResourceKey: string;
  taxesAndFeesCategoryTitleResourceKey: string;
  discountsAndLoadingsCategoryTitleResourceKey: string;
  expanded: boolean;

  @HostBinding('class.premium-section-for-agent')
  isPopup = false;

  isVisible = true;

  printButtonElementName: string;

  public registerTotalElementsChange() {
    this.unregisterTotalElementsChange();
    this.totalElementSubscriptions = [];
    const activePremiumElements: string[] = new Array<string>();
    this.premiumElements.forEach((premiumElement) => {
      activePremiumElements.push(
        this.activeElementNameBase
          ? this.getActivePremiumElement2(premiumElement)
          : this.getActivePremiumElement(premiumElement)
      );
    });
    const elementNames = [
      ...this.premiumElements,
      ...activePremiumElements,
      ...this.taxElements,
      ...this.discountElements,
    ];
    elementNames.forEach((elementName) => {
      const element = this.context.iceModel.elements[elementName];
      if (element) {
        const subscription = element.$dataModelValueChange.subscribe(() => {
          this.calculatePremiums();
        });
        this.totalElementSubscriptions.push(subscription);
      }
    });
  }

  // If premium element is array item, eg:
  // policy.insured.person-objects~cover.critic-ill.premium-with-label
  // we assume that element that controls if this premium is active is:
  // policy.insured.person-objects~cover.critic-ill.active
  public getActivePremiumElement(name): string {
    const parts = name.split('.');
    parts.pop();
    parts.push('active');
    return parts.join('.');
  }

  // If premium element is not an array item, eg:
  // policy.cover.mtpl.total-premium-with-label
  // and 'activeElementNameBase' param is set in the recipe, eg:
  // policy.insured.vehicle-objects~cover
  // we assume that element that controls if this premium is active is:
  // policy.insured.vehicle-objects~cover.mtp.active
  public getActivePremiumElement2(name): string {
    const parts = name.split('.');
    parts.pop();
    const coverName = parts.pop();
    return `${this.activeElementNameBase}.${coverName}.active`;
  }

  public unregisterTotalElementsChange() {
    this.totalElementSubscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  private calculatePremiums() {
    let amount = 0;
    this.premiumElements.forEach((elementName) => {
      if (this.isArrayItemElement(elementName)) {
        const element = this.iceModel.elements[elementName];

        forEach(element.getValue().values, (value) => {
          const index = value.index;
          const activeElementName = this.getActivePremiumElement(elementName);
          const activeElement = this.iceModel.elements[activeElementName];
          if (activeElement && activeElement.getValue().forIndex(index)) {
            const elementValue = value.value;
            amount += elementValue;
          }
        });
      } else {
        const element = this.iceModel.elements[elementName];
        const elementValue = element.getValue().values[0].value;
        amount += elementValue;
      }
    });

    this.premiumAmount = amount;
  }

  get css() {
    return get(this.recipe, 'component.InsisPremiumSummarySection.css');
  }

  get activeElementNameBase() {
    return get(
      this.recipe,
      ['component', InsisPremiumSummarySection.componentName, 'activeElementNameBase'],
      null
    );
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

  get paymentFrequencyLabelElementName() {
    const paymentsFrequencyName = get(this.recipe, [
      'component',
      InsisPremiumSummarySection.componentName,
      'paymentFrequencyElementLabel',
    ]);
    return paymentsFrequencyName;
  }

  get paymentFrequencyValue() {
    const paymentsFrequencyName = get(this.recipe, [
      'component',
      InsisPremiumSummarySection.componentName,
      'paymentFrequencyElement',
    ]);
    const element = get(this.context.iceModel.elements, paymentsFrequencyName);
    if (element) {
      return element.getValue().forIndex(null);
    }
    return 1;
  }

  get premiumAmountTotal(): number {
    return this.premiumAmount * this.paymentFrequencyValue;
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

    this.registerTotalElementsChange();
    this.calculatePremiums();
  }

  ngOnDestroy() {
    this.unregisterTotalElementsChange();
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
