import { IntegrationDataIn } from '@impeo/ice-core';
import { DefaultTransformationRule } from '@impeo/ice-core/default-rules/rules/integration-rules';
import * as _ from 'lodash';

//
//
export class InsisClaimsSortedRequestTransformation extends DefaultTransformationRule {
  /**
   *
   */
  handleInData(inData: IntegrationDataIn): void {
    const claimData = _.get(inData.payload, 'Claim');
    this.sortRequests(claimData);

    super.handleInData(inData);
  }

  private sortRequests(claimData: any) {
    if (claimData == null || claimData.Requests == null || claimData.Requests.Request == null)
      return;

    claimData.Requests.Request = _.sortBy(claimData.Requests.Request, [
      request => {
        return request.RequestNo;
      }
    ]);
  }
}
