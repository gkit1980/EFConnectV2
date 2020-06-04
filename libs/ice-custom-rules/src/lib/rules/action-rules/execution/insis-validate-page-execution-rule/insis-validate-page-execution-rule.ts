import { ExecutionRule, IcePage } from '@impeo/ice-core';

export class InsisValidatePageExecutionRule extends ExecutionRule {
  //
  //
  async execute(actionContext?: any): Promise<any> {
    const validationItem = this.requireParam('what');

    const page: IcePage =
      validationItem === 'currentPage' ? this.iceModel.navigation.currentPage : this.requirePage();

    page.validation.reset();

    await page.validation.validate();

    page.triggerComponentValidation();

    if (page.validation.hasMessages) throw new Error('Page is not valid!');
  }
}
