import { RestCallExchangeRule } from '@impeo/ice-core/default-rules/rules/integration-rules.server';
import { IntegrationDataIn } from '@impeo/ice-core';
import { isArray } from 'lodash';

//
//
export class InsisRestCallExchangeRule extends RestCallExchangeRule {
  //
  //
  protected getHeaders(): any {
    const headers = {
      //'Content-Type': 'application/json',
      Authorization: 'Basic aW5zaXNfZ2VuX3YxMDppbnNpc19nZW5fdjEw',
      ignoreLoginService: true,
    };
    return headers;
  }

  protected buildResponseData(response: any): IntegrationDataIn {
    const data = super.buildResponseData(response);
    if (isArray(data.payload)) data.payload = { response: data.payload };
    return data;
  }
}
