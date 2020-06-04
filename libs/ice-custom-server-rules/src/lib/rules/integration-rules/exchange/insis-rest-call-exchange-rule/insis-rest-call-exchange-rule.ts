import { RestCallExchangeRule } from '@impeo/ice-core/default-rules/rules/integration-rules.server';

//
//
export class InsisRestCallExchangeRule extends RestCallExchangeRule {
  //
  //
  protected getHeaders(): any {
    const headers = {
      //'Content-Type': 'application/json',
      Authorization: 'Basic aW5zaXNfZ2VuX3YxMDppbnNpc19nZW5fdjEw',
      ignoreLoginService: true
    };
    return headers;
  }
}
