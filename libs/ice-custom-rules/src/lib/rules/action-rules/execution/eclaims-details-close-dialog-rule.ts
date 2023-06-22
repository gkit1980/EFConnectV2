import { ExecutionRule } from "@impeo/ice-core";
import * as _ from "lodash";


export class EclaimsDetailsCloseDialogRule extends ExecutionRule {
  async execute(): Promise<void> {
    try {


      //reset arrays and elements
      this.iceModel.elements['eclaims.requests.inprogress.array'].reset(null);
      this.iceModel.elements['eclaims.requests.open.array'].reset(null);
      this.iceModel.elements['eclaims.requests.closed.array'].reset(null);

      this.iceModel.elements['eclaims.valuation.open.requests'].setSimpleValue(false);
      this.iceModel.elements['eclaims.valuation.closed.requests'].setSimpleValue(false);
      this.iceModel.elements['eclaims.valuation.inprogress.requests'].setSimpleValue(false);


      var redirectUrl = this.iceModel.elements["eclaims.dialog.success.okbtn"].recipe.redirectUrl;
      this.iceModel.elements["eclaims.details.close.dialog.status"].setSimpleValue(true);
      window.location.href = redirectUrl;


    }
    catch (error) {
      console.error(error);
    }
  }
}
