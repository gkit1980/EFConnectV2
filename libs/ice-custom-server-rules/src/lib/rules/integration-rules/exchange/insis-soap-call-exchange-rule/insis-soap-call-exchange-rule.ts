import { IntegrationDataOut, IntegrationDataIn } from '@impeo/ice-core';
import { SoapCallExchangeRule } from '@impeo/ice-server-rules/rules/integration-rules';
import { includes, set, get } from 'lodash';

//
//
export class InsisSoapCallExchangeRule extends SoapCallExchangeRule {
  async execute(request: IntegrationDataOut): Promise<IntegrationDataIn> {
    try {
      return await super.execute(request);
    } catch (error) {
      console.log(JSON.stringify(error));
      if (!includes(error.body, 'INSIS-')) {
        throw error;
      }

      let message = error.body.match(/(?<=msg\=+).*?(?=\s+\[REASON\])/gs);
      message = message && message[0];

      if (!message) {
        const faultString = get(error, 'cause.root.Envelope.Body.Fault.faultstring', '');
        const errors = Array.from(faultString.matchAll(/(\s+INSIS-[A-Za-z_: ]+)/g))
          .map((errorArr) => errorArr[0].trim().replace(/(INSIS-[A-Za-z0-9_\-:]+ )/g, ''))
          .slice(1);
        message = errors.join('. ');
      }

      if (!message) {
        throw error;
      }

      const outData = new IntegrationDataIn();
      set(outData.payload, 'error', message);
      return outData;
    }
  }
}
