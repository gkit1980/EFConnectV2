import { ExecutionRule } from "@impeo/ice-core";
import * as _ from "lodash";
declare let ga: Function;

export class DisableSpinnerRule extends ExecutionRule {
    async execute(): Promise<void> {

        try {
            const actionrule=this.recipe.actionrule;
           // this.context.$actionEnded.next(actionrule);
            }
     catch (error)
        {
			console.error(error);
		}


    }

}
