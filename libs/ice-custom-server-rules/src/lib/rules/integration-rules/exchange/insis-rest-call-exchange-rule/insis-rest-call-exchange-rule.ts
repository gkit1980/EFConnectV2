import { RestCallExchangeRule } from '@impeo/ice-server-rules/rules/integration-rules';
import { isArray, get } from 'lodash';
import { IceConsole, IntegrationDataOut, IntegrationDataIn } from '@impeo/ice-core';
import { AxiosRequestConfig } from 'axios';
//
//
export class InsisRestCallExchangeRule extends RestCallExchangeRule {
  //
  //
  protected getHeaders(): any {
    const username = this.getValueFromPrincipalOrEnvironment('insis-rest-username');
    const password = this.getValueFromPrincipalOrEnvironment('insis-rest-password');
    const buff = Buffer.from(username + ':' + password);
    const token = buff.toString('base64');
    const headers = {
      //'Content-Type': 'application/json',
      Authorization: 'Basic ' + token,
      ignoreLoginService: true,
    };
    return headers;
  }

  //
  //
  async execute(request: IntegrationDataOut): Promise<IntegrationDataIn> {
    const config = this.getConfig(request);
    if (this.shouldMock(config.baseURL)) return this.mockRequest(config.baseURL, request);
    let response: any = null;
    try {
      response = await this.request(config);
    } catch (error) {
      IceConsole.error(`Error while accessing ${config.baseURL}/${config.url}`, error);
      return this.buildResponseData(error);
    }

    return this.buildResponseData(response);
  }

  protected getConfig(request: IntegrationDataOut): any {
    const config: AxiosRequestConfig = super.getConfig(request);
    config['validateStatus'] = (status: number) => status >= 200 && status <= 300;
    return config;
  }

  protected buildResponseData(responseOrError: any): IntegrationDataIn {
    const errorMessage = get(responseOrError, 'response.data.message', '');

    if (errorMessage) {
      throw new Error(errorMessage);
    }

    const data = super.buildResponseData(responseOrError);
    if (isArray(data.payload)) data.payload = { response: data.payload };
    return data;
  }
}
