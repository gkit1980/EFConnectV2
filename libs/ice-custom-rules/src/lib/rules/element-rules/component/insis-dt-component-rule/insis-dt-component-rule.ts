import { ComponentRule, IndexedValue, IceDt } from '@impeo/ice-core';
import * as _ from 'lodash';

//
//
export class InsisDtComponentRule extends ComponentRule {
  private dt: IceDt;

  //
  //
  public getComponent(index: number[] | null): string {
    this.initialize();

    const component = this.resolveComponentRecipe(index);
    return _.isString(component) ? component : _.first(_.keys(component));
  }

  //
  //
  public getComponentRecipe(index: number[] | null): any {
    const component = this.resolveComponentRecipe(index);
    return _.isString(component) ? {} : component[this.getComponent(index)];
  }

  private resolveComponentRecipe(index: number[] | null) {
    index = IndexedValue.sliceIndexToElementLevel(this.element.name, index);

    const dtResult = this.dt.getOutputValue(this.recipe['output'], index);

    return dtResult ? this.recipe['conditionComponent'] : this.recipe['elseComponent'];
  }

  //
  //
  private initialize() {
    if (this.dt) return;
    this.dt = this.requireDt();
    this.triggerReevaluationOnElementsChange(this.dt.elements);
  }
}
