import { ExecutionRule } from "@impeo/ice-core";
import * as _ from "lodash";
declare let ga: Function;

export class EclaimsValuationOpenRequestsRule extends ExecutionRule {
    async execute(): Promise<void> {
        try {

              this.context.iceModel.elements['eclaims.valuation.open.requests'].setSimpleValue(true);
            }
     catch (error)
    {
			console.error(error);
		}
    }
}
