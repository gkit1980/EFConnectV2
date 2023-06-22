import { ExecutionRule } from "@impeo/ice-core";
import * as _ from "lodash";
declare let ga: Function;

export class MessageInfoClicktocallRule extends ExecutionRule {
    async execute(): Promise<void> {
        try {
          if(this.context.dataStore.data.processCallback!=null)
          {
            if(this.context.dataStore.data.processCallback.clicktocallnow==true || this.context.dataStore.data.processCallback.clicktocalllater==true)
            {
              this.context.iceModel.elements['clicktocall.messageinfo'].setSimpleValue(this.context.dataStore.data.processCallback.message);
              this.context.iceModel.elements['clicktocall.connected'].setSimpleValue(true);

            }
            if (this.context.dataStore.data.processCallback.clicktocallnow == false || this.context.dataStore.data.processCallback.clicktocalllater == false) {
              this.context.iceModel.elements['clicktocall.messageinfo'].setSimpleValue(this.context.dataStore.data.processCallback.message);
              this.context.iceModel.elements['clicktocall.connected'].setSimpleValue(true);
            }
          }
		} catch (error) {
			console.error(error);
		}
    }
}
