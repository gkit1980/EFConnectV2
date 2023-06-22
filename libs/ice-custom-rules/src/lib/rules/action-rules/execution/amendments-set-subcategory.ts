import { ExecutionRule } from "@impeo/ice-core";
import * as _ from "lodash";

declare let ga: Function;

export class AmendmentsSetSubcategory extends ExecutionRule {
    async execute(): Promise<void> {
        try {
          this.context.iceModel.elements["amendments.motor.subcategory.dropdown"].setSimpleValue(null)
          this.context.iceModel.elements["amendments.property.subcategory.dropdown"].setSimpleValue(null)
          this.context.iceModel.elements["amendments.life.subcategory.dropdown"].setSimpleValue(null)
          this.context.iceModel.elements["amendments.health.subcategory.dropdown"].setSimpleValue(null)
          this.context.iceModel.elements["amendments.finance.subcategory.dropdown"].setSimpleValue(null)

        }
     catch (error)
    {
			console.error(error);
		}
    }
}
