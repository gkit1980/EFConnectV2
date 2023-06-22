import { ExecutionRule } from "@impeo/ice-core";


export class PropertyNotificationClaimsValuationInprogressRequestsRule extends ExecutionRule {
    async execute(): Promise<void> {
        try {

              this.context.iceModel.elements['property.claims.valuation.inprogress.requests'].setSimpleValue(true);
            }
     catch (error)
    {
			console.error(error);
		}
    }
}
