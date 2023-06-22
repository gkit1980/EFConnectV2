import { ExecutionRule } from "@impeo/ice-core";
import * as _ from "lodash";


export class PropertyNotificationDetailsChangeStepRule extends ExecutionRule {
  async execute(): Promise<void> {
    try {
      let step = this.iceModel.elements["property.claim.step"].getValue().values[0].value;
      switch (step) {
        case 3:
            let actionProperty = this.context.iceModel.actions[ "action-property-notification-create-case"];  // executing 3 action rules with spinner
            await actionProperty.executionRules[0].execute();


            await actionProperty.executionRules[1].execute();

            await actionProperty.executionRules[2].execute();

          break;
        default:
          break;
      }
    } catch (error) {
      console.error(error);
    }
  }
}
