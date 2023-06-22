import { ExecutionRule } from "@impeo/ice-core";
import * as _ from "lodash";


export class DigitalCardValuationRule extends ExecutionRule {
    async execute(): Promise<void> {
        try {

              if(this.recipe.typeOfContract=="individual-digital-card")
              this.context.iceModel.elements['digital.card.individual.valuation'].setSimpleValue(true);
              if(this.recipe.typeOfContract=="group-digital-card")
              this.context.iceModel.elements['digital.card.group.valuation'].setSimpleValue(true);

            }
     catch (error)
    {
			console.error(error);
		}
    }
}
