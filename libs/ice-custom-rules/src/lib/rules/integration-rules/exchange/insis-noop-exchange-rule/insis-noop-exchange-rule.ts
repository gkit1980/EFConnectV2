import { ExchangeRule, IntegrationDataOut, IntegrationDataIn } from '@impeo/ice-core';
//
//
export class InsisNoopExchangeRule extends ExchangeRule {
  //
  //

  async execute(request: IntegrationDataOut): Promise<IntegrationDataIn> {
    const data = new IntegrationDataIn();
    data.payload = request.payload;
    data.params = request.params;
    // tslint:disable-next-line: no-console
    console.debug('InsisNoopExchangeRule will return IntegrationDataIn:', data);

    return data;
  }
}
