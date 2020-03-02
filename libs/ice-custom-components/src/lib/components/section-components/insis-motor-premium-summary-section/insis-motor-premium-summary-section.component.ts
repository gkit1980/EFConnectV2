import { Component, OnInit } from '@angular/core';
import { SectionComponentImplementation } from '@impeo/ng-ice';
import _ from 'lodash';
import { ItemElement } from '@impeo/ice-core';
import { SummarySectionDetailItem } from '../../shared-components/insis-summary-section-detail-container/summary-section-detail-item';

@Component({
  selector: 'insis-motor-premium-summary-section',
  templateUrl: './insis-motor-premium-summary-section.component.html'
})
export class InsisMotorPremiumSummarySection extends SectionComponentImplementation
  implements OnInit {
  static componentName = 'InsisMotorPremiumSummarySection';

  expanded: boolean;

  private _period: string;

  private _premiumItems = [];
  private _taxesAndFeesItems = [];
  private _discountItems = [];

  /**
   * function that gets all premiums and can be called once every second.
   */
  private calculatePremiumItemsThrottled = _.throttle(() => {
    const premiums = this.getArrayElementIndexes('policy.insured.vehicle-objects').map(i => {
      const motor = this.getPremiumItemForVehicle(i, 'mtpl');
      const owndamage = this.getPremiumItemForVehicle(i, 'owndamage');
      const pa = this.getPremiumItemForVehicle(i, 'pa');
      const roadAssis = this.getPremiumItemForVehicle(i, 'road_assis');
      const vandalism = this.getPremiumItemForVehicle(i, 'vandalism');
      return [motor, owndamage, pa, roadAssis, vandalism].filter(value => value);
    });
    return (this._premiumItems = _.flatten(premiums));
  }, 2000);

  /**
   * throttled (is going to execute its body only one time per 2 second) function that gets all taxes and fees
   */
  private calculateTaxesAndFeesItemsThrottled = _.throttle(() => {
    const taxesAndFees = this.getArrayElementIndexes('policy.insured.vehicle-objects').map(i => {
      return [
        ...this.getTaxesItemsForVehicle(i, 'mtpl'),
        ...this.getTaxesItemsForVehicle(i, 'owndamage'),
        ...this.getTaxesItemsForVehicle(i, 'pa'),
        ...this.getTaxesItemsForVehicle(i, 'road_assis'),
        ...this.getTaxesItemsForVehicle(i, 'vandalism'),
        ...this.getContractTaxes()
      ];
    });

    this._taxesAndFeesItems = _.flatten(taxesAndFees).filter(
      taxOrFee => taxOrFee.amount && taxOrFee.amount !== 0
    );
  }, 2000);

  /**
   * throttled (is going to execute its body only one time per 2 second) function that gets all discounts.
   */
  private calculateDiscountItemsThrottled = _.throttle(() => {
    this._discountItems = [
      ...this.getContractDiscounts(),
      ...this.getDiscountsForAllVehicles(),
      ...this.getCoverDiscountsForAllVehicles()
    ].filter(discountOrLoad => discountOrLoad.amount && discountOrLoad.amount !== 0);
  }, 2000);

  /**
   * throttled function that converts payment, for each period, to text
   */
  private calculatePeriodThrottled = _.throttle(() => {
    const evaluationResult = this.iceModel.dts['payment-to-summary-panel-payment'].evaluateSync();
    const listPath = evaluationResult['output'];
    this._period = this.context.iceResource.resolve(listPath, '');
  });

  ngOnInit() {
    super.ngOnInit();
    this.expanded = _.get(
      this.recipe,
      `component.${InsisMotorPremiumSummarySection.componentName}.expanded`,
      false
    );
  }

  /**
   * Gets all premiums
   */
  get premiumItems(): SummarySectionDetailItem[] {
    this.calculatePremiumItemsThrottled();
    return this._premiumItems;
  }

  /**
   * Gets premium for vehicle with index and cover
   * @param vehicleIndex vehicle-object index
   * @param cover cover name. 'mtpl' for example
   */
  private getPremiumItemForVehicle(vehicleIndex: number, cover: string): SummarySectionDetailItem {
    const elementName = `policy.insured.vehicle-objects~cover.${cover}`;
    const isPremiumActive = this.getElementValue(`${elementName}.active`, [vehicleIndex]);

    if (!isPremiumActive) {
      return null;
    }

    return {
      title: this.context.iceResource.resolve(
        `policy.covers.short-name-to-long-name.${cover}`,
        cover
      ),
      amount: this.getElementValue(`${elementName}.premium`, [vehicleIndex]),
      currency: this.getElementValue(`${elementName}.currency`, [vehicleIndex])
    };
  }

  /**
   * Gets all taxes and fees
   */
  get taxesAndFeesItems(): SummarySectionDetailItem[] {
    this.calculateTaxesAndFeesItemsThrottled();
    return this._taxesAndFeesItems;
  }

  /**
   * Gets all taxes for vehicle with index
   * @param vehicleIndex vehicle-object index
   * @param cover cover name. 'mtpl' for example
   */
  private getTaxesItemsForVehicle(vehicleIndex: number, cover: string): SummarySectionDetailItem[] {
    const elementName = `policy.insured.vehicle-objects~cover.${cover}`;
    const isPremiumActive = this.getElementValue(`${elementName}.active`, [vehicleIndex]);

    if (!isPremiumActive) {
      return [];
    }

    const taxes = this.getArrayElementIndexes(`${elementName}.taxes`, [vehicleIndex]).map(i => {
      const taxType = this.getElementValue(`${elementName}.taxes~type`, [vehicleIndex, i]);
      const taxAmount = this.getElementValue(`${elementName}.taxes~amount`, [vehicleIndex, i]);
      return {
        title: taxType,
        amount: taxAmount,
        currency: null
      };
    });

    return taxes.filter(tax => tax);
  }

  /**
   * Gets all taxes from the contract
   */
  private getContractTaxes(): SummarySectionDetailItem[] {
    const taxes = this.getArrayElementIndexes('policy.contract.taxes').map(i => {
      const type = this.getElementValue('policy.contract.taxes~type', [i]);
      const amount = this.getElementValue('policy.contract.taxes~amount', [i]);
      return {
        title: type,
        amount: amount,
        currency: this.getElementValue('policy.insured.currency')
      };
    });
    return taxes;
  }

  /**
   * Gets all discounts
   */
  get discountItems(): SummarySectionDetailItem[] {
    this.calculateDiscountItemsThrottled();
    return this._discountItems;
  }

  /**
   * Gets all contract discounts
   */
  private getContractDiscounts(): SummarySectionDetailItem[] {
    const discounts = this.getArrayElementIndexes('policy.contract.discounts').map(i => {
      const type = this.getElementValue('policy.contract.discounts~type', [i]);
      const amount = this.getElementValue('policy.contract.discounts~amount', [i]);
      return {
        title: type,
        amount: amount,
        currency: this.getElementValue('policy.insured.currency')
      };
    });
    return discounts;
  }

  /**
   * Gets all discounts for all vehicles
   */
  private getDiscountsForAllVehicles(): SummarySectionDetailItem[] {
    const discounts = this.getArrayElementIndexes('policy.insured.vehicle-objects').map(
      vehicleIndex => {
        return this.getArrayElementIndexes(`policy.insured.vehicle-objects~discounts`, [
          vehicleIndex
        ])
          .map(i => {
            const discountType = this.getElementValue(
              `policy.insured.vehicle-objects~discounts~type`,
              [vehicleIndex, i]
            );
            const discountAmount = this.getElementValue(
              `policy.insured.vehicle-objects~discounts~amount`,
              [vehicleIndex, i]
            );
            return <SummarySectionDetailItem>{
              title: discountType,
              amount: discountAmount,
              currency: this.currency
            };
          })
          .filter(discount => discount);
      }
    );
    return _.flatten(discounts);
  }

  /**
   * Gets all discounts for activated covers in all vehicles
   */
  private getCoverDiscountsForAllVehicles(): SummarySectionDetailItem[] {
    const discounts = this.getArrayElementIndexes('policy.insured.vehicle-objects').map(i => {
      return [
        ...this.getCoverDiscountForVehicle(i, 'mtpl'),
        ...this.getCoverDiscountForVehicle(i, 'owndamage'),
        ...this.getCoverDiscountForVehicle(i, 'pa'),
        ...this.getCoverDiscountForVehicle(i, 'road_assis'),
        ...this.getCoverDiscountForVehicle(i, 'vandalism')
      ];
    });
    return _.flatten(discounts);
  }

  /**
   * Gets all discounts for all vehicles of certain cover
   * @param vehicleIndex vehicle-objects index
   * @param cover
   */
  private getCoverDiscountForVehicle(
    vehicleIndex: number,
    cover: string
  ): SummarySectionDetailItem[] {
    const elementName = `policy.insured.vehicle-objects~cover.${cover}`;
    const isPremiumActive = this.getElementValue(`${elementName}.active`, [vehicleIndex]);

    if (!isPremiumActive) {
      return [];
    }

    const discounts = this.getArrayElementIndexes(`${elementName}.discounts`, [vehicleIndex]).map(
      i => {
        const discountType = this.getElementValue(`${elementName}.discounts~type`, [
          vehicleIndex,
          i
        ]);
        const discountAmount = this.getElementValue(`${elementName}.discounts~amount`, [
          vehicleIndex,
          i
        ]);
        return {
          title: discountType,
          amount: discountAmount,
          currency: this.currency
        };
      }
    );

    return discounts.filter(discount => discount);
  }

  /**
   * is it single payment?
   */
  get singlePayment() {
    return !this.period || this.period.length === 0;
  }

  /**
   * gets total amount that needs to be payed
   */
  get totalAmount() {
    return this.getElementValue('policy.insured.premium.total');
  }

  /**
   * gets how much it needs to be paid per month/quarter/half-year
   */
  get amountPerPayment() {
    const frequency = this.getElementValue('policy.contract.payment.frequency');
    const amountPerPayment = this.totalAmount / frequency;
    //truncation the amount to two decimal places without rounding
    return amountPerPayment - (amountPerPayment % 0.01);
  }

  /**
   * Gets period between each payment
   */
  get period() {
    this.calculatePeriodThrottled();
    return this._period;
  }

  /**
   * gets the currency
   */
  get currency() {
    return this.getElementValue('policy.insured.currency');
  }

  /**
   * gets value of element
   * @param elementName element name
   * @param index element index
   */
  getElementValue(elementName: string, index = [0]) {
    const element = this.iceModel.elements[elementName] as ItemElement;
    const value = element.getValue().forIndex(index);
    return value;
  }

  /**
   * Gets all indexes in array
   * @param elementName element name
   * @param index
   */
  getArrayElementIndexes(elementName: string, index = [0]): number[] {
    const element = this.iceModel.elements[elementName];
    return element
      .getValue()
      .forIndex(index)
      .map((__, i) => i);
  }
}
