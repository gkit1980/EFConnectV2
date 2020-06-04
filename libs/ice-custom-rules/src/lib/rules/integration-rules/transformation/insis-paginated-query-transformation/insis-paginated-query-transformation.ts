import { IntegrationData, IntegrationDataOut, IntegrationDataIn } from '@impeo/ice-core';
import { DefaultTransformationRule } from '@impeo/ice-core/default-rules/rules/integration-rules';
import * as _ from 'lodash';

//
//
export class InsisPaginatedQueryTransformation extends DefaultTransformationRule {
  /**
   *
   */
  handleInData(inData: IntegrationDataIn): void {
    if (!inData.payload.RowSet) inData.payload.RowSet = { Row: [] };

    if (!_.isArray(inData.payload.RowSet.Row))
      inData.payload.RowSet.Row = [inData.payload.RowSet.Row];

    _.forEach(inData.payload.RowSet.Row, row => {
      _.forEach(row.Column, column => {
        row[column.attributes.name] = column['$value'];
      });
    });
    super.handleInData(inData);
  }

  /**
   *
   */
  protected handleBlock(data: IntegrationData, block: any): void {
    if (data instanceof IntegrationDataOut) {
      if (_.get(data.payload, 'QueryID') == null)
        _.set(data.payload, 'QueryID', this.requireParam('queryId'));
      if (_.get(data.payload, 'FilterCriteria') == null) _.set(data.payload, 'FilterCriteria', {});
    }
    super.handleBlock(data, block);
  }
}
