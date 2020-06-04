import { ExchangeRule, IntegrationDataOut, IntegrationDataIn } from '@impeo/ice-core';
//
//
export class InsisSampleDataExchangeRule extends ExchangeRule {
  //
  //
  async execute(request: IntegrationDataOut): Promise<IntegrationDataIn> {
    const data = new IntegrationDataIn();

    data.payload = {
      rows: [
        {
          item: 0,
          childs: [
            {
              child: '0-a'
            },
            {
              child: '0-b'
            }
          ]
        },
        {
          item: 1,
          childs: [
            {
              child: '1-a'
            },
            {
              child: '1-b'
            }
          ]
        },
        {
          item: 2,
          childs: [
            {
              child: '2-a'
            },
            {
              child: '2-b'
            }
          ]
        }
      ]
    };

    return data;
  }
}
