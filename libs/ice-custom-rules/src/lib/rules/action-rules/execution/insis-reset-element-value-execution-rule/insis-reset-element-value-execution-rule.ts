import { ExecutionRule, IceConsole } from '@impeo/ice-core';
import * as _ from 'lodash';

//
//
export class InsisResetElementValueExecutionRule extends ExecutionRule {
  //
  //
  async execute(actionContext: any): Promise<void> {
    _.forEach(this.recipe['elements'], (elementName) => {
      const element = this.iceModel.elements[elementName];
      if (!element) return IceConsole.warn(`no such element '${elementName}'`);
      if (!actionContext.index) element.reset(null);
      else element.reset(actionContext);
    });
  }
}
