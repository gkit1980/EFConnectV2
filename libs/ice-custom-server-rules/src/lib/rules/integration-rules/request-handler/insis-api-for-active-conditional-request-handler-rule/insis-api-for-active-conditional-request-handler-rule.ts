import * as _ from 'lodash';

import { InsisApiForActiveRequestHandlerRule } from '../insis-api-for-active-request-handler-rule/insis-api-for-active-request-handler-rule';
import { ActiveIntegration, IceType } from '@impeo/ice-core';

/**
 *
 */
export class InsisApiForActiveConditionalRequestHandlerRule extends InsisApiForActiveRequestHandlerRule {
  //
  //
  protected getActiveIntegration(): ActiveIntegration {
    const conditionElement = this.requireElement('conditionElement');
    const conditionValue = IceType.sanitizeValueToElementType(
      this.requireParam('conditionValue'),
      conditionElement
    );
    const value = conditionElement.getValue().forIndex(null);
    let activeIntegrationName = this.requireParam('activeIntegration');
    if (value !== conditionValue)
      activeIntegrationName = this.requireParam('elseActiveIntegration');
    return this.iceModel.integrations[activeIntegrationName] as ActiveIntegration;
  }
}
