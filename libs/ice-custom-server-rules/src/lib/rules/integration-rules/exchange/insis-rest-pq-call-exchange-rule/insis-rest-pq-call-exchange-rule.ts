import { IntegrationDataIn, IntegrationDataOut, IceConsole } from '@impeo/ice-core';
import { InsisRestCallExchangeRule } from '../insis-rest-call-exchange-rule/insis-rest-call-exchange-rule';
import { map, set, get } from 'lodash';

//
//
export class InsisRestPQCallExchangeRule extends InsisRestCallExchangeRule {
  execute(request: IntegrationDataOut): any {
    const { queryId, ...filter } = request.params;
    if (!request.payload) {
      request.payload = {};
    }

    if (!queryId) {
      IceConsole.error('queryId needs to be specified as param ');
    }

    request.payload['queryId'] = queryId;
    set(
      request.payload,
      'filterCriteria.filterCriterion',
      map(filter, (value, field) => {
        return { field, value };
      })
    );

    return super.execute(request);
  }

  protected buildResponseData(response: any): IntegrationDataIn {
    const data = super.buildResponseData(response);
    const { payload } = data;
    const rows = map(get(payload, 'rowSet.row', []), ({ column = [] }) => {
      return column.reduce((accumulator, currentValue) => {
        if (currentValue.name === 'JSONROWITEM') {
          return JSON.parse(currentValue.value);
        }

        accumulator[currentValue.name] = currentValue.value;
        return accumulator;
      }, {});
    });

    data.payload = {
      rows,
    };

    return data;
  }
}
