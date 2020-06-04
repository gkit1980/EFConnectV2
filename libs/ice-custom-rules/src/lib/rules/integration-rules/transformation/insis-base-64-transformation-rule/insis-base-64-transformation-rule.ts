import { IceConsole, IntegrationDataOut } from '@impeo/ice-core';
import { DefaultTransformationRule } from '@impeo/ice-core/default-rules/rules/integration-rules';
import * as _ from 'lodash';

import * as moment from 'moment';
//
//
export class InsisBase64TransformationRule extends DefaultTransformationRule {
  private actionContext;

  public buildOutData(actionContext?: any): IntegrationDataOut {
    this.actionContext = actionContext;
    return super.buildOutData(actionContext);
  }

  protected convertOut(mapping: any, value: any): any {
    try {
      value = this.convertExpression(mapping, value);
      if (_.isDate(value)) {
        const format = mapping['dateFormat'] || this.recipe['dateFormat'] || 'YYYY-MM-DD';
        return moment(value).format(format);
      }
      if (
        _.isString(value) &&
        value.length >= 29 &&
        value.substring(0, 28) === 'data:application/pdf;base64,'
      ) {
        return value.substring(28, value.length);
      }
      if (
        _.isString(value) &&
        value.length >= 24 &&
        value.substring(0, 23) === 'data:image/jpeg;base64,'
      ) {
        return value.substring(23, value.length);
      }
    } catch (error) {
      IceConsole.error(error);
    }
    return value;
  }

  // protected resolveIndices(
  //   key: 'fromIdx' | 'toIdx',
  //   indexData: any,
  //   source: any,
  //   index: number[]
  // ): number[] {
  //   if(this.actionContext && this.actionContext.index) return [this.actionContext.index];
  //   return super.resolveIndices( key, indexData, source, index);
  // }
}
