import { IntegrationDataIn } from '@impeo/ice-core';
import { DefaultTransformationRule } from '@impeo/ice-core/default-rules/rules/integration-rules';
import { get, set, first, forEach } from 'lodash';

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
export class InsisPrimarySortTransformationRule extends DefaultTransformationRule {
  sortResponse(inData: IntegrationDataIn) {
    const paths = this.getParam('paths', []);
    forEach(paths, (path) => {
      const sortedList = get(inData, path, []).sort(sortByPrimaryFlag);
      set(inData, path, sortedList);
    });
    return inData;
  }

  handleInData(inData: IntegrationDataIn): void {
    inData = this.sortResponse(inData);
    super.handleInData(inData);
  }
}
