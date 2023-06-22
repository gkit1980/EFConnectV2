import { ExecutionRule } from "@impeo/ice-core";
import * as _ from "lodash";


export class EclaimsDetailsLeaveDocsCloseDialogRule extends ExecutionRule {
  async execute(): Promise<void> {
    try {

      this.iceModel.elements["eclaims.details.close.dialog.status"].setSimpleValue(true);
      this.iceModel.elements["eclaims.process.exit.trigger"].setSimpleValue(false);

    }
    catch (error) {
      console.error(error);
    }
  }
}
