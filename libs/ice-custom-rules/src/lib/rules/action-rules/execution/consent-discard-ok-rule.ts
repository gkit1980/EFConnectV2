import { ExecutionRule } from "@impeo/ice-core";
import * as _ from "lodash";
declare let ga: Function;

export class ConsentDiscardOkRule extends ExecutionRule {
    async execute(): Promise<void> {
        try {

            this.context.iceModel.elements['consent.popupdialog.close'].setSimpleValue(true);

            }
     catch (error)
    {
			console.error(error);
		}
    }
}
