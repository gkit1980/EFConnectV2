import { ExecutionRule, ItemElement, IndexedValue, ValueOrigin } from '@impeo/ice-core';

//
//
export class SetElementValueExecutionRule extends ExecutionRule {

    //
    //
    async execute(): Promise<void> {
        const element = this.requireElement('element') as ItemElement;
        if (element == null) return console.error(`The element ${element} is not a ItemElement, value will not set`);
        const value = this.recipe['value'] != null ? this.recipe['value'] : null;
        element.setValue(new IndexedValue(element, value, null, ValueOrigin.UI));
    }

}
