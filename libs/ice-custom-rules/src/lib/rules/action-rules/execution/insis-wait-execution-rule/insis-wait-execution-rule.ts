import { ExecutionRule } from '@impeo/ice-core';

//
//
export class InsisWaitExecutionRule extends ExecutionRule {
  //
  //
  execute(actionContext?: any): Promise<void> {
    const waitPeriodInMilliseconds = Number(this.requireParam('waitPeriod'));
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, waitPeriodInMilliseconds);
    });
  }
}
