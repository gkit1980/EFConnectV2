import { RestCallExchangeRule } from '@impeo/ice-core/default-rules/rules/integration-rules.server';
import {
  ExchangeRule,
  IceConsole,
  IntegrationDataOut,
  IntegrationDataIn,
  IceIntegration,
} from '@impeo/ice-core';
import * as dicer from 'dicer';
import { get } from 'lodash';
import * as fs from 'fs';
//
//
export class InsisPrintExchangeRule extends RestCallExchangeRule {
  //
  //
  protected getHeaders(): any {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Basic aW5zaXNfZ2VuX3YxMDppbnNpc19nZW5fdjEw',
      ignoreLoginService: true,
    };
    return headers;
  }

  protected getConfig(request: IntegrationDataOut): any {
    const config = super.getConfig(request);
    config.responseType = 'arraybuffer';
    return config;
  }

  async execute(request: IntegrationDataOut): Promise<IntegrationDataIn> {
    const config = this.getConfig(request);
    if (this.shouldMock(config.baseURL)) return this.mockRequest(config.baseURL, request);
    let response: any = null;
    try {
      response = await this.request(config);
    } catch (error) {
      IceConsole.error(`Error while accessing ${config.baseURL}/${config.url}`, error);
    }
    return this.buildAsyncResponseData(response);
  }

  protected async buildAsyncResponseData(response: any): Promise<IntegrationDataIn> {
    const data = super.buildResponseData(response);
    const parsedData = await this.parseData(response);
    data.payload = { data: parsedData };
    return data;
  }

  private async parseData(response: any) {
    const finalData: {
      name: string;
      contentType: string;
      data?: string;
      base64Encoded?: boolean;
    }[] = [];

    //todo: bail if response status != 200

    //get multipart boundary
    const contentType = response.headers['content-type'] as string;
    const RE_BOUNDARY = /^multipart\/.+?(?:;boundary=(?:(?:"(.+)")|(?:([^\s]+))))$/g;
    const boundaryArray = RE_BOUNDARY.exec(contentType);

    //todo: bail if boundary null

    //extract boundary
    const boundary = (<RegExpExecArray>boundaryArray)[2];

    //initialize multipart parser
    const multipartParser = new dicer({
      boundary: boundary,
    });

    /*
    todo: here we should create an array of "MultipartItem":

    {
      name: string //name of the part, need to extract this from the content-disposition of each part using a regexp
      contentType: string //the content-type of the part
      data: string //plain string or, in case data is binary, converted to base64
      base64Encoded: bool //set to true if data is base64 encoded
    }
    */

    const result = new Promise((resolve, reject) => {
      multipartParser.on('part', (part) => {
        /*
          in here we should create on instance of MultipartItem
          and on each event below, complete a bit more of its fields
          on the final
        */

        let name: string;
        let type: string;
        let base64EncodedData: string;
        let isEncoded: boolean;

        part.on('data', (data) => {
          const buff = Buffer.from(data);
          // fs.writeFileSync('d:/temp/test2.pdf', data);
          base64EncodedData = buff.toString('base64');
          isEncoded = true;
        });

        part.on('header', (header) => {
          type = get(header, ['content-type', 0]);
          name = get(header, ['content-disposition', 0]);
        });

        part.on('end', () => {
          finalData.push({
            name: name,
            contentType: type,
            base64Encoded: isEncoded,
            data: base64EncodedData,
          });
          //here, we add the MultipartItem to the array of MultipartItem
        });
      });

      multipartParser.on('finish', () => {
        resolve(finalData);
        // here the parser is done. This is the place where we can actually return the array of MultipartItem.
      });
    });

    //parse response
    const buffer = Buffer.from(response.data);
    multipartParser.write(buffer);

    return result;
  }
}
