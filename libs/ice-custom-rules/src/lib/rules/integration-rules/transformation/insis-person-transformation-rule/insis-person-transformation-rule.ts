import { IntegrationData, IntegrationDataOut, IntegrationDataIn } from '@impeo/ice-core';
import { DefaultTransformationRule } from '@impeo/ice-core/default-rules/rules/integration-rules';
import { get } from 'lodash';

const sortByPrimaryFlag = (a, b) => {
  if (a.primaryFlag !== b.primaryFlag) {
    if (a.primaryFlag === 'Y') {
      return -1;
    } else if (b.primaryFlag === 'Y') {
      return 1;
    }

    return 0;
  }
  return 0;
};

//
//
export class InsisPersonTransformationRule extends DefaultTransformationRule {
  handleInData(inData: IntegrationDataIn): void {
    inData.payload.contacts = get(inData, 'payload.contacts', []).sort(sortByPrimaryFlag);
    inData.payload.addresses = get(inData, 'payload.addresses', []).sort(sortByPrimaryFlag);
    inData.payload.bankAccounts = get(inData, 'payload.bankAccounts', []).sort(sortByPrimaryFlag);

    super.handleInData(inData);
  }
}
