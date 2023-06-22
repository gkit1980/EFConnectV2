import { ExecutionRule } from "@impeo/ice-core";
import * as _ from "lodash";
declare let ga: Function;

export class EclaimsValuationIndividualRequestsRule extends ExecutionRule {
    async execute(): Promise<void> {
        try {

              this.context.iceModel.elements['eclaims.valuation.individual.requests'].setSimpleValue(true);
            }
     catch (error)
    {
			console.error(error);
		}
    }
}
