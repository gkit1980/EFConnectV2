import { ExecutionRule } from "@impeo/ice-core";
import * as _ from "lodash";
declare let ga: Function;

export class EnableSpinnerRule extends ExecutionRule {
    async execute(): Promise<void> {

        try {
            const actionrule=this.recipe.actionrule;
          //  this.context.$actionStarted.next(actionrule);
            }
     catch (error)
        {
			console.error(error);
		}


    }
}
