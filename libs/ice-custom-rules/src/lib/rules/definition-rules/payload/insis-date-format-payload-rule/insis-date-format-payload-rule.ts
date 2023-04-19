import { DefaultPayloadRule } from '@impeo/ice-core/default-rules/rules/model-rules';
import * as moment from 'moment';
//
//
export class InsisDateFormatPayloadRule extends DefaultPayloadRule {
  //
  //
  public getPayload(index: number[]) {
    const payload = super.getDefaultPayload(index);
    payload['dateFormat'] = (date: any, format: string) => {
      if (date == null) return null;
      if (date['format']) return date.format(format);
      if (date['toString']) return moment(date).format(format);
      return date;
    };
    return payload;
  }
}
