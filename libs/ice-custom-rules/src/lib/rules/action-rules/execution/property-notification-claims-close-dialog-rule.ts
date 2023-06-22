import { ExecutionRule } from "@impeo/ice-core";
import * as _ from "lodash";

export class PropertyNotificationClaimsCloseDialogRule extends ExecutionRule {
  async execute(): Promise<void> {
    try {
      var redirectUrl = this.action.recipe.redirectUrl;
      this.iceModel.elements["property.claims.close.dialog.status"].setSimpleValue(true);

     // Clen up vars
     this.iceModel.elements['property.claims.requests.inprogress'].reset(null);
     this.iceModel.elements['property.claims.valuation.inprogress.requests'].setSimpleValue(false);


      window.location.href = redirectUrl;

    }
    catch (error) {
      console.error(error);
    }
  }
}
