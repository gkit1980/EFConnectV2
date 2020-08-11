import { Component, Input, OnInit } from '@angular/core';
import { SectionComponentImplementation } from '@impeo/ng-ice';
import { forEach, get } from 'lodash';
import { IceSection } from '@impeo/ice-core';

@Component({
  selector: 'insis-payments',
  templateUrl: './insis-payments-section.component.html',
})
export class InsisPaymentsSection extends SectionComponentImplementation implements OnInit {
  static componentName = 'InsisPaymentsSection';

  paymentDurationElement: string;
  installmentsElement: string;
  totalElement: string;
  installmentAmountElement: string;
  nextPaymentDateElement: string;
  insuredsSection: IceSection;
  taxesAndFeesSection: IceSection;
  css: string;

  paymentPlanLabel: string;
  taxesAndFeesLabel: string;

  ngOnInit() {
    this.paymentDurationElement = this.getRecipeParam('paymentDurationElement');
    this.installmentsElement = this.getRecipeParam('installmentsElement');
    this.totalElement = this.getRecipeParam('totalElement');
    this.installmentAmountElement = this.getRecipeParam('installmentAmountElement');
    this.nextPaymentDateElement = this.getRecipeParam('nextPaymentDateElement');
    this.insuredsSection = this.buildSection(this.getRecipeParam('insuredsSection'));
    this.taxesAndFeesSection = this.buildSection(this.getRecipeParam('taxesAndFeesSection'));
    this.css = get(this.recipe, `component.${InsisPaymentsSection.componentName}.css`);
    this.paymentPlanLabel = this.resolveResourceFromRecipe('paymentPlanLabel', 'Payment plan');
    this.taxesAndFeesLabel = this.resolveResourceFromRecipe('taxesAndFeesLabel', 'Taxes and fees');
  }

  //
  //
  private resolveResourceFromRecipe(paramName: string, defaultIfNotPresent: string) {
    const resourceKey = this.getRecipeParam(paramName);
    return this.context.iceResource.resolve(paramName, defaultIfNotPresent);
  }

  //
  //
  private buildSection(sectionName: string): IceSection {
    return IceSection.build(
      this.section,
      this.page,
      this.iceModel.recipe.sections[sectionName]
    ) as IceSection;
  }

  //
  //
  private getRecipeParam(paramName: string) {
    return get(this.recipe, ['component', InsisPaymentsSection.componentName, paramName]);
  }
}
