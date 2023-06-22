import { ExecutionRule } from "@impeo/ice-core";
import * as _ from "lodash";

export class EclaimsDocumentsCloseDialogRule extends ExecutionRule {
  async execute(): Promise<void> {
    try {

      var redirectUrl = this.iceModel.elements["eclaims.dialog.documents.okbtn"].recipe.redirectUrl;
      this.iceModel.elements["eclaims.documents.dialog.close.status"].setSimpleValue(true);
      window.location.href = redirectUrl;
    }
    catch (error) {
      console.error(error);
    }
  }
}
