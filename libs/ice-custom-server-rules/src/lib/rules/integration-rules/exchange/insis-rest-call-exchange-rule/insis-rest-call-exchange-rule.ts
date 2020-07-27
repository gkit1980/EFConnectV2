import { RestCallExchangeRule } from '@impeo/ice-core/default-rules/rules/integration-rules.server';
import { IntegrationDataIn } from '@impeo/ice-core';
import { isArray } from 'lodash';

//
//
export class InsisRestCallExchangeRule extends RestCallExchangeRule {
  //
  //
  protected getHeaders(): any {
    const username = this.runtime.environmentVariables['insis-rest-username'];
    const password = this.runtime.environmentVariables['insis-rest-password'];
    const buff = Buffer.from(username + ':' + password);
    const token = buff.toString('base64');
    const headers = {
      //'Content-Type': 'application/json',
      Authorization: 'Basic ' + token,
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
