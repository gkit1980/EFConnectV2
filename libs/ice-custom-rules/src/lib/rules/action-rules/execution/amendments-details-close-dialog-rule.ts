import { ExecutionRule } from "@impeo/ice-core";
import * as _ from "lodash";

export class AmendmentsDetailsCloseDialogRule extends ExecutionRule {
  async execute(): Promise<void> {
    try {
      var redirectUrl = this.iceModel.elements["amendments.dialog.fail.okbtn"].recipe.redirectUrl;
      this.iceModel.elements["amendments.details.close.dialog.status"].setSimpleValue(true);
      window.location.href = redirectUrl;

    }
    catch (error) {
      console.error(error);
    }
  }
}
