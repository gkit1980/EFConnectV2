import { ExecutionRule } from "@impeo/ice-core";
import * as _ from "lodash";
declare let ga: Function;

export class FundValuationExecutionRule extends ExecutionRule {
    async execute(): Promise<void> {
        try {

              this.context.iceModel.elements['fundvaluation.execution'].setSimpleValue(true);
            }
     catch (error)
    {
			console.error(error);
		}
    }
}
