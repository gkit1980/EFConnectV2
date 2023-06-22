import { ExecutionRule } from "@impeo/ice-core";
import * as _ from "lodash";
declare let ga: Function;

export class ConsentDiscardCancelRule extends ExecutionRule {
    async execute(): Promise<void> {
        try {

            this.context.iceModel.elements['consent.popupdialog'].setSimpleValue(false);
            this.context.iceModel.elements['consent.page.index'].setSimpleValue(2);

            }
     catch (error)
    {
			console.error(error);
		}
    }
}
