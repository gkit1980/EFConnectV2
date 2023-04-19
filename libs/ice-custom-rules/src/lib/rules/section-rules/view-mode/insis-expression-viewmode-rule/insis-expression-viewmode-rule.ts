import { SectionViewModeRule, SectionViewMode, IceExpression, IndexedValue } from '@impeo/ice-core';
import { evaluate } from 'bcx-expression-evaluator';
import { get } from 'lodash';

export class InsisExpressionViewModeRule extends SectionViewModeRule {
  getViewMode(actionContext?: any): SectionViewMode {
    const expression = this.requireParam('expression');
    const viewMode = this.requireParam('viewMode');
    const elseViewMode = this.getParam('elseViewMode', SectionViewMode.DEFAULT);
    const useIndex = this.getParam('useIndex', false);
    let index = get(actionContext || {}, 'index', []) || [];
    index = IndexedValue.index2Key(index);
    const expressionOutput = IceExpression.convert(expression, this.iceModel, []);
    const result = evaluate(
      expressionOutput,
      this.iceModel.payloadRule.getPayload((useIndex && index) || null)
    );

    return (result && viewMode) || elseViewMode;
  }
}
