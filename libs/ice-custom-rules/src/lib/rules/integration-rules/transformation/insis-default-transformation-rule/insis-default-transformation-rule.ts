import * as _ from 'lodash';

import { DefaultTransformationRule } from '@impeo/ice-core/default-rules/rules/integration-rules';
import { IntegrationDataOut } from '@impeo/ice-core';

/**
 * This us enhanced version of the Default Transformation rule with support of passing the index to the
 * array from Ice element.
 */
export class InsisDefaultTransformationRule extends DefaultTransformationRule {
  private actionContext: any;

  buildOutData(actionContext?: any): IntegrationDataOut {
    this.actionContext = actionContext;
    return super.buildOutData(actionContext);
  }

  protected convertOut(mapping: any, value: any): any {
    if (!value)
      value = this.context.iceModel.elements[mapping.element]
        .getValue()
        .forIndex(this.actionContext.index);
    return value;
  }

  protected convertIn(mapping: any, value: any): any {
    return value;
  }

  //
  //
  protected resolveIndices(
    key: 'fromIdx' | 'toIdx',
    indexData: any,
    source: any,
    index: number[]
  ): number[] {
    if (_.isNil(indexData)) return [];
    if (_.isNumber(indexData)) return [indexData];
    if (_.isNumber(indexData.index)) return [indexData.index];
    if (source.actionContext && source.actionContext.index && _.isArray(source.actionContext.index))
      return source.actionContext.index;
    if (this.iceModel.elements[indexData.index]) {
      const value = this.iceModel.elements[indexData.index].getValue().forIndex(null);
      if (!_.isNil(value)) return this.resolveIndices(key, value, source, index);
    }
    if (_.isString(indexData.index)) return this.evaluateIndexLiteral(indexData.index, source);
    return this.evaluateArrayCondition(key, indexData, source, index);
  }
}
