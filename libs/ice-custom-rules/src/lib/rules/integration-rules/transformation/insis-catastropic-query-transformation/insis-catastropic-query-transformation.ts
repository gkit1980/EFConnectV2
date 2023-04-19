import { IntegrationData, IntegrationDataOut, IntegrationDataIn } from '@impeo/ice-core';
import { DefaultTransformationRule } from '@impeo/ice-core/default-rules/rules/integration-rules';
import * as _ from 'lodash';

//
//
export class InsisCatastropicQueryTransformation extends DefaultTransformationRule {
  /**
   *
   */
  handleInData(inData: IntegrationDataIn): void {
    if (!inData.payload.RowSet) inData.payload.RowSet = { Row: [] };

    if (!_.isArray(inData.payload.RowSet.Row))
      inData.payload.RowSet.Row = [inData.payload.RowSet.Row];

    _.forEach(inData.payload.RowSet.Row, (row) => {
      _.forEach(row.Column, (column) => {
        row[column.attributes.name] = column['$value'];
      });
    });

    const catastrophicEvents = [];
    _.forEach(inData.payload.RowSet.Row, (row) => {
      const eventId = _.get(row, 'CAT_EVENT_ID');
      if (!eventId) return;
      let catastrophicEvent = _.find(catastrophicEvents, (event) => event.eventID === eventId);
      if (!catastrophicEvent) {
        catastrophicEvent = {};
        _.set(catastrophicEvent, 'eventID', eventId);
        _.set(catastrophicEvent, 'eventType', row.CAT_EVENT_TYPE);
        _.set(catastrophicEvent, 'eventPlace', row.PLACE);
        _.set(catastrophicEvent, 'eventDescription', row.DESCRIPTION);
        _.set(catastrophicEvent, 'eventBegin', row.BEGIN_DATE);
        _.set(catastrophicEvent, 'eventEnd', row.END_DATE);
        _.set(catastrophicEvent, 'cases', []);
        catastrophicEvents.push(catastrophicEvent);
      }
      const caseItem = {
        srcClaim: row.SRC_CLAIM,
        claimId: row.CLAIM_ID,
        claimComment: row.CLAIM_COMMENT,
      };
      catastrophicEvent.cases.push(caseItem);
    });
    inData.payload = { catastrophicEvents: catastrophicEvents };
    super.handleInData(inData);
  }

  /**
   *
   */
  protected handleBlock(data: IntegrationData, block: any): void {
    if (data instanceof IntegrationDataOut) {
      if (_.get(data.payload, 'QueryID') == null)
        _.set(data.payload, 'QueryID', this.requireParam('queryId'));
    }
    super.handleBlock(data, block);
  }
}
