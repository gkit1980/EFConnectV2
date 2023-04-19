import { ValueRule, IceConsole, FeelUtils, IceType } from '@impeo/ice-core';
import * as moment from 'moment';

export class InsisFormatedDateExpressionValueRule extends ValueRule {
  //
  //
  public getValue(index: number[] | null): any {
    try {
      let result;
      if (this.recipe['expression'] === 'now') result = new Date();
      else result = FeelUtils.evaluate(this.recipe['expression'], index, this.iceModel);

      if (result == null || result instanceof Date) return this.dateToFormat(result);

      result = IceType.convertFromFeel(result, 'date', 'InsisFormatedDateExpressionValueRule', '');
      if (result instanceof Date) return this.dateToFormat(result);
      IceConsole.error(
        `InsisFormatedDateExpressionValueRule: result of expression ${this.recipe['expression']} is not of type Date.`
      );
    } catch (e) {
      IceConsole.error(
        `InsisFormatedDateExpressionValueRule: expression ${this.recipe['expression']} is not a valid feel expression.`
      );
    }
    return null;
  }

  protected dateToFormat(date: Date | null): string {
    if (date == null) return null;
    const format = this.getParam('format', this.resource.resolve('formats.datetime'));

    return moment(date).format(format);
  }
}
