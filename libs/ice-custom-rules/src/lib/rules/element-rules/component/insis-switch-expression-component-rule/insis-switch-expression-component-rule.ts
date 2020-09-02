import { isString, first, keys, values, uniqBy } from 'lodash';

import { ComponentRule, IceExpression } from '@impeo/ice-core';
import { evaluate } from 'bcx-expression-evaluator';

//
//
export class InsisSwitchExpressionComponentRule extends ComponentRule {
  initialized = false;
  expressions: string[] = [];

  public getComponent(index): string {
    this.initialize();
    const component = this.getComponentItem(index);
    return isString(component) ? component : first(keys(component));
  }

  public getComponentRecipe(index): any {
    const component = this.getComponentItem(index);
    return isString(component) ? {} : first(values(component));
  }

  private getComponentItem(index) {
    const cases = this.requireParam('cases');
    const currentPage = this.iceModel.navigation.currentPage.name;
    let defaultCase = null;
    for (const [i, value] of cases.entries()) {
      const { component, defaultComponent } = value;
      const expression = this.expressions[i];
      if (expression) {
        const payload = {
          ...this.iceModel.payloadRule.getPayload(index),
          currentPage,
        };
        const result = evaluate(expression, payload);
        if (result === true) {
          return component;
        }
      }

      if (defaultComponent) {
        defaultCase = defaultComponent;
      }
    }

    return defaultCase;
  }

  private initialize() {
    if (this.initialized) return;

    const cases = this.requireParam('cases');
    const { elements, expressions } = this.prepareExpressions(cases);
    this.expressions = expressions;
    this.triggerReevaluationOnElementsChange(elements);
    this.initialized = true;
  }

  private prepareExpressions(cases) {
    const elements = [];
    const expressions = [];

    for (const c of cases) {
      const { when } = c;
      if (when) {
        const expression = IceExpression.convert(when, this.iceModel, elements);
        expressions.push(expression);
      }
    }

    return {
      elements: uniqBy(elements, 'name'),
      expressions,
    };
  }
}
