import { ValueRule, IceConsole } from '@impeo/ice-core';

//
//
export class InsisSetForIndexesDefaultValueRule extends ValueRule {
  //
  //
  public getValue(index: number[] | null): any {
    if (!index) {
      IceConsole.warn(`Element '${this.element.name}' is not an array item`);
      return null;
    }

    const indexes = String(this.getParam('indexes'))
      .split(',')
      .map((_index) => Number.parseInt(_index, 10))
      .filter((_index) => !isNaN(_index));

    if (!indexes.includes(index[index.length - 1])) {
      if (this.element.type === 'boolean') return false;
      return null;
    }

    return this.getParam('value');
  }
}
