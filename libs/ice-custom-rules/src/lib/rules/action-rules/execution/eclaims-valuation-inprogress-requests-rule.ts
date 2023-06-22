import { ExecutionRule } from "@impeo/ice-core";
import * as _ from "lodash";
declare let ga: Function;

export class EclaimsValuationInprogressRequestsRule extends ExecutionRule {
    async execute(): Promise<void> {
        try {

              this.context.iceModel.elements['eclaims.valuation.inprogress.requests'].setSimpleValue(true);
            }
     catch (error)
    {
			console.error(error);
		}
    }
}
