import { SectionViewModeRule, SectionViewMode, IceExpression } from '@impeo/ice-core';
import { evaluate } from 'bcx-expression-evaluator';

export class InsisExpressionViewModeRule extends SectionViewModeRule {
  getViewMode(actionContext?: any): SectionViewMode {
    const expression = this.requireParam('expression');
    const viewMode = this.requireParam('viewMode');
    const elseViewMode = this.getParam('elseViewMode', SectionViewMode.DEFAULT);

    const expressionOutput = IceExpression.convert(expression, this.iceModel, []);
    const result = evaluate(expressionOutput, this.iceModel.payloadRule.getPayload(null));

    return (result && viewMode) || elseViewMode;
  }
}
