import { ExecutionRule } from "@impeo/ice-core";
import * as _ from "lodash";
declare let ga: Function;

export class GreenCardChangeStepRule extends ExecutionRule {
  async execute(): Promise<void> {
    try {
      let step = this.iceModel.elements["greencard.page.index"].getValue().values[0].value;

      switch (step) {
        case 0:
          if (this.iceModel.elements["greencard.motor.security.greenCardNo"].getValue().values[0].value === "-1" ||
              this.iceModel.elements["greencard.motor.security.greenCardNo"].getValue().values[0].value ==null) {
            this.context.iceModel.elements["greencard.page.index"].setSimpleValue(this.context.iceModel.elements["greencard.page.index"].getValue().values[0].value + 1);
          } else if (this.iceModel.elements["greencard.motor.security.greenCardNo"].getValue().values[0].value === undefined) {

          } else {
            let action1 = this.context.iceModel.actions['action-cancel-greencard'];
            await action1.executionRules[0].execute();

            await action1.executionRules[1].execute();
            await action1.executionRules[2].execute();

            //search again
            let action = this.context.iceModel.actions['action-get-active-greencard'];
            await action.executionRules[0].execute();

            //recall the change step
            let action2 = this.context.iceModel.actions['action-greencard-changestep'];
            await action2.executionRules[0].execute();

          }
          break;
        case 1:
          this.context.iceModel.elements["greencard.page.index"].setSimpleValue(this.context.iceModel.elements["greencard.page.index"].getValue().values[0].value + 1);
          break;
        case 2:
          let action = this.context.iceModel.actions['action-issue-greencard'];
          await action.executionRules[0].execute();


          await action.executionRules[1].execute();


          await action.executionRules[2].execute();


          this.context.iceModel.elements["greencard.page.index"].setSimpleValue(this.context.iceModel.elements["greencard.page.index"].getValue().values[0].value + 1);
          break;
        case 3:
          let action2 = this.context.iceModel.actions['action-download-greencard'];
          await action2.executionRules[0].execute();

          await action2.executionRules[1].execute();

          await action2.executionRules[2].execute();

          await action2.executionRules[3].execute();

          break;
        case 10:
          let action1 = this.context.iceModel.actions['action-cancel-greencard'];
          await  action1.executionRules[0].execute();

          await action1.executionRules[1].execute();

          await action1.executionRules[2].execute();

          this.context.iceModel.elements["greencard.page.index"].setSimpleValue(0);
          break;
      }
    }

    catch (error) {
      console.error(error);
    }
  }
}

