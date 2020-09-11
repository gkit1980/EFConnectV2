import { IntegrationDataIn, IntegrationDataOut, IceConsole } from '@impeo/ice-core';
import { InsisRestCallExchangeRule } from '../insis-rest-call-exchange-rule/insis-rest-call-exchange-rule';
import { map, set, get } from 'lodash';

//
//
export class InsisRulesRestExchangeRule extends InsisRestCallExchangeRule {
  execute(request: IntegrationDataOut): any {
    const { queryId, ...filter } = request.params;
    if (!request.payload) {
      request.payload = {};
    }

    const payload = request.payload;
    const newPayload = {};

    // create global params
    const globalParams = Object.keys(get(payload, 'params', {})).map((paramName) => {
      const paramValue = get(payload, ['params', paramName], '');
      return this.createParam(paramName, paramValue);
    });

    if (globalParams.length) {
      set(newPayload, 'globalParameters.parameter', globalParams);
    }

    // craete rules params
    const rules = get(payload, 'rules', []).map((rule) => {
      const ruleObj = {
        code: get(rule, 'ruleRef'),
      };

      const params = Object.keys(get(rule, 'params', {})).map((paramName) => {
        const paramValue = get(rule, ['params', paramName], '');
        return this.createParam(paramName, paramValue);
      });

      set(ruleObj, 'parameters.parameter', params);
      return ruleObj;
    });

    set(newPayload, 'rules.ruleRef', rules);

    request.payload = newPayload;
    return super.execute(request);
  }

  protected buildResponseData(response: any): IntegrationDataIn {
    const data = super.buildResponseData(response);
    const { payload } = data;

    const rules = get(payload, 'results.ruleResult').map((ruleData) => {
      const outputParams = get(ruleData, 'outputParameters.parameter', []).reduce(
        (acc, current) => {
          acc[current.name] = current.content[0];
          return acc;
        },
        {}
      );

      return {
        ruleRef: get(ruleData, 'ruleRef.code'),
        status: get(ruleData, 'status'),
        message: get(ruleData, 'message'),
        outputParams,
      };
    });

    const hasErrorMessage = rules.filter((rule) => rule.message);
    if (hasErrorMessage.length) {
      throw new Error(get(hasErrorMessage, '0.message'));
    }

    data.payload = { rules };

    return data;
  }

  protected createParam(name, rawValue) {
    const value = this.getValue(rawValue);
    const type = this.getValueType(rawValue);
    return {
      content: [value],
      type,
      name,
    };
  }

  protected getValueType(value) {
    switch (typeof value) {
      case 'number':
        return 'java.math.BigDecimal';
    }
    return 'java.lang.String';
  }

  protected getValue(value) {
    switch (typeof value) {
      case 'boolean':
        return value ? 'Yes' : 'No';
    }

    return value.toString();
  }
}
