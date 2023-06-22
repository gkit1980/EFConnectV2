
import { MessageActionRule } from "@impeo/ice-core/default-rules/rules/action-rules";
import * as _ from "lodash";

export class EurolifeMessageActionRule extends MessageActionRule {

    //override MessageCustomRules to show a message retrieved by an element
    async execute(): Promise<void> {
        this.action.context.messageInfo(this.iceModel.elements[this.recipe['message']].getValue().forIndex(null), this.recipe['summary']);
        // super.execute();
    }
}
