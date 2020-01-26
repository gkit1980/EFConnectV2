import { IntegrationDataIn, IntegrationDataOut, ExchangeRule } from '@impeo/ice-core';

//
//
export class DummyExchangeRule extends ExchangeRule {
  //
  //
  async execute(requestData: IntegrationDataOut): Promise<IntegrationDataIn> {
    const data = new IntegrationDataIn();
    return data;
  }
}
