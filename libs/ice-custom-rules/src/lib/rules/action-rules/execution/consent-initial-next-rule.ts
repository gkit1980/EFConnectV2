import { ExecutionRule } from "@impeo/ice-core";
import * as _ from "lodash";


export class ConsentInitialNextRule extends ExecutionRule {
    async execute(): Promise<void> {
        try {

            this.context.iceModel.elements['consent.flag.opendialog'].setSimpleValue(true);
            }
     catch (error)
    {
			console.error(error);
		}
    }
}
