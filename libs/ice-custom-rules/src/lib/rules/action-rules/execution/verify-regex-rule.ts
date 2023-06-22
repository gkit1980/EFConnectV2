import { ExecutionRule } from "@impeo/ice-core";
import * as _ from "lodash";
import * as fsave from "file-saver";

export class VerifyRegexRule extends ExecutionRule {

    element: string = undefined;
    regexp: RegExp = undefined;
    async execute(): Promise<void> {

        try {

            if (this.recipe["element"]) {
                this.element = this.context.iceModel.elements[this.recipe["element"]].getValue().forIndex(null) as string;
                this.regexp = new RegExp(this.recipe["regexp"]);
            }
            else {
                throw new Error("Wrong element or Regexp");
            }
            let validateRegex = this.regexp.test(this.element);

            this.context.iceModel.elements[this.recipe["returnedElementBoolean"]].setSimpleValue(validateRegex);

        } catch (error) {
            console.error(error);
        }
    }

}
