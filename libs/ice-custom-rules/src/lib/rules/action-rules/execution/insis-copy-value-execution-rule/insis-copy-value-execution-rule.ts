import { ExecutionRule, IndexedValue, ValueOrigin, IceElement } from '@impeo/ice-core';

//
//
export class InsisCopyValueExecutionRule extends ExecutionRule {
  destElement: IceElement;
  //
  //
  async execute(actionContext?: any): Promise<any> {
    const sourceElement = this.requireElement('source');
    this.destElement = this.requireElement('destination');

    const index = actionContext != null && actionContext.index != null ? actionContext.index : null;

    const sourceValue = sourceElement.getValue().forIndex([index]);

    const destIndex = this.getDestinationIndex(index);

    this.destElement.setValue(
      new IndexedValue(this.destElement, sourceValue, destIndex, ValueOrigin.DATAMODEL)
    );
  }

  getDestinationIndex(index): number[] | null {
    const destinationIndexFormRecipe = this.getParam('destinationIndex');

    let destinationindex;

    destinationindex = String(destinationIndexFormRecipe)
      .split(',')
      .map((_index) => Number.parseInt(_index, 10))
      .filter((_index) => !isNaN(_index));

    destinationindex = destinationindex.length === 0 ? index : destinationindex;

    if (!destinationindex && this.destElement.isArrayItem()) {
      destinationindex = this.destElement.getValue().values.length - 1;
      destinationindex = [destinationindex];
    }

    return IndexedValue.sliceIndexToElementLevel(this.destElement.name, destinationindex);
  }
}
