import { ExchangeRule, IceConsole, IntegrationDataOut, IntegrationDataIn } from '@impeo/ice-core';
import axios, { AxiosRequestConfig } from 'axios';
import * as template from 'es6-template-strings';
import * as _ from 'lodash';

/**
 * an Exchange via Rest (driven by a recipe) with a 3rd party system
 */
export class BrowserRestCallExchangeRule extends ExchangeRule {
  //
  //
  async execute(request: IntegrationDataOut): Promise<IntegrationDataIn> {
    if (typeof window === 'undefined') {
      //running on node?
      console.log('BrowserRestCallExchangeRule skippe since running on node');
      return;
    }

    const config = this.getConfig(request);
    let response: any = null;
    try {
      response = await this.request(config);
    } catch (error) {
      IceConsole.error(`Error while accessing ${config.url}`, error.code);
    }
    return this.buildResponseData(response);
  }

  /**
   * override this to change the actual REST request
   */
  protected async request(config: any): Promise<any> {
    const response = await axios.request(config);
    return response;
  }

  /**
   * creates the config for the axios call, override this to change or add properties for the rest call
   * e.g. headers
   */
  protected getConfig(request: IntegrationDataOut) {
    const config: AxiosRequestConfig = {
      url: this.getUrl(request),
      method: this.getParam('verb', 'get'),
      validateStatus: (status: number) => true,
    };

    if (_.includes(['post', 'put'], config.method)) {
      config['data'] = this.createPayload(request);
    }

    return config;
  }

  /**
   * Example: http://example.com/foo/$bar/baz?bax=${bay}
   * Given the params 'bar' and 'bay' in the request data (params) this url would be returned fully resolved.
   * Note that dynamic url params must be resolved in this way and not via 'params' in the axios config
   *
   * @param request the request data from the transformation rule
   * @returns the url (probably with dynamic params filled) for the rest call
   */
  protected getUrl(request: IntegrationDataOut): string {
    const url =
      (this.getParam('url') as string) ??
      (this.getElement('urlElement')?.getValue().forIndex(null) as string) ??
      '';
    return template(url, request.params, { partial: true });
  }

  /**
   *
   */
  protected createPayload(request: IntegrationDataOut): any {
    return request.payload;
  }

  /**
   * creates the response data from the raw axios response
   */
  protected buildResponseData(response: any): IntegrationDataIn {
    const data = new IntegrationDataIn();
    _.set(data.other, 'http.status', response.status);
    _.set(data.other, 'http.statusText', response.statusText);
    _.set(data.other, 'http.headers', response.headers);
    data.payload = response.data;
    return data;
  }
}
