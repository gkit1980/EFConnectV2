import { ValueRule } from '@impeo/ice-core';
import { last } from 'lodash';

//
//
export class ArrayItemIndexValueRule extends ValueRule {
  //
  //
  public getValue(index: number[] | null): any {
    const indexing = this.requireParam('indexing');

    if (index == null || index.length === 0) return null;

    let itemIndex = last(index);

    if (indexing === 'one-based') itemIndex++;

    return itemIndex;
  }
}
