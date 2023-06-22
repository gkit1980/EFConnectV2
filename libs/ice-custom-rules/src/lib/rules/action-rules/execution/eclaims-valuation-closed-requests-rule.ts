import { ExecutionRule } from "@impeo/ice-core";
import * as _ from "lodash";
declare let ga: Function;

export class EclaimsValuationClosedRequestsRule extends ExecutionRule {
    async execute(): Promise<void> {
        try {

              this.context.iceModel.elements['eclaims.valuation.closed.requests'].setSimpleValue(true);
            }
     catch (error)
    {
			console.error(error);
		}
    }
}
