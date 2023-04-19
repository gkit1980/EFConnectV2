import { IntegrationDataIn, IntegrationDataOut, IceServerRuntime } from '@impeo/ice-core';
import * as jwt from 'jsonwebtoken';

import { InsisApiForActiveRequestHandlerRule } from '../insis-api-for-active-request-handler-rule/insis-api-for-active-request-handler-rule';

//
//
export class InsisPortalLoginRequestHandlerRule extends InsisApiForActiveRequestHandlerRule {
  //
  //
  async handleRequest(inData: IntegrationDataIn): Promise<IntegrationDataOut> {
    const outData = await super.handleRequest(inData);
    const payload = {
      id: outData.payload.pid,
      roles: outData.payload.isAgent ? ['agent'] : ['customer'],
      data: outData.payload,
    };
    const secret = process.env['JWT_SECRET'];
    const token = jwt.sign(payload, secret);
    const returnData = new IntegrationDataOut();
    returnData.payload = { token };
    return returnData;
  }
}
