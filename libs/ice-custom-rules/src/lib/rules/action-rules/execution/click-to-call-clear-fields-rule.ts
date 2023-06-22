import { ExecutionRule } from "@impeo/ice-core";
import * as _ from "lodash";
declare let ga: Function;

export class ClicktoCallClearFieldsRule extends ExecutionRule {
    async execute(): Promise<void> {
        try {

              this.context.iceModel.elements['clicktocall.connected'].setSimpleValue(false);
              this.context.iceModel.elements['clicktocall.messageinfo'].setSimpleValue(null);
              this.context.iceModel.elements['clicktocall.name'].setSimpleValue(null);
              this.context.iceModel.elements['clicktocall.phone'].setSimpleValue(null);
              // this.context.iceModel.elements['clicktocall.thanksnotification'].setSimpleValue(null);
              this.context.iceModel.elements['clicktocall.callmenow'].setSimpleValue(false);
              this.context.iceModel.elements['clicktocall.callmelater'].setSimpleValue(false);
              this.context.iceModel.elements['clicktocall.callmelaterdate'].setSimpleValue(null);
              this.context.iceModel.elements['clicktocall.callmelatertime'].setSimpleValue(null);
              this.context.iceModel.elements['clicktocall.gdprnotification'].setSimpleValue(null);
            }
     catch (error)
    {
			console.error(error);
		}
    }
}
