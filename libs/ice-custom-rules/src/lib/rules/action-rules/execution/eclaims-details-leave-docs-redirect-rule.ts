import { ExecutionRule } from "@impeo/ice-core";
import * as _ from "lodash";



export class EclaimsDetailsLeaveDocsRedirectRule extends ExecutionRule {
  async execute(): Promise<void> {
    try {

      this.iceModel.elements["eclaims.details.close.dialog.status"].setSimpleValue(true);
      this.iceModel.elements["eclaims.process.exit.trigger"].setSimpleValue(false);

      //reset arrays and elements
      this.iceModel.elements['eclaims.requests.inprogress.array'].reset(null);
      this.iceModel.elements['eclaims.requests.open.array'].reset(null);
      this.iceModel.elements['eclaims.requests.closed.array'].reset(null);

      this.iceModel.elements['eclaims.valuation.open.requests'].setSimpleValue(false);
      this.iceModel.elements['eclaims.valuation.closed.requests'].setSimpleValue(false);
      this.iceModel.elements['eclaims.valuation.inprogress.requests'].setSimpleValue(false);
      //end reset

      // create a pending request,so we have to update the datastore and the field CountEclaimsOpen
      const actName = 'action-eclaims-requests-open';
      const action = this.context.iceModel.actions[actName];
      if (!!action) {
        this.iceModel.executeAction(actName);
      }

      // this.context.iceModel.elements["eclaims.notification.icon.flag"].setSimpleValue(true);




      ////trigger to the next state ...taking the url from guard!!!!!
      this.iceModel.elements["eclaims.step"].setSimpleValue(1);
      this.iceModel.elements["eclaims.process.exit.redirecturl.trigger"].setSimpleValue(true);


    }
    catch (error) {
      console.error(error);
    }
  }
}
