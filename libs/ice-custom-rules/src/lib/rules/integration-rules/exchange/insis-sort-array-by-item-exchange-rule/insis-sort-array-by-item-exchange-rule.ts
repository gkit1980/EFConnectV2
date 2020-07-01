import { ExchangeRule, IntegrationDataOut, IntegrationDataIn, IceConsole } from '@impeo/ice-core';
import { sortBy, get, cloneDeep, set } from 'lodash';

export class InsisSortArrayByItemExchangeRule extends ExchangeRule {
  async execute(requestData: IntegrationDataOut): Promise<IntegrationDataIn> {
    const arrayElementName = this.requireElement('arrayElement').name;
    const sortElementName = this.requireElement('childElement').name.replace(
      `${arrayElementName}~`,
      ''
    );
    const array = get(requestData.payload, arrayElementName);

    console.log(array);

    const sortedArray = sortBy(array, [
      function (obj) {
        const sortValue = get(obj, sortElementName, '');

        if (!isNaN(sortValue)) {
          return +sortValue;
        }

        return sortValue;
      },
    ]);
    const inPayload = cloneDeep(requestData.payload);
    set(inPayload, arrayElementName, sortedArray);
    const dataIn = new IntegrationDataIn();
    dataIn.payload = inPayload;
    dataIn.actionContext = requestData.actionContext;
    return dataIn;
  }
}
