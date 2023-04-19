import { ComponentRule, IceElement, IceType, IndexedValue } from '@impeo/ice-core';
import * as _ from 'lodash';

//
//
export class InsisConditionalComponentRule extends ComponentRule {
  private conditionElement: IceElement;

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
    const conditionValue = IceType.sanitizeValueToElementType(
      this.requireParam('conditionValue'),
      this.conditionElement
    );

    index = IndexedValue.sliceIndexToElementLevel(this.conditionElement.name, index);
    const value = this.conditionElement.getValue().forIndex(index);

    return value === conditionValue
      ? this.recipe['conditionComponent']
      : this.recipe['elseComponent'];
  }

  //
  //
  private initialize() {
    if (this.conditionElement) return;

    this.conditionElement = this.requireElement('conditionElement');
    this.triggerReevaluationOnElementsChange([this.conditionElement]);
  }
}
