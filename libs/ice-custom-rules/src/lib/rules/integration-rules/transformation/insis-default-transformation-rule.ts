import * as _ from 'lodash';

import { DefaultTransformationRule } from '@impeo/ice-core/default-rules/rules/integration-rules';

/**
 * This us enhanced version of the Default Transformation rule with support of passing the index to the
 * array from Ice element.
 */
export class InsisDefaultTransformationRule extends DefaultTransformationRule {
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
    if (this.iceModel.elements[indexData.index]) {
      const value = this.iceModel.elements[indexData.index].getValue().forIndex(null);
      if (!_.isNil(value)) return this.resolveIndices(key, value, source, index);
    }
    if (_.isString(indexData.index)) return this.evaluateIndexLiteral(indexData.index, source);
    return this.evaluateArrayCondition(key, indexData, source, index);
  }
}
