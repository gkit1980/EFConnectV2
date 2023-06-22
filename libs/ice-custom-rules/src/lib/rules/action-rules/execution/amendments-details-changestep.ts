import { ExecutionRule } from "@impeo/ice-core";
import * as _ from "lodash";
declare let ga: Function;

export class AmendmentsDetailsChangestep extends ExecutionRule {
  async execute(): Promise<void> {
    try {
      let step = this.iceModel.elements[
        "amendments.details.step.status"
      ].getValue().values[0].value;
      switch (step) {
        case 0:
          this.context.iceModel.elements[
            "amendments.details.step.status"
          ].setSimpleValue(
            this.context.iceModel.elements[
              "amendments.details.step.status"
            ].getValue().values[0].value + 1
          );
          break;
        case 1:
          this.context.iceModel.elements[
            "amendments.details.step.status"
          ].setSimpleValue(
            this.context.iceModel.elements[
              "amendments.details.step.status"
            ].getValue().values[0].value + 1
          );
          break;
        case 2:
          //console.log("branch to details-changeStep", this.iceModel.elements["selectedcontractbranch"].getValue().values[0].value);
          if(this.iceModel.elements["selectedcontractbranch"].getValue().values[0].value == "3"){
            let action = this.context.iceModel.actions[ "action-amendments-create-case"];  // executing 3 action rules with spinner
            await action.executionRules[0].execute();


            await action.executionRules[1].execute();

            await action.executionRules[2].execute();



            let action2 = this.context.iceModel.actions["action-amendments-uploadfiles"];  // executing 3 action rules with spinner
            await action2.executionRules[0].execute();


            await action2.executionRules[1].execute();


            await  action2.executionRules[2].execute();

          }else if(this.iceModel.elements["selectedcontractbranch"].getValue().values[0].value == "15"){
            let actionLife = this.context.iceModel.actions[ "action-amendments-create-life-case"];  // executing 3 action rules with spinner
            await actionLife.executionRules[0].execute();


            await actionLife.executionRules[1].execute();


            await actionLife.executionRules[2].execute();



            let action2 = this.context.iceModel.actions["action-amendments-uploadfiles"];  // executing 3 action rules with spinner
            await  action2.executionRules[0].execute();

            await action2.executionRules[1].execute();
            await  action2.executionRules[2].execute();

          }else if(this.iceModel.elements["selectedcontractbranch"].getValue().values[0].value == "1"){
            let actionLife = this.context.iceModel.actions[ "action-amendments-create-health-case"];  // executing 3 action rules with spinner
            await actionLife.executionRules[0].execute();

            await actionLife.executionRules[1].execute();

            await actionLife.executionRules[2].execute();



            let action2 = this.context.iceModel.actions["action-amendments-uploadfiles"];  // executing 3 action rules with spinner
            await action2.executionRules[0].execute();


            await action2.executionRules[1].execute();


           await action2.executionRules[2].execute();

          }else if(this.iceModel.elements["selectedcontractbranch"].getValue().values[0].value == "2" || this.iceModel.elements["selectedcontractbranch"].getValue().values[0].value == "11"){
            let actionLife = this.context.iceModel.actions[ "action-amendments-create-finance-case"];  // executing 3 action rules with spinner
              await actionLife.executionRules[0].execute();


            await actionLife.executionRules[1].execute();


            await actionLife.executionRules[2].execute();



            let action2 = this.context.iceModel.actions["action-amendments-uploadfiles"];  // executing 3 action rules with spinner
            await action2.executionRules[0].execute();


            await action2.executionRules[1].execute();


            await action2.executionRules[2].execute();

          }else {
            let actionProperty = this.context.iceModel.actions[ "action-amendments-create-property-case"];  // executing 3 action rules with spinner
            await actionProperty.executionRules[0].execute();


            await actionProperty.executionRules[1].execute();


            await actionProperty.executionRules[2].execute();

          }

          if (this.iceModel.elements["amendments.salesforce.success"].getValue().forIndex(null) == true)
            this.context.iceModel.elements["amendments.details.step.status"].setSimpleValue(10);
          //success dialog
          else
            this.context.iceModel.elements["amendments.details.step.status"].setSimpleValue(11); //fail dialog
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(error);
    }
  }
}
