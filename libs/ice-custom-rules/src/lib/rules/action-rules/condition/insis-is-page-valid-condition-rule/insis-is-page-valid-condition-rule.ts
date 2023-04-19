import { ConditionRule, ValidationMessages } from '@impeo/ice-core';

export class InsisIsPageValidConditionRule extends ConditionRule {
  evaluate(actionContext?: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const page = this.requirePage();
      const validationMessages = new ValidationMessages();
      page.validate(validationMessages).then(() => {
        resolve(!validationMessages.hasMessages);
      });
    });
  }
}
