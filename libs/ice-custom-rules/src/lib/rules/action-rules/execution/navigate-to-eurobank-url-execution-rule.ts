import { ExecutionRule } from "@impeo/ice-core";

export class NavigateToEurobankUrlExecutionRule extends ExecutionRule {

    //Override NavigateToUrlExecutionRule, to get redirected to an external url
    async execute(): Promise<void> {
        // this.action.context.messageInfo(this.iceModel.elements[this.recipe['message']].getValue().forIndex(null), this.recipe['summary']);
        let redirectUrl = this.action.recipe.execution[0].NavigateToEurobankUrlExecutionRule.url;
        window.location.href = redirectUrl; //Will take you to Eurobank site.
    }
}
