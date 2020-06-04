import {
  RequestHandlerRule,
  IntegrationDataIn,
  IntegrationDataOut,
  IceEndpoint,
  ActiveIntegration,
  IntegrationElement,
  ApiIntegration,
  Validation
} from '@impeo/ice-core';
import * as _ from 'lodash';

/**
 *
 */
export class InsisApiForActiveRequestHandlerRule extends RequestHandlerRule {
  /**
   *
   * @param inData
   */
  async handleRequest(inData: IntegrationDataIn): Promise<IntegrationDataOut> {
    this.integration.transformation.handleInData(inData);
    const validationOutData = await this.validateDataModel();
    if (validationOutData != null) return validationOutData;

    const activeIntegration = this.getActiveIntegration();
    const insisRequestData = activeIntegration.transformation.buildOutData();
    const insisResponseData = await activeIntegration.executeExchange(insisRequestData);
    activeIntegration.transformation.handleInData(insisResponseData);
    return this.buildOutData();
  }

  /**
   *
   */
  getEndpoints(): IceEndpoint[] {
    console.log(
      `calling getEndpoints return route: ${this.requireParam(
        'endpoint.route'
      )} endpoint method: ${this.requireParam('endpoint.method')}`
    );
    return [
      new IceEndpoint(this.requireParam('endpoint.route'), [this.requireParam('endpoint.method')])
    ];
  }

  //
  //
  protected getActiveIntegration(): ActiveIntegration {
    return this.iceModel.integrations[this.requireParam('activeIntegration')] as ActiveIntegration;
  }

  //
  //
  protected async validateDataModel(): Promise<IntegrationDataOut> {
    const validation = new Validation(this.getIntegrationElements());
    await validation.validate();
    if (validation.isValid) {
      return null;
    } else {
      const outData = new IntegrationDataOut();
      _.set(outData.payload, 'valid', false);
      _.set(outData.payload, 'messages', validation.messages);
      return outData;
    }
  }

  //
  //
  private buildOutData(): IntegrationDataOut {
    if (this.hasMappings()) return this.integration.transformation.buildOutData();
    const outData = new IntegrationDataOut();
    outData.payload = this.context.dataModel.data;
    return outData;
  }

  //
  //
  private hasMappings(): boolean {
    if (
      _.get(
        this.integration.recipe,
        `transformation.${this.integration.transformation.ruleName}.out`
      ) != null
    )
      return true;
    if (
      _.get(
        this.integration.recipe,
        `transformation.${this.integration.transformation.ruleName}.extends`
      ) != null
    )
      return true;

    return false;
  }

  //
  //
  private getIntegrationElements(): IntegrationElement[] {
    let elements = _.values(this.iceModel.elements);
    if (this.recipe['bucket']) {
      elements = this.requireBucket(this.recipe['bucket']).getElements();
    }
    return _.map(elements, element => {
      return IntegrationElement.build(this.integration as ApiIntegration, element);
    });
  }
}
