import { IntegrationDataOut, IntegrationDataIn } from '@impeo/ice-core';
import { SoapCallExchangeRule } from '@impeo/ice-core/default-rules/rules/integration-rules.server';
import { includes, set } from 'lodash';

//
//
export class InsisSoapCallExchangeRule extends SoapCallExchangeRule {
  async execute(request: IntegrationDataOut): Promise<IntegrationDataIn> {
    try {
      return await super.execute(request);
    } catch (error) {
      if (!includes(error.body, 'INSIS-')) {
        throw error;
      }

      const [message] = error.body.match(/(?<=msg\=+).*?(?=\s+\[REASON\])/gs);
      if (!message) {
        throw error;
      }

      const outData = new IntegrationDataIn();
      set(outData.payload, 'error', message);
      return outData;
    }
  }
}
