import {
  RequestHandlerRule,
  IntegrationDataIn,
  IntegrationDataOut,
  IceEndpoint,
  ActiveIntegration,
  ApiIntegration,
  Validation,
  IceAction,
  IceElement,
} from '@impeo/ice-core';
import * as _ from 'lodash';

/**
 *
 */
export class InsisApiForActionRequestHandlerRule extends RequestHandlerRule {
  /**
   *
   * @param inData
   */
  async handleRequest(inData: IntegrationDataIn): Promise<IntegrationDataOut> {
    this.integration.transformation.handleInData(inData);

    //validate
    const validationOutData = await this.validateDataModel();
    if (validationOutData != null) return validationOutData;

    //execute
    const action = this.getAction();
    await action.execute();

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
      new IceEndpoint(this.requireParam('endpoint.route'), [this.requireParam('endpoint.method')]),
    ];
  }

  //
  //
  protected getAction(): IceAction {
    return this.iceModel.actions[this.requireParam('action')] as IceAction;
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
  private getIntegrationElements(): IceElement[] {
    let elements = _.values(this.iceModel.elements);
    if (this.recipe['bucket']) {
      elements = this.requireBucket(this.recipe['bucket']).getElements();
    }
    return _.map(elements, (element) => {
      //return IntegrationElement.build(this.integration as ApiIntegration, element);
      return element;
    });
  }
}
