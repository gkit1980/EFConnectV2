import { IntegrationData, IntegrationDataOut, IntegrationDataIn } from '@impeo/ice-core';
import { DefaultTransformationRule } from '@impeo/ice-core/default-rules/rules/integration-rules';
import { get, first } from 'lodash';

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

const getAddressPart = (address, part) => {
  const data = get(address, part);
  return data || '';
};

const getAddress = (address) => {
  const parts = [['streetName', 'streetNumber'], ['city', 'cityCode'], ['country']].map(
    (smallChunks) => {
      return smallChunks.map((part) => getAddressPart(address, part)).join(' ');
    }
  );
  return parts.filter((p) => p !== '').join(', ');
};

//
//
export class InsisPersonTransformationRule extends DefaultTransformationRule {
  handleInData(inData: IntegrationDataIn): void {
    inData.payload.contacts = get(inData, 'payload.contacts', []).sort(sortByPrimaryFlag);
    inData.payload.addresses = get(inData, 'payload.addresses', []).sort(sortByPrimaryFlag);
    inData.payload.bankAccounts = get(inData, 'payload.bankAccounts', []).sort(sortByPrimaryFlag);

    const primaryEmail = first(inData.payload.contacts.filter((c) => c.contactType === 'EMAIL'));
    const primaryPhone = first(inData.payload.contacts.filter((c) => c.contactType === 'MOBILE'));
    const primaryAddress = first(inData.payload.addresses);
    const primaryData = {
      contact: {
        email: get(primaryEmail, 'details', ''),
        phone: get(primaryPhone, 'details', ''),
      },
      address: {
        full: getAddress(primaryAddress),
      },
    };
    inData.payload.primary = primaryData;

    super.handleInData(inData);
  }
}
