import { IntegrationDataIn } from '@impeo/ice-core';
import { InsisPrimarySortTransformationRule } from '../insis-primary-sort-transformation-rule/insis-primary-sort-transformation-rule';
import { get, first } from 'lodash';

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
  return parts.filter(p => p.trim() !== '').join(', ');
};

//
//
export class InsisPersonTransformationRule extends InsisPrimarySortTransformationRule {
  handleInData(inData: IntegrationDataIn): void {
    inData = this.sortResponse(inData);

    const primaryEmail = first(inData.payload.contacts.filter((c) => c.contactType === 'EMAIL'));
    const primaryPhone = first(inData.payload.contacts.filter((c) => c.contactType === 'MOBILE'));
    const primaryAddress = first(inData.payload.addresses);
    const primaryData = {
      contact: {
        email: get(primaryEmail, 'details', ''),
        emailid: get(primaryEmail, 'contactId', ''),
        phone: get(primaryPhone, 'details', ''),
        phoneid: get(primaryPhone, 'contactId', ''),
      },
      address: {
        full: getAddress(primaryAddress),
      },
    };
    inData.payload.primary = primaryData;

    super.handleInData(inData);
  }
}
